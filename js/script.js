// Initialize components and i18n
$(document).ready(function () {
    // Hide loader after window load
    $(window).on('load', function () {
        $('#loader').fadeOut();
    });

    // Owl Carousel setup
    $('.owl-carousel').owlCarousel({
        items: 1,
        nav: true,
        dots: true,
        loop: true
    });

    // Fancybox
    $('[data-fancybox]').fancybox();

    // Language handling
    const langSelectors = ['#lang', '#langDesktop'];
    let currentLang = localStorage.getItem('lang') || 'es';

    function applyTranslations(data) {
        document.documentElement.lang = currentLang;
        $('[data-i18n]').each(function () {
            const key = $(this).data('i18n');
            const text = key.split('.').reduce((o, i) => o ? o[i] : null, data);
            if (text) {
                if (this.tagName === 'INPUT' || this.tagName === 'TEXTAREA') {
                    $(this).attr('placeholder', text);
                } else if (this.tagName === 'TITLE') {
                    $(this).text(text);
                } else if ($(this).attr('name') === 'description') {
                    $(this).attr('content', text);
                } else {
                    $(this).html(text);
                }
            }
        });
    }

    function loadLang(lang) {
        $.getJSON('i18n/' + lang + '.json', function (data) {
            applyTranslations(data);
        });
    }

    function setLang(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        loadLang(lang);
        langSelectors.forEach(sel => $(sel).val(lang));
    }

    langSelectors.forEach(sel => {
        $(sel).on('change', function () {
            setLang($(this).val());
        });
    });

    setLang(currentLang);

    // Form submission
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        const form = this;
        $.ajax({
            url: $(form).attr('action'),
            method: 'POST',
            data: $(form).serialize(),
            dataType: 'json'
        }).done(function (res) {
            alert(res.message);
            if (res.success) {
                form.reset();
                if (grecaptcha) { grecaptcha.reset(); }
            }
        }).fail(function () {
            alert('Error al enviar');
        });
    });
});
