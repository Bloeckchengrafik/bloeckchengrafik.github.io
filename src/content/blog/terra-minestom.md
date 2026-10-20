---
title: 'Terra on Minestom'
description: "Terra is a world generation library for Minecraft. It's a great library, but it's not compatible with Minestom. Let's fix that!"
pubDate: 'Dec 29 2024'
heroImage: '/terra-minestom-resources/screenshot1.webp'
authors: [ "chris" ]
---

> This blog post is a work in progress. I will update it as I make progress on the project.

I've been working on a [Minecraft server](https://asorda.net) for a while now that uses Minestom as the server software. Minestom is a great server software, but it does not come with world generation out of the box. After some tests with my own world generation, I decided to use Terra because I couldn't get the performance and polish I wanted with my own world generation in a reasonable amount of time.

There was just one issue: Terra is not compatible with Minestom. This blog post is about how I made it compatible.

## Terra

Terra is a world generation library for Minecraft that is fully customizable since it uses add-ons and a configuration pack to generate a world. This makes it very powerful and flexible. Building these config packs way easier and more accessible than writing your own world generation code. It's also well-documented, which is a big plus. I highly recommend Terra if you want to generate cool worlds for your Minecraft server. It is available for Paper(+), Fabric, Forge, CLI and now also Minestom. Check it out [here](https://github.com/PolyhedralDev/Terra).

The Terra Generation Process works as follows (simplified):
First, a `ChunkGenerator` generates a `ProtoChunk`. A ProtoChunk is a chunk that is not yet fully generated, only the base terrain exists here. After a chunk has been generated, it can be used for feature generation. Feature Generation is the process of adding things like trees, ores, and structures to the world. This process assumes a fully generated world for reading and writing blocks, the so-called `ProtoWorld` because the features just place blocks regardless of chunk borders. But there is one (very big) problem: Minecraft worlds are [_enormous_](https://youtu.be/ob3VwY4JyzE?t=145) so generating the whole world at once is not feasible. My current implementation generates `ProtoChunks` on demand, whenever the feature generation needs them and caches them for later use. This is probably not the most efficient way to do it, but it works for now.

## Minestom

Minestom is a Java Library for creating Minecraft servers. It is very fast and lightweight while not implementing many vanilla features, which is why I chose it for my server. The Minestom-Community is also very active and helpful, although the documentation is a bit lacking. You can find more about Minestom [here](https://minestom.net/).

## Compatibility

Terra is written with multi-platform support in mind. This made it fairly easy to get some basic generation up and running. Just adding the gradle module and the required libraries was enough to get a testserver working. Minestom generates Worlds on a chunk-by-chunk basis, which works nicely with the first `ProtoChunk` step of Terra. The feature generation step is a bit more complicated since it needs to access out-of-chunk blocks as well as write to them. Writing is fairly easy using the Minestom [fork-API](https://minestom.net/docs/world/generation#modifying-over-unit-borders). Reading not so much. Currently, I cache the last 32 generated chunks in a LRU-Cache using the `caffeine` library and generate the `ProtoChunks` on demand. After a fair amount of fiddling and help from the [Terra Discord](https://discord.gg/PXUEbbF), I got this:

![Terra on Minestom](/terra-minestom-resources/screenshot1.webp)
![Terra on Minestom](/terra-minestom-resources/screenshot2.webp)
![Terra on Minestom](/terra-minestom-resources/screenshot3.webp)

## How can I use it?

You can't. Yet. The code is opensource but I want to get it to a more stable state before I add it to the Terra repository. I will update this blog post when it is ready. If you insist on using it now, you can find the code [here](https://github.com/everbuild-org/Terra/tree/feat/platform/minestom). Keep in mind that this is a work in progress and not stable at all as well as not feature complete (Entities, Biomes, Items and Commands are not implemented yet).

## Conclusion

I am very happy with the progress I made so far. I learned a lot about world generation and Minestom and got to know the Terra community a bit better. As always I hope that this project will be useful for other Minestom users as well.

If you got any questions or feedback, feel free to open an issue on my [fork](https://github.com/everbuild-org/Terra) or [join my discord server](https://discord.gg/2y6HqtvBqW). I am always happy to help.