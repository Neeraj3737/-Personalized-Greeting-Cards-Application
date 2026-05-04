import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setUser({
      id: 'g_001',
      name: 'Alex Morgan',
      email: 'alex.morgan@gmail.com',
      avatar: null,
      provider: 'google',
      isPremium: false,
    });
    setIsLoading(false);
  }, []);

  const loginWithEmail = useCallback(async (email, password, name) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setUser({
      id: 'e_001',
      name: name || email.split('@')[0],
      email,
      avatar: null,
      provider: 'email',
      isPremium: false,
    });
    setIsLoading(false);
  }, []);

  const loginAsGuest = useCallback(async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setUser({
      id: 'guest_001',
      name: 'Guest User',
      email: null,
      avatar: null,
      provider: 'guest',
      isPremium: false,
    });
    setIsLoading(false);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const upgradeToPremium = useCallback(() => {
    setUser(prev => prev ? { ...prev, isPremium: true } : null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      loginWithGoogle,
      loginWithEmail,
      loginAsGuest,
      updateProfile,
      upgradeToPremium,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
