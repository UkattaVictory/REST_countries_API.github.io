const countryList = document.querySelector(".countries_container");
const searchInput = document.querySelector("#search");
const filterButton = document.getElementById("filter-btn");
const regionsBtn = document.querySelectorAll(".dropdown-content button");
const toggle = document.getElementById("toggle-button");

toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
   toggle.innerHTML = document.body.classList.contains("dark") 
  ?`<i class="ri-sun-line"></i> Light Mode`
    : `<i class="ri-moon-line"></i> Dark Mode`;
 
});
window.addEventListener('load', () => {
  const theme = localStorage.getItem('theme');
  console.log("theme")
  if (theme === 'dark') {
    document.body.classList.add('dark');
 toggle.innerHTML = `
  <button id="toggle-button">
    <i class="ri-sun-line"></i> Light Mode
  </button>
`;

     
  }
});



let allCountries = [];

async function fetchCountries() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    allCountries = data;
    displayCountries(allCountries);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}
fetchCountries();
function displayCountries(countries) {
  countryList.innerHTML = "";
  countries.forEach((country) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${country.flags.svg}" alt="${country.name}">
        <h2>${country.name}</h2>
        <p><strong>Population:</strong><span> ${country.population.toLocaleString()}</span></p>
        <p><strong>Region:</strong><span> ${country.region}</span></p>
        <p><strong>Capital:</strong><span> ${
          country.capital || "N/A"
        }</span></p>
        `;
    card.addEventListener("click", () => {
      localStorage.setItem("country", country.alpha3Code);
      window.location.href = "./details.html";
    });
    countryList.appendChild(card);
  });
}
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filter = allCountries.filter((c) =>
    c.name.toLowerCase().includes(value)
  );
  displayCountries(filter);
});

filterButton.addEventListener("click", () => {
  const dropdown = document.querySelector(".dropdown-content");
  dropdown.classList.toggle("active");
});
regionsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const selected = btn.getAttribute("data-region");
    const selectedRegion = selected.toLowerCase();
    const filteredCountries = allCountries.filter((c) => {
      const selectedCountry = c.region.toLowerCase();
      return selectedCountry === selectedRegion || selectedRegion === "all";
    });
    const dropdown = document.querySelector(".dropdown-content");
    displayCountries(filteredCountries);
    dropdown.classList.remove("active");
  });
});
