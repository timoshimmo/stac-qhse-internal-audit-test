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

const Certificate: React.FC<CertificateProps> = ({ 
  participantName, 
  date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }), 
  courseName = "5 Interview Questions Gen AI Can’t Answer",
  publisher = "MIT Sloan Management Review",
  certNo: propCertNo,
  variant = 'full',
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [generatedCertNo] = useState(() => `STAC-2026-${Math.floor(10000 + Math.random() * 90000)}-CRT`);

  const finalCertNo = propCertNo || generatedCertNo;

  const handleDownloadPDF = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!certificateRef.current) return;
    
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      // Small pause to ensure all webfonts and layout calculations are rendered
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const element = certificateRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3, // High DPI resolution for crisp typography and lines
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
      
      const cleanFileName = `STAC_Certificate_${participantName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Participant'}.pdf`;
      pdf.save(cleanFileName);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate certificate PDF:', err);
      // Fallback: trigger print dialog if canvas capture encounters browser permission issues
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  // Reusable Corner Ornament SVG
  const CornerSvg = ({ className }: { className: string }) => (
    <svg className={`absolute w-[52px] h-[52px] z-20 pointer-events-none ${className}`} viewBox="0 0 48 48" fill="none">
      <path d="M4 44 L4 4 L44 4" stroke="#1e3a5f" strokeWidth="3" fill="none" />
      <path d="M4 4 L16 4 M4 4 L4 16" stroke="#2d6a4f" strokeWidth="2" fill="none" />
    </svg>
  );

  return (
    <div className={variant === 'full' ? "flex flex-col items-center w-full" : "inline-block"}>
      
      {/* Hidden container strictly sized for perfect A4 Landscape rendering & PDF export */}
      <div className="overflow-hidden h-0 w-0 opacity-0 pointer-events-none absolute -left-[9999px] -top-[9999px]">
        <div 
          ref={certificateRef}
          className="relative bg-white text-slate-900 overflow-hidden"
          style={{
            width: '960px',
            height: '678px',
            border: '6px solid #1e3a5f',
            borderRadius: '4px',
            boxSizing: 'border-box',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          {/* Inner green accent border */}
          <div 
            style={{
              position: 'absolute',
              inset: '10px',
              border: '2px solid #2d6a4f',
              borderRadius: '2px',
              pointerEvents: 'none',
              zIndex: 1,
            }} 
          />

          {/* Corner ornaments */}
          <CornerSvg className="top-[16px] left-[16px]" />
          <CornerSvg className="top-[16px] right-[16px] -scale-x-100" />
          <CornerSvg className="bottom-[84px] left-[16px] -scale-y-100" />
          <CornerSvg className="bottom-[84px] right-[16px] -scale-100" />

          {/* Certificate Main Body */}
          <div style={{ padding: '24px 60px 80px', position: 'relative', zIndex: 10 }}>
            {/* Top Anchor Shield Logo */}
            <div className="flex justify-center -mt-2 mb-1">
              <svg width="68" height="68" viewBox="0 0 950 850" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              </svg>
            </div>

            {/* Academy Name */}
            <div 
              style={{
                textAlign: 'center',
                letterSpacing: '0.35em',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 700,
                color: '#2d6a4f',
                textTransform: 'uppercase',
                margin: '4px 0 10px 0'
              }}
            >
              STAC ACADEMY
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto 12px', width: '65%' }}>
              <div style={{ flex: 1, height: '1px', background: '#1e3a5f' }} />
              <div style={{ width: '6px', height: '6px', background: '#1e3a5f', borderRadius: '50%' }} />
              <div style={{ flex: 1, height: '1px', background: '#1e3a5f' }} />
            </div>

            {/* Title & Subtitle */}
            <div style={{ textAlign: 'center', fontSize: '32px', fontWeight: 400, color: '#0f172a', margin: '0 0 2px', fontFamily: 'Georgia, serif' }}>
              Certificate of Completion
            </div>
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', fontStyle: 'italic', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
              This is to certify that
            </div>

            {/* Recipient Name */}
            <div style={{ textAlign: 'center', fontSize: '38px', fontWeight: 'bold', color: '#0f172a', fontFamily: 'Georgia, serif', margin: '0 0 4px', lineHeight: 1.1 }}>
              {participantName}
            </div>
            <div style={{ width: '55%', margin: '0 auto 8px', height: '2px', background: 'linear-gradient(90deg, transparent, #2d6a4f, transparent)' }} />

            {/* Body Text */}
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#374151', marginBottom: '4px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
              has successfully completed the course
            </div>

            {/* Course Title & Publisher */}
            <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 3px', fontFamily: 'Georgia, serif' }}>
              {courseName}
            </div>
            <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#475569', fontFamily: 'Arial, sans-serif' }}>
              Published by: {publisher}
            </div>

            <div style={{ width: '80%', margin: '8px auto', height: '1px', background: '#e2e8f0' }} />

            {/* Signature & Seal Row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px', marginTop: '2px' }}>
              <div style={{ width: '180px' }} />

              {/* STAC Marine Verified Circular Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '220px', flexShrink: 0 }}>
                <svg width="180" height="90" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="100" r="88" stroke="#1e3a5f" strokeWidth="6" fill="#f8fafc" />
                  <circle cx="200" cy="100" r="76" stroke="#2d6a4f" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                  <circle cx="200" cy="100" r="64" fill="#002D5C" />
                  
                  {/* Badge Text Top */}
                  <text x="200" y="32" textAnchor="middle" fill="#002D5C" fontSize="18" fontWeight="900" letterSpacing="2" fontFamily="Arial, sans-serif">
                    ★ STAC MARINE OFFSHORE ★
                  </text>
                  
                  {/* Anchor Silhouette inside crest */}
                  <path d="M200 60 L200 130 M182 85 L218 85 M168 115 Q200 148 232 115" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                  
                  {/* Green Verified Ribbon Banner */}
                  <rect x="110" y="146" width="180" height="28" rx="14" fill="#2d6a4f" />
                  <text x="200" y="166" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" letterSpacing="3" fontFamily="Arial, sans-serif">
                    VERIFIED
                  </text>
                </svg>
              </div>

              {/* Signature block */}
              <div style={{ textAlign: 'center', minWidth: '190px' }}>
                <div className="flex justify-center -mb-2">
                  <svg width="150" height="42" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 36 C35 15, 48 8, 65 24 C82 40, 95 18, 115 12 C132 7, 142 22, 152 38 M45 28 C58 12, 85 4, 102 26 M75 32 L135 18" stroke="#002D5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ width: '160px', height: '1px', background: '#94a3b8', margin: '4px auto 3px' }} />
                <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Arial, sans-serif', fontStyle: 'italic' }}>
                  Head of Corporate Services
                </div>
                <div style={{ fontStyle: 'normal', fontWeight: 700, color: '#1e3a5f', fontSize: '12px', marginTop: '2px', fontFamily: 'Arial, sans-serif' }}>
                  Musa Ibn Said
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div 
            style={{
              background: '#1e3a5f',
              padding: '12px 36px',
              display: 'grid',
              gridTemplateColumns: '1.25fr 1fr 1fr',
              gap: '16px',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              boxSizing: 'border-box',
            }}
          >
            {/* Left QR Column */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '42px',
                  height: '42px',
                  background: '#fff',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  color: '#1e3a5f',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 700,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  flexShrink: 0,
                }}
              >
                QR<br />CODE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4ade80', fontFamily: 'Arial, sans-serif' }}>
                  SCAN TO VERIFY
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#fff', fontFamily: 'Arial, sans-serif' }}>
                  stacacademy.com/verify
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.65)', fontFamily: 'Arial, sans-serif' }}>
                  Verify the authenticity of this certificate online
                </div>
              </div>
            </div>

            {/* Middle Cert No Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4ade80', fontFamily: 'Arial, sans-serif' }}>
                CERTIFICATE NO.
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'Arial, sans-serif' }}>
                {finalCertNo}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.65)', fontFamily: 'Arial, sans-serif' }}>
                Powered by OpenSesame
              </div>
            </div>

            {/* Right Date Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4ade80', fontFamily: 'Arial, sans-serif' }}>
                DATE ISSUED
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', fontFamily: 'Arial, sans-serif' }}>
                {date}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.65)', fontFamily: 'Arial, sans-serif' }}>
                Official Credential
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <CornerSvg className="top-[12px] left-[12px]" />
              <CornerSvg className="top-[12px] right-[12px] -scale-x-100" />
              <CornerSvg className="bottom-[68px] md:bottom-[76px] left-[12px] -scale-y-100" />
              <CornerSvg className="bottom-[68px] md:bottom-[76px] right-[12px] -scale-100" />

              {/* Body Content */}
              <div className="px-6 md:px-14 pt-3 md:pt-5 pb-16 md:pb-20 relative z-20 flex flex-col items-center">
                {/* Logo */}
                <div className="flex justify-center mb-0.5">
                  <svg className="w-10 h-10 md:w-14 md:h-14" viewBox="0 0 950 850" fill="none">
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
                  </svg>
                </div>

                {/* Academy Title */}
                <div className="text-center tracking-[0.32em] text-[11px] md:text-[14px] font-sans font-bold text-[#2d6a4f] uppercase mb-1">
                  STAC ACADEMY
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
                  {courseName}
                </div>
                <div className="text-center text-[10px] md:text-[12px] font-bold text-slate-600 font-sans">
                  Published by: {publisher}
                </div>

                <div className="w-4/5 h-[1px] bg-slate-200 my-1 md:my-2" />

                {/* Seal & Signature Row */}
                <div className="w-full flex items-end justify-between px-2 md:px-6 mt-1">
                  <div className="w-20 md:w-36" />

                  {/* Stamp */}
                  <div className="flex justify-center items-center">
                    <svg className="w-28 md:w-44 h-auto" viewBox="0 0 400 200" fill="none">
                      <circle cx="200" cy="100" r="88" stroke="#1e3a5f" strokeWidth="6" fill="#f8fafc" />
                      <circle cx="200" cy="100" r="76" stroke="#2d6a4f" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                      <circle cx="200" cy="100" r="64" fill="#002D5C" />
                      <text x="200" y="32" textAnchor="middle" fill="#002D5C" fontSize="18" fontWeight="900" letterSpacing="2" fontFamily="Arial, sans-serif">
                        ★ STAC MARINE OFFSHORE ★
                      </text>
                      <path d="M200 60 L200 130 M182 85 L218 85 M168 115 Q200 148 232 115" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                      <rect x="110" y="146" width="180" height="28" rx="14" fill="#2d6a4f" />
                      <text x="200" y="166" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" letterSpacing="3" fontFamily="Arial, sans-serif">
                        VERIFIED
                      </text>
                    </svg>
                  </div>

                  {/* Signature */}
                  <div className="text-center min-w-[120px] md:min-w-[160px]">
                    <div className="flex justify-center -mb-2">
                      <svg className="w-24 md:w-36 h-auto" viewBox="0 0 160 50" fill="none">
                        <path d="M12 36 C35 15, 48 8, 65 24 C82 40, 95 18, 115 12 C132 7, 142 22, 152 38 M45 28 C58 12, 85 4, 102 26 M75 32 L135 18" stroke="#002D5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
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
              Certificate PDF generated and downloaded successfully!
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
