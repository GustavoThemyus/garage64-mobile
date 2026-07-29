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
3. **Assistant** _(fora da v1)_
4. **Settings**

**Telas fora das tabs:**

- **Car Detail** — sobrepõe a tela de Catalog (modal ou stack por cima). Não é tab.
- **Build Configurator** — acessado de dentro do Car Detail.

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

### 4.2 Car Detail

Tela sobreposta ao Catalog. Exibe **todos** os dados do carro presentes no mock:

- Imagem
- Identificação (nome, marca, modelo, ano, geração, país, década, tipo)
- História
- Curiosidades
- Especificações padrão completas

Ao final da tela: botão **"Create build"** e **"Compare"**. O comparador ainda permanece nessa tela e ficará abaixo do botão de Create build. Ao clicar em compare, o comparador se expande pra baixo. Surge um botão de "choose car" que o usuário pode clicar para selecionar um carro para comparar. Assim que clica, o carro aparece com a comparação em barras com os dois. Um ponteiro em cada barra indica a diferença entre os dois carros, com uma cor verde pro que for mais positivo naquela característica e uma cor vermelha pro que for mais negativo. O indicador fica no máximo do positivo, e a parte vermelho no carro que for pior, fica vermelho da parte que ele está até o teto que o outro ocupa.

---

## 5. Build Configurator

Acessado pelo botão "Create build" dentro do Car Detail.

### 5.1 Controles

Todos os controles são listados **verticalmente, um por linha**.

Todo controle **inicia no valor padrão do carro**, vindo do mock.

| Tipo de controle           | Aplicado a                                                                                       | Comportamento                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Slider**                 | Specs numéricas ajustáveis (ex.: `displacement`, `valves`)                                       | Faixa contínua ou por passos, começando no valor de fábrica                                         |
| **Toggle (Switch nativo)** | Specs binárias (ex.: `AWD`, `NOS`)                                                               | Switch nativo da plataforma — muda de cor no padrão iOS/Android automaticamente. Sem texto "yes/no" |
| **Escolha única**          | `aspiration`, `transmission`, `wheels`, `steering`, `brakes` e demais campos categóricos do mock | Segmented control ou grupo de botões; exatamente uma opção ativa                                    |

> O conjunto exato de controles é derivado do mock. Todo campo configurável presente nos dados do carro vira um controle.

### 5.2 Saída em tempo real

Abaixo dos controles, um painel que **recalcula a cada alteração**, sem botão de confirmação:

- HP
- Torque
- Top speed
- Acceleration
- Consumption

### 5.3 Validação de compatibilidade

Junto da saída, antes de salvar, o app exibe se o carro **suporta** a configuração montada.

As restrições vêm do próprio mock, por carro. Exemplos do modelo:

- Carro X não aceita AWD
- Carro Y não aceita twin-turbo
- NOS exige motor reforçado

**Comportamento:** configuração inválida é **exibida como aviso**, não bloqueada silenciosamente. O usuário vê o que está errado e por quê.

> **Decisão em aberto:** build inválida pode ser salva com o aviso anexado, ou o botão de salvar fica desabilitado? Ver seção 11. Resposta: pode salvar com o aviso anexado.

### 5.4 Salvar

Botão **"Save build"** ao final.

Ao salvar, a build recebe um **nome** definido pelo usuário.

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
- Indicador de compatibilidade

### 6.2 Ações

- **Filtrar** builds
- **Nomear / renomear** builds

> **Decisão em aberto:** filtrar por quais critérios? Ver seção 11. Respondido na seção 11.

---

## 7. Tab: Assistant

**Fora da v1. Última coisa a ser construída.**

Chatbot que tira dúvidas do usuário sobre carros, specs e configurações, usando uma API gratuita de LLM.

Especificação detalhada será escrita quando a v1 estiver entregue. Não planejar agora.

---

## 8. Tab: Settings

- **Theme** — alternar entre light e dark
- **About the project** — descrição do Garage64
- **About the creator** — perfil do autor
- **Links** — links pessoais/profissionais do autor

---

## 9. Design

