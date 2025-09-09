(function(){
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

const routes = {
  trang-chu: 'pages/trang-chu.html',
  tinh-nang: 'pages/tinh-nang.html',
  mua: 'pages/mua.html',
  tai-ve: 'pages/tai-ve.html',
  ho-tro: 'pages/ho-tro.html',
  lien-he: 'pages/lien-he.html',
  dieu-khoan: 'pages/dieu-khoan.html',
  quyen-rieng-tu: 'pages/quyen-rieng-tu.html',
};

function ensureIframe(){
  const panel = document.getElementById('panel');
  let iframe = document.getElementById('panelFrame');
  if (!iframe){
    iframe = document.createElement('iframe');
    iframe.id = 'panelFrame';
    iframe.style.cssText = 'width:100%;height:60vh;border:0;display:block;';
    panel.innerHTML = '';
    panel.appendChild(iframe);
  }
  return iframe;
}
function setActive(tab){ document.querySelectorAll('.tab').forEach(a => a.setAttribute('aria-selected', String(a.dataset.tab === tab))); }
function loadPage(tab){
  const iframe = ensureIframe();
  iframe.style.display = 'block';
  iframe.src = routes[tab] || routes.home;

  // Re-run inline/external scripts inside the iframe content (for pages that rely on inline <script>)
  iframe.addEventListener('load', () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      // Only do this for BUY/BUYNOW pages (avoid unnecessary work on others)
      const url = (iframe.src || '').toLowerCase();
      if (!/\/pages\/(mua|buy|buynow)\.html(\?|#|$)/.test(url)) return;

      doc.querySelectorAll('script').forEach(oldS => {
        const s = doc.createElement('script');
        // copy attributes (src, type, etc.)
        for (const a of oldS.attributes) s.setAttribute(a.name, a.value);
        if (!oldS.src) s.textContent = oldS.textContent;
        // replace to trigger execution
        oldS.replaceWith(s);
      });
    } catch(e) { /* ignore */ }
  });

  iframe.onerror = () => {
    iframe.style.display='none';
    const panel=document.getElementById('panel');
    panel.innerHTML='<div class="mini" style="padding:12px;border:1px solid var(--muted);border-radius:10px">Không tải được trang con (404). Kiểm tra lại vị trí file.</div>';
  };
  setActive(tab);
}
function currentRoute(){ const h = decodeURIComponent(location.hash.replace('#','').trim()); return routes[h] ? h : 'trang-chu'; }
window.addEventListener('hashchange', ()=> loadPage(currentRoute()));
document.addEventListener('click', (e)=>{
  const t = e.target.closest('a.tab'); if (!t) return; e.preventDefault();
  const tab = t.dataset.tab; if (!routes[tab]) return;
  if (location.hash !== '#' + tab) { location.hash = '#' + tab; } else { loadPage(tab); }
});
window.addEventListener('DOMContentLoaded', ()=> {
  const badge = document.querySelector('.badge');
  if (badge){ const isLocal = location.protocol === 'file:'; const host = location.hostname || 'localhost'; badge.textContent = isLocal ? 'Local • file://' : ('• ' + host); }
  loadPage(currentRoute());
});


document.addEventListener('click', (e)=>{
  const t = e.target.closest('a[data-tab]'); if (!t) return; e.preventDefault();
  const tab = t.dataset.tab; if (!routes[tab]) return;
  if (location.hash !== '#' + tab) { location.hash = '#' + tab; } else { loadPage(tab); }
});


// ===== Mobile PLUS UI (drawer + bottom nav) & dynamic spacer =====
(function(){
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');
  const button  = document.getElementById('hamburger');

  function openDrawer(){
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    if (overlay) overlay.hidden = false;
    if (button) button.setAttribute('aria-expanded','true');
  }
  function closeDrawer(){
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    if (overlay) overlay.hidden = true;
    if (button) button.setAttribute('aria-expanded','false');
  }
  button && button.addEventListener('click', ()=>{
    const open = drawer && drawer.classList.contains('open');
    (open ? closeDrawer : openDrawer)();
  });
  overlay && overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closeDrawer(); });

  function syncActive(tab){
    document.querySelectorAll('.bn-item').forEach(el=> el.classList.toggle('active', el.dataset.tab===tab));
    document.querySelectorAll('.drawer-link').forEach(el=> el.classList.toggle('active', el.dataset.tab===tab));
  }
  const _setActive = (typeof setActive==='function') ? setActive : function(){};
  window.setActive = function(tab){ _setActive(tab); syncActive(tab); closeDrawer(); };

  function setBNHeightVar(){
    const bn = document.querySelector('.bottom-nav');
    const shown = bn && getComputedStyle(bn).display !== 'none';
    const h = shown ? bn.offsetHeight : 0;
    document.documentElement.style.setProperty('--bn-h', (h||0) + 'px');
  }
  window.addEventListener('DOMContentLoaded', setBNHeightVar, {once:true});
  window.addEventListener('resize', setBNHeightVar);
  window.addEventListener('orientationchange', setBNHeightVar);
  window.addEventListener('hashchange', setBNHeightVar);
  setTimeout(setBNHeightVar, 300);
})();

