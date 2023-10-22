+++
draft = false
title = "HDL For-Loops vs Programming Language For-Loops?"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "development",
]
date = "2023-09-27"
categories = [
    "Digital Electronics",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## What is the difference in a For-loop in VHDL/Verilog vs a For-loop in C?

In C, a For-loop is used to determine how many times to step through a set of instructions sequentially. 

In synthesizable VHDL/Verilog, a for-loop is used to duplicate or expand all of the logic inside the for-loop and makes sure that it runs during the same clock cycle. It does not step through them sequentially at different clock cycles.

However, when the For-loop is not used for synthesis and is used for simulation instead, there can have delays within the loop and behave like a traditional for-loop in other software programming languages.

