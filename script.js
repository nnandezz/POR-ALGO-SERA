```js
const anniversaryWaiting = document.getElementById("anniversary-waiting");

const waitingDays = document.getElementById("waiting-days");
const waitingHours = document.getElementById("waiting-hours");
const waitingMinutes = document.getElementById("waiting-minutes");
const waitingSeconds = document.getElementById("waiting-seconds");

const waitingProgressBar = document.getElementById("waiting-progress-bar");
const waitingProgressPercent = document.getElementById("waiting-progress-percent");

let audioContext = null;

function initClockAudio() {
    try {
        if (!audioContext) {
            const AudioContextClass =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContextClass) return;

            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume().catch(() => {});
        }
    } catch (error) {
        audioContext = null;
    }
}

function playClockTick() {
    try {
        if (!audioContext || audioContext.state !== "running") return;

        const now = audioContext.currentTime;

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(1200, now);
        oscillator.frequency.exponentialRampToValueAtTime(700, now + 0.045);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.055, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + 0.09);

        const oscillator2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();

        oscillator2.type = "triangle";
        oscillator2.frequency.setValueAtTime(850, now + 0.025);
        oscillator2.frequency.exponentialRampToValueAtTime(500, now + 0.065);

        gain2.gain.setValueAtTime(0.0001, now + 0.025);
        gain2.gain.exponentialRampToValueAtTime(0.025, now + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        oscillator2.connect(gain2);
        gain2.connect(audioContext.destination);

        oscillator2.start(now + 0.025);
        oscillator2.stop(now + 0.095);
    } catch (error) {
        return;
    }
}

initClockAudio();

["click", "touchstart", "keydown", "pointerdown"].forEach(eventName => {
    window.addEventListener(eventName, initClockAudio, {
        once: true,
        passive: true
    });
});

const clockSecondElements = [
    document.getElementById("waiting-seconds"),
    document.getElementById("seconds")
].filter(Boolean);

const previousClockSeconds = new Map();

function checkClockTick() {
    clockSecondElements.forEach(element => {
        const currentValue = element.textContent;

        if (!previousClockSeconds.has(element)) {
            previousClockSeconds.set(element, currentValue);
            return;
        }

        const previousValue = previousClockSeconds.get(element);

        if (currentValue !== previousValue) {
            previousClockSeconds.set(element, currentValue);
            playClockTick();
        }
    });
}

setInterval(checkClockTick, 100);

if (anniversaryWaiting) {
    document.body.style.overflow = "hidden";
}

if (
    anniversaryWaiting &&
    waitingDays &&
    waitingHours &&
    waitingMinutes &&
    waitingSeconds &&
    waitingProgressBar &&
    waitingProgressPercent
) {
    const waitingStart = new Date("2025-11-02T00:00:00");
    const anniversaryDate = new Date("2026-11-02T00:00:00");

    function updateAnniversaryWaiting() {
        const now = new Date();
        const difference = anniversaryDate - now;

        if (difference <= 0) {
            anniversaryWaiting.classList.add("waiting-hidden");

            setTimeout(() => {
                document.body.style.overflow = "";
                anniversaryWaiting.remove();
            }, 600);

            return;
        }

        const totalSeconds = Math.floor(difference / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        waitingDays.textContent = days;
        waitingHours.textContent = String(hours).padStart(2, "0");
        waitingMinutes.textContent = String(minutes).padStart(2, "0");
        waitingSeconds.textContent = String(seconds).padStart(2, "0");

        let progress;

        if (now <= waitingStart) {
            progress = 0;
        } else {
            progress =
                ((now - waitingStart) /
                (anniversaryDate - waitingStart)) * 100;
        }

        progress = Math.max(0, Math.min(100, progress));

        waitingProgressBar.style.width = progress + "%";
        waitingProgressPercent.textContent = Math.floor(progress) + "%";
    }

    updateAnniversaryWaiting();

    setInterval(updateAnniversaryWaiting, 1000);
}

const popup = document.getElementById("welcome-popup");
const enterButton = document.getElementById("enter-button");
const header = document.getElementById("header");

if (popup && localStorage.getItem("welcomeSeen")) {
    popup.style.display = "none";
}

if (enterButton) {
    enterButton.addEventListener("click", () => {
        popup.classList.add("hidden");

        localStorage.setItem("welcomeSeen", "true");

        setTimeout(() => {
            popup.style.display = "none";
        }, 500);
    });
}

window.addEventListener("scroll", () => {
    if (!header) return;

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

const loveLoading = document.getElementById("love-loading");

if (loveLoading) {
    if (sessionStorage.getItem("loveLoaded")) {
        loveLoading.remove();
    } else {
        sessionStorage.setItem("loveLoaded", "true");

        setTimeout(() => {
            loveLoading.remove();
        }, window.innerWidth <= 900 ? 4500 : 10000);
    }
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

if (
    daysElement &&
    hoursElement &&
    minutesElement &&
    secondsElement
) {
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
```
