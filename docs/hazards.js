// ==========================================
// SCOUT: RECON RUN
// HAZARDS SYSTEM
// LANDMINES + HEARTS + EXPLOSIONS
// ==========================================


// ==========================================
// GAME HEALTH
// ==========================================

const MAX_HEALTH = 3;

let scoutHealth = MAX_HEALTH;
let gameOver = false;


// ==========================================
// ENTRANCE / RESPAWN
// ==========================================

const RESPAWN_X = 100;
const RESPAWN_Y = 360;


// ==========================================
// LANDMINES
// ==========================================

const mines = [

    // ENTRANCE AREA
    { x: 240, y: 360, triggered: false },
    { x: 270, y: 160, triggered: false },
    { x: 330, y: 240, triggered: false },

    // TOP SECTION
    { x: 520, y: 140, triggered: false },
    { x: 620, y: 180, triggered: false },
    { x: 810, y: 130, triggered: false },
    { x: 930, y: 180, triggered: false },
    { x: 1010, y: 140, triggered: false },

    // MIDDLE SECTION
    { x: 390, y: 360, triggered: false },
    { x: 500, y: 380, triggered: false },
    { x: 720, y: 240, triggered: false },
    { x: 780, y: 440, triggered: false },
    { x: 920, y: 350, triggered: false },

    // TRAP ROOMS
    { x: 420, y: 460, triggered: false },
    { x: 1020, y: 430, triggered: false },

    // LOWER SECTION
    { x: 300, y: 630, triggered: false },
    { x: 520, y: 630, triggered: false },
    { x: 820, y: 630, triggered: false },
    { x: 1020, y: 630, triggered: false },

    // OBJECTIVE APPROACH
    { x: 1080, y: 500, triggered: false },
    { x: 1140, y: 380, triggered: false },
    { x: 1160, y: 240, triggered: false },
    { x: 1150, y: 580, triggered: false }

];


// ==========================================
// EXPLOSIONS
// ==========================================

let explosions = [];


// ==========================================
// EXPLOSION AUDIO
// ==========================================

let explosionAudioContext = null;


function setupExplosionAudio() {

    if (!explosionAudioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return;

        explosionAudioContext =
            new AudioContext();

    }

}


// ==========================================
// EXPLOSION SOUND
// ==========================================

function playExplosionSound() {

    setupExplosionAudio();

    if (!explosionAudioContext) return;

    if (
        explosionAudioContext.state ===
        "suspended"
    ) {

        explosionAudioContext.resume();

    }

    const now =
        explosionAudioContext.currentTime;


    // ======================================
    // LOW EXPLOSION
    // ======================================

    const oscillator =
        explosionAudioContext.createOscillator();

    const gain =
        explosionAudioContext.createGain();

    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(
        100,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        30,
        now + 0.45
    );

    gain.gain.setValueAtTime(
        0.5,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.45
    );

    oscillator.connect(gain);
    gain.connect(
        explosionAudioContext.destination
    );

    oscillator.start(now);

    oscillator.stop(
        now + 0.45
    );


    // ======================================
    // HIGH BURST
    // ======================================

    const burst =
        explosionAudioContext.createOscillator();

    const burstGain =
        explosionAudioContext.createGain();

    burst.type = "square";

    burst.frequency.setValueAtTime(
        220,
        now
    );

    burst.frequency.exponentialRampToValueAtTime(
        50,
        now + 0.18
    );

    burstGain.gain.setValueAtTime(
        0.12,
        now
    );

    burstGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.18
    );

    burst.connect(burstGain);

    burstGain.connect(
        explosionAudioContext.destination
    );

    burst.start(now);

    burst.stop(
        now + 0.18
    );

}


// ==========================================
// CREATE EXPLOSION PARTICLES
// ==========================================

