---
title: linkers are evil
description: Linker shenanigans and the coursework RISC-V cpu
status: resolved
pubDate: 2026-09-29T00:50:00+02:00
tags: [fpga, coursework]
---

Recently I had 2 big issues with my coursework RISC-V cpu; both had something to do with the annoying linker.

One was something along the lines of "the bus adress of this adress is not where the in-memory adress is". This lead to the linker 
generating weird jumps to out-of-bounds memory. 2hrs wasted. I know it could have been faster. I know it isn't neccessarily
the linker's fault. Just still mad.

Then: the linker script I used (which was provided by my professor) had the sections and stack position set up split. Made for some weird 
errors with unanswered wishbone transactions. Quite the fun debugging experience. 

Still: i hate linkers.
