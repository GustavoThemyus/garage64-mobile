# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Instruções permanentes pra qualquer agente de IA que trabalhe neste repositório.
Vale pra toda sessão, sem exceção, mesmo que a instrução não seja repetida no prompt.

---

## Convenções do projeto

- **Idioma do código e da interface:** inglês, 100%. Nomes de variável, função, componente, arquivo, label, mensagem — tudo em inglês.
- **Idioma da conversa comigo e dos comentários de código:** português.
- **Commits:** Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `chore`). Um commit faz uma coisa só.
- **Branches:** GitHub Flow. `main` + branches temporárias no padrão `tipo/descricao-curta`.
- **Cores:** nenhuma cor hardcoded em componente. Tudo sai do objeto de tema central.
- **Comentários:** só o porquê que não é óbvio (limitação, regra de negócio, contorno). Curtos, em português. Nada que repita o que o código já diz.

---

## Fluxo de trabalho

Depois de **qualquer mudança** no projeto, sem esperar o usuário pedir:

1. **Verificar.** Rodar `npx tsc --noEmit`, `npm run verify:engine` e `npx expo-doctor`. Se a mudança mexeu em rotas, configuração ou dependências, rodar também o export das três plataformas (`npx expo export -p ios`, `-p android`, `-p web`). Se algo falhar, não commitar: corrigir, ou avisar o que ficou pendente.
2. **Atualizar a documentação** do que mudou:
   - **este arquivo**: as seções Estado atual e Arquitetura sempre que o app ou a estrutura mudarem;
   - **`docs/`**: `spec.md` quando o comportamento muda, `deploy.md` quando o deploy ou o backend muda;
   - **`README.md`**: o que funciona, estrutura, próximos passos e limitações.
3. **Commitar** em Conventional Commits, um commit por assunto sempre que os arquivos permitirem.
4. **Dar push.**

Regras que não mudam: autor dos commits é o do `git config` do usuário e nunca entra trailer de atribuição; nunca commitar segredo (`.env`, chaves); sem `push --force` nem reescrever histórico publicado sem o usuário pedir. O push vai pra branch atual, e o merge de uma branch na `main` só quando o usuário pedir.

---

## Comandos

| Comando                                           | Efeito                                                          |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `npm start`                                       | Sobe o Metro bundler e mostra o QR code do Expo Go              |
| `npm run android` / `npm run ios` / `npm run web` | Abre direto na plataforma                                       |
| `npm run build:web`                               | Gera `dist/`, o mesmo comando que a Vercel roda                 |
| `npx tsc --noEmit`                                | Checagem de tipos                                               |
| `npx expo-doctor`                                 | Confere configuração e versões do projeto (20 checagens)        |
| `npm run verify:engine`                           | Verifica motor, filtros, storage, repositórios e serviço do Assistant contra os 14 carros do mock (414 checagens) |

Precisa de **Node 22.13 ou mais novo** (`.nvmrc` e `engines` pedem 22.x).

No Expo Go, o botão azul de engrenagem no canto é das ferramentas do Expo Go, não do app. Pra esconder: `EXPO_NO_DEV_MENU=1 npm start` (em fish: `env EXPO_NO_DEV_MENU=1 npm start`).

O que **não** existe neste repositório:

- **Sem test runner** (jest) **e sem lint** (ESLint, Prettier). `verify:engine` é um script com `tsx` que sai com código 1 se uma checagem falhar, e cobre só lógica pura. As telas são conferidas à mão.
- O arquivo de rotas tipadas `.expo/types/router.d.ts` só é gerado pelo servidor de desenvolvimento. Depois de criar ou renomear uma rota, rode `npx expo start` por alguns segundos antes do `tsc`, senão o `href` novo é recusado.

---

## Arquitetura

O comportamento do app está especificado em `docs/spec.md`, em português. O plano de deploy e do backend está em `docs/deploy.md`.

**Roteamento.** `expo-router` 58, baseado em arquivo, com rotas tipadas.

