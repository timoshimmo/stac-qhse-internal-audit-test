import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Loader2, Printer, FileText, CheckCircle2 } from 'lucide-react';

export interface CertificateProps {
  participantName: string;
  date?: string;
  courseName?: string;
  publisher?: string;
  certNo?: string;
  variant?: 'full' | 'button' | 'icon';
}

const STAC_LOGO_SVG = `
<svg width="76" height="76" viewBox="0 0 950 850" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto;">
  <path
    d="M0 0 C3.02 1.4 5.95 2.91 8.89 4.48 C10.88 5.51 12.87 6.54 14.86 7.57 C15.9 8.12 16.94 8.66 18.01 9.23 C57.2 29.58 97.53 46.95 139.39 60.98 C176.82 73.48 212.11 79.93 247.39 85.98 C258.4 87.87 266.56 89.27 274.73 90.64 C301.77 95.17 301.77 95.17 305.39 96.98 C303.95 274.74 303.95 274.74 286.39 355.98 C272.75 419.12 253.79 479.98 222.23 533.83 C208.36 557.99 198.86 573.17 188.39 587.98 C168.89 615.86 168.89 615.86 160.39 625.98 C148.69 639.92 148.69 639.92 143.06 645.31 C133.99 655.53 129.25 660.28 124.48 665.03 C114.59 674.93 109.14 680.07 103.39 684.98 C95.12 692.49 91.59 695.49 87.96 698.42 C84.15 701.49 80.49 704.67 76.89 707.98 C71.56 712.87 66.06 717.49 60.39 721.98 C50.0 730.16 41.74 735.09 33.29 740.06 C22.87 746.62 17.25 750.37 5.46 756.48 C-1.8 759.89 -6.48 762.03 -12.15 760.13 C-20.92 755.98 -29.69 751.71 -40.15 744.72 C-52.86 736.73 -66.66 728.29 -90.74 707.61 C-99.92 699.73 -114.38 686.99 -120.61 681.48 C-132.45 671.1 -143.29 660.42 -156.98 645.85 C-174.73 626.86 -184.66 612.98 -194.61 598.98 C-213.03 573.15 -227.77 548.71 -241.48 523.48 C-254.12 499.47 -263.36 477.23 -274.82 448.39 C-290.72 394.38 -301.41 353.91 -310.33 290.92 C-313.33 254.63 -315.73 202.04 -315.86 199.27 C-318.79 137.37 -318.79 137.37 -318.79 116.67 C-318.84 105.1 -318.86 103 -316.61 95.98 C-311.52 94.86 -304.79 93.66 -301.13 93.0 C-290.15 91.04 -279.14 89.21 -268.13 87.39 C-243.13 83.27 -218.25 78.91 -193.61 72.98 C-134.51 58.6 -79.95 35.56 -29.47 8.72 C-21.83 4.63 -18.98 3.04 0 0 Z"
    fill="#002D5C"
    transform="translate(486.6, 51)"
  />
  <path
    d="M0 0 C2.2 0 4.39 -0.02 6.59 -0.04 C18.27 -0.09 29.07 1.38 40.28 4.69 C52.45 8.48 65.03 9.19 66.94 7.68 C74.28 6.0 76.99 6.08 79.03 6.19 C81.04 19.76 82.83 33.34 84.39 46.98 C85.62 57.52 86.04 61.22 87.03 73.19 C81.42 73.19 75.81 73.19 70.03 73.19 C67.03 65.44 63.45 56.53 52.29 41.48 C48.29 36.39 41.97 31.87 28.58 21.38 C10.8 17.28 -5.97 19.19 -32.97 35.19 C-36.62 40.59 -35.97 52.19 -11.04 79.92 C-1.84 84.81 5.04 88.47 8.55 90.33 C75.97 126.28 93.33 158.45 101.97 173.17 C107.59 187.61 118.39 215.32 127.42 238.38 C136.61 261.89 155.21 309.47 169.07 345.02 C178.05 368.15 185.12 383.85 207.03 407.19 C214.47 408.94 221.03 410.19 221.03 427.19 C176.81 427.19 132.59 427.19 87.03 427.19 C87.03 410.19 91.71 410.07 100.98 409.8 C117.53 409.22 123.16 403.62 124.41 387.55 C121.16 376.75 112.34 356.06 106.63 342.44 C104.13 336.43 103.03 333.19 73.0 332.86 C42.97 332.53 12.03 332.19 10.03 341.19 C6.59 351.08 2.47 362.44 -0.67 371.09 C-5.48 384.34 -5.97 400.19 5.03 408.19 C18.07 409.46 27.36 409.88 34.03 410.19 C34.03 427.19 -75.97 427.19 -75.97 410.19 C-60.99 409.32 -46.97 402.19 -44.14 400.43 C-31.66 381.47 -22.28 351.12 -14.64 329.67 C-2.56 295.93 3.54 278.92 5.59 273.21 C7.03 269.19 4.52 268.81 -15.47 265.31 C-29.19 261.94 -47.71 256.26 -60.97 256.19 C-67.34 263.36 -74.74 262.4 -77.3 259.5 C-81.96 230.95 -83.88 214.09 -86.56 197.31 C-86.97 186.19 -69.97 186.19 -67.47 193.25 C-56.95 217.17 -47.97 227.19 -46.37 229.07 C-23.0 245.28 -8.97 247.19 16.03 244.19 C18.19 238.88 20.66 231.88 25.45 218.32 C30.24 204.8 34.13 193.75 37.03 184.19 C19.25 166.73 9.09 161.06 5.68 159.12 C-18.59 145.87 -45.62 131.45 -83.01 85.06 C-87.45 68.42 -77.37 36.48 -48.97 10.19 C-32.08 1.66 -15.88 0 0 0 Z"
    fill="#5AAD45"
    transform="translate(435.97, 228.8)"
  />
  <path
    d="M0 0 C5.61 0 11.22 0 17 0 C17.825 2.33 18.65 4.66 19.5 7.06 C24.12 19.6 30.01 30.99 39 41 C50.29 53.53 63.96 59.08 78 61 C86.38 61.37 94.67 60.81 103 60 C101.86 63.29 100.71 66.58 99.56 69.88 C98.26 73.61 97.05 77.08 96.76 77.94 C96 80 96 80 95 82 C87.77 82.27 81.31 81.29 74.25 79.75 C64.55 77.65 58.31 75.98 52.02 73.91 C44.01 71.49 34.34 68.61 26 70 C24.82 71.53 23.64 73.06 22.56 74.66 C19.63 77.17 15.9 76.41 12.23 76.21 C11.13 76.11 11.13 76.11 10 76 C8.8 66.55 7.82 59.84 6.56 53.12 C5.01 44.76 4.02 36.35 3.09 27.9 C2.45 22.23 1.58 16.71 0.4 11.13 C-0.31 7.37 -0.12 3.81 0 0 Z"
    fill="#FBFBFC"
    transform="translate(349, 415)"
  />
  <path
    d="M0 0 C0.22 0.55 0.43 1.11 0.66 1.68 C2.93 7.49 5.2 13.3 7.47 19.1 C8.32 21.27 9.16 23.43 10.01 25.59 C11.23 28.72 12.45 31.84 13.67 34.96 C15.16 38.77 15.89 40.64 16.94 43.33 C17.67 45.16 18.41 46.99 19.16 48.8 C20.77 52.69 21.28 53.91 22 59 C-1.76 59 -25.52 59 -50 59 C-49.01 55.7 -48.02 52.4 -47 49 C-38.32 17.15 -38.32 17.15 -29.7 12.09 C-25.1 10.07 -20.36 8.81 -15.48 7.68 C-10.98 6.44 -7.61 3.9 -3.83 1.21 C-2 0 -2 0 0 0 Z"
    fill="#01305C"
    transform="translate(507, 479)"
  />
  <path
    d="M0 0 C3.22 1.61 3.84 4.98 5.11 8.18 C6.6 11.89 7.81 14.95 8.74 17.3 C11.24 23.45 12.42 26.43 13.3 28.54 C15.17 33.39 14.33 36.35 12.26 38.92 C9.6 40.37 6.75 41.94 4.89 42.98 C-1.95 46.7 -10.15 51 -18 51 C-15.49 40.09 -11.28 29.75 -7.31 19.31 C-5.89 15.56 -5.19 13.68 -3.46 9.12 C-1.73 4.56 0 0 0 0 Z"
    fill="#FAFCFA"
    transform="translate(491, 443)"
  />
</svg>
`;

