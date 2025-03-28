// DOM Elements
const recipeForm = document.getElementById('recipe-form');
const recipeNameInput = document.getElementById('recipe-name');
const ingredientsInput = document.getElementById('ingredients');
const stepsInput = document.getElementById('steps');
const recipeImageInput = document.getElementById('recipe-image');
const recipesContainer = document.getElementById('recipes');
const searchBar = document.getElementById('search-bar');

// Recipe Storage
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let editIndex = null; // Tracks the index of the recipe being edited

// Add or Edit Recipe Event
recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const recipeName = recipeNameInput.value;
    const ingredients = ingredientsInput.value.split(',');
    const steps = stepsInput.value;
    const imageFile = recipeImageInput.files[0];

    if (editIndex !== null) {
        // Edit existing recipe
        const updatedRecipe = { ...recipes[editIndex], name: recipeName, ingredients, steps };
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function () {
                updatedRecipe.image = reader.result;
                recipes[editIndex] = updatedRecipe;
                saveRecipes();
                resetForm();
            };
            reader.readAsDataURL(imageFile);
        } else {
            recipes[editIndex] = updatedRecipe;
            saveRecipes();
            resetForm();
        }
    } else {
        // Add new recipe
        const reader = new FileReader();
        reader.onload = function () {
            const newRecipe = {
                name: recipeName,
                ingredients,
                steps,
                image: reader.result,
            };

            recipes.push(newRecipe);
            saveRecipes();
            resetForm();
        };
        reader.readAsDataURL(imageFile);
    }
});

// Display Recipes
function displayRecipes(filteredRecipes = recipes) {
    recipesContainer.innerHTML = '';
    filteredRecipes.forEach((recipe, index) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
            <p><strong>Steps:</strong> ${recipe.steps}</p>
            <div class="recipe-actions">
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;

        recipesContainer.appendChild(recipeCard);
    });

    // Add event listeners for Edit and Delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => button.addEventListener('click', handleEdit));
    document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', handleDelete));
}

// Save Recipes to Local Storage
function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
}

// Handle Edit
function handleEdit(e) {
    const index = e.target.dataset.index;
    const recipe = recipes[index];
    editIndex = index;

    // Populate form with existing recipe details
    recipeNameInput.value = recipe.name;
    ingredientsInput.value = recipe.ingredients.join(', ');
    stepsInput.value = recipe.steps;

    recipeForm.querySelector('button[type="submit"]').textContent = 'Update Recipe';
}

// Handle Delete
function handleDelete(e) {
    const index = e.target.dataset.index;
    recipes.splice(index, 1);
    saveRecipes();
}

// Reset Form
function resetForm() {
    recipeForm.reset();
    editIndex = null;
    recipeForm.querySelector('button[type="submit"]').textContent = 'Add Recipe';
}

// Search Recipes
searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
    );
    displayRecipes(filteredRecipes);
});
displayRecipes(filteredRecipes);


// Initial Display
displayRecipes();
