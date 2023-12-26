// Alert CSS Style
const style = document.createElement("style")

style.innerHTML = `
.success-alert, .error-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 20px;
    color: white;
    text-align: center;
    border-radius: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    transition: opacity 0.5s ease;
    opacity: 0;
}

.success-alert {
    background-color: #4CAF50;
}

.error-alert {
    background-color: #FF0000;
}

@keyframes fadeIn {
    0% {opacity: 0;}
    100% {opacity: 1;}
}

@keyframes fadeOut {
    0% {opacity: 1;}
    100% {opacity: 0;}
}
`
document.head.appendChild(style)

// Show Alert Message
export function showAlert(message, type) {
    // Create a new div element
    var alertDiv = document.createElement("div")

    // Add classes to the div
    alertDiv.classList.add(type + "-alert")

    // Add the message to the div
    alertDiv.textContent = message

    // Add a close button
    let closeButton = document.createElement("span")
    closeButton.innerHTML = "×"
    closeButton.style.float = "right"
    closeButton.style.cursor = "pointer"
    closeButton.style.marginLeft = "15px"
    closeButton.style.fontSize = "22px"
    closeButton.style.lineHeight = "20px"
    closeButton.style.color = "white"
    closeButton.onclick = function () {
        alertDiv.style.animation = "fadeOut 0.5s forwards"
    }
    alertDiv.appendChild(closeButton)

    // Append the div to the body
    document.body.appendChild(alertDiv)

    // Fade in the alert
    setTimeout(function () {
        alertDiv.style.animation = "fadeIn 0.5s forwards"
    }, 0)

    // Fade out and remove the alert after 3 seconds
    setTimeout(function () {
        alertDiv.style.animation = "fadeOut 0.5s forwards"
        setTimeout(function () {
            document.body.removeChild(alertDiv)
        }, 300)
    }, 2000)
}

export function showSuccessAlert(message) {
    showAlert(message, "success")
}

export function showErrorAlert(message) {
    showAlert(message, "error")
}
