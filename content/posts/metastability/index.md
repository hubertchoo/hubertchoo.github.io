+++
title = "Metastability, Asynchronous Inputs, and Clock Domain Crossing"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "digital electronics",
]
date = "2023-07-19"
categories = [
    "Digital Electronics",
]
series = ["Digital Electronics"]
[ author ]
  name = "Hubert Choo"
+++

## Metastability
When the input to a flip flop happens between $t_{setup}$ and $t_{hold}$ (also known as the aperture time) of the rising CLK edge, the output Q may momentarily take on a voltage between 0 and VDD that is in the forbidden zone. This is called a metastable state. Eventually, the flip-flop will resolve the output to a stable state of either 0 or 1. However, the resolution time required to reach the stable state is unbounded.

### What is the reason for the existence of the set-up and hold time?

A master–slave D flip-flop is created by connecting two gated D latches in series, and inverting the enable input to one of them (the first D latch has its enable input set as NOTCLOCK). 

The set-up time is present because there is propogation delay of the first D latch. There has to be sufficient time for the first D latch latch the signal while the CLK is low, before the second D latch can latch the signal once the CLK signal becomes high. This is the origin of the set-up time.

The hold time requirement comes from the propogation delay of the NOT gate for the CLK cycle for the first D latch. While the CLK switches from low to high, the NOT CLK switches from high to low only after the propogation delay of the NOT gate, not at the exact same time. Hence, the input should not be changed at this time, the first D latch still acts as transparent before its enable signal has changed, causing the output of the flipflop to be metastable.

https://www.youtube.com/watch?v=3_GDoBc7JdU

### Resolution Time
If the input to a flip flop changes outside the aperture, then $t_{res}$ = $t_{pcq}$ (Clock-to-Q propogation delay). But if the input happens to change within the aperture, $t_{res}$ can be substantially longer.

Theoretical and experimental analyses have shown that the probability that the resolution time, $t_{res}$, exceeds some arbitrary time, $t$, decreases exponentially with $t$:

$$P(t_{res}>t) = \frac{T_0}{T_c}e^{-\frac{t}{\tau}}$$

where $T_c$ is the clock period, $T_0$ and $\tau$ are characteristics of the flip flop. This equation is only valid for $t$ much larger than $t_{pcq}$.

Intuitively, $\frac{T_0}{T_c}$ describes the probability that the input changes at a bad time (i.e., during the aperture time). 

$\tau$ is a time constant indicating how fast the flip-flop moves away from the metastable state; it is related to the delay through the cross-coupled gates in the flip-flop.

In summary, if the input to a bistable device such as a flip-flop changes during the aperture time, the output may take on a metastable value for some time before resolving to a stable 0 or 1. The amount of time required to resolve is unbounded, because for any finite time, $t$, the probability that the flip-flop is still metastable is nonzero. However, this probability drops off exponentially as $t$ increases. Therefore, if we wait long enough, much longer than $t_{pcq}$, we can expect with exceedingly high probability that the flip-flop will reach a valid logic level.

### Synchronisers
Asynchronous inputs to digital systems from the real world are inevitable. Human input is asynchronous, for example. If handled carelessly, these asynchronous inputs can lead to metastable voltages within the system, causing erratic system failures that are extremely difficult to track down and correct.

To guarantee good logic levels, all asynchronous inputs should be passed through synchronizers.

A synchronizer is a device that receives an asynchronous input D and a clock CLK. It produces an output Q within a bounded amount of time; the output has a valid logic level with extremely high probability. If D is stable during the aperture, Q should take on the same value as D. If D changes during the aperture, Q may take on either a HIGH or LOW value but must not be metastable.

![Synchronizer](img/synchroniser.png#tallercenter)

A simple way to build a synchronizer is out of two flip-flops. F1 samples D on the rising edge of CLK. If D is changing at that time, the output D2 may be momentarily metastable. If the clock period is long enough, D2 will, with high probability, resolve to a valid logic level before the end of the period. F2 then samples D2, which is now stable, producing a good output Q.

For this synchroniser design, we need the following criteria to be met: the source clock domain is slower than destination clock domain. By satisfying this criteria we can be sure that the destination clock captures any possible changes in signal without loss.

We say that a synchronizer fails if Q, the output of the synchronizer, becomes metastable. This may happen if D2 has not resolved to a valid level by the time it must setup at F2 — that is, if $t_{res} > T_c − t_{setup}$. According to above, the probability of failure for a single input change at a random time is:

$$P(failure) = \frac{T_0}{T_c}e^{-\frac{T_c - t_{setup}}{\tau}} $$

If D changes N times a second, the probability of failure per second is:

$$P(failure)/sec = N\frac{T_0}{T_c}e^{-\frac{T_c - t_{setup}}{\tau}} $$

The Mean Time Between Failure is given by:

$$MTBF = \frac{1}{P(failure)/sec} = \frac{T_c e^{-\frac{T_c - t_{setup}}{\tau}}}{N T_0}$$

The MTBF improves exponentially as the synchronizer waits for a longer time $T_c$

### Clock Domain Crossing
One of the most common way to handle Clock Domain Crossing (CDC) is usage of synchronizer circuits. Synchronizer circuits purpose is to minimize the probability of the metastability and increase MTBF.

More Clock Domain Crossing techniques can be found [here](https://hardwarebee.com/clock-domain-crossing-techniques-for-fpga/). There are also inbuilt primitives which can be used for taking care of CDCs for Xilinx devices.

#### Crossing from slower clock domain to faster clock domain
The 'double flop' (using two flip flops) is a simple and commonly used method to cross from a slower to faster clock domain when taking in signals from outside the FPGA.

Others can also be found in the link above.

#### Crossing from faster clock dommain to slower clock domain
In this situation, the data inside the fast clock domain might change before the slow clock domain even sees it. In order to transfer a signal from a fast clock domain to a slow clock domain, we must stretch out the signal so that the slower clock domain will not miss the signal.

#### Something that can be used for both slow-to-fast and fast-to-slow clock domain transitions
The FIFO can be used to send data between two clock domains regardless of their speeds, and when large data transfer is needed. Read the FIFO post for more information.