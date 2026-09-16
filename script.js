/* =========================================================
   NEXUS OS v1.1
========================================================= */


/* =========================================================
   PASSWORD SYSTEM
========================================================= */

const passwordScreen =
    document.getElementById("passwordScreen");

const passwordSetup =
    document.getElementById("passwordSetup");

const passwordLogin =
    document.getElementById("passwordLogin");

const passwordTitle =
    document.getElementById("passwordTitle");

const passwordError =
    document.getElementById("passwordError");


function hasPassword() {

    return localStorage.getItem("nexus_password") !== null;

}


function setupPasswordScreen() {

    if (hasPassword()) {

        passwordSetup.style.display = "none";
        passwordLogin.style.display = "flex";

        passwordTitle.textContent =
            "Enter your password to continue";

    } else {

        passwordSetup.style.display = "flex";
        passwordLogin.style.display = "none";

        passwordTitle.textContent =
            "Create your NEXUS password";

    }

}


function createPassword() {

    const password =
        document.getElementById("newPassword").value;

    const confirm =
        document.getElementById("confirmPassword").value;


    passwordError.textContent = "";


    if (password.length < 4) {

        passwordError.textContent =
            "Password must be at least 4 characters.";

        return;

    }


    if (password !== confirm) {

        passwordError.textContent =
            "Passwords do not match.";

        return;

    }


    localStorage.setItem(
        "nexus_password",
        password
    );


    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

    startNexus();

}


function unlockNexus() {

    const entered =
        document.getElementById("passwordInput").value;

    const saved =
        localStorage.getItem("nexus_password");


    if (entered === saved) {

        document.getElementById("passwordInput").value = "";

        passwordError.textContent = "";

        startNexus();

    } else {

        passwordError.textContent =
            "❌ Incorrect password.";

    }

}


function passwordEnter(event) {

    if (event.key === "Enter") {

        unlockNexus();

    }

}


function changePassword() {

    const current =
        prompt("Enter your current password:");

    const saved =
        localStorage.getItem("nexus_password");


    if (current !== saved) {

        showNotification(
            "🔐 Security",
            "Current password is incorrect.",
            "❌"
        );

        return;

    }


    const newPassword =
        prompt("Enter your new password:");

    if (!newPassword || newPassword.length < 4) {

        showNotification(
            "🔐 Security",
            "Password must be at least 4 characters.",
            "❌"
        );

        return;

    }


    localStorage.setItem(
        "nexus_password",
        newPassword
    );


    showNotification(
        "🔐 Security",
        "Password changed successfully.",
        "✅"
    );

}


function lockNexus() {

    closeAllApps();

    document.getElementById("startMenu").style.display =
        "none";

    passwordScreen.style.display = "flex";

    passwordSetup.style.display = "none";
    passwordLogin.style.display = "flex";

    passwordTitle.textContent =
        "Enter your password to continue";

    passwordError.textContent = "";

}


function startNexus() {

    passwordScreen.style.display = "none";

    bootScreen.style.display = "flex";

    let progress = 0;

    const interval = setInterval(() => {

        progress += 5;

        loadingProgress.style.width =
            progress + "%";


        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                bootScreen.style.display = "none";

            }, 300);

        }

    }, 50);

}


setupPasswordScreen();


/* =========================================================
   WINDOWS
========================================================= */

let highestZ = 20;

const appNames = {

    notepad: "📝 Notepad",
    calculator: "🧮 Calculator",
    files: "📁 Files",
    paint: "🎨 Paint",
    game: "🎮 Game",
    settings: "⚙️ Settings",
    about: "💻 About"

};


function openApp(appId) {

    const app =
        document.getElementById(appId);

    if (!app) return;


    app.style.display = "block";

    highestZ++;

    app.style.zIndex = highestZ;


    document.getElementById("startMenu").style.display =
        "none";


    updateTaskbar();

}


function closeApp(appId) {

    const app =
        document.getElementById(appId);

    if (!app) return;

    app.style.display = "none";

    updateTaskbar();

}


function closeAllApps() {

    document.querySelectorAll(".window").forEach(app => {

        app.style.display = "none";

    });

    updateTaskbar();

}


function minimizeApp(appId) {

    closeApp(appId);

}


function maximizeApp(appId) {

    const app =
        document.getElementById(appId);

    if (!app) return;


    if (app.classList.contains("maximized")) {

        app.classList.remove("maximized");

        app.style.width = "560px";
        app.style.height = "";
        app.style.left = "250px";
        app.style.top = "100px";

    } else {

        app.classList.add("maximized");

        app.style.left = "0";
        app.style.top = "0";
        app.style.width = "100vw";
        app.style.height = "calc(100vh - 60px)";

    }

}


document.querySelectorAll(".window").forEach(app => {

    app.addEventListener("mousedown", () => {

        highestZ++;

        app.style.zIndex = highestZ;

    });

});


/* =========================================================
   TASKBAR
========================================================= */

