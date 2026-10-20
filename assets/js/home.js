/* Home: the gap track. Pick a business, see where it breaks, watch the fix slot in. */
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DATA = [
    { key:"restaurant", label:"Restaurant",
      steps:[["Guest sits down","Table 7"],["Reads the menu","Paper menu"],["Order reaches the kitchen","Waiter"],["Pays and leaves","Cashier"]],
      gap:1, problem:"Guests wait for a waiter before they can order. Busy tables wait longest.",
      fix:"Cura Menu", what:"Guests scan the table QR code and send their order straight to the kitchen.", href:"platforms.html#cura-menu" },
    { key:"logistics", label:"Logistics",
      steps:[["Order received","Customer"],["Truck and driver assigned","Dispatch"],["Safety check and departure","Driver"],["Delivered","Customer"]],
      gap:1, problem:"Trucks, drivers and HSE checks are tracked on paper and phone calls. Nobody sees the full picture.",
      fix:"Fleet Guard", what:"Drivers, trucks, HSE checks and orders in one live system.", href:"platforms.html#fleet-guard" },
    { key:"office", label:"Office and finance",
      steps:[["Employee needs money","Any department"],["Manager approves","Paper form"],["Finance pays","Accounts"],["Recorded for audit","Files"]],
      gap:1, problem:"Requests sit on desks and in WhatsApp chats. Nobody knows who approved what, or when.",
      fix:"MyRequest", what:"Request, manager approval and finance payment in one tracked flow.", href:"platforms.html#myrequest" },
    { key:"gym", label:"Gym or club",
      steps:[["Member arrives","Front desk"],["Checks in","Sign-in sheet"],["Trains","Gym floor"],["Renews membership","Office"]],
      gap:0, problem:"Paper sign-in sheets. Nobody knows who came, when, or who stopped coming.",
      fix:"Gym QR Login", what:"Members scan in, and every visit is logged to a Google Sheet automatically.", href:"platforms.html#gym-qr" },
    { key:"shop", label:"Shop",
      steps:[["Customer searches","Phone"],["Finds your products","Online"],["Places an order","Shop"],["Gets delivery","Courier"]],
      gap:0, problem:"Customers search online but can't find your products or prices, so they buy elsewhere.",
      fix:"Online shop", what:"Your catalogue, prices and ordering online, working on every phone.", href:"services.html#web" },
    { key:"other", label:"Something else",
      steps:[["Your customer asks","Request"],["Your team handles it","Process"],["Work gets done","Delivery"],["Customer is happy","Result"]],
      gap:1, problem:"Somewhere in here, work waits, repeats or gets lost.",
      fix:"Your fix", what:"Tell us where it breaks and we'll build the system that closes the gap.", href:"contact.html" }
  ];

  var tabsEl = document.querySelector(".gap-tabs");
  var track = document.getElementById("track");
  if(!tabsEl || !track) return;

  var current = 0, timer;

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }

  function render(i, animate){
    var d = DATA[i];
    track.style.setProperty("--gi", d.gap);
    var html = "";
    d.steps.forEach(function(s, n){
      var broken = n === d.gap;
      html += '<div class="step' + (broken ? " is-broken" : "") + '"><div class="node"></div><div class="wire"></div><h3>' + esc(s[0]) + '</h3><div class="who">' + esc(s[1]) + '</div></div>';
      if(broken){
        html += '<div class="problem"><b>The gap</b>' + esc(d.problem) + '</div>';
        html += '<div class="fixcard"><span class="name">' + esc(d.fix) + '</span><span class="what">' + esc(d.what) + '</span><a href="' + d.href + '">' + (d.key === "other" ? "Describe your gap" : "See how it works") + '</a></div>';
      }
    });
    track.innerHTML = html;
    track.classList.remove("is-fixed", "is-leaving");
    clearTimeout(timer);
    var delay = (animate && !reduce) ? 900 : 0;
    timer = setTimeout(function(){
      track.classList.add("is-fixed");
      var b = track.querySelector(".step.is-broken"); if(b) b.classList.add("is-fixed");
    }, delay);
  }

  function select(i, focus){
    if(i === current && track.innerHTML) return;
    var tabs = tabsEl.querySelectorAll(".gap-tab");
    tabs.forEach(function(t, n){ t.setAttribute("aria-selected", String(n === i)); t.tabIndex = n === i ? 0 : -1; });
    if(focus) tabs[i].focus();
    current = i;
    if(reduce){ render(i, false); return; }
    track.classList.add("is-leaving");
    setTimeout(function(){ render(i, true); }, 220);
  }

  DATA.forEach(function(d, i){
    var b = document.createElement("button");
    b.type = "button"; b.className = "gap-tab"; b.role = "tab";
    b.setAttribute("role","tab"); b.setAttribute("aria-controls","track");
    b.setAttribute("aria-selected", String(i === 0)); b.tabIndex = i === 0 ? 0 : -1;
    b.textContent = d.label;
    b.addEventListener("click", function(){ select(i); });
    b.addEventListener("keydown", function(e){
      if(e.key === "ArrowRight" || e.key === "ArrowLeft"){
        e.preventDefault();
        var n = (current + (e.key === "ArrowRight" ? 1 : -1) + DATA.length) % DATA.length;
        select(n, true);
      }
    });
    tabsEl.appendChild(b);
  });

  /* First view: the one orchestrated moment. Wait until the track is on screen. */
  render(0, false);
  track.classList.remove("is-fixed");
  var b0 = track.querySelector(".step.is-broken"); if(b0) b0.classList.remove("is-fixed");
  function play(){ setTimeout(function(){ track.classList.add("is-fixed"); var b = track.querySelector(".step.is-broken"); if(b) b.classList.add("is-fixed"); }, reduce ? 0 : 1100); }
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(en){ if(en[0].isIntersecting){ io.disconnect(); play(); } }, {threshold:.35});
    io.observe(track);
  } else play();
})();
