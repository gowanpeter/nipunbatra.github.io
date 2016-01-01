Title: An interesting question-Where are the pigeons coming from?
Date: 2011-10-08 20:08
Author: nipunbatra
Category: Blog
Tags: algorithms
Slug: an-interesting-question-where-are-the-pigeons-coming-from

Assume that you are getting a continuous stream of data (ascii
characters). How best can you tell that there is a repetition in it.

Think........  
................

<p>
When i first heard it, i thought of making a hashmap, since only 128
such characters exist. And in O(n) i'll be able to report a repetition.
The easier answer:

    The moment the length of stream is greater than 128,there is a repetition. Pigeonhole principle! 
