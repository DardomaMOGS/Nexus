/* =========================================================
   NEXUS v1.4
   COMPLETE FIREBASE-FREE SYSTEM
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const ACCOUNT_KEY = "nexus_v14_accounts";
const SESSION_KEY = "nexus_v14_session";
const HISTORY_KEY = "nexus_v14_history";

let accounts =
    JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "{}");

let currentUser = null;

let browserHistory =
    JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");


/* =========================================================
   HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
}

function show(element) {
    if (element) element.classList.remove("hidden");
}

function hide(element) {
    if (element) element.classList.add("hidden");
}

function saveAccounts() {
    localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify(accounts)
    );
}

function saveHistory() {
    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(browserHistory)
    );
}

function toast(message) {

    const container = $("toastContainer");

    if (!container) return;

    const item = document.createElement("div");

    item.className = "toast";

    item.textContent = message;

    container.appendChild(item);

    setTimeout(() => {
        item.remove();
    }, 3000);
}

function safeText(value) {
    return String(value ?? "");
}


/* =========================================================
   BOOT
========================================================= */

function startBoot() {

    let progress = 0;

    const interval = setInterval(() => {

        progress += Math.floor(
            Math.random() * 15
        ) + 5;

        if (progress > 100) {
            progress = 100;
        }

        $("bootProgress").style.width =
            progress + "%";

        if (progress < 35) {
            $("bootText").textContent =
                "Initializing...";
        }
        else if (progress < 65) {
            $("bootText").textContent =
                "Loading NEXUS core...";
        }
        else if (progress < 90) {
            $("bootText").textContent =
                "Preparing desktop...";
        }
        else {
            $("bootText").textContent =
                "Ready.";
        }

        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                hide($("bootScreen"));

                checkSession();

            }, 500);
        }

    }, 180);
}


/* =========================================================
   AUTH
========================================================= */

function checkSession() {

    const session =
        localStorage.getItem(SESSION_KEY);

    if (
        session &&
        accounts[session]
    ) {

        currentUser = session;

        enterDesktop();

    } else {

        show($("authScreen"));
    }
}


function switchToSignup() {

    hide($("loginPanel"));
    show($("signupPanel"));

}


function switchToLogin() {

    hide($("signupPanel"));
    show($("loginPanel"));

}


function createAccount() {

    const email =
        $("signupEmail").value.trim().toLowerCase();

    const username =
        $("signupUsername").value.trim();

    const password =
        $("signupPassword").value;

    const confirm =
        $("signupConfirm").value;


    if (!email) {

        toast("Please enter your email.");

        return;
    }


    if (!username) {

        toast("Please enter a username.");

        return;
    }


    /*
       Username:
       letters
       numbers
       spaces
       underscores
    */

    if (!/^[A-Za-z0-9 _]+$/.test(username)) {

        toast(
            "Use letters, numbers, spaces or underscores."
        );

        return;
    }


    if (password.length < 4) {

        toast(
            "Password must be at least 4 characters."
        );

        return;
    }


    if (password !== confirm) {

        toast(
            "Passwords do not match."
        );

        return;
    }


    if (Object.values(accounts).some(
        account =>
            account.email.toLowerCase() === email
    )) {

        toast(
            "That email is already registered."
        );

        return;
    }


    if (Object.values(accounts).some(
        account =>
            account.username.toLowerCase() ===
            username.toLowerCase()
    )) {

        toast(
            "That username is already taken."
        );

        return;
    }


    /*
       This is intentionally local-only.
       No Firebase.
       No server.
    */

    const id =
        "user_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2);


    accounts[id] = {

        id,

        email,

        username,

        password,

        theme: "dark",

        wallpaper: "nexus",

        notes: "",

        files: [],

        createdAt:
            new Date().toISOString()

    };


    saveAccounts();

    $("loginEmail").value = email;
    $("loginUsername").value = username;

    $("signupEmail").value = "";
    $("signupUsername").value = "";
    $("signupPassword").value = "";
    $("signupConfirm").value = "";

    switchToLogin();

    toast(
        "Account created successfully!"
    );
}


function login() {

    const email =
        $("loginEmail").value.trim().toLowerCase();

    const username =
        $("loginUsername").value.trim();

    const password =
        $("loginPassword").value;


    const found =
        Object.values(accounts).find(
            account =>
                account.email.toLowerCase() === email &&
                account.username.toLowerCase() === username &&
                account.password === password
        );


    if (!found) {

        toast(
            "Incorrect email, username or password."
        );

        return;
    }


    currentUser = found.id;

    localStorage.setItem(
        SESSION_KEY,
        currentUser
    );


    $("loginPassword").value = "";

    enterDesktop();
}


