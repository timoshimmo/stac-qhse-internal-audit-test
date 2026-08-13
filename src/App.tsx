/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInAnonymously } from './lib/firebase';
import { getUserProfile } from './services/quizService';
import { UserProfile, ScoreAttempt } from './types';
import RegistrationForm from './components/RegistrationForm';
import Quiz from './components/Quiz';
import ResultPage from './components/ResultPage';
import ProgressPage from './components/ProgressPage';
import Navigation from './components/Navigation';
import LoginPage from './components/LoginPage';
import InstructionsPage from './components/InstructionsPage';
import CommentsPage from './components/CommentsPage';
import AdminDashboard from './components/AdminDashboard';
import { LogIn, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Page = 'quiz' | 'registration' | 'result' | 'progress' | 'login' | 'instructions' | 'comments' | 'admin-dashboard';

export default function App() {
  const [user, setUser] = useState<{ uid: string; email: string | null; displayName: string | null } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('quiz');
  const [lastAttempt, setLastAttempt] = useState<ScoreAttempt | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userProfile = await getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setProfile(userProfile);
          setCurrentPage('instructions');
        } else {
          setCurrentPage('registration');
        }
      } else {
        // Fallback: check for local guest session
        const guestUid = localStorage.getItem('guest_uid');
        if (guestUid) {
          setUser({ uid: guestUid, email: null, displayName: null });
          const userProfile = await getUserProfile(guestUid);
          if (userProfile) {
            setProfile(userProfile);
            setCurrentPage('instructions');
          } else {
            setCurrentPage('registration');
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEnterGuest = () => {
    let guestUid = localStorage.getItem('guest_uid');
    if (!guestUid) {
      guestUid = Math.random().toString(36).substring(2, 11);
      localStorage.setItem('guest_uid', guestUid);
    }
    setUser({ uid: guestUid, email: null, displayName: null });
    setCurrentPage('registration');
  };

  const handleLoginSuccess = (uid: string, userProfile: UserProfile) => {
    console.log(`[App] LOGIN SUCCESS: uid=${uid}, name=${userProfile.name}`);
    localStorage.setItem('guest_uid', uid);
    setUser({ uid, email: userProfile.email || null, displayName: userProfile.name });
    setProfile(userProfile);
    setCurrentPage('instructions');
  };

  const handleProfileComplete = (newProfile: UserProfile & { uid?: string }) => {
    console.log(`[App] PROFILE COMPLETE: uid=${newProfile.uid}, name=${newProfile.name}`);
    if (newProfile.uid) {
      localStorage.setItem('guest_uid', newProfile.uid);
      setUser(prev => prev ? { ...prev, uid: newProfile.uid! } : null);
    }
    setProfile(newProfile);
    setCurrentPage('instructions');
  };

  const handleQuizComplete = (attempt: ScoreAttempt) => {
    setLastAttempt(attempt);
    setCurrentPage('result');
  };

  const handleTryAgain = () => {
    setLastAttempt(null);
    setCurrentPage('quiz');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!user && currentPage !== 'login') {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 bg-cover bg-left-top bg-no-repeat relative"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/stacconnect/image/upload/v1777430543/3_iy0xxo.png")' }}
      >
        <div className="absolute inset-0 bg-slate-50/10 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-10 text-center relative z-10"
        >
          <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter uppercase">STAC Marine Internal Audit Test</h1>
          <p className="text-slate-500 mb-10 font-medium">
            Secure portal for internal audit reports, risk assessments, and compliance tracking.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleEnterGuest}
              className="w-full flex items-center justify-center gap-3 bg-brand-blue hover:opacity-90 text-white font-black text-lg py-5 px-6 rounded-xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98] cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              NEW PARTICIPANT
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-brand-blue hover:text-brand-blue text-slate-600 font-black text-lg py-5 px-6 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              RETURNING PARTICIPANT
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-black">
            Secure Platform • SME Standards
          </p>
        </motion.div>
      </div>
    );
  }

  const showBackground = currentPage === 'login' || currentPage === 'registration';

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 pt-24 pb-12 ${showBackground ? 'bg-cover bg-left-top bg-no-repeat' : 'bg-slate-50'}`}
      style={showBackground ? { backgroundImage: 'url("https://res.cloudinary.com/stacconnect/image/upload/v1777430543/3_iy0xxo.png")' } : {}}
    >
      {user && profile && (
        <Navigation 
          profile={profile} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
        />
      )}

      <main className="max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {currentPage === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <LoginPage 
                onLogin={handleLoginSuccess}
                onBack={() => {
                  setUser(null);
                  setCurrentPage('quiz');
                }}
              />
            </motion.div>
          )}
          {currentPage === 'registration' && (
            <motion.div
              key="registration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <RegistrationForm 
                user={user} 
                onComplete={handleProfileComplete} 
                onBack={() => {
                  setUser(null);
                  setCurrentPage('quiz');
                }}
              />
            </motion.div>
          )}

          {currentPage === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <InstructionsPage onStart={() => setCurrentPage('quiz')} />
            </motion.div>
          )}

          {currentPage === 'quiz' && profile && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Quiz user={user} onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {currentPage === 'result' && lastAttempt && profile && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ResultPage 
                attempt={lastAttempt} 
                participantName={profile.name}
                onTryAgain={handleTryAgain} 
              />
            </motion.div>
          )}

          {currentPage === 'progress' && profile && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ProgressPage user={user!} profile={profile} />
            </motion.div>
          )}

          {currentPage === 'comments' && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CommentsPage />
            </motion.div>
          )}

          {currentPage === 'admin-dashboard' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

