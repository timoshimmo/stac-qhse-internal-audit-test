import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { saveUserProfile } from '../services/quizService';
import { UserProfile } from '../types';
import { User as UserIcon, Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';

interface RegistrationFormProps {
  user: { uid: string; email: string | null; displayName: string | null };
  onComplete: (profile: UserProfile & { uid?: string }) => void;
  onBack?: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ user, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    name: user.displayName || '',
    email: user.email || '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      const profileContent = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      
      const serverUser = await saveUserProfile(user.uid, profileContent);
      
      // Update local tracking and complete
      if (serverUser && serverUser.uid) {
        localStorage.setItem('guest_uid', serverUser.uid);
        onComplete({ 
          ...profileContent, 
          uid: serverUser.uid,
          createdAt: serverUser.createdAt ? new Date(serverUser.createdAt) : new Date() 
        });
      } else {
        onComplete({ ...profileContent, createdAt: new Date() });
      }
    } catch (err: any) {
      console.error('[v2] Registration error:', err);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`[Registration Failed] ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-white/50">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Participant Registration</h2>
        <p className="text-slate-500 mt-2 font-medium">Verify your identity to begin the assessment.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Candidate Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none transition-all font-semibold text-slate-800"
              placeholder="Full Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Registered Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none transition-all font-semibold text-slate-800"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Contact Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none transition-all font-semibold text-slate-800"
              placeholder="+234 ..."
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

        <button
          disabled={loading}
          type="submit"
          className="w-full h-16 flex items-center justify-center gap-3 bg-brand-blue text-white font-black text-lg py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-100 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Confirm
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full py-4 text-slate-500 font-bold hover:text-slate-700 transition-colors cursor-pointer"
          >
            BACK TO LANDING
          </button>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
