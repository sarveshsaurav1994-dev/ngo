/**
 * ASHA FOUNDATION — COMPLETE JAVASCRIPT
 * Includes fully functional multi-step donation modal.
 */

// ==================== DOM ELEMENTS ====================
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const payBtn = document.getElementById('payBtn');
const paymentModal = document.getElementById('paymentModal');
const modalClose = document.getElementById('modalClose');
const customAmountInput = document.getElementById('customAmount');
const selectedAmountDisplay = document.getElementById('selectedAmountDisplay');
const payBtnAmount = document.getElementById('payBtnAmount');
const amountBtns = document.querySelectorAll('.amount-btn');
const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle):not(.external)');
const mobileLinks = document.querySelectorAll('.mobile-link:not(.external)');
const sections = document.querySelectorAll('section[id]');
const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');
const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

// ==================== MODAL STEP ELEMENTS ====================
const modalSteps = document.querySelectorAll('.modal-step');
const stepIndicators = document.querySelectorAll('.modal-step-indicator');
const donorForm = document.getElementById('donorForm');
const backToFormBtn = document.getElementById('backToFormBtn');
const proceedToPayBtn = document.getElementById('proceedToPayBtn');
const finalPayBtn = document.getElementById('finalPayBtn');

// Fields for thank you step
const thankYouNameSpan = document.getElementById('thankYouName');
const thankYouAmountSpan = document.getElementById('thankYouAmount');
const thankYouEmailSpan = document.getElementById('thankYouEmail');
const thankYouLocationSpan = document.getElementById('thankYouLocation');
const step1AmountSpan = document.getElementById('step1Amount');
const step3AmountSpan = document.getElementById('step3Amount');
const finalPayAmountSpan = document.getElementById('finalPayAmount');

// ==================== STATE ====================
let selectedAmount = 1000;
let countersAnimated = false;
let activeDropdown = null;
let currentStep = 1;
let donorData = {};

// ==================== UTILITY FUNCTIONS ====================
function smoothScrollTo(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;
  const navHeight = navbar.offsetHeight;
  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
  window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}

function formatNumber(num) {
  return num.toLocaleString('en-IN');
}

// ==================== MODAL STEP NAVIGATION ====================
function setModalStep(step) {
  currentStep = step;
  // Update step indicators
  stepIndicators.forEach((indicator, index) => {
    const stepNum = index + 1;
    indicator.classList.remove('active', 'completed');
    if (stepNum === currentStep) indicator.classList.add('active');
    else if (stepNum < currentStep) indicator.classList.add('completed');
  });
  // Show/hide steps
  modalSteps.forEach((stepEl, index) => {
    if (index + 1 === currentStep) stepEl.classList.add('active');
    else stepEl.classList.remove('active');
  });
}

// ==================== DONATION LOGIC ====================
function updateSelectedAmount(amount) {
  selectedAmount = amount;
  selectedAmountDisplay.textContent = `₹${formatNumber(amount)}`;
  payBtnAmount.textContent = `₹${formatNumber(amount)}`;
  // Update modal displays
  if (step1AmountSpan) step1AmountSpan.textContent = `₹${formatNumber(amount)}`;
  if (step3AmountSpan) step3AmountSpan.textContent = `₹${formatNumber(amount)}`;
  if (finalPayAmountSpan) finalPayAmountSpan.textContent = `₹${formatNumber(amount)}`;

  amountBtns.forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.dataset.amount, 10) === amount) btn.classList.add('active');
  });
  if (customAmountInput) customAmountInput.value = '';
}

function handleCustomAmount() {
  const value = parseInt(customAmountInput.value, 10);
  if (value && value > 0) updateSelectedAmount(value);
}

function handlePayment() {
  if (selectedAmount <= 0) return;
  // Reset to step 1 when opening modal
  setModalStep(1);
  paymentModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Reset form if needed
  if (donorForm) donorForm.reset();
}

