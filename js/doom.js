
// --- DOOM-LIKE RAYCASTING ENGINE (Premium Edition V5 - ULTRA ENHANCED) ---
// New Features: Mini-Map, Shooting System, Particles, Advanced Post-Processing, Premium HUD

const mapWidth = 24;
const mapHeight = 24;
let screenWidth = 640;
let screenHeight = 480;
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
let keys = { w: false, s: false, a: false, d: false, shift: false, space: false };

// Textures
const texWall = new Image();
const sprayGun = new Image();
let loadedCount = 0;
const totalAssets = 2;

// NEW: Advanced game state
let particles = [];
let shootFlash = 0;
let gunRecoil = 0;
let lastFrameTime = Date.now();
let fps = 60;
let frameCount = 0;
let fpsUpdateTime = Date.now();

// Particle system
class Particle {
    constructor(x, y, vx, vy, life, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.color = color;
    }

    update(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
        this.vy += 0.5 * delta; // gravity
        this.life -= delta;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        const size = 2 + (1 - alpha) * 2;
        ctx.fillStyle = this.color.replace('1)', `${alpha})`);
        ctx.fillRect(this.x, this.y, size, size);
    }

    isDead() {
        return this.life <= 0;
    }
}

function checkLoaded() {
    loadedCount++;
    if (loadedCount === totalAssets) {
        console.log("✅ All Doom assets loaded!");
    }
}

