+++
draft = false
title = "Adder Circuits"
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

## Half Adder
The half adder takes in two operands A and B and outputs Sum and Cout.
- $Sum = A \oplus B$
- $Cout = AB$

## Full Adder
The full adder takes in three operands A, B, and Cin and outputs Sum and COUT.
By observing the truth table and performing boolean algebra, we can find:
- $Sum = A \oplus B \oplus C_{IN}$
- $COUT = AB + C_{IN}(A \oplus B)$

This is also equivalent to using two full adders, along with an OR gate. 

![Full Adder Circuit](img/fulladder.png#center)

## Ripple Carry Adder
The ripple carry adder is a digital circuit that produces the arithmetic sum of two binary numbers.
- Formed using cascaded full adders, with each full adder used to sum two bits of the same index in both numbers.
- The carry-out is passed from the less significant bits to the more significant bits. 
- It works in the same way as most pencil-and-paper methods of addition.

Downside:
- The output for each full adder can only be calculated when the carry-out of the previous full adder is available. In this way, the carry signal has to 'ripple' from the least significant bit to the most significant bit. This means that the final sum and the carry bits will only be valid after a significant delay, given by the sum of propogation delay of each full adder.

![Ripple Carry Adder Circuit](img/ripplecarryadder.jpg#center)

## Carry Lookahead Adder

The carry lookahead adder (CLA) is an adder with improved latency.

### Expressing a Full Adder in Terms of Generate and Propogate Bits.
The first step is to rewrite the expression of COUT of a full adder to the following expression:
- $COUT = AB + AC_{IN} + BC_{IN} = AB + (A + B)C_{IN} = G + PC_{IN}$
- where $G = AB$ is known as the Generate bit
- where $P = A + B$ is known as the Propogate bit 

Essentially, this means that with only knowledge of A and B, and without knowledge of CIN, one can determine if COUT will be definitely generated / have a value of 1 without waiting for the CIN value to be determined (based on G value), or if the value of COUT is achieved by propogating the value of CIN (based on P value).

In fact, P is usually defined as $P = A \oplus B$ which allows S to simply be expressed as a function of P and CIN, $S = P \oplus C_{IN}$.

### Illustrating Latency Reduction of a 4-bit CLA Adder
We use the example of a 4-bit CLA adder to illustrate its latency reduction over a ripple-carry adder. 

Recall that for a single full adder, its carry-out can be expressed as $COUT = G + PC_{IN}$. Expressing the carry-out for each of the four adders, we get the following four expressions: 
- $C_1 = G_0 + P_0C_0$
- $C_2 = G_1 + P_1C_1 = G_1 + P_1G_0 + P_1P_0C_0$
- $C_3 = G_2 + P_2C_2 = G_2 + P_2G_1 + P_2P_1G_0 + P_2P_1P_0C_0$
- $C_4 = G_3 + P_3C_3 = G_3 + P_3G_2 + P_3P_2G_1 + P_3P_2P_1G_0 + P_3P_2P_1P_0C_0$

We have seen above that G and P only depend on the values of A and B, which are known for all full adders from the beginning. $C_0$ is also known from the start. Hence, the carry-out bits for all four full adders can be found without the need for the carry-in to propagate through all full adders.

### What about the Sum?
As mentioned before, $S = P \oplus C_{IN}$, so also does not depend on the previous full adders.

### Delay Comparison between Carry Lookahead Adder and Ripple Carry Adder

In order to calculate the delays associated with the output of each adder, we refer to the table below, showing the CMOS gate delays and areas normalized relative to an inverter:

![Gate Delays](img/gate_delays.png#center)

For a single full adder, the delays associated with the SUM and COUT results are 6 delays and 4 delays respectively (normalized to an inverter):

![Full Adder Delays](img/fulladder_delaus.png#center)

Now, looking at the structure of a Ripple Carry Adder, we see that the worst-case path for the most significant COUT and SUM passes through the COUT 'ripple' path of each full adder (which as seen above, has a delay of 4).

#### Delay of Ripple Carry Adder Circuit

![Ripple Carry Adder Circuit](img/ripplecarryadder.jpg#center)

The worst-case delay for the COUT of an n-bit ripple-carry adder is hence given as:
- $C_{out}Delay = 4n$

The worst-case delay for the SUM of an n-bit ripple-carry adder is hence given as:
- $SumDelay = 4(n-1) + 3$
- 4(n-1) is the delay taken for the CIN of the MSB full adder to be computed
- 3 is the delay taken to XOR the CIN with A XOR B to generate SUM

#### Delay of Carry Lookahead Adder Circuit

For the Carry Lookahead Adder, we refer again to the boolean expression for the most significant COUT result:
- $C_4 = G_3 + P_3C_3 = G_3 + P_3G_2 + P_3P_2G_1 + P_3P_2P_1G_0 + P_3P_2P_1P_0C_0$

The value of the final COUT signal will be available after a delay of 5: 3 due to the XOR operation of the propogate signal, and 2 to implement the above equation.