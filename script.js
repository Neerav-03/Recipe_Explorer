const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsContainer = document.getElementById('recipe-results');
const apiKey='15f8ccb61d4d48a6b4564a82735811f3';
form.addEventListener('submit', function (e) 
{
      e.preventDefault();

      const searchQuery = input.value.trim();
      const cuisineFilter = document.getElementById('cuisine').value;
      const dietFilter = document.getElementById('diet').value;
      const typeFilter = document.getElementById('typeof').value;
      // Call your API here to fetch recipes based on the search query
      // You'll need to replace the API_URL with the actual API endpoint
      //https://api.spoonacular.com/recipes/informationBulk?apiKey=8f5fc94978214824bf9668779a43a3fc&ids=715538,716429'
      const API_URL = 'https://api.spoonacular.com/recipes/complexSearch?apiKey='+apiKey+'&cuisine='+cuisineFilter+'&diet='+dietFilter+'&type='+typeFilter+'&query=' + searchQuery;
      
      // Fetch the recipes
      fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    // Check if data.results is iterable
    console.log(data)
    if (data.results && typeof data.results[Symbol.iterator] === 'function') {
      // Clear previous results
      resultsContainer.innerHTML = '';

      // Display the recipe results
      /*<div class="card mb-3">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
</div>*/
      data.results.forEach(recipe => {
        const recipeCard = document.createElement('div');
        const id=recipe.id;
        let summary,readyInMinutes,servings,instructions;

        function fetchRecipeSummary(id) {
          return fetch('https://api.spoonacular.com/recipes/' + id + '/information?apiKey='+apiKey)
            .then(response1 => response1.json())
            .then(data1 => {
              console.log(data1);
              summary = data1.summary;
              readyInMinutes=data1.readyInMinutes;
              servings=data1.servings;
              instructions=data1.instructions;
              // Trigger the separate function or event handler
              handleSummaryAvailable();
            })
            .catch(error => {
              console.log('Error:', error);
            });
        }

        function handleSummaryAvailable() 
        {
          // Access and use the `summary` value here
          console.log(summary);
          // Perform further actions with the `summary` value
          recipeCard.innerHTML = `<div class="row row-cols-1 row-cols-md-2 mb-3 justify-content-center">
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm" style="width: 100%;">
                <div class="card-header py-3 text-center">
                  <h4 class="my-0 fw-normal">${recipe.title}</h4>
                </div>
                
                <p class="text-center"><img src=${recipe.image} alt="..." style="max-width: 100%; height: auto;"></p>

                <div class="card-body">
                  <ul class="card-text">servings: ${servings}</ul>
                  <ul class="card-text">Time to cook: ${readyInMinutes}mins</ul>
                  <!-- Sidebar toggle button -->
        <button class="btn btn-primary btn-sm sidebar-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarContent" aria-expanded="false" aria-controls="sidebarContent">
          Show Instructions
        </button>
        <button class="btn btn-outline-primary btn-sm btn-favorite" type="button">Add to Favorites</button>
        <!-- Sidebar content (hidden by default) -->
        <div class="collapse" id="sidebarContent">
          <!-- Add your additional content here -->
          ${instructions}
        </div>
                </div>
                
                </div>
              </div>
            </div>
            `;
          resultsContainer.appendChild(recipeCard);
          const sidebarToggle = recipeCard.querySelector('.sidebar-toggle');
          sidebarToggle.addEventListener('click', () => {
            const sidebarContent = recipeCard.querySelector('#sidebarContent');
            const isExpanded = sidebarContent.classList.contains('show');
            if (isExpanded) {
              sidebarContent.classList.remove('show');
              sidebarToggle.textContent = 'Show Instructions';
            } else {
              sidebarContent.classList.add('show');
              sidebarToggle.textContent = 'Close Instructions';
            }
          });
          function updateFavoriteButton(recipe) {
            const favoriteButton = recipeCard.querySelector('.btn-favorite');
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const isFavorite = favorites.some((favRecipe) => favRecipe.id === recipe.id);
          
            if (isFavorite) {
              favoriteButton.textContent = 'Remove from Favorites';
              favoriteButton.classList.add('btn-remove');
            } else {
              favoriteButton.textContent = 'Add to Favorites';
              favoriteButton.classList.remove('btn-remove');
            }
          }
          
          
          // Add event listener to "Add to Favorites" button
          const favoriteButton = recipeCard.querySelector('.btn-favorite');
          favoriteButton.addEventListener('click', () => {
            const isFavorite = favoriteButton.classList.contains('btn-remove');
            if (isFavorite) {
              removeFromFavorites(recipe);
              updateFavoriteButton(recipe); // Update button text after removing from favorites
            } else {
              addToFavorites(recipe);
              updateFavoriteButton(recipe); // Update button text after adding to favorites
            }
          });

          
          function addToFavorites(recipe) {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites.push(recipe);
            localStorage.setItem('favorites', JSON.stringify(favorites));
          }
          
          
          // Function to remove a recipe from favorites
          function removeFromFavorites(recipe) {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const recipeIndex = favorites.findIndex((favRecipe) => favRecipe.id === recipe.id);
          
            if (recipeIndex !== -1) {
              favorites.splice(recipeIndex, 1);
              localStorage.setItem('favorites', JSON.stringify(favorites));
              updateFavoriteButton(recipe);
            }
          }
          
          
        }

        fetchRecipeSummary(id);


        
        
      });
    } else {
      // Handle the case when data.results is not iterable
      resultsContainer.innerHTML = '<div style="text-align: center;">No recipes found, search requests for today have been now exhaust.</div>';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    resultsContainer.innerHTML = 'An error occurred while fetching recipes.';
  });


});