Title: iAWE data collected from Android phones
Date: 2014-02-26 17:02
Author: nipunbatra
Category: Blog
Tags: buildings, dataset, energy, iawe, india, nilmtk, Python
Slug: iawe-data-collected-from-android-phones

In the [previous post][], I had briefly discussed about the Android data
collected via FunF in the iAWE data set. In this post, I mention what
all data sources these Android data sets exposed. 
After the initial steps outlined before, I work in an IPython shell and
make different queries. 
<script src="https://gist.github.com/nipunreddevil/9226726.js"></script>

Now, we analyze each of the probes and create their respective CSVs.
Acceleromter  and location information(LocationProbe and
SimpleLocationProbe) are not of use since the phones were kept static.
Proxomity sensor did not capture any useful information.

**Cell Tower ** 
The cell tower probe provides the cell tower id (cid), location area
code and "psc" 

<script src="https://gist.github.com/nipunreddevil/ecd180672e187953ddd7.js"></script>
**WiFi**

<script src="https://gist.github.com/nipunreddevil/9227568.js"></script>

**Audio** 


<script src="https://gist.github.com/nipunreddevil/9227599.js"></script>

**Battery**

These features not only tell about the percent charge and some estimate
of the temperature, they also tell the status of charging. This can
provide information about power outages (when phone is discharging). 

<script src="https://gist.github.com/nipunreddevil/9227804.js"></script>


Apart from these, two Android phones which were used also had Light
sensor, whose details are as follows. The light sensor gives the light
intensity in lumens. 

**Light** 

<script src="https://gist.github.com/nipunreddevil/9227888.js"></script>


All the code can be found in the following repo:
https://github.com/nipunreddevil/iawe\_funf
I shall soon be adding this data set to iAWE data set contained here:
http://iawe.github.io

  [previous post]: http://nipunbatra.wordpress.com/2014/02/26/preparing-bluetooth-data-collected-from-funf-for-analysis/
