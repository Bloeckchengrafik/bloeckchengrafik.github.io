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

        for (let i = 0; i < hrefs.length; i++) {
            hrefs[i].href = json["html_url"]
        }

        // why, I won't change my name?!
        for (let i = 0; i < names.length; i++) {
            names[i].innerText = json["name"]
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
    ].sort(() => (Math.random() > 0.5) ? 1 : -1),
    typeSpeed: 100,
    backSpeed: 40,
    loop: true,
});