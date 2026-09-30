/* =========================================================
   LATA & RAKIB
   BIRTHDAY COUNTDOWN + BIRTHDAY CELEBRATION SYSTEM
========================================================= */


/* =========================================================
   BIRTHDAY EVENTS
========================================================= */

const BIRTHDAY_EVENTS = {

    HABIBA: {
        name: "HABIBA",

        // Countdown starts
        startMonth: 5,
        startDay: 1,

        // Birthday
        birthdayMonth: 5,
        birthdayDay: 31,

        message: "HAPPY BIRTHDAY HABIBA ❤️",

        subtitle:
            "May your day be filled with love, happiness & beautiful memories. ❤️"
    },


    RAKIB: {
        name: "RAKIB",

        // Countdown starts
        startMonth: 4,
        startDay: 1,

        // Birthday
        birthdayMonth: 4,
        birthdayDay: 24,

        message: "HAPPY BIRTHDAY RAKIB ❤️",

        subtitle:
            "May your life always be filled with love, happiness & beautiful memories. ❤️"
    }

};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const birthdayOverlay =
    document.getElementById("birthdayOverlay");


const birthdayCountdownBox =
    document.getElementById("birthdayCountdownBox");


const birthdayMessageBox =
    document.getElementById("birthdayMessageBox");


const countdownName =
    document.getElementById("countdownName");


const countDays =
    document.getElementById("countDays");


const countHours =
    document.getElementById("countHours");


const countMinutes =
    document.getElementById("countMinutes");


const countSeconds =
    document.getElementById("countSeconds");


const birthdayName =
    document.getElementById("birthdayName");


const birthdaySubtitle =
    document.getElementById("birthdaySubtitle");


const birthdayClose =
    document.getElementById("birthdayClose");


const countdownClose =
    document.getElementById("countdownClose");


/* =========================================================
   GLOBAL TIMER
========================================================= */

let birthdayCountdownTimer = null;


/* =========================================================
   DATE HELPERS
========================================================= */

/*
    Returns today's date without time.

    Example:
    2026-05-15 14:35
    becomes
    2026-05-15 00:00
*/

function getToday() {

    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );
}


/*
    Create a local date.

    month = 1-12
*/

function createDate(year, month, day) {

    return new Date(
        year,
        month - 1,
        day
    );
}


/* =========================================================
   FIND ACTIVE BIRTHDAY EVENT
========================================================= */

function getCurrentBirthdayEvent() {

    const today =
        getToday();


    const currentYear =
        today.getFullYear();


    const events =
        Object.values(BIRTHDAY_EVENTS);


    for (const event of events) {

        const countdownStart =
            createDate(
                currentYear,
                event.startMonth,
                event.startDay
            );


        const birthdayDate =
            createDate(
                currentYear,
                event.birthdayMonth,
                event.birthdayDay
            );


        /*
         * ==============================================
         * BIRTHDAY DAY
         * ==============================================
         */

        if (
            today.getTime() ===
            birthdayDate.getTime()
        ) {

            return {

                type: "birthday",

                event: event,

                targetDate: birthdayDate

            };
        }


        /*
         * ==============================================
         * COUNTDOWN PERIOD
         * ==============================================
         *
         * Example:
         *
         * May 1 -> May 30
         * HABIBA countdown
         */

        if (
            today >= countdownStart &&
            today < birthdayDate
        ) {

            return {

                type: "countdown",

                event: event,

                targetDate: birthdayDate

            };
        }

    }


    /*
     * No active countdown
     * No birthday
     */

    return null;
}


/* =========================================================
   OPEN OVERLAY
========================================================= */

