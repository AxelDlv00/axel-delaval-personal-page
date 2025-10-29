/* =========================================================
   LANGUAGE SWITCHER LOGIC
   ---------------------------------------------------------
   Handles multilingual content loading based on user choice.
   Features:
     - Detects browser language on first visit
     - Stores preferred language in localStorage
     - Dynamically loads corresponding JSON file (assets/data/*.json)
     - Updates the interface via renderPage(data)
   ========================================================= */

// ---------------------------------------------------------
// INITIAL SETUP
// ---------------------------------------------------------

const switcher = document.getElementById("language-switcher"); // <select> or button container for language choice
const supported = ["en", "fr", "zh", "it"];                    // Supported language codes
let currentLang = localStorage.getItem("lang") || navigator.language.slice(0, 2); // Try stored lang, else browser default

// Fallback to English if the detected language is not supported
if (!supported.includes(currentLang)) currentLang = "en";

// Set the switcher UI to reflect current language
switcher.value = currentLang;

// ---------------------------------------------------------
// LANGUAGE CHANGE EVENT
// ---------------------------------------------------------
// When the user selects a new language:
//  - Save it to localStorage
//  - Load the corresponding translation JSON file
switcher.addEventListener("change", (e) => {
  const lang = e.target.value;
  localStorage.setItem("lang", lang); // Persist choice for future visits
  loadLanguage(lang);                 // Apply new language immediately
});

// ---------------------------------------------------------
// LANGUAGE LOADING FUNCTION
// ---------------------------------------------------------
// Fetch translation data and re-render the page content
function loadLanguage(lang) {
  fetch(`assets/data/${lang}.json`)          // Load localized content from JSON
    .then((res) => res.json())               // Parse response as JSON
    .then((data) => renderPage(data))        // Render all text elements dynamically
    .catch((err) => console.error("Error loading language:", err)); // Log any loading errors
}

// ---------------------------------------------------------
// INITIAL RENDER
// ---------------------------------------------------------
// Automatically load the correct language when the page opens
loadLanguage(currentLang);
