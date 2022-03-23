function type(elem, text, index) {
    elem.innerText = text.substring(0, index)
    if (text.length > index)
        setTimeout(type, 80 + Math.random()*40, elem, text, index + 1)
}

fetch("https://api.github.com/users/Bloeckchengrafik")
    .then(async value => {
        let json = JSON.parse(await value.text())
        let profilePictures = document.querySelectorAll("[data-profilepicture]")
        let hrefs = document.querySelectorAll("[data-href]")
        let names = document.querySelectorAll("[data-name]")

        // Now I can't forget to change my pfp on the website
        for (let i = 0; i < profilePictures.length; i++) {
            profilePictures[i].src = json["avatar_url"]
        }

        // Handy if I change my username - oh wait...
        for (let i = 0; i < hrefs.length; i++) {
            hrefs[i].href = json["html_url"]
        }

        // why, I won't change my name?!
        for (let i = 0; i < names.length; i++) {
            type(names[i], json["name"], 0)
        }
    })

new Typed(".typing", {
    strings: [
        "Tea-Drinker",
        "Pupil",
        "Hobby-Developer",
        "Weeb",
        "Java-Developer",
        "Jetbrains-Enthusiast",
        "I Use Arch Btw",
        "Linux Elitist",
        "Python-Developer",
        "Web-Developer",
        "HTML-Hakka",
        "Bloeckchengrafik",
        "Codes in Cursive",
        "Tabby-User",
        "German",
        "Uses KDE Plasma 5",
        "What the heck are NFTs?"
    ],
    typeSpeed: 100,
    backSpeed: 40,
    loop: true,
    shuffle: true,
    smartBackspace: false
});