function logout() {

    localStorage.removeItem(
        SESSION_KEY
    );

    currentUser = null;

    closeAllWindows();

    hide($("desktop"));

    show($("authScreen"));

    switchToLogin();

    toast("Logged out.");
}


function deleteAccount() {

    if (!currentUser) return;


    const confirmed =
        confirm(
            "Delete your NEXUS account from this browser?"
        );

    if (!confirmed) return;


    delete accounts[currentUser];

    saveAccounts();

    localStorage.removeItem(
        SESSION_KEY
    );

    currentUser = null;

    closeAllWindows();

    hide($("desktop"));

    show($("authScreen"));

    toast(
        "Account deleted."
    );
}


function forgotPassword() {

    const email =
        $("loginEmail").value.trim().toLowerCase();

    const found =
        Object.values(accounts).find(
            account =>
                account.email.toLowerCase() === email
        );


    if (!found) {

        toast(
            "Enter the email used for your account."
        );

        return;
    }


    /*
       Because this is a local-only system,
       there is no real email reset service.
    */

    alert(
        "This NEXUS version stores accounts only in this browser.\n\n" +
        "There is no external password-reset service."
    );
}


/* =========================================================
   DESKTOP
========================================================= */

function enterDesktop() {

    if (!currentUser) return;

    hide($("authScreen"));

    show($("desktop"));

    const user =
        accounts[currentUser];

    updateUserUI();

    applyUserSettings();

    loadNote();

    loadFiles();

    initializePaint();

    updateClock();

    toast(
        "Welcome to NEXUS, " +
        user.username +
        "!"
    );
}


function updateUserUI() {

    if (!currentUser) return;

    const user =
        accounts[currentUser];

    $("settingsUsername").textContent =
        user.username;

    $("settingsEmail").textContent =
        user.email;

    $("settingsUsernameInput").value =
        user.username;

    $("startUsername").textContent =
        user.username;

    $("startEmail").textContent =
        user.email;
}


/* =========================================================
   WINDOW SYSTEM
========================================================= */

let zIndex = 20;


function openWindow(id) {

    const win = $(id);

    if (!win) return;

    win.classList.add("open");

    win.classList.remove("minimized");

    zIndex++;

    win.style.zIndex = zIndex;

    updateTaskbar();
}


function closeWindow(win) {

    if (!win) return;

    win.classList.remove("open");

    win.classList.remove("minimized");

    updateTaskbar();
}


function minimizeWindow(win) {

    if (!win) return;

    win.classList.toggle("minimized");

    updateTaskbar();
}


function closeAllWindows() {

    document.querySelectorAll(
        ".window"
    ).forEach(win => {

        win.classList.remove("open");

        win.classList.remove("minimized");

    });

    updateTaskbar();
}


function updateTaskbar() {

    const container =
        $("taskbarApps");

    if (!container) return;

    container.innerHTML = "";

    document.querySelectorAll(
        ".window"
    ).forEach(win => {

        if (!win.classList.contains("open")) {
            return;
        }

        const title =
            win.querySelector(
                ".window-header span"
            )?.textContent ||
            "App";

        const button =
            document.createElement("button");

        button.className =
            "taskbar-app";

        button.textContent =
            title;

        button.onclick = () => {

            if (win.classList.contains("minimized")) {

                openWindow(win.id);

            } else {

                minimizeWindow(win);
            }
        };

        container.appendChild(button);
    });
}


/* =========================================================
   START MENU
========================================================= */

function toggleStartMenu() {

    $("startMenu")
        .classList.toggle("hidden");
}


/* =========================================================
   NOTEPAD
========================================================= */

function loadNote() {

    if (!currentUser) return;

    $("notepad").value =
        accounts[currentUser].notes || "";

    updateWordCount();
}


function saveNote() {

    if (!currentUser) return;

    accounts[currentUser].notes =
        $("notepad").value;

    saveAccounts();

    $("noteStatus").textContent =
        "Saved";

    updateWordCount();

    toast("Note saved.");
}


function updateWordCount() {

    const text =
        $("notepad").value.trim();

    const count =
        text ?
        text.split(/\s+/).length :
        0;

    $("wordCount").textContent =
        count + " words";
}


/* =========================================================
   CALCULATOR
========================================================= */

let calculatorExpression = "";


