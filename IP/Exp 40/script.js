// Read Blog
function readBlog(place) {
    alert("Opening travel article about " + place + "!");
}

// Destination Filter
function filterDestination() {
    let selected = document.getElementById("destinationFilter").value;
    let destinations = document.querySelectorAll(".destination");

    destinations.forEach(function(item) {
        if (selected === "all" || item.dataset.place === selected) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

// Gallery
function showPhoto(name) {
    alert("Viewing photo: " + name);
}

// Comments
document.getElementById("commentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("commentName").value;
    let comment = document.getElementById("commentText").value;

    let newComment = document.createElement("div");
    newComment.className = "comment";

    newComment.innerHTML = `
        <h4>${name}</h4>
        <p>${comment}</p>
    `;

    document.getElementById("commentList").appendChild(newComment);

    alert("Comment posted successfully!");

    this.reset();
});

// Share Blog
function shareBlog() {
    if (navigator.share) {
        navigator.share({
            title: "Travel Diaries",
            text: "Explore beautiful travel destinations and stories!",
            url: window.location.href
        });
    } else {
        alert("Share this website with your friends!");
    }
}