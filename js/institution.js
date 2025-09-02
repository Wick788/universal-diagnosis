// Institution Authentication
class InstitutionAuth {
  constructor() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleLogin = document.getElementById('toggleLogin');
    const toggleSignup = document.getElementById('toggleSignup');

    if (toggleLogin && toggleSignup) {
      toggleLogin.addEventListener('click', () => this.toggleForms('login'));
      toggleSignup.addEventListener('click', () => this.toggleForms('signup'));
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }
  }

  toggleForms(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleLogin = document.getElementById('toggleLogin');
    const toggleSignup = document.getElementById('toggleSignup');

    if (formType === 'login') {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
      toggleLogin.classList.add('bg-blue-600', 'text-white');
      toggleSignup.classList.remove('bg-blue-600', 'text-white');
    } else {
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
      toggleLogin.classList.remove('bg-blue-600', 'text-white');
      toggleSignup.classList.add('bg-blue-600', 'text-white');
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('institutionEmail').value;
    const password = document.getElementById('institutionPassword').value;

    // Simulate authentication
    if (email && password) {
      sessionStorage.setItem('institution', JSON.stringify({
        name: 'City Hospital',
        email: email
      }));
      window.location.href = 'institution-dashboard.html';
    }
  }

  handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('institutionName').value;
    const registrationId = document.getElementById('registrationId').value;
    const email = document.getElementById('institutionEmailSignup').value;
    const password = document.getElementById('institutionPasswordSignup').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Simulate registration
    if (name && registrationId && email && password) {
      sessionStorage.setItem('institution', JSON.stringify({
        name: name,
        email: email
      }));
      window.location.href = 'institution-dashboard.html';
    }
  }
}

// Institution Dashboard
class InstitutionDashboard {
  constructor() {
    this.initializeDashboard();
  }

  initializeDashboard() {
    const institution = JSON.parse(sessionStorage.getItem('institution'));
    if (institution) {
      document.getElementById('welcomeMessage').textContent = `Welcome, ${institution.name}`;
    } else {
      window.location.href = 'institution-auth.html';
    }
  }
}

// Initialize appropriate class based on current page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginForm') || document.getElementById('signupForm')) {
    new InstitutionAuth();
  } else if (document.getElementById('welcomeMessage')) {
    new InstitutionDashboard();
  }
}); 