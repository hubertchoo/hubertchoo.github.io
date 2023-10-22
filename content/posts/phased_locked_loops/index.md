+++
draft = false
title = "Phased-Locked Loops"
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

## Phased-Locked Loops (PLL)
A phased-lock loop is commonly used inside FPGAs to generate desired clock frequencies. They are built into the FPGA fabric, taking in an input clock and outputting a specific desired clock frequency that is different from the input clock.

This resulting clock signal will be routed on the FPGA's internal clock routing network, resulting in lower latency and jitter. In comparison, if we generate a clock signal via logic written in HDL (such as clock divider etc), the signal is route on the FPGA's logic routing network, and it could face congestion and long routing paths. This results in higher latency and jitter.

### Operation of the PLL

The phased-lock loop operates in a negative feedback loop. It takes in an input at clock frequency $f_{ref}$ and attempts to generate an output clock at frequency $n * f_{ref}$.

It compares the phase of two signals, $f_{ref}$ and $\frac{f_{output}}{n}$. If the two signals are not in phase, the input voltage to the Voltage Controlled Oscillator (VCO) is adjusted. The VCO outputs a clock signal based on the input voltage. 

Eventually, the input voltage will be adjusted such that the VCO outputs a clock signal that is exactly n times of the input clock signal, thus allowing us to get our clock signal of desired frequency.

![PLL Feedback Loop](img/pll_feedback_loop.png#center)