// ==========================================
// SCOUT: RECON RUN
// MAIN GAME CONTROLLER
// SIMPLE STABLE VERSION
// ==========================================


const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");


// ==========================================
// CANVAS
// ==========================================

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);


// ==========================================
// CAMERA SYSTEM
// ==========================================

const camera = {
    x: 0,
    y: 0
};

function updateCamera() {

    // Safety check - only update if scout exists
    if (
        typeof scout === "undefined" ||
        !scout
    ) {
        return;
    }

    // Center camera on scout
    camera.x =
        scout.x - canvas.width / 2;

    camera.y =
        scout.y - canvas.height / 2;

}


// ==========================================
// SETUP FOG
// ==========================================

if (
    typeof setupFog === "function"
) {

    setupFog();

}


// ==========================================
// GAME LOOP
// ==========================================

function gameLoop() {

    // ======================================
    // UPDATE
    // ======================================

    updateScout(canvas);

    updateCamera();

    updateSonar();

    updateHazards();

    updateMiniMap();

    updateCharacters();


    if (
        typeof updateFog === "function"
    ) {

        updateFog();

    }


    // ======================================
    // DRAW
    // ======================================

    // Clear canvas
    ctx.fillStyle = "#101310";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.save();

    // Apply camera transformation
    ctx.translate(
        -camera.x,
        -camera.y
    );

    // MAP

    drawMap(
        ctx,
        canvas
    );


    // MINES

    drawMines(ctx);


    // FOG

    if (
        typeof drawFog === "function"
    ) {

        drawFog(ctx);

    }


    // CHARACTERS

    drawCharacters(ctx);


    // SCOUT

    drawScout(ctx);


    // EXPLOSIONS

    drawExplosions(ctx);


    ctx.restore();


    // ======================================
    // UI
    // ======================================

    drawHearts(ctx);

    drawSonar();


    // ======================================
    // NEXT FRAME
    // ======================================

    requestAnimationFrame(
        gameLoop
    );

}


// ==========================================
// START
// ==========================================

gameLoop();