// Admin Registration
document.getElementById("adminRegister").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Admin registered successfully!");
    this.reset();
});

// Admin Login
document.getElementById("adminLogin").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Admin login successful!");
    this.reset();
});

// User Registration
document.getElementById("userRegister").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("User registration successful!");
    this.reset();
});

// User Login
document.getElementById("userLogin").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("User login successful!");
    this.reset();
});

// eWallet
let wallet = 0;

function addMoney() {
    let amount = Number(document.getElementById("walletAmount").value);

    if (amount <= 0) {
        alert("Enter a valid amount!");
        return;
    }

    wallet += amount;

    document.getElementById("walletBalance").innerText = wallet;

    alert("Money added successfully!");
    document.getElementById("walletAmount").value = "";
}

// Bus Pass Application
document.getElementById("passForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("passName").value;
    let type = document.getElementById("passType").value;
    let school = document.getElementById("schoolType").value;
    let duration = document.getElementById("passDuration").value;
    let amount = document.getElementById("passAmount").value;
    let route = document.getElementById("passRoute").value;

    if (school === "government") {
        amount = 0;
    }

    let passID = "PASS" + Math.floor(Math.random() * 10000);

    document.getElementById("passResult").innerHTML = `
        <div class="card">
            <h3>Bus Pass Application</h3>
            <p>Pass ID: ${passID}</p>
            <p>Name: ${name}</p>
            <p>Pass Type: ${type}</p>
            <p>Route: ${route}</p>
            <p>Validity: ${duration} Month(s)</p>
            <p>Amount: ₹${amount}</p>
            <p>Status: Pending Admin Approval</p>
            <button onclick="generateQR('${passID}')">Generate QR Code</button>
        </div>
    `;

    alert("Bus pass application submitted!");
    this.reset();
});

// QR Code Simulation
function generateQR(id) {
    document.getElementById("passResult").innerHTML +=
        "<p><b>QR Code Generated for Pass ID: " + id + "</b></p>";
    alert("QR Code generated successfully!");
}

// Pass Renewal
document.getElementById("renewForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let id = document.getElementById("renewPassID").value;
    let duration = document.getElementById("renewDuration").value;

    alert("Pass " + id + " renewed for " + duration + " month(s)!");
    document.getElementById("renewResult").innerHTML =
        "<div class='card'><h3>Renewal Successful</h3><p>Pass ID: " +
        id + "</p><p>Renewal Period: " + duration + " month(s)</p></div>";

    this.reset();
});

// eTicket Purchase
document.getElementById("ticketForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("ticketName").value;
    let from = document.getElementById("ticketFrom").value;
    let to = document.getElementById("ticketTo").value;
    let bus = document.getElementById("ticketBus").value;
    let price = Number(document.getElementById("ticketPrice").value);

    if (price > wallet) {
        alert("Insufficient wallet balance! Please add money.");
        return;
    }

    wallet -= price;
    document.getElementById("walletBalance").innerText = wallet;

    let ticketID = "TICKET" + Math.floor(Math.random() * 10000);

    document.getElementById("ticketResult").innerHTML = `
        <div class="card">
            <h3>eTicket Confirmation</h3>
            <p>Ticket ID: ${ticketID}</p>
            <p>Passenger: ${name}</p>
            <p>From: ${from}</p>
            <p>To: ${to}</p>
            <p>Bus: ${bus}</p>
            <p>Amount: ₹${price}</p>
            <p>Status: Confirmed</p>
            <button onclick="generateQR('${ticketID}')">Generate QR</button>
        </div>
    `;

    alert("Ticket purchased successfully!");
    this.reset();
});

// Route Information
document.getElementById("routeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let from = document.getElementById("routeFrom").value;
    let to = document.getElementById("routeTo").value;
    let stops = document.getElementById("routeStops").value;
    let time = document.getElementById("routeTime").value;

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${from}</td>
        <td>${to}</td>
        <td>${stops}</td>
        <td>${time}</td>
    `;

    document.getElementById("routeTable").appendChild(row);

    alert("Route added successfully!");
    this.reset();
});

// Conductor Login
document.getElementById("conductorLogin").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Conductor login successful!");
    this.reset();
});

// Pass and Ticket Verification
document.getElementById("verifyForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let id = document.getElementById("verifyID").value;

    document.getElementById("verifyResult").innerHTML = `
        <div class="card">
            <h3>Verification Result</h3>
            <p>ID: ${id}</p>
            <p>Status: Valid</p>
        </div>
    `;

    alert("Pass/Ticket verified successfully!");
    this.reset();
});

// Bus Location Update
document.getElementById("locationForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let bus = document.getElementById("locationBus").value;
    let location = document.getElementById("locationValue").value;

    document.getElementById("locationResult").innerHTML = `
        <div class="card">
            <h3>Bus Location Updated</h3>
            <p>Bus Number: ${bus}</p>
            <p>Current Location: ${location}</p>
        </div>
    `;

    alert("Bus location updated!");
    this.reset();
});

// Expected Arrival Time
document.getElementById("trackingForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let bus = document.getElementById("trackingBus").value;
    let location = document.getElementById("trackingLocation").value;
    let minutes = Number(document.getElementById("travelMinutes").value);

    let arrival = new Date();
    arrival.setMinutes(arrival.getMinutes() + minutes);

    document.getElementById("trackingResult").innerHTML = `
        <div class="card">
            <h3>Estimated Arrival</h3>
            <p>Bus: ${bus}</p>
            <p>Current Location: ${location}</p>
            <p>Expected in: ${minutes} minutes</p>
            <p>Arrival Time: ${arrival.toLocaleTimeString()}</p>
        </div>
    `;

    this.reset();
});