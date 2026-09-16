/* =========================================================
   NEXUS v1.4
   COMPLETE STYLE
========================================================= */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

:root {
    --accent: #7c5cff;
    --accent2: #00d4ff;

    --bg: #070711;
    --panel: rgba(20, 20, 38, 0.92);
    --panel2: rgba(30, 30, 55, 0.92);

    --text: #ffffff;
    --muted: #a8a8c5;

    --border: rgba(255,255,255,0.12);

    --danger: #ff4f70;

    --taskbar: rgba(8,8,18,0.88);
}

body.light {
    --bg: #eef1ff;
    --panel: rgba(255,255,255,0.94);
    --panel2: rgba(240,242,255,0.96);

    --text: #171725;
    --muted: #666680;

    --border: rgba(0,0,0,0.12);

    --taskbar: rgba(255,255,255,0.88);
}

body {
    width: 100%;
    height: 100vh;
    overflow: hidden;

    font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    background: var(--bg);
    color: var(--text);
}

/* =========================================================
   GENERAL
========================================================= */

button,
input,
textarea {
    font-family: inherit;
}

button {
    cursor: pointer;
    border: none;
}

.hidden {
    display: none !important;
}


/* =========================================================
   BOOT
========================================================= */

.boot-screen {
    position: fixed;
    inset: 0;

    z-index: 99999;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background:
        radial-gradient(
            circle at center,
            #15122e 0%,
            #070711 65%
        );

    color: white;
}

.boot-logo,
.auth-logo,
.about-logo {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 90px;
    height: 90px;

    border-radius: 28px;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            var(--accent2)
        );

    font-size: 55px;
    font-weight: 900;

    box-shadow:
        0 0 45px rgba(124,92,255,0.45);

    animation: pulse 2s infinite;
}

.boot-screen h1 {
    margin-top: 20px;
    font-size: 42px;
    letter-spacing: 5px;
}

.boot-screen p {
    margin-top: 10px;
    color: #aaaacc;
}

.boot-loader {
    width: 260px;
    height: 7px;

    margin-top: 30px;

    border-radius: 10px;

    overflow: hidden;

    background: rgba(255,255,255,0.1);
}

#bootProgress {
    width: 0%;
    height: 100%;

    background:
        linear-gradient(
            90deg,
            var(--accent),
            var(--accent2)
        );

    transition: width 0.2s;
}

@keyframes pulse {
    50% {
        transform: scale(1.05);
    }
}


/* =========================================================
   AUTH
========================================================= */

.auth-screen {
    position: fixed;
    inset: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    background:
        radial-gradient(
            circle at 20% 20%,
            rgba(124,92,255,0.25),
            transparent 35%
        ),
        radial-gradient(
            circle at 80% 80%,
            rgba(0,212,255,0.16),
            transparent 35%
        ),
        #070711;

    z-index: 9000;
}

.auth-card {
    width: min(430px, 92vw);

    padding: 35px;

    border: 1px solid var(--border);

    border-radius: 28px;

    background: rgba(20,20,38,0.94);

    box-shadow:
        0 30px 100px rgba(0,0,0,0.5);

    backdrop-filter: blur(25px);

    text-align: center;
}

.auth-logo {
    width: 70px;
    height: 70px;
    margin: 0 auto 15px;

    font-size: 40px;
}

.auth-card h1 {
    font-size: 34px;
    letter-spacing: 4px;
}

.version {
    color: var(--muted);
}

.auth-card h2 {
    margin-top: 25px;
}

.auth-card p {
    color: var(--muted);
    margin: 8px 0 15px;
}

.auth-card input {
    width: 100%;

    margin-top: 10px;
    padding: 14px 16px;

    border: 1px solid var(--border);
    border-radius: 13px;

    outline: none;

    background: rgba(255,255,255,0.06);

    color: white;

    transition: 0.2s;
}

.auth-card input:focus {
    border-color: var(--accent);

    box-shadow:
        0 0 0 3px rgba(124,92,255,0.15);
}

