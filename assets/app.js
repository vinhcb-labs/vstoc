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
  home: 'pages/home.html',
  features: 'pages/features.html',
  buy: 'pages/buy.html',
  download: 'pages/download.html',
  support: 'pages/support.html',
  contact: 'pages/contact.html',
  terms: 'pages/terms.html',
  privacy: 'pages/privacy.html',
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
      if (!/\/pages\/(buy|buynow)\.html(\?|#|$)/.test(url)) return;

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
function currentRoute(){ const h = location.hash.replace('#','').trim(); return routes[h] ? h : 'home'; }
window.addEventListener('hashchange', ()=> loadPage(currentRoute()));
document.addEventListener('click', (e)=>{
  const t = e.target.closest('a.tab'); if (!t) return; e.preventDefault();
  const tab = t.dataset.tab; if (!routes[tab]) return;
  if (location.hash !== '#' + tab) { location.hash = '#' + tab; } else { loadPage(tab); }
});
window.addEventListener('DOMContentLoaded', ()=> {
  const badge = document.querySelector('.badge');
  if (badge){ const isLocal = location.protocol === 'file:'; const host = location.hostname || 'localhost'; badge.textContent = isLocal ? 'Local • file://' : ('From • ' + host); }
  loadPage(currentRoute());
});
