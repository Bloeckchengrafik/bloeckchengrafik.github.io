---
title: 'Functional flavoured OOP'
description: "A try at unifying the world of functional and object oriented programming"
pubDate: 'May 30 2025'
heroImage: '/global-state-hell.png'
preview: true
authors: [ "chris" ]
---

You know the drill, it's 2am and you're debugging some weird heisenbug. _(Note to self: just go to sleep)_ You've just implemented some new rest endpoint and all of the sudden, authentication broke. Welcome to global state hell!

If you're not convinced, this is the culprit: Extensive and often unmanaged reliance on global state lead to increasingly bad code organization. Specifically, such systems are difficult to reason about as the state of any object or the app as a whole can be altered by numerous, sometimes obscure interactions. These kinds of bugs can often not be traced easily to specific code segments but to datastructures. See the following example:
```kotlin
class TickThread(private val tickables: MutableList<Tickable>) {
	fun tick() {
		for (element in tickables) {
			element.tick()
		}
	}

	fun submit(tickable: Tickable) = ...
}

class ForkingExample(private val thread: TickThread) : Tickable {
	override fun tick() {
		thread.submit(ForkingExample(thread))
	}
}
```

In this code, the exception is thrown in the TickThread class, although the erroneous (or at least causing) code in part of the ForkingExample. This is a common problem when using mutable global state. The `TickThread` class relies on the `tickables` list, which can be modified by any part of the code that has access to it. This makes it difficult to track down where changes are made and how they affect the system.

To avoid this problem, we can use a functional approach to OOP. This means that we treat objects as immutable data structures and use functions to transform them. This way, we can avoid the pitfalls of mutable global state and make our code more predictable and easier to reason about.

In classical functional programming, data flows through functions, and functions are pure. This means that they do not have side effects and do not rely on mutable state. In OOP, we can achieve a similar effect by using immutable objects and pure methods. But since we're not in a functional language, we can use polymorphism to get the extendability and flexibility of OOP while avoiding the mentioned issues.

## The Evil of purely object-oriented Code
Let's look at an example of how we can apply this approach in Kotlin. Why kotlin you may ask? Because this is _my_ blog and I can choose the language. Go figure.

We will create a simple rendering system for a book page that consists of different elements like chapter titles, text blocks, and figures. First, let's look at a classical OOP approach, which uses mutable state and inheritance:

```kotlin

interface Element {
    fun render()
    fun getContent(): String
}

class RenderedPage(val elements: List<Element>) {
    fun display() {
        if (elements.isEmpty()) {
            println("(Page is empty)")
        } else {
            elements.forEach { element ->
                println(element.getContent())
            }
        }
    }
}

object Book {
    private val pages = mutableListOf<RenderedPage>()
    
    fun addPage(page: RenderedPage) {
        pages.add(page)
    }
    
    fun getPage(index: Int): RenderedPage? {
        return pages.getOrNull(index)
    }
    
    fun getTotalPages(): Int = pages.size
    
    fun displayBook() {
        pages.forEachIndexed { index, page ->
            println("\n>> Page ${index + 1} of ${pages.size} <<")
            page.display()
        }
    }
}

class ChapterTitle(private val title: String, private var renderedContent: String? = null) : Element {
    override fun render() {
        renderedContent = "# $title"
    }
    
    override fun getContent(): String = renderedContent!!
}

class TextBlock(private val text: String, private var renderedContent: String? = null) : Element {
    override fun render() {
        renderedContent = text
    }
    
    override fun getContent(): String = renderedContent!!
}

class Figure(
    private val path: String,
    private val captionText: String,
    private var renderedContent: String? = null
) : Element {
    override fun render() {
        renderedContent = "![${captionText}]($path)"
    }
    
    override fun getContent(): String = renderedContent!!
}


class PageBuilder {
    private val elementsInProgress: MutableList<Element> = mutableListOf()

    fun addElement(element: Element) {
        this.elementsInProgress.add(element)
    }
    
    fun getRenderedPage(): RenderedPage {
        for (element in elementsInProgress) element.render()
        return RenderedPage(elements = elementsInProgress.toList())
    }
    
    fun reset() {
        elementsInProgress.clear()
    }
}

fun main() {
    val pageBuilder = PageBuilder()
    
    pageBuilder.addElement(ChapterTitle("Chapter 2: The Problems Revisited"))
    pageBuilder.addElement(TextBlock("This chapter delves deeper into the challenges of managing state."))
    pageBuilder.addElement(TextBlock("Another paragraph to illustrate multiple text blocks."))
    
    val page1: RenderedPage = pageBuilder.getRenderedPage()
    page1.display()
    Book.addPage(page1)
    
    // Display the entire book
    Book.displayBook()
    
    println("\n--- Example of potential issue: Forgetting to reset builder ---")
    // Intentionally forget to reset to show potential issues
    // pageBuilder.reset() // <-- Commented out for demonstration
    pageBuilder.addElement(ChapterTitle("Chapter X: The Forgotten Reset"))
    val problematicPage: RenderedPage = pageBuilder.getRenderedPage()
    println("Content of 'Problematic Page' (notice it includes elements from Page 3 if reset was forgotten):")
    problematicPage.display() // This will show elements from page 3 + Chapter X
}
```

