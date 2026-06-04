import { ClipboardList, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { jornadaService, type ActivityResponse } from '../../services/jornadaService';

function formatKey(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) return 'sem data';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function Respostas() {
  const [responses, setResponses] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    jornadaService
      .getResponses()
      .then(setResponses)
      .catch(() => setError('Não foi possível carregar suas respostas agora.'))
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
      <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-7 h-7 text-[var(--coral-neon)]" />
          <h1 className="text-2xl font-bold text-[var(--graphite)]">Minhas Respostas</h1>
        </div>
        <p className="text-[var(--graphite)]/70">
          Aqui aparecem as respostas salvas e enviadas nas atividades dos módulos. Esses registros vêm da tabela <strong>module_activity_responses</strong> do PostgreSQL.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-yellow-50 text-yellow-800 border border-yellow-200 p-4">
          {error}
        </div>
      )}

      {!responses.length && !error && (
        <div className="bg-white/95 dark:bg-[var(--card)] rounded-xl p-8 border border-gray-200/50 dark:border-[var(--border)] text-center">
          <h2 className="text-xl font-bold text-[var(--graphite)] mb-2">Nenhuma resposta registrada ainda</h2>
          <p className="text-[var(--graphite)]/70">Entre em um módulo, salve um rascunho ou envie uma atividade para que ela apareça aqui.</p>
        </div>
      )}

      <div className="space-y-4">
        {responses.map((response) => (
          <div key={response.id} className="bg-white/95 dark:bg-[var(--card)] rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-4">
              <div>
                <div className="text-xs text-[var(--coral-neon)] font-semibold mb-1">Módulo {response.moduleOrder}</div>
                <h2 className="text-xl font-bold text-[var(--graphite)]">{response.moduleTitle}</h2>
                <p className="text-sm text-[var(--graphite)]/60">{response.stepLabel} · {response.submitted ? 'Enviada' : 'Rascunho'}</p>
              </div>
              <div className="text-sm text-[var(--graphite)]/60">
                Atualizada em {formatDate(response.updatedAt)}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-[var(--graphite)]">Respostas</h3>
                {Object.entries(response.formValues ?? {}).length ? (
                  Object.entries(response.formValues).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-xl bg-[var(--skin-tone-light)]/50 dark:bg-[var(--skin-tone)] border border-[var(--skin-tone-dark)]/20">
                      <div className="text-xs font-semibold text-[var(--graphite)]/60 mb-1">{formatKey(key)}</div>
                      <p className="text-sm text-[var(--graphite)] whitespace-pre-wrap">{value || '—'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--graphite)]/60">Sem campos preenchidos.</p>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-[var(--graphite)]">Checklist marcado</h3>
                {Object.entries(response.checks ?? {}).length ? (
                  Object.entries(response.checks).map(([item, checked]) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-[var(--graphite)]/80">
                      <span className={checked ? 'text-[var(--coral-neon)]' : 'text-[var(--graphite)]/40'}>{checked ? '✓' : '○'}</span>
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--graphite)]/60">Nenhum critério marcado.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
