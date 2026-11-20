# Garage64 Mobile — Especificação

> Documento vivo. Fonte da verdade sobre **o que** o app é.
> Não descreve implementação, descreve comportamento e regras.

---

## 1. Visão geral

App mobile de catálogo e configurador de carros pra entusiastas (JDM, muscle, clássicos, track, street).

O usuário navega por um catálogo, abre a ficha completa de um carro, monta builds ajustando specs em tempo real, recebe validação do que aquele carro suporta ou não, e salva as builds pra consultar depois.

**Objetivo duplo:** peça de portfólio + aprendizado prático de React Native/Expo.

**Idioma da interface:** inglês (100%). Sem exceção — labels, mensagens de erro, textos de estado vazio, tudo.

---

## 2. Stack

| Camada     | Tecnologia                  |
| ---------- | --------------------------- |
| App        | React Native + Expo         |
| Linguagem  | TypeScript                  |
| Backend    | Next.js (API Routes)        |
| Banco      | Supabase                    |
| Dados (v1) | Arquivo mock local em `.ts` |

---

## 3. Navegação

**Bottom tabs — 4:**

1. **Catalog**
2. **Builds**
3. **Assistant** _(interface pronta, resposta depende do backend)_
4. **Settings**

No iOS e no Android a barra de tabs é a **nativa do sistema** (no iOS 26+, a barra flutuante de vidro). Cada tab tem o próprio Stack, que dá o header com título grande. A web usa uma barra de tabs clássica, ver seção 9.

**Telas fora das tabs** (empilhadas por cima, escondendo a tab bar):

- **Car Detail** — Stack por cima do Catalog. Não é tab.
- **Build Configurator** — acessado de dentro do Car Detail ("Create build") ou da tab Builds (editar uma build salva).

---

## 4. Tab: Catalog

### 4.1 Listagem

Grid de cards. **2 cards por linha** em tela de referência (iPhone 14).

Cada card exibe:

- Imagem do carro
- Nome
- Marca
- Ano
- Tipo
- Potência em HP

Toque no card → abre **Car Detail**.

### 4.1.1 Filtros

Botão de filtro no header do Catalog abre um painel por cima da lista, com três categorias: **marca**, **país** e **tipo**. As opções saem do próprio catálogo, então um carro novo aparece nos filtros sozinho. O país é mostrado pelo nome (Japan), não pelo código (JP).

**Regra de combinação:**

- **Dentro de uma categoria é OU.** Marcar Nissan e Toyota mostra os carros das duas marcas.
- **Entre categorias é E.** Marcar Nissan, Toyota e Sports Coupe mostra só os Sports Coupe dessas duas marcas.
- **Categoria sem nada marcado não filtra.** Sem nenhum filtro, aparecem todos os carros.

O painel fecha tocando fora ou em "Show N cars". "Clear all" desmarca tudo.

### 4.2 Car Detail

Tela sobreposta ao Catalog. Exibe **todos** os dados do carro presentes no mock:

- Imagem — `info.image`
- Identificação — `info`: marca, modelo, ano, cor, geração, país
- Tipo — `specs.type`
- Especificações completas — `specs`
- Performance — `performance`
- Curiosidades — `history.curiosities`
- Aparições em mídia — `history.appearances`

A "década" não é campo armazenado: deriva de `info.year`. O país é armazenado como código ISO de duas letras (`info.countryCode`, ex.: `"JP"`); o nome por extenso vem da tabela `src/data/countries.ts`.

**Formatação dos campos de dois números.** `weight` e `topSpeed` guardam a mesma grandeza em duas unidades ([kg, lb] e [km/h, mph]) e aparecem como `1560 kg / 3395 lb`. `torque` guarda duas grandezas diferentes, o valor e a rotação onde ele acontece ([Nm, RPM]), e aparece como `392 Nm at 4400 rpm`. Motor rotativo (`valves: 0`) mostra "None (rotary)".

