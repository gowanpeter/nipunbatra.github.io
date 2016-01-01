Title: Plotting power consumption breakdown
Date: 2014-03-06 15:09
Author: nipunbatra
Tags: dataset, energy
Slug: plotting-power-consumption-breakdown
Category: Blog

Itemized billing or breaking down overall energy bill can be useful to
the end user to try and understand and subsequently optimize their
energy consumption. This forms the core of NILM research. In this post,
I use [nilmtk][] to preprocess [iAWE][] data set and plot itemized
energy consumption for a day, when ground truth is available. This
routine can also form an integral part of nilmtk soon, where the
disaggregated time series are plotted. We can see in the figure below
that a significant proportion of energy is unaccounted. This is due to
the fact that fans, lights, etc. were not instrumented owing to their
non-trivial setup. During the night time, the air conditioners are used
and heavily dominate the overall energy consumption. We can also observe
the periodic nature of refrigerator power consumption from this plot.

{% img ../../../images/nilm.png 300 %}

The following is the code used to generate the static plot.

[gist:id=9386190]

 

  [nilmtk]: https://github.com/nilmtk/nilmtk
  [iAWE]: http://iawe.github.io/
  [nilm]: http://nipunbatra.files.wordpress.com/2014/03/nilm.png?w=620
  
