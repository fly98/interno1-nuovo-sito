/* ---- Assistente virtuale InternoUno ---- */
(function(){
  var SLUG = window.IU_CHAT_SLUG || 'campaldino';
  var WORKER = 'https://wb-worker.f-castiglioni.workers.dev/wb/' + SLUG + '/chat';
  var history = [];

  // markup
  var btn = document.createElement('button');
  btn.id = 'iu-chat-btn';
  btn.setAttribute('aria-label', 'Chiedi a InternoUno');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  var panel = document.createElement('div');
  panel.id = 'iu-chat-panel';
  panel.innerHTML =
    '<div id="iu-chat-head">' +
      '<div><div class="title">Chiedi a InternoUno</div><div class="sub">Risposte immediate, in ogni lingua</div></div>' +
      '<button id="iu-chat-close" aria-label="Chiudi">✕</button>' +
    '</div>' +
    '<div id="iu-chat-log"></div>' +
    '<form id="iu-chat-form">' +
      '<input id="iu-chat-input" type="text" autocomplete="off" placeholder="Scrivi una domanda…">' +
      '<button id="iu-chat-send" type="submit" aria-label="Invia">➤</button>' +
    '</form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var log = panel.querySelector('#iu-chat-log');
  var form = panel.querySelector('#iu-chat-form');
  var input = panel.querySelector('#iu-chat-input');
  var sendBtn = panel.querySelector('#iu-chat-send');
  var closeBtn = panel.querySelector('#iu-chat-close');

  function addMsg(role, text){
    var div = document.createElement('div');
    div.className = 'iu-msg ' + (role === 'user' ? 'user' : 'bot');
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  var greeted = false;
  function openPanel(){
    panel.classList.add('open');
    if (!greeted){
      addMsg('bot', 'Ciao! Sono l\u2019assistente di InternoUno. Chiedimi qualsiasi cosa: camere, trasporti, quartiere, servizi.');
      greeted = true;
    }
    input.focus();
  }

  btn.addEventListener('click', function(){
    if (panel.classList.contains('open')){
      panel.classList.remove('open');
    } else {
      openPanel();
    }
  });
  closeBtn.addEventListener('click', function(){ panel.classList.remove('open'); });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    addMsg('user', text);
    history.push({ role:'user', content: text });
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    var typing = document.createElement('div');
    typing.className = 'iu-msg typing';
    typing.textContent = '…';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;

    var lang = (navigator.language || 'it').slice(0,2);

    fetch(WORKER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, lang: lang })
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      typing.remove();
      var reply = data.reply || 'Non sono riuscito a rispondere. Scrivici su WhatsApp!';
      addMsg('bot', reply);
      history.push({ role:'assistant', content: reply });
    })
    .catch(function(){
      typing.remove();
      addMsg('bot', 'Errore di connessione. Scrivici su WhatsApp per assistenza immediata!');
    })
    .finally(function(){
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    });
  });
})();