const STAC_SEAL_SVG = `
<svg width="220" height="110" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto;">
  <circle cx="200" cy="100" r="88" stroke="#1e3a5f" stroke-width="6" fill="#f8fafc" />
  <circle cx="200" cy="100" r="76" stroke="#2d6a4f" stroke-width="2" stroke-dasharray="6 4" fill="none" />
  <circle cx="200" cy="100" r="64" fill="#002D5C" />
  <text x="200" y="32" text-anchor="middle" fill="#002D5C" font-size="18" font-weight="900" letter-spacing="2" font-family="Arial, sans-serif">
    ★ STAC MARINE OFFSHORE ★
  </text>
  <path d="M200 60 L200 130 M182 85 L218 85 M168 115 Q200 148 232 115" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none" />
  <rect x="110" y="146" width="180" height="28" rx="14" fill="#2d6a4f" />
  <text x="200" y="166" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="900" letter-spacing="3" font-family="Arial, sans-serif">
    VERIFIED
  </text>
</svg>
`;

const SIGNATURE_SVG = `
<svg width="150" height="42" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto;">
  <path d="M12 36 C35 15, 48 8, 65 24 C82 40, 95 18, 115 12 C132 7, 142 22, 152 38 M45 28 C58 12, 85 4, 102 26 M75 32 L135 18" stroke="#002D5C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;

const CORNER_TL = `
<svg style="position:absolute;top:16px;left:16px;width:52px;height:52px;z-index:2;pointer-events:none;" viewBox="0 0 48 48" fill="none">
  <path d="M4 44 L4 4 L44 4" stroke="#1e3a5f" stroke-width="3" fill="none" />
  <path d="M4 4 L16 4 M4 4 L4 16" stroke="#2d6a4f" stroke-width="2" fill="none" />
