"use strict";

/* =========================================================
   NEXUS v1.4 — COMPLETE SCRIPT
   Matches the uploaded index.html exactly.
   No Firebase.
   ========================================================= */

const $ = id => document.getElementById(id);

const STORAGE = {
    accounts: "nexus_v14_accounts",
    currentUser: "nexus_v14_current_user",
    notes: "nexus_v14_notes",
    files: "nexus_v14_files",
    settings: "nexus_v14_settings",
    history: "nexus_v14_history"
};

let selectedFile = null;
let highestZ = 20;
let catchTimer = null;
let clickTimer = null;
let clickRunning = false;
let clickScore = 0;
let clickTime = 10;
let memoryCards = [];
let memoryFirst = null;
let memoryMoves = 0;
let memoryLocked = false;
let snakeTimer = null;
let snake = [];
let snakeFood = { x: 5, y: 5 };
let snakeDirection = { x: 1, y: 0 };
let snakeNextDirection = { x: 1, y: 0 };
let snakeScore = 0;
let currentGame = null;
let browserCurrentUrl = "";

function show(element) {
    if (element) element.classList.remove("hidden");
}

function hide(element) {
    if (element) element.classList.add("hidden");
}

function text(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
}

function readJSON(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getAccounts() {
    return readJSON(STORAGE.accounts, []);
}

function saveAccounts(accounts) {
    writeJSON(STORAGE.accounts, accounts);
}

function currentUsername() {
    return localStorage.getItem(STORAGE.currentUser) || "";
}

function setCurrentUsername(username) {
    if (username) {
        localStorage.setItem(STORAGE.currentUser, username);
    } else {
        localStorage.removeItem(STORAGE.currentUser);
    }
}

function currentAccount() {
    return getAccounts().find(
        account =>
            account.username.toLowerCase() ===
            currentUsername().toLowerCase()
    );
}

function validUsername(username) {
    return /^[A-Za-z0-9_ ]{3,24}$/.test(username);
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function authMessage(message) {
    let element = $("authMessage");

    if (!element) {
        element = document.createElement("p");
        element.id = "authMessage";
        element.className = "auth-message";
        const card = document.querySelector(".auth-card");
        if (card) card.prepend(element);
    }

    element.textContent = message;
}

/* =========================================================
   BOOT
   ========================================================= */

function startBoot() {
    const bootScreen = $("bootScreen");
    const bootText = $("bootText");
    const bootProgress = $("bootProgress");

    if (!bootScreen) {
        initializeNexus();
        return;
    }

    let progress = 0;

    const timer = setInterval(() => {
        progress += 10;

        if (bootProgress) {
            bootProgress.style.width = `${progress}%`;
        }

        if (bootText) {
            bootText.textContent =
                progress >= 100
                    ? "NEXUS Ready."
                    : "Starting NEXUS...";
        }

        if (progress >= 100) {
            clearInterval(timer);

            setTimeout(() => {
                hide(bootScreen);
                initializeNexus();
            }, 300);
        }
    }, 50);
}

function initializeNexus() {
    setupAuthentication();
    setupDesktop();
    setupWindows();
    setupNotepad();
    setupCalculator();
    setupFiles();
    setupPaint();
    setupGames();
    setupBrowser();
    setupSettings();
    setupStartMenu();
    setupClock();

    const user = currentUsername();

    if (user && currentAccount()) {
        enterDesktop(user);
    } else {
        showAuth();
    }
}

/* =========================================================
   AUTHENTICATION
   ========================================================= */

function setupAuthentication() {
    $("loginButton")?.addEventListener("click", login);
    $("signupButton")?.addEventListener("click", signup);
    $("showSignup")?.addEventListener("click", showSignup);
    $("showLogin")?.addEventListener("click", showLogin);
    $("forgotPassword")?.addEventListener("click", forgotPassword);

    $("loginPassword")?.addEventListener("keydown", event => {
        if (event.key === "Enter") login();
    });

    $("signupConfirm")?.addEventListener("keydown", event => {
        if (event.key === "Enter") signup();
    });
}

function showAuth() {
    show($("authScreen"));
    hide($("desktop"));
    hide($("startMenu"));

    show($("loginPanel"));
    hide($("signupPanel"));
}

function showSignup() {
    hide($("loginPanel"));
    show($("signupPanel"));
    authMessage("");
}

function showLogin() {
    show($("loginPanel"));
    hide($("signupPanel"));
    authMessage("");
}

function login() {
    const email = ($("loginEmail")?.value || "").trim().toLowerCase();
    const username = ($("loginUsername")?.value || "").trim();
    const password = $("loginPassword")?.value || "";

    if (!email || !username || !password) {
        authMessage("Please fill in all login fields.");
        return;
    }

    const account = getAccounts().find(item =>
        item.email.toLowerCase() === email &&
        item.username.toLowerCase() === username.toLowerCase() &&
        item.password === password
    );

    if (!account) {
        authMessage("Incorrect email, username, or password.");
        return;
    }

    setCurrentUsername(account.username);
    enterDesktop(account.username);
}

function signup() {
    const email = ($("signupEmail")?.value || "").trim().toLowerCase();
    const username = ($("signupUsername")?.value || "").trim();
    const password = $("signupPassword")?.value || "";
    const confirm = $("signupConfirm")?.value || "";

    if (!email || !username || !password || !confirm) {
        authMessage("Please fill in every field.");
        return;
    }

    if (!validEmail(email)) {
        authMessage("Please enter a valid email address.");
        return;
    }

    if (!validUsername(username)) {
        authMessage(
            "Username must be 3–24 characters and may contain letters, numbers, spaces, or underscores."
        );
        return;
    }

    if (password.length < 4) {
        authMessage("Password must be at least 4 characters.");
        return;
    }

    if (password !== confirm) {
        authMessage("Passwords do not match.");
        return;
    }

    const accounts = getAccounts();

    if (
        accounts.some(
            account =>
                account.username.toLowerCase() === username.toLowerCase()
        )
    ) {
        authMessage("That username is already taken.");
        return;
    }

    if (
        accounts.some(
            account => account.email.toLowerCase() === email
        )
    ) {
        authMessage("That email is already registered.");
        return;
    }

    accounts.push({
        email,
        username,
        password,
        createdAt: Date.now()
    });

    saveAccounts(accounts);
    setCurrentUsername(username);
    enterDesktop(username);
}

function forgotPassword() {
    const email = prompt("Enter your account email:");

    if (!email) return;

    const account = getAccounts().find(
        item => item.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!account) {
        alert("No account was found with that email.");
        return;
    }

    alert(
        "This local version cannot send emails. Your username is: " +
        account.username
    );
}

function enterDesktop(username) {
    hide($("authScreen"));
    show($("desktop"));
    updateUserLabels(username);
    applySettings();
}

function updateUserLabels(username) {
    const account = currentAccount();

    text("settingsUsername", username);
    text("settingsEmail", account?.email || "Local NEXUS account");
    text("startUsername", username);
    text("startEmail", account?.email || "Local account");
}

/* =========================================================
   DESKTOP AND WINDOWS
   ========================================================= */

function setupDesktop() {
    document.addEventListener("click", event => {
        const button = event.target.closest(
            "[data-open], [data-app], [data-window]"
        );

        if (!button) return;

        event.preventDefault();

        const windowId =
            button.getAttribute("data-open") ||
            button.getAttribute("data-app") ||
            button.getAttribute("data-window");

        if (!windowId) return;

        console.log("NEXUS opening:", windowId);

        openWindow(windowId);

        hide($("startMenu"));
    });
}

function setupWindows() {
    document.querySelectorAll(".window").forEach(windowElement => {
        const closeButton = windowElement.querySelector(".close-button");
        const minimizeButton = windowElement.querySelector(".minimize-button");

        closeButton?.addEventListener("click", () => {
            hide(windowElement);
        });

        minimizeButton?.addEventListener("click", () => {
            hide(windowElement);
        });

        windowElement.addEventListener("mousedown", () => {
            highestZ++;
            windowElement.style.zIndex = highestZ;
        });
    });
}

function openWindow(id) {
    const element = $(id);

    if (!element) return;

    show(element);
    highestZ++;
    element.style.zIndex = highestZ;
}

function closeAllWindows() {
    document.querySelectorAll(".window").forEach(hide);
}

/* =========================================================
   NOTEPAD
   ========================================================= */

function setupNotepad() {
    const editor = $("notepad");

    if (!editor) return;

    editor.value = localStorage.getItem(STORAGE.notes) || "";

    editor.addEventListener("input", updateWordCount);

    $("newNote")?.addEventListener("click", () => {
        editor.value = "";
        updateWordCount();
        text("noteStatus", "New note");
    });

    $("saveNote")?.addEventListener("click", () => {
        localStorage.setItem(STORAGE.notes, editor.value);
        text("noteStatus", "Saved ✓");
    });

    $("clearNote")?.addEventListener("click", () => {
        editor.value = "";
        localStorage.removeItem(STORAGE.notes);
        updateWordCount();
        text("noteStatus", "Cleared");
    });

    updateWordCount();
}

function updateWordCount() {
    const editor = $("notepad");
    if (!editor) return;

    const words = editor.value.trim()
        ? editor.value.trim().split(/\s+/).length
        : 0;

    text("wordCount", `${words} words`);
}

/* =========================================================
   CALCULATOR
   ========================================================= */

function setupCalculator() {
    document.querySelectorAll("[data-calc]").forEach(button => {
        button.addEventListener("click", () => {
            calculatorInput(button.dataset.calc);
        });
    });
}

function calculatorInput(value) {
    const display = $("calculatorDisplay");

    if (!display) return;

    if (value === "C") {
        display.value = "";
        return;
    }

    if (value === "backspace") {
        display.value = display.value.slice(0, -1);
        return;
    }

    if (value === "=") {
        try {
            const expression = display.value;

            if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
                throw new Error("Invalid expression");
            }

            const result = Function(
                `"use strict"; return (${expression})`
            )();

            display.value = Number.isFinite(result)
                ? String(result)
                : "Error";
        } catch {
            display.value = "Error";
        }

        return;
    }

    display.value += value;
}

/* =========================================================
   FILE MANAGER
   ========================================================= */

function getFiles() {
    return readJSON(STORAGE.files, []);
}

function saveFiles(files) {
    writeJSON(STORAGE.files, files);
}

function setupFiles() {
    $("newFile")?.addEventListener("click", newFile);
    $("saveFile")?.addEventListener("click", saveFile);
    $("deleteFile")?.addEventListener("click", deleteFile);

    renderFiles();
}

function renderFiles() {
    const list = $("fileList");
    if (!list) return;

    list.innerHTML = "";

    const files = getFiles();

    if (!files.length) {
        list.innerHTML = "<p>No files yet.</p>";
        return;
    }

    files.forEach(file => {
        const button = document.createElement("button");
        button.className = "file-item";
        button.textContent = `📄 ${file.name}`;

        button.addEventListener("click", () => {
            selectedFile = file.name;
            $("fileName").value = file.name;
            $("fileContent").value = file.content;
        });

        list.appendChild(button);
    });
}

function newFile() {
    selectedFile = null;
    $("fileName").value = "";
    $("fileContent").value = "";
}

function saveFile() {
    const name = ($("fileName")?.value || "").trim();
    const content = $("fileContent")?.value || "";

    if (!name) {
        alert("Enter a file name.");
        return;
    }

    const files = getFiles();
    const index = files.findIndex(file => file.name === selectedFile);

    if (index >= 0) {
        files[index] = { name, content };
    } else {
        files.push({ name, content });
    }

    selectedFile = name;
    saveFiles(files);
    renderFiles();
}

function deleteFile() {
    if (!selectedFile) {
        alert("Select a file first.");
        return;
    }

    saveFiles(
        getFiles().filter(file => file.name !== selectedFile)
    );

    newFile();
    renderFiles();
}

/* =========================================================
   PAINT
   ========================================================= */

function setupPaint() {
    const canvas = $("paintCanvas");

    if (!canvas) return;

    const context = canvas.getContext("2d");
    let drawing = false;

    function point(event) {
        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    canvas.addEventListener("pointerdown", event => {
        drawing = true;
        const p = point(event);
        context.beginPath();
        context.moveTo(p.x, p.y);
    });

    canvas.addEventListener("pointermove", event => {
        if (!drawing) return;

        const p = point(event);

        context.lineWidth = Number($("brushSize")?.value || 5);
        context.lineCap = "round";
        context.strokeStyle = $("paintColor")?.value || "#6c5ce7";

        context.lineTo(p.x, p.y);
        context.stroke();
    });

    canvas.addEventListener("pointerup", () => {
        drawing = false;
    });

    canvas.addEventListener("pointerleave", () => {
        drawing = false;
    });

    $("clearPaint")?.addEventListener("click", () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    $("savePaint")?.addEventListener("click", () => {
        const link = document.createElement("a");
        link.download = "nexus-paint.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

/* =========================================================
   GAMES
   ========================================================= */

function setupGames() {
    document.querySelectorAll("[data-game]").forEach(button => {
        button.addEventListener("click", () => {
            startGame(button.dataset.game);
        });
    });

    document.querySelectorAll(".back-game").forEach(button => {
        button.addEventListener("click", showGameMenu);
    });

    $("startCatch")?.addEventListener("click", () => {
    startCatch();
});

$("catchTarget")?.addEventListener("click", () => {
    catchTarget();
});

$("startClick")?.addEventListener("click", () => {
    startClickRush();
});

$("clickButton")?.addEventListener("click", () => {
    click();
});

$("startMemory")?.addEventListener("click", () => {
    startMemory();
});

$("startSnake")?.addEventListener("click", () => {
    startSnake();
});

    document.addEventListener("keydown", snakeKeys);
}

function startGame(game) {
    currentGame = game;

    hide($("gameMenu"));
    hide($("catchGameScreen"));
    hide($("clickGameScreen"));
    hide($("memoryGameScreen"));
    hide($("snakeGameScreen"));

    if (game === "catch") show($("catchGameScreen"));
    if (game === "click") show($("clickGameScreen"));
    if (game === "memory") show($("memoryGameScreen"));
    if (game === "snake") show($("snakeGameScreen"));
}

function showGameMenu() {
    currentGame = null;

    clearInterval(catchTimer);
    clearInterval(clickTimer);
    clearInterval(snakeTimer);

    show($("gameMenu"));
    hide($("catchGameScreen"));
    hide($("clickGameScreen"));
    hide($("memoryGameScreen"));
    hide($("snakeGameScreen"));
}

/* Catch NEXUS */

function startCatch() {
    clearInterval(catchTimer);

    let score = 0;
    text("catchScore", "0");

    const target = $("catchTarget");
    const area = $("catchArea");

    if (!target || !area) return;

    function move() {
        const maxX = Math.max(0, area.clientWidth - target.offsetWidth);
        const maxY = Math.max(0, area.clientHeight - target.offsetHeight);

        target.style.left = `${Math.random() * maxX}px`;
        target.style.top = `${Math.random() * maxY}px`;
    }

    target.onclick = () => {
        score++;
        text("catchScore", String(score));
        move();
    };

    move();

    catchTimer = setInterval(move, 900);
}

function catchTarget() {
    /* The actual click action is assigned by startCatch(). */
}

/* Click Rush */

function startClickRush() {
    clearInterval(clickTimer);

    clickScore = 0;
    clickTime = 10;
    clickRunning = false;

    text("clickScore", "0");
    text("clickTime", "10");

    const button = $("clickButton");
    if (button) button.disabled = false;
}

function click() {
    if (!clickRunning) {
        clickRunning = true;

        clickTimer = setInterval(() => {
            clickTime--;
            text("clickTime", String(clickTime));

            if (clickTime <= 0) {
                clearInterval(clickTimer);
                clickRunning = false;
                $("clickButton").disabled = true;
            }
        }, 1000);
    }

    if (clickTime <= 0) return;

    clickScore++;
    text("clickScore", String(clickScore));
}

/* Memory Match */

function startMemory() {
    const board = $("memoryBoard");
    if (!board) return;

    memoryCards = [];
    memoryFirst = null;
    memoryMoves = 0;
    memoryLocked = false;

    text("memoryMoves", "0");

    const symbols = ["🚀", "🎮", "🌟", "🧠", "💻", "🎨"];

    [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5)
        .forEach((symbol, index) => {
            memoryCards.push({
                id: index,
                symbol,
                flipped: false,
                matched: false
            });
        });

    renderMemory();
}

function renderMemory() {
    const board = $("memoryBoard");
    if (!board) return;

    board.innerHTML = "";

    memoryCards.forEach(card => {
        const button = document.createElement("button");
        button.className = "memory-card";
        button.textContent =
            card.flipped || card.matched ? card.symbol : "?";

        button.addEventListener("click", () => flipMemory(card.id));
        board.appendChild(button);
    });
}

function flipMemory(id) {
    if (memoryLocked) return;

    const card = memoryCards.find(item => item.id === id);

    if (!card || card.flipped || card.matched) return;

    card.flipped = true;
    renderMemory();

    if (!memoryFirst) {
        memoryFirst = card;
        return;
    }

    memoryMoves++;
    text("memoryMoves", String(memoryMoves));

    if (memoryFirst.symbol === card.symbol) {
        memoryFirst.matched = true;
        card.matched = true;
        memoryFirst = null;
        renderMemory();
        return;
    }

    memoryLocked = true;

    setTimeout(() => {
        memoryFirst.flipped = false;
        card.flipped = false;
        memoryFirst = null;
        memoryLocked = false;
        renderMemory();
    }, 700);
}

/* Snake */

function startSnake() {
    const canvas = $("snakeCanvas");
    if (!canvas) return;

    snake = [
        { x: 8, y: 7 },
        { x: 7, y: 7 },
        { x: 6, y: 7 }
    ];

    snakeDirection = { x: 1, y: 0 };
    snakeNextDirection = { x: 1, y: 0 };
    snakeScore = 0;

    text("snakeScore", "0");

    placeFood();
    clearInterval(snakeTimer);
    snakeTimer = setInterval(snakeTick, 120);

    drawSnake();
}

function snakeKeys(event) {
    if (currentGame !== "snake") return;

    const key = event.key;

    if (key === "ArrowUp" && snakeDirection.y !== 1) {
        snakeNextDirection = { x: 0, y: -1 };
    }

    if (key === "ArrowDown" && snakeDirection.y !== -1) {
        snakeNextDirection = { x: 0, y: 1 };
    }

    if (key === "ArrowLeft" && snakeDirection.x !== 1) {
        snakeNextDirection = { x: -1, y: 0 };
    }

    if (key === "ArrowRight" && snakeDirection.x !== -1) {
        snakeNextDirection = { x: 1, y: 0 };
    }
}

function placeFood() {
    snakeFood = {
        x: Math.floor(Math.random() * 26),
        y: Math.floor(Math.random() * 19)
    };
}

function snakeTick() {
    const head = snake[0];

    snakeDirection = snakeNextDirection;

    const next = {
        x: head.x + snakeDirection.x,
        y: head.y + snakeDirection.y
    };

    if (
        next.x < 0 ||
        next.y < 0 ||
        next.x >= 26 ||
        next.y >= 19 ||
        snake.some(part => part.x === next.x && part.y === next.y)
    ) {
        clearInterval(snakeTimer);
        return;
    }

    snake.unshift(next);

    if (next.x === snakeFood.x && next.y === snakeFood.y) {
        snakeScore++;
        text("snakeScore", String(snakeScore));
        placeFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

function drawSnake() {
    const canvas = $("snakeCanvas");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const size = 15;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#111827";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#6c5ce7";

    snake.forEach(part => {
        context.fillRect(
            part.x * size,
            part.y * size,
            size - 1,
            size - 1
        );
    });

    context.fillStyle = "#ff4f81";

    context.fillRect(
        snakeFood.x * size,
        snakeFood.y * size,
        size - 1,
        size - 1
    );
}

/* =========================================================
   BROWSER
   ========================================================= */

function setupBrowser() {
    $("browserGo")?.addEventListener("click", navigateBrowser);
    $("browserBack")?.addEventListener("click", () => browserHistoryMove(-1));
    $("browserForward")?.addEventListener("click", () => browserHistoryMove(1));
    $("browserReload")?.addEventListener("click", reloadBrowser);
    $("browserHome")?.addEventListener("click", browserHome);
    $("openExternalButton")?.addEventListener("click", openExternal);
    $("blockedExternalButton")?.addEventListener("click", openExternal);
    $("browserFavorite")?.addEventListener("click", favoriteBrowser);
    $("newBrowserTab")?.addEventListener("click", browserHome);
    $("browserHistoryButton")?.addEventListener("click", showHistory);
    $("closeHistory")?.addEventListener("click", () => {
        hide($("browserHistoryPanel"));
    });

    $("browserAddress")?.addEventListener("keydown", event => {
        if (event.key === "Enter") navigateBrowser();
    });

    document.querySelectorAll("[data-url]").forEach(button => {
        button.addEventListener("click", () => {
            navigateTo(button.dataset.url);
        });
    });

    browserHome();
}

function normalizeUrl(value) {
    const input = value.trim();

    if (!input) return "";

    if (/^https?:\/\//i.test(input)) {
        return input;
    }

    if (input.includes(".") && !input.includes(" ")) {
        return "https://" + input;
    }

    return "https://www.google.com/search?q=" +
        encodeURIComponent(input);
}

function navigateBrowser() {
    navigateTo($("browserAddress")?.value || "");
}

function navigateTo(value) {
    const url = normalizeUrl(value);

    if (!url) return;

    browserCurrentUrl = url;

    if ($("browserAddress")) {
        $("browserAddress").value = url;
    }

    hide($("browserHomePage"));
    hide($("browserBlocked"));
    show($("browserFrame"));

    const frame = $("browserFrame");

    if (frame) {
        frame.src = url;
    }
}

function browserHome() {
    browserCurrentUrl = "";

    if ($("browserAddress")) {
        $("browserAddress").value = "";
    }

    hide($("browserFrame"));
    hide($("browserBlocked"));
    show($("browserHomePage"));
}

function reloadBrowser() {
    const frame = $("browserFrame");

    if (frame && browserCurrentUrl) {
        frame.src = browserCurrentUrl;
    }
}

function browserHistoryMove(direction) {
    const frame = $("browserFrame");

    try {
        frame?.contentWindow?.history[
            direction < 0 ? "back" : "forward"
        ]();
    } catch {
        /* Some embedded websites block history access. */
    }
}

function openExternal() {
    const url =
        browserCurrentUrl ||
        $("browserAddress")?.value ||
        "https://www.google.com";

    window.open(normalizeUrl(url), "_blank", "noopener,noreferrer");
}

function favoriteBrowser() {
    if (!browserCurrentUrl) {
        alert("Open a website first.");
        return;
    }

    const favorites = readJSON("nexus_v14_favorites", []);

    if (!favorites.includes(browserCurrentUrl)) {
        favorites.push(browserCurrentUrl);
        writeJSON("nexus_v14_favorites", favorites);
    }

    alert("Saved to favorites.");
}

function showHistory() {
    const panel = $("browserHistoryPanel");
    const list = $("historyList");

    if (!panel || !list) return;

    list.innerHTML = "";

    const history = readJSON(STORAGE.history, []);

    if (!history.length) {
        list.textContent = "No history yet.";
    } else {
        history.forEach(url => {
            const button = document.createElement("button");
            button.textContent = url;
            button.addEventListener("click", () => navigateTo(url));
            list.appendChild(button);
        });
    }

    show(panel);
}

/* =========================================================
   SETTINGS
   ========================================================= */

function getSettings() {
    return readJSON(STORAGE.settings, {
        theme: "dark",
        wallpaper: "nexus"
    });
}

function saveSettings(settings) {
    writeJSON(STORAGE.settings, settings);
}

function setupSettings() {
    $("saveUsername")?.addEventListener("click", saveUsername);
    $("darkTheme")?.addEventListener("click", () => setTheme("dark"));
    $("lightTheme")?.addEventListener("click", () => setTheme("light"));
    $("changePassword")?.addEventListener("click", changePassword);
    $("logoutButton")?.addEventListener("click", logout);
    $("deleteAccount")?.addEventListener("click", deleteAccount);
    $("startLogout")?.addEventListener("click", logout);

    document.querySelectorAll("[data-wallpaper]").forEach(button => {
        button.addEventListener("click", () => {
            setWallpaper(button.dataset.wallpaper);
        });
    });
}

function applySettings() {
    const settings = getSettings();

    setTheme(settings.theme || "dark", false);
    setWallpaper(settings.wallpaper || "nexus", false);

    const account = currentAccount();

    if (account) {
        text("settingsUsername", account.username);
        text("settingsEmail", account.email);
        text("startUsername", account.username);
        text("startEmail", account.email);

        if ($("settingsUsernameInput")) {
            $("settingsUsernameInput").value = account.username;
        }
    }
}

function setTheme(theme, save = true) {
    document.body.dataset.theme = theme;
    document.documentElement.dataset.theme = theme;

    if (save) {
        const settings = getSettings();
        settings.theme = theme;
        saveSettings(settings);
    }
}

function setWallpaper(wallpaper, save = true) {
    const wallpaperElement = $("wallpaper");

    if (wallpaperElement) {
        wallpaperElement.dataset.wallpaper = wallpaper;
    }

    document.body.dataset.wallpaper = wallpaper;

    if (save) {
        const settings = getSettings();
        settings.wallpaper = wallpaper;
        saveSettings(settings);
    }
}

function saveUsername() {
    const input = $("settingsUsernameInput");
    const account = currentAccount();

    if (!input || !account) return;

    const username = input.value.trim();

    if (!validUsername(username)) {
        alert(
            "Username must be 3–24 characters and may contain letters, numbers, spaces, or underscores."
        );
        return;
    }

    const accounts = getAccounts();

    if (
        accounts.some(
            item =>
                item.username.toLowerCase() === username.toLowerCase() &&
                item.username !== account.username
        )
    ) {
        alert("That username is already taken.");
        return;
    }

    account.username = username;
    saveAccounts(accounts);
    setCurrentUsername(username);
    updateUserLabels(username);

    alert("Username saved.");
}

function changePassword() {
    const account = currentAccount();

    if (!account) return;

    const oldPassword = prompt("Enter your current password:");

    if (oldPassword !== account.password) {
        alert("Incorrect password.");
        return;
    }

    const newPassword = prompt("Enter your new password:");

    if (!newPassword || newPassword.length < 4) {
        alert("Password must be at least 4 characters.");
        return;
    }

    account.password = newPassword;
    saveAccounts(getAccounts());

    alert("Password changed successfully.");
}

function logout() {
    setCurrentUsername("");
    closeAllWindows();
    hide($("desktop"));
    showAuth();
}

function deleteAccount() {
    const username = currentUsername();

    if (!username) return;

    if (prompt("Type DELETE to remove your account:") !== "DELETE") {
        return;
    }

    saveAccounts(
        getAccounts().filter(
            account => account.username !== username
        )
    );

    logout();
}

/* =========================================================
   START MENU AND CLOCK
   ========================================================= */

function setupStartMenu() {
    $("startButton")?.addEventListener("click", event => {
        event.stopPropagation();
        toggleStartMenu();
    });

    document.addEventListener("click", event => {
        const menu = $("startMenu");
        const button = $("startButton");

        if (
            menu &&
            !menu.contains(event.target) &&
            event.target !== button
        ) {
            hide(menu);
        }
    });
}

function toggleStartMenu() {
    const menu = $("startMenu");

    if (!menu) return;

    menu.classList.toggle("hidden");
}

function setupClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    const date = now.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    text("taskbarClock", time);
    text("bigClock", time);
    text("bigDate", date);
}

/* =========================================================
   START
   ========================================================= */

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startBoot);
} else {
    startBoot();
}
