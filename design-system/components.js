/* ==========================================================================
   SPROUT - components.js
   --------------------------------------------------------------------------
   The only behaviour the component layer needs: opening a native <dialog>.

   Everything else a modal has to do - the top layer, the focus trap, Esc to
   close, making the page behind it inert - the browser already does once the
   dialog is opened with showModal(). Closing is declarative too: any control
   inside a <form method="dialog"> closes its dialog with no script at all.

   Usage:
     <button data-modal-open="streak-modal">...</button>
     <dialog class="modal" id="streak-modal">...</dialog>

   The listener is delegated from the document, so markup added later works
   without re-running anything.
   ========================================================================== */
(function () {
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-open]');
    if (trigger) {
      var dialog = document.getElementById(trigger.getAttribute('data-modal-open'));
      /* Browsers without <dialog> leave the badge inert rather than showing a
         half-styled panel - the streak is already readable in the badge. */
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
      return;
    }

    /* A click on the backdrop is reported on the <dialog> itself, because the
       dialog box measures exactly its panel child. Anything inside the panel
       targets the panel, so this only fires for the dim area around it. */
    var open = e.target.closest('dialog.modal');
    if (open && e.target === open) open.close();
  });
})();
