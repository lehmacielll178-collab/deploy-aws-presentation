import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Scissors, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export function LoginAdminPage() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async () => {
    const result = await login(email, password)
    if (result) navigate('/admin')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4"
      style={{
        backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(201,168,76,0.05) 0%, transparent 60%)',
      }}
    >
      <div className="w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mb-4">
            <Scissors className="w-6 h-6 text-gold" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl text-cream mb-1">Barber Shop</h1>
          <div className="flex items-center gap-1.5 text-gold/60 text-xs font-mono">
            <ShieldCheck className="w-3 h-3" />
            Acesso Administrativo
          </div>
        </div>

        {/* Form */}
        <div className="bg-ink-900 border border-ink-700 rounded-lg p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-ink-400">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKey}
              placeholder="admin@barbearia.com"
              className="bg-ink-800 border-ink-600 text-cream placeholder:text-ink-500 focus:ring-gold"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-ink-400">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                placeholder="••••••••"
                className="bg-ink-800 border-ink-600 text-cream placeholder:text-ink-500 focus:ring-gold pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/50 border border-red-900 rounded px-3 py-2">
              {error}
            </p>
          )}

          <Button
            variant="gold"
            className="w-full mt-2"
            onClick={handleSubmit}
            disabled={loading || !email || !password}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>

        <p className="text-center text-xs text-ink-600 mt-6 font-mono">
          Acesso restrito · Barber Shop Admin
        </p>
      </div>
    </div>
  )
}
