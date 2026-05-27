---
title: How '==' equality works in Groovy (operator overloading)
date: '2017-05-15'
tags: [groovy, grails, equality]
description: Why Groovy's overloaded '==' operator behaves differently from Java's.
---

This post walks through how to use the `==` operator in Groovy and what to expect. Let's start with an example.

<div><script src="https://gist.github.com/dhanendra-kumar/3fad90484920db987137a45bb550e877.js"></script></div>

This looks simple, and you can probably guess the output. Once executed, the actual output is:

<div><script src="https://gist.github.com/dhanendra-kumar/15025f6203cadc10f512637a7e0bc5e0.js"></script></div>

Notice that `==` and `equals()` return different results — we expected `true` on lines 7 and 8 but got `false`. Why?

1. Is there a bug in Groovy?
2. Does `==` call `equals()`?

Plenty of questions can come to mind. The real reason:

> The implementation of `==` in Groovy is slightly different from Java's.

In Java, `==` means equality of primitive types or identity for objects.

In Groovy:

- If the operands are `Comparable`, `==` translates to `a.compareTo(b) == 0`.
- If they are not `Comparable`, `==` translates to `a.equals(b)`.

To check for identity in Groovy, use the `is()` method, e.g. `a.is(b)`.

Hope this helps.