function calculatorInput(value) {

    if (value === "C") {

        calculatorExpression = "";

    }
    else if (value === "backspace") {

        calculatorExpression =
            calculatorExpression.slice(0, -1);

    }
    else if (value === "=") {

        calculateResult();

        return;

    }
    else {

        calculatorExpression += value;
    }


    $("calculatorDisplay").value =
        calculatorExpression;
}


function calculateResult() {

    try {

        /*
           Only allow calculator characters.
        */

        if (
            !/^[0-9+\-*/().\s]+$/.test(
                calculatorExpression
            )
        ) {

            throw new Error();

        }


        const result =
            Function(
                `"use strict"; return (${calculatorExpression})`
            )();


        if (!Number.isFinite(result)) {
            throw new Error();
        }


        calculatorExpression =
            String(result);

        $("calculatorDisplay").value =
            calculatorExpression;

    }
    catch {

        calculatorExpression = "";

        $("calculatorDisplay").value =
            "Error";

        setTimeout(() => {

            $("calculatorDisplay").value =
                "";

        }, 800);
    }
}


/* =========================================================
   FILE MANAGER
========================================================= */

let selectedFileIndex = -1;


function loadFiles() {

    if (!currentUser) return;

    renderFiles();
}


function renderFiles() {

    const list =
        $("fileList");

    list.innerHTML = "";

    const files =
        accounts[currentUser].files || [];


    if (files.length === 0) {

        list.innerHTML =
            `<div class="small-text">
                No files yet.
             </div>`;

        $("fileName").value = "";
        $("fileContent").value = "";

        selectedFileIndex = -1;

        return;
    }


    files.forEach(
        (file, index) => {

            const button =
                document.createElement("button");

            button.className =
                "file-item";

            if (index === selectedFileIndex) {
                button.classList.add("active");
            }

            button.textContent =
                "📄 " + file.name;

            button.onclick = () => {

                selectFile(index);

            };

            list.appendChild(button);
        }
    );
}


function selectFile(index) {

    const files =
        accounts[currentUser].files;

    if (!files[index]) return;

    selectedFileIndex = index;

    $("fileName").value =
        files[index].name;

    $("fileContent").value =
        files[index].content;

    renderFiles();
}


function createFile() {

    accounts[currentUser].files.push({

        name: "New File.txt",

        content: ""

    });

    selectedFileIndex =
        accounts[currentUser].files.length - 1;

    saveAccounts();

    renderFiles();

    selectFile(selectedFileIndex);

    toast("New file created.");
}


function saveFile() {

    if (selectedFileIndex < 0) {

        toast("Select a file first.");

        return;
    }


    const file =
        accounts[currentUser]
            .files[selectedFileIndex];


    file.name =
        $("fileName").value.trim() ||
        "Untitled.txt";

    file.content =
        $("fileContent").value;


    saveAccounts();

    renderFiles();

    toast("File saved.");
}


function deleteFile() {

    if (selectedFileIndex < 0) {

        toast("Select a file first.");

        return;
    }


    accounts[currentUser]
        .files.splice(
            selectedFileIndex,
            1
        );


    selectedFileIndex = -1;

    saveAccounts();

    renderFiles();

    toast("File deleted.");
}


/* =========================================================
   PAINT
========================================================= */

let paintContext = null;

let painting = false;

let lastX = 0;
let lastY = 0;


function initializePaint() {

    const canvas =
        $("paintCanvas");

    if (!canvas) return;


    const rect =
        canvas.getBoundingClientRect();

    const ratio =
        window.devicePixelRatio || 1;


    canvas.width =
        rect.width * ratio;

    canvas.height =
        rect.height * ratio;


    paintContext =
        canvas.getContext("2d");

    paintContext.scale(
        ratio,
        ratio
    );


    paintContext.fillStyle =
        "white";

    paintContext.fillRect(
        0,
        0,
        rect.width,
        rect.height
    );


    canvas.addEventListener(
        "pointerdown",
        startPainting
    );

    canvas.addEventListener(
        "pointermove",
        paint
    );

    canvas.addEventListener(
        "pointerup",
        stopPainting
    );

    canvas.addEventListener(
        "pointerleave",
        stopPainting
    );
}


function canvasPosition(event) {

    const canvas =
        $("paintCanvas");

    const rect =
        canvas.getBoundingClientRect();

    return {

        x: event.clientX - rect.left,

        y: event.clientY - rect.top

    };
}


function startPainting(event) {

    painting = true;

    const pos =
        canvasPosition(event);

    lastX = pos.x;
    lastY = pos.y;
}


