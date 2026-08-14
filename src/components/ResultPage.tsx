import React, { useState } from 'react';
import { ScoreAttempt } from '../types';
import { PASSING_GRADE } from '../constants';
import { updateAttemptComments, submitReview } from '../services/quizService';
import { RotateCcw, MessageSquare, Save, Loader2, CheckCircle, Award, Trophy, XCircle, Star } from 'lucide-react';
import { motion } from 'motion/react';
import Certificate from './Certificate';

interface ResultPageProps {
  attempt: ScoreAttempt;
  participantName: string;
  onTryAgain: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ attempt, participantName, onTryAgain }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const passed = attempt.percentage >= PASSING_GRADE;

  const handleSaveComment = async () => {
    if (!comment) return;
    setSaving(true);
    try {
      // 1. Update the record for this specific attempt
      if (attempt.id) {
        await updateAttemptComments(attempt.id, comment);
      }
      
      // 2. Submit to the global Review wall
      await submitReview(attempt.userId, participantName, comment, rating);
      
      setSaved(true);
    } catch (err) {
      alert('Failed to save feedback.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 border border-slate-200">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-28 h-28 rounded-[2rem] mx-auto flex items-center justify-center mb-8 shadow-xl ${
            passed ? 'bg-brand-blue text-white shadow-blue-100' : 'bg-red-50 text-red-600 shadow-red-50'
          }`}
        >
          {passed ? <Trophy className="w-14 h-14" /> : <XCircle className="w-14 h-14" />}
        </motion.div>
        
        <h2 className="text-4xl font-black text-slate-800 mb-3 tracking-tighter">
          {passed ? 'Exceptional Result' : 'Support Required'}
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className={`text-2xl font-black ${passed ? 'text-brand-blue' : 'text-red-500'}`}>
            {Math.round(attempt.percentage)}%
          </span>
          <span className="text-slate-300 font-bold">|</span>
          <span className="text-lg font-bold text-slate-500">
            {attempt.score} of {attempt.totalQuestions}
          </span>
        </div>
        
        {!passed && (
          <div className="mt-6 p-5 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-700 text-sm font-black uppercase tracking-wider">
              Retry Required • Min. {PASSING_GRADE}% Threshold
            </p>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {passed && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-brand-blue" />
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Official Certification</h3>
            </div>
            <Certificate 
              participantName={participantName} 
              certNo={attempt.certNo}
              date={new Date().toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            />
          </div>
        )}

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" />
            Candidate Feedback & Rating
          </label>
          
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                disabled={saved}
                className={`transition-all ${star <= rating ? 'text-amber-400' : 'text-slate-300'} ${!saved && 'hover:scale-110 active:scale-95'}`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={saved}
            placeholder="Document your thoughts on this assessment..."
            className="w-full bg-white border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-brand-blue outline-none transition-all font-semibold text-slate-700 min-h-[140px] resize-none text-sm"
          />
          {!saved && (
            <button
              onClick={handleSaveComment}
              disabled={!comment || saving}
              className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Submit
            </button>
          )}
          {saved && (
            <p className="mt-4 text-sm font-black text-brand-blue flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Records Updated Successfully
            </p>
          )}
        </div>

        <div className="pt-8 border-t border-slate-100">
          <button
            onClick={onTryAgain}
            className={`w-full flex items-center justify-center gap-3 py-5 rounded-xl font-black text-lg transition-all shadow-lg active:scale-[0.98] cursor-pointer ${
              passed 
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                : 'bg-brand-blue text-white hover:opacity-90 shadow-blue-100'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            {passed ? 'Start New Assessment' : 'Attempt To Improve'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
