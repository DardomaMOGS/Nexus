/* =========================================================
   NEXUS v1.2
   COMPLETE OPERATING ENVIRONMENT
   LOCAL MULTI-USER SYSTEM
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const ACCOUNTS_KEY = "nexus_v12_accounts";
const SESSION_KEY = "nexus_v12_session";


/* =========================================================
   APPLICATION INFORMATION
========================================================= */

const APP_INFO = {
    notepad: {
        title: "Notepad",
        icon: "📝"
    },

    calculator: {
        title: "Calculator",
        icon: "🧮"
    },

    files: {
        title: "File Manager",
        icon: "📁"
    },

    paint: {
        title: "Paint",
        icon: "🎨"
    },

    game: {
        title: "Catch NEXUS",
        icon: "🎮"
    },

    settings: {
        title: "Settings",
        icon: "⚙️"
    },

    about: {
        title: "About NEXUS",
        icon: "ℹ️"
    }
};


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentAccount = null;

let openWindows = {};

let highestZIndex = 20;

let calculatorValue = "0";

let paintState = null;

let gameState = null;


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = id => document.getElementById(id);

const qs = selector =>
    document.querySelector(selector);

const qsa = selector =>
    document.querySelectorAll(selector);


/* =========================================================
   ACCOUNT STORAGE
========================================================= */

function getAccounts() {

    try {

        return JSON.parse(
            localStorage.getItem(ACCOUNTS_KEY)
        ) || {};

    } catch (error) {

        return {};
    }
}


function saveAccounts(accounts) {

    localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify(accounts)
    );
}


/* =========================================================
   ID GENERATOR
========================================================= */

function createID() {

    if (
        window.crypto &&
        typeof crypto.randomUUID === "function"
    ) {

        return crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
    );
}


/* =========================================================
   PASSWORD HASH
========================================================= */

async function hashPassword(password) {

    if (
        window.crypto &&
        crypto.subtle
    ) {

        const data =
            new TextEncoder().encode(password);

        const hash =
            await crypto.subtle.digest(
                "SHA-256",
                data
            );

        return Array.from(
            new Uint8Array(hash)
        )
            .map(
                byte =>
                    byte
                        .toString(16)
                        .padStart(2, "0")
            )
            .join("");
    }

    /*
       Fallback for browsers without
       Web Crypto support.
    */

    let hash = 0;

    for (let i = 0; i < password.length; i++) {

        hash =
            (
                (hash << 5) -
                hash +
                password.charCodeAt(i)
            ) |
            0;
    }

    return String(hash);
}


/* =========================================================
   DEFAULT ACCOUNT DATA
========================================================= */

function createDefaultAccount(
    username,
    passwordHash
) {

    return {

        id: createID(),

        username,

        passwordHash,

        createdAt:
            new Date().toISOString(),

        theme: "dark",

        wallpaper: "default",

        notes:
            "Welcome to NEXUS v1.2!\n\n" +
            "This is your personal Notepad.",

        files: {

            "Welcome.txt":
                "Welcome to NEXUS v1.2!\n\n" +
                "Your personal browser operating environment.",

            "About.txt":
                "NEXUS v1.2\n" +
                "Local browser operating environment.",

            "Ideas.txt":
                "Write your ideas here..."
        },

        highScore: 0
    };
}


/* =========================================================
   CURRENT SESSION
========================================================= */

function getSessionID() {

    return localStorage.getItem(
        SESSION_KEY
    );
}


function setSessionID(id) {

    localStorage.setItem(
        SESSION_KEY,
        id
    );
}


function clearSession() {

    localStorage.removeItem(
        SESSION_KEY
    );
}


/* =========================================================
   SAVE CURRENT ACCOUNT
========================================================= */

function saveCurrentAccount() {

    if (!currentAccount) {
        return;
    }

    const accounts = getAccounts();

    accounts[currentAccount.id] =
        currentAccount;

    saveAccounts(accounts);
}


/* =========================================================
   FIND ACCOUNT
========================================================= */

function findAccountByUsername(username) {

    const accounts = getAccounts();

    const normalized =
        username.trim().toLowerCase();

    return Object.values(accounts)
        .find(
            account =>
                account.username
                    .toLowerCase() === normalized
        );
}


/* =========================================================
   BOOT
========================================================= */

function bootNexus() {

    const progress =
        $("bootProgress");

    const text =
        $("bootText");

    const steps = [
        [15, "Initializing NEXUS..."],
        [35, "Loading system components..."],
        [55, "Preparing user environment..."],
        [75, "Loading applications..."],
        [90, "Starting desktop..."],
        [100, "Ready."]
    ];

    let index = 0;

    const interval =
        setInterval(() => {

            if (index >= steps.length) {

                clearInterval(interval);

                setTimeout(
                    checkSession,
                    300
                );

                return;
            }

            const [
                percentage,
                message
            ] = steps[index];

            progress.style.width =
                percentage + "%";

            text.textContent =
                message;

            index++;

        }, 300);
}


