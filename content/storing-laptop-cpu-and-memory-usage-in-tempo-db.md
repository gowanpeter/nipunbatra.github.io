Title: Storing Laptop CPU and Memory Usage in Tempo-DB
Date: 2013-05-17 19:49
Author: nipunbatra
Tags: Python
Slug: storing-laptop-cpu-and-memory-usage-in-tempo-db
Category: Blog

Very often i deal with timeseries data and end up storing collected data
in MySQL. I have also used MongoDB a lot. This time decided to give
[Tempo-DB][] which is a timeseries database a try. The API is fairly
simple to use and within a couple of minutes one can publish data and
also visualize it with some basic statistics. The caveat is that the DB
is hosted on the cloud and available as a service over the internet. So
if you want to push some timeseries data real quick and visualize it,
Tempo-DB looks promising. In this post, i shall be pushing my CPU
percentage usage and free RAM (MB) to the DB i created. The code
follows:

    import datetime,psutil,time,pytz
    from tempodb import Client, DataPoint

    # Modify these with your credentials found at: http://tempo-db.com/manage/
    API_KEY = '*************************'
    API_SECRET = '**************************'
    TEMP_DATA = 'CPU Temperature'
    RAM_DATA = 'Available RAM'
    client = Client(API_KEY, API_SECRET)
    while True:
        timestamp=datetime.datetime.now(pytz.timezone('Asia/Kolkata'))
        client.write_key(TEMP_DATA,[DataPoint(timestamp,psutil.cpu_percent())])
        client.write_key(RAM_DATA,[DataPoint(timestamp,psutil.avail_phymem()/1000000)])
        time.sleep(1)

So within few LOC you can be up and running. The following screenshot
shows visualization for free RAM on my system.

![tempo](http://nipunbatra.files.wordpress.com/2013/05/tempo.png?w=660)

While i have not given querying a try, on initial looks Tempo-DB looks
promising. The [Features][] page on their site also mentions that query
time is independent of DB size and only dependent on the query size!

  [Tempo-DB]: https://tempo-db.com/
  [Features]: https://tempo-db.com/features/
