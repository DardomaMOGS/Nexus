/* =========================================================
   NEXUS v1.2
   MULTI-USER SYSTEM
   ========================================================= */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "dardomamogs.firebaseapp.com",
  projectId: "dardomamogs",
  storageBucket: "dardomamogs.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-67XLGPBFNT"
};


/* =========================================================
   FIREBASE INITIALIZATION
   ========================================================= */

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentUser = null;
let currentProfile = null;

let selectedFile = null;

let calculatorValue = "";

let gameScore = 0;
let gameRunning = false;

let saveNotesTimer = null;


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = id => document.getElementById(id);

const qs = selector => document.querySelector(selector);

const qsa = selector => document.querySelectorAll(selector);


/* =========================================================
   AUTH ERROR TRANSLATION
   ========================================================= */

function readableAuthError(error) {

  const code = error.code || "";

  const messages = {

    "auth/invalid-email":
      "That email address is not valid.",

    "auth/user-not-found":
      "No account was found with that email.",

    "auth/wrong-password":
      "The password is incorrect.",

    "auth/invalid-credential":
      "The email or password is incorrect.",

    "auth/email-already-in-use":
      "An account with this email already exists.",

    "auth/weak-password":
      "Please choose a stronger password.",

    "auth/too-many-requests":
      "Too many attempts. Please try again later.",

    "auth/network-request-failed":
      "Network error. Check your internet connection."

  };

  return messages[code] || error.message || "Something went wrong.";

}


/* =========================================================
   AUTH UI
   ========================================================= */

function showLogin() {

  $("loginPanel").classList.remove("hidden");
  $("signupPanel").classList.add("hidden");

  $("loginError").textContent = "";
  $("signupError").textContent = "";

}


function showSignup() {

  $("loginPanel").classList.add("hidden");
  $("signupPanel").classList.remove("hidden");

  $("loginError").textContent = "";
  $("signupError").textContent = "";

}


/* =========================================================
   SIGN UP
   ========================================================= */

async function signup() {

  const username = $("signupUsername").value.trim();
  const email = $("signupEmail").value.trim();
  const password = $("signupPassword").value;
  const confirm = $("signupPasswordConfirm").value;

  $("signupError").textContent = "";

  if (!username) {
    $("signupError").textContent = "Please choose a username.";
    return;
  }

  if (username.length < 2) {
    $("signupError").textContent = "Username must be at least 2 characters.";
    return;
  }

  if (!email) {
    $("signupError").textContent = "Please enter your email.";
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

  $("signupButton").disabled = true;
  $("signupButton").textContent = "Creating...";

  try {

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = credential.user;

    const profile = {

      username: username,

      email: user.email,

      createdAt: Date.now(),

      theme: "dark",

      wallpaper: "default",

      notes: "",

      files: {

        "Welcome.txt":
          "Welcome to NEXUS v1.2!\n\nThis file belongs to your account."

      }

    };

    await setDoc(
      doc(db, "users", user.uid),
      profile
    );

    showNotification(
      "Account Created",
      `Welcome to NEXUS, ${username}!`
    );

  } catch (error) {

    console.error(error);

    $("signupError").textContent =
      readableAuthError(error);

  }

  $("signupButton").disabled = false;
  $("signupButton").textContent = "🚀 Create Account";

}


/* =========================================================
   LOGIN
   ========================================================= */

async function login() {

  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;

  $("loginError").textContent = "";

  if (!email || !password) {

    $("loginError").textContent =
      "Please enter your email and password.";

    return;

  }

  $("loginButton").disabled = true;
  $("loginButton").textContent = "Logging in...";

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  } catch (error) {

    console.error(error);

    $("loginError").textContent =
      readableAuthError(error);

  }

  $("loginButton").disabled = false;
  $("loginButton").textContent = "🔐 Login";

}


/* =========================================================
   PASSWORD RESET
   ========================================================= */

async function resetPassword() {

  const email = prompt(
    "Enter the email address for your NEXUS account:"
  );

  if (!email) return;

  try {

    await sendPasswordResetEmail(
      auth,
      email.trim()
    );

    showNotification(
      "Password Reset",
      "Check your email for the password reset message."
    );

  } catch (error) {

    alert(readableAuthError(error));

  }

}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logout() {

  try {

    await signOut(auth);

  } catch (error) {

    console.error(error);

  }

}


/* =========================================================
   USER PROFILE
   ========================================================= */

