import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { QUIZ_QUESTIONS, PASSING_GRADE } from '../constants';
import { ScoreAttempt } from '../types';
import { saveScoreAttempt } from '../services/quizService';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizProps {
  user: { uid: string };
  onComplete: (attempt: ScoreAttempt) => void;
}

const Quiz: React.FC<QuizProps> = ({ user, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleSelect = (optionIdx: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIdx });
  };

  const handleNext = async () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate score and submit
      setSubmitting(true);
      let score = 0;
      QUIZ_QUESTIONS.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          score++;
        }
      });

      const percentage = (score / QUIZ_QUESTIONS.length) * 100;
      console.log(`[Quiz] Finishing assessment for UID: ${user.uid}, percentage: ${percentage}%`);
      const attempt: Omit<ScoreAttempt, 'id' | 'timestamp'> = {
        userId: user.uid,
        score,
        totalQuestions: QUIZ_QUESTIONS.length,
        percentage,
        responses: answers,
        comments: '', // Default empty, to be updated in result page if needed
      };

      try {
        await saveScoreAttempt(attempt);
        console.log('[Quiz] Attempt saved successfully');
        onComplete({ ...attempt, timestamp: new Date() });
      } catch (err) {
        alert('Failed to save score. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const isSelected = (idx: number) => answers[currentQuestion.id] === idx;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 border border-slate-200 min-h-[500px] flex flex-col transition-all">
      {/* Progress Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-slate-500 px-1">
            Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <div className="flex gap-1">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div 
                key={i} 
                className={`w-8 h-1.5 rounded-full transition-all duration-500 ${i <= currentIdx ? 'bg-brand-blue' : 'bg-slate-200'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex-grow flex flex-col justify-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 leading-tight tracking-tight">
            {currentQuestion.text}
          </h2>

          <div className="grid gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`group text-left p-5 rounded-xl border-2 transition-all flex items-center gap-4 cursor-pointer ${
                  isSelected(idx)
                    ? 'border-brand-blue bg-blue-50 text-brand-blue'
                    : 'border-slate-100 bg-white hover:border-brand-blue hover:bg-blue-50 text-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-sm shrink-0 transition-all ${
                  isSelected(idx) ? 'bg-brand-blue border-brand-blue text-white' : 'border-slate-300 bg-white group-hover:border-brand-blue group-hover:bg-brand-blue group-hover:text-white'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={`font-bold transition-colors ${isSelected(idx) ? 'text-blue-900' : 'text-slate-700'}`}>{option}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
        <button
          onClick={handleBack}
          disabled={currentIdx === 0}
          className="px-6 py-3 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-slate-800 disabled:opacity-0 transition-all cursor-pointer"
        >
          Previous Step
        </button>

        <button
          onClick={handleNext}
          disabled={answers[currentQuestion.id] === undefined || submitting}
          className="px-10 py-4 bg-brand-blue text-white font-black rounded-xl shadow-lg shadow-blue-100 hover:opacity-90 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {currentIdx === QUIZ_QUESTIONS.length - 1 ? 'Complete Assessment' : 'Save & Continue'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
