// ==========================================
// SCOUT RECON RUN - ROVER
// TOP-DOWN INDUSTRIAL SCOUT
// MOBILE-FRIENDLY VERSION
// ==========================================


// ==========================================
// SCOUT STATE
// ==========================================

const scout = {

    x: 100,
    y: 360,

    speed: 3.5,

    rotation: 0,
    turnSpeed: 0.05
};


// ==========================================
// KEYBOARD
// ==========================================

const keys = {};

document.addEventListener("keydown", (event) => {

    keys[event.key.toLowerCase()] = true;

});


document.addEventListener("keyup", (event) => {

    keys[event.key.toLowerCase()] = false;

});


// ==========================================
// MOBILE DETECTION
// ==========================================

function scoutIsMobile() {

    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
    );

}


// ==========================================
// UPDATE SCOUT
// ==========================================

function updateScout(canvas) {

    // --------------------------------------
    // ROTATION
    // --------------------------------------

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        scout.rotation -= scout.turnSpeed;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        scout.rotation += scout.turnSpeed;

    }


    // --------------------------------------
    // MOVEMENT
    // --------------------------------------

    let newX = scout.x;
    let newY = scout.y;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        newX +=
            Math.sin(scout.rotation) *
            scout.speed;

        newY -=
            Math.cos(scout.rotation) *
            scout.speed;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        newX -=
            Math.sin(scout.rotation) *
            scout.speed;

        newY +=
            Math.cos(scout.rotation) *
            scout.speed;

    }


    // ======================================
    // COLLISION BOX
    // ======================================

    const halfWidth = 24;
    const halfHeight = 29;


    const left =
        newX - halfWidth;

    const right =
        newX + halfWidth;

    const top =
        newY - halfHeight;

    const bottom =
        newY + halfHeight;


    // ======================================
    // WALL COLLISION
    // ======================================

    // IMPORTANT:
    //
    // Do NOT use canvas.width / canvas.height
    // as the game boundary.
    //
    // On mobile the canvas is only as large
    // as the phone viewport, but the maze is
    // larger than the viewport.
    //
    // Therefore the MAZE controls collision,
    // not the phone screen.

    for (
        const wall of walls
    ) {

        if (
            right > wall.x &&
            left < wall.x + wall.width &&
            bottom > wall.y &&
            top < wall.y + wall.height
        ) {

            return;

        }

    }


    // ======================================
    // WORLD BOUNDARY
    // ======================================

    // These are the actual game-world limits.
    //
    // They are deliberately larger than a
    // typical phone screen.

    const WORLD_LEFT = 0;
    const WORLD_TOP = 0;

    const WORLD_RIGHT = 1400;
    const WORLD_BOTTOM = 760;


    if (
        left < WORLD_LEFT ||
        right > WORLD_RIGHT ||
        top < WORLD_TOP ||
        bottom > WORLD_BOTTOM
    ) {

        return;

    }


    // ======================================
    // APPLY MOVEMENT
    // ======================================

    scout.x = newX;
    scout.y = newY;

}


// ==========================================
// DRAW SCOUT
// ==========================================

function drawScout(ctx) {

    ctx.save();


    ctx.translate(
        scout.x,
        scout.y
    );


    ctx.rotate(
        scout.rotation
    );


    // --------------------------------------
    // SHADOW
    // --------------------------------------

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";


    ctx.beginPath();

    ctx.roundRect(
        -27,
        -31,
        54,
        64,
        7
    );

    ctx.fill();


    // --------------------------------------
    // BLACK TRACKS
    // --------------------------------------

    drawTrack(
        ctx,
        -22
    );

    drawTrack(
        ctx,
        22
    );


    // --------------------------------------
    // YELLOW HULL
    // --------------------------------------

    drawHull(ctx);


    // --------------------------------------
    // BLACK TURRET
    // --------------------------------------

    drawTurret(ctx);


    ctx.restore();

}


// ==========================================
// TRACKS
// ==========================================