function paint(event) {

    if (!painting || !paintContext) {
        return;
    }


    const pos =
        canvasPosition(event);


    paintContext.beginPath();

    paintContext.moveTo(
        lastX,
        lastY
    );

    paintContext.lineTo(
        pos.x,
        pos.y
    );


    paintContext.strokeStyle =
        $("paintColor").value;

    paintContext.lineWidth =
        Number(
            $("brushSize").value
        );

    paintContext.lineCap =
        "round";

    paintContext.lineJoin =
        "round";

    paintContext.stroke();


    lastX = pos.x;
    lastY = pos.y;
}


function stopPainting() {

    painting = false;
}


function clearPaint() {

    const canvas =
        $("paintCanvas");

    if (!paintContext) return;

    paintContext.fillStyle =
        "white";

    paintContext.fillRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
    );
}


function savePaint() {

    const canvas =
        $("paintCanvas");

    const link =
        document.createElement("a");

    link.download =
        "nexus-paint.png";

    link.href =
        canvas.toDataURL("image/png");

    link.click();

    toast("Painting saved.");
}


/* =========================================================
   CATCH NEXUS
========================================================= */

let catchScore = 0;

let catchTimer = null;


function startCatchGame() {

    clearInterval(catchTimer);

    catchScore = 0;

    $("catchScore").textContent =
        "0";


    moveCatchTarget();

    catchTimer =
        setInterval(
            moveCatchTarget,
            700
        );


    toast(
        "Catch the N!"
    );
}


function moveCatchTarget() {

    const area =
        $("catchArea");

    const target =
        $("catchTarget");

    if (!area || !target) return;


    const maxX =
        Math.max(
            0,
            area.clientWidth -
            target.offsetWidth
        );

    const maxY =
        Math.max(
            0,
            area.clientHeight -
            target.offsetHeight
        );


    target.style.left =
        Math.random() *
        maxX +
        "px";

    target.style.top =
        Math.random() *
        maxY +
        "px";
}


function catchTarget() {

    catchScore++;

    $("catchScore").textContent =
        catchScore;

    moveCatchTarget();
}


/* =========================================================
   CLICK RUSH
========================================================= */

let clickScore = 0;

let clickSeconds = 10;

let clickTimer = null;


function startClickRush() {

    clearInterval(clickTimer);

    clickScore = 0;

    clickSeconds = 10;


    $("clickScore").textContent =
        "0";

    $("clickTime").textContent =
        "10";

    $("clickButton").disabled =
        false;


    clickTimer =
        setInterval(() => {

            clickSeconds--;

            $("clickTime").textContent =
                clickSeconds;


            if (clickSeconds <= 0) {

                clearInterval(
                    clickTimer
                );

                $("clickButton").disabled =
                    true;

                toast(
                    "Click Rush score: " +
                    clickScore
                );
            }

        }, 1000);
}


function clickRush() {

    clickScore++;

    $("clickScore").textContent =
        clickScore;
}


/* =========================================================
   MEMORY MATCH
========================================================= */

const memorySymbols = [
    "🚀",
    "🚀",
    "🎮",
    "🎮",
    "💻",
    "💻",
    "⚡",
    "⚡",
    "🌟",
    "🌟",
    "🧠",
    "🧠"
];

let memoryCards = [];

let memoryFirst = null;

let memorySecond = null;

let memoryLock = false;

let memoryMoves = 0;

let memoryMatched = 0;


function shuffle(array) {

    return array
        .map(value => ({
            value,
            sort: Math.random()
        }))
        .sort(
            (a,b) => a.sort - b.sort
        )
        .map(item => item.value);
}


function startMemoryGame() {

    const board =
        $("memoryBoard");

    board.innerHTML = "";

    memoryCards =
        shuffle(memorySymbols);

    memoryFirst = null;
    memorySecond = null;
    memoryLock = false;

    memoryMoves = 0;
    memoryMatched = 0;

    $("memoryMoves").textContent =
        "0";


    memoryCards.forEach(
        (symbol, index) => {

            const card =
                document.createElement("button");

            card.className =
                "memory-card";

            card.dataset.index =
                index;

            card.textContent =
                symbol;

            card.onclick =
                () => flipMemoryCard(card);

            board.appendChild(card);

        }
    );
}


