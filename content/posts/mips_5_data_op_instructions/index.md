+++
title = "Five-Stage Pipelined MIPS Series: 5. Data Operation, Data Transfer, and Sequencing Instructions"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "digital electronics",
]
date = "2023-07-17"
categories = [
    "Digital Electronics",
]
series = ["Digital Electronics"]
[ author ]
  name = "Hubert Choo"
+++

## Data Operations
1. The Program Counter holds the instruction address
2. Instructions are fetched from the memory into the instruction register
3. Control logic decodes the instruction and tells the Arithmetic Logic Unit (ALU) and Register File what to do
4. ALU executes the instruction and results flow back to the Register File
5. Control logic updates the PC for the next instruction

## Data Transfer
Now, we need an additional Memory Address Register and Data Register.
1. ALU generates the address
2. Address goes to the Memory Address Register
3. Results to/from memory are stored in the Memory Address Register
4. Data from memory can now be stroed in the Register File, or data to memory can be written in the Register File

## Sequencing Instructions
Sequencing instructions include Jump and Branch instructions. 

MIPS has the following conditional branch instructions:
- bne R0, R1, Label : branch to Label if R0 and R1 are not equal
- beq R3, R4, Label : branch to Label if R0 and R1 are equal

MIPS has the following unconditional branch instruction:
- j Label : jump to Label

Sequencing Instructions have the following flow:
1. ALU compares registers
2. Result tells the Control logic whether to branch
3. If the branch is taken, the Control logic adds a constant from the instruction to the PC. The Control logic also adds an additional 4 to move to the next instruction.
4. For unconditional jumps, the Control logic replaces the PC with the constant from the instruction.


