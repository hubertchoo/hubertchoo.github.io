+++
title = "Five-Stage Pipelined MIPS Series: 6. Procedures and Register Conventions"
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

## Procedures

Also known as functions or methods.

### Terminology
- The Caller calls the procedure
- The procedure is the Callee
- The Caller gives the Callee Arguments
- THe Callee returns Results to the Caller

### Jump and Link, and Jump Return
To do a procedure call, we need to transfer control to the callee to start the procedure, and return control to the caller when the procedure is done.

The format of the Jump and Link instruction is:
- jal ProcedureAddress

The instruction: 
1. Stores the return address (PC + 4) of the function in R31
2. Then jumps the program to ProcedureAddress

The format of the Jump Return instruction is:
- jr R31

The instruction:
- Jumps back to the address stored in R31

## Register Conventions
We need a register convention so that callers and callees know where to expect arguments and results, and also so that they do not overwrite each other's registers. The callee and caller must be able to save registers and restore them at a later them if it intends to use them again. 

- Saving: Copy a register to main memory where it will not be overwritten
- Restoring: Copy a register back from memory to the original register

### Saving Registers on the Stack
MIPS has a special part of memory called the Stack for saving registers. The stack grows downwards (decreasing address) in MIPS (opposite from usual), and the stack pointer is stored at R29.

- Saving: The data is saved downwards on the stack 
- Recovering: The data is restored from the stack pointer in a LIFO manner at the end of the procedure to the way that it was before

![Stack](img/stack.png#center)

There are also registers that are allocated as Callee Save and Caller Save. These means that if the caller or callee uses those particular registers, the caller or callee will save the current value of these registers on the stack and they will not be overwritten. 

![Caller and Callee Save](img/caller_callee_save.png#center)

In the case of nested procedure calls, the stack is used as follows:

![Caller and Callee Save](img/nested_calls.png#center)





