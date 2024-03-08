<!-- @format -->

# To remove © from the db

Our long-lived OpenLP database has lived through a wide variety of copyright symbol entry schemes. So sometimes two show on the display, sometimes one. This cleans the database without having to fix them individually in OpenLP.

> **Manipulating the database directly is a bad idea.**

> **Make sure you have a backup.**

In OpenLP File/Export/Song. Select them all. Save to a folder of your choice.

## Getting Ready

1. Download and install DB Browser for SQLite. Next through the install, make sure check the add shortcuts to program menu..
2. In OpenLP go to _Tools/Open Data Folder_ and note its location. Windows: `C:\Users\<username>\AppData\Roaming\openlp\data\songs\`
3. CLOSE OpenLP. Wait for it. Are you sure it's closed? Maybe check the Task Manager.
4. Go to that folder we just looked up and copy/paste a copy of the `songs.sqlite` file as backup.

## Let's get dangerous

5. Open DBBrowser and in the top menu bar click _Open Database_. Navigate to the folder and select `songs.sqlite`.
6. For fun, click over to the _Browse Data_ tab and in the _Table_ dropdown select your songs table. Look around at your songs table.
7. Go to _Execute SQL_ tab.
8. Enter the following line into the _SQL1_ window: `SELECT * FROM songs WHERE copyright LIKE '©%';`
9. Hit the _Execute_ button (blue play button)
10. Bottom window should says `Execution finshed without errors.` `Result X rows returned in Y ms.` Note the number of rows. Look at the rows and make sure it's the rows you wanted to change.
11. Delete the previous command in the _SQ1_ window and enter the following line into the _SQ1_ window: `UPDATE songs SET copyright = REPLACE(copyright, '©', '') WHERE copyright LIKE '©%';`
    It should return the same number of rows as the previous step.
12. Now we are going to remove any leading or trailing spaces.
13. elete the previous command in the _SQ1_ window and enter the following line into the _SQ1_ window: `SELECT TRIM(copyright)from songs;`

## That wasn't so bad

14. Switch over to _Browse Data_ tab and admire your cleaned copyright column.
15. Click _Write Changes_ button in the menu bar.
16. Close DB Browser. Discard the changes made to a new project file.

Open OpenLP and enjoy your non-duplicated copyright symbols.
