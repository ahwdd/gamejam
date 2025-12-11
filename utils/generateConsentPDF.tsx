// @/utils/generateConsentPDF.ts

export interface ConsentFormData {
  guardianName: string;
  studentName: string;
  studentSchool: string;
  studentGrade: string;
  guardianEmail: string;
  guardianPhone: string;
  relationshipToStudent: string;
}

export function generateConsentFormPDF(data: ConsentFormData): Promise<void> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      console.error('Could not access iframe document');
      document.body.removeChild(iframe);
      resolve();
      return;
    }

    const htmlContent = generateConsentFormHTML(data);

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Wait for load then print
    iframe.onload = () => {
      // small delay to ensure fonts/layout settled
      setTimeout(() => {
        iframe.contentWindow?.print();

        // remove iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
          resolve();
        }, 800);
      }, 300);
    };
  });
}

export function downloadConsentFormHTML(data: ConsentFormData): void {
  const htmlContent = generateConsentFormHTML(data);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `consent-form-${data.studentName.replace(/\s+/g, '-')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generateConsentFormHTML(data: ConsentFormData): string {
  // Compact styles: smaller fonts, tighter gaps and margins, reduced paddings.
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Guardian Consent Form - Student Hub</title>
  <style>
    /* Page & base */
    @page {
      size: A4;
      margin: 12mm; /* reduced margin to fit content */
    }
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;              /* smaller base font */
      line-height: 1.25;           /* tighter line height */
      color: #222;
      max-width: 780px;
      margin: 0 auto;
      padding: 8px;                /* reduced padding */
      box-sizing: border-box;
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 10px;        /* tightened spacing */
      padding-bottom: 8px;
      border-bottom: 2px solid #8b5cf6;
    }
    .header h1 {
      color: #8b5cf6;
      margin: 0;
      font-size: 18px;            /* smaller header */
      font-weight: 700;
    }
    .header p {
      color: #555;
      margin: 4px 0 0 0;
      font-size: 11px;
    }

    /* Sections */
    .section {
      margin-bottom: 10px;
    }
    .section-title {
      color: #8b5cf6;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 6px;
      padding-left: 8px;
      border-left: 4px solid #8b5cf6;
      display: inline-block;
    }

    /* Info grid */
    .info-grid {
      display: grid;
      grid-template-columns: 130px 1fr; /* slightly narrower labels */
      gap: 6px 8px;                      /* smaller gaps */
      align-items: start;
      margin-bottom: 6px;
    }
    .info-label {
      font-weight: 700;
      color: #444;
      font-size: 12px;
    }
    .info-value {
      color: #222;
      font-size: 12px;
    }

    /* Consent block */
    .consent-text {
      background: #fbfbfd;
      padding: 10px;                /* smaller padding */
      border-left: 4px solid #ec4899;
      margin: 10px 0;
      font-size: 12px;
    }
    .consent-text p {
      margin: 6px 0;
    }
    .consent-text ul {
      margin: 6px 0 6px 18px;
      padding: 0;
    }
    .consent-text li {
      margin: 3px 0;
    }

    /* Signature */
    .signature-section {
      margin-top: 8px;
      padding: 8px;
      border-radius: 4px;
    }
    .signature-line {
      margin-top: 26px;             /* reduced space for signature */
      padding-top: 6px;
      text-align: left;
    }
    .signature-line div {
      display: inline-block;
      border-bottom: 1px solid #444;
      width: 260px;                 /* signature line width */
      padding-bottom: 6px;
      height: 22px;
    }
    .date-line {
      margin-top: 12px;
      font-size: 12px;
    }
    .date-line strong {
      margin-right: 8px;
      font-weight: 700;
    }

    /* Footer */
    .footer {
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #666;
      text-align: center;
    }

    /* Print adjustments */
    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      .no-print { display: none !important; }
      /* Prevent elements from breaking across pages when possible */
      .consent-text, .signature-section, .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Student Hub - GameThon Initiative</h1>
    <p>Guardian Consent Form for Game Jam Participation</p>
  </div>

  <div class="section">
    <div class="section-title">Student Information</div>
    <div class="info-grid">
      <div class="info-label">Student Name:</div>
      <div class="info-value">${escapeHtml(data.studentName)}</div>

      <div class="info-label">School:</div>
      <div class="info-value">${escapeHtml(data.studentSchool)}</div>

      <div class="info-label">Grade:</div>
      <div class="info-value">${escapeHtml(data.studentGrade)}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Guardian Information</div>
    <div class="info-grid">
      <div class="info-label">Guardian Name:</div>
      <div class="info-value">${escapeHtml(data.guardianName)}</div>

      <div class="info-label">Relationship:</div>
      <div class="info-value">${escapeHtml(data.relationshipToStudent)}</div>

      <div class="info-label">Email:</div>
      <div class="info-value">${escapeHtml(data.guardianEmail)}</div>

      <div class="info-label">Phone:</div>
      <div class="info-value">${escapeHtml(data.guardianPhone)}</div>
    </div>
  </div>

  <div class="consent-text">
    <p><strong>Dear Mr./Ms. ${escapeHtml(data.guardianName)},</strong></p>

    <p>Warm greetings from the <strong>GameThon initiative</strong>, dedicated to increasing students' awareness and skills in video game design.</p>

    <p>Please be informed that your child, <strong>${escapeHtml(data.studentName)}</strong>, has registered on the Student Hub platform and will be creating and uploading games as part of the program.</p>

    <p>This form serves as a confirmation of your approval for their participation in:</p>
    <ul>
      <li>Game Jam events and competitions</li>
      <li>Team-based game development projects</li>
      <li>Submission of creative game projects</li>
      <li>Collaborative activities with other students</li>
    </ul>

    <p><strong>By signing below, you acknowledge and consent to:</strong></p>
    <ul>
      <li>Your child's participation in Student Hub activities</li>
      <li>The creation and submission of game projects</li>
      <li>Collaborative work with peers under supervision</li>
      <li>Display of their work on the platform (usernames only, no personal information)</li>
    </ul>
  </div>

  <div class="signature-section">
    <p><strong>Kindly sign below to indicate your consent:</strong></p>

    <div class="signature-line">
      <div></div>
    </div>

    <div class="date-line">
      <strong>Date:</strong> _______________________
    </div>
  </div>

  <div class="footer">
    <p><strong>GameThon Initiative</strong></p>
  </div>
</body>
</html>`;

  function escapeHtml(str: string | undefined | null) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
