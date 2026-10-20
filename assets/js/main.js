/* Welfix — shared site behaviour */
(function(){
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA = "250787011730";
  var FORM = "https://formspree.io/f/mvgwgepj";

  function store(k, v){ try{ if(v === undefined) return sessionStorage.getItem(k); if(v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); }catch(e){ return null; } }

  /* ---------- Page transition: blue F sweep ---------- */
  var wipe = document.querySelector(".wipe");
  if(wipe && !reduce){
    if(store("wfx-wipe") === "1"){
      store("wfx-wipe", null);
      wipe.classList.add("is-revealing");
      setTimeout(function(){ wipe.classList.remove("is-revealing"); }, 800);
    }
    document.addEventListener("click", function(e){
      var a = e.target.closest && e.target.closest("a[href]");
      if(!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if(a.target && a.target !== "_self") return;
      if(a.hasAttribute("download")) return;
      var url;
      try{ url = new URL(a.href, location.href); }catch(err){ return; }
      if(url.origin !== location.origin) return;
      if(!/\.html$|\/$/.test(url.pathname)) return;
      if(url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      wipe.classList.remove("is-revealing");
      wipe.classList.add("is-covering");
      store("wfx-wipe", "1");
      setTimeout(function(){ location.href = url.href; }, 520);
    });
    window.addEventListener("pageshow", function(ev){
      if(ev.persisted){ wipe.classList.remove("is-covering"); wipe.classList.remove("is-revealing"); store("wfx-wipe", null); }
    });
  }

  /* ---------- Header ---------- */
  var head = document.querySelector(".site-head");
  function onScroll(){ if(head) head.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if(menuBtn && nav){
    menuBtn.addEventListener("click", function(){
      var open = menuBtn.getAttribute("aria-expanded") !== "true";
      menuBtn.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && nav.classList.contains("is-open")){ menuBtn.click(); menuBtn.focus(); }
    });
  }

  /* ---------- Heading reveals ---------- */
  var revealEls = document.querySelectorAll("[data-reveal], .mock-reveal");
  if("IntersectionObserver" in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, {rootMargin:"0px 0px -12% 0px"});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-in"); });
  }

  /* ---------- Logo carousel: duplicate the list for a seamless loop ---------- */
  document.querySelectorAll(".logos").forEach(function(band){
    var track = band.querySelector(".logos-track");
    Array.prototype.slice.call(track.children).forEach(function(li){
      var c = li.cloneNode(true); c.setAttribute("aria-hidden","true");
      var img = c.querySelector("img"); if(img) img.alt = "";
      track.appendChild(c);
    });
  });

  /* ---------- Footer year + newsletter ---------- */
  document.querySelectorAll("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });
  document.querySelectorAll("form.news").forEach(function(f){
    f.addEventListener("submit", function(e){
      e.preventDefault();
      var msg = f.parentNode.querySelector(".news-msg");
      var email = f.querySelector("input[type=email]");
      if(!email.value || !email.checkValidity()){ msg.textContent = "Enter a valid email address."; email.focus(); return; }
      msg.textContent = "Subscribing…";
      fetch(FORM, {method:"POST", body:new FormData(f), headers:{Accept:"application/json"}})
        .then(function(r){ msg.textContent = r.ok ? "Subscribed. Updates will reach " + email.value + "." : "That didn't go through. Email us at welfix.sol@gmail.com instead."; if(r.ok) f.reset(); })
        .catch(function(){ msg.textContent = "No connection. Try again in a moment."; });
    });
  });

  /* ---------- Quick help drawer ---------- */
  var helpBtn = document.querySelector(".help-btn");
  var help = document.getElementById("help");
  if(helpBtn && help){
    var body = help.querySelector(".help-body");
    var answers = {
      services: "We build operations systems, websites and online shops, QR solutions, AI and automation, and run social media and content. <a href='services.html'>See all services</a>.",
      platforms: "Live now: Fleet Guard (logistics), MyRequest (request approvals and payments), Cura Menu (restaurants) and Gym QR Login (gyms). Coming next: Eagle View, Washly and Veloce. <a href='platforms.html'>Try the demos</a>.",
      pricing: "Monthly packages start at $299 (Starter), $699 (Professional) and $1,299 (Enterprise). Operations systems and AI are quoted per project. <a href='services.html#pricing'>Compare plans</a>.",
      contact: "Fastest is WhatsApp: <a target='_blank' rel='noopener' href='https://wa.me/" + WA + "'>+250 787 011 730</a>. Or <a href='contact.html'>send us a project brief</a> and we reply within 24 hours on working days."
    };
    function add(html, me){
      var p = document.createElement("p");
      p.className = "help-msg" + (me ? " me" : "");
      if(me) p.textContent = html; else p.innerHTML = html;
      body.appendChild(p); body.scrollTop = body.scrollHeight;
    }
    function setOpen(open){
      help.classList.toggle("is-open", open);
      helpBtn.setAttribute("aria-expanded", String(open));
      if(open){ setTimeout(function(){ var i = help.querySelector("input"); if(i) i.focus(); }, 60); }
    }
    helpBtn.addEventListener("click", function(){ setOpen(!help.classList.contains("is-open")); });
    help.querySelector(".help-close").addEventListener("click", function(){ setOpen(false); helpBtn.focus(); });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape" && help.classList.contains("is-open")){ setOpen(false); helpBtn.focus(); } });
    help.querySelectorAll("[data-q]").forEach(function(b){
      b.addEventListener("click", function(){ add(b.textContent, true); add(answers[b.getAttribute("data-q")]); });
    });
    help.querySelector(".help-form").addEventListener("submit", function(e){
      e.preventDefault();
      var input = this.querySelector("input"); var q = input.value.trim(); if(!q) return;
      add(q, true); input.value = "";
      var t = q.toLowerCase(), key = null;
      if(/price|cost|how much|pay|package|plan/.test(t)) key = "pricing";
      else if(/fleet|truck|menu|restaurant|gym|qr|platform|demo|request|approval|eagle|track|washly|laundry|veloce|print|riza|interior/.test(t)) key = "platforms";
      else if(/service|website|web|shop|ai|social|seo|blog|consult/.test(t)) key = "services";
      else if(/contact|call|phone|email|whatsapp|talk|meet/.test(t)) key = "contact";
      if(key){ add(answers[key]); }
      else {
        add("A person should answer that. <a target='_blank' rel='noopener' href='https://wa.me/" + WA + "?text=" + encodeURIComponent("Hello Welfix, " + q) + "'>Send this question on WhatsApp</a>, and the team replies Mon–Fri, 9AM–6PM.");
      }
    });
  }
})();
