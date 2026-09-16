/* =========================================================
   NEXUS v1.4
   Complete JavaScript
   Firebase-free
   ========================================================= */

"use strict";

/* =========================================================
   HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);

function show(el) {
    if (!el) return;
    el.classList.remove("hidden");
}

function hide(el) {
    if (!el) return;
    el.classList.add("hidden");
}

function toggle(el) {
    if (!el) return;
    el.classList.toggle("hidden");
}

function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
}

function safeJSONParse(value, fallback) {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE = {
    accounts: "nexus_v14_accounts",
    currentUser: "nexus_v14_current_user",
    notes: "nexus_v14_notes",
    files: "nexus_v14_files",
    settings: "nexus_v14_settings",
    history: "nexus_v14_browser_history"
};

function getAccounts() {
    return safeJSONParse(
        localStorage.getItem(STORAGE.accounts),
        []
    );
}

function saveAccounts(accounts) {
    localStorage.setItem(
        STORAGE.accounts,
        JSON.stringify(accounts)
    );
}

function getCurrentUser() {
    return localStorage.getItem(STORAGE.currentUser);
}

function setCurrentUser(username) {
    if (username) {
        localStorage.setItem(
            STORAGE.currentUser,
            username
        );
    } else {
        localStorage.removeItem(STORAGE.currentUser);
    }
}

/* =========================================================
   ACCOUNT HELPERS
   ========================================================= */

function findAccount(username) {
    return getAccounts().find(
        account =>
            account.username.toLowerCase() ===
            username.toLowerCase()
    );
}

function validateUsername(username) {
    return /^[A-Za-z0-9_ ]{3,24}$/.test(username);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAuthMessage(message, type = "error") {
    const possible = [
        $("authMessage"),
        $("loginMessage"),
        $("signupMessage"),
        $("authStatus")
    ];

    const el = possible.find(Boolean);

    if (!el) {
        alert(message);
        return;
    }

    el.textContent = message;
    el.dataset.type = type;
}

function clearAuthMessage() {
    const possible = [
        $("authMessage"),
        $("loginMessage"),
        $("signupMessage"),
        $("authStatus")
    ];

    possible.forEach(el => {
        if (el) el.textContent = "";
    });
}

/* =========================================================
   BOOT
   ========================================================= */

function startBoot() {
    const boot = $("bootScreen");
    const bootText = $("bootText");

    if (!boot) {
        initializeNexus();
        return;
    }

    let progress = 0;

    if (bootText) {
        bootText.textContent = "Starting NEXUS...";
    }

    const timer = setInterval(() => {
        progress += 20;

        if (progress >= 100) {
            clearInterval(timer);

            if (bootText) {
                bootText.textContent = "NEXUS Ready.";
            }

            setTimeout(() => {
                hide(boot);
                initializeNexus();
            }, 350);
        }
    }, 180);
}

/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeNexus() {
    setupAuthentication();
    setupDesktop();
    setupNotepad();
    setupCalculator();
    setupFiles();
    setupPaint();
    setupGames();
    setupBrowser();
    setupSettings();
    setupWindowControls();
    setupClock();
    setupStartMenu();

    const currentUser = getCurrentUser();

    if (currentUser && findAccount(currentUser)) {
        enterDesktop(currentUser);
    } else {
        showAuthScreen();
    }
}

/* =========================================================
   AUTH SCREEN
   ========================================================= */

function showAuthScreen() {
    hide($("desktop"));
    hide($("taskbar"));
    hide($("startMenu"));
    show($("authScreen"));

    const loginSection = $("loginSection");
    const signupSection = $("signupSection");

    if (loginSection) show(loginSection);
    if (signupSection) hide(signupSection);
}

function showSignup() {
    const loginSection = $("loginSection");
    const signupSection = $("signupSection");

    if (loginSection) hide(loginSection);
    if (signupSection) show(signupSection);

    clearAuthMessage();
}

function showLogin() {
    const loginSection = $("loginSection");
    const signupSection = $("signupSection");

    if (signupSection) hide(signupSection);
    if (loginSection) show(loginSection);

    clearAuthMessage();
}

function setupAuthentication() {
    const loginButton =
        $("loginButton") ||
        $("loginBtn");

    const signupButton =
        $("signupButton") ||
        $("signupBtn");

    const createButton =
        $("createAccountButton") ||
        $("createAccountBtn");

    const backLoginButton =
        $("backLoginButton") ||
        $("backLoginBtn");

    if (loginButton) {
        loginButton.addEventListener(
            "click",
            login
        );
    }

    if (signupButton) {
        signupButton.addEventListener(
            "click",
            createAccount
        );
    }

    if (createButton) {
        createButton.addEventListener(
            "click",
            showSignup
        );
    }

    if (backLoginButton) {
        backLoginButton.addEventListener(
            "click",
            showLogin
        );
    }

    const loginPassword = $("loginPassword");

    if (loginPassword) {
        loginPassword.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    login();
                }
            }
        );
    }
}

