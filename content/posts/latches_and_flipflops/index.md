+++
draft = false
title = "Latches and Flip-Flops"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "development",
]
date = "2023-09-26"
categories = [
    "Digital Electronics",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## Latches and Flip-Flops

A latch or flip flop in digital electronics is a circuit with two stable states that can be used to store binary data. The stored data can be changed by applying varying inputs.

Latches are basic storage elements that operate with signal levels (rather than signal transitions). Latches are useful for the design of the asynchronous sequential circuit.

A latch is level-triggered, while a flip flop is edge-triggered. Flip-flops are useful for the design of synchronous sequential circuits as they can be triggered by a clock edge.

### Latches
There are various kinds of latches:
1. Set-Reset (S-R) Latch
2. J-K Latch
3. Data (D) Latch
4. Toggle (T) Latch

#### S-R Latch
The S-R Latch is implemented using two inputs: S (Set) and R (Reset). The S input sets the output to 1, while the R input resets the output to 0. When both S and R are at 1, the latch is said to be in an “undefined” state.

It is a circuit with:
1. 2 cross-coupled NOR gate or 2 cross-coupled NAND gate. 
2. 2 input S for SET and R for RESET. 
3. 2 output Q, Q’. 

The S-R Flip Flop has an additional clock signal on top of the S and R signals. Changes in the output only occur at clock transitions for the S-R Flip Flop.

![SR Latch](img/sr_latch.png#center)

#### J-K Latch
The J-K latch is very similar to the S-R latch. While also having set and reset outputs, the J-K latch has a combination of inputs that toggles the output of the latch. This replacecs the 'Invalid' output of the S-R latch.

![JK Latch](img/jk_truthtable.gif#center)


#### D Latch
D latches are also known as transparent latches and are implemented using two inputs: D (Data) and an Enable signal. The output of the latch follows the input at the D terminal as long as the Enable signal is high. When the Enable signal goes low, the output of the latch is stored and held until the Enable signal is high again. 

Note that the D flip flop is not just a direct substitution of a clock signal for the Enable signal. The DFF works with signal transitions rather than signal levels. 

![D Latch](img/d_latch.png#center)

#### T Latch
When the T input is high, the output state is toggled.

![T Latch](img/t_latch.jpg#center)

### Advantages and Disadvantages of Latches 
From [here](https://www.geeksforgeeks.org/latches-in-digital-logic/):

Advantages of Latches:
1. Easy to Implement: Latches are simple digital circuits that can be easily implemented using basic digital logic gates.
2. Low Power Consumption: Latches consume less power compared to other sequential circuits such as flip-flops.
3. High Speed: Latches can operate at high speeds, making them suitable for use in high-speed digital systems. This is because they are asynchronous and the CLK signal is not needed.
4. Low Cost: Latches are inexpensive to manufacture and can be used in low-cost digital systems.
5. Versatility: Latches can be used for various applications, such as data storage, control circuits, and flip-flop circuits.

Disadvantages of Latches:
1. No Clock: Latches do not have a clock signal to synchronize their operations, making their behavior unpredictable.
2. Unstable State: Latches can sometimes enter into an unstable state when both inputs are at 1. This can result in unexpected behavior in the digital system.
3. Complex Timing: The timing of latches can be complex and difficult to specify, making them less suitable for real-time control applications.


## Flip Flops



### Types of Flip Flops
1. JK FF
2. D FF
3. T FF
4. SR FF

