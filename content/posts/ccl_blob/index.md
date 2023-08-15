+++
title = "Connected Component Labelling and Blob Detection"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "development",
    "video",
    "image",
]
date = "2023-07-07"
categories = [
    "FPGA",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## Connected Component Labelling / Blob Extraction
Connected Component Labelling (CCL), also known as Blob Extraction (distinct from Blob Detection) is used in computer vision to detect connected regions in binary digital images, although color images and data with higher dimensionality can also be processed. 

Blob extraction is generally performed on the resulting binary image from a thresholding step, but it can be applicable to gray-scale and color images as well.

It is simpler to understand by just looking at the results of CCL. Image (a) below represents the thresholded binary image, Image (b) represents the labelled image, and Image (c) represents the final result of CCL, after label equivalence has been resolved.

![CCL](img/ccl.jpg#center)

Another example here:

![CCL2](img/ccl2.png#center)

Connectivity is determined by the medium; image graphs, for example, can be 4-connected neighborhood or 8-connected neighborhood.

### Algorithmic Implementation of CCL 

There are several algorithms that can be used to implement CCL, namely the multipass, one-pass, and two-pass algorithms. [Wikipedia's CCL page](https://en.wikipedia.org/wiki/Connected-component_labeling) does a good job explaining these.

### FPGA Implementation of CCL
However, the multipass, one-pass, and two-pass algorithms do not translate well into direct implementation on an FPGA. From [this paper](http://doi.org/10.1109/FPT.2008.4762382):

"When processing streamed images, the bandwidth bottleneck of reading in the image data destroys most of the benefits gained by massive parallelism."

"Crookes, Benkrid, et al. [8,9] have implemented a resource efficient multi-pass algorithm on an FPGA. This uses very simple local processing, but requires an indeterminate number of passes to completely label the image. This makes such an algorithm unsuitable for real-time rocessing. The iterative nature of the algorithm also requires a buffer to hold the intermediate image between passes."

"Jablonski and Gorgon [10] have implemented the classic two-pass connected component labelling on an FPGA. In doing so, they were able to take advantages of the parallelism offered by FPGA-based processing to gain considerable processing efficiencies over a standard serial algorithm. However, their two-pass algorithm still requires the image to be buffered for the 
second pass, and requires two clock cycles per pixel plus a small overhead for region merging."

This was part of my summer internship work at DSO National Labs, Singapore. Contact me for more discussion!

## Blob Detection
In computer vision, blob detection methods are aimed at detecting regions in a digital image that differ in properties, such as brightness or color, compared to surrounding regions. Informally, a blob is a region of an image in which some properties are constant or approximately constant; all the points in a blob can be considered in some sense to be similar to each other.

An example of blob detection:
![Blob Detection Result](img/blob_detection.png#center)

### A Very Short Explanation of the 2D Blob Detection Algorithm

#### Choice of Convolution Kernel

##### 1. Normalised Laplacian of Gaussian (NLoG)
The Normalised Laplacian of Gaussian (NLOG), a circularly symmetric operator, is selected as the convolution kernel for blob detection in 2D. It must be **normalised** so that the filter response is insensitive to the scale of $\sigma$. $\sigma$ determines the scale of the Gaussian kernel / sliding window. 

$$
\text{LoG}(x, y) = \sigma^2 \left(\frac{{\partial^2}}{{\partial x^2}} \left( G(x, y) \right) + \frac{{\partial^2}}{{\partial y^2}} \left( G(x, y) \right)\right)
$$

An example of a LoG kernel:
![LoG Kernel](img/Laplacian-of-Gaussian-Filter.png#center)

##### 2. Difference of Gaussian (DoG)
While the DoG and NLoG both serve a similar purpose, there are a few factors that make the DoG approach more commonly used in practice.

Efficiency: The DoG technique is computationally more efficient compared to the LoG approach. The LoG involves convolving the image with a Gaussian filter at multiple scales and then computing the Laplacian operator to identify blobs. On the other hand, the DoG computes the difference between two adjacent scales of the blurred images, which requires fewer computations. This efficiency advantage makes the DoG approach more suitable for real-time or resource-constrained applications.

$$
\text{DoG}(x, y) = \left( G(x, y, k_1\sigma) - G(x, y, k_2\sigma) \right)
$$


![DoG vs NLoG](img/dog_vs_nlog.png#center)

#### Computing a Scale Space and Find the Characteristic Scale
Pixels are processed left-to-right, top-to-bottom. For a given pixel, compute the result of NLoG or DoG by convolution using a variety of scale/$\sigma$ values. These values form up the scale space, a function of parameters x, y, $\sigma$. Find the maxima or peak points of the NLoG or DoG response in the scale space. The x and y values give the position of the blob, while the value of $\sigma$ is known as the characteristic scale of the blob (which is proportional to the radius of the blob in the image).

![Characteristic Scale](img/characteristic_scale.png#center)

The values of $\sigma$ selected to generate the scale space is given by:
$$\sigma_k = \sigma_0 s^k$$
where $k = 0, 1, 2, 3,...$

#### Some Resources for Blob Detection:

[A set of good slides](https://www.cse.psu.edu/~rtc12/CSE586/lectures/featureExtractionPart2_6pp.pdf)

[A good video explanation](https://www.youtube.com/watch?v=zItstOggP7M)