Title: Analysis with R part 3
Date: 2010-01-01 20:04
Author: nipunbatra
Category: Blog
Tags: R
Slug: analysis-with-r-part-3

Now it gets interesting.Comparing two subjects' marks in one plot will
be a much better analysis than simply studying them separately. 
So again with simple R stuff I was able to make a plot containing the
Maths and PEE marks of my batch and they are compared firstly on a
frequency polygon graph as shown in this image.

{% img http://nipunbatra.files.wordpress.com/2010/01/screenshot-8.png [7] %}


However this freq.plot reveals little(atleast to me).Thus a much better
comparison could be done using cumulative plots as shown in this
screenshot.

{% img http://nipunbatra.files.wordpress.com/2010/01/screenshot-9.png [7] %}


Now if you watch a lot of cricket this graph may provide you a false
lead.No,PEE wasn't more scoring than Maths. How? 
This plot was based on CDF,thus the Maths performance is better since
it lies lower(or rightwards)in the plot. 
Still confusing. Only a scatter plot can help now and here it
is.

{% img http://nipunbatra.files.wordpress.com/2010/01/screenshot-10.png [7] %}


Now it clearly shows that more people scored well in Maths than they
did in PEE(those above line y=x).
Those who scored better in PEE wrt their Maths scores lie below the y=x
line.
Conclusion:Maths in second sem was more scoring wrt PEE for our batch. 
Now it would be interesting to cut short all work using boxplot.Thus in
a simple command,boxplot depicting the performance of people in my batch
in all subjects is shown in the next figure. Quite clearly POM was a
disaster.One noticeable thing is that in Prog. There was little
difference in marks obtained by people getting 75 percentile wrt people
getting 25 percentile,when compared to other subjects.This plot also
depicts an outlier in Prog.Someone barely got 40.

{% img http://nipunbatra.files.wordpress.com/2010/01/screenshot-11.png [7] %}


  