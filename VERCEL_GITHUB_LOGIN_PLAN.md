# Plano de Login com GitHub usando Vercel

Este documento define um plano de implementacao para adicionar login com GitHub ao `ArchPull` usando `Vercel Functions` como backend. O foco e ter um fluxo seguro, simples de operar e compativel com o formato atual do repositório, que hoje e um frontend `React + Vite`.

## Resumo executivo

Decisao recomendada:

- manter o frontend atual em `src/`
- adicionar backend serverless em `api/`
- hospedar tudo na Vercel
- usar `OAuth App` do GitHub
- usar sessao propria da aplicacao em `cookie HttpOnly`
- usar `Neon` como banco escolhido para persistencia da aplicacao
- usar `Drizzle ORM` como camada de acesso ao banco
- evitar banco no MVP estrito de autenticacao, mas preparar o desenho para conectar no Neon na fase 2

Resultado esperado do MVP:

- usuario consegue entrar com GitHub
- frontend descobre usuario autenticado via `/api/me`
- usuario consegue fazer logout
- base pronta para vincular progresso e ranking a uma identidade real

Escolha de banco para a fase de persistencia:

- `Neon`
- tipo de banco: `PostgreSQL serverless`
- papel no projeto: banco principal para usuarios, progresso, ranking e historico

Escolha de camada de dados:

- `Drizzle ORM`
- papel no projeto: schema, migrations e queries tipadas sobre o Postgres

## Por que esta abordagem

Para este projeto, ela e a combinacao mais equilibrada entre simplicidade e seguranca:

- o repositório continua unico
- nao exige servidor Express separado
- nao expõe `client_secret` no frontend
- encaixa bem em um backend pequeno de auth
- pode evoluir depois para persistencia por usuario

## Arquitetura alvo

```text
/
  api/
    auth/
      github.ts
      github-callback.ts
      logout.ts
    me.ts
  server/
    auth/
      beginGithubLogin.ts
      finishGithubLogin.ts
      getCurrentUser.ts
      logoutUser.ts
    db/
      schema.ts
    lib/
      cookies.ts
      github.ts
      session.ts
      db.ts
  drizzle.config.ts
  src/
  package.json
  vercel.json
```

### Responsabilidade de cada parte

- `api/auth/github.ts`
  Inicia o fluxo OAuth e redireciona o usuario para o GitHub.

- `api/auth/github-callback.ts`
  Recebe `code` e `state`, valida a requisicao, troca o `code` por token, busca o perfil do usuario e emite a sessao da app.

- `api/me.ts`
  Retorna o usuario autenticado com base no cookie de sessao.

- `api/auth/logout.ts`
  Limpa a sessao.

- `server/auth/*`
  Contem a logica principal da autenticacao sem depender da Vercel.

- `server/lib/cookies.ts`
  Helpers para leitura e escrita de cookies.

- `server/lib/github.ts`
  Helpers para autorizacao OAuth e chamadas da API do GitHub.

- `server/lib/session.ts`
  Criacao, assinatura e validacao da sessao.

- `server/lib/db.ts`
  Ponto unico de conexao com o Neon na fase de persistencia.

- `server/db/schema.ts`
  Schema do banco usando Drizzle.

- `drizzle.config.ts`
  Configuracao de geracao e aplicacao de migrations do Drizzle.

## Estrategia anti-lock-in

Objetivo:

- usar Vercel agora sem amarrar a logica de negocio ao runtime da plataforma

Regra de arquitetura:

- `api/` deve ser uma camada HTTP fina
- `server/` deve conter a logica real

### O que isso significa na pratica

As functions em `api/` devem fazer apenas:

1. ler request
2. chamar funcoes em `server/auth` ou `server/lib`
3. traduzir o resultado para `Response`

Exemplo conceitual:

```ts
// api/me.ts
import { getCurrentUser } from "../server/auth/getCurrentUser";

export default async function handler(request: Request) {
  const result = await getCurrentUser(request);
  return Response.json(result);
}
```

Se no futuro o projeto sair da Vercel, a migracao fica concentrada na camada HTTP:

- hoje: `api/*.ts` com Vercel Functions
- depois: rotas em Express/Fastify/Render/Railway

O codigo em `server/` continua reaproveitavel.

### O que evitar

- colocar logica de auth inteira dentro de `api/*.ts`
- espalhar parse de cookies e validacao de sessao em cada function
- acoplar a camada de negocio a APIs proprietarias da Vercel
- depender de storage proprietario da plataforma para os dados principais

### O que fazer

