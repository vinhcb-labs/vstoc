
(function(){
  // Theme (no optional chaining)
  var prefersDark = false;
  try { prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; } catch(_){}
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch(_){}
  var theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  var btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', function(){
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch(_){}
  });
})();

var routes = {
  'trang-chu': 'pages/trang-chu.html',
  'tinh-nang': 'pages/tinh-nang.html',
  'mua': 'pages/mua.html',
  'tai-ve': 'pages/tai-ve.html',
  'ho-tro': 'pages/ho-tro.html',
  'lien-he': 'pages/lien-he.html',
  'dieu-khoan': 'pages/dieu-khoan.html',
  'quyen-rieng-tu': 'pages/quyen-rieng-tu.html'
};

function ensureIframe(){
  var panel = document.getElementById('panel');
  var iframe = document.getElementById('panelFrame');
  if (!iframe && panel){
    iframe = document.createElement('iframe');
    iframe.id = 'panelFrame';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.style.display = 'block';
    panel.innerHTML = '';
    panel.appendChild(iframe);
  }
  return iframe;
}

function setActive(tab){
  var tabs = document.querySelectorAll('.tab');
  for (var i=0;i<tabs.length;i++){
    var a = tabs[i];
    if (a && a.getAttribute('data-tab')){
      a.setAttribute('aria-selected', String(a.getAttribute('data-tab') === tab));
    }
  }
  // bottom & drawer mirrors
  var mirrors = document.querySelectorAll('.bn-item, .drawer-link');
  for (var j=0;j<mirrors.length;j++){
    var el = mirrors[j];
    if (el && el.getAttribute('data-tab')){
      var on = el.getAttribute('data-tab') === tab;
      if (on) el.classList.add('active'); else el.classList.remove('active');
    }
  }
}

function loadPage(tab){
  var iframe = ensureIframe();
  if (!iframe) return;
  var src = routes[tab] || routes['trang-chu'];
  if (iframe.getAttribute('src') !== src) iframe.setAttribute('src', src);
  setActive(tab);
}

function currentRoute(){
  var h = String((location.hash || '').replace('#','')).trim();
  return routes[h] ? h : 'trang-chu';
}

// Public function for onclick handlers (works even if event delegation fails)
function go(tab){
  if (!routes[tab]) return false;
  if (location.hash !== '#' + tab) {
    location.hash = '#' + tab;
  } else {
    loadPage(tab);
  }
  return false; // always prevent default anchor jump
}
window.go = go;

window.addEventListener('hashchange', function(){ loadPage(currentRoute()); });

document.addEventListener('DOMContentLoaded', function(){
  var badge = document.querySelector('.badge');
  if (badge){
    var isLocal = location.protocol === 'file:';
    var host = location.hostname || 'localhost';
    badge.textContent = isLocal ? 'Local • file://' : ('• ' + host);
  }
  loadPage(currentRoute());
});