function login() {
    clearAuthMessage();

    const email = ($("loginEmail")?.value || "")
        .trim()
        .toLowerCase();

    const username = ($("loginUsername")?.value || "")
        .trim();

    const password =
        $("loginPassword")?.value || "";

    if (!email || !username || !password) {
        showAuthMessage(
            "Please fill in all login fields."
        );
        return;
    }

    const accounts = getAccounts();

    const account = accounts.find(
        item =>
            item.email.toLowerCase() === email &&
            item.username.toLowerCase() ===
                username.toLowerCase() &&
            item.password === password
    );

    if (!account) {
        showAuthMessage(
            "Incorrect email, username, or password."
        );
        return;
    }

    setCurrentUser(account.username);

    enterDesktop(account.username);
}

function createAccount() {
    clearAuthMessage();

    const email = ($("signupEmail")?.value || "")
        .trim()
        .toLowerCase();

    const username = ($("signupUsername")?.value || "")
        .trim();

    const password =
        $("signupPassword")?.value || "";

    const confirmPassword =
        $("signupConfirmPassword")?.value || "";

    if (!email || !username || !password || !confirmPassword) {
        showAuthMessage(
            "Please fill in every field."
        );
        return;
    }

    if (!validateEmail(email)) {
        showAuthMessage(
            "Please enter a valid email address."
        );
        return;
    }

    if (!validateUsername(username)) {
        showAuthMessage(
            "Username must be 3–24 characters and may use letters, numbers, spaces, or underscores."
        );
        return;
    }

    if (password.length < 4) {
        showAuthMessage(
            "Password must be at least 4 characters."
        );
        return;
    }

    if (password !== confirmPassword) {
        showAuthMessage(
            "Passwords do not match."
        );
        return;
    }

    const accounts = getAccounts();

    if (
        accounts.some(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase()
        )
    ) {
        showAuthMessage(
            "That username is already taken."
        );
        return;
    }

    if (
        accounts.some(
            account =>
                account.email.toLowerCase() ===
                email
        )
    ) {
        showAuthMessage(
            "That email is already registered."
        );
        return;
    }

    accounts.push({
        email,
        username,
        password,
        createdAt: Date.now()
    });

    saveAccounts(accounts);
    setCurrentUser(username);

    enterDesktop(username);
}

function enterDesktop(username) {
    hide($("authScreen"));
    show($("desktop"));
    show($("taskbar"));

    setText("currentUsername", username);
    setText("settingsUsername", username);
    setText("aboutUsername", username);

    applySettings();
}

/* =========================================================
   DESKTOP
   ========================================================= */

function setupDesktop() {
    const icons = document.querySelectorAll(
        "[data-app]"
    );

    icons.forEach(icon => {
        icon.addEventListener(
            "dblclick",
            () => {
                openApp(icon.dataset.app);
            }
        );

        icon.addEventListener(
            "click",
            () => {
                icons.forEach(
                    item =>
                        item.classList.remove(
                            "selected"
                        )
                );

                icon.classList.add("selected");
            }
        );
    });
}

function openApp(app) {
    const map = {
        notepad: "notepadWindow",
        calculator: "calculatorWindow",
        files: "filesWindow",
        paint: "paintWindow",
        games: "gamesWindow",
        browser: "browserWindow",
        settings: "settingsWindow",
        about: "aboutWindow"
    };

    const windowId = map[app];

    if (!windowId) return;

    const windowElement = $(windowId);

    if (!windowElement) return;

    show(windowElement);

    bringToFront(windowElement);
}

function closeApp(app) {
    const map = {
        notepad: "notepadWindow",
        calculator: "calculatorWindow",
        files: "filesWindow",
        paint: "paintWindow",
        games: "gamesWindow",
        browser: "browserWindow",
        settings: "settingsWindow",
        about: "aboutWindow"
    };

    const windowId = map[app];

    if (windowId) {
        hide($(windowId));
    }
}

/* =========================================================
   WINDOW CONTROLS
   ========================================================= */

function setupWindowControls() {
    document.querySelectorAll(
        "[data-close]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => {
                closeApp(
                    button.dataset.close
                );
            }
        );
    });

    document.querySelectorAll(
        "[data-open]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => {
                openApp(
                    button.dataset.open
                );
            }
        );
    });

    document.querySelectorAll(
        "[data-minimize]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const target =
                    $(button.dataset.minimize);

                if (target) hide(target);
            }
        );
    });

    document.querySelectorAll(
        ".window"
    ).forEach(windowElement => {
        windowElement.addEventListener(
            "mousedown",
            () => bringToFront(windowElement)
        );
    });
}

let highestZ = 50;

function bringToFront(element) {
    if (!element) return;

    highestZ++;
    element.style.zIndex = highestZ;
}

/* =========================================================
   START MENU
   ========================================================= */

