import { Bell, LogOut, Menu, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
  onLogout?: () => void;
  userEmail?: string;
}

export function Header({ onMenuClick, showMenu = true, onLogout, userEmail }: HeaderProps) {
  return (
    <header className="bg-white/95 dark:bg-[var(--card)] backdrop-blur-sm border-b border-gray-200/50 dark:border-[var(--border)] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {showMenu && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md text-[var(--graphite)] hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[var(--coral-neon)] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-[var(--graphite)]">
                Empreende<span className="text-[var(--coral-neon)]">+</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] transition-colors relative">
              <Bell className="w-5 h-5 text-[var(--graphite)]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--coral-neon)] rounded-full shadow-sm"></span>
            </button>
            <div className="hidden sm:flex items-center gap-2 cursor-pointer hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] rounded-full px-3 py-1.5 transition-colors max-w-xs">
              <div className="w-8 h-8 bg-[var(--skin-tone-dark)] rounded-full flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[var(--graphite)]" />
              </div>
              <span className="text-sm font-medium text-[var(--graphite)] truncate">
                {userEmail ?? 'Meu Perfil'}
              </span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-[var(--skin-tone-light)] dark:hover:bg-[var(--skin-tone)] transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5 text-[var(--graphite)]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
