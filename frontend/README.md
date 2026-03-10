# 💈 Barber Shop — Frontend

Interface web para o sistema de agendamentos da Barber Shop. Construída com **React**, **Vite**, **TypeScript**, **Tailwind CSS** e componentes **shadcn/ui**.

---

## Estrutura do projeto

```
src/
├── services/
│   └── api.ts              # Todas as chamadas HTTP à API (público + admin)
│
├── hooks/
│   ├── useWeekSchedule.ts  # Busca e navegação da agenda semanal
│   ├── useAuth.ts          # Login, logout, estado de autenticação
│   └── useAdminSchedule.ts # Ações do admin (criar, atualizar, deletar slots)
│
├── components/
│   ├── ui/                 # Componentes base (shadcn/ui): Button, Input, Label, Badge
│   ├── Header.tsx          # Cabeçalho da página pública
│   ├── AdminHeader.tsx     # Cabeçalho do painel admin
│   ├── SlotCard.tsx        # Card individual de horário
│   ├── DayColumn.tsx       # Coluna de um dia da semana
│   ├── WeekGrid.tsx        # Grade da semana (7 colunas)
│   ├── WeekNavigator.tsx   # Navegação entre semanas
│   ├── GenerateSlotsModal.tsx # Modal para criar slots em lote
│   └── ProtectedRoute.tsx  # Guard de rota para área admin
│
├── pages/
│   ├── HomePage.tsx        # Agenda pública da semana
│   ├── LoginAdminPage.tsx  # Login do administrador (/login-admin)
│   └── AdminPage.tsx       # Painel de gerenciamento (/admin)
│
├── lib/
│   └── utils.ts            # Utilitário cn() para classes Tailwind
│
├── App.tsx                 # Roteamento (React Router)
├── main.tsx                # Entry point
└── index.css               # Estilos globais + variáveis de tema
```

---

## Rotas

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Agenda pública da semana | Público |
| `/login-admin` | Login do administrador | Oculto — digitar manualmente |
| `/admin` | Painel de gerenciamento | Requer autenticação |

> A rota `/login-admin` não possui link visível na interface. O administrador deve digitar a URL diretamente no navegador.

---

## Configuração e execução

```bash
# 1. Instale as dependências
npm install

# 2. Configure a URL da API
cp .env.example .env
# Edite o VITE_API_URL se necessário

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Em desenvolvimento, o Vite faz proxy de `/api` → `http://localhost:80`, então basta ter a API rodando localmente.

### Build para produção

```bash
npm run build
# Arquivos gerados em /dist — sirva com qualquer servidor estático
```

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `/api` (proxy Vite) | URL base da API em produção |
