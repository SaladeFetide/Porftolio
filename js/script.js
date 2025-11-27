// --- BOOT SEQUENCE ---
window.onload = function() {
    loadIconPositions(); // Load saved positions
    setTimeout(() => {
        document.getElementById('boot-msg').innerHTML = "Starting LoukaOS 98... OK";
    }, 1500);
    setTimeout(() => {
        document.getElementById('boot-screen').style.display = 'none';
        playStartupSound();
    }, 3000);
    initPaint(); // Init Paint
}

function playStartupSound() {
    const audio = new Audio('https://www.myinstants.com/media/sounds/windows-98-startup.mp3');
    audio.play().catch(e => console.log("Audio autoplay blocked:", e));
}

// --- SONS CLIC ---
const clickAudio = new Audio('https://www.myinstants.com/media/sounds/windows-98-click.mp3');
document.addEventListener('mousedown', () => {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(() => {});
});

// --- MENU DÉMARRER ---
const startMenu = document.getElementById('start-menu');
const startBtn = document.getElementById('start-btn');

startBtn.onclick = function(e) {
    e.stopPropagation();
    const isVisible = startMenu.style.display === 'flex';
    startMenu.style.display = isVisible ? 'none' : 'flex';
    startBtn.classList.toggle('active'); // Style enfoncé à ajouter si voulu
};

document.addEventListener('click', function(e) {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.style.display = 'none';
    }
});

// --- HORLOGE & DATE ---
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const timeStr = `${hours}:${minutes} ${ampm}`;
    
    const clockEl = document.getElementById('clock');
    clockEl.textContent = timeStr;
    
    // Tooltip avec la date complète
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    clockEl.title = now.toLocaleDateString('fr-FR', options);
}
setInterval(updateClock, 1000);
updateClock();

// --- BSOD ---
function triggerBSOD() {
    document.getElementById('bsod').style.display = 'block';
    // On peut aussi jouer un son d'erreur
}

// --- GESTION FENÊTRES & BARRE DES TÂCHES ---
const taskbarApps = document.getElementById('taskbar-apps');