function resizeCanvas() {
    const canvas = document.getElementById('doom-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    screenWidth = Math.floor(rect.width);
    screenHeight = Math.floor(rect.height);

    // Update canvas size
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    console.log(`📐 Canvas resized to: ${screenWidth}x${screenHeight}`);
}

function initDoom() {
    console.log("🎮 Initializing Doom Engine V5 (ULTRA PREMIUM EDITION)...");
    const canvas = document.getElementById('doom-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set initial size from container
    resizeCanvas();
    ctx.imageSmoothingEnabled = false;

    loadedCount = 0;

    texWall.src = 'assets/images/doom_wall.png';
    texWall.onload = checkLoaded;

    sprayGun.src = 'assets/images/doom_gun.png?v=' + new Date().getTime();
    sprayGun.onload = checkLoaded;

    // Enhanced Controls
    const keyHandler = (e, pressed) => {
        if (e.key === 'z' || e.key === 'ArrowUp') keys.w = pressed;
        if (e.key === 's' || e.key === 'ArrowDown') keys.s = pressed;
        if (e.key === 'q' || e.key === 'ArrowLeft') keys.a = pressed;
        if (e.key === 'd' || e.key === 'ArrowRight') keys.d = pressed;
        if (e.key === 'Shift') keys.shift = pressed;
        if (e.key === ' ') {
            keys.space = pressed;
            if (pressed) shoot();
        }
    };

    window.addEventListener('keydown', (e) => keyHandler(e, true));
    window.addEventListener('keyup', (e) => keyHandler(e, false));

    // Click to shoot
    canvas.addEventListener('click', shoot);

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    if (loopId) cancelAnimationFrame(loopId);
    loop();
}

function shoot() {
    shootFlash = 1.0;
    gunRecoil = 15;

    // Create muzzle flash particles
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        particles.push(new Particle(
            screenWidth / 2,
            screenHeight - 100,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed - 2,
            0.3 + Math.random() * 0.3,
            'rgba(255, 200, 100, 1)'
        ));
    }
}

function stopDoom() {
    if (loopId) cancelAnimationFrame(loopId);
    window.removeEventListener('resize', resizeCanvas);
}

function loop() {
    const canvas = document.getElementById('doom-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // FPS Calculation
    const now = Date.now();
    const delta = (now - lastFrameTime) / 16.67; // normalized to 60fps
    lastFrameTime = now;

    frameCount++;
    if (now - fpsUpdateTime > 1000) {
        fps = frameCount;
        frameCount = 0;
        fpsUpdateTime = now;
    }

    // 1. Enhanced Environment with floor/ceiling textures
    const ceilingGrad = ctx.createLinearGradient(0, 0, 0, screenHeight / 2);
    ceilingGrad.addColorStop(0, '#0a0a1f');
    ceilingGrad.addColorStop(0.5, '#1a1a3e');
    ceilingGrad.addColorStop(1, '#2a2a4e');
    ctx.fillStyle = ceilingGrad;
    ctx.fillRect(0, 0, screenWidth, screenHeight / 2);

    // Floor with perspective grid effect
    const floorGrad = ctx.createLinearGradient(0, screenHeight / 2, 0, screenHeight);
    floorGrad.addColorStop(0, '#3a1a1a');
    floorGrad.addColorStop(1, '#1a0a0a');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, screenHeight / 2, screenWidth, screenHeight / 2);

    // Add subtle grid to floor
    ctx.strokeStyle = 'rgba(100, 50, 50, 0.1)';
    ctx.lineWidth = 1;
    for (let y = screenHeight / 2; y < screenHeight; y += 20) {
        const perspective = (y - screenHeight / 2) / (screenHeight / 2);
        ctx.globalAlpha = perspective * 0.3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(screenWidth, y);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 2. Raycasting with Enhanced Lighting
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
                texX, 0, 1, texHeight,
                x, drawStart, 1, drawEnd - drawStart
            );

            // Enhanced Dynamic lighting
            const lightIntensity = 1 - Math.min(perpWallDist / 12, 0.75);
            if (side === 0) {
                ctx.fillStyle = `rgba(255, 100, 50, ${lightIntensity * 0.2})`;
            } else {
                ctx.fillStyle = `rgba(50, 150, 255, ${lightIntensity * 0.15})`;
            }
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        } else {
            ctx.fillStyle = (side === 1) ? '#8B0000' : '#B22222';
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }

        // Enhanced FOG
        if (perpWallDist > 0.5) {
            let fogOpacity = Math.pow((perpWallDist - 0.5) / 10, 1.3);
            if (fogOpacity > 0.85) fogOpacity = 0.85;
            ctx.fillStyle = `rgba(10, 5, 20, ${fogOpacity})`;
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }
    }

    // 3. Atmospheric Particles (dust, ambient)
    if (Math.random() < 0.1) {
        particles.push(new Particle(
            Math.random() * screenWidth,
            screenHeight / 2 + Math.random() * screenHeight / 2,
            (Math.random() - 0.5) * 0.5,
            -Math.random() * 0.3,
            2 + Math.random() * 2,
            'rgba(150, 150, 180, 1)'
        ));
    }

    // Update and draw particles
    particles = particles.filter(p => {
        p.update(delta);
        p.draw(ctx);
        return !p.isDead();
    });

    // 4. Weapon with Shooting Animation (Responsive)
    const time = Date.now() / 180;
    const moveFactor = (keys.w || keys.s || keys.a || keys.d) ? 1 : 0;

    const bobX = Math.sin(time * 1.5) * 8 * moveFactor;
    const bobY = Math.abs(Math.sin(time * 3)) * 6 * moveFactor;
    const breatheY = Math.sin(Date.now() / 1000) * 2;

    // Decay effects
    shootFlash *= 0.9;
    gunRecoil *= 0.85;

    if (canRenderTextures && sprayGun.complete && sprayGun.naturalWidth > 0) {
        // Adaptation responsive de la taille de l'arme
        const baseGunScale = Math.min(screenWidth / 640, screenHeight / 480);
        const gunW = 600 * baseGunScale;
        const gunH = 600 * baseGunScale;
        const gunX = (screenWidth - gunW) / 2 + bobX;
        const gunY = (screenHeight - gunH + 60 * baseGunScale) + bobY + breatheY - gunRecoil;

        // Muzzle flash
        if (shootFlash > 0.1) {
            ctx.shadowColor = `rgba(255, 200, 100, ${shootFlash})`;
            ctx.shadowBlur = 40 * shootFlash;
            ctx.fillStyle = `rgba(255, 220, 150, ${shootFlash * 0.5})`;
            ctx.fillRect(screenWidth / 2 - 30, screenHeight - 150 * baseGunScale, 60, 40);
        }

        ctx.shadowColor = 'rgba(255, 120, 60, 0.4)';
        ctx.shadowBlur = 25;

        try {
            ctx.drawImage(sprayGun, gunX, gunY, gunW, gunH);
        } catch (err) {
            console.warn("Erreur de rendu doom_gun.png:", err);
            // Fallback: simple rectangle représentant l'arme
            ctx.fillStyle = '#666';
            ctx.fillRect(gunX + gunW / 3, gunY, gunW / 3, gunH);
        }

        ctx.shadowBlur = 0;
    } else if (!canRenderTextures || !sprayGun.complete) {
        // Fallback pendant le chargement ou en cas d'erreur
        const gunW = 120;
        const gunH = 120;
        ctx.fillStyle = '#666';
        ctx.fillRect((screenWidth - gunW) / 2 + bobX, screenHeight - gunH + bobY + breatheY - gunRecoil, gunW, gunH);
    }

    // 5. Crosshair
    ctx.lineWidth = 2;
    const chSize = 10;
    const chX = screenWidth / 2;
    const chY = screenHeight / 2;

    ctx.beginPath();
    ctx.moveTo(chX - chSize, chY);
    ctx.lineTo(chX - 3, chY);
    ctx.moveTo(chX + 3, chY);
    ctx.lineTo(chX + chSize, chY);
    ctx.moveTo(chX, chY - chSize);
    ctx.lineTo(chX, chY - 3);
    ctx.moveTo(chX, chY + 3);
    ctx.lineTo(chX, chY + chSize);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.fillRect(chX - 1, chY - 1, 2, 2);

    // 6. MINI-MAP (Radar Style - Responsive)
    // Masquer sur très petits écrans
    if (screenWidth > 350) {
        const miniMapSize = Math.min(120, screenWidth * 0.25, screenHeight * 0.25);
        const miniMapX = screenWidth - miniMapSize - 15;
        const miniMapY = 15;
        const miniScale = miniMapSize / mapWidth;

        // Mini-map background
        ctx.fillStyle = 'rgba(0, 20, 40, 0.85)';
        ctx.fillRect(miniMapX, miniMapY, miniMapSize, miniMapSize);

        ctx.strokeStyle = 'rgba(0, 200, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(miniMapX, miniMapY, miniMapSize, miniMapSize);

        // Draw mini-map grid
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                if (worldMap[x][y] === 1) {
                    ctx.fillStyle = 'rgba(100, 150, 200, 0.7)';
                    ctx.fillRect(
                        miniMapX + x * miniScale,
                        miniMapY + y * miniScale,
                        miniScale,
                        miniScale
                    );
                }
            }
        }

        // Player position on mini-map
        const playerMiniX = miniMapX + posX * miniScale;
        const playerMiniY = miniMapY + posY * miniScale;

        ctx.fillStyle = 'rgba(0, 255, 100, 0.9)';
        ctx.beginPath();
        ctx.arc(playerMiniX, playerMiniY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Direction indicator
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playerMiniX, playerMiniY);
        ctx.lineTo(
            playerMiniX + dirX * miniScale * 2,
            playerMiniY + dirY * miniScale * 2
        );
        ctx.stroke();
    }

    // 7. Premium CRT Effects
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    for (let i = 0; i < screenHeight; i += 3) {
        ctx.fillRect(0, i, screenWidth, 1);
    }

    const vignette = ctx.createRadialGradient(
        screenWidth / 2, screenHeight / 2, screenHeight / 4,
        screenWidth / 2, screenHeight / 2, screenHeight * 0.9
    );
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(0.7, "rgba(10, 5, 20, 0.4)");
    vignette.addColorStop(1, "rgba(10, 5, 30, 0.8)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    // Chromatic aberration
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.015)';
    ctx.fillRect(-1, 0, screenWidth, screenHeight);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.015)';
    ctx.fillRect(1, 0, screenWidth, screenHeight);
    ctx.globalCompositeOperation = 'source-over';

    // 8. Enhanced HUD (Responsive)
    const hudHeight = Math.max(40, Math.min(60, screenHeight * 0.125));
    const hudGrad = ctx.createLinearGradient(0, screenHeight - hudHeight, 0, screenHeight);
    hudGrad.addColorStop(0, 'rgba(15, 5, 25, 0.9)');
    hudGrad.addColorStop(1, 'rgba(5, 2, 10, 0.95)');
    ctx.fillStyle = hudGrad;
    ctx.fillRect(0, screenHeight - hudHeight, screenWidth, hudHeight);

    const borderGrad = ctx.createLinearGradient(0, screenHeight - hudHeight - 2, 0, screenHeight - hudHeight);
    borderGrad.addColorStop(0, 'rgba(255, 80, 80, 0.7)');
    borderGrad.addColorStop(1, 'rgba(255, 80, 80, 0)');
    ctx.fillStyle = borderGrad;
    ctx.fillRect(0, screenHeight - hudHeight - 2, screenWidth, 2);

    // Adaptation des tailles de police
    const baseFontScale = Math.min(screenWidth / 640, 1.2);
    const hudFontSize = Math.floor(24 * baseFontScale);
    const subFontSize = Math.floor(16 * baseFontScale);
    const tinyFontSize = Math.floor(12 * baseFontScale);
    const microFontSize = Math.floor(11 * baseFontScale);

    // HUD Text
    ctx.shadowColor = "#ff4444";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#ff6666";
    ctx.font = `bold ${hudFontSize}px 'Courier New', monospace`;
    ctx.fillText("⚡ AMMO: ∞", 10, screenHeight - hudHeight + 35);

    ctx.shadowColor = "#44ff44";
    ctx.fillStyle = "#66ff66";
    ctx.fillText("❤ HP: 100%", screenWidth - 160 * baseFontScale, screenHeight - hudHeight + 35);

    // FPS Counter (masqué sur très petits écrans)
    if (screenWidth > 400) {
        ctx.shadowColor = "#4488ff";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#88bbff";
        ctx.font = `bold ${subFontSize}px 'Courier New', monospace`;
        ctx.fillText(`FPS: ${fps}`, screenWidth / 2 - 35, screenHeight - hudHeight + 25);

        ctx.font = `bold ${tinyFontSize}px 'Courier New', monospace`;
        ctx.fillText("⚡ ULTRA EDITION V5", screenWidth / 2 - 75, screenHeight - hudHeight + 45);
    }

    // Instructions adaptées
    ctx.fillStyle = "#ffaa44";
    ctx.shadowColor = "#ff8844";
    ctx.font = `bold ${microFontSize}px 'Courier New', monospace`;

    if (screenWidth > 500) {
        ctx.fillText("[SPACE] Shoot • [WASD] Move • [SHIFT] Sprint", 15, screenHeight - 5);
    } else {
        ctx.fillText("[SPACE] • [WASD] • [SHIFT]", 15, screenHeight - 5);
    }

    ctx.shadowBlur = 0;

    // 9. Movement with Sprint
    const sprintMultiplier = keys.shift ? 1.8 : 1.0;
    const moveSpeed = 0.08 * sprintMultiplier * delta;
    const rotSpeed = 0.05 * delta;

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
