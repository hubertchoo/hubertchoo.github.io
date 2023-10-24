+++
title = "Spatial Parallelism and Temporal Parallelism (Pipelining)"
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

## Latency and Throughput
The speed of a system is characterized by the latency and throughput of information moving through it. We define a token to be a group of inputs that are processed to produce a group of outputs.

The latency of a system is the time required for one token to pass through the system from start to end. The throughput is the number of tokens that can be produced per unit time.

## Parallelism
The throughput can be improved by processing several tokens at the same time. This is called parallelism, and it comes in two forms: spatial and temporal.

### Spatial Parallelism
With spatial parallelism, multiple copies of the hardware are provided so that multiple tasks can be done at the same time.

![Spatial Parallelism](img/spatial_parallelism.png#center)

Consider a task with latency L. In a system with no parallelism, the throughput is 1/L. In a spatially parallel system with N copies of the hardware, the throughput is N/L.

### Temporal Parallelism (Pipelining)
Temporal parallelism is commonly called pipelining. With temporal parallelism, a task is broken into stages, like an assembly line. Multiple tasks can be spread across the stages. Although each task must pass through all stages, a different task will be in each stage at any given time so multiple tasks can overlap.

![Temporal Parallelism](img/temporal_parallelism.png#center)

Consider a task with latency L. In a system with no parallelism, the throughput is 1/L. In a temporally parallel system, the task is ideally broken into N steps, or stages, of equal length. In such a case, the throughput is also N/L, and only one copy of the hardware is required. However, finding N steps of equal length is often impractical. If the longest step has a latency L1, the pipelined throughput is N/L1.

Pipelining (temporal parallelism) is particularly attractive because it speeds up a circuit without duplicating the hardware. Instead, registers are placed between blocks of combinational logic to divide the logic into shorter stages that can run with a faster clock. The registers prevent a token in one pipeline stage from catching up with and corrupting the token in the next stage.

### Pipelining with Different Numbers of Stages
The following images demonstrate a non-pipelined design, and a two-stage and three-stage pipeline. With more stages, the clock frequency can be increased, allowing latency to remain about the same while increasing throughput.

![No Pipeline](img/no_pipeline.png#center)
![Two-Stage Pipeline](img/two_stage_pipeline.png#center)
![Three-Stage Pipeline](img/three_stage_pipeline.png#center)

### Pipeline Stall and Pipeline Hazards
In the design of pipelined computer processors, a pipeline stall is a delay in execution of an instruction in order to resolve a hazard. In a pipelined CPU, there are cases where sets of instructions will become dependent on one another, reducing the pipeline’s pace. The dependencies in the pipeline are referred to as hazards since they put the execution at risk.

The [three different types of hazards](https://byjus.com/gate/pipeline-hazards-in-computer-architecture-notes/) in computer architecture are:
1. Structural
2. Data
3. Control

#### Structural Hazard
Hardware resource conflicts among the instructions in the pipeline cause structural hazards. Memory, a GPR Register, or an ALU might all be used as resources here. When more than one instruction in the pipe requires access to the very same resource in the same clock cycle, a resource conflict is said to arise.

#### Data Hazard
When the execution of an instruction is dependent on the results of a prior instruction that’s still being processed in a pipeline, data hazards occur.

#### Control Hazards
Control hazard occurs whenever the pipeline makes incorrect branch prediction decisions, resulting in instructions entering the pipeline that must be discarded. A control hazard is often referred to as a branch hazard.