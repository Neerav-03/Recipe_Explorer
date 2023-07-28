const apiKey='15f8ccb61d4d48a6b4564a82735811f3';

// Function to get the favorited recipes from local storage
function getFavoriteRecipes() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }
  
  // Function to render the favorited recipes on the Favorites page
  function renderFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const favoriteRecipes = getFavoriteRecipes();
  
    // Clear the container
    favoritesContainer.innerHTML = '';
  
    if (favoriteRecipes.length === 0) {
      // Display a message if no favorite recipes are found
      favoritesContainer.innerHTML = `<div style="text-align: center;">No favorite recipes found, Explore more recipes and bookmark your favorites!</div>`;
    } else {
      // Render each favorite recipe
      favoriteRecipes.forEach((recipe) => {
        // Create a card or element to display each favorite recipe
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        // Customize the recipe card as per your needs
      
        fetch('https://api.spoonacular.com/recipes/' + recipe.id + '/information?apiKey='+apiKey)
          .then(response1 => response1.json())
          .then(data1 => {
            console.log(data1);
            const summary = data1.summary;
            const readyInMinutes = data1.readyInMinutes;
            const servings = data1.servings;
            const instructions = data1.instructions;
      
            recipeCard.innerHTML = `
              <div class="row row-cols-1 row-cols-md-2 mb-3 justify-content-center">
                <div class="col" >
                  <div class="card mb-4 rounded-3 shadow-sm" style="width: 100%;">
                    <div class="card-header py-3 text-center">
                      <h4 class="my-0 fw-normal">${recipe.title}</h4>
                    </div>
                    <p class="text-center"><img src=${recipe.image} alt="..." style="max-width: 100%; height: auto;"></p>
                    <div class="card-body" >
                      <ul class="card-text">Servings: ${servings}</ul>
                      <ul class="card-text">Time to Cook: ${readyInMinutes} mins</ul>
                      <!-- Sidebar toggle button -->
                      <button class="btn btn-primary btn-sm sidebar-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarContent-${recipe.id}" aria-expanded="false" aria-controls="sidebarContent-${recipe.id}">
                        Show More
                      </button>
                      <!-- Sidebar content (hidden by default) -->
                      <div class="collapse" id="sidebarContent-${recipe.id}">
                        <!-- Additional content here -->
                        ${instructions}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
      
            // Append the recipe card to the container
            favoritesContainer.appendChild(recipeCard);
      
            const sidebarToggle = recipeCard.querySelector('.sidebar-toggle');
            sidebarToggle.addEventListener('click', () => {
              const sidebarContent = recipeCard.querySelector('.collapse');
              const isExpanded = sidebarContent.classList.contains('show');
              if (isExpanded) {
                sidebarContent.classList.remove('show');
                sidebarToggle.textContent = 'Show Instructions';
              } else {
                sidebarContent.classList.add('show');
                sidebarToggle.textContent = 'Close Instructions';
              }
            });
          })
          .catch(error => {
            console.log('Error:', error);
          });
      });
      
      
    }
  }
  
  // Call the renderFavorites function to display the favorited recipes when the page loads
  renderFavorites();
  