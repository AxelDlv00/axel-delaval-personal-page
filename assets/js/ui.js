/**
 * Crée le HTML pour une carte
 * @param {Object} item - Données de l'élément
 * @param {number} index - Index pour le délai d'animation
 */
export function createCard(item, index = 0) {
    // 1. Gestion des Tags (String ou Objet {text, desc})
    const rawLabels = item.chips || item.tags || [];
    
    const labelHTML = rawLabels.length
      ? `<div class="card-footer">
           <div class="chips-container">
             ${rawLabels.map(label => {
               const isObject = typeof label === 'object';
               const text = isObject ? label.text : label;
               const desc = isObject ? label.desc : null;
               
               const tooltipAttr = desc ? `data-tooltip="${escapeHtml(desc)}"` : '';
               const styleClass = desc ? 'chip has-tooltip' : 'chip';

               return `<span class="${styleClass}" ${tooltipAttr}>${text}</span>`;
             }).join("")}
           </div>
         </div>`
      : "";
  
    // 2. Gestion du LOGO avec description personnalisée
    const logoTooltip = item.logo_desc || item.title;
    
    const logoHTML = item.logo
      ? `<div class="logo-wrapper" data-tooltip="${escapeHtml(logoTooltip)}">
            <img class="inline-logo" 
                 src="assets/img/logos/${item.logo}" 
                 alt="${item.title} logo" 
                 loading="lazy">
         </div>`
      : "";
  
    // 3. Gestion Média
    const mediaHTML = item.media
      ? `<img class="side-media" src="assets/img/${item.media}" alt="Media visual" loading="lazy">`
      : "";
  
    // Titre
    const titleHTML = item.link 
      ? `<a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>` 
      : item.title;
  
    // Animation cascade
    const animDelay = Math.min(index * 0.1, 0.5); 
  
    return `
      <div class="card slide-up-card" style="animation-delay: ${animDelay}s;">
        <div class="card-main">
          <div class="card-text">
            <h3>${titleHTML}</h3>
            ${item.meta ? `<p class="meta">${item.meta}</p>` : ""}
            <p class="desc">${item.desc}</p>
          </div>
          
          ${(item.logo || item.media) ? `
            <div class="visual-column">
              ${logoHTML}
              ${mediaHTML}
            </div>` : ""
          }
        </div>
        ${labelHTML}
      </div>
    `;
}

/**
 * Nettoie les chaînes pour éviter de casser le HTML
 */
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Injecte une section complète
 */
export function renderSection(containerId, title, items) {
  const container = document.getElementById(containerId);
  if (!container || !items) return;
  const cardsHTML = items.map((item, idx) => createCard(item, idx)).join("");
  container.innerHTML = `<h2>${title}</h2>` + cardsHTML;
}

/**
 * Met à jour les tags du Hero (Supporte aussi les objets)
 */
export function renderHeroTags(tags) {
  const container = document.getElementById("hero-tags");
  if (!container || !tags) return;
  
  container.innerHTML = tags.map(tag => {
      const isObject = typeof tag === 'object';
      const text = isObject ? tag.text : tag;
      const desc = isObject ? tag.desc : null;
      const tooltipAttr = desc ? `data-tooltip="${escapeHtml(desc)}"` : '';
      
      return `<span class="tag" ${tooltipAttr}>${text}</span>`;
  }).join("");
}