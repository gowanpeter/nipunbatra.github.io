Title: ProjectEuler Prob 97
Date: 2010-01-31 13:21
Author: nipunbatra
Category: Blog
Tags: algorithms, Python
Slug: projecteuler-prob-97

Now since i learnt about the modular exponentiation technique it's been
easier to solve otherwise difficult questions on Spoj and on project
euler.Now this problem would otherwise take a lot of time to be
evaluated using standard techniques.But i was able to solve it within
the blink of an eye. Here is what the problem states:
28433\*2\^7830457+1.  
Find the last ten digits of this prime number,  
Here is my Python code for the same.

    def modeexp(x,y):
        if y==0:
            return 1
        z=modeexp(x,int(y/2))
        if y%2==0:
           return (z*z)%10000000000
        else :
           return (x*(z*z))%10000000000

    x=2
    y=7830457
    c=int(modeexp(x,y))
    d=(c*28433+1)%10000000000
    print d

Hope using this technique i am able to do those problems which earlier
gave me a headache.
