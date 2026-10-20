document.addEventListener("DOMContentLoaded", function () {
    const $ = selector => document.querySelector(selector);

    function read(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || "[]");
        } catch {
            return [];
        }
    }

    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function show(id, text) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }

    function money(amount) {
        return "₹" + Number(amount).toLocaleString("en-IN");
    }

    function makeRow(container, text, buttonText, callback) {
        const row = document.createElement("div");
        const details = document.createElement("p");
        details.textContent = text;
        row.appendChild(details);

        if (buttonText && callback) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = buttonText;
            button.addEventListener("click", callback);
            row.appendChild(button);
        }

        container.appendChild(row);
    }

    const policyCards = [...document.querySelectorAll(".policy-card")];

    function policyName(card) {
        return card.querySelector("h3").textContent;
    }

    function getPolicy(name) {
        return policyCards.find(card => policyName(card) === name);
    }

    function updateStats() {
        $("#policyCount").textContent = policyCards.length;
        $("#myPolicyCount").textContent = read("iePolicies").length;
        $("#claimCount").textContent =
            read("ieClaims").filter(claim => claim.status === "Pending").length;
        $("#customerCount").textContent = read("ieUsers").length;
    }

    // 1. POLICY SEARCH AND SORT
    function filterPolicies() {
        const search = $("#policySearch").value.trim().toLowerCase();
        const type = $("#policyType").value;
        const sort = $("#policySort").value;

        let cards = [...policyCards];

        cards.forEach(card => {
            const matchesText = card.textContent.toLowerCase().includes(search);
            const matchesType = !type || card.dataset.type === type;
            card.hidden = !(matchesText && matchesType);
        });

        if (sort !== "default") {
            cards.sort((a, b) => {
                const first = Number(a.dataset.premium);
                const second = Number(b.dataset.premium);
                return sort === "low" ? first - second : second - first;
            });

            cards.forEach(card => $("#policyList").appendChild(card));
        }
    }

    $("#policySearch").addEventListener("input", filterPolicies);
    $("#policyType").addEventListener("change", filterPolicies);
    $("#policySort").addEventListener("change", filterPolicies);

    // 2. POLICY COMPARISON
    function renderComparison() {
        const container = $("#comparisonList");
        container.replaceChildren();

        const selected = read("ieCompare");

        if (!selected.length) {
            container.textContent = "Select policies above to compare them.";
            return;
        }

        selected.forEach(name => {
            const card = getPolicy(name);
            if (!card) return;

            const item = document.createElement("div");
            item.className = "comparison-item";

            const details = document.createElement("p");
            details.textContent =
                name + " | Type: " + card.dataset.type +
                " | Annual Premium: " + money(card.dataset.premium) +
                " | " + card.querySelector(".cover").textContent.trim();

            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "Remove";

            remove.addEventListener("click", function () {
                write("ieCompare", read("ieCompare").filter(n => n !== name));
                renderComparison();
            });

            item.append(details, remove);
            container.appendChild(item);
        });
    }

    document.querySelectorAll(".compareBtn").forEach(button => {
        button.addEventListener("click", function () {
            const name = policyName(this.closest(".policy-card"));
            const selected = read("ieCompare");

            if (selected.includes(name)) {
                show("policyMessage", "This policy is already selected for comparison.");
                return;
            }

            if (selected.length >= 3) {
                show("policyMessage", "Compare up to three policies at a time.");
                return;
            }

            selected.push(name);
            write("ieCompare", selected);
            renderComparison();
            show("policyMessage", name + " added to comparison.");
        });
    });

    $("#clearCompareBtn").addEventListener("click", function () {
        write("ieCompare", []);
        renderComparison();
        show("policyMessage", "Comparison cleared.");
    });

    // 3. CUSTOMER REGISTRATION
    $("#registerBtn").addEventListener("click", function () {
        const name = $("#customerName").value.trim();
        const email = $("#customerEmail").value.trim().toLowerCase();
        const password = $("#customerPassword").value;

        if (!name || !email || !password) {
            show("registerMessage", "Please complete all registration fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            show("registerMessage", "Enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            show("registerMessage", "Password must have at least 6 characters.");
            return;
        }

        const users = read("ieUsers");

        if (users.some(user => user.email === email)) {
            show("registerMessage", "This email is already registered.");
            return;
        }

        // Demo account: password is not stored in browser storage.
        users.push({ name, email, role: "Customer" });
        write("ieUsers", users);

        show(
            "registerMessage",
            "Demo account created. Real password authentication requires a secure backend."
        );

        updateStats();
        renderAdmin();
    });

    // 4. CUSTOMER LOGIN DEMO
    $("#loginBtn").addEventListener("click", function () {
        const email = $("#loginEmail").value.trim().toLowerCase();
        const password = $("#loginPassword").value;

        if (!email || !password) {
            show("loginMessage", "Enter your email and password.");
            return;
        }

        const user = read("ieUsers").find(item => item.email === email);

        if (!user) {
            show("loginMessage", "Customer not found. Please register first.");
            return;
        }

        // Demonstration only: no password is verified.
        sessionStorage.setItem("ieCurrentUser", email);
        show("loginMessage", "Demo login successful.");
        updateCurrentUser();
    });

    $("#logoutBtn").addEventListener("click", function () {
        sessionStorage.removeItem("ieCurrentUser");
        show("loginMessage", "You have logged out.");
        updateCurrentUser();
    });

    function updateCurrentUser() {
        const email = sessionStorage.getItem("ieCurrentUser");
        const user = read("ieUsers").find(item => item.email === email);

        show(
            "currentUser",
            user ? "Logged in as: " + user.name : "You are browsing as a guest."
        );
    }

    // 5. APPLY FOR A POLICY
    document.querySelectorAll(".applyBtn").forEach(button => {
        button.addEventListener("click", function () {
            const email = sessionStorage.getItem("ieCurrentUser");
            const user = read("ieUsers").find(item => item.email === email);

            if (!user) {
                show("policyMessage", "Please register and log in before applying.");
                $("#accounts").scrollIntoView({ behavior: "smooth" });
                return;
            }

            const card = this.closest(".policy-card");
            const name = policyName(card);
            const policies = read("iePolicies");

            if (policies.some(p => p.email === email && p.name === name)) {
                show("policyMessage", "You already have this policy in your dashboard.");
                return;
            }

            const renewal = new Date();
            renewal.setFullYear(renewal.getFullYear() + 1);

            policies.push({
                id: Date.now(),
                email,
                name,
                type: card.dataset.type,
                premium: Number(card.dataset.premium),
                renewalDate: renewal.toISOString().slice(0, 10),
                status: "Active",
                paid: false
            });

            write("iePolicies", policies);
            renderMyPolicies();
            updateStats();
            renderAdmin();

            show("policyMessage", "Demo policy application recorded.");
        });
    });

    // 6. CUSTOMER POLICY DASHBOARD
    function renderMyPolicies() {
        const tbody = $("#myPolicies");
        tbody.replaceChildren();

        const email = sessionStorage.getItem("ieCurrentUser");
        const policies = read("iePolicies").filter(p => p.email === email);

        if (!policies.length) {
            const row = tbody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.textContent = "Log in and apply for a policy to see it here.";
            return;
        }

        policies.forEach(policy => {
            const row = tbody.insertRow();

            [policy.name, money(policy.premium), policy.renewalDate, policy.status]
                .forEach(value => {
                    const cell = row.insertCell();
                    cell.textContent = value;
                });

            const actionCell = row.insertCell();
            const payButton = document.createElement("button");
            payButton.type = "button";
            payButton.textContent = policy.paid ? "Paid (Demo)" : "Mark as Paid";

            payButton.disabled = policy.paid;

            payButton.addEventListener("click", function () {
                const allPolicies = read("iePolicies");
                const target = allPolicies.find(p => p.id === policy.id);

                if (!target) return;

                target.paid = true;
                write("iePolicies", allPolicies);

                renderMyPolicies();
                renderAdmin();

                show(
                    "dashboardMessage",
                    "Demo payment status updated. No real money was collected."
                );
            });

            actionCell.appendChild(payButton);
        });
    }

    // 7. AGENT REGISTRATION
    $("#agentRegisterBtn").addEventListener("click", function () {
        const name = $("#agentName").value.trim();
        const email = $("#agentEmail").value.trim().toLowerCase();
        const password = $("#agentPassword").value;

        if (!name || !email || !password) {
            show("agentRegisterMessage", "Complete all agent registration fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
            show("agentRegisterMessage", "Enter a valid email and a password of at least 6 characters.");
            return;
        }

        const agents = read("ieAgents");

        if (agents.some(agent => agent.email === email)) {
            show("agentRegisterMessage", "This agent email is already registered.");
            return;
        }

        agents.push({
            id: Date.now(),
            name,
            email,
            status: "Pending Approval"
        });

        write("ieAgents", agents);
        show("agentRegisterMessage", "Agent registration submitted for admin approval.");
        renderAdmin();
    });

    // 8. AGENT CUSTOMER RECORDS
    $("#addCustomerBtn").addEventListener("click", function () {
        const name = $("#managedCustomerName").value.trim();
        const email = $("#managedCustomerEmail").value.trim().toLowerCase();

        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            show("managedCustomerMessage", "Enter a customer name and valid email.");
            return;
        }

        const records = read("ieManagedCustomers");

        records.push({
            id: Date.now(),
            name,
            email,
            createdBy: sessionStorage.getItem("ieCurrentUser") || "Demo Agent"
        });

        write("ieManagedCustomers", records);
        $("#managedCustomerName").value = "";
        $("#managedCustomerEmail").value = "";

        show("managedCustomerMessage", "Customer record added.");
        renderManagedCustomers();
        renderAdmin();
    });

    function renderManagedCustomers() {
        const container = $("#managedCustomerList");
        container.replaceChildren();

        const records = read("ieManagedCustomers");

        if (!records.length) {
            container.textContent = "No agent customer records yet.";
            return;
        }

        records.forEach(customer => {
            makeRow(
                container,
                customer.name + " | " + customer.email,
                "Delete",
                function () {
                    write(
                        "ieManagedCustomers",
                        read("ieManagedCustomers").filter(c => c.id !== customer.id)
                    );
                    renderManagedCustomers();
                    renderAdmin();
                }
            );
        });
    }

    // 9. CLAIMS
    function renderClaimOptions() {
        const select = $("#claimPolicy");
        const previousValue = select.value;
        select.replaceChildren();

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Choose a policy";
        select.appendChild(placeholder);

        const email = sessionStorage.getItem("ieCurrentUser");

        read("iePolicies")
            .filter(policy => policy.email === email)
            .forEach(policy => {
                const option = document.createElement("option");
                option.value = String(policy.id);
                option.textContent = policy.name;
                select.appendChild(option);
            });

        select.value = previousValue;
    }

    $("#fileClaimBtn").addEventListener("click", function () {
        const email = sessionStorage.getItem("ieCurrentUser");
        const policyId = Number($("#claimPolicy").value);
        const description = $("#claimDescription").value.trim();

        if (!email) {
            show("claimMessage", "Please log in before submitting a claim.");
            return;
        }

        const policy = read("iePolicies").find(p =>
            p.id === policyId && p.email === email
        );

        if (!policy || !description) {
            show("claimMessage", "Select one of your policies and describe the claim.");
            return;
        }

        const claims = read("ieClaims");

        claims.push({
            id: Date.now(),
            email,
            policyName: policy.name,
            description,
            status: "Pending"
        });

        write("ieClaims", claims);
        $("#claimDescription").value = "";

        show("claimMessage", "Demo claim submitted for review.");
        renderClaims();
        updateStats();
        renderAdmin();
    });

    function renderClaims() {
        const container = $("#claimList");
        container.replaceChildren();

        const email = sessionStorage.getItem("ieCurrentUser");
        const claims = read("ieClaims").filter(c => c.email === email);

        if (!claims.length) {
            container.textContent = "No claims submitted.";
            return;
        }

        claims.forEach(claim => {
            makeRow(
                container,
                claim.policyName + " | " + claim.description +
                " | Status: " + claim.status,
                null,
                null
            );
        });
    }

    // 10. RENEWAL REMINDERS
    $("#checkRemindersBtn").addEventListener("click", function () {
        const email = sessionStorage.getItem("ieCurrentUser");
        const container = $("#reminderList");
        container.replaceChildren();

        if (!email) {
            container.textContent = "Log in to view your policy reminders.";
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const policies = read("iePolicies").filter(p => p.email === email);

        if (!policies.length) {
            container.textContent = "You do not have any policies yet.";
            return;
        }

        policies.forEach(policy => {
            const renewalDate = new Date(policy.renewalDate + "T00:00:00");
            const days = Math.ceil((renewalDate - today) / 86400000);

            let reminder;

            if (policy.paid) {
                reminder = "Payment marked as paid in this demo.";
            } else if (days < 0) {
                reminder = "Renewal date has passed. Contact your insurer.";
            } else if (days <= 30) {
                reminder = "Renewal is due in " + days + " day(s).";
            } else {
                reminder = "Renewal is upcoming on " + policy.renewalDate + ".";
            }

            makeRow(
                container,
                policy.name + " — " + reminder,
                null,
                null
            );
        });
    });

    // 11. ADMIN LOGIN AND AGENT APPROVAL
    // Demonstration credentials only. Never use these credentials in a real system.
    const DEMO_ADMIN_USERNAME = "admin";
    const DEMO_ADMIN_PASSWORD = "Admin123";

    $("#adminLoginBtn").addEventListener("click", function () {
        const username = $("#adminUsername").value;
        const password = $("#adminPassword").value;

        if (username === DEMO_ADMIN_USERNAME &&
            password === DEMO_ADMIN_PASSWORD) {
            sessionStorage.setItem("ieAdminLoggedIn", "true");
            $("#adminPanel").hidden = false;
            show("adminMessage", "Demo admin login successful.");
            renderAdmin();
        } else {
            show("adminMessage", "Invalid demo admin credentials.");
        }
    });

    $("#adminLogoutBtn").addEventListener("click", function () {
        sessionStorage.removeItem("ieAdminLoggedIn");
        $("#adminPanel").hidden = true;
        show("adminMessage", "Admin logged out.");
    });

    function renderAdmin() {
        if (sessionStorage.getItem("ieAdminLoggedIn") !== "true") return;

        $("#adminPanel").hidden = false;

        const approvalContainer = $("#agentApprovalList");
        const agentsContainer = $("#allAgentsList");
        const customersContainer = $("#allCustomersList");
        const policiesContainer = $("#allPoliciesList");

        approvalContainer.replaceChildren();
        agentsContainer.replaceChildren();
        customersContainer.replaceChildren();
        policiesContainer.replaceChildren();

        const agents = read("ieAgents");

        if (!agents.length) {
            approvalContainer.textContent = "No agent registrations.";
        }

        agents.forEach(agent => {
            makeRow(
                approvalContainer,
                agent.name + " | " + agent.email + " | " + agent.status,
                agent.status === "Approved" ? null : "Approve Agent",
                agent.status === "Approved" ? null : function () {
                    const updated = read("ieAgents");
                    const target = updated.find(a => a.id === agent.id);

                    if (target) target.status = "Approved";

                    write("ieAgents", updated);
                    renderAdmin();
                }
            );

            makeRow(
                agentsContainer,
                agent.name + " | " + agent.email + " | " + agent.status,
                null,
                null
            );
        });

        const users = read("ieUsers");

        if (!users.length) {
            customersContainer.textContent = "No registered customers.";
        }

        users.forEach(user => {
            makeRow(
                customersContainer,
                user.name + " | " + user.email,
                null,
                null
            );
        });

        const policies = read("iePolicies");

        if (!policies.length) {
            policiesContainer.textContent = "No policies issued.";
        }

        policies.forEach(policy => {
            makeRow(
                policiesContainer,
                policy.name + " | " + policy.email +
                " | " + money(policy.premium) +
                " | Payment: " + (policy.paid ? "Paid (Demo)" : "Pending"),
                null,
                null
            );
        });

        // Illustrative commission estimate, not a real payable amount.
        const commission = policies.reduce(
            (total, policy) => total + policy.premium * 0.05,
            0
        );

        show(
            "commissionSummary",
            "Illustrative 5% commission on recorded premiums: " + money(commission)
        );
    }

    // INITIALIZE
    function initialize() {
        renderComparison();
        renderMyPolicies();
        renderClaimOptions();
        renderClaims();
        renderManagedCustomers();
        updateStats();
        updateCurrentUser();

        if (sessionStorage.getItem("ieAdminLoggedIn") === "true") {
            $("#adminPanel").hidden = false;
            renderAdmin();
        }
    }

    initialize();

    // Refresh policy-dependent displays after applying a policy.
    document.querySelectorAll(".applyBtn").forEach(button => {
        button.addEventListener("click", function () {
            renderClaimOptions();
        });
    });
});