/* =========================================================
   CHECK SESSION
========================================================= */

function checkSession() {

    const sessionID =
        getSessionID();

    if (!sessionID) {

        showAuth();

        return;
    }

    const accounts =
        getAccounts();

    const account =
        accounts[sessionID];

    if (!account) {

        clearSession();

        showAuth();

        return;
    }

    loginAccount(account);
}


/* =========================================================
   AUTH DISPLAY
========================================================= */

function showAuth() {

    $("bootScreen").classList.add(
        "hidden"
    );

    $("desktop").classList.add(
        "hidden"
    );

    $("authScreen").classList.remove(
        "hidden"
    );

    $("loginPanel").classList.remove(
        "hidden"
    );

    $("signupPanel").classList.add(
        "hidden"
    );
}


function showLoginPanel() {

    $("loginPanel").classList.remove(
        "hidden"
    );

    $("signupPanel").classList.add(
        "hidden"
    );

    $("loginMessage").textContent = "";
}


function showSignupPanel() {

    $("loginPanel").classList.add(
        "hidden"
    );

    $("signupPanel").classList.remove(
        "hidden"
    );

    $("signupMessage").textContent = "";
}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

async function createAccount(
    username,
    password,
    confirmPassword
) {

    const message =
        $("signupMessage");

    username =
        username.trim();

    if (username.length < 3) {

        message.textContent =
            "Username must be at least 3 characters.";

        return;
    }

    if (!/^[a-zA-Z0-9_ -]+$/.test(username)) {

        message.textContent =
            "Use only letters, numbers, spaces, hyphens, or underscores.";

        return;
    }

    if (password.length < 4) {

        message.textContent =
            "Password must be at least 4 characters.";

        return;
    }

    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }

    if (findAccountByUsername(username)) {

        message.textContent =
            "That username already exists.";

        return;
    }

    const passwordHash =
        await hashPassword(password);

    const account =
        createDefaultAccount(
            username,
            passwordHash
        );

    const accounts =
        getAccounts();

    accounts[account.id] =
        account;

    saveAccounts(accounts);

    setSessionID(account.id);

    currentAccount =
        account;

    $("signupForm").reset();

    showDesktop();

    showToast(
        "Account created",
        `Welcome to NEXUS, ${username}!`
    );
}


/* =========================================================
   LOGIN
========================================================= */

async function login(
    username,
    password
) {

    const message =
        $("loginMessage");

    const account =
        findAccountByUsername(username);

    if (!account) {

        message.textContent =
            "Username or password is incorrect.";

        return;
    }

    const passwordHash =
        await hashPassword(password);

    if (
        passwordHash !==
        account.passwordHash
    ) {

        message.textContent =
            "Username or password is incorrect.";

        return;
    }

    setSessionID(account.id);

    currentAccount =
        account;

    $("loginForm").reset();

    showDesktop();

    showToast(
        "Welcome back",
        `Signed in as ${account.username}`
    );
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    saveCurrentAccount();

    clearSession();

    currentAccount = null;

    closeAllWindows();

    $("startMenu").classList.add(
        "hidden"
    );

    showAuth();

    showToast(
        "Signed out",
        "Your local NEXUS session has ended."
    );
}


/* =========================================================
   DESKTOP
========================================================= */

function showDesktop() {

    $("bootScreen").classList.add(
        "hidden"
    );

    $("authScreen").classList.add(
        "hidden"
    );

    $("desktop").classList.remove(
        "hidden"
    );

    applyAccountSettings();

    updateUserUI();

    updateClock();
}


/* =========================================================
   USER UI
========================================================= */

function updateUserUI() {

    if (!currentAccount) {
        return;
    }

    $("startUsername").textContent =
        currentAccount.username;

    $("taskbarUsername").textContent =
        currentAccount.username;
}


/* =========================================================
   ACCOUNT SETTINGS
========================================================= */

function applyAccountSettings() {

    if (!currentAccount) {
        return;
    }

    document.body.classList.toggle(
        "light-theme",
        currentAccount.theme === "light"
    );

    const desktop =
        $("desktop");

    desktop.classList.remove(
        "wallpaper-blue",
        "wallpaper-purple",
        "wallpaper-green",
        "wallpaper-sunset"
    );

    if (
        currentAccount.wallpaper &&
        currentAccount.wallpaper !== "default"
    ) {

        desktop.classList.add(
            "wallpaper-" +
            currentAccount.wallpaper
        );
    }
}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now =
        new Date();

    let hours =
        now.getHours();

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    const ampm =
        hours >= 12
            ? "PM"
            : "AM";

    hours =
        hours % 12 || 12;

    $("taskbarClock").textContent =
        `${hours}:${minutes} ${ampm}`;
}


setInterval(
    updateClock,
    1000
);


/* =========================================================
   TOAST
========================================================= */

