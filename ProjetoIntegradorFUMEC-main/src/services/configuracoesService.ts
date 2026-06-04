import api from './api';

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  business: string;
  city: string;
  state: string;
  avatar: string | null;
}

export interface NotificationSettings {
  emailSessions: boolean;
  emailModules: boolean;
  emailCommunity: boolean;
  pushEnabled: boolean;
}

export interface PreferenceSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt_BR' | 'en_US' | 'es_ES';
}

export interface ConfiguracoesData {
  profile: ProfileData;
  notifications: NotificationSettings;
  preferences: PreferenceSettings;
}

export const configuracoesService = {
  async getConfiguracoes(): Promise<ConfiguracoesData> {
    const { data } = await api.get<ConfiguracoesData>('/configuracoes');
    return data;
  },

  async updateProfile(payload: Partial<ProfileData>): Promise<ProfileData> {
    const { data } = await api.put<{ profile: ProfileData }>('/configuracoes/profile', payload);
    return data.profile;
  },

  async updateNotifications(payload: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const { data } = await api.put<{ notifications: NotificationSettings }>(
      '/configuracoes/notifications',
      payload,
    );
    return data.notifications;
  },

  async updateSecurity(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await api.put('/configuracoes/security', payload);
  },

  async updatePreferences(payload: Partial<PreferenceSettings>): Promise<PreferenceSettings> {
    const { data } = await api.put<{ preferences: PreferenceSettings }>(
      '/configuracoes/preferences',
      payload,
    );
    return data.preferences;
  },
};