This code is not the ideal example but I hope it illustrates my point. The `PageBuilder` class is used to build pages, but if we forget to reset it, it will carry over elements from the previous page and render must be called before getContent for it to not throw an exception. This can lead to unexpected behavior and bugs that are hard to track down.

For SOLID and design pattern enthusiast as well as for the disciples of Uncle Bob, this may not seem like the worst code (a big minus should already be the fact that this is written in kotlin). At least the Single Responsibility Principle, the Open/Closed Principle, and (kinda) the Liskov Substitution Principle are respected. Even Command/Query Separation is respected, as render and getContent are separate methods. The command is a niladic function with no arguments and no return value, while the query returns the content of the element. Great!

## A Sprinkle of Functional

Now, let's refactor this code to use a functional approach with a sprinkle of polymorphism. We will create a `RenderableElement` interface that defines a `render` method, which returns a `RenderedElement`. This way, we can keep our elements immutable and avoid mutable global state.

```kotlin
interface RenderedElement {
    fun toDisplayString(): String
}

data class RenderedPage(val elements: List<RenderedElement>) : RenderedElement {
    constructor(pageElements: List<RenderableElement>): this(
        pageElements
            .map { renderable -> renderable.render() }
            .toList() // Ensures an immutable list
    ) {}
    
    
    override fun toDisplayString(): String {
        return if (elements.isEmpty()) {
            "(Page is empty)"
        } else {
            elements.joinToString(separator = "\n") { it.toDisplayString() }
        }
    }
}

data class RenderedTextBlock(val prefix: String = "", val paragraphText: String) : RenderedElement {
    override fun toDisplayString(): String = "$prefix$paragraphText"
}

data class RenderedFigure(val imagePath: String, val caption: String) : RenderedElement {
    override fun toDisplayString(): String = "![${caption}]($imagePath)"
}

interface RenderableElement {
    fun render(): RenderedElement
}

class ChapterTitle(val title: String) : RenderableElement {
    override fun render(): RenderedElement {
		return RenderedTextBlock(prefix = "# ", paragraphText = title)
    }
}

class TextBlock(val text: String) : RenderableElement {
    override fun render(): RenderedElement {
        return RenderedTextBlock(paragraphText = text)
    }
}

class Figure(val path: String, val caption: String) : RenderableElement {
    override fun render(): RenderedElement {
        return RenderedFigure(imagePath = path, caption = caption)
    }
}

data class Book(val title: String, val pages: List<RenderedPage> = emptyList()) {
    fun addPage(page: RenderedPage): Book {
        return this.copy(pages = this.pages + page) // '+' creates a new list
    }
    
    fun display() {
        if (pages.isEmpty()) {
            println("(This book has no pages yet)")
        } else {
            pages.forEachIndexed { index, page ->
                println("\n--- Page ${index + 1} of ${pages.size} ---")
                println(page.toDisplayString())
            }
        }
    }
}

fun main() {
    var currentBookState = Book("My Functional Document")
    currentBookState.display()

    val elementsForPage1: List<RenderableElement> = listOf(
        ChapterTitle("Functional Adventures in Kotlin"),
        TextBlock("This document explores how to structure rendering using functional principles. Immutability and pure functions are key."),
        Figure("assets/kotlin_logo.png", "Kotlin Mascot"),
        TextBlock("Each element is defined once and then transformed into a rendered representation.")
    )
    println("\n--- Rendering Page 1 (Functional Style) ---")
    val page1 = RenderedPage(elementsForPage1)

    currentBookState = currentBookState.addPage(page1)
    println("\nBook state after adding Page 1:")
    currentBookState.display()

    val elementsForPage2: List<RenderableElement> = listOf(
        ChapterTitle("Benefits of Immutability"),
        TextBlock("Immutable data structures lead to more predictable code and are inherently thread-safe."),
        TextBlock("Reasoning about state becomes simpler when it doesn't change unexpectedly.")
    )
    println("\n--- Rendering Page 2 (Functional Style) ---")
    val page2 = RenderedPage(elementsForPage2)

    currentBookState = currentBookState.addPage(page2)
    println("\nFinal book state after adding Page 2:")
    currentBookState.display()
}
```

