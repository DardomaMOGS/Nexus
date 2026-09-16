/* =========================================================
   NEXUS OS v1.0
   Main JavaScript
========================================================= */


/* =========================================================
   BOOT SCREEN
========================================================= */

let loading = 0;

const loadingProgress = document.getElementById("loadingProgress");
const bootScreen = document.getElementById("bootScreen");

const bootInterval = setInterval(() => {

    loading += 5;

    loadingProgress.style.width = loading + "%";

    if (loading >= 100) {

        clearInterval(bootInterval);

        setTimeout(() => {
            bootScreen.style.display = "none";
        }, 500);

    }

}, 80);


/* =========================================================
   APP WINDOWS
========================================================= */

function openApp(appId) {

    const app = document.getElementById(appId);

    if (!app) return;

    app.style.display = "block";

    /* Close Start Menu */
    document.getElementById("startMenu").style.display = "none";

    /* Bring selected window to front */
    bringToFront(app);
}


function closeApp(appId) {

    const app = document.getElementById(appId);

    if (!app) return;

    app.style.display = "none";
}


/* =========================================================
   WINDOW LAYERING
========================================================= */

let highestZ = 10;

function bringToFront(windowElement) {

    highestZ++;

    windowElement.style.zIndex = highestZ;
}


/* Click window to bring it forward */

document.querySelectorAll(".window").forEach(windowElement => {

    windowElement.addEventListener("mousedown", () => {

        bringToFront(windowElement);

    });

});


/* =========================================================
   START MENU
========================================================= */

function toggleStartMenu() {

    const menu = document.getElementById("startMenu");

    if (menu.style.display === "block") {

        menu.style.display = "none";

    } else {

        menu.style.display = "block";

    }

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const clock = document.getElementById("clock");

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");

    clock.textContent = `${hours}:${minutes}`;

}


updateClock();

setInterval(updateClock, 1000);


/* =========================================================
   NOTEPAD
========================================================= */

const notes = document.getElementById("notes");

if (notes) {

    /* Load saved notes */

    notes.value = localStorage.getItem("nexus_notes") || "";

    /* Save automatically */

    notes.addEventListener("input", () => {

        localStorage.setItem(
            "nexus_notes",
            notes.value
        );

    });

}


/* =========================================================
   CALCULATOR
========================================================= */

let calculatorExpression = "";

const calcDisplay = document.getElementById("calcDisplay");


function calc(value) {

    calculatorExpression += value;

    calcDisplay.value = calculatorExpression;

}


function clearCalc() {

    calculatorExpression = "";

    calcDisplay.value = "";

}


function calculate() {

    if (!calculatorExpression) return;

    try {

        /*
           Only allow numbers and basic operators.
           This prevents random JavaScript from being executed.
        */

        if (!/^[0-9+\-*/.() ]+$/.test(calculatorExpression)) {

            throw new Error("Invalid expression");

        }

        const result = Function(
            `"use strict"; return (${calculatorExpression})`
        )();

        calculatorExpression = String(result);

        calcDisplay.value = calculatorExpression;

    } catch {

        calcDisplay.value = "Error";

        calculatorExpression = "";

    }

}


/* Keyboard calculator support */

document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        "0123456789+-*/().".includes(key)
    ) {

        calc(key);

    }

    if (key === "Enter") {

        calculate();

    }

    if (key === "Escape") {

        clearCalc();

    }

});


/* =========================================================
   PAINT
========================================================= */

const canvas = document.getElementById("paintCanvas");

const ctx = canvas.getContext("2d");

let painting = false;


/* Start drawing */

canvas.addEventListener("mousedown", event => {

    painting = true;

    draw(event);

});


/* Stop drawing */

canvas.addEventListener("mouseup", () => {

    painting = false;

    ctx.beginPath();

});


canvas.addEventListener("mouseleave", () => {

    painting = false;

    ctx.beginPath();

});


/* Draw */

canvas.addEventListener("mousemove", draw);


function draw(event) {

    if (!painting) return;

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    ctx.lineWidth = 5;

    ctx.lineCap = "round";

    ctx.strokeStyle = "#7c3aed";

    ctx.lineTo(x, y);

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(x, y);

}


/* Clear Paint */

function clearCanvas() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


/* =========================================================
   GAME
========================================================= */

let score = 0;

