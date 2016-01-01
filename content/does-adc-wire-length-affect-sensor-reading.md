Title: Does ADC wire length affect sensor reading?
Date: 2014-03-01 19:07
Author: nipunbatra
Category: Blog
Tags: energy, Python, sensors, visualization
Slug: does-adc-wire-length-affect-sensor-reading

In our ISSNIP paper entitled "Experiences with Occupancy Based Building
Management Systems" ([pdf][], [slides][]), we had discussed about the
implications of wire length when used to measure ADC data. The setup is
as follows. Two neighboring faculty offices were connected to a common
microcontroller board and the room temperature, motion and door status
were captured. We interfaced the motion and door status sensor over GPIO
and temperature sensor over ADC. When we simultaneously analyzed the
temperature of the two rooms, we found that there is almost a constant
significant temperature delta amongst the two. We concluded that this is
due to the difference in wire length used for carrying the ADC signal.
As wire length increases, there is significant drop in voltage and hence
the assumed measured value. I plan to release the data set used in the
paper soon. 
The following code snippet analyzes the data and shows the difference.

<script src="https://gist.github.com/nipunreddevil/9289377.js"></script>

The static plot looks like the following. Room 2 had significantly
longer wire length and thus more signal drop!

{% img http://nipunbatra.files.wordpress.com/2014/03/temp_comparison.png %}



  [pdf]: http://nipunbatra.files.wordpress.com/2013/01/issnip.pdf
  [slides]: https://dl.dropboxusercontent.com/u/75845627/Nipun_Batra_IIIT.pptx
  
