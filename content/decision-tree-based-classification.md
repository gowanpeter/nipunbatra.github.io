Title: Decision Tree based classification
Date: 2010-01-03 17:36
Author: nipunbatra
Category: Blog
Tags: R
Slug: decision-tree-based-classification

Now having done the descriptive analysis comes the more important task
of classification of data. What I did was created a decision tree model
of 4 subjects marks and using it predicted whether the 5th subject marks
are lesser or greater than 55 (POM explains the reason for lower
classification point).

I split my database into two, one for training containing 25 elements and
the other for testing containing 10 elements. 
Firstly I made a decision tree of depth 1 which looks like.

{% img http://nipunbatra.files.wordpress.com/2010/01/1.png [1] %}


In all these decision trees v4,..v7 means subject 1 through subject 4. 
Now this tree clearly uses subject 2(v5) for determining the class(\>
or \< than 55 marks for subject5). What it says is that all that who got
less than 68 in subject 2 got less than 55 with an accuracy of
84%(MCE=16%). 
When this fitting function was used on test data,it yielded a poor
performance of 50% prediction accuracy. So a deeper decision tree was
required. 
The next figure is a decision tree of depth 2.

{% img http://nipunbatra.files.wordpress.com/2010/01/2.png [2] %}


Now the prediction improved to 80% on test data and on training data it
was 92%. 
Still it could be improved.So next a decision tree of depth 3 was made
as shown in next figure.

{% img http://nipunbatra.files.wordpress.com/2010/01/3.png [3] %}


This did not improve the prediction capability on the test data though on
training data it obviously improved and was 96%. 
The final decision tree I made was of depth 4 which actually turned out
to be a case of overfitting. It is shown next.

{% img http://nipunbatra.files.wordpress.com/2010/01/4.png [4] %}


Thus the analysis using **binary greedy decision trees** revealed a
classification rule as per figure 3 or fig2 with an accuracy of 80% or
Misclassification error of 20%. 

**The above analysis was done using R**

