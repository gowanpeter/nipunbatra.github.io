Title: Revisiting Matt Might's 3 shell scripts  to improve your writing
Date: 2013-08-11 20:17
Author: nipunbatra
Tags: latex
Slug: revisiting-matt-mights-3-shell-scripts-to-improve-your-writing
Category: Blog

Having made extensive use, and greatly benefited by Matt Might's article
entitled -"3 shell scripts to improve your writing", i thought of
sharing how we can apply this same set of scripts on already published
work, available only as pdf. Maybe, it can help a reviewer! I use a
recent [2013 Mobisys paper][] for illustration.

Following are the required steps:

-   Convert pdf to text or HTML

    ```$ pdftotext MobiSys2013Auditeur.pdf```

or  

    $ pdftohtml MobiSys2013Auditeur.pdf  
    $ lynx -dump MobiSys2013Auditeur.html >> MobiSys2013Auditeur.txt

-   Remove non printable characters

<!-- -->

    perl -lpe s/[^[:print:]]+//g MobiSys2013Auditeur.txt >> clean.txt

-   Now using Matt's scripts (located in the same folder) to find
    lexical illusions

<!-- -->

    $ perl dups clean.txt       
    clean.txt:429 Space      
    clean.txt:552 soundlet       
    clean.txt:850 Mean       
    clean.txt:1630 two

This means that the following words have been used consecutively. Let us
analyze.  
The "Space" repetition is shown by the script due to our "hacky" method
of getting text from pdf. In the paper, Private Space and Public Space
are used in a figure.  
The other one is "soundlet". Now this happens to be a Java object
initialization: Soundlet soundlet and thus is perfectly fine.  
"Mean" also occurs twice in a figure. Again it is due to our flawed
hack!  
"two" occurs in the following sentence: "Vehicle Sense  
and Kitchen Sense are trained on samples collected from members of two
two-person families, and are tested on them separately in 3-5 hours long
experiments."  
So this is again not a lexical illusion. Good to go to finding weasel
words.

-   Checking weasel words

<!-- -->

    $ sh weasel clean.txt       
    88:Beyond just time, many developers do not have the necessary technical background to implement these functions correctly or efficiently. Because of this, there is a growing trend where smartphone         
    94:Smartphones have begun to use their microphones for various        
    144:Several salient features when taken in combination make Auditeur unique. First, Auditeur provides a simple yet powerful API       
    ...

I have only captured the top few suggestions. Going through the
suggestions, it seems that the writing is OK and the usage of words like
"many", "several" is justified.

-   Checking incorrect passive voice usage

<!-- -->

    $ sh passive clean.txt

Since the script suggested a lot of places where passive voice was used-
i just took a snapshot.

There might be some scope of improvement. Overall, the paper is very
well written! Extracting text out of pdf might create some problems.  
References  
1. [Matt Might's scripts][]  
2. [Creating a wordle from pdf][]- Plan to use this soon for generating
my wordle!

  [2013 Mobisys paper]: http://fredjiang.com/papers/MobiSys2013Auditeur.pdf
  [Matt Might's scripts]: http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/
  [Creating a wordle from pdf]: http://skipperkongen.dk/2011/09/07/creating-a-word-cloud-from-pdf-documents/
