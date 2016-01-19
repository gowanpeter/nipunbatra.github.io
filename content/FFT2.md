itle: FFT for dummies
Date: 2016-01-15 15:05
Author: Nipun Batra
Category: Blog
Tags: fft, Python
Slug: fft-2

We've all seen those weird looking mathematics equations that pop up when we hear about fast fourier transforms. In this blog post, we'll try and develop an intuitive understanding into the whole process. We'll try and decompose a signal into various contituent freqencies.

First, let us assume that we are doing some signal acquisition and we can sample at 100 Hz frequency (100 times per second). We collect data for 10 seconds. So, we have a total of 1000 samples. 

```python
Samples collection duration (T) = 10s
Sampling frequency (Fs) =100Hz
Number of samples (N) = Ts*Fs=1000
```

It must be noted that Fs is the rate at which we are able to sample. Let us now create a signal composed of different frequencies. 

### Code preliminaries


    import pandas as pd
    import numpy as np
    import matplotlib.pyplot as plt
    plt.style.use('fivethirtyeight')
    import warnings
    %matplotlib inline

Let us create a simple function to generate sine and cosine waves given the time for which samples were collected, the frequency of sampling and the frequency of the desired sine wave. 


    def create_sine(t, fs, frequency_of_sine):
        return np.sin(2*np.pi*frequency_of_sine*np.arange(0, t, 1./fs))
    def create_cosine(t, fs, frequency_of_cosine):
        return np.cos(2*np.pi*frequency_of_cosine*np.arange(0, t, 1./fs))

Let us now plot a sample sine wave of 1 Hz where our instrument can sample at 100 Hz and we acquire the data for 10 seconds.  


    plt.figure(figsize=(8,4))
    plt.plot(create_sine(10, 100, 1))
    plt.xlabel("Samples")
    plt.ylabel("Amplitude")




    <matplotlib.text.Text at 0x10f94e450>




![png](FFT_files/FFT_7_1.png)


Great! We can see 10 time periods of our sine wave in 10 seconds. Thus, our sine wave creation functin seems to be working correct :)

### Creating the signal for processing

We will now create our dummy signal. It will be composed of four sinusoidal sine waves of different frequencies: 0 Hz, (DC), 10 Hz, 2 Hz and 0.5 Hz.


    t = 10
    fs = 100
    N = t*fs
    num_components = 4
    
    components = np.zeros((num_components, N))
    components[0] = np.ones(N)
    components[1] = create_sine(t, fs, 10)
    components[2] = create_sine(t, fs, 2)
    components[3] = create_sine(t, fs, 0.5)


Plotting these four components individually.


    fig, ax  = plt.subplots(nrows=num_components, sharex=True, figsize=(12,6))
    for i in range(num_components):
        ax[i].plot(components[i])
        ax[i].set_ylim((-1.1, 1.1))
        ax[i].set_title('Component {}'.format(i))
        ax[i].set_ylabel("Amplitude")
    ax[num_components-1].set_xlabel("Samples")
    plt.tight_layout()


![png](FFT_files/FFT_13_0.png)


Let our signal be 

$$x = -0.5\times x_0 + 0.1\times x_1 + 0.2\times x_2 -0.4\times x_3 $$


    x = -0.5*components[0]+0.1*components[1]+0.2*components[2]-0.6*components[3]

Our dummy signal looks something like the following


    plt.plot(x)
    plt.xlabel("Samples")
    plt.ylabel("Amplitude")




    <matplotlib.text.Text at 0x111ce4390>




![png](FFT_files/FFT_17_1.png)


By looking at the data, we might be able to notice the presence of a signal which shows five periods in 10 seconds. Or, a signal of frequency 0.5 Hz. We can also guess the presence of high frequency signals.

### Introducing DFT

For finding the various frequency components in the signal, we'll be using the Discrete Fourier Transform (DFT). The key step in DFT is to find the `correlation` between cosine waves of different frequencies with the signal that we intend to process. A high amplitude of this `correlation` indicates the presence of this frequency in our signal. 

It must be noted that the definition of `correlation` is different from the definition we encounter in statistics. Here, `correlation` between two signals simply means the dot product between the two. Please note that the dot product is the sum of the element wise product between the two signals.

We will now try and see the `correlation` between our signal and a cosine wave of different frequencies. We also create small helper functions to create sine and cosine waves containing `k` periods in `N` sample points.


    def create_cosine_k_N(k, N):
        return np.cos((2*np.pi*k/N)*np.arange(N))
    def create_sine_k_N(k, N):
        return np.sin((2*np.pi*k/N)*np.arange(N))

We already know that our signal contains a 0.5 Hz component. This component would correspond to 5 time periods in 10 seconds (N=1000 sample points). Let us see the `correlation` between this cosine and our signal `x`. 


    cos_5 = create_cosine_k_N(5,N)
    plt.plot(x, label="x")
    plt.plot(cos_5, label="cosine (0.5Hz)")
    plt.plot(cos_5*x, label="cosine (0.5 Hz)*x")
    plt.title("Correlation={}".format(np.sum(cos_5*x)))
    plt.legend();


![png](FFT_files/FFT_23_0.png)


No! This correlation is so very low! But, wait a minute, how about `correlation` with the sine of the same frequency?


    sin_5 = create_sine_k_N(5,N)
    plt.plot(x, label="x")
    plt.plot(sin_5, label="sine (0.5Hz)")
    plt.plot(sin_5*x, label="sine (0.5 Hz)*x")
    plt.title("Correlation={}".format(np.sum(sin_5*x)))
    plt.legend();


![png](FFT_files/FFT_25_0.png)


Great! The correlation with a 0.5 Hz sinusoidal has a high amplitude. We're on to something now!
Yes, we want to detect the presence of a particular frequency and not really worry about phase for the moment. 

So, for each frequency that we find our correlation with the original signal, we can have two components- the correlation with the cosine (called the real component) and the correlation with the sine of that frequency (called the imaginary component). This is exactly what those weird looking DFT equations mean! A high absolute value of either of these components suggests the presence of that particular frequency in our signal. 

So, for every frequency in 0 to N-1 Hz, we repeat this procedure and obtain the DFT coefficients. Finally, the mathematics looks something like the following:

$ \mathrm{DFT(K)} = \sum{x_n\times \cos{\frac{2\pi K}{N}}} - \iota \sum{x_n\times \sin{\frac{2\pi K}{N}}} $

Let us repeat the procedure once again to find the presence of the 2 Hz component. For that we'll have to set K to 20. (2 Hz wave will complete 20 periods in 10 seconds).


    plt.figure(figsize=(12,4))
    sin_20 = create_sine_k_N(20,N)
    plt.plot(x, label="x")
    plt.plot(sin_20, label="sine (2 Hz)")
    plt.plot(sin_20*x, label="sine (2 Hz)*x")
    plt.title("Correlation={}".format(np.sum(sin_20*x)))
    plt.legend();


![png](FFT_files/FFT_28_0.png)


How about the DC component?


    plt.figure(figsize=(12,4))
    cos_0 = create_cosine_k_N(0,N)
    plt.plot(x, label="x")
    plt.plot(cos_0, label="cosine 0 Hz)")
    plt.plot(cos_0*x, label="cosine (0 Hz)*x")
    plt.title("Correlation={}".format(np.sum(cos_0*x)))
    plt.legend();


![png](FFT_files/FFT_30_0.png)


### Using numpy's DFT implementation

Now, instead of rolling out our own implementation of DFT, we'll use the efficient inbuilt numpy DFT implementation.


    fft_x = np.fft.fft(x)

So, the `fft` routine returns an array of length 1000, which is equal to the number of samples. This refers to the 1000 DFT coefficients, from K=0 to 999. But, from Nyquist criterion we know that only compnents upto fs/2 are useful. The remaining would be redundant. 


    len(fft_x)




    1000




    fft_x[0]




    (-499.99999999999977+0j)



The above was the DFT coefficient for K=0. It has two components (real and imaginary) arising from the cosine and the sine waves respectively. However, we are concerned with the amplitude of the signal. This can be done by considering the absolute value of these coefficients.

We will now plot the first 500 DFT coefficients.


    plt.plot(abs(fft_x)[:500])
    plt.xlim((-5, 500))
    plt.ylim((-5, 520))
    plt.xlabel("K")
    plt.ylabel("|DFT(K)|");


![png](FFT_files/FFT_38_0.png)


The above plot isn't focused enough to allow us to clearly see what's going on. So, let's restict the x axis to 120.


    plt.plot(abs(fft_x)[:500])
    plt.xlim((-5, 120))
    plt.ylim((-5, 520))
    plt.xlabel("K")
    plt.ylabel("|DFT(K)|");


![png](FFT_files/FFT_40_0.png)


Ok, at K=0, 5, 20, 100, we can see spike. Now, remember that K refers to the number of periods completed in N in 10 seconds. Thus, the frequencies correpsonding to these K are: 0 Hz, 0.5 Hz, 2 Hz and 10 Hz respectively. The above plot with frequency on the x-axis would look like the following.


    plt.plot(np.arange(0, 500)/10.,abs(fft_x)[:500])
    plt.xlim((-1, 12))
    plt.ylim((-5, 520))
    plt.xlabel("Freq(Hz)")
    plt.ylabel("|DFT(K)|");


![png](FFT_files/FFT_42_0.png)


### FFT of a square wave!

Can we construct a square wave from a combinations of sinusoids? Let us think the other way around. Can we decompose a square wave to get sine waves of different frequencies? Let us use our new friend's help


    sqr_wave = np.hstack([np.ones(250), np.zeros(250), np.ones(250), np.zeros(250)])


    plt.plot(sqr_wave)
    plt.ylim((-0.2,1.2));


![png](FFT_files/FFT_46_0.png)


The above is our square wave obtained under the same experimental setup as above- 100 Hz sampling for 10 seconds. Let us do a DFT on it and plot it.


    dft_sqr = np.fft.fft(sqr_wave)


    plt.plot(np.arange(0, 500)/10.,abs(dft_sqr)[:500])
    plt.xlim((-1, 12))
    plt.ylim((-5, 520))
    plt.xlabel("Freq(Hz)")
    plt.ylabel("|DFT(K)|");


![png](FFT_files/FFT_49_0.png)