function setupStartMenu() {
    const startButton =
        $("startButton") ||
        $("startBtn");

    const startMenu = $("startMenu");

    if (startButton && startMenu) {
        startButton.addEventListener(
            "click",
            event => {
                event.stopPropagation();
                toggle(startMenu);
            }
        );
    }

    document.addEventListener(
        "click",
        event => {
            if (
                startMenu &&
                !startMenu.contains(event.target) &&
                event.target !== startButton
            ) {
                hide(startMenu);
            }
        }
    );
}

/* =========================================================
   NOTEPAD
   ========================================================= */

function setupNotepad() {
    const editor =
        $("notepadEditor") ||
        $("notepadText");

    if (!editor) return;

    const saved =
        localStorage.getItem(
            STORAGE.notes
        );

    if (saved !== null) {
        editor.value = saved;
    }

    editor.addEventListener(
        "input",
        updateWordCount
    );

    updateWordCount();

    const saveButton =
        $("saveNoteButton") ||
        $("saveNote");

    const newButton =
        $("newNoteButton") ||
        $("newNote");

    const clearButton =
        $("clearNoteButton") ||
        $("clearNote");

    if (saveButton) {
        saveButton.addEventListener(
            "click",
            saveNote
        );
    }

    if (newButton) {
        newButton.addEventListener(
            "click",
            () => {
                editor.value = "";
                updateWordCount();
            }
        );
    }

    if (clearButton) {
        clearButton.addEventListener(
            "click",
            () => {
                editor.value = "";
                localStorage.removeItem(
                    STORAGE.notes
                );
                updateWordCount();
            }
        );
    }
}

function updateWordCount() {
    const editor =
        $("notepadEditor") ||
        $("notepadText");

    if (!editor) return;

    const words = editor.value
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    setText(
        "noteWordCount",
        `${words.length} words`
    );
}

function saveNote() {
    const editor =
        $("notepadEditor") ||
        $("notepadText");

    if (!editor) return;

    localStorage.setItem(
        STORAGE.notes,
        editor.value
    );

    setText(
        "noteStatus",
        "Saved ✓"
    );

    setTimeout(() => {
        setText(
            "noteStatus",
            "Ready"
        );
    }, 1500);
}

/* =========================================================
   CALCULATOR
   ========================================================= */

function setupCalculator() {
    const display =
        $("calculatorDisplay") ||
        $("calcDisplay");

    if (!display) return;

    document.querySelectorAll(
        "[data-calc]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => {
                calculateInput(
                    button.dataset.calc
                );
            }
        );
    });

    document.querySelectorAll(
        ".calc-btn"
    ).forEach(button => {
        if (
            !button.dataset.calc &&
            button.textContent.trim()
        ) {
            button.addEventListener(
                "click",
                () => {
                    calculateInput(
                        button.textContent.trim()
                    );
                }
            );
        }
    });
}