Ao final da tela: botão **"Create build"** e **"Compare"**. O comparador permanece nessa tela, abaixo do botão de Create build. Ao clicar em Compare, o comparador se expande pra baixo e surge um botão "Choose car", que abre uma lista com os outros carros. Escolhido o carro, aparece a comparação em barras com os dois.

**Métricas comparadas** e o que conta como melhor: hp, torque, top speed e consumption (km/L), **maior é melhor**; acceleration (0 a 100 km/h) e weight, **menor é melhor**.

**Barras.** Cada carro tem uma barra por métrica. O comprimento verde é o score do carro, onde 1 é o melhor dos dois (para "menor é melhor", o score é o menor valor dividido pelo valor do carro). O carro melhor fica com a barra verde cheia; o carro pior tem verde até o seu score e **vermelho do seu score até o teto do outro**. Um ponteiro marca o fim do verde de cada barra. Ao lado do nome da métrica aparece quem ganhou e por quantos % (diferença em relação ao maior valor).

---

## 5. Build Configurator

Acessado pelo botão "Create build" dentro do Car Detail.

### 5.1 Controles

Todos os controles são listados **verticalmente, um por linha**.

Todo controle **inicia no valor padrão do carro**, vindo do mock.

| Tipo de controle           | Aplicado a                                                                                       | Comportamento                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Slider**                 | `specs.displacement`, `specs.valves`                                                             | Passo de 0,1 L na cilindrada e de 4 nas válvulas, começando no valor de fábrica. Motor rotativo (`valves: 0`) não tem slider de válvulas |
| **Toggle (Switch nativo)** | Tração integral (AWD) e NOS                                                                      | Switch nativo da plataforma — muda de cor no padrão iOS/Android automaticamente. Sem texto "yes/no" |
| **Escolha única**          | `specs.aspiration`, `specs.transmission`, `specs.wheels`, `specs.brakes`, `specs.steering`       | Lista de linhas com uma opção ativa. Não é segmented control porque os textos de fábrica (rodas, freios) são longos |

**De onde vêm as opções.** O mock guarda só **um** valor por carro em cada campo categórico, o de fábrica. As opções do configurador vêm do catálogo de peças (`src/data/partsCatalog.ts`): toda lista começa com **Factory** (o texto do próprio carro) e segue com upgrades que valem pra qualquer carro, cada um com seu efeito em peso, tempo de 0 a 100 e consumo. A aspiração tem quatro opções fixas: naturally aspirated, supercharged, single turbo e twin turbo.

**Tração.** O controle de tração é o toggle AWD, não uma lista. `specs.traction` só define o valor inicial do toggle ("4x4 (AWD)" liga, "4x2 (RWD)" desliga).

> Slider de faixa: cilindrada de (fábrica − 0,6 L, mínimo 1,0) até (fábrica + 1,5 L, máximo 8,0). Válvulas de (fábrica − 8, mínimo 4) até (fábrica + 16).

### 5.2 Saída em tempo real

Abaixo dos controles, um painel que **recalcula a cada alteração**, sem botão de confirmação:

- HP
- Torque
- Top speed
- Acceleration
- Consumption

### 5.3 Validação de compatibilidade

Junto da saída, antes de salvar, o app exibe se o carro **suporta** a configuração montada.

As restrições vêm do próprio mock, no grupo `rules` de cada carro:

| Campo                        | Restringe                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------- |
| `allowAWD: boolean`          | Se o carro aceita tração integral                                               |
| `allowNOS: boolean`          | Se o carro aceita óxido nitroso                                                 |
| `allowedAspirations: string[]` | Lista fechada de aspirações válidas (ex.: `["Single-Turbo", "Twin-Turbo"]`)   |
| `canChangeTraction: boolean` | Se a tração pode ser alterada em relação à de fábrica                           |
| `maxHP: number`              | Teto de potência que o conjunto mecânico suporta                                |

