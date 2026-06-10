import { UnderDevelopment } from './common/UnderDevelopment';

export function Comunidade() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--graphite)] mb-2">Comunidade</h1>
        <p className="text-[var(--graphite)]/70">
          Conecte-se com outros empreendedores, compartilhe experiências e aprenda junto
        </p>
      </div>

      {/* Under Development Feedback */}
      <UnderDevelopment
        title="Fórum e Comunidade Empreende+"
        description="Um espaço interativo para debater ideias de negócios, encontrar parceiros, receber feedbacks construtivos e compartilhar a sua evolução."
        featureKey="comunidade"
        releaseEstimate="4º Trimestre de 2026"
      />
    </div>
  );
}