function closeModal() {
  paymentModal.classList.remove('active');
  document.body.style.overflow = '';
}

// ==================== DONOR FORM HANDLER ====================
function handleDonorFormSubmit(e) {
  e.preventDefault();
  // Collect data
  donorData = {
    name: document.getElementById('donorName')?.value.trim() || '',
    email: document.getElementById('donorEmail')?.value.trim() || '',
    phone: document.getElementById('donorPhone')?.value.trim() || '',
    dob: document.getElementById('donorDob')?.value || '',
    city: document.getElementById('donorCity')?.value.trim() || '',
    state: document.getElementById('donorState')?.value || '',
  };
  // Basic validation
  if (!donorData.name || !donorData.email || !donorData.phone || !donorData.dob || !donorData.city || !donorData.state) {
    alert('Please fill in all required fields.');
    return;
  }
  // Update thank you step
  if (thankYouNameSpan) thankYouNameSpan.textContent = donorData.name;
  if (thankYouEmailSpan) thankYouEmailSpan.textContent = donorData.email;
  if (thankYouLocationSpan) thankYouLocationSpan.textContent = `${donorData.city}, ${donorData.state}`;
  if (thankYouAmountSpan) thankYouAmountSpan.textContent = `₹${formatNumber(selectedAmount)}`;
  // Move to step 2
  setModalStep(2);
}

// ==================== CONTACT FORM ====================
function handleContactForm(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const originalBtn = form.querySelector('button[type="submit"]');
  const originalText = originalBtn.innerHTML;
  originalBtn.innerHTML = '✓ Message Sent!';
  originalBtn.disabled = true;
  setTimeout(() => {
    form.reset();
    originalBtn.innerHTML = originalText;
    originalBtn.disabled = false;
  }, 3000);
}

// ==================== SCROLL & NAVIGATION (unchanged from your original) ====================
function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = `${scrollPercent}%`;
}

function handleNavbarScroll() {
  if (window.pageYOffset > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}

function updateActiveNavLink() {
  const scrollPos = window.pageYOffset + 150;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) link.classList.add('active');
      });
      mobileLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) link.classList.add('active');
      });
    }
  });
}

function toggleMobileMenu() {
  navToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}

function closeMobileMenu() {
  navToggle.classList.remove('active');
  mobileMenu.classList.remove('open');
  document.querySelectorAll('.mobile-submenu-list').forEach(list => list.classList.remove('open'));
  document.querySelectorAll('.mobile-submenu-toggle').forEach(t => t.classList.remove('open'));
  document.body.style.overflow = '';
}

function handleScrollReveal() {
  const windowHeight = window.innerHeight;
  const revealPoint = 100;
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - revealPoint) el.classList.add('visible');
  });
}

function animateCounters() {
  if (countersAnimated) return;
  const countersSection = document.getElementById('counters');
  if (!countersSection) return;
  const sectionTop = countersSection.getBoundingClientRect().top;
  if (sectionTop < window.innerHeight - 100) {
    countersAnimated = true;
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 2000;
      const startTime = performance.now();
      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeOut * target);
        counter.textContent = formatNumber(currentValue);
        if (progress < 1) requestAnimationFrame(updateCounter);
        else counter.textContent = formatNumber(target);
      }
      requestAnimationFrame(updateCounter);
    });
  }
}

function handleParallax() {
  const scrollY = window.pageYOffset;
  const heroShapes = document.querySelectorAll('.hero-shape');
  heroShapes.forEach((shape, index) => {
    const speed = 0.1 + index * 0.05;
    shape.style.transform = `translateY(${scrollY * speed}px)`;
  });
}

function closeAllDropdowns() {
  dropdownMenus.forEach(menu => menu.classList.remove('active'));
  dropdownToggles.forEach(toggle => toggle.classList.remove('active'));
  activeDropdown = null;
}

