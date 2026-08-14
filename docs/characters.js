// ==========================================
// SCOUT: RECON RUN
// CHARACTERS + MISSION SYSTEM
// MOBILE + PC (FIXED INPUT CONTROLLER)
// ==========================================


// ==========================================
// MISSION STATE
// ==========================================

let missionState = "WAITING"; // WAITING -> TALKING -> DELIVER -> COMPLETE


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

const dialogueText = "I've attached the meds to SCOUT. He's on his way.";

let dialogueIndex = 0;
let dialogueTimer = 0;
let dialogueFinished = false;


// ==========================================
// ANIMATION & FRAME TIMERS
// ==========================================

let messageBlinkTimer = 0;
let messageVisible = true;
let beaconPulseTimer = 0;
let characterAnimTimer = 0; // Drives the 2-frame pixel GIF animation


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
    "k": "#1e2025", // Dark suit blazer
    "K": "#2d313a", // Suit highlight / lapel
    "s": "#fce8e0", // Skin base
    "S": "#eabfb2", // Skin shadow
    "p": "#f3a5be", // Pink hair base
    "P": "#d87d93", // Pink hair shadow
    "e": "#ff2a75", // Pink eye iris
    "w": "#ffffff", // White shirt
    "g": "#d5d8e0", // Collar shadow
    "t": "#111215", // Black tie
    "m": "#f25278", // Mouth / tongue accent
    "b": "#1a1b20", // Dark pants
    "r": "#e63946", // Objective red
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
// ENTRANCE SPRITE (FRAME A - EYES OPEN)
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
// ENTRANCE SPRITE (FRAME B - IDLE SWAY / WINK)
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

function drawPixelSprite(ctx, x, y, spriteMap, pixelScale = 2.5) {
    const rows = spriteMap.length;
    const cols = spriteMap[0].length;
    const totalWidth = cols * pixelScale;
    const totalHeight = rows * pixelScale;
    const startX = x - totalWidth / 2;
    const startY = y - totalHeight / 2;

    ctx.save();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const character = spriteMap[r][c];
            let color = PIXEL_PALETTE[character];
            if (character === "R") color = PIXEL_PALETTE["r"];

            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(
                    Math.floor(startX + c * pixelScale),
                    Math.floor(startY + r * pixelScale),
                    Math.ceil(pixelScale),
                    Math.ceil(pixelScale)
                );
            }
        }
    }
    ctx.restore();
}


// ==========================================
// AUDIO
// ==========================================

function setupCharacterAudio() {
    if (!characterAudioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        characterAudioContext = new AudioContext();
    }
}

