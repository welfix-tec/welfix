/* Platforms page: small working previews of each product. Sample data only. */
(function(){
  "use strict";

  /* --- Decorative QR codes (not scannable, illustrative only) --- */
  function rng(seed){ return function(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }
  document.querySelectorAll("svg.qr").forEach(function(svg){
    var r = rng(Number(svg.getAttribute("data-seed")) || 1), n = 29, out = "";
    function finder(x, y){
      out += '<rect x="'+x+'" y="'+y+'" width="7" height="7" fill="#000"/><rect x="'+(x+1)+'" y="'+(y+1)+'" width="5" height="5" fill="#fff"/><rect x="'+(x+2)+'" y="'+(y+2)+'" width="3" height="3" fill="#1991C7"/>';
    }
    for(var y = 0; y < n; y++) for(var x = 0; x < n; x++){
      var inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if(!inF && r() > .52) out += '<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="#000"/>';
    }
    finder(0,0); finder(n-7,0); finder(0,n-7);
    svg.innerHTML = out;
  });

  /* --- Fleet Guard tabs --- */
  var FG = {
    trucks:{ kpis:[["24","Trucks"],["17","On route"],["3","In service"]],
      head:["Plate","Type","Status","Next service"],
      rows:[["RAD 214 B","Tanker 30k L",["On route","go"],"12 Nov"],["RAE 087 C","Flatbed",["Loading","ok"],"28 Nov"],["RAC 552 A","Tanker 20k L",["Service due","warn"],"Today"],["RAF 310 D","Box truck",["Available","ok"],"3 Dec"]] },
    drivers:{ kpis:[["31","Drivers"],["17","Driving now"],["2","Licence renewals"]],
      head:["Driver","Truck","Hours today","Licence"],
      rows:[["J. Habimana","RAD 214 B","6h 10m",["Valid","go"]],["C. Mukamana","RAE 087 C","1h 45m",["Valid","go"]],["D. Niyonzima","—","0h",["Renew in 9 days","warn"]],["A. Uwase","RAF 310 D","4h 02m",["Valid","go"]]] },
    hse:{ kpis:[["58","Checks today"],["55","Passed"],["3","Need action"]],
      head:["Truck","Check","Result","By"],
      rows:[["RAD 214 B","Tyres and brakes",["Passed","go"],"J. Habimana"],["RAC 552 A","Fire extinguisher",["Expired","warn"],"Workshop"],["RAE 087 C","Spill kit",["Passed","go"],"C. Mukamana"],["RAF 310 D","Lights and mirrors",["Passed","go"],"A. Uwase"]] },
    orders:{ kpis:[["42","Orders this week"],["9","In transit"],["96%","On time"]],
      head:["Order","Customer","Route","Status"],
      rows:[["#1048","Station Remera","Kigali → Musanze",["In transit","go"]],["#1047","Site Bugesera","Kigali → Nyamata",["Delivered","ok"]],["#1046","Depot Huye","Kigali → Huye",["Assigning","warn"]],["#1045","Hotel Rubavu","Kigali → Gisenyi",["Delivered","ok"]]] }
  };
  var fgMain = document.getElementById("fg-main");
  function fgRender(k){
    var d = FG[k], h = '<div class="fg-kpis">';
    d.kpis.forEach(function(x){ h += '<div class="fg-kpi"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>'; });
    h += '</div><table class="fg-table"><thead><tr>';
    d.head.forEach(function(x, i){ h += '<th'+(i===1?' class="hide-s"':'')+'>'+x+'</th>'; });
    h += '</tr></thead><tbody>';
    d.rows.forEach(function(r){
      h += '<tr>';
      r.forEach(function(c, i){
        var cls = i===1 ? ' class="hide-s"' : '';
        h += '<td'+cls+'>' + (Array.isArray(c) ? '<span class="pill '+c[1]+'">'+c[0]+'</span>' : c) + '</td>';
      });
      h += '</tr>';
    });
    fgMain.innerHTML = h + '</tbody></table>';
  }
  if(fgMain){
    var fgTabs = document.querySelectorAll("[data-fg]");
    fgTabs.forEach(function(b){
      b.addEventListener("click", function(){
        fgTabs.forEach(function(x){ x.setAttribute("aria-selected", String(x === b)); });
        fgRender(b.getAttribute("data-fg"));
      });
    });
    fgRender("trucks");
  }

  /* --- Cura Menu: add to order --- */
  var count = 0, total = 0;
  var cEl = document.getElementById("cm-count"), tEl = document.getElementById("cm-total");
  document.querySelectorAll(".cm-add").forEach(function(b){
    b.addEventListener("click", function(){
      var m = b.parentNode.textContent.match(/([\d,]+) RWF/);
      count++; total += m ? Number(m[1].replace(/,/g,"")) : 0;
      cEl.textContent = count; tEl.textContent = total.toLocaleString("en-US") + " RWF";
      cEl.classList.remove("bump"); void cEl.offsetWidth; cEl.classList.add("bump");
    });
  });

  /* --- Gym QR: simulate a scan --- */
  var people = [["Jean-Paul K.","Monthly"],["Diane I.","Annual"],["Olivier R.","Day pass"],["Clarisse M.","Monthly"],["Samuel B.","Student"],["Yvette N.","Annual"]];
  var pi = 0, rows = 4;
  var btn = document.getElementById("scan-btn"), frame = document.getElementById("scan-frame");
  var tbody = document.getElementById("sheet-body"), sc = document.getElementById("sheet-count");
  if(btn){
    btn.addEventListener("click", function(){
      frame.classList.remove("scanning"); void frame.offsetWidth; frame.classList.add("scanning");
      btn.disabled = true;
      setTimeout(function(){
        var p = people[pi++ % people.length], d = new Date();
        var t = String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
        var tr = document.createElement("tr"); tr.className = "new";
        tr.innerHTML = "<td>"+t+"</td><td>"+p[0]+"</td><td>"+p[1]+"</td>";
        tbody.insertBefore(tr, tbody.firstChild);
        if(tbody.children.length > 6) tbody.removeChild(tbody.lastChild);
        rows++; sc.textContent = rows + " check-ins";
        btn.disabled = false;
      }, 700);
    });
  }

  /* --- MyRequest: move a request through approval --- */
  var mrBtn = document.getElementById("mr-btn");
  if(mrBtn){
    var flow = document.querySelectorAll("#mr-flow li"), log = document.getElementById("mr-log"), st = document.getElementById("mr-status");
    var stage = 1;
    var STEPS = [
      null,
      {btn:"Pay as finance", status:"Approved, waiting for payment", log:"Manager K. Mugisha approved", sub:"Approved"},
      {btn:"Start a new request", status:"Paid by mobile money", log:"Finance paid 45,000 RWF", sub:"Paid"},
    ];
    function now(){ var d = new Date(); return String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0"); }
    function paint(){
      flow.forEach(function(li, i){
        li.classList.toggle("is-done", i < stage || stage === 3);
        li.classList.toggle("is-current", i === stage && stage < 3);
      });
    }
    mrBtn.addEventListener("click", function(){
      if(stage >= 3){
        stage = 1; st.textContent = "Waiting for manager approval"; mrBtn.textContent = "Approve as manager";
        log.innerHTML = "<li>" + now() + " · Claudine U. submitted the request</li>";
        flow[1].querySelector("span").textContent = "Waiting for approval"; flow[2].querySelector("span").textContent = "Payment";
        paint(); return;
      }
      var s2 = STEPS[stage];
      var li = document.createElement("li"); li.className = "new"; li.textContent = now() + " · " + s2.log;
      log.insertBefore(li, log.firstChild);
      st.textContent = s2.status; mrBtn.textContent = s2.btn;
      flow[stage].querySelector("span").textContent = s2.sub;
      stage++; paint();
    });
  }

  /* --- Riza Space: before / after slider --- */
  var range = document.getElementById("room-range"), room = document.getElementById("room");
  if(range && room){
    range.addEventListener("input", function(){ room.style.setProperty("--pos", range.value + "%"); });
  }

  /* --- Eagle View: stop the moving truck for reduced motion --- */
  if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    document.querySelectorAll(".ev-truck animateMotion").forEach(function(a){ a.remove(); });
    var t = document.querySelector(".ev-truck"); if(t) t.setAttribute("transform","translate(160 150)");
  }
})();
