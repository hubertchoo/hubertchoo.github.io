+++
title = "FPGA Video Denoising and Segmentation (Y2 Summer Project)"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "development",
    "video",
    "image",
    "DE10-Lite",
    "D8M-GPIO",
]
date = "2023-07-05 10:00:00"
categories = [
    "FPGA",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## Y2 Summer Project Introduction

For the Imperial EEE Department, the Y2 Summer Term project was to: 
1. Design and build a balancing rover (Segway),
2. that can autonomously navigate and map a maze,
3. with the assistance of three beacons.
4. Finally, the shortest path through the maze should be computed and followed.

A prototype of the design must be built and tested on the artificial maze in the lab. The maze is laid out with light strips on an arena. The arena is coloured black and surrounded by black curtains.

![Maze Image](img/summer_proj_maze.png#center)

## The Team's High Level Strategy
The problem of maze survey is equivalent to a problem of maze wall identification.

The main strategy of the team is to:
1. Scout all reachable locations of the maze, and while doing so,
2. identify all walls present in the maze.

Naturally, satisfying both conditions will also provide full information on the paths viable to the rover. These paths will be used to find the shortest path between any start and end point.
The overall maze survey logic is simple, yet effective:

- Case A: When the rover is in close proximity to a wall that has not been explored, the rover will begin to follow the wall, mapping out that wall fully.
- Case B: At specified time intervals, the rover will perform a localisation sequence to determine its position within the maze. This will be used to propagate a drift-correction throughout the trajectory estimated by dead-reckoning. The localisation sequence involves rotating the rover on-the-spot to observe the three beacons, and performing trilateration.
- Case C: When the rover has determined that it has completely followed a wall and achieved a closed-loop path, it will begin to explore previously unexplored areas of the maze. While doing so, if it comes into close proximity to a new unexplored wall, the rover goes back into Case A.

## The Localisation Solution

### Ideal-Case Trilateration
The localisation algorithm receives an input of beacon color and beacon distance for the three beacons. Its desired output is the rover’s position, in (x, y) coordinates.

This is obtained by performing trilateration, which is the process of determining the rover’s position using its distance from three known beacon positions.

Graphically, the rover position is represented as the intersection of three circles.

![Ideal Trilateration](img/idealtrilateration.png#center)

Mathematically, the rover position can be found by solving three simultaneous equations of circles.

![Trilateration Equation](img/rovertrilaterationequation.png#center)

### Non-Ideal-Case Trilateration
In the real world, the distance measurements can never result in circles that perfectly intersect. Non-linear regression on the three simultaneous equations is used to minimise mean-squared-error to provide the best approximate rover position. This is implemented using a Levenberg-Marquardt Node Packet Manager (NPM) library.

![Non-Ideal Trilateration](img/nonidealtrilateration.png#center)
![Non-Linear Regression](img/nlsr.png#center)

## Field Programmable Gate Array (FPGA) Vision

### Functional Requirements
The overall goal of the Field Programmable Gate Array (FPGA) Vision submodule is to identify and differentiate the red, blue, and yellow beacons reliably and consistently, from different positions on the maze, under a variety of lighting conditions.

It processes an input video stream from the onboard camera of the rover and outputs the relative distance of each coloured beacon from the rover, calculated using the height of the bounding box. These relative distances are passed to the Localisation Algorithm on the Cloud to calculate the position of the rover in (x, y) coordinates.

This was achieved using image segmentation and curve fitting.

### Overview of Vision Pipeline
![FPGA Vision Pipeline](img/fpgavisionpipeline.png#tallercenter)

### RGB Video Denoising
To achieve reliable image segmentation and a consistent beacon bounding box reading, the foremost requirement is to provide good quality input video data with minimal noise. This can be achieved by performing denoising of the input video data.

#### Modelling the Noise
There are two common types of noise associated with image capture and image processing, namely salt-and-pepper noise and Gaussian noise.

Salt-and-pepper noise is characterised by sharp and sudden disturbances in the image signal. The original value of the pixel colour channel is lost and is taken to be one of the extremes of the dynamic range.

![Types of Noise](img/noise_types.png#center)

Gaussian noise refers to noise that possesses a probability density function equal to the normal distribution. A sum of different noises tend to approach a Gaussian distribution due to Central Limit Theorem, making it a largely applicable model.

From the video stream output of the camera, a low level of salt-and-pepper noise is observed and
a Gaussian noise model is deemed to be a good characterisation of image noise

![Well Lit No Gaussian](img/well_lit_no_gaussian.png#center)

#### Choice of Denoising Filter

In a perfect image, the colour channel values of neighbouring pixels are expected to be correlated because an object is likely to span several pixels. On the other hand, noise present in neighbouring pixels is uncorrelated.

With such characteristics, a linear filter that sets the value of a pixel as a weighted average of its neigbouring signals can be used to reduce noise in the image. With the low levels of salt-and-pepper noise modelled, a linear filter is especially suitable. Pixels affected by salt-and-pepper noise tend to be big outliers compared to its neighbours, diminishing the denoising effects of a linear filter.

One commonly used set of weights is the Gaussian filter. It typically yields the smoothest image, compared to a similarly-sized mean or median filter.

The Fourier Transform of the Gaussian is also a Gaussian (Figure 38), which acts as a low-pass filter.

![Gaussian Fourier Transform](img/gaussian%20fourier%20transform.png#center)

Mathematically, applying a Gaussian filter on an image is equivalent to performing a convolution of the image with a convolution kernel to generate a value for the output pixel.

![Convolution](img/convolution.png#center)

Due to memory limitations of the DE10-Lite FPGA, a 3×3 Gaussian kernel is used.

![Gaussian Kernel](img/gaussian_kernel.png#center)

#### Implementation of an FPGA Gaussian Blur Denoising Filter

![Gaussian Blur Implementation](img/gaussian_blur_implementation.png#tallercenter)

The video data streaming interface does not give random access to image data - pixels arrive one at a time, left-to-right and top-to-bottom. As a result, they also have to be processed in this order, one pixel at a time.

For convolution to be performed with a 3×3 Gaussian kernel, a moving 3 × 3 window has to be maintained from the input video frame. This is achieved by implementing four line buffers, three of which contain full pixel data from three preceding lines for reading, and the final line buffer used to store the newest received pixel data. Each **LineBuffer** module is synthesized as a 1-PORT RAM with a width of (24 bits × 640 pixels).

A **LineBufferController** module is designed to coordinate reading and writing of the line buffers with a state machine.

![Line Buffer Control](img/linebuffercontrol.png#tallercenter)

Lastly, the 9 pixels of data read from line buffers are convolved with the Gaussian kernel using a combinational circuit. The values of the Gaussian kernel, as powers of 2, allow for all operations to be performed only using bit-shifts. The output value of this operation is the processed, post-denoising pixel colour value, with two-pixel-row latency.

The Gaussian blur for RGB images are performed separately on each of the R, G, and B channels.

#### Results of Gaussian Blur Denoising
Overall, a blurring effect is clearly observable in both well-lit (Figure 43) and poorly-lit conditions. In both cases, close inspection of noisy regions reveals that the Gaussian blur is able to successfully reduce noise.

A stronger blurring and denoising effect can be achieved with a larger Gaussian kernel at the expense of FPGA memory resources, image sharpness, and bounding box accuracy.

Using the 3 × 3 kernel, the bounding box is successfully observed to fluctuate significantly less. A more stable value of beacon bounding box height, and hence distance can thus be achieved later on.

![Gaussian Blur Well Lit](img/gaussian_blur_well_lit.png#center)
![Gaussian Blur Low Lit](img/gaussian_blur_low_lit.png#center)

### RGB to Hue, Saturation, Value (HSV) Colour Space Conversion using High Level Synthesis

#### The HSV Colour Space
Like RGB, the HSV colour space defines a coloured pixel in terms of three components:
- Hue describes the colour of the pixel between 0 and 360 degrees.
- Saturation describes the amount of grey in the colour, from 0 to 100 percent. A lower value represents a larger grey component.
- Value describes the increasing brightness or intensity of the colour from 0 to 100 percent.
Unlike in the RGB colour space, HSV separates the brightness of a pixel from its colour. This allows us to easily set thresholds to recognise the red, blue, and yellow colours of the beacons. We can also easily set a threshold for brightness, as the lit beacons are likely to be brighter than the surroundings.

#### Mathematical Interpretation of RGB to HSV Conversion
Classically, the transformation algorithm for conversions (https://doi.org/10.1145/965139.807361) between the RGB and HSV models is given by the following steps:

![Classic RGB to HSV](img/classicalrgbhsv.jpeg#tallercenter)

However, this conventional conversion formula between the RGB and HSV colour space requires the use of floating-point variables during computation, drastically increasing the FPGA resources needed, and the latency of computation.

To overcome this limitation, an integer-based accurate conversion scheme between the colour spaces was adopted. Each colour from the RGB space continues to have a unique equivalent in the HSV space and vice versa.

The integer-based conversion algorithm (https://doi.org/10.1016/j.compeleceng.2015.08.005) from RGB to HSV is given as:

![Integer RGB to HSV](img/integerrgbhsv.png#eventallercenter)

The maximum values of each variable is H = 393, 222 (19 bits), S = 65535 (16 bits), and V = 255 (8 bits) for a total of 43 bits.

#### Implementation of RGB to HSV Conversion using High Level Synthesis (HLS)
The algorithmic and high-level nature of the integer-based conversion algorithm lends itself well to the use of HLS to convert a program in a C-like high-level code, to a synthesizable Register-Transfer-Level description in a Hardware Description Language.

The Intel HLS Compiler pipelines the program to enable parallel execution of program instructions, reducing the operational clock frequency requirement of the system at the expense of function latency. The RGB_TO_HSV IP block from HLS compilation is able to successfully operate at the same operational clock frequency. This comes at the expense of a 54-cycle latency, resulting in a right-shifted bounding box. However, this has no adverse effects
on beacon detection.

#### Resource Utilisation of Compiled RGB_to_HSV IP Block and Additional Improvements
The resource utilisation of the RGB_to_HSV IP Block is shown. A large percentage of available
LUTS and FFs on the DE10-Lite are utilised by the IP block. Improvements must be made to reduce the resource utilisation of this IP block as the overall program contains other components.

![Original HLS Compilation Report](img/originalhlscompile.png#center)

By observing the captured colour of the beacons by the camera in a large variety of conditions, it was found that computing the exact value of Hue remains important in identifying the beacons. However, the threshold S value needed to identify the beacons is S > 70% for all three beacons, and only a Boolean value is needed. The component of saturation is given by $$S = 1 − \frac{min}{max}$$

To achieve a value of S > 70%, the inequality min < 0.3 ∗ max must be satisfied. The use of a lookup table for all values of max largely reduces the resource utilisation of the RGB_to_HSV IP Block, shown in Figure 48. As a result, the possible values of S now are S = 0 for S < 70%
and S = 1 for S > 70%.

![Reduced HLS Compilation Report](img/reducedhlscompile.png#center)

### Beacon Detection by Colour Thresholding and Beacon On/Off Control
To detect and differentiate the red, blue, and yellow beacons reliably, a combination of two strategies was used:
1. Colour Thresholding: Unique HSV colour thresholds were set for each of the colour values.
2. Beacon ON/OFF Control: A state machine is used to control the ON/OFF switching of each individual beacon. At any one time, only one beacon will be ON, and its colour is known, ensuring that the detected colour matches the beacon that is currently ON. Refer to the Localisation Algorithm section of the report.

Recalling that the ranges of the H, S, and V components are 0 ≤ H ≤ 393, 222, S = 0, 1, and 0 ≤ V ≤ 255, the colour thresholds for the three beacons are set as:
|        | Hue              | Saturation | Value      |
|--------|------------------|------------|------------|
| Red    | 0 to 21845       | 1          | 128 to 255 |
| Blue   | 174765 to 273070 | 1          | 128 to 255 |
| Yellow | 21845 to 76459   | 1          | 128 to 255 |

#### Results of Beacon Detection
Beacon Detection is able to successfully identify and differentiate the beacons of different colours. More importantly, the combination of algorithms allows the vision pipeline to accurately produce a consistent bounding box that accurately captures the full height of the beacon, which is used to compute the distance of the beacon from the bounding box.

![Beacon Detection Results](img/beacon_detection_results.png#tallercenter)

### Bounding Box Output via Universal Asynchronous Receiver/Transmitter (UART) Protocol
Bounding Box Data is transmitted to the ESP32 over UART byte-wise, with a total of 12 bytes forming a complete message. Each message has the format shown.

![UART Data Packet](img/uartdata.png#center)

### Computation of Relative Beacon Distance
Plotting a graph of bounding box height against beacon distance from the rover, an inverse proportionality is observed.

![Bounding Box Plot](img/bounding_box_distance_plot.png#tallercenter)

An equation describing the relationship is found to be $$BeaconDistance = \frac{5206.6}{BoundingBoxHeight}$$This is computed on the ESP32, then transferred to the Localisation Algorithm on the Cloud through the MQTT protocol.

## Beacon Control Sequence
As mentioned prior, Beacon ON/OFF control is used with color thresholding to improve reliability of image segmentation. A state machine is used to manage such control, and contains the following states:
1. When the process of localisation is started, the red beacon is ON.
2. When the red beacon is identified and distance calculated, red is OFF, and blue is ON.
3. When the blue beacon is identified and distance calculated, blue is OFF, and yellow is ON.
4. When the yellow beacon is identified and distance calculated, yellow is OFF OFF and distances are obtained.

The sequence of beacon colors is deliberate as the rover will perform an on-the-spot rotation to identify each beacon. It will always be able to identify the beacons in the above color order.

![Beacon Positions](img/beaconposition.png#center)

The ESP32 maintains the state machine and publishes commands for switching ON/OFF each beacon using the MQTT protocol.