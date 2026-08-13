export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  role?: 'USER' | 'ADMIN';
  createdAt: Date;
}

export interface ScoreAttempt {
  id?: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  comments: string;
  responses: Record<string, number>;
  timestamp: Date;
}

export interface FeedbackData {
  id?: string;
  userId: string;
  userName: string;
  userEmail?: string;
  courseName: string;
  trainingDate: string;
  attemptId?: string;
  ratings: Record<string, number>;
  mostUseful?: string;
  improvements?: string;
  depthTopics?: string;
  signature?: string;
  createdAt?: Date | string;
}
