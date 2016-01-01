Title: No. of possible paranthesisations
Date: 2010-08-22 18:30
Author: nipunbatra
Category: Blog
Tags: algorithms, cpp
Slug: no-of-possible-paranthesisations

Now this is a problem which we encounter while using matrix
multiplication in the most efficient manner.  
A simple problem on CodeChef wanted to give the possible number of
paranthesisations given the number of matrices.  
The recurrence relation

     P(n)=summation i from 1 to n-1 on P(i)*P(n-i)

would suffice.  
Now this evaluates to some expression in terms of combinations which
didnt work for me.  
Thus i used this recurrence relation along with memoization to get the
thing done.  
The code follows. A bottom up approach could also have been very
efficient.

    map intToFunction;

    int P(int n)
        {
            int r;
            if(n==1)
                {
                    return 1;
                }
            else{
                r=intToFunction[n];
                if(r==0)
                    {
                    int sum=0;
                    int k;
                    for(k=1;k<n;k++)
                    sum+=P(k)*P(n-k);

                    intToFunction[n]=sum;
                    r=sum;

                    }
                return r;
        }
        }
