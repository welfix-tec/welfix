/* Contact: three-step project brief, sent to Formspree. */
(function(){
  "use strict";
  var form = document.getElementById("brief");
  if(!form) return;
  var panels = form.querySelectorAll(".panel");
  var bars = form.querySelectorAll(".progress span");
  var lbl = document.getElementById("progress-lbl");
  var step = 1;

  /* Pre-select from links like contact.html?platform=Cura%20Menu or ?plan=Starter */
  var q = new URLSearchParams(location.search);
  var interest = q.get("platform") || (q.get("plan") ? q.get("plan") + " plan" : "");
  if(interest){
    document.getElementById("interest").value = interest;
    var map = { "Fleet Guard":"n1", "MyRequest":"n1", "Eagle View":"n1", "Cura Menu":"n3", "Gym QR Login":"n3", "Online shop":"n2", "Website":"n2", "Veloce":"n2", "Washly":"n6", "Dili-Zone":"n5", "AI and automation":"n4", "Consulting":"n6" };
    var id = map[q.get("platform")] || (q.get("plan") && q.get("plan") !== "Custom" ? "n2" : q.get("plan") === "Custom" ? "n1" : null);
    if(id) document.getElementById(id).checked = true;
    var d = document.getElementById("details");
    if(q.get("platform")) d.value = "I'm interested in " + q.get("platform") + ". ";
    else if(q.get("plan")) d.value = "I'm interested in the " + interest + ". ";
  }

  function show(n, back){
    step = n;
    panels.forEach(function(p){
      var on = p.getAttribute("data-step") === String(n);
      p.classList.toggle("is-current", on);
      p.classList.toggle("back", on && !!back);
    });
    bars.forEach(function(b, i){ b.classList.toggle("on", n === "done" || i < n); });
    lbl.textContent = n === "done" ? "Sent" : "Step " + n + " of 3";
    var cur = form.querySelector(".panel.is-current");
    var legend = cur.querySelector("legend, h2");
    if(legend){ legend.setAttribute("tabindex","-1"); legend.focus({preventScroll:true}); }
    var top = form.getBoundingClientRect().top + window.scrollY - 100;
    if(window.scrollY > top) window.scrollTo({top:top, behavior:"smooth"});
  }

  function err(panel, msg){ panel.querySelector(".step-err").textContent = msg || ""; }

  function valid(n){
    var p = form.querySelector('[data-step="'+n+'"]');
    if(n === 1){
      if(!p.querySelector("input:checked")){ err(p, "Pick at least one option, or choose “Not sure yet”."); return false; }
    }
    if(n === 2){
      if(!p.querySelector("input[name=size]:checked")){ err(p, "Choose the size of your business."); return false; }
    }
    if(n === 3){
      var ok = true;
      ["name","email","details"].forEach(function(id){
        var el = document.getElementById(id), f = el.closest(".field");
        var good = el.value.trim() && el.checkValidity();
        f.classList.toggle("has-err", !good);
        if(!good && ok){ el.focus(); ok = false; }
      });
      if(!ok){ err(p, ""); return false; }
    }
    err(p, ""); return true;
  }

  function summary(){
    var needs = Array.prototype.map.call(form.querySelectorAll("input[name=needs]:checked"), function(i){ return i.value; });
    var size = form.querySelector("input[name=size]:checked");
    var ind = document.getElementById("industry").value.trim();
    var s = document.getElementById("summary");
    s.innerHTML = "";
    var b = document.createElement("b"); b.textContent = "Your brief so far"; s.appendChild(b);
    s.appendChild(document.createTextNode(needs.join(", ") + (size ? " · " + size.value : "") + (ind ? " · " + ind : "")));
  }

  form.querySelectorAll("[data-next]").forEach(function(b){
    b.addEventListener("click", function(){ if(valid(step)){ if(step === 2) summary(); show(step + 1); } });
  });
  form.querySelectorAll("[data-back]").forEach(function(b){
    b.addEventListener("click", function(){ show(step - 1, true); });
  });
  form.querySelectorAll("input").forEach(function(i){
    i.addEventListener("change", function(){ var p = i.closest(".panel"); if(p) err(p, ""); var f = i.closest(".field"); if(f) f.classList.remove("has-err"); });
  });
  /* Enter on step 1–2 should advance, not submit */
  form.addEventListener("keydown", function(e){
    if(e.key === "Enter" && step < 3 && e.target.tagName === "INPUT"){ e.preventDefault(); var n = form.querySelector(".panel.is-current [data-next]"); if(n) n.click(); }
  });

  form.addEventListener("submit", function(e){
    e.preventDefault();
    if(step !== 3 || !valid(3)) return;
    var p = form.querySelector('[data-step="3"]');
    var btn = p.querySelector("button[type=submit]");
    btn.disabled = true; btn.lastChild.textContent = "Sending…";
    var fd = new FormData(form);
    fd.set("needs", Array.prototype.map.call(form.querySelectorAll("input[name=needs]:checked"), function(i){ return i.value; }).join(", "));
    fetch(form.action, {method:"POST", body:fd, headers:{Accept:"application/json"}})
      .then(function(r){
        if(r.ok){ show("done"); form.reset(); }
        else err(p, "The brief didn't send. Try again, or email welfix.sol@gmail.com.");
      })
      .catch(function(){ err(p, "No connection. Check your internet and try again, or message us on WhatsApp."); })
      .then(function(){ btn.disabled = false; btn.lastChild.textContent = "Send project brief"; });
  });
})();