- manter OAuth e cookies no padrao web
- manter SQL e sessao em modulos proprios
- usar `Neon` como banco externo
- usar `Drizzle` para organizar schema e queries
- concentrar auth em `server/auth`

## Decisoes tecnicas

### 1. Tipo de integracao GitHub

Usar `OAuth App`, nao `GitHub App`, para este primeiro login social.

Motivo:

- o objetivo inicial e autenticar usuario, nao integrar profundamente com repositórios
- o fluxo e mais direto para "Entrar com GitHub"

### 2. Tipo de sessao

Usar `cookie HttpOnly` com payload assinado pela aplicacao.

Recomendacao do MVP:

- cookie assinado
- sem banco inicialmente

Alternativa futura:

- `session_id` persistido em banco ou KV, se precisarmos de revogacao centralizada e multiplas sessoes

Decisao para este projeto:

- comecar com cookie assinado sem banco para a sessao
- usar `Neon` quando o app passar a persistir dados do usuario

### 3. Onde guardar o token do GitHub

Nao guardar o access token do GitHub no frontend.

No MVP, o ideal e:

- usar o token apenas no callback para obter o perfil
- descartar o token se nao houver necessidade de chamadas futuras ao GitHub

Se no futuro o app precisar acessar API do GitHub em nome do usuario, rever essa decisao e persistir o token com criptografia e expiracao controlada.

### 4. Como o frontend vai descobrir autenticacao

Fluxo recomendado:

1. frontend abre `/api/auth/github`
2. callback cria cookie de sessao
3. frontend chama `/api/me`
4. estado do usuario e carregado no bootstrap da app

### 5. ORM e acesso a dados

Usar `Drizzle` em cima do `Neon`.

Motivo:

- mais leve que um ORM pesado
- bom encaixe para poucas tabelas
- tipagem forte em TypeScript
- migrations previsiveis
- baixo acoplamento ao provedor de banco

## Fluxo completo

### Inicio do login

O botao "Entrar com GitHub" redireciona para:

```text
GET /api/auth/github
```

Essa function deve:

- gerar um `state` aleatorio
- gravar esse `state` em cookie de curta duracao
- montar a URL de autorizacao do GitHub
- fazer redirect `302`

URL de autorizacao:

```text
https://github.com/login/oauth/authorize
```

Parametros:

- `client_id`
- `redirect_uri`
- `scope=read:user user:email`
- `state`

### Callback do GitHub

O GitHub redireciona para:

```text
GET /api/auth/github-callback?code=...&state=...
```

Essa function deve:

1. validar se `code` existe
2. validar se `state` existe
3. comparar `state` da URL com `state` do cookie
4. trocar `code` por token em:

```text
POST https://github.com/login/oauth/access_token
```

5. buscar o perfil:

```text
GET https://api.github.com/user
GET https://api.github.com/user/emails
```

6. montar o usuario interno da aplicacao
7. criar a sessao
8. salvar cookie de sessao
9. limpar cookie temporario de `state`
10. redirecionar para o frontend

### Leitura da sessao

```text
GET /api/me
```

Resposta sugerida:

```json
{
  "authenticated": true,
  "user": {
    "id": 123,
    "login": "octocat",
    "name": "The Octocat",
    "avatarUrl": "https://...",
    "email": "octo@example.com"
  }
}
```

Quando nao autenticado:

```json
{
  "authenticated": false,
  "user": null
}
```

### Logout

```text
POST /api/auth/logout
```

Essa function deve:

- expirar o cookie de sessao
- responder `204` ou redirecionar, conforme a UX escolhida

## Modelo de dados da sessao

Payload minimo recomendado:

```ts
type SessionUser = {
  id: number;
  login: string;
  name: string | null;
  avatarUrl: string | null;
  email: string | null;
};
```

Payload da sessao:

```ts
type SessionPayload = {
  user: SessionUser;
  issuedAt: number;
  expiresAt: number;
};
```

Duracao inicial sugerida:

- `7 dias`

Nome do cookie:

- `archpull_session`

Cookie de `state`:

- `archpull_oauth_state`

## Configuracao de cookies

### Sessao

- `HttpOnly: true`
- `Secure: true` em producao
- `SameSite: Lax`
- `Path: /`
- `Max-Age: 7d`

### OAuth state

- `HttpOnly: true`
- `Secure: true` em producao
- `SameSite: Lax`
- `Path: /`
- `Max-Age: 10min`

Observacao:

Em desenvolvimento local, `Secure` normalmente precisa ser `false` se estiver usando `http://localhost`.

