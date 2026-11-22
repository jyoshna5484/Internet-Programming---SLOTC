let users = JSON.parse(localStorage.getItem("users")) || [];
let cases = JSON.parse(localStorage.getItem("cases")) || [];
let updates = JSON.parse(localStorage.getItem("updates")) || [];

let currentUser = null;

// SAVE DATA
function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("cases", JSON.stringify(cases));
    localStorage.setItem("updates", JSON.stringify(updates));
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

    if (role !== "user") {
        alert("Police and Admin accounts are created by Admin.");
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

    // DEMO ADMIN
    if (role === "admin" &&
        email === "admin@gmail.com" &&
        password === "admin123") {

        currentUser = {
            name: "Admin",
            email: email,
            role: "admin"
        };

        openDashboard();
        return;
    }

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
    openDashboard();
}

// OPEN DASHBOARD
function openDashboard() {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    document.getElementById("welcome").innerText =
        "Welcome, " + currentUser.name;

    showPanel();
}

// SHOW PANELS
function showPanel() {
    document.getElementById("userPanel").classList.add("hidden");
    document.getElementById("policePanel").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");

    if (currentUser.role === "user") {
        document.getElementById("userPanel").classList.remove("hidden");
        displayMyChallans();
        displayMyCases();
    }

    if (currentUser.role === "police") {
        document.getElementById("policePanel").classList.remove("hidden");
        displayRules();
        displayUpdates();
    }

    if (currentUser.role === "admin") {
        document.getElementById("adminPanel").classList.remove("hidden");
        displayPolice();
        displayDailyReport();
    }
}

// TRAFFIC RULES
function displayRules() {
    document.getElementById("rules").innerHTML = `
        <div class="item">🚫 No Helmet - Wear a helmet while riding.</div>
        <div class="item">🚗 No Seat Belt - Always wear seat belts.</div>
        <div class="item">🚦 Signal Violation - Follow traffic signals.</div>
        <div class="item">⚡ Overspeeding - Follow speed limits.</div>
        <div class="item">🅿️ Wrong Parking - Park only in permitted areas.</div>
        <div class="item">📄 Driving Without License - Carry a valid license.</div>
    `;
}

// CREATE CASE
function createCase() {
    let owner = document.getElementById("ownerName").value;
    let vehicle = document.getElementById("vehicleNumber").value;
    let violation = document.getElementById("violation").value;
    let fine = document.getElementById("fine").value;
    let location = document.getElementById("location").value;
    let file = document.getElementById("proof").files[0];

    if (!owner || !vehicle || !violation || !fine || !location) {
        alert("Please fill all case details");
        return;
    }

    if (!file) {
        alert("Please upload proof photo");
        return;
    }

    let reader = new FileReader();

    reader.onload = function() {
        let newCase = {
            id: Date.now(),
            owner,
            vehicle,
            violation,
            fine,
            location,
            proof: reader.result,
            police: currentUser.name,
            date: new Date().toLocaleDateString()
        };

        cases.push(newCase);
        saveData();

        alert("Traffic case created successfully!");

        displayDailyReport();
    };

    reader.readAsDataURL(file);
}

// USER VIEW CHALLANS
function displayMyChallans() {
    let myCases = cases.filter(c =>
        c.owner.toLowerCase() === currentUser.name.toLowerCase()
    );

    document.getElementById("myChallans").innerHTML =
        myCases.map(c => `
            <div class="item">
                <b>Challan ID:</b> ${c.id}<br>
                Vehicle: ${c.vehicle}<br>
                Violation: ${c.violation}<br>
                Fine: ₹${c.fine}<br>
                Location: ${c.location}<br>
                Date: ${c.date}<br>
                Police Officer: ${c.police}<br>
                <img src="${c.proof}" alt="Proof Photo"><br>
                <b>Challan Receipt</b>
            </div>
        `).join("") || "No challans available";
}

// USER VIEW CASES
function displayMyCases() {
    let myCases = cases.filter(c =>
        c.owner.toLowerCase() === currentUser.name.toLowerCase()
    );

    document.getElementById("myCases").innerHTML =
        myCases.map(c => `
            <div class="item">
                Vehicle: ${c.vehicle}<br>
                Case: ${c.violation}<br>
                Fine: ₹${c.fine}<br>
                Date: ${c.date}
            </div>
        `).join("") || "No cases filed against you";
}

// POST TRAFFIC UPDATE
function postUpdate() {
    let title = document.getElementById("updateTitle").value;
    let message = document.getElementById("updateMessage").value;

    if (!title || !message) {
        alert("Please enter traffic update details");
        return;
    }

    updates.push({
        title,
        message,
        police: currentUser.name,
        date: new Date().toLocaleDateString()
    });

    saveData();

    alert("Traffic update posted!");
    displayUpdates();
}

// DISPLAY UPDATES
function displayUpdates() {
    document.getElementById("trafficUpdates").innerHTML =
        updates.map(u => `
            <div class="item">
                <b>${u.title}</b><br>
                ${u.message}<br>
                Posted by: ${u.police}<br>
                Date: ${u.date}
            </div>
        `).join("") || "No traffic updates";
}

// ADD POLICE ACCOUNT
function addPolice() {
    let name = document.getElementById("policeName").value;
    let email = document.getElementById("policeEmail").value;
    let password = document.getElementById("policePassword").value;

    if (!name || !email || !password) {
        alert("Please fill all police details");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("Account already exists");
        return;
    }

    users.push({ name, email, password, role: "police" });
    saveData();

    alert("Police account created successfully!");
    displayPolice();
}

// DISPLAY POLICE
function displayPolice() {
    let police = users.filter(u => u.role === "police");

    document.getElementById("policeList").innerHTML =
        police.map(p => `
            <div class="item">
                Name: ${p.name}<br>
                Email: ${p.email}<br>
                <button class="delete" onclick="deletePolice('${p.email}')">
                    Delete Account
                </button>
            </div>
        `).join("") || "No police accounts added";
}

// DELETE POLICE
function deletePolice(email) {
    users = users.filter(u => u.email !== email);
    saveData();
    displayPolice();
    alert("Police account deleted");
}

// DAILY REPORT
function displayDailyReport() {
    let today = new Date().toLocaleDateString();

    let todayCases = cases.filter(c => c.date === today);

    document.getElementById("dailyReport").innerHTML = `
        <div class="item">
            Total Cases: ${cases.length}<br>
            Today's Cases: ${todayCases.length}<br>
            Total Fine Amount: ₹${cases.reduce((sum, c) =>
                sum + Number(c.fine), 0)}<br>
            Today's Fine Amount: ₹${todayCases.reduce((sum, c) =>
                sum + Number(c.fine), 0)}
        </div>
    `;
}

// LOGOUT
function logout() {
    currentUser = null;

    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("auth").classList.remove("hidden");

    document.getElementById("userPanel").classList.add("hidden");
    document.getElementById("policePanel").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
}