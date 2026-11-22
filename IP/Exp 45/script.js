let standardDeduction = 50000;
let maxPension = 150000;

let rate1 = 5;
let rate2 = 20;
let rate3 = 30;

let employeeName = "";
let taxData = {};

// Employee Login
function employeeLogin() {
    let name = document.getElementById("employeeName").value;
    let email = document.getElementById("employeeEmail").value;
    let password = document.getElementById("employeePassword").value;

    if (name === "" || email === "" || password === "") {
        alert("Please enter all login details");
        return;
    }

    employeeName = name;

    document.getElementById("welcome").innerText =
        "Welcome, " + name;

    showSection("calculator");
}

// Admin Login
function adminLogin() {
    let username = document.getElementById("adminUsername").value;
    let password = document.getElementById("adminPassword").value;

    if (username === "admin" && password === "admin123") {
        showSection("adminDashboard");
    } else {
        alert("Invalid Admin Login");
    }
}

// Update Tax Settings
function updateSettings() {
    standardDeduction = Number(
        document.getElementById("standardDeduction").value
    );

    maxPension = Number(
        document.getElementById("maxPension").value
    );

    rate1 = Number(document.getElementById("rate1").value);
    rate2 = Number(document.getElementById("rate2").value);
    rate3 = Number(document.getElementById("rate3").value);

    document.getElementById("adminMessage").innerText =
        "Tax settings updated successfully!";
}

// Calculate Tax
function calculateTax() {
    let salary = Number(document.getElementById("salary").value);
    let hra = Number(document.getElementById("hra").value);
    let pension = Number(document.getElementById("pension").value);
    let insurance = Number(document.getElementById("insurance").value);
    let bonus = Number(document.getElementById("bonus").value);
    let otherIncome = Number(document.getElementById("otherIncome").value);

    let grossIncome = (salary * 12) + bonus + otherIncome;

    let pensionDeduction = Math.min(pension * 12, maxPension);

    let taxableIncome = grossIncome -
        (hra * 12) -
        standardDeduction -
        pensionDeduction -
        (insurance * 12);

    if (taxableIncome < 0) {
        taxableIncome = 0;
    }

    let tax = 0;

    if (taxableIncome <= 250000) {
        tax = 0;
    } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * rate1 / 100;
    } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * rate2 / 100;
    } else {
        tax = 112500 + (taxableIncome - 1000000) * rate3 / 100;
    }

    let netIncome = grossIncome - tax;

    taxData = {
        name: employeeName,
        grossIncome: grossIncome,
        taxableIncome: taxableIncome,
        pensionDeduction: pensionDeduction,
        tax: tax,
        netIncome: netIncome
    };

    document.getElementById("taxResult").innerHTML =
        "<h3>Tax Calculation Result</h3>" +
        "<p>Employee Name: " + employeeName + "</p>" +
        "<p>Gross Annual Income: ₹" + grossIncome.toFixed(2) + "</p>" +
        "<p>Pension Deduction: ₹" + pensionDeduction.toFixed(2) + "</p>" +
        "<p>Net Taxable Income: ₹" + taxableIncome.toFixed(2) + "</p>" +
        "<p>Total Tax: ₹" + tax.toFixed(2) + "</p>" +
        "<p>Net Income After Tax: ₹" + netIncome.toFixed(2) + "</p>" +
        "<h3>Tax Saving Tips</h3>" +
        "<p>Consider investing in eligible pension schemes and health insurance.</p>";
}

// Download Report
function downloadReport() {
    if (!taxData.name) {
        alert("Please calculate tax first");
        return;
    }

    let report =
        "INCOME TAX REPORT\n\n" +
        "Employee Name: " + taxData.name + "\n" +
        "Gross Annual Income: ₹" + taxData.grossIncome.toFixed(2) + "\n" +
        "Pension Deduction: ₹" + taxData.pensionDeduction.toFixed(2) + "\n" +
        "Net Taxable Income: ₹" + taxData.taxableIncome.toFixed(2) + "\n" +
        "Total Tax: ₹" + taxData.tax.toFixed(2) + "\n" +
        "Net Income After Tax: ₹" + taxData.netIncome.toFixed(2);

    let file = new Blob([report], { type: "text/plain" });

    let link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "Income_Tax_Report.txt";
    link.click();
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(function(section) {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");
}