// Map pour stocker les infos des fenêtres (titre, icône)
const windowsInfo = {
    'win-about': { title: 'Poste de Louka', icon: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png' },
    'win-projects': { title: 'Mes Projets', icon: 'https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png' },
    'win-skills': { title: 'Compétences.exe', icon: 'https://win98icons.alexmeub.com/icons/png/game_solitaire-1.png' },
    'win-notepad': { title: 'Bloc-notes', icon: 'https://win98icons.alexmeub.com/icons/png/notepad-5.png' },
    'win-contact': { title: 'Contact', icon: 'https://win98icons.alexmeub.com/icons/png/outlook_express-4.png' },
    'win-ie': { title: 'Internet Explorer', icon: 'https://win98icons.alexmeub.com/icons/png/msie1-2.png' },
    'win-terminal': { title: 'MS-DOS Prompt', icon: 'https://win98icons.alexmeub.com/icons/png/console_prompt-0.png' },
    'win-winamp': { title: 'Winamp', icon: 'https://win98icons.alexmeub.com/icons/png/cd_audio_cd_a-3.png' },
    'win-minesweeper': { title: 'Démineur', icon: 'https://win98icons.alexmeub.com/icons/png/game_mine_1-0.png' },
    'win-paint': { title: 'Paint', icon: 'https://win98icons.alexmeub.com/icons/png/paint_file-2.png' }
};

function openWindow(id) {
    const win = document.getElementById(id);
    win.style.display = 'flex';
    bringToFront(win);
    updateTaskbar(id, true);
}

function closeWindow(id) {
    document.getElementById(id).style.display = 'none';
    // Retirer de la barre des tâches
    const appBtn = document.getElementById('btn-' + id);
    if (appBtn) appBtn.remove();
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    win.style.display = 'none';
    // Le bouton reste dans la barre des tâches mais perd la classe active
    const appBtn = document.getElementById('btn-' + id);
    if (appBtn) appBtn.classList.remove('active');
}

// Stockage état avant maximisation
const restoreState = {};

function maximizeWindow(id) {
    const win = document.getElementById(id);
    
    if (win.dataset.maximized === 'true') {
        // RESTORE
        win.style.top = restoreState[id].top;
        win.style.left = restoreState[id].left;
        win.style.width = restoreState[id].width;
        win.style.height = restoreState[id].height;
        win.dataset.maximized = 'false';
    } else {
        // MAXIMIZE
        restoreState[id] = {
            top: win.style.top,
            left: win.style.left,
            width: win.style.width,
            height: win.style.height
        };
        win.style.top = '0';
        win.style.left = '0';
        win.style.width = '100%';
        win.style.height = 'calc(100% - 40px)'; // Minus taskbar
        win.dataset.maximized = 'true';
    }
    bringToFront(win);
}

function toggleWindow(id) {
    const win = document.getElementById(id);
    const appBtn = document.getElementById('btn-' + id);
    
    if (win.style.display === 'none') {
        win.style.display = 'flex';
        bringToFront(win);
        appBtn.classList.add('active');
    } else {
        // Si déjà actif et au premier plan, on minimise
        if (win.style.zIndex == 10) {
            minimizeWindow(id);
        } else {
            // Sinon on met au premier plan
            bringToFront(win);
        }
    }
}

function updateTaskbar(id, isActive) {
    let appBtn = document.getElementById('btn-' + id);
    
    // Créer le bouton s'il n'existe pas
    if (!appBtn) {
        appBtn = document.createElement('div');
        appBtn.id = 'btn-' + id;
        appBtn.className = 'taskbar-app';
        appBtn.onclick = () => toggleWindow(id);
        
        const info = windowsInfo[id] || { title: 'Application', icon: '' };
        
        appBtn.innerHTML = `<img src="${info.icon}"><span>${info.title}</span>`;
        taskbarApps.appendChild(appBtn);
    }

    // Gérer l'état actif
    document.querySelectorAll('.taskbar-app').forEach(btn => btn.classList.remove('active'));
    if (isActive) appBtn.classList.add('active');
}

function bringToFront(element) {
    // Mettre toutes les fenêtres en inactif
    document.querySelectorAll('.window').forEach(w => {
        w.style.zIndex = 1;
        w.classList.add('inactive');
    });
    
    // Activer la fenêtre cible
    element.style.zIndex = 10;
    element.classList.remove('inactive');
    
    // Mettre à jour la barre des tâches
    document.querySelectorAll('.taskbar-app').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('btn-' + element.id);
    if (btn) btn.classList.add('active');
}

// --- DRAG & DROP (FENÊTRES & ICÔNES) ---
let isDragging = false;
let dragType = null; // 'window' or 'icon'
let currentElement = null;
let offsetX, offsetY;

function startDrag(e, windowEl) {
    isDragging = true;
    dragType = 'window';
    currentElement = windowEl;
    bringToFront(windowEl);
    
    // Si maximisé, on ne déplace pas (ou on restaure, mais simple ici)
    if (windowEl.dataset.maximized === 'true') {
        isDragging = false;
        return;
    }

    offsetX = e.clientX - windowEl.getBoundingClientRect().left;
    offsetY = e.clientY - windowEl.getBoundingClientRect().top;
}

function startIconDrag(e, iconEl) {
    e.stopPropagation(); // Empêche de cliquer sur le bureau
    isDragging = true;
    dragType = 'icon';
    currentElement = iconEl;
    currentElement.classList.add('dragging');

    offsetX = e.clientX - iconEl.getBoundingClientRect().left;
    offsetY = e.clientY - iconEl.getBoundingClientRect().top;
}

document.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentElement) return;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    if (dragType === 'window') {
        currentElement.style.left = `${x}px`;
        currentElement.style.top = `${y}px`;
    } else if (dragType === 'icon') {
        // Limites du bureau pour les icônes
        currentElement.style.left = `${x}px`;
        currentElement.style.top = `${y}px`;
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging && dragType === 'icon' && currentElement) {
        currentElement.classList.remove('dragging');
        saveIconPositions(); // Save on drop
    }
    isDragging = false;
    currentElement = null;
    dragType = null;
});

