Title: For a change no Spiralling around
Date: 2009-12-23 10:02
Author: nipunbatra
Category: Blog
Tags: algorithms, Python
Slug: for-a-change-no-spiralling-around

Project euler problems can be tough and at times very tough and can get
your head spinning.Fortunately problem number 28 titled spirall...turned
out to be quiet an easy one.Here's my solution.If you have a better one
please do comment.Also using C has been a priority especially when i
read that scanf and printf are about thrice as fast as cout and cin.  

`#include int l_sum(int n)     {     if (n==1)         return 1;     else         return l_sum(n-2)+(n-2)*(n-2)+n*n;     } int r_sum(int n)     {     if (n==1)         return 1;     else         return r_sum(n-2)+((3*(n*n)+(n-2)*(n-2))/2);     } int main()     {`

printf("%d",l\_sum(1001)+r\_sum(1001)-1);  
}</code>
