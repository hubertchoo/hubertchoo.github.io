+++
draft = false
title = "Ping Pong Buffer"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "development",
]
date = "2023-09-27"
categories = [
    "Digital Electronics",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## Ping Pong Buffer
Using a Ping Pong Buffer (or Double Buffer) allows you to:
- Perform data processing or computation on one buffer
- Use the other buffer for storing new input data, or to output data, isolated from the processing of the data.

One buffer is known as the write buffer, and the other is known as the read buffer. The feature of the ping pong buffer is that the read and write buffers are swapped back and forth, meaning that the current read buffer will be designated as the next write buffer and vice versa. The following example will better illustrate the advantages of a ping pong buffer.

### An example of using Ping Pong buffering in image processing to reduce RAM usage
Let us take the example of a multi-step image processing algorithm. Such an example might be to first convert the image to greyscale, then blur the image, and continued with other image processing algorithms after. 

If there are $n$ steps to the image processing algorithm, we can allocate $n+1$ buffers for all inputs and outputs. Alternatively, with ping pong buffering, we can use only 2 buffers.

Double buffering, aka ping-pong buffering, is a technique to simplify programming when multiple operations are applied to the same image in succession.

- We have buffers.
- At any time, one buffer is the write buffer and the other is the read buffer.
- The operation you can perform on the buffer is as indicated by the name.
- You can only read from the read buffer, and you can only write from the write buffer.
- We can swap the buffer to exchange their roles.

Applying multiple operations to the same image with double buffering:

- Copy the source image to the read buffer.
- Perform operation 1, reading from the read buffer and writing to the write buffer.
- Swap the buffers.
- Perform operation 2, reading from the read buffer and writing to the write buffer.
- Swap the buffers.
- Perform operation 3, reading from the read buffer and writing to the write buffer.
- And so on.


### Clock Domain Crossing
Similar to a FIFO, a pingpong buffer is also useful in crossing clock domains. The read and write buffers can operate in different clock domains.

### Ping Pong Buffer vs FIFO
The limitation of FIFO is that the data must be accessed in a First In First Out manner. Using a Ping Pong buffer with RAM allows for (in the case of an image frame) data to be accessed in any sequence.

Ping pong buffer can also allow higher throughput. Data can be read while the previous frame is being processed. Without a pingpong buffer, we have to wait for all the data to be read before it can be processed. This, of course, comes at the expense of having to use double the memory.