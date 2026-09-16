/* =========================================================
   NEXUS v1.4
   COMPLETE FIREBASE-FREE SYSTEM
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     STORAGE
  ====================================================== */

  const ACCOUNTS_KEY = "nexus_v14_accounts";
  const SESSION_KEY = "nexus_v14_session";
  const HISTORY_KEY = "nexus_v14_history";

  let accounts = {};
  let currentUser = null;
  let selectedFile = null;

  let calculatorValue = "";

  let browserCurrentURL = "";
  let browserPreviousURL = "";
  let browserForwardURL = "";
  let browserExternalURL = "";

  let notificationTimer = null;

  let paintCanvas = null;
  let paintContext = null;
  let painting = false;

  let catchRunning = false;
  let catchScore = 0;
  let catchTimer = null;

  let clickRunning = false;
  let clickScore = 0;
  let clickTime = 10;
  let clickTimer = null;

  let memoryCards = [];
  let memoryFlipped = [];
  let memoryLocked = false;
  let memoryMoves = 0;

  let snakeRunning = false;
  let snakeTimer = null;
  let snakeDirection = "right";
  let snakeNextDirection = "right";
  let snakeBody = [];
  let snakeFood = {};
  let snakeScore = 0;


  /* =====================================================
     HELPERS
  ====================================================== */

  const $ = id =>
    document.getElementById(id);

  const qsa = selector =>
    document.querySelectorAll(selector);


  /* =====================================================
     STORAGE
  ====================================================== */

  function loadAccounts() {

    try {

      accounts =
        JSON.parse(
          localStorage.getItem(
            ACCOUNTS_KEY
          )
        ) || {};

    } catch {

      accounts = {};
    }
  }


  function saveAccounts() {

    localStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify(accounts)
    );
  }


  function saveCurrentUser() {

    if (!currentUser)
      return;

    accounts[
      currentUser.key
    ] = currentUser;

    saveAccounts();
  }


  function createID() {

    return (
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .slice(2)
    );
  }


  /* =====================================================
     PASSWORD HASH
  ====================================================== */

  async function hashPassword(password) {

    if (
      crypto &&
      crypto.subtle
    ) {

      try {

        const data =
          new TextEncoder()
            .encode(password);

        const hash =
          await crypto.subtle.digest(
            "SHA-256",
            data
          );

        return Array
          .from(new Uint8Array(hash))
          .map(
            x =>
              x.toString(16)
                .padStart(2, "0")
          )
          .join("");

      } catch {}
    }


    let hash = 0;

    for (
      let i = 0;
      i < password.length;
      i++
    ) {

      hash =
        (
          hash << 5
        ) -
        hash +
        password.charCodeAt(i);

      hash |= 0;
    }

    return String(hash);
  }


  /* =====================================================
     DEFAULT FILES
  ====================================================== */

  function defaultFiles(username) {

    return {

      "Welcome.txt":
`Welcome to NEXUS v1.4!

Hello ${username}!

NEXUS is your personal browser-based mini OS.

New in v1.4:
- Game Center
- NEXUS Browser
- Updated design
- More customization`,

      "Ideas.txt":
`NEXUS Ideas

Write your future ideas here!`,

      "About.txt":
`NEXUS v1.4

Built with:
HTML
CSS
JavaScript

Firebase-free edition.`

    };
  }


  /* =====================================================
     BOOT
  ====================================================== */

  function boot() {

    let progress = 0;

    const interval =
      setInterval(() => {

        progress += 5;

        if ($("bootProgress"))
          $("bootProgress").style.width =
            progress + "%";


        if ($("bootStatus")) {

          if (progress < 30)
            $("bootStatus").textContent =
              "Initializing NEXUS core...";

          else if (progress < 60)
            $("bootStatus").textContent =
              "Loading applications...";

          else if (progress < 90)
            $("bootStatus").textContent =
              "Preparing desktop...";

          else
            $("bootStatus").textContent =
              "Ready.";
        }


        if (progress >= 100) {

          clearInterval(interval);

          setTimeout(() => {

            $("bootScreen")
              ?.classList
              .add("hidden");

            restoreSession();

          }, 350);
        }

      }, 35);
  }


  /* =====================================================
     AUTH
  ====================================================== */

  function showLogin() {

    $("loginPanel")
      ?.classList
      .remove("hidden");

    $("signupPanel")
      ?.classList
      .add("hidden");

    if ($("loginError"))
      $("loginError").textContent = "";

    if ($("signupError"))
      $("signupError").textContent = "";
  }


  function showSignup() {

    $("loginPanel")
      ?.classList
      .add("hidden");

    $("signupPanel")
      ?.classList
      .remove("hidden");

    if ($("loginError"))
      $("loginError").textContent = "";

    if ($("signupError"))
      $("signupError").textContent = "";
  }


  function validUsername(username) {

    return /^[A-Za-z0-9_ ]+$/
      .test(username);
  }


  /* =====================================================
     SIGN UP
  ====================================================== */

  async function signup() {

    const username =
      $("signupUsername")
        .value
        .trim();

    const email =
      $("signupEmail")
        .value
        .trim();

    const password =
      $("signupPassword")
        .value;

    const confirm =
      $("signupPasswordConfirm")
        .value;


    $("signupError")
      .textContent = "";


    if (!username) {

      $("signupError")
        .textContent =
        "Please choose a username.";

      return;
    }


    if (username.length < 2) {

      $("signupError")
        .textContent =
        "Username must be at least 2 characters.";

      return;
    }


    if (!validUsername(username)) {

      $("signupError")
        .textContent =
        "Use letters, numbers, spaces or underscores.";

      return;
    }


    if (!email) {

      $("signupError")
        .textContent =
        "Please enter your email.";

      return;
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email)) {

      $("signupError")
        .textContent =
        "Please enter a valid email.";

      return;
    }


    if (password.length < 6) {

      $("signupError")
        .textContent =
        "Password must be at least 6 characters.";

      return;
    }


    if (password !== confirm) {

      $("signupError")
        .textContent =
        "The passwords do not match.";

      return;
    }


    const key =
      username.toLowerCase();


    if (
      accounts[key]
    ) {

      $("signupError")
        .textContent =
        "That username is already taken.";

      return;
    }


    const passwordHash =
      await hashPassword(password);


    currentUser = {

      key,

      id: createID(),

      username,

      email,

      passwordHash,

      createdAt: Date.now(),

      theme: "dark",

      wallpaper: "default",

      notes: "",

      files:
        defaultFiles(username),

      highScore: 0,

      gameScores: {
        catch: 0,
        click: 0,
        memory: 0,
        snake: 0
      }
    };


    accounts[key] =
      currentUser;


    saveAccounts();


    localStorage.setItem(
      SESSION_KEY,
      key
    );


    clearAuthFields();

    enterDesktop();

  }


  /* =====================================================
     LOGIN
  ====================================================== */

  async function login() {

    const email =
      $("loginEmail")
        .value
        .trim();

    const password =
      $("loginPassword")
        .value;


    $("loginError")
      .textContent = "";


    if (!email || !password) {

      $("loginError")
        .textContent =
        "Please enter your email and password.";

      return;
    }


    const passwordHash =
      await hashPassword(password);


    const userKey =
      Object.keys(accounts)
        .find(
          key =>
            accounts[key].email
              .toLowerCase() ===
            email.toLowerCase()
        );


    if (
      !userKey ||
      accounts[userKey]
        .passwordHash !==
        passwordHash
    ) {

      $("loginError")
        .textContent =
        "The email or password is incorrect.";

      return;
    }


    currentUser =
      accounts[userKey];


    currentUser.key =
      userKey;


    localStorage.setItem(
      SESSION_KEY,
      userKey
    );


    clearAuthFields();

    enterDesktop();

  }


  function clearAuthFields() {

    if ($("loginEmail"))
      $("loginEmail").value = "";

    if ($("loginPassword"))
      $("loginPassword").value = "";

    if ($("signupUsername"))
      $("signupUsername").value = "";

    if ($("signupEmail"))
      $("signupEmail").value = "";

    if ($("signupPassword"))
      $("signupPassword").value = "";

    if ($("signupPasswordConfirm"))
      $("signupPasswordConfirm").value = "";
  }


  function restoreSession() {

    loadAccounts();


    const key =
      localStorage.getItem(
        SESSION_KEY
      );


    if (
      key &&
      accounts[key]
    ) {

      currentUser =
        accounts[key];

      currentUser.key =
        key;

      enterDesktop();

    } else {

      $("authScreen")
        ?.classList
        .remove("hidden");

      $("desktop")
        ?.classList
        .add("hidden");

      showLogin();
    }
  }


  function enterDesktop() {

    $("authScreen")
      ?.classList
      .add("hidden");

    $("desktop")
      ?.classList
      .remove("hidden");


    applyUserSettings();

    renderFiles();

    updateGameBest();

    showNotification(
      "NEXUS Ready",
      `Welcome, ${currentUser.username}!`
    );
  }


  function logout() {

    localStorage.removeItem(
      SESSION_KEY
    );

    currentUser = null;

    closeAllWindows();

    $("desktop")
      ?.classList
      .add("hidden");

    $("authScreen")
      ?.classList
      .remove("hidden");

    showLogin();
  }


  /* =====================================================
     USER SETTINGS
  ====================================================== */

  function applyUserSettings() {

    if (!currentUser)
      return;


    $("settingsUsername")
      .textContent =
      currentUser.username;


    $("settingsEmail")
      .textContent =
      currentUser.email;


    $("startUsername")
      .textContent =
      currentUser.username;


    $("startEmail")
      .textContent =
      currentUser.email;


    $("notesArea")
      .value =
      currentUser.notes || "";


    applyTheme(
      currentUser.theme ||
      "dark"
    );


    applyWallpaper(
      currentUser.wallpaper ||
      "default"
    );
  }


  function applyTheme(theme) {

    if (theme === "light")
      document.body
        .classList
        .add("light-theme");
    else
      document.body
        .classList
        .remove("light-theme");
  }


  function setTheme(theme) {

    if (!currentUser)
      return;

    currentUser.theme =
      theme;

    saveCurrentUser();

    applyTheme(theme);
  }


  function applyWallpaper(name) {

    const wallpaper =
      $("wallpaper");

    if (!wallpaper)
      return;

    wallpaper.className =
      "wallpaper";

    if (
      name !== "default"
    )
      wallpaper.classList
        .add(name);
  }


  function setWallpaper(name) {

    if (!currentUser)
      return;

    currentUser.wallpaper =
      name;

    saveCurrentUser();

    applyWallpaper(name);
  }


  /* =====================================================
     WINDOWS
  ====================================================== */

  function openApp(name) {

    const windowID =
      name.endsWith("Window")
        ? name
        : `${name}Window`;


    const windowElement =
      $(windowID);


    if (!windowElement)
      return;


    qsa(".app-window")
      .forEach(win =>
        win.classList
          .remove("open")
      );


    windowElement
      .classList
      .add("open");


    $("startMenu")
      ?.classList
      .add("hidden");


    updateTaskbar();


    if (name === "files")
      renderFiles();


    if (name === "games")
      showGameMenu();


    if (name === "paint")
      preparePaint();
  }


  function closeApp(win) {

    if (!win)
      return;

    win.classList
      .remove("open");

    updateTaskbar();
  }


  function closeAllWindows() {

    qsa(".app-window")
      .forEach(win =>
        win.classList
          .remove("open")
      );

    updateTaskbar();
  }


  function updateTaskbar() {

    const taskbar =
      $("taskbarApps");

    if (!taskbar)
      return;


    taskbar.innerHTML = "";


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
            ".window-title strong"
          );


        button.textContent =
          title
            ? title.textContent
            : "App";


        button.onclick = () =>
          win.classList.toggle(
            "open"
          );


        taskbar.appendChild(
          button
        );
      });
  }


  /* =====================================================
     CLOCK
  ====================================================== */

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


    const seconds =
      String(
        now.getSeconds()
      ).padStart(2, "0");


    const date =
      now.toLocaleDateString(
        undefined,
        {
          weekday: "short",
          month: "short",
          day: "numeric"
        }
      );


    if ($("clock"))
      $("clock").textContent =
        `${hours}:${minutes}`;


    if ($("bigClock"))
      $("bigClock").textContent =
        `${hours}:${minutes}:${seconds}`;


    if ($("bigDate"))
      $("bigDate").textContent =
        date;
  }


  setInterval(
    updateClock,
    1000
  );

  updateClock();


  /* =====================================================
     NOTIFICATIONS
  ====================================================== */

  function showNotification(
    title,
    message
  ) {

    if (
      !$("notification")
    )
      return;


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
      setTimeout(() => {

        $("notification")
          .classList
          .add("hidden");

      }, 3500);
  }


  /* =====================================================
     NOTEPAD
  ====================================================== */

  let notesSaveTimer;


  $("notesArea")
    ?.addEventListener(
      "input",
      () => {

        if (!currentUser)
          return;


        $("notesStatus")
          .textContent =
          "Saving...";


        clearTimeout(
          notesSaveTimer
        );


        notesSaveTimer =
          setTimeout(() => {

            currentUser.notes =
              $("notesArea")
                .value;

            saveCurrentUser();


            $("notesStatus")
              .textContent =
              "Saved";

          }, 500);
      }
    );


  $("clearNotesButton")
    ?.addEventListener(
      "click",
      () => {

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


  /* =====================================================
     CALCULATOR
  ====================================================== */

  qsa("[data-calc]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const value =
            button.dataset.calc;


          if (value === "clear")
            calculatorValue = "";


          else if (
            value === "backspace"
          )
            calculatorValue =
              calculatorValue.slice(
                0,
                -1
              );


          else if (
            value === "="
          ) {

            try {

              if (
                !/^[0-9+\-*/().\s]+$/
                  .test(
                    calculatorValue
                  )
              )
                throw new Error();


              const result =
                Function(
                  `"use strict"; return (${calculatorValue})`
                )();


              if (
                !Number.isFinite(
                  result
                )
              )
                throw new Error();


              calculatorValue =
                String(result);

            } catch {

              calculatorValue =
                "Error";
            }

          } else {

            if (
              calculatorValue ===
              "Error"
            )
              calculatorValue = "";

            calculatorValue +=
              value;
          }


          $("calculatorDisplay")
            .value =
            calculatorValue;
        }
      );
    });


  /* =====================================================
     FILES
  ====================================================== */

  function renderFiles() {

    if (!currentUser)
      return;


    if (!currentUser.files)
      currentUser.files = {};


    const list =
      $("fileList");


    if (!list)
      return;


    list.innerHTML = "";


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
          filename ===
          selectedFile
        )
          item.classList
            .add("selected");


        item.textContent =
          `📄 ${filename}`;


        item.onclick = () => {

          selectedFile =
            filename;

          $("fileEditor")
            .value =
            currentUser.files[
              filename
            ];

          renderFiles();
        };


        list.appendChild(item);
      });
  }


  $("newFileButton")
    ?.addEventListener(
      "click",
      () => {

        const name =
          prompt(
            "Enter a file name:"
          );


        if (!name)
          return;


        const filename =
          name.trim();


        if (!filename)
          return;


        if (
          currentUser.files[
            filename
          ]
        !== undefined
        ) {

          showNotification(
            "File Exists",
            "That file already exists."
          );

          return;
        }


        currentUser.files[
          filename
        ] = "";


        selectedFile =
          filename;


        $("fileEditor")
          .value = "";


        saveCurrentUser();

        renderFiles();
      }
    );


  $("saveFileButton")
    ?.addEventListener(
      "click",
      () => {

        if (!selectedFile) {

          showNotification(
            "No File",
            "Select a file first."
          );

          return;
        }


        currentUser.files[
          selectedFile
        ] =
          $("fileEditor")
            .value;


        saveCurrentUser();


        showNotification(
          "File Saved",
          selectedFile
        );
      }
    );


  $("deleteFileButton")
    ?.addEventListener(
      "click",
      () => {

        if (!selectedFile)
          return;


        if (
          !confirm(
            `Delete "${selectedFile}"?`
          )
        )
          return;


        delete currentUser.files[
          selectedFile
        ];


        selectedFile = null;


        $("fileEditor")
          .value = "";


        saveCurrentUser();

        renderFiles();
      }
    );


  /* =====================================================
     PAINT
  ====================================================== */

  function preparePaint() {

    paintCanvas =
      $("paintCanvas");


    if (!paintCanvas)
      return;


    if (!paintContext)
      paintContext =
        paintCanvas
          .getContext("2d");
  }


  function paintPosition(event) {

    const rect =
      paintCanvas
        .getBoundingClientRect();


    return {

      x:
        (event.clientX -
          rect.left) *
        (
          paintCanvas.width /
          rect.width
        ),

      y:
        (event.clientY -
          rect.top) *
        (
          paintCanvas.height /
          rect.height
        )
    };
  }


  preparePaint();


  $("paintCanvas")
    ?.addEventListener(
      "pointerdown",
      event => {

        painting = true;


        const pos =
          paintPosition(event);


        paintContext.beginPath();

        paintContext.moveTo(
          pos.x,
          pos.y
        );
      }
    );


  $("paintCanvas")
    ?.addEventListener(
      "pointermove",
      event => {

        if (!painting)
          return;


        const pos =
          paintPosition(event);


        paintContext.lineWidth =
          Number(
            $("brushSize")
              .value
          );


        paintContext.lineCap =
          "round";


        paintContext.strokeStyle =
          "#111111";


        paintContext.lineTo(
          pos.x,
          pos.y
        );


        paintContext.stroke();
      }
    );


  ["pointerup", "pointerleave"]
    .forEach(type =>
      $("paintCanvas")
        ?.addEventListener(
          type,
          () => {
            painting = false;
          }
        )
    );


  $("clearCanvasButton")
    ?.addEventListener(
      "click",
      () => {

        preparePaint();


        paintContext.clearRect(
          0,
          0,
          paintCanvas.width,
          paintCanvas.height
        );
      }
    );


  $("saveDrawingButton")
    ?.addEventListener(
      "click",
      () => {

        preparePaint();


        const link =
          document.createElement(
            "a"
          );


        link.href =
          paintCanvas.toDataURL(
            "image/png"
          );


        link.download =
          "nexus-v14-drawing.png";


        link.click();
      }
    );


  /* =====================================================
     GAME CENTER
  ====================================================== */

  function showGameMenu() {

    $("gameMenu")
      .classList
      .remove("hidden");


    qsa(".game-screen")
      .forEach(screen =>
        screen.classList
          .add("hidden")
      );
  }


  function openGame(id) {

    $("gameMenu")
      .classList
      .add("hidden");


    qsa(".game-screen")
      .forEach(screen =>
        screen.classList
          .add("hidden")
      );


    $(id + "Game")
      ?.classList
      .remove("hidden");
  }


  function updateGameBest() {

    if (!currentUser)
      return;


    const scores =
      currentUser.gameScores || {};


    const best =
      Math.max(
        scores.catch || 0,
        scores.click || 0,
        scores.memory || 0,
        scores.snake || 0,
        currentUser.highScore || 0
      );


    $("globalBestScore")
      .textContent =
      best;
  }


  function saveGameScore(
    game,
    score
  ) {

    if (!currentUser)
      return;


    if (!currentUser.gameScores)
      currentUser.gameScores = {};


    if (
      score >
      (
        currentUser.gameScores[
          game
        ] || 0
      )
    ) {

      currentUser.gameScores[
        game
      ] = score;


      saveCurrentUser();

      updateGameBest();


      showNotification(
        "New High Score!",
        `${score} points`
      );
    }
  }


  /* =====================================================
     CATCH NEXUS
  ====================================================== */

  function moveCatchTarget() {

    const area =
      $("catchArea");

    const target =
      $("catchTarget");


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


  $("startCatch")
    ?.addEventListener(
      "click",
      () => {

        clearTimeout(
          catchTimer
        );


        catchScore = 0;

        catchRunning = true;


        $("catchScore")
          .textContent = "0";


        $("catchTarget")
          .style.display =
          "block";


        moveCatchTarget();


        catchTimer =
          setTimeout(
            () => {

              catchRunning =
                false;


              $("catchTarget")
                .style.display =
                "none";


              saveGameScore(
                "catch",
                catchScore
              );


              showNotification(
                "Game Over",
                `You scored ${catchScore}!`
              );

            },
            30000
          );
      }
    );


  $("catchTarget")
    ?.addEventListener(
      "click",
      () => {

        if (!catchRunning)
          return;


        catchScore++;


        $("catchScore")
          .textContent =
          catchScore;


        moveCatchTarget();
      }
    );


  /* =====================================================
     CLICK RUSH
  ====================================================== */

  $("startClick")
    ?.addEventListener(
      "click",
      () => {

        clearInterval(
          clickTimer
        );


        clickRunning = true;

        clickScore = 0;

        clickTime = 10;


        $("clickScore")
          .textContent = "0";


        $("clickTime")
          .textContent = "10";


        clickTimer =
          setInterval(
            () => {

              clickTime--;


              $("clickTime")
                .textContent =
                clickTime;


              if (
                clickTime <= 0
              ) {

                clearInterval(
                  clickTimer
                );


                clickRunning =
                  false;


                saveGameScore(
                  "click",
                  clickScore
                );


                showNotification(
                  "Click Rush Finished",
                  `${clickScore} clicks!`
                );
              }

            },
            1000
          );
      }
    );


  $("clickButton")
    ?.addEventListener(
      "click",
      () => {

        if (!clickRunning)
          return;


        clickScore++;


        $("clickScore")
          .textContent =
          clickScore;
      }
    );


  /* =====================================================
     MEMORY MATCH
  ====================================================== */

  function createMemoryGame() {

    const icons = [
      "🚀",
      "🎮",
      "🌐",
      "🎨",
      "🧠",
      "⚡",
      "📝",
      "🪐"
    ];


    memoryCards =
      [
        ...icons,
        ...icons
      ]
        .sort(
          () =>
            Math.random() - 0.5
        );


    memoryFlipped = [];

    memoryLocked = false;

    memoryMoves = 0;


    $("memoryMoves")
      .textContent = "0";


    const board =
      $("memoryBoard");


    board.innerHTML = "";


    memoryCards
      .forEach(
        (icon, index) => {

          const card =
            document.createElement(
              "button"
            );


          card.className =
            "memory-card";


          card.dataset.index =
            index;


          card.textContent =
            "❔";


          card.onclick = () =>
            flipMemoryCard(
              card,
              index
            );


          board.appendChild(
            card
          );
        }
      );
  }


  function flipMemoryCard(
    card,
    index
  ) {

    if (
      memoryLocked ||
      memoryFlipped
        .some(
          item =>
            item.index === index
        ) ||
      card.classList.contains(
        "matched"
      )
    )
      return;


    card.textContent =
      memoryCards[index];


    card.classList.add(
      "flipped"
    );


    memoryFlipped.push({
      card,
      index
    });


    if (
      memoryFlipped.length !== 2
    )
      return;


    memoryMoves++;


    $("memoryMoves")
      .textContent =
      memoryMoves;


    const [a, b] =
      memoryFlipped;


    if (
      memoryCards[a.index] ===
      memoryCards[b.index]
    ) {

      a.card.classList.add(
        "matched"
      );

      b.card.classList.add(
        "matched"
      );


      memoryFlipped = [];


      const matched =
        qsa(
          ".memory-card.matched"
        );


      if (
        matched.length ===
        memoryCards.length
      ) {

        const score =
          Math.max(
            100 -
            memoryMoves * 5,
            10
          );


        saveGameScore(
          "memory",
          score
        );


        showNotification(
          "Memory Complete!",
          `Score: ${score}`
        );
      }

    } else {

      memoryLocked = true;


      setTimeout(
        () => {

          a.card.textContent =
            "❔";

          b.card.textContent =
            "❔";


          a.card.classList
            .remove("flipped");

          b.card.classList
            .remove("flipped");


          memoryFlipped = [];

          memoryLocked = false;

        },
        700
      );
    }
  }


  $("startMemory")
    ?.addEventListener(
      "click",
      createMemoryGame
    );


  /* =====================================================
     SNAKE
  ====================================================== */

  const snakeCanvas =
    $("snakeCanvas");

  const snakeCtx =
    snakeCanvas
      ?.getContext("2d");


  function randomSnakeFood() {

    return {

      x:
        Math.floor(
          Math.random() * 24
        ),

      y:
        Math.floor(
          Math.random() * 16
        )
    };
  }


  function startSnake() {

    clearInterval(
      snakeTimer
    );


    snakeRunning = true;

    snakeScore = 0;


    snakeDirection =
      "right";

    snakeNextDirection =
      "right";


    snakeBody = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 }
    ];


    snakeFood =
      randomSnakeFood();


    $("snakeScore")
      .textContent = "0";


    snakeTimer =
      setInterval(
        snakeTick,
        120
      );


    drawSnake();
  }


  function snakeTick() {

    snakeDirection =
      snakeNextDirection;


    const head = {
      ...snakeBody[0]
    };


    if (
      snakeDirection ===
      "up"
    )
      head.y--;


    if (
      snakeDirection ===
      "down"
    )
      head.y++;


    if (
      snakeDirection ===
      "left"
    )
      head.x--;


    if (
      snakeDirection ===
      "right"
    )
      head.x++;


    if (
      head.x < 0 ||
      head.x >= 24 ||
      head.y < 0 ||
      head.y >= 16 ||
      snakeBody.some(
        part =>
          part.x === head.x &&
          part.y === head.y
      )
    ) {

      endSnake();

      return;
    }


    snakeBody.unshift(
      head
    );


    if (
      head.x === snakeFood.x &&
      head.y === snakeFood.y
    ) {

      snakeScore++;


      $("snakeScore")
        .textContent =
        snakeScore;


      snakeFood =
        randomSnakeFood();

    } else {

      snakeBody.pop();
    }


    drawSnake();
  }


  function drawSnake() {

    if (!snakeCtx)
      return;


    snakeCtx.clearRect(
      0,
      0,
      snakeCanvas.width,
      snakeCanvas.height
    );


    const cellW =
      snakeCanvas.width /
      24;

    const cellH =
      snakeCanvas.height /
      16;


    snakeCtx.fillStyle =
      "#7c5cff";


    snakeBody.forEach(
      part => {

        snakeCtx.fillRect(
          part.x * cellW + 1,
          part.y * cellH + 1,
          cellW - 2,
          cellH - 2
        );
      }
    );


    snakeCtx.fillStyle =
      "#19d8ff";


    snakeCtx.beginPath();

    snakeCtx.arc(
      snakeFood.x * cellW +
        cellW / 2,
      snakeFood.y * cellH +
        cellH / 2,
      Math.min(
        cellW,
        cellH
      ) / 3,
      0,
      Math.PI * 2
    );

    snakeCtx.fill();
  }


  function endSnake() {

    snakeRunning = false;


    clearInterval(
      snakeTimer
    );


    saveGameScore(
      "snake",
      snakeScore
    );


    showNotification(
      "Snake Over",
      `Score: ${snakeScore}`
    );
  }


  $("startSnake")
    ?.addEventListener(
      "click",
      startSnake
    );


  document.addEventListener(
    "keydown",
    event => {

      if (!snakeRunning)
        return;


      const key =
        event.key.toLowerCase();


      const directions = {

        arrowup: "up",
        w: "up",

        arrowdown: "down",
        s: "down",

        arrowleft: "left",
        a: "left",

        arrowright: "right",
        d: "right"
      };


      const direction =
        directions[key];


      if (!direction)
        return;


      event.preventDefault();


      const opposite = {

        up: "down",
        down: "up",
        left: "right",
        right: "left"

      };


      if (
        opposite[
          snakeDirection
        ] !== direction
      )
        snakeNextDirection =
          direction;
    }
  );


  /* =====================================================
     GAME BUTTONS
  ====================================================== */

  qsa(".game-card")
    .forEach(card => {

      card.addEventListener(
        "click",
        () =>
          openGame(
            card.dataset.game
          )
      );
    });


  qsa(".back-games")
    .forEach(button => {

      button.addEventListener(
        "click",
        showGameMenu
      );
    });


  /* =====================================================
     BROWSER
  ====================================================== */

  function normalizeURL(value) {

    value =
      value.trim();


    if (!value)
      return null;


    if (
      value.startsWith(
        "http://"
      ) ||
      value.startsWith(
        "https://"
      )
    ) {

      return value;
    }


    if (
      value.includes(".") &&
      !value.includes(" ")
    ) {

      return (
        "https://" +
        value
      );
    }


    return (
      "https://www.google.com/search?q=" +
      encodeURIComponent(value)
    );
  }


  function loadBrowserURL(
    input,
    addHistory = true
  ) {

    const url =
      normalizeURL(input);


    if (!url)
      return;


    browserCurrentURL =
      url;


    if (
      addHistory
    )
      addBrowserHistory(url);


    $("browserAddress")
      .value =
      url;


    $("browserHomePage")
      .classList
      .add("hidden");


    $("browserBlocked")
      .classList
      .add("hidden");


    const frame =
      $("browserFrame");


    frame.classList
      .remove("hidden");


    frame.src =
      url;


    $("browserTabTitle")
      .textContent =
      getDomain(url);


    frame.onload = () => {

      /*
        Some pages may still refuse
        to be embedded. The browser
        cannot override that.
      */

      setTimeout(
        () => {

          try {

            if (
              frame.contentWindow
                .location
                .href ===
              "about:blank"
            ) {

              showBrowserBlocked(url);
            }

          } catch {
            /*
              Cross-origin pages are
              expected and are allowed.
            */
          }

        },
        900
      );
    };
  }


  function getDomain(url) {

    try {

      return new URL(url)
        .hostname
        .replace(
          "www.",
          ""
        );

    } catch {

      return "Web";
    }
  }


  function showBrowserBlocked(url) {

    $("browserFrame")
      .classList
      .add("hidden");


    $("browserBlocked")
      .classList
      .remove("hidden");


    browserExternalURL =
      url;
  }


  function browserHome() {

    $("browserFrame")
      .classList
      .add("hidden");


    $("browserBlocked")
      .classList
      .add("hidden");


    $("browserHomePage")
      .classList
      .remove("hidden");


    $("browserAddress")
      .value = "";


    $("browserTabTitle")
      .textContent =
      "New Tab";
  }


  function addBrowserHistory(url) {

    let history = [];


    try {

      history =
        JSON.parse(
          localStorage.getItem(
            HISTORY_KEY
          )
        ) || [];

    } catch {}


    history =
      history.filter(
        item =>
          item !== url
      );


    history.unshift(url);


    history =
      history.slice(
        0,
        30
      );


    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );


    renderBrowserHistory();
  }


  function renderBrowserHistory() {

    const list =
      $("historyList");


    if (!list)
      return;


    let history = [];


    try {

      history =
        JSON.parse(
          localStorage.getItem(
            HISTORY_KEY
          )
        ) || [];

    } catch {}


    list.innerHTML = "";


    if (!history.length) {

      list.innerHTML =
        `<div style="padding:15px;color:#9da7c2;font-size:11px">
          No browsing history yet.
        </div>`;

      return;
    }


    history.forEach(url => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "history-item";


      button.textContent =
        getDomain(url);


      button.title =
        url;


      button.onclick = () => {

        $("browserHistoryPanel")
          .classList
          .add("hidden");


        loadBrowserURL(url);
      };


      list.appendChild(
        button
      );
    });
  }


  function searchBrowser(value) {

    if (!value)
      return;


    loadBrowserURL(
      value
    );
  }


  $("browserAddress")
    ?.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {

          searchBrowser(
            $("browserAddress")
              .value
          );
        }
      }
    );


  $("browserHomeSearch")
    ?.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {

          searchBrowser(
            $("browserHomeSearch")
              .value
          );
        }
      }
    );


  $("browserHomeSearchButton")
    ?.addEventListener(
      "click",
      () =>
        searchBrowser(
          $("browserHomeSearch")
            .value
        )
    );


  qsa(".quick-links button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          loadBrowserURL(
            button.dataset.url
          )
      );
    });


  $("browserHome")
    ?.addEventListener(
      "click",
      browserHome
    );


  $("browserRefresh")
    ?.addEventListener(
      "click",
      () => {

        if (
          browserCurrentURL
        ) {

          $("browserFrame")
            .src =
            browserCurrentURL;
        }
      }
    );


  $("browserBack")
    ?.addEventListener(
      "click",
      () => {

        if (
          browserPreviousURL
        ) {

          const current =
            browserCurrentURL;

          browserCurrentURL =
            browserPreviousURL;

          browserPreviousURL =
            current;

          $("browserFrame")
            .src =
            browserCurrentURL;

          $("browserAddress")
            .value =
            browserCurrentURL;
        }
      }
    );


  $("browserForward")
    ?.addEventListener(
      "click",
      () => {

        if (
          browserForwardURL
        ) {

          loadBrowserURL(
            browserForwardURL
          );
        }
      }
    );


  $("browserHistoryButton")
    ?.addEventListener(
      "click",
      () => {

        $("browserHistoryPanel")
          .classList
          .toggle("hidden");


        renderBrowserHistory();
      }
    );


  $("clearHistory")
    ?.addEventListener(
      "click",
      () => {

        localStorage.removeItem(
          HISTORY_KEY
        );

        renderBrowserHistory();
      }
    );


  $("browserFavorite")
    ?.addEventListener(
      "click",
      () => {

        if (!browserCurrentURL)
          return;


        let favorites =
          JSON.parse(
            localStorage.getItem(
              "nexus_v14_favorites"
            )
          ) || [];


        if (
          !favorites.includes(
            browserCurrentURL
          )
        ) {

          favorites.push(
            browserCurrentURL
          );


          localStorage.setItem(
            "nexus_v14_favorites",
            JSON.stringify(
              favorites
            )
          );


          $("browserFavorite")
            .textContent =
            "★";


          showNotification(
            "Favorite Added",
            getDomain(
              browserCurrentURL
            )
          );

        } else {

          showNotification(
            "Already Saved",
            "This page is already a favorite."
          );
        }
      }
    );


  $("openExternalButton")
    ?.addEventListener(
      "click",
      () => {

        if (
          browserExternalURL
        ) {

          window.open(
            browserExternalURL,
            "_blank"
          );
        }
      }
    );


  $("newBrowserTab")
    ?.addEventListener(
      "click",
      browserHome
    );


  $("closeBrowserTab")
    ?.addEventListener(
      "click",
      browserHome
    );


  /* =====================================================
     SETTINGS
  ====================================================== */

  $("darkThemeButton")
    ?.addEventListener(
      "click",
      () =>
        setTheme("dark")
    );


  $("lightThemeButton")
    ?.addEventListener(
      "click",
      () =>
        setTheme("light")
    );


  qsa("[data-wallpaper]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          setWallpaper(
            button.dataset.wallpaper
          )
      );
    });


  $("logoutButton")
    ?.addEventListener(
      "click",
      logout
    );


  $("startLogoutButton")
    ?.addEventListener(
      "click",
      logout
    );


  $("deleteAccountButton")
    ?.addEventListener(
      "click",
      () => {

        if (!currentUser)
          return;


        if (
          !confirm(
            `Delete "${currentUser.username}"? This cannot be undone.`
          )
        )
          return;


        delete accounts[
          currentUser.key
        ];


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
      }
    );


  /* =====================================================
     START MENU
  ====================================================== */

  $("startButton")
    ?.addEventListener(
      "click",
      () => {

        $("startMenu")
          .classList
          .toggle("hidden");
      }
    );


  qsa(
    "#startApps [data-app]"
  )
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          openApp(
            button.dataset.app
          )
      );
    });


  $("appSearch")
    ?.addEventListener(
      "input",
      () => {

        const query =
          $("appSearch")
            .value
            .toLowerCase();


        qsa(
          "#startApps button"
        )
          .forEach(button => {

            button.style.display =
              button.textContent
                .toLowerCase()
                .includes(query)
                  ? "flex"
                  : "none";
          });
      }
    );


  /* =====================================================
     WINDOW CONTROLS
  ====================================================== */

  qsa("[data-app]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          openApp(
            button.dataset.app
          )
      );
    });


  qsa(".close-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          closeApp(
            button.closest(
              ".app-window"
            )
          )
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


          if (win)
            win.classList
              .remove("open");


          updateTaskbar();
        }
      );
    });


  /* =====================================================
     NOTIFICATION CLOSE
  ====================================================== */

  $("closeNotification")
    ?.addEventListener(
      "click",
      () =>
        $("notification")
          .classList
          .add("hidden")
    );


  /* =====================================================
     AUTH BUTTONS
  ====================================================== */

  $("showSignupButton")
    ?.addEventListener(
      "click",
      showSignup
    );


  $("showLoginButton")
    ?.addEventListener(
      "click",
      showLogin
    );


  $("loginButton")
    ?.addEventListener(
      "click",
      login
    );


  $("signupButton")
    ?.addEventListener(
      "click",
      signup
    );


  $("loginPassword")
    ?.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        )
          login();
      }
    );


  $("signupPasswordConfirm")
    ?.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        )
          signup();
      }
    );


  $("forgotPasswordButton")
    ?.addEventListener(
      "click",
      () => {

        showNotification(
          "Password Recovery",
          "NEXUS v1.4 stores accounts locally, so automatic email password recovery is unavailable."
        );
      }
    );


  /* =====================================================
     INITIALIZE
  ====================================================== */

  loadAccounts();

  createMemoryGame();

  renderBrowserHistory();

  boot();


  console.log(
    "NEXUS v1.4 loaded — Firebase-free."
  );

});