</svg>
`;

const CORNER_TR = `
<svg style="position:absolute;top:16px;right:16px;width:52px;height:52px;z-index:2;pointer-events:none;transform:scaleX(-1);" viewBox="0 0 48 48" fill="none">
  <path d="M4 44 L4 4 L44 4" stroke="#1e3a5f" stroke-width="3" fill="none" />
  <path d="M4 4 L16 4 M4 4 L4 16" stroke="#2d6a4f" stroke-width="2" fill="none" />
</svg>
`;

const CORNER_BL = `
<svg style="position:absolute;bottom:80px;left:16px;width:52px;height:52px;z-index:2;pointer-events:none;transform:scaleY(-1);" viewBox="0 0 48 48" fill="none">
  <path d="M4 44 L4 4 L44 4" stroke="#1e3a5f" stroke-width="3" fill="none" />
  <path d="M4 4 L16 4 M4 4 L4 16" stroke="#2d6a4f" stroke-width="2" fill="none" />
</svg>
`;

const CORNER_BR = `
<svg style="position:absolute;bottom:80px;right:16px;width:52px;height:52px;z-index:2;pointer-events:none;transform:scale(-1);" viewBox="0 0 48 48" fill="none">
  <path d="M4 44 L4 4 L44 4" stroke="#1e3a5f" stroke-width="3" fill="none" />
  <path d="M4 4 L16 4 M4 4 L4 16" stroke="#2d6a4f" stroke-width="2" fill="none" />
