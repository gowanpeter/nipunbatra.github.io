Title: Pandas: Reading CSV with Unix timestamps and converting to local timezone
Date: 2013-06-07 07:51
Author: nipunbatra
Tags: Python
Slug: pandas-reading-csv-with-unix-timestamps-and-converting-to-local-timezone
Category: Blog

In this post we shall learn how to use pandas to analyse timeseries CSV
data with epoch based timestamps. Epoch timestamp represent the number
of seconds since Jan 1, 1970 and are commonly used for data recording in
many scientific applications. Unix command date can be used to give the
current time and we can also extract the current epoch timestamp as
follows:

    !date

    Thu Jun  6 09:01:16 IST 2013

    !date +%s

    1370489477

We now create a dummy dataset using pandas containing 10 rows and 2
columns and save it locally as a CSV.

    import pandas as pd
    print pd.__version__
    import datetime,time
    from pandas import DataFrame
    import numpy as np

    0.11.0

    start_time=int(time.time())
    timestamp=start_time+np.arange(10)
    column_1=np.random.rand(10)
    column_2=np.random.rand(10)
    df=DataFrame({'timestamp':timestamp,'column_1':column_1,'column_2':column_2})
    df

        column_1    column_2    timestamp
    0   0.620274    0.720347    1370489479
    1   0.603379    0.214927    1370489480
    2   0.508877    0.562860    1370489481
    3   0.236682    0.062259    1370489482
    4   0.923264    0.278048    1370489483
    5   0.105673    0.246425    1370489484
    6   0.204324    0.770854    1370489485
    7   0.206739    0.702672    1370489486
    8   0.180858    0.440023    1370489487
    9   0.269232    0.684387    1370489488

Saving the dataframe into a CSV file.

    df.to_csv('epoch_demo.csv',index=False)
    !cat epoch_demo.csv

    column_1,column_2,timestamp
    0.6202741436145147,0.7203473783163402,1370489479
    0.603378652829255,0.2149274411077019,1370489480
    0.5088772165417312,0.5628600230105181,1370489481
    0.23668184075365228,0.062259281774838415,1370489482
    0.923263574664376,0.27804805708797475,1370489483
    0.10567266566500166,0.24642510043158228,1370489484
    0.20432401714102266,0.7708544521037892,1370489485
    0.20673911644596843,0.7026719669208518,1370489486
    0.1808583958327319,0.4400233442122533,1370489487
    0.2692318429010231,0.684387368168343,1370489488

     
    df_2=pd.read_csv('epoch_demo.csv',index_col=2)
    df_2

        column_1    column_2
    timestamp       
    1370489479  0.620274    0.720347
    1370489480  0.603379    0.214927
    1370489481  0.508877    0.562860
    1370489482  0.236682    0.062259
    1370489483  0.923264    0.278048
    1370489484  0.105673    0.246425
    1370489485  0.204324    0.770854
    1370489486  0.206739    0.702672
    1370489487  0.180858    0.440023
    1370489488  0.269232    0.684387

We can notice that currently the index is of integer type. To convert it
into DateTime type we use to\_datetime() function, which accepts time in
nanoseconds.  
1 second=10\^9 nanoseconds

    df_2.index=pd.to_datetime((df_2.index.values*1e9).astype(int))
    df_2

        column_1    column_2
    2013-06-06 03:31:19     0.620274    0.720347
    2013-06-06 03:31:20     0.603379    0.214927
    2013-06-06 03:31:21     0.508877    0.562860
    2013-06-06 03:31:22     0.236682    0.062259
    2013-06-06 03:31:23     0.923264    0.278048
    2013-06-06 03:31:24     0.105673    0.246425
    2013-06-06 03:31:25     0.204324    0.770854
    2013-06-06 03:31:26     0.206739    0.702672
    2013-06-06 03:31:27     0.180858    0.440023
    2013-06-06 03:31:28     0.269232    0.684387

    df_2.index


    [2013-06-06 03:31:19, ..., 2013-06-06 03:31:28]
    Length: 10, Freq: None, Timezone: None

However, now we can see that the time is lagging the current local time
and the index does not yet have an associated timezone. Thus, we first
put the index in UTC to associate a timezone and then localize with our
timezone (Asia/Kolkata) in our case.

    df_2.index=df_2.index.tz_localize('UTC').tz_convert('Asia/Kolkata')
    df_2

                                     column_1   column_2
    2013-06-06 09:01:19+05:30   0.620274    0.720347
    2013-06-06 09:01:20+05:30   0.603379    0.214927
    2013-06-06 09:01:21+05:30   0.508877    0.562860
    2013-06-06 09:01:22+05:30   0.236682    0.062259
    2013-06-06 09:01:23+05:30   0.923264    0.278048
    2013-06-06 09:01:24+05:30   0.105673    0.246425
    2013-06-06 09:01:25+05:30   0.204324    0.770854
    2013-06-06 09:01:26+05:30   0.206739    0.702672
    2013-06-06 09:01:27+05:30   0.180858    0.440023
    2013-06-06 09:01:28+05:30   0.269232    0.684387

    df_2.index


    [2013-06-06 09:01:19, ..., 2013-06-06 09:01:28]
    Length: 10, Freq: None, Timezone: Asia/Kolkata

So, we are done finally. Read the CSV and converted the datetime index
into our local timezone.

References  
https://github.com/pydata/pandas/issues/3757  
https://github.com/pydata/pandas/issues/3746
