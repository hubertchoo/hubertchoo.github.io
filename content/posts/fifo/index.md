+++
draft = false
title = "FIFO"
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

## FIFO

FIFO stands for First In First Out and is a commonly used FPGA component. 
- For large FIFOs, block RAM is commonly used, while registers are commonly used for small FIFOs. 
- They are commonly used to buffer data, for example row buffers when working with image processing and wanting to do convolution. Another example is to buffer data before sending them out when reading or writing to external memory.
- There are also dedicated FIFO IPs provided by vendors.

FIFO Depth: Number of words of data it can store

FIFO Width: Number of bits in each word

## FIFO to cross clock domains
FIFOs are also often used to cross clock domains because they have two different clocks, one each for the read and write. If one part of the design is synchronous with clock A, and another with clock B, an FPGA engineer would use a FIFO with these two clocks to cross between the clock domains. 

We just have to make sure that the FIFO does not reach either a full or empty state, allowing it to not be able to be written to or read from. Sometimes, we use an 'almost empty' and 'almost full' flag to check. When one of the flags is triggered, a burst of data can be read out of the FIFO.

This can handle clock domain crossing for larger amounts of data than using a double flop.