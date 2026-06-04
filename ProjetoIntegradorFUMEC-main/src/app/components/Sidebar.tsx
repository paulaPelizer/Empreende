import { Award, BookOpen, Home, MessageSquare, PlaySquare, Settings, Users, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'jornada', label: 'Minha Jornada', icon: BookOpen },
  { id: 'modulo', label: 'Módulo Prático', icon: PlaySquare },
  { id: 'mentoria', label: 'Mentoria', icon: Users },
  { id: 'comunidade', label: 'Comunidade', icon: MessageSquare },
  { id: 'certificados', label: 'Certificados', icon: Award },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[var(--graphite-transparent)] z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white/98 dark:bg-[var(--sidebar)] backdrop-blur-md border-r border-gray-200/50 dark:border-[var(--sidebar-border)]
          transform transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-4">
            <button onClick={onClose} className="p-2 rounded-md hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] transition-colors">
              <X className="w-6 h-6 text-[var(--graphite)]" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--coral-neon)] text-white font-medium shadow-md'
                      : 'text-[var(--graphite)] hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)]'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Progress Summary */}
          <div className="p-4 border-t border-gray-200/50 dark:border-[var(--sidebar-border)]">
            <div className="bg-gradient-to-br from-[var(--skin-tone-light)] to-[var(--skin-tone)] dark:from-[var(--skin-tone)] dark:to-[var(--skin-tone-dark)] rounded-xl p-4 border border-[var(--skin-tone-dark)]/20">
              <div className="text-sm text-[var(--graphite)]/70 mb-2">Progresso Geral</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-[var(--coral-neon)]">45%</div>
                <div className="text-sm text-[var(--graphite)]/60 mb-1">completo</div>
              </div>
              <div className="mt-3 h-2 bg-white/80 dark:bg-[var(--card)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--coral-neon)] w-[45%] shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
