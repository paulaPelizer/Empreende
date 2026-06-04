import api from './api';

export interface Mentor {
  id: number;
  name: string;
  role: string;
  expertise: string;
  rating: number;
  totalSessions: number;
  avatar: string | null;
  bio: string;
}

export interface MentoringSession {
  id: number;
  date: string;
  time: string;
  duration: string;
  topic: string;
  type: 'video' | 'chat';
  status?: 'scheduled' | 'completed' | 'cancelled';
  rating?: number;
  notes?: string;
}

export interface MentoriaData {
  mentor: Mentor;
  upcomingSessions: MentoringSession[];
  pastSessions: MentoringSession[];
}

export interface ScheduleSessionPayload {
  date: string;
  time: string;
  topic: string;
  duration: 30 | 45 | 60;
  type: 'video' | 'chat';
}

export const mentoriaService = {
  async getMentoria(): Promise<MentoriaData> {
    const { data } = await api.get<MentoriaData>('/mentoria');
    return data;
  },

  async getMentor(): Promise<Mentor> {
    const { data } = await api.get<{ mentor: Mentor }>('/mentoria/mentor');
    return data.mentor;
  },

  async getUpcomingSessions(): Promise<MentoringSession[]> {
    const { data } = await api.get<{ sessions: MentoringSession[] }>('/mentoria/sessions/upcoming');
    return data.sessions;
  },

  async getPastSessions(): Promise<MentoringSession[]> {
    const { data } = await api.get<{ sessions: MentoringSession[] }>('/mentoria/sessions/past');
    return data.sessions;
  },

  async scheduleSession(payload: ScheduleSessionPayload): Promise<MentoringSession> {
    const { data } = await api.post<{ session: MentoringSession }>('/mentoria/sessions', payload);
    return data.session;
  },

  async rescheduleSession(id: number, date: string, time: string): Promise<void> {
    await api.put(`/mentoria/sessions/${id}/reschedule`, { date, time });
  },

  async rateSession(id: number, rating: number, notes?: string): Promise<void> {
    await api.post(`/mentoria/sessions/${id}/rate`, { rating, notes });
  },
};
