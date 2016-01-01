Title: Spell Checking in LaTeX
Date: 2013-07-08 18:59
Author: nipunbatra
Tags: latex
Slug: spell-checking-in-latex
Category: Blog

Very often one needs to do a spell check in LaTeX. This can ofcourse be
done in some text editor. I use TeXStudio IDE in Ubuntu, but
unfortunately it's spell checker was not picking up mistakes. So shifted
to command line and used the **aspell **utility. The utility has a CLI
and is very fast for editing! All one needs to do is to invoke

    aspell -t -c name_of_tex.tex

It can form a part of the LaTeX build workflow.

References

1. [Stack exchange question](http://tex.stackexchange.com/questions/42843/is-there-a-spell-check-package-for-latex)

2. [Wiki LaTeX tips](http://en.wikibooks.org/wiki/LaTeX/Tips_and_Tricks#Spell-checking_and_Word_Counting)



