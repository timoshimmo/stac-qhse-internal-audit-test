import React from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, ShieldCheck, Zap, Wifi } from 'lucide-react';

interface InstructionsPageProps {
  onStart: () => void;
}

const InstructionsPage: React.FC<InstructionsPageProps> = ({ onStart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5">
        <div className="bg-brand-blue p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <ClipboardCheck size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-tight">
            Compliance Assessment Instructions
          </h1>
          <p className="text-blue-100 mt-2 font-medium opacity-90">
            Please review these guidelines before you begin.
          </p>
        </div>

        <div className="p-8 lg:p-10 space-y-8">
          <div className="space-y-6">
            <p className="text-slate-600 font-medium leading-relaxed">
              Welcome to the <span className="text-brand-blue font-bold">STAC Marine Certification Compliance Assessment</span>! 
              This quiz is designed to evaluate your understanding of key compliance requirements relevant to your role.
            </p>

            <div className="grid gap-4">
              <InstructionItem 
                icon={<Wifi size={20} className="text-blue-500" />}
                text="Ensure you have a stable internet connection throughout the duration of the test."
              />
              <InstructionItem 
                icon={<ShieldCheck size={20} className="text-emerald-500" />}
                text="Read each question thoroughly before selecting your answer."
              />
              <InstructionItem 
                icon={<ClipboardCheck size={20} className="text-amber-500" />}
                text="All questions must be answered to complete the assessment."
              />
              <InstructionItem 
                icon={<Zap size={20} className="text-indigo-500" />}
                text="Your responses will be evaluated against established compliance standards."
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-brand-blue p-4 rounded-r-xl">
              <p className="text-sm text-blue-900 font-semibold leading-relaxed">
                Upon successful completion, you will be eligible for certification in line with organizational compliance requirements.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onStart}
              className="w-full bg-brand-blue hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center justify-center group cursor-pointer"
            >
              START QUIZ
              <Zap size={20} className="ml-2 group-hover:scale-125 transition-transform" fill="currentColor" />
            </button>
            <p className="text-center text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">
              Click to confirm you are ready to begin
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InstructionItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
    <div className="mt-0.5">{icon}</div>
    <p className="text-sm text-slate-700 font-semibold leading-tight">{text}</p>
  </div>
);

export default InstructionsPage;
