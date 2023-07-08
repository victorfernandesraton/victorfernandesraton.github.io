---
title: Creating this blog Part 2
description: Basic blog structure
published_at: 2023-07-07
cover: /public/assets/img/profile.webp
---

# Without vite, swc complex config, just npx cli command
Nullstack is very consistent, because of this structure, everything in nullstack is based on things is were worked well along side the internet, isntead of create something like css module, for default nullstack support css and sass style.

For create and manager your aplication, you don´t need handle with complex stuff like vite , webpack or babel, Nullstack have a npx tool to create application , with is have some things on a opitional support like tailwind, typescript and sass support, is a convension over configuration like 


# First of all: Folder design

The first thing i start love in nullstack is about freedom, unlike next.js or angular you don´t have a definitive folder structure. According the documentation, the only thing you need is:

- A client.js file witch is used for loading global client stuff, like added a global event or consume an browser api like Localstorage
- A server.js file witch is used for loading server side things like enviroment virables, connect an api or even write an http endpoint (because the second great thing about nullstack, in terms of runtime is a simple express server running in Node.js with is have all libs you are loved)
- A Application.js/jsx/njs file because is like React, a App.js file for initialize your application

```javascript
const highlight = "code";
```
