import React, { useEffect, useState } from 'react';
import { getReviews } from '../services/quizService';
import { MessageSquare, Star, Clock, User, Quote } from 'lucide-react';
import { motion } from 'motion/react';

interface Review {
  _id: string;
  userName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export default function CommentsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Retrieving candidate feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="comments-page">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Review Comments</h1>
            <p className="text-slate-500 font-bold">Feedback from certified STAC Marine candidates</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white p-20 rounded-2xl shadow-sm border border-slate-200 text-center">
          <Quote className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-lg">No reviews documented yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-brand-blue/30 transition-all hover:shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Quote className="w-16 h-16" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 leading-none mb-1">{review.userName || 'Anonymous'}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="relative">
                <p className="text-slate-600 font-semibold leading-relaxed text-sm italic">
                  "{review.comment}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
