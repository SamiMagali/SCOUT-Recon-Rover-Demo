// ==========================================
// SCOUT: RECON RUN
// CHARACTERS + MISSION SYSTEM
// MOBILE + PC
// ==========================================


// ==========================================
// MISSION STATE
// ==========================================

let missionState = "WAITING";
// WAITING -> TALKING -> DELIVER -> COMPLETE


// ==========================================
// CHARACTER POSITIONS
// ==========================================

const entranceCharacter = {
    x: 100,
    y: 300
};

const objectiveCharacter = {
    x: 1215,
    y: 350
};


// ==========================================
// DIALOGUE
// ==========================================

const dialogueText =
    "I've attached the meds to SCOUT. He's on his way.";

let dialogueIndex = 0;
let dialogueTimer = 0;
let dialogueFinished = false;


// ==========================================
// ANIMATION & FRAME TIMERS
// ==========================================

let messageBlinkTimer = 0;
let messageVisible = true;

let beaconPulseTimer = 0;
let characterAnimTimer = 0;


// ==========================================
// COMPLETION SYSTEM
// ==========================================

let completionStartTime = 0;
let completionTimer = null;


// ==========================================
// CONFETTI + AUDIO
// ==========================================

let confetti = [];
let characterAudioContext = null;


// ==========================================
// MOBILE DETECTION
// ==========================================

function isMobileCharacterDevice() {

    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
    );

}


// ==========================================
// PIXEL PALETTE
// ==========================================

const PIXEL_PALETTE = {

    ".": null,

    "k": "#1e2025",
    "K": "#2d313a",

    "s": "#fce8e0",
    "S": "#eabfb2",

    "p": "#f3a5be",
    "P": "#d87d93",

    "e": "#ff2a75",

    "w": "#ffffff",
    "g": "#d5d8e0",

    "t": "#111215",
    "m": "#f25278",

    "b": "#1a1b20",

    "r": "#e63946",

    "v": "#3d434a",
    "V": "#58606b",

    "u": "#2c4159",
    "U": "#3e5a7c",

    "D": "#1b2a3c",

    "a": "#d9d4c5",

    "x": "#9e1b1b",
    "X": "#570b0b"
};


// ==========================================
// ENTRANCE SPRITE
// FRAME A
// ==========================================

const ENTRANCE_SPRITE_FRAME_A = [

    "......pppppp........",
    "....pppppppppp......",
    "...pPppppppppPp.....",
    "..ppPpppssssPpp.....",
    "..pPpppssssssPpp....",
    "..ppPpsSeseSsPpp....",
    "...pPpsssmmssPps....",
    "....psssswssps......",
    "...kkkwwttwwkkk.....",
    "..kkkkkgwtwgkkkk....",
    "..kkkkkkwttwkkkk....",
    ".kkkkkkkkttkkkkkk...",
    ".kkkkkkkkttkkkkkk...",
    "..kkkkkkkkkkkkkk....",
    "...bbbb....bbbb.....",
    "...bbbb....bbbb.....",
    "...bbbb....bbbb.....",
    "...bbbb....bbbb....."

];


// ==========================================
// ENTRANCE SPRITE
// FRAME B
// ==========================================

const ENTRANCE_SPRITE_FRAME_B = [

    "......pppppp........",
    "....pppppppppp......",
    "...pPppppppppPp.....",
    "..ppPpppssssPpp.....",
    "..pPpppssssssPpp....",
    "..ppPpsSeseSsPpp....",
    "...pPpsssPpssPps....",
    "....psssswssps......",
    "...kkkwwttwwkkk.....",
    "..kkkkkgwtwgkkkk....",
    "..kkkkkkwttwkkkk....",
    ".kkkkkkkkttkkkkkk...",
    ".kkkkkkkkttkkkkkk...",
    "..kkkkkkkkkkkkkk....",
    "...bbbb....bbbb.....",
    "...bbbb....bbbb.....",
    "...bbbb....bbbb.....",
    "...bbbb....bbbb....."

];


// ==========================================
// OBJECTIVE SPRITE
// ==========================================

const OBJECTIVE_SPRITE = [

    "........................",
    "..hhhhhh................",
    ".hhCCCCChh..............",
    ".hCCCsSSSs..............",
    ".hCCsSddds..............",
    "..hsssss................",
    ".vVVVVVVVVvvvv..........",
    "vVVVVwRRwVVVVVvv........",
    "vVVXXxXXxVVVVVVvvaaa....",
    "uUDDXXXXXXDDDDDUuaaa....",
    "gUUDDDDDDDDDDDDpp......",
    ".ggbbbbbbbbbbppppbbbb...",
    "...pppppppp..ppppbbbb...",
    ".............bbbb......."

];