**Avisos possíveis** (`BuildWarning.code`): `awd-not-supported`, `traction-change-not-allowed`, `nos-not-supported`, `aspiration-not-allowed` e `hp-over-limit`. O `hp-over-limit` compara o HP **calculado** com `maxHP`.

**Aspiração normalizada.** `specs.aspiration` ("Sequential Twin-Turbocharged") e `rules.allowedAspirations` ("Twin Turbo", "Turbo", "Supercharged (rare aftermarket)") descrevem a mesma coisa com palavras diferentes. Os dois lados são convertidos pra um id canônico por palavra-chave (`supercharged`, `twin-turbo`, `single-turbo`, `naturally-aspirated`) antes de comparar. Comparar o texto cru reprovaria o carro de fábrica.

**Invariante.** A configuração de fábrica de qualquer carro nunca gera aviso.

**Comportamento:** configuração inválida é **exibida como aviso**, não bloqueada silenciosamente. O usuário vê o que está errado e por quê. Aviso nunca desabilita o botão de salvar.

> **Decisão em aberto:** build inválida pode ser salva com o aviso anexado, ou o botão de salvar fica desabilitado? Ver seção 11. Resposta: pode salvar com o aviso anexado.

### 5.4 Salvar

Campo de **nome** e botão **"Save build"** ao final. O nome começa como "<modelo> build" e é editável. Ao salvar, o app volta pra tab Builds.

Abrir uma build salva pela tab Builds reabre o configurador em modo edição ("Save changes"), com os controles nos valores salvos. "Reset to factory" volta todos os controles ao valor de fábrica.

### 5.5 Modelo de cálculo (v1, local)

Não são dados reais de performance (seção 12): é um modelo simples e previsível, implementado em `src/engine/calculate.ts`. Roda no aparelho na v1 e é uma função pura, então na fase 3 pode virar uma chamada de API com a mesma assinatura.

Toda fórmula é uma **razão em relação à configuração de fábrica**. Por isso a configuração de fábrica reproduz `car.performance` exatamente, e isso é verificado nos 14 carros (`npm run verify:engine`).

```
hp          = hpBase × (cilindrada/base)^0.9 × (aspiração/base) × (válvulas/base)^0.3 × NOS
torque      = torqueBase × (hp/hpBase)^0.95            (a rotação do pico não muda)
peso        = pesoBase + 55 kg por litro extra + equipamento da aspiração + peças + AWD
topSpeed    = topSpeedBase × (hp/hpBase)^(1/3)         (limitada pelo arrasto, só depende de potência)
aceleração  = tempoBase × √((peso/hp)/(pesoBase/hpBase)) × câmbio × tração
consumo     = consumoBase ÷ (cilindrada^0.8 × aspiração × (peso/base)^0.3 × peças)
```

| Fator                | Valor                                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| Potência da aspiração | aspirado 1,00; supercharged 1,28; single turbo 1,40; twin turbo 1,50         |
| Peso do equipamento   | aspirado 0; supercharged +30 kg; single turbo +35 kg; twin turbo +55 kg       |
| Consumo da aspiração  | aspirado 1,00; supercharged 1,12; single turbo 1,10; twin turbo 1,18          |
| NOS                   | potência × 1,12; não altera peso nem consumo                                  |
| AWD ligado (era RWD)  | +70 kg e tempo de 0 a 100 × 0,95                                              |
| AWD desligado (era AWD) | −70 kg e tempo de 0 a 100 × 1,06                                            |
| Peças                 | cada opção do catálogo tem delta de peso e multiplicadores de aceleração e consumo (câmbio é a que mais pesa em aceleração) |

A velocidade em mph usa a mesma razão aplicada à velocidade em mph do mock. Os valores são arredondados no fim: hp, torque e velocidade inteiros, aceleração e consumo com uma casa.

---

## 6. Tab: Builds

