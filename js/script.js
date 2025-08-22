/* Loader */
function initLoader() {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  });
}

/* I18n */
let translations = {};
function getValue(obj, path) {
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
}
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = getValue(translations, key);
    if (text) el.innerHTML = text;
  });
  if (translations.meta) {
    document.title = translations.meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', translations.meta.description);
  }
}
async function loadLanguage(lang) {
  const res = await fetch(`i18n/${lang}.json`);
  translations = await res.json();
  document.documentElement.lang = lang;
  applyTranslations();
}
function initLanguage() {
  const current = localStorage.getItem('lang') || 'es';
  loadLanguage(current);
  document.querySelectorAll('[data-set-lang]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const lang = btn.getAttribute('data-set-lang');
      localStorage.setItem('lang', lang);
      loadLanguage(lang);
    });
  });
}

/* Throttle utility */
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* Form submission */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    const formData = new FormData(form);
    try {
      const res = await fetch('php/form.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      const resp = document.getElementById('form-response');
      resp.textContent = data.message;
      resp.className = data.success ? 'alert alert-success' : 'alert alert-danger';
      if (data.success) form.reset();
    } catch (err) {
      console.error(err);
    }
  });
}

/* Init plugins */
function initPlugins() {
  if (window.jQuery) {
    jQuery('.owl-carousel').owlCarousel({
      loop: true,
      nav: true,
      items: 1,
      autoplay: true,
      autoplayHoverPause: true
    });
    jQuery('[data-fancybox="altares2024"]').fancybox();
    jQuery('[data-fancybox="marxmas2024"]').fancybox();
    jQuery('[data-fancybox="mix"]').fancybox();
    if (jQuery('#rev_slider').revolution) {
      jQuery('#rev_slider').revolution({
        sliderType: 'standard',
        delay: 5000
      });
    }
  }
}

/* Initialize */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initLanguage();
  initForm();
  initPlugins();
});
