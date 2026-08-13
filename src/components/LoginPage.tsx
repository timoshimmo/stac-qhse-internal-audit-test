import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, Loader2, Search } from 'lucide-react';
import { findUserProfileByIdentifier } from '../services/quizService';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLogin: (uid: string, profile: UserProfile) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await findUserProfileByIdentifier(identifier);
      if (result) {
        onLogin(result.uid, result.profile);
      } else {
        setError('No profile found with this email or phone number. Please register as a new participant.');
      }
    } catch (err) {
      setError('An error occurred while looking up your profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-slate-900/10 border border-white/50">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-brand-blue" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">RETURNING PARTICIPANT</h2>
          <p className="text-slate-500 mt-2 font-medium">Enter your email or phone to resume</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email or Phone Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-brand-blue focus:bg-white outline-none transition-all font-medium text-slate-700"
                placeholder="e.g. john@example.com or 0801..."
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-brand-blue hover:opacity-90 disabled:opacity-50 text-white font-black text-lg py-5 px-6 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="mb-[2px]">Confirm</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              className="w-full py-4 text-slate-500 font-bold hover:text-slate-700 transition-colors cursor-pointer"
            >
              BACK TO LANDING
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
