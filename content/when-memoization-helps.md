Title: When Memoization helps
Date: 2010-02-20 17:24
Author: nipunbatra
Category: Blog
Tags: algorithms, Python
Slug: when-memoization-helps


SPOJ has some intriguing problems and one such problem kept me stuck to
my laptop for hours. 
The link to the problem is :[here](http://www.spoj.pl/problems/NG0FRCTN/).
Now when i began i took a bottom up approach computing from 1 up till
maximum value reqd. 
This took me beyond the normal programming limits and i had to resort
to using vectors which I had not done before extensively.It took a long
time to code but alas it didnt work. Then I shifted the same algo to
Python. But even Python started complaining about memory usage. 
Now it was quite clear that this approach would fail. Thus recursion
had to be tried. But plain recursion would obviously get timed out. Then
I resorted to "memoization" in Python and wow it didnt complain and was
damn fast. But again SPOJ complained timing me out. A few optimizations
and still no respite,i shifted back to C++. 
This time I was forced to use STL again. This time for memoization and yipee i was able to get accepted this time. Though I
have the worst accepted time in C++. Wonder what algo others have used. 
Would be looking forward to knowing better ways of doing this problem. 
This is a wonderful problem and taught me many concepts. Sometimes it
pays to persevere.

