const SUPPORTED_LANGS = ["en", "fr", "zh", "it"];
const DEFAULT_LANG = "en";

export function getPreferredLanguage() {
  const stored = localStorage.getItem("lang");
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const browser = navigator.language.slice(0, 2);
  if (SUPPORTED_LANGS.includes(browser)) return browser;
  return DEFAULT_LANG;
}

export function setLanguagePreference(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  localStorage.setItem("lang", lang);
  updateActiveButton(lang);
}

export async function fetchTranslations(lang) {
  try {
    const response = await fetch(`./assets/data/${lang}.json`);
    if (!response.ok) throw new Error(`Could not load ${lang}.json`);
    return await response.json();
  } catch (error) {
    console.error("Translation load error:", error);
    return null;
  }
}

function updateActiveButton(lang) {
  document.querySelectorAll(".lang-switcher button").forEach(btn => {
    if (btn.dataset.lang === lang) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}