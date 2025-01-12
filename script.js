
        const API_KEY = 'c2909e5d6c16407a9c10c001e1dc881b'; 
        const recipesContainer = document.getElementById('recipes');
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        async function searchRecipes() {
            const ingredients = document.getElementById('ingredients').value;
            if (!ingredients.trim()) return;

            recipesContainer.innerHTML = '<div class="loading">Searching for recipes...</div>';

            try {
                const response = await fetch(
                    `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=12`
                );
                const data = await response.json();
                displayRecipes(data);
            } catch (error) {
                recipesContainer.innerHTML = '<div class="loading">Error fetching recipes. Please try again.</div>';
            }
        }

        function displayRecipes(recipes) {
            if (!recipes.length) {
                recipesContainer.innerHTML = '<div class="loading">No recipes found. Try different ingredients.</div>';
                return;
            }

            recipesContainer.innerHTML = recipes.map(recipe => `
                <div class="recipe-card">
                    <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                    <div class="recipe-content">
                        <h3 class="recipe-title">${recipe.title}</h3>
                        <p class="missing-ingredients">
                            Missing ingredients: ${recipe.missedIngredients.length ? 
                                recipe.missedIngredients.map(i => i.name).join(', ') : 'None'}
                        </p>
                        <button 
                            onclick="toggleFavorite('${recipe.id}', '${recipe.title}')"
                            class="favorite-btn ${favorites.some(f => f.id === recipe.id) ? 'active' : ''}"
                        >
                            ${favorites.some(f => f.id === recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function toggleFavorite(id, title) {
            const index = favorites.findIndex(f => f.id === id);
            
            if (index === -1)
                 {
                favorites.push({ id, title });

            } else
             {
                favorites.splice(index, 1);

            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
            searchRecipes(); 
        }

     
        document.getElementById('ingredients').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchRecipes();
        });