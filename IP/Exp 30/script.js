// Display popup
function showInfo(title, message) {
    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popupBody").innerText = message;
    document.getElementById("popup").style.display = "flex";
}

// Close popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Registration Form
function showForm(type) {
    let title = type.charAt(0).toUpperCase() + type.slice(1) + " Registration";

    let formHTML = `
        <form id="registerForm">
            <input type="text" id="regName" placeholder="Full Name" required>
            <input type="email" id="regEmail" placeholder="Email Address" required>
            <input type="password" id="regPassword" placeholder="Password" required>
            <input type="text" id="regInstitution" placeholder="Institution / Organization">
            <button type="submit">Register</button>
        </form>
    `;

    if (type === "manuscript") {
        title = "Manuscript Submission";

        formHTML = `
            <form id="registerForm">
                <input type="text" id="regName" placeholder="Author Name" required>
                <input type="email" id="regEmail" placeholder="Email Address" required>
                <input type="text" id="paperTitle" placeholder="Paper Title" required>
                <select id="paperCategory" required>
                    <option value="">Select Research Category</option>
                    <option>Science</option>
                    <option>Engineering</option>
                    <option>Social Science</option>
                    <option>Management</option>
                </select>
                <button type="submit">Submit Manuscript</button>
            </form>
        `;
    }

    if (type === "feedback") {
        title = "Feedback Form";

        formHTML = `
            <form id="registerForm">
                <input type="text" id="regName" placeholder="Your Name" required>
                <input type="email" id="regEmail" placeholder="Email Address" required>
                <textarea id="feedbackText" placeholder="Write your feedback" required></textarea>
                <button type="submit">Submit Feedback</button>
            </form>
        `;
    }

    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popupBody").innerHTML = formHTML;

    document.getElementById("popup").style.display = "flex";

    document.getElementById("registerForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let name = document.getElementById("regName").value;

        alert(title + " completed successfully!");

        closePopup();
    });
}

// Login Form
function showLogin(type) {
    let title = type.charAt(0).toUpperCase() + type.slice(1) + " Login";

    let formHTML = `
        <form id="loginForm">
            <input type="email" placeholder="Email Address" required>
            <input type="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    `;

    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popupBody").innerHTML = formHTML;
    document.getElementById("popup").style.display = "flex";

    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Login successful!");
        closePopup();
    });
}

// Newsletter
document.getElementById("newsletterForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("newsletterEmail").value;

    alert("Thank you for subscribing!");

    this.reset();
});

// Contact Form
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Your message has been submitted successfully!");

    this.reset();
});

// Close popup by clicking outside
window.onclick = function(event) {
    if (event.target == document.getElementById("popup")) {
        closePopup();
    }
};