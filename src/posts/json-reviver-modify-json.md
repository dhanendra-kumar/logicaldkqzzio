---
title: How the reviver function works with JSON.parse
date: '2017-05-16'
tags: [javascript, json]
description: How to modify a JSON string using the reviver argument of JSON.parse.
---

Sometimes we need to modify the JSON string received from the server side. The best way to do it is to use the "reviver" function with `JSON.parse`.

This post walks through how to modify a JSON string with `JSON.parse`.

`JSON.parse` parses a string to JSON. It also accepts an optional second argument — a "reviver" function — that can be used to mold or modify the values being parsed. In JavaScript terms, the reviver is a callback that is invoked on each property value in the JSON data being parsed. It receives two arguments: `key` and `value`. You can delete a key-value pair from the JSON by returning `undefined`, modify the value based on your need, or return the value unchanged.

Here is a simple example that removes a key-value pair and modifies the value of a key.

<div><script src="https://gist.github.com/dhanendra-kumar/aa7d79b1b855d2f39435d1405e51f80a.js"></script></div>

Hope this helps.
