+++
draft = false
title = "Static Hazards"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "development",
]
date = "2023-09-25"
categories = [
    "Digital Electronics",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## Static Hazards

![Slide 1](img/slide1.png#centertaller)
![Slide 2](img/slide2.png#centertaller)

## Two Types of Static Hazards

Static-1 Hazards: 
- In response to an input change, a logic circuit may go to 0 when it should remain constant at 1. 
- Static-1 Hazards occur in a Sum-of-Product circuit

Static-0 Hazards:
- In response to an input change, a logic circuit may go to 1 when it should remain at 0.
- Static-0 Hazards occur in a Product-of-Sum circuit

## Hazards vs Glitches

A hazard is a glitch waiting to happen. A glitch is the occurance of the undesirable output.