+++
draft = false
title = "LUT Utilisation"
description = ""
type = ["posts","post"]
tags = [
    "FPGA",
    "development",
]
date = "2023-09-30"
categories = [
    "Digital Electronics",
]
series = ["FPGA"]
[ author ]
  name = "Hubert Choo"
+++

## LUT Utilisation

### 1. Forming a basic MUX with LUTs
Nowadays, 6-input LUTs are common in FPGAs. One 4-input MUX can be implemented in one 6-input LUT. This is because the MUX has only 1 output, and 4 input data ports and 2 input select bits (for a total of 6 input bits).

A 4-input LUT can be used to implement one 2-MUX (2 input data bits and one select bit).

### Forming Larger MUX with LUTs

1. For an input of N bits, one 4-input LUT can accomodate 4 bits. Hence, on the first logic level, we use N/4 LUTs.
2. The first logic level will now have N/4 output bits from the LUTs. Our second logic level hence requires N/4/4 = N/16 LUTs to implement a second level of MUXes.
3. We repeat this until we reach a final logic level with only 1 bit as output.

If at any stage N is not divisible by 4, we round up to the nearest integer for the number of LUTs needed. 

For example, a 128:1 MUX will have the following number of LUTs in each logic level:
1. 128/4 = 32 LUTs needed
2. 32/4 = 8
3. 8/4 = 2
4. 2/4 = 0.5 ~ 1 LUT needed.

The total is hence 43 LUTs needed.

If instead of a 128:1 MUX, we want to implement a 128:2 MUX, we will need a total of 43*2 = 86 LUTs.

### 2. How many LUTs do I need to implement a function that takes in $n$ bits of input?
Let us show this with an example, using 6-input LUTS. 

- Each 6-input LUT can at one time implement one particular function/ set of output with $2^6 = 64$ input combinations. Do not confuse this with the fact that each 6-input LUT can implement a possible of $2^{2^6}$ different functions or combinations of inputs and outputs.

Example with an 8-input function:
1. A function with 8 bits of input has a total of $2^8 = 256$ possible input combinations. This means that we have to distribute these possible combinations over 4 separate LUTs.
2. We then have to implement a 4:1 MUX, which nicely only uses 1 LUT. 

Example with a 10-input function:
1. A function with 8 bits of input has a total of $2^{10} = 1024$ possible input combinations. This means that we have to distribute these possible combinations over 16 separate LUTs.
2. We then have to implement a 16:1 MUX. Looking at the above section "Forming Larger MUX with LUTs", we can see how this would require 5 LUTs to implement.

