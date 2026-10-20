/* Services: highlight the current section in the side index. */
(function(){
  "use strict";
  var links = document.querySelectorAll(".sv-index a");
  if(!links.length || !("IntersectionObserver" in window)) return;
  var map = {};
  links.forEach(function(a){ map[a.getAttribute("href").slice(1)] = a; });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        links.forEach(function(a){ a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
        var a = map[en.target.id]; if(a){ a.classList.add("is-active"); a.setAttribute("aria-current","true"); }
      }
    });
  }, {rootMargin:"-30% 0px -60% 0px"});
  Object.keys(map).forEach(function(id){ var el = document.getElementById(id); if(el) io.observe(el); });
})();
