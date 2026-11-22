let users = JSON.parse(localStorage.getItem("users")) || [];
let donors = JSON.parse(localStorage.getItem("donors")) || [];
let hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];

let currentUser = null;

function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("donors", JSON.stringify(donors));
    localStorage.setItem("hospitals", JSON.stringify(hospitals));
}

// REGISTER
function register() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("User already registered");
        return;
    }

    users.push({ name, email, password, role });
    saveData();

    alert("Registration successful!");
}

// LOGIN
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    let user = users.find(u =>
        u.email === email &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
        alert("Invalid login details");
        return;
    }

    currentUser = user;

    document.getElementById("auth").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    document.getElementById("welcome").innerText =
        "Welcome, " + user.name;

    showPanel();
}

// SHOW DASHBOARD
function showPanel() {
    document.getElementById("donorPanel").classList.add("hidden");
    document.getElementById("hospitalPanel").classList.add("hidden");

    if (currentUser.role === "donor") {
        document.getElementById("donorPanel").classList.remove("hidden");
        displayMyDonor();
    }

    if (currentUser.role === "hospital") {
        document.getElementById("hospitalPanel").classList.remove("hidden");
        displayMyBank();
        displayBanks();
    }
}

// POST DONOR
function postDonor() {
    let name = document.getElementById("donorName").value;
    let age = document.getElementById("donorAge").value;
    let group = document.getElementById("bloodGroup").value;
    let phone = document.getElementById("donorPhone").value;
    let location = document.getElementById("donorLocation").value;

    if (!name || !age || !group || !phone || !location) {
        alert("Please fill all donor details");
        return;
    }

    let donor = {
        email: currentUser.email,
        name,
        age,
        group,
        phone,
        location
    };

    donors.push(donor);
    saveData();

    alert("Donor information posted successfully!");
    displayMyDonor();
}

// MY DONOR INFORMATION
function displayMyDonor() {
    let myDonors = donors.filter(d => d.email === currentUser.email);

    document.getElementById("myDonor").innerHTML = myDonors.map(d => `
        <div class="item">
            Name: ${d.name}<br>
            Age: ${d.age}<br>
            Blood Group: ${d.group}<br>
            Phone: ${d.phone}<br>
            Location: ${d.location}
        </div>
    `).join("");
}

// SEARCH DONORS
function searchDonors() {
    let group = document.getElementById("searchGroup").value;
    let location = document.getElementById("searchLocation").value.toLowerCase();

    let result = donors.filter(d =>
        (!group || d.group === group) &&
        (!location || d.location.toLowerCase().includes(location))
    );

    document.getElementById("donorResults").innerHTML = result.map(d => `
        <div class="item">
            Name: ${d.name}<br>
            Blood Group: ${d.group}<br>
            Phone: ${d.phone}<br>
            Location: ${d.location}
        </div>
    `).join("") || "No donors found";
}

// POST HOSPITAL
function postHospital() {
    let name = document.getElementById("hospitalName").value;
    let location = document.getElementById("hospitalLocation").value;
    let phone = document.getElementById("hospitalPhone").value;

    if (!name || !location || !phone) {
        alert("Please fill all details");
        return;
    }

    let hospital = {
        email: currentUser.email,
        name,
        location,
        phone,
        blood: {}
    };

    hospitals.push(hospital);
    saveData();

    alert("Blood bank information posted successfully!");
    displayMyBank();
    displayBanks();
}

// UPDATE BLOOD STATUS
function updateBlood() {
    let group = document.getElementById("updateGroup").value;
    let units = document.getElementById("units").value;

    if (units === "") {
        alert("Enter available units");
        return;
    }

    let bank = hospitals.find(h => h.email === currentUser.email);

    if (!bank) {
        alert("Please post blood bank information first");
        return;
    }

    bank.blood[group] = units;

    saveData();
    alert("Blood availability updated!");
    displayMyBank();
    displayBanks();
}

// MY BLOOD BANK
function displayMyBank() {
    let bank = hospitals.find(h => h.email === currentUser.email);

    document.getElementById("myBank").innerHTML = bank ? `
        <div class="item">
            <b>${bank.name}</b><br>
            Location: ${bank.location}<br>
            Phone: ${bank.phone}<br>
            Blood Availability: ${JSON.stringify(bank.blood)}
        </div>
    ` : "No blood bank information posted yet.";
}

// DISPLAY ALL BANKS
function displayBanks() {
    document.getElementById("allBanks").innerHTML = hospitals.map(h => `
        <div class="item">
            <b>${h.name}</b><br>
            Location: ${h.location}<br>
            Phone: ${h.phone}<br>
            Blood Availability: ${JSON.stringify(h.blood)}
        </div>
    `).join("");
}

// SEARCH BLOOD BANKS
function searchBanks() {
    let search = document.getElementById("bankSearch").value.toLowerCase();

    let result = hospitals.filter(h =>
        h.name.toLowerCase().includes(search) ||
        h.location.toLowerCase().includes(search)
    );

    document.getElementById("bankResults").innerHTML = result.map(h => `
        <div class="item">
            <b>${h.name}</b><br>
            Location: ${h.location}<br>
            Phone: ${h.phone}<br>
            Blood Availability: ${JSON.stringify(h.blood)}
        </div>
    `).join("") || "No blood banks found";
}

// LOGOUT
function logout() {
    currentUser = null;

    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("auth").classList.remove("hidden");

    document.getElementById("donorPanel").classList.add("hidden");
    document.getElementById("hospitalPanel").classList.add("hidden");
}