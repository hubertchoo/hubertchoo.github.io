+++
draft = false
title = "Shift Registers"
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

## Shift Registers
Shift registers are cascaded flip flops, where the output of one flip flop is passed as input into another flip flop. All registers must share the same clock. Shift registers are usually used to:
- Delay data by a specific number of clock cycles
- Convert serial data to parallel data
- Convert parallel data to serial data