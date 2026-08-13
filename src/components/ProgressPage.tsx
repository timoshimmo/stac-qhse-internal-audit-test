import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { ScoreAttempt } from '../types';
import { getUserAttempts } from '../services/quizService';
import { PASSING_GRADE } from '../constants';
import { History, TrendingUp, CheckCircle, XCircle, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import Certificate from './Certificate';
import { UserProfile } from '../types';

interface ProgressPageProps {
  user: { uid: string };
  profile: UserProfile;
}

const ProgressPage: React.FC<ProgressPageProps> = ({ user, profile }) => {
  const [attempts, setAttempts] = useState<ScoreAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      if (!user.uid) {
        console.warn('[ProgressPage] No user.uid available for fetch');
        setLoading(false);
        return;
      }
      
      console.log(`[ProgressPage] Fetching attempts for UID: ${user.uid}`);
      try {
        const data = await getUserAttempts(user.uid);
        console.log(`[ProgressPage] Received ${data.length} attempts`);
        setAttempts(data);
      } catch (err) {
        console.error('[ProgressPage] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, [user.uid]);

  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
  const avgScore = attempts.length > 0 ? attempts.reduce((acc, curr) => acc + curr.percentage, 0) / attempts.length : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue mb-4" />
        <p className="text-slate-500 font-medium">Fetching your records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm p-10 border border-slate-200">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
          <div className="p-3 bg-blue-50 rounded-xl text-brand-blue">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Performance History</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <section className="bg-brand-blue p-6 rounded-2xl shadow-xl shadow-blue-100 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Peak Performance</p>
              <div className="text-4xl font-black tabular-nums">{Math.round(bestScore)}%</div>
              <div className="w-full bg-blue-400/30 h-1.5 rounded-full mt-4 text-left">
                <div className="bg-white h-1.5 rounded-full" style={{ width: `${bestScore}%` }}></div>
              </div>
            </div>
            <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
          </section>

          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Accuracy</p>
            <div className="text-4xl font-black text-slate-800 tabular-nums">{Math.round(avgScore)}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 text-left">
              <div className="bg-brand-blue h-1.5 rounded-full" style={{ width: `${avgScore}%` }}></div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 text-left">Session Logs</h3>
          
          {attempts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">Initial assessment pending.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt, idx) => {
                const passed = attempt.percentage >= PASSING_GRADE;
                return (
                  <motion.div
                    key={attempt.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-brand-blue hover:shadow-md transition-all group gap-4"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-xl border-2 shrink-0 ${passed ? 'bg-blue-50 border-blue-100 text-brand-blue' : 'bg-red-50 border-red-100 text-red-600'}`}>
                        {passed ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                      </div>
                      <div className="text-left">
                        <div className="font-black text-slate-800 group-hover:text-brand-blue transition-colors text-lg tracking-tight">
                          Verification Score: {Math.round(attempt.percentage)}%
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-wider font-mono">
                          <Calendar className="w-3.5 h-3.5 opacity-60" />
                          {attempt.timestamp.toLocaleDateString('en-GB')} • {attempt.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-end gap-2">
                      <div className="flex items-center gap-3">
                        {passed && (
                          <Certificate 
                            participantName={profile.name} 
                            date={new Date(attempt.timestamp).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                            variant="button" 
                          />
                        )}
                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                          passed ? 'bg-brand-blue text-white shadow-lg shadow-blue-100' : 'bg-red-600 text-white'
                        }`}>
                          {passed ? 'Passed - Certified' : 'Compliance Denied'}
                        </span>
                      </div>
                      {!passed && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-1">Retry Mandated</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