async function loadProfile(user) {

  const profileRef =
    doc(db, "users", user.uid);

  const profileSnapshot =
    await getDoc(profileRef);

  if (!profileSnapshot.exists()) {

    const fallbackProfile = {

      username:
        user.email
          ? user.email.split("@")[0]
          : "User",

      email: user.email || "",

      createdAt: Date.now(),

      theme: "dark",

      wallpaper: "default",

      notes: "",

      files: {}

    };

    await setDoc(
      profileRef,
      fallbackProfile
    );

    currentProfile = fallbackProfile;

  } else {

    currentProfile =
      profileSnapshot.data();

  }

  currentUser = user;

  applyProfile();

}


/* =========================================================
   APPLY PROFILE
   ========================================================= */

function applyProfile() {

  if (!currentUser || !currentProfile) return;

  const username =
    currentProfile.username || "User";

  $("settingsUsername").textContent =
    username;

  $("settingsEmail").textContent =
    currentUser.email || "";

  $("startUsername").textContent =
    username;

  $("startEmail").textContent =
    currentUser.email || "";

  $("notesArea").value =
    currentProfile.notes || "";

  applyTheme(
    currentProfile.theme || "dark"
  );

  applyWallpaper(
    currentProfile.wallpaper || "default"
  );

  renderFiles();

}


/* =========================================================
   SAVE USER PROFILE
   ========================================================= */

async function saveProfile(changes) {

  if (!currentUser) return;

  try {

    await updateDoc(
      doc(db, "users", currentUser.uid),
      changes
    );

    Object.assign(
      currentProfile,
      changes
    );

  } catch (error) {

    console.error(
      "Could not save profile:",
      error
    );

    showNotification(
      "Save Error",
      "Your changes could not be saved."
    );

  }

}


/* =========================================================
   NEXUS STARTUP
   ========================================================= */

async function startNexus() {

  $("authScreen").classList.add("hidden");

  $("loadingScreen").classList.remove("hidden");

  $("loadingText").textContent =
    "Loading your NEXUS...";

  let progress = 0;

  const loadingInterval =
    setInterval(() => {

      progress += 10;

      $("loadingProgress").style.width =
        `${progress}%`;

      if (progress >= 100) {

        clearInterval(loadingInterval);

        $("loadingScreen").classList.add("hidden");

        $("desktop").classList.remove("hidden");

        showNotification(
          "NEXUS Ready",
          `Welcome back, ${currentProfile.username}!`
        );

      }

    }, 60);

}


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(
  auth,
  async user => {

    if (user) {

      try {

        await loadProfile(user);

        await startNexus();

      } catch (error) {

        console.error(error);

        $("authScreen").classList.remove("hidden");

        alert(
          "NEXUS could not load your account data."
        );

      }

    } else {

      currentUser = null;
      currentProfile = null;

      $("desktop").classList.add("hidden");

      $("loadingScreen").classList.add("hidden");

      $("authScreen").classList.remove("hidden");

      showLogin();

    }

  }
);


/* =========================================================
   OPEN APP
   ========================================================= */

function openApp(appName) {

  const windowElement =
    $(`${appName}Window`);

  if (!windowElement) return;

  qsa(".app-window").forEach(win => {

    win.classList.remove("open");

  });

  windowElement.classList.add("open");

  updateTaskbar();

}


/* =========================================================
   CLOSE APP
   ========================================================= */

function closeApp(windowElement) {

  if (!windowElement) return;

  windowElement.classList.remove("open");

  updateTaskbar();

}


/* =========================================================
   TASKBAR
   ========================================================= */

function updateTaskbar() {

  const container =
    $("taskbarApps");

  container.innerHTML = "";

  qsa(".app-window.open").forEach(win => {

    const button =
      document.createElement("button");

    button.className =
      "taskbar-app active";

    const title =
      win.querySelector(".window-header span");

    button.textContent =
      title
        ? title.textContent
        : "App";

    button.onclick = () => {

      win.classList.toggle("hidden");

    };

    container.appendChild(button);

  });

}


/* =========================================================
   WINDOW BUTTONS
   ========================================================= */

qsa(".close-button").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      closeApp(
        button.closest(".app-window")
      );

    }
  );

});


qsa(".minimize-button").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const win =
        button.closest(".app-window");

      win.classList.remove("open");

      updateTaskbar();

    }
  );

});


