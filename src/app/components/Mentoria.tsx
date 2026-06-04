import { Calendar, MessageCircle, Video, Clock, Star, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { mentoriaService, type Mentor, type MentoringSession } from '../../services/mentoriaService';

export function Mentoria() {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<MentoringSession[]>([]);
  const [pastSessions, setPastSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mentoriaService
      .getMentoria()
      .then((data) => {
        setMentor(data.mentor);
        setUpcomingSessions(data.upcomingSessions ?? []);
        setPastSessions(data.pastSessions ?? []);
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
        <h1 className="text-2xl font-bold text-[var(--graphite)] mb-2">Mentoria</h1>
        <p className="text-[var(--graphite)]/70">
          Agende e acompanhe suas sessões com mentores especializados
        </p>
      </div>

      {/* Mentor Profile */}
      {mentor && (
      <div className="bg-gradient-to-br from-[var(--skin-tone-light)] to-[var(--skin-tone)] rounded-xl p-6 border border-[var(--skin-tone-dark)]/30 shadow-md">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-[var(--skin-tone-dark)]"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[var(--graphite)] mb-1">{mentor.name}</h2>
            <p className="text-[var(--coral-neon)] font-medium mb-2">{mentor.role}</p>
            <p className="text-[var(--graphite)]/80 mb-3">{mentor.expertise}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[var(--salmon-neon)] fill-[var(--salmon-neon)]" />
                <span className="font-semibold text-[var(--graphite)]">{mentor.rating}</span>
                <span className="text-[var(--graphite)]/70">avaliação</span>
              </div>
              <div className="text-[var(--graphite)]/70">
                {mentor.totalSessions}+ sessões realizadas
              </div>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-white text-[var(--coral-neon)] rounded-xl font-medium hover:bg-[var(--coral-neon)] hover:text-white transition-all border border-[var(--coral-neon)]/30 shadow-sm">
            Agendar Sessão
          </button>
        </div>
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--graphite)]">Próximas Sessões</h2>
            <Calendar className="w-5 h-5 text-[var(--graphite)]/40" />
          </div>
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div
                key={index}
                className="border border-gray-200/50 dark:border-[var(--border)] rounded-xl p-4 hover:border-[var(--coral-neon)]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--graphite)] mb-2">{session.topic}</h3>
                    <div className="flex items-center gap-4 text-sm text-[var(--graphite)]/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(session.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>{session.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2.5 bg-[var(--coral-neon)] text-white rounded-xl font-medium hover:bg-[var(--coral-neon-dark)] transition-colors shadow-sm">
                    Entrar na Sessão
                  </button>
                  <button className="px-4 py-2.5 border border-gray-300 text-[var(--graphite)] rounded-xl font-medium hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] transition-colors">
                    Reagendar
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-[var(--graphite)]/70 font-medium hover:border-[var(--coral-neon)]/50 hover:text-[var(--coral-neon)] transition-colors">
              + Agendar Nova Sessão
            </button>
          </div>
        </div>

        {/* Past Sessions */}
        <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--graphite)]">Sessões Anteriores</h2>
            <MessageCircle className="w-5 h-5 text-[var(--graphite)]/40" />
          </div>
          <div className="space-y-4">
            {pastSessions.map((session, index) => (
              <div key={index} className="border border-gray-200/50 dark:border-[var(--border)] rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--graphite)] mb-1">{session.topic}</h3>
                    <div className="text-sm text-[var(--graphite)]/60 mb-2">
                      {new Date(session.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: session.rating ?? 0 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[var(--salmon-neon)] fill-[var(--salmon-neon)]" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[var(--graphite)]/80 bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)] p-3 rounded-lg italic">
                  "{session.notes}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm border border-gray-200/50 dark:border-[var(--border)] rounded-xl p-6 hover:border-[var(--coral-neon)]/40 hover:shadow-md transition-all text-left">
          <MessageCircle className="w-8 h-8 text-[var(--coral-neon)] mb-3" />
          <h3 className="font-semibold text-[var(--graphite)] mb-1">Enviar Mensagem</h3>
          <p className="text-sm text-[var(--graphite)]/70">
            Faça perguntas entre as sessões
          </p>
        </button>

        <button className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm border border-gray-200/50 dark:border-[var(--border)] rounded-xl p-6 hover:border-[var(--coral-neon)]/40 hover:shadow-md transition-all text-left">
          <Calendar className="w-8 h-8 text-[var(--salmon-neon)] mb-3" />
          <h3 className="font-semibold text-[var(--graphite)] mb-1">Ver Calendário</h3>
          <p className="text-sm text-[var(--graphite)]/70">
            Confira disponibilidade
          </p>
        </button>

        <button className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm border border-gray-200/50 dark:border-[var(--border)] rounded-xl p-6 hover:border-[var(--coral-neon)]/40 hover:shadow-md transition-all text-left">
          <Star className="w-8 h-8 text-[var(--salmon-neon)] mb-3" />
          <h3 className="font-semibold text-[var(--graphite)] mb-1">Avaliar Mentor</h3>
          <p className="text-sm text-[var(--graphite)]/70">
            Compartilhe sua experiência
          </p>
        </button>
      </div>
    </div>
  );
}
