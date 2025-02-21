import handleFiles from "./js/handleFiles";
import { openModal, closeModal, closeAllModals } from "./js/modals";

document.addEventListener('DOMContentLoaded', () => {

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');
    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    if(event.key === "Escape") {
      closeAllModals();
    }
  });

  // Get all "navbar-burger" elements
  (document.querySelectorAll('.navbar-burger') || []).forEach( el => {
    el.addEventListener('click', () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  });
  
});

(document.getElementById('fit2labradar') as HTMLFormElement).addEventListener("change", handleFiles ,false);
(document.getElementById('csv2labradar') as HTMLFormElement).addEventListener("change", handleFiles, false);
(document.getElementById('xls2labradar') as HTMLFormElement).addEventListener("change", handleFiles, false);