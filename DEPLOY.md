# Guia de Implantação — Assistente de IA Gowagency

## Pré-requisitos

- Node.js 18 ou superior
- Projeto Next.js existente (App Router)
- PostgreSQL rodando
- Conta na Anthropic: https://console.anthropic.com

---

## PASSO 1 — Gerar a API Key do Claude

1. Acesse https://console.anthropic.com/settings/keys
2. Clique em **Create Key**
3. Copie a chave (começa com `sk-ant-...`)
4. Guarde em local seguro — ela não aparece novamente

---

## PASSO 2 — Instalar dependências no seu Next.js

No terminal, dentro do seu projeto Next.js:

```bash
npm install @anthropic-ai/sdk pg
npm install -D @types/pg
```

---

## PASSO 3 — Configurar variáveis de ambiente

Crie ou edite o arquivo `.env.local` na raiz do seu Next.js:

```
ANTHROPIC_API_KEY=sk-ant-SUA_CHAVE_AQUI
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```

> ATENÇÃO: Nunca commite o arquivo .env.local no Git.
> Adicione-o ao .gitignore se ainda não estiver lá.

---

## PASSO 4 — Copiar os arquivos de integração

Copie os seguintes arquivos do repositório para o seu projeto Next.js:

### 4.1 — Conexão com o banco de dados

Origem:  nextjs-integration/lib/db.ts
Destino: lib/db.ts (na raiz do seu Next.js)

Conteúdo:
```typescript
import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const db =
  globalForPg.pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = db;
}
```

### 4.2 — Rota da API (backend)

Origem:  nextjs-integration/app/api/assistant/route.ts
Destino: app/api/assistant/route.ts

Crie as pastas necessárias:
```bash
mkdir -p app/api/assistant
```

Depois copie o arquivo route.ts do repositório para esse caminho.

### 4.3 — Hook do React (gerencia o chat no frontend)

Origem:  nextjs-integration/hooks/useAssistant.ts
Destino: hooks/useAssistant.ts

```bash
mkdir -p hooks
```

### 4.4 — Componente do chat (botão flutuante)

Origem:  nextjs-integration/components/AiAssistant.tsx
Destino: components/AiAssistant.tsx

```bash
mkdir -p components
```

---

## PASSO 5 — Adaptar as queries SQL ao seu banco

Abra o arquivo `app/api/assistant/route.ts` e localize o bloco
de queries (por volta da linha 30). Adapte os nomes das tabelas
e colunas para os que existem no seu banco de dados.

O código espera esta estrutura:

```sql
-- Tabela de clientes
clients (
  id        integer ou uuid,
  name      text,
  email     text,
  status    text,       -- ex: 'ativo', 'inativo'
  user_id   integer     -- chave estrangeira do usuário logado
)

-- Tabela de tarefas
tasks (
  id          integer ou uuid,
  title       text,
  status      text,     -- ex: 'a fazer', 'em andamento', 'concluído'
  due_date    date,
  client_id   integer,  -- chave estrangeira para clients
  user_id     integer
)

-- Tabela de pagamentos/recebimentos
payments (
  id          integer ou uuid,
  amount      numeric,
  status      text,     -- ex: 'pago', 'pendente', 'atrasado'
  due_date    date,
  client_id   integer,
  user_id     integer
)
```

Se suas tabelas tiverem nomes diferentes, altere as queries.
Exemplo — se sua tabela se chama "clientes" em vez de "clients":

```typescript
// Antes:
db.query(`SELECT id, name, email, status FROM clients WHERE user_id = $1`, [userId])

// Depois:
db.query(`SELECT id, nome AS name, email, status FROM clientes WHERE usuario_id = $1`, [userId])
```

---

## PASSO 6 — Configurar o usuário logado

No arquivo `app/api/assistant/route.ts`, localize esta linha:

```typescript
const userId = 1; // substitua pelo id real do usuário logado
```

Substitua pelo sistema de autenticação que você usa.

Exemplo com NextAuth:
```typescript
import { getServerSession } from "next-auth";
const session = await getServerSession();
if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
const userId = session.user.id;
```

Exemplo com JWT próprio:
```typescript
import { verifyToken } from "@/lib/auth";
const token = req.headers.get("authorization")?.split(" ")[1];
const payload = verifyToken(token);
const userId = payload.userId;
```

---

## PASSO 7 — Adicionar o componente no layout

Abra o arquivo `app/layout.tsx` do seu Next.js e adicione o componente:

```typescript
import { AiAssistant } from "@/components/AiAssistant";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <AiAssistant />
      </body>
    </html>
  );
}
```

Isso faz o botão do assistente aparecer em TODAS as páginas do sistema.
Se quiser apenas em páginas específicas, adicione somente naquelas páginas.

---

## PASSO 8 — Testar localmente

```bash
npm run dev
```

Abra http://localhost:3000 e clique no botão azul no canto inferior direito.

Perguntas para testar:
- "Tenho algum pagamento em atraso?"
- "Quais tarefas vencem essa semana?"
- "Me dê um resumo dos meus clientes"
- "O que preciso fazer hoje?"

---

## PASSO 9 — Fazer deploy em produção

### Vercel (recomendado para Next.js)

1. Acesse https://vercel.com e conecte seu repositório
2. Vá em **Settings > Environment Variables** e adicione:
   - `ANTHROPIC_API_KEY` = sua chave do Claude
   - `DATABASE_URL` = URL do seu banco em produção
3. Clique em **Deploy**

### Outras plataformas (Railway, Render, VPS)

Garanta que as variáveis de ambiente estejam configuradas:
```bash
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
```

E execute:
```bash
npm run build
npm start
```

---

## PASSO 10 — Personalizar o assistente (opcional)

No arquivo `app/api/assistant/route.ts`, localize a função
`buildSystemPrompt` no final do arquivo.

Edite as primeiras linhas para personalizar a personalidade:

```typescript
const lines = [
  "Você é o assistente de IA da NOME_DA_SUA_EMPRESA.",  // ← mude aqui
  "Responda de forma direta e em português.",
  // Adicione regras específicas do seu negócio:
  "Quando houver pagamentos atrasados, sempre sugira entrar em contato com o cliente.",
  "Priorize sempre tarefas com prazo próximo.",
  ...
```

---

## Estrutura final de arquivos

Após a implantação, seu projeto terá estes arquivos novos:

```
seu-projeto-nextjs/
├── .env.local                        ← suas chaves (não commitar)
├── lib/
│   └── db.ts                         ← conexão PostgreSQL
├── app/
│   └── api/
│       └── assistant/
│           └── route.ts              ← API do assistente
├── hooks/
│   └── useAssistant.ts               ← hook de estado do chat
└── components/
    └── AiAssistant.tsx               ← componente do botão/chat
```

---

## Solução de problemas

**Erro: "ANTHROPIC_API_KEY não definida"**
→ Verifique se o .env.local existe e tem a chave correta.
→ Reinicie o servidor após criar/editar o .env.local.

**Erro: "Connection refused" no banco**
→ Verifique se o DATABASE_URL está correto.
→ Confirme que o PostgreSQL está rodando.

**Chat não aparece na tela**
→ Verifique se o <AiAssistant /> foi adicionado no layout.tsx.
→ Abra o console do browser (F12) e veja se há erros.

**Respostas com dados errados**
→ As queries SQL podem estar com nomes de tabelas diferentes.
→ Verifique o passo 5 e adapte conforme seu banco.

---

## Suporte

Repositório: https://github.com/gowagency/Gowagency
Branch:      claude/create-ai-api-integration-qGJh7