/* =========================================================
   DESKTOP APP BUTTONS
   ========================================================= */

qsa("[data-app]").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      openApp(
        button.dataset.app
      );

      $("startMenu").classList.add("hidden");

    }
  );

});


/* =========================================================
   START MENU
   ========================================================= */

$("startButton").addEventListener(
  "click",
  () => {

    $("startMenu").classList.toggle("hidden");

  }
);


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

  const now = new Date();

  let hours =
    now.getHours();

  let minutes =
    now.getMinutes();

  hours =
    String(hours).padStart(2, "0");

  minutes =
    String(minutes).padStart(2, "0");

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

$("notesArea").addEventListener(
  "input",
  () => {

    $("notesStatus").textContent =
      "Saving...";

    clearTimeout(
      saveNotesTimer
    );

    saveNotesTimer =
      setTimeout(
        async () => {

          await saveProfile({
            notes:
              $("notesArea").value
          });

          $("notesStatus").textContent =
            "Saved";

        },
        700
      );

  }
);


$("clearNotesButton").addEventListener(
  "click",
  async () => {

    $("notesArea").value = "";

    await saveProfile({
      notes: ""
    });

    $("notesStatus").textContent =
      "Saved";

  }
);


/* =========================================================
   CALCULATOR
   ========================================================= */

qsa("[data-calc]").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const value =
        button.dataset.calc;

      if (value === "clear") {

        calculatorValue = "";

      } else if (value === "backspace") {

        calculatorValue =
          calculatorValue.slice(0, -1);

      } else if (value === "=") {

        try {

          if (
            !/^[0-9+\-*/().\s]+$/
              .test(calculatorValue)
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

          calculatorValue = "Error";

        }

      } else {

        if (calculatorValue === "Error") {
          calculatorValue = "";
        }

        calculatorValue += value;

      }

      $("calculatorDisplay").value =
        calculatorValue;

    }
  );

});


/* =========================================================
   FILE MANAGER
   ========================================================= */

function renderFiles() {

  const list =
    $("fileList");

  list.innerHTML = "";

  const files =
    currentProfile?.files || {};

  Object.keys(files).forEach(filename => {

    const item =
      document.createElement("div");

    item.className =
      "file-item";

    item.textContent =
      `📄 ${filename}`;

    item.addEventListener(
      "click",
      () => {

        selectedFile =
          filename;

        $("fileEditor").value =
          files[filename];

        qsa(".file-item").forEach(
          element =>
            element.classList.remove("selected")
        );

        item.classList.add("selected");

      }
    );

    list.appendChild(item);

  });

}


$("newFileButton").addEventListener(
  "click",
  async () => {

    const filename =
      prompt(
        "Enter a name for the new file:"
      );

    if (!filename) return;

    const cleanName =
      filename.trim();

    if (!cleanName) return;

    if (!currentProfile.files) {
      currentProfile.files = {};
    }

    currentProfile.files[cleanName] = "";

    selectedFile =
      cleanName;

    $("fileEditor").value = "";

    await saveProfile({
      files:
        currentProfile.files
    });

    renderFiles();

    showNotification(
      "File Created",
      cleanName
    );

  }
);


$("saveFileButton").addEventListener(
  "click",
  async () => {

    if (!selectedFile) {

      showNotification(
        "No File Selected",
        "Choose a file first."
      );

      return;

    }

    currentProfile.files[selectedFile] =
      $("fileEditor").value;

    await saveProfile({
      files:
        currentProfile.files
    });

    showNotification(
      "File Saved",
      selectedFile
    );

  }
);


