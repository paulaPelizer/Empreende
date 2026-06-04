import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Jornada } from './components/Jornada';
import { Mentoria } from './components/Mentoria';
import { Comunidade } from './components/Comunidade';
import { Certificados } from './components/Certificados';
import { Configuracoes } from './components/Configuracoes';
import { AuthPage } from './components/AuthPage';
import { ModuloPage } from './components/ModuloPage';
import { authService, type User } from '../services/authService';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      localStorage.removeItem('empreende_token');
      localStorage.removeItem('empreende_user');
    } finally {
      setUser(null);
      setActiveTab('dashboard');
    }
  };

  const handleOpenModule = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setActiveTab('modulo');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'jornada':
        return <Jornada onOpenModule={handleOpenModule} />;
      case 'modulo':
        return <ModuloPage moduleId={selectedModuleId} onBack={() => setActiveTab('jornada')} />;
      case 'mentoria':
        return <Mentoria />;
      case 'comunidade':
        return <Comunidade />;
      case 'certificados':
        return <Certificados />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard />;
    }
  };

  const themeButton = (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-4 bg-[var(--coral-neon)] text-white rounded-full shadow-lg hover:bg-[var(--coral-neon-dark)] transition-all hover:scale-110"
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  );

  if (!user || !authService.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
        {themeButton}
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      {themeButton}

      <Header
        onMenuClick={() => setSidebarOpen(true)}
        showMenu={true}
        onLogout={handleLogout}
        userEmail={user.email}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