function flipMemoryCard(card) {

    if (memoryLock) return;

    if (
        card.classList.contains(
            "revealed"
        )
    ) return;

    if (
        card.classList.contains(
            "matched"
        )
    ) return;


    card.classList.add(
        "revealed"
    );


    if (!memoryFirst) {

        memoryFirst = card;

        return;
    }


    memorySecond = card;

    memoryMoves++;

    $("memoryMoves").textContent =
        memoryMoves;


    const firstIndex =
        Number(
            memoryFirst.dataset.index
        );

    const secondIndex =
        Number(
            memorySecond.dataset.index
        );


    if (
        memoryCards[firstIndex] ===
        memoryCards[secondIndex]
    ) {

        memoryFirst.classList.add(
            "matched"
        );

        memorySecond.classList.add(
            "matched"
        );

        memoryMatched++;

        memoryFirst = null;
        memorySecond = null;


        if (memoryMatched ===
            memorySymbols.length / 2) {

            toast(
                "You completed Memory Match! 🧠"
            );
        }

    } else {

        memoryLock = true;

        setTimeout(() => {

            memoryFirst.classList.remove(
                "revealed"
            );

            memorySecond.classList.remove(
                "revealed"
            );

            memoryFirst = null;
            memorySecond = null;

            memoryLock = false;

        }, 750);
    }
}


/* =========================================================
   SNAKE
========================================================= */

let snakeInterval = null;

let snake = [];

let snakeDirection = {
    x: 1,
    y: 0
};

let snakeFood = {
    x: 10,
    y: 10
};

let snakeScore = 0;

const snakeSize = 20;

const snakeColumns = 20;

const snakeRows = 15;


function randomFood() {

    return {

        x:
            Math.floor(
                Math.random() *
                snakeColumns
            ),

        y:
            Math.floor(
                Math.random() *
                snakeRows
            )
    };
}


function startSnakeGame() {

    clearInterval(
        snakeInterval
    );


    snake = [
        {
            x: 5,
            y: 7
        },
        {
            x: 4,
            y: 7
        },
        {
            x: 3,
            y: 7
        }
    ];


    snakeDirection = {
        x: 1,
        y: 0
    };


    snakeFood =
        randomFood();


    snakeScore = 0;

    $("snakeScore").textContent =
        "0";


    drawSnake();


    snakeInterval =
        setInterval(
            updateSnake,
            120
        );
}


function updateSnake() {

    const head = {
        x:
            snake[0].x +
            snakeDirection.x,

        y:
            snake[0].y +
            snakeDirection.y
    };


    /*
       Wall collision
    */

    if (
        head.x < 0 ||
        head.x >= snakeColumns ||
        head.y < 0 ||
        head.y >= snakeRows
    ) {

        endSnake();

        return;
    }


    /*
       Body collision
    */

    if (
        snake.some(
            part =>
                part.x === head.x &&
                part.y === head.y
        )
    ) {

        endSnake();

        return;
    }


    snake.unshift(head);


    if (
        head.x === snakeFood.x &&
        head.y === snakeFood.y
    ) {

        snakeScore++;

        $("snakeScore").textContent =
            snakeScore;

        snakeFood =
            randomFood();

    } else {

        snake.pop();
    }


    drawSnake();
}


function drawSnake() {

    const canvas =
        $("snakeCanvas");

    const ctx =
        canvas.getContext("2d");


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
       Grid
    */

    ctx.strokeStyle =
        "rgba(255,255,255,0.05)";

    for (
        let x = 0;
        x <= snakeColumns;
        x++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x * snakeSize,
            0
        );

        ctx.lineTo(
            x * snakeSize,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y <= snakeRows;
        y++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y * snakeSize
        );

        ctx.lineTo(
            canvas.width,
            y * snakeSize
        );

        ctx.stroke();
    }


    /*
       Food
    */

    ctx.fillStyle =
        "#ff4f70";

    ctx.fillRect(
        snakeFood.x * snakeSize,
        snakeFood.y * snakeSize,
        snakeSize - 2,
        snakeSize - 2
    );


    /*
       Snake
    */

    ctx.fillStyle =
        "#7c5cff";

    snake.forEach(
        (part, index) => {

            ctx.fillStyle =
                index === 0
                    ? "#00d4ff"
                    : "#7c5cff";

            ctx.fillRect(
                part.x * snakeSize,
                part.y * snakeSize,
                snakeSize - 2,
                snakeSize - 2
            );

        }
    );
}


function endSnake() {

    clearInterval(
        snakeInterval
    );

    snakeInterval = null;

    toast(
        "Snake game over! Score: " +
        snakeScore
    );
}


