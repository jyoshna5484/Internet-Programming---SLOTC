// Recipe Data
let recipes = {
    "Masala Dosa": {
        description: "Crispy dosa served with potato masala.",
        ingredients: ["2 cups dosa batter", "2 potatoes", "1 onion", "Salt", "Oil"],
        instructions: [
            "Boil and mash the potatoes.",
            "Cook onions with spices and add potatoes.",
            "Spread dosa batter on a hot pan.",
            "Add potato masala and fold the dosa."
        ]
    },

    "Vegetable Biryani": {
        description: "Aromatic rice cooked with vegetables and spices.",
        ingredients: ["2 cups rice", "1 cup vegetables", "1 onion", "Spices", "Oil"],
        instructions: [
            "Wash and soak the rice.",
            "Fry onions and add vegetables.",
            "Add spices and rice.",
            "Cook until the rice is soft."
        ]
    },

    "Chocolate Cake": {
        description: "Soft chocolate cake with rich chocolate flavor.",
        ingredients: ["2 cups flour", "1 cup sugar", "Cocoa powder", "Milk", "Butter"],
        instructions: [
            "Mix flour, sugar and cocoa powder.",
            "Add milk and butter.",
            "Pour the mixture into a cake pan.",
            "Bake until the cake is ready."
        ]
    },

    "Paneer Butter Masala": {
        description: "Paneer cooked in creamy tomato gravy.",
        ingredients: ["200g paneer", "2 tomatoes", "Butter", "Cream", "Spices"],
        instructions: [
            "Prepare tomato gravy.",
            "Add butter and spices.",
            "Add paneer pieces.",
            "Cook and add cream before serving."
        ]
    }
};

let selectedRecipe = "";
let favorites = [];

// Search Recipes
function searchRecipes() {
    let search = document.getElementById("search").value.toLowerCase();
    let cards = document.querySelectorAll(".recipes .card");

    cards.forEach(function(card) {
        let name = card.querySelector("h3").innerText.toLowerCase();

        if (name.includes(search)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Filter Recipes
function filterRecipes() {
    let category = document.getElementById("category").value;
    let cards = document.querySelectorAll(".recipes .card");

    cards.forEach(function(card) {
        let categories = card.dataset.category;

        if (category === "all" || categories.includes(category)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// View Recipe
function viewRecipe(name) {
    selectedRecipe = name;

    document.getElementById("recipeName").innerText = name;
    document.getElementById("recipeDescription").innerText =
        recipes[name].description;

    let ingredients = document.getElementById("ingredients");
    let instructions = document.getElementById("instructions");

    ingredients.innerHTML = "";
    instructions.innerHTML = "";

    recipes[name].ingredients.forEach(function(item) {
        ingredients.innerHTML += `<li>${item}</li>`;
    });

    recipes[name].instructions.forEach(function(step) {
        instructions.innerHTML += `<li>${step}</li>`;
    });

    document.getElementById("recipeDetails").scrollIntoView();
}

// Update Servings
function updateServings() {
    if (selectedRecipe === "") {
        alert("Please select a recipe first!");
        return;
    }

    let servings = document.getElementById("servings").value;

    alert("Recipe servings updated to " + servings + "!");
}

// Add Favorite
function addFavorite(name) {
    if (!favorites.includes(name)) {
        favorites.push(name);
    }

    displayFavorites();
}

// Display Favorites
function displayFavorites() {
    let list = document.getElementById("favoriteList");
    list.innerHTML = "";

    favorites.forEach(function(recipe) {
        list.innerHTML += `<li>${recipe}</li>`;
    });
}

// Meal Planner
document.getElementById("plannerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let day = document.getElementById("day").value;
    let meal = document.getElementById("meal").value;

    document.getElementById("mealList").innerHTML +=
        `<li>${day} - ${meal}</li>`;

    this.reset();
});

// Shopping List
function addShoppingItem() {
    let item = document.getElementById("shoppingItem").value;

    if (item.trim() !== "") {
        document.getElementById("shoppingList").innerHTML +=
            `<li>${item}</li>`;

        document.getElementById("shoppingItem").value = "";
    }
}

// Comments
document.getElementById("commentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("userName").value;
    let comment = document.getElementById("comment").value;

    document.getElementById("commentList").innerHTML += `
        <div class="comment">
            <h4>${name}</h4>
            <p>${comment}</p>
        </div>
    `;

    alert("Comment posted successfully!");
    this.reset();
});

// Print Recipe
function printRecipe() {
    if (selectedRecipe === "") {
        alert("Please select a recipe first!");
    } else {
        window.print();
    }
}

// Share Recipe
function shareRecipe() {
    if (selectedRecipe === "") {
        alert("Please select a recipe first!");
        return;
    }

    if (navigator.share) {
        navigator.share({
            title: selectedRecipe,
            text: "Check out this recipe: " + selectedRecipe,
            url: window.location.href
        });
    } else {
        alert("Share this recipe with your friends!");
    }
}