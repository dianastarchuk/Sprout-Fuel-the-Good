/* ==========================================================================
   SPROUT - theme.js
   --------------------------------------------------------------------------
   The dark theme itself is entirely CSS: every colour token in tokens.css is
   a light-dark() pair, and `color-scheme` decides which half is used. All
   this file does is write one attribute:

     no [data-theme]        color-scheme: light dark   follow the OS
     [data-theme="light"]   color-scheme: light
     [data-theme="dark"]    color-scheme: dark

   Three modes, not two. "Auto" is a real setting - it is the one that keeps
   tracking the OS after sunset - and a two-way switch has no way back to it
   once it has been touched, so the toggle cycles auto -> light -> dark.

   LOAD IT IN <head>, WITHOUT defer. The first statement below runs while the
   document is still parsing, so the attribute is on <html> before anything
   paints. Deferred, a stored dark preference would land after the browser
   had already drawn a light page, and every load would start with a flash.

   Markup contract:
     <button type="button" class="theme-toggle" data-theme-toggle>
       <svg class="icon theme-toggle__icon theme-toggle__icon--auto">...
       <svg class="icon theme-toggle__icon theme-toggle__icon--light">...
       <svg class="icon theme-toggle__icon theme-toggle__icon--dark">...
       <span class="theme-toggle__label"></span>
     </button>
   The button needs no state in the HTML: this file writes data-theme-mode,
   the label and the accessible name. CSS shows the icon matching the mode.

   A screen with room for the setting itself uses the second form - three
   named options rather than one cycling button:

     <div class="segmented segmented--block" role="radiogroup"
          aria-label="Appearance" data-theme-choice>
       <button type="button" class="segmented__option" role="radio"
               data-theme-set="auto">...</button>
       ... light, dark ...
     </div>
   Same contract: no state in the HTML. This file writes aria-checked and the
   roving tabindex, and moves the selection on the arrow keys. Both forms are
   driven by the same `current`, so a page may carry one, the other, or both
   and they stay in step.
   ========================================================================== */
(function () {
  var KEY = 'sprout-theme';
  var MODES = ['auto', 'light', 'dark'];
  var LABELS = { auto: 'Auto', light: 'Light', dark: 'Dark' };
  var STEPS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

  function stored() {
    /* Private browsing and file:// in some browsers throw on access rather
       than returning null, and a theme is not worth breaking a page over. */
    try {
      var v = window.localStorage.getItem(KEY);
      return MODES.indexOf(v) > -1 ? v : 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function apply(mode) {
    var root = document.documentElement;
    if (mode === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
  }

  /* Runs during head parsing - before the first paint, and before <body>
     exists. Only the root element is touched here. */
  var current = stored();
  apply(current);

  function sync() {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    var next = MODES[(MODES.indexOf(current) + 1) % MODES.length];
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      b.setAttribute('data-theme-mode', current);
      var label = b.querySelector('.theme-toggle__label');
      if (label) label.textContent = LABELS[current];
      /* The visible label says where you are; the accessible name has to say
         that AND where the next press goes, because a screen-reader user
         gets no preview from the icon. */
      b.setAttribute('aria-label',
        'Theme: ' + LABELS[current] + '. Switch to ' + LABELS[next] + '.');
    }

    /* The three-option form. A radiogroup is a single tab stop: the checked
       option is the one Tab reaches, and the arrow keys move from there. */
    var options = document.querySelectorAll('[data-theme-set]');
    for (var j = 0; j < options.length; j++) {
      var on = options[j].getAttribute('data-theme-set') === current;
      options[j].setAttribute('aria-checked', on ? 'true' : 'false');
      options[j].tabIndex = on ? 0 : -1;
    }
  }

  function set(mode) {
    current = mode;
    apply(mode);
    try {
      if (mode === 'auto') window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, mode);
    } catch (e) { /* storage unavailable; the mode still holds for this page */ }
    sync();
  }

  function wire() {
    sync();
    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      /* A named option says which mode; the cycling button only says "next". */
      var option = e.target.closest('[data-theme-set]');
      if (option) {
        set(option.getAttribute('data-theme-set'));
        return;
      }
      if (e.target.closest('[data-theme-toggle]')) {
        set(MODES[(MODES.indexOf(current) + 1) % MODES.length]);
      }
    });

    /* Arrow keys inside a radiogroup move the selection, not just the focus -
       that is what makes the group one tab stop rather than three. */
    document.addEventListener('keydown', function (e) {
      var step = STEPS[e.key];
      if (!step || !e.target.closest) return;
      var group = e.target.closest('[data-theme-choice]');
      if (!group) return;
      var options = group.querySelectorAll('[data-theme-set]');
      if (!options.length) return;
      e.preventDefault();
      var from = Array.prototype.indexOf.call(options, e.target.closest('[data-theme-set]'));
      if (from < 0) from = 0;
      var to = options[(from + step + options.length) % options.length];
      set(to.getAttribute('data-theme-set'));
      to.focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  /* Another tab changed the preference. Only act on our own key: a null key
     means the whole store was cleared, which is not a theme decision. */
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    current = stored();
    apply(current);
    sync();
  });
})();
