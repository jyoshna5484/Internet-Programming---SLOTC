const $ = selector => document.querySelector(selector);

const defaultGates = [
    { id: "GATE101", name: "Chennai Bypass Toll", location: "Chennai", fee: 100 },
    { id: "GATE102", name: "Vellore Highway Toll", location: "Vellore", fee: 120 },
    { id: "GATE103", name: "Krishnagiri Toll Plaza", location: "Krishnagiri", fee: 150 },
    { id: "GATE104", name: "Salem Highway Toll", location: "Salem", fee: 130 }
];

function loadData(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

let users = loadData("easyTollUsers", []);
let wallets = loadData("easyTollWallets", {});
let vehicles = loadData("easyTollVehicles", {});
let tickets = loadData("easyTollTickets", []);
let passes = loadData("easyTollPasses", []);
let transactions = loadData("easyTollTransactions", []);
let gates = loadData("easyTollGates", defaultGates);
let gateLocation = loadData("easyTollGateLocation", "Chennai");
let currentUser = sessionStorage.getItem("easyTollCurrentUser") || "";
let isAdmin = sessionStorage.getItem("easyTollAdmin") === "true";
let isGateOperator = sessionStorage.getItem("easyTollOperator") === "true";

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function money(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}

function notify(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function persistAll() {
    saveData("easyTollUsers", users);
    saveData("easyTollWallets", wallets);
    saveData("easyTollVehicles", vehicles);
    saveData("easyTollTickets", tickets);
    saveData("easyTollPasses", passes);
    saveData("easyTollTransactions", transactions);
    saveData("easyTollGates", gates);
    saveData("easyTollGateLocation", gateLocation);
}

function userWalletKey() {
    return currentUser.toLowerCase();
}

function getBalance() {
    return wallets[userWalletKey()] || 0;
}

function getUserVehicles() {
    return vehicles[userWalletKey()] || [];
}

function requireUser() {
    if (!currentUser) {
        notify("Please register or log in first.");
        $("#accounts").scrollIntoView({ behavior: "smooth" });
        return false;
    }
    return true;
}

function addTransaction(description, type, amount, status = "Success") {
    transactions.unshift({
        id: "TXN" + Date.now().toString().slice(-8),
        user: currentUser,
        date: new Date().toLocaleString(),
        description,
        type,
        amount,
        status
    });

    saveData("easyTollTransactions", transactions);
}

function updateDashboard() {
    const balance = getBalance();

    $("#navBalance").textContent = Number(balance).toLocaleString("en-IN");
    $("#heroBalance").textContent = money(balance);
    $("#walletBalance").textContent = money(balance);
    $("#dashboardBalance").textContent = money(balance);

    const userTickets = tickets.filter(ticket =>
        ticket.user.toLowerCase() === currentUser.toLowerCase()
    );

    const userPasses = passes.filter(pass =>
        pass.user.toLowerCase() === currentUser.toLowerCase()
    );

    $("#ticketCount").textContent = userTickets.length;
    $("#passCount").textContent = userPasses.length;
    $("#vehicleCount").textContent = getUserVehicles().length;

    $("#dashboardMessage").textContent = currentUser
        ? `Welcome, ${currentUser}! Your wallet balance is ${money(balance)}.`
        : "Welcome to EasyToll! Register or log in to manage your toll account.";

    const userTransactions = transactions.filter(transaction =>
        transaction.user.toLowerCase() === currentUser.toLowerCase()
    );

    const totalAdded = userTransactions
        .filter(transaction => transaction.type === "Credit")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalSpent = userTransactions
        .filter(transaction => transaction.type === "Debit")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    $("#totalAdded").textContent = money(totalAdded);
    $("#totalSpent").textContent = money(totalSpent);
    $("#totalTransactions").textContent = userTransactions.length;
}

function renderTransactions() {
    const userTransactions = transactions.filter(transaction =>
        transaction.user.toLowerCase() === currentUser.toLowerCase()
    );

    $("#transactionTable").innerHTML = userTransactions.length
        ? userTransactions.map(transaction => `
            <tr>
                <td>${escapeHTML(transaction.id)}</td>
                <td>${escapeHTML(transaction.date)}</td>
                <td>${escapeHTML(transaction.description)}</td>
                <td>${escapeHTML(transaction.type)}</td>
                <td>${transaction.type === "Debit" ? "−" : "+"}${money(transaction.amount)}</td>
                <td><span class="status">${escapeHTML(transaction.status)}</span></td>
            </tr>
        `).join("")
        : `<tr><td colspan="6">Log in to view your transactions.</td></tr>`;
}

function refreshUserInterface() {
    updateDashboard();
    renderVehicles();
    renderVehicleOptions();
    renderGates();
    renderPasses();
    renderTransactions();
    renderAdmin();
}

function addMoney() {
    if (!requireUser()) return;

    const amount = Number($("#addAmount").value);

    if (!Number.isFinite(amount) || amount <= 0) {
        notify("Enter a valid amount greater than zero.");
        return;
    }

    wallets[userWalletKey()] = getBalance() + amount;
    addTransaction("Wallet recharge", "Credit", amount);
    persistAll();
    refreshUserInterface();

    $("#addAmount").value = "";
    notify(`${money(amount)} added to your demo wallet.`);
}

function showWallet() {
    $("#wallet").scrollIntoView({ behavior: "smooth" });
}

function registerUser() {
    const name = $("#userName").value.trim();
    const email = $("#userEmail").value.trim().toLowerCase();
    const password = $("#userPassword").value;

    if (name.length < 2 || !email.includes("@") || password.length < 4) {
        $("#accountMessage").textContent =
            "Enter a valid name, email, and password of at least 4 characters.";
        return;
    }

    if (users.some(user => user.email === email)) {
        $("#accountMessage").textContent =
            "This email is already registered. Please log in.";
        return;
    }

    // Demo only. Real applications must use secure server-side authentication.
    users.push({ name, email, demoPassword: password });
    saveData("easyTollUsers", users);

    $("#accountMessage").textContent =
        "Registration successful! You can now log in.";
    $("#userPassword").value = "";

    renderAdmin();
}

function loginUser() {
    const email = $("#userEmail").value.trim().toLowerCase();
    const password = $("#userPassword").value;

    const user = users.find(account =>
        account.email === email && account.demoPassword === password
    );

    if (!user) {
        $("#accountMessage").textContent =
            "Invalid details. Register first if you do not have an account.";
        return;
    }

    currentUser = user.name;
    sessionStorage.setItem("easyTollCurrentUser", currentUser);

    $("#accountMessage").textContent = `Welcome, ${currentUser}!`;
    $("#userPassword").value = "";

    refreshUserInterface();
    notify("Login successful.");
}

function logoutUser() {
    currentUser = "";
    sessionStorage.removeItem("easyTollCurrentUser");

    $("#accountMessage").textContent = "You have logged out.";
    refreshUserInterface();
    notify("Logged out successfully.");
}

function addVehicle() {
    if (!requireUser()) return;

    const number = $("#vehicleNumber").value.trim().toUpperCase();
    const type = $("#vehicleType").value;
    const model = $("#vehicleModel").value.trim();

    if (!number || !model) {
        notify("Enter the vehicle number and model.");
        return;
    }

    const allVehicles = Object.values(vehicles).flat();
    if (allVehicles.some(vehicle => vehicle.number === number)) {
        notify("This vehicle number is already registered.");
        return;
    }

    const list = getUserVehicles();
    list.push({
        id: "VEH" + Date.now().toString().slice(-6),
        number,
        type,
        model
    });

    vehicles[userWalletKey()] = list;
    saveData("easyTollVehicles", vehicles);

    $("#vehicleNumber").value = "";
    $("#vehicleModel").value = "";

    refreshUserInterface();
    notify("Vehicle added successfully.");
}

function renderVehicles() {
    const list = getUserVehicles();

    $("#vehicleList").innerHTML = list.length
        ? list.map(vehicle => `
            <div class="list-item">
                <div>
                    <strong>${escapeHTML(vehicle.number)}</strong>
                    <small>${escapeHTML(vehicle.type)} · ${escapeHTML(vehicle.model)}</small>
                </div>
                <div class="item-actions">
                    <button class="small-btn" type="button"
                        onclick="editVehicle('${vehicle.id}')">Edit</button>
                    <button class="small-btn danger-btn" type="button"
                        onclick="deleteVehicle('${vehicle.id}')">Delete</button>
                </div>
            </div>
        `).join("")
        : `<div class="empty-state">Register a vehicle to get started.</div>`;
}

function editVehicle(id) {
    if (!requireUser()) return;

    const list = getUserVehicles();
    const vehicle = list.find(item => item.id === id);
    if (!vehicle) return;

    const newNumber = prompt("Vehicle registration number:", vehicle.number);
    if (newNumber === null) return;

    const newModel = prompt("Vehicle model:", vehicle.model);
    if (newModel === null) return;

    if (!newNumber.trim() || !newModel.trim()) {
        notify("Vehicle number and model cannot be empty.");
        return;
    }

    vehicle.number = newNumber.trim().toUpperCase();
    vehicle.model = newModel.trim();

    vehicles[userWalletKey()] = list;
    saveData("easyTollVehicles", vehicles);

    refreshUserInterface();
    notify("Vehicle details updated.");
}

function deleteVehicle(id) {
    if (!requireUser()) return;

    const list = getUserVehicles();
    vehicles[userWalletKey()] = list.filter(vehicle => vehicle.id !== id);
    saveData("easyTollVehicles", vehicles);

    refreshUserInterface();
    notify("Vehicle removed.");
}

function renderVehicleOptions() {
    const list = getUserVehicles();

    const options = list.map(vehicle => `
        <option value="${escapeHTML(vehicle.id)}">
            ${escapeHTML(vehicle.number)} — ${escapeHTML(vehicle.model)}
        </option>
    `).join("");

    $("#ticketVehicle").innerHTML =
        options || `<option value="">Add a vehicle first</option>`;

    $("#passVehicle").innerHTML =
        options || `<option value="">Add a vehicle first</option>`;
}

function renderGates() {
    const selected = $("#ticketGate").value;

    $("#ticketGate").innerHTML = gates.map(gate => `
        <option value="${escapeHTML(gate.id)}">
            ${escapeHTML(gate.name)} — ${money(gate.fee)}
        </option>
    `).join("");

    if (gates.some(gate => gate.id === selected)) {
        $("#ticketGate").value = selected;
    }

    if ($("#adminGateList")) {
        $("#adminGateList").innerHTML = gates.map(gate => `
            <div class="list-item">
                <div>
                    <strong>${escapeHTML(gate.name)}</strong>
                    <small>${escapeHTML(gate.id)} · ${escapeHTML(gate.location)} · ${money(gate.fee)}</small>
                </div>
                <button class="small-btn danger-btn" type="button"
                    onclick="deleteGate('${gate.id}')">Delete</button>
            </div>
        `).join("") || `<div class="empty-state">No toll gates created.</div>`;
    }
}

function buyTicket() {
    if (!requireUser()) return;

    const vehicleId = $("#ticketVehicle").value;
    const gateId = $("#ticketGate").value;
    const journeyDate = $("#journeyDate").value;

    const vehicle = getUserVehicles().find(item => item.id === vehicleId);
    const gate = gates.find(item => item.id === gateId);

    if (!vehicle || !gate || !journeyDate) {
        notify("Select a registered vehicle, toll gate, and journey date.");
        return;
    }

    const chosenDate = new Date(journeyDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (chosenDate < today) {
        notify("Journey date cannot be in the past.");
        return;
    }

    if (getBalance() < gate.fee) {
        notify(`Insufficient wallet balance. Please add ${money(gate.fee)} or more.`);
        showWallet();
        return;
    }

    wallets[userWalletKey()] = getBalance() - gate.fee;

    const ticket = {
        id: "ET" + Date.now().toString().slice(-8),
        user: currentUser,
        vehicle: vehicle.number,
        gateId: gate.id,
        gateName: gate.name,
        fee: gate.fee,
        journeyDate,
        status: "Valid",
        qrCode: "EASYTOLL-" + Date.now().toString(36).toUpperCase()
    };

    tickets.push(ticket);
    addTransaction("Advance toll ticket: " + gate.name, "Debit", gate.fee);

    saveData("easyTollTickets", tickets);
    persistAll();
    refreshUserInterface();

    $("#latestTicket").innerHTML = `
        <strong>e-Ticket Purchased Successfully</strong><br>
        Ticket ID: ${escapeHTML(ticket.id)}<br>
        Gate: ${escapeHTML(ticket.gateName)}<br>
        Vehicle: ${escapeHTML(ticket.vehicle)}<br>
        Journey Date: ${escapeHTML(ticket.journeyDate)}<br>
        Amount: ${money(ticket.fee)}<br>
        Status: ${escapeHTML(ticket.status)}<br>
        <div class="ticket-code">${escapeHTML(ticket.qrCode)}</div>
        <p>Demo QR identifier. This is not a scannable QR image.</p>
    `;

    notify("Advance toll ticket purchased.");
}

function applyPass() {
    if (!requireUser()) return;

    const vehicleId = $("#passVehicle").value;
    const vehicle = getUserVehicles().find(item => item.id === vehicleId);
    const passType = $("#passType").value;
    const action = $("#passAction").value;
    const route = $("#passRoute").value.trim();

    if (!vehicle || !route) {
        notify("Select a vehicle and enter your preferred route.");
        return;
    }

    if (action === "Renewal") {
        const activePass = passes.find(pass =>
            pass.user.toLowerCase() === currentUser.toLowerCase() &&
            pass.vehicle === vehicle.number &&
            pass.status === "Approved"
        );

        if (!activePass) {
            notify("No approved pass found for renewal. Apply for a new pass.");
            return;
        }
    }

    const cost = {
        Monthly: 1500,
        Quarterly: 4000,
        Annual: 14000
    }[passType];

    const pass = {
        id: "PASS" + Date.now().toString().slice(-7),
        user: currentUser,
        vehicle: vehicle.number,
        type: passType,
        action,
        route,
        cost,
        status: "Pending",
        qrCode: ""
    };

    passes.push(pass);
    saveData("easyTollPasses", passes);
    refreshUserInterface();

    $("#passRoute").value = "";
    notify("Pass application submitted for admin approval.");
}

function renderPasses() {
    const list = passes.filter(pass =>
        pass.user.toLowerCase() === currentUser.toLowerCase()
    );

    $("#passList").innerHTML = list.length
        ? list.map(pass => `
            <div class="list-item">
                <div>
                    <strong>${escapeHTML(pass.type)} Toll Pass</strong>
                    <small>${escapeHTML(pass.id)} · ${escapeHTML(pass.vehicle)}</small>
                    <small>${escapeHTML(pass.route)} · ${money(pass.cost)}</small>
                    <small>Status: ${escapeHTML(pass.status)}</small>
                    ${pass.qrCode
                        ? `<div class="ticket-code">${escapeHTML(pass.qrCode)}</div>`
                        : ""}
                </div>
                <div class="item-actions">
                    ${pass.status === "Approved"
                        ? `<button class="small-btn" type="button"
                            onclick="showPassQR('${pass.id}')">View QR ID</button>`
                        : ""}
                </div>
            </div>
        `).join("")
        : `<div class="empty-state">No toll passes yet.</div>`;
}

function showPassQR(id) {
    const pass = passes.find(item => item.id === id);
    if (!pass) return;

    alert(
        "EasyToll Pass\n\n" +
        "Pass ID: " + pass.id + "\n" +
        "Vehicle: " + pass.vehicle + "\n" +
        "Route: " + pass.route + "\n" +
        "Status: " + pass.status + "\n" +
        "Demo QR identifier: " + pass.qrCode
    );
}

function adminLogin() {
    const username = $("#adminUsername").value.trim();
    const password = $("#adminPassword").value;

    // Demo credentials only; production credentials belong on a secure server.
    if (username === "admin" && password === "EasyToll123") {
        isAdmin = true;
        sessionStorage.setItem("easyTollAdmin", "true");
        $("#adminMessage").textContent = "Administrator login successful.";
        renderAdmin();
        notify("Welcome, administrator.");
    } else {
        $("#adminMessage").textContent = "Invalid admin username or password.";
    }
}

function adminLogout() {
    isAdmin = false;
    sessionStorage.removeItem("easyTollAdmin");
    $("#adminDashboard").hidden = true;
    $("#adminMessage").textContent = "Administrator logged out.";
}

function requireAdmin() {
    if (!isAdmin) {
        notify("Please log in as administrator.");
        return false;
    }
    return true;
}

function renderAdmin() {
    if (!isAdmin) {
        $("#adminDashboard").hidden = true;
        return;
    }

    $("#adminDashboard").hidden = false;
    $("#adminUserCount").textContent = users.length;
    $("#adminPassCount").textContent = passes.length;
    $("#adminTicketCount").textContent = tickets.length;

    $("#adminUsers").innerHTML = users.length
        ? users.map(user => `
            <tr>
                <td>${escapeHTML(user.name)}</td>
                <td>${escapeHTML(user.email)}</td>
                <td>
                    <button class="small-btn danger-btn" type="button"
                        onclick="deleteUser('${encodeURIComponent(user.email)}')">
                        Delete
                    </button>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="3">No registered users.</td></tr>`;

    $("#adminPasses").innerHTML = passes.length
        ? passes.map(pass => `
            <tr>
                <td>${escapeHTML(pass.id)}</td>
                <td>${escapeHTML(pass.user)}</td>
                <td>${escapeHTML(pass.vehicle)}</td>
                <td>${escapeHTML(pass.type)}</td>
                <td><span class="status ${pass.status === "Pending" ? "pending" : ""}">
                    ${escapeHTML(pass.status)}
                </span></td>
                <td>
                    ${pass.status === "Pending"
                        ? `<button class="small-btn" type="button"
                            onclick="approvePass('${pass.id}')">Approve</button>`
                        : `<button class="small-btn" type="button"
                            onclick="showPassQR('${pass.id}')">View QR ID</button>`}
                    <button class="small-btn danger-btn" type="button"
                        onclick="deletePass('${pass.id}')">Delete</button>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="6">No pass applications.</td></tr>`;

    $("#adminTickets").innerHTML = tickets.length
        ? tickets.map(ticket => `
            <tr>
                <td>${escapeHTML(ticket.id)}</td>
                <td>${escapeHTML(ticket.user)}</td>
                <td>${escapeHTML(ticket.gateName)}</td>
                <td>${money(ticket.fee)}</td>
                <td>${escapeHTML(ticket.status)}</td>
                <td>
                    <button class="small-btn" type="button"
                        onclick="showTicketQR('${ticket.id}')">View QR ID</button>
                    <button class="small-btn danger-btn" type="button"
                        onclick="deleteTicket('${ticket.id}')">Delete</button>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="6">No tickets purchased.</td></tr>`;

    renderGates();
}

function approvePass(id) {
    if (!requireAdmin()) return;

    const pass = passes.find(item => item.id === id);
    if (!pass) return;

    if (pass.status !== "Pending") {
        notify("This pass has already been processed.");
        return;
    }

    if (!confirm(`Approve pass ${id} for ${pass.user}?`)) return;

    pass.status = "Approved";
    pass.qrCode = "EASYTOLL-PASS-" + Date.now().toString(36).toUpperCase();

    saveData("easyTollPasses", passes);
    refreshUserInterface();
    notify("Toll pass approved. Demo QR identifier generated.");
}

function deletePass(id) {
    if (!requireAdmin()) return;
    if (!confirm("Delete this toll pass application?")) return;

    passes = passes.filter(pass => pass.id !== id);
    saveData("easyTollPasses", passes);

    refreshUserInterface();
    notify("Pass application deleted.");
}

function deleteUser(encodedEmail) {
    if (!requireAdmin()) return;

    const email = decodeURIComponent(encodedEmail);
    if (!confirm("Delete this user account?")) return;

    const user = users.find(account => account.email === email);
    if (!user) return;

    users = users.filter(account => account.email !== email);

    // Remove demo account-associated records.
    delete wallets[user.name.toLowerCase()];
    delete vehicles[user.name.toLowerCase()];
    tickets = tickets.filter(ticket =>
        ticket.user.toLowerCase() !== user.name.toLowerCase()
    );
    passes = passes.filter(pass =>
        pass.user.toLowerCase() !== user.name.toLowerCase()
    );
    transactions = transactions.filter(transaction =>
        transaction.user.toLowerCase() !== user.name.toLowerCase()
    );

    persistAll();

    if (currentUser.toLowerCase() === user.name.toLowerCase()) {
        currentUser = "";
        sessionStorage.removeItem("easyTollCurrentUser");
    }

    refreshUserInterface();
    notify("User and associated demo records deleted.");
}

function createGate() {
    if (!requireAdmin()) return;

    const name = $("#newGateName").value.trim();
    const location = $("#newGateLocation").value.trim();
    const fee = Number($("#newGateFee").value);

    if (!name || !location || !Number.isFinite(fee) || fee <= 0) {
        notify("Enter a toll name, location, and valid fee.");
        return;
    }

    gates.push({
        id: "GATE" + Date.now().toString().slice(-6),
        name,
        location,
        fee
    });

    saveData("easyTollGates", gates);

    $("#newGateName").value = "";
    $("#newGateLocation").value = "";
    $("#newGateFee").value = "";

    refreshUserInterface();
    notify("Toll gate created successfully.");
}

function deleteGate(id) {
    if (!requireAdmin()) return;

    const gate = gates.find(item => item.id === id);
    if (!gate) return;

    if (tickets.some(ticket => ticket.gateId === id)) {
        notify("Cannot delete a toll gate with existing tickets.");
        return;
    }

    gates = gates.filter(item => item.id !== id);
    saveData("easyTollGates", gates);

    refreshUserInterface();
    notify("Toll gate deleted.");
}

function showTicketQR(id) {
    const ticket = tickets.find(item => item.id === id);
    if (!ticket) return;

    alert(
        "EasyToll e-Ticket\n\n" +
        "Ticket ID: " + ticket.id + "\n" +
        "Vehicle: " + ticket.vehicle + "\n" +
        "Toll Gate: " + ticket.gateName + "\n" +
        "Journey Date: " + ticket.journeyDate + "\n" +
        "Status: " + ticket.status + "\n" +
        "Demo QR identifier: " + ticket.qrCode
    );
}

function deleteTicket(id) {
    if (!requireAdmin()) return;

    if (!confirm("Delete this ticket record?")) return;

    tickets = tickets.filter(ticket => ticket.id !== id);
    saveData("easyTollTickets", tickets);

    refreshUserInterface();
    notify("Ticket record deleted.");
}

function gateLogin() {
    const username = $("#gateUsername").value.trim();
    const password = $("#gatePassword").value;

    // Demo operator credentials.
    if (username === "operator" && password === "Gate123") {
        isGateOperator = true;
        sessionStorage.setItem("easyTollOperator", "true");
        $("#gateDashboard").hidden = false;
        $("#gateMessage").textContent = "Toll gate operator login successful.";
        $("#gateLocation").value = gateLocation;
        notify("Operator logged in.");
    } else {
        $("#gateMessage").textContent = "Invalid operator credentials.";
    }
}

function gateLogout() {
    isGateOperator = false;
    sessionStorage.removeItem("easyTollOperator");
    $("#gateDashboard").hidden = true;
    $("#gateMessage").textContent = "Operator logged out.";
}

function verifyTicketOrPass() {
    if (!isGateOperator) {
        notify("Please log in as a toll gate operator.");
        return;
    }

    const id = $("#verifyId").value.trim();
    const location = $("#gateLocation").value.trim();

    if (!id) {
        notify("Enter a ticket ID or pass ID.");
        return;
    }

    const ticket = tickets.find(item => item.id === id);
    const pass = passes.find(item => item.id === id);

    if (ticket) {
        if (ticket.status !== "Valid") {
            showVerificationError("This ticket is not valid or has already been used.");
            return;
        }

        if (ticket.gateId !== gates.find(gate => gate.name === ticket.gateName)?.id) {
            showVerificationError("The ticket's toll gate could not be verified.");
            return;
        }

        if (ticket.journeyDate !== new Date().toISOString().slice(0, 10)) {
            showVerificationError("Ticket is valid only on its selected journey date.");
            return;
        }

        ticket.status = "Used";
        saveData("easyTollTickets", tickets);

        $("#verificationResult").className = "verification-result success";
        $("#verificationResult").innerHTML = `
            <strong>✓ TICKET VERIFIED</strong><br><br>
            Ticket ID: ${escapeHTML(ticket.id)}<br>
            Vehicle: ${escapeHTML(ticket.vehicle)}<br>
            Toll Gate: ${escapeHTML(ticket.gateName)}<br>
            Paid Amount: ${money(ticket.fee)}<br>
            Location: ${escapeHTML(location || ticket.gateName)}<br><br>
            Demo verification complete. Ticket marked as used.
        `;

        $("#verifyId").value = "";
        refreshUserInterface();
        return;
    }

    if (pass) {
        if (pass.status !== "Approved" || !pass.qrCode) {
            showVerificationError("This toll pass has not been approved.");
            return;
        }

        $("#verificationResult").className = "verification-result success";
        $("#verificationResult").innerHTML = `
            <strong>✓ TOLL PASS VERIFIED</strong><br><br>
            Pass ID: ${escapeHTML(pass.id)}<br>
            User: ${escapeHTML(pass.user)}<br>
            Vehicle: ${escapeHTML(pass.vehicle)}<br>
            Pass Type: ${escapeHTML(pass.type)}<br>
            Route: ${escapeHTML(pass.route)}<br>
            Location: ${escapeHTML(location || gateLocation)}<br><br>
            Demo pass verification successful.
        `;
        return;
    }

    showVerificationError("Ticket or pass ID not found.");
}

function showVerificationError(message) {
    $("#verificationResult").className = "verification-result error";
    $("#verificationResult").textContent = "✕ " + message;
}

function updateGateLocation() {
    if (!isGateOperator) {
        notify("Please log in as a toll gate operator.");
        return;
    }

    const location = $("#gateLocation").value.trim();

    if (!location) {
        notify("Enter the current toll gate location.");
        return;
    }

    gateLocation = location;
    saveData("easyTollGateLocation", gateLocation);

    $("#gateMessage").textContent = "Toll gate location updated to " + gateLocation + ".";
    notify("Toll gate location updated.");
}

$("#addMoneyButton").addEventListener("click", addMoney);
$("#registerButton").addEventListener("click", registerUser);
$("#loginButton").addEventListener("click", loginUser);
$("#logoutButton").addEventListener("click", logoutUser);
$("#addVehicleButton").addEventListener("click", addVehicle);
$("#buyTicketButton").addEventListener("click", buyTicket);
$("#applyPassButton").addEventListener("click", applyPass);
$("#adminLoginButton").addEventListener("click", adminLogin);
$("#adminLogoutButton").addEventListener("click", adminLogout);
$("#createGateButton").addEventListener("click", createGate);
$("#gateLoginButton").addEventListener("click", gateLogin);
$("#gateLogoutButton").addEventListener("click", gateLogout);
$("#verifyButton").addEventListener("click", verifyTicketOrPass);
$("#updateLocationButton").addEventListener("click", updateGateLocation);

document.querySelectorAll("[data-amount]").forEach(button => {
    button.addEventListener("click", () => {
        $("#addAmount").value = button.dataset.amount;
    });
});

$("#passAction").addEventListener("change", () => {
    $("#applyPassButton").textContent =
        $("#passAction").value === "Renewal"
            ? "Submit Renewal Request"
            : "Submit Pass Application";
});

$("#journeyDate").min = new Date().toISOString().slice(0, 10);

refreshUserInterface();

if (isAdmin) {
    renderAdmin();
}

if (isGateOperator) {
    $("#gateDashboard").hidden = false;
    $("#gateLocation").value = gateLocation;
}