function createExplosionParticles() {

    const particles = [];


    // ======================================
    // FIRE / SPARK PARTICLES
    // ======================================

    for (let i = 0; i < 22; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            2 +
            Math.random() * 5;

        particles.push({

            type: "spark",

            x: 0,
            y: 0,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            size:
                2 +
                Math.random() * 3,

            life:
                18 +
                Math.random() * 25

        });

    }


    // ======================================
    // SMOKE PARTICLES
    // ======================================

    for (let i = 0; i < 10; i++) {

        particles.push({

            type: "smoke",

            x:
                (Math.random() - 0.5) *
                15,

            y:
                (Math.random() - 0.5) *
                15,

            vx:
                (Math.random() - 0.5) *
                0.8,

            vy:
                -0.5 -
                Math.random() * 1.2,

            size:
                5 +
                Math.random() * 7,

            life:
                35 +
                Math.random() * 35

        });

    }

    return particles;

}


// ==========================================
// MINE COLLISION
// ==========================================

function checkMineCollision() {

    if (gameOver) return;


    // Don't trigger another mine while
    // an explosion is happening.

    if (explosions.length > 0) {
        return;
    }


    for (const mine of mines) {

        if (mine.triggered) {
            continue;
        }


        const dx =
            scout.x - mine.x;

        const dy =
            scout.y - mine.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance < 28) {

            triggerMine(mine);

            return;

        }

    }

}


// ==========================================
// TRIGGER MINE
// ==========================================

function triggerMine(mine) {

    if (gameOver) return;


    // ======================================
    // MARK MINE AS TRIGGERED
    // ======================================

    mine.triggered = true;


    // ======================================
    // REMOVE HEART
    // ======================================

    scoutHealth--;

    if (scoutHealth < 0) {
        scoutHealth = 0;
    }


    // ======================================
    // CREATE EXPLOSION
    // ======================================

    explosions.push({

        x: mine.x,
        y: mine.y,

        age: 0,

        duration: 65,

        particles:
            createExplosionParticles()

    });


    // ======================================
    // SOUND
    // ======================================

    playExplosionSound();


    // ======================================
    // SCREEN SHAKE
    // ======================================

    screenShake = 14;


    // ======================================
    // GAME OVER
    // ======================================

    if (scoutHealth <= 0) {

        gameOver = true;


        // Let the explosion play before
        // showing the failed screen.

        setTimeout(() => {

            showMissionFailed();

        }, 700);

        return;

    }


    // ======================================
    // NORMAL RESPAWN
    // ======================================

    setTimeout(() => {

        if (gameOver) return;

        scout.x =
            RESPAWN_X;

        scout.y =
            RESPAWN_Y;

        scout.rotation = 0;

    }, 550);

}


// ==========================================
// RESET MINES
// ==========================================

function resetMines() {

    for (const mine of mines) {

        mine.triggered = false;

    }

}


// ==========================================
// RESET GAME STATE
// ==========================================

function resetGameState() {

    // ======================================
    // GAME STATE
    // ======================================

    gameOver = false;


    // ======================================
    // HEALTH
    // ======================================

    scoutHealth =
        MAX_HEALTH;


    // ======================================
    // MINES
    // ======================================

    resetMines();


    // ======================================
    // EXPLOSIONS
    // ======================================

    explosions = [];


    // ======================================
    // SCOUT
    // ======================================

    if (
        typeof scout !== "undefined" &&
        scout
    ) {

        scout.x =
            RESPAWN_X;

        scout.y =
            RESPAWN_Y;

        scout.rotation = 0;

    }


    // ======================================
    // SCREEN SHAKE
    // ======================================

    screenShake = 0;


    // ======================================
    // FOG
    // ======================================

    if (
        typeof resetFog === "function"
    ) {

        resetFog();

    }

}


// ==========================================
// UPDATE HAZARDS
// ==========================================

