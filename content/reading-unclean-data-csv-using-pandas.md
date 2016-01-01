Title: Reading 'unclean' data CSV using Pandas
Date: 2013-06-06 22:45
Author: nipunbatra
Tags: Python
Slug: reading-unclean-data-csv-using-pandas
Category: Blog

If you collect sensor data, you would know it comes with varieties of
noise, unclean stuff, different data types, strings interspersed with
numbers, missing data and so on!  
I encountered something similar while working on a real world problem.
So here i illustrate using a toy example on how to do the same using
Pandas. I use IPython shell throughout.

Customary Pandas import

    In [1]: import pandas as pd

    In [14]: print pd.__version__
    0.11.0

Here is how our unclean CSV looks. Note that the last row in the first
column, there is a string, whereas there should only be numeric data.

    In [2]: !cat test_bad.csv
    a,b
    1.1,3.1
    3.4,4,5
    5.6,6.2
    c3,7.2 

For reading the CSV,we need to add `error_bad_lines= True`, since we
wish bad lines to be ignored and CSV still be read.

    In [4]: df=pd.read_csv('test_bad.csv',error_bad_lines=False)
    Skipping line 3: expected 2 fields, saw 3

We now wish to see the data and type corresponding to 'a' column.

    In [7]: df.a
    Out[7]: 
    0    1.1
    1    5.6
    2     c3
    Name: a, dtype: object

Pandas automatically assigned `object` as the most valid datatype for
the series! Now, we don't want that. So, in the next step we tell it
explicitly use numeric type for this series.

    In [8]: df.a=df.a.convert_objects(convert_numeric=True)

    In [9]: df.a
    Out[9]: 
    0    1.1
    1    5.6
    2    NaN
    Name: a, dtype: float64

Much better! Now we can use the series and do all our maths on it!  
Ok, what if we knew beforehand that the whole dataframe should be
numeric. To our rescue, the DataFrame also like Series. Here is the code
for the same.

    In [12]: df=df.convert_objects(convert_numeric=True)

    In [13]: df
    Out[13]: 
         a    b
    0  1.1  3.1
    1  5.6  6.2
    2  NaN  7.2

References  
https://github.com/pydata/pandas/issues/3761

Special thanks to https://github.com/jreback for helping with this
trick.
