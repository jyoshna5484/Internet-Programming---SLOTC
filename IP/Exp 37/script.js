// Contact Form
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Thank you! Your message has been sent successfully.");
    this.reset();
});

// Resume Download
function downloadResume() {
    alert("Resume download option selected!");
}

// Welcome Message
window.onload = function() {
    console.log("Welcome to MyProfessionalShowcase!");
};