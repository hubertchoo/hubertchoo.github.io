+++
draft = false
title = "Verification Concepts"
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

## Digital Design Verification

The process of testing and validating the correctness and functionality of a digital design before it is released. 

### Types of Verification

- Formal Verification: Use of mathematical proofs to verify the correctness of the design.
- Behavioural Simulation (on RTL)
- Functional and Timing Simulation (on Post Synthesis and Post Implementation)

### Ways of designing a testbench

- Linear Testbench

Simply means to apply test stimuli to a design sequentially

- File-based Testbench

Test stimuli and expected results are read from files rather than being generated dynamically. 

- Constraint Random Verification

A technique to generate randomised test cases with specific constraints based on the requirements of the input stimuli. CRV can generate a large number of randomised test cases that cover a wide range of scenarios, and can scale to large numbers of test cases with relative ease. It is also easy and quick to implement CRV. 

However, the generated test cases may not cover all possible scenarios. Debugging failed test cases can be difficult as the root cause of the failure is not immediately apparent.

- State Machine Testbench

Uses a state machine to control the stimulus applied to the DUT and the expected results. By using a state machine compared to a linear testbench, the testbench can dynamically respond to feedback from the DUT, and generate more complex stimulus patterns eg protocol verification testbenches. 

- Self-checking Testbench

The testbench itself verifies the design output rather than relying on a separate verification tool or manual inspection.

- Other ways using programming languages such as C++, Python etc

Tools such as cosimulation, cocotb, or verilator allow for tests to be written in programming languages. This allows for additional functions such as Python library support.