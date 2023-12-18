+++
draft = false
title = "Meeting Timing Closure"
description = ""
type = ["posts","post"]
tags = [
    "FPGA",
    "development",
]
date = "2023-10-03"
categories = [
    "Digital Electronics",
]
series = ["FPGA"]
[ author ]
  name = "Hubert Choo"
+++

## Fixing Timing Closure

There are more ways to fix timing closure issues in an FPGA design than to "just put registers to pipeline it".

### A quick recap on timing closure issues

Timing closure issues occur when there is at least one path in the design that fails to meet the setup and hold time requirements of a flip flop. This means that the signal might be taking too long to propogate from the output of one flip flop to the input of another. 

The time taken for a signal to propogate from one flip flip to another (transport delay) is given by the sum of logic delays (due to logic blocks) and net delays (due to wires). Hence, timing closure can be performed by lowering these two sources of delays.

### Lowering Logic Delays

1. Rewrite the code differently. Some ways of designing differently that can reduce logic delays include:
    - Making a counter count downwards so that the final comparison is against zero
    - Avoid comparisons like greater than, greater etc. Instead, comparisons such as equal are less complex (uses less LUTs)
    - Instead of multiplications, use shift operations. Multiplications that are not with powers of two can be achieved using some subtraction, such as a * 28 == (a << 5) - (a << 2)

### Lowering Net Delays

1. Constraining a register to a physical location that is the center splot among its destinations can reduce net delay
2. Further improvements can be made by performing reducing fanout and performing replication. This technique creates multiple duplicates of the source registers, spreading them among different locations which translates to shorter paths. However, this actually lowers the slack of the signals setting this source registers (think about the capacitance increasing with more fanouts of the previous sources). 
3. If some signals require more than 1 cycle to propogate between the source and destination, one way is a multi-cycle path.

Finally, you can also use pipelining if latency is not the main consideration.


https://www.linkedin.com/pulse/weekly-blog-005-timing-everything-brightelligence-ltd?trk=pulse-article_more-articles_related-content-card