- `app/_layout.tsx` é a raiz. Monta os providers nesta ordem: `AppThemeProvider`, `CarsProvider`, `BuildsProvider`. Registra no `Stack` as telas `(tabs)` e `carDetails`. `unstable_settings.anchor` mantém `(tabs)` como base da pilha.
- `app/(tabs)/_layout.tsx` usa `NativeTabs`: no iOS 26+ é a barra flutuante de vidro do sistema (forma e cápsula não são configuráveis). `_layout.web.tsx` é a barra clássica da web, porque o `NativeTabs` cai num fallback simples ali.
- Cada tab é um grupo com **o próprio `Stack`**, que é quem dá o header: `(catalog)`, `(builds)`, `(assistant)`, `(settings)`. As opções comuns (título grande, cores) vêm de `src/navigation/useTabStackOptions.ts`.
- Pra o título grande colapsar ao rolar, e pro sistema desenhar o desfoque sob o header, **a lista da tela precisa ser o primeiro filho da tela** (um Fragment, não uma `View` embrulhando). Foi a causa do título sobreposto no Catalog.
- O título do botão de voltar do iOS vem do `title` da tela anterior. `app/_layout.tsx` dá ao `(tabs)` um título dinâmico (`getFocusedRouteNameFromRoute` + `TAB_TITLES`); ao criar uma tab nova, inclua o nome dela ali.
- `app/carDetails.tsx` e `app/configurator.tsx` ficam na raiz do Stack e cobrem a tab bar. O configurator recebe `carId` (nova build) ou `buildId` (editar).
- Na web o app é uma página única (`web.output: "single"`) e o HTML base é `public/index.html`.

**Tema.** `src/theme/`.

- `colors.ts` é a **única** fonte de cor, com paleta dark e light. Os tokens descrevem o papel: `accent` é o amarelo de preenchimento, `accentText` é o amarelo quando é texto ou ícone (no claro vira um âmbar escuro, por contraste). O amarelo é um ouro de matiz 43; o limão anterior virava oliva ao escurecer. Nenhum hex fora deste arquivo.
- `tokens.ts` tem `spacing`, `radius` e a escala de `typography` (corpo 17, rótulo 15, legenda 13). A fonte é a do sistema, não há `fontFamily` em lugar nenhum.
- `ThemeProvider.tsx` guarda a preferência System, Light ou Dark no AsyncStorage e a espelha em `Appearance.setColorScheme`, pra os componentes nativos seguirem o app. `useTheme()` devolve a paleta; `useThemeController()` devolve também a preferência.
- Vidro do sistema só onde é nativo: tab bar, botões do header, o balão de filtro e o controle segmentado do iOS. O painel de filtros do Android e da web usa `GlassSurface`. **Os cards não usam vidro**: usam `SurfaceCard` (degradê com aro de 1 pt em degradê) e `PressHighlight` (clareia ao toque, sem escalar).
- Regra de estrutura dos cards: nunca depende do conteúdo. Nome e marca em uma linha, tipo e HP em linhas próprias no rodapé, e o card estica até a altura do vizinho da linha.

**Dados.**

- `Car` (`src/types/car.ts`) é aninhado em cinco grupos: `info`, `specs`, `performance`, `rules`, `history`. Todo acesso passa pelo grupo (`car.performance.hp`). `weight`, `torque` e `topSpeed` são pares de números: peso e velocidade são a mesma grandeza em duas unidades, torque é valor mais rotação.
- O catálogo é o mock `src/data/carsMoch.ts` (14 carros, somente leitura; o nome do arquivo tem erro de grafia herdado). As telas **não importam o mock**: leem por `useCars()` (`src/data/CarsProvider.tsx`), que usa um `CarsRepository` (`carsRepository.ts`). Trocar pelo Supabase é escrever outra implementação da interface.
- `Build` (`src/types/build.ts`) referencia o carro por `carId`, nunca copia. `src/data/partsCatalog.ts` tem as opções do configurator e os coeficientes (o mock só tem um valor por campo, o de fábrica). `dictionary.ts` guarda os rótulos, `formatters.ts` formata por significado, `countries.ts` traduz o código ISO.

**Motor.** `src/engine/`, funções puras sem React, todas cobertas por `scripts/verify-engine.ts`.

