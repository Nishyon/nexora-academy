/* ============================================================
   NEXORA ACADEMY — Global Script
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Gallery filters ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var cat = item.getAttribute('data-category');
          var show = filter === 'all' || filter === cat;
          item.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox && galleryItems.length) {
    var lightboxImg = lightbox.querySelector('img');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-nav.prev');
    var nextBtn = lightbox.querySelector('.lightbox-nav.next');
    var visibleItems = [];
    var currentIndex = 0;

    function getVisibleItems() {
      return Array.prototype.filter.call(galleryItems, function (item) {
        return !item.classList.contains('is-hidden');
      });
    }

    function openLightbox(index) {
      visibleItems = getVisibleItems();
      currentIndex = index;
      renderLightbox();
      lightbox.classList.add('is-open');
      document.body.classList.add('menu-open');
    }

    function renderLightbox() {
      var item = visibleItems[currentIndex];
      if (!item) return;
      var img = item.querySelector('img');
      lightboxImg.src = img.getAttribute('src');
      lightboxImg.alt = img.getAttribute('alt') || '';
      lightboxCaption.textContent = img.getAttribute('alt') || '';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var all = getVisibleItems();
        var idx = all.indexOf(item);
        openLightbox(idx < 0 ? 0 : idx);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    if (prevBtn) prevBtn.addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      renderLightbox();
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      renderLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }

  /* ---------- Admission enquiry form ---------- */
  var form = document.getElementById('enquiry-form');
  if (form) {
    var successModal = document.querySelector('.modal-overlay');

    function setError(group, message) {
      group.classList.add('has-error');
      var msg = group.querySelector('.form-error-msg');
      if (msg) msg.textContent = message;
    }
    function clearError(group) {
      group.classList.remove('has-error');
    }

    function validateField(input) {
      var group = input.closest('.form-group');
      if (!group) return true;
      clearError(group);

      if (input.hasAttribute('required') && !input.value.trim()) {
        setError(group, 'This field is required.');
        return false;
      }
      if (input.type === 'tel') {
        var digits = input.value.replace(/\D/g, '');
        if (input.value.trim() && (digits.length < 10 || digits.length > 13)) {
          setError(group, 'Enter a valid mobile number.');
          return false;
        }
      }
      if (input.type === 'email' && input.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value.trim())) {
          setError(group, 'Enter a valid email address.');
          return false;
        }
      }
      return true;
    }

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('input, select, textarea');
      var isValid = true;
      fields.forEach(function (input) {
        if (!validateField(input)) isValid = false;
      });

      if (!isValid) {
        var firstError = form.querySelector('.has-error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (successModal) {
        successModal.classList.add('is-open');
        document.body.classList.add('menu-open');
      }
      form.reset();
    });
  }

  /* ---------- Modal close ---------- */
  var modalOverlay = document.querySelector('.modal-overlay');
  if (modalOverlay) {
    modalOverlay.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        modalOverlay.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      }
    });
  }

});
