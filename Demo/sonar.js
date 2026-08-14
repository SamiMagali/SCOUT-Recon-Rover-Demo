// ==========================================
// SCOUT SONAR SYSTEM
// ==========================================

let sonarAngle = 0;
let sonarDirection = 1;

let currentDistance = -1;
let currentTargetType = "none";

let sonarEchoes = [];

const SONAR_STEP = 5;
const SONAR_MAX_DISTANCE = 160;


// ==========================================
// GET DISTANCE
// ==========================================

function getSonarDistance(angle) {

    // Convert sonar angle relative to SCOUT
    const worldAngle =
        scout.rotation +
        (angle - 90) * Math.PI / 180;

    const dx = Math.sin(worldAngle);
    const dy = -Math.cos(worldAngle);

    let x = scout.x;
    let y = scout.y;


    // ======================================
    // CAST SONAR RAY
    // ======================================

    for (
        let distance = 0;
        distance <= SONAR_MAX_DISTANCE;
        distance++
    ) {

        x += dx;
        y += dy;


        // ==================================
        // WALLS
        // ==================================

        const currentWalls = getWalls();

        for (const wall of currentWalls) {

            if (
                x >= wall.x &&
                x <= wall.x + wall.width &&
                y >= wall.y &&
                y <= wall.y + wall.height
            ) {

                return {
                    distance: distance,
                    type: "wall"
                };
            }
        }


        // ==================================
        // MINES
        // ==================================

        if (typeof mines !== "undefined") {

            for (const mine of mines) {

                // Don't detect an already-triggered mine
                if (mine.triggered) {
                    continue;
                }


                const mineDX =
                    x - mine.x;

                const mineDY =
                    y - mine.y;

                const mineDistance =
                    Math.sqrt(
                        mineDX * mineDX +
                        mineDY * mineDY
                    );


                // Mine detection radius
                if (mineDistance <= 10) {

                    return {
                        distance: distance,
                        type: "mine"
                    };
                }
            }
        }


        // ==================================
        // OUTSIDE SCREEN
        // ==================================

        if (
            x < 0 ||
            x > canvas.width ||
            y < 0 ||
            y > canvas.height
        ) {

            return {
                distance: -1,
                type: "none"
            };
        }
    }


    return {
        distance: -1,
        type: "none"
    };
}


// ==========================================
// SCAN
// ==========================================

function scanSonar() {

    const result =
        getSonarDistance(sonarAngle);


    currentDistance =
        result.distance;

    currentTargetType =
        result.type;


    // ======================================
    // SAVE SONAR RETURN
    // ======================================

    if (currentDistance >= 0) {

        sonarEchoes.push({

            angle: sonarAngle,

            distance: currentDistance,

            type: currentTargetType

        });
    }


    // ======================================
    // BUZZER
    // ======================================

    if (
        currentDistance > 0 &&
        currentDistance < 20
    ) {

        buzzerDanger();

    }

    else if (
        currentDistance >= 20 &&
        currentDistance < 50
    ) {

        buzzerWarning();

    }

    else {

        buzzerOff();
    }
}


// ==========================================
// UPDATE SONAR
// ==========================================

function updateSonar() {

    // Move turret
    sonarAngle +=
        SONAR_STEP *
        sonarDirection;


    // Scan
    scanSonar();


    // ======================================
    // REACHED 180°
    // ======================================

    if (sonarAngle >= 180) {

        sonarAngle = 180;

        sonarDirection = -1;
    }


    // ======================================
    // REACHED 0°
    // ======================================

    if (sonarAngle <= 0) {

        sonarAngle = 0;

        sonarDirection = 1;

        // New sweep
        sonarEchoes = [];
    }
}


// ==========================================
// SONAR GUI
// ==========================================

const sonarCanvas =
    document.getElementById("sonar");

const sonarCtx =
    sonarCanvas.getContext("2d");

const sonarToggle =
    document.getElementById("sonar-toggle");

const sonarPanel =
    document.getElementById("sonar-panel");

const sonarRadius = 145;


// ==========================================
// OPEN / CLOSE SONAR
// ==========================================

sonarToggle.addEventListener(
    "click",
    () => {

        setupBuzzer();

        sonarPanel.classList.toggle("open");


        if (
            sonarPanel.classList.contains("open")
        ) {

            sonarToggle.textContent =
                "CLOSE SONAR";

        }

        else {

            sonarToggle.textContent =
                "OPEN SONAR";
        }
    }
);


// ==========================================
// ANGLE → RADIANS
// ==========================================

function sonarRadians(angle) {

    return angle *
        Math.PI /
        180;
}


// ==========================================
// SONAR GRID
// ==========================================

