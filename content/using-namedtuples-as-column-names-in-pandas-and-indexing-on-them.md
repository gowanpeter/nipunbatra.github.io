Title: Using namedtuples as column names in Pandas and indexing on them
Date: 2013-12-15 11:07
Author: nipunbatra
Category: Blog
Tags: Python
Slug: using-namedtuples-as-column-names-in-pandas-and-indexing-on-them

Named tuples are interesting collection datatype in Python. They are
similar to regular Python tuple (and thus immutable), however, they
allow to **name** the tuple entries. This functionality makes them
similar to structures in C.

The following answer on Stack Overflow provide details about
namedtuples.

[What are “named tuples” in Python?][]

Now, let us explore namedtuples as column names in Pandas. The use case
comes from handling  datasets containing electricity information. In
terms of vectors, power has two orthogonal dimensions (real/active and
reactive). Let us explore this via an IPython session shown below.

	In [33]: from collections import namedtuple

	In [34]: measurement = namedtuple("measurement", ["physical_quantity",
	"type"])

	In [35]: power_active = measurement("power", "active")

	In [36]: power_active  
	Out[36]: measurement(physical_quantity="power", type="active")

	In [37]: power_active.  
	power_active.count power_active.index
	power_active.physical_quantity power_active.type

	In [37]: power_active.type  
	Out[37]: "active"

	In [38]: import pandas as pd

	In [39]: import numpy as np

	In [43]: df.columns  
	Out[43]: Index([(u"power", u"active")], dtype=object)

	In [44]: power_reactive = measurement("power", "reactive")

	In [45]: df =pd.DataFrame({power_active: np.random.randn(10),
	power_reactive: np.random.randn(10)})

	In [46]: df  
	Out[46]:  
	(power, active) (power, reactive)  
	0 0.766687 -0.514405  
	1 0.755576 0.064147  
	2 -0.652324 -0.356600  
	3 -0.685074 -0.806747  
	4 -0.611555 1.211177  
	5 -0.470568 -0.414123  
	6 0.666507 -0.657422  
	7 -0.062245 0.274607  
	8 -0.373324 -1.101033  
	9 1.811883 0.321797

	In [47]: df.columns  
	Out[47]: Index([(u"power", u"active"), (u"power", u"reactive")],
	dtype=object)

	In [59]: df[[col for col in df.columns if col.type =="active"]]  
	Out[59]:  
	(power, active)  
	0 0.766687  
	1 0.755576  
	2 -0.652324  
	3 -0.685074  
	4 -0.611555  
	5 -0.470568  
	6 0.666507  
	7 -0.062245  
	8 -0.373324  
	9 1.811883

	In [60]: df[[col for col in df.columns if col.physical_quantity ==
	"power"]]  
	Out[60]:  
	(power, active) (power, reactive)  
	0 0.766687 -0.514405  
	1 0.755576 0.064147  
	2 -0.652324 -0.356600  
	3 -0.685074 -0.806747  
	4 -0.611555 1.211177  
	5 -0.470568 -0.414123  
	6 0.666507 -0.657422  
	7 -0.062245 0.274607  
	8 -0.373324 -1.101033  
	9 1.811883 0.321797


In Line 3, we create the named tuple for "measurement". This has 2
attributes the physical quantity and the subtype.  
In Line 25, we create a dataframe with namedtuples for active and
reactive power as the column header.  
In Line 44, we select columns based on a condition on a "measurement"
field.

  [What are “named tuples” in Python?]: What%20are%20“named%20tuples”%20in%20Python?
