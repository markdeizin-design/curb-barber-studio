import { services, barbers, whatsappUrl, todayInDubai, validateBooking } from './data.js';

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('is-open');
  mobileNav.inert = true;
  document.body.classList.remove('menu-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  mobileNav.classList.toggle('is-open', open);
  mobileNav.inert = !open;
  document.body.classList.toggle('menu-open', open);
  header.classList.remove('is-hidden');
});
mobileNav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
let lastScroll = window.scrollY;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current < 80) { header.classList.remove('is-hidden'); lastScroll = current; return; }
  if (Math.abs(current - lastScroll) < 12) return;
  const interacting = menuButton.getAttribute('aria-expanded') === 'true' || header.contains(document.activeElement);
  header.classList.toggle('is-hidden', current > lastScroll && !interacting);
  lastScroll = current;
}, { passive: true });
header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
document.querySelectorAll('a[href="/services"], a[href="/booking"]').forEach(link => {
  if (link.getAttribute('href') === window.location.pathname.replace(/\/$/, '')) link.setAttribute('aria-current', 'page');
});

const callDialog = document.querySelector('#call-dialog');
document.querySelectorAll('.call-trigger').forEach(button => button.addEventListener('click', () => callDialog.showModal()));
callDialog.querySelector('.dialog-close').addEventListener('click', () => callDialog.close());
callDialog.addEventListener('click', event => {
  const rect = callDialog.getBoundingClientRect();
  if (event.target === callDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) callDialog.close();
});

const form = document.querySelector('#booking-form');
if (form) {
  const fields = Object.fromEntries(['name', 'phone', 'service', 'barber', 'date'].map(id => [id, document.getElementById(id)]));
  const requestedBarber = new URLSearchParams(window.location.search).get('barber');
  if (barbers.some(barber => barber.name === requestedBarber)) fields.barber.value = requestedBarber;
  const updateSummary = () => {
    fields.date.min = todayInDubai();
    const service = services.find(service => service.id === fields.service.value);
    document.getElementById('summary-service').textContent = service?.name ?? 'Choose your service';
    document.getElementById('summary-price').textContent = service ? `AED ${service.price}` : '—';
    document.getElementById('summary-duration').textContent = service ? `${service.duration} min` : '—';
    document.getElementById('summary-barber').textContent = fields.barber.value;
    document.getElementById('summary-date').textContent = fields.date.value ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Dubai' }).format(new Date(`${fields.date.value}T12:00:00Z`)) : 'Not selected';
  };
  const clearError = id => {
    fields[id].removeAttribute('aria-invalid');
    document.getElementById(`${id}-error`).textContent = '';
  };
  for (const [id, field] of Object.entries(fields)) {
    field.addEventListener('input', () => clearError(id));
    field.addEventListener('change', updateSummary);
  }
  fields.date.addEventListener('focus', () => { fields.date.min = todayInDubai(); });
  updateSummary();
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(Object.entries(fields).map(([id, field]) => [id, field.value]));
    const errors = validateBooking(values);
    Object.keys(fields).forEach(clearError);
    for (const [id, message] of Object.entries(errors)) {
      fields[id].setAttribute('aria-invalid', 'true');
      document.getElementById(`${id}-error`).textContent = message;
    }
    if (Object.keys(errors).length) { fields[Object.keys(errors)[0]].focus(); return; }
    form.reset();
    updateSummary();
    window.location.assign(whatsappUrl);
  });
  // Clear personal details if the browser restores this page from its back/forward cache.
  window.addEventListener('pageshow', event => { if (event.persisted) { form.reset(); updateSummary(); } });
}


// Replay on each viewport entry; content stays readable without animation support.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle('is-revealed', entry.isIntersecting);
  }, { threshold: 0 });
  document.querySelectorAll([
    '.hero h1', '.hero-description', '.hero-actions', '.page-heading', '.price-notice',
    '.section-heading', '.about-grid > h2', '.about-copy > p', '.studio-facts > div',
    '.team-card', '.service-card', '.approach-layout > h2', '.approach-list > div',
    '.map-placeholder', '.contact-details', '.review-card', '.reviews-disclaimer',
    '.booking-notice', '#booking-form .form-heading', '#booking-form .field',
    '#booking-form .form-submit', '.booking-summary', '.closing > .container'
  ].join(',')).forEach(element => {
    element.classList.add('scroll-reveal');
    revealObserver.observe(element);
  });
}
