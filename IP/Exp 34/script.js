// Student Registration
document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("studentName").value;
    let subject = document.getElementById("studentSubject").value;
    let mode = document.getElementById("tuitionMode").value;

    alert("Student Registered Successfully!\nName: " + name +
          "\nSubject: " + subject + "\nMode: " + mode);

    this.reset();
});

// Teacher Registration
document.getElementById("teacherForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("teacherName").value;
    let subject = document.getElementById("teacherSubject").value;

    alert("Teacher Registered Successfully!\nName: " + name +
          "\nSubject: " + subject);

    this.reset();
});

// Teacher Login
document.getElementById("teacherLoginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Teacher Login Successful!");
    this.reset();
});

// Fees Submission
document.getElementById("feeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("feeStudent").value;
    let amount = document.getElementById("feeAmount").value;
    let subject = document.getElementById("feeSubject").value;
    let date = document.getElementById("feeDate").value;

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        <td>${subject}</td>
        <td>₹${amount}</td>
        <td>${date}</td>
    `;

    document.getElementById("feeTable").appendChild(row);

    alert("Fees details saved successfully!");
    this.reset();
});

// Monthly and Yearly Report
function generateReport(type) {
    let rows = document.querySelectorAll("#feeTable tr");
    let total = 0;

    rows.forEach(function(row) {
        let amount = row.cells[2].innerText.replace("₹", "");
        total += Number(amount);
    });

    document.getElementById("reportResult").innerHTML = `
        <div class="card">
            <h3>${type} Fees Report</h3>
            <p>Total Students' Fee Records: ${rows.length}</p>
            <p>Total Fees Collected: ₹${total}</p>
        </div>
    `;

    alert(type + " Report Generated!");
}

// Student Feedback
document.getElementById("feedbackForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("feedbackName").value;
    let rating = document.getElementById("rating").value;
    let message = document.getElementById("feedbackMessage").value;

    document.getElementById("feedbackResult").innerHTML = `
        <div class="card">
            <h3>Feedback Submitted</h3>
            <p>Student: ${name}</p>
            <p>Rating: ${rating}</p>
            <p>${message}</p>
        </div>
    `;

    alert("Thank you for your feedback!");
    this.reset();
});

// Admin Registration
document.getElementById("adminForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("adminName").value;
    let email = document.getElementById("adminEmail").value;

    alert("Admin Registered Successfully!\nName: " + name +
          "\nEmail: " + email);

    this.reset();
});

// Admin Login
document.getElementById("adminLoginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Admin Login Successful!");
    this.reset();
});

// Contact Form
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Your message has been sent successfully!");
    this.reset();
});