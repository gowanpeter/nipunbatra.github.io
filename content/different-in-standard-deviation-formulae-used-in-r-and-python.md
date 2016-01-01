Title: Different standard deviation formulae used in R and Python
Date: 2014-03-06 18:11
Author: nipunbatra
Tags: Python, R
Slug: different-in-standard-deviation-formulae-used-in-r-and-python
Category: Blog

Let us create the same arrays in both the languages and calculate their
standard deviations.

**Python**

	In [78]: a = np.array(range(10))

	In [79]: a  
	Out[79]: array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

	In [80]: np.std(a)  
	Out[80]: 2.8722813232690143


**R**

  
	\> a\<-c(0:9)  
	\> a  
	[1] 0 1 2 3 4 5 6 7 8 9  
	\> sd(a)  
	[1] 3.02765  
	

Wondering why the different results? This is due to the difference in
formulae being used in the different implementation. 

The following [link][] <span style="line-height:1.5em;">contains more
information explaining the differences between the two formulae (which
differ ever so slightly)</span>



The **Population** Standard Deviation:

{% img http://www.mi2f.com/m/data/images/standard-deviation-formula.gif [7] %}


The **Sample** Standard Deviation: 

{% img http://www.mathsisfun.com/data/images/standard-deviation-sample.gif [7] %}

In R the latter formula is used, whereas in the NumPy implementation,
the former is used.

  [link]: http://www.mathsisfun.com/data/standard-deviation-formulas.html
  
