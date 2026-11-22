let customers = [];
let payments = [];

let currentCustomer = null;

let billStart = "";
let billEnd = "";
let dueDate = "";

let monthlyBill = 500;
let finePerDay = 10;

// Customer Registration
function registerCustomer() {
    let name = document.getElementById("regName").value;
    let phone = document.getElementById("regPhone").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    if (name === "" || phone === "" || email === "" || password === "") {
        alert("Please fill all registration details");
        return;
    }

    customers.push({
        name: name,
        phone: phone,
        email: email,
        password: password,
        paid: 0
    });

    alert("Registration successful!");
    showSection("login");
}

// Customer Login
function customerLogin() {
    let phone = document.getElementById("loginPhone").value;
    let password = document.getElementById("loginPassword").value;

    let customer = customers.find(function(c) {
        return c.phone === phone && c.password === password;
    });

    if (!customer) {
        alert("Invalid login details");
        return;
    }

    currentCustomer = customer;

    document.getElementById("welcome").innerText =
        "Welcome, " + customer.name;

    displayBill();
    displayHistory();

    showSection("dashboard");
}

// Display Bill
function displayBill() {
    let today = new Date();
    let due = dueDate ? new Date(dueDate) : null;

    let fine = 0;

    if (due && today > due) {
        let daysLate = Math.floor(
            (today - due) / (1000 * 60 * 60 * 24)
        );

        fine = daysLate * finePerDay;
    }

    let remaining = monthlyBill - currentCustomer.paid;

    if (remaining < 0) {
        remaining = 0;
    }

    let total = remaining + fine;

    document.getElementById("billPeriod").innerText =
        "Billing Period: " + billStart + " to " + billEnd;

    document.getElementById("dueDate").innerText =
        "Last Payment Date: " + dueDate;

    document.getElementById("billAmount").innerText =
        "Monthly Bill: ₹" + monthlyBill;

    document.getElementById("fineAmount").innerText =
        "Late Fine: ₹" + fine;

    document.getElementById("totalAmount").innerText =
        "Outstanding Amount: ₹" + total;
}

// Pay Bill
function payBill() {
    let amount = Number(document.getElementById("paymentAmount").value);
    let method = document.getElementById("paymentMethod").value;

    if (amount <= 0 || isNaN(amount)) {
        alert("Enter a valid payment amount");
        return;
    }

    let remaining = monthlyBill - currentCustomer.paid;

    if (amount > remaining) {
        alert("Amount exceeds the outstanding bill amount");
        return;
    }

    currentCustomer.paid += amount;

    let payment = {
        name: currentCustomer.name,
        phone: currentCustomer.phone,
        amount: amount,
        method: method,
        date: new Date().toLocaleDateString()
    };

    payments.push(payment);

    alert("Payment successful!");

    displayBill();
    displayHistory();
}

// Display Payment History
function displayHistory() {
    let output = "";

    let customerPayments = payments.filter(function(payment) {
        return payment.phone === currentCustomer.phone;
    });

    if (customerPayments.length === 0) {
        output = "<p>No payment history available.</p>";
    } else {
        output = "<table><tr><th>Date</th><th>Amount</th>" +
                 "<th>Payment Method</th></tr>";

        customerPayments.forEach(function(payment) {
            output += "<tr>";
            output += "<td>" + payment.date + "</td>";
            output += "<td>₹" + payment.amount + "</td>";
            output += "<td>" + payment.method + "</td>";
            output += "</tr>";
        });

        output += "</table>";
    }

    document.getElementById("paymentHistory").innerHTML = output;
}

// Download Receipt
function downloadReceipt() {
    if (payments.length === 0) {
        alert("No payment receipt available");
        return;
    }

    let payment = payments[payments.length - 1];

    let receipt =
        "PHONE BILL PAYMENT RECEIPT\n\n" +
        "Customer Name: " + payment.name + "\n" +
        "Phone Number: " + payment.phone + "\n" +
        "Payment Amount: ₹" + payment.amount + "\n" +
        "Payment Method: " + payment.method + "\n" +
        "Payment Date: " + payment.date + "\n" +
        "Status: Successful";

    let file = new Blob([receipt], { type: "text/plain" });

    let link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "Phone_Bill_Receipt.txt";
    link.click();
}

// Admin Login
function adminLogin() {
    let username = document.getElementById("adminUsername").value;
    let password = document.getElementById("adminPassword").value;

    if (username === "admin" && password === "admin123") {
        showSection("adminDashboard");
    } else {
        alert("Invalid admin login");
    }
}

// Admin Update Bill
function updateBill() {
    billStart = document.getElementById("startDate").value;
    billEnd = document.getElementById("endDate").value;
    dueDate = document.getElementById("lastDate").value;

    monthlyBill = Number(document.getElementById("monthlyBill").value);
    finePerDay = Number(document.getElementById("finePerDay").value);

    if (billStart === "" || billEnd === "" || dueDate === "") {
        alert("Please enter all billing dates");
        return;
    }

    document.getElementById("adminMessage").innerText =
        "Monthly billing details updated successfully!";
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(function(section) {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");
}