- `calculate.ts`: toda fórmula é uma razão contra a configuração de fábrica, então a de fábrica reproduz o mock exatamente. Coeficientes em `docs/spec.md` seção 5.5.
- `validate.ts`: aplica `car.rules` e devolve avisos. **Nunca bloqueia.** `aspiration.ts` normaliza o texto de aspiração (specs e rules escrevem diferente). `config.ts` dá a configuração de fábrica e as faixas dos sliders. `evaluate.ts` junta cálculo e avisos.
- `compare.ts`, `delta.ts`, `filterBuilds.ts`: barras do Compare, diferença contra a fábrica e filtro de builds.

**Builds.** `BuildsProvider` fala com um `BuildsRepository` (`list`, `save`, `remove`, por item). A implementação local (`localBuildsRepository.ts`) usa o AsyncStorage sob a chave `garage64:builds:v1`, com uma fila de gravação. `buildFromDraft.ts` é a regra pura do id e da data de criação. `parseBuilds.ts` lê o JSON sem nunca quebrar o app.

**Filtros.** Um modelo neutro (`src/components/filters/types.ts`, montado por `filterModels.ts`) alimenta as duas formas de UI. `FilterControl` escolhe: no iOS, `NativeFilterMenu` (balão nativo ancorado no botão do header, um submenu por categoria); no Android e na web, `FilterToolbarButton` mais `FilterPanel` (popover no canto). Regra: **OU dentro de uma categoria, E entre categorias, categoria vazia não filtra** (`filterCars.ts`, `filterBuilds.ts`).

**Serviços e configuração.** `src/services/assistant.ts` expõe uma interface: offline por padrão, e HTTP (`POST {EXPO_PUBLIC_API_URL}/api/assistant`) quando a variável existe. `src/config/env.ts` lê as variáveis `EXPO_PUBLIC_*` (públicas, nunca segredo; veja `.env.example`).

**Deploy.** `app.json` (identificador provisório `com.gustavothemyus.garage64`), `eas.json` (perfil `preview` gera APK), `vercel.json` (`buildCommand`, `outputDirectory: dist` e a rewrite de página única), `public/` (manifesto e ícones do PWA).

---

## Estado atual

- **Frontend da v1 completo**, com as 4 tabs da spec: Catalog (grade, filtros), Car Detail (7 blocos), Compare, Build Configurator (controles, resultado em tempo real, avisos de compatibilidade), Builds (editar, renomear, excluir, filtrar), Settings (tema, sobre, links) e Assistant (tela de chat completa).
- **Visual aprovado no iPhone** (Expo Go, SDK 58): tabs nativas, balão de filtro, cards com aro em degradê e seletor nativo de tema.
- **Tudo roda local.** Catálogo é o mock, builds ficam no aparelho, e o Assistant responde que está offline.
- **Depende de backend e ainda não existe:** contas e armazenamento na nuvem (spec fase 2), cálculo no servidor (fase 3) e a resposta do Assistant (fase 4).
- **Deploy:** a configuração está pronta (web na Vercel, APK pelo EAS). Falta criar as contas e fazer o primeiro deploy. Passos em `README.md` (Next steps) e `docs/deploy.md`.
- **Verificações no último commit:** `tsc` limpo, `expo-doctor` 20/20, `verify:engine` 414/414 e os exports de iOS, Android e web passam.

---

## Dívida conhecida

- **Não existe utility-class CSS neste projeto.** Sem NativeWind nem Tailwind. `className` **não funciona**: toda estilização é `StyleSheet.create`.
- **O Expo Go só abre o SDK mais recente.** Quando sair um SDK novo e o Expo Go da loja atualizar, o projeto precisa subir de SDK pra continuar abrindo lá.
- **Imagens dos carros vêm de URLs de terceiros**, sem cache e sem garantia de continuarem no ar, e fora da licença do repositório. Hospedar as próprias resolve.
- **Dado contraditório no mock:** `canChangeTraction` é `false` nos 14 carros, mas o Supra aceita AWD. Ligar AWD nele mostra o aviso mais restritivo (`docs/spec.md`, seção 11 item 12).
- **O balão de filtro do iOS volta ao menu principal depois de cada escolha múltipla.** É uma limitação documentada do `unstable_keepPresented` do Expo.
- **O identificador do app é provisório** e não muda depois de publicado.
- **Sem teste automático de interface.** Só a lógica pura é verificada por script.