function calculateInput(value) {
    const display =
        $("calculatorDisplay") ||
        $("calcDisplay");

    if (!display) return;

    if (value === "C") {
        display.value = "";
        return;
    }

    if (
        value === "⌫" ||
        value === "backspace"
    ) {
        display.value =
            display.value.slice(0, -1);
        return;
    }

    if (
        value === "=" ||
        value === "equals"
    ) {
        try {
            const expression =
                display.value
                    .replace(/×/g, "*")
                    .replace(/÷/g, "/");

            if (
                !/^[0-9+\-*/().\s]+$/.test(
                    expression
                )
            ) {
                throw new Error();
            }

            const result =
                Function(
                    `"use strict"; return (${expression})`
                )();

            display.value =
                Number.isFinite(result)
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
    return safeJSONParse(
        localStorage.getItem(
            STORAGE.files
        ),
        []
    );
}

function saveFiles(files) {
    localStorage.setItem(
        STORAGE.files,
        JSON.stringify(files)
    );
}

function setupFiles() {
    const newButton =
        $("newFileButton") ||
        $("newFile");

    const saveButton =
        $("saveFileButton") ||
        $("saveFile");

    const deleteButton =
        $("deleteFileButton") ||
        $("deleteFile");

    if (newButton) {
        newButton.addEventListener(
            "click",
            createFile
        );
    }

    if (saveButton) {
        saveButton.addEventListener(
            "click",
            saveCurrentFile
        );
    }

    if (deleteButton) {
        deleteButton.addEventListener(
            "click",
            deleteCurrentFile
        );
    }

    renderFiles();
}

let selectedFile = null;

function renderFiles() {
    const list =
        $("fileList");

    if (!list) return;

    list.innerHTML = "";

    const files = getFiles();

    if (!files.length) {
        list.innerHTML =
            "<div class='empty-state'>No files yet.</div>";
        return;
    }

    files.forEach(file => {
        const item =
            document.createElement("button");

        item.className = "file-item";
        item.textContent =
            `📄 ${file.name}`;

        item.addEventListener(
            "click",
            () => openFile(file.name)
        );

        list.appendChild(item);
    });
}

function createFile() {
    const nameInput =
        $("fileName");

    const editor =
        $("fileEditor");

    if (!nameInput || !editor) return;

    const name =
        nameInput.value.trim();

    if (!name) {
        alert("Enter a file name.");
        return;
    }

    const files = getFiles();

    if (
        files.some(
            file =>
                file.name.toLowerCase() ===
                name.toLowerCase()
        )
    ) {
        alert("That file already exists.");
        return;
    }

    files.push({
        name,
        content: editor.value || ""
    });

    saveFiles(files);

    selectedFile = name;

    renderFiles();
}

function openFile(name) {
    const files = getFiles();

    const file = files.find(
        item => item.name === name
    );

    if (!file) return;

    selectedFile = name;

    if ($("fileName")) {
        $("fileName").value = file.name;
    }

    if ($("fileEditor")) {
        $("fileEditor").value =
            file.content;
    }
}

function saveCurrentFile() {
    const nameInput =
        $("fileName");

    const editor =
        $("fileEditor");

    if (!nameInput || !editor) return;

    const name =
        nameInput.value.trim();

    if (!name) {
        alert("Enter a file name.");
        return;
    }

    const files = getFiles();

    const index = files.findIndex(
        file => file.name === selectedFile
    );

    if (index >= 0) {
        files[index] = {
            name,
            content: editor.value
        };
    } else {
        files.push({
            name,
            content: editor.value
        });
    }

    saveFiles(files);

    selectedFile = name;

    renderFiles();
}

function deleteCurrentFile() {
    if (!selectedFile) {
        alert("Select a file first.");
        return;
    }

    const files = getFiles().filter(
        file =>
            file.name !== selectedFile
    );

    saveFiles(files);

    selectedFile = null;

    if ($("fileName")) {
        $("fileName").value = "";
    }

    if ($("fileEditor")) {
        $("fileEditor").value = "";
    }

    renderFiles();
}

/* =========================================================
   PAINT
   ========================================================= */

function setupPaint() {
    const canvas =
        $("paintCanvas");

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    let drawing = false;

    function position(event) {
        const rect =
            canvas.getBoundingClientRect();

        return {
            x:
                event.clientX -
                rect.left,

            y:
                event.clientY -
                rect.top
        };
    }

    canvas.addEventListener(
        "pointerdown",
        event => {
            drawing = true;

            const point =
                position(event);

            ctx.beginPath();
            ctx.moveTo(
                point.x,
                point.y
            );
        }
    );

    canvas.addEventListener(
        "pointermove",
        event => {
            if (!drawing) return;

            const point =
                position(event);

            const brush =
                $("brushSize");

            ctx.lineWidth =
                Number(
                    brush?.value || 5
                );

            ctx.lineCap = "round";

            ctx.strokeStyle =
                $("brushColor")?.value ||
                "#000000";

            ctx.lineTo(
                point.x,
                point.y
            );

            ctx.stroke();
        }
    );

    canvas.addEventListener(
        "pointerup",
        () => {
            drawing = false;
        }
    );

    canvas.addEventListener(
        "pointerleave",
        () => {
            drawing = false;
        }
    );

    const clearButton =
        $("clearPaintButton") ||
        $("clearPaint");

    if (clearButton) {
        clearButton.addEventListener(
            "click",
            () => {
                ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            }
        );
    }

    const saveButton =
        $("savePaintButton") ||
        $("savePaint");

    if (saveButton) {
        saveButton.addEventListener(
            "click",
            () => {
                const link =
                    document.createElement(
                        "a"
                    );

                link.download =
                    "nexus-paint.png";

                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );

                link.click();
            }
        );
    }
}

/* =========================================================
   GAME CENTER
   ========================================================= */

let activeGame = null;

function setupGames() {
    document.querySelectorAll(
        "[data-game]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => {
                startGame(
                    button.dataset.game
                );
            }
        );
    });

    const backButton =
        $("backToGames");

    if (backButton) {
        backButton.addEventListener(
            "click",
            showGameMenu
        );
    }

    const catchArea =
        $("catchArea");

    if (catchArea) {
        catchArea.addEventListener(
            "click",
            catchNexusClick
        );
    }

    const clickRush =
        $("clickRushButton");

    if (clickRush) {
        clickRush.addEventListener(
            "click",
            clickRushAction
        );
    }

    const snakeStart =
        $("snakeStart");

    if (snakeStart) {
        snakeStart.addEventListener(
            "click",
            startSnake
        );
    }

    document.addEventListener(
        "keydown",
        snakeKeydown
    );
}

function startGame(game) {
    activeGame = game;

    hide($("gameMenu"));
    show($("gameArea"));

    const title =
        $("gameTitle");

    if (title) {
        title.textContent =
            gameTitle(game);
    }

    hideAllGamePanels();

    if (game === "catch") {
        startCatchGame();
    }

    if (game === "click") {
        startClickRush();
    }

    if (game === "memory") {
        startMemoryGame();
    }

    if (game === "snake") {
        show($("snakeGame"));
    }
}

