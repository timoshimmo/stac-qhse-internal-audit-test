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

export const STAC_LOGO_URL = "https://ohpkfpvyiz0fif6h.public.blob.vercel-storage.com/staclogo.jpg";
export const STAC_STAMP_URL = "https://ohpkfpvyiz0fif6h.public.blob.vercel-storage.com/Screenshot_14-8-2026_9929_.jpeg";
export const STAC_SIGNATURE_URL = "https://ohpkfpvyiz0fif6h.public.blob.vercel-storage.com/signature-final.png";

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
      <div style="padding: 28px 60px 0; position: relative; z-index: 5; text-align: center;">
        
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 6px; margin-top: -4px;">
          <img 
            src="${STAC_LOGO_URL}" 
            alt="STAC Logo" 
            crossorigin="anonymous"
            style="height: 64px; width: auto; max-width: 240px; object-fit: contain; display: inline-block;" 
          />
        </div>

        <!-- Academy Name -->
        <div style="
          text-align: center;
          letter-spacing: 0.38em;
          font-size: 15px;
          font-family: Arial, sans-serif;
          font-weight: 700;
          color: #2d6a4f;
          text-transform: uppercase;
          margin: 4px 0 12px 0;
        ">
          S T A C &nbsp; M A R I N E
        </div>

        <!-- Divider with dot -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 0 auto 14px; width: 68%;">
          <div style="flex: 1; height: 1.5px; background: #1e3a5f;"></div>
          <div style="width: 7px; height: 7px; background: #1e3a5f; border-radius: 50%;"></div>
          <div style="flex: 1; height: 1.5px; background: #1e3a5f;"></div>
        </div>

        <!-- Title & Subtitle -->
        <div style="font-size: 36px; font-weight: 400; color: #0f172a; margin: 0 0 5px; font-family: Georgia, serif;">
          Certificate of Completion
        </div>
        <div style="font-size: 15px; color: #64748b; font-style: italic; margin-bottom: 10px; font-family: Georgia, serif;">
          This is to certify that
        </div>

        <!-- Name -->
        <div style="font-size: 46px; font-weight: bold; color: #0f172a; font-family: Georgia, serif; margin: 0 0 5px; line-height: 1.1;">
          ${props.participantName}
        </div>
        <div style="width: 58%; margin: 0 auto 12px; height: 2px; background: linear-gradient(90deg, transparent, #2d6a4f, transparent);"></div>

        <!-- Completion text -->
        <div style="font-size: 15px; color: #374151; margin-bottom: 8px; font-style: italic; font-family: Georgia, serif;">
          has successfully completed the course
        </div>

        <!-- Course name & Publisher -->
        <div style="font-size: 23px; font-weight: bold; color: #0f172a; margin: 0 0 4px; font-family: Georgia, serif;">
          ${props.courseName}
        </div>
        <div style="font-size: 13.5px; font-weight: bold; color: #475569; font-family: Arial, sans-serif; margin-bottom: 10px;">
          Published by: ${props.publisher}
        </div>

        <div style="width: 82%; margin: 12px auto 16px; height: 1px; background: #e2e8f0;"></div>

        <!-- Seal & Signature -->
        <div style="display: flex; align-items: flex-end; justify-content: space-between; padding: 0 24px; margin-top: 10px;">
          <div style="width: 180px;"></div>

          <div style="display: flex; align-items: center; justify-content: center; width: 240px; flex-shrink: 0;">
            <img 
              src="${STAC_STAMP_URL}" 
              alt="Official STAC Stamp" 
              crossorigin="anonymous"
              style="height: 112px; width: auto; max-width: 230px; object-fit: contain; display: block; margin: 0 auto;" 
            />
          </div>

          <div style="text-align: center; min-width: 180px;">
            <div style="margin-bottom: -2px; height: 50px; display: flex; align-items: center; justify-content: center;">
              <img 
                src="${STAC_SIGNATURE_URL}" 
                alt="Signature" 
                crossorigin="anonymous"
                style="height: 46px; width: auto; max-width: 165px; object-fit: contain; display: block; margin: 0 auto;" 
              />
            </div>
            <div style="width: 160px; height: 1px; background: #94a3b8; margin: 6px auto 4px;"></div>
            <div style="font-size: 11.5px; color: #94a3b8; font-family: Arial, sans-serif; font-style: italic;">
              Head of Corporate Services
            </div>
            <div style="font-style: normal; font-weight: 700; color: #1e3a5f; font-size: 13px; margin-top: 3px; font-family: Arial, sans-serif;">
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
  courseName = "QHSE Internal Auditor",
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
            <title>STAC Academy Certificate - ${participantName}</title>
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
          <div className="w-full max-w-5xl mx-auto shadow-2xl rounded-lg overflow-hidden border-2 border-slate-300/80 bg-white mb-6">
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
              <div className="px-6 md:px-14 pt-3 md:pt-6 pb-12 md:pb-16 relative z-20 flex flex-col items-center">
                {/* Logo */}
                <div className="flex justify-center mb-1 md:mb-1.5">
                  <img 
                    src={STAC_LOGO_URL} 
                    alt="STAC Academy Logo" 
                    crossOrigin="anonymous"
                    className="h-10 md:h-16 w-auto object-contain" 
                  />
                </div>

                {/* Academy Title */}
                <div className="text-center tracking-[0.34em] text-[11px] md:text-[15px] font-sans font-bold text-[#2d6a4f] uppercase mb-1 md:mb-2">
                  S T A C &nbsp; M A R I N E
                </div>

                {/* Divider Line */}
                <div className="flex items-center gap-2 my-1 md:my-2 w-2/3 max-w-[440px]">
                  <div className="flex-1 h-[1px] md:h-[1.5px] bg-[#1e3a5f]" />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#1e3a5f] rounded-full" />
                  <div className="flex-1 h-[1px] md:h-[1.5px] bg-[#1e3a5f]" />
                </div>

                {/* Title */}
                <div className="text-center text-[18px] md:text-[30px] font-normal text-slate-900 mb-0.5 md:mb-1 font-serif">
                  Certificate of Completion
                </div>
                <div className="text-center text-[11px] md:text-[14px] text-slate-500 italic mb-1 md:mb-2 font-serif">
                  This is to certify that
                </div>

                {/* Name */}
                <div className="text-center text-[22px] md:text-[38px] font-bold text-slate-900 font-serif leading-tight mb-1 md:mb-1.5">
                  {participantName}
                </div>
                <div className="w-1/2 md:w-3/5 h-[2px] bg-gradient-to-r from-transparent via-[#2d6a4f] to-transparent mb-1.5 md:mb-2.5" />

                {/* Completion line */}
                <div className="text-center text-[11px] md:text-[14px] text-slate-700 italic mb-0.5 md:mb-1 font-serif">
                  has successfully completed the course
                </div>

                {/* Course name */}
                <div className="text-center text-[14px] md:text-[21px] font-bold text-slate-900 font-serif mb-0.5 md:mb-1">
                  {courseName}
                </div>
                <div className="text-center text-[10px] md:text-[13px] font-bold text-slate-600 font-sans mb-1 md:mb-2">
                  Published by: {publisher}
                </div>

                <div className="w-4/5 md:w-5/6 h-[1px] bg-slate-200 my-1 md:my-2.5" />

                {/* Seal & Signature Row */}
                <div className="w-full flex items-end justify-between px-2 md:px-8 mt-1 md:mt-2">
                  <div className="w-16 md:w-36" />

                  {/* Stamp */}
                  <div className="flex justify-center items-center">
                    <img 
                      src={STAC_STAMP_URL} 
                      alt="Official STAC Stamp" 
                      crossOrigin="anonymous"
                      className="h-16 md:h-28 w-auto object-contain" 
                    />
                  </div>

                  {/* Signature */}
                  <div className="text-center min-w-[120px] md:min-w-[170px]">
                    <div className="flex justify-center -mb-1 h-8 md:h-12 items-center">
                      <img 
                        src={STAC_SIGNATURE_URL} 
                        alt="Signature of Musa Ibn Said" 
                        crossOrigin="anonymous"
                        className="h-7 md:h-11 w-auto object-contain" 
                      />
                    </div>
                    <div className="w-24 md:w-40 h-[1px] bg-slate-400 mx-auto my-1" />
                    <div className="text-[8px] md:text-[11px] text-slate-400 font-sans italic">
                      Head of Corporate Services
                    </div>
                    <div className="text-[9px] md:text-[12px] font-bold text-[#1e3a5f] font-sans">
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
                    Powered by OpenSesame
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