const gameTarget = document.getElementById("gameTarget");

function hitTarget() {

    score++;

    document.getElementById("score").textContent = score;

    moveTarget();

}


function moveTarget() {

    const x = Math.floor(
        Math.random() * 350 - 175
    );

    const y = Math.floor(
        Math.random() * 150 - 75
    );

    gameTarget.style.transform =
        `translate(${x}px, ${y}px)`;

}


/* =========================================================
   SETTINGS — THEME
========================================================= */

function toggleTheme() {

    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    localStorage.setItem(
        "nexus_theme",
        isLight ? "light" : "dark"
    );

}


/* Load saved theme */

const savedTheme =
    localStorage.getItem("nexus_theme");

if (savedTheme === "light") {

    document.body.classList.add("light");

}


/* =========================================================
   WALLPAPER
========================================================= */

const wallpapers = [

    `
    radial-gradient(
        circle at 30% 20%,
        #5531a8,
        transparent 35%
    ),
    radial-gradient(
        circle at 80% 70%,
        #1c64b8,
        transparent 35%
    ),
    linear-gradient(
        135deg,
        #090014,
        #071b32
    )
    `,

    `
    radial-gradient(
        circle at 20% 30%,
        #be185d,
        transparent 35%
    ),
    radial-gradient(
        circle at 80% 70%,
        #7c3aed,
        transparent 35%
    ),
    linear-gradient(
        135deg,
        #160016,
        #090014
    )
    `,

    `
    radial-gradient(
        circle at 70% 20%,
        #0369a1,
        transparent 35%
    ),
    radial-gradient(
        circle at 20% 80%,
        #0f766e,
        transparent 35%
    ),
    linear-gradient(
        135deg,
        #00111c,
        #001f2b
    )
    `,

    `
    radial-gradient(
        circle at 50% 50%,
        #4c1d95,
        transparent 40%
    ),
    linear-gradient(
        135deg,
        #050008,
        #18002e
    )
    `

];


let wallpaperIndex =
    Number(localStorage.getItem("nexus_wallpaper")) || 0;


function applyWallpaper() {

    document.getElementById("desktop").style.background =
        wallpapers[wallpaperIndex];

}


function changeWallpaper() {

    wallpaperIndex++;

    if (wallpaperIndex >= wallpapers.length) {

        wallpaperIndex = 0;

    }

    localStorage.setItem(
        "nexus_wallpaper",
        wallpaperIndex
    );

    applyWallpaper();

}


/* Apply saved wallpaper */

applyWallpaper();


/* =========================================================
   DRAGGABLE WINDOWS
========================================================= */

document.querySelectorAll(".window").forEach(windowElement => {

    const header =
        windowElement.querySelector(".window-header");

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    header.addEventListener("mousedown", event => {

        dragging = true;

        bringToFront(windowElement);

        const rect =
            windowElement.getBoundingClientRect();

        offsetX =
            event.clientX - rect.left;

        offsetY =
            event.clientY - rect.top;

    });


    document.addEventListener("mousemove", event => {

        if (!dragging) return;

        const maxX =
            window.innerWidth -
            windowElement.offsetWidth;

        const maxY =
            window.innerHeight -
            windowElement.offsetHeight -
            60;


        let newX =
            event.clientX - offsetX;

        let newY =
            event.clientY - offsetY;


        newX =
            Math.max(0, Math.min(newX, maxX));

        newY =
            Math.max(0, Math.min(newY, maxY));


        windowElement.style.left =
            newX + "px";

        windowElement.style.top =
            newY + "px";

    });


    document.addEventListener("mouseup", () => {

        dragging = false;

    });

});


/* =========================================================
   DOUBLE-CLICK DESKTOP
========================================================= */

document.getElementById("desktop").addEventListener(
    "dblclick",
    event => {

        /*
          Double-clicking empty desktop space
          closes the Start Menu.
        */

        if (
            event.target.id === "desktop" ||
            event.target.classList.contains("desktop-icons")
        ) {

            document.getElementById(
                "startMenu"
            ).style.display = "none";

        }

    }
);


/* =========================================================
   ESCAPE = CLOSE START MENU
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        document.getElementById(
            "startMenu"
        ).style.display = "none";

    }

});


/* =========================================================
   NEXUS READY
========================================================= */

console.log("NEXUS OS v1.0 loaded successfully.");
