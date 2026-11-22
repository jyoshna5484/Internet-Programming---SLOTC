let candidateAllowed = false;
let examScheduled = false;
let resultsPublished = false;

let currentCandidate = "";

let examDate = "";

let scores = [];

let questions = [];

// Candidate Login
function candidateLogin() {
    let name = document.getElementById("candidateName").value;
    let password = document.getElementById("candidatePassword").value;

    if (name === "" || password === "") {
        alert("Please enter username and password");
        return;
    }

    if (!candidateAllowed) {
        alert("Candidate login is not enabled by Admin");
        return;
    }

    currentCandidate = name;

    document.getElementById("welcomeMessage").innerText =
        "Welcome, " + name;

    document.getElementById("examSchedule").innerText =
        "Scheduled Date: " + examDate;

    showSection("dashboard");
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

// Enable Candidate
function enableCandidate() {
    candidateAllowed = true;
    document.getElementById("adminMessage").innerText =
        "Candidate Login has been enabled";
}

// Schedule Exam
function scheduleExam() {
    examDate = document.getElementById("scheduleDate").value;

    if (examDate === "") {
        alert("Please select exam date and time");
        return;
    }

    examScheduled = true;

    document.getElementById("adminMessage").innerText =
        "Exam scheduled successfully for " + examDate;
}

// Load Question
function loadQuestion() {
    let question = document.getElementById("newQuestion").value;

    if (question === "") {
        alert("Please enter a question");
        return;
    }

    questions.push(question);

    document.getElementById("adminMessage").innerText =
        "Question loaded successfully";
}

// Start Exam
function startExam() {
    if (!examScheduled) {
        alert("Exam has not been scheduled");
        return;
    }

    let currentTime = new Date();
    let scheduledTime = new Date(examDate);

    if (currentTime < scheduledTime) {
        alert("Exam will start at the scheduled time");
        return;
    }

    showSection("exam");
}

// Submit Exam
function submitExam() {
    let answers = {
        q1: "CSS",
        q2: "Queue",
        q3: "def",
        q4: "SELECT",
        q5: "Linux"
    };

    let score = 0;

    for (let key in answers) {
        let selected = document.querySelector(
            'input[name="' + key + '"]:checked'
        );

        if (selected && selected.value === answers[key]) {
            score++;
        }
    }

    let status = score >= 3 ? "Pass" : "Fail";

    scores.push({
        name: currentCandidate,
        score: score,
        status: status
    });

    alert("Exam submitted successfully!");

    document.getElementById("resultDisplay").innerHTML =
        "<h3>Candidate: " + currentCandidate + "</h3>" +
        "<p>Score: " + score + " / 5</p>" +
        "<p>Status: " + status + "</p>";

    showSection("results");
}

// Publish Results
function publishResult() {
    resultsPublished = true;
    document.getElementById("adminMessage").innerText =
        "Results published successfully";
}

// Show Ranking
function showLeaderboard() {
    if (!resultsPublished) {
        alert("Results are not published yet");
        return;
    }

    scores.sort(function(a, b) {
        return b.score - a.score;
    });

    let output = "<h3>Student Rankings</h3>";

    output += "<table><tr><th>Rank</th><th>Name</th>" +
              "<th>Score</th><th>Status</th></tr>";

    for (let i = 0; i < scores.length; i++) {
        output += "<tr>";
        output += "<td>" + (i + 1) + "</td>";
        output += "<td>" + scores[i].name + "</td>";
        output += "<td>" + scores[i].score + "</td>";
        output += "<td>" + scores[i].status + "</td>";
        output += "</tr>";
    }

    output += "</table>";

    document.getElementById("leaderboard").innerHTML = output;
}

// Download Scorecard
function downloadScorecard() {
    if (scores.length === 0) {
        alert("No scorecard available");
        return;
    }

    let candidate = scores[scores.length - 1];

    let text =
        "Placement Examination Scorecard\n" +
        "Candidate: " + candidate.name + "\n" +
        "Score: " + candidate.score + "/5\n" +
        "Status: " + candidate.status;

    let file = new Blob([text], { type: "text/plain" });

    let link = document.createElement("a");

    link.href = URL.createObjectURL(file);
    link.download = "scorecard.txt";

    link.click();
}

// Re-evaluation
function applyRevaluation() {
    alert("Re-evaluation request submitted successfully");
}

// Section Navigation
function showSection(sectionId) {
    let sections = document.querySelectorAll("section");

    sections.forEach(function(section) {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");
}