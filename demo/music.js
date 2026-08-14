// ==========================================
// SCOUT: RECON RUN
// BACKGROUND MUSIC
// ==========================================

const backgroundMusic =
    new Audio("song.mp3");


// ==========================================
// MUSIC SETTINGS
// ==========================================

backgroundMusic.loop = true;

backgroundMusic.volume = 0.20;


// ==========================================
// START MUSIC
// ==========================================

function startMusic() {

    backgroundMusic.play().catch(() => {

        console.log(
            "Music could not start."
        );

    });

}


// ==========================================
// PLAY BUTTON
// ==========================================

const playButton =
    document.getElementById("play-button");

const startMenu =
    document.getElementById("start-menu");


playButton.addEventListener(
    "click",
    () => {

        // Start music
        startMusic();


        // Hide start menu
        startMenu.style.display =
            "none";

    }
);