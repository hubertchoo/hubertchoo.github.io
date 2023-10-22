+++
draft = false
title = "When would you use FPGAs?"
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

## When would you use FPGAs?

There are several reasons why a person/team would use an FPGA for a particular application:
1. Latency: FPGAs perform time-critical processing. FPGAs are able to process data at low latency and with consistent timing performance.
2. Connectivity: FPGAs provide (up to a large number of) IO pins, which allow you to connect to other hardware over a variety of communication protocols.
3. Reconfigurable: FPGAs allow for reprogramming as the design changes, which set them apart from ASICs, which cannot be changed after manufacturing. This saves on manufacturing and engineering cost and man hours, and is a better option for applications that require frequent updates or changes to be pushed.
4. Power Efficiency: Compared to a CPU or a GPU, FPGAs have the highest performance per watt of power.
5. Parallelisable: Certain processes or algorithms have a highly parallelisable nature, making them especially suitable for FPGAs.

## When would you maybe not use FPGAs?

Of course, there are limited advantages to using FPGAs if the above cases do not apply to you. However, you might want to especially stay away from using FPGAs if:
- Your problem is inherently sequential
- The problem involves a lot of branching (decision-making logic)

