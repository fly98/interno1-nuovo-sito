/* ===== Motore di traduzione InternoUno ===== */
(function(){
  var LANGS = ['it','en','es','fr','de','pt','zh'];
  var LABELS = { it:'Italiano', en:'English', es:'Español', fr:'Français', de:'Deutsch', pt:'Português', zh:'中文' };
  var STORAGE_KEY = 'iu_lang';

  // rileva la lingua: 1) scelta salvata  2) lingua browser  3) inglese
  function detectLang(){
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch(e){}
    var nav = (navigator.language || 'en').slice(0,2).toLowerCase();
    if (LANGS.indexOf(nav) !== -1) return nav;
    return 'en';
  }

  function saveLang(lang){
    try { localStorage.setItem(STORAGE_KEY, lang); } catch(e){}
  }

  // applica le traduzioni a tutti gli elementi con data-i18n
  function apply(lang){
    var dict = (window.IU_I18N && window.IU_I18N[lang]) || {};
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var val = dict[key];
      if (val != null){
        if (el.hasAttribute('data-i18n-html')) el.innerHTML = val;
        else el.textContent = val;
      }
    });
    // attributi speciali: placeholder, aria-label, title
    document.querySelectorAll('[data-i18n-attr]').forEach(function(el){
      var spec = el.getAttribute('data-i18n-attr'); // es. "placeholder:chiave"
      spec.split(',').forEach(function(pair){
        var parts = pair.split(':');
        if (parts.length === 2){
          var attr = parts[0].trim(), key = parts[1].trim();
          if (dict[key] != null) el.setAttribute(attr, dict[key]);
        }
      });
    });
    document.documentElement.setAttribute('lang', lang);
  }

  function setLang(lang){
    if (LANGS.indexOf(lang) === -1) return;
    window.IU_CURRENT_LANG = lang;
    saveLang(lang);
    apply(lang);
    // aggiorna l'etichetta del selettore
    var cur = document.getElementById('iu-lang-current');
    if (cur) cur.textContent = lang.toUpperCase();
    // avvisa il resto della pagina (es. contenuti dinamici come gli eventi) che la lingua è cambiata
    try {
      document.dispatchEvent(new CustomEvent('iu:langchange', { detail: { lang: lang } }));
    } catch(e){}
  }

  // costruisce il selettore lingua nell'header
  function buildSwitcher(){
    var mount = document.getElementById('iu-lang-switch');
    if (!mount) return;
    var btn = document.createElement('button');
    btn.id = 'iu-lang-btn';
    btn.type = 'button';
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z"/></svg><span id="iu-lang-current">' + (window.IU_CURRENT_LANG||'it').toUpperCase() + '</span>';
    var menu = document.createElement('div');
    menu.id = 'iu-lang-menu';
    LANGS.forEach(function(l){
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'iu-lang-opt';
      item.textContent = LABELS[l];
      item.setAttribute('data-lang', l);
      item.addEventListener('click', function(){
        setLang(l);
        menu.classList.remove('open');
      });
      menu.appendChild(item);
    });
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', function(){ menu.classList.remove('open'); });
    mount.appendChild(btn);
    mount.appendChild(menu);
  }

  function init(){
    window.IU_CURRENT_LANG = detectLang();
    buildSwitcher();
    apply(window.IU_CURRENT_LANG);
    var cur = document.getElementById('iu-lang-current');
    if (cur) cur.textContent = window.IU_CURRENT_LANG.toUpperCase();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // espone setLang globalmente se servisse
  window.IU_setLang = setLang;
})();
