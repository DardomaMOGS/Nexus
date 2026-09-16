/* =========================================================
   NEXUS v1.2
   COMPLETE FIREBASE-FREE SYSTEM
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const ACCOUNTS_KEY = "nexus_v12_accounts";
const SESSION_KEY = "nexus_v12_session";


/* =========================================================
   GLOBAL STATE
========================================================= */

let accounts = {};
let currentUser = null;

let selectedFile = null;

let calculatorValue = "";

let saveNotesTimer = null;

let notificationTimer = null;

let gameScore = 0;
let gameRunning = false;
let gameTimer = null;


/* =========================================================
   HELPERS
========================================================= */

const $ = id => document.getElementById(id);

const qsa = selector =>
  document.querySelectorAll(selector);


function saveAccounts() {
  localStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify(accounts)
  );
}


function loadAccounts() {

  try {

    accounts =
      JSON.parse(
        localStorage.getItem(ACCOUNTS_KEY)
      ) || {};

  } catch {

    accounts = {};

  }

}


function createID() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2)
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

    const encoder =
      new TextEncoder();

    const data =
      encoder.encode(password);

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


  /* Fallback */

  let hash = 0;

  for (
    let i = 0;
    i < password.length;
    i++
  ) {

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
   DEFAULT FILES
========================================================= */

function defaultFiles(username) {

  return {

    "Welcome.txt":
      `Welcome to NEXUS v1.2!

Hello ${username}!

This is your personal NEXUS desktop.

Everything stored here belongs to this browser account.`,

    "About.txt":
      `NEXUS v1.2

A browser-based mini operating system.

Apps:
- Notepad
- Calculator
- File Manager
- Paint
- Catch NEXUS
- Settings`,

    "Ideas.txt":
      `NEXUS Ideas

1. More games
2. More apps
3. Better wallpapers
4. More customization
5. Future NEXUS versions`

  };

}


/* =========================================================
   BOOT
========================================================= */

function boot() {

  let progress = 0;

  const interval =
    setInterval(() => {

      progress += 5;

      $("bootProgress").style.width =
        progress + "%";

      if (progress < 35) {

        $("bootStatus").textContent =
          "Checking system...";

      } else if (progress < 65) {

        $("bootStatus").textContent =
          "Loading NEXUS core...";

      } else if (progress < 90) {

        $("bootStatus").textContent =
          "Preparing desktop...";

      } else {

        $("bootStatus").textContent =
          "Ready.";

      }

      if (progress >= 100) {

        clearInterval(interval);

        setTimeout(() => {

          $("bootScreen")
            .classList
            .add("hidden");

          restoreSession();

        }, 350);

      }

    }, 35);

}


/* =========================================================
   AUTH SCREEN
========================================================= */

function showLogin() {

  $("loginPanel")
    .classList
    .remove("hidden");

  $("signupPanel")
    .classList
    .add("hidden");

  $("loginError").textContent = "";
  $("signupError").textContent = "";

}


function showSignup() {

  $("loginPanel")
    .classList
    .add("hidden");

  $("signupPanel")
    .classList
    .remove("hidden");

  $("loginError").textContent = "";
  $("signupError").textContent = "";

}


/* =========================================================
   SIGN UP
========================================================= */

async function signup() {

  const username =
    $("signupUsername")
      .value
      .trim();

  const password =
    $("signupPassword")
      .value;

  const confirm =
    $("signupPasswordConfirm")
      .value;


  $("signupError").textContent = "";


  if (!username) {

    $("signupError").textContent =
      "Please choose a username.";

    return;
  }


  if (username.length < 2) {

    $("signupError").textContent =
      "Username must be at least 2 characters.";

    return;
  }


  if (!/^[a-zA-Z0-9_ -]+$/.test(username)) {

    $("signupError").textContent =
      "Use letters, numbers, spaces or underscores.";

    return;
  }


  if (password.length < 6) {

    $("signupError").textContent =
      "Password must be at least 6 characters.";

    return;
  }


  if (password !== confirm) {

    $("signupError").textContent =
      "The passwords do not match.";

    return;
  }


  const usernameKey =
    username.toLowerCase();


  if (accounts[usernameKey]) {

    $("signupError").textContent =
      "That username is already taken.";

    return;
  }


  const passwordHash =
    await hashPassword(password);


  accounts[usernameKey] = {

    id: createID(),

    username: username,

    passwordHash: passwordHash,

    createdAt: Date.now(),

    theme: "dark",

    wallpaper: "default",

    notes: "",

    files: defaultFiles(username),

    highScore: 0

  };


  saveAccounts();


  localStorage.setItem(
    SESSION_KEY,
    usernameKey
  );


  $("signupUsername").value = "";
  $("signupPassword").value = "";
  $("signupPasswordConfirm").value = "";


  loginUser(usernameKey);

}


/* =========================================================
   LOGIN
========================================================= */

async function login() {

  const username =
    $("loginUsername")
      .value
      .trim();

  const password =
    $("loginPassword")
      .value;


  $("loginError").textContent = "";


  if (!username || !password) {

    $("loginError").textContent =
      "Enter your username and password.";

    return;
  }


  const key =
    username.toLowerCase();


  const account =
    accounts[key];


  if (!account) {

    $("loginError").textContent =
      "No NEXUS account was found.";

    return;
  }


  const passwordHash =
    await hashPassword(password);


  if (
    passwordHash !==
    account.passwordHash
  ) {

    $("loginError").textContent =
      "Incorrect password.";

    return;
  }


  localStorage.setItem(
    SESSION_KEY,
    key
  );


  $("loginPassword").value = "";


  loginUser(key);

}


/* =========================================================
   LOGIN USER
========================================================= */

function loginUser(usernameKey) {

  currentUser =
    accounts[usernameKey];


  if (!currentUser) {

    showLogin();

    return;
  }


  $("authScreen")
    .classList
    .add("hidden");


  $("desktop")
    .classList
    .remove("hidden");


  applyUserSettings();

  renderFiles();

  showNotification(
    "NEXUS Ready",
    `Welcome, ${currentUser.username}!`
  );

}


/* =========================================================
   RESTORE SESSION
========================================================= */

function restoreSession() {

  loadAccounts();


  const session =
    localStorage.getItem(
      SESSION_KEY
    );


  if (
    session &&
    accounts[session]
  ) {

    loginUser(session);

  } else {

    $("authScreen")
      .classList
      .remove("hidden");

    showLogin();

  }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem(
    SESSION_KEY
  );


  currentUser = null;


  closeAllWindows();


  $("desktop")
    .classList
    .add("hidden");


  $("authScreen")
    .classList
    .remove("hidden");


  $("loginUsername").value = "";
  $("loginPassword").value = "";


  showLogin();


  showNotification(
    "Logged Out",
    "You have been logged out of NEXUS."
  );

}


/* =========================================================
   SAVE CURRENT USER
========================================================= */

function saveCurrentUser() {

  if (!currentUser) return;


  const key =
    currentUser.username.toLowerCase();


  accounts[key] =
    currentUser;


  saveAccounts();

}


/* =========================================================
   USER SETTINGS
========================================================= */

function applyUserSettings() {

  if (!currentUser) return;


  $("settingsUsername")
    .textContent =
    currentUser.username;


  $("settingsAccountInfo")
    .textContent =
    "Local NEXUS account";


  $("startUsername")
    .textContent =
    currentUser.username;


  applyTheme(
    currentUser.theme || "dark"
  );


  applyWallpaper(
    currentUser.wallpaper || "default"
  );


  $("notesArea").value =
    currentUser.notes || "";

}


/* =========================================================
   THEME
========================================================= */

function applyTheme(theme) {

  if (theme === "light") {

    document.body
      .classList
      .add("light-theme");

  } else {

    document.body
      .classList
      .remove("light-theme");

  }

}


$("darkThemeButton")
  .addEventListener(
    "click",
    () => {

      if (!currentUser) return;

      currentUser.theme = "dark";

      applyTheme("dark");

      saveCurrentUser();

      showNotification(
        "Theme Changed",
        "Dark theme enabled."
      );

    }
  );


$("lightThemeButton")
  .addEventListener(
    "click",
    () => {

      if (!currentUser) return;

      currentUser.theme = "light";

      applyTheme("light");

      saveCurrentUser();

      showNotification(
        "Theme Changed",
        "Light theme enabled."
      );

    }
  );


/* =========================================================
   WALLPAPER
========================================================= */

function applyWallpaper(name) {

  const wallpaper =
    $("wallpaper");


  wallpaper.className =
    "wallpaper";


  if (
    name &&
    name !== "default"
  ) {

    wallpaper.classList.add(name);

  }

}


qsa("[data-wallpaper]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (!currentUser) return;

        const wallpaper =
          button.dataset.wallpaper;


        currentUser.wallpaper =
          wallpaper;


        applyWallpaper(wallpaper);

        saveCurrentUser();


        showNotification(
          "Wallpaper Changed",
          "Your wallpaper has been updated."
        );

      }
    );

  });


