Title: Electricity transmission losses across the world
Date: 2014-02-23 14:28
Author: nipunbatra
Category: Blog
Tags: energy, nilm
Slug: electricity-transmission-losses-across-the-world

The following [webpage][] contains information for electricity
transmission losses around the world. I obtained the data and plot it on
a world map. The resultant plot is shown below. 

![Transmission losses](http://nipunbatra.files.wordpress.com/2014/02/losses.png)

The redder the country encoding, the more the losses. I am working on
the legend for the same. As expected, North America, Europe and
Australia have low transmission losses. Some parts of Asia and Africa
have high transmission losses. The script used to generate the plot
(inspired from the [following][]) is available below. The shapefile data
was downloaded from [here][].

[[ gist nipunreddevil:9168891 ]]

  [webpage]: http://data.worldbank.org/indicator/EG.ELC.LOSS.ZS
  [losses]: http://nipunbatra.files.wordpress.com/2014/02/losses.png?w=620
  [following]: https://github.com/matplotlib/basemap/blob/master/examples/fillstates.py
  [here]: http://geocommons.com/overlays/33578
