// Countdown Timer
let timeLeft = 300;
let timerInterval = setInterval(() => {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").innerText = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("You have failed! Deepseek wins.");
        window.close(); // Close the tab
    }
}, 1000);

// Deepseek AI taunts and riddles
const riddles = [
    "Look beyond what you see... maybe in the console?",
    "A whisper in the code... try checking the network calls.",
    "Hidden in plain sight, but not where you type... perhaps in the styles?"
];
let secretCode = Math.random().toString(36).substring(2, 8); // Generate a random code
let hidingSpot = Math.floor(Math.random() * 3); // Randomly choose a hiding method

switch (hidingSpot) {
    case 0:
        // Classic console log bait (easy)
        console.log(`(Psst... the secret code is: ${secretCode})`);
        break;

    case 1:
        // Fake API request (medium)
        fetch(`/deepseek-api?data=${btoa(secretCode)}`);
        break;

    case 2:
        // CSS pseudo-element trick (hard)
        document.head.insertAdjacentHTML("beforeend", `<style>body::after { content: "${secretCode}"; visibility: hidden; }</style>`);
        break;

    case 3:
        // Base64 encode it and put it inside a hidden script tag (hard)
        document.body.insertAdjacentHTML("beforeend", `<script type="text/plain" id="deepseek-hint">${btoa(secretCode)}</script>`);
        break;

    case 4:
        // Comment inside an invisible element (hard)
        document.body.insertAdjacentHTML("beforeend", `<div style="display:none"><!-- Secret: ${secretCode} --></div>`);
        break;

    case 5:
        // Hide it inside a dynamically generated image's alt text (hard)
        document.body.insertAdjacentHTML("beforeend", `<img src="deepseek.png" alt="${secretCode}" style="display:none">`);
        break;

    case 6:
        // Encode it in Morse code in an attribute (very hard)
        const morseCode = secretCode.split('').map(c => c.charCodeAt(0).toString(2)).join(' ');
        document.body.insertAdjacentHTML("beforeend", `<div data-morse="${morseCode}" style="display:none"></div>`);
        break;

    case 7:
        // Encode it in an RGB color value inside an element’s background color (evil)
        document.body.insertAdjacentHTML("beforeend", `<div style="display:none; background-color: rgb(${secretCode.charCodeAt(0)}, ${secretCode.charCodeAt(1)}, ${secretCode.charCodeAt(2)})"></div>`);
        break;

    case 8:
        // Store it in an HTTP cookie (very sneaky)
        document.cookie = `deepseek_code=${secretCode}; path=/;`;
        break;

    case 9:
        // Insert the code into an unused meta tag (dev tools required)
        document.head.insertAdjacentHTML("beforeend", `<meta name="deepseek-hint" content="${secretCode}">`);
        break;
}

function deepseekTalks(text) {
    document.getElementById("chat").innerText = text;
    console.log(`Deepseek: ${text}`);
}

deepseekTalks(riddles[hidingSpot]);

// Hide the code dynamically
switch (hidingSpot) {
    case 0:
        console.log(`(Psst... the secret code is: ${secretCode})`);
        break;
    case 1:
        fetch(`/fake-api?code=${secretCode}`);
        break;
    case 2:
        document.head.insertAdjacentHTML("beforeend", `<style>::after { content: "${secretCode}"; }</style>`);
        break;
}

// Check if user guessed correctly
function checkCode() {
    let input = document.getElementById("codeInput").value.trim();
    if (input === secretCode) {
        clearInterval(timerInterval);
        alert("You win! Deepseek AI lets you go... this time.");
        window.location.reload(); // Restart the game
    } else {
        deepseekTalks("Wrong! Try again, mortal.");
    }
}