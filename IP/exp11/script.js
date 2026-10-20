document.addEventListener("DOMContentLoaded", function () {

    const $ = selector => document.querySelector(selector);

    const read = key => {
        try {
            return JSON.parse(localStorage.getItem(key) || "[]");
        } catch {
            return [];
        }
    };

    const write = (key, value) =>
        localStorage.setItem(key, JSON.stringify(value));

    function message(id, text) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }

    const properties = [...document.querySelectorAll(".property-card")];

    function getCriteria() {
        return {
            location: $("#location").value.trim(),
            type: $("#propertyType").value,
            min: $("#minPrice").value,
            max: $("#maxPrice").value,
            bedrooms: $("#bedrooms").value
        };
    }

    function applyCriteria(criteria) {
        $("#location").value = criteria.location || "";
        $("#propertyType").value = criteria.type || "";
        $("#minPrice").value = criteria.min || "";
        $("#maxPrice").value = criteria.max || "";
        $("#bedrooms").value = criteria.bedrooms || "";
        searchProperties();
    }

    // 1. PROPERTY SEARCH
    function searchProperties() {
        const criteria = getCriteria();
        const min = Number(criteria.min) || 0;
        const max = Number(criteria.max) || Infinity;

        if (min < 0 || max < 0 || min > max) {
            message("searchMessage", "Please enter a valid budget range.");
            return;
        }

        let count = 0;

        properties.forEach(card => {
            const location = card.dataset.location.toLowerCase();
            const price = Number(card.dataset.price);
            const type = card.dataset.type;
            const bedrooms = Number(card.dataset.bedrooms);

            const matches =
                (!criteria.location ||
                    location.includes(criteria.location.toLowerCase())) &&
                (!criteria.type || type === criteria.type) &&
                price >= min &&
                price <= max &&
                (!criteria.bedrooms ||
                    bedrooms >= Number(criteria.bedrooms));

            card.hidden = !matches;

            if (matches) count++;
        });

        message("resultCount", count + " property/properties found.");
        message("searchMessage", "Search completed successfully.");

        $("#properties").scrollIntoView({ behavior: "smooth" });

        // Record the search for this browser
        const searches = read("hfSearchRecords");
        searches.push({
            criteria: criteria,
            date: new Date().toLocaleString()
        });
        write("hfSearchRecords", searches);
    }

    $("#searchBtn").addEventListener("click", searchProperties);

    // 2. SAVE SEARCH CRITERIA
    $("#saveSearchBtn").addEventListener("click", function () {
        const criteria = getCriteria();
        const searches = read("hfSavedSearches");

        searches.push({
            id: Date.now(),
            name: (criteria.location || "All locations") +
                  " - " + (criteria.type || "All types"),
            criteria: criteria
        });

        write("hfSavedSearches", searches);
        renderSavedSearches();

        message("searchMessage", "Your search criteria have been saved.");
    });

    function renderSavedSearches() {
        const container = $("#savedSearchList");
        container.replaceChildren();

        const searches = read("hfSavedSearches");

        if (searches.length === 0) {
            container.textContent = "You have not saved any searches yet.";
            return;
        }

        searches.forEach(search => {
            const row = document.createElement("div");
            const title = document.createElement("span");
            const load = document.createElement("button");
            const remove = document.createElement("button");

            title.textContent = search.name + " ";
            load.textContent = "Use Search";
            remove.textContent = "Delete";

            load.addEventListener("click", () =>
                applyCriteria(search.criteria)
            );

            remove.addEventListener("click", function () {
                write(
                    "hfSavedSearches",
                    read("hfSavedSearches").filter(item =>
                        item.id !== search.id
                    )
                );
                renderSavedSearches();
            });

            row.append(title, load, remove);
            container.appendChild(row);
        });
    }

    $("#loadSearchBtn").addEventListener("click", function () {
        const searches = read("hfSavedSearches");

        if (!searches.length) {
            message("searchMessage", "Save a search first.");
            return;
        }

        applyCriteria(searches[searches.length - 1].criteria);
        message("searchMessage", "Your most recent saved search was loaded.");
    });

    // 3. PROPERTY FAVORITES
    function renderFavorites() {
        const container = $("#favoriteList");
        container.replaceChildren();

        const favorites = read("hfFavorites");

        if (!favorites.length) {
            container.textContent = "Your favorite properties will appear here.";
            return;
        }

        favorites.forEach(name => {
            const row = document.createElement("div");
            const title = document.createElement("span");
            const remove = document.createElement("button");

            title.textContent = name + " ";
            remove.textContent = "Remove Favorite";

            remove.addEventListener("click", function () {
                write("hfFavorites", read("hfFavorites").filter(n => n !== name));
                renderFavorites();
                updateFavoriteButtons();
            });

            row.append(title, remove);
            container.appendChild(row);
        });
    }

    function updateFavoriteButtons() {
        const favorites = read("hfFavorites");

        properties.forEach(card => {
            const name = card.querySelector("h3").textContent;
            const button = card.querySelector(".favoriteBtn");
            const saved = favorites.includes(name);

            button.textContent = saved ? "♥ Saved Favorite" : "♡ Add Favorite";
        });
    }

    document.querySelectorAll(".favoriteBtn").forEach(button => {
        button.addEventListener("click", function () {
            const card = this.closest(".property-card");
            const name = card.querySelector("h3").textContent;
            let favorites = read("hfFavorites");

            if (favorites.includes(name)) {
                favorites = favorites.filter(item => item !== name);
                message("searchMessage", "Property removed from favorites.");
            } else {
                favorites.push(name);
                message("searchMessage", "Property added to favorites.");
            }

            write("hfFavorites", favorites);
            renderFavorites();
            updateFavoriteButtons();
        });
    });

    // 4. PROPERTY DETAILS
    document.querySelectorAll(".viewBtn").forEach(button => {
        button.addEventListener("click", function () {
            const card = this.closest(".property-card");

            $("#detailsText").textContent =
                card.querySelector("h3").textContent + " | " +
                card.dataset.location + " | " +
                card.dataset.type + " | Price: ₹" +
                Number(card.dataset.price).toLocaleString("en-IN") +
                (Number(card.dataset.bedrooms) > 0
                    ? " | Bedrooms: " + card.dataset.bedrooms
                    : "");

            $("#detailsPanel").hidden = false;
            $("#detailsPanel").scrollIntoView({ behavior: "smooth" });
        });
    });

    $("#closeDetailsBtn").addEventListener("click", function () {
        $("#detailsPanel").hidden = true;
    });

    // 5. PROPERTY VIEWING APPOINTMENTS
    $("#appointmentBtn").addEventListener("click", function () {
        const name = $("#visitorName").value.trim();
        const email = $("#visitorEmail").value.trim();
        const date = $("#visitDate").value;

        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !date) {
            message("appointmentMessage", "Enter your name, valid email, and visit date.");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const chosenDate = new Date(date + "T00:00:00");

        if (chosenDate < today) {
            message("appointmentMessage", "Choose today or a future date.");
            return;
        }

        const appointments = read("hfAppointments");

        appointments.push({
            id: Date.now(),
            name: name,
            email: email,
            date: date
        });

        write("hfAppointments", appointments);

        message("appointmentMessage", "Viewing appointment saved successfully.");
        renderAppointments();
    });

    function renderAppointments() {
        const container = $("#appointmentList");
        container.replaceChildren();

        const appointments = read("hfAppointments");

        if (!appointments.length) {
            container.textContent = "No appointments booked.";
            return;
        }

        appointments.forEach(appointment => {
            const row = document.createElement("div");
            const details = document.createElement("p");
            const cancel = document.createElement("button");

            details.textContent =
                appointment.name + " | " +
                appointment.email + " | Visit: " + appointment.date;

            cancel.textContent = "Cancel Appointment";

            cancel.addEventListener("click", function () {
                write(
                    "hfAppointments",
                    read("hfAppointments").filter(item =>
                        item.id !== appointment.id
                    )
                );
                renderAppointments();
            });

            row.append(details, cancel);
            container.appendChild(row);
        });
    }

    // 6. AGENT SEARCH
    $("#agentSearchBtn").addEventListener("click", function () {
        const city = $("#agentLocation").value.trim().toLowerCase();
        let count = 0;

        document.querySelectorAll(".agent-card").forEach(agent => {
            const matches = !city ||
                agent.dataset.city.toLowerCase().includes(city);

            agent.hidden = !matches;

            if (matches) count++;
        });

        message("searchMessage", count + " agent(s) found.");
    });

    // 7. OPEN MAP
    $("#mapBtn").addEventListener("click", function () {
        const city = $("#mapProperty").value;

        if (!city) {
            message("mapMessage", "Please select a property first.");
            return;
        }

        const url =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(city);

        window.open(url, "_blank", "noopener,noreferrer");
        message("mapMessage", "Opening the selected city in Google Maps.");
    });

    // 8. MORTGAGE / EMI CALCULATOR
    $("#calculateBtn").addEventListener("click", function () {
        const principal = Number($("#loanAmount").value);
        const annualRate = Number($("#interestRate").value);
        const years = Number($("#loanYears").value);

        if (!Number.isFinite(principal) || principal <= 0 ||
            !Number.isFinite(annualRate) || annualRate < 0 ||
            !Number.isFinite(years) || years <= 0 || years > 50) {
            message("emiResult", "Enter a valid loan amount, interest rate, and duration.");
            return;
        }

        const months = years * 12;
        const monthlyRate = annualRate / 1200;

        const emi = monthlyRate === 0
            ? principal / months
            : principal * monthlyRate *
              Math.pow(1 + monthlyRate, months) /
              (Math.pow(1 + monthlyRate, months) - 1);

        message(
            "emiResult",
            "Estimated Monthly EMI: ₹" +
            emi.toLocaleString("en-IN", { maximumFractionDigits: 2 }) +
            "\nTotal Payment: ₹" +
            (emi * months).toLocaleString("en-IN", {
                maximumFractionDigits: 2
            })
        );
    });

    // 9. BUYER REGISTRATION
    $("#registerBtn").addEventListener("click", function () {
        const name = $("#registerName").value.trim();
        const email = $("#registerEmail").value.trim().toLowerCase();
        const password = $("#registerPassword").value;

        if (!name || !email || !password) {
            message("registerMessage", "Complete all registration fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message("registerMessage", "Enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            message("registerMessage", "Password must have at least 6 characters.");
            return;
        }

        const users = read("hfUsers");

        if (users.some(user => user.email === email)) {
            message("registerMessage", "This email is already registered.");
            return;
        }

        // Demo only: store no password in browser storage.
        // Real applications must use a secure backend and password hashing.
        users.push({ name: name, email: email });
        write("hfUsers", users);

        // Password is not saved; therefore this demo cannot authenticate it.
        message(
            "registerMessage",
            "Demo registration recorded. Real password authentication requires a secure backend."
        );
    });

    // 10. BUYER LOGIN DEMO
    $("#loginBtn").addEventListener("click", function () {
        const email = $("#loginEmail").value.trim().toLowerCase();
        const password = $("#loginPassword").value;

        if (!email || !password) {
            message("loginMessage", "Enter your email and password.");
            return;
        }

        const user = read("hfUsers").find(item => item.email === email);

        if (!user) {
            message("loginMessage", "Account not found. Please register first.");
            return;
        }

        // This is not secure authentication: passwords are not verified.
        sessionStorage.setItem("hfCurrentUser", email);

        message(
            "loginMessage",
            "Demo login successful, " + user.name +
            ". Real password verification requires a backend."
        );
    });

    $("#logoutBtn").addEventListener("click", function () {
        sessionStorage.removeItem("hfCurrentUser");
        message("loginMessage", "You have logged out.");
    });

    // 11. VISITOR COUNTER
    const visits = Number(localStorage.getItem("hfVisitCount") || 0) + 1;

    localStorage.setItem("hfVisitCount", String(visits));
    $("#visitCount").textContent = visits;

    // Restore browser-saved information
    renderSavedSearches();
    renderFavorites();
    renderAppointments();
    updateFavoriteButtons();

});