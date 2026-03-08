import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password) {
      setError('Por favor, insira a senha.');
      return;
    }

    const success = await login(password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Senha incorreta. Tente "admin123".');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      <Card className="w-full max-w-md border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-2 text-center pb-8 pt-10">
          <div className="mx-auto bg-zinc-950 border border-zinc-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-inner">
            <Lock className="w-7 h-7 text-amber-500" />
          </div>
          <CardTitle className="text-3xl font-serif font-medium tracking-tight text-zinc-50">Acesso Restrito</CardTitle>
          <CardDescription className="text-zinc-400 text-base font-light">
            Área exclusiva para administradores.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300 tracking-wide uppercase">
                Senha de Acesso
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 text-lg bg-zinc-950/50"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="px-8 pb-10 pt-4">
            <Button type="submit" className="w-full h-14 text-base font-medium tracking-wide bg-zinc-50 text-zinc-950 hover:bg-zinc-200" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Autenticando...</>
              ) : (
                'Entrar no Painel'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