// --- ICON PERSISTENCE ---
function saveIconPositions() {
    const icons = document.querySelectorAll('.icon');
    const positions = [];
    icons.forEach((icon, index) => {
        positions.push({
            index: index,
            left: icon.style.left,
            top: icon.style.top
        });
    });
    localStorage.setItem('iconPositions', JSON.stringify(positions));
}

function loadIconPositions() {
    const saved = localStorage.getItem('iconPositions');
    if (saved) {
        const positions = JSON.parse(saved);
        const icons = document.querySelectorAll('.icon');
        positions.forEach(pos => {
            if (icons[pos.index]) {
                icons[pos.index].style.left = pos.left;
                icons[pos.index].style.top = pos.top;
            }
        });
    }
}

// --- CONTEXT MENU (CLIC DROIT) ---
const ctxMenu = document.getElementById('context-menu');

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    ctxMenu.style.display = 'flex';
    ctxMenu.style.left = e.clientX + 'px';
    ctxMenu.style.top = e.clientY + 'px';
});

document.addEventListener('click', (e) => {
    if (!ctxMenu.contains(e.target)) {
        ctxMenu.style.display = 'none';
    }
});

// Ouvrir la fenêtre principale au démarrage
// openWindow('win-about'); // Déplacé dans le onload pour éviter conflit avec boot screen
setTimeout(() => openWindow('win-about'), 3100);

function copyEmail() {
    const email = "louka.riquoir@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        alert("Email copié dans le presse-papier !");
    }).catch(err => {
        console.error('Erreur lors de la copie :', err);
        alert("Erreur lors de la copie.");
    });
}

// --- TERMINAL (MS-DOS) ---
const cmdInput = document.getElementById('cmd-input');
const terminalOutput = document.getElementById('terminal-output');

if (cmdInput) {
    cmdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            this.value = '';
            
            // Afficher la commande tapée
            terminalOutput.innerHTML += `<div>C:\\WINDOWS> ${command}</div>`;
            
            // Traiter la commande
            let response = '';
            switch(command) {
                case 'help':
                    response = 'COMMANDS: HELP, ABOUT, SKILLS, PROJECTS, CONTACT, CLEAR, EXIT';
                    break;
                case 'about':
                    response = 'LOUKA RIQUOIR - ETUDIANT BUT INFORMATIQUE - PASSIONNE DE BACK-END.';
                    break;
                case 'skills':
                    response = 'JAVA, PYTHON, LUA, SQL, LINUX, GIT...';
                    break;
                case 'projects':
                    response = 'OPENING PROJECTS FOLDER...';
                    openWindow('win-projects');
                    break;
                case 'contact':
                    response = 'OPENING CONTACT...';
                    openWindow('win-contact');
                    break;
                case 'matrix':
                    startMatrix();
                    return;
                case 'clear':
                    terminalOutput.innerHTML = '';
                    return; // Pas de nouvelle ligne
                case 'exit':
                    closeWindow('win-terminal');
                    return;
                case '':
                    break;
                default:
                    response = 'Bad command or file name';
            }
            
            if (response) {
                terminalOutput.innerHTML += `<div>${response}</div>`;
            }
            terminalOutput.innerHTML += '<br>';
            
            // Scroll vers le bas
            const contentArea = document.getElementById('terminal-content');
            contentArea.scrollTop = contentArea.scrollHeight;
        }
    });
}

