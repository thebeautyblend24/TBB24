const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const form = document.getElementById('booking-form');
const serviceSelect = document.getElementById('service');
const dateInput = document.getElementById('date');
const status = document.getElementById('form-status');

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split('T')[0];
dateInput.min = localToday;
document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 18);
});

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');

    const filter = button.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

document.querySelectorAll('[data-select-service]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.selectService;
    const exactOption = [...serviceSelect.options].find(option => option.value === selected);
    if (exactOption) {
      serviceSelect.value = selected;
    } else if (selected === 'Hair Styling') {
      serviceSelect.value = 'Hair Styling';
    } else if (selected === 'Nail Treatments') {
      serviceSelect.value = 'Gel Polish, Hands';
    } else if (selected === 'Mehndi Services') {
      serviceSelect.value = 'Bridal Mehndi';
    }
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => serviceSelect.focus(), 500);
  });
});

const errorMessages = {
  name: 'Enter your full name.',
  phone: 'Enter a phone number.',
  service: 'Choose a service.',
  people: 'Enter the number of people.',
  date: 'Choose a preferred date.',
  time: 'Choose a preferred time.',
  location: 'Enter the service location.',
  consent: 'Please confirm before sending.'
};

function clearErrors() {
  form.querySelectorAll('[aria-invalid="true"]').forEach(field => field.removeAttribute('aria-invalid'));
  Object.keys(errorMessages).forEach(name => {
    const node = document.getElementById(`${name}-error`);
    if (node) node.textContent = '';
  });
}

function validateForm() {
  clearErrors();
  let firstInvalid = null;
  const requiredFields = ['name', 'phone', 'service', 'people', 'date', 'time', 'location', 'consent'];

  requiredFields.forEach(name => {
    const field = form.elements[name];
    const invalid = field.type === 'checkbox' ? !field.checked : !String(field.value).trim();
    if (invalid) {
      field.setAttribute('aria-invalid', 'true');
      const error = document.getElementById(`${name}-error`);
      if (error) error.textContent = errorMessages[name];
      if (!firstInvalid) firstInvalid = field;
    }
  });

  if (dateInput.value && dateInput.value < localToday) {
    dateInput.setAttribute('aria-invalid', 'true');
    document.getElementById('date-error').textContent = 'Choose today or a future date.';
    if (!firstInvalid) firstInvalid = dateInput;
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  status.textContent = '';
  if (!validateForm()) return;

  const data = new FormData(form);
  const requestedDate = new Date(`${data.get('date')}T00:00:00`);
  const formattedDate = requestedDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const message = [
    'Hi Ishika, I would like to request an appointment with The Beauty Blend.',
    '',
    `Name: ${data.get('name')}`,
    `Phone: ${data.get('phone')}`,
    `Service: ${data.get('service')}`,
    `Number of people: ${data.get('people')}`,
    `Preferred date: ${formattedDate}`,
    `Preferred time: ${data.get('time')}`,
    `Location: ${data.get('location')}`,
    `Notes: ${data.get('notes') || 'None'}`,
    '',
    'Please confirm availability, final pricing and appointment details.'
  ].join('\n');

  status.textContent = 'Opening WhatsApp with your booking request.';
  const url = `https://wa.me/919712512034?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
