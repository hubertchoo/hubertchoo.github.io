+++
title = "Five-Stage Pipelined MIPS Series: 4. Instruction Execution Model"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "digital electronics",
]
date = "2023-07-16"
categories = [
    "Digital Electronics",
]
series = ["Digital Electronics"]
[ author ]
  name = "Hubert Choo"
+++

## Processor Execution Model
The processor promises that the instruction execution will appear (note appear, it does actually do this, but it cleans it up to look like this) to be sequential and atomic.

- Sequential: Execute instructions in order
- Atomic: Execute each instruction all at once

## Stored Program Computers
Program and data are stored in memory. These instructions and data have to be fetched from memory, and they share the same memory (von Neumann model).


