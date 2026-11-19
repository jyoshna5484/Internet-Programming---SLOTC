let users = JSON.parse(localStorage.getItem("vetUsers")) || [];
let complaints = JSON.parse(localStorage.getItem("vetComplaints")) || [];
let payments = JSON.parse(localStorage.getItem("vetPayments")) || [];
let feedbacks = JSON.parse(localStorage.getItem("vetFeedback")) || [];
let cures = JSON.parse(localStorage.getItem("vetCures")) || [];
let currentUser = JSON.parse(localStorage.getItem("vetCurrentUser")) || null;

function saveData() {
    localStorage.setItem("vetUsers", JSON.stringify(users));
    localStorage.setItem("vetComplaints", JSON.stringify(complaints));
    localStorage.setItem("vetPayments", JSON.stringify(payments));
    localStorage.setItem("vetFeedback", JSON.stringify(feedbacks));
    localStorage.setItem("vetCures", JSON.stringify(cures));
    localStorage.setItem("vetCurrentUser", JSON.stringify(currentUser));
}

function showRegister() {
    document.getElementById("auth-section").scrollIntoView({behavior: "smooth"});
}

function showLogin() {
    showRegister();
    alert("Enter your registered email and password to login.");
}

function register() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let location = document.getElementById("location").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if (!name || !email || !phone || !location || !password) {
        alert("Please fill all fields.");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("Email already registered.");
        return;
    }

    let user = {name, email, phone, location, password, role};

    users.push(user);
    saveData();

    alert("Registration successful!");
}

function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    currentUser = user;
    saveData();

    document.getElementById("auth-section").style.display = "none";

    if (user.role === "doctor") {
        document.getElementById("doctor-dashboard").style.display = "block";
        document.getElementById("dashboard").style.display = "none";
    } else {
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("doctor-dashboard").style.display = "none";
    }

    alert("Welcome " + user.name);
}

function logout() {
    currentUser = null;
    saveData();

    document.getElementById("dashboard").style.display = "none";
    document.getElementById("doctor-dashboard").style.display = "none";
    document.getElementById("auth-section").style.display = "block";

    alert("Logged out successfully.");
}

function showComplaint() {
    document.getElementById("dashboard-content").innerHTML = `
        <div class="complaint">
            <h3>Report Animal Health Problem</h3>

            <input id="animal" placeholder="Animal Name / Type">
            <input id="breed" placeholder="Breed">
            <input id="age" placeholder="Animal Age">
            <input id="disease" placeholder="Suspected Disease">
            <textarea id="symptoms" placeholder="Describe symptoms"></textarea>

            <label>Upload Image</label>
            <input type="file" id="image" accept="image/*">

            <label>Upload Audio</label>
            <input type="file" id="audio" accept="audio/*">

            <label>Upload Video</label>
            <input type="file" id="video" accept="video/*">

            <button onclick="submitComplaint()">Submit Complaint</button>
        </div>
    `;
}

function submitComplaint() {
    let animal = document.getElementById("animal").value;
    let symptoms = document.getElementById("symptoms").value;

    if (!animal || !symptoms) {
        alert("Enter animal details and symptoms.");
        return;
    }

    let complaint = {
        id: Date.now(),
        farmer: currentUser.email,
        farmerName: currentUser.name,
        location: currentUser.location,
        animal,
        breed: document.getElementById("breed").value,
        age: document.getElementById("age").value,
        disease: document.getElementById("disease").value,
        symptoms,
        status: "Pending",
        solution: "Waiting for doctor response",
        date: new Date().toLocaleDateString()
    };

    complaints.push(complaint);
    saveData();

    alert("Complaint submitted successfully!");
    showComplaints();
}

function showComplaints() {
    let myComplaints = complaints.filter(c => c.farmer === currentUser.email);

    document.getElementById("dashboard-content").innerHTML = `
        <h3>My Complaint Status</h3>
        ${myComplaints.map(c => `
            <div class="complaint">
                <h4>${c.animal}</h4>
                <p><b>Symptoms:</b> ${c.symptoms}</p>
                <p><b>Status:</b> ${c.status}</p>
                <p><b>Doctor Response:</b> ${c.solution}</p>
                <p><b>Date:</b> ${c.date}</p>
            </div>
        `).join("") || "No complaints submitted."}
    `;
}

function showDoctors() {
    let doctors = users.filter(u => u.role === "doctor");

    document.getElementById("dashboard-content").innerHTML = `
        <h3>Available Doctors</h3>
        ${doctors.map(d => `
            <div class="complaint">
                <h4>👨‍⚕️ ${d.name}</h4>
                <p>Email: ${d.email}</p>
            </div>
        `).join("") || "No doctors registered yet."}
    `;
}

function showReports() {
    let report = {};

    complaints.forEach(c => {
        report[c.disease || "Unspecified Disease"] =
            (report[c.disease || "Unspecified Disease"] || 0) + 1;
    });

    document.getElementById("dashboard-content").innerHTML = `
        <h3>Disease Reports</h3>
        ${Object.entries(report).map(([d, count]) => `
            <div class="complaint">
                <p><b>${d}</b></p>
                <p>Reported Cases: ${count}</p>
            </div>
        `).join("") || "No reports available."}
    `;
}

function showPayment() {
    document.getElementById("dashboard-content").innerHTML = `
        <div class="complaint">
            <h3>Doctor Consultation Payment</h3>
            <input id="doctorName" placeholder="Doctor Name">
            <input id="amount" type="number" placeholder="Amount">
            <select id="paymentMethod">
                <option>Bank Transfer</option>
                <option>EasyPaisa</option>
            </select>
            <button onclick="makePayment()">Pay Now</button>
        </div>
    `;
}