.primary-button {
    width: 100%;

    margin-top: 14px;
    padding: 14px;

    border-radius: 13px;

    color: white;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            #5b43d6
        );

    font-weight: 700;

    transition: 0.2s;
}

.primary-button:hover {
    transform: translateY(-2px);

    box-shadow:
        0 8px 25px rgba(124,92,255,0.3);
}

.text-button,
.link-button {
    background: none;
    color: #9f8dff;
    margin-top: 10px;
}

.link-button {
    font-weight: 700;
}

.local-warning {
    margin-top: 25px;
    padding: 12px;

    border-radius: 12px;

    background: rgba(255,255,255,0.05);

    color: var(--muted);

    font-size: 13px;
}


/* =========================================================
   DESKTOP
========================================================= */

.desktop {
    position: fixed;
    inset: 0;
}

.wallpaper {
    position: absolute;
    inset: 0;

    z-index: 0;

    background:
        radial-gradient(
            circle at 20% 20%,
            rgba(124,92,255,0.4),
            transparent 35%
        ),
        radial-gradient(
            circle at 80% 70%,
            rgba(0,212,255,0.2),
            transparent 35%
        ),
        linear-gradient(
            135deg,
            #09091a,
            #151034
        );

    transition: 0.5s;
}

.wallpaper.purple {
    background:
        radial-gradient(
            circle at 30% 30%,
            #a855f7,
            transparent 35%
        ),
        linear-gradient(
            135deg,
            #18051f,
            #090713
        );
}

.wallpaper.blue {
    background:
        radial-gradient(
            circle at 30% 30%,
            #00bfff,
            transparent 35%
        ),
        linear-gradient(
            135deg,
            #03141d,
            #070a16
        );
}

.wallpaper.green {
    background:
        radial-gradient(
            circle at 30% 30%,
            #00d084,
            transparent 35%
        ),
        linear-gradient(
            135deg,
            #03160f,
            #070d0a
        );
}


/* =========================================================
   DESKTOP ICONS
========================================================= */

.desktop-icons {
    position: absolute;

    top: 25px;
    left: 20px;

    z-index: 2;

    display: grid;

    grid-template-columns: repeat(2, 90px);

    gap: 18px;
}

.desktop-icon {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 85px;
    min-height: 80px;

    background: transparent;

    color: white;

    border-radius: 12px;

    padding: 7px;

    transition: 0.15s;
}

.desktop-icon:hover {
    background: rgba(255,255,255,0.12);
}

.desktop-icon span {
    font-size: 34px;
}

.desktop-icon label {
    margin-top: 5px;

    font-size: 12px;

    text-shadow:
        0 2px 5px black;
}


/* =========================================================
   WINDOWS
========================================================= */

.window {
    position: absolute;

    z-index: 10;

    display: none;

    width: 700px;
    max-width: calc(100vw - 30px);

    height: 500px;
    max-height: calc(100vh - 90px);

    left: 50%;
    top: 45%;

    transform: translate(-50%, -50%);

    overflow: hidden;

    border: 1px solid var(--border);

    border-radius: 17px;

    background: var(--panel);

    box-shadow:
        0 30px 90px rgba(0,0,0,0.5);

    backdrop-filter: blur(25px);
}

.window.open {
    display: block;

    animation: windowOpen 0.18s ease;
}

.window.minimized {
    display: none;
}

@keyframes windowOpen {
    from {
        opacity: 0;
        transform:
            translate(-50%, -50%)
            scale(0.96);
    }

    to {
        opacity: 1;
        transform:
            translate(-50%, -50%)
            scale(1);
    }
}

.window-header {
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 15px;

    background:
        rgba(255,255,255,0.05);

    border-bottom: 1px solid var(--border);

    font-weight: 700;
}

.window-header button {
    width: 30px;
    height: 30px;

    border-radius: 8px;

    color: var(--text);

    background: transparent;

    font-size: 19px;
}

.window-header button:hover {
    background: rgba(255,255,255,0.12);
}

