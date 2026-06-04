import { User, Bell, Lock, Globe, Palette, Mail, Smartphone, Shield } from 'lucide-react';

export function Configuracoes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--graphite)] mb-2">Configurações</h1>
        <p className="text-[var(--graphite)]/70">
          Personalize sua experiência e gerencie suas preferências
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[var(--coral-neon)]/10 dark:bg-[var(--coral-neon)]/20 rounded-lg">
                <User className="w-5 h-5 text-[var(--coral-neon)]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--graphite)]">Perfil</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[var(--skin-tone-dark)] rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-[var(--graphite)]" />
                </div>
                <div className="flex-1">
                  <button className="px-4 py-2 bg-[var(--coral-neon)] text-white rounded-lg font-medium hover:bg-[var(--coral-neon-dark)] transition-colors shadow-sm">
                    Alterar Foto
                  </button>
                  <p className="text-xs text-[var(--graphite)]/60 mt-2">JPG, PNG ou GIF (máx. 2MB)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--graphite)] mb-2">Nome</label>
                  <input
                    type="text"
                    defaultValue="Empreendedor"
                    className="w-full px-4 py-2.5 bg-[var(--input-background)] dark:bg-[var(--skin-tone)] border border-gray-300 dark:border-[var(--border)] rounded-lg text-[var(--graphite)] focus:outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--graphite)] mb-2">Sobrenome</label>
                  <input
                    type="text"
                    defaultValue="Silva"
                    className="w-full px-4 py-2.5 bg-[var(--input-background)] dark:bg-[var(--skin-tone)] border border-gray-300 dark:border-[var(--border)] rounded-lg text-[var(--graphite)] focus:outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--graphite)] mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="empreendedor@exemplo.com"
                  className="w-full px-4 py-2.5 bg-[var(--input-background)] dark:bg-[var(--skin-tone)] border border-gray-300 dark:border-[var(--border)] rounded-lg text-[var(--graphite)] focus:outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--graphite)] mb-2">Telefone</label>
                <input
                  type="tel"
                  defaultValue="+55 (11) 98765-4321"
                  className="w-full px-4 py-2.5 bg-[var(--input-background)] dark:bg-[var(--skin-tone)] border border-gray-300 dark:border-[var(--border)] rounded-lg text-[var(--graphite)] focus:outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--graphite)] mb-2">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Empreendedor em busca de conhecimento e crescimento profissional."
                  className="w-full px-4 py-2.5 bg-[var(--input-background)] dark:bg-[var(--skin-tone)] border border-gray-300 dark:border-[var(--border)] rounded-lg text-[var(--graphite)] focus:outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/50 transition-all resize-none"
                ></textarea>
              </div>

              <button className="px-6 py-2.5 bg-[var(--coral-neon)] text-white rounded-lg font-medium hover:bg-[var(--coral-neon-dark)] transition-colors shadow-sm">
                Salvar Alterações
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[var(--salmon-neon)]/10 dark:bg-[var(--salmon-neon)]/20 rounded-lg">
                <Bell className="w-5 h-5 text-[var(--salmon-neon)]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--graphite)]">Notificações</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Novas mensagens de mentoria', icon: Mail, checked: true },
                { label: 'Lembretes de sessões agendadas', icon: Bell, checked: true },
                { label: 'Atualizações da comunidade', icon: Globe, checked: false },
                { label: 'Notificações push no celular', icon: Smartphone, checked: true },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <label key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[var(--graphite)]/60" />
                      <span className="text-[var(--graphite)] font-medium">{item.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="w-5 h-5 accent-[var(--coral-neon)] cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[var(--coral-neon)]/10 dark:bg-[var(--coral-neon)]/20 rounded-lg">
                <Shield className="w-5 h-5 text-[var(--coral-neon)]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--graphite)]">Privacidade e Segurança</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[var(--graphite)]/60" />
                  <span className="text-[var(--graphite)] font-medium">Alterar senha</span>
                </div>
                <span className="text-[var(--graphite)]/40">›</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[var(--graphite)]/60" />
                  <span className="text-[var(--graphite)] font-medium">Autenticação de dois fatores</span>
                </div>
                <span className="text-xs bg-[var(--coral-neon)]/10 dark:bg-[var(--coral-neon)]/20 text-[var(--coral-neon)] px-3 py-1 rounded-full font-medium">
                  Recomendado
                </span>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] transition-colors text-left">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[var(--graphite)]/60" />
                  <span className="text-[var(--graphite)] font-medium">Privacidade do perfil</span>
                </div>
                <span className="text-[var(--graphite)]/40">›</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--salmon-neon)]/10 dark:bg-[var(--salmon-neon)]/20 rounded-lg">
                <Palette className="w-5 h-5 text-[var(--salmon-neon)]" />
              </div>
              <h3 className="font-bold text-[var(--graphite)]">Aparência</h3>
            </div>
            <p className="text-sm text-[var(--graphite)]/70 mb-4">
              Use o botão de tema no canto inferior direito para alternar entre modo claro e escuro.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--coral-neon)] to-[var(--salmon-neon)] rounded-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--salmon-neon)] to-[var(--skin-tone-dark)] rounded-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--skin-tone-light)] to-[var(--skin-tone)] rounded-lg"></div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--coral-neon)]/10 dark:bg-[var(--coral-neon)]/20 rounded-lg">
                <Globe className="w-5 h-5 text-[var(--coral-neon)]" />
              </div>
              <h3 className="font-bold text-[var(--graphite)]">Idioma</h3>
            </div>
            <select className="w-full px-4 py-2.5 bg-[var(--input-background)] dark:bg-[var(--skin-tone)] border border-gray-300 dark:border-[var(--border)] rounded-lg text-[var(--graphite)] focus:outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/50 transition-all">
              <option>Português (Brasil)</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>

          {/* Help & Support */}
          <div className="bg-gradient-to-br from-[var(--skin-tone-light)] to-[var(--skin-tone)] dark:from-[var(--skin-tone)] dark:to-[var(--skin-tone-dark)] rounded-xl p-6 border border-[var(--skin-tone-dark)]/30 shadow-md">
            <h3 className="font-bold text-[var(--graphite)] mb-3">Precisa de Ajuda?</h3>
            <p className="text-sm text-[var(--graphite)]/70 mb-4">
              Nossa equipe está pronta para ajudar você com qualquer dúvida.
            </p>
            <button className="w-full px-4 py-2.5 bg-white dark:bg-[var(--card)] text-[var(--coral-neon)] rounded-lg font-medium hover:bg-[var(--coral-neon)] hover:text-white transition-all border border-[var(--coral-neon)]/30 shadow-sm">
              Falar com Suporte
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 border border-red-200/50 dark:border-red-900/30 shadow-sm">
            <h3 className="font-bold text-red-600 dark:text-red-500 mb-3">Zona de Perigo</h3>
            <button className="w-full px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-900/50">
              Desativar Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
