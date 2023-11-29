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

## Synthesis Tools and Place and Route and Their Errors and Warnings

### Synthesis Tools 
A synthesis tool is a computer program that takes in the RTL and translates the design into a series of internal FPGA cells such as flip flops, RAMs, or LUTS. These are described in a netlist that describes the desired digital circuit.

The synthesis tool needs to know exactly what type of FPGA you are using so that it knows what resources are available. Since these resources are finite, the synthesis performs logic optimisation/minimisation to figure out how to use them as efficiently as possible. 

#### Logic Optimisation
Logic optimization involves several techniques and transformations aimed at improving the efficiency, performance, and resource utilization of digital logic circuits.

Some common techniques are:
1. Boolean Logic Optimization:
    - Simplification of Boolean Expressions: This involves applying algebraic simplification rules to reduce the complexity of logical expressions, minimizing the number of gates required.
    - Factoring and Common Subexpression Elimination: Identifying and eliminating redundant or common subexpressions to reduce the number of gates and improve efficiency.

2. Technology Mapping:
    - Mapping to FPGA Resources: Selecting the optimal FPGA resources (e.g., Look-Up Tables, flip-flops) to implement specific parts of the design based on the characteristics of the target FPGA architecture.

3. Timing-Driven Optimization:
    - Path Balancing: Adjusting the logic to balance delays across critical paths, ensuring that the overall circuit meets timing constraints.
    - Register Balancing: Optimizing the placement of flip-flops to minimize clock-to-q delays and improve overall timing performance.

4. Resource Sharing:
    - LUT Packing: Combining multiple logical functions into a single Look-Up Table (LUT) to save resources

5. Constant Propagation and Folding:
    - Propagating Constants: Replacing variables with their constant values where applicable.
    - Constant Folding: Evaluating and simplifying expressions with constant values at compile time

#### Some Warnings
1. Inferring Latch for Variable ...
    - It is generally not good practice to use latcahes in favour of flip flops in FPGA design for several reasons.
    - Metastability: Latches are more prone to metastability issues than flip-flops. Metastability occurs when the input to a storage element changes near the time of a clock edge, leading to unpredictable behavior. Flip-flops are designed to mitigate metastability, whereas latches are more susceptible.
    - Timing Closure Challenges: Latches introduce additional complexity to the timing analysis. The analysis tools must consider the setup and hold times for latches, making the design and timing closure more challenging compared to using flip-flops.

#### Non-Synthesisable Code and Functions
Some examples include:
- Time: Keywords that refer to time, such as '$time' in Verilog or 'now' in VHDL
- Printing: Keywords such as '$display()' in Verilog
- Working with files, such as opening and read/write from files

Many of these are used for writing testbenches. 



### Place and Route
After synthesis, the netlist must be mapped to the actual resoures in the FPGA. This is called the place and route and actually consists of a few different steps:
1. Optimising the netlist: Typically, the first step is to optimise the netlist, removing or replacing any element which is redundant or duplicated. 
2. Placement: The optimised netlist is mapped to the physical cells in the FPGA
3. Routing: The interconnections / physical wires between the different cells in the FPGA are defined.

This is often performed for several runs in order to meet the timing requirements of the design.

#### Constraints

To run the place and route process, two constraints are needed at minimum: the pins and the clocks. The pin constriants tell the place and route tool which signals in the code are mapped to which physical pins on the FPGA. The clock constraints tell the tool about the clock frequencies used to drive the FPGA.