.close-button:hover {
    background: #ff4565 !important;
    color: white !important;
}

.window-content {
    height: calc(100% - 48px);

    overflow: auto;

    padding: 20px;
}


/* =========================================================
   NOTEPAD
========================================================= */

.notepad-content {
    display: flex;
    flex-direction: column;
}

.notepad-toolbar,
.file-toolbar,
.paint-toolbar {
    display: flex;
    gap: 8px;

    margin-bottom: 12px;

    flex-wrap: wrap;
}

.notepad-toolbar button,
.file-toolbar button,
.paint-toolbar button,
.settings-content button {
    padding: 9px 13px;

    border-radius: 9px;

    color: var(--text);

    background: rgba(255,255,255,0.08);

    border: 1px solid var(--border);
}

.notepad-toolbar button:hover,
.file-toolbar button:hover,
.paint-toolbar button:hover,
.settings-content button:hover {
    background: rgba(124,92,255,0.25);
}

#notepad {
    flex: 1;

    width: 100%;

    resize: none;

    padding: 15px;

    border: 1px solid var(--border);
    border-radius: 12px;

    background: rgba(0,0,0,0.2);

    color: var(--text);

    outline: none;

    line-height: 1.6;
}

.status-bar {
    display: flex;
    justify-content: space-between;

    margin-top: 8px;

    color: var(--muted);

    font-size: 12px;
}


/* =========================================================
   CALCULATOR
========================================================= */

.calculator-display {
    width: 100%;

    padding: 18px;

    margin-bottom: 15px;

    border: 1px solid var(--border);
    border-radius: 12px;

    background: rgba(0,0,0,0.25);

    color: var(--text);

    text-align: right;

    font-size: 28px;

    outline: none;
}

.calculator-grid {
    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 9px;
}

.calculator-grid button {
    min-height: 55px;

    border-radius: 12px;

    background:
        rgba(255,255,255,0.08);

    color: var(--text);

    font-size: 18px;

    border: 1px solid var(--border);
}

.calculator-grid button:hover {
    background:
        rgba(124,92,255,0.3);
}

.calculator-grid .equals {
    background:
        linear-gradient(
            135deg,
            var(--accent),
            #5140d5
        );
}


/* =========================================================
   FILES
========================================================= */

.file-layout {
    display: grid;

    grid-template-columns: 200px 1fr;

    gap: 15px;

    height: calc(100% - 60px);
}

.file-list {
    overflow: auto;

    border: 1px solid var(--border);
    border-radius: 12px;

    padding: 8px;

    background: rgba(0,0,0,0.15);
}

.file-item {
    width: 100%;

    padding: 11px;

    margin-bottom: 5px;

    border-radius: 8px;

    text-align: left;

    background: transparent;

    color: var(--text);
}

.file-item:hover,
.file-item.active {
    background:
        rgba(124,92,255,0.25);
}

.file-editor {
    display: flex;
    flex-direction: column;

    gap: 10px;
}

.file-editor input,
.file-editor textarea {
    width: 100%;

    padding: 12px;

    border: 1px solid var(--border);
    border-radius: 10px;

    background: rgba(0,0,0,0.2);

    color: var(--text);

    outline: none;
}

.file-editor textarea {
    flex: 1;
    resize: none;
}


/* =========================================================
   PAINT
========================================================= */

.paint-toolbar {
    align-items: center;
}

.paint-toolbar label {
    display: flex;
    align-items: center;
    gap: 8px;
}

#paintCanvas {
    display: block;

    width: 100%;
    height: calc(100% - 60px);

    min-height: 300px;

    border-radius: 12px;

    background: white;

    cursor: crosshair;

    touch-action: none;
}


/* =========================================================
   GAMES
========================================================= */

.game-menu {
    text-align: center;
}

.game-menu h2 {
    font-size: 30px;
}

.game-menu > p {
    color: var(--muted);
    margin: 5px 0 20px;
}

.game-cards {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 15px;
}