function toggleDropdown(toggle) {
  const dropdownId = toggle.dataset.dropdown;
  const menu = document.getElementById(`${dropdownId}Dropdown`);
  if (!menu) return;
  if (activeDropdown && activeDropdown !== dropdownId) {
    document.getElementById(`${activeDropdown}Dropdown`)?.classList.remove('active');
    document.querySelector(`[data-dropdown="${activeDropdown}"]`)?.classList.remove('active');
  }
  const isActive = menu.classList.toggle('active');
  toggle.classList.toggle('active');
  activeDropdown = isActive ? dropdownId : null;
}

function toggleMobileSubmenu(toggle) {
  const targetId = toggle.dataset.target;
  const submenu = document.getElementById(targetId);
  if (!submenu) return;
  document.querySelectorAll('.mobile-submenu-list').forEach(list => {
    if (list.id !== targetId) list.classList.remove('open');
  });
  document.querySelectorAll('.mobile-submenu-toggle').forEach(t => {
    if (t !== toggle) t.classList.remove('open');
  });
  submenu.classList.toggle('open');
  toggle.classList.toggle('open');
}

// ==================== STORY CARD TOGGLE ====================
function toggleStoryCard(card) {
  const isExpanded = card.classList.contains('expanded');
  document.querySelectorAll('.story-card').forEach(c => {
    if (c !== card) {
      c.classList.remove('expanded');
      c.classList.add('collapsed');
    }
  });
  if (isExpanded) {
    card.classList.remove('expanded');
    card.classList.add('collapsed');
  } else {
    card.classList.remove('collapsed');
    card.classList.add('expanded');
  }
}

// ==================== EVENT LISTENERS ====================
window.addEventListener('scroll', () => {
  updateScrollProgress();
  handleNavbarScroll();
  updateActiveNavLink();
  handleScrollReveal();
  animateCounters();
  handleParallax();
}, { passive: true });

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) closeAllDropdowns();
  if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
    closeMobileMenu();
  }
});

dropdownToggles.forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(toggle);
  });
});

mobileSubmenuToggles.forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMobileSubmenu(toggle);
  });
});

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href);
      closeMobileMenu();
      closeAllDropdowns();
    }
  });
});

mobileLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href);
      closeMobileMenu();
    }
  });
});

navToggle.addEventListener('click', toggleMobileMenu);

amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const amount = parseInt(btn.dataset.amount, 10);
    updateSelectedAmount(amount);
  });
});

if (customAmountInput) customAmountInput.addEventListener('input', handleCustomAmount);
if (payBtn) payBtn.addEventListener('click', handlePayment);
if (modalClose) modalClose.addEventListener('click', closeModal);
if (paymentModal) {
  paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) closeModal();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && paymentModal?.classList.contains('active')) closeModal();
  if (e.key === 'Escape') {
    closeAllDropdowns();
    closeMobileMenu();
  }
});

// Donor form submission
if (donorForm) donorForm.addEventListener('submit', handleDonorFormSubmit);
if (backToFormBtn) backToFormBtn.addEventListener('click', () => setModalStep(1));
if (proceedToPayBtn) proceedToPayBtn.addEventListener('click', () => setModalStep(3));
if (finalPayBtn) {
  finalPayBtn.addEventListener('click', () => {
    alert(`✨ Thank you for your donation of ₹${formatNumber(selectedAmount)}! ✨\n( Demo mode – no real payment processed )`);
    closeModal();
    // Optional: reset to step 1 for next time
    setModalStep(1);
    if (donorForm) donorForm.reset();
  });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', handleContactForm);

// Story cards
document.querySelectorAll('.story-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    toggleStoryCard(card);
  });
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleStoryCard(card);
    }
  });
});

// ==================== INITIALIZATION ====================
function init() {
  handleNavbarScroll();
  handleScrollReveal();
  updateActiveNavLink();
  updateSelectedAmount(1000);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

