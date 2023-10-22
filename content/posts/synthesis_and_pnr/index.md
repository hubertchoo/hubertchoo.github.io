+++
draft = false
title = "Synthesis and Place and Route"
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

## Synthesis Tools and Place and Route

### Synthesis Tools 
A synthesis tool is a computer program that takes in the RTL and translates the design into a series of internal FPGA cells such as flip flops, RAMs, or LUTS. These are described in a netlist. 

### Place and Route
After synthesis, the netlist must be mapped to the actual resoures in the FPGA. This is called the place and route and actually consists of a few different steps:
1. Optimising the netlist: Typically, the first step is to optimise the netlist, removing or replacing any element which is redundant or duplicated. 
2. Placement: The optimised netlist is mapped to the physical cells in the FPGA
3. Routing: The interconnections between the different cells in the FPGA are defined.

This is often performed for several runs in order to meet the timing requirements of the design.