function type(elem, text, index) {
    elem.innerText = text.substring(0, index)
    if (text.length > index)
        setTimeout(type, 80 + Math.random() * 40, elem, text, index + 1)
}

let zenElem = document.querySelector("[data-zen]")

let zen = [
    "Beautiful is better than ugly.",
    "Explicit is better than implicit.",
    "Simple is better than complex.",
    "Complex is better than complicated.",
    "Flat is better than nested.",
    "Sparse is better than dense.",
    "Readability counts.",
    "Special cases aren't special enough to break the rules.",
    "Although practicality beats purity.",
    "Errors should never pass silently.",
    "Unless explicitly silenced.",
    "In the face of ambiguity, refuse the temptation to guess.",
    "There should be one-- and preferably only one --obvious way to do it.",
    "Now is better than never.",
    "Although never is often better than *right* now.",
    "If the implementation is hard to explain, it's a bad idea.",
    "If the implementation is easy to explain, it may be a good idea.",
    "Namespaces are one honking great idea -- let's do more of those!"
]

text = zen.sort(() => Math.random() - 0.5)[0]
zenElem.innerText = text

const zenReload = () => {
    text = zen.sort(() => Math.random() - 0.5)[0]
    zenElem.innerText = text
}

setInterval(zenReload, 5000)

new Typed(".typing", {
    strings: [
        "Tea-Drinker",
        "Hobby-Developer",
        "Java-Developer",
        "Kotlin-Developer",
        "Typescript-Developer",
        "Jetbrains User",
        "I Use Arch Btw",
        "Python-Developer",
        "Web-Developer",
        "HTML-Hakka",
        "AKA Bloeckchengrafik",
        "Tabby-User",
        "German",
        "Uses I3-gaps-rounded-nord-polybar-and-probably-some-other-stuff",
        "Jetbrains > VSCode",
        "Helix > Nvim",
        "Rustacean",
        "Speaks German, English and TypeScript",
        "Linux All Day Every Day",
        "brain stuff"
    ],
    typeSpeed: 100,
    backSpeed: 40,
    loop: true,
    shuffle: true,
    smartBackspace: false
});

console.log("Hey, do you know, what you are doing here? If so, do you want to help me build a project? https://stellarverse.de/")