function showToast(
    title,
    message
) {

    const container =
        $("toastContainer");

    const toast =
        document.createElement("div");

    toast.className =
        "toast";

    toast.innerHTML = `

        <div class="toast-title">
            ${escapeHTML(title)}
        </div>

        <div class="toast-message">
            ${escapeHTML(message)}
        </div>

    `;

    container.appendChild(toast);

    setTimeout(
        () => {

            toast.remove();

        },
        3200
    );
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   START MENU
========================================================= */

function toggleStartMenu() {

    $("startMenu").classList.toggle(
        "hidden"
    );
}


function closeStartMenu() {

    $("startMenu").classList.add(
        "hidden"
    );
}


/* =========================================================
   WINDOW SYSTEM
========================================================= */

function openApp(appName) {

    closeStartMenu();

    if (
        openWindows[appName]
    ) {

        focusWindow(
            openWindows[appName]
        );

        return;
    }

    const info =
        APP_INFO[appName];

    if (!info) {
        return;
    }

    const windowElement =
        createWindow(
            appName,
            info.title,
            info.icon
        );

    $("windowArea")
        .appendChild(
            windowElement
        );

    openWindows[appName] =
        windowElement;

    focusWindow(
        windowElement
    );

    updateTaskbar();
}


function createWindow(
    appName,
    title,
    icon
) {

    const windowElement =
        document.createElement("section");

    windowElement.className =
        "window";

    windowElement.dataset.app =
        appName;

    windowElement.innerHTML = `

        <div class="window-header">

            <div class="window-title">

                <span>
                    ${icon}
                </span>

                <span>
                    ${escapeHTML(title)}
                </span>

            </div>

            <div class="window-controls">

                <button
                    class="window-control minimize"
                    title="Minimize"
                >
                    −
                </button>

                <button
                    class="window-control maximize"
                    title="Maximize"
                >
                    □
                </button>

                <button
                    class="window-control close"
                    title="Close"
                >
                    ×
                </button>

            </div>

        </div>

        <div class="window-body"></div>

    `;

    const body =
        windowElement.querySelector(
            ".window-body"
        );

    buildApp(
        appName,
        body
    );

    windowElement
        .querySelector(".close")
        .addEventListener(
            "click",
            () => closeApp(appName)
        );

    windowElement
        .querySelector(".minimize")
        .addEventListener(
            "click",
            () => minimizeWindow(windowElement)
        );

    windowElement
        .querySelector(".maximize")
        .addEventListener(
            "click",
            () => {

                windowElement.classList.toggle(
                    "maximized"
                );

                focusWindow(
                    windowElement
                );
            }
        );

    windowElement
        .addEventListener(
            "mousedown",
            () => focusWindow(windowElement)
        );

    return windowElement;
}


/* =========================================================
   FOCUS WINDOW
========================================================= */

function focusWindow(
    windowElement
) {

    highestZIndex++;

    windowElement.style.zIndex =
        highestZIndex;

    windowElement.classList.remove(
        "minimized"
    );

    updateTaskbar();
}


/* =========================================================
   MINIMIZE WINDOW
========================================================= */

function minimizeWindow(
    windowElement
) {

    windowElement.style.display =
        "none";

    updateTaskbar();
}


/* =========================================================
   CLOSE APP
========================================================= */

function closeApp(appName) {

    const windowElement =
        openWindows[appName];

    if (!windowElement) {
        return;
    }

    if (appName === "paint") {

        if (paintState) {
            paintState = null;
        }
    }

    if (appName === "game") {

        stopGame();
    }

    windowElement.remove();

    delete openWindows[appName];

    updateTaskbar();
}


/* =========================================================
   CLOSE EVERYTHING
========================================================= */

function closeAllWindows() {

    Object.keys(openWindows)
        .forEach(
            closeApp
        );
}


/* =========================================================
   TASKBAR
========================================================= */

function updateTaskbar() {

    const container =
        $("taskbarApps");

    container.innerHTML = "";

    Object.keys(openWindows)
        .forEach(
            appName => {

                const info =
                    APP_INFO[appName];

                const button =
                    document.createElement(
                        "button"
                    );

                button.className =
                    "taskbar-app";

                button.innerHTML = `
                    <span>${info.icon}</span>
                    <span>${escapeHTML(info.title)}</span>
                `;

                button.addEventListener(
                    "click",
                    () => {

                        const windowElement =
                            openWindows[appName];

                        if (
                            windowElement.style.display ===
                            "none"
                        ) {

                            windowElement.style.display =
                                "flex";
                        }

                        focusWindow(
                            windowElement
                        );
                    }
                );

                container.appendChild(
                    button
                );
            }
        );
}


/* =========================================================
   APP BUILDER
========================================================= */

function buildApp(
    appName,
    body
) {

    switch (appName) {

        case "notepad":
            buildNotepad(body);
            break;

        case "calculator":
            buildCalculator(body);
            break;

        case "files":
            buildFileManager(body);
            break;

        case "paint":
            buildPaint(body);
            break;

        case "game":
            buildGame(body);
            break;

        case "settings":
            buildSettings(body);
            break;

        case "about":
            buildAbout(body);
            break;
    }
}


/* =========================================================
   NOTEPAD
========================================================= */

function buildNotepad(body) {

    body.innerHTML = `

        <div class="notepad-body">

            <div class="notepad-toolbar">

                <button
                    class="small-button"
                    id="saveNoteButton"
                >
                    💾 Save
                </button>

                <button
                    class="small-button"
                    id="clearNoteButton"
                >
                    🗑️ Clear
                </button>

                <span
                    id="noteStatus"
                    style="
                        margin-left:auto;
                        color:#7f899d;
                        font-size:12px;
                        padding-top:7px;
                    "
                >
                    Saved
                </span>

            </div>

            <textarea
                id="notepadText"
                class="notepad-textarea"
                placeholder="Start typing..."
            ></textarea>

        </div>

    `;

    const textarea =
        body.querySelector(
            "#notepadText"
        );

    textarea.value =
        currentAccount.notes || "";

    const saveNote =
        () => {

            currentAccount.notes =
                textarea.value;

            saveCurrentAccount();

            body.querySelector(
                "#noteStatus"
            ).textContent =
                "Saved";

            showToast(
                "Notepad",
                "Your note was saved."
            );
        };

    body.querySelector(
        "#saveNoteButton"
    )
        .addEventListener(
            "click",
            saveNote
        );

    body.querySelector(
        "#clearNoteButton"
    )
        .addEventListener(
            "click",
            () => {

                textarea.value = "";

                currentAccount.notes = "";

                saveCurrentAccount();

                body.querySelector(
                    "#noteStatus"
                ).textContent =
                    "Saved";
            }
        );

    textarea.addEventListener(
        "input",
        () => {

            currentAccount.notes =
                textarea.value;

            saveCurrentAccount();

            body.querySelector(
                "#noteStatus"
            ).textContent =
                "Auto-saved";
        }
    );
}


/* =========================================================
   CALCULATOR
========================================================= */

function buildCalculator(body) {

    calculatorValue = "0";

    body.innerHTML = `

        <div class="calculator">

            <div
                id="calcDisplay"
                class="calc-display"
            >
                0
            </div>

            <div class="calc-grid">

                <button class="calc-button clear" data-calc="C">
                    C
                </button>

                <button class="calc-button" data-calc="(">
                    (
                </button>

                <button class="calc-button" data-calc=")">
                    )
                </button>

                <button class="calc-button operator" data-calc="/">
                    ÷
                </button>

                <button class="calc-button" data-calc="7">
                    7
                </button>

                <button class="calc-button" data-calc="8">
                    8
                </button>

                <button class="calc-button" data-calc="9">
                    9
                </button>

                <button class="calc-button operator" data-calc="*">
                    ×
                </button>

                <button class="calc-button" data-calc="4">
                    4
                </button>

                <button class="calc-button" data-calc="5">
                    5
                </button>

                <button class="calc-button" data-calc="6">
                    6
                </button>

                <button class="calc-button operator" data-calc="-">
                    −
                </button>

                <button class="calc-button" data-calc="1">
                    1
                </button>

                <button class="calc-button" data-calc="2">
                    2
                </button>

                <button class="calc-button" data-calc="3">
                    3
                </button>

                <button class="calc-button operator" data-calc="+">
                    +
                </button>

                <button class="calc-button" data-calc="0">
                    0
                </button>

                <button class="calc-button" data-calc=".">
                    .
                </button>

                <button class="calc-button" data-calc="%">
                    %
                </button>

                <button class="calc-button equals" data-calc="=">
                    =
                </button>

            </div>

        </div>

    `;

    const display =
        body.querySelector(
            "#calcDisplay"
        );

    body.querySelectorAll(
        "[data-calc]"
    )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        calculatorInput(
                            button.dataset.calc,
                            display
                        );
                    }
                );
            }
        );
}


