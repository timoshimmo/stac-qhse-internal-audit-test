import React, { useRef } from 'react';
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
      {/* Hidden container for high-res image generation */}
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
          {/* Participant Name Overlay for Export */}
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

          {/* Date Overlay for Export */}
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

          {/* Cert No Overlay for Export */}
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
          {/* Visible Certificate Display */}
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative group shadow-2xl rounded-lg overflow-hidden border-4 border-white">
              <img 
                src={certificateImage} 
                alt="Certificate Template" 
                className="w-full h-auto block"
                crossOrigin="anonymous"
              />
              {/* Real-time Name Overlay */}
              <div 
                className="absolute inset-x-0 w-full text-center flex justify-center pointer-events-none"
                style={{ top: '38%' }}
              >
                <span className="text-[2.4vw] md:text-[24px] font-bold text-slate-900 uppercase tracking-tight px-4 leading-none">
                  {participantName}
                </span>
              </div>
              {/* Real-time Date Overlay */}
              <div 
                className="absolute inset-x-0 w-full text-center flex justify-center pointer-events-none"
                style={{ top: '74%' }}
              >
                <span className="text-[1.8vw] md:text-[18px] font-bold text-slate-700 tracking-tight px-4 leading-none">
                  {date}
                </span>
              </div>
              {/* Real-time Cert No Overlay */}
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