function gameTitle(game) {
    const titles = {
        catch: "🎯 Catch NEXUS",
        click: "⚡ Click Rush",
        memory: "🧠 Memory Match",
        snake: "🐍 NEXUS Snake"
    };

    return titles[game] ||
        "NEXUS Game";
}

function hideAllGamePanels() {
    [
        "catchGame",
        "clickGame",
        "memoryGame",
        "snakeGame"
    ].forEach(id => hide($(id)));
}

function showGameMenu() {
    activeGame = null;

    hide($("gameArea"));
    show($("gameMenu"));
}

/* =========================================================
   CATCH NEXUS
   ========================================================= */

let catchScore = 0;
let catchTimer = null;

function startCatchGame() {
    show($("catchGame"));

    catchScore = 0;

    setText(
        "catchScore",
        "Score: 0"
    );

    const target =
        $("catchTarget");

    if (!target) return;

    clearInterval(catchTimer);

    moveCatchTarget();

    catchTimer =
        setInterval(
            moveCatchTarget,
            900
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
        Math.random() * maxX +
        "px";

    target.style.top =
        Math.random() * maxY +
        "px";
}

function catchNexusClick(event) {
    if (
        !activeGame ||
        activeGame !== "catch"
    ) {
        return;
    }

    if (
        !event.target.matches(
            "#catchTarget"
        )
    ) {
        return;
    }

    catchScore++;

    setText(
        "catchScore",
        `Score: ${catchScore}`
    );

    moveCatchTarget();
}

/* =========================================================
   CLICK RUSH
   ========================================================= */

let clickRushScore = 0;
let clickRushRunning = false;
let clickRushTime = 10;
let clickRushTimer = null;

function startClickRush() {
    show($("clickGame"));

    clickRushScore = 0;
    clickRushTime = 10;
    clickRushRunning = false;

    setText(
        "clickRushScore",
        "Clicks: 0"
    );

    setText(
        "clickRushTime",
        "Time: 10"
    );
}

function clickRushAction() {
    if (!activeGame || activeGame !== "click") {
        return;
    }

    if (!clickRushRunning) {
        clickRushRunning = true;

        clickRushTimer =
            setInterval(() => {
                clickRushTime--;

                setText(
                    "clickRushTime",
                    `Time: ${clickRushTime}`
                );

                if (clickRushTime <= 0) {
                    clearInterval(
                        clickRushTimer
                    );

                    clickRushRunning =
                        false;

                    setText(
                        "clickRushStatus",
                        `Finished! You got ${clickRushScore} clicks.`
                    );
                }
            }, 1000);
    }

    if (clickRushTime <= 0) return;

    clickRushScore++;

    setText(
        "clickRushScore",
        `Clicks: ${clickRushScore}`
    );
}

/* =========================================================
   MEMORY MATCH
   ========================================================= */

let memoryCards = [];
let memoryFirst = null;
let memoryLock = false;

function startMemoryGame() {
    show($("memoryGame"));

    const board =
        $("memoryBoard");

    if (!board) return;

    const symbols = [
        "🚀",
        "🎮",
        "🌟",
        "🧠",
        "💻",
        "🎨"
    ];

    memoryCards =
        [...symbols, ...symbols]
            .sort(() => Math.random() - 0.5)
            .map((symbol, index) => ({
                id: index,
                symbol,
                flipped: false,
                matched: false
            }));

    memoryFirst = null;
    memoryLock = false;

    renderMemory();
}

function renderMemory() {
    const board =
        $("memoryBoard");

    if (!board) return;

    board.innerHTML = "";

    memoryCards.forEach(card => {
        const button =
            document.createElement(
                "button"
            );

        button.className =
            "memory-card";

        button.textContent =
            card.flipped ||
            card.matched
                ? card.symbol
                : "?";

        button.addEventListener(
            "click",
            () => flipMemoryCard(card.id)
        );

        board.appendChild(button);
    });
}

function flipMemoryCard(id) {
    if (memoryLock) return;

    const card =
        memoryCards.find(
            item => item.id === id
        );

    if (
        !card ||
        card.flipped ||
        card.matched
    ) {
        return;
    }

    card.flipped = true;

    renderMemory();

    if (!memoryFirst) {
        memoryFirst = card;
        return;
    }

    if (
        memoryFirst.symbol ===
        card.symbol
    ) {
        memoryFirst.matched = true;
        card.matched = true;
        memoryFirst = null;

        renderMemory();

        const finished =
            memoryCards.every(
                item => item.matched
            );

        if (finished) {
            setText(
                "memoryStatus",
                "🎉 You matched everything!"
            );
        }

        return;
    }

    memoryLock = true;

    setTimeout(() => {
        memoryFirst.flipped = false;
        card.flipped = false;

        memoryFirst = null;
        memoryLock = false;

        renderMemory();
    }, 700);
}

/* =========================================================
   SNAKE
   ========================================================= */

let snake = [];
let snakeFood = {
    x: 5,
    y: 5
};

let snakeDirection = {
    x: 1,
    y: 0
};

let snakeNextDirection = {
    x: 1,
    y: 0
};

let snakeTimer = null;
let snakeScore = 0;

const SNAKE_SIZE = 15;

function startSnake() {
    const canvas =
        $("snakeCanvas");

    if (!canvas) return;

    snake = [
        { x: 7, y: 7 },
        { x: 6, y: 7 },
        { x: 5, y: 7 }
    ];

    snakeDirection = {
        x: 1,
        y: 0
    };

    snakeNextDirection = {
        x: 1,
        y: 0
    };

    snakeScore = 0;

    setText(
        "snakeScore",
        "Score: 0"
    );

    placeSnakeFood();

    clearInterval(snakeTimer);

    snakeTimer =
        setInterval(
            snakeTick,
            120
        );

    drawSnake();
}

function snakeKeydown(event) {
    if (
        activeGame !== "snake"
    ) {
        return;
    }

    const key =
        event.key.toLowerCase();

    if (
        key === "arrowup" &&
        snakeDirection.y !== 1
    ) {
        snakeNextDirection = {
            x: 0,
            y: -1
        };
    }

    if (
        key === "arrowdown" &&
        snakeDirection.y !== -1
    ) {
        snakeNextDirection = {
            x: 0,
            y: 1
        };
    }

    if (
        key === "arrowleft" &&
        snakeDirection.x !== 1
    ) {
        snakeNextDirection = {
            x: -1,
            y: 0
        };
    }

    if (
        key === "arrowright" &&
        snakeDirection.x !== -1
    ) {
        snakeNextDirection = {
            x: 1,
            y: 0
        };
    }
}

function snakeTick() {
    const head = snake[0];

    snakeDirection =
        snakeNextDirection;

    const newHead = {
        x:
            head.x +
            snakeDirection.x,

        y:
            head.y +
            snakeDirection.y
    };

    const canvas =
        $("snakeCanvas");

    if (!canvas) return;

    const columns =
        Math.floor(
            canvas.width /
                SNAKE_SIZE
        );

    const rows =
        Math.floor(
            canvas.height /
                SNAKE_SIZE
        );

    if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= columns ||
        newHead.y >= rows ||
        snake.some(
            segment =>
                segment.x ===
                    newHead.x &&
                segment.y ===
                    newHead.y
        )
    ) {
        clearInterval(snakeTimer);

        setText(
            "snakeStatus",
            `Game over! Score: ${snakeScore}`
        );

        return;
    }

    snake.unshift(newHead);

    if (
        newHead.x === snakeFood.x &&
        newHead.y === snakeFood.y
    ) {
        snakeScore++;

        setText(
            "snakeScore",
            `Score: ${snakeScore}`
        );

        placeSnakeFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

function placeSnakeFood() {
    const canvas =
        $("snakeCanvas");

    if (!canvas) return;

    const columns =
        Math.floor(
            canvas.width /
                SNAKE_SIZE
        );

    const rows =
        Math.floor(
            canvas.height /
                SNAKE_SIZE
        );

    snakeFood = {
        x:
            Math.floor(
                Math.random() *
                    columns
            ),

        y:
            Math.floor(
                Math.random() *
                    rows
            )
    };
}

function drawSnake() {
    const canvas =
        $("snakeCanvas");

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "#101827";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "#7c5cff";

    snake.forEach(segment => {
        ctx.fillRect(
            segment.x *
                SNAKE_SIZE,

            segment.y *
                SNAKE_SIZE,

            SNAKE_SIZE - 1,
            SNAKE_SIZE - 1
        );
    });

    ctx.fillStyle =
        "#ff4f81";

    ctx.fillRect(
        snakeFood.x *
            SNAKE_SIZE,

        snakeFood.y *
            SNAKE_SIZE,

        SNAKE_SIZE - 1,
        SNAKE_SIZE - 1
    );
}

/* =========================================================
   BROWSER
   ========================================================= */

let browserHistory = [];

function setupBrowser() {
    browserHistory =
        safeJSONParse(
            localStorage.getItem(
                STORAGE.history
            ),
            []
        );

    const address =
        $("browserAddress");

    const goButton =
        $("browserGo");

    const backButton =
        $("browserBack");

    const forwardButton =
        $("browserForward");

    const refreshButton =
        $("browserRefresh");

    const homeButton =
        $("browserHome");

    const externalButton =
        $("browserExternal");

    if (goButton) {
        goButton.addEventListener(
            "click",
            navigateBrowser
        );
    }

    if (address) {
        address.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    navigateBrowser();
                }
            }
        );
    }

    if (backButton) {
        backButton.addEventListener(
            "click",
            () => {
                const frame =
                    $("browserFrame");

                if (
                    frame &&
                    frame.contentWindow
                ) {
                    try {
                        frame.contentWindow.history.back();
                    } catch {}
                }
            }
        );
    }

    if (forwardButton) {
        forwardButton.addEventListener(
            "click",
            () => {
                const frame =
                    $("browserFrame");

                if (
                    frame &&
                    frame.contentWindow
                ) {
                    try {
                        frame.contentWindow.history.forward();
                    } catch {}
                }
            }
        );
    }

    if (refreshButton) {
        refreshButton.addEventListener(
            "click",
            () => {
                const frame =
                    $("browserFrame");

                if (frame) {
                    frame.src =
                        frame.src;
                }
            }
        );
    }

    if (homeButton) {
        homeButton.addEventListener(
            "click",
            browserHome
        );
    }

    if (externalButton) {
        externalButton.addEventListener(
            "click",
            openBrowserExternal
        );
    }

    document.querySelectorAll(
        "[data-browser-url]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => {
                navigateTo(
                    button.dataset.browserUrl
                );
            }
        );
    });

    // IMPORTANT:
    // These lines intentionally include
    // the closing quotes and parentheses.
    hide($("browserHomePage"));
    hide($("browserBlocked"));
}

