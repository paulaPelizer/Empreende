import { Award, Download, Share2, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  certificadosService,
  type Certificate,
  type Achievement,
  type CertificadosStats,
} from '../../services/certificadosService';

export function Certificados() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<CertificadosStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificadosService
      .getCertificados()
      .then((data) => {
        setCertificates(data.certificates ?? []);
        setAchievements(data.achievements ?? []);
        setStats(data.stats ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        <h1 className="text-2xl font-bold text-[var(--graphite)] mb-2">Certificados e Conquistas</h1>
        <p className="text-[var(--graphite)]/70">
          Acompanhe seus certificados e conquistas ao longo da jornada
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[var(--coral-neon)] to-[var(--salmon-neon)] rounded-xl p-6 text-white shadow-lg">
          <Award className="w-8 h-8 mb-3" />
          <div className="text-3xl font-bold mb-1">{stats?.certificatesEarned ?? 0}</div>
          <div className="text-white/90">Certificado Conquistado</div>
        </div>
        <div className="bg-gradient-to-br from-[var(--salmon-neon)] to-[var(--skin-tone-dark)] rounded-xl p-6 text-white shadow-lg">
          <CheckCircle className="w-8 h-8 mb-3" />
          <div className="text-3xl font-bold mb-1">{stats?.achievementsUnlocked ?? 0}</div>
          <div className="text-white/90">Conquistas Desbloqueadas</div>
        </div>
        <div className="bg-gradient-to-br from-[var(--skin-tone-dark)] to-[var(--coral-neon)] rounded-xl p-6 text-white shadow-lg">
          <Clock className="w-8 h-8 mb-3" />
          <div className="text-3xl font-bold mb-1">{stats?.totalStudyHours ?? 0}h</div>
          <div className="text-white/90">Total de Estudo</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificates */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--graphite)]">Meus Certificados</h2>

          {certificates.map((cert) => (
            <div
              key={cert.id}
              className={`bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border-2 shadow-sm transition-all ${
                cert.status === 'completed'
                  ? 'border-[var(--coral-neon)]/50 hover:shadow-lg'
                  : 'border-gray-200/50 dark:border-[var(--border)] opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  cert.status === 'completed'
                    ? 'bg-[var(--coral-neon)]/10 dark:bg-[var(--coral-neon)]/20'
                    : 'bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)]'
                }`}>
                  {cert.status === 'completed' ? (
                    <Award className="w-8 h-8 text-[var(--coral-neon)]" />
                  ) : (
                    <Clock className="w-8 h-8 text-[var(--graphite)]/50" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-[var(--graphite)] mb-1">{cert.title}</h3>
                      <p className="text-sm text-[var(--graphite)]/60">{cert.module}</p>
                    </div>
                    {cert.status === 'completed' && (
                      <span className="text-xs bg-[var(--coral-neon)]/10 dark:bg-[var(--coral-neon)]/20 text-[var(--coral-neon)] px-3 py-1 rounded-full font-medium border border-[var(--coral-neon)]/20">
                        Concluído
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[var(--graphite)]/70 mb-3">
                    <span>{cert.hours} horas</span>
                    {cert.issueDate && (
                      <>
                        <span>•</span>
                        <span>
                          Emitido em{' '}
                          {new Date(cert.issueDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </>
                    )}
                  </div>

                  {cert.status === 'in-progress' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-[var(--graphite)]/60 mb-1">
                        <span>Progresso</span>
                        <span>{cert.progress}%</span>
                      </div>
                      <div className="h-2 bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--salmon-neon)] to-[var(--coral-neon)]"
                          style={{ width: `${cert.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {cert.status === 'completed' && (
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-[var(--coral-neon)] text-white rounded-lg font-medium hover:bg-[var(--coral-neon-dark)] transition-colors shadow-sm flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Baixar PDF
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-[var(--border)] text-[var(--graphite)] rounded-lg font-medium hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] transition-colors flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--graphite)]">Conquistas</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-5 border-2 shadow-sm transition-all ${
                  achievement.earned
                    ? 'border-[var(--salmon-neon)]/50 hover:shadow-md'
                    : 'border-gray-200/50 dark:border-[var(--border)] opacity-70'
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2 grayscale-0">{achievement.icon}</div>
                  <h3 className="font-bold text-[var(--graphite)] mb-1">{achievement.title}</h3>
                  <p className="text-xs text-[var(--graphite)]/70">{achievement.description}</p>
                </div>

                {achievement.earned ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[var(--salmon-neon)] text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Conquistado</span>
                    </div>
                    {achievement.date && (
                      <div className="text-xs text-[var(--graphite)]/50 mt-1">
                        {new Date(achievement.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs text-[var(--graphite)]/60 mb-1">
                      <span>Progresso</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--salmon-neon)]"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
