let users = JSON.parse(localStorage.getItem("jpUsers")) || [];
let jobs = JSON.parse(localStorage.getItem("jpJobs")) || [
    {
        id: 1,
        title: "Software Developer",
        company: "Tech Solutions",
        location: "Chennai",
        category: "IT",
        salary: "₹5-8 LPA",
        description: "Develop and maintain web applications."
    },
    {
        id: 2,
        title: "Frontend Developer",
        company: "Creative Web",
        location: "Bangalore",
        category: "IT",
        salary: "₹4-7 LPA",
        description: "Build responsive websites using HTML, CSS and JavaScript."
    },
    {
        id: 3,
        title: "Marketing Executive",
        company: "Growth Agency",
        location: "Hyderabad",
        category: "Marketing",
        salary: "₹3-5 LPA",
        description: "Manage marketing campaigns and customer engagement."
    },
    {
        id: 4,
        title: "HR Assistant",
        company: "People First",
        location: "Chennai",
        category: "HR",
        salary: "₹3-4 LPA",
        description: "Assist with recruitment and employee management."
    },
    {
        id: 5,
        title: "Financial Analyst",
        company: "Finance Hub",
        location: "Mumbai",
        category: "Finance",
        salary: "₹4-6 LPA",
        description: "Analyze financial data and prepare reports."
    }
];

let applications = JSON.parse(localStorage.getItem("jpApplications")) || [];
let savedJobs = JSON.parse(localStorage.getItem("jpSavedJobs")) || [];
let currentUser = JSON.parse(localStorage.getItem("jpCurrentUser")) || null;

let directorsApproved = JSON.parse(localStorage.getItem("jpApproved")) || [];

function saveData() {
    localStorage.setItem("jpUsers", JSON.stringify(users));
    localStorage.setItem("jpJobs", JSON.stringify(jobs));
    localStorage.setItem("jpApplications", JSON.stringify(applications));
    localStorage.setItem("jpSavedJobs", JSON.stringify(savedJobs));
    localStorage.setItem("jpCurrentUser", JSON.stringify(currentUser));
    localStorage.setItem("jpApproved", JSON.stringify(directorsApproved));
}

function showAuth() {
    document.getElementById("auth").scrollIntoView({behavior: "smooth"});
}

function register() {
    let name = document.getElementById("authName").value;
    let email = document.getElementById("authEmail").value;
    let phone = document.getElementById("authPhone").value;
    let address = document.getElementById("authAddress").value;
    let password = document.getElementById("authPassword").value;
    let role = document.getElementById("authRole").value;

    if (!name || !email || !phone || !address || !password) {
        alert("Please fill all fields.");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("Email already registered.");
        return;
    }

    let user = {
        name, email, phone, address, password, role,
        approved: role !== "director"
    };

    users.push(user);

    if (role === "director") {
        directorsApproved.push(email);
    }

    saveData();
    alert("Registration successful!");
}

function login() {
    let email = document.getElementById("authEmail").value;
    let password = document.getElementById("authPassword").value;

    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    if (user.role === "director" && !user.approved) {
        alert("Your director account is waiting for admin approval.");
        return;
    }

    currentUser = user;
    saveData();

    document.getElementById("auth").style.display = "none";

    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("director-dashboard").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "none";

    if (user.role === "user") {
        document.getElementById("user-dashboard").style.display = "block";
    } else if (user.role === "director") {
        document.getElementById("director-dashboard").style.display = "block";
    } else {
        document.getElementById("admin-dashboard").style.display = "block";
    }

    alert("Welcome " + user.name);
}

function logout() {
    currentUser = null;
    saveData();

    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("director-dashboard").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "none";
    document.getElementById("auth").style.display = "block";

    alert("Logged out.");
}

// DISPLAY JOBS

function displayJobs(list = jobs) {
    document.getElementById("job-list").innerHTML = list.map(j => `
        <div class="job-card">
            <h3>${j.title}</h3>
            <p>🏢 ${j.company}</p>
            <p>📍 ${j.location}</p>
            <p>📂 ${j.category}</p>
            <p>💰 ${j.salary}</p>
            <p>${j.description}</p>
            <button onclick="applyJob(${j.id})">Apply Now</button>
            <button onclick="saveJob(${j.id})">Save Job</button>
        </div>
    `).join("") || "No vacancies found.";
}

