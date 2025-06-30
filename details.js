const countryDetails = document.querySelector(".container");
const backBtn = document.querySelector(".back");
const code = localStorage.getItem("country");
console.log(code);
const toggle = document.getElementById("toggle-button");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
  toggle.innerHTML = document.body.classList.contains("dark")
    ? `<i class="ri-sun-line"></i> Light Mode`
    : `<i class="ri-moon-line"></i> Dark Mode`;
});
window.addEventListener("load", () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    toggle.innerHTML = `
  <button id="toggle-button">
    <i class="ri-sun-line"></i> Light Mode
  </button>
`;
  }
});

let selectedCountries = [];

async function fetchCountryDetails() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    selectedCountries = data;
    loadDetails(selectedCountries);
  } catch (error) {
    console.error("Error fetching country details:", error);
  }
}
fetchCountryDetails();
function loadDetails(countrySelected) {
  const country = countrySelected.find((c) => {
    return c.alpha3Code === code;
  });
  const borders = country.borders || [];

  const borderButtonsHTML = borders
    .map((borderCode) => {
      const borderCountry = selectedCountries.find(
        (c) => c.alpha3Code === borderCode
      );
      if (!borderCountry) return "";
      return `<button class="border-btn" data-code="${borderCountry.alpha3Code}">${borderCountry.name}</button>`;
    })
    .join(" ");

  countryDetails.innerHTML = `
  <div class= "selected_country">
  <div class= "flag">
    <img src="${country.flags.svg}" alt="Flag of ${country.name}" />
    </div>
    <div class="details-column">
    <h2>${country.name}</h2>
     <div class="details-column-container">
      <div class="details-left">
    <p><strong>Native Name:</strong> ${country.nativeName}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Sub Region:</strong> ${country.subregion}</p>
    <p><strong>Capital:</strong> ${country.capital}</p>
    </div>
    <div class="details-right">
    <p><strong>Top Level Domain:</strong> ${country.topLevelDomain.join(
      ", "
    )}</p>
    <p><strong>Currencies:</strong> ${country.currencies
      .map((c) => c.name)
      .join(", ")}</p>
    <p><strong>Languages:</strong> ${country.languages
      .map((l) => l.name)
      .join(", ")}</p>
      </div>
      </div>
      <div class="border-buttons"><strong>Border Countries:</strong>${
        borderButtonsHTML || "None"
      }</div>
      </div>
  `;
  const borderButtons = document.querySelectorAll(".border-btn");
  borderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const newCode = button.getAttribute("data-code");
      localStorage.setItem("country", newCode);
      location.reload();
    });
  });
}

backBtn.addEventListener("click", () => {
  window.location.href = "./index.html";
});