function updateHazards() {

    // ======================================
    // COLLISION
    // ======================================

    if (!gameOver) {

        checkMineCollision();

    }


    // ======================================
    // UPDATE EXPLOSIONS
    // ======================================

    for (const explosion of explosions) {

        explosion.age++;


        for (
            const particle of
            explosion.particles
        ) {

            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;


            // Gravity affects sparks

            if (
                particle.type ===
                "spark"
            ) {

                particle.vy +=
                    0.16;

                particle.vx *=
                    0.98;

            }


            // Smoke slowly rises

            if (
                particle.type ===
                "smoke"
            ) {

                particle.vy *=
                    0.98;

            }


            particle.life--;

        }


        explosion.particles =
            explosion.particles.filter(
                particle =>
                    particle.life > 0
            );

    }


    // ======================================
    // REMOVE FINISHED EXPLOSIONS
    // ======================================

    explosions =
        explosions.filter(
            explosion =>
                explosion.age <
                explosion.duration
        );


    // ======================================
    // SCREEN SHAKE
    // ======================================

    if (screenShake > 0) {

        screenShake *= 0.84;

        if (screenShake < 0.5) {

            screenShake = 0;

        }

    }

}


// ==========================================
// DRAW LANDMINES
// ==========================================

function drawMines(ctx) {

    for (const mine of mines) {

        if (mine.triggered) {
            continue;
        }


        ctx.save();

        ctx.translate(
            mine.x,
            mine.y
        );


        // ==================================
        // SHADOW
        // ==================================

        ctx.fillStyle =
            "rgba(0,0,0,0.4)";

        ctx.beginPath();

        ctx.ellipse(
            0,
            4,
            13,
            7,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ==================================
        // MINE BODY
        // ==================================

        ctx.fillStyle =
            "#151515";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            11,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ==================================
        // METAL RING
        // ==================================

        ctx.strokeStyle =
            "#555";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            8,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        // ==================================
        // WARNING CENTRE
        // ==================================

        ctx.fillStyle =
            "#b00000";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ==================================
        // WARNING SPIKES
        // ==================================

        ctx.strokeStyle =
            "#777";

        ctx.lineWidth = 2;

        for (
            let angle = 0;
            angle < Math.PI * 2;
            angle += Math.PI / 4
        ) {

            ctx.beginPath();

            ctx.moveTo(
                Math.cos(angle) * 8,
                Math.sin(angle) * 8
            );

            ctx.lineTo(
                Math.cos(angle) * 12,
                Math.sin(angle) * 12
            );

            ctx.stroke();

        }


        ctx.restore();

    }

}


// ==========================================
// DRAW EXPLOSIONS
// ==========================================

function drawExplosions(ctx) {

    for (const explosion of explosions) {

        const progress =
            explosion.age /
            explosion.duration;

        const fade =
            1 - progress;


        ctx.save();

        ctx.translate(
            explosion.x,
            explosion.y
        );


        // ==================================
        // INITIAL WHITE FLASH
        // ==================================

        if (progress < 0.12) {

            const flashProgress =
                progress / 0.12;

            const flashRadius =
                25 +
                flashProgress * 45;

            ctx.fillStyle =
                `rgba(255,255,230,${
                    1 - flashProgress
                })`;

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                flashRadius,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        // ==================================
        // FIREBALL
        // ==================================

        if (progress < 0.65) {

            const fireProgress =
                progress / 0.65;

            const radius =
                12 +
                Math.sin(
                    fireProgress * Math.PI
                ) * 42;


            // Outer fire

            ctx.fillStyle =
                `rgba(190,40,5,${
                    fade * 0.8
                })`;

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Orange middle

            ctx.fillStyle =
                `rgba(255,110,5,${
                    fade
                })`;

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                radius * 0.72,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Yellow centre

            ctx.fillStyle =
                `rgba(255,220,60,${
                    fade
                })`;

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                radius * 0.38,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // ==================================
            // IRREGULAR FLAMES
            // ==================================

            for (
                let i = 0;
                i < 12;
                i++
            ) {

                const angle =
                    (Math.PI * 2 / 12) *
                    i;

                const wobble =
                    Math.sin(
                        explosion.age * 0.4 + i
                    ) * 7;

                const distance =
                    radius +
                    wobble;

                const flameSize =
                    4 +
                    Math.random() * 5;

                ctx.fillStyle =
                    `rgba(255,${
                        70 + i * 8
                    },10,${fade})`;

                ctx.beginPath();

                ctx.arc(
                    Math.cos(angle) *
                        distance,

                    Math.sin(angle) *
                        distance,

                    flameSize,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        }


        // ==================================
        // PARTICLES
        // ==================================

        for (
            const particle of
            explosion.particles
        ) {

            const particleFade =
                Math.min(
                    1,
                    particle.life / 15
                );


            // ==================================
            // SPARKS
            // ==================================

            if (
                particle.type ===
                "spark"
            ) {

                ctx.fillStyle =
                    `rgba(255,180,30,${
                        particleFade
                    })`;

                ctx.fillRect(
                    particle.x,
                    particle.y,
                    particle.size,
                    particle.size
                );

            }


            // ==================================
            // SMOKE
            // ==================================

            if (
                particle.type ===
                "smoke"
            ) {

                ctx.fillStyle =
                    `rgba(50,50,50,${
                        particleFade * 0.5
                    })`;

                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        }


        ctx.restore();

    }

}


// ==========================================
// DRAW HEARTS
// ==========================================

function drawHearts(ctx) {

    const startX = 25;
    const startY = 25;


    for (
        let i = 0;
        i < MAX_HEALTH;
        i++
    ) {

        const x =
            startX +
            i * 32;

        const y =
            startY;


        ctx.save();


        // Empty heart

        ctx.fillStyle =
            "#333";

        drawHeart(
            ctx,
            x,
            y,
            10
        );


        // Filled heart

        if (
            i < scoutHealth
        ) {

            ctx.fillStyle =
                "#d62828";

            drawHeart(
                ctx,
                x,
                y,
                10
            );

        }


        ctx.restore();

    }


    // ======================================
    // LABEL
    // ======================================

    ctx.fillStyle =
        "#ddd";

    ctx.font =
        "13px Arial";

    ctx.fillText(
        "SCOUT",
        startX,
        startY + 27
    );

}


// ==========================================
// HEART SHAPE
// ==========================================

function drawHeart(
    ctx,
    x,
    y,
    size
) {

    ctx.beginPath();

    ctx.moveTo(
        x,
        y + size
    );

    ctx.bezierCurveTo(
        x - size * 1.4,
        y,
        x - size,
        y - size,
        x,
        y - size * 0.25
    );

    ctx.bezierCurveTo(
        x + size,
        y - size,
        x + size * 1.4,
        y,
        x,
        y + size
    );

    ctx.fill();

}


// ==========================================
// SCREEN SHAKE
// ==========================================

let screenShake = 0;


// ==========================================
// MISSION FAILED
// ==========================================

function showMissionFailed() {

    const failedScreen =
        document.getElementById(
            "failed-screen"
        );

    if (!failedScreen) return;

    failedScreen.classList.add(
        "open"
    );

}


// ==========================================
// RETURN TO MENU BUTTON
// ==========================================

const failedMenuButton =
    document.getElementById(
        "failed-menu-button"
    );


if (failedMenuButton) {

    failedMenuButton.addEventListener(
        "click",
        function () {

            returnToMenu();

        }
    );

}


// ==========================================
// RETURN TO MENU
// ==========================================

function returnToMenu() {

    // ======================================
    // RESET GAME
    // ======================================

    resetGameState();


    // ======================================
    // HIDE FAILED SCREEN
    // ======================================

    const failedScreen =
        document.getElementById(
            "failed-screen"
        );

    if (failedScreen) {

        failedScreen.classList.remove(
            "open"
        );

    }


    // ======================================
    // CLOSE SONAR
    // ======================================

    const sonarPanel =
        document.getElementById(
            "sonar-panel"
        );

    if (sonarPanel) {

        sonarPanel.classList.remove(
            "open"
        );

    }


    // ======================================
    // CLOSE MAP
    // ======================================

    const mapPanel =
        document.getElementById(
            "map-panel"
        );

    if (mapPanel) {

        mapPanel.classList.remove(
            "open"
        );

    }


    // ======================================
    // SHOW START MENU
    // ======================================

    const startMenu =
        document.getElementById(
            "start-menu"
        );

    if (startMenu) {

        startMenu.style.display =
            "flex";

    }

}