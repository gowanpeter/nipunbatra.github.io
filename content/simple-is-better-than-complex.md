Title: Simple is better than complex.
Date: 2013-05-10 19:22
Author: nipunbatra
Tags: Python
Slug: simple-is-better-than-complex
Category: Blog

You would have read this on the Zen of Python. Going through Wes' book
on Data Analysis in Python, encountered a recipe showing exactly the
same.

The problem is a classic one. Creating counts of attributes using
dictionaries.

    def counts_1(sequence):
        counts={}
        for i in sequence:
            if i in counts:
                counts[i] +=1
            else:
                counts[i]=1
        return counts

And the cleaner version making use of DefaultDict

    def counts_2(sequence):
        counts=defaultdict(int)
        for i in sequence:
            counts[i] +=1 
        return counts

Simpler, more elegant, less branching!
