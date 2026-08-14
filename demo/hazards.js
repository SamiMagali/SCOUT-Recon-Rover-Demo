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


// ==========================================
// ENTRANCE / RESPAWN
// ==========================================

const RESPAWN_X = 100;
const RESPAWN_Y = 360;


// ==========================================
// LANDMINES
// ==========================================

const mines = [

    // --------------------------------------
    // ENTRANCE AREA
    // --------------------------------------

    { x: 240, y: 360, triggered: false },
    { x: 270, y: 160, triggered: false },
    { x: 330, y: 240, triggered: false },


    // --------------------------------------
    // TOP SECTION
    // --------------------------------------

    { x: 520, y: 140, triggered: false },
    { x: 620, y: 180, triggered: false },
    { x: 810, y: 130, triggered: false },
    { x: 930, y: 180, triggered: false },
    { x: 1010, y: 140, triggered: false },


    // --------------------------------------
    // MIDDLE SECTION
    // --------------------------------------

    { x: 390, y: 360, triggered: false },
    { x: 500, y: 380, triggered: false },
    { x: 720, y: 240, triggered: false },
    { x: 780, y: 440, triggered: false },
    { x: 920, y: 350, triggered: false },


    // --------------------------------------
    // TRAP ROOMS
    // --------------------------------------

    { x: 420, y: 460, triggered: false },
    { x: 1020, y: 430, triggered: false },


    // --------------------------------------
    // LOWER SECTION
    // --------------------------------------

    { x: 300, y: 630, triggered: false },
    { x: 520, y: 630, triggered: false },
    { x: 820, y: 630, triggered: false },
    { x: 1020, y: 630, triggered: false },


    // --------------------------------------
    // OBJECTIVE APPROACH
    // --------------------------------------

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

        explosionAudioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

}


// ==========================================
// EXPLOSION SOUND
// ==========================================

function playExplosionSound() {

    setupExplosionAudio();


    if (
        explosionAudioContext.state ===
        "suspended"
    ) {

        explosionAudioContext.resume();

    }


    const now =
        explosionAudioContext.currentTime;


    // --------------------------------------
    // DEEP EXPLOSION
    // --------------------------------------

    const oscillator =
        explosionAudioContext.createOscillator();

    const gain =
        explosionAudioContext.createGain();


    oscillator.type = "sawtooth";


    oscillator.frequency.setValueAtTime(
        90,
        now
    );


    oscillator.frequency.exponentialRampToValueAtTime(
        35,
        now + 0.35
    );


    gain.gain.setValueAtTime(
        0.45,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.35
    );


    oscillator.connect(gain);

    gain.connect(
        explosionAudioContext.destination
    );


    oscillator.start(now);

    oscillator.stop(
        now + 0.35
    );


    // --------------------------------------
    // SECONDARY BURST
    // --------------------------------------

    const noise =
        explosionAudioContext.createOscillator();

    const noiseGain =
        explosionAudioContext.createGain();


    noise.type = "square";


    noise.frequency.setValueAtTime(
        180,
        now
    );


    noise.frequency.exponentialRampToValueAtTime(
        40,
        now + 0.15
    );


    noiseGain.gain.setValueAtTime(
        0.18,
        now
    );


    noiseGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.15
    );


    noise.connect(noiseGain);

    noiseGain.connect(
        explosionAudioContext.destination
    );


    noise.start(now);

    noise.stop(
        now + 0.15
    );

}


// ==========================================
// MINE COLLISION
// ==========================================