function updateTaskbar() {

    const taskbar =
        document.getElementById("taskbarApps");

    taskbar.innerHTML = "";


    document.querySelectorAll(".window").forEach(app => {

        if (app.style.display === "block") {

            const button =
                document.createElement("button");

            button.className = "taskbar-app";

            button.textContent =
                appNames[app.id] || app.id;


            button.onclick = () => {

                openApp(app.id);

            };


            taskbar.appendChild(button);

        }

    });

}


/* =========================================================
   START MENU
========================================================= */

function toggleStartMenu() {

    const menu =
        document.getElementById("startMenu");


    menu.style.display =
        menu.style.display === "block"
            ? "none"
            : "block";

}


function searchApps() {

    const search =
        document.getElementById("appSearch")
        .value
        .toLowerCase();


    document
        .querySelectorAll("#appList button")
        .forEach(button => {

            const text =
                button.textContent.toLowerCase();

            button.style.display =
                text.includes(search)
                    ? "block"
                    : "none";

        });

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now = new Date();

    let hours =
        now.getHours()
        .toString()
        .padStart(2, "0");

    let minutes =
        now.getMinutes()
        .toString()
        .padStart(2, "0");


    document.getElementById("clock").textContent =
        `${hours}:${minutes}`;


    document.getElementById("lockTime").textContent =
        `${hours}:${minutes}`;


}


setInterval(updateClock, 1000);

updateClock();


/* =========================================================
   NOTEPAD
========================================================= */

const notes =
    document.getElementById("notes");


notes.value =
    localStorage.getItem("nexus_notes") || "";


function updateNoteCount() {

    document.getElementById("noteCount").textContent =
        `${notes.value.length} characters`;

}


notes.addEventListener("input", () => {

    localStorage.setItem(
        "nexus_notes",
        notes.value
    );

    updateNoteCount();

});


function clearNotes() {

    notes.value = "";

    localStorage.removeItem("nexus_notes");

    updateNoteCount();

}


updateNoteCount();


/* =========================================================
   CALCULATOR
========================================================= */

let calculatorExpression = "";

const calcDisplay =
    document.getElementById("calcDisplay");


function calc(value) {

    calculatorExpression += value;

    calcDisplay.value =
        calculatorExpression;

}


function clearCalc() {

    calculatorExpression = "";

    calcDisplay.value = "";

}


function deleteCalc() {

    calculatorExpression =
        calculatorExpression.slice(0, -1);

    calcDisplay.value =
        calculatorExpression;

}


function calculate() {

    if (!calculatorExpression) return;


    try {

        if (
            !/^[0-9+\-*/%.() ]+$/
            .test(calculatorExpression)
        ) {

            throw new Error();

        }


        const result =
            Function(
                `"use strict"; return (${calculatorExpression})`
            )();


        calculatorExpression =
            String(result);

        calcDisplay.value =
            calculatorExpression;

    } catch {

        calculatorExpression = "";

        calcDisplay.value = "Error";

    }

}


document.addEventListener("keydown", event => {

    if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
    ) return;


    if ("0123456789+-*/.%".includes(event.key)) {

        calc(event.key);

    }


    if (event.key === "Enter") {

        calculate();

    }


    if (event.key === "Escape") {

        clearCalc();

    }

});


/* =========================================================
   PAINT
========================================================= */

const canvas =
    document.getElementById("paintCanvas");

const ctx =
    canvas.getContext("2d");


let painting = false;


function getCanvasPosition(event) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            (event.clientX - rect.left)
            * (canvas.width / rect.width),

        y:
            (event.clientY - rect.top)
            * (canvas.height / rect.height)

    };

}


canvas.addEventListener("mousedown", event => {

    painting = true;

    const position =
        getCanvasPosition(event);

    ctx.beginPath();

    ctx.moveTo(
        position.x,
        position.y
    );

});


canvas.addEventListener("mousemove", event => {

    if (!painting) return;


    const position =
        getCanvasPosition(event);


    ctx.lineWidth =
        document.getElementById("brushSize").value;


    ctx.lineCap = "round";


    ctx.strokeStyle =
        document.getElementById("paintColor").value;


    ctx.lineTo(
        position.x,
        position.y
    );

    ctx.stroke();

});


document.addEventListener("mouseup", () => {

    painting = false;

});


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
let gameTime = 30;
let gameRunning = false;
let gameTimer = null;


function startGame() {

    score = 0;

    gameTime = 30;

    gameRunning = true;


    document.getElementById("score").textContent =
        score;

    document.getElementById("gameTime").textContent =
        gameTime;


    clearInterval(gameTimer);


    moveTarget();


    gameTimer = setInterval(() => {

        gameTime--;

        document.getElementById("gameTime").textContent =
            gameTime;


        if (gameTime <= 0) {

            endGame();

        }

    }, 1000);

}


function hitTarget() {

    if (!gameRunning) return;

    score++;

    document.getElementById("score").textContent =
        score;

    moveTarget();

}