function calculatorInput(
    value,
    display
) {

    if (value === "C") {

        calculatorValue = "0";

        display.textContent =
            calculatorValue;

        return;
    }

    if (value === "=") {

        try {

            const expression =
                calculatorValue
                    .replace(
                        /%/g,
                        "/100"
                    );

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

            if (
                !Number.isFinite(result)
            ) {

                throw new Error();
            }

            calculatorValue =
                String(result);

        } catch {

            calculatorValue =
                "Error";
        }

        display.textContent =
            calculatorValue;

        return;
    }

    if (calculatorValue === "Error") {

        calculatorValue = "0";
    }

    if (
        calculatorValue === "0" &&
        /[0-9]/.test(value)
    ) {

        calculatorValue = value;

    } else {

        calculatorValue += value;
    }

    display.textContent =
        calculatorValue;
}


/* =========================================================
   FILE MANAGER
========================================================= */

function buildFileManager(body) {

    renderFileManager(body);
}


function renderFileManager(body) {

    const files =
        currentAccount.files || {};

    const fileNames =
        Object.keys(files);

    body.innerHTML = `

        <div>

            <div class="file-toolbar">

                <button
                    class="small-button"
                    id="newFileButton"
                >
                    ➕ New File
                </button>

                <button
                    class="small-button"
                    id="refreshFilesButton"
                >
                    🔄 Refresh
                </button>

            </div>

            <div
                id="fileList"
                class="file-list"
            >

                ${
                    fileNames.length
                    ? fileNames.map(
                        createFileHTML
                    ).join("")
                    : `
                        <div
                            style="
                                text-align:center;
                                color:#788196;
                                padding:40px;
                            "
                        >
                            No files yet.
                        </div>
                    `
                }

            </div>

        </div>

    `;

    body.querySelector(
        "#newFileButton"
    )
        .addEventListener(
            "click",
            () => {

                const name =
                    prompt(
                        "Enter a file name:"
                    );

                if (!name) {
                    return;
                }

                const cleanName =
                    name.trim();

                if (!cleanName) {
                    return;
                }

                if (
                    currentAccount.files[
                        cleanName
                    ] !== undefined
                ) {

                    showToast(
                        "File Manager",
                        "A file with that name already exists."
                    );

                    return;
                }

                currentAccount.files[
                    cleanName
                ] = "";

                saveCurrentAccount();

                renderFileManager(body);

                showToast(
                    "File created",
                    cleanName
                );
            }
        );

    body.querySelector(
        "#refreshFilesButton"
    )
        .addEventListener(
            "click",
            () => {

                renderFileManager(body);

            }
        );

    body.querySelectorAll(
        "[data-file-open]"
    )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openTextFile(
                            button.dataset.fileOpen,
                            body
                        );
                    }
                );
            }
        );

    body.querySelectorAll(
        "[data-file-delete]"
    )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteFile(
                            button.dataset.fileDelete,
                            body
                        );
                    }
                );
            }
        );
}


