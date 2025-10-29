/* =========================================================
   EXPANDABLE SECTION HANDLER
   ---------------------------------------------------------
   This script adds interactive "See More / Show Less" behavior
   for each <section> on the page that contains:
     - a `.see-more` button
     - an `.extra` container (hidden cards)
     - a `.count` element (displays total card count)

   Workflow:
     1. Iterate through all <section> elements.
     2. Identify their visible and hidden card counts.
     3. Display total card count inside `.count`.
     4. Toggle visibility of `.extra` when the button is clicked.
   ========================================================= */

document.querySelectorAll("section").forEach(section => {
  // ---------------------------------------------------------
  // Locate section elements: the hidden area, the button, and the counter
  // ---------------------------------------------------------
  const extra = section.querySelector(".extra");      // Hidden container for extra cards
  const btn = section.querySelector(".see-more");     // "See more" / "Show less" button
  const count = section.querySelector(".count");      // Element showing total number of items

  // Skip this section if either the hidden content or button is missing
  if (!extra || !btn) return;

  // ---------------------------------------------------------
  // Compute number of visible and hidden cards
  // ---------------------------------------------------------
  const visibleCount = section.querySelectorAll(".card:not(.extra .card)").length;  // Cards always visible
  const hiddenCount = extra.querySelectorAll(".card").length;                       // Cards inside the hidden area
  const total = visibleCount + hiddenCount;                                         // Total number of cards

  // Update counter text, e.g. "(12)"
  count.textContent = `(${total})`;

  // ---------------------------------------------------------
  // Toggle button interaction
  // ---------------------------------------------------------
  btn.addEventListener("click", () => {
    // Toggle the "open" class on the hidden area
    const isOpen = extra.classList.toggle("open");

    // Update button label depending on state
    // If expanded → show "Show less"
    // If collapsed → show "+X more"
    btn.textContent = isOpen ? "Show less" : `+${hiddenCount} more`;
  });
});