## Variaveis de ambiente

### Obrigatorias

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `SESSION_SECRET`
- `APP_URL`

### Obrigatorias na fase com Neon

- `DATABASE_URL`

### Exemplo

```env
GITHUB_CLIENT_ID=xxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxx
SESSION_SECRET=uma-chave-longa-aleatoria-e-segura
APP_URL=https://seu-app.vercel.app
DATABASE_URL=postgresql://...
```

### Ambiente local

Se houver execucao local com Vercel CLI, manter tambem `.env.local` com:

```env
APP_URL=http://localhost:3000
```

## Configuracao do GitHub OAuth App

Criar em:

```text
GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
```

Campos:

- `Application name`
- `Homepage URL`: URL publica do app
- `Authorization callback URL`: `${APP_URL}/api/auth/github-callback`

Escopos iniciais:

- `read:user`
- `user:email`

Observacao:

Se voce usar previews da Vercel, o callback URL dinamico pode virar atrito. Para o MVP, o ideal e configurar primeiro para o dominio principal de desenvolvimento ou de producao.

## Compatibilidade com este repositório

O projeto atual tem:

- `React 19`
- `Vite`
- nenhum backend ainda
- nenhum script de Vercel configurado

Isso implica:

- o frontend atual nao precisa ser reescrito
- o backend entra como camada nova
- provavelmente sera necessario adicionar suporte local com `vercel dev`
- quando a fase de persistencia chegar, `Neon` encaixa bem como Postgres externo consumido pelas functions
- a estrutura `api/ + server/` reduz lock-in e facilita migracao futura

## Banco escolhido: Neon

### O que o Neon e neste projeto

- provedor de `PostgreSQL serverless`
- banco principal do app
- usado a partir da fase em que o progresso deixar de ficar apenas no cliente

### Como o Drizzle entra no projeto

- modela tabelas em TypeScript
- gera migrations
- executa queries tipadas sobre o Postgres do Neon
- deixa a camada de dados organizada sem introduzir um ORM pesado

### Driver recomendado

Usar:

- `@neondatabase/serverless`
- `drizzle-orm`
- `drizzle-kit`

### O que sera salvo no Neon

Fase de persistencia:

- usuarios
- vinculo entre conta GitHub e usuario interno
- progresso por modulo
- score agregado
- possivel historico de partidas

### O que nao precisa entrar no Neon no primeiro momento

- sessao do MVP de login
- cache
- estado temporario do OAuth

### Tabelas sugeridas para a fase 2

```sql
create table users (
  id uuid primary key,
  github_id bigint unique not null,
  github_login text not null,
  name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table user_progress (
  user_id uuid not null references users(id) on delete cascade,
  node_id text not null,
  completed boolean not null default false,
  best_score integer not null default 0,
  attempts integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, node_id)
);
```

Expansao opcional:

```sql
create table match_sessions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  node_id text not null,
  score integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);
```

## Dependencias sugeridas

### Auth e sessao

- `jose`
- `cookie`

### Banco e migrations

- `drizzle-orm`
- `drizzle-kit`
- `@neondatabase/serverless`

### Recomendacao final de dependencias

- `jose`
- `cookie`
- `drizzle-orm`
- `drizzle-kit`
- `@neondatabase/serverless`

## Scripts locais

Para desenvolvimento real com functions, o ideal e adicionar:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:vercel": "vercel dev",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

Importante:

- `vite` sozinho nao executa `api/`
- `vercel dev` simula o ambiente da Vercel e expoe as functions
- `db:generate` gera migrations a partir do schema Drizzle
- `db:migrate` aplica migrations

Decisao pratica:

- durante implementacao do login, usar `vercel dev`

## Plano de implementacao

### Fase 1 - Infraestrutura

1. Criar pasta `api/`.
2. Criar pasta `server/`.
3. Criar `server/lib/cookies.ts`.
4. Criar `server/lib/session.ts`.
5. Criar `server/lib/github.ts`.
6. Criar `server/lib/db.ts`.
7. Criar `server/db/schema.ts`.
8. Criar `drizzle.config.ts`.
9. Adicionar `vercel.json` apenas se necessario.
10. Adicionar script local para `vercel dev`.

### Fase 2 - Endpoints

1. Implementar `GET /api/auth/github`.
2. Implementar `GET /api/auth/github-callback`.
3. Implementar `GET /api/me`.
4. Implementar `POST /api/auth/logout`.
5. Garantir que os endpoints delegam para `server/auth/*`.

### Fase 3 - Frontend