**Identidade:** garagem de concessionária. Industrial, oficina, showroom.

**Cor de destaque:** amarelo — sempre. É a cor de ação, seleção e ênfase em todo o app.

**Temas:** light e dark, ambos completos. O amarelo é o destaque nos dois.

Consequência prática: nenhuma cor pode ser hardcoded em componente. Todo valor de cor sai de um objeto de tema central, senão o toggle de tema não funciona.

---

## 10. Modelo de dados

### Car (mock, somente leitura)

```
id
name, brand, model, year, generation
type, country, decade
image
history, trivia[], appearances[]

defaultSpecs: {
  aspiration, displacement, valves, hp, torque,
  weight, drivetrain, transmission, wheels,
  brakes, steering, topSpeed, acceleration, consumption
}

rules: {
  // restrições de compatibilidade por carro
}
```

### Build (criada pelo usuário)

```
id
carId          → referência ao Car base
name           → definido pelo usuário
config         → todas as escolhas feitas no configurador
computed       → { hp, torque, topSpeed, acceleration, consumption }
warnings[]     → avisos de compatibilidade no momento do salvamento
createdAt
```

**Princípio:** a Build guarda a **referência** ao carro, não uma cópia dos dados dele.

---

## 11. Pontos em aberto

Itens que precisam de decisão antes ou durante a construção.

1. **Fórmulas de cálculo.** Como cada spec afeta HP, torque, top speed, acceleration e consumption? Não está definido. É o coração do app e precisa ser escrito antes de codar o motor de cálculo. Resposta: ainda não comecei a estudar a arte liberal da aritmética por falta de tempo depois de ter tido uma péssima formação na escola. Então, aceito sugestões de cálculos que o agente der.

2. **Persistência das builds na v1.** O mock é local e somente leitura. Onde as builds salvas ficam? Memória (some ao fechar o app), AsyncStorage (persiste local) ou Supabase já na v1? Resposta: Localmente, em AsyncStorage.

3. **Autenticação.** "Builds do usuário" implica usuário. Tem login? Se sim, Supabase Auth. Se não, as builds são anônimas e locais. Resposta: anônimas e locais na v1.

4. **Next.js + Supabase — sobreposição.** O Supabase já expõe API própria e o app pode consumir direto pelo SDK. Se existe backend Next.js, ele precisa de responsabilidade própria: lógica de cálculo no servidor, chaves de API protegidas, integração com o Assistant. Sem isso, é uma camada a mais sem função. Resposta: é isso mesmo.

5. **Critérios de filtro na tab Builds.** Por carro base? Por marca? Por faixa de HP? Por compatibilidade? Resposta: todos os critérios são opcionais e podem ser combinados.

6. **Build inválida.** Salva com aviso ou bloqueia o botão? Resposta: aviso.

7. **Imagens dos carros.** De onde vêm e sob qual licença? Projeto de portfólio público com imagens de terceiros é risco real de direito autoral. Resposta: já tem.

---

## 12. Fora de escopo

Definir o que o app **não** faz é o que impede o escopo de inchar.

- Não é rede social. Sem perfil público, sem seguir, sem curtir, sem comentar.
- Não vende nada. Sem marketplace, sem anúncio, sem checkout.
- Não tem dados reais de performance. Todos os cálculos são simulados por modelo próprio.
- Não tem edição de catálogo pelo usuário. O catálogo é fixo.
- Não tem compartilhamento de builds entre usuários.
- Não tem versão web.

---

## 13. Fases

**Fase 1 — v1 completa, sem backend**
App inteiro rodando com mock local: Catalog, Car Detail, Build Configurator (controles + cálculo em tempo real + validação), Builds (listagem, nomeação, filtro), Settings (tema, about, links).
É aqui que mora o aprendizado de React Native.

**Fase 2 — Persistência**
Supabase: autenticação e armazenamento das builds. Migrar o catálogo do mock pro banco.

**Fase 3 — Backend Next.js**
Somente se a decisão do ponto 4 da seção 11 justificar a existência dele. Resposta: justificada.

**Fase 4 — Assistant**
Chatbot. Último.
