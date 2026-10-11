const endScreen = document.getElementById("end-screen");

// closure screen is fixed and permanent until the code is removed
const SHOW_END_SCREEN = true;

if (endScreen) {
    endScreen.classList.add("active");
}

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


document.querySelectorAll("a").forEach(link => {

    const href = link.getAttribute("href");

    if (href && href.endsWith(".html") && !href.startsWith("#")) {

        link.addEventListener("click", event => {

            event.preventDefault();

            const index = document.querySelector(".recuerdos-index");

            if (index) {
                index.classList.add("exit");
            }

            document.body.classList.add("page-exit");

            setTimeout(() => {
                window.location.href = href;
            }, 500);

        });

    }

});


const songsToggle = document.getElementById("songs-toggle");
const songsMenu = document.getElementById("songs-menu");

if (songsToggle && songsMenu) {

    songsToggle.addEventListener("click", () => {

        songsMenu.classList.toggle("active");

        songsToggle.textContent =
            songsMenu.classList.contains("active") ? "▲" : "▼";

    });

}


const charactersToggle = document.getElementById("characters-toggle");
const charactersMenu = document.getElementById("characters-menu");

if (charactersToggle && charactersMenu) {

    charactersToggle.addEventListener("click", () => {

        charactersMenu.classList.toggle("active");

        charactersToggle.textContent =
            charactersMenu.classList.contains("active") ? "▲" : "▼";

    });

}


const mobileIndex = document.querySelector(".recuerdos-index");
const mobileIndexToggle = document.getElementById("mobile-index-toggle");

if (mobileIndex && mobileIndexToggle) {

    mobileIndexToggle.addEventListener("click", () => {

        mobileIndex.classList.toggle("open");

        if (mobileIndex.classList.contains("open")) {
            mobileIndexToggle.textContent = "❯";
        } else {
            mobileIndexToggle.textContent = "❮";
        }

    });

}


const visitCounter = document.getElementById("visit-count");

if (visitCounter) {

    let visits = localStorage.getItem("loveVisits");

    if (!sessionStorage.getItem("loveVisitCounted")) {

        if (!visits) {
            visits = 1;
        } else {
            visits = Number(visits) + 1;
        }

        localStorage.setItem("loveVisits", visits);
        sessionStorage.setItem("loveVisitCounted", "true");

    }

    visitCounter.textContent = visits;

}


const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

if (daysElement && hoursElement && minutesElement && secondsElement) {

    const startDate = new Date("2025-11-02T00:00:00");

    function updateLoveTime() {

        const now = new Date();
        const difference = now - startDate;

        const totalSeconds = Math.floor(difference / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysElement.textContent = days;
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");

    }

    updateLoveTime();

    setInterval(updateLoveTime, 1000);

}