function normalizeUrl(input) {
    let value =
        input.trim();

    if (!value) return "";

    if (
        !/^https?:\/\//i.test(value)
    ) {
        if (
            value.includes(".") &&
            !value.includes(" ")
        ) {
            value =
                "https://" + value;
        } else {
            value =
                "https://www.google.com/search?q=" +
                encodeURIComponent(value);
        }
    }

    return value;
}

function navigateBrowser() {
    const address =
        $("browserAddress");

    if (!address) return;

    navigateTo(address.value);
}

function navigateTo(url) {
    const normalized =
        normalizeUrl(url);

    if (!normalized) return;

    const address =
        $("browserAddress");

    if (address) {
        address.value =
            normalized;
    }

    browserHistory.push(normalized);

    if (
        browserHistory.length >
        50
    ) {
        browserHistory.shift();
    }

    localStorage.setItem(
        STORAGE.history,
        JSON.stringify(
            browserHistory
        )
    );

    const frame =
        $("browserFrame");

    const homePage =
        $("browserHomePage");

    const blocked =
        $("browserBlocked");

    if (!frame) return;

    hide(homePage);
    hide(blocked);
    show(frame);

    frame.src = normalized;

    frame.onerror = () => {
        showBrowserBlocked(
            normalized
        );
    };

    setTimeout(() => {
        // Some sites block iframe embedding.
        // The external button remains available.
    }, 1200);
}

