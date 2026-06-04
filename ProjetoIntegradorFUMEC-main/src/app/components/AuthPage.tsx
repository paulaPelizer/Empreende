import { useState, type FormEvent } from 'react';
import { Loader2, Lock, Mail, Sparkles } from 'lucide-react';
import { authService, type User } from '../../services/authService';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register';

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isRegister = mode === 'register';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Informe o e-mail de usuário e a senha para continuar.');
      return;
    }

    try {
      setLoading(true);
      const response = isRegister
        ? await authService.register({
            email: email.trim(),
            password,
            password_confirmation: password,
          })
        : await authService.login({ email: email.trim(), password });

      onAuthSuccess(response.user);
    } catch {
      setError('Não foi possível concluir o acesso. Verifique se o backend está rodando em http://localhost:8080/api.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--skin-tone-light)] text-[var(--graphite)] border border-[var(--skin-tone-dark)]/30">
            <Sparkles className="w-4 h-4 text-[var(--coral-neon)]" />
            <span className="text-sm font-medium">Plataforma Empreende+</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--graphite)] leading-tight">
              Aprenda, pratique e acompanhe sua jornada empreendedora.
            </h1>
            <p className="text-lg text-[var(--graphite)]/70 max-w-xl">
              Acesse os módulos de formação, visualize vídeos, consulte materiais em PDF e registre suas atividades práticas em um só lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Vídeo-aulas', 'Atividades', 'PDFs de apoio'].map((item) => (
              <div key={item} className="bg-white/90 dark:bg-[var(--card)] rounded-2xl p-4 border border-gray-200/60 dark:border-[var(--border)] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[var(--coral-neon)]/10 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-[var(--coral-neon)]" />
                </div>
                <p className="font-semibold text-[var(--graphite)]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/95 dark:bg-[var(--card)] rounded-3xl p-6 md:p-8 border border-gray-200/70 dark:border-[var(--border)] shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[var(--coral-neon)] rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--graphite)]">
                {isRegister ? 'Cadastro de usuário' : 'Login'}
              </h2>
              <p className="text-sm text-[var(--graphite)]/60">
                {isRegister ? 'Crie seu acesso com e-mail e senha.' : 'Entre com seu e-mail de usuário e senha.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)] rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-xl py-2.5 transition-all ${mode === 'login' ? 'bg-white dark:bg-[var(--card)] text-[var(--coral-neon)] shadow-sm' : 'text-[var(--graphite)]/70'}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-xl py-2.5 transition-all ${mode === 'register' ? 'bg-white dark:bg-[var(--card)] text-[var(--coral-neon)] shadow-sm' : 'text-[var(--graphite)]/70'}`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[var(--graphite)] mb-2">
                E-mail / usuário
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--graphite)]/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="usuario@email.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--skin-tone-light)]/60 dark:bg-[var(--skin-tone)] border border-[var(--skin-tone-dark)]/40 text-[var(--graphite)] outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/40"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[var(--graphite)] mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--graphite)]/40" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--skin-tone-light)]/60 dark:bg-[var(--skin-tone)] border border-[var(--skin-tone-dark)]/40 text-[var(--graphite)] outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/40"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 text-red-700 border border-red-200 p-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[var(--coral-neon)] text-white font-semibold shadow-md hover:bg-[var(--coral-neon-dark)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isRegister ? 'Criar cadastro' : 'Entrar na plataforma'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