function drawTrack(
    ctx,
    xOffset
) {

    ctx.save();


    ctx.translate(
        xOffset,
        0
    );


    ctx.fillStyle =
        "#111111";


    ctx.beginPath();

    ctx.roundRect(
        -8,
        -31,
        16,
        62,
        6
    );

    ctx.fill();


    ctx.fillStyle =
        "#242424";


    ctx.beginPath();

    ctx.roundRect(
        -5,
        -27,
        10,
        54,
        4
    );

    ctx.fill();


    // --------------------------------------
    // TRACK WHEELS
    // --------------------------------------

    ctx.fillStyle =
        "#4a4a46";


    ctx.beginPath();

    ctx.arc(
        0,
        -18,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        0,
        18,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // --------------------------------------
    // WHEEL HUBS
    // --------------------------------------

    ctx.fillStyle =
        "#171717";


    ctx.beginPath();

    ctx.arc(
        0,
        -18,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.arc(
        0,
        0,
        1.8,
        0,
        Math.PI * 2
    );

    ctx.arc(
        0,
        18,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // --------------------------------------
    // TREADS
    // --------------------------------------

    ctx.strokeStyle =
        "#080808";

    ctx.lineWidth = 1;


    for (
        let y = -26;
        y <= 26;
        y += 5
    ) {

        ctx.beginPath();

        ctx.moveTo(
            -7,
            y
        );

        ctx.lineTo(
            7,
            y
        );

        ctx.stroke();

    }


    ctx.restore();

}


// ==========================================
// YELLOW HULL
// ==========================================

function drawHull(ctx) {

    ctx.fillStyle =
        "#D6B400";


    ctx.beginPath();

    ctx.roundRect(
        -17,
        -25,
        34,
        50,
        5
    );

    ctx.fill();


    // --------------------------------------
    // FRONT ARMOUR
    // --------------------------------------

    ctx.fillStyle =
        "#E6C200";


    ctx.beginPath();

    ctx.moveTo(
        -14,
        -25
    );

    ctx.lineTo(
        14,
        -25
    );

    ctx.lineTo(
        12,
        -17
    );

    ctx.lineTo(
        -12,
        -17
    );

    ctx.closePath();

    ctx.fill();


    // --------------------------------------
    // TOP ARMOUR
    // --------------------------------------

    ctx.fillStyle =
        "#F0CF00";


    ctx.beginPath();

    ctx.roundRect(
        -13,
        -16,
        26,
        28,
        4
    );

    ctx.fill();


    // --------------------------------------
    // SIDE ARMOUR
    // --------------------------------------

    ctx.fillStyle =
        "#B99400";


    ctx.fillRect(
        -17,
        -10,
        3,
        21
    );


    ctx.fillRect(
        14,
        -10,
        3,
        21
    );


    // --------------------------------------
    // REAR VENTS
    // --------------------------------------

    ctx.fillStyle =
        "#202020";


    for (
        let x = -7;
        x <= 7;
        x += 4
    ) {

        ctx.fillRect(
            x,
            15,
            2,
            6
        );

    }


    // --------------------------------------
    // FRONT DETAIL
    // --------------------------------------

    ctx.fillStyle =
        "#252525";


    ctx.fillRect(
        -10,
        -23,
        20,
        2
    );

}


// ==========================================
// BLACK SONAR TURRET
// ==========================================

function drawTurret(ctx) {

    ctx.save();


    const angle =
        typeof sonarAngle !== "undefined"
            ? sonarAngle
            : 0;


    ctx.rotate(
        (angle - 90) *
        Math.PI /
        180
    );


    // --------------------------------------
    // TURRET BASE
    // --------------------------------------

    ctx.fillStyle =
        "#181818";


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // --------------------------------------
    // BASE RING
    // --------------------------------------

    ctx.strokeStyle =
        "#444444";

    ctx.lineWidth = 1.5;


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        8,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    // --------------------------------------
    // SENSOR HOUSING
    // --------------------------------------

    ctx.fillStyle =
        "#0D0D0D";


    ctx.beginPath();

    ctx.roundRect(
        -9,
        -15,
        18,
        11,
        3
    );

    ctx.fill();


    // --------------------------------------
    // SENSOR EYES
    // --------------------------------------

    ctx.fillStyle =
        "#303030";


    ctx.beginPath();

    ctx.arc(
        -4,
        -10,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        4,
        -10,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // --------------------------------------
    // SENSOR CENTRES
    // --------------------------------------

    ctx.fillStyle =
        "#666666";


    ctx.beginPath();

    ctx.arc(
        -4,
        -10,
        1,
        0,
        Math.PI * 2
    );

    ctx.arc(
        4,
        -10,
        1,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // --------------------------------------
    // REAR MAST
    // --------------------------------------

    ctx.fillStyle =
        "#202020";


    ctx.fillRect(
        -2,
        -20,
        4,
        7
    );


    ctx.restore();

}