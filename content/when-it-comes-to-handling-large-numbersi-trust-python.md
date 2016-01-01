Title: When it comes to handling large numbers, i trust Python
Date: 2009-12-24 09:43
Author: nipunbatra
Category: Blog
Tags: algorithms, Python
Slug: when-it-comes-to-handling-large-numbersi-trust-python

Solving Project Euler's Prob 16, i decided to use Python, considering
the huge number involved. Now although using C would have been
faster,but at the cost of lots of code. A simple Python code did the
same for me. Problem statement:Finding number of digits in 2\^1000. Here
is the first solution.

    b=2
    i=1
    while i<1000:

        b=b*2
        i+=1
    sum=0
    print b
    while b:
        sum=sum+b%10
        b=b/10
        
    print sum

Now solution 2 requires even lesser coding. Have a look.

    sum=0
    b=2**1000
    while b:
        sum=sum+b%10
        b=b/10
        
    print sum

Ok, now this is child's play.

    print len(str(2**1000))

Will be looking forward to even more elegant solutions especially in
terms of algorithmic optimizations.