$("deleteFileButton").addEventListener(
  "click",
  async () => {

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

    delete currentProfile.files[
      selectedFile
    ];

    await saveProfile({
      files:
        currentProfile.files
    });

    selectedFile = null;

    $("fileEditor").value = "";

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
      (event.clientX - rect.left)
      * (canvas.width / rect.width),

    y:
      (event.clientY - rect.top)
      * (canvas.height / rect.height)

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


$("clearCanvasButton").addEventListener(
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


$("saveDrawingButton").addEventListener(
  "click",
  () => {

    const image =
      canvas.toDataURL("image/png");

    const link =
      document.createElement("a");

    link.href =
      image;

    link.download =
      "nexus-drawing.png";

    link.click();

  }
);


/* =========================================================
   GAME
   ========================================================= */

function moveGameTarget() {

  const area =
    $("gameArea");

  const target =
    $("gameTarget");

  const maxX =
    area.clientWidth -
    target.offsetWidth;

  const maxY =
    area.clientHeight -
    target.offsetHeight;

  target.style.left =
    `${Math.random() * maxX}px`;

  target.style.top =
    `${Math.random() * maxY}px`;

}


$("gameTarget").addEventListener(
  "click",
  () => {

    if (!gameRunning) return;

    gameScore++;

    $("gameScore").textContent =
      gameScore;

    moveGameTarget();

  }
);


$("startGameButton").addEventListener(
  "click",
  () => {

    gameScore = 0;

    gameRunning = true;

    $("gameScore").textContent =
      "0";

    $("gameTarget").style.display =
      "block";

    moveGameTarget();

    showNotification(
      "Game Started",
      "Catch the N!"
    );

  }
);


/* =========================================================
   THEME
   ========================================================= */

async function applyTheme(theme) {

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


$("darkThemeButton").addEventListener(
  "click",
  async () => {

    applyTheme("dark");

    await saveProfile({
      theme: "dark"
    });

  }
);


$("lightThemeButton").addEventListener(
  "click",
  async () => {

    applyTheme("light");

    await saveProfile({
      theme: "light"
    });

  }
);


/* =========================================================
   WALLPAPERS
   ========================================================= */

async function applyWallpaper(name) {

  const wallpaper =
    $("wallpaper");

  wallpaper.className =
    "wallpaper";

  if (name !== "default") {

    wallpaper.classList.add(
      name
    );

  }

}


qsa("[data-wallpaper]").forEach(
  button => {

    button.addEventListener(
      "click",
      async () => {

        const wallpaper =
          button.dataset.wallpaper;

        applyWallpaper(
          wallpaper
        );

        await saveProfile({
          wallpaper:
            wallpaper
        });

      }
    );

  }
);


/* =========================================================
   CHANGE PASSWORD
   ========================================================= */

$("changePasswordButton").addEventListener(
  "click",
  async () => {

    if (!currentUser) return;

    const oldPassword =
      prompt(
        "Enter your current password:"
      );

    if (!oldPassword) return;

    const newPassword =
      prompt(
        "Enter your new password:"
      );

    if (!newPassword) return;

    if (newPassword.length < 6) {

      alert(
        "Your new password must be at least 6 characters."
      );

      return;

    }

    try {

      const credential =
        EmailAuthProvider.credential(
          currentUser.email,
          oldPassword
        );

      await reauthenticateWithCredential(
        currentUser,
        credential
      );

      await updatePassword(
        currentUser,
        newPassword
      );

      showNotification(
        "Password Changed",
        "Your password was successfully changed."
      );

    } catch (error) {

      console.error(error);

      alert(
        readableAuthError(error)
      );

    }

  }
);


/* =========================================================
   LOGOUT BUTTONS
   ========================================================= */

$("logoutButton").addEventListener(
  "click",
  logout
);

$("startLogoutButton").addEventListener(
  "click",
  logout
);


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

let notificationTimer = null;

function showNotification(
  title,
  message
) {

  $("notificationTitle").textContent =
    title;

  $("notificationMessage").textContent =
    message;

  $("notification").classList.remove(
    "hidden"
  );

  clearTimeout(
    notificationTimer
  );

  notificationTimer =
    setTimeout(
      () => {

        $("notification").classList.add(
          "hidden"
        );

      },
      3500
    );

}


/* =========================================================
   LOGIN / SIGNUP BUTTONS
   ========================================================= */

$("loginButton").addEventListener(
  "click",
  login
);

$("signupButton").addEventListener(
  "click",
  signup
);

$("showSignupButton").addEventListener(
  "click",
  showSignup
);

$("showLoginButton").addEventListener(
  "click",
  showLogin
);

$("forgotPasswordButton").addEventListener(
  "click",
  resetPassword
);


/* =========================================================
   ENTER KEY LOGIN
   ========================================================= */

$("loginPassword").addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      login();
    }

  }
);


$("signupPasswordConfirm").addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      signup();
    }

  }
);


/* =========================================================
   PREVENT CONTEXT MENU ON PAINT
   ========================================================= */

canvas.addEventListener(
  "contextmenu",
  event => event.preventDefault()
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

console.log(
  "NEXUS v1.2 loaded."
);

console.log(
  "Firebase multi-user system initialized."
);
