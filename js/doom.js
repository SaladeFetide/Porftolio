
// --- DOOM-LIKE RAYCASTING ENGINE (Deluxe V3) ---
// High Quality Update: CRT, HUD, Crosshair, Robust Loading

const mapWidth = 24;
const mapHeight = 24;
const screenWidth = 640;
const screenHeight = 480;
const texWidth = 64;
const texHeight = 64;

// 1 = wall
const worldMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Player state
let posX = 22, posY = 12;
let dirX = -1, dirY = 0;
let planeX = 0, planeY = 0.66;

let loopId = null;
let keys = { w: false, s: false, a: false, d: false };

// Textures
const texWall = new Image();
const sprayGun = new Image();
let loadedCount = 0;
const totalAssets = 2; // Wall + Gun

function checkLoaded() {
    loadedCount++;
    if (loadedCount === totalAssets) {
        console.log("All Doom assets loaded!");
    }
}

function initDoom() {
    console.log("Initializing Doom Engine V3 (Visuals)...");
    const canvas = document.getElementById('doom-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fit canvas
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    ctx.imageSmoothingEnabled = false; // Important for pixel art

    // Reset loader
    loadedCount = 0;

    // Load Wall
    texWall.src = 'assets/images/doom_wall.png';
    texWall.onload = checkLoaded;

    // Load Gun (Directly, transparency handled by user)
    sprayGun.src = 'assets/images/doom_gun.png';
    sprayGun.onload = checkLoaded;

    // Controls
    window.addEventListener('keydown', (e) => {
        if (e.key === 'w' || e.key === 'ArrowUp') keys.w = true;
        if (e.key === 's' || e.key === 'ArrowDown') keys.s = true;
        if (e.key === 'a' || e.key === 'ArrowLeft') keys.a = true;
        if (e.key === 'd' || e.key === 'ArrowRight') keys.d = true;
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'w' || e.key === 'ArrowUp') keys.w = false;
        if (e.key === 's' || e.key === 'ArrowDown') keys.s = false;
        if (e.key === 'a' || e.key === 'ArrowLeft') keys.a = false;
        if (e.key === 'd' || e.key === 'ArrowRight') keys.d = false;
    });

    if (loopId) cancelAnimationFrame(loopId);
    loop();
}

function stopDoom() {
    if (loopId) cancelAnimationFrame(loopId);
}

