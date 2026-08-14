// ==========================================
// SCOUT: RECON RUN
// MOBILE CONTROLS
// ==========================================


// ==========================================
// MOBILE CONTROLS ELEMENT
// ==========================================

const mobileControls =
    document.getElementById("mobile-controls");


// ==========================================
// MOBILE DETECTION
// ==========================================

function isMobileDevice() {

    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
    );

}


// ==========================================
// SHOW / HIDE CONTROLS
// ==========================================

function setupMobileControls() {

    if (!mobileControls) return;


    if (isMobileDevice()) {

        mobileControls.style.display =
            "flex";

    } else {

        mobileControls.style.display =
            "none";

    }

}


// ==========================================
// BUTTON CONTROL
// ==========================================

function setupMobileButton(
    button,
    key
) {

    if (!button) return;


    // --------------------------------------
    // PRESS
    // --------------------------------------

    button.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            keys[key] = true;

            // Keep receiving this pointer
            // even if the finger moves slightly.

            if (
                button.setPointerCapture &&
                event.pointerId !== undefined
            ) {

                try {

                    button.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {}

            }

        }
    );


    // --------------------------------------
    // RELEASE
    // --------------------------------------

    button.addEventListener(
        "pointerup",
        function(event) {

            event.preventDefault();

            keys[key] = false;

        }
    );


    // --------------------------------------
    // CANCEL
    // --------------------------------------

    button.addEventListener(
        "pointercancel",
        function(event) {

            event.preventDefault();

            keys[key] = false;

        }
    );

}


// ==========================================
// INITIALISE BUTTONS
// ==========================================

function initialiseMobileControls() {

    setupMobileButton(
        document.getElementById("mobile-up"),
        "w"
    );


    setupMobileButton(
        document.getElementById("mobile-down"),
        "s"
    );


    setupMobileButton(
        document.getElementById("mobile-left"),
        "a"
    );


    setupMobileButton(
        document.getElementById("mobile-right"),
        "d"
    );

}


// ==========================================
// PREVENT PAGE SCROLLING
// ==========================================

document.addEventListener(
    "touchmove",
    function(event) {

        if (
            event.target.closest &&
            event.target.closest(
                "#mobile-controls"
            )
        ) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


// ==========================================
// RELEASE ALL MOBILE KEYS
// ==========================================

function releaseMobileKeys() {

    keys["w"] = false;
    keys["a"] = false;
    keys["s"] = false;
    keys["d"] = false;

}


// ==========================================
// SAFETY
// ==========================================

// If the user switches apps, locks the phone,
// or the browser loses focus, stop the rover.

document.addEventListener(
    "visibilitychange",
    function() {

        if (document.hidden) {

            releaseMobileKeys();

        }

    }
);


window.addEventListener(
    "blur",
    function() {

        releaseMobileKeys();

    }
);


// ==========================================
// START MOBILE SYSTEM
// ==========================================

window.addEventListener(
    "load",
    function() {

        setupMobileControls();

        initialiseMobileControls();

    }
);