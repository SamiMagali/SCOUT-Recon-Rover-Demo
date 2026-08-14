// ==========================================
// SCOUT RECON RUN - MAP
// WORLD-BASED MAP
// ==========================================


// ==========================================
// WORLD SIZE
// ==========================================

const WORLD_WIDTH = 1280;
const WORLD_HEIGHT = 760;

const WALL = 20;


// ==========================================
// MAP BOUNDS
// ==========================================

const MAP = {

    left: 180,
    top: 60,

    right: 1260,
    bottom: 680

};


// ==========================================
// WALLS
// ==========================================

const walls = [

    // ======================================
    // OUTER BUILDING
    // ======================================

    { x: 180, y: 60, width: 1080, height: WALL },

    { x: 180, y: 680, width: 1080, height: WALL },

    { x: 180, y: 60, width: WALL, height: 160 },

    { x: 180, y: 500, width: WALL, height: 180 },

    { x: 1260, y: 60, width: WALL, height: 640 },


    // ======================================
    // ENTRANCE ROOM
    // ======================================

    { x: 200, y: 220, width: 80, height: WALL },

    { x: 200, y: 500, width: 80, height: WALL },


    // ======================================
    // TOP SECTION
    // ======================================

    { x: 430, y: 80, width: WALL, height: 120 },

    { x: 680, y: 80, width: WALL, height: 120 },

    { x: 930, y: 80, width: WALL, height: 120 },

    { x: 1080, y: 80, width: WALL, height: 100 },


    // ======================================
    // MIDDLE SECTION
    // ======================================

    { x: 280, y: 300, width: 180, height: WALL },

    { x: 680, y: 300, width: 140, height: WALL },

    { x: 980, y: 280, width: 80, height: WALL },


    // ======================================
    // MIDDLE VERTICALS
    // ======================================

    { x: 560, y: 320, width: WALL, height: 150 },

    { x: 880, y: 320, width: WALL, height: 150 },


    // ======================================
    // LOWER SECTION
    // ======================================

    { x: 380, y: 580, width: 80, height: WALL },

    { x: 680, y: 580, width: 140, height: WALL },

    { x: 980, y: 580, width: 100, height: WALL },


    // ======================================
    // DEAD END #1
    // ======================================

    { x: 1060, y: 380, width: WALL, height: 100 },

    { x: 980, y: 480, width: 100, height: WALL },


    // ======================================
    // DEAD END #2
    // ======================================

    { x: 380, y: 420, width: WALL, height: 50 },

    { x: 380, y: 420, width: 80, height: WALL },


    // ======================================
    // OBJECTIVE AREA
    // ======================================

    { x: 1180, y: 60, width: WALL, height: 180 },

    { x: 1180, y: 460, width: WALL, height: 220 }

];


// ==========================================
// DRAW MAP
// ==========================================

function drawMap(ctx, canvas) {


    // ======================================
    // OUTSIDE WORLD
    // ======================================

    ctx.fillStyle =
        "#252a24";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    // ======================================
    // BUILDING FLOOR
    // ======================================

    ctx.fillStyle =
        "#111713";

    ctx.fillRect(
        200,
        80,
        1060,
        600
    );


    // ======================================
    // ENTRANCE / OUTSIDE
    // ======================================

    ctx.fillStyle =
        "#343932";

    ctx.fillRect(
        0,
        80,
        180,
        600
    );


    // ======================================
    // OBJECTIVE AREA
    // ======================================

    ctx.fillStyle =
        "#182319";

    ctx.fillRect(
        1180,
        80,
        80,
        600
    );


    // ======================================
    // GRID
    // ======================================

    ctx.strokeStyle =
        "#202820";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x <= WORLD_WIDTH;
        x += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            WORLD_HEIGHT
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= WORLD_HEIGHT;
        y += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            WORLD_WIDTH,
            y
        );

        ctx.stroke();

    }


    // ======================================
    // DRAW WALLS
    // ======================================

    for (
        const wall of walls
    ) {

        ctx.fillStyle =
            "#50504b";

        ctx.fillRect(
            wall.x,
            wall.y,
            wall.width,
            wall.height
        );


        ctx.fillStyle =
            "#666660";


        if (
            wall.width >
            wall.height
        ) {

            ctx.fillRect(
                wall.x,
                wall.y,
                wall.width,
                3
            );

        } else {

            ctx.fillRect(
                wall.x,
                wall.y,
                3,
                wall.height
            );

        }

    }


    // ======================================
    // LABELS
    // ======================================

    ctx.fillStyle =
        "#aaa";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "ENTRANCE",
        40,
        145
    );


    ctx.font =
        "12px Arial";

    ctx.fillStyle =
        "#777";

    ctx.fillText(
        "ABANDONED BUILDING",
        25,
        170
    );


    ctx.fillStyle =
        "#789978";

    ctx.font =
        "16px Arial";

    ctx.fillText(
        "OBJECTIVE",
        1185,
        145
    );

}


// ==========================================
// GET WALLS
// ==========================================

function getWalls() {

    return walls;

}