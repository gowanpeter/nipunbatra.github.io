Title: Avoiding thrashing by memory hungry Python programs
Date: 2014-01-01 11:35
Author: nipunbatra
Tags: nilm, Python
Slug: avoiding-thrashing-by-memory-hungry-python-programs
Category: Blog

While I was developing NILM algorithms for [NILM toolkit][], I
encountered OS thrashing and I had to restart my OS several times.
Thrashing occurs when your program runs out of RAM and the OS starts
allocating disk for the process's memory requirement. For the curious,
the algorithm which I was working on is called Factorial Hidden Markov
Model. [Here][] is the corresponding issue on Github.

I read a bit on setting memory limits for programs. Some relevant links
include:

1.  http://docs.python.org/2/library/resource.html
2.  http://stackoverflow.com/questions/1760025/limit-python-vm-memory
3.  http://stackoverflow.com/questions/4285185/python-memory-limit

Following is a tiny snippet illustrating the concept:  

	:::python
	import resource  
	megs=5  
	resource.setrlimit(resource.RLIMIT\_AS, (megs \* 1048576L, -1L))  
	for i in range(10000):  
		pass  

This program has a limit of 5 MB. Does it take more than that? Lets
try!  

	:::bash
	nipun@nipun-Satellite-L850:\~/Desktop\$ python test\_limit.py  
	Traceback (most recent call last):  
	File "test\_limit.py", line 4, in \<module\>  
	for i in range(10000):  
	MemoryError  
	Error in sys.excepthook:  
	Traceback (most recent call last):  
	File "/usr/lib/python2.7/dist-packages/apport\_python\_hook.py", line
	64, in apport\_excepthook  
	from apport.fileutils import likely\_packaged, get\_recent\_crashes  
	File "/usr/lib/python2.7/dist-packages/apport/\_\_init\_\_.py", line 5,
	in \<module\>  
	from apport.report import Report  
	File "/usr/lib/python2.7/dist-packages/apport/report.py", 	line 12, in
	\<module\>  
	import subprocess, tempfile, os.path, re, pwd, grp, os  
	MemoryError

	Original exception was:  
	Traceback (most recent call last):  
	File "test\_limit.py", line 4, in \<module\>  
	for i in range(10000):  
	MemoryError  


So a list of 10000 takes more than 5 MB in the Address Space and hence
the program throws an exception.

Aside, this may be a good time to test xrange() vs range() in terms of
memory requirement. I just modified the range() call to xrange() call in
the program and the program ran fine!

Clearly, when we just need to iterate, use xrange() over range() as the
latter creates a list in the Address space.  
Hopefully, no more restarts due to thrashing now!

  [NILM toolkit]: https://github.com/nilmtk/nilmtk
  [Here]: https://github.com/nilmtk/nilmtk/issues/67
