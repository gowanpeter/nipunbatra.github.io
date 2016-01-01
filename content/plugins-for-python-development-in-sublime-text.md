Title: Plugins for Python development in Sublime Text
Date: 2014-01-30 12:47
Author: nipunbatra
Tags: Python
Slug: plugins-for-python-development-in-sublime-text
Category: Blog

Recently, I was having a conversation with [Denzil][], comparing
[RStudio][] with IDEs supporting Python. We both felt that Python IDEs
are not that complete. Both of us and many other people developing
Python code run [Sublime Text][]. Sublime Text comes with a rich suite
of user written plugins. In this post, I highlight some of the plugins
which I have currently installed and have been helpful in Python
development.

-   [AutoPep8][]: "Code is read more often than it is written". Sticking
    to PEP8 does help. This plugin helps you to automatically convert
    your code to PEP8. I have modified the default behavior and AutoPEP8
    is triggered every time I save a file.
-   [SublimeCodeIntel][]: Intellisense + Lot more. Also shows up the
    docstrings for a function


-   [SublimeREPL][]: A full REPL inside Sublime Text. The biggest win is
    IPython! You can evaluate parts of code, selection, blocks, etc.
     just with a few keystrokes. The figure below shows an IPython
    session making a Matplotlib plot based on the code in the other
    panel. Before using this plugin, I would copy paste stuff into an
    IPython shell when I wanted to run bits of the code.

![auto complete](http://nipunbatra.files.wordpress.com/2014/01/auto_complete.png)

![plot](http://nipunbatra.files.wordpress.com/2014/01/plot.png)


 

 

  [Denzil]: http://correa.in/
  [RStudio]: http://www.rstudio.com/
  [Sublime Text]: http://www.sublimetext.com/
  [AutoPep8]: https://github.com/wistful/SublimeAutoPEP8
  [SublimeCodeIntel]: http://sublimecodeintel.github.io/SublimeCodeIntel/
  [SublimeREPL]: https://github.com/wuub/SublimeREPL
 
  
