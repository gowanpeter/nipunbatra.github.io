Title: Swapping two numbers
Date: 2010-08-19 21:27
Author: nipunbatra
Category: Blog
Tags: algorithms
Slug: swapping-two-numbers

Found an interesting approach and have included it in the program,never
thought XOR to be so useful and simple.  
Now i would be interested to see how these methods compare on different
machines.

    #include
    using namespace std;
    void swapUsingExtraVariable(int *a,int *b)
        {
        int temp;
        temp=*a;
        *a=*b;
        *b=temp;
        }
    void swapUsingAddition(int *a,int *b)
        {
        *a=*a+*b;
        *b=*a-*b;
        *a=*a-*b;
        }
    void swapUsingXor(int *a,int *b)
        {
            *a=*a^*b;
            *b=*a^*b;
            *a=*a^*b;
        }
    int main()
        {
            int a=10;
            int b=20;
            swapUsingExtraVariable(&a,&b);
            swapUsingAddition(&a,&b);
            swapUsingXor(&a,&b);
            cout<<a<<"\t"<<b;
            return 0;
        }
