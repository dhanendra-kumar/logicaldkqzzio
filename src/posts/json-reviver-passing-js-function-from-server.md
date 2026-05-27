---
title: Sending a JavaScript function in a JSON response
date: '2017-05-17'
tags: [javascript, json]
description: How to pass a JS function from the server in a JSON response and use it on the client side.
---

Sometimes you need to pass a JavaScript function in a JSON response from the server and use it on the client.

This post walks through how. First, make sure you understand how the reviver function and `JSON.parse` work — see the [previous post](/blog/json-reviver-modify-json/).

The trick is to put the function body as a string in the JSON, then turn it back into a function on the client using the reviver:

<div><script src="https://gist.github.com/dhanendra-kumar/1ae55792b6afaf7d542c1b064ab2d331.js"></script></div>

Hope this helps.