// ==========================================
// PIXEL SPRITE RENDERER
// ==========================================

function drawPixelSprite(
    ctx,
    x,
    y,
    spriteMap,
    pixelScale = 2.5
) {

    const rows = spriteMap.length;
    const cols = spriteMap[0].length;

    const totalWidth =
        cols * pixelScale;

    const totalHeight =
        rows * pixelScale;

    const startX =
        x - totalWidth / 2;

    const startY =
        y - totalHeight / 2;


    ctx.save();


    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < cols; c++) {

            const character =
                spriteMap[r][c];

            let color =
                PIXEL_PALETTE[character];


            if (character === "R") {
                color =
                    PIXEL_PALETTE["r"];
            }


            if (color) {

                ctx.fillStyle = color;

                ctx.fillRect(

                    Math.floor(
                        startX +
                        c * pixelScale
                    ),

                    Math.floor(
                        startY +
                        r * pixelScale
                    ),

                    Math.ceil(pixelScale),
                    Math.ceil(pixelScale)

                );

            }

        }

    }


    ctx.restore();

}


// ==========================================
// AUDIO SETUP
// ==========================================

function setupCharacterAudio() {

    if (!characterAudioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return;

        characterAudioContext =
            new AudioContext();

    }

}


// ==========================================
// DIALOGUE SOUND
// ==========================================

function playDialogueBlip() {

    setupCharacterAudio();

    if (!characterAudioContext) return;


    if (
        characterAudioContext.state ===
        "suspended"
    ) {

        characterAudioContext.resume();

    }


    const now =
        characterAudioContext.currentTime;


    const oscillator =
        characterAudioContext.createOscillator();

    const gain =
        characterAudioContext.createGain();


    oscillator.type = "square";


    oscillator.frequency.setValueAtTime(
        240 + Math.random() * 80,
        now
    );


    oscillator.frequency.exponentialRampToValueAtTime(
        120,
        now + 0.045
    );


    gain.gain.setValueAtTime(
        0.055,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.05
    );


    oscillator.connect(gain);
    gain.connect(
        characterAudioContext.destination
    );


    oscillator.start(now);

    oscillator.stop(
        now + 0.05
    );

}


// ==========================================
// COMPLETION SOUND
// ==========================================

function playCompletionSound() {

    setupCharacterAudio();

    if (!characterAudioContext) return;


    if (
        characterAudioContext.state ===
        "suspended"
    ) {

        characterAudioContext.resume();

    }


    const now =
        characterAudioContext.currentTime;


    const notes = [
        523,
        659,
        784,
        1047
    ];


    notes.forEach(
        (frequency, index) => {

            const oscillator =
                characterAudioContext
                    .createOscillator();

            const gain =
                characterAudioContext
                    .createGain();


            const startTime =
                now + index * 0.12;


            oscillator.type = "sine";


            oscillator.frequency.setValueAtTime(
                frequency,
                startTime
            );


            gain.gain.setValueAtTime(
                0,
                startTime
            );


            gain.gain.linearRampToValueAtTime(
                0.15,
                startTime + 0.02
            );


            gain.gain.exponentialRampToValueAtTime(
                0.001,
                startTime + 0.3
            );


            oscillator.connect(gain);

            gain.connect(
                characterAudioContext.destination
            );


            oscillator.start(
                startTime
            );


            oscillator.stop(
                startTime + 0.3
            );

        }
    );

}


// ==========================================
// DISTANCE
// ==========================================

