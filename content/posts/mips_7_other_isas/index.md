+++
title = "Five-Stage Pipelined MIPS Series: 7. Other ISAs"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "digital electronics",
]
date = "2023-07-18"
categories = [
    "Digital Electronics",
]
series = ["Digital Electronics"]
[ author ]
  name = "Hubert Choo"
+++

## Other ISAs

- x86 (Intel/AMD)
- ARM (ARM/Samsung/Apple)
- JVM, Java Virtual Machine (Java)
- PTX (Nvidia)

## Memory-to-Memory vs Register Machines
In memory machines:
- Instructions can directly manipulate memory.
- But, we need to store temp variables in memory, which is slow.
- Memory is also big, meaning addresses take up many bits

In register machines:
- Temporary registers are held in register files, which are faster. 
- Addresses need less bits as register file is smaller.

Register-Memory Machines:
- Some ISAs such as x86 has a few registers and supports memory operations too

## Variable Width vs Fixed Width Machines
Variable width machines have:
- Different width for different instructions.
- This is better for generating compact code as such instructions can use less bytes if they are able to
- But it is difficult for hardware to know where the instructions start or stop

Fixed width machines:
- Have the same width for every instruction, such as how MIPS has 4 bytes per instruction
- Larger code size
- Easier for hardware to decode the instructions. 