.game-card {
    display: flex;
    flex-direction: column;

    align-items: center;

    padding: 22px;

    min-height: 150px;

    border: 1px solid var(--border);

    border-radius: 17px;

    background:
        rgba(255,255,255,0.06);

    color: var(--text);

    transition: 0.2s;
}

.game-card:hover {
    transform: translateY(-4px);

    border-color:
        rgba(124,92,255,0.6);

    background:
        rgba(124,92,255,0.14);
}

.game-card span {
    font-size: 42px;
}

.game-card strong {
    margin-top: 8px;
}

.game-card small {
    margin-top: 5px;
    color: var(--muted);
}

.game-screen {
    text-align: center;
}

.back-game {
    padding: 8px 12px;

    border-radius: 8px;

    background: rgba(255,255,255,0.08);

    color: var(--text);
}

.game-screen h2 {
    margin-top: 15px;
}

.catch-area {
    position: relative;

    width: 100%;
    height: 280px;

    margin-top: 15px;

    border-radius: 15px;

    border: 1px solid var(--border);

    background:
        radial-gradient(
            circle at center,
            rgba(124,92,255,0.2),
            rgba(0,0,0,0.2)
        );

    overflow: hidden;
}

#catchTarget {
    position: absolute;

    width: 48px;
    height: 48px;

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            var(--accent2)
        );

    color: white;

    font-size: 20px;
    font-weight: 900;

    box-shadow:
        0 0 20px rgba(0,212,255,0.4);
}

.click-rush-button {
    width: 220px;
    height: 100px;

    margin-top: 30px;

    border-radius: 20px;

    background:
        linear-gradient(
            135deg,
            #ff4f70,
            #ff8a00
        );

    color: white;

    font-size: 28px;

    font-weight: 900;
}

.click-rush-button:disabled {
    opacity: 0.4;
}

.memory-board {
    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 8px;

    max-width: 400px;

    margin: 20px auto;
}

.memory-card {
    aspect-ratio: 1;

    border-radius: 10px;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            #4030a5
        );

    color: transparent;

    font-size: 24px;

    font-weight: 800;
}

.memory-card.revealed,
.memory-card.matched {
    background:
        rgba(255,255,255,0.1);

    color: var(--text);
}

#snakeCanvas {
    display: block;

    width: 400px;
    max-width: 100%;

    margin: 15px auto;

    background: #050509;

    border:
        1px solid var(--border);

    border-radius: 10px;
}


/* =========================================================
   BROWSER
========================================================= */

.browser-window {
    width: 900px;
    height: 620px;
}

.browser-toolbar {
    display: flex;
    align-items: center;

    gap: 7px;

    padding: 9px;

    background:
        rgba(0,0,0,0.18);

    border-bottom:
        1px solid var(--border);
}

.browser-toolbar button,
.browser-extra button {
    min-width: 35px;
    height: 35px;

    border-radius: 8px;

    background:
        rgba(255,255,255,0.07);

    color: var(--text);

    border: 1px solid var(--border);
}

.browser-toolbar button:hover,
.browser-extra button:hover {
    background:
        rgba(124,92,255,0.25);
}

#browserAddress {
    flex: 1;

    height: 35px;

    padding: 0 13px;

    border-radius: 18px;

    border:
        1px solid var(--border);

    background:
        rgba(255,255,255,0.07);

    color: var(--text);

    outline: none;
}

.browser-extra {
    display: flex;

    gap: 7px;

    padding: 7px 9px;

    border-bottom:
        1px solid var(--border);
}

.browser-page {
    position: relative;

    height: calc(100% - 142px);

    background:
        var(--panel2);
}

#browserFrame {
    width: 100%;
    height: 100%;

    border: none;

    background: white;
}

.browser-home {
    height: 100%;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    text-align: center;
}

.browser-logo {
    width: 75px;
    height: 75px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 23px;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            var(--accent2)
        );

    font-size: 40px;
    font-weight: 900;
}

