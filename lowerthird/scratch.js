//store current slide type aka "plugin"

loadService: function(event) {

    $.getJSON("/api/service/list", function(data, status) {
    OpenLP.currentPlugin = "";
    OpenLP.nextSong = "";
    $("#notes").html("");

    for (idx in data.results.items) {
    idx = parseInt(idx, 10);
    if (data.results.items[idx]["selected"]) {

    OpenLP.currentPlugin = data.results.items[idx]["plugin"];
    }
    }
    }
};

updateSlide: function() {
if (

OpenLP.currentTheme || OpenLP.currentBlank || OpenLP.currentPlugin != "songs")

$("#currentslide").html("");

};