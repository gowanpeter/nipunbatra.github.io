Title: Kronecker Product in Python
Date: 2013-05-07 21:28
Author: nipunbatra
Category: Blog
Tags: Linear Algebra, Python
Slug: kronecker-product-in-python

While developing [code][] for Hidden Markov Models in Python, i had to
do a particular type of matrix multiplication. Unfortunately i did not
know what it was called. So here's what you are supposed to do: Given a
m X m and a n X n matrix you need to element wise multiply to produce a
mn X mn matrix. Here is an illustration of the same.

    Matrix X
    --------------
    x1 x2 x3
    x1| a b c
    x2| d e f
    x3| g h i

    Matrix Y
    --------------
    y1 y2
    y1| j k
    y2| l m

    Matrix Z (Output)
    ----------------------------------------
    x1y1 x1y2 x2y1 x2y2 x3y1 x3y2
    x1y1| aj ak bj bk cj ck
    x1y2| al am bl bm cl cm
    x2y1| dj dk ej ek fj fk

    .
    .

The code for the same is not that difficult to figure out once the
problem is worked on paper. The code is as follows:

    def transition_multiply(X,Y):
        num_rows_X=len(X)
        num_rows_Y=len(Y)
        out=[]
        count=0
        for i in range(num_rows_X):     
            for j in range(num_rows_Y):         
                out.append([])          
                for x in X[i]:
                     for y in Y[j]:                 
                         out[count].append(x*y)             
                count+=1
        return out

But i felt that the code was naive and being non vectorized it was going
to be very slow. So i asked about the same on [Stack Overflow][]. The
answer was short and simple, this multiplication technique is called
Kronecker product. NumPy routine **kron** would have sufficed. I am sure
the NumPy routine would be much more stable and quick!

  [code]: https://github.com/nipunreddevil/PyHMM
  [Stack Overflow]: http://stackoverflow.com/questions/16330971/efficiently-computing-element-wise-product-of-transition-matrices-mm-nn