Listagem de todas as builds criadas pelo usuário.

### 6.1 Card

Mesmo card do Catalog, mas ocupando **o dobro do espaço horizontal**.

Onde o Catalog mostra 2 por linha, Builds mostra **1 por linha** — no mesmo aparelho, na mesma resolução. O espaço extra existe pra caber mais informação da build.

O card da build exibe:

- Imagem do carro base
- Nome da build (definido pelo usuário)
- Carro base (nome + ano)
- Resultado calculado: HP, torque, top speed, acceleration, consumption
- Indicador de compatibilidade ("Compatible" ou "N warnings")

Tocar no card abre o configurador em modo edição. As builds aparecem da mais recente pra mais antiga; editar uma build não muda a data de criação.

### 6.2 Ações

- **Filtrar** builds
- **Renomear** builds (lápis no card, abre um modal)
- **Excluir** builds (lixeira no card, pede confirmação)

**Critérios de filtro** (todos opcionais e combináveis, seção 11 item 5): carro base, marca, faixa de HP e compatibilidade.

- Carro base e marca: múltipla escolha, OU dentro do critério. As opções são só as dos carros que têm build salva.
- Faixa de HP, escolha única: Any, Under 200, 200 to 300, 300 to 400, 400 and up. Cada faixa é `[min, max)`: 300 HP cai em "300 to 400".
- Compatibilidade, escolha única: All, Compatible, With warnings.
- Entre critérios diferentes é E.

Sem nenhuma build salva, a tab mostra um estado vazio explicando como criar a primeira.

---

## 7. Tab: Assistant

**A interface está pronta. A resposta depende do backend (fase 4).**

Chatbot que tira dúvidas do usuário sobre carros, specs e configurações, usando uma API gratuita de LLM atrás do backend.

A tela (lista de mensagens, campo de texto, estado de carregando, sugestões) fala só com a interface `AssistantService` em `src/services/assistant.ts`. Hoje a implementação recusa toda mensagem com `AssistantUnavailableError` e a tela mostra isso como uma resposta do assistente ("offline for now"). Quando o backend existir, só esse arquivo muda. As mensagens ficam só em memória.

---

## 8. Tab: Settings

- **Theme** — System, Light ou Dark. System segue o aparelho; Light e Dark forçam o esquema. A escolha é salva no aparelho
- **About the project** — descrição do Garage64
- **About the creator** — perfil do autor
- **Links** — links pessoais/profissionais do autor

---

## 9. Design

**Identidade:** garagem de concessionária. Industrial, oficina, showroom.

**Cor de destaque:** amarelo — sempre. É a cor de ação, seleção e ênfase em todo o app.

**Temas:** light e dark, ambos completos. O amarelo é o destaque nos dois.

Consequência prática: nenhuma cor pode ser hardcoded em componente. Todo valor de cor sai de um objeto de tema central (`src/theme/colors.ts`), senão o toggle de tema não funciona.

**Amarelo no claro.** O amarelo de preenchimento (botões, switch, barras) é o mesmo nos dois temas. Mas o amarelo puro não tem contraste sobre branco, então o **texto e os ícones** em amarelo usam um âmbar mais escuro no tema claro (token `accentText`).

**Visual iOS.** No iOS 26+ o app usa o Liquid Glass do sistema: a tab bar flutuante nativa, os botões do header e as superfícies de card e de painel. Onde o vidro não existe (Android, web, iOS anterior ao 26, ou "Reduzir transparência" ligado) as superfícies caem numa cor sólida do tema. Conteúdo (listas de specs, textos) fica em superfície sólida; o vidro é pra controles e cards interativos.

**Web.** A web usa uma barra de tabs clássica, pintada com os mesmos tokens, e o botão de filtro vai no header como componente. O vidro e a tab bar nativa só existem nos apps nativos.

---

## 10. Modelo de dados

### Car (mock, somente leitura)

