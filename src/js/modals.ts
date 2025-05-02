
  // Functions to open and close a modal
export function openModal($el:Element) {
  $el.classList.add('is-active');
}

export function closeModal($el:Element) {
  var shareButton = document.getElementById('dl-share');
  shareButton = shareButton.cloneNode(true) as HTMLElement
  var dlButton = document.getElementById('dl-store');
  dlButton = dlButton.cloneNode(true) as HTMLElement
  $el.classList.remove('is-active');
}

export function closeAllModals() {
  (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
  });
}