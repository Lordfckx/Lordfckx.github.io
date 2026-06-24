(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var explorer = document.getElementById('explorer');
  var scrim = document.getElementById('scrim');
  var menu = document.querySelector('.titlebar__menu');
  function closeRail() {
    if (!explorer) return;
    explorer.classList.remove('open');
    if (scrim) scrim.classList.remove('show');
  }
  if (menu && explorer) {
    menu.addEventListener('click', function () {
      explorer.classList.toggle('open');
      if (scrim) scrim.classList.toggle('show');
    });
  }
  if (scrim) scrim.addEventListener('click', closeRail);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeRail(); });
  document.querySelectorAll('.tree__item').forEach(function (a) { a.addEventListener('click', closeRail); });

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  document.querySelectorAll('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function () {
      var text = el.getAttribute('data-copy');
      var lbl = el.querySelector('.lbl');
      var orig = lbl ? lbl.textContent : '';
      var done = function () {
        el.classList.add('copied');
        if (lbl) lbl.textContent = '· copied';
        setTimeout(function () { el.classList.remove('copied'); if (lbl) lbl.textContent = orig; }, 1500);
      };
      if (navigator.clipboard) { navigator.clipboard.writeText(text).then(done, done); } else { done(); }
    });
  });

  var typer = document.querySelector('[data-type]');
  if (typer && !reduced) {
    var full = typer.innerHTML, plain = typer.getAttribute('data-type'), i = 0;
    typer.textContent = '';
    var t = setInterval(function () {
      i++; typer.textContent = plain.slice(0, i);
      if (i >= plain.length) { clearInterval(t); typer.innerHTML = full; }
    }, 26);
  }

  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          el.style.transitionDelay = (parseInt(el.dataset.delay || 0, 10)) + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }
})();