.browser-home h1 {
    margin-top: 15px;
}

.browser-home p {
    color: var(--muted);
}

.quick-sites {
    display: flex;

    gap: 10px;

    margin-top: 25px;
}

.quick-sites button {
    padding: 12px 18px;

    border-radius: 12px;

    color: var(--text);

    background:
        rgba(255,255,255,0.07);

    border:
        1px solid var(--border);
}

.browser-blocked {
    height: 100%;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    text-align: center;

    padding: 30px;
}

.browser-blocked p {
    max-width: 500px;

    margin: 10px 0;

    color: var(--muted);
}

.browser-blocked .primary-button {
    width: auto;

    padding: 11px 18px;
}

.browser-status {
    height: 35px;

    display: flex;
    align-items: center;

    padding: 0 12px;

    border-top:
        1px solid var(--border);

    color: var(--muted);

    font-size: 12px;
}

.browser-history {
    position: absolute;

    z-index: 100;

    top: 92px;
    right: 10px;

    width: 300px;
    max-height: 350px;

    overflow: auto;

    background:
        var(--panel);

    border:
        1px solid var(--border);

    border-radius: 13px;

    box-shadow:
        0 20px 50px rgba(0,0,0,0.5);
}

.history-header {
    display: flex;
    justify-content: space-between;

    padding: 12px;

    border-bottom:
        1px solid var(--border);
}

.history-header button {
    background: transparent;
    color: var(--text);
}

.history-item {
    display: block;

    width: 100%;

    padding: 10px;

    text-align: left;

    background: transparent;

    color: var(--text);

    border-bottom:
        1px solid var(--border);
}

.history-item:hover {
    background:
        rgba(124,92,255,0.15);
}


/* =========================================================
   SETTINGS
========================================================= */

.settings-profile {
    display: flex;
    align-items: center;

    gap: 15px;

    padding-bottom: 20px;

    border-bottom:
        1px solid var(--border);
}

.profile-avatar,
.start-avatar {
    display: flex;

    align-items: center;
    justify-content: center;

    width: 55px;
    height: 55px;

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            var(--accent2)
        );

    font-size: 25px;
}

.settings-profile p {
    color: var(--muted);
}

.settings-content h3 {
    margin-top: 22px;
    margin-bottom: 10px;
}

.settings-content input {
    width: 100%;

    padding: 11px;

    border:
        1px solid var(--border);

    border-radius: 10px;

    background:
        rgba(0,0,0,0.15);

    color: var(--text);

    outline: none;
}

.settings-buttons {
    display: flex;

    flex-wrap: wrap;

    gap: 8px;
}

.danger-button {
    margin-right: 8px;

    background:
        rgba(255,79,112,0.12) !important;

    color:
        #ff7891 !important;
}


/* =========================================================
   ABOUT
========================================================= */

.about-content {
    text-align: center;
}

.about-logo {
    width: 75px;
    height: 75px;

    margin: 10px auto 15px;

    font-size: 42px;
}

.about-content h1 {
    font-size: 35px;
    letter-spacing: 4px;
}

.feature-list {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 8px;

    margin-top: 25px;
}

.feature-list div {
    padding: 12px;

    border:
        1px solid var(--border);

    border-radius: 10px;

    background:
        rgba(255,255,255,0.05);
}


/* =========================================================
   START MENU
========================================================= */

.start-menu {
    position: absolute;

    z-index: 1000;

    left: 10px;
    bottom: 68px;

    width: 330px;
    max-height: 70vh;

    overflow: auto;

    padding: 15px;

    border:
        1px solid var(--border);

    border-radius: 18px;

    background:
        var(--panel);

    box-shadow:
        0 25px 70px rgba(0,0,0,0.5);

    backdrop-filter: blur(25px);

    animation: startOpen 0.15s ease;
}