// --- DÉMINEUR ---
let mineGrid = [];
let mineRows = 9;
let mineCols = 9;
let mineCount = 10;
let mineFlags = 0;
let mineGameOver = false;
let mineTimerInterval;
let mineTime = 0;

function initMinesweeper() {
    const gridEl = document.getElementById('mine-grid');
    gridEl.innerHTML = '';
    mineGrid = [];
    mineFlags = 0;
    mineGameOver = false;
    mineTime = 0;
    document.getElementById('mine-count').textContent = String(mineCount).padStart(3, '0');
    document.getElementById('mine-timer').textContent = '000';
    clearInterval(mineTimerInterval);
    mineTimerInterval = setInterval(() => {
        if (!mineGameOver) {
            mineTime++;
            document.getElementById('mine-timer').textContent = String(Math.min(999, mineTime)).padStart(3, '0');
        }
    }, 1000);

    document.querySelector('.smiley-btn').textContent = '😊';

    // Init grid
    for (let r = 0; r < mineRows; r++) {
        let row = [];
        for (let c = 0; c < mineCols; c++) {
            let cell = {
                r, c,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighbors: 0,
                el: document.createElement('div')
            };
            cell.el.className = 'mine-cell';
            cell.el.onmousedown = (e) => handleMineClick(e, r, c);
            cell.el.oncontextmenu = (e) => { e.preventDefault(); };
            gridEl.appendChild(cell.el);
            row.push(cell);
        }
        mineGrid.push(row);
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        let r = Math.floor(Math.random() * mineRows);
        let c = Math.floor(Math.random() * mineCols);
        if (!mineGrid[r][c].isMine) {
            mineGrid[r][c].isMine = true;
            minesPlaced++;
        }
    }

    // Calc neighbors
    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            if (!mineGrid[r][c].isMine) {
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (r+i >= 0 && r+i < mineRows && c+j >= 0 && c+j < mineCols) {
                            if (mineGrid[r+i][c+j].isMine) count++;
                        }
                    }
                }
                mineGrid[r][c].neighbors = count;
            }
        }
    }
}

function handleMineClick(e, r, c) {
    if (mineGameOver) return;
    const cell = mineGrid[r][c];

    if (e.button === 2) { // Right click (Flag)
        if (!cell.isRevealed) {
            cell.isFlagged = !cell.isFlagged;
            cell.el.textContent = cell.isFlagged ? '🚩' : '';
            cell.el.classList.toggle('flag');
            mineFlags += cell.isFlagged ? 1 : -1;
            document.getElementById('mine-count').textContent = String(mineCount - mineFlags).padStart(3, '0');
        }
    } else if (e.button === 0) { // Left click (Reveal)
        if (cell.isFlagged) return;
        if (cell.isMine) {
            gameOver(false);
        } else {
            revealCell(r, c);
            checkWin();
        }
    }
}

function revealCell(r, c) {
    if (r < 0 || r >= mineRows || c < 0 || c >= mineCols) return;
    const cell = mineGrid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    cell.el.classList.add('revealed');

    if (cell.neighbors > 0) {
        cell.el.textContent = cell.neighbors;
        cell.el.classList.add('c' + cell.neighbors);
    } else {
        // Flood fill
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(r+i, c+j);
            }
        }
    }
}

function gameOver(won) {
    mineGameOver = true;
    clearInterval(mineTimerInterval);
    document.querySelector('.smiley-btn').textContent = won ? '😎' : '😵';
    
    if (!won) {
        // Reveal all mines
        for (let r = 0; r < mineRows; r++) {
            for (let c = 0; c < mineCols; c++) {
                if (mineGrid[r][c].isMine) {
                    mineGrid[r][c].el.classList.add('revealed', 'mine');
                    mineGrid[r][c].el.textContent = '💣';
                }
            }
        }
    }
}

function checkWin() {
    let revealedCount = 0;
    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            if (mineGrid[r][c].isRevealed) revealedCount++;
        }
    }
    if (revealedCount === (mineRows * mineCols - mineCount)) {
        gameOver(true);
    }
}

