// Shopping Cart
let cart = [];
let total = 0;

// Add Book to Cart
function addToCart(name, price) {
    cart.push({ name: name, price: price });

    total += price;

    displayCart();

    alert(name + " added to cart!");
}

// Display Cart Items
function displayCart() {
    let cartTable = document.getElementById("cartItems");

    cartTable.innerHTML = "";

    cart.forEach(function(item) {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price}</td>
        `;

        cartTable.appendChild(row);
    });

    document.getElementById("total").innerText = total;
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Order placed successfully!\nTotal Amount: ₹" + total);

        cart = [];
        total = 0;

        displayCart();
    }
}

// Clear Cart
function clearCart() {
    cart = [];
    total = 0;

    displayCart();

    alert("Cart cleared!");
}

// Search Books
function searchBooks() {
    let search = document.getElementById("searchBox").value.toLowerCase();

    let books = document.querySelectorAll(".book");

    books.forEach(function(book) {
        let text = book.innerText.toLowerCase();

        if (text.includes(search)) {
            book.style.display = "block";
        } else {
            book.style.display = "none";
        }
    });
}

// Contact Form
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Your message has been sent successfully!");

    this.reset();
});