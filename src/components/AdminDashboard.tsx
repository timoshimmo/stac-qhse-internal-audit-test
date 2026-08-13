import React, { useEffect, useState } from 'react';
import { getAllAttempts, getAllUsers, updateUserRole } from '../services/quizService';
import { PASSING_GRADE } from '../constants';
import { Users, FileText, Download, CheckCircle, XCircle, Search, Calendar, User, Shield, ShieldCheck, Mail, Phone, Eye, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import Certificate from './Certificate';

interface EnrichedAttempt {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: string;
  certNo?: string;
}

type Tab = 'attempts' | 'users';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('attempts');
  const [attempts, setAttempts] = useState<EnrichedAttempt[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Preview State
  const [previewAttempt, setPreviewAttempt] = useState<EnrichedAttempt | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'attempts') {
        const data = await getAllAttempts();
        setAttempts(data);
      } else {
        const data = await getAllUsers();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (user: UserProfile) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!user.uid) return;
    
    setUpdatingId(user.uid);
    try {
      const success = await updateUserRole(user.uid, newRole);
      if (success) {
        setUsers(users.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAttempts = attempts.filter(a => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'passed' ? a.percentage >= PASSING_GRADE :
      a.percentage < PASSING_GRADE;
    
    const matchesSearch = 
      (a.userName || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.userEmail || '').toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const isAttempts = activeTab === 'attempts';
    const headers = isAttempts 
      ? ['Candidate Name', 'Email Address', 'Score (%)', 'Status', 'Completed Date', 'Certificate Number']
      : ['Staff Name', 'Email', 'Role'];
    
    const rows = isAttempts
      ? filteredAttempts.map(a => [
          a.userName || '',
          a.userEmail || '',
          `${Math.round(a.percentage)}%`,
          a.percentage >= PASSING_GRADE ? 'QUALIFIED' : 'RETAKE REQUIRED',
          a.timestamp ? new Date(a.timestamp).toLocaleDateString('en-GB') : 'N/A',
          a.certNo || 'N/A'
        ])
      : filteredUsers.map(u => [
          u.name || '',
          u.email || '',
          u.role || 'USER'
        ]);

    // Convert array to CSV string
    const csvString = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create a Blob and download it
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', isAttempts 
      ? `Candidate_Information_Export_${new Date().toISOString().split('T')[0]}.csv`
      : `Staff_Information_Export_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };



  if (loading && attempts.length === 0 && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold tracking-tight">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Navigation */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Management Console</h1>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('attempts')}
                  className={`text-sm font-bold transition-all px-3 py-1 rounded-lg cursor-pointer ${activeTab === 'attempts' ? 'bg-brand-blue text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Assessments
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`text-sm font-bold transition-all px-3 py-1 rounded-lg cursor-pointer ${activeTab === 'users' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Staff Management
                </button>
              </div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'attempts' && (
              <motion.div 
                key="attempts-filters"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-wrap gap-2"
              >
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                  All ({attempts.length})
                </button>
                <button 
                  onClick={() => setFilter('passed')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${filter === 'passed' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-50' : 'bg-slate-100 text-slate-500'}`}
                >
                  Passed ({attempts.filter(a => a.percentage >= PASSING_GRADE).length})
                </button>
                <button 
                  onClick={() => setFilter('failed')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${filter === 'failed' ? 'bg-rose-500 text-white shadow-lg shadow-rose-50' : 'bg-slate-100 text-slate-500'}`}
                >
                  Failed ({attempts.filter(a => a.percentage < PASSING_GRADE).length})
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search Bar & Export Area */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder={activeTab === 'attempts' ? "Search candidates..." : "Search staff members..."}
              className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading && <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>}
          </div>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100/50 hover:shadow-emerald-200/50 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title={activeTab === 'attempts' ? "Export Candidate Information as CSV" : "Export Staff List as CSV"}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'attempts' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 uppercase">
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-800">{attempt.userName}</div>
                          <div className="text-[9px] font-bold text-slate-400 normal-case">{attempt.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-black ${attempt.percentage >= PASSING_GRADE ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {Math.round(attempt.percentage)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {attempt.percentage >= PASSING_GRADE ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                          QUALIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-500 border border-rose-100">
                          RETAKE REQ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-[11px] font-bold text-slate-500">
                        {attempt.timestamp ? new Date(attempt.timestamp).toLocaleDateString('en-GB') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {attempt.percentage >= PASSING_GRADE ? (
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => setPreviewAttempt(attempt)}
                            className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-brand-blue hover:text-white transition-all cursor-pointer flex items-center justify-center"
                            title="Preview Certificate"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          <Certificate 
                            participantName={attempt.userName} 
                            date={attempt.timestamp ? new Date(attempt.timestamp).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric' 
                            }) : undefined}
                            certNo={attempt.certNo}
                            variant="icon" 
                          />
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-slate-300">BLOCKED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 uppercase">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                          {user.role === 'ADMIN' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className="text-sm font-black text-slate-800">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 normal-case">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black border ${user.role === 'ADMIN' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        {user.role || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleToggleRole(user)}
                        disabled={updatingId === user.uid}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer disabled:opacity-50 ${user.role === 'ADMIN' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-amber-500 text-white shadow-lg shadow-amber-50 hover:bg-amber-600'}`}
                      >
                        {updatingId === user.uid ? 'PROCESSING...' : user.role === 'ADMIN' ? 'DEMOTE TO USER' : 'PROMOTE TO ADMIN'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {(filteredAttempts.length === 0 && filteredUsers.length === 0) && (
          <div className="p-16 text-center">
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">No Records Found</p>
            <p className="text-slate-300 font-bold text-sm">Adjust your search parameters and try again.</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewAttempt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewAttempt(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-blue/10 rounded-xl text-brand-blue">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-slate-800">Certificate Preview</h3>
                    <p className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest">Verify candidate credentials</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewAttempt(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex flex-col items-center gap-6">
                <Certificate 
                  participantName={previewAttempt.userName}
                  date={previewAttempt.timestamp ? new Date(previewAttempt.timestamp).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : undefined}
                  certNo={previewAttempt.certNo}
                  variant="full"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
