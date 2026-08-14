import React, { useState } from 'react';
import { UserProfile, ScoreAttempt, FeedbackData } from '../types';
import { saveFeedback } from '../services/quizService';
import { CheckCircle2, Loader2, Send, Star, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface FeedbackPageProps {
  user: { uid: string };
  profile: UserProfile;
  attempt?: ScoreAttempt | null;
  onComplete: () => void;
}

const FEEDBACK_SECTIONS = [
  {
    title: 'A. Relevance of the Training',
    questions: [
      { id: 'q1', text: '1. The training content was relevant to my role and daily work at my site (office / warehouse / FPSO / vessels).' },
      { id: 'q2', text: '2. The course objectives were clear, and the content delivered what was promised.' },
      { id: 'q3', text: '3. The examples and scenarios used (e.g. gasket scenario, permit to work, warehouse and FPSO situations) reflected our real operations.' },
    ],
  },
  {
    title: 'B. Learning Quality',
    questions: [
      { id: 'q4', text: '4. The content was easy to understand, well organized and logically sequenced.' },
      { id: 'q5', text: '5. The training materials (slides, handout notes, visuals) supported my learning effectively.' },
      { id: 'q6', text: '6. I am confident I can apply what I learned in my work after this session.' },
    ],
  },
  {
    title: 'C. Trainer Performance',
    questions: [
      { id: 'q7', text: '7. The trainer demonstrated strong knowledge of the ISO standards and our operations.' },
      { id: 'q8', text: '8. The trainer explained concepts clearly and encouraged questions and participation.' },
    ],
  },
  {
    title: 'D. Overall Assessment',
    questions: [
      { id: 'q9', text: '9. The pace, duration and session arrangements (venue, timing, breaks) were appropriate.' },
      { id: 'q10', text: '10. Overall, I am satisfied with this training and would recommend it to colleagues.' },
    ],
  },
];

const FeedbackPage: React.FC<FeedbackPageProps> = ({ user, profile, attempt, onComplete }) => {
  const defaultDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const [candidateName, setCandidateName] = useState(profile.name || '');
  const [courseName, setCourseName] = useState('QHSE Training Programme — ISO 9001:2015 | ISO 14001:2015 | ISO 45001:2018');
  const [trainingDate, setTrainingDate] = useState(defaultDate);

  // Ratings 1-10 for each question q1-q10
  const [ratings, setRatings] = useState<Record<string, number>>({});
  
  // Open comments
  const [mostUseful, setMostUseful] = useState('');
  const [improvements, setImprovements] = useState('');
  const [depthTopics, setDepthTopics] = useState('');
  const [signature, setSignature] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRatingSelect = (qId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [qId]: rating }));
  };

  const isFormValid = () => {
    // Check if all 10 questions have ratings
    for (let i = 1; i <= 10; i++) {
      if (!ratings[`q${i}`]) return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setErrorMsg('Please provide a rating (1-10) for all 10 evaluation statements.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const feedbackPayload: FeedbackData = {
      userId: user.uid,
      userName: candidateName || profile.name,
      userEmail: profile.email,
      courseName,
      trainingDate,
      attemptId: attempt?.id,
      ratings,
      mostUseful,
      improvements,
      depthTopics,
      signature,
      createdAt: new Date().toISOString()
    };

    try {
      await saveFeedback(feedbackPayload);
      console.log('[FeedbackPage] Saved feedback successfully!');
      onComplete();
    } catch (err) {
      console.error('[FeedbackPage] Error saving feedback:', err);
      setErrorMsg('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12"
    >
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-blue to-slate-900 text-white p-8 md:p-10 relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <FileText className="w-6 h-6 text-blue-300" />
          </div>
          <span className="text-xs font-black tracking-widest text-blue-200 uppercase">
            STAC Marine Offshore Limited
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Post-Training Feedback Form
        </h1>
        <p className="text-blue-100/80 text-xs md:text-sm font-semibold max-w-2xl">
          QHSE Training Programme — ISO 9001:2015 | ISO 14001:2015 | ISO 45001:2018
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
        {/* Candidate Info Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Candidate Name
            </label>
            <input 
              type="text" 
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Course Name
            </label>
            <input 
              type="text" 
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Date of Training
            </label>
            <input 
              type="text" 
              value={trainingDate}
              onChange={e => setTrainingDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              required
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 bg-brand-blue text-white rounded-xl shrink-0 mt-0.5">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
            <strong className="text-brand-blue font-bold">Instructions: </strong>
            Please rate each statement on a scale of <span className="font-bold">1 to 10</span>, where <span className="font-bold text-slate-900">1 = Strongly disagree / Very poor</span> and <span className="font-bold text-slate-900">10 = Strongly agree / Excellent</span>. Select one box per line. Your feedback helps us improve future sessions.
          </div>
        </div>

        {/* Evaluation Sections */}
        <div className="space-y-8">
          {FEEDBACK_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-black text-brand-blue border-b border-slate-200 pb-3">
                {section.title}
              </h2>

              <div className="space-y-6">
                {section.questions.map((q) => (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                    <p className="text-sm md:text-base font-bold text-slate-800 leading-snug">
                      {q.text}
                    </p>

                    {/* Scale 1 to 10 buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 mr-1 hidden sm:inline">Poor</span>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const active = ratings[q.id] === num;
                        return (
                          <button
                            type="button"
                            key={num}
                            onClick={() => handleRatingSelect(q.id, num)}
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-xl font-black text-xs md:text-sm transition-all flex items-center justify-center cursor-pointer ${
                              active
                                ? 'bg-brand-blue text-white shadow-md shadow-blue-200 scale-105 border-2 border-brand-blue'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                      <span className="text-[10px] font-black uppercase text-emerald-600 ml-1 hidden sm:inline">Excellent</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Open Comments */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-black text-slate-800 border-b border-slate-200 pb-3">
            Open Comments <span className="text-xs font-medium text-slate-400">(Optional)</span>
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                What was the most useful part of the training for you?
              </label>
              <textarea
                rows={3}
                value={mostUseful}
                onChange={e => setMostUseful(e.target.value)}
                placeholder="Share key takeaways or relevant modules..."
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                What could be improved in future sessions?
              </label>
              <textarea
                rows={3}
                value={improvements}
                onChange={e => setImprovements(e.target.value)}
                placeholder="Suggestions regarding duration, scenarios, venue, etc..."
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Any topics you would like covered in more depth?
              </label>
              <textarea
                rows={3}
                value={depthTopics}
                onChange={e => setDepthTopics(e.target.value)}
                placeholder="Specific ISO guidelines, site procedures, or additional training..."
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Signature Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            Signature <span className="normal-case text-slate-400 font-normal">(Optional - Type your full name or initials)</span>
          </label>
          <input 
            type="text" 
            value={signature}
            onChange={e => setSignature(e.target.value)}
            placeholder={candidateName}
            className="w-full md:w-1/2 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-serif italic text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 font-medium">
            Thank you for your feedback. Completed forms are reviewed by the QHSE training coordinator.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-4 bg-brand-blue hover:opacity-90 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Feedback...
              </>
            ) : (
              <>
                Submit
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default FeedbackPage;
