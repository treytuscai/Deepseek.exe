document.addEventListener('DOMContentLoaded', function () {
    // Make an AJAX call to get the hiding spot index
    fetch('/get_hiding_spot')
        .then(response => response.json())
        .then(data => {
            if (data.hiding_spot_index !== undefined) {
                const secretCode = generateRandomCode(12);
                hideCode(data.hiding_spot_index);
            } else {
                console.error('Error fetching hiding spot');
            }
        })
        .catch(err => console.error('AJAX error:', err));
});

function hideCode(random_spot) {
    // List of easier hiding spots
    const hidingSpots = [
        { type: 'header', action: hideInHeader },
        { type: 'metaTag', action: hideInMetaTag },
        { type: 'cookie', action: hideInCookie },
        { type: 'jsVariable', action: hideInJSVariable },
        { type: 'urlFragment', action: hideInUrlFragment },
        { type: 'htmlElement', action: hideInHTMLEl },
        { type: 'ajaxCall', action: hideInAjaxCall }
    ];

    const secretCode = generateRandomCode(12);
    const spot = hidingSpots.find(spot => spot.type === random_spot);
    if (spot) {
        // Call the action for the selected hiding spot
        spot.action(secretCode);
    } else {
        console.error("Hiding spot not found:", random_spot);
    }
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

// Hide in JS variable (e.g., setting it inside a hidden variable in JS)
function hideInJSVariable(secretCode) {
    window._hiddenCode = secretCode;
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

// Hide in AJAX call (e.g., secret embedded inside a normal AJAX request)
function hideInAjaxCall(secretCode) {
    fetch('/ajax-endpoint', {
        method: 'POST',
        body: JSON.stringify({ code: secretCode }),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
        .then(data => console.log('AJAX success', data));
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