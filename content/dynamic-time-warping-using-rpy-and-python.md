Title: Dynamic Time Warping using rpy and Python
Date: 2013-06-09 12:44
Author: nipunbatra
Category: Blog
Tags: Python, R
Slug: dynamic-time-warping-using-rpy-and-python

Dynamic Time Warping is a technique used for measuring similarity
between sequences. Since i deal mostly with time series data which is
essentially sequential, i had been told to give DTW a try. There are
numerous implementations of DTW, but i found the implementation in R to
be most complete. Since it has been a long time since i last used R
seriously and since i do most of my work in Python, i chose to use rpy2,
which is a bridge between R and Python. R has a lot of open source well
implemented code and rpy2 allows to leverage that while maintaining the
comfort of Python.  
In this post i download financial stock data from Yahoo finance and
leverage Pandas' libraries for the same. I also present results
comparing the implementation in R and in Python (mlpy).

Loading the data

    In [1]: from pandas.io.data import DataReader
    In [2]: from datetime import datetime
    In [3]: goog = DataReader("GOOG",  "yahoo", datetime(2000,1,1), datetime(2012,1,1))
    In [4]: goog
    Out[4]: 

    DatetimeIndex: 1857 entries, 2004-08-19 00:00:00 to 2011-12-30 00:00:00
    Data columns (total 6 columns):
    Open         1857  non-null values
    High         1857  non-null values
    Low          1857  non-null values
    Close        1857  non-null values
    Volume       1857  non-null values
    Adj Close    1857  non-null values
    dtypes: float64(5), int64(1)

Separating out data for the years 2008 and 2009 in different dataframes.

    In [8]: goog_2008=goog[goog.index.year==2008]
    In [9]: goog_2009=goog[goog.index.year==2009]

Plotting the "Volume" field of the two dataframes

    n [79]: goog_2008.Volume.plot(title="2008 Volume")
    Out[79]: 
    In [80]: goog_2009.Volume.plot(title="2009 Volume")
    Out[80]:

Here is how the data looks like  
![2008_title](http://nipunbatra.files.wordpress.com/2013/06/2008_title.png?w=300) 
![2009_title](http://nipunbatra.files.wordpress.com/2013/06/2009_title.png?w=300)

Importing stuff to make R work from within Python

    In [10]: import rpy2.robjects.numpy2ri
    In [11]: rpy2.robjects.numpy2ri.activate()
    In [12]: from rpy2.robjects.packages import importr
    In [13]: R = rpy2.robjects.r
    In [14]: DTW = importr('dtw')

Computing the alignment of the two sequences

    In [17]: alignment = R.dtw(goog_2008.Volume.values, goog_2009.Volume.values, keep=True)

Plotting the \`twoway\` and \`threeway\` type plot for the alignment
obtained.

    In [20]: R.plot(alignment,type="twoway");
    In [21]: R.plot(alignment,type="threeway");

![2way](http://nipunbatra.files.wordpress.com/2013/06/2way.png?w=285)

![3way](http://nipunbatra.files.wordpress.com/2013/06/3way.png?w=287)

Finding the distance between the two time series

    In [21]: dist = alignment.rx('distance')[0][0]
    In [22]: dist
    Out[22]: 417765600.0

Now, we try and do the same analysis using MlPy's DTW implementation.

    In [25]: import mlpy
    In [26]: import matplotlib.cm as cm
    In [27]: dist, cost, path = mlpy.dtw_std(goog_2008.Volume.values, goog_2009.Volume.values, dist_only=False)
    In [28]: dist
    Out[28]: 377532600.0

For some reason the distance obtained using the two implementation is
not the same. Next, we aim to draw the warped path.

    In [29]: fig = plt.figure(1)
    In [30]: ax = fig.add_subplot(111
    In [31]: plot1 = plt.imshow(cost.T, origin='lower', cmap=cm.gray, interpolation='nearest')
    In [32]: plot2 = plt.plot(path[0], path[1], 'w')
    In [33]: xlim = ax.set_xlim((-0.5, cost.shape[0]-0.5))
    In [34]: ylim = ax.set_ylim((-0.5, cost.shape[1]-0.5))
    In [35]: plt.draw()

![dtw\_mlpy](http://nipunbatra.files.wordpress.com/2013/06/dtw_mlpy.png?w=300)

Both the alignment diagrams look very similar, which is as expected.  
This is probably all that can be easily done using mlpy, since the
documentation is only a single page. Whereas R's DTW package is a lot
more feature and documentation rich.  
For example, we first plot the cost density plot. Again this can be
plotted using Matplotlib, but having the convenience of a method to do
it for you looks better!

    In [37]: R.plot(alignment,type="density");

![cost_density](http://nipunbatra.files.wordpress.com/2013/06/cost_density.png?w=287)

Also, now we can use "DTW" as similarity metric for computing distance
matrices. We can further use this distance matrix to perform clustering.
HClust inherently supports distance matrices.

    In [39]: distMatrix =R.dist(goog_2009.values, method="DTW")
    In [40]: distMatrix
    Out[40]: 

    [2557065.470000, 5629523.270000, 1768054.390000, ..., 81622.300000, 410006.360000, 491625.100000]

Performing hclust

    In [42]: hc =R.hclust(distMatrix, method="average")
    In [43]: R.plot(hc)
    Out[43]: rpy2.rinterface.NULL

The Dendogram produced was way too shabby to be included in this post,
so ommitted it.  
Takeaway:

-   R's DTW package has a lot more features and is well documented
-   It has inbuilt plotting features which make the plots intuitive
-   R can allow you to use DTW as a distance metric, which means it can
    be used in clustering approaches. This is on current action list
-   For  initial analysis, mlpy might also be very good
-   rpy2 is easy to use and really extends data mining in Python

What would be good to have

-   If Pandas would allow these operations natively on DataFrame
    objects. So we could easily play with more than 1 dimension. R code
    is GPL and has a significant chunk written in C. Not sure if that
    can be directly used in Python
-   Ability to use different distance metrics in different clustering
    implementations
-   More open source code from research community. Some publications do
    talk about DTW and finance and clustering, but absence of code ,
    makes it hard to reproduce the results
-   More Pandas documentation on fiddling with rpy2

References

1.  http://rdatamining.wordpress.com/2011/08/23/time-series-analysis-and-mining-with-r/
2.  http://stackoverflow.com/questions/5695388/dynamic-time-warping-in-python
3.  http://data-matters.blogspot.in/2008/07/simple-implementation-of-dtwdynamic.html
4.  http://mlpy.sourceforge.net/docs/3.4/dtw.html
5.  https://en.wikipedia.org/wiki/Dynamic\_time\_warping
6.  https://github.com/pydata/pandas/issues/3810
7.  http://www.jstatsoft.org/v31/i07/paper
8.  http://stat.ethz.ch/R-manual/R-patched/library/stats/html/hclust.html
9.  http://pandas.pydata.org/pandas-docs/dev/io.html

Caveat: I am pretty new to DTW and my analysis might be highly flawed.
Also the dataset used is only for demo purposes and may not be a good
one to illustrate the concept. A better dataset may be ECG data or some
of the applications mentioned in [7]

  
 