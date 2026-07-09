/* ---- Effetti a comparsa on-scroll ---- */
(function(){
  // selettori dei "box" da animare, comuni alle varie pagine
  var SELECTORS = [
    '.camera-card','.review-card','.direzione-box','.roma-card','.tour-card',
    '.serv-card','.rist-card','.info-acc','.perche-item','.struttura',
    '.numero-item','.warning-box','.contact-form','.soglia-frame',
    '.dicono-di-noi','.rating-badge'
  ];
  var els = [];
  SELECTORS.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){ els.push(el); });
  });
  if (!els.length) return;

  els.forEach(function(el){ el.classList.add('reveal-on'); });

  if (!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        // piccolo stagger in base alla posizione
        var el = entry.target;
        el.style.transitionDelay = (Math.random()*0.15).toFixed(2) + 's';
        el.classList.add('is-visible');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function(el){ io.observe(el); });
})();
