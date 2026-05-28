(function () {
  var btn = document.getElementById('speakBtn');
  if (!btn) return;
  var label = document.getElementById('speakLabel');
  var text = btn.getAttribute('data-speak');
  var speaking = false;

  if (!('speechSynthesis' in window)) {
    if (label) label.textContent = 'no compatible';
    btn.disabled = true;
    return;
  }

  // macOS/iOS のジョーク系・低品質音声（Eddy/Flo 等）を避ける
  function isNovelty(name) {
    var n = (name || '').toLowerCase();
    var bad = ['eddy', 'flo', 'grandma', 'grandpa', 'reed', 'rocko', 'sandy', 'shelley',
      'bahh', 'albert', 'bells', 'boing', 'bubbles', 'cellos', 'jester', 'junior',
      'kathy', 'organ', 'superstar', 'trinoids', 'whisper', 'wobble', 'zarvox', 'fred'];
    for (var i = 0; i < bad.length; i++) { if (n.indexOf(bad[i]) >= 0) return true; }
    return false;
  }

  function pickVoice() {
    var voices = window.speechSynthesis.getVoices() || [];
    var prefs = ['es-mx', 'es-419', 'es-us', 'es-ar', 'es-co', 'es-es', 'es'];
    for (var i = 0; i < prefs.length; i++) {
      for (var j = 0; j < voices.length; j++) {
        var lang = (voices[j].lang || '').toLowerCase();
        if (lang.indexOf(prefs[i]) === 0 && !isNovelty(voices[j].name)) return voices[j];
      }
    }
    for (var k = 0; k < prefs.length; k++) {
      for (var m = 0; m < voices.length; m++) {
        var lang2 = (voices[m].lang || '').toLowerCase();
        if (lang2.indexOf(prefs[k]) === 0) return voices[m];
      }
    }
    return null;
  }

  function speak() {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-MX';
    u.rate = 0.9;
    u.pitch = 1.05;
    u.volume = 1.0;
    var v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    u.onstart = function () { speaking = true; if (label) label.textContent = 'escuchando…'; };
    u.onend = function () { speaking = false; if (label) label.textContent = 'escuchar'; };
    u.onerror = function () { speaking = false; if (label) label.textContent = 'escuchar'; };
    window.speechSynthesis.speak(u);
  }

  btn.addEventListener('click', function () {
    if (speaking) {
      window.speechSynthesis.cancel();
      speaking = false;
      if (label) label.textContent = 'escuchar';
      return;
    }
    speak();
  });

  // カード領域をタップで音声ボタンを隠す/出す（スクショ用）
  var bar = document.querySelector('.audio-bar');
  var card = document.querySelector('.card');
  if (card && bar) card.addEventListener('click', function () { bar.classList.toggle('hidden'); });

  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = function () { pickVoice(); };
  }
})();