function moveTarget() {

    const board =
        document.getElementById("gameBoard");

    const target =
        document.getElementById("gameTarget");


    const maxX =
        board.clientWidth - target.offsetWidth;

    const maxY =
        board.clientHeight - target.offsetHeight;


    target.style.left =
        Math.max(
            0,
            Math.random() * maxX
        ) + "px";


    target.style.top =
        Math.max(
            0,
            Math.random() * maxY
        ) + "px";


    target.style.transform =
        "none";

}


function endGame() {

    gameRunning = false;

    clearInterval(gameTimer);


    showNotification(
        "Game Over",
        `Your score was ${score}!`,
        "🎮"
    );

}


/* =========================================================
   FILE MANAGER
========================================================= */

let userFiles =
    JSON.parse(
        localStorage.getItem("nexus_files") || "[]"
    );


function renderFiles() {

    const area =
        document.getElementById("fileArea");


    area.innerHTML = "";


    const defaultFiles = [

        {
            name: "My Notes.txt",
            icon: "📄"
        },

        {
            name: "My Drawing.png",
            icon: "🎨"
        },

        {
            name: "Game Data",
            icon: "🎮"
        }

    ];


    [...defaultFiles, ...userFiles]
        .forEach(file => {

            const element =
                document.createElement("div");

            element.className = "fake-file";


            const icon =
                document.createElement("div");

            icon.className = "fake-file-icon";

            icon.textContent =
                file.icon || "📄";


            const name =
                document.createElement("span");

            name.textContent =
                file.name;


            element.appendChild(icon);

            element.appendChild(name);

            area.appendChild(element);

        });

}


function createFile() {

    const name =
        prompt("Enter a file name:");

    if (!name) return;


    userFiles.push({

        name: name,

        icon: "📄"

    });


    localStorage.setItem(
        "nexus_files",
        JSON.stringify(userFiles)
    );


    renderFiles();


    showNotification(
        "File Manager",
        `${name} was created.`,
        "📄"
    );

}


function refreshFiles() {

    renderFiles();

    showNotification(
        "File Manager",
        "Files refreshed.",
        "🔄"
    );

}


renderFiles();


/* =========================================================
   USERNAME
========================================================= */

function loadUsername() {

    const username =
        localStorage.getItem("nexus_username") ||
        "User";


    document.getElementById("usernameInput").value =
        username;


    document.getElementById("startUsername").textContent =
        username;


    document.getElementById("taskbarUsername").textContent =
        username;

}


function saveUsername() {

    const input =
        document.getElementById("usernameInput");

    const username =
        input.value.trim();


    if (!username) return;


    localStorage.setItem(
        "nexus_username",
        username
    );


    loadUsername();


    showNotification(
        "Profile",
        `Welcome, ${username}!`,
        "👤"
    );

}


loadUsername();


/* =========================================================
   THEME
========================================================= */

function toggleTheme() {

    document.body.classList.toggle("light");


    localStorage.setItem(
        "nexus_theme",
        document.body.classList.contains("light")
            ? "light"
            : "dark"
    );

}


if (
    localStorage.getItem("nexus_theme") === "light"
) {

    document.body.classList.add("light");

}


/* =========================================================
   WALLPAPERS
========================================================= */

const wallpapers = [

    `
    radial-gradient(circle at 30% 20%, #5531a8, transparent 35%),
    radial-gradient(circle at 80% 70%, #1c64b8, transparent 35%),
    linear-gradient(135deg,#090014,#071b32)
    `,

    `
    radial-gradient(circle at 20% 30%, #be185d, transparent 35%),
    radial-gradient(circle at 80% 70%, #7c3aed, transparent 35%),
    linear-gradient(135deg,#160016,#090014)
    `,

    `
    radial-gradient(circle at 70% 20%, #0369a1, transparent 35%),
    radial-gradient(circle at 20% 80%, #0f766e, transparent 35%),
    linear-gradient(135deg,#00111c,#001f2b)
    `,

    `
    radial-gradient(circle at 50% 50%, #4c1d95, transparent 40%),
    linear-gradient(135deg,#050008,#18002e)
    `

];


let wallpaperIndex =
    Number(
        localStorage.getItem("nexus_wallpaper") || 0
    );


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


applyWallpaper();


/* =========================================================
   NOTIFICATIONS
========================================================= */

let notificationTimer;


function showNotification(
    title,
    message,
    icon = "🔔"
) {

    const notification =
        document.getElementById("notification");


    document.getElementById("notificationTitle").textContent =
        title;


    document.getElementById("notificationMessage").textContent =
        message;


    document.getElementById("notificationIcon").textContent =
        icon;


    notification.style.display =
        "flex";


    clearTimeout(notificationTimer);


    notificationTimer =
        setTimeout(() => {

            hideNotification();

        }, 4000);

}


function hideNotification() {

    document.getElementById("notification").style.display =
        "none";

}


function testNotification() {

    showNotification(
        "NEXUS",
        "Everything is working!",
        "🟣"
    );

}


/* =========================================================
   FINISH
========================================================= */

console.log(
    "NEXUS OS v1.1 loaded successfully."
);