Fonte da verdade: `src/types/car.ts`. Os dados vivem em `src/data/carsMoch.ts`.

O `Car` **não é achatado**: são cinco grupos aninhados, e todo acesso passa pelo grupo (`car.info.model`, `car.performance.hp`, `car.specs.type`).

```
Car {
  info: {
    id: number
    brand, model: string
    year: number
    color: string
    image: string           // URL
    countryCode: string     // ISO 2 letras, ex.: "JP"
    generation: string
  }

  specs: {
    type: string            // ex.: "Sports Coupe"
    engine, engineLayout: string
    valves: number
    valvetrain: string
    displacement: number    // litros
    traction: string
    aspiration: string
    weight: number[]        // [kg, lb]
    transmission: string
    wheels: string
    steering: string
    brakes: string
  }

  performance: {
    hp: number
    torque: number[]        // [Nm, RPM]
    topSpeed: number[]      // [km/h, mph]
    acceleration: number    // 0-100 km/h, em segundos
    consumption: number     // km/L
  }

  rules: {
    allowAWD: boolean
    allowNOS: boolean
    allowedAspirations: string[]
    canChangeTraction: boolean
    maxHP: number
  }

  history: {
    curiosities: string[]
    appearances: string[]
  }
}
```

**Campos multivalor.** `weight`, `torque` e `topSpeed` são arrays de dois números, não escalares. A ordem é fixa e está anotada acima. Ler `car.performance.topSpeed` devolve um array, não um número.

### Build (criada pelo usuário)

Fonte da verdade: `src/types/build.ts`.

```
Build {
  id
  carId          → referência a Car.info.id
  name           → definido pelo usuário
  config: {
    displacement: number        // litros
    valves: number
    aspiration: "naturally-aspirated" | "supercharged" | "single-turbo" | "twin-turbo"
    transmission, wheels, steering, brakes: string   // id da opção, ou "factory"
    awd: boolean
    nos: boolean
  }
  computed       → mesma forma de Car.performance
  warnings[]     → { code, message }, avisos de compatibilidade no momento do salvamento
  createdAt      → ISO 8601
}
```

Builds ficam no AsyncStorage, anônimas e locais, sob a chave versionada `garage64:builds:v1`. A leitura é defensiva: JSON corrompido vira lista vazia e itens inválidos são descartados, sem derrubar o app.

**Princípio 1:** a Build guarda a **referência** ao carro, não uma cópia dos dados dele.

**Princípio 2:** `Car.specs` descreve apenas o que saiu de fábrica. Toda modificação — inclusive opções que nenhum carro tem de origem, como NOS — existe somente em `Build.config`. O configurador lê `Car.specs` para definir o valor inicial de cada controle e `Car.rules` para saber o que é permitido, mas nunca escreve no `Car`.

---

## 11. Pontos em aberto

Itens que precisam de decisão antes ou durante a construção.

1. **Fórmulas de cálculo.** Como cada spec afeta HP, torque, top speed, acceleration e consumption? Não está definido. É o coração do app e precisa ser escrito antes de codar o motor de cálculo. Resposta: ainda não comecei a estudar a arte liberal da aritmética por falta de tempo depois de ter tido uma péssima formação na escola. Então, aceito sugestões de cálculos que o agente der. **Resolvido:** modelo proposto e implementado, ver seção 5.5. Os coeficientes são uma proposta para revisão.

2. **Persistência das builds na v1.** O mock é local e somente leitura. Onde as builds salvas ficam? Memória (some ao fechar o app), AsyncStorage (persiste local) ou Supabase já na v1? Resposta: Localmente, em AsyncStorage.

3. **Autenticação.** "Builds do usuário" implica usuário. Tem login? Se sim, Supabase Auth. Se não, as builds são anônimas e locais. Resposta: anônimas e locais na v1.