function drawSonarGrid() {

    const cx =
        sonarCanvas.width / 2;

    const cy =
        sonarCanvas.height - 20;


    sonarCtx.strokeStyle =
        "#004400";

    sonarCtx.lineWidth = 1;


    // Distance rings

    for (
        let r = sonarRadius;
        r > 0;
        r -= sonarRadius / 4
    ) {

        sonarCtx.beginPath();

        sonarCtx.arc(
            cx,
            cy,
            r,
            Math.PI,
            Math.PI * 2
        );

        sonarCtx.stroke();
    }


    // Centre line

    sonarCtx.beginPath();

    sonarCtx.moveTo(
        cx - sonarRadius,
        cy
    );

    sonarCtx.lineTo(
        cx + sonarRadius,
        cy
    );

    sonarCtx.stroke();


    // Angle lines

    for (
        let a = 0;
        a <= 180;
        a += 30
    ) {

        const x =
            cx -
            sonarRadius *
            Math.cos(
                sonarRadians(a)
            );

        const y =
            cy -
            sonarRadius *
            Math.sin(
                sonarRadians(a)
            );


        sonarCtx.beginPath();

        sonarCtx.moveTo(
            cx,
            cy
        );

        sonarCtx.lineTo(
            x,
            y
        );

        sonarCtx.stroke();
    }
}


// ==========================================
// DRAW ECHOES
// ==========================================

function drawSonarEchoes() {

    const cx =
        sonarCanvas.width / 2;

    const cy =
        sonarCanvas.height - 20;


    for (const echo of sonarEchoes) {

        if (
            echo.distance >
            SONAR_MAX_DISTANCE
        ) {

            continue;
        }


        const scaled =
            (
                echo.distance /
                SONAR_MAX_DISTANCE
            ) *
            sonarRadius;


        const x =
            cx -
            scaled *
            Math.cos(
                sonarRadians(
                    echo.angle
                )
            );


        const y =
            cy -
            scaled *
            Math.sin(
                sonarRadians(
                    echo.angle
                )
            );


        // ==================================
        // TARGET COLOUR
        // ==================================

        if (echo.type === "mine") {

            sonarCtx.strokeStyle =
                "#ff3030";

        }

        else {

            sonarCtx.strokeStyle =
                "#00aa55";
        }


        sonarCtx.lineWidth = 2;


        // ==================================
        // BEAM
        // ==================================

        sonarCtx.beginPath();

        sonarCtx.moveTo(
            cx,
            cy
        );

        sonarCtx.lineTo(
            x,
            y
        );

        sonarCtx.stroke();


        // ==================================
        // TARGET
        // ==================================

        if (echo.type === "mine") {

            // Mine = red target

            sonarCtx.fillStyle =
                "#ff2020";

            sonarCtx.beginPath();

            sonarCtx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );

            sonarCtx.fill();

        }

        else if (
            echo.distance < 40
        ) {

            // Close wall

            sonarCtx.fillStyle =
                "red";

            sonarCtx.beginPath();

            sonarCtx.arc(
                x,
                y,
                4,
                0,
                Math.PI * 2
            );

            sonarCtx.fill();
        }
    }
}


// ==========================================
// DRAW SWEEP
// ==========================================

function drawSonarSweep() {

    const cx =
        sonarCanvas.width / 2;

    const cy =
        sonarCanvas.height - 20;


    const x =
        cx -
        sonarRadius *
        Math.cos(
            sonarRadians(
                sonarAngle
            )
        );


    const y =
        cy -
        sonarRadius *
        Math.sin(
            sonarRadians(
                sonarAngle
            )
        );


    sonarCtx.strokeStyle =
        "#00ff66";

    sonarCtx.lineWidth = 3;


    sonarCtx.beginPath();

    sonarCtx.moveTo(
        cx,
        cy
    );

    sonarCtx.lineTo(
        x,
        y
    );

    sonarCtx.stroke();
}


// ==========================================
// DRAW SONAR GUI
// ==========================================

function drawSonar() {

    // Clear
    sonarCtx.fillStyle =
        "black";

    sonarCtx.fillRect(
        0,
        0,
        sonarCanvas.width,
        sonarCanvas.height
    );


    // Radar
    drawSonarGrid();

    drawSonarEchoes();

    drawSonarSweep();


    // ======================================
    // ANGLE
    // ======================================

    document.getElementById(
        "sonar-angle"
    ).textContent =
        sonarAngle;


    // ======================================
    // DISTANCE
    // ======================================

    document.getElementById(
        "sonar-distance"
    ).textContent =
        currentDistance >= 0
            ? currentDistance
            : "-";


    // ======================================
    // STATUS
    // ======================================

    const status =
        document.getElementById(
            "sonar-status"
        );


    if (
        currentTargetType === "mine"
    ) {

        status.textContent =
            "MINE DETECTED";

    }

    else if (
        currentDistance >= 0 &&
        currentDistance < 20
    ) {

        status.textContent =
            "DANGER";

    }

    else if (
        currentDistance >= 20 &&
        currentDistance < 50
    ) {

        status.textContent =
            "WARNING";

    }

    else {

        status.textContent =
            "CLEAR";
    }
}