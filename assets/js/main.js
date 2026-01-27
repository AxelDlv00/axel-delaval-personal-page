import * as I18n from './i18n.js';
import * as UI from './ui.js';

let currentLang = I18n.getPreferredLanguage();

/**
 * Fonction principale de mise à jour de la page
 */
async function loadPageContent(lang) {
  // --- 1. SAUVEGARDE DE LA POSITION ---
  // On enregistre exactement où se trouve l'utilisateur en pixels
  const scrollPos = window.scrollY;

  // --- 2. LOGIQUE DE LANGUE ---
  I18n.setLanguagePreference(lang);
  const data = await I18n.fetchTranslations(lang);
  if (!data) return;

  // --- 3. RENDU DU CONTENU ---
  // Mise à jour du texte statique (Hero, Nav)
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const text = key.split('.').reduce((obj, k) => obj && obj[k], data);
    if (text) {
        // Gestion des tooltips pour les deux tableaux
        if (key === "hero.artwork_desc" || key === "hero.monet_artwork_desc") {
            el.setAttribute("data-tooltip", text);
        } else if (el.tagName === 'A' && el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
            el.textContent = text;
        } else {
            el.innerHTML = text; 
        }
    }
    });

  if (data.last_updated) document.getElementById("last-updated").textContent = data.last_updated;
  if (data.hero && data.hero.tags) UI.renderHeroTags(data.hero.tags);
  // Rendu des sections dynamiques
  UI.renderSection("publications", data.nav.publications, data.publications);
  UI.renderSection("scolarpath", data.nav.scolarpath, data.scolarpath);
  UI.renderSection("careerpath", data.nav.careerpath, data.careerpath);
  UI.renderSection("projects", data.nav.projects, data.projects);

  // --- 4. RESTAURATION DE LA POSITION ---
  // On attend que le navigateur ait fini de dessiner les nouvelles cartes
  // pour remettre l'utilisateur au bon endroit.
  setTimeout(() => {
    window.scrollTo({
      top: scrollPos,
      behavior: 'auto' // 'auto' est important pour que ce soit instantané sans animation
    });
  }, 50); // Un délai de 50ms suffit à stabiliser le DOM
}

// --- Initialisation ---
document.addEventListener("DOMContentLoaded", () => {
  loadPageContent(currentLang);

  document.getElementById("lang-switcher").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const newLang = e.target.getAttribute("data-lang");
      if (newLang !== currentLang) {
        currentLang = newLang;
        loadPageContent(newLang);
      }
    }
  });
});