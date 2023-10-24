+++
title = "Five-Stage Pipelined MIPS Series: 2. MIPS Instructions and Registers"
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

## MIPS Instructions

### Instruction Formats
MIPS instructions generally come in a 3-operand format: 

op dest, src1, src2

This performs dest <- src1 op src2. Examples of this format include: 
- add a, b, c
- addi a, b, 12
- sub a, b, c

### Instruction Types
1. Data Operations (Arithmetic, Logical)
2. Data Transfer (Load, Store)
3. Sequencing (Branch, Jump)


## MIPS Registers
MIPS has 32 general purpose registers in a register file, that are each 32 bits wide (for 32 bit versions). 64 bit versions are 64 bits wide, but still contain only 32 registers. Conventionally, these are labeled as R0 to R31, or $0 to $31.

Values for instructions must come from registers.

Some registers are special:
- R0 always has a value of 0
- R29 and R31 are used for function calls

There are also some registers that are not part of the register file:
- PC (Program Counter), which keeps track of the current instruction
- Hi and Lo stores the results of multiplication and division
- Floating point registers
- Control registers for errors and status

## Instructions
![MIPS Instructions](img/instructions.png#center)

## Instruction Encoding Formats
MIPS instructions are encoded in the following format:

![MIPS Encoding](img/encoding_formats.png#center)

- opcode: Opcode
- rs: First source register
- rt: Second source register
- rd: Destination register
- shamt: Shift amount
- funct: Function selector

How do we convert the 16-bit immediate field for use with the 32-bit register values? 
- We perform sign extension, repeating the leftmost bit.

For branch instructions (16 bits):
- Treat the 16 bit immedate operand as relative offsets to the current PC.
- Sign extend the immedate operand, and shift left by 2 (each instruction is 4 bytes), before adding it to the current PC.

For jump instructions (26 bits):
- Treat the 26 bits as an absolute value, using it to replace 26 bits of the current PC.
- Shift the 26 bits left by 2, and replace the 28 least significant bits of the current PC.

### How do we load constants that require larger than 16 bits?
- We use two instructions to combine 16 bit immediates.
- lui (Load Upper Immediate) : loads the upper 16 bits into the specified register, and load 0 into the lower 16 bits
- ori (Or Immediate) : loads the lower 16 bits into the specified register (because it is doing an OR operation with the zeroes from the lui instruction)