@keyframes startOpen {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.start-profile {
    display: flex;

    align-items: center;

    gap: 12px;

    padding-bottom: 15px;

    border-bottom:
        1px solid var(--border);
}

.start-profile small {
    display: block;

    margin-top: 3px;

    color: var(--muted);
}

.start-apps {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 7px;

    margin-top: 15px;
}

.start-apps button,
.start-bottom button {
    padding: 12px;

    border-radius: 10px;

    text-align: left;

    background:
        rgba(255,255,255,0.06);

    color: var(--text);
}

.start-apps button:hover,
.start-bottom button:hover {
    background:
        rgba(124,92,255,0.2);
}

.start-bottom {
    margin-top: 15px;

    border-top:
        1px solid var(--border);

    padding-top: 12px;
}


/* =========================================================
   TASKBAR
========================================================= */

.taskbar {
    position: absolute;

    z-index: 2000;

    bottom: 0;
    left: 0;
    right: 0;

    height: 58px;

    display: flex;
    align-items: center;

    padding: 7px 10px;

    background:
        var(--taskbar);

    border-top:
        1px solid var(--border);

    backdrop-filter: blur(25px);
}

.start-button {
    height: 42px;

    padding: 0 16px;

    border-radius: 11px;

    color: white;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            #4c38c9
        );

    font-weight: 800;
}

.taskbar-apps {
    display: flex;

    gap: 5px;

    margin-left: 10px;

    flex: 1;
}

.taskbar-app {
    height: 42px;

    min-width: 42px;

    padding: 0 10px;

    border-radius: 9px;

    background:
        rgba(255,255,255,0.07);

    color: var(--text);
}

.taskbar-app.active {
    background:
        rgba(124,92,255,0.3);
}

.taskbar-right {
    display: flex;
    align-items: center;

    gap: 15px;

    color: var(--text);

    padding: 0 8px;
}

#taskbarClock {
    font-variant-numeric: tabular-nums;
}


/* =========================================================
   TOAST
========================================================= */

#toastContainer {
    position: absolute;

    z-index: 9999;

    right: 20px;
    bottom: 75px;

    display: flex;
    flex-direction: column;

    gap: 8px;
}

.toast {
    min-width: 250px;

    padding: 13px 15px;

    border:
        1px solid var(--border);

    border-radius: 12px;

    background:
        var(--panel);

    box-shadow:
        0 15px 40px rgba(0,0,0,0.4);

    animation:
        toastIn 0.2s ease;
}

@keyframes toastIn {
    from {
        opacity: 0;
        transform: translateX(30px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}


/* =========================================================
   CLOCK OVERLAY
========================================================= */

.clock-overlay {
    position: absolute;

    z-index: 3;

    right: 35px;
    top: 30px;

    text-align: right;

    pointer-events: none;

    text-shadow:
        0 4px 20px rgba(0,0,0,0.6);
}

#bigClock {
    font-size: clamp(35px, 6vw, 75px);

    font-weight: 800;

    letter-spacing: -3px;
}

#bigDate {
    color: rgba(255,255,255,0.7);

    font-size: 14px;
}


/* =========================================================
   SMALL TEXT
========================================================= */

.small-text {
    color: var(--muted);

    font-size: 12px;
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

    .desktop-icons {
        grid-template-columns:
            repeat(4, 70px);

        left: 8px;
        top: 15px;

        gap: 8px;
    }

    .desktop-icon {
        width: 65px;
    }

    .desktop-icon span {
        font-size: 28px;
    }

    .desktop-icon label {
        font-size: 10px;
    }

    .window {
        width: calc(100vw - 16px);
        height: calc(100vh - 80px);
    }

    .browser-window {
        width: calc(100vw - 16px);
    }

    .game-cards {
        grid-template-columns:
            1fr;
    }

    .file-layout {
        grid-template-columns:
            1fr;
    }

    .file-list {
        max-height: 120px;
    }

    .feature-list {
        grid-template-columns:
            1fr;
    }

    .start-menu {
        width: calc(100vw - 20px);
    }

    .clock-overlay {
        top: 15px;
        right: 15px;
    }

    #bigClock {
        font-size: 38px;
    }
}
