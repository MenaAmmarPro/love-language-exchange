"use strict";

(function () {
  var KEY = "mena-langx";

  var PHRASES = [
    { slug: "hello", urdu: "\u0633\u0644\u0627\u0645", roman: "Salaam", romanian: "Bun\u0103", english: "Hello" },
    { slug: "thank-you", urdu: "\u0634\u06a9\u0631\u06cc\u06c1", roman: "Shukriya", romanian: "Mul\u021bumesc", english: "Thank you" },
    { slug: "i-love-you", urdu: "\u0645\u06cc\u06ba \u062a\u0645 \u0633\u06d2 \u0645\u062d\u0628\u062a \u06a9\u0631\u062a\u0627 \u06c1\u0648\u06ba", roman: "Main tum se muhabbat karta hoon", romanian: "Te iubesc", english: "I love you" },
    { slug: "good-morning", urdu: "\u0635\u0628\u062d \u0628\u062e\u06cc\u0631", roman: "Subah bakhair", romanian: "Bun\u0103 diminea\u021ba", english: "Good morning" },
    { slug: "good-night", urdu: "\u0634\u0628 \u0628\u062e\u06cc\u0631", roman: "Shab bakhair", romanian: "Noapte bun\u0103", english: "Good night" },
    { slug: "how-are-you", urdu: "\u06a9\u06cc\u0633\u06d2 \u06c1\u0648\u061f", roman: "Kaise ho?", romanian: "Ce faci?", english: "How are you?" },
    { slug: "i-miss-you", urdu: "\u062a\u0645\u06c1\u0627\u0631\u06cc \u06cc\u0627\u062f \u0622\u062a\u06cc \u06c1\u06d2", roman: "Tumhari yaad aati hai", romanian: "Mi-e dor de tine", english: "I miss you" },
    { slug: "yes", urdu: "\u06c1\u0627\u06ba", roman: "Haan", romanian: "Da", english: "Yes" },
    { slug: "no", urdu: "\u0646\u06c1\u06cc\u06ba", roman: "Nahi", romanian: "Nu", english: "No" },
    { slug: "please", urdu: "\u0628\u0631\u0627\u06c1 \u06a9\u0631\u0645", roman: "Bara-e-karam", romanian: "Te rog", english: "Please" },
    { slug: "sorry", urdu: "\u0645\u0639\u0627\u0641 \u06a9\u06cc\u062c\u06cc\u06d2", roman: "Maaf kijiye", romanian: "\u00cemi pare r\u0103u", english: "Sorry" },
    { slug: "water", urdu: "\u067e\u0627\u0646\u06cc", roman: "Paani", romanian: "Ap\u0103", english: "Water" },
    { slug: "food", urdu: "\u06a9\u06be\u0627\u0646\u0627", roman: "Khana", romanian: "M\u00e2ncare", english: "Food" },
    { slug: "beautiful", urdu: "\u062e\u0648\u0628\u0635\u0648\u0631\u062a", roman: "Khoobsurat", romanian: "Frumos", english: "Beautiful" },
    { slug: "my-love", urdu: "\u0645\u06cc\u0631\u06cc \u062c\u0627\u0646", roman: "Meri jaan", romanian: "Iubirea mea", english: "My love" },
    { slug: "see-you-soon", urdu: "\u067e\u06be\u0631 \u0645\u0644\u06cc\u06ba \u06af\u06d2", roman: "Phir milenge", romanian: "Pe cur\u00e2nd", english: "See you soon" },
    { slug: "take-care", urdu: "\u0627\u067e\u0646\u0627 \u062e\u06cc\u0627\u0644 \u0631\u06a9\u06be\u0646\u0627", roman: "Apna khayal rakhna", romanian: "Ai grij\u0103 de tine", english: "Take care" },
    { slug: "sweet-dreams", urdu: "\u0645\u06cc\u0679\u06be\u06d2 \u062e\u0648\u0627\u0628", roman: "Meethe khwab", romanian: "Vise pl\u0103cute", english: "Sweet dreams" }
  ];

  function $(id) { return document.getElementById(id); }

  var els = {
    sentNote: $("sent-note"),
    grid: $("phrase-grid"),
    quizUrdu: $("quiz-urdu"),
    quizOptions: $("quiz-options"),
    quizFeedback: $("quiz-feedback"),
    quizScore: $("quiz-score"),
    quizNext: $("quiz-next"),
    share: $("share"),
    note: $("note")
  };

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return { score: 0, best: 0 };
      var data = JSON.parse(raw);
      return {
        score: data && typeof data.score === "number" ? data.score : 0,
        best: data && typeof data.best === "number" ? data.best : 0
      };
    } catch (e) {
      return { score: 0, best: 0 };
    }
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = load();
  var currentQuiz = null;

  function bySlug(slug) {
    for (var i = 0; i < PHRASES.length; i++) { if (PHRASES[i].slug === slug) return PHRASES[i]; }
    return null;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function flip(card) {
    if (card.className.indexOf("flipped") >= 0) { card.className = "phrase-card"; }
    else { card.className = "phrase-card flipped"; }
  }

  function renderBook() {
    els.grid.textContent = "";
    for (var i = 0; i < PHRASES.length; i++) {
      var p = PHRASES[i];
      var card = document.createElement("button");
      card.type = "button";
      card.className = "phrase-card";
      card.setAttribute("data-slug", p.slug);

      var front = document.createElement("span");
      front.className = "phrase-front";
      var urdu = document.createElement("span");
      urdu.className = "phrase-urdu";
      urdu.setAttribute("dir", "rtl");
      urdu.textContent = p.urdu;
      var roman = document.createElement("span");
      roman.className = "phrase-roman";
      roman.textContent = p.roman;
      front.appendChild(urdu);
      front.appendChild(roman);

      var back = document.createElement("span");
      back.className = "phrase-back";
      var romanian = document.createElement("span");
      romanian.className = "phrase-romanian";
      romanian.textContent = p.romanian;
      var english = document.createElement("span");
      english.className = "phrase-english";
      english.textContent = p.english;
      back.appendChild(romanian);
      back.appendChild(english);

      card.appendChild(front);
      card.appendChild(back);
      (function (el) {
        card.addEventListener("click", function () { flip(el); });
      })(card);

      els.grid.appendChild(card);
    }
  }

  function newQuestion() {
    var q = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    currentQuiz = q;
    els.quizUrdu.textContent = q.urdu;

    var others = PHRASES.filter(function (p) { return p.slug !== q.slug; });
    shuffle(others);
    var opts = shuffle([q].concat(others.slice(0, Math.min(3, others.length))));

    els.quizOptions.textContent = "";
    for (var i = 0; i < opts.length; i++) {
      var o = opts[i];
      var b = document.createElement("button");
      b.type = "button";
      b.className = "quiz-option";
      b.textContent = o.romanian;
      (function (choice) {
        b.addEventListener("click", function () { answer(choice); });
      })(o);
      els.quizOptions.appendChild(b);
    }
    els.quizFeedback.textContent = "\u00a0";
  }

  function answer(choice) {
    var q = currentQuiz;
    if (!q) return;
    if (choice.slug === q.slug) {
      state.score++;
      if (state.score > state.best) state.best = state.score;
      save(state);
      els.quizScore.textContent = String(state.score);
      els.quizFeedback.textContent = "Corect! \u2713  " + q.urdu + " = " + q.romanian + " (" + q.english + ")";
    } else {
      els.quizFeedback.textContent = "Not quite \u2014 it\u2019s \u201c" + q.romanian + "\u201d (" + q.english + ")";
    }
  }

  function copy(text, message) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { els.note.textContent = message; },
        function () { els.note.textContent = text; }
      );
    } else {
      els.note.textContent = text;
    }
  }

  function share() {
    var slug = currentQuiz ? currentQuiz.slug : PHRASES[Math.floor(Math.random() * PHRASES.length)].slug;
    var link = window.location.origin + window.location.pathname + "?word=" + encodeURIComponent(slug);
    copy(link, "Phrase link copied \u2014 send it to Ammar.");
  }

  function arrival() {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("word");
    if (!slug) return;
    var p = bySlug(slug);
    if (!p) return;
    els.sentNote.hidden = false;
    els.sentNote.textContent = "\u2665 Ammar sent you a phrase: " + p.urdu + " \u2014 " + p.romanian + " (" + p.english + ")";
    var cards = els.grid.children;
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute("data-slug") === slug) { cards[i].className = "phrase-card flipped"; }
    }
  }

  function init() {
    renderBook();
    newQuestion();
    els.quizScore.textContent = String(state.score);
    arrival();
    if (els.quizNext) els.quizNext.addEventListener("click", newQuestion);
    if (els.share) els.share.addEventListener("click", share);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
