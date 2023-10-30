+++
draft = false
title = "C++: User-Defined Types"
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

## User-Defined Types

### Structures
A structure has the following syntax:

```
struct Vector {
  int sz; // number of elements
  double* elem; // pointer to elements
};
```

We use . (dot) to access struct members through a name (and through a reference) and -> to access struct members through a pointer.

### Classes
We often want to keep the representation inaccessible to users so as to ease use, guarantee consistent use of the data, and allow us to later improve the representation. To do that we have to distinguish between the interface to a type (to be used by all) and its implementation (which has access to the otherwise inaccessible data).

A class has a set of members, which can be data, function, or type members. The interface is defined by the public members of a class, and private members are accessible only through that interface.

A class has the following syntax:
```
class Vector {
public:
  Vector(int s) :elem{new double[s]}, sz{s} { } // construct a Vector
  double& operator[](int i) { return elem[i]; } // element access: subscripting
  int size() { return sz; }
private:
  double* elem; // pointer to the elements
  int sz; // the number of elements
};
```

A member "function" with the same name as its class is called a constructor, that is, a function used to construct objects of a class. There is no fundamental difference between a struct and a class; a struct is simply a class with members public by default. For example, you can define constructors and other member functions for a struct.

### Unions
A union is a struct in which all members are allocated at the same address so that the union occupies only as much space as its largest member. In simpler words, a union is a struct that lists the possible datatypes that it can contain, and at each time it is only one of those types of data.

Its syntax is given by:
```
union Value {
  Node* p;
  int i;
};
```

The language does not keep track of which kind of value is held by a union, so the programmer must do that:
```
struct Entry {
  string name;
  Type t;
  Value v; // use v.p if t==ptr; use v.i if t==num
};
```

###  Variant
The standard library type, variant, can be used to eliminate most direct uses of unions. A variant stores a value of one of a set of alternative types. For example, a variant<Node*,int> can
hold either a Node* or an int. Using variant, the Entry example could be written as:
```
struct Entry {
  string name;
  variant<Node*,int> v;
};
```

### Enumerations

In addition to classes, C++ supports a simple form of user-defined type for which we can enumerate the values:
```
enum class Color { red, blue, green };
enum class Traffic_light { green, yellow, red };

Color col = Color::red;
Traffic_light light = Traffic_light::red;
```

Enumerations are used to represent small sets of integer values. They are used to make code more readable and less error-prone than it would have been had the symbolic (and mnemonic) enumerator names not been used.

#### enum vs enum class
The class after the enum specifies that an enumeration is strongly typed and that its enumerators are scoped. Being separate types, enum classes help prevent accidental misuses of constants. In particular, we cannot mix Traffic_light and Color values:
```
Color x = red; // error : which red?
Color y = Traffic_light::red; // error : that red is not a Color
Color z = Color::red; // OK
```

The enumerators from a "plain" enum are entered into the same scope as the name of their enum and implicitly converts to their integer value. For example:
```
enum Color { red, green, blue };
int col = green;
```
Here col gets the value 1. By default, the integer values of enumerators start with 0 and increase by one for each additional enumerator.