// Init Minesweeper on load (but window is hidden)
initMinesweeper();

// --- MOBILE OPTIMIZATIONS ---
// Convert double-click to single-click for icons on mobile
if (window.innerWidth <= 768) {
    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            // Only trigger if it has an ondblclick attribute (standard icons)
            // Links with onclick will work natively
            const action = icon.getAttribute('ondblclick');
            if (action) {
                new Function(action)();
            }
        });
    });
}

// --- MATRIX EFFECT ---
let matrixInterval;
function startMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    const terminalContent = document.getElementById('terminal-content');
    
    canvas.style.display = 'block';
    canvas.width = terminalContent.clientWidth;
    canvas.height = terminalContent.clientHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for( let x = 0; x < columns; x++ ) {
        rainDrops[x] = 1;
    }

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for(let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i*fontSize, rainDrops[i]*fontSize);

            if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975){
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    if (matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(draw, 30);
    
    // Stop on click or keypress
    const stopMatrix = () => {
        clearInterval(matrixInterval);
        canvas.style.display = 'none';
        document.removeEventListener('click', stopMatrix);
        document.removeEventListener('keydown', stopMatrix);
    };
    // Delay adding listener to avoid immediate stop
    setTimeout(() => {
        document.addEventListener('click', stopMatrix);
        document.addEventListener('keydown', stopMatrix);
    }, 500);
}

// --- PAINT APP ---
let paintCtx, paintCanvas;
let isPainting = false;
let currentTool = 'pencil';
let currentColor = '#000000';

function initPaint() {
    paintCanvas = document.getElementById('paint-canvas');
    paintCtx = paintCanvas.getContext('2d');
    
    // White background
    paintCtx.fillStyle = 'white';
    paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);

    // Colors
    const colors = ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080FF', '#004080', '#4000FF', '#804000',
                    '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FFFF80', '#00FF80', '#80FFFF', '#8080FF', '#FF80FF', '#FF8040'];
    
    const palette = document.getElementById('color-palette');
    colors.forEach((c, i) => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = c;
        if (i === 0) swatch.classList.add('active');
        swatch.onclick = () => selectColor(c, swatch);
        palette.appendChild(swatch);
    });

    // Events
    paintCanvas.addEventListener('mousedown', startPainting);
    paintCanvas.addEventListener('mousemove', drawPaint);
    paintCanvas.addEventListener('mouseup', stopPainting);
    paintCanvas.addEventListener('mouseleave', stopPainting);
}

function selectTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tool-' + tool).classList.add('active');
}

function selectColor(color, el) {
    currentColor = color;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
}

function clearCanvas() {
    paintCtx.fillStyle = 'white';
    paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
}

function startPainting(e) {
    isPainting = true;
    drawPaint(e);
}

function stopPainting() {
    isPainting = false;
    paintCtx.beginPath();
}

function drawPaint(e) {
    if (!isPainting) return;

    const rect = paintCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    paintCtx.lineWidth = 2;
    paintCtx.lineCap = 'round';

    if (currentTool === 'pencil') {
        paintCtx.strokeStyle = currentColor;
        paintCtx.lineTo(x, y);
        paintCtx.stroke();
        paintCtx.beginPath();
        paintCtx.moveTo(x, y);
    } else if (currentTool === 'eraser') {
        paintCtx.fillStyle = 'white';
        paintCtx.fillRect(x-5, y-5, 10, 10);
    }
}

// --- SHUTDOWN ---
function triggerShutdown() {
    // Fade out effect
    document.body.style.transition = "filter 1s ease";
    document.body.style.filter = "grayscale(100%) brightness(0.5)";
    
    setTimeout(() => {
        document.getElementById('shutdown-screen').style.display = 'flex';
        document.body.style.filter = "none"; // Reset for the black screen
    }, 1000);
}

