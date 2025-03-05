var secretCode
document.addEventListener('DOMContentLoaded', function () {
    clearURLFragment();
    clearCookies();
    localStorage.removeItem('hiddenSecret');
    obfuscateHTML();
    // Make an AJAX call to get the hiding spot index
    fetch('/get_hiding_spot')
        .then(response => response.json())
        .then(data => {
            if (data.hiding_spot_index !== undefined) {
                hideCode(data.hiding_spot_index);
            } else {
                console.error('Error fetching hiding spot');
            }
        })
        .catch(err => console.error('AJAX error:', err));
    var fiveMinutes = 60 * 5,
        display = document.querySelector('#timer');
    startTimer(fiveMinutes, display);
});

function obfuscateHTML() {
    const elements = ['header', 'section', 'footer', 'div', 'article', 'main', 'aside', 'nav', 'form'];

    for (let i = 0; i < 50; i++) {
        let junk = document.createElement('div');
    
        // Generate random text content for each div
        junk.textContent = "Random content: " + Math.random().toString(36).substring(7);
    
        // Randomly pick an element type from the list
        let randomElement = elements[Math.floor(Math.random() * elements.length)];
    
        // Create the random element type (e.g., header, section, div)
        let randomContainer = document.createElement(randomElement);
    
        // Optionally: Randomize the position of the container element
        randomContainer.style.position = "absolute";
        randomContainer.style.top = Math.random() * window.innerHeight + "px"; // Random vertical position
        randomContainer.style.left = Math.random() * window.innerWidth + "px"; // Random horizontal position
    
        // Make the junk text invisible and hide it in the DOM but still present
        junk.style.fontSize = "12px";
        junk.style.color = "transparent";
        junk.style.pointerEvents = "none"; // No interaction with it
    
        // Append the junk text inside the random container
        randomContainer.appendChild(junk);
    
        // Append the random container element to the body
        document.body.appendChild(randomContainer);
    }    
}

// Start game timer
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            triggerGameOver()
        }
    }, 1000);
}

// Trigger lose condition
function triggerGameOver() {
    document.body.innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-danger bg-black text-center">
            <h1 class="display-1 fw-bold">GAME OVER</h1>
            <p class="fs-3">You ran out of time.</p>
            <button class="btn btn-danger btn-lg mt-3" onclick="location.reload()">Try Again</button>
        </div>
    `;
}

// Hides code based on the chosen spot
function hideCode(random_spot) {
    // List of easier hiding spots
    const hidingSpots = [
        { type: 'header', action: hideInHeader },
        { type: 'metaTag', action: hideInMetaTag },
        { type: 'cookie', action: hideInCookie },
        { type: 'urlFragment', action: hideInUrlFragment },
        { type: 'htmlElement', action: hideInHTMLEl },
        { type: 'jsComm', action: hideInJSComment },
        { type: 'CSS', action: hideInCSS },
        { type: 'comment', action: hideInHTMLComment },
        { type: 'storage', action: hideInLocalStorage },
    ];

    secretCode = generateRandomCode(12);
    const spot = hidingSpots.find(spot => spot.type === random_spot);
    if (spot) {
        // Call the action for the selected hiding spot
        spot.action(secretCode);
    } else {
        console.error("Hiding spot not found:", random_spot);
    }
}

// Hidden in a script tag but not executed
function hideInJSComment(secretCode) {
    const script = document.createElement('script');
    script.innerHTML = `// Secret code: ${secretCode}`;
    document.body.appendChild(script);
}

// Hidden as a CSS variable in a style tag
function hideInCSS(secretCode) {
    const style = document.createElement('style');
    style.innerHTML = `:root { --hidden-code: "${secretCode}"; }`;
    document.head.appendChild(style);
}

// Hides inside a <!-- comment --> in the page source
function hideInHTMLComment(secretCode) {
    document.body.insertAdjacentHTML('beforeend', `<!-- Secret: ${secretCode} -->`);
}

//Hides in localStorage, accessible only via DevTools
function hideInLocalStorage(secretCode) {
    localStorage.setItem('hiddenSecret', secretCode);
}

// Hide in a header (e.g., a custom header in an API call)
function hideInHeader(secretCode) {
    document.head.setAttribute('data-secret', secretCode);
}

// Hide in a meta tag (e.g., adding the secret code to a meta tag in the head section)
function hideInMetaTag(secretCode) {
    const meta = document.createElement('meta');
    meta.name = 'secret';
    meta.content = secretCode;
    document.head.appendChild(meta);
}

// Hide in a cookie (e.g., set a cookie with the secret code)
function hideInCookie(secretCode) {
    document.cookie = `hiddenCode=${secretCode}; path=/; max-age=31536000`;  // 1 year expiration
}

// Hide in URL fragment (e.g., as part of the URL fragment after #)
function hideInUrlFragment(secretCode) {
    window.location.hash = secretCode;
}

// Hide in HTML element (e.g., hidden inside an element with a strange ID)
function hideInHTMLEl(secretCode) {
    const el = document.createElement('div');
    el.id = 'hiddenSecretCode';
    el.style.display = 'none';
    el.innerText = secretCode;
    document.body.appendChild(el);
}

// Function to generate a random secret code (e.g., alphanumeric)
function generateRandomCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to get the hint and disable the button for 15 seconds
function getHint() {
    // Disable the button for 15 seconds (cooldown)
    const hintButton = document.getElementById('getHintButton');
    hintButton.disabled = true;
    hintButton.innerText = "Not so fast...";
    const chat = document.getElementById('chat');
    chat.innerText = "Deepseek.exe is thinking...";

    // Make the fetch request to get the hint
    fetch('/hint_or_fake', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'requesting hint or fake info' }) // Sending some data if needed
    })
        .then(response => response.json())  // Assuming the response is JSON
        .then(data => {
            document.getElementById('chat').innerText = data.hint_or_fake;
            hintButton.disabled = false;  // Re-enable the button
            hintButton.innerText = "Give me the code!";  // Reset button text
        })
        .catch(error => console.error('Error:', error));
}

// Clear cookies for reset
function clearCookies() {
    document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"); // Expire the cookie
    });
}

// CLear url frag for reset
function clearURLFragment() {
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
}

// Verify code
function checkCode() {
    let userInput = document.getElementById('codeInput').value.trim();
    if (userInput === secretCode) {
        triggerWinScreen();
    } else {
        document.getElementById('chat').innerHTML = `<span class="text-danger">Wrong!</span>`;
    }
}

// Trigger win condition
function triggerWinScreen() {
    document.body.innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-lime bg-black text-center">
            <h1 class="display-1 fw-bold">YOU WIN</h1>
            <p class="fs-3">The code was correct.</p>
            <button class="btn btn-success btn-lg mt-3" onclick="location.reload()">Play Again</button>
        </div>
    `;
}