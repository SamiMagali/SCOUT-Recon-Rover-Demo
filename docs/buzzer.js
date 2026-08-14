// ==========================================
// SCOUT BUZZER
// ==========================================

let audioContext = null;

let buzzerOscillator = null;

let buzzerGain = null;


// ==========================================
// SETUP
// ==========================================

function setupBuzzer() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();
    }
}


// ==========================================
// STOP BUZZER
// ==========================================

function buzzerOff() {

    if (buzzerOscillator) {

        try {
            buzzerOscillator.stop();
        }

        catch (error) {}

        buzzerOscillator.disconnect();

        buzzerOscillator = null;
    }
}


// ==========================================
// WARNING
// ==========================================

function buzzerWarning() {

    setupBuzzer();

    buzzerOff();

    buzzerOscillator =
        audioContext.createOscillator();

    buzzerGain =
        audioContext.createGain();

    buzzerOscillator.frequency.value =
        2000;

    buzzerOscillator.type =
        "square";

    buzzerGain.gain.value =
        0.05;

    buzzerOscillator.connect(
        buzzerGain
    );

    buzzerGain.connect(
        audioContext.destination
    );

    buzzerOscillator.start();

    setTimeout(
        buzzerOff,
        150
    );
}


// ==========================================
// DANGER
// ==========================================

function buzzerDanger() {

    setupBuzzer();

    buzzerOff();

    buzzerOscillator =
        audioContext.createOscillator();

    buzzerGain =
        audioContext.createGain();

    buzzerOscillator.frequency.value =
        4000;

    buzzerOscillator.type =
        "square";

    buzzerGain.gain.value =
        0.07;

    buzzerOscillator.connect(
        buzzerGain
    );

    buzzerGain.connect(
        audioContext.destination
    );

    buzzerOscillator.start();

    setTimeout(
        buzzerOff,
        250
    );
}