function distanceBetween(
    x1,
    y1,
    x2,
    y2
) {

    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


// ==========================================
// UPDATE CHARACTERS
// ==========================================

function updateCharacters() {

    messageBlinkTimer++;


    if (messageBlinkTimer >= 30) {

        messageBlinkTimer = 0;

        messageVisible =
            !messageVisible;

    }


    beaconPulseTimer += 0.08;

    characterAnimTimer++;


    // --------------------------------------
    // SAFETY CHECK
    // --------------------------------------

    if (
        typeof scout === "undefined" ||
        !scout
    ) {

        return;

    }


    // --------------------------------------
    // WAITING
    // --------------------------------------

    if (
        missionState === "WAITING"
    ) {

        const distance =
            distanceBetween(

                scout.x,
                scout.y,

                entranceCharacter.x,
                entranceCharacter.y

            );


        if (distance < 55) {

            startDialogue();

        }

    }


    // --------------------------------------
    // TALKING
    // --------------------------------------

    if (
        missionState === "TALKING"
    ) {

        if (!dialogueFinished) {

            dialogueTimer++;


            if (
                dialogueIndex <
                dialogueText.length &&
                dialogueTimer >= 3
            ) {

                dialogueTimer = 0;

                dialogueIndex++;


                const character =
                    dialogueText[
                        dialogueIndex - 1
                    ];


                if (
                    character !== " "
                ) {

                    playDialogueBlip();

                }

            }


            if (
                dialogueIndex >=
                dialogueText.length
            ) {

                dialogueFinished =
                    true;

            }

        }

    }


    // --------------------------------------
    // DELIVER
    // --------------------------------------

    if (
        missionState === "DELIVER"
    ) {

        const distance =
            distanceBetween(

                scout.x,
                scout.y,

                objectiveCharacter.x,
                objectiveCharacter.y

            );


        if (distance < 55) {

            completeMission();

        }

    }


    // --------------------------------------
    // CONFETTI
    // --------------------------------------

    updateConfetti();

}


// ==========================================
// START DIALOGUE
// ==========================================

function startDialogue() {

    missionState = "TALKING";

    dialogueIndex = 0;
    dialogueTimer = 0;
    dialogueFinished = false;

    setupCharacterAudio();

}


// ==========================================
// CONTINUE MISSION
// ==========================================

function continueMission() {

    if (
        missionState !== "TALKING" ||
        !dialogueFinished
    ) {

        return;

    }


    missionState = "DELIVER";

}


// ==========================================
// COMPLETE MISSION
// ==========================================

function completeMission() {

    // Prevent duplicate completion
    if (
        missionState === "COMPLETE"
    ) {

        return;

    }


    missionState = "COMPLETE";


    // Start completion animation
    completionStartTime =
        Date.now();


    // Completion sound
    playCompletionSound();


    // Confetti
    createConfetti();


    // Clear any existing timer
    if (completionTimer) {

        clearTimeout(
            completionTimer
        );

    }


    // --------------------------------------
    // RETURN TO MENU AFTER 3 SECONDS
    // --------------------------------------

    completionTimer =
        setTimeout(

            () => {

                returnToMenuAfterCompletion();

            },

            3000

        );

}


// ==========================================
// RETURN TO MENU AFTER COMPLETION
// ==========================================

function returnToMenuAfterCompletion() {

    completionTimer = null;


    // --------------------------------------
    // RESET MISSION
    // --------------------------------------

    missionState =
        "WAITING";


    dialogueIndex = 0;
    dialogueTimer = 0;
    dialogueFinished = false;


    messageBlinkTimer = 0;
    messageVisible = true;

    beaconPulseTimer = 0;
    characterAnimTimer = 0;


    // Remove confetti
    confetti = [];


    // --------------------------------------
    // RESET GAME SYSTEMS
    // --------------------------------------

    if (
        typeof resetGameState ===
        "function"
    ) {

        resetGameState();

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


// ==========================================
// DRAW CHARACTERS
// ==========================================

function drawCharacters(ctx) {

    drawEntranceCharacter(ctx);

    drawObjectiveCharacter(ctx);


    if (
        missionState === "TALKING"
    ) {

        drawDialogue(ctx);

    }


    if (
        missionState === "DELIVER"
    ) {

        drawDeliveryMessage(ctx);

    }


    if (
        missionState === "COMPLETE"
    ) {

        drawCompleteMessage(ctx);

    }


    drawConfetti(ctx);

}


// ==========================================
// ENTRANCE CHARACTER
// ==========================================

function drawEntranceCharacter(ctx) {

    ctx.save();


    // Shadow
    ctx.fillStyle =
        "rgba(0,0,0,0.4)";


    ctx.beginPath();


    ctx.ellipse(

        entranceCharacter.x,
        entranceCharacter.y + 20,

        18,
        6,

        0,
        0,
        Math.PI * 2

    );


    ctx.fill();


    // Animation frame
    const currentFrame =
        Math.floor(
            characterAnimTimer / 25
        ) % 2 === 0

            ? ENTRANCE_SPRITE_FRAME_A

            : ENTRANCE_SPRITE_FRAME_B;


    drawPixelSprite(

        ctx,

        entranceCharacter.x,
        entranceCharacter.y,

        currentFrame,

        2.5

    );


    ctx.restore();


    // Waiting message
    if (
        missionState === "WAITING" &&
        messageVisible
    ) {

        drawMessageBubble(

            ctx,

            entranceCharacter.x,
            entranceCharacter.y - 55,

            "COME TO ME"

        );

    }

}


// ==========================================
// OBJECTIVE CHARACTER
// ==========================================

function drawObjectiveCharacter(ctx) {

    ctx.save();


    // Shadow
    ctx.fillStyle =
        "rgba(0,0,0,0.4)";


    ctx.beginPath();


    ctx.ellipse(

        objectiveCharacter.x,
        objectiveCharacter.y + 12,

        28,
        8,

        0,
        0,
        Math.PI * 2

    );


    ctx.fill();


    // Sprite
    drawPixelSprite(

        ctx,

        objectiveCharacter.x,
        objectiveCharacter.y,

        OBJECTIVE_SPRITE,

        2.5

    );


    // Beacon
    const alpha =
        (Math.sin(
            beaconPulseTimer
        ) + 1) / 2;


    ctx.fillStyle =
        `rgba(255,42,42,${0.3 + alpha * 0.6})`;


    ctx.beginPath();


    ctx.arc(

        objectiveCharacter.x - 8,
        objectiveCharacter.y - 4,

        4 + alpha * 2,

        0,
        Math.PI * 2

    );


    ctx.fill();


    ctx.restore();


    // Delivery message
    if (
        missionState === "DELIVER"
    ) {

        drawMessageBubble(

            ctx,

            objectiveCharacter.x,
            objectiveCharacter.y - 45,

            "MEDS NEEDED"

        );

    }

}


// ==========================================
// MESSAGE BUBBLE
// ==========================================

function drawMessageBubble(
    ctx,
    x,
    y,
    text
) {

    ctx.save();


    ctx.font =
        "bold 14px monospace";


    const width =
        ctx.measureText(text).width +
        24;


    const height = 30;


    ctx.fillStyle =
        "rgba(10,15,10,0.95)";


    ctx.strokeStyle =
        "#ffd214";


    ctx.lineWidth = 2;


    ctx.beginPath();


    ctx.roundRect(

        x - width / 2,
        y - height / 2,

        width,
        height,

        6

    );


    ctx.fill();
    ctx.stroke();


    ctx.fillStyle =
        "#ffd214";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        text,
        x,
        y
    );


    ctx.restore();

}


// ==========================================
// CAMERA BOUNDS
// ==========================================

function getCameraBounds() {

    const cameraX =
        typeof camera !== "undefined"
            ? camera.x
            : 0;


    const cameraY =
        typeof camera !== "undefined"
            ? camera.y
            : 0;


    const cWidth =
        typeof canvas !== "undefined"
            ? canvas.width
            : window.innerWidth;


    const cHeight =
        typeof canvas !== "undefined"
            ? canvas.height
            : window.innerHeight;


    return {

        left: cameraX,
        top: cameraY,

        right:
            cameraX + cWidth,

        bottom:
            cameraY + cHeight

    };

}


// ==========================================
// DIALOGUE WRAPPING
// ==========================================

function wrapDialogueText(
    ctx,
    text,
    maxWidth
) {

    const words =
        text.split(" ");


    const lines = [];

    let line = "";


    for (
        let i = 0;
        i < words.length;
        i++
    ) {

        const testLine =
            line === ""

                ? words[i]

                : line +
                  " " +
                  words[i];


        if (
            ctx.measureText(
                testLine
            ).width > maxWidth &&
            line !== ""
        ) {

            lines.push(line);

            line = words[i];

        } else {

            line = testLine;

        }

    }


    if (line !== "") {

        lines.push(line);

    }


    return lines;

}


// ==========================================
// DIALOGUE BOX
// ==========================================

function getDialogueBox(ctx) {

    const mobile =
        isMobileCharacterDevice();


    const bounds =
        getCameraBounds();


    const cWidth =
        typeof canvas !== "undefined"
            ? canvas.width
            : window.innerWidth;


    const boxWidth =
        mobile

            ? Math.min(
                360,
                cWidth - 24
            )

            : Math.min(
                440,
                cWidth - 40
            );


    const fontSize =
        mobile ? 14 : 15;


    const lineHeight =
        mobile ? 20 : 21;


    const textPadding =
        mobile ? 14 : 18;


    ctx.save();


    ctx.font =
        `${fontSize}px monospace`;


    const lines =
        wrapDialogueText(

            ctx,

            dialogueText.substring(
                0,
                dialogueIndex
            ),

            boxWidth -
            textPadding * 2

        );


    ctx.restore();


    const textHeight =
        Math.max(
            40,
            lines.length *
            lineHeight
        );


    const promptHeight =
        dialogueFinished
            ? 26
            : 0;


    const boxHeight =
        textPadding +
        textHeight +
        promptHeight +
        14;


    let x =
        entranceCharacter.x + 40;


    let y =
        entranceCharacter.y -
        boxHeight -
        45;


    x =
        Math.max(

            bounds.left + 12,

            Math.min(
                x,
                bounds.right -
                boxWidth -
                12
            )

        );


    if (
        y <
        bounds.top + 12
    ) {

        y =
            entranceCharacter.y + 40;

    }


    y =
        Math.max(

            bounds.top + 12,

            Math.min(
                y,
                bounds.bottom -
                boxHeight -
                12
            )

        );


    return {

        x,
        y,

        width:
            boxWidth,

        height:
            boxHeight,

        fontSize,
        lineHeight,
        textPadding,

        lines

    };

}


// ==========================================
// DRAW DIALOGUE
// ==========================================

function drawDialogue(ctx) {

    const box =
        getDialogueBox(ctx);


    ctx.save();


    ctx.fillStyle =
        "rgba(10,15,10,0.96)";


    ctx.strokeStyle =
        "#ffd214";


    ctx.lineWidth = 2;


    ctx.beginPath();


    ctx.roundRect(

        box.x,
        box.y,

        box.width,
        box.height,

        8

    );


    ctx.fill();
    ctx.stroke();


    // Speech pointer
    ctx.beginPath();


    ctx.moveTo(
        box.x + 20,
        box.y + box.height
    );


    ctx.lineTo(
        box.x + 5,
        box.y + box.height + 15
    );


    ctx.lineTo(
        box.x + 45,
        box.y + box.height
    );


    ctx.fill();


    // Text
    ctx.fillStyle =
        "#eee";


    ctx.font =
        `${box.fontSize}px monospace`;


    ctx.textAlign =
        "left";


    ctx.textBaseline =
        "top";


    let textY =
        box.y +
        box.textPadding;


    for (
        const line of box.lines
    ) {

        ctx.fillText(

            line,

            box.x +
            box.textPadding,

            textY

        );


        textY +=
            box.lineHeight;

    }


    // Continue prompt
    if (
        dialogueFinished
    ) {

        ctx.fillStyle =
            "#ffd214";


        ctx.font =
            "bold 13px monospace";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        const prompt =
            isMobileCharacterDevice()

                ? "TAP SCREEN TO CONTINUE"

                : "PRESS ENTER / TAP TO CONTINUE";


        ctx.fillText(

            prompt,

            box.x +
            box.width / 2,

            box.y +
            box.height -
            13

        );

    }


    ctx.restore();

}


// ==========================================
// DELIVERY MESSAGE
// ==========================================

function drawDeliveryMessage(ctx) {

    drawMessageBubble(

        ctx,

        objectiveCharacter.x,
        objectiveCharacter.y - 45,

        "DELIVER THE MEDS"

    );

}


// ==========================================
// MISSION COMPLETE SCREEN
// ==========================================

function drawCompleteMessage(ctx) {

    const bounds =
        getCameraBounds();


    const cWidth =
        typeof canvas !== "undefined"
            ? canvas.width
            : window.innerWidth;


    const cHeight =
        typeof canvas !== "undefined"
            ? canvas.height
            : window.innerHeight;


    // ======================================
    // BLACK OVERLAY
    // ======================================

    ctx.save();


    ctx.fillStyle =
        "rgba(0,0,0,0.95)";


    ctx.fillRect(

        bounds.left,
        bounds.top,

        cWidth,
        cHeight

    );


    // ======================================
    // COMPLETION PANEL
    // ======================================

    const width =
        Math.min(
            500,
            cWidth - 40
        );


    const height = 170;


    const x =
        bounds.left +
        cWidth / 2 -
        width / 2;


    const y =
        bounds.top +
        cHeight / 2 -
        height / 2;


    ctx.fillStyle =
        "rgba(10,20,10,0.98)";


    ctx.strokeStyle =
        "#ffd214";


    ctx.lineWidth = 3;


    ctx.beginPath();


    ctx.roundRect(

        x,
        y,

        width,
        height,

        12

    );


    ctx.fill();
    ctx.stroke();


    // ======================================
    // TITLE
    // ======================================

    ctx.fillStyle =
        "#ffd214";


    ctx.font =
        "bold 28px monospace";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "alphabetic";


    ctx.fillText(

        "MISSION COMPLETE!",

        x + width / 2,
        y + 55

    );


    // ======================================
    // SUBTITLE
    // ======================================

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "16px monospace";


    ctx.fillText(

        "MEDS DELIVERED",

        x + width / 2,
        y + 90

    );


    // ======================================
    // COUNTDOWN
    // ======================================

    const elapsed =
        Date.now() -
        completionStartTime;


    const remaining =
        Math.max(

            0,

            Math.ceil(
                (3000 - elapsed) /
                1000
            )

        );


    ctx.fillStyle =
        "#888";


    ctx.font =
        "13px monospace";


    ctx.fillText(

        `RETURNING TO MENU IN ${remaining}...`,

        x + width / 2,
        y + 130

    );


    ctx.restore();

}


// ==========================================
// CONFETTI
// ==========================================

const CONFETTI_COLOURS = [

    "#ffd214",
    "#00e5ff",
    "#ff4d6d",
    "#66ff66",
    "#ffffff"

];


// ==========================================
// CREATE CONFETTI
// ==========================================

function createConfetti() {

    confetti = [];


    const bounds =
        getCameraBounds();


    const cWidth =
        typeof canvas !== "undefined"
            ? canvas.width
            : window.innerWidth;


    const cHeight =
        typeof canvas !== "undefined"
            ? canvas.height
            : window.innerHeight;


    for (
        let i = 0;
        i < 120;
        i++
    ) {

        confetti.push({

            x:
                bounds.left +
                cWidth / 2,

            y:
                bounds.top +
                cHeight / 2,


            vx:
                (Math.random() - 0.5) *
                10,


            vy:
                (Math.random() - 0.5) *
                12 -
                4,


            size:
                3 +
                Math.random() * 4,


            rotation:
                Math.random() *
                Math.PI,


            rotationSpeed:
                (Math.random() - 0.5) *
                0.3,


            life:
                120 +
                Math.random() * 80,


            colour:
                CONFETTI_COLOURS[
                    Math.floor(
                        Math.random() *
                        CONFETTI_COLOURS.length
                    )
                ]

        });

    }

}


// ==========================================
// UPDATE CONFETTI
// ==========================================

function updateConfetti() {

    for (
        const piece of confetti
    ) {

        piece.x +=
            piece.vx;


        piece.y +=
            piece.vy;


        piece.vy +=
            0.18;


        piece.rotation +=
            piece.rotationSpeed;


        piece.life--;

    }


    confetti =
        confetti.filter(

            piece =>
                piece.life > 0

        );

}


// ==========================================
// DRAW CONFETTI
// ==========================================

function drawConfetti(ctx) {

    for (
        const piece of confetti
    ) {

        ctx.save();


        ctx.translate(
            piece.x,
            piece.y
        );


        ctx.rotate(
            piece.rotation
        );


        ctx.fillStyle =
            piece.colour;


        ctx.fillRect(

            -piece.size / 2,
            -piece.size / 2,

            piece.size,
            piece.size * 2

        );


        ctx.restore();

    }

}


// ==========================================
// PC INPUT
// ==========================================

window.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" ||
            event.key === " " ||
            event.code === "Space"
        ) {

            if (
                missionState === "TALKING" &&
                dialogueFinished
            ) {

                event.preventDefault();

                continueMission();

            }

        }

    }
);


// ==========================================
// POINTER / TOUCH INPUT
// ==========================================

window.addEventListener(
    "pointerdown",
    function (event) {

        if (
            missionState !== "TALKING" ||
            !dialogueFinished
        ) {

            return;

        }


        // Ignore mobile controls
        if (
            event.target &&
            event.target.closest &&
            event.target.closest(
                "#mobile-controls"
            )
        ) {

            return;

        }


        continueMission();

    }
);