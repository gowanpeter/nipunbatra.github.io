Title: Let Python brighten up your desktop
Date: 2011-02-19 13:13
Author: nipunbatra
Category: Blog
Tags: Python
Slug: let-python-brighten-up-your-desktop

Wanna control your laptop brightness using Python? It ain't that
difficult. Having found a lot of guides on how to do it from shell it
wasn't that difficult to let Python do it for me. Let us get to the code
straight away.  
**NB**Not sure how to do this on Windows,would like to know the same
from the readers.

    import subprocess
    subprocess.call(["sudo chown $USERNAME:$USERNAME /proc/acpi/video/VGA/LCD/brightness"],shell=True)
    subprocess.call([" echo -n 50 > /proc/acpi/video/VGA/LCD/brightness"],shell=True)

Now what may come to your mind is whether we can give any value to the
brightness figure. This ain't true. Only certain levels are allowed. One
may navigate down to /proc/....and use "cat" command to figure out the
levels. On my system they are as:

    levels: 10 25 35 50 60 75 90 100

Let us let Python do the needful for us.

    import subprocess
    subprocess.call(["sudo chown $USERNAME:$USERNAME /proc/acpi/video/VGA/LCD/brightness"],shell=True)
    files = open('/proc/acpi/video/VGA/LCD/brightness','r+')
    print files.read()

Ain't it easy!!
