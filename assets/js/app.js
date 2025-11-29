/* =========================================================
   MULTILINGUAL PAGE SYSTEM
   ---------------------------------------------------------
   This script enables language switching via clickable buttons
   and dynamically loads localized content from JSON files.

   Main features:
     1. Detect user's preferred or saved language
     2. Apply active button styling
     3. Fetch and render page sections dynamically
     4. Handle errors gracefully when loading fails
   ========================================================= */

// ---------------------------------------------------------
// 1. LANGUAGE DETECTION AND DEFAULT SELECTION
// ---------------------------------------------------------
const supported = ["en", "fr", "zh", "it"];                        // Supported language codes
let currentLang = localStorage.getItem("lang") || navigator.language.slice(0, 2); // Try stored language, else browser default

// Fallback to English if unsupported language is detected
if (!supported.includes(currentLang)) currentLang = "en";

// ---------------------------------------------------------
// 2. LANGUAGE SWITCHER BUTTONS
// ---------------------------------------------------------
// When user clicks on a language button:
//   - The chosen language is saved to localStorage
//   - The active state is visually updated
//   - The corresponding JSON file is loaded
const switcher = document.getElementById("lang-switcher");

switcher.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const lang = e.target.getAttribute("data-lang");
    setActiveLang(lang);               // Highlight the active button
    localStorage.setItem("lang", lang); // Persist preference
    loadLanguage(lang);                 // Load translations
  }
});

// ---------------------------------------------------------
// 3. SET ACTIVE BUTTON
// ---------------------------------------------------------
// Visually indicates the currently selected language.
function setActiveLang(lang) {
  document.querySelectorAll("#lang-switcher button").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

// Initialize UI with the correct active language
setActiveLang(currentLang);

// ---------------------------------------------------------
// 4. INITIAL LANGUAGE LOAD
// ---------------------------------------------------------
loadLanguage(currentLang);

// ---------------------------------------------------------
// 5. LOAD LANGUAGE DATA
// ---------------------------------------------------------
// Fetches JSON data for the selected language and renders content.
function loadLanguage(lang) {
  fetch(`./assets/data/${lang}.json`)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${lang}.json`);
      return res.json();
    })
    .then(data => renderPage(data))
    .catch(err => {
      // Log error in console and show user-friendly message
      console.error("Language load error:", err);
      document.querySelector("main").innerHTML =
        "<p style='text-align:center;color:red;margin-top:2rem;'>Error loading content. Check console for details.</p>";
    });
}

// ---------------------------------------------------------
// 6. RENDER PAGE CONTENT
// ---------------------------------------------------------
// Builds the navigation, hero section, scolarpath, publications,
// projects sections dynamically based on the JSON data.
function renderPage(data) {
  // --- Navigation ---
  document.getElementById("nav-links").innerHTML = `
    <li><a href="#scolarpath">${data.nav.scolarpath}</a></li>
    <li><a href="#careerpath">${data.nav.careerpath}</a></li>
    <li><a href="#publications">${data.nav.publications}</a></li>
    <li><a href="#projects">${data.nav.projects}</a></li>
  `;

  // --- Hero Section ---
  document.getElementById("hero").innerHTML = `
    <div>
      <h1>${data.hero.title}</h1>
      <p>${data.hero.subtitle}</p>
      <div class="tags">
        ${data.hero.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </div>
    <a href="https://www.mam.paris.fr/fr/oeuvre/rythme-ndeg1" target="_blank" rel="noopener">
      <img src="assets/img/hero.jpg" alt="Rythme n°1 artwork" class="clickable-hero">
    </a>
  `;


  // --- Social Links Section ---
  const socialLinks = [
    { name: "GitHub", icon: "github.svg", url: "https://github.com/AxelDlv00" },
    { name: "Hugging Face", icon: "huggingface.svg", url: "https://huggingface.co/Naela00" },
    { name: "Google Scholar", icon: "googlescholar.png", url: "https://scholar.google.com/citations?user=-89Mh24AAAAJ" },
  ];

  document.getElementById("social-links").innerHTML = `
    <div class="social-links">
      ${socialLinks.map(link => `
        <a class="social-button" href="${link.url}" target="_blank" rel="noopener">
          <img src="assets/img/icons/${link.icon}" alt="${link.name} icon">
          ${link.name}
        </a>
      `).join("")}
    </div>
  `;

  // --- Dynamic Sections ---
  buildSection("scolarpath", data.scolarpath, data.nav.scolarpath);
  buildSection("careerpath", data.careerpath, data.nav.careerpath);
  buildSection("publications", data.publications, data.nav.publications);
  buildSection("projects", data.projects, data.nav.projects);

}

// ---------------------------------------------------------
// 7. BUILD SECTION HELPER (Improved visual version)
// ---------------------------------------------------------
// Creates styled cards for each item and improves spacing and
// chip rendering for a cleaner layout.
// ---------------------------------------------------------
function buildSection(id, items, title) {
  const section = document.getElementById(id);
  if (!items) return;

  section.innerHTML = `<h2>${title}</h2>` +
    items.map(item => {
      const labels = item.chips || item.tags;
      const labelHTML = labels
        ? `
          <div class="card-footer">
            <div class="chips-container">
              ${labels.map(label => `<span class="chip">${label}</span>`).join("")}
            </div>
          </div>
        `
        : "";

      const logoHTML = item.logo
        ? `<img class="inline-logo" src="assets/img/logos/${item.logo}" alt="${item.title} logo" loading="lazy">`
        : "";

      const mediaHTML = item.media
        ? `<img class="side-media" src="assets/img/${item.media}" alt="${item.title} media" loading="lazy">`
        : "";

      return `
        <div class="card">
          <div class="card-main">
            <div class="card-text">
              <h3>${item.link ? `<a href="${item.link}" target="_blank">${item.title}</a>` : item.title}</h3>
              ${item.meta ? `<p class="meta">${item.meta}</p>` : ""}
              <p class="desc">${item.desc}</p>
            </div>
            ${
            item.logo || item.media
              ? `
                <div class="visual-column">
                  ${logoHTML}
                  ${mediaHTML}
                </div>
              `
              : ""
            }
          </div>
          ${labelHTML}
        </div>
      `;
    }).join("");
}
