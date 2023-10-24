+++
title = "Five-Stage Pipelined MIPS Series: 3. Memory Organisation: Registers and Main Memory"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "digital electronics",
]
date = "2023-07-15"
categories = [
    "Digital Electronics",
]
series = ["Digital Electronics"]
[ author ]
  name = "Hubert Choo"
+++

## Memory Organisation
MIPS is a Load/Store Register File machine. This means that instructions only compute on data in the Register File. The register file is fast, but small. Hence, most data is stored in memory, which is large but slow.

Therefore, there needs to be data transfer between the Register File and Main Memory:
- Load (lw instruction): Load data from the memory to the register file
- Store (sw instruction): Store data from the register file in the memory.  

CISC ISAs are not Load/Store Register File machines. Hence, they get operands from the main memory to perform their operations.

### Memory
In MIPS, the main memory is:
- A large 1-dimensional array
- Each location is 8 bits (unlike the 32 bits in the register file)
- Each location in the array has a memory address
- For a 32-bit computer, there are $2^32$ memory locations
- For a 64-bit computer, there are $2^64$ memory locations 
- We usually define 4 bytes or 4 memory locations as a word. This conveniently sums up to 32 bits, the width of the register file.

Hence, we can do byte and word addressing
![Byte and Word Addressing](img/addressing.png#center)