function browserHome() {
    const address =
        $("browserAddress");

    const frame =
        $("browserFrame");

    const homePage =
        $("browserHomePage");

    const blocked =
        $("browserBlocked");

    if (address) {
        address.value = "";
    }

    if (frame) {
        frame.src = "about:blank";
        hide(frame);
    }

    hide(blocked);
    show(homePage);
}

function showBrowserBlocked(url) {
    hide($("browserHomePage"));
    hide($("browserFrame"));
    show($("browserBlocked"));

    const blockedUrl =
        $("blockedUrl");

    if (blockedUrl) {
        blockedUrl.textContent =
            url;
    }

    const external =
        $("browserExternal");

    if (external) {
        external.dataset.url =
            url;
    }
}

function openBrowserExternal() {
    const external =
        $("browserExternal");

    const address =
        $("browserAddress");

    const url =
        external?.dataset.url ||
        address?.value;

    if (!url) return;

    window.open(
        normalizeUrl(url),
        "_blank",
        "noopener"
    );
}

/* =========================================================
   SETTINGS
   ========================================================= */

function getSettings() {
    return safeJSONParse(
        localStorage.getItem(
            STORAGE.settings
        ),
        {
            theme: "dark",
            wallpaper: "nexus",
            username: ""
        }
    );
}

function saveSettings(settings) {
    localStorage.setItem(
        STORAGE.settings,
        JSON.stringify(settings)
    );
}

function setupSettings() {
    const settings =
        getSettings();

    if (
        settings.username &&
        $("settingsUsername")
    ) {
        $("settingsUsername").value =
            settings.username;
    }

    document.querySelectorAll(
        "[data-theme]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => {
                applyTheme(
                    button.dataset.theme
                );
            }
        );
    });

    document.querySelectorAll(
        "[data-wallpaper]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => {
                applyWallpaper(
                    button.dataset.wallpaper
                );
            }
        );
    });

    const usernameButton =
        $("saveUsernameButton") ||
        $("saveUsername");

    if (usernameButton) {
        usernameButton.addEventListener(
            "click",
            saveUsername
        );
    }

    const logoutButton =
        $("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            logout
        );
    }

    const deleteButton =
        $("deleteAccountButton");

    if (deleteButton) {
        deleteButton.addEventListener(
            "click",
            deleteAccount
        );
    }

    const changePasswordButton =
        $("changePasswordButton");

    if (changePasswordButton) {
        changePasswordButton.addEventListener(
            "click",
            changePassword
        );
    }

    applySettings();
}

