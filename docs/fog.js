// ==========================================
// SCOUT: RECON RUN
// MAZE CLOUD FOG
// WORLD-COORDINATE VERSION
// ==========================================
//
// IMPORTANT:
// game.js handles the camera.
// fog.js therefore stays in WORLD coordinates.
//
// Do NOT subtract camera.x / camera.y here.
// ==========================================


// ==========================================
// SETTINGS
// ==========================================

// Actual maze area in WORLD coordinates.

const FOG_LEFT = 280;
const FOG_TOP = 80;

const FOG_RIGHT = 1180;
const FOG_BOTTOM = 680;


// Visibility around SCOUT.

const FOG_VISIBILITY_RADIUS = 65;
const FOG_EDGE = 20;


// ==========================================
// FOG CANVAS
// ==========================================

let fogCanvas = null;
let fogCtx = null;


// ==========================================
// SETUP
// ==========================================

function setupFog() {

    if (!fogCanvas) {

        fogCanvas =
            document.createElement("canvas");

        fogCtx =
            fogCanvas.getContext("2d");

    }

    resizeFog();

}


// ==========================================
// RESIZE
// ==========================================

function resizeFog() {

    if (!fogCanvas) return;

    // IMPORTANT:
    // The fog is a WORLD-sized canvas,
    // not a screen-sized canvas.

    fogCanvas.width = 1280;
    fogCanvas.height = 760;

}


// ==========================================
// UPDATE
// ==========================================

function updateFog() {

    if (!fogCanvas) {

        setupFog();

    }

}


// ==========================================
// DRAW FOG
// ==========================================

function drawFog(ctx) {

    if (
        !fogCanvas ||
        !fogCtx ||
        typeof scout === "undefined"
    ) {

        return;

    }


    // ======================================
    // CLEAR PREVIOUS FRAME
    // ======================================

    fogCtx.clearRect(
        0,
        0,
        fogCanvas.width,
        fogCanvas.height
    );


    // ======================================
    // CREATE MAZE FOG
    // ======================================

    fogCtx.save();


    fogCtx.beginPath();

    fogCtx.rect(
        FOG_LEFT,
        FOG_TOP,
        FOG_RIGHT - FOG_LEFT,
        FOG_BOTTOM - FOG_TOP
    );

    fogCtx.clip();


    // ======================================
    // MAIN FOG
    // ======================================

    fogCtx.fillStyle =
        "rgba(225, 228, 224, 0.96)";


    fogCtx.fillRect(
        FOG_LEFT,
        FOG_TOP,
        FOG_RIGHT - FOG_LEFT,
        FOG_BOTTOM - FOG_TOP
    );


    // ======================================
    // CLOUD PATCHES
    // ======================================

    fogCtx.globalAlpha = 0.25;


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const x =
            FOG_LEFT +
            ((i * 137) %
                (FOG_RIGHT - FOG_LEFT));


        const y =
            FOG_TOP +
            ((i * 83) %
                (FOG_BOTTOM - FOG_TOP));


        const radius =
            35 +
            ((i * 17) % 45);


        const cloud =
            fogCtx.createRadialGradient(

                x,
                y,
                0,

                x,
                y,
                radius

            );


        cloud.addColorStop(
            0,
            "rgba(255,255,255,0.8)"
        );


        cloud.addColorStop(
            0.5,
            "rgba(245,247,245,0.4)"
        );


        cloud.addColorStop(
            1,
            "rgba(225,228,224,0)"
        );


        fogCtx.fillStyle =
            cloud;


        fogCtx.beginPath();

        fogCtx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        fogCtx.fill();

    }


    fogCtx.globalAlpha = 1;


    // ======================================
    // CLEAR SCOUT'S VISION
    // ======================================

    fogCtx.globalCompositeOperation =
        "destination-out";


    const innerRadius =
        Math.max(
            0,
            FOG_VISIBILITY_RADIUS -
            FOG_EDGE
        );


    const vision =
        fogCtx.createRadialGradient(

            scout.x,
            scout.y,
            innerRadius,

            scout.x,
            scout.y,
            FOG_VISIBILITY_RADIUS

        );


    vision.addColorStop(
        0,
        "rgba(0,0,0,1)"
    );


    vision.addColorStop(
        0.7,
        "rgba(0,0,0,1)"
    );


    vision.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    fogCtx.fillStyle =
        vision;


    fogCtx.beginPath();

    fogCtx.arc(
        scout.x,
        scout.y,
        FOG_VISIBILITY_RADIUS,
        0,
        Math.PI * 2
    );

    fogCtx.fill();


    fogCtx.restore();


    // ======================================
    // DRAW FOG INTO WORLD
    // ======================================

    // game.js has already applied:
    //
    // ctx.translate(
    //     -camera.x,
    //     -camera.y
    // );
    //
    // Therefore we simply draw the fog
    // at WORLD coordinates.
    //

    ctx.drawImage(
        fogCanvas,
        0,
        0
    );

}


// ==========================================
// RESET FOG
// ==========================================

function resetFog() {

    if (
        !fogCanvas ||
        !fogCtx
    ) {

        return;

    }


    fogCtx.clearRect(
        0,
        0,
        fogCanvas.width,
        fogCanvas.height
    );

}