function checkMineCollision() {

    // Don't trigger another mine while
    // an explosion is happening.

    if (
        explosions.length > 0
    ) {

        return;

    }


    for (
        const mine of mines
    ) {

        // Ignore already-triggered mines.

        if (
            mine.triggered
        ) {

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


        if (
            distance < 28
        ) {

            triggerMine(mine);

            return;

        }

    }

}


// ==========================================
// TRIGGER MINE
// ==========================================

function triggerMine(mine) {

    // --------------------------------------
    // MARK MINE AS TRIGGERED
    // --------------------------------------

    mine.triggered = true;


    // --------------------------------------
    // REMOVE ONE HEART
    // --------------------------------------

    scoutHealth--;

    if (
        scoutHealth < 0
    ) {

        scoutHealth = 0;

    }


    // --------------------------------------
    // CREATE EXPLOSION
    // --------------------------------------

    explosions.push({

        x: mine.x,

        y: mine.y,

        age: 0,

        duration: 45

    });


    // --------------------------------------
    // SOUND
    // --------------------------------------

    playExplosionSound();


    // --------------------------------------
    // SCREEN SHAKE
    // --------------------------------------

    screenShake = 12;


    // --------------------------------------
    // CHECK FOR GAME OVER
    // --------------------------------------

    if (
        scoutHealth <= 0
    ) {

        // Wait for the explosion to begin,
        // then reset the actual game state.

        setTimeout(

            () => {

                resetGameState();

                showMissionFailed();

            },

            500

        );

        return;

    }


    // --------------------------------------
    // NORMAL RESPAWN
    // --------------------------------------

    setTimeout(

        () => {

            scout.x =
                RESPAWN_X;

            scout.y =
                RESPAWN_Y;

            scout.rotation = 0;

        },

        500

    );

}


// ==========================================
// RESET MINES
// ==========================================

function resetMines() {

    for (
        const mine of mines
    ) {

        mine.triggered = false;

    }

}


// ==========================================
// RESET GAME STATE
// ==========================================

function resetGameState() {

    // --------------------------------------
    // RESTORE HEARTS
    // --------------------------------------

    scoutHealth =
        MAX_HEALTH;


    // --------------------------------------
    // RESET MINES
    // --------------------------------------

    resetMines();


    // --------------------------------------
    // CLEAR EXPLOSIONS
    // --------------------------------------

    explosions = [];


    // --------------------------------------
    // RESET SCOUT
    // --------------------------------------

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


    // --------------------------------------
    // RESET SCREEN SHAKE
    // --------------------------------------

    screenShake = 0;


    // --------------------------------------
    // RESET FOG
    // --------------------------------------

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

    // --------------------------------------
    // CHECK COLLISIONS
    // --------------------------------------

    checkMineCollision();


    // --------------------------------------
    // UPDATE EXPLOSIONS
    // --------------------------------------

    for (
        const explosion of explosions
    ) {

        explosion.age++;

    }


    // --------------------------------------
    // REMOVE FINISHED EXPLOSIONS
    // --------------------------------------

    explosions =
        explosions.filter(

            explosion =>
                explosion.age <
                explosion.duration

        );


    // --------------------------------------
    // SCREEN SHAKE
    // --------------------------------------

    if (
        screenShake > 0
    ) {

        screenShake *= 0.85;


        if (
            screenShake < 0.5
        ) {

            screenShake = 0;

        }

    }

}


// ==========================================
// DRAW LANDMINES
// ==========================================

function drawMines(ctx) {

    for (
        const mine of mines
    ) {

        if (
            mine.triggered
        ) {

            continue;

        }


        ctx.save();


        ctx.translate(
            mine.x,
            mine.y
        );


        // ----------------------------------
        // SHADOW
        // ----------------------------------

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


        // ----------------------------------
        // MINE BODY
        // ----------------------------------

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


        // ----------------------------------
        // METAL RING
        // ----------------------------------

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


        // ----------------------------------
        // WARNING CENTRE
        // ----------------------------------

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


        // ----------------------------------
        // WARNING SPIKES
        // ----------------------------------

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

    for (
        const explosion of explosions
    ) {

        const progress =
            explosion.age /
            explosion.duration;


        const radius =
            10 +
            progress * 65;


        ctx.save();


        ctx.translate(
            explosion.x,
            explosion.y
        );


        // ----------------------------------
        // OUTER BLAST
        // ----------------------------------

        ctx.fillStyle =
            `rgba(255,120,0,${1 - progress})`;


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ----------------------------------
        // BRIGHT CENTRE
        // ----------------------------------

        const innerRadius =
            Math.max(
                4,
                radius * 0.45
            );


        ctx.fillStyle =
            `rgba(255,230,80,${1 - progress})`;


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            innerRadius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ----------------------------------
        // EXPLOSION RAYS
        // ----------------------------------

        ctx.strokeStyle =
            `rgba(255,190,40,${1 - progress})`;

        ctx.lineWidth = 3;


        for (
            let angle = 0;
            angle < Math.PI * 2;
            angle += Math.PI / 6
        ) {

            const inner =
                radius * 0.7;

            const outer =
                radius + 12;


            ctx.beginPath();

            ctx.moveTo(
                Math.cos(angle) * inner,
                Math.sin(angle) * inner
            );

            ctx.lineTo(
                Math.cos(angle) * outer,
                Math.sin(angle) * outer
            );

            ctx.stroke();

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


    // --------------------------------------
    // LABEL
    // --------------------------------------

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
// RETURN TO MENU
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

    // --------------------------------------
    // RESET THE GAME FIRST
    // --------------------------------------

    resetGameState();


    // --------------------------------------
    // HIDE FAILED SCREEN
    // --------------------------------------

    const failedScreen =
        document.getElementById(
            "failed-screen"
        );


    if (failedScreen) {

        failedScreen.classList.remove(
            "open"
        );

    }


    // --------------------------------------
    // CLOSE SONAR
    // --------------------------------------

    const sonarPanel =
        document.getElementById(
            "sonar-panel"
        );


    if (sonarPanel) {

        sonarPanel.classList.remove(
            "open"
        );

    }


    // --------------------------------------
    // CLOSE MAP
    // --------------------------------------

    const mapPanel =
        document.getElementById(
            "map-panel"
        );


    if (mapPanel) {

        mapPanel.classList.remove(
            "open"
        );

    }


    // --------------------------------------
    // SHOW START MENU
    // --------------------------------------

    const startMenu =
        document.getElementById(
            "start-menu"
        );


    if (startMenu) {

        startMenu.style.display =
            "flex";

    }

}