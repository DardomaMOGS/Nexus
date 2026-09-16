/* =========================================================
   NEXUS v1.2
   COMPLETE FIREBASE-FREE SYSTEM
   Corrected authentication + stable initialization
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     STORAGE
  ========================================================= */

  const ACCOUNTS_KEY = "nexus_v12_accounts";
  const SESSION_KEY = "nexus_v12_session";

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


  function safeElement(id) {
    return $(id);
  }


  /* =========================================================
     STORAGE
  ========================================================= */

  function loadAccounts() {
    try {
      const saved = localStorage.getItem(ACCOUNTS_KEY);
      accounts = saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Could not load NEXUS accounts:", error);
      accounts = {};
    }
  }


  function saveAccounts() {
    try {
      localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify(accounts)
      );
    } catch (error) {
      console.error("Could not save NEXUS accounts:", error);
      showNotification(
        "Storage Error",
        "NEXUS could not save your account."
      );
    }
  }


  function createID() {
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
      window.crypto.subtle &&
      window.TextEncoder
    ) {

      try {

        const encoder = new TextEncoder();
        const data = encoder.encode(password);

        const hash = await window.crypto.subtle.digest(
          "SHA-256",
          data
        );

        return Array.from(
          new Uint8Array(hash)
        )
          .map(
            byte =>
              byte.toString(16).padStart(2, "0")
          )
          .join("");

      } catch (error) {
        console.warn(
          "Web Crypto unavailable. Using fallback hash."
        );
      }
    }


    let hash = 0;

    for (let i = 0; i < password.length; i++) {

      hash =
        (
          (hash << 5) -
          hash +
          password.charCodeAt(i)
        ) | 0;
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

    const bootScreen = $("bootScreen");

    if (!bootScreen) {
      restoreSession();
      return;
    }

    let progress = 0;

    const interval = setInterval(() => {

      progress += 5;

      const progressBar = $("bootProgress");
      const status = $("bootStatus");

      if (progressBar) {
        progressBar.style.width =
          progress + "%";
      }

      if (status) {

        if (progress < 35) {
          status.textContent =
            "Checking system...";

        } else if (progress < 65) {
          status.textContent =
            "Loading NEXUS core...";

        } else if (progress < 90) {
          status.textContent =
            "Preparing desktop...";

        } else {
          status.textContent =
            "Ready.";
        }
      }

      if (progress >= 100) {

        clearInterval(interval);

        setTimeout(() => {

          bootScreen.classList.add("hidden");

          restoreSession();

        }, 350);
      }

    }, 35);
  }


  /* =========================================================
     AUTH SCREEN
  ========================================================= */

  function showLogin() {

    const loginPanel = $("loginPanel");
    const signupPanel = $("signupPanel");

    if (loginPanel)
      loginPanel.classList.remove("hidden");

    if (signupPanel)
      signupPanel.classList.add("hidden");

    if ($("loginError"))
      $("loginError").textContent = "";

    if ($("signupError"))
      $("signupError").textContent = "";
  }


  function showSignup() {

    const loginPanel = $("loginPanel");
    const signupPanel = $("signupPanel");

    if (loginPanel)
      loginPanel.classList.add("hidden");

    if (signupPanel)
      signupPanel.classList.remove("hidden");

    if ($("loginError"))
      $("loginError").textContent = "";

    if ($("signupError"))
      $("signupError").textContent = "";
  }


  /* =========================================================
     USERNAME VALIDATION
  ========================================================= */

  function validUsername(username) {

    /*
      Allowed:
      A-Z
      a-z
      0-9
      spaces
      underscores

      NOT allowed:
      @
      #
      $
      %
      !
      etc.
    */

    return /^[A-Za-z0-9_ ]+$/.test(username);
  }


  /* =========================================================
     SIGN UP
  ========================================================= */

  async function signup() {

    const usernameInput = $("signupUsername");
    const passwordInput = $("signupPassword");
    const confirmInput = $("signupPasswordConfirm");
    const error = $("signupError");

    if (!usernameInput || !passwordInput || !confirmInput || !error) {
      console.error("Signup elements are missing.");
      return;
    }


    const username =
      usernameInput.value.trim();

    const password =
      passwordInput.value;

    const confirm =
      confirmInput.value;


    error.textContent = "";


    /* EMPTY USERNAME */

    if (!username) {

      error.textContent =
        "Please choose a username.";

      return;
    }


    /* USERNAME LENGTH */

    if (username.length < 2) {

      error.textContent =
        "Username must be at least 2 characters.";

      return;
    }


    /* USERNAME CHARACTERS */

    if (!validUsername(username)) {

      error.textContent =
        "Use letters, numbers, spaces or underscores.";

      return;
    }


    /* PASSWORD LENGTH */

    if (password.length < 6) {

      error.textContent =
        "Password must be at least 6 characters.";

      return;
    }


    /* PASSWORD MATCH */

    if (password !== confirm) {

      error.textContent =
        "The passwords do not match.";

      return;
    }


    /*
      IMPORTANT:
      The username key is normalized only for storage.
      The original username is preserved for display.
    */

    const usernameKey =
      username.toLowerCase();


    /* DUPLICATE USERNAME */

    if (Object.prototype.hasOwnProperty.call(
      accounts,
      usernameKey
    )) {

      error.textContent =
        "That username is already taken.";

      return;
    }


    /* CREATE ACCOUNT */

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


    /* CREATE SESSION */

    localStorage.setItem(
      SESSION_KEY,
      usernameKey
    );


    /* CLEAR FORM */

    usernameInput.value = "";
    passwordInput.value = "";
    confirmInput.value = "";


    /* ENTER DESKTOP */

    loginUser(usernameKey);
  }


  /* =========================================================
     LOGIN
  ========================================================= */

  async function login() {

    const usernameInput = $("loginUsername");
    const passwordInput = $("loginPassword");
    const error = $("loginError");

    if (!usernameInput || !passwordInput || !error) {
      console.error("Login elements are missing.");
      return;
    }


    const username =
      usernameInput.value.trim();

    const password =
      passwordInput.value;


    error.textContent = "";


    if (!username || !password) {

      error.textContent =
        "Enter your username and password.";

      return;
    }


    const key =
      username.toLowerCase();


    const account =
      accounts[key];


    if (!account) {

      error.textContent =
        "No NEXUS account was found.";

      return;
    }


    const passwordHash =
      await hashPassword(password);


    if (
      passwordHash !==
      account.passwordHash
    ) {

      error.textContent =
        "Incorrect password.";

      return;
    }


    localStorage.setItem(
      SESSION_KEY,
      key
    );


    passwordInput.value = "";


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


    const authScreen = $("authScreen");
    const desktop = $("desktop");

    if (authScreen)
      authScreen.classList.add("hidden");

    if (desktop)
      desktop.classList.remove("hidden");


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
      Object.prototype.hasOwnProperty.call(
        accounts,
        session
      )
    ) {

      loginUser(session);

    } else {

      if ($("authScreen"))
        $("authScreen").classList.remove("hidden");

      if ($("desktop"))
        $("desktop").classList.add("hidden");

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


    if ($("desktop"))
      $("desktop").classList.add("hidden");

    if ($("authScreen"))
      $("authScreen").classList.remove("hidden");


    if ($("loginUsername"))
      $("loginUsername").value = "";

    if ($("loginPassword"))
      $("loginPassword").value = "";


    showLogin();
  }


  /* =========================================================
     SAVE CURRENT USER
  ========================================================= */

  function saveCurrentUser() {

    if (!currentUser)
      return;


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

    if (!currentUser)
      return;


    if ($("settingsUsername"))
      $("settingsUsername").textContent =
        currentUser.username;


    if ($("settingsAccountInfo"))
      $("settingsAccountInfo").textContent =
        "Local NEXUS account";


    if ($("startUsername"))
      $("startUsername").textContent =
        currentUser.username;


    applyTheme(
      currentUser.theme || "dark"
    );


    applyWallpaper(
      currentUser.wallpaper || "default"
    );


    if ($("notesArea"))
      $("notesArea").value =
        currentUser.notes || "";
  }


  /* =========================================================
     THEME
  ========================================================= */

  function applyTheme(theme) {

    if (!document.body)
      return;


    if (theme === "light") {

      document.body.classList.add(
        "light-theme"
      );

    } else {

      document.body.classList.remove(
        "light-theme"
      );
    }
  }


  function setTheme(theme) {

    if (!currentUser)
      return;


    currentUser.theme =
      theme;


    applyTheme(theme);

    saveCurrentUser();


    showNotification(
      "Theme Changed",
      theme === "light"
        ? "Light theme enabled."
        : "Dark theme enabled."
    );
  }


  /* =========================================================
     WALLPAPER
  ========================================================= */

  function applyWallpaper(name) {

    const wallpaper =
      $("wallpaper");


    if (!wallpaper)
      return;


    wallpaper.className =
      "wallpaper";


    if (
      name &&
      name !== "default"
    ) {

      wallpaper.classList.add(
        name
      );
    }
  }


  function setWallpaper(name) {

    if (!currentUser)
      return;


    currentUser.wallpaper =
      name;


    applyWallpaper(name);

    saveCurrentUser();


    showNotification(
      "Wallpaper Changed",
      "Your wallpaper has been updated."
    );
  }


  /* =========================================================
     DELETE ACCOUNT
  ========================================================= */

  function deleteAccount() {

    if (!currentUser)
      return;


    const confirmed =
      confirm(
        `Delete the NEXUS account "${currentUser.username}"? This cannot be undone.`
      );


    if (!confirmed)
      return;


    const key =
      currentUser.username.toLowerCase();


    delete accounts[key];

    saveAccounts();


    localStorage.removeItem(
      SESSION_KEY
    );


    currentUser = null;

    selectedFile = null;


    closeAllWindows();


    if ($("desktop"))
      $("desktop").classList.add("hidden");

    if ($("authScreen"))
      $("authScreen").classList.remove("hidden");


    showLogin();


    showNotification(
      "Account Deleted",
      "Your local NEXUS account was deleted."
    );
  }


  /* =========================================================
     OPEN APP
  ========================================================= */

  function openApp(appID) {

    const windowElement =
      $(appID);


    if (!windowElement)
      return;


    qsa(".app-window")
      .forEach(win => {

        win.classList.remove(
          "open"
        );

      });


    windowElement.classList.add(
      "open"
    );


    if ($("startMenu"))
      $("startMenu").classList.add(
        "hidden"
      );


    updateTaskbar();


    if (appID === "filesWindow")
      renderFiles();


    if (appID === "paintWindow")
      prepareCanvas();


    if (appID === "gameWindow") {
      const target = $("gameTarget");

      if (target && !gameRunning) {
        target.style.display = "none";
      }
    }
  }


  /* =========================================================
     CLOSE APP
  ========================================================= */

  function closeApp(windowElement) {

    if (!windowElement)
      return;


    windowElement.classList.remove(
      "open"
    );


    updateTaskbar();
  }


  function closeAllWindows() {

    qsa(".app-window")
      .forEach(win => {

        win.classList.remove(
          "open"
        );

      });


    updateTaskbar();
  }


  /* =========================================================
     TASKBAR
  ========================================================= */

  function updateTaskbar() {

    const container =
      $("taskbarApps");


    if (!container)
      return;


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


        button.addEventListener(
          "click",
          () => {

            win.classList.toggle(
              "open"
            );

            updateTaskbar();
          }
        );


        container.appendChild(
          button
        );
      });
  }


  /* =========================================================
     START MENU
  ========================================================= */

  function toggleStartMenu() {

    const menu =
      $("startMenu");


    if (!menu)
      return;


    menu.classList.toggle(
      "hidden"
    );
  }


  /* =========================================================
     CLOCK
  ========================================================= */

  function updateClock() {

    const clock =
      $("clock");


    if (!clock)
      return;


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


    clock.textContent =
      `${hours}:${minutes}`;
  }


  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  function showNotification(
    title,
    message
  ) {

    const notification =
      $("notification");

    const titleElement =
      $("notificationTitle");

    const messageElement =
      $("notificationMessage");


    if (
      !notification ||
      !titleElement ||
      !messageElement
    )
      return;


    titleElement.textContent =
      title;

    messageElement.textContent =
      message;


    notification.classList.remove(
      "hidden"
    );


    clearTimeout(
      notificationTimer
    );


    notificationTimer =
      setTimeout(() => {

        notification.classList.add(
          "hidden"
        );

      }, 3000);
  }


  /* =========================================================
     NOTEPAD
  ========================================================= */

  function setupNotepad() {

    const notes =
      $("notesArea");


    if (!notes)
      return;


    notes.addEventListener(
      "input",
      () => {

        if (!currentUser)
          return;


        if ($("notesStatus"))
          $("notesStatus").textContent =
            "Saving...";


        clearTimeout(
          saveNotesTimer
        );


        saveNotesTimer =
          setTimeout(() => {

            if (!currentUser)
              return;


            currentUser.notes =
              notes.value;


            saveCurrentUser();


            if ($("notesStatus"))
              $("notesStatus").textContent =
                "Saved";

          }, 500);
      }
    );


    if ($("clearNotesButton")) {

      $("clearNotesButton")
        .addEventListener(
          "click",
          () => {

            if (!currentUser)
              return;


            notes.value = "";

            currentUser.notes = "";

            saveCurrentUser();


            if ($("notesStatus"))
              $("notesStatus").textContent =
                "Saved";
          }
        );
    }
  }


  /* =========================================================
     CALCULATOR
  ========================================================= */

  function setupCalculator() {

    qsa("[data-calc]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const value =
              button.dataset.calc;


            if (value === "clear") {

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


                const result =
                  Function(
                    `"use strict"; return (${calculatorValue})`
                  )();


                if (
                  typeof result !== "number" ||
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


            if ($("calculatorDisplay"))
              $("calculatorDisplay").value =
                calculatorValue;
          }
        );
      });
  }


  /* =========================================================
     FILE MANAGER
  ========================================================= */

  function renderFiles() {

    if (!currentUser)
      return;


    const list =
      $("fileList");


    if (!list)
      return;


    list.innerHTML = "";


    if (!currentUser.files)
      currentUser.files = {};


    Object.keys(
      currentUser.files
    )
      .forEach(filename => {

        const item =
          document.createElement(
            "div"
          );


        item.className =
          "file-item";


        if (
          selectedFile === filename
        ) {

          item.classList.add(
            "selected"
          );
        }


        item.textContent =
          `📄 ${filename}`;


        item.addEventListener(
          "click",
          () => {

            selectedFile =
              filename;


            if ($("fileEditor"))
              $("fileEditor").value =
                currentUser.files[
                  filename
                ];


            renderFiles();
          }
        );


        list.appendChild(
          item
        );
      });
  }


  function createFile() {

    if (!currentUser)
      return;


    const filename =
      prompt(
        "Enter a name for your new file:"
      );


    if (!filename)
      return;


    const cleanName =
      filename.trim();


    if (!cleanName)
      return;


    if (
      Object.prototype.hasOwnProperty.call(
        currentUser.files,
        cleanName
      )
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


    if ($("fileEditor"))
      $("fileEditor").value = "";


    saveCurrentUser();

    renderFiles();


    showNotification(
      "File Created",
      cleanName
    );
  }


  function saveFile() {

    if (
      !currentUser ||
      !selectedFile
    ) {

      showNotification(
        "No File Selected",
        "Select a file first."
      );

      return;
    }


    currentUser.files[
      selectedFile
    ] =
      $("fileEditor")
        ? $("fileEditor").value
        : "";


    saveCurrentUser();

    renderFiles();


    showNotification(
      "File Saved",
      selectedFile
    );
  }


  function deleteFile() {

    if (
      !currentUser ||
      !selectedFile
    ) {

      showNotification(
        "No File Selected",
        "Select a file first."
      );

      return;
    }


    const confirmed =
      confirm(
        `Delete "${selectedFile}"?`
      );


    if (!confirmed)
      return;


    delete currentUser.files[
      selectedFile
    ];


    selectedFile = null;


    if ($("fileEditor"))
      $("fileEditor").value = "";


    saveCurrentUser();

    renderFiles();


    showNotification(
      "File Deleted",
      "The file was deleted."
    );
  }


  /* =========================================================
     PAINT
  ========================================================= */

  let canvas = null;
  let ctx = null;
  let drawing = false;


  function prepareCanvas() {

    canvas =
      $("paintCanvas");


    if (!canvas)
      return;


    if (!ctx)
      ctx =
        canvas.getContext("2d");
  }


  function canvasPosition(event) {

    if (!canvas)
      return {
        x: 0,
        y: 0
      };


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


  function setupPaint() {

    prepareCanvas();


    if (!canvas || !ctx)
      return;


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

        if (!drawing)
          return;


        const pos =
          canvasPosition(event);


        ctx.lineWidth =
          Number(
            $("brushSize")
              ? $("brushSize").value
              : 5
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


    const stopDrawing =
      () => {
        drawing = false;
      };


    canvas.addEventListener(
      "pointerup",
      stopDrawing
    );


    canvas.addEventListener(
      "pointerleave",
      stopDrawing
    );


    canvas.addEventListener(
      "contextmenu",
      event => {
        event.preventDefault();
      }
    );
  }


  function clearCanvas() {

    prepareCanvas();

    if (!canvas || !ctx)
      return;


    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }


  function saveDrawing() {

    prepareCanvas();

    if (!canvas)
      return;


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


  /* =========================================================
     CATCH NEXUS GAME
  ========================================================= */

  function moveGameTarget() {

    const area =
      $("gameArea");

    const target =
      $("gameTarget");


    if (!area || !target)
      return;


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


  function startGame() {

    const target =
      $("gameTarget");

    if (!target)
      return;


    clearInterval(
      gameTimer
    );


    gameScore = 0;

    gameRunning = true;


    if ($("gameScore"))
      $("gameScore").textContent =
        "0";


    target.style.display =
      "block";


    if ($("gameMessage"))
      $("gameMessage").textContent =
        "";


    moveGameTarget();


    showNotification(
      "Game Started",
      "Catch the N!"
    );


    gameTimer =
      setTimeout(() => {

        gameRunning = false;


        target.style.display =
          "none";


        if ($("gameMessage"))
          $("gameMessage").textContent =
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

      }, 30000);
  }


  function catchTarget() {

    if (!gameRunning)
      return;


    gameScore++;


    if ($("gameScore"))
      $("gameScore").textContent =
        gameScore;


    moveGameTarget();
  }


  /* =========================================================
     EVENT LISTENERS
  ========================================================= */

  /* AUTH */

  if ($("loginButton")) {
    $("loginButton").addEventListener(
      "click",
      login
    );
  }


  if ($("signupButton")) {
    $("signupButton").addEventListener(
      "click",
      signup
    );
  }


  if ($("showSignupButton")) {
    $("showSignupButton").addEventListener(
      "click",
      showSignup
    );
  }


  if ($("showLoginButton")) {
    $("showLoginButton").addEventListener(
      "click",
      showLogin
    );
  }


  if ($("forgotPasswordButton")) {

    $("forgotPasswordButton")
      .addEventListener(
        "click",
        () => {

          showNotification(
            "Password Reset",
            "Because NEXUS stores accounts locally, password recovery is not available yet."
          );
        }
      );
  }


  /* ENTER KEY LOGIN */

  if ($("loginPassword")) {

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
  }


  /* ENTER KEY SIGNUP */

  if ($("signupPasswordConfirm")) {

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
  }


  /* DESKTOP APPS */

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


  /* WINDOW CLOSE */

  qsa(".close-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          closeApp(
            button.closest(
              ".app-window"
            )
          );
        }
      );
    });


  /* WINDOW MINIMIZE */

  qsa(".minimize-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const win =
            button.closest(
              ".app-window"
            );


          if (win)
            win.classList.remove(
              "open"
            );


          updateTaskbar();
        }
      );
    });


  /* START BUTTON */

  if ($("startButton")) {

    $("startButton")
      .addEventListener(
        "click",
        toggleStartMenu
      );
  }


  /* START LOGOUT */

  if ($("startLogoutButton")) {

    $("startLogoutButton")
      .addEventListener(
        "click",
        logout
      );
  }


  /* SETTINGS */

  if ($("darkThemeButton")) {

    $("darkThemeButton")
      .addEventListener(
        "click",
        () => setTheme("dark")
      );
  }


  if ($("lightThemeButton")) {

    $("lightThemeButton")
      .addEventListener(
        "click",
        () => setTheme("light")
      );
  }


  qsa("[data-wallpaper]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          setWallpaper(
            button.dataset.wallpaper
          );
        }
      );
    });


  if ($("logoutButton")) {

    $("logoutButton")
      .addEventListener(
        "click",
        logout
      );
  }


  if ($("deleteAccountButton")) {

    $("deleteAccountButton")
      .addEventListener(
        "click",
        deleteAccount
      );
  }


  /* FILE MANAGER */

  if ($("newFileButton")) {

    $("newFileButton")
      .addEventListener(
        "click",
        createFile
      );
  }


  if ($("saveFileButton")) {

    $("saveFileButton")
      .addEventListener(
        "click",
        saveFile
      );
  }


  if ($("deleteFileButton")) {

    $("deleteFileButton")
      .addEventListener(
        "click",
        deleteFile
      );
  }


  /* PAINT */

  setupPaint();


  if ($("clearCanvasButton")) {

    $("clearCanvasButton")
      .addEventListener(
        "click",
        clearCanvas
      );
  }


  if ($("saveDrawingButton")) {

    $("saveDrawingButton")
      .addEventListener(
        "click",
        saveDrawing
      );
  }


  /* GAME */

  if ($("gameTarget")) {

    $("gameTarget")
      .addEventListener(
        "click",
        catchTarget
      );
  }


  if ($("startGameButton")) {

    $("startGameButton")
      .addEventListener(
        "click",
        startGame
      );
  }


  /* NOTEPAD */

  setupNotepad();


  /* CALCULATOR */

  setupCalculator();


  /* CLOCK */

  updateClock();

  setInterval(
    updateClock,
    1000
  );


  /* =========================================================
     KEYBOARD SHORTCUTS
  ========================================================= */

  document.addEventListener(
    "keydown",
    event => {

      /*
        Escape closes the start menu.
      */

      if (
        event.key === "Escape"
      ) {

        if ($("startMenu"))
          $("startMenu").classList.add(
            "hidden"
          );
      }


      /*
        Ctrl + L logs out.
      */

      if (
        event.ctrlKey &&
        event.key.toLowerCase() === "l"
      ) {

        /*
          Do not interfere with browser
          address-bar shortcut.
        */

        event.preventDefault();

        if (currentUser)
          logout();
      }
    }
  );


  /* =========================================================
     START NEXUS
  ========================================================= */

  loadAccounts();

  boot();

});
