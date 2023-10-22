+++
draft = false
title = "SRAM and DRAM"
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

## SRAM and DRAM

SRAM: Static Random Access Memory

DRAM: Dynamic Random Access Memory

Both SRAM and DRAM are external memory. They are both volatile, meaning that information written to them are cleared when power is removed. However, DRAM also needs to be constantly refreshed in order to maintain their values (hence non 'static').

### Use Cases
SRAM:
- SRAM is usually more suitable if the requirements are short, non-sequential reads and writes to memory. 
- It has faster access times and lower latency. SRAM tends to be used as a cache in a CPU. 
- Interestingly, SRAM consists of latches (build out of transistors) to store its values, which is why it does not have to be refreshed.

DRAM:
- DRAM is better when there are large bursts of read/writes or sequential memory addresses, eg an image from a camera to memory. 
- DRAM tends to be of a larger size. 
- DRAM holds data using a transistor and capacitor. The capacitor discharges, which is why the DRAM must be refreshed to maintain its value.

### SDRAM and DDR
SDRAM: Single Data-rate RAM

DDR: Double Data Rate Sychronous DRAM

DDR is able to transfer data (read/write) both on the rising and falling edges of the clock. Since all other sequential circuitry change only on the rising edge of the clock, DDR is essentially able to do 2 read/writes per clock cycle.