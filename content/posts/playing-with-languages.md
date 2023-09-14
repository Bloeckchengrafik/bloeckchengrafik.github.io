---
author: "Christian Bergschneider"
title: "Playing with Languages (Vol. 1 - Pling)"
date: "2023-09-14"
description: "Ever wanted to build your own programming language?"
tags:
- languages
---

A while back, I participated in a hackathon called [Lang Jam](https://github.com/langjam/) with the awesome people at [Sync Client](https://github.com/Sync-Private). During this hackathon, the goal was to build a programming language in 48 hours fitting a theme. In this case "The sound(ness) of one hand typing". This blog post is about the technical details of the language we built called [Pling](https://pling.syncclient.dev/) and the process of building it.

## The Idea

After the theme was announced, we had some troubles with coming up with an idea. We had a lot of ideas, but none of them really fit the theme. At around 11pm UK time, we finally came up with the following ideas:
- The language should be able to be typed with one hand (no modifier keys)
- The language should be able to generate (music, sound effects, etc.), play and read (microphone input) sound
- The language should match the theme of Koans (Impossible to solve, but you can learn from it)

Especially the first requirement was difficult to implement, since there are many keyboard layouts, so we decided on using the special characters ```=;,`#.[]```.

## The Battle Plan

Some would argue, building a language is hard. I would argue, building a language in 48 hours is even harder. So we decided to split the work so everyone could work on their own part:
- **The parser and the lexer** is the part that takes the source code and turns it into an abstract syntax tree (AST). 
- **The Runtime** is the part that executes the AST and does the heavy lifting of executing the code.
- **The Standard Library** is the part that provides the functions and types that are available to the user. In this case, we wanted to provide a way to generate sound and play it - more on that later.
- **The IDE integration and the debugger** is the part that provides the user with a way to write code and debug it. Since the language would be written in Java, we decided to support the IntelliJ Platform with a plugin.
- **The documentation and the website** is essential for the presentation of the language. We wanted to provide a way to learn the language easily and with style.

The language was fully built using Java, the website was built using Svelte (my favorite web framework) and the IDE integration was built using Kotlin.

## Parser vs. Lexer

Before I describe how we implemented these two components, let's just get everyone on the same page about what a parser and a lexer is. 

A Lexer is a component that takes the source code and turns it into a list of tokens. A token is a small piece of information that describes a part of the source code. For example, the following source code:
```pling
#print `Hello, World`;
```
would be turned into the following tokens:
- Reference(#)
- Identifier(print)
- String(Hello, World)
- End(;)

A Parser is a component that takes the list of tokens and turns it into an abstract syntax tree (AST). An AST is a tree-like structure that describes the source code. Using the same example from above, the AST would look like this:
```pling-dbg-ast
StatementsNode
  CallNode{name='print', args=[StringNode{value='Hello, world'}]}
```

The AST is then executed by the runtime.

## The Lexer

Building a lexer is not a simple task, especially because of the many different choices you have to make. We decided to build one from the ground up - because why not? 

We knew, we'd need some tokens for the language, so we started with the following:
    STRING, // `String` (ignore \escape)
    NUMBER, // 123 or 0x123 or 12.3, nothing negative yet
    ASSIGN, // =
    REFERENCE, // #
    OPEN, // [
    CLOSE, // ]
    COMMA, // ,
    END, // ;
    IDENTIFIER, // Identifier
    ANY, ANY_ANYNUM, EOF, BLOCK; // internal use only

- `STRING` is a token that represents a string. It is surrounded by backticks and can contain any character except for backticks. We decided to use backticks, because they are easy to type with one hand.
- `NUMBER` is a token that represents a number. It can be a decimal number, a hexadecimal number or an integer. 
- `ASSIGN` is a token that represents an assignment. Here, it is equal to `=`.
- `REFERENCE` is a token that represents a reference. When a name is prefixed with this, it is treated as a call.
- `OPEN` is a token that represents an opening bracket used for blocks.
- `CLOSE` is a token that represents a closing bracket used for blocks.
- `COMMA` is a token that represents a comma used for separating arguments.
- `END` is a token that represents the end of a statement. Here, it is equal to `;`.
- `IDENTIFIER` is a token that represents an identifier. It can be any string that is not a keyword.

We also added some internal tokens like ANY, ANY_ANYNUM, EOF and BLOCK. These are used as markers to simplify some match operations. More on that later.

The basic structure of the lexer object is as follows:
```java
public class Lexer {
    private String source;
    private final List<Token.WithData> tokens = new ArrayList<>();
    private int current = 0;
} 
```

The lexer takes the source code as a string and stores the tokens in a list. The current variable is used to keep track of the current position in the source code.

Next, we'll need to add some functionality for moving through the source code. For this, we implemented a `next()`, a `peek()` and a `isAtEnd()` method. The `next()` method returns the next character in the source code and increments the current position. The `peek()` method returns the next character in the source code without incrementing the current position. These are trivial, so I won't show them here. If you want to check them out, you can find them [in the source code](https://github.com/Sync-Private/Pling/blob/main/engine/src/main/java/dev/syncclient/pling/lexer/Lexer.java).

To do the heavy lifting of actually lexing the source code, we implemented a `lex()` method. This method is the main method of the lexer. It loops through the source code using `while (!isAtEnd())` and first peeks, then consumes a character on each iteration if a token is found. If no token is found, it throws an exception. In python-like pseudo-code, it looks like this:
```python

def lex():
    while !isAtEnd():
        c = peek()

        if c == "=":
            tokens.add(ASSING.withData(next()))
        ...
        else:
            raise LexicalException("Unexpected character")

```

This is a very simple lexer and is very errorprone, but it works for our use case. If you want to check out the full implementation, you can find it in the source referenced above.

## The Parser

To parse some tokens into an AST (Abstract Syntax Tree), we first need to define what an AST is. An AST is a tree-like structure that describes the source code. So we built a tree structure and a bunch of possible nodes that declare the code structure on a type level:
- StatementsNode - A node that contains a list of statements
- FuncDefNode - A node that contains a function definition
- BranchNode - A node that contains a branch (if/else)
- LoopNode - A node that contains a loop (while)
- VarDefNode - A node that contains a variable definition
- VarSetNode - A node that contains a variable assignment (this is important later in the executor)
- CallNode - A node that contains a function call
- ReturnNode - A return statement
- UseNode - An import statement

We also added some nodes that represent values:
- NumberNode
- StringNode
- VariableNode

To parse the tokens into an AST, we implemented a recursive descent parser. A recursive descent parser is a parser that uses recursive functions to parse the tokens. The root of it is a method called `stmts()` that parses a list of statements. 