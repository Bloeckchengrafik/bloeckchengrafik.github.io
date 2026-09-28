---
title: avoiding vivado
description: Avoiding vivado for small spartan-7 designs
status: open
pubDate: 2026-09-29T00:42:00+02:00
tags: [fpga, vivado]
---

I tried to port the minsoc-rv project we had at uni to `yosys` + `nextpnr`. Simple designs worked quite well using `apio` as the
toolchain manager. However, the full soc was not ported successfully.

I had: `apio` executing `fusesoc` executing `yosys` + `nextpnr`; a combination that works quite okay. But: Vivado is more lax
while parsing HDL files compared to `yosys` + `nextpnr`. This led to incompatibilities in need of local patching. Which was..
painful. 

After patching, it still didn't work. The CPU ran ok, I currently think it was just the JTAG adapter failing with that combo.
Anyways. Too much of my weekend spent on tooling; tackling this one later.
