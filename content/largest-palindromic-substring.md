Title: Largest palindromic substring
Date: 2010-08-21 16:22
Author: nipunbatra
Category: Blog
Tags: algorithms
Slug: largest-palindromic-substring

Now this is a question which my classmate Nikhil had asked. The best
solution to find a palindromic substring given a string.An example which
he cited was:
Longest Palindromic substring for abclevelabc is level


Thus i set trying to solve it.Here's a naive O(n^3) solution and i am
trying to figure out how to optimise this program after which will try
to find a better algo.

  
    char* substring(char*s,int start,int finish)
        {
            int ctr=0;
            char str[1000];
            while(start<=finish)
                {
                    str[ctr]=s[start];
                    start+=1;
                    ctr+=1;
                }
            str[ctr]='';
            return str;
        }

    bool isPalindrome(char *s)
        {
            int size=strlen(s);
            int j=size-1;
            int i=0;
            while((s[i]==s[j])&&(i=j)
            return true;
            else
            return false;
        }
    int main()
        {

            int i,j;
            char s[100];
            cin>>s;

            int size=strlen(s);
            int tempMax=size-1;
            while(tempMax>1)
            {
            for(i=0;i+tempMax<size;i++)
                {
                    if(isPalindrome(substring(s,i,i+tempMax)))//O(n)
                        {
                            puts(substring(s,i,i+tempMax));
                            cout<<" of size "<<tempMax<<"\n";
                            break;
                        }
                }
            tempMax-=1;
            }


            return 0;
        }
