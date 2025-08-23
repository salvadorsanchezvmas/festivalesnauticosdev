document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  window.onload = () => loader.classList.add('hidden');

  const langSelect = document.getElementById('langSwitcher');
  const langSelectMobile = document.getElementById('langSwitcherMobile');
  const storedLang = localStorage.getItem('lang') || 'es';
  if (langSelect) langSelect.value = storedLang;
  if (langSelectMobile) langSelectMobile.value = storedLang;
  loadLang(storedLang);

  function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    loadLang(lang);
    if (langSelect) langSelect.value = lang;
    if (langSelectMobile) langSelectMobile.value = lang;
  }

  if (langSelect) langSelect.addEventListener('change', e => setLanguage(e.target.value));
  if (langSelectMobile) langSelectMobile.addEventListener('change', e => setLanguage(e.target.value));

  function loadLang(lang) {
    fetch('i18n/' + lang + '.json')
      .then(r => r.json())
      .then(dict => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const keys = el.getAttribute('data-i18n').split('.');
          let text = dict;
          keys.forEach(k => { if (text) text = text[k]; });
          if (typeof text === 'string') {
            if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
              el.placeholder = text;
            } else {
              el.textContent = text;
            }
          }
        });
        document.title = dict.meta.title;
        document.querySelector('meta[name="description"]').setAttribute('content', dict.meta.description);
        document.querySelector('meta[property="og:title"]').setAttribute('content', dict.meta.title);
        document.querySelector('meta[property="og:description"]').setAttribute('content', dict.meta.description);
        document.querySelector('meta[name="twitter:title"]').setAttribute('content', dict.meta.title);
        document.querySelector('meta[name="twitter:description"]').setAttribute('content', dict.meta.description);
      });
  }

  // Owl Carousel init
  $(document).ready(function(){
    $('.event-carousel').owlCarousel({
      items:1,
      loop:true,
      nav:true,
      dots:true,
      autoplay:false,
      autoplayHoverPause:true
    });
    $('[data-fancybox]').fancybox({ loop:true });
  });

  // Form submit
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const alertBox = document.getElementById('formAlert');
      const formData = new FormData(form);
      fetch('php/form.php', {
        method: 'POST',
        body: formData
      })
      .then(r => r.json())
      .then(data => {
        alertBox.textContent = data.message;
        alertBox.className = data.success ? 'alert alert-success' : 'alert alert-danger';
        if (data.success) form.reset();
        grecaptcha.reset();
      })
      .catch(() => {
        alertBox.textContent = 'Error';
        alertBox.className = 'alert alert-danger';
      });
    });
  }
});
