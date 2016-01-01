Title: LaTeX and annoying errors
Date: 2013-06-11 12:24
Author: nipunbatra
Tags: latex
Slug: latex-and-annoying-errors
Category: Blog

While starting afresh on an IEEE template got the following error:

    ! Latex Error: Something's wrong--perhaps a missing \item

<p>
Needless to say, debugging these is not easy.  
Cause: Had not made a single call to

    cite

Doing that sufficed!
