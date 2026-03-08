import { Outlet, Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { Button } from '@/src/components/ui/button';

export default function Layout() {
  const { isLogged, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500/30">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-amber-500 transition-transform group-hover:scale-105">
              <Scissors className="h-5 w-5" />
            </div>
            <span className="text-2xl font-serif font-semibold tracking-wide text-zinc-50">Barber<span className="text-amber-500 italic">Shop</span></span>
          </Link>
          
          <nav className="flex items-center gap-4">
            {isLogged ? (
              <>
                <Link to="/admin">
                  <Button variant="ghost" className="text-zinc-300 hover:text-white">Painel</Button>
                </Link>
                <Button variant="outline" onClick={logout} className="border-zinc-800">Sair</Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="text-zinc-400 hover:text-white text-sm tracking-wide uppercase">Admin</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