/* =========================================================
   DELETE ACCOUNT
========================================================= */

$("deleteAccountButton")
  .addEventListener(
    "click",
    () => {

      if (!currentUser) return;


      const confirmed =
        confirm(
          `Delete the NEXUS account "${currentUser.username}"? This cannot be undone.`
        );


      if (!confirmed) return;


      const key =
        currentUser.username.toLowerCase();


      delete accounts[key];


      saveAccounts();


      localStorage.removeItem(
        SESSION_KEY
      );


      currentUser = null;


      closeAllWindows();


      $("desktop")
        .classList
        .add("hidden");


      $("authScreen")
        .classList
        .remove("hidden");


      showLogin();


      showNotification(
        "Account Deleted",
        "Your local NEXUS account was deleted."
      );

    }
  );


/* =========================================================
   OPEN APP
========================================================= */

function openApp(appID) {

  const windowElement =
    $(appID);


  if (!windowElement) return;


  qsa(".app-window")
    .forEach(win => {

      win.classList.remove("open");

    });


  windowElement
    .classList
    .add("open");


  $("startMenu")
    .classList
    .add("hidden");


  updateTaskbar();

}


/* =========================================================
   CLOSE APP
========================================================= */

function closeApp(windowElement) {

  if (!windowElement) return;


  windowElement
    .classList
    .remove("open");


  updateTaskbar();

}