function searchJobs() {
    let text = document.getElementById("searchText").value.toLowerCase();
    let location = document.getElementById("searchLocation").value.toLowerCase();
    let category = document.getElementById("searchCategory").value;

    let filtered = jobs.filter(j =>
        (j.title.toLowerCase().includes(text) ||
         j.company.toLowerCase().includes(text) ||
         text === "") &&
        (j.location.toLowerCase().includes(location) || location === "") &&
        (j.category === category || category === "All")
    );

    displayJobs(filtered);
}

// USER FUNCTIONS

function applyJob(id) {
    if (!currentUser || currentUser.role !== "user") {
        alert("Please login as a user to apply.");
        showAuth();
        return;
    }

    if (applications.some(a => a.jobId === id && a.userEmail === currentUser.email)) {
        alert("You already applied for this job.");
        return;
    }

    let job = jobs.find(j => j.id === id);

    applications.push({
        id: Date.now(),
        jobId: id,
        jobTitle: job.title,
        company: job.company,
        userEmail: currentUser.email,
        userName: currentUser.name,
        phone: currentUser.phone,
        status: "Applied"
    });

    saveData();
    alert("Application submitted successfully!");
}

function saveJob(id) {
    if (!currentUser || currentUser.role !== "user") {
        alert("Please login as a user.");
        showAuth();
        return;
    }

    let alreadySaved = savedJobs.some(s =>
        s.jobId === id && s.userEmail === currentUser.email
    );

    if (alreadySaved) {
        alert("Job already saved.");
        return;
    }

    savedJobs.push({jobId: id, userEmail: currentUser.email});
    saveData();
    alert("Job saved successfully!");
}

function showMyApplications() {
    let myApps = applications.filter(a => a.userEmail === currentUser.email);

    document.getElementById("user-content").innerHTML = `
        <h3>My Applications</h3>
        ${myApps.map(a => `
            <div class="application-card">
                <h4>${a.jobTitle}</h4>
                <p>Company: ${a.company}</p>
                <p>Status: ${a.status}</p>
            </div>
        `).join("") || "No applications submitted."}
    `;
}

function showSavedJobs() {
    let list = savedJobs.filter(s => s.userEmail === currentUser.email);

    document.getElementById("user-content").innerHTML = `
        <h3>Saved Jobs</h3>
        ${list.map(s => {
            let job = jobs.find(j => j.id === s.jobId);
            if (!job) return "";
            return `
                <div class="application-card">
                    <h4>${job.title}</h4>
                    <p>${job.company}</p>
                    <p>${job.location}</p>
                    <button onclick="applyJob(${job.id})">Apply</button>
                </div>
            `;
        }).join("") || "No saved jobs."}
    `;
}

// DIRECTOR FUNCTIONS

function showPostJob() {
    document.getElementById("director-content").innerHTML = `
        <div class="application-card">
            <h3>Post New Vacancy</h3>
            <input id="jobTitle" placeholder="Job Title">
            <input id="company" placeholder="Company Name">
            <input id="jobLocation" placeholder="Location">
            <select id="jobCategory">
                <option>IT</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>HR</option>
                <option>Engineering</option>
                <option>Healthcare</option>
            </select>
            <input id="jobSalary" placeholder="Salary">
            <textarea id="jobDescription" placeholder="Job Description"></textarea>
            <input id="jobContact" placeholder="Contact Information">
            <button onclick="postJob()">Post Vacancy</button>
        </div>
    `;
}

function postJob() {
    let title = document.getElementById("jobTitle").value;
    let company = document.getElementById("company").value;
    let location = document.getElementById("jobLocation").value;
    let category = document.getElementById("jobCategory").value;
    let salary = document.getElementById("jobSalary").value;
    let description = document.getElementById("jobDescription").value;
    let contact = document.getElementById("jobContact").value;

    if (!title || !company || !location || !salary || !description || !contact) {
        alert("Please fill all fields.");
        return;
    }

    jobs.push({
        id: Date.now(),
        title, company, location, category, salary, description, contact,
        directorEmail: currentUser.email
    });

    saveData();
    displayJobs();

    alert("Vacancy posted successfully!");
    showDirectorJobs();
}