function openBirthdayOverlay() {

    if (!birthdayOverlay) {
        return;
    }


    birthdayOverlay.classList.add(
        "active"
    );


    birthdayOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
     * Prevent background scrolling
     */

    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CLOSE OVERLAY
========================================================= */

function closeBirthdayOverlay() {

    if (!birthdayOverlay) {
        return;
    }


    birthdayOverlay.classList.remove(
        "active"
    );


    birthdayOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * Restore page scrolling
     */

    document.body.style.overflow =
        "";
}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function padNumber(number) {

    return String(number)
        .padStart(2, "0");
}


/* =========================================================
   START COUNTDOWN
========================================================= */

function startBirthdayCountdown(
    event,
    birthdayDate
) {

    if (!birthdayCountdownBox) {
        return;
    }


    /*
     * Show countdown
     */

    birthdayCountdownBox.style.display =
        "block";


    /*
     * Hide birthday message
     */

    if (birthdayMessageBox) {

        birthdayMessageBox.style.display =
            "none";
    }


    /*
     * Set name
     */

    if (countdownName) {

        countdownName.textContent =
            `${event.name} ❤️`;
    }


    /*
     * Update countdown
     */

    function updateCountdown() {

        const now =
            new Date();


        const difference =
            birthdayDate.getTime() -
            now.getTime();


        /*
         * ==========================================
         * COUNTDOWN FINISHED
         * ==========================================
         */

        if (difference <= 0) {

            clearInterval(
                birthdayCountdownTimer
            );


            showBirthdayCelebration(
                event
            );


            return;
        }


        /*
         * ==========================================
         * CALCULATE TIME
         * ==========================================
         */

        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) /
                3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) /
                60
            );


        const seconds =
            totalSeconds % 60;


        /*
         * ==========================================
         * UPDATE UI
         * ==========================================
         */

        if (countDays) {

            countDays.textContent =
                padNumber(days);
        }


        if (countHours) {

            countHours.textContent =
                padNumber(hours);
        }


        if (countMinutes) {

            countMinutes.textContent =
                padNumber(minutes);
        }


        if (countSeconds) {

            countSeconds.textContent =
                padNumber(seconds);
        }

    }


    /*
     * Run immediately
     */

    updateCountdown();


    /*
     * Prevent duplicate timers
     */

    clearInterval(
        birthdayCountdownTimer
    );


    /*
     * Update every second
     */

    birthdayCountdownTimer =
        setInterval(
            updateCountdown,
            1000
        );
}


/* =========================================================
   SHOW BIRTHDAY CELEBRATION
========================================================= */

function showBirthdayCelebration(
    event
) {

    /*
     * Stop countdown
     */

    clearInterval(
        birthdayCountdownTimer
    );


    /*
     * Hide countdown
     */

    if (birthdayCountdownBox) {

        birthdayCountdownBox.style.display =
            "none";
    }


    /*
     * Show birthday message
     */

    if (birthdayMessageBox) {

        birthdayMessageBox.style.display =
            "block";
    }


    /*
     * Set birthday name
     */

    if (birthdayName) {

        birthdayName.textContent =
            event.name;
    }


    /*
     * Set birthday subtitle
     */

    if (birthdaySubtitle) {

        birthdaySubtitle.textContent =
            event.subtitle;
    }


    /*
     * Open overlay
     */

    openBirthdayOverlay();


    /*
     * Start celebration effects
     */

    createBirthdayBalloons();

    createBirthdayConfetti();

    createBirthdayHearts();

    createBirthdayPetals();

    createBirthdaySparkles();
}


/* =========================================================
   CREATE BALLOONS
========================================================= */

function createBirthdayBalloons() {

    const container =
        document.getElementById(
            "birthdayBalloons"
        );


    if (!container) {
        return;
    }


    /*
     * Clear old balloons
     */

    container.innerHTML = "";


    /*
     * Create balloons
     */

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const balloon =
            document.createElement(
                "div"
            );


        balloon.className =
            "birthday-balloon";


        /*
         * Random horizontal position
         */

        balloon.style.left =
            Math.random() * 100 +
            "%";


        /*
         * Random delay
         */

        balloon.style.animationDelay =
            Math.random() * 5 +
            "s";


        /*
         * Random speed
         */

        balloon.style.animationDuration =
            7 +
            Math.random() * 6 +
            "s";


        container.appendChild(
            balloon
        );
    }
}


/* =========================================================
   CREATE CONFETTI
========================================================= */

function createBirthdayConfetti() {

    const container =
        document.getElementById(
            "birthdayConfetti"
        );


    if (!container) {
        return;
    }


    /*
     * Clear old confetti
     */

    container.innerHTML = "";


    /*
     * Create confetti pieces
     */

    for (
        let i = 0;
        i < 120;
        i++
    ) {

        const piece =
            document.createElement(
                "span"
            );


        piece.className =
            "birthday-confetti-piece";


        /*
         * Random horizontal position
         */

        piece.style.left =
            Math.random() * 100 +
            "%";


        /*
         * Random delay
         */

        piece.style.animationDelay =
            Math.random() * 4 +
            "s";


        /*
         * Random fall speed
         */

        piece.style.animationDuration =
            3 +
            Math.random() * 4 +
            "s";


        container.appendChild(
            piece
        );
    }
}


/* =========================================================
   CREATE FLOATING HEARTS
========================================================= */

