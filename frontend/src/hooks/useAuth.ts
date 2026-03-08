import { useState, useEffect } from 'react';

// Mock auth state
let isAuthenticated = false;

export const useAuth = () => {
  const [isLogged, setIsLogged] = useState(isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (password: string) => {
    setIsLoading(true);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (password === 'admin123') {
          isAuthenticated = true;
          setIsLogged(true);
          resolve(true);
        } else {
          resolve(false);
        }
        setIsLoading(false);
      }, 100);
    });
  };

  const logout = () => {
    isAuthenticated = false;
    setIsLogged(false);
  };

  return { isLogged, isLoading, login, logout };
};
