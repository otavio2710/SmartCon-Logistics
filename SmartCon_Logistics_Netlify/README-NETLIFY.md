# SmartCon Logistics — Netlify Functions + Supabase

## Publicação correta

**Não use Netlify Drop para este pacote.** O upload manual de arquivos estáticos não instala dependências nem compila as Functions. Envie os arquivos deste pacote a um repositório GitHub (com `netlify.toml` e `package.json` na raiz) e conecte o repositório ao Netlify por **Add new project > Import an existing project**.

Configurações do Netlify: Base directory vazio (raiz do repositório); Build command `npm run build`; Publish directory `frontend`; Functions directory `netlify/functions` (definido em netlify.toml). Node 20+.

## Banco de dados gratuito

Crie um projeto Supabase Free e execute `backend/src/migrations/001_v3.sql` no SQL Editor. No Supabase, em **Connect**, escolha **Session pooler** (porta geralmente 5432) e copie os dados individuais de conexão. NÃO cole credenciais no GitHub.

No Netlify > Environment variables, crie:
- DB_HOST = hostname do Session pooler (não use `db`)
- DB_PORT = porta exibida pelo Supabase (normalmente 5432)
- DB_NAME = nome do banco (normalmente postgres)
- DB_USER = usuário do pooler (pode conter ponto)
- DB_PASSWORD = senha do banco
- DB_SSL = true

Se houver erro de certificado TLS, configure DB_SSL_CA com o certificado CA confiável do provedor. Não desative a validação TLS como solução permanente.

Depois de salvar, redeploy. Teste `https://SEU-SITE.netlify.app/api/health`, depois a página principal e as rotas de histórico.

## Limitações

Netlify Functions têm limites de tamanho de requisição/resposta e de duração; conciliações muito grandes podem não caber no plano gratuito. Este pacote preserva o processamento no navegador e expõe as rotas Node/Express como Functions, mas não há garantia de desempenho sem testar com documentos reais.

## Segurança

O histórico `/api/lotes` deste projeto não exige autenticação. Não publique dados reais de clientes, endereços ou notas fiscais em um site aberto ao público sem adicionar autenticação/autorização e controles de privacidade. Para um portfólio, utilize apenas dados fictícios.
