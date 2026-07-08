(function () {
  "use strict";

  if (!("speechSynthesis" in window)) return;

  var synth = window.speechSynthesis;
  var activeBtn = null;

  function stripForSpeech(text) {
    return text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getReviewText(card) {
    var body = card.querySelector(".review-body");
    if (!body) return "";
    var paragraphs = body.querySelectorAll("p");
    var parts = [];
    paragraphs.forEach(function (p) {
      var t = stripForSpeech(p.textContent);
      if (t) parts.push(t);
    });
    return parts.join(". ");
  }

  var ICON_PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="4" height="14"></rect><rect x="14" y="5" width="4" height="14"></rect></svg>';

  function resetButton(btn) {
    if (!btn) return;
    btn.classList.remove("is-playing", "is-paused");
    btn.innerHTML = ICON_PLAY;
    btn.setAttribute("aria-label", "Listen to this review");
    btn.title = "Listen to this review";
  }

  function stopActive() {
    synth.cancel();
    resetButton(activeBtn);
    activeBtn = null;
  }

  function buildButton(card) {
    var btn = document.createElement("button");
    btn.className = "listen-btn";
    btn.type = "button";
    resetButton(btn);

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isThisActive = activeBtn === btn;

      if (isThisActive && synth.speaking && !synth.paused) {
        synth.pause();
        btn.classList.add("is-paused");
        btn.classList.remove("is-playing");
        btn.innerHTML = ICON_PLAY;
        btn.title = "Resume narration";
        return;
      }
      if (isThisActive && synth.paused) {
        synth.resume();
        btn.classList.remove("is-paused");
        btn.classList.add("is-playing");
        btn.innerHTML = ICON_PAUSE;
        btn.title = "Pause narration";
        return;
      }

      stopActive();

      var text = getReviewText(card);
      if (!text) return;

      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1;
      utter.pitch = 1;

      utter.onstart = function () {
        btn.classList.add("is-playing");
        btn.innerHTML = ICON_PAUSE;
        btn.setAttribute("aria-label", "Pause narration");
        btn.title = "Pause narration";
      };
      utter.onend = utter.onerror = function () {
        resetButton(btn);
        if (activeBtn === btn) activeBtn = null;
      };

      activeBtn = btn;
      synth.speak(utter);
    });

    return btn;
  }

  function initReviewCards() {
    document.querySelectorAll(".review-card").forEach(function (card) {
      var actions = card.querySelector(".card-actions");
      if (!actions || actions.querySelector(".listen-btn")) return;
      var btn = buildButton(card);
      actions.insertBefore(btn, actions.firstChild);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReviewCards);
  } else {
    initReviewCards();
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".tab-btn")) setTimeout(initReviewCards, 50);
  });

  window.addEventListener("beforeunload", function () {
    synth.cancel();
  });
})();
