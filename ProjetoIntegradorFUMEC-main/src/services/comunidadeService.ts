import api from './api';

export interface Discussion {
  id: number;
  author: string;
  avatar: string | null;
  title: string;
  category: string;
  replies: number;
  likes: number;
  time: string;
  excerpt: string;
}

export interface TrendingTopic {
  name: string;
  count: number;
}

export interface CommunityStats {
  activeMembers: number;
  activeDiscussions: number;
  weeklyReplies: number;
}

export interface ComunidadeData {
  discussions: Discussion[];
  trendingTopics: TrendingTopic[];
  stats: CommunityStats;
}

export interface CreateDiscussionPayload {
  title: string;
  content: string;
  category: string;
}

export const comunidadeService = {
  async getComunidade(): Promise<ComunidadeData> {
    const { data } = await api.get<ComunidadeData>('/comunidade');
    return data;
  },

  async getDiscussions(params?: { page?: number; category?: string }): Promise<Discussion[]> {
    const { data } = await api.get<{ discussions: Discussion[] }>('/comunidade/discussions', { params });
    return data.discussions;
  },

  async createDiscussion(payload: CreateDiscussionPayload): Promise<Discussion> {
    const { data } = await api.post<{ discussion: Discussion }>('/comunidade/discussions', payload);
    return data.discussion;
  },

  async likeDiscussion(id: number): Promise<void> {
    await api.post(`/comunidade/discussions/${id}/like`);
  },

  async getTrendingTopics(): Promise<TrendingTopic[]> {
    const { data } = await api.get<{ topics: TrendingTopic[] }>('/comunidade/topics/trending');
    return data.topics;
  },

  async getStats(): Promise<CommunityStats> {
    const { data } = await api.get<{ stats: CommunityStats }>('/comunidade/stats');
    return data.stats;
  },
};
