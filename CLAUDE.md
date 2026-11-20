# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Instruções permanentes pra qualquer agente de IA que trabalhe neste repositório.
Vale pra toda sessão, sem exceção, mesmo que a instrução não seja repetida no prompt.

---

## Comandos

| Comando                                           | Efeito                                             |
| ------------------------------------------------- | -------------------------------------------------- |
| `npm start`                                       | Sobe o Metro bundler e mostra o QR code do Expo Go |
| `npm run android` / `npm run ios` / `npm run web` | Abre direto na plataforma                          |
| `npx tsc --noEmit`                                | Checagem de tipos                                  |

O que **não** existe neste repositório:

- **Sem test runner.** `components/__tests__/StyledText-test.js` existe, mas é resíduo do template Expo: `jest`/`jest-expo` não estão instalados e não há script `test`. Não sugira `npm test`.
- **Sem lint.** Nenhum ESLint ou Prettier configurado, nenhum script.

A única verificação automática disponível hoje é `npx tsc --noEmit`.

---

## Arquitetura

**Roteamento — `expo-router` v6, baseado em arquivo.** A diferença que mais confunde quem vem do Next.js: a pasta é `app/`, mas o layout não é convenção implícita — cada `_layout.tsx` renderiza explicitamente um `<Stack>` ou `<Tabs>`. `typedRoutes` está ligado no `app.json`.

- `app/_layout.tsx` — raiz. Carrega fontes, segura a splash screen, envolve tudo no `ThemeProvider` do React Navigation. Registra três telas no `<Stack>`: `(tabs)`, `modal` e `carDetails`.
- `app/(tabs)/_layout.tsx` — as tabs. Só duas existem: `index` (título "Catalog") e `two`.
- `app/carDetails.tsx` — registrada no Stack, mas ainda é um stub que renderiza só o texto "Details".

**Duas árvores de componentes convivem.** `@/*` aponta pra raiz do repositório (`tsconfig.json`), então os dois caminhos são válidos:

- `components/` — boilerplate do template Expo (`Themed.tsx`, `useColorScheme`, `EditScreenInfo`, `StyledText`). Não é código do projeto.
- `src/` — o código real: `src/components/`, `src/data/`, `src/types/`.

Código novo do projeto vai em `src/`.

**Modelo de dados.** Uma única interface `Car` em `src/types/car.ts`, com cinco grupos aninhados: `info`, `specs`, `performance`, `rules` e `history`. Todo acesso é aninhado (`car.info.model`, `car.performance.hp`, `car.specs.type`) — nada é plano. O grupo `rules` (`allowAWD`, `allowNOS`, `allowedAspirations`, `canChangeTraction`, `maxHP`) já existe no tipo e nos dados, mas ainda não é lido por nenhum código: é a base do validador de compatibilidade da spec §5.3.

**Dados.** `src/data/carsMoch.ts` — 14 carros num array `Car[]`, somente leitura. O nome do arquivo tem erro de grafia herdado ("Moch"); manter como está por consistência, renomear é decisão separada.

**Filtro.** `src/data/filterCars.ts` recebe `Car[]` e `{ selectedFilters: string[] }` — uma lista plana de strings, sem categoria. Cada carro passa se casar com **qualquer** filtro de marca, país ou tipo (`hasBrand || hasCountry || hasType`). O estado vive em `app/(tabs)/index.tsx`, a UI em `src/components/CarFiltersOverlay.tsx`, e as opções são derivadas em runtime do próprio mock (`new Set` sobre marcas, países e tipos).

**Layout responsivo do grid.** `app/(tabs)/index.tsx` calcula `columns` (2, 3 ou 4) a partir de `useWindowDimensions()` e passa `cardWidth` como prop pro `CarCard`. O `key={columns}` no `FlatList` é intencional: força a remontagem quando o número de colunas muda.

---

## Estado atual

O que existe de fato, comparado ao que a spec descreve:

- **Pronto:** Catalog — grid de cards + overlay de filtros.
- **Modal:** `carDetails.tsx`. A navegação mostra o dado básico do carro, apenas o nome/modelo.
- **Não existe:** Build Configurator, tab Builds, tab Settings, tab Assistant. A spec §3 pede 4 tabs; existem 2, e `app/(tabs)/two.tsx` é template não modificado.

---

## Dívida conhecida

**Não existe utility-class CSS neste projeto.** Sem NativeWind, sem Tailwind, sem `babel.config.js`, `tailwind.config.js`, `metro.config.js` nem `global.css`. `className` **não funciona** — toda estilização é `StyleSheet.create`. Se em algum momento a decisão for adotar NativeWind, é instalação e configuração do zero, não é só voltar a usar.