function createFileHTML(
    name
) {

    const content =
        currentAccount.files[name] || "";

    const size =
        new Blob([content]).size;

    return `

        <div class="file-item">

            <div class="file-item-left">

                <span class="file-icon">
                    📄
                </span>

                <div>

                    <div class="file-name">
                        ${escapeHTML(name)}
                    </div>

                    <div class="file-size">
                        ${size} bytes
                    </div>

                </div>

            </div>

            <div class="file-actions">

                <button
                    class="small-button"
                    data-file-open="${escapeHTML(name)}"
                >
                    Open
                </button>

                <button
                    class="small-button"
                    data-file-delete="${escapeHTML(name)}"
                >
                    Delete
                </button>

            </div>

        </div>

    `;
}


function openTextFile(
    name,
    fileManagerBody
) {

    const currentContent =
        currentAccount.files[name] || "";

    fileManagerBody.innerHTML = `

        <div class="notepad-body">

            <div class="notepad-toolbar">

                <button
                    class="small-button"
                    id="backFilesButton"
                >
                    ← Back
                </button>

                <button
                    class="small-button"
                    id="saveFileButton"
                >
                    💾 Save
                </button>

            </div>

            <textarea
                id="fileEditor"
                class="notepad-textarea"
            ></textarea>

        </div>

    `;

    const editor =
        fileManagerBody.querySelector(
            "#fileEditor"
        );

    editor.value =
        currentContent;

    fileManagerBody.querySelector(
        "#backFilesButton"
    )
        .addEventListener(
            "click",
            () => {

                renderFileManager(
                    fileManagerBody
                );
            }
        );

    fileManagerBody.querySelector(
        "#saveFileButton"
    )
        .addEventListener(
            "click",
            () => {

                currentAccount.files[name] =
                    editor.value;

                saveCurrentAccount();

                showToast(
                    "File saved",
                    name
                );
            }
        );
}


function deleteFile(
    name,
    body
) {

    if (
        !confirm(
            `Delete "${name}"?`
        )
    ) {

        return;
    }

    delete currentAccount.files[
        name
    ];

    saveCurrentAccount();

    renderFileManager(body);

    showToast(
        "File deleted",
        name
    );
}


/* =========================================================
   PAINT
========================================================= */

