// CONTACT FORM
function sendMessage(event) {
    event.preventDefault();

    let name = document.getElementById("contactName").value;
    let email = document.getElementById("contactEmail").value;
    let message = document.getElementById("contactMessage").value;

    if (!name || !email || !message) {
        alert("Please fill all contact details");
        return;
    }

    alert("Thank you " + name + "! Your message has been submitted.");

    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactMessage").value = "";
}

// NEWSLETTER SUBSCRIPTION
function subscribe(event) {
    event.preventDefault();

    let email = document.getElementById("newsletterEmail").value;

    if (!email) {
        alert("Please enter your email");
        return;
    }

    let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];

    if (subscribers.includes(email)) {
        alert("You are already subscribed!");
        return;
    }

    subscribers.push(email);

    localStorage.setItem("subscribers", JSON.stringify(subscribers));

    alert("Successfully subscribed to ArtistryHub!");

    document.getElementById("newsletterEmail").value = "";
}