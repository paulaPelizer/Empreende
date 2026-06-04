import { CheckCircle, Circle, Lock, Loader2, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { jornadaService, type JornadaModule, type JornadaProgress } from '../../services/jornadaService';

interface JornadaProps {
  onOpenModule?: (moduleId: number) => void;
}

export function Jornada({ onOpenModule }: JornadaProps) {
  const [modules, setModules] = useState<JornadaModule[]>([]);
  const [progress, setProgress] = useState<JornadaProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jornadaService
      .getJornada()
      .then((data) => {
        setModules(data.modules ?? []);
        setProgress(data.progress ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-[var(--coral-neon)]" />;
      case 'in-progress':
        return <PlayCircle className="w-8 h-8 text-[var(--salmon-neon)]" />;
      case 'locked':
        return <Lock className="w-8 h-8 text-gray-300" />;
      default:
        return <Circle className="w-8 h-8 text-gray-300" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--coral-neon)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--graphite)] mb-2">Minha Jornada de Formação</h1>
        <p className="text-[var(--graphite)]/70">
          Complete os módulos sequencialmente para desenvolver todas as competências necessárias
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-[var(--skin-tone-light)] to-[var(--skin-tone)] rounded-xl p-6 border border-[var(--skin-tone-dark)]/30 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-[var(--graphite)]/70 mb-1">Progresso Total da Jornada</div>
            <div className="text-3xl font-bold text-[var(--graphite)]">{progress?.totalProgress ?? 0}%</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[var(--graphite)]/70 mb-1">Módulos Concluídos</div>
            <div className="text-2xl font-bold text-[var(--coral-neon)]">
              {progress?.completedModules ?? 0}/{progress?.totalModules ?? 0}
            </div>
          </div>
        </div>
        <div className="h-3 bg-white/80 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-[var(--coral-neon)] shadow-sm"
            style={{ width: `${progress?.totalProgress ?? 0}%` }}
          ></div>
        </div>
      </div>

      {/* Modules Timeline */}
      <div className="space-y-4">
        {modules.map((module, index) => {
          const isLocked = module.status === 'locked';
          const isCompleted = module.status === 'completed';
          const isInProgress = module.status === 'in-progress';

          return (
            <div key={module.id} className="relative">
              {/* Connector line */}
              {index < modules.length - 1 && (
                <div className="absolute left-[2.5rem] top-[4.5rem] w-0.5 h-[calc(100%+1rem)] bg-gradient-to-b from-gray-200 to-transparent"></div>
              )}

              {/* Module Card */}
              <div
                className={`
                  bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border-2 transition-all
                  ${isLocked ? 'border-gray-200/50 dark:border-[var(--border)] opacity-60' : 'border-gray-200/50 dark:border-[var(--border)] hover:border-[var(--coral-neon)]/40 hover:shadow-lg cursor-pointer'}
                  ${isInProgress ? 'border-[var(--salmon-neon)]/50 shadow-md' : ''}
                  ${isCompleted ? 'border-[var(--skin-tone-dark)]/40' : ''}
                `}
              >
                <div className="flex gap-6">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 relative z-10 bg-white rounded-full p-1 shadow-sm">
                    {getStatusIcon(module.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-[var(--graphite)]">{module.title}</h3>
                          {isCompleted && (
                            <span className="text-xs bg-[var(--coral-neon)]/10 text-[var(--coral-neon)] px-3 py-1 rounded-full font-medium border border-[var(--coral-neon)]/20">
                              Concluído
                            </span>
                          )}
                          {isInProgress && (
                            <span className="text-xs bg-[var(--salmon-neon)]/10 text-[var(--salmon-neon)] px-3 py-1 rounded-full font-medium border border-[var(--salmon-neon)]/20">
                              Em andamento
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--graphite)]/70">{module.description}</p>
                      </div>
                      <div className="text-right text-sm text-[var(--graphite)]/60">
                        {module.duration}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-3 text-sm text-[var(--graphite)]/70">
                      <div>
                        <span className="font-medium text-[var(--graphite)]">{module.completedLessons}</span>/{module.lessons} etapas
                      </div>
                      <div>•</div>
                      <div>{module.progress}% completo</div>
                    </div>

                    {/* Progress Bar */}
                    {!isLocked && (
                      <div className="mb-4">
                        <div className="h-2 bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              isCompleted
                                ? 'bg-[var(--coral-neon)]'
                                : 'bg-gradient-to-r from-[var(--salmon-neon)] to-[var(--coral-neon)]'
                            }`}
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {!isLocked && (
                      <button
                        onClick={() => onOpenModule?.(module.id)}
                        className={`
                          px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm
                          ${isCompleted
                            ? 'bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)] text-[var(--graphite)] hover:bg-[var(--skin-tone)] dark:hover:bg-[var(--skin-tone)] border border-[var(--skin-tone-dark)]/20'
                            : 'bg-[var(--coral-neon)] text-white hover:bg-[var(--coral-neon-dark)]'
                          }
                        `}
                      >
                        {isCompleted ? 'Revisar Módulo' : 'Continuar'}
                      </button>
                    )}
                    {isLocked && (
                      <div className="text-sm text-[var(--graphite)]/50 italic">
                        Complete os módulos anteriores para desbloquear
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