function loop() {
    const canvas = document.getElementById('doom-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 1. Draw Environment (Ceiling/Floor)
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, screenWidth, screenHeight / 2);
    ctx.fillStyle = '#222';
    ctx.fillRect(0, screenHeight / 2, screenWidth, screenHeight / 2);

    // 2. Raycasting
    const canRenderTextures = (loadedCount === totalAssets);

    for (let x = 0; x < screenWidth; x++) {
        let cameraX = 2 * x / screenWidth - 1;
        let rayDirX = dirX + planeX * cameraX;
        let rayDirY = dirY + planeY * cameraX;

        let mapX = Math.floor(posX);
        let mapY = Math.floor(posY);

        let sideDistX, sideDistY;
        let deltaDistX = (rayDirX === 0) ? 1e30 : Math.abs(1 / rayDirX);
        let deltaDistY = (rayDirY === 0) ? 1e30 : Math.abs(1 / rayDirY);
        let perpWallDist;
        let stepX, stepY;
        let hit = 0;
        let side;

        if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (posX - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - posX) * deltaDistX;
        }
        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (posY - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - posY) * deltaDistY;
        }

        while (hit === 0) {
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }
            if (worldMap[mapX][mapY] > 0) hit = 1;
        }

        if (side === 0) perpWallDist = (sideDistX - deltaDistX);
        else perpWallDist = (sideDistY - deltaDistY);

        let lineHeight = Math.floor(screenHeight / perpWallDist);
        let drawStart = -lineHeight / 2 + screenHeight / 2;
        if (drawStart < 0) drawStart = 0;
        let drawEnd = lineHeight / 2 + screenHeight / 2;
        if (drawEnd >= screenHeight) drawEnd = screenHeight - 1;

        if (canRenderTextures) {
            let wallX;
            if (side == 0) wallX = posY + perpWallDist * rayDirY;
            else wallX = posX + perpWallDist * rayDirX;
            wallX -= Math.floor(wallX);

            let texX = Math.floor(wallX * texWidth);
            if (side == 0 && rayDirX > 0) texX = texWidth - texX - 1;
            if (side == 1 && rayDirY < 0) texX = texWidth - texX - 1;

            ctx.drawImage(texWall,
                texX, 0, 1, texHeight, // Source strip
                x, drawStart, 1, drawEnd - drawStart // Dest strip
            );
        } else {
            // Fallback
            ctx.fillStyle = (side === 1) ? '#660000' : '#880000';
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }

        // FOG
        if (perpWallDist > 1) {
            let opacity = (perpWallDist - 1) / 8; // Tweaked fog
            if (opacity > 0.8) opacity = 0.8;
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }
    }

    // 3. Weapon Sprite (Bobbing)
    const time = Date.now() / 150;
    const moveFactor = (keys.w || keys.s || keys.a || keys.d) ? 1 : 0;
    const bobX = Math.cos(time) * 12 * moveFactor; // Reduced sway
    const bobY = Math.abs(Math.sin(time)) * 10 * moveFactor;

    if (canRenderTextures) {
        const gunW = 256;
        const gunH = 256;
        const gunX = (screenWidth - gunW) / 2 + bobX;
        const gunY = (screenHeight - gunH + 30) + bobY;
        ctx.drawImage(sprayGun, gunX, gunY, gunW, gunH);
    }

    // 4. CRT Scanlines Effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    for (let i = 0; i < screenHeight; i += 2) {
        ctx.fillRect(0, i, screenWidth, 1);
    }
    // Vignette
    const grad = ctx.createRadialGradient(screenWidth / 2, screenHeight / 2, screenHeight / 3, screenWidth / 2, screenHeight / 2, screenHeight);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    // 5. Crosshair
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenWidth / 2 - 5, screenHeight / 2);
    ctx.lineTo(screenWidth / 2 + 5, screenHeight / 2);
    ctx.moveTo(screenWidth / 2, screenHeight / 2 - 5);
    ctx.lineTo(screenWidth / 2, screenHeight / 2 + 5);
    ctx.stroke();

    // 6. Retro HUD Bar
    ctx.fillStyle = "#444";
    ctx.fillRect(0, screenHeight - 40, screenWidth, 40);
    ctx.strokeStyle = "#777";
    ctx.strokeRect(0, screenHeight - 40, screenWidth, 40);

    // HUD Text
    ctx.fillStyle = "#ff3333";
    ctx.font = "bold 20px 'Courier New', monospace";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 0;
    ctx.fillText("AMMO: ∞", 20, screenHeight - 15);
    ctx.fillText("HEALTH: 100%", screenWidth - 160, screenHeight - 15);
    ctx.fillStyle = "white";
    ctx.font = "12px monospace";
    ctx.fillText("DOOM 98 - SHAREWARE", screenWidth / 2 - 60, screenHeight - 15);

    // Movement
    const moveSpeed = 0.08;
    const rotSpeed = 0.05;

    if (keys.w) {
        if (worldMap[Math.floor(posX + dirX * moveSpeed)][Math.floor(posY)] === 0) posX += dirX * moveSpeed;
        if (worldMap[Math.floor(posX)][Math.floor(posY + dirY * moveSpeed)] === 0) posY += dirY * moveSpeed;
    }
    if (keys.s) {
        if (worldMap[Math.floor(posX - dirX * moveSpeed)][Math.floor(posY)] === 0) posX -= dirX * moveSpeed;
        if (worldMap[Math.floor(posX)][Math.floor(posY - dirY * moveSpeed)] === 0) posY -= dirY * moveSpeed;
    }
    if (keys.d) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
        dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
        planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
    }
    if (keys.a) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
        dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
        planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
    }

    loopId = requestAnimationFrame(loop);
}

// Export global to window
window.initDoom = initDoom;
window.stopDoom = stopDoom;
