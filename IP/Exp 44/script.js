let paintings = [
    {
        name: "Nature's Beauty",
        artist: "John Smith",
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        reviews: []
    },
    {
        name: "Sunset Painting",
        artist: "Emily Brown",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        reviews: []
    }
];

let currentPainting = "";
let customerLoggedIn = false;
let owners = [];

// Display paintings
function displayPaintings() {
    let output = "";

    paintings.forEach(function(painting, index) {
        let average = 0;

        if (painting.reviews.length > 0) {
            let total = 0;

            painting.reviews.forEach(function(review) {
                total += review.rating;
            });

            average = (total / painting.reviews.length).toFixed(1);
        }

        output += `
            <div class="painting-card">
                <h3>${painting.name}</h3>
                <p>Artist: ${painting.artist}</p>
                <img src="${painting.image}" alt="${painting.name}">
                <p class="rating">⭐ ${average} / 5</p>
                <p>Total Reviews: ${painting.reviews.length}</p>
                <button onclick="openReview(${index})">Rate and Review</button>
                <button onclick="viewReviews(${index})">View Reviews</button>
            </div>
        `;
    });

    document.getElementById("paintingList").innerHTML = output;
}

// Customer Login
function customerLogin() {
    let name = document.getElementById("customerName").value;
    let email = document.getElementById("customerEmail").value;

    if (name === "" || email === "") {
        alert("Please enter your name and email");
        return;
    }

    customerLoggedIn = true;

    alert("Customer login successful!");

    showSection("paintings");
}

// Open Review
function openReview(index) {
    if (!customerLoggedIn) {
        alert("Please login first");
        showSection("customer");
        return;
    }

    currentPainting = index;

    document.getElementById("selectedPainting").innerText =
        "Painting: " + paintings[index].name;

    showSection("review");
}

// Submit Review
function submitReview() {
    let rating = Number(document.getElementById("rating").value);
    let text = document.getElementById("reviewText").value;

    if (text === "") {
        alert("Please write your review");
        return;
    }

    paintings[currentPainting].reviews.push({
        customer: document.getElementById("customerName").value,
        rating: rating,
        text: text
    });

    alert("Review submitted successfully!");

    document.getElementById("reviewText").value = "";

    displayPaintings();
    showSection("paintings");
}

// View Reviews
function viewReviews(index) {
    let painting = paintings[index];

    let output = "<h3>Reviews for " + painting.name + "</h3>";

    if (painting.reviews.length === 0) {
        output += "<p>No reviews available yet.</p>";
    }

    painting.reviews.forEach(function(review) {
        output += `
            <div class="review-card">
                <p><b>${review.customer}</b></p>
                <p>Rating: ${"⭐".repeat(review.rating)}</p>
                <p>${review.text}</p>
            </div>
        `;
    });

    alert("Total Reviews: " + painting.reviews.length);

    document.getElementById("paintingList").innerHTML += output;
}

// Admin Login
function adminLogin() {
    let username = document.getElementById("adminUsername").value;
    let password = document.getElementById("adminPassword").value;

    if (username === "admin" && password === "admin123") {
        showSection("adminDashboard");
        displayAdminReviews();
        displayOwners();
    } else {
        alert("Invalid admin login");
    }
}

// Admin Add Painting
function addPainting() {
    let name = document.getElementById("adminPaintingName").value;
    let artist = document.getElementById("adminArtist").value;
    let image = document.getElementById("adminImage").value;

    if (name === "" || artist === "" || image === "") {
        alert("Please fill all painting details");
        return;
    }

    paintings.push({
        name: name,
        artist: artist,
        image: image,
        reviews: []
    });

    alert("Painting uploaded successfully!");

    displayPaintings();

    document.getElementById("adminPaintingName").value = "";
    document.getElementById("adminArtist").value = "";
    document.getElementById("adminImage").value = "";

    displayAdminReviews();
}

// Admin Reviews
function displayAdminReviews() {
    let output = "";

    paintings.forEach(function(painting) {
        output += "<h3>" + painting.name + "</h3>";

        if (painting.reviews.length === 0) {
            output += "<p>No reviews yet.</p>";
        }

        painting.reviews.forEach(function(review) {
            output += `
                <div class="review-card">
                    <p>Customer: ${review.customer}</p>
                    <p>Rating: ${review.rating} / 5</p>
                    <p>Review: ${review.text}</p>
                    <button onclick="replyReview('${review.customer}')">Reply</button>
                </div>
            `;
        });
    });

    document.getElementById("adminReviews").innerHTML = output;
}

// Admin Reply
function replyReview(customer) {
    let response = prompt("Enter your response to " + customer);

    if (response !== null && response !== "") {
        alert("Response saved successfully!");
    }
}

// Owner Registration
function registerOwner() {
    let name = document.getElementById("ownerName").value;
    let email = document.getElementById("ownerEmail").value;
    let painting = document.getElementById("paintingName").value;
    let artist = document.getElementById("paintingArtist").value;
    let image = document.getElementById("paintingImage").value;
    let days = Number(document.getElementById("packageDays").value);

    if (name === "" || email === "" || painting === "" ||
        artist === "" || image === "" || days <= 0) {
        alert("Please fill all details correctly");
        return;
    }

    let amount = days * 100;

    owners.push({
        name: name,
        email: email,
        painting: painting,
        artist: artist,
        image: image,
        days: days,
        amount: amount
    });

    alert("Registration successful!\nPackage Amount: ₹" + amount);

    displayOwners();
}

// Display Owners
function displayOwners() {
    let output = "";

    owners.forEach(function(owner) {
        output += `
            <div class="review-card">
                <p>Owner: ${owner.name}</p>
                <p>Painting: ${owner.painting}</p>
                <p>Package: ${owner.days} days</p>
                <p>Amount: ₹${owner.amount}</p>
            </div>
        `;
    });

    document.getElementById("ownerDetails").innerHTML = output;
}

// Previous Painting Reviews
function showPreviousReviews() {
    let output = "";

    paintings.forEach(function(painting) {
        output += "<h3>" + painting.name + "</h3>";

        painting.reviews.forEach(function(review) {
            if (review.rating >= 3) {
                output += "<p>Positive: " + review.text + "</p>";
            } else {
                output += "<p>Negative: " + review.text + "</p>";
            }
        });
    });

    document.getElementById("previousReviews").innerHTML = output;
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(function(section) {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "paintings") {
        displayPaintings();
    }
}