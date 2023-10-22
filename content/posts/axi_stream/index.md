+++
draft = false
title = "AXI4-Stream, AXI4, and AXI4-Lite"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "development",
]
date = "2023-09-29"
categories = [
    "Digital Electronics",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## AXI4-Stream

### AXI4-Stream Signals

| **Signal** | **Status** |
|------------|------------|
| TVALID     | _Required_ |
| TREADY     | _Optional_ |
| TDATA      | _Optional_ |
| TSTRB      | _Optional_ |
| TKEEP      | _Absent_   |
| TLAST      | _Optional_ |
| TID        | _Optional_ |
| TDEST      | _Optional_ |
| TUSER      | _Optional_ |

Explaining the signals:
- TVALID: Obvious. Flags whether the data is valid
- TDATA: Obvious. Contains the data that will be transferred via the AXI4-Stream
- TID: Metadata.
- TDEST: Metadata.
- TUSER: Metadata.
- TREADY: Ready signal that handles backpressure and handshaking. This signal comes from the downstream component and indicates if it is ready to receive data. 

### Backpressure
Downstream components use backpressure to tell upstream components that they are not ready to receive the data. The upstream component can then be programmed to stop sending data when the Ready signal is low. The absence of backpressure logic might result in data being dropped.

Backpressure from downstream components can be handled by using a FIFO to buffer the data. This stores the data and prevents it from being dropped, allowing the data to be sent to the downstream component once Ready is high.

### Conditions to perform a data transfer
Data is transfer when TVALID AND TREADY.

## AXI4
AXI is a memory-mapped interface that is composed of five parallel AXI Stream interfaces. It is used for interconnecting components that have memory-mapped (addressable) interfaces, such as when writing to a CPU memory address space. AXI allows us to specify the memory address, and to read/write from the address. The five parallel AXI Stream channels consist of the following:
- Read Address (AR): From master to slave interface
- Read Data (R): From slave to master interface
- Write Address (AW): From master to slave interface
- Write Data (W): From master to slave interface
- Write Response (B): From slave to master interface.

Each channel, just like an AXI Stream, consists of VALID/READY handshake signals and the payload signals. There are additional signals for the AXI channels compared to typical AXI Streams, such as the specification of a data payload length. The signals for each channel, explanations, and demonstrations on how to do read/write requests can be found [here](https://habr.com/en/articles/572926/).

## AXI4-Lite

AXI-Lite is similar to AXI, but lacking in burst access capability. It has a simpler interface than the full AXI interface.

### What is a burst?
Burst mode is a generic electronics term referring to any situation in which a device is transmitting data repeatedly without going through all the steps required to transmit each piece of data in a separate transaction. The initial overhead or delay due to processes such as accessing the memory only occur once, hence increasing data throughput, and latency of subsequent data transfers. 

From AMD documentation:
Bursting is an optimization that tries to intelligently aggregate your memory accesses to the DDR to maximize the throughput bandwidth and/or minimize the latency. The burst feature of the AXI4 protocol improves the throughput of the load-store functions by reading/writing chunks of data to or from the global memory in a single request.