</svg>
`;

export function getCleanCertificateHTML(props: {
  participantName: string;
  date: string;
  courseName: string;
  publisher: string;
  certNo: string;
}) {
  return `
    <div id="clean-certificate-root" style="
      width: 960px;
      height: 678px;
      background: #ffffff;
      border: 6px solid #1e3a5f;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      font-family: Georgia, 'Times New Roman', serif;
      margin: 0;
      padding: 0;
    ">
      <!-- Inner green border -->
      <div style="
        position: absolute;
        inset: 10px;
        border: 2px solid #2d6a4f;
        border-radius: 2px;
        pointer-events: none;
        z-index: 1;
        box-sizing: border-box;
      "></div>

      <!-- Corners -->
      ${CORNER_TL}
      ${CORNER_TR}
      ${CORNER_BL}
      ${CORNER_BR}

      <!-- Main Body -->
      <div style="padding: 26px 60px 80px; position: relative; z-index: 5; text-align: center;">
        
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 2px; margin-top: -6px;">
          ${STAC_LOGO_SVG}
        </div>

        <!-- Academy Name -->
        <div style="
          text-align: center;
          letter-spacing: 0.35em;
          font-size: 14px;
          font-family: Arial, sans-serif;
          font-weight: 700;
          color: #2d6a4f;
          text-transform: uppercase;
          margin: 4px 0 10px 0;
        ">
          S T A C &nbsp; A C A D E M Y
        </div>

        <!-- Divider with dot -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 0 auto 10px; width: 65%;">
          <div style="flex: 1; height: 1px; background: #1e3a5f;"></div>
          <div style="width: 6px; height: 6px; background: #1e3a5f; border-radius: 50%;"></div>
          <div style="flex: 1; height: 1px; background: #1e3a5f;"></div>
        </div>

        <!-- Title & Subtitle -->
        <div style="font-size: 34px; font-weight: 400; color: #0f172a; margin: 0 0 3px; font-family: Georgia, serif;">
          Certificate of Completion
        </div>
        <div style="font-size: 14px; color: #64748b; font-style: italic; margin-bottom: 6px; font-family: Georgia, serif;">
          This is to certify that
        </div>

        <!-- Name -->
        <div style="font-size: 42px; font-weight: bold; color: #0f172a; font-family: Georgia, serif; margin: 0 0 4px; line-height: 1.1;">
          ${props.participantName}
        </div>
        <div style="width: 55%; margin: 0 auto 8px; height: 2px; background: linear-gradient(90deg, transparent, #2d6a4f, transparent);"></div>

        <!-- Completion text -->
        <div style="font-size: 14px; color: #374151; margin-bottom: 4px; font-style: italic; font-family: Georgia, serif;">
          has successfully completed the course
        </div>

        <!-- Course name & Publisher -->
        <div style="font-size: 21px; font-weight: bold; color: #0f172a; margin: 0 0 3px; font-family: Georgia, serif;">
          ${props.courseName}
        </div>
        <div style="font-size: 13px; font-weight: bold; color: #475569; font-family: Arial, sans-serif;">
          Published by: ${props.publisher}
        </div>

        <div style="width: 80%; margin: 8px auto; height: 1px; background: #e2e8f0;"></div>

        <!-- Seal & Signature -->
        <div style="display: flex; align-items: flex-end; justify-content: space-between; padding: 0 16px; margin-top: 2px;">
          <div style="width: 170px;"></div>

          <div style="display: flex; align-items: center; justify-content: center; width: 220px; flex-shrink: 0;">
            ${STAC_SEAL_SVG}
          </div>

          <div style="text-align: center; min-width: 180px;">
            <div style="margin-bottom: -6px;">
              ${SIGNATURE_SVG}
            </div>
            <div style="width: 150px; height: 1px; background: #94a3b8; margin: 4px auto 3px;"></div>
            <div style="font-size: 11px; color: #94a3b8; font-family: Arial, sans-serif; font-style: italic;">
              Head of Corporate Services
            </div>
            <div style="font-style: normal; font-weight: 700; color: #1e3a5f; font-size: 12px; margin-top: 2px; font-family: Arial, sans-serif;">
              Musa Ibn Said
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bar -->
      <div style="
        background: #1e3a5f;
        padding: 12px 36px;
        display: grid;
        grid-template-columns: 1.25fr 1fr 1fr;
        gap: 16px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        box-sizing: border-box;
        align-items: center;
      ">
        <div style="display: flex; align-items: center; gap: 10px; text-align: left;">
          <div style="
            width: 40px;
            height: 40px;
            background: #ffffff;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            color: #1e3a5f;
            font-family: Arial, sans-serif;
            font-weight: 700;
            text-align: center;
            line-height: 1.2;
            flex-shrink: 0;
          ">
            QR<br/>CODE
          </div>
          <div>
            <div style="font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #4ade80; font-family: Arial, sans-serif;">
              SCAN TO VERIFY
            </div>
            <div style="font-size: 11px; font-weight: 600; color: #ffffff; font-family: Arial, sans-serif;">
              stacacademy.com/verify
            </div>
            <div style="font-size: 9px; color: rgba(255, 255, 255, 0.65); font-family: Arial, sans-serif;">
              Verify the authenticity of this certificate online
            </div>
          </div>
        </div>

        <div style="text-align: center;">
          <div style="font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #4ade80; font-family: Arial, sans-serif;">
            CERTIFICATE NO.
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #ffffff; font-family: Arial, sans-serif;">
            ${props.certNo}
          </div>
          <div style="font-size: 9px; color: rgba(255, 255, 255, 0.65); font-family: Arial, sans-serif;">
            Powered by OpenSesame
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #4ade80; font-family: Arial, sans-serif;">
            DATE ISSUED
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #ffffff; font-family: Arial, sans-serif;">
            ${props.date}
          </div>
          <div style="font-size: 9px; color: rgba(255, 255, 255, 0.65); font-family: Arial, sans-serif;">
            Official Credential
          </div>
        </div>
      </div>
    </div>
  `;
}

const Certificate: React.FC<CertificateProps> = ({ 
  participantName, 
  date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }), 
  courseName = "QHSE Internal Auditor-Test",
  publisher = "FORESHIP by RINA",
  certNo: propCertNo,
  variant = 'full',
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [generatedCertNo] = useState(() => `STAC-2026-${Math.floor(10000 + Math.random() * 90000)}-CRT`);

  const finalCertNo = propCertNo || generatedCertNo;

  const handleDownloadPDF = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setIsExporting(true);
    setDownloadSuccess(false);

    // 1. Create a pristine, completely isolated container on body (OUTSIDE any modal or popup)
    const isolatedContainer = document.createElement('div');
    isolatedContainer.id = 'temp-pdf-export-container';
    isolatedContainer.style.position = 'fixed';
    isolatedContainer.style.left = '0';
    isolatedContainer.style.top = '0';
    isolatedContainer.style.width = '960px';
    isolatedContainer.style.height = '678px';
    isolatedContainer.style.zIndex = '9999999';
    isolatedContainer.style.backgroundColor = '#ffffff';
    isolatedContainer.style.margin = '0';
    isolatedContainer.style.padding = '0';
    isolatedContainer.style.pointerEvents = 'none';
    isolatedContainer.style.boxSizing = 'border-box';

    // 2. Populate with the exact certificate HTML
    isolatedContainer.innerHTML = getCleanCertificateHTML({
      participantName: participantName || 'Participant',
      date,
      courseName,
      publisher,
      certNo: finalCertNo,
    });

    document.body.appendChild(isolatedContainer);

    try {
      // Small pause to allow styles and fonts to compute
      await new Promise((resolve) => setTimeout(resolve, 250));

      const certElement = isolatedContainer.firstElementChild as HTMLElement;

      const canvas = await html2canvas(certElement, {
        scale: 3, // High DPI capture for razor-sharp vector text and graphics
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 960,
        height: 678,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // Standard A4 Landscape: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');

      const safeName = participantName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Participant';
      pdf.save(`STAC_Certificate_${safeName}.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate pure PDF:', err);
    } finally {
      // Clean up temporary isolated container immediately
      if (document.body.contains(isolatedContainer)) {
        document.body.removeChild(isolatedContainer);
      }
      setIsExporting(false);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Open a dedicated hidden iframe for clean printing without any popup background or app headers
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.id = 'cert-print-iframe';

    document.body.appendChild(printFrame);

    const certHTML = getCleanCertificateHTML({
      participantName: participantName || 'Participant',
      date,
      courseName,
      publisher,
      certNo: finalCertNo,
    });

    const doc = printFrame.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>STAC Marine Internal Auditor - ${participantName}</title>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              @page { size: A4 landscape; margin: 0; }
              body {
                background: #ffffff;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            </style>
          </head>
          <body>
            ${certHTML}
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      }, 400);
    }
  };

  return (
    <div className={variant === 'full' ? "flex flex-col items-center w-full" : "inline-block"}>
      {variant === 'full' && (
        <div className="w-full flex flex-col items-center">
          {/* Real-time Interactive Visual Certificate on Screen */}
          <div className="w-full max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden border-2 border-slate-300/80 bg-white mb-6">
            <div 
              className="relative bg-white text-slate-900 overflow-hidden w-full"
              style={{
                aspectRatio: '960 / 678',
                border: '6px solid #1e3a5f',
                boxSizing: 'border-box',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {/* Inner Green Border */}
              <div className="absolute inset-[8px] md:inset-[10px] border-2 border-[#2d6a4f] rounded-[2px] pointer-events-none z-10" />

              {/* Corners */}
              <div dangerouslySetInnerHTML={{ __html: CORNER_TL }} />
              <div dangerouslySetInnerHTML={{ __html: CORNER_TR }} />
              <div dangerouslySetInnerHTML={{ __html: CORNER_BL }} />
              <div dangerouslySetInnerHTML={{ __html: CORNER_BR }} />

              {/* Body Content */}
              <div className="px-6 md:px-14 pt-3 md:pt-5 pb-16 md:pb-20 relative z-20 flex flex-col items-center">
                {/* Logo */}
                <div className="flex justify-center mb-0.5" dangerouslySetInnerHTML={{ __html: STAC_LOGO_SVG }} />

                {/* Academy Title */}
                <div className="text-center tracking-[0.32em] text-[11px] md:text-[14px] font-sans font-bold text-[#2d6a4f] uppercase mb-1">
                  S T A C &nbsp; M A R I N E
                </div>

                {/* Divider Line */}
                <div className="flex items-center gap-2 my-1 w-2/3 max-w-[400px]">
                  <div className="flex-1 h-[1px] bg-[#1e3a5f]" />
                  <div className="w-1.5 h-1.5 bg-[#1e3a5f] rounded-full" />
                  <div className="flex-1 h-[1px] bg-[#1e3a5f]" />
                </div>

                {/* Title */}
                <div className="text-center text-[18px] md:text-[28px] font-normal text-slate-900 mb-0.5 font-serif">
                  Certificate of Completion
                </div>
                <div className="text-center text-[11px] md:text-[13px] text-slate-500 italic mb-1.5 font-serif">
                  This is to certify that
                </div>

                {/* Name */}
                <div className="text-center text-[22px] md:text-[34px] font-bold text-slate-900 font-serif leading-tight mb-1">
                  {participantName}
                </div>
                <div className="w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#2d6a4f] to-transparent mb-1.5" />

                {/* Completion line */}
                <div className="text-center text-[11px] md:text-[13px] text-slate-700 italic mb-0.5 font-serif">
                  has successfully completed the course
                </div>

                {/* Course name */}
                <div className="text-center text-[14px] md:text-[19px] font-bold text-slate-900 font-serif mb-0.5">
                  QHSE Internal Auditor Test
                </div>
                <div className="text-center text-[10px] md:text-[12px] font-bold text-slate-600 font-sans">
                  Published by: {publisher}
                </div>

                <div className="w-4/5 h-[1px] bg-slate-200 my-1 md:my-2" />

                {/* Seal & Signature Row */}
                <div className="w-full flex items-end justify-between px-2 md:px-6 mt-1">
                  <div className="w-20 md:w-36" />

                  {/* Stamp */}
                  <div className="flex justify-center items-center" dangerouslySetInnerHTML={{ __html: STAC_SEAL_SVG }} />

                  {/* Signature */}
                  <div className="text-center min-w-[120px] md:min-w-[160px]">
                    <div className="flex justify-center -mb-2" dangerouslySetInnerHTML={{ __html: SIGNATURE_SVG }} />
                    <div className="w-24 md:w-36 h-[1px] bg-slate-400 mx-auto my-1" />
                    <div className="text-[8px] md:text-[10px] text-slate-400 font-sans italic">
                      Head of Corporate Services
                    </div>
                    <div className="text-[9px] md:text-[11px] font-bold text-[#1e3a5f] font-sans">
                      Musa Ibn Said
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Footer Bar */}
              <div className="bg-[#1e3a5f] px-3 md:px-8 py-2 md:py-2.5 grid grid-cols-3 gap-2 absolute bottom-0 inset-x-0 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 md:w-9 md:h-9 bg-white rounded flex items-center justify-center text-[6px] md:text-[8px] text-[#1e3a5f] font-sans font-bold leading-none shrink-0">
                    QR<br />CODE
                  </div>
                  <div>
                    <div className="text-[7px] md:text-[9px] font-bold tracking-wider text-[#4ade80] font-sans uppercase">
                      SCAN TO VERIFY
                    </div>
                    <div className="text-[8px] md:text-[11px] font-semibold text-white font-sans truncate">
                      stacacademy.com/verify
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[7px] md:text-[9px] font-bold tracking-wider text-[#4ade80] font-sans uppercase">
                    CERTIFICATE NO.
                  </div>
                  <div className="text-[8px] md:text-[11px] font-bold text-white font-sans">
                    {finalCertNo}
                  </div>
                  <div className="text-[7px] md:text-[8px] text-white/60 font-sans">
                    Powered by STAC Marine
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[7px] md:text-[9px] font-bold tracking-wider text-[#4ade80] font-sans uppercase">
                    DATE ISSUED
                  </div>
                  <div className="text-[8px] md:text-[11px] font-semibold text-white font-sans">
                    {date}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: PDF Download & Print */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="group relative flex items-center gap-3 bg-[#1e3a5f] hover:bg-[#152c48] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Download Certificate (PDF)
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              disabled={isExporting}
              className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Print directly or save as PDF via system dialog"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              Print / Save PDF
            </button>
          </div>

          {downloadSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mt-3 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Certificate PDF downloaded successfully!
            </div>
          )}
        </div>
      )}

      {variant === 'button' && (
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white hover:bg-[#152c48] px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          Download PDF
        </button>
      )}

      {variant === 'icon' && (
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          title="Download Certificate as PDF"
          className="p-2 bg-[#1e3a5f]/10 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};

export default Certificate;


/*import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { Download, Loader2 } from 'lucide-react';

interface CertificateProps {
  participantName: string;
  date?: string;
  variant?: 'full' | 'button' | 'icon';
  certNo?: string;
}

const Certificate: React.FC<CertificateProps> = ({ 
  participantName, 
  date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }), 
  variant = 'full',
  certNo: propCertNo
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [generatedCertNo] = React.useState(() => `STAC/CYB/2026/${Math.floor(1000 + Math.random() * 9000)}`);

  const finalCertNo = propCertNo || generatedCertNo;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!certificateRef.current) return;
    
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 3, 
      });
      
      download(dataUrl, `STAC_Marine_Certificate_${participantName.replace(/\s+/g, '_')}.png`);
    } catch (err) {
      console.error('Failed to generate certificate:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const certificateImage = "https://ohpkfpvyiz0fif6h.public.blob.vercel-storage.com/img_internal_audit_certificate.png";

  return (
    <div className={variant === 'full' ? "flex flex-col items-center" : "inline-block"}>

      <div className="overflow-hidden h-0 w-0 opacity-0 pointer-events-none absolute">
        <div 
          ref={certificateRef}
          style={{
            width: '848px',
            height: '1200px',
            backgroundImage: `url("${certificateImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          
          <div 
            style={{
              position: 'absolute',
              top: '40%',
              left: '0',
              right: '0',
              fontSize: '34px',
              fontWeight: '700',
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: 'sans-serif',
              width: '100%',
              textAlign: 'center'
            }}
          >
            {participantName}
          </div>

         
          <div 
            style={{
              position: 'absolute',
              top: '74%',
              left: '0',
              right: '0',
              fontSize: '22px',
              fontWeight: '700',
              color: '#1e293b',
              fontFamily: 'sans-serif',
              width: '100%',
              textAlign: 'center'
            }}
          >
            {date}
          </div>

          
          <div 
            style={{
              position: 'absolute',
              bottom: '6%',
              left: '8%',
              fontSize: '14px',
              fontWeight: '400',
              color: '#191d2d',
              fontFamily: 'sans-serif',
            }}
          >
            CERT NO. {finalCertNo}
          </div>
        </div>
      </div>

      {variant === 'full' && (
        <>
          
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative group shadow-2xl rounded-lg overflow-hidden border-4 border-white">
              <img 
                src={certificateImage} 
                alt="Certificate Template" 
                className="w-full h-auto block"
                crossOrigin="anonymous"
              />
              
              <div 
                className="absolute inset-x-0 w-full text-center flex justify-center pointer-events-none"
                style={{ top: '38%' }}
              >
                <span className="text-[2.4vw] md:text-[24px] font-bold text-slate-900 uppercase tracking-tight px-4 leading-none">
                  {participantName}
                </span>
              </div>
             
              <div 
                className="absolute inset-x-0 w-full text-center flex justify-center pointer-events-none"
                style={{ top: '74%' }}
              >
                <span className="text-[1.8vw] md:text-[18px] font-bold text-slate-700 tracking-tight px-4 leading-none">
                  {date}
                </span>
              </div>
              
              <div 
                className="absolute left-[8%] pointer-events-none"
                style={{ bottom: '6%' }}
              >
                <span className="text-[1.2vw] md:text-[12px] text-slate-500 font-medium">
                  CERT NO. {finalCertNo}
                </span>
              </div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="group relative flex items-center gap-3 bg-brand-blue text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/30 cursor-pointer disabled:opacity-70"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparing Certificate...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 group-hover:scale-125 transition-transform" />
                Download Official Certificate
              </>
            )}
          </button>
        </>
      )}

      {variant === 'button' && (
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
          Download Cert
        </button>
      )}

      {variant === 'icon' && (
        <button
          onClick={handleDownload}
          disabled={isExporting}
          title="Download Certificate"
          className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};

export default Certificate;
*/
