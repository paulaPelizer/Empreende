import api from './api';

export interface DashboardStat {
  label: string;
  value: string;
  total?: string;
  trend?: string;
  key: string;
}

export interface NextStep {
  title: string;
  module: string;
  progress: number;
  duration: string;
}

export interface Activity {
  title: string;
  time: string;
  type: 'success' | 'info' | 'new' | 'comment';
}

export interface DashboardData {
  stats: DashboardStat[];
  nextSteps: NextStep[];
  activities: Activity[];
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>('/dashboard');
    return data;
  },

  async getStats(): Promise<DashboardStat[]> {
    const { data } = await api.get<{ stats: DashboardStat[] }>('/dashboard/stats');
    return data.stats;
  },

  async getActivities(): Promise<Activity[]> {
    const { data } = await api.get<{ activities: Activity[] }>('/dashboard/activities');
    return data.activities;
  },

  async getNextSteps(): Promise<NextStep[]> {
    const { data } = await api.get<{ nextSteps: NextStep[] }>('/dashboard/next-steps');
    return data.nextSteps;
  },
};
