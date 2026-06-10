import { useState } from 'react';
import { Sparkles, Mail, CheckCircle2, Rocket, Clock, ArrowRight, Lock } from 'lucide-react';

interface UnderDevelopmentProps {
  title: string;
  description: string;
  featureKey: 'mentoria' | 'comunidade';
  releaseEstimate?: string;
}

export function UnderDevelopment({
  title,
  description,
  featureKey,
  releaseEstimate = 'Lançamento em breve'
}: UnderDevelopmentProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    // Simulate API registration
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const getFeatureIcon = () => {
    switch (featureKey) {
      case 'mentoria':
        return (
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            {/* Pulsating background glow */}
            <div className="absolute inset-0 bg-[var(--coral-neon)]/20 rounded-full blur-md animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-tr from-[var(--coral-neon)] to-[var(--salmon-neon)] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-4xl">🤝</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 text-xs px-2.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1 border border-white dark:border-slate-800">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Mentores</span>
            </div>
          </div>
        );
      case 'comunidade':
        return (
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            {/* Pulsating background glow */}
            <div className="absolute inset-0 bg-[var(--salmon-neon)]/20 rounded-full blur-md animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-tr from-[var(--salmon-neon)] to-[var(--skin-tone-dark)] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-4xl">💬</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-400 text-slate-900 text-xs px-2.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1 border border-white dark:border-slate-800">
              <Rocket className="w-3.5 h-3.5" />
              <span>Conexão</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* CSS Styles for floats and glows */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1.5deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
        .animate-float {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow-pulse 8s ease-in-out infinite;
        }
      `}</style>

      {/* Background Neon Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-[var(--coral-neon)] to-[var(--salmon-neon)] rounded-full blur-[100px] pointer-events-none animate-glow"></div>

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-2xl bg-white/70 dark:bg-[var(--card)]/60 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-gray-200/80 dark:hover:border-white/20 animate-float text-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)] text-[var(--coral-neon-dark)] font-semibold text-xs uppercase tracking-wider mb-6 border border-[var(--coral-neon)]/20">
          <Clock className="w-3.5 h-3.5" />
          <span>Em Desenvolvimento</span>
        </div>

        {/* Floating Icon */}
        {getFeatureIcon()}

        {/* Typography */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--graphite)] tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-base md:text-lg text-[var(--graphite)]/75 max-w-lg mx-auto leading-relaxed mb-8">
          {description}
        </p>

        {/* Feature Roadmap Step Tracker */}
        <div className="bg-gray-100/50 dark:bg-white/5 border border-gray-200/30 dark:border-white/5 rounded-xl p-5 mb-8 text-left max-w-xl mx-auto">
          <h3 className="text-xs font-bold text-[var(--graphite)]/50 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Roadmap do Lançamento
          </h3>
          <div className="grid grid-cols-4 gap-2 relative">
            {/* Step lines */}
            <div className="absolute top-3 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 dark:bg-gray-700 z-0">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-[var(--coral-neon)] to-gray-200 dark:to-gray-700 w-[66%]"></div>
            </div>

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-6.5 h-6.5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                ✓
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--graphite)]/90 mt-2">Ideação</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-6.5 h-6.5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                ✓
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--graphite)]/90 mt-2">Design UI</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-6.5 h-6.5 rounded-full bg-[var(--coral-neon)] text-white flex items-center justify-center font-bold text-xs shadow-md animate-pulse">
                •
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--coral-neon)] font-bold mt-2">Codificação</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-6.5 h-6.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--graphite)]/40 mt-2">Release</span>
            </div>
          </div>
        </div>

        {/* Estimate Footer */}
        <div className="text-sm text-[var(--graphite)]/60 font-medium mb-8">
          Previsão: <span className="text-[var(--coral-neon)] font-semibold">{releaseEstimate}</span>
        </div>

        {/* Email Capture / Action */}
        <div className="max-w-md mx-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--graphite)]/40" />
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-[var(--card)]/90 border border-gray-300 dark:border-white/10 rounded-xl text-[var(--graphite)] placeholder-[var(--graphite)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/50 focus:border-[var(--coral-neon)] transition-all text-sm"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-[var(--coral-neon)] to-[var(--salmon-neon)] text-white font-semibold rounded-xl hover:from-[var(--coral-neon-dark)] hover:to-[var(--coral-neon)] focus:outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/50 shadow-md transition-all active:scale-98 disabled:opacity-70 flex items-center justify-center gap-1.5 text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Quero ser avisado
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-left animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Lista de espera confirmada!</p>
                <p className="text-xs opacity-90">Avisaremos você em primeira mão assim que a novidade for liberada.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