1. Adicionar botao "Entrar com GitHub".
2. Criar bootstrap de autenticacao.
3. Mostrar estado carregando autenticacao.
4. Exibir nome/avatar quando autenticado.
5. Exibir opcao de logout.

### Fase 4 - Integracao com produto

1. Definir identificador interno do usuario.
2. Criar conexao com `Neon`.
3. Modelar schema com `Drizzle`.
4. Gerar migrations.
5. Criar tabela `users`.
6. Criar tabela `user_progress`.
7. Associar progresso salvo ao usuario autenticado.
8. Decidir migracao de `localStorage` para storage por usuario.

## Contratos recomendados

### `GET /api/me`

Status:

- `200` sempre

Payload:

```ts
type MeResponse =
  | { authenticated: true; user: SessionUser }
  | { authenticated: false; user: null };
```

### `POST /api/auth/logout`

Status:

- `204 No Content`

### Falhas do callback OAuth

Redirecionar para frontend com erro em querystring:

```text
/login?error=oauth_state_invalid
/login?error=oauth_exchange_failed
/login?error=oauth_profile_failed
```

Isso simplifica a UX sem expor detalhes internos no navegador.

## Erros e casos limite

### 1. `state` invalido

Tratar como falha de seguranca.

Acao:

- nao criar sessao
- limpar cookies temporarios
- redirecionar com erro

### 2. Usuario sem email publico

Solucao:

- consultar `/user/emails`
- escolher email `primary`
- aceitar `email = null` se necessario

### 3. Callback repetido

Pode acontecer por refresh ou reabertura da URL.

Acao:

- tratar `code` como one-time
- falhar com mensagem amigavel se a troca ja tiver ocorrido

### 4. Ambiente local com callback errado

Acao:

- alinhar `APP_URL`
- alinhar callback URL no GitHub

### 5. Sessao expirada

Acao:

- `/api/me` retorna `authenticated: false`
- frontend volta ao estado anonimo

## Cuidados de seguranca

- nunca expor `GITHUB_CLIENT_SECRET`
- nunca guardar sessao em `localStorage`
- sempre validar `state`
- sempre assinar sessao
- usar `SameSite=Lax`
- usar `Secure` em producao
- nao confiar em dados vindos do frontend para autenticar usuario

## Plano de rollout

### MVP

- login
- callback
- leitura da sessao
- logout
- UI minima

Sem banco.

### V2

- integrar `Neon`
- persistencia de progresso por usuario
- migracao do progresso anonimo para conta logada
- tela de perfil simples

### V3

- ranking por usuario
- historico de modulos
- revogacao centralizada de sessao se necessario

## Checklist de implementacao

- [ ] criar OAuth App no GitHub
- [ ] configurar variaveis de ambiente
- [ ] adicionar estrutura `api/`
- [ ] adicionar estrutura `server/`
- [ ] implementar helpers de cookie
- [ ] implementar helpers de sessao
- [ ] implementar helpers GitHub OAuth
- [ ] adicionar `Drizzle`
- [ ] criar `drizzle.config.ts`
- [ ] criar `server/db/schema.ts`
- [ ] criar `/api/auth/github`
- [ ] criar `/api/auth/github-callback`
- [ ] criar `/api/me`
- [ ] criar `/api/auth/logout`
- [ ] mover logica principal para `server/auth/*`
- [ ] adicionar botao de login no frontend
- [ ] carregar sessao no bootstrap
- [ ] testar localmente com `vercel dev`
- [ ] testar deploy na Vercel
- [ ] criar projeto no Neon
- [ ] guardar `DATABASE_URL` nas env vars
- [ ] criar schema inicial de usuarios e progresso
- [ ] migrar persistencia de progresso para Neon

## Recomendacao final

O melhor proximo passo e implementar primeiro o backend minimo com `api/` como adaptador HTTP e `server/` como nucleo reutilizavel:

1. `api/auth/github.ts`
2. `api/auth/github-callback.ts`
3. `api/me.ts`
4. `api/auth/logout.ts`
5. `server/auth/beginGithubLogin.ts`
6. `server/auth/finishGithubLogin.ts`
7. `server/auth/getCurrentUser.ts`
8. `server/auth/logoutUser.ts`
9. `server/lib/session.ts`
10. `server/lib/cookies.ts`
11. `server/lib/github.ts`
12. `server/lib/db.ts`
13. `server/db/schema.ts`
14. `drizzle.config.ts`

Com isso, o frontend pode integrar em seguida sem bloquear a base de auth.
