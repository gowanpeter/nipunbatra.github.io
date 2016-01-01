Title: Prettifying Matplotlib plots
Date: 2013-05-12 15:32
Author: nipunbatra
Tags: Python
Slug: prettifying-matplotlib-plots
Category: Blog

I thought that by default Matplotlib plots look great. Not until i saw
the visualization [page][] on Pandas website and the plots in 
[Probabilistic Programming and Bayesian Methods for Hackers][]

I tried using the Matplotlib rc parameters used in the Probabilstic
Programming book.  The following code is used to illustrate the
difference.

    import matplotlib.pyplot as plt
    import numpy as np

Drawing plot with default rc parameters.

    x=np.arange(100)
    y=x*x
    z=x*x+10*x
    plt.plot(x,y,label='Y=x*x');
    plt.plot(x,z,label='Y=x*x+10*x');
    plt.title('Before');
    plt.legend();
    plt.plot();

Now opening the **rc** file and updating the rc parameters to be used
for the next plot.

    import json
    import requests
    s = requests.get("https://raw.github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/master/styles/bmh_matplotlibrc.json").json()
    matplotlib.rcParams.update(s)

Finally drawing the plot again with updated rc values. The difference is
vast and for the good. I would like to thank the original author who
posted this rc file. You can see the different properties we changed in
the rc file [here][].

{% img http://nipunbatra.files.wordpress.com/2013/05/prettify_matplotlib_fig_00.png [before] %}

{% img http://nipunbatra.files.wordpress.com/2013/05/prettify_matplotlib_fig_01.png [after] %}

  [page]: http://pandas.pydata.org/pandas-docs/stable/visualization.html
  [Probabilistic Programming and Bayesian Methods for Hackers]: http://nbviewer.ipython.org/urls/raw.github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/master/Chapter1_Introduction/Chapter1_Introduction.ipynb
  [here]: https://raw.github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/master/styles/bmh_matplotlibrc.json