### Taking a step further- DFT and STFT on Star wars sound


    !wget http://www.thesoundarchive.com/starwars/swvader01.wav

    --2016-01-14 19:41:30--  http://www.thesoundarchive.com/starwars/swvader01.wav
    Resolving www.thesoundarchive.com (www.thesoundarchive.com)... 64.85.5.170
    Connecting to www.thesoundarchive.com (www.thesoundarchive.com)|64.85.5.170|:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 46146 (45K) [audio/wav]
    Saving to: ‘swvader01.wav.1’
    
    swvader01.wav.1     100%[=====================>]  45.06K  34.6KB/s   in 1.3s   
    
    2016-01-14 19:41:32 (34.6 KB/s) - ‘swvader01.wav.1’ saved [46146/46146]
    



    from IPython.display import Audio


    Audio("swvader01.wav")





                <audio controls="controls" >
                    <source src="data:audio/x-wav;base64,UklGRjq0AABXQVZFZm10IBAAAAABAAEAIlYAACJWAAABAAgAZGF0YRa0AACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIB/gn+Bf3+Agn6BgICAgH+AgYCAf4GBf4CAgIF/gX9/gIGAgICBf3+AgYCAgH+Cf4CAgH+AgX+Bf4GAgIB/gYF/f4GAf4GAgH+BgYB/gICAgICAgICAgICAgX+AgICBf4CAgICAgICAgICBf4CAgIF/gICAf4KAgH+AgICAgIF/gICAgIF+gYCAgICAgX+Bf4CAgX+AgICAgIGAgIB/gICAgIF+gYF/gIF/gIF/gICAgICAgICBgH+AgIGAgH+Bf4CBf4CAgICAgX+AgX+BgIB/gICBf4F/gIF/gICBf4GAgH+Bf4GAgICAgIGAf4CAgX+AgH+BgICAf4CBf4CAgX+BgX+AgICAgICAgYB/gICBf4CAgICAgIB/gX6AgYCAgICBf4CAgICBgICAgICAgICAgYCAgH+Bf4CAf4CAgYB/gICAgH+Bf4F/gICAgICAf4GAf4GAf4CBf4GBgX+AgX6AgYCBgX+BgH+Af4GAgH+Af4B/gn+BgICAgIGAgYGBf4GAgH6AgICBf4GAgICBgH+Af4B/foCBf4CBf4CAf4J/gYCAgIB/gIB+gIB+gICBf4GBgICAgIB/gICAgH+BgYCAgICBgYCAgYCBgIF/gH+Bf4GBgIGAgYGBgH+Cf3+BfoCAf4CBf3+BgICAgICAgH+AgICAf3+BgIB/f4B/gH5/fn9+fn+AfoCAgYGAgoGBgoOBgoCBgH+Af4CAgICCgYKBgYGBf35/gH9/gYCBgoKCgoCDgYCAgIB/fX99fX58fn5+gX+BgYGBgYCBgICAgIB/gIB+gH+AgICBgIF/gIB/gIB/f39+gH+BgIKCg4ODgYGCgYCBgYGBf4CAfoF+gX+Af4GAgIGAf4B/f39+f4B/f4CAf4GAgIGAgH9/foB/f3+Af4B/f4CAgYCBgYF/gIF/gYCBgIGBgYGAgYGBgIF/gYGAgYGBgX+BgX+Af39/gH6AgH9/fn9+f4GBgYCBgoCCgYGCgIF/f35+fn5+f36Af4F/gYCBgYCAgH+AgICAgICAgoGBg4KCgoKCgYGBfoB+f31+fn1/foF/goKCgYODgYGAgH9/f35+foB+gH+Bf4F/gH+Af39/gH9/f4F/gYCBgoKBgoGBgYB/foCAf4GAgoKBgYGBgIKCgYGBf39+fn5/f4CBgIGBf4CBgYCAgIF/foB/f4CBf4F+gH1+fn19fn6AgIGBgYGAgYCAgICBgH+AfoB+f4CAgoSBhIKAgH9+f36Af4GAgYCAgYB/gYKChIKCgoGAf359fn5/gIGBgYN/gH+Af4B+f4F/gYB/gX9/gH+AgX+Af4CAf39+fX9+foGBgYGAgYGBgYKBgYGBgIB/gH5/gH+AgX9/f39/f4GAgX+Af4GBgYKCgIB/gH+AgoCAgH+AfX58f4CBg4KCgIKAgYKCgoOEgoF/fn9/f39+fHp7foGGhYWAfnx+gYOEhIB+f36AgYGAgIB/gICBgYCAf398fX19f4CCgYGAgICAg4KDgX59fn1/f35+f36AgYKBgYF/foCBgIKCf39+gIKDhoaGhISCg4GBfn57fHx8fX5+fX5/goGEg4KAfXx7fICBg4OCgIJ/foB/gYCCgIKCgX9/fXx+fX+CgYCCf3+Af4GCgYKAf3+Ag4iJhoJ5dnV7hImKhX94eX2GiouDe3l2e4KHhYR7dnV6gIWKiYR/e3h8foKEgH56en2ChoiCgHt9gYSHhIB6dnV7goWHhYSAf4GBgoCAf39+fnx7eXp7fX5/gYCCgYB/fXt9fX99fn9/gYGCgoKEhYeGg399ent+f4GBgIGChoaHhYWBhIOGiIaFf3t8gIOKioqDgX1+g4OFgn56e319gn9+enl8f4KAgXx4enp/f4F/fHx8fn+AgX58eXl6fX58enZzc3V7fX+BgH+ChYeHiIaGhoaHh4aDgH1/f4OEhYSCgoGEhYeHhIN/g4OIiYuJh4SDhoODgoF+f36AgYKCgIGBgH9+fn1/fHx4d3d3enp7fHx8gIOGhYaBfX18gIGAf39+fXp1c3V7ipSShnFgX3aTqKeMalNbe5+uoX9dUmiNqK2RblJTb5Gqp49xXmN5kaKdjXVsb4GVn5aEb2duhJiil4FrZG2BlZiOemxpdIONjIJ1cXaBiYmCc2ppdYWQkop9cm93g4yMhn13eICFhn91b3OBkJmajX5vcXuKlZeNgHZze4WJh4B6fISQlpGDcWdqe4+cnI57bGlygpGVjn9ya3B8houGeWtmanaDh4N3bGdrdoGHhX1ybGxxeH6BgH58e3l5e3t6fYGGiYmFf3lzdnyGjZGNhXx7fIaOkZGJhYOHjJKQjISAgYmLj4qAenqAipOUjoR4d3qDjpGPh354d3d9gIKEgoB/f4GAgH15dXRzd3l5eXZzcXN7h5OZlIBpU1FljrPAqHdBJTVrp83Ln2MzLlaRwsyudkIySX6zzb+RWjY9Zp/J0K12QjJLgbPPw5VfQEdsnbq7nnJUT2aIpKubeV5VZoWmtKmIYkxRcJW2uqB1UD9PdJy0sZNrU1Fni6Oomn5qZXaQoqORdWBdcY+stqqJZlNYcpSrrp1+YldheJKenpB+c3V9iI+KgXVxd4KNkIx9bWRodoeYl4t4ZVxda32LkIl5b2hocnuEhIF5c3FzdXh3d3RzcnuBhYaCfnVzcnd+hYmNioR8dnZ9h5acnJGCc290gpKdn5WIfHh+ipWamo+HfX6ChouKhICBho+WlY1/c3Bzgo+UlIZ3a2lue4iMjYJ7c25tcHR2eXx+fn94d3FxeYGMj4d3YVRbdJazuKJ1STE/a6HK0K92PiIzX5zJ1r2JUzI2Wo23y76WZkM8VX2nw8GkdUs5SXSjxsmreEk1SHSmxsandk09T3WcuLung2RQUmF4jpyjmYhxXFZZbISdrKqXfGZcZXWJmJ+ckYd/enl/g4mQkpSRioWAfH1+gYaJjZGTlY6EeXNvd4aVoaCYh3RkYml8kJ2floFrWFFab4qdnZB5Y1RSXXGBiouDeXJrZGJhaHOBjZGLemdVU1xvhJOXkYFvZ2RueoeTl5OKgnx7fIGHjpOUk5STj4uGhoiLkZSWlJGMiIeEhIWKjZCWl5KJgHd0eICMk5OLfnJoaG97hYmHfHBpaW54gIN/eHBtb3R8f313cW1weIaPlJOKd2RWVGWFqL/DqnxILjhimsfayZxiOC9Kdp23t6OIcmhqcHV2e4CIkJCIeW5qcH2JjId8cnJ5hpCQin5zbGxyfIWPlZSLemVWU2N7mKmnkXFZUGB3kZ2ci3tvb3Z/homNkJaYk4NxaXGGo7u+qolnWmOAobrAtpyCa2Vreoydqa6nmYNxaGh1hZOXkYV7d3Z5fXt4cnF0dXp4dHBsa2ttbW1sbnJ0eXhyaV9dX2Vsc3R1c3N0dnl7enh3dnl6f4KHhYR/en6Di5aYlI2Df3+KlJ2emY+HhYyTm56alYqKi42Pj4qIhYiMjpOOiH93cHB0fYWOkYyDdGhhYm9/io+GeWpcWmVyhI6QinxwaGZtd4KNjomAdG5ueYiZpKWcjH15e4OIjYqHiYyTm5uRf2tla3iJk5KHd2diZ3J8gn54cnR3fYKBe29kWl5lcYGOlZOGeGtiY2t3g4yOiYF7c3BvdH+LlZWMeWdZXW6Ho66njW9aV2eBmKWgi3VlZXGElZ6elo6GhImNkJCPjZKTmZ+dmpKOjJGVm5uYjoV+foCIjY+JhICCh4+TkIh6bWdodIGLjoh9cWdjYmZvd3x+enFiVEtLVGV4iY+KdmBLRUxccIGLioB3bmxtcnN0d3uAhIeFgnt3eIOTnaOlnpGEenZ9iZejqqihkH51eIiaq7Stm31oX2d6kKSrqp6LemtnaXWGlaGfkXtiVlZmfJCfnJJ9a15cXWFqdoSQmJOIdmZbX3GKoKifi3VhWWN1kKawqp2NgHl+ipaXjH9zcn2MmJeLdmFaYXmRnJeDbFtUXW1+h4WCdW9oZWlrdHyDgXpsYFlea3+OlI6BdnJ0e4KGh4OBgoOEg315d3mCiYmEfHZ1eoCDgXh1dn+PmZ2UhXRub32Om6Gel42Lh4eIi5GXn6KjnZSNh4mQlZaVk5GQkJGRjYqJiZCUl5SLfnhycXR4e3x+f4KAf3pwaWJhX2ZqcXNwbGVfXVtfZWpxb2tjXVdWWVxlbnJ2dXdzdXd2eXh2dnV4fYOKi4uKiIuPlpmalouDf4OLmJ+koJaQjY+Xn6OfmI2Ef3+DipCVm5ubl46FenFwdHuCiYqDe3Fub3iBh4mFenFqaW1zeHt+foCDhISAeXV1eoONk5OIe3V1f4yXnZmOgXd6g5CampOGfnl+hY+PiXtxa3B+iI2GdmNXVV9zgYV/b2BVVVtocnd4d3V1dHRwbXF1foSEgHVraG98jJmbl4p+dXN1e4GGhYF5c3F3f42ZnZiHdmhnb4CSn52QgHBrdIWWp66uoZKDeHZ9ipyqsrKllYmBhZCgqKmhlIeBfIGJkJWXlY+IgXdwbXN6g4iIg3htZ2dueYGDgndoXFRUWmZze3x2alxTT1RaY2lubWhlZGNma290d3ZybGdjaXCAi5OSiHpycnqIlZ6ckYR8fYeVo6+xraKWjoqMkpugpaahmpKNjY+RlZiamJWQi4R9dnd9g4uRjYV7dG9wdHh4c25oaW10eXt1c25ucXZ8fHx6enl5en17foGEiYyNioiFhYSGh4qNkpidnZmPgnp7gYyVk4p7b2lsd4KKjIR8cm1nZGNhZGlxdnhzbWVjZWxxcG5mYmJnbnV3dnh6gYmPin90bG57jJibk4NxbXF8i5aYmJGKg3lybW53hJWdoZmJfnd9ipmipJ+Ti4WGjJWcoaSinZeNh4eIkpealo+FgoSMmJ+flop7cnByeYKFioiEf3l0cXFxcnN0cHBvbW5wbnJxc3J0cm5pZF9gYmVpZ2ViXl9hZWpsaWhmZGVmaGltcXd8goWFg4GAg4WLjY2Mi42Qk5qen56enZ2goqWkoZuXk5SXnaKhoZ2WkpCTk5WTjYR+fHl8gYOCfnlxbmxsbnR0c29saWhrbW5taWlobHJ6fH13c25vc3yEh4eGf319gIiMk5aYl5KPjIuPlJ2jpaKdlZCOjo6Ojo+QkZCJgHNnYWRtdXx9dGtfWVpdYmNiXFpYWVtdX19fYGVmaWppanB1fYKFgoGChYyQlJORjpCUmp+in5qWkpCOj42OkZieoqKbkoWBgomSmJiTjYSAgIaMkZSSj4iCfXd1eH6Eh4mFfnVzcXh/homFfXJoZGdxfYeOjYd9dnF2eYSIioeDenZ1eYCHi4qIgHx3eX6DioqHfnNpY2Rqcnl9e3RnXVJOUVZgbHFybWRcVVheanV5eXVtaWtzgI2Yn5yVjoaDg4qSmaCkqKWlp6mqrayppZ6ZlZOVmZ2ho6SfnJSPjIiHhYN+eXl1dnd3dnNwcWxvbWtoZ2RlZ2lrbW5ucXF1dXRxcGtudHuHjI2Mh358fIGHkpmcmpiQioeHjJOXmJaQiYSBgoWIiYV+eXBsbG5vc3Z3cm5pZGFfYWNjZGBeXl9iZmdoaGRlZmpxd3+ChoaCfnh1eIKRoaqwq5+RiomQn6ivrqqinJmYm5mdnp+joZ6ako6MjZKSlJCMhYKCgoN+eHRtamhobGxxbm9sZF5ZVVdcZGttbGllYmZud4CDg4F/foCFiYyMjY6Qk5aZl5WUkpOVl5mZmZmXmJmXlpKNhoN9fX6AgYB+eXdxa2diYmNlamtpZF1TUE9UXWRpa2loYmNiZmhrb3F1d3l8fHx+g4aNkZWUlZKSlJiZm52enp2bmpqdn6Ooqqyon5eOi4eJiYyMjYuJhIWCf3x6fH59fn13c2xoZWlueYSNko6FdWZZVl5rfIuPjoR5c3N6hIuPjoN3bWxweomVm5iPgnVwc3uGjo2Je21gXWFteISJi4J7cWtoaWptcXN2fIGDhoJ9dm9tb3d/hoeEfnl1d3uGj5aYk4+IgXp7f4SJjY+Tl5mZmpaOhHt0d3+Ll5ydmY+HhISJi4yJg3x3c3F0d3+Ei42Mh4F6c3Bxd3p8fX18eXh4fYGHiIiDf3l2en6Jjo+GfXRvc4CNm6KckIBxbnJ5h5CUkol/cmpobXiDjJCMg3JmXl5lbnh+e3NpYV1ga3iDioh9c2ZjZXB6hYqHfXVvcXqEj5aXkoqDgH6ChouOkZaanp6gm5KJgoGBh5CVlJCIfXNydoSRnaWkmINrW1RbaYCTmpSAalhVYXyXpqCKZkdBVn2nvrybaz8zSXuw09e5hVIxM1KAq8TFrINbRktmjLTGupRmQDVKfrbX0KdpMRcuaa3c5cSBNg0VSInF5dqpYSwePW6ixcuvfU8+THCWrK+ehmpdXW2HkpGIfnl3dXyIjYqBenuBiYqHgXxybnJ/j5mbj4J0bW1wfY2bnY57a2ZjaneLnZuNe3BqbXJ5hY2KgXZ5goaHhomHeWpjcIKUoaWfjnZeVWWFpLCpl4FqXGOAmqOZiHdoY2+Ko66qkmpIOUlmi7XPxpVXKiM3ZJ3R3r59PRklUo7C2smTUh0ZQ4jA2tKscTgcLWKcydbFnG1FOkpynLS3qY9zZGZ3jZyYjX10bHB/l6ahkHxyampxg5ehnpGEem1jYW6BjZOSl5WIdWRhY2t7jqGnnox0W0xOaIyst7GcfmBJR16Gqbmzm3lXQERonMDJtIteNyhEfLfWy6NzRSsyV4e0yMWngmJNRU5khaS2uKuOa01GV3aUqa2dhGljaXmFiYV7eHqDjJGQhXJkaH2NlIyDenR2f46Xk39qXWF2kaSonYdvV1NkhqKrpJN/bGFld4eNiX93eIiZoJR9YU1IXYe30MqockAqPG6ix9O+i1Y1OV6MtMe9l2tMRFNyl7bCspBiQzZDZ5nH2smaXzAeNmigzNe6g0wvN1qFrcKzjF9EQFR4n7u3l2VAM0VtoMrYwI5SKitLeaTDy7iRZUtFVm+KpbW2pYZlTEVbe6G5uqaCX1FZdIyeoJJ+bHCEk5ODc2dhaoKgraCAXk5YcI2jrJ6AY1Vfd4+kqJiDa2BfbYikrKGNe2xjZ3ePlYx/eYCLmp+YfltIUHOiyNG4g0YlLliRwtnMmFwxK0d0o8XMsIBKKipNhsDk4Lh4LgQTTJvY8d6nVBAHMHe56ui8dy8SJl2Yyd3IlFw5N1J5nrOynoVrXVtqfoyUlJSMhn93b2tteIqap6KIZ0tLYIqxx7uSXDIxVIq608SRVTU5XY2zw7SRaVJQZX+Wn5yQg3l2dnJ4go6VlpSQg3BeW2yEmaaqp5FtST5QdZm2vrGMXTYxT4Gvx8Okdkg3QWiXt7yheVlLUWmJp7Cgg2teXmh4jZiZkId5cnR5gH+Eio6EfYKIhXp0dHZ9gouUlIt/cmlrdoaOkY2JgHNvdoGNk4+EdWtrdYKMkJCDcWZugpOOgnd3dniIm5+JbV5fdY6kqJ6MemVeYnWFj5SeqaKFZE5HVXOfydG4ilc0NlSAp7/CrIFTP0tmg52xsJVrTExif5qqpYRfTVNxlKmqj2xUWGyLoqiZd1dHVnmjwsWkcUUzO12TyuPMlVowKEV9tdzWsH1ONUNlj6/CvaB0UUdRZYexy8GUZ0I1QWmh0du8hEonLU+Dt9zar3A3JDtomsbbxo1MJi5Th7jY0aFiMyVCdabKzrB8RzJBaJCywLGPaU1MXX2WoqGVhnNmYnB/h4uQlpGAb2twdoGRnZqKeGtmaXuQnpmQgXBlaHqJjY2MiH52doGCe3Z8iIyJhoF8dG1yhJWeln9oXmRwg5qmmoBnW190jp+dknpjVFh1lKqtnX5dSk1mg6K1uqF5VUVSbI6nuLKWclJEWX2is7OlimdMUW+TpqWbjX5xZmx5h4qEgYOJiYF5dXJzdHyGjIqFgH13bmxzf4mNjYd6a2JkdY+joYtyXFBVb5KtsZ2AZ1pXYnWJl56bkIN7eHRucHyLj4iChImNkJeYim9aVl91lLLEu554VEBDXYOmvsa1k2pJQU5rhZyopZZ9b2pxe4GCe3JqcXyPnqWikXNWSlJqhqa7vaaEZVFKUmmBmqespJOAb2JgZ3iHkI+PioR/f4aKhXVkZG19i5+sqJFvVU5bc4qgqqSSeWZdZnN+g4WKi4R+fYCBgIGFg3puaW97jqGlmYNnTUdZfaCys5+CX0pLZYWdrK6kjW5TTVx4kaeyp4xrWFtwjaCfj35zbnKClJeEb2x5ipSXkod0aW6Ck5aJdmpseI2doJR7Z1tiepOhoIpyXFRcdpOptaqNak5EU26Qq7Sli2xVUGB7kpqVi4B1cHB0eXyEipKVkIV0ZmNsgpmjnYp0Y1VacpOssaONcVpPVmyJprStkXJaVFhqi626rI1vWlFXbpCtrpx/YFFUbI6surKXbks5RF+Bo8DDrotrUktTa4ifqaOSe29vcXmDjY6Hf4CGjoyGfndzc3mCioiHhICBh42Ph3pwbWtvfYyZn5uOfWZbW2qCn7O0n3lUQ0ligJ+wr5V5Z2hye4eIgnNobXuJkpeUinlqZmdqc3+Ol5qYj39sY2Nqd4OVo6KbjHpnWFdmepGiqqGNdGJeZHOEjpKNi4WGhIF5cWtud4STm5SHeHBvdoCKjYd7eXl/iZKUkId+dnBscXaCjpqgm4xyXlZfdougqJ+Ha1haaX+SnZuOgHFoa3SAi4+Ri4J2b2pwfouTk5GJem1jaG98ipujoo94ZFdXZoOiuLWjf11ISWCAnKyslXpkXmd8kJ+aiG9iYGyAk6iomoFsYFxib4eapaCVg29dWF9whpqjoJB+bGRhaHeFlJmalIh6bmhrd4eSlo+Jf3h4f4eJgnp0dXyHj5OPhnhzcHR7f4KBgoOIjouHgXt2cnN3gIeNkI+JgXdtbHWEkpSThnxxanB8iY+Lgnp3d3+FioqEeW5oanN/i5WYlIp5a2RobXyJl56dkoN1amRndISUnJuThHVnZm16iI+QioB5dXR9ho2OiX50bG50gJCYmpKFdm5sb3WCjJSSjYh9c2xud4OQlpSIem9tc36Gjo6HgHp6fIKFhYF+eXZ3en+EjJKRjH5xbGlyfoyWlIl+d3N2f4WJioeAe3x8foCBg4SBeHVydX6MmJmOemhcXWyFm6Wei3VjYGt/kp6ck4JxZWZve4SPkY6HgHh3dnx/f3+BfXp7e4KIjo6Mh351cXJ4g4qNjId/d3NydXyDio2OjYZ+dXFzd3+JkJKNhH59e4CCg4N9eXd3fIGHi4qIg3x0cXN6goqNjIN3bm52gYySkYmBeHd5fX+Bf3t6fICDgoGAfnx7gYSFgn98fHt9foKDgYGBf3x+gYOFhIF+eHV2eYGLk4+Kg3p0dHiCh4mKhIB5dnh8foWIi4eCfXZzc3Z9houRjId9dGtsc3yJkpSOhHZuanB7hpGSjod8eHV5gImMiYZ9eHV6goyRkYp9c2psd4WSmZuQgnNtb3iDiY2IgHVwcnp/hoqKhH11dXZ8goWFhH57e36Dio6Lh4B8eHd7gYaGh4SFf4CBhIODgH57e3x8goeJjIeEfHlydHqAhoeFg354d3R3eICIjY+Jf3JmYWp4iJOUh3RkXml5jZiYj4B2cHV9gYODg4KEiIeDfXt/iZKcmY99b214iJihoZR/c291gIyQkYh9cWlmZm13goqNg3dnXV5reouQjoJ2am10f4yUlpWNhH16e4GLlqCfloh6dHmIm6iomoRvY2p4ipmZj35tYmFnc3yEhX93bGRkaHN9h4uGd2xjZ3B9jJGQhXp0cnmEio6Mg3p0cXaAiZCRjYJ5c3B4foiLioJ5dHZ8h5GVkoh+d3d8g42RkYyFgHt/hIuRk5GOiIN+f4SJi42Jg3t1c3R5foOGhomKiIWAdm5pbHZ/hoJ1ZFNRWnCIm52OempibH2SnZqKeGhja3uPn6eoopqPhoGDiJCboJ2SgnJoaniIl5yVh3JhVFNZYmVlYF1WU1RWXmVwd3l4cmhgX2RxgIyTk5OSlqGsusDCurKnoJybn6Srrq+ro5mOh4aHjI6IfGpdUU5UXmhsa2ZdWlhaYmlyd3Zxa2JdX2x6i5OTiHpydIKYqrayoIp6doGQoaahkn5tZ2t2gYqKgXhpX1thbXl/gXtvY1xhbH2LlZCGd25sc4KSn6Whl4uEg4mZpq+wppSCd3d8i5Wclot6cG5yfYWLh35xZV9iaXJ6f352b2locHqGj46KgHVxdHyHlJqak4qAfHp9hY6TlZOLioeJiomAcWRcXml2eXJeRTc9V3qbp55/YE9Ta4WanIx3ZWJvg5Wlp6imqKajmpOPkZegpKCQfG5xeouboJeHbl5WVVxiY2RhXlxcWVteZXB5fn14bmZqd4mbp6afk4+To7bIz8q9rJ+bn6awtLSpnYx+dHB3gouQiXdiSz4+Sl5qb2hXSD5BUGR6iIyIem5jYmp7jp+ln455bnCBnLfHwa2OdWdtgpSgm4p0XVBUYHF/g39yZFdQUl1obnJtaWJiaHiIlZiWjIOBhI+boqSdlo+OkZylrrGwp5yOgnt7gYeMjYZ8cGlocn6Hi4Z7bmRiYmlxeHt7eXd3eX2FjJKWlZGKgXx2eYCLlJiZkoqCfH2Ah4uLhn50a2tueYmSmZJ+ZlBIUGuKnJuAXDw0SHShv76gdFBKXoWntaqKa1hacYyjrKmimZOPioaBgIOMkZCDcF9ZYHWMmJeFa1RLTl5udnZuYVhVWWRygY2SkoyCd3N5hZmmr6iZioKJnbXJzcOvl4mEjpejpp6QhXt1c3N3eHt6d3BlXVFQVF5pb3NtZV9bYm+AjZeWkYZ8c3V+j5+nppyHdnB2jaO1tKKGZlRXaIKWmo5xVUFATWV8hYN0YVFMVWV8jpOPgXBlZnSGnKmom4p6c32OpbGyqJWBeHiHlqWmn4x7a2NodYSNjYR2amNlc4KPlJCGfHN0fomWm5eRiICBho+YnJ2UioB5eH2EjI6KgHRpYmVqcXZ2dG1oZGZnbHBzeYKPmZuPeWJPUGSIrb+0kmBAOVqNwdvQp29FPFWDq7yzkWpRSl14kqCimo6BdGljYGh4jJydkXdfU1Zui6KpmoBiUE5dc4eQkIN1amhqdIGNk5SMfXBqbXuRpLGuoIt7eYOWqrGuopGEgYWQmaGhnpaOhXpybW90fIGEfXFlYF9qdoGFfXFiWVtkcn+HiIV/fYGJkZOPhXhycXeCi5GMg3pzdnyDi4uFfHFraWxydXZ2dHFxb3N3enx+fHp2dXd9g4mNjIiFgIKFio6NjImFhIiIiomIhYWHiYuHgnp0c3d8gYSCfn19g4qOlZKQiYKBgYaJjY+RjY2Ni46OkI6Jgnt2c3R4e3p5d3V1dXd2c25mYmVpb3h6enVxcHR8ho6UlpmWlpKJfnJtdYegtLelg11HT2yWub6neUswOFyHqKuUbUk5Q118lJuYiXlua2x2hJKfo6GVgnJtdIedq7CjjnZnY218jJKOgXBhV1djc4CIhnZjU05XbIicqJ6IcWJmeJWwvb2tlIN6g5etwMjCsJuGfn6ImaSnoI54Y1tga3qFhXtpVkpKUV9ueHt3bWZjY2dsdHZ6fYCAgX9/goaQmJ6hmpGFenqDjpmel4l2amZwfoqPh3llXVxnd4aKgnBfUVFdboCIh3prX19ne42anZSEdXF3h5ipsKqejYJ/hZCepKWdkoeCf4OMk5eVkoeAdnFvcXV4f4GCfnlxbWpuc32DhYF4b2tpc3+LlZaNgnVwcnyNmKCdlIZ8dXiBjJSXkoZ4bmlsd4KLi4Z5bmlpcHt/gXxxZ2NkbHN7fnt2cWxsbG90eoKKkZWPh352dn2JlZmVi3xzc32MmqCdlId8dnl/iY6PiYF4cW9zeYKKkY+LhHx1d3l+hYqLjIiIh4mHioqKiIiGhoGBgYKCh4aGhYV/fnl4dnRzc3RzdHN1d3t/goSAfXdycXR5gYaNi4qEg4KFjJSYmJGJfnl5foePko+Kgnx7fX+BgXpzbGdoa21yc3JxcXFzdHh5d3VybWxudHuAhYaCfX2AhY6VlpKMhYCGipKXmJWQjIeGhYWHh4aJiIeCf3l2dXl8gIB9d3JucXV3e3l1c3J1e4CFhYF+fX6Eh4+OioeEgYSIjpGSj4+LiYqIjYyNi4uHh4KCgH9+fHp5eXh5e3l3dXNxdXh+goN/dnFqbXF6gYeGgn16eXqBhoqKhn94c3J0en6CgYJ8eXZ3enp+fHp2cnJxdXd8gYKDg4J/fnx8foGDhYiHiIqKkJOWlJKMh4SDhYiKi42Li4iGhIGAf4CBgYB+fHx8f4KCgoB8eHh4enp+foGDhYmJi4eHhIWFhoiFhoWEhoaJiYmDgn17eXd5dXd3dXh6e3p5dnRyc3R0dHNwcHF1en+Cg4KAfn1/gYGAf31+f4CFhYWFgYODg4aFgn56eHl8gYaGhoJ/fXp9fICAfXx8fYCFiYuLiYaEgoSFh4eGgoCAgIKFiImFgn58fH2Agn98d3VzdXt+g4F/fHd2eHuAg4iGhoaDg4WHh4uLjYyIiYeHh4qNjpCOjIeHg4SFh4iIhIN9e3l4eHl6eXp4d3Z0cnNzcnN1dXVxcW5ucHR5fX5+fnt5e3t8gH9/f4CBhIWHiYqKioqJhYB8enx+hIaHh4J/fHt8gIGCf3t3c3J1eH6CgoKAenh5eH6BhYWDg4KChomOj46NiIiHhomJjIqMi4yLioqIh4iFhYSCgX5+f3+AgYCAfn17e3p7eX1+fn+Af4F/fn5+fn9/f35/fH9/gYaHiIaFg4CAf39/f319fHt7enp7fHp7enl5d3Z0dHV3eHx8f358e3l5fH6AhoaEhIKAgoOIjYyKioWDgIGCg4SGgoKBfn16fHt9fH59enpzdXR4e3+CgX99enh5fYKFh4eFhYKEh4mMj46NioeGh4eJi4qIhYOBgoKDhYWDgX17enp7fnt+fHt5eXl5e35+gH9/fn9+gIKDg4OCf4B/gYKCg4ODhIKAgYF+gICAgX+Af319fH5/gYGAgH19fH5/gICBf35+f32AgYOAgH97fHx/gYGDgH17e3t+gISEg4B7enh7fIGCgYB+e3t8foGDg4OCgH59fn+Cg4SGg4CAfXt9foCAgX99fXp7fn2BgoOBgX9+fn1/gICEhIWGhYOCgoKBgoWFhYeGhIODhIWIiIaEg4F/gIGDhIWCgYGAgYGBgoCAfX59fX6Bf4GBgH5+e315fH58fXx+e3x9fn1/fXp4dnd3eXx8fX17e3p6f3+Af39+fHx8fYCChIOEhICDg4OEg4KDgoGCg4KEhYODhIKCgoGBf39/foCBgoKCgIOAgYKCgoJ/gX+ChIaHh4WGg4GCgoODg4KCgYB/gIB/gH5/fXx7enp6e3t8fHx9fHx/fn9/fn+AgYKDhYWHhoaGhYaGh4iHhoWHhYWEg4OBgIB/fn18e3p6eHh6eXt7fXx7eXp5fHx+gIF/gH5/gYKFhYaFhYODg4SHhoiGhIOCg4GBgoB/fXx8e319fn18fHx6enp4eXh6e3p7fXx+fn+AgYCBgICAgYKGhIOEg4KDhISGhYaDgn9/f3+BgIGBgIGAfH18fXx9fX9+fH56ent/fYCBgX9/fX9+gIODhoSEg4KAg4OFiIaGhYSDg4GFhYWGhIOCgH+CgIODgoB/fH18fX5+fn58fHt8e3x9f4B+fn17e3p+f4GBg39+fn59gIGCg4B/fX1+fYGCg4OBf359foCAgoOCf4GBgIOChYGDf39/fX9/fn9+gICCg4OFg4SCg4KBgH+Bf4CAgYGCgoCDg4KEgoF/f31+fX59fn59fH1+fX1/fHx7fHp9e359fX5+fn9/gIOCg4OBgYF/gICBgYSDg4KDhIWEhoaFhISDgoODg4OBgn+Cf4KBgoCBf399gH9+fn9/fn9/gICAg4GBgYKAgYODhIWEg4KDgYGCgoOCg4CAgIGBgYGBgX5+e3x7fHt7e3h4eHh5enx8ent5eHl3ent8fn1+fX99f39/gX+BgIF/gH+AgYKChIOChYCDg4OChIKCgoB/f4CAgIGBgIGAgoGCgIKCgYOCg4SFhYOEgoGDgoGEgoSDg4OBgYKDg4GEgoGCf4B+f36AgICBgIF+f39/f39+f359fn1+fn6Af36Afn1/f4B/gIB+fH19fn+AgYGBfYB+foCBg4KAgH58fn6AgoKCgIF/fn6AgoKBgoB/fX1/f4GCgoB+fX5+fn5/f398fHx7fn+AgYB/gX9+gYGCgYKBgICAgoOEg4SCgoCAf4KCg4ODgoKCgIKDhISCg4F+f3+BgIOBgYCAgICBgoGDgoGAgYODhIaGhIODgoOEhISDg4B/gIB/goOBgoF/gH5+fn5+fX18fX17fH19fn18fXx8e3x8fHx8fX1/foCCf4OAgoCAgIB/fn5/f4CAf4J/gH9+f39+f399fn9+f39+fn1+fnx/f39+f39+fYB/gYGCgYKBgoGBhIKDgoOEgoSChISGhYSFhISEhYOFhISDhYODgoOCgoGDgYKAf3+AfYB9gH5+f35+fn9/fn19fH18fH59fX9+fX19fn1+f4F/f4F/gH6AgIGAgX+Afn59fn+Afn9+fH58fn9/f39+fXx/fX9/gYCBgH9/fn+AgYCCf31/f3+AgIKCgYCBf4CBgoKBgYB+fn9/gYCAf39+fH5+foJ/f39/f4B/gYGDgYKBgYGBhIOFhYSDhISDhYWGhoaEg4KDg4ODhYWDg4SBgoOBgYCBgH5/gIKDg4WCgH59fX5+goKCf318fH19gYOCg4J/f319f35/fn1+fn5/gH9+fn58fH19fX57fHt6e3p8fXx+fnt7eXd2enx/g4GAenZzdHmAhYeHgnt3dXp/iIuOjIZ/fHp7g4qNk4+Lg359gIaNkpWPiYJ+foGHjo+SjIaBfnx9goaJhYF7dnN1eX2Fg4B7dHFydn6ChYN9dnFxcnZ/goaDgHx2dnt/homLiIV+fHp/g4iNjoyGgHp7f4SLj5GMhoB6en6EioyKh397eXp/hYmJhoB5dXR2e4CDgH54cXBydHp7fnx4c3Fwc3R5e3p5dXVzdnZ7fH18e3l6e3p/f4GCgH+BgICCgISDh4aIiIiJiIiHiImMjIyMi4mKiYuMjYqMioiJioqOjY6OjImIiIeIioyIiYaCgYGAgYGEgIF9fHp6enx7fXp6eXZ5eHh4dnNzcXR1d3l1dG9ub3V3fYF9eXRxb3F2en5/fHp0c3V2fIKGhoR+fHp7gIiLjYuHgn+Ag4mLjouIg399foCGiImHgHx5dnl+goaDf3hycXJ4gYWIhYF3cnF1fYWKjoqIgX18gYePlJaTjYiDhIaOk5iZkoyHg4WIjpKVkIyGf35/gYiNjIqFgH16e36BgoN/fHl3d3h6fX19eXd0cnJzc3V3eHZ0cW5ta2xvcXN0cnFta2xrcHJ1dnV0cnJydnl/gIGBf4B9f4OEioqLioqHiImLjo6Rjo6Ojo2OkJCPjo2Li4yMj4+QjYuJhoeJiouLjIiHhYWEhYaGhoWDhIKEhIaEg4B6eXd4eX+CgX98cm5qa3F1fH59d3Bramxxd3p7eHRwb3Fzen6Bgn57dnZ5f4eMjYuGf3x8gIeLjo6Ig3x6eX2Ag4SCfXh1dHd9gYKBfHVubG92foOHg352cHF0foaNj46HgH58gImQlJeUjoaChImPl5qZlI2HhYWKj5aXlY+LhISEhomOjIqHhIGAf4KCg4KCfn17eXh5eHl6eXh3dHJxcXJzdHN1cG5samlsb3V0dHNtbGxtcXZ5eXp2c3Nyd3qBgoSCgX59foSFi4yOioiGhIiKjo+QjoyMiYuMj5CQjo2LiYmLjI2MioiGhIaGh4iKiYWDgX+AgoKDgYB9enx8fYGDgoB8dnRydHmAhIWCfHVubXB0foSFhX11b29wdXyAgn97d3R0d3yEh4qHgHt6d3+Di4yNh4N8enyBh4yLi4aAfHp8f4GDgn96eHd5fX6Bf3p1b29xdX2AhIF9dnV0eX6FiIqIhH59gIWIjZCNioWCgYWIj5KUkYuIhISFio+RkY+LhoKBgYSGiYiGg4B/foCChIWDgn16eHl5e35/f315eHR0dHZ3dnZ0cm9wcHF1eHl4d3Nwb29vcnR2dnh2dnZ2eHp7foB/f317foCDhYmKh4mEhIaIio6Pj5CMioiJioyNkI+OjYyMioyNjYyMioaGg4WGioqJioeFf4B9fn6AgIGAfn98fn1+fXp5dnV0eHx+gn55dG5sbnR7g4WDf3hyb3F2fYOEhH95dHN2foSKjImDenh1fIOMkJCMhn16en6EjY2NiIF7dnd7f4SGhYB7d3V2eX2Af3x4dXR1eH2Bg4F9enh6e4CEh4mFhIKAgoWKjI6Ni4iGhoeLjJCPj4uJh4eHiYuMjIqIiIWFhYSEhYKBg4KBgoCAfn16eHl5enl4eXh4dnZ3dXZ1dHNyc3J0cnVzdHR0c3R0dHR0dXZ2eHd5enh4eHh5fX+AgYGCf4B/goSHiYuJiIeHh4iLjY6Nj4yLiomLjY2Oj4+OjI2MjY2MiYmFhYWEhYeFh4WCgn9/fn99f318e3t8fH18e3h2cnRzdnl6fn57eHRwcXN2e31/fnx4dHZ1eX1/gH97eXh4en6DhYeFgYB8fH+Bh4iIiIWCgYGChoiKioaDgX+AgYGDg4KBfXx7fXx+fnx7eXd4enx+f399fHl6fH+ChISDgYB/f4KGh4mIiIaEhYSIiIqIi4eJiImKiouJioiJiIeHh4WDgoOBgoWGhISBgH19fHx9fX16enl5eXl6ent4d3R0c3V0dHVzdHJzdHR2dnZ2dnd2d3l6eXl3d3d4e32BgoKBgX5/gYGDhoeHh4aGh4iKjI2NjYuLioqLjIyNjoyNjIyNjoyPjY2Mi4qJi4qKi4qHhoWDgoGAgH9/fn9/f4B/f356eXh1dHR3eXt8fHl0c25vc3Z5fX15d3BwbnN3fH9+fHl2c3V4foGDhIF+e3p8gIWIiYmFgH59gYKHh4mGg4B9fX2AgYSDgYB+fX19f4F9fn16fXx+f4CBgIB9f4CBg4aGhYSCgoGEhYeIiYeIhYeHhoiJh4eGhYaIiIiJh4eFhISFhYWFhYKBgIGBhIOFgoB9e3p6fHyBgYB8enp3eHp6enp5dnJydHR3enh5d3R1cnN0d3h3eHZ2dXZ2eHl6ent6e319f35+foF/goOFh4iGh4aHhoiKioqLioeHiIiKjY6OjY2NiYyLjI2LiomGhoSGhoiJiIeIhIKBgYB/gH+BgICBf4CAf4B/enl2dHV4e39/fXt1cnBxdXt+gH53dW9vcnV9gIKAe3ZzcnV7gISFg4B8enuAhYqMiYWAfXx/gomLiomEgX5+gYOGiIWCf3x7fX2CgYGAfHp6fH2Ag4KBfnp6en6AhYeIhoSBgIGFhYqJh4eCgYCCg4eIiYeFhIKBgYSFh4eFhYOBgX9/gICBgoKAg4B/fn19fHx8fXx+fHx8fH18fXp7enh5eXl6e3l5eHZ1dXd4e3t8fHp4dnZ3eXt8fHx7fH19f4CBgoCBgICDhYWJiIiGhoSGhomLjY2LioeGiImJjYyNioqIh4iIiouLiomHhoSGg4WFhoaHhYOAf36BgYOEgX13c3J2eX6Afnhxbm1yeoCDgXpwaGRobniBg4F6cm1rcnqBiIqDfXVwdHiAh46NioaBgYOFiouKhYJ8fX6BiImLiIR+eXd3enp+gX18e3l5fYCChIKCfn59fn+BhIaGiIqLiYqIiYmKjI2LiIOCg4WMk5aXkYyEgYCAhIaFg4J9fn6BgYSAfX16d3h3dnd2eHh5eXl5eHh3eXh1dXFwcG9zdHd6enl5eHd4enl6e3x8fHx8enp8fX+Bg4GBgYOChoiNjY+NjIyMjIuLiYeGh4iLi4uLh4WGiIqKjIyIhoWDhIWEg4F/e3l5eHp+g4uPkYuDc2pkZm55gIB6cGdlbXqKlZmVi4N7e3yBhoeJiYuNjo+PjIiBfXZzcHJzeX2CgX54dXFxcnR1cm1sZ2trcXN2d3l8fn6BgX59eHh7eXx8fH+Dh4mLi4iGgYKAhomOkJOSk5KRj5GRlZSVkY6GgYB/h4qQjoyHgYGAg4aGgnt2cG90eoKIioiEfXt4eHp9fnt3cm5qb3J5fX98dXBqampucHBwbW9yeICDiIWDf319gYSGiYmIhoiFhoeJi4uKh4aDgYGFiIuRk5STlJKRjYuIh4aGhYJ/endzcnJ0dnmCjZikpJeBZE9JWm+GjIBkRTRBYY62x7+gf2lnfJastayVfnFue4ucn5uMeWVbV2BugJCXkoZ2a2l2h5eclYFqWVVdbn6Jhn1tZGFreIWPj4Z4aGFeaHiKlpqThnhvcn6OnaWhlod9fYKMlJiWjIV8e3t8fHt5ent/hYiQj5GOiIWCg4SJi4yKhH99f4WPlJWNgXNram13foB6cmtpbXWAhYV+dGtkZGtydnt4c29ub3d+g4aFf3x3en+Hi42LhIB9f4GIiYmGgXx7fISJjI2Jh4SHjZScn5yVjIR+fn59e3Nua258jqGsppV5X1NVaIGSknxcQjlJa5q/zsiwkH95hpimppZ7YlJSYHeNnZ6Qe2JSUF94lqmtnYRsYGl+mqqplnhfS0pWZnR2cWVaVlpneo6cn5uNfHBtdYWVo5+VgXFpbX2OnJ+ZjoF9f4aMjo2HhIGEiY6RkI2JhIODiY+SlJCHfnRxc32FiYZ5bGNmdoiZopuMeW1veIePjYNvYVhdZ3V6enFoZGRrd36Cf3x2dniBipOamZiUjomGhYF+dnJtaGptdHd+gYSJj5edoaKbkoqEhIaIiouEgXx4eHp5d3FpZGJnbHN7foeUprvEvJ51TTtGaZGjlGo2HCJPicHe1a1+YmmJscfCoHNORFBui5qfkoN2bWpwfI+jsbKhhWlZX3iXqaWKZUg/S2eCjYRrU0RIW3OIlZeSioJ8d3R3gZGdn5F6XU1QZoems66YfnF2iJ+srqGMfHV3goqPkpCLiYiJiIqMjYuFenFsbHWBjI6LgXl3f5CgpZ6KcV5aYnJ+gHJgUEtVa4OXmo98bGJmeIqTkYVzaGNufIyVkod2amlvfYeMhnttYmNsfI2ZnZqTiYiIkJSZk4yDfHl5foCCgH15eHd6e399gH2BgoaIhoaJlae5v7aXbEc2RWmQp5ZpNRohSH+21tKvhmlvjbHGw6eBXk1QXm94fYCCgX96c3SAlrG8uqGAYldifJGZinFZUVdqe352ZlhVX3F9goF/f4yVnJmLgHmAjpqainBWUFt2kqSmmIR3eoeapqaai354eXx/gIOKkJWWjoR7d3+KlZaRf29iYWl3hpSam5aMgXdydoGMk5CAbVpXX3aKl5aHdGhodoeTkoNuXllfc4OPj4R6b292go6UkIR3aGRmb3d+fnl0cHV/jJabl5GHh4uQk46EdWlmaneAhoV8cGpscn6Kj5GQioaBgIOOnbK/xLaVbEc1RGSJm49nPSgxV4m409S3j3d7lK+9uJ5/YFNRWmhze4WMjIR0ZmJxjKy+up12VEZUcpKjmIBiTElUZXZ8eXNqZmVmaXSDl6iwq5V8a22Al6qqlHZYTlZuhpmck4V7e4WPl5yalI2EfHZzfIeVn56Rf2xqcISRm5WAal5dZXiKmJ2dlId7dHN4hZKbmox5ZmFqeY2VjHplVlppf42Rg3FgXGh7kJ2ej35tanOFmKGfknxmWVpndoOJhXltaGx6iZacmpKNiYmKiIV9dXBxdHyAgn97d3JwcnZ8goaJh4WBg46dsMDBtJRxVUtYcISJeFk9NUhpkLHBvKaTi5KfqqqhjHptZmdobHN7ho2KgnVpa3aKnaOag2taWWl9ipCHeGtkZmpvcnR3eXp2b2VjanqTpquehWphaIGap6eQdGBbaX2QnZ+XjYV/fH6Ch5Cam5SEbmBkdZGorqSKcWNpf5inppN3YVphdIiVmJCCd3F0eYaNkpGMgXhsaWtyfYOEgHlxbnF4foKAeXJwcHZ+hYaIhIGBhIaHh4WCfHl2dXh2eHZ3d3p+gYWCgnt7foSPmJmThXhtbXOCjZGOhHlxcXJ6goqWn6emm4RqWFZoiKClj2lDN0VpkbTBs5Z8eIiitLipjnRkXmRudnt9gIB6b2VdZHSQqri2o4x6c3qHkpOHcVxJRUpUYm5ydHFtaGt0gpSmrqiWfWdcZHmSoaOXgGldXml3hpGWlpOJg3t3fYiVoKKZi3x2eIWPlpKIfHV5f4iNi4R6d3V3e3l6eX+GkZqdm5OHgHx/gYJ7cWZfXWVveYCEf3p2dHiAio+UkIuDfHp8foGCgH13dXR1dHZ4d3d6fH6BfX17en+DipGRkI6IhYGAfnt4enl9foB8eXRvcXV+ipaepqScjoF1dHd+g31yX1BOV2d+kqGjoZ6gqK6vqZuJenJxdnh2dGtoZWRkYWVqc4WWpKipo5yYlZKQiIB0a2ViY19dWlhaYGhye36ChImMj5CNiIN/goeMjoh7amBbYGx5g4iHg4CBho2RlZOUkY+QkpKSkIqEeHFucXiEiouHfHJwdH6JkZONiIWFi5abnpmRhX12cXJtaGRgYGJqdICIjImFg4CDiY6Qj4qEgX+AgIF+d3JubnJ3fX9/fHt6fH+FiouLh4KAfH2Ag4eIiH95cW1ucnaAhY2RlJKJgHVvcneCiIl8bF9fboSbp6SPeGhmdIuhqaSUgXd5g5SfoZqLd2ddXmhyfoWFgHh2eYKMmJqUiX55eX2EhoN8c2poam11eX2BhIiHh4WAfn+Ag4ODfXdwbW1wdHp+fn14dXR2f4mTm5qXjoaBgoOJjImDe3NtcHV6goOBe3d2fYSOk5OMg3x4fYSLjYuHgYCBhIeHg354dHR3en18eHd0dXZ+gYaHhYJ/foKHjpKVkYuBfHx+gYSBfXVwcHR8g4iIhIJ/g4aLjYyIg398en59f4CBgYF/fXl0c3Fzc3NxcnR2fYOIi4uLiouLioqGhH55eHd3dXh8g4eKjIiDf4CGj5OVj4Z9dnZ5fX58c2xrbnaAipCNh4B6eHt+g4aGhIB8ent7f4CChISEh4eGh4SEgYGDhYaEfnp0cnJ2eHp3c2trbneCjpOUjYR+eXyCiIyKh393c3J0eX6EhIJ+fHl5fYKHjI6OjY2OkJSXmJWQiIF4dnR5foGBfXl1dXmBi42Jg3pzcHV8goaBe3Z1dXyBhIWBf319goSFg4B7dnh4fX+AgX59fH6BhIeLiYWDf3p6f4SGiIWBeXV2foWMj4mCd3J1fIKIhoB3cG92gYmPj4uHg4OHiYmHgnx1b29scHF5fIGEhIGCgYGEhoeCfnh2d3qBhouLh4N/fH2Bg4mKi4eDfXl5fH+DhoJ+eXNxc3iBhoeFgHp1dXh7g4SFfnp1cnZ8g4yNjIiCf36AhIuLjYqGhIGAgYSDhIN9eXVxcnh+iIqLhn95en+HkJSTiX93cnV6gYeLiIV/fXt7foGCgYB9fXx/goWHiYeGg4OBgn58eHV1dnuAgYF/enh1eX6AgoOAfHp6fH+BhIWFhIJ/fHp3eXp6e3x7enl6fX1/gYB/f4GDg4SEf318enp7e3p7eXp8f4KFh4iJh4eGhIWFhIeHh4WDgn5+fX9/f358e3t7f4KFh4aGhoaHiYqNjoyJiIR/fXp7enp3eHZ1dXh5fX+AgH+AfoCCgoWFhYWEhoSHh4aGgoF/e3p6e32AgYGCgICAgoSFhYaDgICBgYKEg4GAfHl3dnVzc3Z5fH19f31+f4WHi42MiIOAfnp7fHx9fH1+fn+BgoWFioqLjIqFgnx4d3l7foCAfHl2dHh8g4aJhYB7eXh7gISIhoWBfHp6en1/g4KCgX9+fX6DhYiHgoB8enp+gYOBf3t2dnh4ent7e3p6f4KGiYqJh4WDg4SDhIWCgX58fH+DhYaIhIJ/gIGEhYaFhIGAf36BgoSEhYWDgoB+f319fX19e3l4eHp9foCDgYGBgIGCg4KBgH9/f4GFhoiHh4OCgYGFhoWGhH17dnR0eHyAg4OCgoCBgYGBg399eXd0dnV5enp7e3p8fH+BgYOFgoOEhIWFh4aFhYSEhIOFgoKCg4KChIOBgn59fHt6fHx9fn59fH1/f4KGh4WEgn58e318gH5/fn17fH6BhoaJioqKiIaFhIOCf3x5eXd2eHp8fX1/gX+Dg4SCgoGAgYCBgoGAgH5/fX1/gISEhIKBfn18f4GChYKBfn59foGEhoSGgoKBgYGBgYB+fXx8fICAgX9/fXx+fYGDhISEgoGAgYKBhYODgX9+f319f35/gYGBgICCgYOHhoeEgX59eXx+foB8e3h3eHp7fn9+f35/gYKEhYSDgn59fHx9f3+Bf319fH1/hIWHh4WEhYKCg4KCgYB/fn9+fX1/fH9/f35/fn5/fn1+f4CDhYSGhIF+fH19gYKCgYB+fn6BhIaFhYGBfX9+f4GBgYB/fn58f35/f39/fHx8fX+BhISFhIF/f4CBgoOCgoCAf39+gIGAgoB+f358f4KCg4OCgH9/foGAgoCBf359f4CBgYCBgH5/foGBgYJ/gH1+fn+CgIGAfn9+gIOEhYOEgoF/gIB9gH19fHx+gH+AgH9/gH+AgIGAf3+AgX9/fn5/f32Afn9/f4CBgoKDhISFg4WFgYKBgX+Af39+f39+f39/f4CAf4KAgoCCgYKCgoODgYGAgH6Bf35+fX19fX6AgH+BgYGEg4SFg4ODgYGAf39+fX5+fX9+fHx8e3x9fX5/fn6Af4GAgYCBgYB+fn19fH9/goCCgYB/goOEhYWDhICBgH+AgYCBgICBfoCAgYGBgICBgIGDgYCAf39/gIGBgYOBgH+Af4GBhIOEgoKDgYOCgYCAgIB9fn19fn+Afn+Af4B/g4KCgoB+fXx8fH5/f35+fHt8fX6BgoGBgIB/f4CBgYGBgX6BgICAf4GBf4KAg4GCgX5/f31/f3+Afn9/gICAf4GDgICBgIKBgoGBgIF/gIB/gn9+gH5+gH9/gX+Af4GAgYGBgoKBg4OEgoKBgYCAgICBf39+fn19fYB+gICAfn59f36AgICCgn+Cf4GBgoSDgYGBf39/gICBgYCAf31/foCCgYGDgH9/foB/f4GAfn9+fn+AgoOCgIGAf4KBgoOBgYGAgYKDg4GDgoKCgoOBgn9/fYB+f39/fn2AfX9+gX+Af39/f319fX5+f4B/f4CBgYGAgoCAfn99f3+AgH+BgIGBgYGDgYGAgH9/f39/gIB+fn19fn1/foGAgH6BgIGCgoOBgYKAgoKBgYCAf4CAf4B/gX+AgIGBgIKBg4KCgIF/f35/f39/gICAgX+CgYKAgYCAgIB/fn9/f36AgH+AgX+Bf4J/gYKAgYGAgIGCgYGCgYGAgIB/gICAf35/gH6BgX+AgX6AgICAgYGAfXx6e36Ch4uJg314eHqCiIqJgnt3dXuCiIiIgHx7en+FhoaCfnh3eH2DiIyIgHdwb3aDjpSPgXJmZ3WHmJuPfWxla3+QmZWIeW1veIWMjId8eHp+h4uNioN8dnR1eoCIioqAc2lnbH2OmZeNe3Fxe4qSlId6dHOAjJOOf3Frb32MlJGGenJ3gIqQjod/enx8fX18en6AhYN9dnBxdoGJioV+eHl/iIyKg3t0eH+HioiBfHh6foOHhYKBhIaIiIF/fn6ChoSCenZ3foOJh4F4c3V7g4mGgHtycXd8g4WFgoF+foCDgoWFg4N/fHt6f4KIiYV/e3h7gISHhYB9e3yAhoaEf3l3eX2EiIqHgn16eHt+g4aGhoB/enp+gYKDf317fH+EhYaCfHp6fIKGiIR/eHV5foSIhoF8d3h9gYeIhYF+e319goKDgH59fH+AhYiIhYOAf36ChIeGg316d3p+hIeFgXt4en+DiomGgHt5fH+ChIB/e3p/gYWEhIB8e3t9goKFhISBfX16e3uAgoGDf399foCDg4OBfn6BgoOBf357fH+ChoSDfnx7fICBgYGBfoCCgYB9e3h5en+AgYKAf31/gIKEhISFgoF+fHx+gIeGiISBfHx7f4GEhYWEhISDgoJ/f39/g4ODgn99fXt+fH1+f31/f35+f36AgIKAgoF+fn+AgH+Cf4GCgYOCf359fYGEhYWGgYB/gIKEhIKAfnx8e3x/fX9/goKCg4KAgYGCg4OBgH9+f36Bfn57eXt8f4B/f319fX6Cg4ODgn5+fX+AgoODhYOCgoCAfoB/gIGDgoKCgX+Afn1+f39/fXx6eXd5fX+CgoN+fXt6fYCAgn9/fn6BhIWIh4WDgH+BgoaIi4mIiYeJi4yNioiDgIGAg4aHh4SCfX18en59fn18eHh3d3p8e3x7eXh4en1/gH9/e3p5eXp9f3x+eXh4fH2BgoKAfXt5eXx+gIF/f359gYKHh4aCfXl3eX+FiImFgHt5d32AhoaEgn5/gIaLjY+MiIKBgoWKj5GPi4V/fn6Ag4SDgH18fICFh4iFf3h0cnJ0eXx6end1dHV5en6Af39+fHt+goOHiYeHhICAgIGDhIaGh4aHiYiJiYaGg4GAgYGDg4WDgX9/gICBg4B/fXx7fHt9fnx6eHl3eXt6e3t6eXl7e3t8e317fHl6enp6eXx7enh3eHV5eXp7fX1/f4CAfoGBgYOFhISGh4mNkZGRjYaBfoCDhomGhH58fX+DiImGg4B9fYKGiIqKh4SDhYaHioqHhoN+gH+EhoqJiIWBgYGDg4eFhH98enp6enp6d3V0cnR1eHh5e3p4eXd6eXt8fn+AgoKEhIWEg4KBg4GCgoOChYeJioqKhoSDgYGDgYB+fnx8gIKEg4GAe316e3x8enh4dnd5enx+fn1+fn1/fn99fX58fX5+gH9/fn16e3h5d3d3eHh7e319gH6AgoODhYaFg4SDhYeNkJKQjYiGhIOGiomGgn16fH6FiIiFg399foGEhoSCgX+Ag4eJioqIhYSEhIaJiYmIh4WEg4SEhYSDgX19e3p8fHl5c3FvcHJ0c3R0c3RzdnV3dXV4en2AgIKAgIKEhomIiIeFhYWGiIqLiouHhoSCgX9/gYGBgoOCg4OBgX18eXh5eHt7e3p6ent7fn59e3t6fYCEhoeHhoSCgX9+fH17e3l5d3d3dnZ3d3d2eHl7fH2AgoOFhIeGhYSDhIaGi4uNi42Li4iKh4SCfn18fn+AgIGAfn9/gX+Cfn57fHx/g4WHhoaGhIaGh4eJhoiGiYqLjIuIh4OBgICBgIB9e3p2eHZ5dnZzcm5wc3N4d3h3dHN0dnp/gIOBgYKDh4mLjIqGhIKDhYiKi4uJg4WDhYeIh4WAfnt8foCCgX57d3Z1dXd4enh3dnZ7fYGDhIOAf4B+f4GBgYKBf4B+fnx7eXh0dHN0dnd4fHt+fH18e35+gICAgIKFhoqNjIyKhoaEhIaEh4WBgIB+gIGEhISDgoCAgoODhoSEgYGCg4aGiIiGhIKEhIaIi4mIhoWFg4WHh4aFgn9+e318fHx5d3R0c3Vzd3l3dnh2dnl7e35+fHt9fH+BhIWFhYSDg4aIioqKiIeGhoiIiYiGhYSDgoGDgoN/fXt5d3l4d3h3dnN0dHV2eHt9fH59fX9/gIGBgYF/f35/fX59fHx8e3p7enp7eXt8ent7fHx9f35/gICBg4OGh4iHhoaFhoeHiIeGhYSBg4OFhYWFhYSEg4aFhYSFg4KBgoOFhYeIhoWCg4ODhISDg4GBgoKDhIaFhIKBfn9/gICBgH99e317fH58fXx6enh4ent9fn1+fXx7fn9/gIB/fXx9fYGCg4SGhISFhYaIiIeFhICCf4CCgoKAf359e3t7e3x5eXh4eXd6e3l8fHt6eHl6fHt9fH57e3t7fn5/gIB+f31+fn9+gH9/f3+BgIGBg4GDg4KDhISEhYKFhIaFh4WGhoaGhIWFgoOAgYB/goKDg4SDg4OBgYKCgoKChISGhYaHhoWFhIOEgoOAgX+AgIGDhISEhIGBf4F/gIF+gH5+fX9+f359fHt7ent8foCAgIB+fn59fH59fH58fH1+f39/gH5/fX5+f4CBgIB+f3+Af3+AgH5+f35+f4B/f39/fn19fX5+f39/fn5/fX9+fn99fHt7fH5/goGCg4GAgH9/gH99fHx8fH19gICBgYGDg4ODg4OCg4GCg4SDhIWFg4SDg4KDgoKCgoKBg4OEhYWGhIWEhIODg4OEhIWEhYWEg4SDgoKCgoCAf4B/gYKBg4KAgHyAfX9/gH5+fX1+fX+Af35+fHt7enx9fn19fXx8e359fX98e3p5enl8fXx8e3l5ent+fn+AfX9+f4GChIOCgYB/fYGAgYGBgIB/gIGCgoSBgoB/f39/goGAgX9/f4B/gX+Af39+fn9+fn6AgH5+fn99f39/gYCCgYGCgoODg4OCgIGCgYOCg4KBgIGDgYKCgoGAgYKBgoSCg4SCg4OCgoGCgoOEhYWGhYWEhYOBgoKBg4GDgoCCgYGDgoGAgH1+fX2Bfn1+fnx8fXx8fXt8enp7eHt9e359fn19fX5+f4B+gX1/foCBgYKBgX+Af3+AgoCBfn9+foCBgIOBfn99f35/f39/gH1+gH+ChIOCg4CAgYKAg4KDgoGDgoOEgoSBgoGCgoGBfn5/foCAf4B+fX19foCAgICAgH+AgoGBgoGAgICAgoKDgoSBgYKDg4OEhYWDgoKBgoGCgoKDgYKCgoGCgoOCgoKCgICBgICBgoGCgICBgIGBgICAf31/f36AgH9+fXx8fHx9fHt7eHh4enp6fHx8e3x7fX6Afn+Af31/foCCgIGCgYCBgICBgIGBgIF/f3+BgYGAf4F+fn5/f4F/fn9+f39/gYGAgYGCgoSDhIWDg4KCg4ODg4KAgX9/gICAgIB/f39/f39+fn6Afn5/gX9/gH+Af4OAgYKCgIKCgoKDhIKCg4KDg4SCgoKAgYGCgYOCgYKAgIGBgYGBf4B+f4CAgIGBgX6AfoB/gYGDgYGBgYCAgICBf4B/fX1+fn59fnx6e3t7enx8fXx6fHt+fH1+fn5+fn6AgH+CgIGDgYKBgYKBgYGCgYCAg3+BgoGBgIGAf32Afn5/gIB/gYB/gYKBgoGCgYODgoWDhISEhIODhIOCg4KCgYKBgH+BfoB+gH+AfoB+fX1+f39+f399fn59gYGAgYF/gYKCgoSDg4KBgoKChYOEg4KAgICBgYKBgICAf36AgH6AfX18fXx+foB+f4F/fn9/gX9/gX+AgICBf4GAgYB/gH1/fn9/fn5+f399fn5+fn5+f31/f31+f39/f35/f39+gIGCgYGCgIGCg4KDgoGCgICBgoKCgYN/gIB/gICBgICAgICAgYKBgICAfoCAgYGBgYCAgX+CgYCAf39+gH+BfoJ/f39+fn9+fn9+fn19fX5+gH9/gH9/f4B/gYGAgYGBgoGCgoSCg4ODg4GCgoKCgoKBgoCCgIGAgYCCf4B/f359fn9/f4B/gH9/gH+BgICAfn+Af4B/gH5+f39/gYCAgH9+fX1+fn9+gH9+f359gH5/gX+AgH+BgYGBgoGBgIGAg4KDhIOCg4KCgoKDg4GDg4CCgIOAgoGBgYCBgYCAgICAgH1/f36Af4GAgICAf39+gICBgIGAgH5/f4GAgYGAgIB+f3+Af3+AgH5/f3+AgYB/gH9/fn+BgIGCgYKAgX+BgoKCg4OBgoGCgYKBgIGAgIGBgYGAgYB/f39+fn5/gH5/fXx+fX9+gICAfn9+f35/f35/gH9+f4B/gH6AgIB/fn5+gH9/gIB+f35/f4F/f4B/f3+BgX+AgICBgIGAgYGBgYOBgoGBgYGCgoOChIOBgYCBgoKBgoCAgX+Cf4KAgH+AfoB9f39/gIB/f3+Af39/gH+BgH9/f3+Bf4KAgIGAgH6Bf4KBgICAf3+AgIGBf39/gICAgYJ/gX+Af3+CgoKBgYCCgIGAgYKBgX9/gYCAgYB/gH9+f35/f4CAfn9/fX1+fn9/foB/f31/fn99f39+f39/f36AfoB/f35/fYCBgYCCf4B/gICAgIGBgIJ/gYGAgYGBgYGBgIKBgYGCg4GBgoGCgYKAg4GBgoKBgYOBgYGCgYKBgoCBgH+Bf4F/goF/gX+Bf4CAgYF/gX+Af4CCgYGBf4F/gICAgoGAgH6AgICBgYCAgH+AgYCBf3+Bf4B/gIGAf4B/f3+Af4GBf4GBfoF/f3+Af4B/fn+Af3+Bf39/f3+Bf4CAf39+gH+AgYB/f35/fYB/f4CAf39/gH9/gIB/gX9/gIB/gIGBgICAgX+AgICCf4KBgIGAgIB/gYGAgYCAgIF/gYCBgIJ/gYGCgoGAgoKBgIGCgYCCgYKBgoOAgoGBgIKAgYCCgYCAgX+AgIGAgICBgYF/gH1+f39/gIB/f36Af4CAgIF/gn+CgYCAgX+AfoB+fn+Af4CBgH6Af39/gIB+f4B/f39/gH5/fX+BfoB/gn+Af39/fn5/gIGBgYKAf4B/f4CCgIGAgX+Af3+AgH9/f4B/gICAgH+Bfn9+f36AgICAf4F/gIJ/gYKBgYGBgYCAgoKAgYKBgYGBgYGBgYGAgIJ/gYGAgIGCgIGBgIKBgIGCgICAgYGBgIGAgIGAgICBfoGAgIF+gIGAf39/gH5/f3+Af39+gH6AfoB+gIB+gH9/gH9/f4B/gIB/gH9/gX+BgICBgX+CgYCBgICAgH+AgX6CfoCAgH5/f4GAgICAf3+AgICAgX+BgICBgICAgoB/gYCBf4B/gX9/f3+Af39/gIB/gIB/f39/foGAf4CAgICBgICAgYCBgIGAgYCBgIB/goCAgIJ/gYGBgX+BgICBgIGAgH+BgICAgYCAgIGBgYCBgH+AgYCAgYGBf4GAgICCgIGAgIB+gX6Af4CAf4B+gH9/f3+AgH5/f39/gH9/gIB+gICBgYGAgICBgYCBgYCBgX+AgYCBgICAgICAgYB+gICBf4CAf4CAgH+BgICAgIGAgYGBgIGCgIGAgYGBgX+BgX+AgIGBgICAgICAf4CAgH9/gYB/f4CBgH+Bf4GAf4GAgYCCgICBgIGAgX+BgYCAgIKAgIGBgYCAgIGAgICAf3+AfoCAgYCBf4GAgIB/gX+BgICBf4B/gYB/gYCBf4CAgH+Bf4B/gH9+f39/foCAf39/f35/f4CAfn9/f36AgH+AgH9/gICBgIGBgH+AgICAgIGAgYCCgIF+gIGBgH+Bf4GAf3+BgH+BgICCgIGBgICCf4GBgYCAgICBf3+AgIB/gn+AgH5/f4B/gH9/f3+Af32Bf4B/gICAgICAgH+BgH+AgICAgIGAgYCAgYGAgICBgYCBgICBgYCAgn+AgIGBgYGBgICBgIGAgIGBgIKAgIF/gIF/gn+AgICBgH+Af4CAfoCAf39+gH2Afn9/foB+gH5/foCAf39/f4B/gH9/gIGAgH+AgICAgX+AgYCBgIGAf4CBf4CBgH+Cf4CBf4KAgIGAgYCCgIGBgYGBgIGBgn+BgIKAgYGAgIGBf4CBgIF/f4GAgH+AgIB/f4B/gICAf4B/gIB/f4CAgX6BgICAgIF/gYF/gICAgICCgICAgYF/gYCAgYCBf4GAgYGAgH+BgICAgICAgIGAgIGAgICAgIKAgH+BgH9/gH+AgIB/gIB+gICAf36Af35+gH9+f39/f35/f39/f4CAf4F/f4CBgH+BgH+BgICAgYCAgIGBgIF/gYCDf4GBgICBgICBgIGCgIGAgICBgYCAgn+BgYCBgYB/gYGAgH+BgICAgIB/gX+AgH+AgIB/gICAgICAgH+Bf4F/gYCAf4GAgIF+gYCBgIF/goCBgICBgIJ/gYCBgYCAgICAgYCBf4J/gIF+gICCf4CBf4F/f4B/gn+AgIB/f4CAgH9/gIB/f4B/gH9+gH9+f4CAfYB/fn+AfoB+gIB/f3+Bf4CAgX+Af4GAf4CAgIGAgYCAgIF/gYF/gYGAgX+AgIGAgYCAgoCBgYCAgIKAgoCBgYKAgYCBgYCBgYGBgYKAgYB/gYCAgIGAgYGBgICAf4CAgICAgYB/gIB/gX+Bf4GAgICAgICBgICBgH+Bf4GBgIKAgYCBgIF/gIF/gYCAgYCAgH+BgIB/gIB/gICBgH+Bf4B/gICAgIF/gH+AgH6Af4B/gH9/f39/foB/fn9/f39+f3+Af39/f36Afn9/f4CAgH+Af4F/gIB/gIF+gYCBgICBgH+AgH+BgX+Cf4CAgH+AgYCBgICBgH+AgX+BgYCAgIF/gIKAgYKAgYCBf4GAgYGAgYCAgIGAgX+Af4B/gYKEhIKBfXp8e4CDhYWDgX99fX+BhIOEhIGBgIB+gX9+f36AgoGCgH99fn1+foCAgIGBf3+Af4CBgH+Bf3+Bf4KBgIGCgYB9fnx8fX6AgIGAgH19fHx+foCCgIB/fn9/fX6Af4GAgoOEhISCgH59fnyAf3+Af399f36AgYKBgoGAgICBgoKCgoODgoOBgYGCgIJ/gYGAgYGBgIB/gH9/gH+Af359fXx+gIKDg4WBgX99fH19gYKEg4OCgn9/f4B/gIGAfoCAgIGBgYGBg3+Cf4KBgIOBgoOCgoGBf35/f36AgICCgYGBf4CAf4F/gYCAfn5+gH9+gH5/f4B/gH5+fX1/gICCg4KBf4CAfoB+gX+Af4GDgYOBgn9/fXx+f3+AgIB/fn19f39/fn5+fX+AgoGCgn+Af3+AgoGDgoKBgYKBgoKAgoB/gIB9gH9/f3+AgoCBf39/fn+AgYKCg4GCgYKBgoKAgoCAgIGAgn+Bfn9+foB/gYCBf35+gIGDhYSDgYB8fn1/gIGBgoKAgYCBgoODgoB/gH5/f4GCgIKAgH5+fn9+f4GAgYCBgX+AfoB9fn18fn9/gICBgIF+fn5+gYCBgoCDgIGBgYJ/goCBgIGAgICAgH9/gH+BgYCAfX18fH5+gYKCgIGAfn5+foB/gIKBgYGCgYGBgIB9gH1+gICBgYKCgYCBfoF/f36AfoCBf4SAgoGBgIKBgYSBgX+Afn5/gYKBg4CBf39+fX+BgYODg4KCgH99fX59fn6BgIOBgoODgoGAf36AfoCBgYKBgX+Af4B/f3+Af3+BgICCgIGAf4F+f35/gIB/gYCBgICAf4B/f4B/gH+BgH+AfoB/gYGAf399fn19gH+CgoKBgYCAgH+BgICBf39/gICBf4GAf4F/foB+fn9/gIGBgoF/f35+gICBgYGBf4B/goCAgX9/gX+AgoCCgoCBf3+AgICAgYGBgYCBgICBgICAgYCAf4CAf4KBgYGBgH9+fn6AgoOCgn5/fX6AgYGDgYCAf4CBgYGCgYCBfYCBgYCAfnt9fICAgoOBgn5+foCBgYKAgX98f3+AgoKBgoGAf4B/gIB/gICBgIGAgoF+f35+f39/gH1/fn6AgIGCgoGAf39+gYGCgoODg4GAf4B/f3+Afn59f39+f39/f3+AgYF/gX9+gIB/gIF/f4B/gYGDgoOCgIGBgICBgoGCgYCAgIGBgYB/fXx9fX+AgoKCf3+AgYGCgYB/f4B+gIKBgn99gH6AgIGCgX+BgIKEg4SBf4B9f4CCgIB9fX1+gYOFg39+fn1/g4WFhIB8fH1+goSDgH99e35/gYOAgH99f4KDg4J/fn19foCAgX99fXx/gYODg4F/fn19gIGCgoKCg4KEg4CCf358fHx7fX9/gYCAf39/gIGBf359f3+Af4B/gICCgYGBgoJ/gYKBgYGCgIGCgIB/gICBgIGCfn58e3t9gYGCgoF/f4CCgoWDgn9+fYCBgoSCgX9+fn1+gICAgH5/foCAgoaGhoOBf399fn9/f319fH9/goKDgoGAgH1/fX6Bg4WFhoWDgH5+enx6fHx+foGChIOFg4GCfoB+f32BgIKAgn9/f4CAgYB9fXx8foGCg4GCgoODgYJ+fXp+f3+Bfn9+f4GDg4KCfn58fX9/gIOCg4KBgH9+gIKEg4KAfX99gIKBgYB/fn5/gIGBgH1+fX6Bg4WFg4KAf4GCgYF+fXx6fX6BgYKBgoCBgYKEhIOBfnx8foCCgX99e31/g4SEgH99fX+DhISDgX9+fn9/f318fnx9fYGEhoWEgX98fYCEh4mLioWBe3p5fYCAfHRtZmZrdn+GiIqJiYuNj5GOi4N+eXl8foWJi4mEfXd0c3l8f357d3d6f4WJioaBfXt8gYCCg4OBg4ODg4SAgoCBgX5/f31+fn9/gYGAfn5+fXx7eXp7fX+BgYKCgoWHiYqLh4aDgICAgIB9fXp9e36AgH9+e3t6fHuAgoSGiYqIiYeEhYODgoB9eXh5eXp+fH18fHp7fX9/fn1+fX6Bg4SFg4F8eHV1gJCmr6qRcllXaYOUjnNOMjJIcJatsaWViYaOnaqyrZ2GcmZndImanZJ8YVFPX3mLlIt0Y15tgpqoppeGdm9xdXd5dnl+g4aFg36Ag4uTkIh5a2NjbHV/hIKAf36AgoeMkJGQioN8eXyBiI6NjYqIiIiHiYaEgH98enl2dnV4e31/fHl2dHZ3e4B/gYGDhoqOj5KNiYF1bGRfXl1iZ2xye4GHiYqMiomIioeKh4V+fHt8foSIiYiGf317foWMlJWUjYiFh4mHhoJ7eHR0d4CLl6GfkHlfV111i5aJbEk3O1mBpLi4qJSJi5istbWmjnZjXGFtfYqOh3prXVpjcoOLhnlqYmV1iJmfmI+Ce3t8fXhxcG95gomIgXhzeICIioByY1tcZ3aCioqJhYKEiIyVm52blIZ8dHR2fX+BfnZyb25wd3+FjZGQkI2Njo6TkZOPiIF8eHd3d3p+fYGChISFhoWEf3x2cG5sbm90d3l8fn6EhoiIh4WBgoOGiYuJiIeIi46PjYZ9dG9sa29ydHR0c3R7hZCYn5yVjIiLj5OTjYJ6cXF3e357dXN1fYeMhnhmWldmeYuSiXlqZW2DmKitqJyQhoWFjI+UkIp7bWJgZnR/hoJzYllaaYOSnJeJeHBxfY2anpuRhHhxb3N4f4CBfHVraGpxf42Yl41/b2VlbHiBgn12b3B3go6Znp6WjYN9fH+Bg4WDgX+AhYqPj46JgoGAgoSGg4B8en2DiY2OiYJ8enl/hY+OjYV+enp9hoqGgHFkXFpkcX6Ih391cHJ/jpqakYNza253g42OiH95dnqCiYuLgnxycHB2gImOko6HhIOEi46OiYB3cHN4f4OEgHx6fICKjYyEd2thY2dxfIB9eHJwcnyMl52ck4eBgoiSmZmSin9/gYaOjo2HfnZtZ2Nma25zb2plYmh0hpWenJWKg4CGi46Lg3pybnF2fIWHiYaBeXJwb3R4fXt2bWhpcX2GjIqFgICIkZqcmI+IgoSPlpyYkH9za293hIuOhHRnYmR0hpWbk4l8dXuHl6Chl4d5cnV+jZeYj4FxZmVrdH5/e3BmY2hygIeJgXdubXB6g4mKiISCh42WnZ6bkomCe3t7eHZva2drbnd9hIOBfXt8gYmRlJGMhIGDjpehn5aCbF5aX2lxcWpaUE9bc5GnsamdjYiKlZ6fmo5+dHF2fIeQlZWPiHxybW9zd3ZuZVlUWGV2gomGfnh7g5GbnpmPhH6ChYmLh4F7eHh9gYaLiYZ8cGRfXWdxeoB8dnFyfY2grKyikH93d32GiYiBend8hZCYnJmPhn13eHl6enZ0cHN3gYmNk4+MiIeEhYOCgH16eHh5en9/gX59e3d2d3h4dnVxcXN3e318enh3eoCJkZGSjoeFiIyPkZCIgnx3dnd6e3t8d3VydXqEjJGQiIF6fIKMkZCId2pjaHF+hYN5a2FhanuNmZ+clI6NkJOWk46FfXd1eX6ChYaGhYOFh4qJhoB2amRhY2dsb3Bub3B4go2UlIyFfnt9goWIg317d36DiIyJhYF/foGBf3l1b21zeIKIjZCOjYuKhoWCgIGAfnx3cW5xdX+GjpCPjYqJjY+Sko2Ff3l3eX+ChYSEg4GDgYGBgH56dnBqa292gYWJhH17eYGJjo+IfnJsbHN8goJ/eXZ3e4GFh4aEg4CBf4KChYmKi4yLiImLkpOSjoZ9e32Bh4iGgnx6eH19fXdxbGpsbnN2dXd3fYSMkZKTj4qJhoWBf3x5eXp9fH5+foGChIaFh4iGhoWBgHt3dXV0dnZ0c3Ryd3yAg4SEgYB+fXx7enh3eHh5ent9gYWJjI6Li4aHhYOFgoKBfoB/goGEf357foCBhIWDgn56eHd5foGEhoeFgoKCiYyQko+Jg397gIKGiIiGhIKBhYaHhYB6dXBzcnV5e3t4eXl6fICEhYWAendzc3N3enx+e3x7fIGEiIqIh4OBgYKEg4OBf3yBhYmQkpOPjIqKi42Oi4iCfXh3dnd4dnZ1c3N1eH6BhISCgYCAhYeJh4J8eHR3eX2AgH98enyCho6SkpCKhYB/fHp5eHZ0cnJ0dXh8foB/gIGAhIODgYB9e3t8fn+AgX99e3p7fn6DgYKDgYKAgIB/fXx8fXx9fn9/gYCBgoSEgoB+e3h6eHt7fH1+foCDhomLjo+Oj4+Sk5OUlJKSk5SXmZmWlI6JhoSEg4R/fnd1cHBvcXN2eHl7e3x8fHt8enZybWpmZ2dqb3BzdXd3e3t7fn17e3x8fH9+f39/gYaKjZKSk4+LiISDgYKDgoJ/f3x8fYCDg4aGhoeFhoeGh4eEhYGAgH5+fn5/gIGDhYaFhoWFhoaFhYKBfnp5c3Nxc3N3eHp5eXp5eXp8fnt8eXh5e3p9fHx7ent9gISEhIOAfoCAg4aHiYiFgYB9e318fnx7eXd4en5/goOEgYF/gICAf39+foGAhYOEg4WHio2QkpCRkI2OjY2Pjo+QkY+PjYuIhYR/fXp6eXp5eXl5d3d2eXh4enp2dXFwbm5tcnFzdHV1dnh8fn9/gH1/fYCBgoGCgoKEhYWFhYODhYiLjI2KiIOAfH59gIGBgYKAfH5+gIOIh4iEgoB+gYGEhISCgIGBg4SGhYSGhIaGhoSCf39/f399fHp2dHV0d3Z4eXp5eXh2dHN0dHZ3d3h3d3d5eX6Bg4eJioyLiIaGg4OEhIKDgICBgYOEh4aHiIiKiIeFgn9+gIGAgX59ent8fYCChISEgoF/gICFhoiIh4WEhIeKjI2MiYiEhoaFhoSBfn19foCAf316enl4eXt6end2dHNzc3J0dXZzdnR2dnd7fH5+g4aGh4aEf399gIeKi42IhYSEhYuOkpOQioZ/end4enp9fn98fHp8f4SFiIeGhYKBgX59fH1/foGCgIGAgoWHiYqJhYN/fXt4eXd1eXV4eHZ2dXRycnV2eHx7fHp2dXJzdXyAhYWGgoCBgIOGh4eGg4OCg4OFhoeIiIqKiomIhoWFhIaEhIJ/f3x9gIKEiIiHhYN/f318fn5+fn5+gH6Af3x/fICBhIaGg4F/f3+Cg4SEg4B8fH6AgoaGh4OBf399gH9/fn16eXh6enl6fHt9gYSGhIN+e3p8gYiKi4aAfHl8foeOkZCNh4F+foGEiYeGgHt2dnZ7fX5+fHh4en6Bg4WEg4KDgoOCf317e3x/goOCgYB+fH1+f4B/fXt5dHNycXJ0c3N2dHp6fH16dnZ0dnh8f4F+fHp6fX6ChIOCgYGDhIWGiYqLjIyLioiJjIuOjY6Li4iIh4WFg4SGhYeHhoOEgYKBgoKBfn58fXx8e3x5eXh6e3x9fH58fXx8e3t6en19f4GCgoKBgoGDgYOBf39+fHx8f4CDg4GCgICChYaFgn94dnZ5f4KFg397e3x/hIuPkI6Jg39+f4WGioeDgXx/f4SIiYeFgX19fX5/f3t4dXZ2dnp6e319f4GCg4KCfXt5eXh5fH1+fXx7fHt+fn58fHp4ent7fXt5dXd4eX+AgoKAgH+AgIKCg4KAf39+gYGDhYOFg4KEhYeGh4eHh4iLj4+Rjo+LjIyPkZGQjoqGg4KCg4SBgH59fH1+goGAfnp3dHR1dnl5eHd1dHd5fYCCgn9/fnx+f35/f31+fX19fX+AgoSFiIaHhoWEhYSFg4B8e3t6f3+CgYJ/fn9/g4WIiIWBfXl5en+Dg4OBgH6Ag4eLi4iDgX58foKFhYWFf359fH6AgoKDgX97fHl5enh6eXh4eXl6fHp8e3t7e3t5d3h2eHl7fHt5eHZ3eXx/gIKAgX19fX6Cg4SFhIKBgIGBhYaGhoSDg4KCg4GDhIOEhIWFhIWGh4qKi4yLiomIiYmIioqJh4WHhYSGhoaEgn97e3h3enh7e3h3dXZ1d3d4eXh3eHd5e3x9gH5/gX+BgICDgYGEgoODgoODgoOFhoaFgYKAgYGBg39/fn99gYCDg4WEgoB/f3+ChISDgn58fH1/gIKEgIB+fX+Ag4WFhYKAfn99gIKCgYJ+fXt6enp5enp4d3Z3dnh5ent7eXd1dXZ3enx+fn1+fHx+gYSGh4aEgX9/f4KDhoWEg4KCgoWHhomIh4SFhIaGhoeHhoWFhYSDhISGhYiHiIiHh4aEg4ODg4SEgoKBgIGBhIKDgX59fHx7fH17fXp5eXd5enp7fHp7eHh5enl8fH18fn9+f4CBgYOBhIKEg4WFg4SGhoaIhYWDgYOEhYaGhYF/fn2AgIODgYF8fHp7gYGFgoJ/fXx9gIOEhIF/fHt6foCCg4KAfHx7f36Bg4CAf3t5enl8fHx7enh3d3Z4e3p8e3p4d3d4eXl6e3t6fXx8fX1+gX+BgIB/gYGChIWHh4eIh4aHhoiIiYmHhoOCgIOCg4WGh4SDgoOChYaHhYaEgoGChIOFhoOCf35/f4OEhYSCfnx5e3x9f318e3p4eXl8f39+fnt7en19f4B+gHx7fHx8fn6Af35/fn6AgIGCg4KCg4KDhYeEhISCg4OFh4aHhoODgoODhYaGhYN/f3t9foCBgYGAfn18fYCBg4KCgH1/fn+CgoKEf4J/gICCgoOAf356e3t7fX17e3h5d3h8e319e3l2dnR2eHl5enp6eXt7fn9/fn9/fX5/f4GCgYKDg4aEhoWHhoiIiYiIh4WEg4SGhoiJioeIhIaFhYiIiYaFg4KAgoKEg4SCgoCAgYGChIOCgX99e3t8fH9/f319e3t8fH58fn18fHt7e3x8fH5+fn9/foCAgoCAgX9/foCCgoGCf4F/gYKDhYSEgoSAgIGChYOEgoKBgIGCg4ODgoB/fX6Af4OCgn9+fX1/f4GCgYB+e3x8fX+CgoKCf359fX9/goKBfXx7e3p8fH9+e3x6eXh5ent7fHp6d3p3e3p7fHt7enx6fn1/f39+gICAg4KCgoB/gYGChYWFhIKBgoODh4eGh4SDhISGh4mJiYeFhYSGhomJh4iEg4KCg4OEhYODgYGBgIKCg4GAf4B+f39/gH5/fH19f3+AgYB/fn57fHt+fH1+fHx7e3t+foB/gIB+fH1+foCAgoGBgICAgYCChIOBgoB/gX+Af4KAf4B/gH+BgYGBgICAf4CAf4CBgH1+f3+Af4KBgYGAf35/f3+BgH9/gH+Af4CAgYCCgYJ/f399fX59fn19fHx8fH1+fX99fXt8e3x9f31+fn57fH5+gIGCgYF+gH+BgoKFg4CBgH+BgoODhISDgYGBg4OEhISEg4KBgoKDhYaFhYODgoODhIWFhoKBgoKCg4OEhYODgYKAgoOEg4SCgYCBgIGCg4GCgX9+foB+gIGAf359fHl7e319fXx9e3t9e31+f31+fXx/fH5+fn9+fn1/fn9/f4B/fn99f3x+fn1/gH2Afn9+gX+BgIGAgICAgICBgYKCf4F/f4GBgYGCgYGBgX+CgIOCgYGCgIKAgoGBgYKAgYCAgX+Af4CBf4GAgH9/f4B/gICAgH9+f39/gICAf36AfX9/f4B/f3+AfYF+gIGBgICAf39/gIGBf39+gH9/f4CAgn+Af4CAgYKDgoSDgoSDhYWGhoaFhYWFhYaHh4iHh4eGhoeFhYaEhoSDhIOBgIKAgYGAgICAfn1+fX59fnx6e3t5eXl6enp6e3l5eXl6enl6e3l5eXl6eXp6e3p7enl6e3x8fH1/fH17fn5+gICAf4B+gH+AgYKCgYOBgoKDhIOFhIOCg4KDg4WFhISEgoOEg4OFhIOCg4KCgoGBgoGCgoOBgYGBgIGAgYGAf39/fnyAfn6Af39+f35+fn9/gH9/fX59fX59f399f31+fX1+fn19fn59fX19fX99gH+Af4GAgYCDg4KDg4OEhISFhYWGhoeFhoeGiIaIiIeHhoaFhYaGhYWHhYSEgoODhISEgYGAgH5/f39+fn99fHx8ent9fHx7enp5eHp4enl5enh5d3l5eXp6eXp6eXp6enx7enx8fHt9fHx+fn5/gH6Bf4GBgYGBgYGCgoOChISFhYSEhYaEhoaGhoeFhIWGhIaGhYaFhYWEhYWFhISDhIKDgoGCgoOAgYGAgYCAgYF/gYCAgH+AgICAgIGAfn9/gICAfn9/fX59fn1/fn18fX17fH59fX18fXt8fH1/fn5+fX5+foF/goGBgoCBgoGChIODhIOEg4ODhYSEg4OEg4KDg4ODgoKBgYKCgYGBgYF/gH9/f39+f359f35+fn5+fX59fH58fH19fH1+e359fXx8fn1/fn59fX19fXx+f35+fn59fX5+gH2Afn9+f3+AgH+AgICAgIGBgYGCgYKBgIOAgoKCgoOBgoGBgYKBgIKBgIB/gX+BgYCBgIB/gn+BgYGCgYCBgIKBgYOCgoGCgoGCgoODgoKCgICCgIOBgYKBgIB/gIGBgIF+gH5+foB9gH9/fYB9foCAf4B/gX5/f3+Af3+Bf4GAgICAgYCBgIGAgIF/gICBfoF/gH+AgH+Afn+AgH9/f35/fn5/fn9/f35/fX59gH+AgH9/f4B9f4CCgICBgX+AgIGBgIOCgoCBgoGCgoOBgoKDgYKCg4GDhIGCgoKCg4KDgoKCg4GCgoKBhIGBgYGBgYOAgYGBgIF/f4F/f39+fX9+gH1/fn59fn1+fX9+fn1+f31/f39/gH9/gH+AgIGAgICBgIKAgYKBgoF/goKBgoGBgoKBgoKCgYKCgoGCgYKBgYKBgoGBgoCBgYCBgYKBgYCBgIB/gYCBgICBgH6AgH+Af4B/f35/foB+fX59fn19fn19fX1+fH18fH18fXx9fHx9fH19fX1+fX59fn99gH5+gH5/f4B/gYCBgIB/gX+BgYGBgoF/gYCBgYKBgoCCgIGBgYKCgYGBf4GCgIKBgoGAgYCAgIGAgIGBf4B/gH+AgH+Afn+Afn5/f39+fn9+fn5/fn9/f35/f36AgH6Af4GBgICCgIGBgoKDgYKCgoKCg4ODhIOCg4OChISDg4KDg4SCgoOCgoKCg4GCgoGBg4GBgn+BgX+BgYCAfoCAf39+gH5/f35/fn5+f3x+fnx9fn19fH19fHx9e317fX18fH18e319fH1+fH99fn9+fn9/f4GBgIGBgYGAg4KFhYWFgoOBg4KFh4aFhoGChIOFhoeFhIODgoKChoSDhoSEg4KAf3+AgYOEg4OAfX19foGChYODf3t6e31+f4KCf315ent9foB/fXx4enl8f4KDgoB8fHp8fICAgX9/f3t+fX+AgoGCgoGBfn9+f4B/gYGBf398fX6AgoGDgICAf4GBgoWGhoeDhIOEhoeIiYiIhYOBhIOHhoeGhYKBgICBf4F/fXt4d3Z4eXl5eXl4dXd2d3h6en19fnx/fn6BgYOEhIOBgoGBg4OEhYWGg4OAgYKAgoOBgX5/fHx+foCBgYF/fn1+foCChISFg4WEhoeIiImHhYOEhIKDgYKBgICBgIF/fnt6end3eXh6eXd4dnd3e3t9fH18e318foCCgYOCg4WIiIqJhoaEhYSGh4eFgn59fH6Dh42LhXxybGpweICCgXpza2xudn2FiouJhH55eH6GjZaWlpKNiYaJi42PjYqFfnl1d3p/f4F8c2tkYWNob3N2dXJubG51fISKjI2LhoaIjZWan6Kgnpybl5KKgHl1c3h8fn12bWViY2lvdXZ0cW9yeIKNl5mWkIqEhYqSmZuXj4J6dXh+houIg3dtZmZsdX2DgXxzbmlpb3V5eXRwbGpvd4OMkI2Lgnt7fYSNlZiZlY2IhIWHiouJhoF8enh7gIaJjY2LiYeGhoKAe3p9goqOkY2CenJvcXZ/goWDfnp7go2Yn5ySf29obYGZrraqjGdDOEVojaWli2VDOUdpj623qZBxWVFfeZq0uKiLbVdVZX2QnJWEcF5UV2R2iZSTinRfUVFcc4meo5+PfnJtcn6MlJSPgnZvcnyKm6OilIBqXl5rg5ysrp6BZlxmhaW9uqV+XUlPbJO0xb2jfl9RW3aXrq+dgGdeZ3yUpKSUeWBUVml9jJOMfWxiYWp6hYyJgXdubnWAio6LhX11b2xucXN1eHd4fH+FhIN/fHt+hYuSlpWSjIiEgoGGiIqHhH16en6ChYiHgXt2dXd5gYOGioeGhYaFhYF+e3Vyc3d+ho6SjoZ8cnB3hJGbm5GDdXB0g5WjoY1tTDYzSmuSq6+adlVBRF+FqsDArY91bHOJoLG0pYtwWFNdcImWmIdrU0VGWHOKl5SHc2VhanuOmpuRfmxgYGp8jZiaj35uZGZ0iZ2nqp6Ne3N1f4yYm5OEdGhmb4SetLyykmVDNUhxosbRu4tVLS1Rh7nW07OFWkhTeJ+5uqKDYlNbdZOjnIFcQDhIZ42nrZp7XU5SaIKXopqHdGt0hZOUi3dkW2BziqCnn4dwXl1wi6a1rph4YFdiepWmoYxuVkxXbY2gppZ8ZllidpWxvbSad1pQWnKOo6WVeF1PWm+LoKSYgWlgaoWpvsGvkXBbVWiEnaegi3BZUFdthpqimo18cGdgXl9peY6jrqmQak1BT3Ojx9XDmmpIRV2FqLirimVLSVl0jpmTgWlWU150jqWuqZuEb2VmdIaVmpaId2xpcHl+e3VtZ2pxgIyYnJydmZaRjoiEg4aLjYyHeW5pZ255goSBeXFtb3qJl5+dkH1xbXaImqOfjnpqaHSEkpGAaldTXnWQoJ6Mc2BgcI2iraaUemNbX3CAioqCdWdfYmp0eXVvaWdxhZyttKiUfXBueIWUm5WId2lnaHJ4fHlxaWdrdYWVoqelm5GIiI6Vm5uWinxuZ2lyeXp0bWJfXGN2ipyin5CFe3qFl624spx+YlVXZ4Wep5l7V0RBVnmetradeVlLVnSZs7yti2ZLRVh4lq2snH9kVVlyjKOsoox3bXKEmZ6QbEgxNVWBqbqpfE0xOV6TwNXLpXphXXeTqqyehG1jZHOCio2HeWxlZW18kJ+oo5F5Y1pecoygpZmBa1hXYXWHlJSNgnh2e4iXoqihkX5uZmp3hY2IeWNQTVhwiZqglYVxa3CBlKSqp5yNgXx5enp2b2tpbneEkZqZjXZiWmJ0kay/wbKUdWBaZnmNmZuNeGFYWWJrd3h4dHJ4hZWjqaCOdGFbY3eOnp6TeV5MSFJqh5yqppyMgn2AiI6PjIN8e32Ejo+HdmBQSlRsh56pqJaCcW13hpGXkYh6dHeFlp6bi3VcUFNriKe2sZt+ZV5uiaOwrZZ7Yl1meYiNgnJiW2JwgY2Nhnt1fIiYoKCVhXVra3WCjpGJfWxgWl5pd4GIiYWEiI+YnJaKem5qc4SSmpKDbFxTVFxmbneEk6KomHdOLSpMhsHn5bhxMho1c7ni6caKTjNBbJ26vaaBX1Ndd5Kip52Me29rcHuMmqWnnIpyXVRaaX2QmZiNfW5lZWlzfo2ZoKCakoqFhYaHhH12cXV7gYF5al1WW2yDmKKgk4d9eoGFiouKi4eHgntuYl1icIKTmpR+Z1tfdZWwwLmfeFtPXXyetbOXcEk2PFl7mqaZfmBRVm2Prbuyl3lfWWZ8laKejnptaG97g4d/dHB3gpKdoJiJenJyeIGKioeBfHp5eXl8fICDh4qMioeDfH58fnp3b2pnZWZrdH2FjpOTkIZ+e36Jk5ublIZ3bWxye4B+d29sb3eGj5STkIyKiYqGgoGAhYqQjYJuXFBSXneOnZ6Oe2llaHyRpaynl4FvZ2x7i5eZinRcT1FgfJWmppmBbmZtfZKipJ+SgnJqaGt0eH18fX2DiI2Mgm1YTVh2nMTYzKJsQTtbkMPf1a5zQy89Y4mkppqBbmVseIOFg3x3dXqAiJGVlZKId2haVVxqfpKdnZWDdGpobXN7ho6UmZqcmJGFe3BrbHeHm6iqn4RiRDpEZo2wv7aWblBHVnOOoaSZhndwcHR4eXRydHZ9gYeJiouJh4Z/foCGkpiakoFzamhveYCAdWdeYWp9jZmZj4R8eYGIlJaViHxwbGx3gYmMhXltZ2l0hZekp5+Sg3RsbXN6hIuMin93bm5vd4GGi4uLjo2Ni4R9d3V8h5GVjnpnUk5bcIyhp5yGb15gaoGUoaGVhXhydX+KkI2Abl9cZHWLnaOdinRmZ3GDlZyYjX9zbW9xd3d5en6EhoaAeXNwdH6KlpuYjYN7dnl/g4SFgX59f4OGh4B7dW9yeISQmJmTiX5xbG5yf4iPko+EeGphYGZzhJafoZqNfHJtcoGSoaqonYp0YmBnfZKck3dTNTFIc6nS2bh8QSUzaKnZ6diobD8tQGCBl5uTgHBsbniAg4KAfH2CjZqkp6OZhm5aT1FgdIqXm414YFBOW3KOpbKypJB9dXZ9iIyJfHBrcHyPmJN9X0hBUHCavtHLsY1sXFpne4yWmpiOh3tuY1tdZnOBjJSUjYmFhYeHhH54dnd/ipKWkYd2ZVpaX3OHlp6bi3hpZG1+lqevqZWCbGJgaHR/iYuKgnlwamhocXuJl6CelYZ2bGp0hZmjn4prT0JLZYiquLCSbFJPZoiqvbihgGZaYnKCiIF3aWpyg5ScloNxZmh4kKu0sZt+Z1xjcoaTkYVvXldgcIOSmJOIgn+Gj5mdmpSLhHx1b2ZlZ3OBkJONeWJQTVt5nbfDtpx6Yllieo+dm453ZFdYYm56f4F+fHuCiJKVlpGIgX59g4mQkpGKgXJqX15janeEkJaUjoR5dneBjJignpaGdmZfXmRve4eNjomBeHJvdYCMmaKjnpaMgn57foB/fnh0bW1wd4KOlZiPfWdRSVJrkbPIwqFwQiowUYCtytC4kGlPR1JkeZGhqq6qnYp0YVVYZXmQnqagkYJvZWBja3mGk5iZkYd6bWdoanB2foSJjY+PjIZ+d3Fxd4CNm6SooI10WUZDUGuPrb67pIVpXF5vhJSamJCGgH59enFnXFpjc4mfqaiahnFmZnSFmqKhloRxY15haXN8gYiMioqGfnl3eoKQnqSgk4FrXFlfa3mEh4eAeXVydHZ5gIaQm6WnoZF6ZFRTXnSPpa6plXhaSklcfJ+8yb2hfF5RV3CNo6eXemBPUF93jJiViXpwbneBj5ialYyBeHJwcXR2en2BgoOEgX97d3Z6f4SLj46KhYB6d3Z1d3t/hYeJiIJ8enuBiI6PiH91cHN/jJeZjoFuZGRvgJCYlYl8cm51foaLiYF4dHZ9iI6QiXxwZmZtfY6coJmHc2BYW22Em6urnolxYV1me46hpZ+RfW5naG95f4aHhYODgoODgHx7fIOKj5KPh3pvbHF9ipCOhnZrZGZygZKdpqWfkn5pVEpOYICgur2kd0krLEyCt9vfxJVhPz1Rd5qxsJ2AZ1laZXN/hoaFg4aJjpGOh395dXV3e36AgIF+fHp0cW9wdoOQm6CelYqBe3x8fXl2cnZ8h5KViXVcT01gf6O9xraZdl9WYHWKm6Gai3xsZGBkanN/i5OamJSIfnVzeoCNlZmSi352cXB1e3+Bfnx5en+DhIF9dXJzeYWRmJeOf3NoZmp0gYuRkIuBeXFubnV+iZSZm5SKgHdydX2GiY2IfnZubXB3fYGEg4SCg4aGhIJ/fn+AgYF8eXRzc3l/g4aEgn9+goWMkpWUkId+d3Jxd3yEiIeAeXFubXWAiI+OjISAfYGDiIeEfXNxcHd+houKhoB7eHt7gYOHhYiJi4uKhX10bmtud4KNkJCEenBucHyGj5GOh395enx+gX56eHV2e4GHiYeDfHl1eHqCiI6QjIV7cWtsdH+MmJuWi3twam11gYyTko6GfXp1d3h6fHx9foKIhomGgHp4d3uDjJKVkYqAdnBxd36Fi4uJgHlzcHR9iZKYlpCEeXNyeoWOj4uAcmViaHSEkZSNgnRsbHSCkZmYkoV7b2ttb3Z6f4KFgn95eHd5fIOKjI2KhH9+fYF/gHx6dnl9g4qOioR8dHJ2gI2WmZKEdWllbHqJlZuXiHhrZ2x5hpSalYp9cm1yeYaQlJCIfXFwcnmFjJCMhnpzcXV6hImMioF8dHR1en+Gio2MiYR8eHJydHuCiI6Mh393cnN1fYOGi4qKiYaEgX53dnV0eoCEh4aAenRwc3iAh42NioZ/fn1/gIF9enl2eX+CiIeDf3x4eX6FiIyMiIWBfnt8e316fHp9fYKDhoaEgHt7e32DiIuMiYN8eHd4foGGh4aDgH9+gIOFhoWAfnl4enuAhIaEg4B8enp7foGDg4OBf39/gYGCf4B+fn5+fn5+gIGChIaDgX15d3yAiI2Oi4R5dW9zeYKHjIqIgn57en1/goSGiYmGhX55dHJyd3yEhoiGgX14eHl8gIaHi4uMioSBenVwcHN5gYiLjoiDfHl5eHyAg4OEgYKAgYB/fHp4eHt/houLi4eDfXt7fYOGiIiGg356eHZ6en+EhouJhoF9eHl8gIeLjIqGfnh1dnd8gYWGgn97enx/hISGhH17en2BhIaHgXx2dHd8gYiJhYF6dHR5goqQkI2DenJxdXyEiYuIgnp1c3h8goWGhoWCgX9/fn5/fX5/gICCgIKAfn59fXx9fYKDhoaFgX97enp8f4KGh4mFgoB7e3t9f4KEhIOBfH17foCBhIOCgX5/fn+Ag4GCgYGAgIGBg4GCgoGBgYKCg4OEhIKAgH5/f4KAgn99fX19gYGDgYB+fX1/goODgn57eXh6f4OEhYF9enl6f4SHiYaDfHh1eXyCh4mIhH94dXR5fIOIiIeEgX19foCDgoB9eXl6fYKChIF+e3t5fYGChYaEg4GCf4GCgYCBgIGAf39+fn5+gn+BgX5/fn+Ag4WGhYOBfXt7fX+Bg4OCgH19fXx/gYCCgoOEg4KBf31+gIOEhoWBf3p5eXt/g4aEg4F+fX5/goWEg4SBfnt8en2Bg4aHg4B9enp8gYOGh4WDgIB+gIF/goB+f39/f4OCgYCAfX6AgIOChIF/fXx9f4GFg4SAfHl7e4CFh4aGg355e3x/hYWIhYJ+e3p5e3+Bg4OCgH18e31+goOFhoSCgH+Af4CBgoB+fX58fn+BgIGAgH5/goKFg4SAgX5+fX9+gIKBgH18eXp7fYKDhYWEgX9/fYB/gYCBgICAf4CAf4B/fn19f4CAhIOFg4KAf359fX+AgoGDgIJ8fHp5e32BhYWGhYN/fX18fYCBhISBgH98fXx9foGBhIOFhIOCgYB/gICDgoSBgH59fHt8fX6Ag4WGhoSAfXx9f4SIiYeEfnp4d3x/goSDgX97e32AgYOFg3+Bfn9/gIKAf356ent+gIGDg4F/fn19gIGChIKCgn+Afn9/f36AfX99f4CCgYKAgX5/gICCg4OCgX9/fn1/f35/gICAgYGAgH9/gICCgoODg4CCf4CAfn9/gIGAgoGBf35+fn+BgoSEgYB/fn1/gYGDgYJ/f36AfoF+goCDgIGDgYGBgYGBgoCBgYCAgICAf4B/f35/fYCBgYKBgX99fH99gYOBgn9/gH5/f4GCgH+AfoCAgoKBgn5/f359f4KBgYCBgn6Af39+fn+CgIGBgn+BgICBfoB/fn9/goGAg3+AfX5+f3+BgoKBgYKAgICAf4CBf4GBgH5/fn5+f4GBgYGBf3+AgIGCgYKAf39+fn6AgIB/gH6Af4CBgYKAgoGBgYCAgYB/f39/f4CAf4B+f39/gIKBgoKCgn+Bf35+f4CBgIKBf35+fX9+g4OBhICAf39/gICBgn+AgH9/f4F/f4B+f36AgIKCgoGBf39/f4CCg4KDgn9+f4B/gYGAgYF/gICCf4OAgoKAgIB/gICBgICBf31+fH1+f4CBgIGAgIB/gYCBgoGBf4CAgH9+f32AgICBgICAf4B/f4KAgYGAgYGAf39+fn5/f4B/gIGAgH+AgIGAgoCAgoGDgYF/f39+foB+gYKBgX5/foCAgYGCgoGBgH9/fn6BgYCBgYCAgH2AgICCgYGBf4B/gIKBgYCAf35+gIGCgoGAf35/f4CBgYGCf4CBgICBgoB+fn9/gIGBgn+Af35+gIGCgoOBf4CAfoB/gYGBgH+Afn5+foGAgYKBgYCAfn9/gIGBgoGBfn99f3+AgYKBgn+AgX+CgICCgIGAgX+Af4B+gIB/gYCBgH+AgH+AgYCBf4GBgICBf39/fn+AfoCAgYJ/gX+AgIGAgIKAgH9/f4CAgICAgH9/f4B/gIKBgYJ+gX9+foGAgYCCf4F9fn5/gIGCg4GBgH5+f3+Bg4KBgH9+f36BgIGAgIB/fn+AgYCBgH9/fn+AgYGBgYGAgH9/gH+BgYOBgX+Afn5/gYCCf4CAfoB/gYKDgoCBfX9/gH+CgYKBf35+f36AgYGBgIF/gICBgYGAgX+AgIB/gH+BgH+Af4B/gYCBgn+CfoB+gX+BgYKBgH9+f4CAgIGBgoCAgH+AgH6AgIGBgYGBgH9/f4CBf4KBgICBf3+Af4CBgICBf4GAf4F/f4CBgICBgH+BgIGAgIF/gX+AgICAgIGAgX9/f4CAgIB/gYCBf4B/gH+Bf4B+gH6Af3+Bf4GAf39+gIGAgYCBgIB/gH+BfoCBgH+Af4CAgICBgICBf4GAgIKBgoCAf4F+gH+Bf4F/gX6Af3+Bf4GBgYCCgYGAgIF/gX+CgICAf39/foCAgYCAgX+BgIGAgoCAgH9/gYCAgIB/f39/f3+AgoCBgICAgYCAgIGAgICAgICBgIB+gH5/gIF/gYGAgX+BgICBgH+BgIGBgICAf4B/fn9/gICBgIGBgIB/f4B/gIGCgYB/f39/foCAgoGAgH+AgIGAgYGBgX+AgH+Af4GAgH+AgICBgICBgYGBgICBgX9/gIF/f4F/gYB/gYCAgYCAgICBgoGAgIF/f3+BgICAgH+Af4F/gYGBgICAgH+AgICAgIGAf39/foGAgICBgYCAf4GAgICAgYCAgH9/gH+AgICAgX+AgICBf4CBgYF/gX+Bf4CAf3+Af4B/gICBgICAgH+BgYF/gn+AgH+Af4CAgX+BgH+AfoB/gICAgoGBf4CAf4B/gYCBgH+Bf39/gIB/f4B/gYCBf4F/gICBf4CBgX9/gYB/gH+AgICAgIB/gIB/gIKBf4GAgIB+gICAgH+AgIB+gICBgIF/gIGAgICAf4GBgX9/f4GAf4CBgYB/gICAf4CCgH+Bf4CBf4CAgICBf4CAgICAgIF/f4CAgX+AgYGAgX+AgH+AgYF/gYCBfoB/f4CAgYB/f3+BgH+BgH+Bf4CAf4CAgX+Bf4B/gH6AgX+BgICAf3+AgICBgYF/gYB+gIF/gYCAgYB/f4B/gICAgICBgIB/gH+AgIGAgX+BgH+Af4GAgIGBf4CAgICAgIGBf4CBgICBgICAf4CBgYCAf4GBgH+AgIGAgICAgIGBgICAf4GAgICAgYCAgH+BgIGAgICAgICAgYCAgYF/gICAgICBgIGAgICBgH+Bf4J/gn+BgIGAf4GAgIGAf4CAgICBgYCAgH+Cf4CBgIGAgH6AgIB/gICAgICAf4CAgICBgYB/gH+Af4CAgYB/gn9/f4CAf4GBgIF/gH+Af4CAgX+AgIB/gIB/gYCAf4F/gIGAgICAgX+Af4B/gICAgICAf4CAgH+AgYCAgX+AgIB/gYCBf4CAf3+Bf3+AgICAgX+BgH+BgIGAf4GAf3+Bf4CBf4GAgICAf4F/gYGAf4KAgIB/f4F/gICAgX+Bf4B/gIB/gYGAgIF/gICAgH+BgICAgICAfoF/gYCAgICBf4F/gIF/gICBf3+BgICAgYB/gICAgIGAgH+AgIB/gYCAgICAf4CAf4GBgIB/gIF+gYB+gYB/gYF/gICAf4J/gICAgICAgICBgICAgIF/gIGAgICAgX+AgICAgIF/gYCAgICBf4GAgICAgH+Af4GAgICAgICAgH+AgH+BgIF/gIF/gH+Bf4CBf3+BgICBf4F/gH+BgYCAgIGAf4F/gICAgYCBgH+BgICAf4GAgICAgX+BgH6Bf4J/gIGBf4F+gn9/gYF/gIB/goB/gH+AgICAgICBgIF/gICAgIF/gYCBgH+AgH+Bf4GAgIGAgIF/gIF/gYGAgICAf4GAgX+AgICBfoCBgX+BgIB/f4GBf4GAgICBf4CAf4CBgICAgICAgH+Bf4GAgIGAgH+AgX6BgICAgIB/gICAgICAgIGAgIF/gYCAgX+AgICBf4CAgICAgX+BfoGAgICBgICAgIF/gICAgICAf4CAgICAgH+Af4F/gICAgICBgH+AgYCAgICAgH+AgIB/gYB/gICBf4CAgYB/gICAgH+Bf4F/gX6Bf3+Bf4GAgICAf4CAgICBf4CAgH+Bf4CAgIB/gYB/gIB/gICAgX+BgH+AgIF/gH+AgYB/gICBf4CAgYCAgICAgX+Af4GAgICAgICAf4CAgICAf4GAgICAgYB/gICBgH+AgH+AgIF/gICAgYB/gH+BgICAgIF/gICBgIB/gX+Bf4F/gIGAf4GAgICAgICAgICAgH+Bf4CAgICAgIGAf4CAgIB/gYGAgIB/gICAgYB/gYCAgICBgX6CgIF/gYCAgIGAf4GAgH+AgICAgIGBf4CBgICAgIGAgICAgIGAf3+AgIF/gICAf4F/gYCAgIGAf4GAf4GAf4F/gIB/gX+BgIB/gX+AgICBgIGBf4F/gICAgH+CfoCBf4GAf4GAgIF/gIGAf4F/gIF/gICAgH+Bf4B/gIB/gIGAgICAf4J/gYCAf4F/gICAgIF/gICBfoGAgYB/goB/gICAgICBgIB/gICBgH+AgICAgICAf4GAgICAgH+BgICAf4F/gH+BgH+AgICBgICAgIGAgH+BgIB/gX+Bf4GAgICAgICBgICAgICBf4F/gYCAgIGAf3+AgICBgIB/gX+AgX+Bf4F/gICAgICBfoCBf4GAgIB/gX+AgIB/gYCBgH9/goB+gYF/gICBgH+AgX+AgICBf4GAgICAgICAf4GAf4CBf4CAgH+Bf4CBf3+BgH+AgIB/gIF/gIB/gX+Af4CAgYCAf3+BgIB/gn+AgICBf4CAgX6BgICAgICAgX+Bf4GAgICBf4F/gIF/gX+AgX+Af4CBgIB/gX+Bf4F/gYB/gX+AgIGAf4CAgICBf4CAgYCAf4GAgICAgIF/gIGAf4CBgH+AgYCAgX+BgH+BgICAgICBgICAf4GAf4GAgICAgH+AgIF/gYB/gX+AgICAgYB/gIF/gICBf4CBgH+AgYB/gYCAf4GAgICAgICBf4F/gYCAgYCAgH+BgICBf4F/gICAgX+BgH+BgH+Bf4GAgICAgIF/gICAf4CBgICAgIB/gYCBf4CCf4F/gIGAgICAgIGAgICAgICBgH+BgIB/goB/gYCAgICAgICAf4GAf4GAf4GAgICAgX6BgH+AgYCAgH+Bf4CAgICAgICAf4CAgICAgICAgIF/gICAf4GBgH6BgX+AgIF+gIGAgICAgH+Bf4CAgH+BgH+AgH+Bf4B/gX+AgICAgIB+gIF/f4CAgICAgH+Bf4B/gICAf4CBf4CAf4CAgICAf4CBf4F/gX+AgX6AgX+AgYB/gX+AgICAf4F/gICAgH+Af4F/gICAf4CAf4F/gIB/gX+AgH+Bf4CAgICAf4F/gYB/f4GAgICAgICAgICBgICBf4GAgICAgIB/gn+Bf4CBgH6Cf4CAgX+AgICAgIB/gYCBf4F/gICAgIGAgH+AgX+Bf4GAf4CCf4GAgICAgIGAgX+AgYCAgYB/gIGBgICBf4F/gYCAgIGAgIF/gX+Cf4CAgIGAf4J/gX+AgICBgIB/gYB/gYB/gYF/gIGAgX+AgYCBf4CBgIGAgICAgYCAgIJ/gIF/gYCAgYCAgIKAgICAgIF/gYB/gICCf4CBgH+AgYCAgH+BgICAgICAgX+BgICAf4CBgH+Bf4CBf4F/gX+BgIGAgIGAgIGAgICAgIGAgICAgICBgICAgIGAgICBf4CBf4CBgIB/gICAgIB/f4GAf4CAgX6BgH+AgX+AgX+AgIB/gH+BgIB/gICAgICAf4CCgICAgYCAgICAgICAgH+AgICAf4F/gX+BgX9/gX+AgH9/f4B/gH9/gH+Af4GAgICAgICAgICBfoGAf4CAf39/f4B/gICAf3+BgICAgn+BgICAf4CBf3+Af4B/gICAf4CAgICAgIGAgIB/gX+Af39/gIB/f4B/f4CBgICAgICAgYCAgICAfoB/fn+AfoF+gIF/gICAgoCAgoGAgIGBf4CAgICAfn+Af3+AgH+AgICBgX+Bf4GBgX+AgICAf3+Bf4B/gH+AgH+Bf4CAgIGBgICAgYCAgH+BgX+AgH+Bf4CAgYCBf4KAgIGAgYCBgIGAf4J/gIB/gH+Bf4CAgIGAgYCBgYCBgYF/gn+BgICAgICAfoF/f4F/gIGAgIGAgn+BgYGAgIGAgIB/gYCBf4CAgIGBgICBgn+CgIGAgYCAgICAf4F/gICAgX+BgICBgIGAgYCAgIF/gYCAf4CAf4CAgH+AgYCAgICAgYCBgICBgICBgICAgX+AgICBf4CAgICAgYCAgIF/gYF/gIF/gYCAgX+AgICAgX+BgICAgH+Af4GAgH+Bf4F/gICAf4CAgYCAgIB/gX+BgICAf4GAgICAgH+Bf4GAgICAgICAf4CAgYF/gICAgIB/gYB/gICAf3+BgH+AgIB/f4F/gIB/gICAf4CAf4CAf4CAgH+Af4CAf4F/gICAgH+AgYCAfoCAgICAgICAf4B/gX+Bf4CAf4CBf4CAgICAf3+AgH+Af4CAf3+AgX9/gICAgIB/gICBgH+Af4F/gICAf3+Bf4F/gH+AgICBgICAgIGAgIGAgICAgIB/f4GAf4CAgICAgICAgX+BgICBgICAgICAf4CAf4GAf4CAgX+AgICBgICAgX+Cf4CAgICAgX+AgIB/gYB/gYCAgICBgYCAgIGAgYB/gIF/gICAf4CAgYB+gn+Bf4CBgX+AgYB/gYCAf4F/gICBf4CBf4CBgIB/gX+BgH+BgH+Agn6CgH+AgYCAgYCAgYCBgICBf4CAgH+BfoCAgIF/gICAgIKAgYCBgICAgIF+gX9/gH+AgH9/gX+AgYCBgYGAgIKAgYB/gYCAf39/f4CAgH+AgX+BgYCBgIGBgYCAgYCAf4B/gH+AgIF/gICAgYCBgIGAgICBf4CAf4CAf3+Af4CAgIGAgYGAgIGCf4CBgYB/gH9/gX9/f4CAgH+BgICAgYGAgn+BgYGAf4GAf4B/gH6Af4B/gICAf4GAgICBgYCBgIGAf4GAgH9/f3+Af3+AgH+AgICCgIF/g4CBgYCBgX+AgH+Afn+Bfn9/gH9/gYGAgIGBgYKAgYF/gICAgH9/f36Af31/gIF/gICCgIGBgIGAgYCBgH9/f4F+f39/gH+AgIGAgYGAgYKAgICBgIB+gH9/fn+Af3+Af4GAgYGAgoGBgICBgICAfoB/foB+gH5/gICAgICCgIGBgYCBgICBf36AgH5/f39/gH+AgYCBgYGBgYGBgICBf4F/f39/f36AfoCAgICAgoCBgoCCgYGBgIGAfoB/foB+f39+f4F/f4GBgIGCgYGBgYGBgIB/gIB+f39/foB/gIF/gYGAgoGCgYKBgIGCf4CAf4B+gH6Bf39/gYB/gYCCgYGAgYKAgYCAgIB+gH9+f3+Af4CAf4GAgIKBgIKBgoGAgYCAgIB/gICAf39/gICBf4GAgYGBgoGBgYCBgYCAf4CAf4B/gH6BgH+AgYCBgIGAgYKAgYB/gX+Af3+Af3+Af4CAf4GBgIGBgYGBgIKAgYCAf3+Bf39/gH9+gICBf4GBgIGBgYGAgoGAgYB/gIB/gH9/f4B/f3+AgH+AgIGAgIGAf4GAgH+AgX9/gIB/f4B/gIB/gICAgICAgYCAgH+BgIB/gYB/gH+AgICAf3+AgH+AgICAgX+AgYCAgICBf4B/gH+AfoCAfoB+gH+Af4CAf4F/gYCAgIB/gYCAf4CAgH5/gIB/foF/gH+BgH+CgICAgIF/gYF/f4F/f4CAf4B/gX9/gICAgICBf4GAgIF/gIB/gICAf4CAf3+AgIB/gIGAgH+BgYCAgIGAgICAgICBf3+Cf3+BgH+AgIF/gX+AgYF/f4GBgICCfoKAgICAgYCAgIB/gYCBf4CAgIF/goCAgIGAgYCAgIGAf4F/gH+AgH+AgICAgIGBgIGCgIGBgYCCf4CAgIB/gH+Af4B/f4CBgIGBgYCBgoGCgYCCgIGAgH+AgIB+gH+Af4B/gIGAgICCgIGCgIGAgYCAgICAf39/gH9/gX+AgICBgYGAgoGAgYKBgICBgICAgICAf4CAgICAgYCCf4KBgIJ/goCAgIB/f4CAfn9+gH6Af4CAgYGBgIKBgoCCgYGAf4B/f39/gH5/f4CAgIGAgIGCgIKBg4GBgIGAgIB/f39/fn9+f39/gX+AgICCgICBgoCAgICBf3+AfoB/foB/f4F/gICAgYCBgYGBgYCAgIB/f4B+f39/gH6BfoCAgIGAgn+BgIKAf4F/gX9/f36Af3+Af39/gX+Bf4F/gYGBf4GAgICAf4B/gH6BfoB/f4B/gICAgICAf4GAgH+Bf4F/gX+AgICAfoF/gH+AgX+AgICAf4B/gIKBgICBgX+Af4GAgYKBf4CAf39+f4GAf39/f39+f3+BgIGBgYGAgICAgYCAgX+Af39/f399gX9/gIKAgIGCgIGBgoGCgIGAf4CAf4CAfn9/fn9/gICBgoF/gn+AgIGBgYKBgIB/gH9+gIB/gICAgX+AgICBgYCCgoKBgYCBf4CAgIGAf39+fnyAgIGBgoKBgH5+f4GChYSEg4B7e3t7fYKDhYKBf3t8e4KEiImHhYF9fXyAgoaDgnx7eHp9goSEgX58e36ChIeGhIB8e3t/f4KCgX1+e32BhISEgn99fYCBhoiGhH96eHl8f4SGhYSBgX59fX6Cg4OGh4SDf3x4eXp6f4KDg399ent7fYGEhoWEgX59fn+Bg4OCfn16fX2Bg4WFgoJ/f3+AgYOEhIN/fnt7ent+foKEhIOBgX9+foGAhIOCgn59e3p6fHx+gIGCgoSCgIB/f4CBgoWFg4F8eXl6fYGFh4WBfnx5fIGFiYmFgXp1dnd9g4aHhH56dnZ5gYiNjYmCe3Z2eIGHioiFfnh1dnuChoiGhH97e3x+g4SDg39+fn5/gH+AgH+AgYODgYB9fHp9f4GDgYB9fHx7foGEhISCgH5/gICChIGBgYCBg4OEgoB9en1+gYSGhIF9eHZ6fIKJioqEfHh1d3yFiIyIhX95dXZ5gIOHhoSAfXt5e3+ChYaFg4B9fHx+gIGDhIOAgX+AgoGDgYGAgX+BgoKCgX59fXt9fX+AgYCBf4CBg4OEg4F+fX9/g4OFg4J/fXx5enx/gYSGh4SAenV2eYCGjY2Ig314eHd8gYaHh4WCfX15fH2BgoSDg4J/f39/goGAfn58e32Bg4aGhIF9e3x+goeIiYeBfXp5e32AgIF9fXt+gIGDgH96fH6ChoeJgoF9fX+CgoN/e3l5fICFiIeDfnt4en+Gh4mHg4B8en1+gIKCgIB/gICBg4OAf319gIKFhoWCfnl3eHp/gYaDg356enp9gIOEhIOEgYCAfn+AgIGBgoOBgH5+fH5+gYKBgoGCgYCCgoKCgX5/gH+CgIOCfn58fH1/gICBgYGAgIB+fX5/fn+BgoOBgH99fX1/gYKDg4OBgYB/f3+AgIOCgYCAf359f4CFhYSCfXh4eH6EiYqIgXp0c3iBh46LiIF6dHN4fIaLiIeBfHd5fISGiYaCfnt8foOFhoN9e3l6foCDg4F+fX1/goKCfXp3en6Ei4qHfnZycXuEjpKQiX10cXV8ho6RjYV7dXN5fYSJioWCfXl5en6AgIOEgYKAfXd3d3yAhIeHhH98eHl9foOCg4KCgYGDf39+fHx+hImNi4h/dnV3f4WLi4iDfXZ3eHyBgoSAfn17fH+AgYGBgYF/f35/f4CAgYKBg35/fHt8gIOHiIaBfHt7f4aLjImFf3t2dnp+goaHgX96d3d7f4GEhIWDf31+foCCgoGBgYB9e31+g4WGhIOAfn19f4CEh4iJgn54dnR7gIWJiIV/enl7f4SEhIJ8e3t+g4aFgHx2dnh+goeIh4N8ent+goeGhYKAf4GDh4WDf357fH2ChIaGhH97eXh7foGBhYOBfXx5eXt7gICFhYSCf319fYCBg4SEg4KCgYB/fH17fX+Fh4mIg355eHh+hYiMh4F8enp9goGDf317ent8gISFhIJ9enl4fICEh4eHg4B7fX1/gYOEhIOEhIN/fXx5fX+EiIaGgnt4d3h7gYOIhYF+enl4fICChIWEgX59fn2Cg4aEg4B/fH5/hISEhIB+fXp9fYOFhoeDgX56eXp/goaIhoJ9eHd3en+DhIKAe3t7foGDhoSDgHt8fYGEhoWCgX59e32BgoaGhoKAfHx9f4KEh4SEfn58fH5/gIB/fH18foGCgoF+e3p8f4KEhYeDgIB9fX1/f4KCg4R/gH19fX5/goKFhYSDgH99fYCAg4KCf359fX1/gH9/f39+gIKCg4CBf4CAgYCAgX+BgIGDgYB+fXx9f4GEhYaCgn99e31/gYGCgYGAgX98enl5fYCDh4eGhIF/fnx8gIOFhoOCfXx7e39+f39/gICAgoCEgoSDgoKAgYKBgoB/fH57fHx9fn9/gIB+gYKCgoKCgYB/f4B/gYGAgH9+fHx+gIKEhISDgn9+gYKFhYaBgHt7e3x8f4F/fn17fX2Bg4aEhIKAgX+BgYCAgYB/gIB/fn17e3p8f4OGhoWDgYB+gIOChoWDgX99e3x8fX59fn5+gIKBg4OAgH9/f4GDg4SDgn9+fXt8e35+gIKCgoCAf3+Ag4SFg4OCgYGBgYB+fXt6e31+gYKDgIB9fH1/gYaHhoWDf3x9fn+BgYF9f3x+f3+BgYF+f3+AgoOEhIGCf4B+foB/f4B/foB/gYCBgIB+f4CBgoSFg4B+fnt7f4CCg4KAfXt7fH+ChISEgn9+f4CChIWDgn9+e31+f4GCgYB+fHt+f4GChIOCg39/f4CBgYKCgoF/gH59fH19foCCgoODgH9/fX9/gIKChIKBgIB8fn2AgIGCgoKBf4B+gIGAgoKAgIB+gICBgYB/fXx9fX2Bg4aFg4F/fX2AgIOEhoOBgHx7fH1/f3+Af35/gIF/g4CBf4CBgoSCg4J/f35/foF/goF/gX+Af4CAgYGBgYCCgICAf39/fX+Af4CAgoGBgIB/f35/gIGDgYCAfn59fX6BgYCDgoGAgH+AgIGCgYODgoKBf36AfX6BgIKBgICAfn59f39/gn+Bf4B/fX99foCBgYOBgH9+gIGChIOCgYCAgICCgoGBgXx8fHx9foGBgYB9fn5/gIGCg4SCgoKBgYCBgH9+fn9/gIB/f359fX9/goKBg3+AgICAgoGCgX9+fn1/gYKCgYCBfn5/foKCg4OBgYB/fX59fX5/f3+AgH5+fn5/gIKDhISFgoKAgoF/gIGCgH+Afn19fX59f4B/gICAgYCDgIOBgYCAgICAg4GAf358fH6BgIKCgX9/fn6BgIKDgoCBgH9/f4CBgIF+f4B+gIKBgYCAf4CBgYKCg4KAgH5/fX9+f4B/gX5/f35/foCAgoSCg4GBgYGCgIKCgH5+fn5/gX6Afn9+gICBgIKBgIOBgIGBgYF/gH9+gIB+f39/f4CAgIGAgICBgYKBgoKBgX9/f39/f4CAgIKAgICBf4CAgIKCg4GBf36AfX6AgH9/f359fn6AgIKBgIJ/f4KChIKCgoCAgH5/gH+Afn9/f3+AgYGBgYCBgIODgoGBf39/fn+AgH9+fX9+fn+AgYF/gX6BgIKBgoGCgH5/f3+BgYGBgH+CgYCCgX9/gYCAgoJ/f318fH5/gIB/f39+gIGCgoODgYGBgYGDgYCAfn99f35/fn1+f36BgoODgYGBgIGBg4KEgX5/f319f39/f36AfYGAgYCAf4CAgYCAgYGAf31/gH+CgYGBgIB/goKCgoOAgIF/gIB/f39+fX5+f31/gH6Bf4KDg4ODgIKAgoKDgoB/fX17fX6AgH5/e3x9foCCgoOEgYGBgoGEhIOBgn+AgICAgH9/fn5+f35/gH99f35/gIGAgX5/gIGAgoOBgoF/gYGCgYOBgH5/gH+AgYB+fn19f3+AgIJ/gH6AgYKDgoKBgX9/gYKCgoF/fn1/fYCAgH9+fX5/f4CBgH+AfYGCgoODhIGBgIKBgoOCgoB+fn5+f39/f318fH5/f4GBf4F/f4OChIODgoCBgIGBfoB+f31+f4B/gH9+f3+BgoSEgoCAf4CAgYKAgYB+fX5/gICAgIB+gX+CgYOCgIB+gH6AgIB/fX58fn6AgYGAgX+BgYOEhYWEgYF/gYCBgH9/fXt8fn1/fX9+fn+AgoOChIKCgYKBgoF/gH9+fn9/foB+fH1+gICDhIOCf4CAgIKChIGCf4B+f4B/f39+fn5+gICBgoB/gH+AgoCDg4CAgH9+gH+Af35+f4CAgIKAgH9/gIGBg4OCgYCBgH9/gH+Af4B/f39/gH6Af4CBgoKCgICAf4GAgIB/gH5/f36AfoB/foB/gYGCgYKCgYKDgoGCgYGAf39/f39/fn59fn9/f4GBgH9/gX+CgYGBgYCAgICAgX9/f39/gYCBgYCAgX+BgYKDgIF/gH5/f4CAgIB+f36AgICBg4GBgYCAgX+AgICAf39+fn5+f35/gICBgoGCgoGCgoGChIKAgIB+fn9+f35+fn1/f4CAgIKBgYCDgoOCgYKBf3+Bf39+fX59fX99gYCBgICBgoGBhIOBg4CAf4B/f39/f31/f4F/gICBf4CBgoGCgYCAfn+AgIF/f39+f39/f4GAgoCBgoCDgoCCgIB/f4F/f39/fYB9gICAgoCBf4GCgYKCgYCAf4F/gH9/f3+Afn9/f3+AgH+BgYGBgYGBgH+Af4GAgYCAgH+AgIGCgYGCf4GAf4CAgH9/f35+f32AgYCAgICAgX+BgYKCgYKAgIF/gIB/f39+gIB+f4B+f4GBgYCBgIKBgYGBgYCBgYCBgICAgH9/f39/f39/gH5/fn5/f4GAgICAgICBgIKCgoKBgoKBg4GBgYF/f35+f39+f35+fn1+f3+AgYGAgYKBgYKBgoGAgIF/goGAgH6Afn9/gH+AgIGAf39/gIB+gICAgYF/gYCCgYGCgYKAgYGAgICAgIB/f31+fX9/fn9+gX+AgICAgoCBgoKBgYKCgIGAgYCAgH9/f39/gH9/f4CAf4GAf4GBgYCBf4CAf3+Af3+Bf4GAgYGAgYGAgYGAgIKAgH9/f39+fn5/f4GAgH+BgIGBgoKAg4CCgICBf3+Afn6Bfn5/f36BgX+AgYCAgoCBgYGCgYCAgX+Af39/f3+BfoGAgIF/gX9/gIKBgIGAgIB/gH9+gn6Af3+BgH+DgICAgoCAgIKAgoCBgH+Af4B/foB/f3+Af4B/f4F+gYCCgoGCf4CAgYGBgIGAgIB/gX+AgH+AfoB/f4GAf4F/f39/goCAgYCAgX+AgYCBf3+AgH6CgYGBgYGBf4B/g4CCgYB+f39/f39+f35+foCAgIKAgX+BgYKCg4GBgYF/gICAf39/fX5/f4CAgICAgICAgoGBgYKBgYGAgYB/f35+gH+Af3+Af3+Bf4CCgYGCgYCAgYCBf39/f35/f3+AgICAf4GBgoGBgoCDgIKAgYB/f36Afn6Af35+f3+AgICBgYGBgIGCgoGBgX9+gYB+gIB/f35/gX+BgIB/gYGAgIKAgoF/gX+AgYCAgIB/f3+AgH+BgH9/gICAgH+AgH9/gH+AgYB/gYGAgIGCgYKBgIB/gIF/gH5/foCAf4CAf4F/gIGBgoGBgoB/gYCAf39/foB+foB+gH9/gICBgYKBgoKBgYGAgX+Af39/fn9/f3+Af3+CgYGBgYKCgoGCgIJ/f4B/fn5/fn18fn5/f4F/goKBgoKDgoOBgYKAgH+Af35+fn5+f36AgICBgYGBg4GCgoCCgIB/gX6Af35+fX9+f4B/gYCBgIKCg4GCgIJ/gYCAf39/fn5/fn6AgIB/gIGBgYOChIGBgYGAgICBf35+fn1+fn+Af39/gYCCgYKCgoGBgYGAgYF/gH5/fn9/f4B/f39/gYCCgYGAgYGBgYCBgICBf39/gICAf3+Af4CAgYCAf4GAgX+BgX+Bf4B/f4CAgICAf4CAf4GBgIGAgYCBgICBgYCBf4B/gX+Af39/f4F+gH+AgICBf4CAgIGAgoCBgYCBgIGAgICAf4B/gH+Af3+AgH9+f4GAgIKAf4KAgoCAgoCAgICBf4F/gH9/f3+Af4CAgH+Bf4GAgYCBgYCAgH+BgICAgX9/gH+BgIB/gYCAf4GBf4F/gIB/gICAgICAgH+Bf4CBgICBgIGAgYCAgX+AgH9/gX+AfoB/gH+Bf3+BgICBgIGBgYCCgICBgX+AgIB/gIB/f4CAf3+AfoF/gYCAf4F/gX+BgYB/gYGAgIKAgYGAgYGAgIB/gH6Af35/f39+f4B/gICAgIGCgYGBgoGBgoCBgYCAf3+Af36Af39/gH9/gICBgH+BgICBgICAgX+Af4F/gX+AgX+BgICBgYGAgIF/gYGAgICAf39/f39/f3+AgH9/goCBgYN/gYGBgYGBgX+Af35/f4B/f39/foCAgIGBgICBgYGAgYKBgYCAf4CAgX6Af39/gICAgH+Bf3+Af4GBgYCAgH+Cf4CBgX+AgX+AgICBgH+AgH+BgICBgH+AfoGAf4CBf4B/gICBgYCCf4GAgYGAgoCAgIB/foF/f3+Afn9/f4F/gICBf4CCgICBgoCBgIGAgYCAgICAf4B/f3+Bf4B/f4B/gYCAgYCBgICBgYGAgYCAgH6BgH+Af39/gH+AgICAgH+BgYCAgYCAgICBf4CAgn+AgICAgYCAgYB/f4F/gICAgIB/gH+AgICAf4CBgICBgIGBgICAgIB/gYB/gIB/f3+AgYB/gH+BgX+BgYCAgYCAgX+CgH+BgICAf4B/gICAf39/gICBgICAf4CAgICBgH+AgYCAgICBgYCCf4GAgYCAgIB/f3+Bf39/f39/gICAf4J/gYGAgYGAgoGAgYCAgH9/gIB/f4B+gYCAf4F/gIGAgIGAgYF/gIGAgICAgH9/gX+Af4CBgIF/f4CBgIJ/gX+BgH+AgIB/gH+Af4F/gIGBgICBgICBgIGBgICAf4CAf3+Af39/f4GAf4GAgICBgYCBgYGBgIB/gIB/gIB/gH+Af4CAf4GAgIGAgYCBgYCAgIF/gICAf4B/f4CAf4B/gH+AgIGBgIGAgYGAgYCAgICBf3+AgH9/gX+AgH9/gX+CgIGAgIGAgYF/f4F/gH+Af4CAf4B/gIGAf4KBgICAgYCBgIGAf4B+gICAf4B+gIF/f4F/gYKAgIGAgYGAgYCBgH9/f4CAf3+Af3+AgICAgH+BgYCAgYGBgIF/gICBf3+BgH+Af3+AgX+AgICBf4CBgX+BgICAgX+BgH+BgH9/gX+AgICAf4CAgICAgYCAgYB/gICBf4GAgICBf4CAgICAgICAgIB/gX9/gX+AgX9/gYGAf4CBgICAgYCAf4GAgX+AgICAgH+Bf4F/gIGAf4F/gIF+gX+BgIB/gIB/gYCAgICAgYGAgICAgYCAgICAgH+AgH9/gICAf4CBgICAf4GAgX+Cf4F/gYCAgICAgX+AgIB/gICAgICAgICAf4J+gICBf4F/gYB/gICBf4F/gYCBgIGAf4GAgH+AgIB/gICAfoCBf4CAgICAgYCBgYCAgIGAf4CBgIB/gIB/gIB/f4CBgIB/gYCBgICAgIGBf4GAf3+Bf4F/gIF+gIGAgH+BgICBgH+BgH+BgICAgIB/f4CBf4CBf4CAgIGAgX+AgYCBgH+BgH+AgH+BgH6AgICAgICAgIGAgYCAgIF/gICAgX+AgH+Af4CAgIF+gn+BgICAgICBgIF/gIB/gIF/gYCAgH+AgICBgIB/gX+AgIGAgH+AgICAgH+BgICAgICAgYB/gYF/gX+AgICBf4CAgH+Af4B/gYGAf4GBf4GAgYB/gYCAgX6BgH+AgICAf4CAgIB/gYCBgICAgX6Cf4CAgICAgICBf4CAgICAf4GAf4CBgICAgICAgICAf4GAf4CBf4GAgH+BgICAgICBgIB/gH+Bf4GAf3+Bf4F/gYCAgICBgIB/gn+BgIB/gX+AgH+BgH+AgICAgICAf4GAgIGAgX+AgICAgICAf4F/gH+BgICAgIF/gIF/gICAgIF/gH+BgIB/gYCAf4GAgX+AgYCBf4F/gYB/gX9/gICAgIB/gICAgICAgICBgICBgICAgIF/gICAgICAgIB/gH+AgICAgICBgH+AgYCAgYCAgX+AgICAgIB/gYB/gX9/gICAgX+BgICAgH+Cf4CBgICAf4CAgX+BgH+Bf4CBf4CAgYCAgIB/gYB/gIF/gIF/gX+AgICAgICAgX+AgICBf4CBgH+Bf4CBf4CAgYB/gICBf4F+gX+BgIB/gYCBgH+BgIB/gX+Bf4F/gYB/gYB+gYCAgICAgH+AgYF/gICAgX+BgH+AgICBgICAgICAgH+Bf4CAgICAgICAgICAgIF/gICBf4CBf4CAgIF/gX+Bf4F/gICAgX+AgICAgICBf4CAgYB/gYB/gX+AgYB/gIF/gIF+goCAf3+Cf4B/gYCAgIGAf4F/gIF/gX+Bf4F/gICBgH+AgIF/gICAgICBf4GAf4CBf4CBf4CAgX+BgH+AgIGAf4CBf4F/gICAgX+BgIB/gYB/gX+AgX+AgICAgICAgICAgX+Bf4F/gX+AgX+Bf4CAgICAgICBgH+Af4GBf4GAf4GAf4F/gICBgIB/gIF/gX+BgH+AgIGAf4CBf4CBgH+Bf4GAf4F/gX+AgICBgICAf4CAgICBf4CAgICAgICAgX+AgYB/gICAgYCAf4CBgIB/gX+AgX+Bf4CBf4CBf4GAgIB/gIF/gX+AgICAgICBf4CBgIB/gICAgX+Bf4F/gICAgYCAf4CBf4CBgH+AgICBgH+AgIF/gICAgX+AgICAgICAgICAgICAgIF/gX+AgICAgIGAgIB/gICAgX+AgX+Bf4F/gX+AgX+Bf4F/gX+B" type="audio/x-wav" />
                    Your browser does not support the audio element.
                </audio>
              




    from scipy.io.wavfile import read,write


    fs,data = read('swvader01.wav')


    fs




    22050




    plt.plot(data)




    [<matplotlib.lines.Line2D at 0x113129c90>]




