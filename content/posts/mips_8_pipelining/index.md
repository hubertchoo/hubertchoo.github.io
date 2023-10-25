+++
title = "Five-Stage Pipelined MIPS Series: 8. Five Stage Pipelining"
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

## Five Stage Pipelining
Now, we cut up the single-cycle MIPS processor into 5 stages to get a pipelined design:
1. Instruction Fetch from memory
2. Instruction Decode and Register Read
3. Execute Operation or Calculate Address (ALU Stage)
4. Memory Access
5. Register Write the result

We add pipeline registers between the above five stages.