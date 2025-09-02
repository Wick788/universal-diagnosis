// Report View
class ReportView {
  constructor() {
    this.mockReports = {
      "RPT12345": {
        dateIssued: "2024-03-15",
        institution: "City Hospital",
        reportType: "Blood Test",
        findings: "Normal blood sugar levels.",
        doctorNotes: "Monitor diet regularly."
      },
      "RPT12346": {
        dateIssued: "2024-03-10",
        institution: "General Hospital",
        reportType: "X-Ray",
        findings: "No fractures detected.",
        doctorNotes: "Follow up in 2 weeks."
      },
      "RPT12347": {
        dateIssued: "2024-02-28",
        institution: "City Hospital",
        reportType: "MRI",
        findings: "Normal brain scan results.",
        doctorNotes: "No further action required."
      }
    };

    this.initializeReportView();
  }

  initializeReportView() {
    // Get report ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id');

    // Populate report data
    if (reportId && this.mockReports[reportId]) {
      const report = this.mockReports[reportId];
      document.getElementById('reportId').textContent = reportId;
      document.getElementById('dateIssued').textContent = report.dateIssued;
      document.getElementById('institution').textContent = report.institution;
      document.getElementById('reportType').textContent = report.reportType;
      document.getElementById('findings').textContent = report.findings;
      document.getElementById('doctorNotes').textContent = report.doctorNotes;

      // Initialize action buttons
      this.initializeActionButtons(report);
    } else {
      this.showReportNotFound();
    }
  }

  initializeActionButtons(report) {
    const downloadBtn = document.querySelector('button:first-of-type');
    const printBtn = document.querySelector('button:last-of-type');

    downloadBtn.addEventListener('click', () => this.downloadReport(report));
    printBtn.addEventListener('click', () => this.printReport());
  }

  downloadReport(report) {
    // Create a formatted report text
    const reportText = `
      Universal Diagnosis Platform
      Report ID: ${document.getElementById('reportId').textContent}
      Date Issued: ${report.dateIssued}
      Institution: ${report.institution}
      Report Type: ${report.reportType}

      Findings:
      ${report.findings}

      Doctor's Notes:
      ${report.doctorNotes}
    `;

    // Create a blob and download link
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${document.getElementById('reportId').textContent}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  printReport() {
    window.print();
  }

  showReportNotFound() {
    document.querySelector('main').innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Report Not Found</h2>
        <p class="text-gray-600 mb-4">The requested report could not be found.</p>
        <a href="patient-dashboard.html" class="text-blue-600 hover:text-blue-800">Back to Dashboard</a>
      </div>
    `;
  }
}

// Initialize ReportView if on report view page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('reportId')) {
    new ReportView();
  }
}); 