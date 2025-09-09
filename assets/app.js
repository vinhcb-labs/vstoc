(function(){
  // ===== Theme toggle =====
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem('theme');
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle')?.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

// ===== Simple hash-router with Vietnamese slugs; loads from /pages =====
(function(){
  const routes = {
    'trang-chu'     : 'pages/trang-chu.html',
    'tinh-nang'     : 'pages/tinh-nang.html',
    'mua'           : 'pages/mua.html',
    'tai-ve'        : 'pages/tai-ve.html',
    'ho-tro'        : 'pages/ho-tro.html',
    'lien-he'       : 'pages/lien-he.html',
    'dieu-khoan'    : 'pages/dieu-khoan.html',
    'quyen-rieng-tu': 'pages/quyen-rieng-tu.html'
  };

  // Backward-compatible aliases (old English slugs)
  const aliases = {
    'home'     : 'trang-chu',
    'features' : 'tinh-nang',
    'buy'      : 'mua',
    'download' : 'tai-ve',
    'support'  : 'ho-tro',
    'contact'  : 'lien-he',
    'terms'    : 'dieu-khoan',
    'privacy'  : 'quyen-rieng-tu'
  };

  const DEFAULT = 'trang-chu';

  function ensureIframe(){
    const el = document.getElementById('panelFrame');
    if (!el) throw new Error('Không tìm thấy #panelFrame');
    return el;
  }

  function normalizeTab(raw){
    let tab = (raw || '').replace(/^#/, '').trim();
    if (!tab) return DEFAULT;
    if (aliases[tab]) {
      const vn = aliases[tab];
      if (vn !== tab) history.replaceState(null, '', '#' + vn);
      tab = vn;
    }
    return routes[tab] ? tab : DEFAULT;
  }

  function setActive(tab){
    document.querySelectorAll('[data-tab]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-tab') === tab);
      el.setAttribute('aria-current', el.classList.contains('active') ? 'page' : 'false');
    });
  }

  function load(tab){
    const iframe = ensureIframe();
    const file = routes[tab] || routes[DEFAULT];
    if (iframe.getAttribute('src') !== file) iframe.src = file;
    setActive(tab);
  }

  function onHashChange(){
    const tab = normalizeTab(location.hash);
    load(tab);
  }

  window.addEventListener('hashchange', onHashChange);
  document.addEventListener('DOMContentLoaded', onHashChange);
})();