function closeAllWindows() {

  qsa(".app-window")
    .forEach(win => {

      win.classList.remove("open");

    });


  updateTaskbar();

}


/* =========================================================
   DESKTOP ICONS
========================================================= */

qsa("[data-app]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openApp(
          button.dataset.app
        );

      }
    );

  });


/* =========================================================
   WINDOW CONTROLS
========================================================= */

qsa(".close-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        closeApp(
          button.closest(".app-window")
        );

      }
    );

  });


qsa(".minimize-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const win =
          button.closest(
            ".app-window"
          );


        win.classList.remove(
          "open"
        );


        updateTaskbar();

      }
    );

  });


/* =========================================================
   TASKBAR
========================================================= */

function updateTaskbar() {

  const container =
    $("taskbarApps");


  container.innerHTML = "";


  qsa(".app-window.open")
    .forEach(win => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "taskbar-app";


      const title =
        win.querySelector(
          ".window-header span"
        );


      button.textContent =
        title
          ? title.textContent
          : "App";


      button.onclick = () => {

        win.classList.toggle(
          "open"
        );

        updateTaskbar();

      };


      container.appendChild(button);

    });

}


/* =========================================================
   START MENU
========================================================= */

$("startButton")
  .addEventListener(
    "click",
    () => {

      $("startMenu")
        .classList
        .toggle("hidden");

    }
  );


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

  const now =
    new Date();


  const hours =
    String(
      now.getHours()
    ).padStart(2, "0");


  const minutes =
    String(
      now.getMinutes()
    ).padStart(2, "0");


  $("clock").textContent =
    `${hours}:${minutes}`;

}


setInterval(
  updateClock,
  1000
);

updateClock();


/* =========================================================
   NOTEPAD
========================================================= */

$("notesArea")
  .addEventListener(
    "input",
    () => {

      if (!currentUser) return;


      $("notesStatus")
        .textContent =
        "Saving...";


      clearTimeout(
        saveNotesTimer
      );


      saveNotesTimer =
        setTimeout(
          () => {

            currentUser.notes =
              $("notesArea").value;


            saveCurrentUser();


            $("notesStatus")
              .textContent =
              "Saved";

          },
          500
        );

    }
  );


