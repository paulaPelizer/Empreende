import { UnderDevelopment } from './common/UnderDevelopment';

export function Mentoria() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--graphite)] mb-2">Mentoria</h1>
        <p className="text-[var(--graphite)]/70">
          Agende e acompanhe suas sessões com mentores especializados
        </p>
      </div>

      {/* Under Development Feedback */}
      <UnderDevelopment
        title="Mentoria Coletiva e Individual"
        description="Estamos conectando profissionais e especialistas do mercado para oferecer mentorias personalizadas e alavancar a sua jornada empreendedora."
        featureKey="mentoria"
        releaseEstimate="3º Trimestre de 2026"
      />
    </div>
  );
}
