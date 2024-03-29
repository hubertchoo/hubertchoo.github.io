+++
draft = false
title = "IIC (Inter-Integrated Circuit)"
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

## IIC
IIC is a synchronous, multi-master/multi-slave (controller/target), single-ended, serial communication bus. It is widely used for attaching lower-speed peripheral ICs to processors and microcontrollers in short-distance, intra-board communication. 

The master is defined as the device that clocks the bus, addresses slaves and writes or reads data to and from registers in the slaves. The slaves are devices that respond only when interrogated by the master, through their unique address. Hence it is imperative to avoid duplication of addresses among slaves. Slaves never initiate a data transfer.

### IIC Design
The IIC bus uses only two bidirectional lines, Serial Data Line (SDA) and a Serial Clock Line (SCL). When there is no data transmission, the SDA line idles in the HIGH state. Transmission occurs by pulling the lines low, and bits are clocked on falling clock edges.

### Data Transmission Protocol
IIC data packets are arranged in 8-bit bytes comprising slave address, register number, and data to be transferred. Transmission over the bus is either a read or write operation.

### Start and Stop Conditions
As the name suggests a start condition always occurs at the start of a transmission and is initiated by the MASTER device. This is done to wake the idling SLAVE devices on the bus. 

This is one of the two times the SDA line is allowed to change state when SCL is high. 
- To signify a start condition, the SDA line transitions from HIGH state to LOW state, while SCL is HIGH.
- The SDA line transitions from LOW to HIGH state, while SCL is HIGH, to signify a stop condition.

### Address Byte
The upper 7 bits, constitute the slave address, while the 8th bit serves as a READ/WRITE# command bit. Thus there is an address space of 128 unique addresses for addressing up to 128 slaves. This is sent following the start condition.

Once the address byte has been read by the corresponding SLAVE it will acknowledge this transfer by sending an acknowledge bit by pulling SDA LOW for the adjacent clock HIGH pulse period.

Until a stop bit is sent, communication will happen between the master and that slave.

### Acknowledge / No Acknowledge
As a form of feedback, after every byte transmission the receiving device sends an Acknowledge or Not Acknowledge bit. An Acknowledge bit is generated by the receiver by holding the SDA line low during a HIGH SCL period.

An ACK is used to denote that a byte (address or data) was transmitted and received successfully and that the transmission can continue on to the next byte transfer, a stop condition or a repeated start. A NACK is generally used by the receiver to indicate whether an error occurred somewhere in the data transmission. This is used to signal to the transmitting device to terminate the transmission immediately or to make another attempt by sending a repeated start.

### Data Bits
Data bits encode the actual transmission data and are transmitted in 8-bit byte format, starting with the MSB, and each bit is synchronized with the clock signal (SCL). There is no limit to the number of bytes in a transmission, but each byte must be followed by an Acknowledge which is generated by the recipient of the data.

![IIC Write](img/iic_write.png#center)
![IIC Read](img/iic_read.png#center)