$("clearNotesButton")
  .addEventListener(
    "click",
    () => {

      if (!currentUser) return;


      $("notesArea").value =
        "";


      currentUser.notes =
        "";


      saveCurrentUser();


      $("notesStatus")
        .textContent =
        "Saved";

    }
  );


/* =========================================================
   CALCULATOR
========================================================= */

qsa("[data-calc]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const value =
          button.dataset.calc;


        if (
          value === "clear"
        ) {

          calculatorValue = "";

        }


        else if (
          value === "backspace"
        ) {

          calculatorValue =
            calculatorValue.slice(
              0,
              -1
            );

        }


        else if (
          value === "="
        ) {

          try {

            if (
              !/^[0-9+\-*/().\s]+$/
                .test(
                  calculatorValue
                )
            ) {

              throw new Error();

            }


            calculatorValue =
              String(
                Function(
                  `"use strict"; return (${calculatorValue})`
                )()
              );


          } catch {

            calculatorValue =
              "Error";

          }

        }


        else {

          if (
            calculatorValue ===
            "Error"
          ) {

            calculatorValue = "";

          }


          calculatorValue +=
            value;

        }


        $("calculatorDisplay")
          .value =
          calculatorValue;

      }
    );

  });


/* =========================================================
   FILE MANAGER
========================================================= */

function renderFiles() {

  if (!currentUser) return;


  const list =
    $("fileList");


  list.innerHTML = "";


  const files =
    currentUser.files || {};


  Object.keys(files)
    .forEach(filename => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "file-item";


      item.textContent =
        `📄 ${filename}`;


      item.addEventListener(
        "click",
        () => {

          selectedFile =
            filename;


          $("fileEditor")
            .value =
            files[filename];


          qsa(".file-item")
            .forEach(
              element =>
                element.classList
                  .remove("selected")
            );


          item.classList
            .add("selected");

        }
      );


      list.appendChild(item);

    });

}


/* =========================================================
   NEW FILE
========================================================= */

$("newFileButton")
  .addEventListener(
    "click",
    () => {

      if (!currentUser) return;


      const filename =
        prompt(
          "Enter a name for your new file:"
        );


      if (!filename) return;


      const cleanName =
        filename.trim();


      if (!cleanName) return;


      if (
        currentUser.files[
          cleanName
        ]
        !== undefined
      ) {

        showNotification(
          "File Exists",
          "A file with that name already exists."
        );

        return;

      }


      currentUser.files[
        cleanName
      ] = "";


      selectedFile =
        cleanName;


      $("fileEditor")
        .value =
        "";


      saveCurrentUser();

      renderFiles();


      showNotification(
        "File Created",
        cleanName
      );

    }
  );


/* =========================================================
   SAVE FILE
========================================================= */

$("saveFileButton")
  .addEventListener(
    "click",
    () => {

      if (!currentUser) return;


      if (!selectedFile) {

        showNotification(
          "No File Selected",
          "Choose a file first."
        );

        return;

      }


      currentUser.files[
        selectedFile
      ] =
        $("fileEditor").value;


      saveCurrentUser();


      renderFiles();


      showNotification(
        "File Saved",
        selectedFile
      );

    }
  );


/* =========================================================
   DELETE FILE
========================================================= */

$("deleteFileButton")
  .addEventListener(
    "click",
    () => {

      if (!currentUser) return;


      if (!selectedFile) {

        showNotification(
          "No File Selected",
          "Choose a file first."
        );

        return;

      }


      const confirmed =
        confirm(
          `Delete "${selectedFile}"?`
        );


      if (!confirmed) return;


      delete currentUser.files[
        selectedFile
      ];


      selectedFile = null;


      $("fileEditor")
        .value =
        "";


      saveCurrentUser();

      renderFiles();


      showNotification(
        "File Deleted",
        "The file was removed."
      );

    }
  );


/* =========================================================
   PAINT
========================================================= */

const canvas =
  $("paintCanvas");


const ctx =
  canvas.getContext("2d");


let drawing = false;


function canvasPosition(event) {

  const rect =
    canvas.getBoundingClientRect();


  return {

    x:
      (event.clientX - rect.left) *
      (canvas.width / rect.width),

    y:
      (event.clientY - rect.top) *
      (canvas.height / rect.height)

  };

}