/* =========================================================
   SNAKE KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (!$("snakeGameScreen")
            .classList.contains("hidden")) {

            if (
                event.key === "ArrowUp" &&
                snakeDirection.y !== 1
            ) {

                snakeDirection = {
                    x: 0,
                    y: -1
                };

            }
            else if (
                event.key === "ArrowDown" &&
                snakeDirection.y !== -1
            ) {

                snakeDirection = {
                    x: 0,
                    y: 1
                };

            }
            else if (
                event.key === "ArrowLeft" &&
                snakeDirection.x !== 1
            ) {

                snakeDirection = {
                    x: -1,
                    y: 0
                };

            }
            else if (
                event.key === "ArrowRight" &&
                snakeDirection.x !== -1
            ) {

                snakeDirection = {
                    x: 1,
                    y: 0
                };
            }

        }

    }
);


/* =========================================================
   GAME SCREEN SWITCHING
========================================================= */

function showGame(game) {

    hide($("gameMenu"));

    hide($("catchGameScreen"));

    hide($("clickGameScreen"));

    hide($("memoryGameScreen"));

    hide($("snakeGameScreen"));


    if (game === "catch") {

        show($("catchGameScreen"));

    }
    else if (game === "click") {

        show($("clickGameScreen"));

    }
    else if (game === "memory") {

        show($("memoryGameScreen"));

    }
    else if (game === "snake") {

        show($("snakeGameScreen"));

    }
}


function returnToGames() {

    hide($("catchGameScreen"));

    hide($("clickGameScreen"));

    hide($("memoryGameScreen"));

    hide($("snakeGameScreen"));

    show($("gameMenu"));

    clearInterval(catchTimer);

    clearInterval(clickTimer);

    clearInterval(snakeInterval);
}


/* =========================================================
   BROWSER
========================================================= */

let currentBrowserURL = "";


function normalizeURL(value) {

    value = value.trim();

    if (!value) {
        return "";
    }


    /*
       Search if it doesn't look like a URL.
    */

    if (
        !value.includes(".") &&
        !value.startsWith("http://") &&
        !value.startsWith("https://")
    ) {

        return (
            "https://www.google.com/search?q=" +
            encodeURIComponent(value)
        );
    }


    if (
        !value.startsWith("http://") &&
        !value.startsWith("https://")
    ) {

        return "https://" + value;
    }


    return value;
}


