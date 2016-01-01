Title: Denoising revisited 
Date: 2014-08-02 15:41
Author: nipunbatra
Category: Blog
Tags: stats
Slug: denoising-revisited


Previously, I had [discussed](http://nipunbatra.github.io/2014/05/denoising/) about denoising a signal using least squares. However, I had pointed that the implementation would scale poorly with input size. This was due to the fact that I used dense matrix operations when I could have done with sparse matrix operations.

So, in this post, I present a sparse version of the denoising  problem and compare its performance. The following gist contains the two versions and the code to test their performance.

[gist:id=086649910074426748cd]

The following table compares the time taken for the two versions for different corrupt data sizes.

[gist:id=da414ab86843bca1ef10]