function showDirectorJobs() {
    let myJobs = jobs.filter(j => j.directorEmail === currentUser.email);

    document.getElementById("director-content").innerHTML = `
        <h3>My Vacancies</h3>
        ${myJobs.map(j => `
            <div class="application-card">
                <h4>${j.title}</h4>
                <p>Company: ${j.company}</p>
                <p>Location: ${j.location}</p>
                <p>Salary: ${j.salary}</p>
            </div>
        `).join("") || "No vacancies posted."}
    `;
}

function showApplicants() {
    let myJobs = jobs.filter(j => j.directorEmail === currentUser.email);
    let myJobIds = myJobs.map(j => j.id);

    let applicants = applications.filter(a => myJobIds.includes(a.jobId));

    document.getElementById("director-content").innerHTML = `
        <h3>Applied Users</h3>
        ${applicants.map(a => `
            <div class="application-card">
                <h4>${a.userName}</h4>
                <p>Job: ${a.jobTitle}</p>
                <p>Email: ${a.userEmail}</p>
                <p>Phone: ${a.phone}</p>
                <p>Status: ${a.status}</p>
                <button onclick="selectApplicant(${a.id})">Select Candidate</button>
            </div>
        `).join("") || "No applicants yet."}
    `;
}

function selectApplicant(id) {
    let applicant = applications.find(a => a.id === id);
    applicant.status = "Selected";
    saveData();
    showApplicants();
    alert("Candidate selected!");
}

// ADMIN FUNCTIONS

function approveDirectors() {
    let pending = users.filter(u => u.role === "director" && !u.approved);

    document.getElementById("admin-content").innerHTML = `
        <h3>Approve Directors</h3>
        ${pending.map(d => `
            <div class="application-card">
                <h4>${d.name}</h4>
                <p>Email: ${d.email}</p>
                <p>Company Address: ${d.address}</p>
                <button onclick="approveDirector('${d.email}')">Approve</button>
            </div>
        `).join("") || "No pending directors."}
    `;
}

function approveDirector(email) {
    let director = users.find(u => u.email === email);
    director.approved = true;
    saveData();
    approveDirectors();
    alert("Director approved!");
}

function viewUsers() {
    document.getElementById("admin-content").innerHTML = `
        <h3>Registered Users</h3>
        ${users.map(u => `
            <div class="application-card">
                <p>Name: ${u.name}</p>
                <p>Email: ${u.email}</p>
                <p>Role: ${u.role}</p>
            </div>
        `).join("") || "No users registered."}
    `;
}

function viewReports() {
    document.getElementById("admin-content").innerHTML = `
        <h3>Job Portal Reports</h3>
        <div class="application-card">
            <p>Total Users: ${users.filter(u => u.role === "user").length}</p>
            <p>Total Directors: ${users.filter(u => u.role === "director").length}</p>
            <p>Total Vacancies: ${jobs.length}</p>
            <p>Total Applications: ${applications.length}</p>
            <p>Selected Candidates: ${applications.filter(a => a.status === "Selected").length}</p>
        </div>
    `;
}

// PROFILE

function showProfile() {
    let content = `
        <div class="application-card">
            <h3>My Profile</h3>
            <p>Name: ${currentUser.name}</p>
            <p>Email: ${currentUser.email}</p>
            <p>Phone: ${currentUser.phone}</p>
            <p>Address: ${currentUser.address}</p>
            <p>Role: ${currentUser.role}</p>
        </div>
    `;

    if (currentUser.role === "user") {
        document.getElementById("user-content").innerHTML = content;
    } else if (currentUser.role === "director") {
        document.getElementById("director-content").innerHTML = content;
    } else {
        document.getElementById("admin-content").innerHTML = content;
    }
}

displayJobs();