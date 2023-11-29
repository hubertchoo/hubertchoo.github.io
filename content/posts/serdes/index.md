+++
draft = false
title = "SerDes (Serialiser/Deserialiser)"
description = ""
type = ["posts","post"]
tags = [
    "FPGA",
    "development",
]
date = "2023-10-01"
categories = [
    "Digital Electronics",
]
series = ["FPGA"]
[ author ]
  name = "Hubert Choo"
+++

## SerDes

- A primitive of some FPGAs responsible for inputting or outputting data at very high speeds, into the Gbps range.
- Works by converting a parallel data stream into a serial data stream for transmission. At the receiver, data is converted from a serial stream back to a paralllel data stream.
- SerDes transceivers are also full duplex. They can transmit and receive data at the same time. Half duplex example: Walkie Talkie

### Shouldn't parallel transmission be faster? Why do we not use that?

- Yes, parallel transmission can indeed be faster.
- However, when we want to speed up parallel transmission, there are only two factors to scale up:
    1. Clock Speed
    2. Number of parallel wires
- This is not very scalable for large data transfer, as the number of wires increases quickly. The bigger problem however, is clock skew. 

- On the receiving end of the parallel data, there will be flip flops used to capture the values. All of these flip flops get triggered on the same clock.
- Clock skew describes the problem where the clock signal has different propogation delay and reaches each flip flop at a different timing due to the difference in physical distances from the clock. These can create metastable conditions and disrupt the data, especially in designs with high clock frequency.

Ultimately, the problem with parallel transmission is the need to send a separate clock signal along with each parallel data transfer. The solution is to send the clock and data together serially as part of a single combined signal.

#### Self Clocking Signal, aka Embedding the Clock in the Data

If the clock and the data is sent together in a signal, there is no longer the problem of clock skew. With no clock skew, the operating frequency can be increased, allowing the data frequency to increase. The SerDes usually runs at a separate faster clock compared to the rest of the design, and thus has a dedicated PLL attached to the SerDes transceiver.

One example of such a encoding scheme is the Manchester code, which takes the XOR of the data signal and the clock signal. The clock signal has high and low within each cycle, while the data signal remains the same, so the result of the XOR actually changes within the cycle. 

On the receiving end, the data signal and the clock signal that is transmitted along with it can then both be used as the inputs to the flip flop, preventing the issue of clock skew.