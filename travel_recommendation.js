const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsDiv = document.getElementById("results");

function displayResults(results) {
  resultsDiv.innerHTML = "";

  if (results.length === 0) {
    resultsDiv.innerHTML =
      "<p class='no-results'>No results found. Try beach, temple, or country.</p>";
    return;
  }

  results.forEach(place => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${place.imageUrl}" alt="${place.name}">
      <div class="card-body">
        <h3>${place.name}</h3>
        <p>${place.description}</p>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}

function searchRecommendations() {
  const keyword = searchInput.value.trim().toLowerCase();

  if (keyword === "") {
    resultsDiv.innerHTML = "";
    return;
  }

  fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
      let results = [];

      if (keyword.includes("beach")) {
        results = data.beaches;
      } else if (keyword.includes("temple")) {
        results = data.temples;
      } else if (keyword.includes("countr")) {
        data.countries.forEach(country => {
          results = results.concat(country.cities);
        });
      } else {
        // Bonus: typing a country name (e.g. Japan) shows its cities
        data.countries.forEach(country => {
          if (country.name.toLowerCase().includes(keyword)) {
            results = results.concat(country.cities);
          }
        });
      }

      displayResults(results);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

function clearResults() {
  resultsDiv.innerHTML = "";
  searchInput.value = "";
}

searchBtn.addEventListener("click", searchRecommendations);
clearBtn.addEventListener("click", clearResults);