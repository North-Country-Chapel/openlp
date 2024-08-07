/**
 * ***************************************************************************
 * OpenLP - Open Source Lyrics Projection                                      *
 * --------------------------------------------------------------------------- *
 * Copyright (c) 2008-2021 OpenLP Developers                                   *
 * --------------------------------------------------------------------------- *
 * This program is free software; you can redistribute it and/or modify it     *
 * under the terms of the GNU General Public License as published by the Free  *
 * Software Foundation; version 2 of the License.                              *
 *                                                                             *
 * This program is distributed in the hope that it will be useful, but WITHOUT *
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or       *
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for    *
 * more details.                                                               *
 *                                                                             *
 * You should have received a copy of the GNU General Public License along     *
 * with this program; if not, write to the Free Software Foundation, Inc., 59  *
 * Temple Place, Suite 330, Boston, MA 02111-1307 USA                          *
 * ****************************************************************************
 *
 * @format
 */
var hideSlide = false;

window.OpenLP = {
  reconnectInterval: 5000,
  // Connect to the OpenLP Remote WebSocket to get pushed updates
  myWebSocket: function (data, status) {
    const host = window.location.hostname;
    const websocket_port = 4317;
    var myTwelve;

    ws = new WebSocket(`ws://${host}:${websocket_port}`);
    ws.onmessage = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        data = JSON.parse(reader.result.toString()).results;
        // set some global var
        OpenLP.myTwelve = data.twelve;
        const state = JSON.parse(reader.result.toString()).results;

        //added ninja code here
        if (state.blank || state.theme || state.display) {
          // Run code to blank your stage view here
          // Instant blank: .hide() .show() instead of .fade
          $("#inside").fadeOut(500);
        } else {
          $("#inside").fadeIn(500);
        }
        // end ninja code

        if (
          OpenLP.currentItem != data.item ||
          OpenLP.currentService != data.service
        ) {
          OpenLP.currentItem = data.item;
          OpenLP.currentService = data.service;
          OpenLP.loadSlides();
        } else if (OpenLP.currentSlide != data.slide) {
          OpenLP.currentSlide = parseInt(data.slide, 10);
          OpenLP.updateSlide();
        }
        OpenLP.loadService();
      };
      reader.readAsText(event.data);
    };

    // ws.onopen = function (event) {
    //   console.log("WebSocket connected");
    //   $("#inside").hide();
    // };
    ws.onerror = function (event) {
      console.log("WebSocket connection error.", event);
      $("#inside").hide();
    };

    ws.onclose = function (event) {
      console.log("WebSocket connection closed.");
      $("#inside").hide();
      setTimeout(OpenLP.myWebSocket, OpenLP.reconnectInterval);
    };
  },

  loadService: function (event) {
    $.getJSON("/api/v2/service/items", function (data, status) {
      OpenLP.nextSong = "";
      $("#notes").html("");
      data.forEach(function (item, index, array) {
        //if (data.length > index + 1) {
        //console.log("next title");
        //console.log(data[index + 1].title);
        //};
        if (item.selected) {
          //console.log("notes");
          //console.log(item.notes)
          //$("#notes").html(item.notes).replace(/\n/g, "<br />");
          $("#notes").html(item.notes);
          if (data.length > index + 1) {
            OpenLP.nextSong = data[index + 1].title;
          } else {
            OpenLP.nextSong = "End of Service";
          }
        }
      });

      OpenLP.updateSlide();
    });
  },

  loadSlides: function (event) {
    $.getJSON("/api/v2/controller/live-items", function (data, status) {
      OpenLP.currentSlides = data.slides;
      OpenLP.currentSlide = 0;
      OpenLP.currentTags = Array();
      var div = $("#verseorder");
      div.html("");
      var tag = "";
      var tags = 0;
      var lastChange = 0;
      // These are the types of items you DO NOT want to show up. Adjust to your liking.
      // Choices are: songs, bibles, presentations, images, media, custom
      var dontWant = ["images", "presentations", "media"];

      //This is where we find out what type of item the current item is.
      //If data.name is in [dontWant array] set hideSlide to true. Will be used in updateSlides to hide/show.
      if ($.inArray(data.name, dontWant) != -1) {
        hideSlide = true;
      } else {
        hideSlide = false;
      }

      $.each(data.slides, function (idx, slide) {
        var prevtag = tag;
        tag = slide["tag"];
        if (tag != prevtag) {
          // If the tag has changed, add new one to the list
          lastChange = idx;
          tags = tags + 1;
          div.append("&nbsp;<span>");
          $("#verseorder span")
            .last()
            .attr("id", "tag" + tags)
            .text(tag);
        } else {
          if (
            slide["text"] == data.slides[lastChange]["text"] &&
            data.slides.length >= idx + (idx - lastChange)
          ) {
            // If the tag hasn't changed, check to see if the same verse
            // has been repeated consecutively. Note the verse may have been
            // split over several slides, so search through. If so, repeat the tag.
            var match = true;
            for (var idx2 = 0; idx2 < idx - lastChange; idx2++) {
              if (
                data.slides[lastChange + idx2]["text"] !=
                data.slides[idx + idx2]["text"]
              ) {
                match = false;
                break;
              }
            }
            if (match) {
              lastChange = idx;
              tags = tags + 1;
              div.append("&nbsp;<span>");
              $("#verseorder span")
                .last()
                .attr("id", "tag" + tags)
                .text(tag);
            }
          }
        }
        OpenLP.currentTags[idx] = tags;
        if (slide["selected"]) OpenLP.currentSlide = idx;
      });
      OpenLP.loadService();
    });
  },

  updateSlide: function () {
    // Show the current slide on top. Any trailing slides for the same verse
    // are shown too underneath in grey.
    // Then leave a blank line between following verses
    if (!OpenLP.currentSlides || OpenLP.currentSlides.length === 0) {
      console.error("No slides available for update.");
      $("#inside").hide();
      return;
    }
    $("#verseorder span").removeClass("currenttag");
    $("#tag" + OpenLP.currentTags[OpenLP.currentSlide]).addClass("currenttag");
    var slide = OpenLP.currentSlides[OpenLP.currentSlide];
    var text = " ";

    // Hides everything if hideSlide is true
    if (hideSlide == true) {
      $("#inside").hide();
    }

    // Do not show title if hideSlide is true
    if (hideSlide == true) {
      text = " ";
    } else {
      // use title if available
      if (slide["text"]) {
        text = slide["text"];
      } else {
        text = slide["title"];
      }
    }

    //use thumbnail if available
    // Don't comment this out if you want image thumbnails to show
    // if (slide["img"]) {
    //   text +=
    //     "<br /><img src='" +
    //     slide["img"].replace("//thumbnails//", "//thumbnails//") +
    //     "'><br />";
    // }

    // use notes if available
    if (slide["slide_notes"]) {
      text += "<br />" + slide["footer"];
    }
    // "slide_notes"
    text = text.replace(/\n/g, "<br />");
    $("#currentslide").html(text);
    text = "";

    // Use footer if available
    if (slide["footer"]) {
      text += "<br />" + slide["footer"];
    }
    text = text.replace(/\n/g, "<br >");
    $("#footer").html(text);
    text = "";

    if (OpenLP.currentSlide < OpenLP.currentSlides.length - 1) {
      for (
        var idx = OpenLP.currentSlide + 1;
        idx < OpenLP.currentSlides.length;
        idx++
      ) {
        if (OpenLP.currentTags[idx] != OpenLP.currentTags[idx - 1])
          text = text + '<p class="nextslide">';
        if (OpenLP.currentSlides[idx]["text"]) {
          text = text + OpenLP.currentSlides[idx]["text"];
        } else {
          text = text + OpenLP.currentSlides[idx]["title"];
        }
        if (OpenLP.currentTags[idx] != OpenLP.currentTags[idx - 1])
          text = text + "</p>";
        else text = text + "<br />";
      }
      text = text.replace(/\n/g, "<br />");
      $("#nextslide").html(text);
    } else {
      text =
        '<p class="nextslide">' +
        $("#next-text").val() +
        ": " +
        OpenLP.nextSong +
        "</p>";
      $("#nextslide").html(text);
    }
  },

  updateClock: function (data) {
    // get time from results
    var div = $("#clock");
    var t = new Date();
    var h = t.getHours();
    if (OpenLP.myTwelve && h > 12) h = h - 12;
    var m = t.getMinutes();
    if (m < 10) m = "0" + m + "";
    div.html(h + ":" + m);
  },
};
$.ajaxSetup({ cache: false });
setInterval("OpenLP.updateClock();", 500);
OpenLP.myWebSocket();
