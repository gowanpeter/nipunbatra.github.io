Title: Testing NILMTK combinatorial optimization algorithm
Date: 2014-08-03 16:11
Author: nipunbatra
Category: Blog
Tags: nilmtk
Slug: nilmtk-test-co


Since December last year, [Jack](http://www.jack-kelly.com/), [Oliver](http://blog.oliverparson.co.uk/) and I have been working on [nilmtk](http://nilmtk.github.io/). Our paper had been accepted at eEnergy 2014 and at NILM workshop. Since that, a lot of things have changed. Recently, [nilmtk v0.2](http://nilmtk.github.io/nilmtk/master/intro_nilmtk_v0_2.html) was released. It is designed keeping in mind OOPS principles and designed to handle large data sets. We are not there yet in porting everything which worked in v0.1 to v0.2. However, we do have a combinatorial optimisation (CO) based disaggregation algorithm working. In this post, I will cover the basics of CO based disaggregation, details of our implementation and most importantly how to write a test for this algorithm. I hope that this blog post will give an idea on contributing to nilmtk. 


### Problem statement
I'll define the problem with a vanilla example. Let us consider that we have only two appliances in our home- a refrigerator (fridge) and an air conditioner (AC). We monitor our mains electricity meter and want to tell which of these is on and consumes how much power at a given time. To makes our life simpler, we have appliance level sensors which measure the power consumed by fridge and AC. So, we divide our task into two stages- i) training, where we learn the features about the two appliances from their respective power data collected using appliance level meter, and ii) testing, where we use this learnt model to disaggregate the power consumed by these two appliances using only the mains power data.

### Combinatorial optimization based disaggregation
Let us assume that both fridge and AC are on-off devices, i.e., they are either on or off. Let us further assume that fridge consumes 0 W when off and 200 W when on and AC consumes 0 W when off and 1000 W when on. So, in total we can have 4 possible combinations of these two appliances in different states-

1. fridge off, AC off: combined power = 0 W
2. fridge off, AC on: combined power = 1000 W
3. fridge on, AC off: combined power = 200 W
4. fridge on, AC off: combined power = 1200 W

Now, let us assume that we observe 0 W at the mains meter level. This implies that both fridge and AC must be off. On similar lines, if we observe 1200 W on the mains, both these appliances must be on. So, our approach will try to find out the combination of appliances which generates the closest combined power to the measured power. You must be wondering, what our algorithm would generate if the mains power was 1100 W- in which case, the fridge can be predicted to be off (case 2 above) or on (case 4 above). This is an inherent shortcoming of the algorithm which we shall ignore for now.

### Training
So, the important question is how do we obtain the different numbers we previously discussed. We want to build a model for each appliance. For CO, the model consists of the power consumed in different states. We decided to use K-Means clustering to build our appliance models from the appliance level power data. However, during the course of our implementation, we figured that if the amount of data was large, clustering would take a long time and possibly give memory issues. We thus optimized our implementation using the following two tricks:

1. We added a default off state to each appliance and clustered data above 10 W. This reduced our data by a great amount.
2. Even after applying the first trick, we would occasionally blow out on memory. So, after a bit of investigation and expert [advise](http://sourceforge.net/p/scikit-learn/mailman/message/31731400/) from the scikit-learn community, we figured that we could subsample our data to approx. 2000 points and get almost the same results.

After applying these two tricks, our clustering is way quicker and we are able to generate models for different appliances. Our model may look something like:

```python
{"fridge":[0, 200],
"ac":[0, 1000]}
```

There are further details to choosing the optimum number of clusters, which I shall not discuss in this post. 

### Adding a test for CO correctness to nilmtk v0.2
Having discussed the expected behaviour of nilmtk, I would now discuss how to test the same. We would write a test case where we have two appliances- fridge and ac which consume 200 W and 1000 W respectively. We would test the four cases discussed above, and hope to get the same answers from nilmtk.

#### Step 1: Preparing the input data
nilmtk v0.2 requires the input data to be in a specific format. We shall need to do the following high level things.

1. Create a HDF5 store
2. Create pandas DataFrame for each meter (fridge, ac, mains)
3. Define minimal metadata for each meter (for instance, we have to tell that mains is the site_meter and that fridge and ac are sub meters of the same)
4. Store the data in the HDF5 store

Of the four, we shall focus on #2 for now. We need to create DataFrames for each meter. Initially, I decided to write just 4 cases - where each appliance can take on or off states. However, when I was testing this, I figured out that there is a bug in the current implementation. For data less than 100 points, [nilmtk does not even bother to disaggregate](https://github.com/nilmtk/nilmtk/issues/157). I also found that CO had some bad defaults and would [downsample data at time](https://github.com/nilmtk/nilmtk/issues/158) (without user discretion). These two bugs should be fixed pretty soon. The fact that trying to test out one function exposes more bugs is useful. This way one can contribute even more to the project and just shows the usefulness of unit testing. For now, I decided to overcome this limitation by repeating these 4 cases a 1000 times for each meter. I have provided the entire snippet of code I used to create this HDF5 file for testing CO. It sure looks big at the initial glance, but once you read slowly, you should be able to see the mapping between the four tasks I mentioned above. The complete file can be found [here](https://github.com/nilmtk/nilmtk/blob/master/nilmtk/tests/generate_test_data.py).


```python
def create_co_test_hdf5():
	# Bullet 1
    FILENAME = join(data_dir(), 'co_test.h5')

    # Bullet 2
    N_METERS = 3
    chunk = 1000
    N_PERIODS = 4 * chunk
    rng = pd.date_range('2012-01-01', freq='S', periods=N_PERIODS)

    dfs = OrderedDict()
    data = OrderedDict()

    # mains meter data
    data[1] = np.array([0, 200, 1000, 1200] * chunk)

    # appliance 1 data
    data[2] = np.array([0, 200, 0, 200] * chunk)

    # appliance 2 data
    data[3] = np.array([0, 0, 1000, 1000] * chunk)

    for i in range(1, 4):
        dfs[i] = pd.DataFrame(data=data[i], index=rng, dtype=np.float32,
                              columns=measurement_columns([('power', 'active')]))

    store = pd.HDFStore(FILENAME, 'w', complevel=9, complib='zlib')
    
    # Bullet 3
    elec_meter_metadata = {}
    for meter in range(1, N_METERS + 1):
        key = 'building1/elec/meter{:d}'.format(meter)
        print("Saving", key)
        store.put(key, dfs[meter], format='table')
        elec_meter_metadata[meter] = {
            'device_model': TEST_METER['model'],
            'submeter_of': 1,
            'data_location': key
        }

    # For mains meter, we need to specify that it is a site meter
    del elec_meter_metadata[1]['submeter_of']
    elec_meter_metadata[1]['site_meter'] = True

    # Save dataset-wide metadata
    store.root._v_attrs.metadata = {
        'meter_devices': {TEST_METER['model']: TEST_METER}}
    print(store.root._v_attrs.metadata)

    # Building metadata
    add_building_metadata(store, elec_meter_metadata)
    for key in store.keys():
        print(store[key])

    store.flush()
    store.close()
```

#### Step 2: Writing the unit test
The unit test is fairly simple. We need to do the following things:

1. Read in the nilmtk HDF5 file which we created previously.
2. Get the `elec` data from this HDF5
3. Train on `elec`
4. Disaggregate `mains` data and store in `output.h5`
5. Compare the contents to `output.h5` and the input file. Both should contain the same data.
6. Remove the `output.h5` once done. Done using the awesome [sh](http://amoffat.github.io/sh/) python module.

Following is the code for testing this out. The complete file can be found on nilmtk github [here](https://github.com/nilmtk/nilmtk/blob/master/nilmtk/tests/test_combinatorial_optimisation.py). 

```python
def test_co_correctness(self):
        elec = self.dataset.buildings[1].elec
        co = CombinatorialOptimisation()
        co.train(elec)
        mains = elec.mains()
        output = HDFDataStore('output.h5', 'w')
        co.disaggregate(mains, output, resample_seconds=1)

        for meter in range(2, 4):
            df1 = output.store.get('/building1/elec/meter{}'.format(meter))
            df2 = self.dataset.store.store.get(
                '/building1/elec/meter{}'.format(meter))

            self.assertEqual((df1 == df2).sum().values[0], len(df1.index))
            self.assertEqual(len(df1.index), len(df2.index))
        output.close()
        rm("output.h5")
```

I wouldn't say it was trivial. It also took some time to test the function out. But, it gives us more confidence that the algorithm is doing what it is supposed to do. We also found a bug in the code which could have given us trouble later. We now have a better code coverage. We are insured of changes to this algorithm which don't conform to the intended behaviour. Furthermore, I think this test may allow similar tests to be written for other nilm algorithms which we intend to add in nilmtk. As a developer wanting to contribute to nilmtk, this may be a good first step. Hope you found the post useful.
