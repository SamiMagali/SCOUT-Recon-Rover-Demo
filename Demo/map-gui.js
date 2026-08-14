// ==========================================
// SCOUT RECON RUN - MAP GUI
// MINI MAP
// ==========================================

const mapCanvas = document.getElementById("map-display");
const mapCtx = mapCanvas.getContext("2d");

const mapToggle = document.getElementById("map-toggle");
const mapPanel = document.getElementById("map-panel");


// ==========================================
// OPEN / CLOSE MAP
// ==========================================

mapToggle.addEventListener("click", () => {

    mapPanel.classList.toggle("open");

    if (mapPanel.classList.contains("open")) {

        mapToggle.textContent = "CLOSE MAP";

    } else {

        mapToggle.textContent = "OPEN MAP";

    }

});


// ==========================================
// MAP SCALE
// ==========================================

// Original game map:
// X: 180 → 1260
// Y: 60  → 680

const MAP_SCALE_X =
    mapCanvas.width / (1260 - 180);

const MAP_SCALE_Y =
    mapCanvas.height / (680 - 60);


// ==========================================
// CONVERT GAME COORDINATES
// TO MINI-MAP COORDINATES
// ==========================================

function mapX(x) {

    return (x - 180) * MAP_SCALE_X;

}

function mapY(y) {

    return (y - 60) * MAP_SCALE_Y;

}


// ==========================================
// DRAW MINI MAP
// ==========================================

function drawMiniMap() {

    // --------------------------------------
    // BACKGROUND
    // --------------------------------------

    mapCtx.fillStyle = "#111713";

    mapCtx.fillRect(
        0,
        0,
        mapCanvas.width,
        mapCanvas.height
    );


    // --------------------------------------
    // GRID
    // --------------------------------------

    mapCtx.strokeStyle = "#202820";
    mapCtx.lineWidth = 0.5;

    for (
        let x = 0;
        x <= mapCanvas.width;
        x += 20
    ) {

        mapCtx.beginPath();

        mapCtx.moveTo(x, 0);
        mapCtx.lineTo(x, mapCanvas.height);

        mapCtx.stroke();

    }


    for (
        let y = 0;
        y <= mapCanvas.height;
        y += 20
    ) {

        mapCtx.beginPath();

        mapCtx.moveTo(0, y);
        mapCtx.lineTo(mapCanvas.width, y);

        mapCtx.stroke();

    }


    // --------------------------------------
    // WALLS
    // --------------------------------------

    for (const wall of walls) {

        const x =
            mapX(wall.x);

        const y =
            mapY(wall.y);

        const width =
            wall.width * MAP_SCALE_X;

        const height =
            wall.height * MAP_SCALE_Y;


        mapCtx.fillStyle = "#50504b";

        mapCtx.fillRect(
            x,
            y,
            width,
            height
        );

    }


    // --------------------------------------
    // ENTRANCE
    // --------------------------------------

    mapCtx.fillStyle = "#888";

    mapCtx.font = "9px Arial";

    mapCtx.fillText(
        "ENTRANCE",
        mapX(25),
        mapY(145)
    );


    // --------------------------------------
    // OBJECTIVE
    // --------------------------------------

    mapCtx.fillStyle = "#789978";

    mapCtx.font = "9px Arial";

    mapCtx.fillText(
        "OBJECTIVE",
        mapX(1185),
        mapY(145)
    );


    // --------------------------------------
    // ROVER
    // --------------------------------------

    const roverX =
        mapX(scout.x);

    const roverY =
        mapY(scout.y);


    mapCtx.save();

    mapCtx.translate(
        roverX,
        roverY
    );

    mapCtx.rotate(
        scout.rotation
    );


    // Rover body

    mapCtx.fillStyle = "#d6b400";

    mapCtx.fillRect(
        -6,
        -8,
        12,
        16
    );


    // Tracks

    mapCtx.fillStyle = "#111";

    mapCtx.fillRect(
        -9,
        -8,
        3,
        16
    );

    mapCtx.fillRect(
        6,
        -8,
        3,
        16
    );


    // Direction indicator

    mapCtx.fillStyle = "#ffd214";

    mapCtx.beginPath();

    mapCtx.moveTo(
        0,
        -11
    );

    mapCtx.lineTo(
        -3,
        -6
    );

    mapCtx.lineTo(
        3,
        -6
    );

    mapCtx.closePath();

    mapCtx.fill();


    mapCtx.restore();

}


// ==========================================
// UPDATE MAP
// ==========================================

function updateMiniMap() {

    drawMiniMap();

}