// Candidate Details

let candidates = JSON.parse(localStorage.getItem("candidates")) || [
    { name: "Arun Kumar", party: "Progress Party", symbol: "🌅", votes: 0 },
    { name: "Priya Sharma", party: "People's Party", symbol: "🌳", votes: 0 },
    { name: "Rahul Verma", party: "Unity Party", symbol: "⭐", votes: 0 }
];

let loggedIn = false;
let currentVoter = "";
let loginOTP = "";
let votingOTP = "";


// Save Candidates

function saveCandidates() {
    localStorage.setItem("candidates", JSON.stringify(candidates));
}


// Display Candidates

function displayCandidates() {

    let container = document.getElementById("candidateList");
    let dropdown = document.getElementById("voteCandidate");

    container.innerHTML = "";
    dropdown.innerHTML = '<option value="">Select Candidate</option>';

    candidates.forEach(function(candidate, index) {

        container.innerHTML += `
            <div class="candidate-card">
                <div class="candidate-symbol">${candidate.symbol}</div>
                <h3>${candidate.name}</h3>
                <p>${candidate.party}</p>
                <button onclick="selectCandidate(${index})">
                    Vote for Candidate
                </button>
            </div>
        `;

        dropdown.innerHTML += `
            <option value="${index}">${candidate.name}</option>
        `;
    });

    displayResults();
}


// Select Candidate

function selectCandidate(index) {
    document.getElementById("voteCandidate").value = index;
    document.getElementById("vote").scrollIntoView({ behavior: "smooth" });
}


// Login Section

function showLogin() {
    document.getElementById("login").scrollIntoView({ behavior: "smooth" });
}


// Generate Login OTP (demo)

function sendLoginOTP() {

    let voterId = document.getElementById("voterId").value.trim();

    if (!voterId) {
        document.getElementById("loginMessage").innerText =
            "Please enter your Voter ID.";
        return;
    }

    currentVoter = voterId;

    loginOTP = String(Math.floor(1000 + Math.random() * 9000));

    document.getElementById("loginMessage").innerText =
        "Demo OTP: " + loginOTP + " (Use this OTP for verification)";
}


// Verify Login OTP

function verifyLogin() {

    let enteredOTP = document.getElementById("loginOTP").value;

    if (enteredOTP === loginOTP && loginOTP !== "") {

        loggedIn = true;

        document.getElementById("loginMessage").innerText =
            "Login successful! You can now vote.";

    } else {

        document.getElementById("loginMessage").innerText =
            "Invalid OTP. Please try again.";

    }
}


// Generate Voting OTP

function getVoteOTP() {

    if (!loggedIn) {
        document.getElementById("voteMessage").innerText =
            "Please login first.";
        return;
    }

    votingOTP = String(Math.floor(1000 + Math.random() * 9000));

    document.getElementById("voteMessage").innerText =
        "Demo Voting OTP: " + votingOTP;
}


// Cast Vote

function castVote() {

    if (!loggedIn) {
        document.getElementById("voteMessage").innerText =
            "Please login before voting.";
        return;
    }

    let candidateIndex = document.getElementById("voteCandidate").value;
    let enteredOTP = document.getElementById("voteOTP").value;

    if (candidateIndex === "") {
        document.getElementById("voteMessage").innerText =
            "Please select a candidate.";
        return;
    }

    if (enteredOTP !== votingOTP || votingOTP === "") {
        document.getElementById("voteMessage").innerText =
            "Invalid voting OTP.";
        return;
    }

    let votedUsers = JSON.parse(localStorage.getItem("votedUsers")) || [];

    if (votedUsers.includes(currentVoter)) {
        document.getElementById("voteMessage").innerText =
            "You have already voted.";
        return;
    }

    candidates[candidateIndex].votes++;

    votedUsers.push(currentVoter);

    localStorage.setItem("votedUsers", JSON.stringify(votedUsers));

    saveCandidates();

    document.getElementById("voteMessage").innerText =
        "Vote submitted successfully! Thank you for voting.";

    loggedIn = false;
    votingOTP = "";

    document.getElementById("voteOTP").value = "";

    displayCandidates();
    displayHistory();
}


// Add Candidate (Admin Demo)

function addCandidate() {

    let name = document.getElementById("candidateName").value.trim();
    let party = document.getElementById("candidateParty").value.trim();
    let symbol = document.getElementById("candidateSymbol").value.trim();

    if (!name || !party || !symbol) {
        document.getElementById("adminMessage").innerText =
            "Please fill all candidate details.";
        return;
    }

    candidates.push({
        name: name,
        party: party,
        symbol: symbol,
        votes: 0
    });

    saveCandidates();
    displayCandidates();

    document.getElementById("adminMessage").innerText =
        "Candidate added successfully!";

    document.getElementById("candidateName").value = "";
    document.getElementById("candidateParty").value = "";
    document.getElementById("candidateSymbol").value = "";
}


// Display Results

function displayResults() {

    let container = document.getElementById("resultList");

    container.innerHTML = "";

    let totalVotes = candidates.reduce(function(total, candidate) {
        return total + candidate.votes;
    }, 0);

    candidates.forEach(function(candidate) {

        let percentage = totalVotes > 0
            ? (candidate.votes / totalVotes) * 100
            : 0;

        container.innerHTML += `
            <div class="result-card">
                <h3>${candidate.symbol} ${candidate.name}</h3>
                <p>${candidate.party}</p>
                <p>Votes: ${candidate.votes}</p>

                <div class="progress">
                    <div class="progress-bar"
                        style="width: ${percentage}%"></div>
                </div>

                <p>${percentage.toFixed(1)}%</p>
            </div>
        `;
    });
}


// Voting History / Status

function displayHistory() {

    let votedUsers = JSON.parse(localStorage.getItem("votedUsers")) || [];
    let container = document.getElementById("history");

    container.innerHTML = `
        <p>Total voters who voted: ${votedUsers.length}</p>
        <p>Your voting status is recorded in this browser demo.</p>
    `;
}


// Initial Display

displayCandidates();
displayHistory();