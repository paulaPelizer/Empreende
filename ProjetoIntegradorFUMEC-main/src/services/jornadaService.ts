import api from './api';

export interface JornadaModule {
  id: number;
  moduleOrder?: number;
  title: string;
  description: string;
  status: 'locked' | 'in-progress' | 'completed';
  progress: number;
  lessons: number;
  completedLessons: number;
  duration: string;
}

export interface JornadaProgress {
  totalProgress: number;
  completedModules: number;
  totalModules: number;
  totalHours: number;
  completedLessons: number;
  totalLessons: number;
}

export interface JornadaData {
  progress: JornadaProgress;
  modules: JornadaModule[];
}

export interface JornadaFieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea';
}

export interface JornadaStepContent {
  objectives?: string[];
  instructions?: string[];
  title?: string;
  description?: string;
  fields?: JornadaFieldConfig[];
  checklist?: string[];
  submitLabel?: string;
}

export interface JornadaStep {
  key: 'video' | 'avaliacao1' | 'pdf' | 'avaliacao2' | string;
  label: string;
  description: string;
  contentType: 'video' | 'activity' | 'pdf' | string;
  position: number;
  completed?: boolean;
  content?: JornadaStepContent;
}

export interface ModuleActivity {
  stepKey: string;
  formValues: Record<string, string>;
  checks: Record<string, boolean>;
  submitted: boolean;
  updatedAt?: string;
}

export interface JornadaModuleContent extends JornadaModule {
  sector: string;
  subtitle: string;
  videoTitle: string;
  videoUrl?: string | null;
  pdfTitle: string;
  pdfUrl?: string | null;
  steps: JornadaStep[];
  activity?: ModuleActivity | null;
  activities?: Record<string, ModuleActivity>;
}

export interface SaveModuleActivityPayload {
  stepKey: string;
  formValues: Record<string, string>;
  checks: Record<string, boolean>;
  submitted?: boolean;
}

export interface ActivityResponse {
  id: number;
  moduleId: number;
  moduleOrder: number;
  moduleTitle: string;
  stepKey: string;
  stepLabel: string;
  formValues: Record<string, string>;
  checks: Record<string, boolean>;
  submitted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const jornadaService = {
  async getJornada(): Promise<JornadaData> {
    const { data } = await api.get<JornadaData>('/jornada');
    return data;
  },

  async getModules(): Promise<JornadaModule[]> {
    const { data } = await api.get<{ modules: JornadaModule[] }>('/jornada/modules');
    return data.modules;
  },

  async getModule(id: number): Promise<JornadaModule> {
    const { data } = await api.get<{ module: JornadaModule }>(`/jornada/modules/${id}`);
    return data.module;
  },

  async getModuleContent(id: number): Promise<JornadaModuleContent> {
    const { data } = await api.get<{ module: JornadaModuleContent }>(`/jornada/modules/${id}/content`);
    return data.module;
  },

  async getModuleActivity(moduleId: number): Promise<ModuleActivity | null> {
    const { data } = await api.get<{ activity: ModuleActivity | null }>(
      `/jornada/modules/${moduleId}/activity`,
    );
    return data.activity;
  },

  async getResponses(): Promise<ActivityResponse[]> {
    const { data } = await api.get<{ responses: ActivityResponse[] }>('/jornada/responses');
    return data.responses;
  },

  async saveModuleActivity(
    moduleId: number,
    payload: SaveModuleActivityPayload,
  ): Promise<ModuleActivity> {
    const { data } = await api.put<{ activity: ModuleActivity }>(
      `/jornada/modules/${moduleId}/activity`,
      payload,
    );
    return data.activity;
  },

  async completeStep(moduleId: number, stepKey: string): Promise<void> {
    await api.post(`/jornada/modules/${moduleId}/complete-step`, { stepKey });
  },

  async completeLesson(moduleId: number, lessonId: number): Promise<void> {
    await api.post(`/jornada/modules/${moduleId}/complete`, { lesson_id: lessonId });
  },
};