function buildPaint(body) {

    body.innerHTML = `

        <div class="paint-container">

            <div class="paint-toolbar">

                <button
                    id="clearPaint"
                    class="small-button"
                >
                    🗑️ Clear
                </button>

                <button
                    id="savePaint"
                    class="small-button"
                >
                    💾 Save PNG
                </button>

                <label>
                    Color
                    <input
                        id="paintColor"
                        type="color"
                        value="#5b5ff7"
                    >
                </label>

                <label>
                    Size
                    <input
                        id="paintSize"
                        class="paint-size"
                        type="range"
                        min="1"
                        max="40"
                        value="5"
                    >
                </label>

            </div>

            <div class="paint-canvas-wrapper">

                <canvas id="paintCanvas"></canvas>

            </div>

        </div>

    `;

    const canvas =
        body.querySelector(
            "#paintCanvas"
        );

    const wrapper =
        body.querySelector(
            ".paint-canvas-wrapper"
        );

    function resizeCanvas() {

        const oldCanvas =
            document.createElement(
                "canvas"
            );

        oldCanvas.width =
            canvas.width;

        oldCanvas.height =
            canvas.height;

        const oldContext =
            oldCanvas.getContext(
                "2d"
            );

        if (
            canvas.width &&
            canvas.height
        ) {

            oldContext.drawImage(
                canvas,
                0,
                0
            );
        }

        canvas.width =
            wrapper.clientWidth;

        canvas.height =
            wrapper.clientHeight;

        const context =
            canvas.getContext(
                "2d"
            );

        context.fillStyle =
            "white";

        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if (
            oldCanvas.width &&
            oldCanvas.height
        ) {

            context.drawImage(
                oldCanvas,
                0,
                0,
                oldCanvas.width,
                oldCanvas.height,
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
    }

    resizeCanvas();

    let drawing = false;

    function getPosition(
        event
    ) {

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

    function startDrawing(event) {

        drawing = true;

        const position =
            getPosition(event);

        const context =
            canvas.getContext(
                "2d"
            );

        context.beginPath();

        context.moveTo(
            position.x,
            position.y
        );
    }

    function draw(event) {

        if (!drawing) {
            return;
        }

        const position =
            getPosition(event);

        const context =
            canvas.getContext(
                "2d"
            );

        context.lineWidth =
            Number(
                body.querySelector(
                    "#paintSize"
                ).value
            );

        context.lineCap =
            "round";

        context.strokeStyle =
            body.querySelector(
                "#paintColor"
            ).value;

        context.lineTo(
            position.x,
            position.y
        );

        context.stroke();
    }

    function stopDrawing() {

        drawing = false;
    }

    canvas.addEventListener(
        "pointerdown",
        startDrawing
    );

    canvas.addEventListener(
        "pointermove",
        draw
    );

    canvas.addEventListener(
        "pointerup",
        stopDrawing
    );

    canvas.addEventListener(
        "pointerleave",
        stopDrawing
    );

    body.querySelector(
        "#clearPaint"
    )
        .addEventListener(
            "click",
            () => {

                const context =
                    canvas.getContext(
                        "2d"
                    );

                context.fillStyle =
                    "white";

                context.fillRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            }
        );

    body.querySelector(
        "#savePaint"
    )
        .addEventListener(
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

                showToast(
                    "Paint",
                    "Your drawing was saved."
                );
            }
        );

    paintState = {
        canvas
    };
}


/* =========================================================
   CATCH NEXUS GAME
========================================================= */

function buildGame(body) {

    gameState = {

        running: false,

        score: 0,

        timeLeft: 30,

        interval: null,

        target: null

    };

    body.innerHTML = `

        <div class="game-container">

            <div class="game-info">

                <span>
                    Score:
                    <strong id="gameScore">
                        0
                    </strong>
                </span>

                <span>
                    Time:
                    <strong id="gameTime">
                        30
                    </strong>
                </span>

                <span>
                    Best:
                    <strong id="gameBest">
                        ${currentAccount.highScore || 0}
                    </strong>
                </span>

            </div>

            <div class="game-board">

                <button
                    id="gameTarget"
                    class="game-target"
                >
                    N
                </button>

            </div>

            <button
                id="gameStart"
                class="small-button game-start"
            >
                ▶ Start Game
            </button>

        </div>

    `;

    const target =
        body.querySelector(
            "#gameTarget"
        );

    gameState.target =
        target;

    target.addEventListener(
        "click",
        () => {

            if (!gameState.running) {
                return;
            }

            gameState.score++;

            body.querySelector(
                "#gameScore"
            ).textContent =
                gameState.score;

            moveGameTarget(
                body
            );
        }
    );

    body.querySelector(
        "#gameStart"
    )
        .addEventListener(
            "click",
            () => startGame(body)
        );
}


function startGame(body) {

    stopGame();

    gameState = {

        running: true,

        score: 0,

        timeLeft: 30,

        interval: null,

        target:
            body.querySelector(
                "#gameTarget"
            )
    };

    body.querySelector(
        "#gameScore"
    ).textContent = "0";

    body.querySelector(
        "#gameTime"
    ).textContent = "30";

    gameState.target.style.display =
        "flex";

    moveGameTarget(body);

    gameState.interval =
        setInterval(
            () => {

                gameState.timeLeft--;

                body.querySelector(
                    "#gameTime"
                ).textContent =
                    gameState.timeLeft;

                if (
                    gameState.timeLeft <= 0
                ) {

                    endGame(body);
                }

            },
            1000
        );
}


function moveGameTarget(body) {

    const board =
        body.querySelector(
            ".game-board"
        );

    const target =
        gameState.target;

    const maxX =
        Math.max(
            0,
            board.clientWidth -
            target.offsetWidth
        );

    const maxY =
        Math.max(
            0,
            board.clientHeight -
            target.offsetHeight
        );

    target.style.left =
        Math.random() * maxX +
        "px";

    target.style.top =
        Math.random() * maxY +
        "px";
}


function endGame(body) {

    if (!gameState) {
        return;
    }

    clearInterval(
        gameState.interval
    );

    gameState.running =
        false;

    gameState.target.style.display =
        "none";

    if (
        gameState.score >
        (currentAccount.highScore || 0)
    ) {

        currentAccount.highScore =
            gameState.score;

        saveCurrentAccount();

        body.querySelector(
            "#gameBest"
        ).textContent =
            gameState.score;

        showToast(
            "New High Score!",
            `${gameState.score} points`
        );

    } else {

        showToast(
            "Game Over",
            `You scored ${gameState.score}.`
        );
    }
}


function stopGame() {

    if (!gameState) {
        return;
    }

    if (gameState.interval) {

        clearInterval(
            gameState.interval
        );
    }

    if (gameState.target) {

        gameState.target.style.display =
            "none";
    }

    gameState.running =
        false;
}


/* =========================================================
   SETTINGS
========================================================= */

function buildSettings(body) {

    body.innerHTML = `

        <div>

            <div class="settings-section">

                <h3>
                    👤 Account
                </h3>

                <div class="settings-row">

                    <div>

                        <div class="settings-label">
                            Username
                        </div>

                        <div class="settings-description">
                            Your NEXUS account name
                        </div>

                    </div>

                    <input
                        id="settingsUsername"
                        class="settings-input"
                        maxlength="24"
                        value="${escapeHTML(
                            currentAccount.username
                        )}"
                    >

                </div>

                <button
                    id="saveUsername"
                    class="small-button"
                >
                    Save Username
                </button>

            </div>


            <div class="settings-section">

                <h3>
                    🎨 Appearance
                </h3>

                <div class="settings-row">

                    <div>

                        <div class="settings-label">
                            Theme
                        </div>

                        <div class="settings-description">
                            Choose your interface theme
                        </div>

                    </div>

                    <select
                        id="themeSelect"
                        class="settings-select"
                    >

                        <option
                            value="dark"
                            ${
                                currentAccount.theme ===
                                "dark"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Dark
                        </option>

                        <option
                            value="light"
                            ${
                                currentAccount.theme ===
                                "light"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Light
                        </option>

                    </select>

                </div>


                <div class="settings-row">

                    <div>

                        <div class="settings-label">
                            Wallpaper
                        </div>

                        <div class="settings-description">
                            Choose your desktop style
                        </div>

                    </div>

                    <select
                        id="wallpaperSelect"
                        class="settings-select"
                    >

                        <option value="default">
                            NEXUS Default
                        </option>

                        <option
                            value="blue"
                            ${
                                currentAccount.wallpaper ===
                                "blue"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Blue
                        </option>

                        <option
                            value="purple"
                            ${
                                currentAccount.wallpaper ===
                                "purple"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Purple
                        </option>

                        <option
                            value="green"
                            ${
                                currentAccount.wallpaper ===
                                "green"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Green
                        </option>

                        <option
                            value="sunset"
                            ${
                                currentAccount.wallpaper ===
                                "sunset"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Sunset
                        </option>

                    </select>

                </div>

            </div>


            <div class="settings-section">

                <h3>
                    💾 Account Data
                </h3>

                <p class="settings-description">

                    Your notes, files, settings,
                    and game score are stored
                    separately for this account
                    in this browser.

                </p>

                <button
                    id="logoutSettings"
                    class="small-button"
                >
                    🚪 Sign Out
                </button>

            </div>


            <div class="settings-section">

                <h3>
                    ⚠️ Danger Zone
                </h3>

                <p class="settings-description">

                    Deleting your account permanently
                    removes its local NEXUS data
                    from this browser.

                </p>

                <button
                    id="deleteAccount"
                    class="danger-button"
                >
                    🗑️ Delete This Account
                </button>

            </div>

        </div>

    `;


    body.querySelector(
        "#saveUsername"
    )
        .addEventListener(
            "click",
            () => {

                const input =
                    body.querySelector(
                        "#settingsUsername"
                    );

                const newUsername =
                    input.value.trim();

                if (
                    newUsername.length < 3
                ) {

                    showToast(
                        "Settings",
                        "Username is too short."
                    );

                    return;
                }

                const existing =
                    findAccountByUsername(
                        newUsername
                    );

                if (
                    existing &&
                    existing.id !==
                    currentAccount.id
                ) {

                    showToast(
                        "Settings",
                        "That username is already taken."
                    );

                    return;
                }

                currentAccount.username =
                    newUsername;

                saveCurrentAccount();

                updateUserUI();

                showToast(
                    "Settings",
                    "Username updated."
                );
            }
        );


    body.querySelector(
        "#themeSelect"
    )
        .addEventListener(
            "change",
            event => {

                currentAccount.theme =
                    event.target.value;

                saveCurrentAccount();

                applyAccountSettings();

                showToast(
                    "Theme changed",
                    `Theme: ${event.target.value}`
                );
            }
        );


    body.querySelector(
        "#wallpaperSelect"
    )
        .addEventListener(
            "change",
            event => {

                currentAccount.wallpaper =
                    event.target.value;

                saveCurrentAccount();

                applyAccountSettings();

                showToast(
                    "Wallpaper changed",
                    "Your desktop has been updated."
                );
            }
        );


    body.querySelector(
        "#logoutSettings"
    )
        .addEventListener(
            "click",
            logout
        );


    body.querySelector(
        "#deleteAccount"
    )
        .addEventListener(
            "click",
            deleteCurrentAccount
        );
}


/* =========================================================
   DELETE ACCOUNT
========================================================= */

async function deleteCurrentAccount() {

    if (!currentAccount) {
        return;
    }

    const firstConfirm =
        confirm(
            `Delete the account "${currentAccount.username}"?`
        );

    if (!firstConfirm) {
        return;
    }

    const password =
        prompt(
            "Enter your password to confirm account deletion:"
        );

    if (password === null) {
        return;
    }

    const passwordHash =
        await hashPassword(password);

    if (
        passwordHash !==
        currentAccount.passwordHash
    ) {

        showToast(
            "Account deletion",
            "Incorrect password."
        );

        return;
    }

    const accounts =
        getAccounts();

    delete accounts[
        currentAccount.id
    ];

    saveAccounts(accounts);

    clearSession();

    currentAccount = null;

    closeAllWindows();

    showAuth();

    showToast(
        "Account deleted",
        "The local account has been removed."
    );
}


/* =========================================================
   ABOUT
========================================================= */

function buildAbout(body) {

    body.innerHTML = `

        <div class="about">

            <div class="nexus-logo-large about-logo">
                N
            </div>

            <h2>
                NEXUS
            </h2>

            <div class="about-version">
                Version 1.2
            </div>

            <div class="about-card">

                <p>
                    NEXUS is a browser-based
                    operating environment built
                    with HTML, CSS and JavaScript.
                </p>

                <p>
                    It includes a desktop,
                    applications, local accounts,
                    file storage, settings,
                    games and more.
                </p>

            </div>

            <div class="about-card">

                <strong>
                    Current User
                </strong>

                <p>
                    ${escapeHTML(
                        currentAccount.username
                    )}
                </p>

            </div>

            <div class="about-card">

                <strong>
                    System
                </strong>

                <p>
                    NEXUS v1.2
                    <br>
                    Browser Environment
                    <br>
                    Local Storage System
                </p>

            </div>

        </div>

    `;
}


/* =========================================================
   EVENT LISTENERS
========================================================= */


/* Login */

$("loginForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await login(
                $("loginUsername").value,
                $("loginPassword").value
            );
        }
    );


