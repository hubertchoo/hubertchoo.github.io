+++
draft = false
title = "C++: const vs constexpr"
description = ""
type = ["posts","post"]
tags = [
    "c++",
    "development",
]
date = "2023-09-30"
categories = [
    "Digital Electronics",
]
series = ["C++"]
[ author ]
  name = "Hubert Choo"
+++

## Constants

C++ supports two notions of immutability:

const: 
- meaning roughly "I promise not to change this value."
- This is used primarily to specify interfaces so that data can be passed to functions using pointers and references without fear of it being modified. 
- The compiler enforces the promise made by const. 
- The value of a const can be calculated at run time

constexpr: 
- meaning roughly "to be evaluated at compile time." 
- This is used primarily to specify constants, to allow placement of data in read-only memory (where it is unlikely to be corrupted), and for performance. 
- The value of a constexpr must be calculated by the compiler

Since the value of constexpr is calculated at compile-time instead of run-time, the program performs better during run-time. 

### constexpr Functions

A function must be of the type constexpr if its result is to be assigned to a constexpr. 

For example:
```
constexpr double square(double x) { return x∗x; }
constexpr double max1 = 1.4∗square(17); // OK 1.4*square(17) is a constant expression
const double max3 = 1.4∗square(var);    // OK, may be evaluated at run time
```

In the last line above, we see that a constexpr function can be used for non-constant arguments, but the result will no longer be a constexpr and will not be calculated at compile-time. This is merely a feature of the language, so that the constexpr function must not be defined twice: once for constant expressions and once for variables.


To be constexpr, a function must be rather simple and cannot have side effects and can only use
information passed to it as arguments. In particular, it cannot modify non-local variables, but it can
have loops and use its own local variables. For example:

```
constexpr double nth(double x, int n) // assume 0<=n
{
  double res = 1;
  int i = 0;
  while (i<n) { 
    res∗=x;
    ++i;
  }
  return res;
}
```

In a few places, constant expressions are required by language rules (e.g., array bounds, case labels, template value arguments, and constants declared using constexpr). In other cases, compile-time evaluation is important for performance. Independently of performance issues, the notion of immutability (an object with an unchangeable state) is an important design concern.

