import { Scissors, LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminHeaderProps {
  onLogout: () => void
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b border-ink-800 bg-ink sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold/20 rounded flex items-center justify-center">
            <Scissors className="w-4 h-4 text-gold" strokeWidth={1.5} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold tracking-tight text-cream">
              Barber Shop
            </span>
            <span className="text-gold/60 text-xs font-mono uppercase tracking-widest">
              — Painel Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-gold/70">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">Administrador</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}
            className="text-cream/60 hover:text-cream hover:bg-ink-800">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
