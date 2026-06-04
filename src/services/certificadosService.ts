import api from './api';

export interface Certificate {
  id: number;
  title: string;
  module: string;
  issueDate: string | null;
  hours: number;
  status: 'in-progress' | 'completed';
  progress: number;
}

export interface Achievement {
  icon: string;
  title: string;
  description: string;
  earned: boolean;
  date?: string;
  progress?: number;
}

export interface CertificadosStats {
  certificatesEarned: number;
  achievementsUnlocked: number;
  totalStudyHours: number;
}

export interface CertificadosData {
  certificates: Certificate[];
  achievements: Achievement[];
  stats: CertificadosStats;
}

export const certificadosService = {
  async getCertificados(): Promise<CertificadosData> {
    const { data } = await api.get<CertificadosData>('/certificados');
    return data;
  },

  async getCertificates(): Promise<Certificate[]> {
    const { data } = await api.get<{ certificates: Certificate[] }>('/certificados/list');
    return data.certificates;
  },

  async downloadCertificate(id: number): Promise<string> {
    const { data } = await api.get<{ download_url: string }>(`/certificados/${id}/download`);
    return data.download_url;
  },

  async getAchievements(): Promise<Achievement[]> {
    const { data } = await api.get<{ achievements: Achievement[] }>('/certificados/achievements');
    return data.achievements;
  },

  async getStats(): Promise<CertificadosStats> {
    const { data } = await api.get<{ stats: CertificadosStats }>('/certificados/stats');
    return data.stats;
  },
};