/* Sign Up */

$("signupForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await createAccount(
                $("signupUsername").value,
                $("signupPassword").value,
                $("signupConfirm").value
            );
        }
    );


/* Switch Auth Panels */

$("showSignup")
    .addEventListener(
        "click",
        showSignupPanel
    );


$("showLogin")
    .addEventListener(
        "click",
        showLoginPanel
    );


/* Start Button */

$("startButton")
    .addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleStartMenu();
        }
    );


/* Start Logout */

$("startLogout")
    .addEventListener(
        "click",
        logout
    );


/* Desktop App Icons */

qsa(
    ".desktop-icon"
)
    .forEach(
        button => {

            button.addEventListener(
                "dblclick",
                () => {

                    openApp(
                        button.dataset.app
                    );
                }
            );

            /*
               Single click also works so mobile
               devices can open applications.
            */

            button.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <=
                        650
                    ) {

                        openApp(
                            button.dataset.app
                        );
                    }
                }
            );
        }
    );


/* Start Menu Apps */

qsa(
    ".start-apps button"
)
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    openApp(
                        button.dataset.app
                    );
                }
            );
        }
    );


/* Close Start Menu when clicking desktop */

$("desktop")
    .addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    "#startMenu"
                ) &&
                !event.target.closest(
                    "#startButton"
                )
            ) {

                closeStartMenu();
            }
        }
    );


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
           Escape closes the Start menu.
        */

        if (
            event.key ===
            "Escape"
        ) {

            closeStartMenu();
        }

        /*
           Ctrl + Alt + N opens Notepad.
        */

        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "n"
        ) {

            event.preventDefault();

            if (currentAccount) {
                openApp("notepad");
            }
        }

        /*
           Ctrl + Alt + C opens Calculator.
        */

        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "c"
        ) {

            event.preventDefault();

            if (currentAccount) {
                openApp("calculator");
            }
        }
    }
);


/* =========================================================
   START SYSTEM
========================================================= */

bootNexus();
