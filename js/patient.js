// Patient Authentication
class PatientAuth {
  constructor() {
    this.loginForm = document.getElementById('loginForm');
    this.signupForm = document.getElementById('signupForm');
    this.loginBtn = document.getElementById('loginBtn');
    this.signupBtn = document.getElementById('signupBtn');
    this.errorContainer = document.getElementById('errorContainer');
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Toggle between login and signup forms
    this.loginBtn?.addEventListener('click', () => this.toggleForms('login'));
    this.signupBtn?.addEventListener('click', () => this.toggleForms('signup'));

    // Form submissions
    this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
    this.signupForm?.addEventListener('submit', (e) => this.handleSignup(e));
  }

  showError(message) {
    if (this.errorContainer) {
      this.errorContainer.textContent = message;
      this.errorContainer.classList.remove('hidden');
      setTimeout(() => {
        this.errorContainer.classList.add('hidden');
      }, 5000);
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  toggleForms(formType) {
    if (!this.loginBtn || !this.signupBtn || !this.loginForm || !this.signupForm) {
      this.showError('Form elements not found');
      return;
    }

    if (formType === 'login') {
      this.loginBtn.classList.add('text-blue-700', 'border-blue-700');
      this.loginBtn.classList.remove('text-gray-500', 'border-transparent');
      this.signupBtn.classList.add('text-gray-500', 'border-transparent');
      this.signupBtn.classList.remove('text-blue-700', 'border-blue-700');
      this.loginForm.classList.remove('hidden');
      this.signupForm.classList.add('hidden');
    } else {
      this.signupBtn.classList.add('text-blue-700', 'border-blue-700');
      this.signupBtn.classList.remove('text-gray-500', 'border-transparent');
      this.loginBtn.classList.add('text-gray-500', 'border-transparent');
      this.loginBtn.classList.remove('text-blue-700', 'border-blue-700');
      this.signupForm.classList.remove('hidden');
      this.loginForm.classList.add('hidden');
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    try {
      const email = document.getElementById('loginEmail')?.value;
      const password = document.getElementById('loginPassword')?.value;

      if (!email || !password) {
        this.showError('Please fill in all fields');
        return;
      }

      if (!this.validateEmail(email)) {
        this.showError('Please enter a valid email address');
        return;
      }

      // Simulate authentication with delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user session securely
      sessionStorage.setItem('patientEmail', email);
      sessionStorage.setItem('patientName', 'John Doe'); // Mock data
      sessionStorage.setItem('lastLogin', new Date().toISOString());
      
      // Redirect to dashboard
      window.location.href = 'patient-dashboard.html';
    } catch (error) {
      this.showError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    try {
      const name = document.getElementById('signupName')?.value;
      const email = document.getElementById('signupEmail')?.value;
      const password = document.getElementById('signupPassword')?.value;
      const confirmPassword = document.getElementById('confirmPassword')?.value;

      if (!name || !email || !password || !confirmPassword) {
        this.showError('Please fill in all fields');
        return;
      }

      if (!this.validateEmail(email)) {
        this.showError('Please enter a valid email address');
        return;
      }

      if (!this.validatePassword(password)) {
        this.showError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
        return;
      }

      if (password !== confirmPassword) {
        this.showError('Passwords do not match');
        return;
      }

      // Simulate registration with delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user session securely
      sessionStorage.setItem('patientEmail', email);
      sessionStorage.setItem('patientName', name);
      sessionStorage.setItem('lastLogin', new Date().toISOString());
      
      // Redirect to dashboard
      window.location.href = 'patient-dashboard.html';
    } catch (error) {
      this.showError('An error occurred during registration. Please try again.');
      console.error('Signup error:', error);
    }
  }
}

// Patient Dashboard
class PatientDashboard {
  constructor() {
    this.mockReports = [
      {
        id: "RPT12345",
        dateIssued: "2024-03-15",
        reportType: "Blood Test",
        institution: "City Hospital",
        status: "Ready to View",
        findings: "Normal blood sugar levels.",
        doctorNotes: "Monitor diet regularly."
      },
      {
        id: "RPT12346",
        dateIssued: "2024-03-10",
        reportType: "X-Ray",
        institution: "General Hospital",
        status: "Ready to View",
        findings: "No fractures detected.",
        doctorNotes: "Follow up in 2 weeks."
      },
      {
        id: "RPT12347",
        dateIssued: "2024-02-28",
        reportType: "MRI",
        institution: "City Hospital",
        status: "Ready to View",
        findings: "Normal brain scan results.",
        doctorNotes: "No further action required."
      }
    ];

    this.filteredReports = [...this.mockReports];
    this.currentPage = 1;
    this.reportsPerPage = 10;
    this.errorContainer = document.getElementById('errorContainer');
    this.loadingIndicator = document.getElementById('loadingIndicator');

    this.initializeDashboard();
  }

  initializeDashboard() {
    try {
      // Check authentication
      if (!this.isAuthenticated()) {
        window.location.href = 'patient-auth.html';
        return;
      }

      // Set welcome message
      const patientName = sessionStorage.getItem('patientName');
      if (patientName) {
        const welcomeElement = document.querySelector('.welcome-message');
        if (welcomeElement) {
          welcomeElement.textContent = `Welcome, ${patientName}!`;
        }
      }

      // Initialize filters
      this.initializeFilters();
      
      // Populate reports table
      this.populateReportsTable(this.filteredReports);

      // Add event listeners for pagination
      this.initializePagination();

      // Add keyboard navigation
      this.initializeKeyboardNavigation();
    } catch (error) {
      this.showError('Failed to initialize dashboard. Please try refreshing the page.');
      console.error('Dashboard initialization error:', error);
    }
  }

  isAuthenticated() {
    const lastLogin = sessionStorage.getItem('lastLogin');
    if (!lastLogin) return false;

    // Check if session is expired (24 hours)
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const hoursDiff = (now - lastLoginDate) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      sessionStorage.clear();
      return false;
    }
    
    return true;
  }

  showError(message) {
    if (this.errorContainer) {
      this.errorContainer.textContent = message;
      this.errorContainer.classList.remove('hidden');
      setTimeout(() => {
        this.errorContainer.classList.add('hidden');
      }, 5000);
    }
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.remove('hidden');
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('hidden');
    }
  }

  initializeFilters() {
    const dateRange = document.getElementById('dateRange');
    const reportType = document.getElementById('reportType');
    const institution = document.getElementById('institution');

    if (!dateRange || !reportType || !institution) {
      this.showError('Filter elements not found');
      return;
    }

    dateRange.addEventListener('change', () => this.filterReports());
    reportType.addEventListener('change', () => this.filterReports());
    institution.addEventListener('change', () => this.filterReports());
  }

  initializePagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    if (!prevBtn || !nextBtn || !pageInfo) return;

    prevBtn.addEventListener('click', () => this.changePage(-1));
    nextBtn.addEventListener('click', () => this.changePage(1));

    this.updatePaginationInfo();
  }

  initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.changePage(-1);
      } else if (e.key === 'ArrowRight') {
        this.changePage(1);
      }
    });
  }

  changePage(delta) {
    const newPage = this.currentPage + delta;
    const maxPage = Math.ceil(this.filteredReports.length / this.reportsPerPage);

    if (newPage >= 1 && newPage <= maxPage) {
      this.currentPage = newPage;
      this.populateReportsTable(this.filteredReports);
      this.updatePaginationInfo();
    }
  }

  updatePaginationInfo() {
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
      const maxPage = Math.ceil(this.filteredReports.length / this.reportsPerPage);
      pageInfo.textContent = `Page ${this.currentPage} of ${maxPage}`;
    }
  }

  async filterReports() {
    try {
      this.showLoading();
      
      const selectedDateRange = document.getElementById('dateRange')?.value;
      const selectedReportType = document.getElementById('reportType')?.value;
      const selectedInstitution = document.getElementById('institution')?.value;

      let filteredReports = [...this.mockReports];

      if (selectedDateRange !== 'all') {
        const now = new Date();
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
        const last3Months = new Date(now.setMonth(now.getMonth() - 3));
        const last6Months = new Date(now.setMonth(now.getMonth() - 6));

        filteredReports = filteredReports.filter(report => {
          const reportDate = new Date(report.dateIssued);
          switch (selectedDateRange) {
            case 'lastMonth':
              return reportDate >= lastMonth;
            case 'last3Months':
              return reportDate >= last3Months;
            case 'last6Months':
              return reportDate >= last6Months;
            default:
              return true;
          }
        });
      }

      if (selectedReportType !== 'all') {
        filteredReports = filteredReports.filter(report => 
          report.reportType.toLowerCase().includes(selectedReportType.toLowerCase())
        );
      }

      if (selectedInstitution !== 'all') {
        filteredReports = filteredReports.filter(report => 
          report.institution.toLowerCase().includes(selectedInstitution.toLowerCase())
        );
      }

      this.filteredReports = filteredReports;
      this.currentPage = 1;
      this.populateReportsTable(filteredReports);
      this.updatePaginationInfo();
    } catch (error) {
      this.showError('Failed to filter reports. Please try again.');
      console.error('Filter error:', error);
    } finally {
      this.hideLoading();
    }
  }

  populateReportsTable(reports) {
    const tableBody = document.getElementById('reportsTableBody');
    if (!tableBody) {
      this.showError('Reports table not found');
      return;
    }

    tableBody.innerHTML = '';

    const startIndex = (this.currentPage - 1) * this.reportsPerPage;
    const endIndex = startIndex + this.reportsPerPage;
    const paginatedReports = reports.slice(startIndex, endIndex);

    if (paginatedReports.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td colspan="5" class="px-6 py-4 text-center text-gray-500">
          No reports found
        </td>
      `;
      tableBody.appendChild(row);
      return;
    }

    paginatedReports.forEach(report => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.formatDate(report.dateIssued)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.escapeHtml(report.reportType)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.escapeHtml(report.institution)}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            ${this.escapeHtml(report.status)}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <a href="report-view.html?id=${this.escapeHtml(report.id)}" class="text-blue-600 hover:text-blue-900">View Report</a>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Initialize appropriate class based on current page
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (document.getElementById('loginForm')) {
      new PatientAuth();
    } else if (document.getElementById('reportsTableBody')) {
      new PatientDashboard();
    }
  } catch (error) {
    console.error('Initialization error:', error);
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
      errorContainer.textContent = 'Failed to initialize the application. Please try refreshing the page.';
      errorContainer.classList.remove('hidden');
    }
  }
}); 