canvas.addEventListener(
  "pointerdown",
  event => {

    drawing = true;


    const pos =
      canvasPosition(event);


    ctx.beginPath();


    ctx.moveTo(
      pos.x,
      pos.y
    );

  }
);


canvas.addEventListener(
  "pointermove",
  event => {

    if (!drawing) return;


    const pos =
      canvasPosition(event);


    ctx.lineWidth =
      Number(
        $("brushSize").value
      );


    ctx.lineCap =
      "round";


    ctx.strokeStyle =
      "#000000";


    ctx.lineTo(
      pos.x,
      pos.y
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


canvas.addEventListener(
  "contextmenu",
  event =>
    event.preventDefault()
);


$("clearCanvasButton")
  .addEventListener(
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


$("saveDrawingButton")
  .addEventListener(
    "click",
    () => {

      const image =
        canvas.toDataURL(
          "image/png"
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        image;


      link.download =
        "nexus-drawing.png";


      link.click();

    }
  );


/* =========================================================
   CATCH NEXUS GAME
========================================================= */

function moveGameTarget() {

  const area =
    $("gameArea");


  const target =
    $("gameTarget");


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


$("gameTarget")
  .addEventListener(
    "click",
    () => {

      if (!gameRunning)
        return;


      gameScore++;


      $("gameScore")
        .textContent =
        gameScore;


      moveGameTarget();

    }
  );


$("startGameButton")
  .addEventListener(
    "click",
    () => {

      clearInterval(
        gameTimer
      );


      gameScore = 0;

      gameRunning = true;


      $("gameScore")
        .textContent =
        "0";


      $("gameTarget")
        .style
        .display =
        "block";


      $("gameMessage")
        .textContent =
        "";


      moveGameTarget();


      showNotification(
        "Game Started",
        "Catch the N!"
      );


      gameTimer =
        setInterval(
          () => {

            gameRunning = false;


            clearInterval(
              gameTimer
            );


            $("gameTarget")
              .style
              .display =
              "none";


            $("gameMessage")
              .textContent =
              `Time's up! Score: ${gameScore}`;


            if (
              currentUser &&
              gameScore >
              (currentUser.highScore || 0)
            ) {

              currentUser.highScore =
                gameScore;


              saveCurrentUser();


              showNotification(
                "New High Score!",
                `${gameScore} points!`
              );

            }

          },
          30000
        );

    }
  );


/* =========================================================
   LOGIN / SIGNUP BUTTONS
========================================================= */

$("loginButton")
  .addEventListener(
    "click",
    login
  );


$("signupButton")
  .addEventListener(
    "click",
    signup
  );


$("showSignupButton")
  .addEventListener(
    "click",
    showSignup
  );


$("showLoginButton")
  .addEventListener(
    "click",
    showLogin
  );


/* =========================================================
   ENTER KEY
========================================================= */

$("loginPassword")
  .addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        login();

      }

    }
  );


$("signupPasswordConfirm")
  .addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        signup();

      }

    }
  );


/* =========================================================
   LOGOUT BUTTONS
========================================================= */

$("logoutButton")
  .addEventListener(
    "click",
    logout
  );


$("startLogoutButton")
  .addEventListener(
    "click",
    logout
  );


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showNotification(
  title,
  message
) {

  $("notificationTitle")
    .textContent =
    title;


  $("notificationMessage")
    .textContent =
    message;


  $("notification")
    .classList
    .remove("hidden");


  clearTimeout(
    notificationTimer
  );


  notificationTimer =
    setTimeout(
      () => {

        $("notification")
          .classList
          .add("hidden");

      },
      3500
    );

}


/* =========================================================
   CLOSE START MENU WHEN CLICKING DESKTOP
========================================================= */

$("desktop")
  .addEventListener(
    "click",
    event => {

      if (
        event.target.closest(
          "#startButton"
        )
      ) return;


      if (
        event.target.closest(
          "#startMenu"
        )
      ) return;


      $("startMenu")
        .classList
        .add("hidden");

    }
  );


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      $("startMenu")
        .classList
        .add("hidden");

    }

  }
);


/* =========================================================
   START NEXUS
========================================================= */

loadAccounts();

boot();


console.log(
  "NEXUS v1.2 loaded successfully."
);

console.log(
  "Firebase-free local multi-account system active."
);