// --- CLIPPY ---
const clippyPhrases = [
    "Il semble que vous cherchiez un développeur. Voulez-vous de l'aide ?",
    "Astuce : Double-cliquez sur les icônes pour les ouvrir.",
    "Je vois que vous regardez mon CV. Excellent choix !",
    "N'oubliez pas de tester le Démineur !",
    "Besoin d'un site web ? Louka est là pour ça !",
    "Tapez 'matrix' dans le terminal pour un effet cool.",
    "Vous pouvez changer le fond d'écran avec un clic droit !"
];

function showClippy() {
    const clippy = document.getElementById('clippy');
    clippy.style.display = 'flex';
    clippyTalk();
}

function clippyTalk() {
    const textEl = document.getElementById('clippy-text');
    const phrase = clippyPhrases[Math.floor(Math.random() * clippyPhrases.length)];
    textEl.textContent = phrase;
}

// Show Clippy randomly
setTimeout(showClippy, 10000);
setInterval(() => {
    if (Math.random() > 0.7) showClippy();
}, 30000);


// --- WALLPAPER CHANGER ---
function updatePreview() {
    const select = document.getElementById('wallpaper-select');
    const preview = document.getElementById('preview-screen');
    const val = select.value;
    
    let bg = '';
    if (val === 'teal') bg = '#008080';
    else if (val === 'clouds') bg = 'url(https://win98icons.alexmeub.com/images/clouds-wallpaper.jpg)'; // Exemple
    else if (val === 'matrix') bg = 'black';
    else if (val === 'red') bg = '#800000';
    else if (val === 'black') bg = '#000000';

    preview.style.background = bg;
    preview.style.backgroundSize = 'cover';
}

function applyWallpaper() {
    const select = document.getElementById('wallpaper-select');
    const val = select.value;
    
    if (val === 'teal') {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#008080';
    } else if (val === 'clouds') {
        document.body.style.backgroundImage = "url('https://win98icons.alexmeub.com/images/clouds-wallpaper.jpg')"; // Placeholder
        document.body.style.backgroundSize = "cover";
    } else if (val === 'matrix') {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = 'black';
        // On pourrait lancer l'effet matrix en background mais restons simple
    } else if (val === 'red') {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#800000';
    } else if (val === 'black') {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#000000';
    }
    closeWindow('win-properties');
}

// --- DESKTOP SELECTION (RUBBER BAND) ---
const selectionBox = document.getElementById('selection-box');
let startX, startY;

document.addEventListener('mousedown', (e) => {
    // Only on desktop (body) directly
    if (e.target === document.body || e.target.classList.contains('desktop')) {
        isDragging = true; // Reuse existing flag or create new one
        dragType = 'selection';
        startX = e.clientX;
        startY = e.clientY;
        
        selectionBox.style.left = startX + 'px';
        selectionBox.style.top = startY + 'px';
        selectionBox.style.width = '0px';
        selectionBox.style.height = '0px';
        selectionBox.style.display = 'block';
    }
});

document.addEventListener('mousemove', (e) => {
    if (dragType === 'selection') {
        const currentX = e.clientX;
        const currentY = e.clientY;
        
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        const left = Math.min(currentX, startX);
        const top = Math.min(currentY, startY);
        
        selectionBox.style.width = width + 'px';
        selectionBox.style.height = height + 'px';
        selectionBox.style.left = left + 'px';
        selectionBox.style.top = top + 'px';
    }
});

document.addEventListener('mouseup', () => {
    if (dragType === 'selection') {
        selectionBox.style.display = 'none';
        dragType = null;
        isDragging = false;
    }
});

// --- KONAMI CODE ---
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateKonami();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateKonami() {
    alert("CHEAT CODE ACTIVATED: GOD MODE (Just kidding, but here's a cool effect)");
    document.body.style.filter = "invert(100%)";
    setTimeout(() => {
        document.body.style.filter = "none";
    }, 5000);
}