function playDialogueBlip() {
    setupCharacterAudio();
    if (!characterAudioContext) return;

    if (characterAudioContext.state === "suspended") {
        characterAudioContext.resume();
    }

    const now = characterAudioContext.currentTime;
    const oscillator = characterAudioContext.createOscillator();
    const gain = characterAudioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(240 + Math.random() * 80, now);
    oscillator.frequency.exponentialRampToValueAtTime(120, now + 0.045);

    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    oscillator.connect(gain);
    gain.connect(characterAudioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
}

function playCompletionSound() {
    setupCharacterAudio();
    if (!characterAudioContext) return;

    if (characterAudioContext.state === "suspended") {
        characterAudioContext.resume();
    }

    const now = characterAudioContext.currentTime;
    const notes = [523, 659, 784, 1047];

    notes.forEach((frequency, index) => {
        const oscillator = characterAudioContext.createOscillator();
        const gain = characterAudioContext.createGain();
        const startTime = now + index * 0.12;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        oscillator.connect(gain);
        gain.connect(characterAudioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
    });
}


// ==========================================
// DISTANCE
// ==========================================

function distanceBetween(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}


// ==========================================
// UPDATE CHARACTERS
// ==========================================

function updateCharacters() {
    messageBlinkTimer++;
    if (messageBlinkTimer >= 30) {
        messageBlinkTimer = 0;
        messageVisible = !messageVisible;
    }

    beaconPulseTimer += 0.08;
    characterAnimTimer++; // Drives pixel sprite frame changes

    // Safety check for scout
    if (typeof scout === "undefined" || !scout) return;

    // --------------------------------------
    // WAITING STATE
    // --------------------------------------
    if (missionState === "WAITING") {
        const distance = distanceBetween(
            scout.x, scout.y,
            entranceCharacter.x, entranceCharacter.y
        );

        if (distance < 55) {
            startDialogue();
        }
    }

    // --------------------------------------
    // TALKING STATE
    // --------------------------------------
    if (missionState === "TALKING") {
        if (!dialogueFinished) {
            dialogueTimer++;

            if (dialogueIndex < dialogueText.length && dialogueTimer >= 3) {
                dialogueTimer = 0;
                dialogueIndex++;

                const character = dialogueText[dialogueIndex - 1];
                if (character !== " ") {
                    playDialogueBlip();
                }
            }

            if (dialogueIndex >= dialogueText.length) {
                dialogueFinished = true;
            }
        }
    }

    // --------------------------------------
    // DELIVER STATE
    // --------------------------------------
    if (missionState === "DELIVER") {
        const distance = distanceBetween(
            scout.x, scout.y,
            objectiveCharacter.x, objectiveCharacter.y
        );

        if (distance < 55) {
            completeMission();
        }
    }

    updateConfetti();
}


// ==========================================
// MISSION STATE CONTROLS
// ==========================================

function startDialogue() {
    missionState = "TALKING";
    dialogueIndex = 0;
    dialogueTimer = 0;
    dialogueFinished = false;
    setupCharacterAudio();
}

function continueMission() {
    if (missionState !== "TALKING" || !dialogueFinished) return;
    missionState = "DELIVER";
}

function completeMission() {
    if (missionState === "COMPLETE") return;
    missionState = "COMPLETE";
    playCompletionSound();
    createConfetti();
}


// ==========================================
// DRAW CHARACTERS & UI
// ==========================================

function drawCharacters(ctx) {
    drawEntranceCharacter(ctx);
    drawObjectiveCharacter(ctx);

    if (missionState === "TALKING") {
        drawDialogue(ctx);
    }
    if (missionState === "DELIVER") {
        drawDeliveryMessage(ctx);
    }
    if (missionState === "COMPLETE") {
        drawCompleteMessage(ctx);
    }

    drawConfetti(ctx);
}

function drawEntranceCharacter(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(
        entranceCharacter.x, entranceCharacter.y + 20,
        18, 6, 0, 0, Math.PI * 2
    );
    ctx.fill();

    // 2-Frame Pixel GIF animation switch
    const currentFrame = Math.floor(characterAnimTimer / 25) % 2 === 0
        ? ENTRANCE_SPRITE_FRAME_A
        : ENTRANCE_SPRITE_FRAME_B;

    drawPixelSprite(
        ctx,
        entranceCharacter.x, entranceCharacter.y,
        currentFrame, 2.5
    );
    ctx.restore();

    if (missionState === "WAITING" && messageVisible) {
        drawMessageBubble(
            ctx,
            entranceCharacter.x, entranceCharacter.y - 55,
            "COME TO ME"
        );
    }
}

function drawObjectiveCharacter(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(
        objectiveCharacter.x, objectiveCharacter.y + 12,
        28, 8, 0, 0, Math.PI * 2
    );
    ctx.fill();

    drawPixelSprite(
        ctx,
        objectiveCharacter.x, objectiveCharacter.y,
        OBJECTIVE_SPRITE, 2.5
    );

    const alpha = (Math.sin(beaconPulseTimer) + 1) / 2;
    ctx.fillStyle = `rgba(255,42,42,${0.3 + alpha * 0.6})`;
    ctx.beginPath();
    ctx.arc(
        objectiveCharacter.x - 8, objectiveCharacter.y - 4,
        4 + alpha * 2, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    if (missionState === "DELIVER") {
        drawMessageBubble(
            ctx,
            objectiveCharacter.x, objectiveCharacter.y - 45,
            "MEDS NEEDED"
        );
    }
}

function drawMessageBubble(ctx, x, y, text) {
    ctx.save();
    ctx.font = "bold 14px monospace";
    const width = ctx.measureText(text).width + 24;
    const height = 30;

    ctx.fillStyle = "rgba(10,15,10,0.95)";
    ctx.strokeStyle = "#ffd214";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(x - width / 2, y - height / 2, width, height, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffd214";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
}


// ==========================================
// CAMERA BOUNDS
// ==========================================

function getCameraBounds() {
    const cameraX = typeof camera !== "undefined" ? camera.x : 0;
    const cameraY = typeof camera !== "undefined" ? camera.y : 0;
    const cWidth = typeof canvas !== "undefined" ? canvas.width : window.innerWidth;
    const cHeight = typeof canvas !== "undefined" ? canvas.height : window.innerHeight;

    return {
        left: cameraX,
        top: cameraY,
        right: cameraX + cWidth,
        bottom: cameraY + cHeight
    };
}


// ==========================================
// DIALOGUE UI & WRAPPING
// ==========================================

function wrapDialogueText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    for (let i = 0; i < words.length; i++) {
        const testLine = line === "" ? words[i] : line + " " + words[i];
        if (ctx.measureText(testLine).width > maxWidth && line !== "") {
            lines.push(line);
            line = words[i];
        } else {
            line = testLine;
        }
    }
    if (line !== "") lines.push(line);
    return lines;
}

function getDialogueBox(ctx) {
    const mobile = isMobileCharacterDevice();
    const bounds = getCameraBounds();
    const cWidth = typeof canvas !== "undefined" ? canvas.width : window.innerWidth;

    let boxWidth = mobile ? Math.min(360, cWidth - 24) : Math.min(440, cWidth - 40);
    const fontSize = mobile ? 14 : 15;
    const lineHeight = mobile ? 20 : 21;
    const textPadding = mobile ? 14 : 18;

    ctx.save();
    ctx.font = `${fontSize}px monospace`;
    const lines = wrapDialogueText(
        ctx,
        dialogueText.substring(0, dialogueIndex),
        boxWidth - textPadding * 2
    );
    ctx.restore();

    const textHeight = Math.max(40, lines.length * lineHeight);
    const promptHeight = dialogueFinished ? 26 : 0;
    const boxHeight = textPadding + textHeight + promptHeight + 14;

    let x = entranceCharacter.x + 40;
    let y = entranceCharacter.y - boxHeight - 45;

    x = Math.max(bounds.left + 12, Math.min(x, bounds.right - boxWidth - 12));
    if (y < bounds.top + 12) y = entranceCharacter.y + 40;
    y = Math.max(bounds.top + 12, Math.min(y, bounds.bottom - boxHeight - 12));

    return { x, y, width: boxWidth, height: boxHeight, fontSize, lineHeight, textPadding, lines };
}

function drawDialogue(ctx) {
    const box = getDialogueBox(ctx);
    ctx.save();

    ctx.fillStyle = "rgba(10,15,10,0.96)";
    ctx.strokeStyle = "#ffd214";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(box.x, box.y, box.width, box.height, 8);
    ctx.fill();
    ctx.stroke();

    // Speech Pointer
    ctx.beginPath();
    ctx.moveTo(box.x + 20, box.y + box.height);
    ctx.lineTo(box.x + 5, box.y + box.height + 15);
    ctx.lineTo(box.x + 45, box.y + box.height);
    ctx.fill();

    // Text
    ctx.fillStyle = "#eee";
    ctx.font = `${box.fontSize}px monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    let textY = box.y + box.textPadding;
    for (const line of box.lines) {
        ctx.fillText(line, box.x + box.textPadding, textY);
        textY += box.lineHeight;
    }

    // Prompt
    if (dialogueFinished) {
        ctx.fillStyle = "#ffd214";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const prompt = isMobileCharacterDevice()
            ? "TAP SCREEN TO CONTINUE"
            : "PRESS ENTER / TAP TO CONTINUE";

        ctx.fillText(prompt, box.x + box.width / 2, box.y + box.height - 13);
    }

    ctx.restore();
}

function drawDeliveryMessage(ctx) {
    drawMessageBubble(
        ctx,
        objectiveCharacter.x, objectiveCharacter.y - 45,
        "DELIVER THE MEDS"
    );
}

function drawCompleteMessage(ctx) {
    const bounds = getCameraBounds();
    const cWidth = typeof canvas !== "undefined" ? canvas.width : window.innerWidth;
    const cHeight = typeof canvas !== "undefined" ? canvas.height : window.innerHeight;

    const width = Math.min(420, cWidth - 30);
    const height = 110;

    const x = bounds.left + cWidth / 2 - width / 2;
    const y = bounds.top + cHeight / 2 - height / 2;

    ctx.save();
    ctx.fillStyle = "rgba(10,20,10,0.96)";
    ctx.strokeStyle = "#ffd214";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffd214";
    ctx.font = "bold 26px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("MISSION COMPLETE!", x + width / 2, y + 45);

    ctx.fillStyle = "#eee";
    ctx.font = "15px monospace";
    ctx.fillText("MEDS DELIVERED", x + width / 2, y + 75);

    ctx.restore();
}


// ==========================================
// CONFETTI
// ==========================================

function createConfetti() {
    confetti = [];
    const bounds = getCameraBounds();
    const cWidth = typeof canvas !== "undefined" ? canvas.width : window.innerWidth;
    const cHeight = typeof canvas !== "undefined" ? canvas.height : window.innerHeight;

    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: bounds.left + cWidth / 2,
            y: bounds.top + cHeight / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 12 - 4,
            size: 3 + Math.random() * 4,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.3,
            life: 120 + Math.random() * 80
        });
    }
}

function updateConfetti() {
    for (const piece of confetti) {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.18;
        piece.rotation += piece.rotationSpeed;
        piece.life--;
    }
    confetti = confetti.filter(piece => piece.life > 0);
}

function drawConfetti(ctx) {
    const colours = ["#ffd214", "#00e5ff", "#ff4d6d", "#66ff66", "#ffffff"];

    for (const piece of confetti) {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.fillStyle = colours[Math.floor(Math.random() * colours.length)];
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 2);
        ctx.restore();
    }
}


// ==========================================
// UNIFIED INPUT LISTENERS (PC + MOBILE)
// ==========================================

// PC ENTER KEY / SPACE BAR
window.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " " || event.code === "Space") {
        if (missionState === "TALKING" && dialogueFinished) {
            event.preventDefault();
            continueMission();
        }
    }
});

// TOUCH / TAP / POINTER (MOBILE & PC SCREEN CLICKS)
window.addEventListener("pointerdown", function (event) {
    if (missionState !== "TALKING" || !dialogueFinished) {
        return;
    }

    // Ignore taps on mobile D-Pad / controls if present
    if (event.target && event.target.closest && event.target.closest("#mobile-controls")) {
        return;
    }

    continueMission();
});