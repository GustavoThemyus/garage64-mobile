# Garage64: plano de deploy

> Objetivo: qualquer pessoa abre o app no celular com **um link**, sem conta e sem instalar nada da loja.
> Este documento é um plano. Nada daqui foi executado ainda, e o que depende de conta do autor está marcado.

---

## 1. Visão geral

```
Celular (navegador ou APK)  --HTTPS-->  API Next.js (Vercel)  -->  Supabase (Postgres + Auth)
        ^
        |  hoje só esta parte existe: o app roda sozinho, com o mock local e builds no AsyncStorage
```

Hoje o app não precisa de backend. Por isso o deploy tem duas partes que não dependem uma da outra:

1. **Distribuir o app que já existe** (etapas A, B e C). Dá pra fazer agora.
2. **Construir o backend** (etapas D e E, fases 2 a 4 da spec). Só depois o app passa a falar com ele.

Ordem recomendada: **A, B, F, D, E, C.**

---

## 2. Etapa A: link web (a que atende "qualquer pessoa")

O app roda na web (`npm run web`), então o link é um site estático.

**Ajustes antes do primeiro deploy**

1. `app.json`: trocar `web.output` de `"static"` para `"single"` (um `index.html`, app de página única). O padrão do Expo é `single`. Em `static` cada rota gera um HTML, e como o tema só monta depois de ler a preferência salva, esse HTML sairia vazio.
2. PWA, pra funcionar o "Adicionar à tela inicial":
   - criar a pasta `public/` com `manifest.json`, `logo192.png` e `logo512.png` (o Expo copia `public/` pra `dist/`; evitar `public/assets/`)
   - rodar `npx expo customize public/index.html` e acrescentar `<link rel="manifest" href="/manifest.json" />`
   - a doc do Expo não descreve o "Adicionar à tela inicial" do iOS. No Safari ele é do próprio sistema (Compartilhar, Adicionar à Tela de Início) e funciona com o manifest e o ícone.
3. Não registrar service worker por enquanto. A doc do Expo avisa que cache agressivo atrapalha atualização.

**Build e hospedagem**

```bash
npx expo export -p web      # gera dist/
npx expo serve              # conferir em http://localhost:8081 antes de publicar
```

Hospedagem sugerida: **Vercel** (grátis). Segundo a doc do Expo:

- `vercel.json` na raiz:
  ```json
  {
    "outputDirectory": "dist",
    "rewrites": [{ "source": "/:path*", "destination": "/" }]
  }
  ```
- Comando de build: `npx expo export -p web`.
- A rewrite existe porque `single` é uma página só: sem ela, abrir `/builds` direto dá 404.

Alternativas documentadas pelo Expo: Netlify (`public/_redirects` com `/*    /index.html   200`), Firebase Hosting, AWS Amplify, GitHub Pages e a hospedagem do próprio Expo. Cloudflare Pages não aparece na doc do Expo, então não está verificado.

**O que muda na web (já está no código)**

- Tabs clássicas (`_layout.web.tsx`) no lugar da barra nativa; sem vidro líquido.
- O botão de filtro vai no header como componente, porque a web não tem `Stack.Toolbar`.
- `confirm` do navegador no lugar do `Alert`.
- AsyncStorage vira `localStorage`: as builds ficam no navegador daquele aparelho.
- As imagens dos carros carregam de URLs de terceiros. Se algum site bloquear hotlink, a imagem some. Hospedar as imagens próprias resolve (ver seção 7).

**Checklist de aceite da etapa A**

- [ ] O link abre no Safari do iPhone e no Chrome do Android.
- [ ] Abrir `/builds` direto (recarregar a página) não dá 404.
- [ ] Criar uma build, fechar a aba, reabrir: a build continua.
- [ ] "Adicionar à tela inicial" gera um ícone e abre sem a barra do navegador.

---

## 3. Etapa B: APK Android

1. Instalar e entrar: `npm install --global eas-cli`, `eas login`.
2. `eas build:configure` cria o `eas.json`. Ajustar o perfil `preview` para APK:
   ```json
   {
     "build": {
       "preview": {
         "distribution": "internal",
         "android": { "buildType": "apk" }
       }
     }
   }
   ```
3. `app.json`: definir `android.package` (ex.: `com.gustavothemyus.garage64`). A doc do Expo que li não afirma que é obrigatório, mas o EAS pede esse identificador e ele não muda depois de publicado, então decidir o nome com calma.
4. `eas build -p android --profile preview`. A página do build tem o botão **Install** e o link do APK, que dá pra mandar por mensagem. No celular é preciso permitir "instalar apps desconhecidos".

**Atualizar sem gerar APK novo (opcional)**

- `npx expo install expo-updates` e `eas update:configure` (escreve `runtimeVersion` e `updates.url` no `app.json`).
- No `eas.json`, um `channel` por perfil (`preview`, `production`).
- Publicar: `eas update --channel preview --message "..." --environment preview` (a doc diz que `--environment` é obrigatório do SDK 55 em diante).
- Só atualiza JavaScript e assets. Mudança nativa ou troca de SDK exige novo build.

