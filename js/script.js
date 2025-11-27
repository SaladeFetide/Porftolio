// --- BOOT SEQUENCE ---
window.onload = function() {
    setTimeout(() => {
        document.getElementById('boot-msg').innerHTML = "Starting LoukaOS 98... OK";
    }, 1500);
    setTimeout(() => {
        document.getElementById('boot-screen').style.display = 'none';
        playStartupSound();
    }, 3000);
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
    'win-minesweeper': { title: 'Démineur', icon: 'https://win98icons.alexmeub.com/icons/png/game_mine_1-0.png' }
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
    }
    isDragging = false;
    currentElement = null;
    dragType = null;
});

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