![png](FFT_files/FFT_57_1.png)



    k = np.arange(len(data))
    
    T = len(data)/fs
    T




    2



Let us now plot the DFT of our sound signal.


    k = np.arange(len(data))
    frq = k/T
    plt.plot(frq[:len(data)/2], abs(np.fft.fft(data))[:len(data)/2])
    plt.xlabel("Freq(Hz)")




    <matplotlib.text.Text at 0x113005cd0>




![png](FFT_files/FFT_60_1.png)


Wait! We do not see anything! This is due to the fact that zero frequency or DC component dominates other components. We can work around this by subtracting the mean from the signal. 


    k = np.arange(len(data))
    frq = k/T
    plt.plot(frq[:len(data)/2], abs(np.fft.fft(data-np.mean(data)))[:len(data)/2])
    plt.xlabel("Freq(Hz)");


![png](FFT_files/FFT_62_0.png)


Great! Now, we are able to see the frequency transform of the signal. But, do we have any idea of what frequency exists at what point in time? This is where short time fourier transform (STFT) would come into picture. Now, our goal is to not only see the frequency components, but see at what time what components exists. Turns out that to do that we have already done the basic foundation by computing the DFT. Now, we need to compute the DFT over windows of time.

Let us plot a spectogram of the data. While matplotlib provides a spectogram plot, I found the one produced in the [following](http://www.frank-zalkow.de/en/code-snippets/create-audio-spectrograms-with-python.html) tutorial more interpretable.


    from stft_implementation import *


    plotstft("swvader01.wav")

    /Users/nipunbatra/anaconda/lib/python2.7/site-packages/matplotlib/collections.py:590: FutureWarning: elementwise comparison failed; returning scalar instead, but in the future will perform elementwise comparison
      if self._edgecolors == str('face'):



![png](FFT_files/FFT_65_1.png)



    <matplotlib.figure.Figure at 0x112848850>


There you go! Now, does FFT sound all that difficult?

I have used a number of wonderful references for developing my understanding. I'll try and list a few here:

1. [Jake's blog post on understanding the FFT algorithm](https://jakevdp.github.io/blog/2013/08/28/understanding-the-fft/)
2. [Franks's code for spectograms](http://www.frank-zalkow.de/en/code-snippets/create-audio-spectrograms-with-python.html)
3. [Glowing Python tutorial on plotting frequency spectrum](http://glowingpython.blogspot.in/2011/08/how-to-plot-frequency-spectrum-with.html)
4. [Barry's youtube tutorial on STFT](https://www.youtube.com/watch?v=NA0TwPsECUQ)
5. [R tutorial on FFT](http://www.di.fc.ul.pt/~jpn/r/fourier/fourier.html)
6. [Interactive guide to FT](http://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/)
7. [Intuitive DFT tutorial](http://practicalcryptography.com/miscellaneous/machine-learning/intuitive-guide-discrete-fourier-transform/)
8. [David's youtube video on FFT](https://www.youtube.com/watch?v=B2iUDBZzBpY)
