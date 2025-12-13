import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { MainLayout } from './components/MainLayout';
import { Toaster } from 'sonner@2.0.3';

type Screen = 'splash' | 'onboarding' | 'login' | 'register' | 'main';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [currentUser, setCurrentUser] = useState<{ username: string; fullName: string } | null>(null);

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setCurrentScreen('onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setCurrentUser({ username: 'admin', fullName: 'Admin User' });
      setCurrentScreen('main');
      return true;
    }
    return false;
  };

  const handleRegister = (data: { fullName: string; email: string; password: string }) => {
    // Simulate registration
    setCurrentUser({ username: data.email.split('@')[0], fullName: data.fullName });
    setCurrentScreen('main');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('onboarding');
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      
      {currentScreen === 'splash' && <SplashScreen />}
      
      {currentScreen === 'onboarding' && (
        <OnboardingScreen
          onLogin={() => setCurrentScreen('login')}
          onSignUp={() => setCurrentScreen('register')}
        />
      )}
      
      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          onBack={() => setCurrentScreen('onboarding')}
          onGoToRegister={() => setCurrentScreen('register')}
        />
      )}
      
      {currentScreen === 'register' && (
        <RegisterScreen
          onRegister={handleRegister}
          onBack={() => setCurrentScreen('onboarding')}
          onGoToLogin={() => setCurrentScreen('login')}
        />
      )}
      
      {currentScreen === 'main' && currentUser && (
        <MainLayout user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}
