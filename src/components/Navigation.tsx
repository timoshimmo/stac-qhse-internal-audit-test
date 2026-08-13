import React from 'react';
import { UserProfile } from '../types';
import { LayoutDashboard, History, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';

interface NavigationProps {
  profile: UserProfile | null;
  currentPage: string;
  setCurrentPage: (page: 'quiz' | 'registration' | 'result' | 'progress' | 'instructions' | 'comments' | 'admin-dashboard') => void;
}

const Navigation: React.FC<NavigationProps> = ({ profile, currentPage, setCurrentPage }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center text-white shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-xl font-black tracking-tight text-slate-800 uppercase">Internal Audit Test</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setCurrentPage('instructions')}
          className={`px-3 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${currentPage === 'quiz' || currentPage === 'result' || currentPage === 'instructions' ? 'text-brand-blue bg-blue-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          Assessment
        </button>
        
        <button 
          onClick={() => setCurrentPage('progress')}
          className={`px-3 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${currentPage === 'progress' ? 'text-brand-blue bg-blue-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          Success History
        </button>

        <button 
          onClick={() => setCurrentPage('comments')}
          className={`px-3 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${currentPage === 'comments' ? 'text-brand-blue bg-blue-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          Candidate Reviews
        </button>

        {profile?.role === 'ADMIN' && (
          <button 
            onClick={() => setCurrentPage('admin-dashboard')}
            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${currentPage === 'admin-dashboard' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'}`}
          >
            Admin Dashboard
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {profile && (
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-sm font-bold text-slate-900 leading-none">{profile.name}</span>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${profile.role === 'ADMIN' ? 'text-amber-600' : 'text-slate-400'}`}>
              {profile.role || 'Candidate'}
            </span>
          </div>
        )}
        <button 
          onClick={async () => {
            await auth.signOut();
            localStorage.removeItem('guest_uid');
            window.location.reload(); // Refresh to ensure state is clean
          }}
          className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
        >
          <span className="text-sm font-bold">Log Out</span>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
