// Billing Rates
let rates = {
    domestic: [1, 2.5, 4, 6],
    commercial: [2, 4.5, 6, 7]
};

let dueDate = "";
let customers = [];

// Customer Registration
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let customer = {
        name: document.getElementById("regName").value,
        id: document.getElementById("regId").value,
        email: document.getElementById("regEmail").value,
        password: document.getElementById("regPassword").value,
        type: document.getElementById("connectionType").value
    };

    customers.push(customer);

    alert("Customer Registered Successfully!");
    this.reset();
});

// Customer Login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let id = document.getElementById("loginId").value;
    let password = document.getElementById("loginPassword").value;

    let customer = customers.find(function(c) {
        return c.id === id && c.password === password;
    });

    if (customer) {
        document.getElementById("loginMessage").innerHTML =
            "Welcome " + customer.name + "! Login Successful.";
    } else {
        document.getElementById("loginMessage").innerHTML =
            "Invalid Customer ID or Password!";
    }
});

// Admin Login
document.getElementById("adminForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("adminName").value;
    let password = document.getElementById("adminPassword").value;

    if (name === "admin" && password === "admin123") {
        document.getElementById("adminPanel").style.display = "block";
        alert("Admin Login Successful!");
    } else {
        alert("Invalid Admin Credentials!");
    }
});

// Update Billing Rates and Dates
document.getElementById("billingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    rates.domestic = [
        Number(document.getElementById("domestic1").value),
        Number(document.getElementById("domestic2").value),
        Number(document.getElementById("domestic3").value),
        Number(document.getElementById("domestic4").value)
    ];

    rates.commercial = [
        Number(document.getElementById("commercial1").value),
        Number(document.getElementById("commercial2").value),
        Number(document.getElementById("commercial3").value),
        Number(document.getElementById("commercial4").value)
    ];

    dueDate = document.getElementById("dueDate").value;

    alert("Billing Rates and Dates Updated Successfully!");
});

// Calculate Bill
document.getElementById("billForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let customerId = document.getElementById("billCustomer").value;
    let units = Number(document.getElementById("units").value);
    let type = document.getElementById("billType").value;

    let rate = rates[type];
    let amount = 0;

    if (units <= 100) {
        amount = units * rate[0];
    } else if (units <= 200) {
        amount = 100 * rate[0] + (units - 100) * rate[1];
    } else if (units <= 500) {
        amount = 100 * rate[0] + 100 * rate[1] +
                 (units - 200) * rate[2];
    } else {
        amount = 100 * rate[0] + 100 * rate[1] +
                 300 * rate[2] + (units - 500) * rate[3];
    }

    let fine = 0;

    if (dueDate !== "") {
        let today = new Date();
        let lastDate = new Date(dueDate);

        today.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);

        if (today > lastDate) {
            let days = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            fine = days * 10;
        }
    }

    let total = amount + fine;

    document.getElementById("billResult").innerHTML = `
        <h3>Electricity Bill Details</h3>
        <p>Customer ID: ${customerId}</p>
        <p>Units Consumed: ${units}</p>
        <p>Connection Type: ${type}</p>
        <p>Bill Amount: ₹${amount.toFixed(2)}</p>
        <p>Late Fine: ₹${fine}</p>
        <h3>Total Amount: ₹${total.toFixed(2)}</h3>
    `;

    document.getElementById("payCustomer").value = customerId;
    document.getElementById("payAmount").value = total.toFixed(2);
});

// Payment
document.getElementById("paymentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let customer = document.getElementById("payCustomer").value;
    let amount = document.getElementById("payAmount").value;
    let method = document.getElementById("paymentMethod").value;

    document.getElementById("receipt").innerHTML = `
        <h2>Payment Successful!</h2>
        <p>Customer ID: ${customer}</p>
        <p>Amount Paid: ₹${amount}</p>
        <p>Payment Method: ${method}</p>
        <p>Status: Paid</p>
        <p>Thank you for your payment!</p>
        <button onclick="window.print()">Download / Print Receipt</button>
    `;

    alert("Payment Successful!");
    this.reset();
});