This code uses immutable data structures and pure functions to render the elements. Each `RenderableElement` can be transformed into a `RenderedElement`, which is then displayed. The `Book` class holds a list of `RenderedPage` objects, and we can add pages without worrying about mutable state. This approach allows us to reason about the state of our application more easily and avoids the pitfalls of mutable global state. The `RenderedPage` class is immutable, and we can create new instances with different elements without modifying the original page. This way, we can ensure that our rendering system is predictable and easy to maintain.

Here, we can also see another nice side effect: The code is now thread-safe by default. Since we are using immutable data structures, we don't have to worry about concurrent modifications. Render every page in a separate thread? No problem! Each thread will work with its own copy of the data, then merge them at the end if necessary. This is a common pattern in functional programming and can lead to better performance in concurrent applications.

This approach also allows us to easily extend the rendering system by adding new types of elements without modifying existing code. We can simply create new classes that implement the `RenderableElement` interface and provide their own `render` method. This is in line with the Open/Closed Principle, as we can extend the system without modifying existing code. Generally, both object oriented and functional principles are respected, and we can achieve a clean and maintainable codebase.

## Data flow

Now let's talk about data flow. In functional programming, data flows through functions, and functions are pure. This means that they do not have side effects and do not rely on mutable state. Before implementing, make sure you have a clear understanding about the data flow in your application. This will help you to identify the boundaries between different parts of your code and to avoid global state. Note that this is not a lose-lose situation like with SOLID: "Guess wrong and you lose. You'll guess wrong most of the time." The functional approach is not a silver bullet, but it can help you to structure your code in a way that is more predictable and easier to _change_. The latter is often overlooked in OOP, but it is a key aspect of software development. By using immutable data structures and pure functions, we can make our code more flexible and easier to adapt to changing requirements while keeping both cohesion/separation of concerns and code reusability in mind. 

The three people reading this that actually work in software development may have noticed that this is not a new idea. In fact, it is a well-known pattern in functional programming and has been used for decades, for example in the architecture of the Jetpack Compose UI toolkit. The idea is to use immutable data structures and pure functions to create a declarative UI that is easy to reason about and to test. This approach has been proven to work well in practice and can lead to better maintainability.

## Limitations

But this does not come without its drawbacks: The functional approach can lead to more boilerplate code and may require more effort to set up initially. Also, copying data structures can lead to performance issues if not done carefully. However, modern compilers and virtual machines are often able to optimize this, so the performance impact is usually negligible. Additionally, the benefits of immutability and pure functions often outweigh the drawbacks, especially in larger codebases where maintainability and predictability are crucial.



In conclusion, the functional approach to OOP can help us to avoid the pitfalls of mutable global state and to create more predictable and maintainable code. By using immutable data structures and pure functions, we can make our code more flexible and easier to adapt to changing requirements. This approach is not a silver bullet, but it can help us to structure our code in a way that is more predictable and easier to reason about. So next time you find yourself debugging a heisenbug caused by global state, consider applying some functional principles to your OOP code.