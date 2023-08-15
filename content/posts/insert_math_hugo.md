+++
title = "Inserting Math Expressions in a Hugo Post"
description = ""
type = ["posts","post"]
tags = [
    "go",
    "golang",
    "hugo",
    "development",
]
date = "2023-07-03 10:00:00"
categories = [
    "Development",
    "golang",
]
series = ["Hugo 101"]
[ author ]
  name = "Hubert Choo"
+++

## 1. Make a local copy of layouts/partials/header.html

This local copy will overwrite the copy in the theme when being built.

## 2. Insert the following code block at the top of the local copy of layouts/partials/header.html

```html
<script type="text/x-mathjax-config">
    MathJax.Hub.Config({
        tex2jax: {
        inlineMath: [ ['$','$'], ["\\(","\\)"] ],
        processEscapes: true
        }
    });
</script>

<script type="text/javascript"
    src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
```