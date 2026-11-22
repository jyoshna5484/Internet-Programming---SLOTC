// Menu Category Filter
function showMenu(category) {
    let items = document.querySelectorAll(".menu-items .card");

    items.forEach(function(item) {
        if (category === "all" || item.classList.contains(category)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

// Reservation Form
document.getElementById("reservationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Your table reservation has been submitted successfully!");
    this.reset();
});

// Contact Form
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Thank you for contacting Gourmet Haven!");
    this.reset();
});

// Set minimum reservation date to today
document.getElementById("date").min = new Date().toISOString().split("T")[0];