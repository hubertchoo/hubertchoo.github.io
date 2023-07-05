+++
title = "What Do I Learn To Be An FPGA Engineer?"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "learning",
]
date = "2023-07-03"
categories = [
    "FPGA",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## How Do I Break Into The FPGA Industry?

That is the title of [this Reddit thread](https://www.reddit.com/r/FPGA/comments/11ufijp/how_do_i_break_into_the_fpga_industry/). One of the top comments mention the following: 

    In no particular order.

    FPGA
        - Learn to write either Verilog, SystemVerilog or VHDL, the ones you don't know how to write, at least know how to read.
        - Know the existence of new HDLs like SpinalHDL, Chisel, Amaranth, Bluespec-SV, etc. You do not necessarily have to know or use them, but know they exist and why.
        - Learn to use standardized memory busses, this includes AXI, AXI-Lite, Avalon, Wishbone, AHB, APB. You do not need to know all of them, you just need to know some of them well and you should know the others exist.
        - Learn to use standardized streaming busses, this is basically AXI-Stream or similar.
        - Know when and how to do a clock domain crossing.
        - Learn to follow common design patterns that use reusable modules, such as FIFOs, switches, muxes, header/footer extraction (from streams), CRC checkers, pattern generators, pattern checkers, bus adapters, etc.
        - Learn to write IO and timing constraints, know what set_output_delay and set_input_delay does, what set_false_path does, what set_clock_group does.
        - Learn to use similar/same internal interfaces for different external interfaces, UART, Ethernet, SpaceWire, Aurora, CAN, etc can all use the same internal interface as each other
        - Learn to write self checks into your code so stuff cannot be parameterized into a mode that you did not test or is not a valid configuration.
        - Learn to bring up a high speed serial transceiver for SATA, JESD, PCIe, high speed Ethernet, SpaceWire, etc.
        - Learn to interact with external memory through vendor provided IP (Xilinx DDR MIG, or whatever)

    Verification
        - Learn to simulate more, just in general. I don't care which tool.
        - If you plan on going into ASIC or big FPGA companies, learn something like UVM, else learn something like VUnit or CocoTB if you want to work on small teams.
        - Learn to use a traditional simulator and the open source stuff like Verilator which has some specific use cases where it wins, hard.
        - Learn to write bus functional models to allow for module and system level simulation where you have to interact with an external component.
        - Learn to write simulation bus drivers with internal self checks.

    Tool Automation
        - For all of the above, learn to script your tools for commonly done tasks, project generation, build modifications, etc.
        - Learn to develop tools that keep your work across domains/tools in sync, register maps, configuration management, etc
            - systemrdl-compiler/peakrdl or Questa Register Check for registers
            - Learn to write tools that can take HDL files with your own syntax added and use the file as a template to generate custom code for a specific project
            - Learn how to write HLS tools, not just use them. Often it makes sense to use your own custom HLS for something particularly repetitive but different enough between boards/projects.

    FPGA/Verification/Software
        - Learn to use Git, Subversion, Perforce. One source control system, please, anything but random files in folders or zip files.
        - Learn to automate build/test flows, learn GitHub Actions, or Jenkins, or GitLab CI
        - Learn to build consistent environments, maybe use Docker or similar.
        - Learn to use linters and static code analysis tools.
            - FPGA/Verification: SVLint, CDC Linters, Reset Domain Linters, etc.
            - Software: CppLint, PyLint, etc.
        - Learn to use document generators for all your languages

    Software
        - Learn to write enough C/C++, Python, or whatever that it is enough to drive an external FPGA connected over UART, SPI, Ethernet, PCIe or whatever
            - Learn how to setup project properly, Python packages, C/C++ libaries, static linking, dynamic linking, etc.
        - Learn to write enough Embedded C to do some stuff on an FPGA+ARM SoC
            - Learn to use Make or CMake or similar

    Electrical Design
        - Know how to read schematics even if you don't know how to design a PCB.
        - Learning to design simple PCBs while you are in school probably not a bad idea. Depending on the job you might have to interact with the people designing a custom board for you. Knowing their challenges can really help the process.

    Application Skills
        - DSP
            - Learn to script stuff like filter tap generation for FIR filters
            - Learn to write a modulator and demodulator
            - Learn to write a FEC encoder or decoder
            - Learn what IQ samples are and why complex numbers are important
        - Image Processing
            - Learn how to do things like 2D convolution
            - Learn how to buffer lines
            - Learn to handle edge cases on the edge of the screen
        - DSP/Image Processing
            - Learn when it makes sense to consider tools like Simulink HDL Coder
        - Networking
            - Learn how to process Ethernet packets with their headers in FPGA
            - Learn to use WireShark
            - Understand IP frames, UDP frames well

And from ChatGPT, with an added emphasis on HFT applications:

    Certainly! Here are detailed topics to learn for each section of the learning plan:

    1. Foundation in Electrical Engineering or Computer Science:
      - Digital logic design: Boolean algebra, logic gates, truth tables, Karnaugh maps.
      - Computer architecture: CPU organization, memory hierarchy, I/O systems.
      - Programming languages: C/C++, Python, data structures, algorithms.
      - Mathematics: Discrete mathematics, linear algebra, probability theory.

    2. Digital Design and FPGA Programming:
      - Combinational and sequential circuits: Multiplexers, decoders, encoders, flip-flops, counters, shift registers.
      - Hardware description languages (HDL): VHDL or Verilog syntax, data types, modules, signals, processes, simulation.
      - Testbench creation and functional verification of digital designs.
      - FPGA-specific concepts: Lookup tables (LUTs), flip-flops, IOBs (input/output blocks), clocks, clock domains.

    3. High-Frequency Trading Fundamentals:
      - Introduction to financial markets: Stocks, bonds, futures, options, derivatives.
      - Trading strategies: Market making, statistical arbitrage, momentum trading, mean reversion.
      - Order types and execution mechanisms: Limit orders, market orders, stop orders, iceberg orders, order routing.
      - Market data and order book management: Tick data, level 2 data, order matching algorithms, order book modeling.
      - Latency and high-speed data communication: Network protocols (TCP/IP, UDP), hardware acceleration, field-programmable gate arrays (FPGAs) for low-latency trading.

    4. FPGA Development Tools:
      - Xilinx Vivado or Intel Quartus Prime: Project creation, synthesis, place and route, timing analysis.
      - Design constraints: Clock constraints, input/output constraints, area constraints.
      - Advanced FPGA features: Clock domain crossing (CDC), clock skew, metastability, floorplanning, power analysis.

    5. Low-Level Programming:
      - C/C++ programming: Pointers, memory management, data structures, algorithms.
      - Optimization techniques: Loop unrolling, loop pipelining, loop fusion, cache optimization, vectorization.
      - Parallel programming: Multithreading, SIMD (Single Instruction Multiple Data), GPU programming (CUDA/OpenCL).

    6. FPGA Design Skills:
      - Digital signal processing (DSP) on FPGAs: Filters, FFT (Fast Fourier Transform), digital modulation/demodulation.
      - Real-time data processing: Pipelining, streaming data, data buffering techniques.
      - High-speed data communication: Ethernet, TCP/IP, UDP, FPGA-based network interface cards (NICs).

    7. FPGA-Based Trading Systems:
      - HFT system architectures: Market data handlers, order execution engines, risk management systems.
      - Design patterns: Finite state machines (FSMs), clock domain crossing (CDC) techniques, data serialization.
      - Latency optimization techniques: Hardware acceleration, pre-trade risk checks, order book modeling.
      - FPGA and CPU interaction: DMA (Direct Memory Access), PCIe (Peripheral Component Interconnect Express) communication, memory-mapped I/O.

    8. Technology and Industry Trends:
      - FPGA advancements: New FPGA families and architectures (e.g., Xilinx UltraScale, Intel Stratix), high-level synthesis (HLS), partial reconfiguration.
      - High-frequency trading research and publications: Academic papers on trading algorithms, latency optimization, market microstructure.
      - Industry news and blogs: Stay updated on FPGA-related news, algorithmic trading strategies, and HFT regulations.

    9. Internship or Job Opportunities:
      - Apply theoretical knowledge to real-world projects in FPGA development or high-frequency trading.
      - Collaborate with experienced engineers, learn from their expertise, and gain practical insights.

