Title: Counting the number of 1's (binary set bits given a hex input)
Date: 2010-08-21 18:23
Author: nipunbatra
Category: Blog
Tags: algorithms
Slug: counting-the-number-of-1sbinary-set-bits-given-a-hex-input

Now this is one of the questions i was asked at one of the
interviews.For eg i have a string as "AAC8".  
Then it's equivalent binary would be :  
1010 1010 1010 1000  
And the number of 1's would be 7.  
Now a simple solution could be to store number of 1's for each
character. eg A:2,8:1 and so forth.  
But i was told to use lesser number of switch cases.So i found a
pattern amongst the number of 1's and the equivalent decimal number as:

    0:0
    1:1
    2:1
    3:2

    4:1
    5:2
    6:2
    7:3

    8:1
    9:2
    10:2
    11:2

    12:2
    13:3
    14:3
    15:4

Now a pattern emerged. Like we need to save only the first member of the
group in the switch.  
For eg. A i.e.10  
10/4=2  
Corresponding to 2 we store 1  
10%4=2  
Corresponding to 2 we store 1  
Therefore we add these two to get 2 as number of set bits in A.  
The C++ code follows.


    #include<iostream>
    using namespace std;

    int toDecimal(char c)
        {
        if (c>='0' && c<='9')

        return (int)(c-'0');

        else

            return (c-'A'+10);

        }

    int noOfOnesGivenHex(char * hexString)
        {
            int i=0;
            int ans=0;
            while(hexString[i]!='')
                {
                    switch(toDecimal(hexString[i])/4)
                        {
                            case 0:
                            ans+=0;
                            break;
                            case 1:
                            ans+=1;
                            break;
                            case 2:
                            ans+=1;
                            break;
                            case 3:
                            ans+=2;
                        }
                        //cout<<toDecimal(hexString[i])%4;
                    switch(toDecimal(hexString[i])%4)
                        {
                            case 0:
                            ans+=0;
                            break;
                            case 1:
                            ans+=1;
                            break;
                            case 2:
                            ans+=1;
                            break;
                            case 3:
                            ans+=2;
                        }
                    i+=1;

                }
            return ans;
        }

    int main()
        {


            cout<<noOfOnesGivenHex("AAC8");
            return 0;
        }

There has to be some better way of doing this,maybe without a switch
case.
