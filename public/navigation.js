(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-navigation');
  const smallScreen = window.matchMedia('(max-width: 850px)');

  if (!header || !toggle || !navigation) return;

  function setOpen(open) {
    const expanded = open && smallScreen.matches;
    header.classList.toggle('menu-open', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    const label = expanded ? 'Close navigation menu' : 'Open navigation menu';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !smallScreen.matches) return;
    setOpen(false);

    // Move keyboard focus to the destination before its link is hidden.
    const target = document.getElementById(link.hash.slice(1));
    if (target) {
      const hadTabIndex = target.hasAttribute('tabindex');
      if (!hadTabIndex) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (!hadTabIndex) {
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus({ preventScroll: true });
    }
  });

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) {
      const focusWasInMenu = navigation.contains(document.activeElement);
      setOpen(false);
      if (smallScreen.matches && focusWasInMenu) toggle.focus({ preventScroll: true });
    }
  });

  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) {
      setOpen(false);
    } else if (!event.relatedTarget) {
      // CSS can hide the focused control before the matchMedia change event runs.
      const hiddenToggle = event.target === toggle && !smallScreen.matches;
      const hiddenLink = navigation.contains(event.target) && smallScreen.matches &&
        !header.classList.contains('menu-open');
      if (hiddenToggle || hiddenLink) {
        const destination = smallScreen.matches ? toggle : navigation.querySelector('a');
        destination.focus({ preventScroll: true });
      }
    }
  });

  smallScreen.addEventListener('change', () => {
    const active = document.activeElement;
    setOpen(false);
    if (smallScreen.matches && navigation.contains(active)) {
      toggle.focus({ preventScroll: true });
    } else if (!smallScreen.matches && active === toggle) {
      navigation.querySelector('a').focus({ preventScroll: true });
    }
  });

  // Keep navigation visible if JavaScript is unavailable.
  setOpen(false);
  toggle.hidden = false;
  header.classList.add('menu-ready');
})();
