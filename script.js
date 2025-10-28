// ---------- MENU TOGGLE ----------
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => menu.classList.toggle("active"));
  }
});

// ---------- SMOOTH SCROLL WITH NAVBAR OFFSET ----------
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const offset = navbar ? navbar.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
});

// ---------- PRELOADER ----------
document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector('#preloader img');
  if (!logo) return;
  logo.addEventListener('animationend', () => {
    document.body.classList.add('loaded');
  });
});

// ---------- STAGGER ANIMATIONS ----------
function animateChildren(parentSelector, childSelector) {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;
  const children = parent.querySelectorAll(childSelector);
  children.forEach((child, i) => {
    const top = child.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.8) {
      setTimeout(() => child.classList.add('visible'), i * 150);
    }
  });
}
window.addEventListener('scroll', () => {
  animateChildren('#our-products .products-wrapper', '.product-card');
  animateChildren('.service-container', '.service-box');
});

// ---------- SECTION FADE-IN ----------
const animatedSections = document.querySelectorAll('.fade-slide');
function animateOnScroll() {
  const triggerPoint = window.innerHeight * 0.8;
  animatedSections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < triggerPoint) sec.classList.add('visible');
  });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// ---------- CONTACT FORM SUBMIT (no-preflight) ----------
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx_M7Ax1pgHLPiseerC928TN36W0xMMIbjCupD2oVWyqht1Hrh2hVHMM6GD3ClYGjhq/exec";
const TOKEN = "4f089d0559d85884075864ba7dabe741c682c42afc731a898cff3dcdebb34c7f2adc6b1947d599d4de20d9f38d5d1be7562b0c452e389c2198da855120d22eb4";
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = new URLSearchParams({
    token: TOKEN,
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    location: document.getElementById("location").value.trim(),
    message: document.getElementById("message").value.trim()
  });
  const res = await fetch(WEB_APP_URL, {
    method: "POST",
    headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
    body
  });
  const data = await res.json();
  alert(data.ok ? "Submitted!" : ("Failed: " + (data.error||"")));
});
// ==== HOTFIX: drawer + dropdown + Apps Script submit ====
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Drawer
  const burger = $('#menu-toggle'), menu = $('#menu'), shade = $('#backdrop');
  const open = () => { menu?.classList.add('active'); shade?.classList.add('show'); document.body.classList.add('menu-open'); };
  const close = () => { menu?.classList.remove('active'); shade?.classList.remove('show'); document.body.classList.remove('menu-open'); };
  burger?.addEventListener('click', open);
  shade?.addEventListener('click', close);
  $$('#menu a').forEach(a => a.addEventListener('click', close));

  // Mobile dropdown (desktop uses :hover in CSS)
  const dd = document.querySelector('.dropdown');
  const btn = dd?.querySelector('.dropdown-btn');
  if (dd && btn){
    btn.addEventListener('click', (e)=>{
      if (window.innerWidth >= 992) return;
      e.preventDefault();
      dd.classList.toggle('open');
      dd.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false');
    });
  }

  // Contact form — Apps Script friendly: no-cors + reset
  const form = $('#contactForm');
  if (form){
    const btn = $('#sendBtn', form), status = $('#statusMsg', form);
    const URL = window.GS_WEBAPP_URL || "https://script.google.com/macros/s/AKfycbx_M7Ax1pgHLPiseerC928TN36W0xMMIbjCupD2oVWyqht1Hrh2hVHMM6GD3ClYGjhq/exec";
    const TOKEN = window.GS_TOKEN || "";

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if(btn){ btn.disabled = true; btn.textContent = 'Sending…'; }
      if(status) status.textContent = '';

      const fd = new FormData(form);
      if (TOKEN) fd.append('token', TOKEN);

      try{
        await fetch(URL, { method:'POST', body: fd, mode:'no-cors' }); // opaque response is normal
        form.reset();                                     // ✅ fields clear
        if(status) status.textContent = 'Thanks! We received your message.';
      }catch(err){
        console.error(err);
        if(status) status.textContent = 'Could not send. Please try again.';
      }finally{
        if(btn){ btn.disabled = false; btn.textContent = 'Send'; }
      }
    });
  }
})();