function navigateBrowser(value) {

    const url =
        normalizeURL(value);

    if (!url) return;


    currentBrowserURL = url;

    $("browserAddress").value =
        url;


    /*
       Store browser history.
    */

    browserHistory =
        browserHistory.filter(
            item => item !== url
        );

    browserHistory.unshift(url);

    browserHistory =
        browserHistory.slice(0, 30);

    saveHistory();

    renderHistory();


    showBrowserLoading();


    const frame =
        $("browserFrame");


    frame.src = url;

    show(frame);

    hide($("browserHomePage));

    hide($("browserBlocked));


    $("browserTabTitle").textContent =
        url;


    /*
       Browsers cannot detect every
       iframe restriction perfectly.
    */

    setTimeout(() => {

        if (
            frame.classList.contains("hidden")
        ) {
            return;
        }

        /*
           Keep iframe visible.
           The user can use Open External
           if the site blocks embedding.
        */

    }, 1500);
}


function showBrowserLoading() {

    $("browserTabTitle").textContent =
        "Loading...";

    hide($("browserBlocked));
}


function browserHome() {

    currentBrowserURL = "";

    $("browserAddress").value = "";

    hide($("browserFrame"));

    hide($("browserBlocked));

    show($("browserHomePage));

    $("browserTabTitle").textContent =
        "NEXUS Browser";
}


function openExternal() {

    if (!currentBrowserURL) {

        toast(
            "Enter a website first."
        );

        return;
    }


    window.open(
        currentBrowserURL,
        "_blank",
        "noopener,noreferrer"
    );
}


function renderHistory() {

    const list =
        $("historyList");

    list.innerHTML = "";


    if (browserHistory.length === 0) {

        list.innerHTML =
            `<div class="small-text" style="padding:12px">
                No history yet.
             </div>`;

        return;
    }


    browserHistory.forEach(
        url => {

            const button =
                document.createElement("button");

            button.className =
                "history-item";

            button.textContent =
                url;

            button.onclick = () => {

                navigateBrowser(url);

                hide(
                    $("browserHistoryPanel")
                );
            };

            list.appendChild(button);
        }
    );
}


function toggleHistory() {

    $("browserHistoryPanel")
        .classList.toggle("hidden");

    renderHistory();
}


function addFavorite() {

    if (!currentBrowserURL) {

        toast(
            "Open a page first."
        );

        return;
    }


    const favorites =
        JSON.parse(
            localStorage.getItem(
                "nexus_v14_favorites"
            ) || "[]"
        );


    if (!favorites.includes(
        currentBrowserURL
    )) {

        favorites.push(
            currentBrowserURL
        );

        localStorage.setItem(
            "nexus_v14_favorites",
            JSON.stringify(favorites)
        );

        toast("Added to favorites.");

    } else {

        toast(
            "Already in favorites."
        );
    }
}


/* =========================================================
   SETTINGS
========================================================= */

function applyUserSettings() {

    if (!currentUser) return;

    const user =
        accounts[currentUser];


    if (user.theme === "light") {

        document.body.classList.add(
            "light"
        );

    } else {

        document.body.classList.remove(
            "light"
        );
    }


    applyWallpaper(
        user.wallpaper || "nexus"
    );
}


function applyWallpaper(name) {

    const wallpaper =
        $("wallpaper");

    wallpaper.className =
        "wallpaper";


    if (
        name !== "nexus" &&
        name !== ""
    ) {

        wallpaper.classList.add(
            name
        );
    }


    if (currentUser) {

        accounts[currentUser]
            .wallpaper = name;

        saveAccounts();
    }
}


function setTheme(theme) {

    if (!currentUser) return;


    if (theme === "light") {

        document.body.classList.add(
            "light"
        );

    } else {

        document.body.classList.remove(
            "light"
        );
    }


    accounts[currentUser].theme =
        theme;

    saveAccounts();

    toast(
        theme === "light"
            ? "Light theme enabled."
            : "Dark theme enabled."
    );
}


function saveUsername() {

    if (!currentUser) return;


    const username =
        $("settingsUsernameInput")
            .value
            .trim();


    if (!username) {

        toast(
            "Username cannot be empty."
        );

        return;
    }


    if (!/^[A-Za-z0-9 _]+$/.test(
        username
    )) {

        toast(
            "Use letters, numbers, spaces or underscores."
        );

        return;
    }


    const duplicate =
        Object.values(accounts)
            .some(
                account =>
                    account.id !== currentUser &&
                    account.username.toLowerCase() ===
                    username.toLowerCase()
            );


    if (duplicate) {

        toast(
            "That username is already taken."
        );

        return;
    }


    accounts[currentUser].username =
        username;

    saveAccounts();

    updateUserUI();

    toast(
        "Username updated."
    );
}


function changePassword() {

    if (!currentUser) return;


    const oldPassword =
        prompt(
            "Enter your current password:"
        );


    if (
        oldPassword === null
    ) return;


    if (
        oldPassword !==
        accounts[currentUser].password
    ) {

        toast(
            "Current password is incorrect."
        );

        return;
    }


    const newPassword =
        prompt(
            "Enter your new password:"
        );


    if (
        !newPassword ||
        newPassword.length < 4
    ) {

        toast(
            "Password must be at least 4 characters."
        );

        return;
    }


    accounts[currentUser].password =
        newPassword;

    saveAccounts();

    toast(
        "Password changed."
    );
}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    const date =
        now.toLocaleDateString(
            [],
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    $("taskbarClock").textContent =
        time;

    $("bigClock").textContent =
        time;

    $("bigDate").textContent =
        date;
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           Boot
        */

        startBoot();


        /*
           Auth
        */

        $("showSignup").onclick =
            switchToSignup;

        $("showLogin").onclick =
            switchToLogin;

        $("signupButton").onclick =
            createAccount;

        $("loginButton").onclick =
            login;

        $("forgotPassword").onclick =
            forgotPassword;


        /*
           Enter key auth
        */

        document.querySelectorAll(
            "#loginPanel input, #signupPanel input"
        ).forEach(
            input => {

                input.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key === "Enter"
                        ) {

                            if (
                                input.closest(
                                    "#loginPanel"
                                )
                            ) {

                                login();

                            } else {

                                createAccount();
                            }
                        }

                    }
                );

            }
        );


        /*
           Desktop icons
        */

        document.querySelectorAll(
            "[data-open]"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openWindow(
                            button.dataset.open
                        );

                        hide(
                            $("startMenu")
                        );
                    }
                );

            }
        );


        /*
           Window controls
        */

        document.querySelectorAll(
            ".close-button"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        closeWindow(
                            button.closest(
                                ".window"
                            )
                        );

                    }
                );

            }
        );


        document.querySelectorAll(
            ".minimize-button"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        minimizeWindow(
                            button.closest(
                                ".window"
                            )
                        );

                    }
                );

            }
        );


        /*
           Bring clicked window forward
        */

        document.querySelectorAll(
            ".window"
        ).forEach(
            win => {

                win.addEventListener(
                    "mousedown",
                    () => {

                        zIndex++;

                        win.style.zIndex =
                            zIndex;
                    }
                );

            }
        );


        /*
           Start
        */

        $("startButton").onclick =
            toggleStartMenu;


        $("startLogout").onclick =
            logout;


        /*
           Notepad
        */

        $("saveNote").onclick =
            saveNote;


        $("clearNote").onclick =
            () => {

                $("notepad").value = "";

                updateWordCount();

                $("noteStatus").textContent =
                    "Cleared";
            };


        $("newNote").onclick =
            () => {

                $("notepad").value = "";

                updateWordCount();

                $("noteStatus").textContent =
                    "New note";
            };


        $("notepad").addEventListener(
            "input",
            updateWordCount
        );


        /*
           Calculator
        */

        document.querySelectorAll(
            "[data-calc]"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        calculatorInput(
                            button.dataset.calc
                        );

                    }
                );

            }
        );


        /*
           Files
        */

        $("newFile").onclick =
            createFile;

        $("saveFile").onclick =
            saveFile;

        $("deleteFile").onclick =
            deleteFile;


        /*
           Paint
        */

        $("clearPaint").onclick =
            clearPaint;

        $("savePaint").onclick =
            savePaint;


        /*
           Games
        */

        document.querySelectorAll(
            ".game-card"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        showGame(
                            button.dataset.game
                        );

                    }
                );

            }
        );


        document.querySelectorAll(
            ".back-game"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    returnToGames
                );

            }
        );


        $("startCatch").onclick =
            startCatchGame;

        $("catchTarget").onclick =
            catchTarget;


        $("startClick").onclick =
            startClickRush;

        $("clickButton").onclick =
            clickRush;


        $("startMemory").onclick =
            startMemoryGame;


        $("startSnake").onclick =
            startSnakeGame;


        /*
           Browser
        */

        $("browserGo").onclick =
            () => {

                navigateBrowser(
                    $("browserAddress").value
                );

            };


        $("browserAddress")
            .addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        navigateBrowser(
                            $("browserAddress")
                                .value
                        );
                    }

                }
            );


        $("browserHome").onclick =
            browserHome;


        $("browserReload").onclick =
            () => {

                if (
                    currentBrowserURL
                ) {

                    $("browserFrame").src =
                        currentBrowserURL;
                }

            };


        $("browserBack").onclick =
            () => {

                history.back();

            };


        $("browserForward").onclick =
            () => {

                history.forward();

            };


        $("openExternalButton").onclick =
            openExternal;


        $("blockedExternalButton").onclick =
            openExternal;


        $("browserFavorite").onclick =
            addFavorite;


        $("browserHistoryButton").onclick =
            toggleHistory;


        $("closeHistory").onclick =
            () => {

                hide(
                    $("browserHistoryPanel")
                );

            };


        /*
           Quick browser sites
        */

        document.querySelectorAll(
            ".quick-sites button"
        ).forEach(
            button => {

                button.onclick =
                    () => {

                        navigateBrowser(
                            button.dataset.url
                        );

                    };

            }
        );


        /*
           Settings
        */

        $("darkTheme").onclick =
            () => setTheme("dark");

        $("lightTheme").onclick =
            () => setTheme("light");

        $("saveUsername").onclick =
            saveUsername;

        $("changePassword").onclick =
            changePassword;

        $("logoutButton").onclick =
            logout;

        $("deleteAccount").onclick =
            deleteAccount;


        /*
           Wallpaper
        */

        document.querySelectorAll(
            "[data-wallpaper]"
        ).forEach(
            button => {

                button.onclick =
                    () => {

                        applyWallpaper(
                            button.dataset.wallpaper
                        );

                    };

            }
        );


        /*
           Close start menu when
           clicking elsewhere.
        */

        document.addEventListener(
            "click",
            event => {

                if (
                    !$("startMenu").contains(
                        event.target
                    ) &&
                    !$("startButton").contains(
                        event.target
                    )
                ) {

                    hide(
                        $("startMenu")
                    );
                }

            }
        );


        /*
           Clock
        */

        updateClock();

        setInterval(
            updateClock,
            1000
        );


        /*
           History
        */

        renderHistory();

    }
);


/* =========================================================
   RESIZE PAINT
========================================================= */

window.addEventListener(
    "resize",
    () => {

        /*
           Paint canvas is intentionally
           not automatically resized because
           resizing it would erase drawings.
        */

    }
);
