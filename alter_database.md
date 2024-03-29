<!-- @format -->

# To remove © from the songs db

Our long-lived OpenLP database has lived through a wide variety of copyright symbol entry schemes. So sometimes two show on the display, sometimes one. This cleans the database without having to fix them individually in OpenLP.

> **Manipulating the database directly is a bad idea.**

> **Make sure you have a backup.**

In OpenLP _File/Export/Song_. Select them all. Save to a folder of your choice.

## Getting Ready

1. Download and install [DB Browser for SQLite](https://sqlitebrowser.org/). Click next through the install, make sure check the add shortcuts to program menu.
2. In OpenLP go to _Tools/Open Data Folder_ and note its location. Windows: `C:\Users\<username>\AppData\Roaming\openlp\data\songs\`
3. CLOSE OpenLP. Wait for it. Are you sure it's closed? Maybe check the Task Manager.
4. Go to that folder we just looked up in _Tools/Open Data Folder_ and copy/paste a copy of the `songs.sqlite` file as backup.

## Let's get dangerous

5. Open DBBrowser and in the top menu bar click _Open Database_. Navigate to the data folder and select `songs.sqlite`.
6. For fun, click over to the _Browse Data_ tab and in the _Table_ dropdown select your songs table. Look around at your songs table.
7. Go to _Execute SQL_ tab.
8. To check we are connected and using the correct table, enter the following line into the _SQL1_ window: `SELECT * FROM songs WHERE copyright LIKE '©%';` This command gets selects every row from the SONGS table if the COPYRIGHT column has a © in it.
9. Click the _Execute_ button (blue play button)
10. Bottom window should say `Execution finshed without errors.` `Result X rows returned in Y ms.` Note the number of rows. Look at the rows and make sure it's the rows you wanted to change.
11. Remove the previous command in the _SQ1_ window and enter the following line into the _SQ1_ window: `UPDATE songs SET copyright = REPLACE(copyright, '©', '') WHERE copyright LIKE '©%';` This command updates COPYRIGHT column of the SONGS table by replacing every © with nothing.

    It should return the same number of rows as the previous step.

    Because some COPYRIGHT columns had © followed by a space, they now start with a space. Next we are going to remove any leading or trailing spaces in the COPYRIGHT column.

12. Delete the previous command in the _SQ1_ window and enter the following line into the _SQ1_ window: `SELECT TRIM(copyright)from songs;` This command deletes any leading or trailing spaces from the COPYRIGHT column of the SONGS table.

## That wasn't so bad

13. Switch over to _Browse Data_ tab and admire your cleaned copyright column.
14. Click _Write Changes_ button in the menu bar.
15. Close DB Browser. Discard the changes made to a new project file.
16. Optional: delete copy of `songs.sqlite` in _Tools/Open Data Folder_

Open OpenLP and enjoy your non-duplicated copyright symbols.
