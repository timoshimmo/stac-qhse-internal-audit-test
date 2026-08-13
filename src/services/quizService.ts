import { UserProfile, ScoreAttempt } from '../types';

const API_BASE = '/api';

export const findUserProfileByIdentifier = async (identifier: string): Promise<{ uid: string; profile: UserProfile } | null> => {
  try {
    const res = await fetch(`${API_BASE}/users/find/identifier?identifier=${encodeURIComponent(identifier)}`);
    if (res.ok) {
      const data = await res.json();
      return {
        uid: data.uid,
        profile: {
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
        }
      };
    }
    return null;
  } catch (error) {
    console.error('Error finding profile:', error);
    return null;
  }
};

export const saveUserProfile = async (userId: string, profile: Omit<UserProfile, 'createdAt'>) => {
  const url = `${API_BASE}/registration`;
  console.log(`[quizService] POST ${url}`, { ...profile, uid: userId });
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profile, uid: userId })
    });
    console.log(`[quizService] Response status: ${res.status}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('[quizService] Save profile failed:', res.status, data);
      throw new Error(data.error || data.message || `Server error (${res.status}): Failed to save profile`);
    }
    return data.user; // Return the user object from server
  } catch (error) {
    console.error('[quizService] Error in saveUserProfile:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Could not reach the server. Please check your connection.');
    }
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

export const saveScoreAttempt = async (attempt: Omit<ScoreAttempt, 'id' | 'timestamp'>) => {
  try {
    const res = await fetch(`${API_BASE}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt)
    });
    if (!res.ok) throw new Error('Failed to save attempt');
  } catch (error) {
    console.error('Error saving attempt:', error);
    throw error;
  }
};

export const updateAttemptComments = async (attemptId: string, comments: string) => {
  try {
    const res = await fetch(`${API_BASE}/attempts/${attemptId}/comments`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments })
    });
    if (!res.ok) throw new Error('Failed to update comments');
  } catch (error) {
    console.error('Error updating comments:', error);
    throw error;
  }
};

export const getUserAttempts = async (userId: string): Promise<ScoreAttempt[]> => {
  try {
    const res = await fetch(`${API_BASE}/attempts/${userId}`);
    if (res.ok) {
      const data = await res.json();
      return data.map((d: any) => ({
        ...d,
        id: d._id || d.id,
        timestamp: d.timestamp ? new Date(d.timestamp) : new Date()
      })) as ScoreAttempt[];
    }
    return [];
  } catch (error) {
    console.error('Error getting attempts:', error);
    return [];
  }
};

export const submitReview = async (userId: string, userName: string, comment: string, rating: number = 5) => {
  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName, comment, rating })
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return await res.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const getReviews = async () => {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const getAllAttempts = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/attempts`);
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Error getting all attempts:', error);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/users`);
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

export const updateUserRole = async (uid: string, role: 'USER' | 'ADMIN') => {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${uid}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.ok;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};
