Title: Preparing Bluetooth data collected from FunF for analysis
Date: 2014-02-26 12:16
Author: nipunbatra
Category: Blog
Tags: dataset
Slug: preparing-bluetooth-data-collected-from-funf-for-analysis

During the last summer, I undertook a deployment in a 3 person family
home in New Delhi. This led to the release of the Indian data for
ambient water and energy (iAWE). More details may be found on the [dataset page][] or on the [publication][].

As a part of the deployment, we also used 5 Android phones for
collecting data such as light, Bluetooth, cell towers etc. [FunF][]
stores data in encrypted sqlite db files. The steps involved in
preparing the data for analysis are outlined here. First, we need to
decrypt the contents (need to enter the password configured while
starting FunF). This is done via decrypt utility provided in [FunF analyze][]. Next, we merge these decrypted db files to a single
database. The following gist contains the code for doing the same.



<script src="https://gist.github.com/nipunreddevil/9224681.js"></script>

Next, we leverage Pandas to read this merged sqlite db file and perform
the following operations.

1.  Make a connection to SQLite DB
2.  Select timestamp, probe and value from the DB
3.  Filter data by bluetooth probe
4.  Make timestamp as index
5.  Convert the values from JSON to Python dict
6.  Extract RSSI, MAC and Name of Device from the above and store in the
    data frame
7.  Delete all other columns
8.  Save file to CSV

<script src="https://gist.github.com/nipunreddevil/9224575.js"></script>

The following is the list of names seen by this Android phone.

<script src="https://gist.github.com/nipunreddevil/9224722.js"></script>


Out of the following 4 belong to residents, whereas the remaining are of
visitors or of people from nearby homes. I will post these CSVs to the
data set page soon and will also post some initial analysis on this
data. The original merged DB file was 1.8 GB and this CSV is a mere 370
KB as a lot of redundant information has been removed.

 

  [data set page]: http://iawe.github.io/
  [publication]: https://dl.dropboxusercontent.com/u/75845627/buildsys_paper.pdf
  [FunF]: http://www.funf.org/journal.html
  [FunF analyze]: https://code.google.com/p/funf-open-sensing-framework/source/browse/?repo=samples&name=v0.4.x