**Limites do plano grátis** (página de preços do Expo): até 15 builds Android e 15 iOS (a página não diz o período), fila de baixa prioridade com espera que pode passar de 90 minutos, build com timeout de 45 minutos.

---

## 4. Etapa C: iOS nativo (opcional, depois)

Até aqui o iPhone usa a etapa A. Pra ter o app nativo, com o vidro líquido de verdade:

- Apple Developer Program (US$ 99 por ano), `ios.bundleIdentifier` no `app.json`, `eas build -p ios` e distribuição pelo TestFlight.
- Cada pessoa precisa instalar o TestFlight antes. Por isso não atende "sem dificuldade", e fica por último.

---

## 5. Etapa D: banco (Supabase, spec fase 2)

1. Criar um projeto no Supabase (plano grátis). Projetos grátis podem ser pausados por inatividade, conferir a regra atual no painel.
2. Tabelas, com o catálogo guardado como o próprio tipo `Car` em `jsonb`:
   ```sql
   create table public.cars (
     id integer primary key,
     data jsonb not null
   );
   alter table public.cars enable row level security;
   create policy "cars are readable by everyone"
     on public.cars for select using (true);

   create table public.builds (
     id uuid primary key default gen_random_uuid(),
     user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
     car_id integer not null references public.cars(id),
     name text not null,
     config jsonb not null,
     computed jsonb not null,
     warnings jsonb not null default '[]',
     created_at timestamptz not null default now()
   );
   alter table public.builds enable row level security;
   create policy "users manage their own builds"
     on public.builds for all
     using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ```
3. Seed: script que lê `src/data/carsMoch.ts` e insere os 14 carros.
4. Auth anônima (a spec §11 item 3 define builds anônimas na v1): ligar "Anonymous sign-ins" no painel e chamar `supabase.auth.signInAnonymously()` no primeiro uso.
5. No app, trocar `src/storage/buildsStorage.ts` por chamadas ao Supabase mantendo as mesmas funções (`loadBuilds`, `saveBuilds`), e fazer uma importação única das builds que já estão no AsyncStorage.

Variáveis no app (todas públicas por desenho, a segurança vem do RLS): `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

---

## 6. Etapa E: backend Next.js (spec fases 3 e 4)

Repositório separado (`garage64-api`) na Vercel. Duas responsabilidades, que são as que justificam o backend (spec §11 item 4):

- `POST /api/calc`: recebe `{ carId, config }` e devolve o resultado. Usa o mesmo código de `src/engine` (a assinatura de `evaluateBuild` já é a do contrato). O app passa a chamar a API no lugar de rodar local.
- `POST /api/assistant`: recebe o histórico e a mensagem, chama o LLM e devolve o texto. Troca a implementação de `src/services/assistant.ts`, que hoje recusa tudo.

Variáveis só no servidor: `SUPABASE_SERVICE_ROLE_KEY`, `LLM_API_KEY`. No app só `EXPO_PUBLIC_API_URL`.

Antes de abrir ao público: CORS liberando só o domínio do site, limite de requisições por IP no `/api/assistant`, e validar o corpo de toda rota (tamanho da mensagem, `carId` existente).

---

## 7. Etapa F: qualidade e integração contínua

GitHub Actions a cada pull request, em Node 22:

```bash
npm ci
npx tsc --noEmit
npx expo-doctor
npm run verify:engine
```

Deploy da web automático pela integração do GitHub com a Vercel (push na `main`).

Pendência independente de backend: **hospedar as imagens dos carros**. Hoje são URLs de terceiros, o que quebra se o site de origem mudar ou bloquear, e traz risco de direitos autorais num repositório público (spec §11 item 7). Mover pra um bucket do Supabase Storage resolve os dois.

---

## 8. Custos

| Item | Custo |
| --- | --- |
| Vercel (site e API) | grátis no plano hobby |
| Supabase | grátis no plano inicial |
| Expo (build Android, updates) | grátis, com os limites da seção 3 |
| Apple Developer (só etapa C) | US$ 99 por ano |
| Domínio próprio (opcional) | cerca de US$ 10 a 15 por ano |

---

## 9. O que depende do autor

Contas e decisões que ninguém mais pode tomar:

1. Criar contas grátis na **Vercel**, no **Expo** e no **Supabase**.
2. Decidir o nome do pacote Android (`android.package`), porque não muda depois.
3. Escolher o provedor de LLM e gerar a chave (só na etapa E).
4. Decidir se a etapa C (iOS nativo, US$ 99 por ano) vale a pena.

## 10. Riscos

- **O Expo Go só abre a SDK mais recente.** Quando sair o SDK 59 e o Expo Go da loja atualizar, o projeto volta a ser rejeitado até subir de SDK. O link web e o APK não sofrem com isso.
- **Vidro líquido só no iOS 26+ e só no app nativo.** Quem abrir o link web vê a versão com superfícies sólidas.
- **Builds ficam no aparelho** até a etapa D. Limpar os dados do navegador ou do app apaga as builds.
- Limites do plano grátis (builds do Expo, pausa do Supabase por inatividade) podem mudar. Conferir no painel de cada serviço antes de depender deles.
