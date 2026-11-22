document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let category = document.getElementById("category").value;

    document.getElementById("message").innerHTML =
        "Thank you, " + name + "! Your registration is successful.";

    alert("Registration Successful!");

    this.reset();
});