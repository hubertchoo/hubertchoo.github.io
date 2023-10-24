+++
title = "Verilog vs VHDL"
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

## Verilog vs VHDL

### Low Level Modelling
Verilog and VHDL are both capable of modeling hardware. However, in terms of low-level hardware modeling, Verilog is better than VHDL.

#### Built-In Primitives and User-Defined Primitives
Verilog is originally created for modeling and simulating logic gates. Verilog has built in primitives like gates, transmission gates, and switches. These are rarely used in design (RTL Coding), but are used in post synthesis world for modeling the ASIC/FPGA cells. 

![Built-In Primitives](img/primitives.png#center)

Verilog supports User-Defined Primitives (UDP) so that designers can define their own cell primitives. This feature is especially necessary and popular for ASICs designers.

Rather than the familiar module / endmodule keywords, we declare a UDP via the keywords primitive / endprimitive. UDPs have some differences from user-defined modules.

UDP Rules:
- UDP takes only scalar input terminals (1 bit).
- UDP can have only one scalar output. The output terminal must always appear first in the terminal list.
- The state in a sequential UDP is initialized with an initial statement.
- State table entries can contain values of 0, 1 or X. Z values passed to a UDP are treated as X values.
- UDPs are defined at the same level as modules.
- UDPs are instantiated exactly like gate primitives.
- UDPs do not support inout ports.

### High Level Modelling
#### Data Types
Verilog has very simple data types and it's all defined by Verilog language. Users cannot define their own data types. Verilog has two main data types including net data types (for connecting components together such as wire (most popular), wor, wand, tri, trior, etc.) and variable data types (for temporary storage such as reg (most popular), integer, time, real, and realtime). 

VHDL supports many different data types including predefined VHDL data types and User-Defined data types. Predefined VHDL data types include bit, bit_vector, string, time, boolean, character, and numeric (real or integer). VHDL allows designers to define different types based on the predefined VHDL data types; this is a good feature for complex and high-level systems which may use many different data types. 

#### Enumerated and Record Type
VHDL supports enumerated and record (like structures in C) data type which allows users to define multiple signals for one data type. Verilog does not support enumerated and record type (But SV supports enum).

#### Libraries and Packages
Packages can be used to declare a type, subtype, constant, file, alias, component, attribute, function etc to be used in different VHDL files of a same project. 

There is no package definition in Verilog. The closest Verilog equivalent to VHDL package is \`include Verilog compiler directive. Functions or definitions can be separately saved in another file and then use it in a module by using `include directive.

A library is a collection of related packages. Verilog does not have library management while VHDL does include design libraries on the top of the code. VHDL libraries contain compiled architectures, entities, packages, and configurations. This feature is very useful when managing large design structures.

#### Configurations
Configurations exist in VHDL and we can use configuration constructs to create variants of a module or testbench without maintaining multiple versions of the file.

### VHDL is strongly typed vs Verilog is loosely typed
VHDL code must be correctly written with matched and defined data types. It means that there will be a compiler error if you mix data types or mismatch signals when assigning in VHDL. On the other hand, Verilog is a loosely typed language. In Verilog, you can mix data types or mismatch signals when assigning.

In Verilog, signals with different bits width can be assigned to each other. Verilog compiler will adapt the width of the source signal to the width of the destination signal. Unused bits will be optimized during synthesis.

Verilog has no problem when you mix data types when assigning, such as an int to a reg.

## Verilog vs SystemVerilog
SystemVerilog is a combination of both Hardware Description Language (HDL) and Hardware Verification Language (HVL) and combined termed as HDVL. SystemVerilog acts as a superset of Verilog with a lot of extensions to Verilog language.

Just some additional features of SystemVerilog:

C-Like Features:
- SystemVerilog supports an object oriented paradigm.
- SystemVerilog supports various datatypes like enum, union, struct, string, class.
- We can use ‘ifdef and typedef to define aliases for existing types. Useful, e.g., for switching between four- and two-valued simulations
- SystemVerilog provides C-like structs and unions in both packed and unpacked forms
- SystemVerilog provides operator overloading facilities like those in C++ through the bind keyword
- SystemVerilog provides C++-like classes with automatic garbage collection. In SystemVerilog, classes support the following aspects of object-orientation – encapsulation, data hiding, inheritance and polymorphism.
- SystemVerilog supports packages.

Many of these C-like software features such as OOP are used to write tesstbenches, which is more of a software project. OOP supports writing reusable code, especially for verification environments. Writing a test for hardware is a software problem, and OOP is a proven methodology for writing abstract, highly reusable, and highly maintainable software code. Relevantly, classes are used to model reusable verification environments and the abstract data and methods that operate on them.

Hardware Modelling Features:
- In RTL design, a Verilog always block models combinational logic, sequential logic driving flip-flops, or sequential logic driving latches, never more than one. SystemVerilog’s always_comb, always_ff, and always_latch keywords make the designer’s intent clear to the compiler so it can issue error messages.

Many many more details [here](https://www.cs.columbia.edu/~sedwards/classes/2009/embedded-languages/verilog.pdf).




A lot of the content in this post is from [here](https://www.fpga4student.com/2017/08/verilog-vs-vhdl-explain-by-example.html) and [here](https://dl.acm.org/doi/10.1145/240518.240664).