4. **Next.js + Supabase — sobreposição.** O Supabase já expõe API própria e o app pode consumir direto pelo SDK. Se existe backend Next.js, ele precisa de responsabilidade própria: lógica de cálculo no servidor, chaves de API protegidas, integração com o Assistant. Sem isso, é uma camada a mais sem função. Resposta: é isso mesmo.

5. **Critérios de filtro na tab Builds.** Por carro base? Por marca? Por faixa de HP? Por compatibilidade? Resposta: todos os critérios são opcionais e podem ser combinados.

6. **Build inválida.** Salva com aviso ou bloqueia o botão? Resposta: aviso.

7. **Imagens dos carros.** De onde vêm e sob qual licença? Projeto de portfólio público com imagens de terceiros é risco real de direito autoral. Resposta: já tem.

8. **História em prosa.** Versões anteriores desta spec previam um texto corrido de história por carro, na Car Detail. O modelo atual não tem esse campo — `history` só guarda `curiosities[]` e `appearances[]`. Manter só as listas, ou acrescentar um campo de texto e preencher os 14 carros do mock? Resposta: só as listas do mock. Não haverá campo de história em prosa.

9. **NOS não é campo de `specs`.** A seção 5.1 prevê um toggle de NOS e `rules.allowNOS` existe, mas nenhum carro tem NOS nas especificações de fábrica — o que faz sentido, já que é modificação, não item original. Confirma que opções assim vivem só na `config` da Build, nunca em `Car.specs`? Resposta: sim. `Car.specs` guarda apenas o que saiu de fábrica; modificações vivem só na `config` da Build.

10. **Campo `color`.** Existe em `info` e está preenchido nos 14 carros, mas nenhuma tela da spec o exibe. É dado morto ou entra na Car Detail? Resposta: entra na Car Detail.

11. **Distribuição.** Como alguém que não é o autor abre o app no celular? Resposta: link web mais APK Android. Consequência: a seção 12 deixou de proibir a versão web, e a web ganhou um layout de tabs próprio. Plano em `docs/deploy.md`.

12. **Tração contraditória nos dados.** `canChangeTraction` é `false` nos 14 carros, mas `allowAWD` é `true` no Supra (que é RWD de fábrica). Ligar AWD nele gera o aviso de mudança de tração, porque a regra mais restritiva vale. Se a intenção era permitir, `canChangeTraction` do Supra precisa virar `true`.

---

## 12. Fora de escopo

Definir o que o app **não** faz é o que impede o escopo de inchar.

- Não é rede social. Sem perfil público, sem seguir, sem curtir, sem comentar.
- Não vende nada. Sem marketplace, sem anúncio, sem checkout.
- Não tem dados reais de performance. Todos os cálculos são simulados por modelo próprio.
- Não tem edição de catálogo pelo usuário. O catálogo é fixo.
- Não tem compartilhamento de builds entre usuários.
- Não tem recursos exclusivos da web. A versão web existe só como forma de distribuição (seção 11, item 11): sem o vidro e a tab bar nativa do iOS.

---

## 13. Fases

**Fase 1 — v1 completa, sem backend**
App inteiro rodando com mock local: Catalog, Car Detail, Build Configurator (controles + cálculo em tempo real + validação), Builds (listagem, nomeação, filtro), Settings (tema, about, links).
É aqui que mora o aprendizado de React Native.

**Estado:** o frontend da fase 1 está completo. O que sobra depende de backend: contas e armazenamento (fase 2), cálculo e chaves no servidor (fase 3) e a resposta do Assistant (fase 4).

**Fase 2 — Persistência**
Supabase: autenticação e armazenamento das builds. Migrar o catálogo do mock pro banco. O plano de deploy está em `docs/deploy.md`.

**Fase 3 — Backend Next.js**
Somente se a decisão do ponto 4 da seção 11 justificar a existência dele. Resposta: justificada.

**Fase 4 — Assistant**
Chatbot. Último.