function makePayment() {
    let payment = {
        farmer: currentUser.email,
        doctor: document.getElementById("doctorName").value,
        amount: document.getElementById("amount").value,
        method: document.getElementById("paymentMethod").value,
        date: new Date().toLocaleDateString()
    };

    if (!payment.doctor || !payment.amount) {
        alert("Enter doctor and payment details.");
        return;
    }

    payments.push(payment);
    saveData();

    alert("Payment recorded successfully (Demo)!");
}

function showFeedback() {
    document.getElementById("dashboard-content").innerHTML = `
        <div class="complaint">
            <h3>Post Feedback</h3>
            <textarea id="feedbackText" placeholder="Write your feedback"></textarea>
            <button onclick="submitFeedback()">Submit Feedback</button>
        </div>
    `;
}

function submitFeedback() {
    let text = document.getElementById("feedbackText").value;

    if (!text) {
        alert("Enter feedback.");
        return;
    }

    feedbacks.push({
        user: currentUser.email,
        text,
        date: new Date().toLocaleDateString()
    });

    saveData();
    alert("Feedback submitted successfully!");
}

function showProfile() {
    document.getElementById("dashboard-content").innerHTML = `
        <div class="complaint">
            <h3>My Profile</h3>
            <p>Name: ${currentUser.name}</p>
            <p>Email: ${currentUser.email}</p>
            <p>Phone: ${currentUser.phone}</p>
            <p>Location: ${currentUser.location}</p>
        </div>
    `;
}

// DOCTOR FUNCTIONS

function doctorComplaints() {
    document.getElementById("doctor-content").innerHTML = `
        <h3>Farmer Complaints</h3>
        ${complaints.map(c => `
            <div class="complaint">
                <h4>${c.animal}</h4>
                <p>Farmer: ${c.farmerName}</p>
                <p>Location: ${c.location}</p>
                <p>Symptoms: ${c.symptoms}</p>
                <p>Status: ${c.status}</p>
                <p>Solution: ${c.solution}</p>
                <textarea id="solution${c.id}" placeholder="Enter treatment solution"></textarea>
                <button onclick="respond(${c.id})">Post Solution</button>
            </div>
        `).join("") || "No complaints."}
    `;
}

function respond(id) {
    let solution = document.getElementById("solution" + id).value;

    if (!solution) {
        alert("Enter solution.");
        return;
    }

    let c = complaints.find(c => c.id === id);
    c.solution = solution;
    c.status = "Responded";

    saveData();
    alert("Solution posted.");
    doctorComplaints();
}

function manageCures() {
    document.getElementById("doctor-content").innerHTML = `
        <div class="complaint">
            <h3>Add Disease & Treatment</h3>
            <input id="cureName" placeholder="Disease Name">
            <textarea id="cureInfo" placeholder="Symptoms and treatment"></textarea>
            <button onclick="addCure()">Add Cure</button>
        </div>

        ${cures.map(c => `
            <div class="complaint">
                <h4>${c.name}</h4>
                <p>${c.info}</p>
            </div>
        `).join("")}
    `;
}

function addCure() {
    let name = document.getElementById("cureName").value;
    let info = document.getElementById("cureInfo").value;

    if (!name || !info) {
        alert("Fill all fields.");
        return;
    }

    cures.push({name, info});
    saveData();

    alert("Disease information added.");
    manageCures();
}

function manageNews() {
    document.getElementById("doctor-content").innerHTML = `
        <div class="complaint">
            <h3>Manage News</h3>
            <input id="newsTitle" placeholder="News Title">
            <textarea id="newsInfo" placeholder="News Content"></textarea>
            <button onclick="addNews()">Publish News</button>
        </div>
    `;
}

function addNews() {
    let title = document.getElementById("newsTitle").value;
    let info = document.getElementById("newsInfo").value;

    if (!title || !info) {
        alert("Fill all fields.");
        return;
    }

    alert("News published successfully!");
}

function viewUsers() {
    document.getElementById("doctor-content").innerHTML = `
        <h3>Registered Users</h3>
        ${users.map(u => `
            <div class="complaint">
                <p>Name: ${u.name}</p>
                <p>Email: ${u.email}</p>
                <p>Role: ${u.role}</p>
            </div>
        `).join("")}
    `;
}

function viewPayments() {
    document.getElementById("doctor-content").innerHTML = `
        <h3>Payment Details</h3>
        ${payments.map(p => `
            <div class="complaint">
                <p>Farmer: ${p.farmer}</p>
                <p>Doctor: ${p.doctor}</p>
                <p>Amount: ₹${p.amount}</p>
                <p>Method: ${p.method}</p>
        </div>
        `).join("") || "No payments."}
    `;
}

function viewFeedback() {
    document.getElementById("doctor-content").innerHTML = `
        <h3>Feedback Details</h3>
        ${feedbacks.map(f => `
            <div class="complaint">
                <p>User: ${f.user}</p>
                <p>${f.text}</p>
            </div>
        `).join("") || "No feedback."}
    `;
}

// Display sample doctors

document.getElementById("doctor-list").innerHTML = `
    <div class="card">
        <h3>Dr. Ravi Kumar</h3>
        <p>Government Veterinary Hospital</p>
        <p>🐄 Livestock Specialist</p>
    </div>
    <div class="card">
        <h3>Dr. Priya Sharma</h3>
        <p>Private Veterinary Clinic</p>
        <p>🐕 Pet Specialist</p>
    </div>
    <div class="card">
        <h3>Dr. Arjun</h3>
        <p>Animal Health Center</p>
        <p>🐐 Veterinary Doctor</p>
    </div>
`;