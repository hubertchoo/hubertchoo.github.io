+++
title = "Five-Stage Pipelined MIPS Series: 1. Introduction to MIPS and RISC"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "digital electronics",
]
date = "2023-07-15"
categories = [
    "Digital Electronics",
]
series = ["Digital Electronics"]
[ author ]
  name = "Hubert Choo"
+++

## The MIPS and RISC Architectures
From Wikipedia, MIPS (Microprocessor without Interlocked Pipelined Stages) is a family of reduced instruction set computer (RISC) instruction set architectures (ISA) developed by MIPS Computer Systems, now MIPS Technologies.

### Reduced Instruction Set Computer (RISC) Instruction Set Architectures
Similarly, Wikipedia explains this simply and easily:

  A reduced instruction set computer (RISC) is a computer architecture designed to simplify the individual instructions given to the computer to accomplish tasks. Compared to the instructions given to a complex instruction set computer (CISC), a RISC computer might require more instructions (more code) in order to accomplish a task because the individual instructions are written in simpler code. The goal is to offset the need to process more instructions by increasing the speed of each instruction, in particular by implementing an instruction pipeline, which may be simpler to achieve given simpler instructions.

  The key operational concept of the RISC computer is that each instruction performs only one function. The RISC computer usually has many (16 or 32) high-speed, general-purpose registers with a load–store architecture in which the code for the register-register instructions (for performing arithmetic and tests) are separate from the instructions that grant access to the main memory of the computer. The design of the CPU allows RISC computers few simple addressing modes and predictable instruction times that simplify design of the system as a whole. 

### Some Features of RISC Architectures
Perhaps it is more succint to look at some of the features when attempting to better understand RISC architectures:
- Single-cycle operation seeking to deliver an average throughput approaching one instruction per cycle for any single instruction stream
- Uniform instruction format: fixed-length instructions and a simple encoding, which simplifies fetch, decode, and issue logic considerably
- All general-purpose registers can be used equally as source/destination in all instructions, simplifying compiler design
- Simple addressing modes with complex addressing performed by multiple instructions
- RISC designs are also more likely to feature a Harvard memory model.

### Havard vs von Neumann Architectures
The Harvard architecture is a computer architecture with separate storage and signal pathways for instructions and data. It is often contrasted with the von Neumann architecture, where program instructions and data share the same memory and pathways. 

In a Harvard architecture, there is no need to make the two memories share characteristics. In particular, the word width, timing, implementation technology, and memory address structure can differ. In some systems, instructions for pre-programmed tasks can be stored in read-only memory while data memory generally requires read-write memory. In some systems, there is much more instruction memory than data memory so instruction addresses are wider than data addresses. 

In a system with a pure von Neumann architecture, instructions and data are stored in the same memory, so instructions are fetched over the same data path used to fetch data. This means that a CPU cannot simultaneously read an instruction and read or write data from or to the memory. In a computer using the Harvard architecture, the CPU can both read an instruction and perform a data memory access at the same time, even without a cache. A Harvard architecture computer can thus be faster for a given circuit complexity because instruction fetches and data access do not contend for a single memory pathway.

#### A Modified Harvard Architecture
A modified Harvard architecture machine is very much like a Harvard architecture machine, but it relaxes the strict separation between instruction and data while still letting the CPU concurrently access two (or more) memory buses. The most common modification includes separate instruction and data caches backed by a common address space. While the CPU executes from cache, it acts as a pure Harvard machine. When accessing backing memory, it acts like a von Neumann machine (where code can be moved around like data, which is a powerful technique). This modification is widespread in modern processors, such as the ARM architecture, Power ISA and x86 processors.

#### [CPU Caches](https://www.makeuseof.com/tag/what-is-cpu-cache/)
A CPU cache is a hardware cache used by the central processing unit (CPU) of a computer to reduce the average cost (time or energy) to access data from the main memory. A cache is a smaller, faster memory, located closer to a processor core, which stores copies of the data from frequently used main memory locations. 

L1 (Level 1) cache is the fastest memory that is present in a computer system. In terms of priority of access, the L1 cache has the data the CPU is most likely to need while completing a certain task. The L1 cache is usually split into two sections: the instruction cache and the data cache. The instruction cache deals with the information about the operation that the CPU must perform, while the data cache holds the data on which the operation is to be performed.

L2 (Level 2) cache is slower than the L1 cache but bigger in size. Where an L1 cache may measure in kilobytes, modern L2 memory caches measure in megabytes. When it comes to speed, the L2 cache lags behind the L1 cache but is still much faster than your system RAM. The L1 memory cache is typically 100 times faster than your RAM, while the L2 cache is around 25 times faster.

The L3 cache is the largest but also the slowest cache memory unit. Modern CPUs include the L3 cache on the CPU itself. But while the L1 and L2 cache exist for each core on the chip itself, the L3 cache is more akin to a general memory pool that the entire chip can make use of.

#### MIPS IS DEAD???? 
"MIPS Technologies (the company) no longer designs MIPS processors. Development of the MIPS processor architecture has now stopped, and MIPS (the company) will start making chips based on RISC-V."

Read the article here: [Wait, What? MIPS Becomes RISC-V](https://www.eejournal.com/article/wait-what-mips-becomes-risc-v/)