function createBirthdayHearts() {

    const container =
        document.getElementById(
            "birthdayHearts"
        );


    if (!container) {
        return;
    }


    /*
     * Clear old hearts
     */

    container.innerHTML = "";


    /*
     * Create hearts
     */

    for (
        let i = 0;
        i < 30;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.textContent =
            "♥";


        /*
         * Random horizontal position
         */

        heart.style.left =
            Math.random() * 100 +
            "%";


        /*
         * Random delay
         */

        heart.style.animationDelay =
            Math.random() * 5 +
            "s";


        /*
         * Random speed
         */

        heart.style.animationDuration =
            5 +
            Math.random() * 6 +
            "s";


        container.appendChild(
            heart
        );
    }
}


/* =========================================================
   CREATE ROSE PETALS
========================================================= */

function createBirthdayPetals() {

    const container =
        document.getElementById(
            "birthdayPetals"
        );


    if (!container) {
        return;
    }


    /*
     * Clear old petals
     */

    container.innerHTML = "";


    /*
     * Create petals
     */

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const petal =
            document.createElement(
                "span"
            );


        petal.textContent =
            "🌹";


        /*
         * Random horizontal position
         */

        petal.style.left =
            Math.random() * 100 +
            "%";


        /*
         * Random delay
         */

        petal.style.animationDelay =
            Math.random() * 6 +
            "s";


        /*
         * Random speed
         */

        petal.style.animationDuration =
            6 +
            Math.random() * 7 +
            "s";


        container.appendChild(
            petal
        );
    }
}


/* =========================================================
   CREATE SPARKLES
========================================================= */

function createBirthdaySparkles() {

    const container =
        document.getElementById(
            "birthdaySparkles"
        );


    if (!container) {
        return;
    }


    /*
     * Clear old sparkles
     */

    container.innerHTML = "";


    /*
     * Create sparkles
     */

    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.textContent =
            "✦";


        /*
         * Random position
         */

        sparkle.style.left =
            Math.random() * 100 +
            "%";


        sparkle.style.top =
            Math.random() * 100 +
            "%";


        /*
         * Random delay
         */

        sparkle.style.animationDelay =
            Math.random() * 4 +
            "s";


        container.appendChild(
            sparkle
        );
    }
}


/* =========================================================
   CLOSE BUTTONS
========================================================= */

if (birthdayClose) {

    birthdayClose.addEventListener(
        "click",
        closeBirthdayOverlay
    );
}


if (countdownClose) {

    countdownClose.addEventListener(
        "click",
        closeBirthdayOverlay
    );
}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            birthdayOverlay &&
            birthdayOverlay.classList.contains(
                "active"
            )
        ) {

            closeBirthdayOverlay();
        }

    }
);


/* =========================================================
   PAGE VISIBILITY
========================================================= */

/*
 * If the user leaves the browser tab for a while
 * and comes back, immediately recalculate the countdown.
 */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            const currentEvent =
                getCurrentBirthdayEvent();


            if (!currentEvent) {

                clearInterval(
                    birthdayCountdownTimer
                );

                closeBirthdayOverlay();

                return;
            }


            if (
                currentEvent.type ===
                "birthday"
            ) {

                showBirthdayCelebration(
                    currentEvent.event
                );

                return;
            }


            if (
                currentEvent.type ===
                "countdown"
            ) {

                startBirthdayCountdown(
                    currentEvent.event,
                    currentEvent.targetDate
                );

                openBirthdayOverlay();
            }

        }

    }
);


/* =========================================================
   INITIALIZE BIRTHDAY SYSTEM
========================================================= */

function initializeBirthdaySystem() {

    /*
     * Find today's birthday event
     */

    const currentEvent =
        getCurrentBirthdayEvent();


    /*
     * ==========================================
     * NORMAL DAYS
     * ==========================================
     */

    if (!currentEvent) {

        clearInterval(
            birthdayCountdownTimer
        );


        closeBirthdayOverlay();


        return;
    }


    /*
     * ==========================================
     * BIRTHDAY DAY
     * ==========================================
     */

    if (
        currentEvent.type ===
        "birthday"
    ) {

        showBirthdayCelebration(
            currentEvent.event
        );


        return;
    }


    /*
     * ==========================================
     * COUNTDOWN DAYS
     * ==========================================
     */

    if (
        currentEvent.type ===
        "countdown"
    ) {

        startBirthdayCountdown(
            currentEvent.event,
            currentEvent.targetDate
        );


        openBirthdayOverlay();


        return;
    }
}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeBirthdaySystem
    );

} else {

    initializeBirthdaySystem();

}