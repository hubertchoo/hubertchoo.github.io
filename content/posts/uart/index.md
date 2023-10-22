+++
draft = false
title = "Universal Asynchronous Receiver Transmitter (UART)"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "development",
]
date = "2023-09-28"
categories = [
    "Digital Electronics",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## Universal Asynchronous Receiver Transmitter (UART)
The UART is one of the simplest methods of communication between an FPGA and another FPGA, a computer, or a microcontroller. 

UART usually sends out information serially, one byte at a time. It is asynchronous, meaning that there is no clock signal forwarded with the data. Both the receiver and the transmitter have to share the same parameters/settings for UART to work:
- Baud Rate (Bauds = bits per second)
- Number of Data Bits (7 or 8)
- Parity Bit (On or Off)
- Stop Bits (1 or 2 or 3)
- Flow Control (None or On or Hardware)

Parity checks if there are even/odd number of 1s in the data. This is done with a XOR operation.