function applySettings() {
    const settings =
        getSettings();

    applyTheme(
        settings.theme || "dark",
        false
    );

    applyWallpaper(
        settings.wallpaper || "nexus",
        false
    );

    const current =
        getCurrentUser();

    if (current) {
        setText(
            "currentUsername",
            current
        );

        setText(
            "aboutUsername",
            current
        );

        const usernameInput =
            $("settingsUsername");

        if (
            usernameInput &&
            !usernameInput.value
        ) {
            usernameInput.value =
                current;
        }
    }
}

function applyTheme(
    theme,
    save = true
) {
    document.body.dataset.theme =
        theme;

    document.documentElement.dataset.theme =
        theme;

    if (save) {
        const settings =
            getSettings();

        settings.theme =
            theme;

        saveSettings(settings);
    }
}

function applyWallpaper(
    wallpaper,
    save = true
) {
    document.body.dataset.wallpaper =
        wallpaper;

    document.documentElement.dataset.wallpaper =
        wallpaper;

    if (save) {
        const settings =
            getSettings();

        settings.wallpaper =
            wallpaper;

        saveSettings(settings);
    }
}

function saveUsername() {
    const input =
        $("settingsUsername");

    if (!input) return;

    const newUsername =
        input.value.trim();

    if (!validateUsername(newUsername)) {
        alert(
            "Username must be 3–24 characters and may use letters, numbers, spaces, or underscores."
        );
        return;
    }

    const current =
        getCurrentUser();

    if (!current) return;

    const accounts =
        getAccounts();

    const accountIndex =
        accounts.findIndex(
            account =>
                account.username.toLowerCase() ===
                current.toLowerCase()
        );

    if (accountIndex < 0) return;

    if (
        accounts.some(
            (account, index) =>
                index !== accountIndex &&
                account.username.toLowerCase() ===
                    newUsername.toLowerCase()
        )
    ) {
        alert(
            "That username is already taken."
        );
        return;
    }

    accounts[
        accountIndex
    ].username = newUsername;

    saveAccounts(accounts);

    setCurrentUser(
        newUsername
    );

    setText(
        "currentUsername",
        newUsername
    );

    setText(
        "aboutUsername",
        newUsername
    );

    alert(
        "Username saved!"
    );
}

function changePassword() {
    const current =
        getCurrentUser();

    if (!current) return;

    const account =
        findAccount(current);

    if (!account) return;

    const oldPassword =
        prompt(
            "Enter your current password:"
        );

    if (
        oldPassword === null
    ) {
        return;
    }

    if (
        oldPassword !==
        account.password
    ) {
        alert(
            "Incorrect current password."
        );
        return;
    }

    const newPassword =
        prompt(
            "Enter your new password:"
        );

    if (
        newPassword === null
    ) {
        return;
    }

    if (
        newPassword.length < 4
    ) {
        alert(
            "Password must be at least 4 characters."
        );
        return;
    }

    account.password =
        newPassword;

    const accounts =
        getAccounts();

    const index =
        accounts.findIndex(
            item =>
                item.username ===
                current
        );

    if (index >= 0) {
        accounts[index] =
            account;

        saveAccounts(accounts);
    }

    alert(
        "Password changed successfully."
    );
}

function logout() {
    setCurrentUser(null);

    hide($("desktop"));
    hide($("taskbar"));

    document.querySelectorAll(
        ".window"
    ).forEach(
        windowElement =>
            hide(windowElement)
    );

    showAuthScreen();
}

function deleteAccount() {
    const current =
        getCurrentUser();

    if (!current) return;

    const account =
        findAccount(current);

    if (!account) return;

    const confirmation =
        prompt(
            `Type DELETE to remove the account "${current}":`
        );

    if (
        confirmation !==
        "DELETE"
    ) {
        return;
    }

    const accounts =
        getAccounts().filter(
            item =>
                item.username !==
                current
        );

    saveAccounts(accounts);

    setCurrentUser(null);

    hide($("desktop"));
    hide($("taskbar"));

    showAuthScreen();
}

/* =========================================================
   CLOCK
   ========================================================= */

function setupClock() {
    updateClock();

    setInterval(
        updateClock,
        1000
    );
}

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
                month: "short",
                day: "numeric"
            }
        );

    setText(
        "taskbarTime",
        time
    );

    setText(
        "taskbarDate",
        date
    );

    setText(
        "clock",
        time
    );
}

/* =========================================================
   GLOBAL CLICK HANDLERS
   ========================================================= */

document.addEventListener(
    "click",
    event => {
        const appButton =
            event.target.closest(
                "[data-app]"
            );

        if (appButton) {
            openApp(
                appButton.dataset.app
            );
        }
    }
);

/* =========================================================
   START NEXUS
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        startBoot
    );
} else {
    startBoot();
}
