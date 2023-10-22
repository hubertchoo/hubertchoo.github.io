+++
draft = false
title = "Inference vs Instantiation"
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

## Inference vs Instantiation

Inference:
- To infer a block (example a block RAM) means to write VHDL/Verilog in a way such that the synthesis tool is able to infer or decide on its own that we want the particular block.
- They could infer it incorrectly, and in the case of a Block RAM for example, could infer using a large number of FFs or LUTs instead of a Block RAM.
- A benefit is that it could make your code more portable between vendors.

Instantiation:
- To specifically instantiate or define the usage of a certain block. 
- There can be different ways of performing instantiation when working with tools from different vendors. 
- For example, one way of instantiating is by using IP cores in the IP Catalog

