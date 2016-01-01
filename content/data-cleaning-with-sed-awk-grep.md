Title: Data Cleaning with sed, awk, grep...
Date: 2013-06-15 16:24
Author: nipunbatra
Tags: Python, shell
Slug: data-cleaning-with-sed-awk-grep
Category: Blog

Being mostly a Python user, loathed using awk, sed,.. and did not feel
comfortable with them. But after spending a few hours in cleaning a file
and trying to do so wihtout using lower level stuff like reading a file
and stuff, i resorted to shell tools. The data cleaning process is
required due to the fact that data is collected from sensors and a lot
of reasons may cause it to have more characters, lines merged etc.  
Usually i collect data in CSV. Here is one such CSV whose head and tail
looks clean.

    $ head -n 4 data.csv
    1370500041.39,0
    1370500041.59,0
    1370500041.79,0
    1370500041.99,0

So the characteristics of a correct line are that it should have a
delimiter (","), the portion before the delimiter is epoch time obtained
in Python and is in seconds, the portion after the comma should be a 0
or a 1.  
While analysing data in Pandas i realized some of my lines had much
more characters than required. First lets count the number of lines in
the file. I used **wc** for this.

    $ wc -l < data.csv 
    3249743

Now we find lines which have more than 15 characters. Will use awk for
this.

    $  awk 'length>15' data.csv 
    13705051370503037.59,0
    13706751370672237.1,0
    1370744413.53,01370744236.88,0
    1370752771370751437.64,0
    137071370751438.98,0
    137079701370794636.9,0
    1370865773.91370863036.87,1
    1370914473.69,1370913437.91,0
    1371040575.321371039437.08,0
    1371198314.1371197837.01,0

So quiet a lot of lines which would have created trouble while parsing.
Removing these and finding the number of lines in the new cleaned file.

     $ awk 'length cleaned.csv
    $ wc -l < cleaned.csv
    3249733

Only 10 lines were creating havoc in analysis. Just checking now if
there is a comma in every line. Or finding all those lines where "," is
not in the file.

    $ grep -vn "," cleaned.csv

No output from this grep means that all the lines now contain a ","

Much more stuff can be done. But for now this much suffices. Need to
learn a bit of shell stuff as well!  
Python is not the universal solution!
