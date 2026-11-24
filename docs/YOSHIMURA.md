# Yoshimura — visão técnica e funcional

Frente nova e independente (D-27, D-28). Código em `docs/yoshimura/`. Este documento não contém dados pessoais e deve continuar assim.

## Estado (24/11/2026)

| Item | Estado |
|---|---|
| Estrutura modular, domínio, persistência, export/import, dados demo | implementado e testado (ver `CONTINUIDADE.md`) |
| Gerenciador de programação v1 (24/11/2026) | **implementado e testado** (21 testes `node --test`; Chromium 360/390/430 px): criar/editar/excluir sessão (uma por dia, seg–sex), criar/editar exercício, adicionar/remover/reordenar exercícios na sessão, editar prescrição. Rotas dentro de Treinos (`#/treinos/editar`, `/nova`, `/exercicios`, `/<id>/editar`); sem nova aba. **Não testado:** aparelho real, leitor de tela |
| Telas: Hoje, Treinos (lista, sessão com registro), Trilhas, Mob., Dados | implementadas; Hoje, Treinos e Sessão seguem os frames do Figma (copy provisória do próprio design como estado vazio). Trilhas usa a copy do Figma; **Mob. e Dados não têm frame** (placeholder / utilitário) |
| Tokens, tipografia, tema claro/escuro | aplicados a partir do arquivo `.fig` enviado por Dani (decodificado localmente; 21 variáveis nas coleções Risograph e Afterhours, 25 textos de fonte). Fontes hospedadas em `assets/fonts/` (OFL-1.1) |
| Ilustrações | **portadas do Figma** (17/11/2026): disco risograph (com meio-tom e anéis) e onda sonora, como SVG em `scripts/components/art.js`, com cores `var(--y-*)` que trocam com o tema. Textura/grão de papel **não** existe no Figma e não foi inventada |
| Biblioteca de exercícios, conteúdo de Trilhas/Mobilidade, Evolução | **não implementadas** (dependem de conteúdo e decisões) |
| Instalação no celular (PWA) e offline | **implementado e testado em Chromium desktop**: `manifest.webmanifest`, ícones PNG, `sw.js` real (nunca Blob), escopo só de `docs/yoshimura/`. Android/Chrome: botão "Instalar app" na tela Dados quando o navegador permitir. iPhone: instrução manual (Compartilhar → Adicionar à Tela de Início). **Não testado em aparelho real** |
| Autenticação, backend, sincronização | **não existem**; nenhuma alegação de privacidade |
| Publicação | commits direto na `main` (autorizado por Dani); Pages não verificado |

## Escopo definido por Dani (16/11/2026)

Protótipo **público**, para uso no celular. Esta etapa entrega só a base; código das telas e conteúdo vêm depois. O saneamento de dados sensíveis de Toji/Maki/Megumi é tratado em outro projeto e está fora do escopo do Yoshimura.

## Limites de privacidade

O repositório e o GitHub Pages são públicos. Tudo em `docs/yoshimura/` é legível por qualquer pessoa. O app usa somente dados **sintéticos** (rotulados "demonstração"). Os dados digitados ficam no `localStorage` do navegador, sob `yoshimura:v1:*`: sem login, criptografia, backup automático ou sincronização. Não inserir dados reais de saúde ou de treino.

## Árvore

```text
docs/yoshimura/
  index.html                  shell (links relativos; funciona em subdiretório)
  manifest.webmanifest        manifesto PWA (start_url/scope relativos)
  sw.js                       service worker: pré-cache do shell + rede primeiro com fallback ao cache
  scripts/services/install.js registro do SW e fluxo de instalação
  styles/fonts.css            @font-face locais
  styles/tokens.css           tokens do Figma (--yoshimura-riso-*, --yoshimura-dark-*) + semânticos --y-*
  styles/base.css             reset, tipografia, navegação, foco
  styles/components.css       cartões, botões, formulários, avisos
  scripts/main.js             roteador por hash e render
  scripts/app-state.js        estado em memória + assinatura; persiste via adapter
  scripts/domain/schema.js    constantes, limites, IDs, data local, fábricas
  scripts/domain/validators.js validação de estado/importação (sem exceções)
  scripts/domain/operations.js operações puras (sessões, exercícios, prescrições, registro de log)
  scripts/data/demo-data.js   dados sintéticos
  scripts/services/storage.js adapter load/save/clear; namespace guardado
  scripts/services/export-import.js export JSON, parse validado, aplicação com cópia prévia
  scripts/services/theme.js   tema claro/escuro (chave yoshimura:v1:theme; padrão = sistema)
  scripts/components/dom.js   helper h(): só textContent, nunca innerHTML
  scripts/components/ui.js    cabeçalho de tela e dias da semana
  scripts/pages/              hoje.js, treinos.js, edicao.js (edição da programação), outras.js (Trilhas, Mob.), dados.js
  tests/domain.test.mjs       testes node:test (domínio, storage, import/export)
  tests/programacao.test.mjs  testes do gerenciador (sessões, exercícios, prescrições, histórico, persistência)
  tests/shell.test.mjs        garante que a lista SHELL do sw.js bate com os arquivos
  assets/icons/               ícones do app (gerados a partir dos glifos da marca)
  assets/fonts/               Cormorant Garamond, Space Grotesk, Chakra Petch, Zen Maru Gothic (subset ヨシムラ) + LICENSES.md
```

## Modelo de dados (esquema v1)

`{ schema, demo, exercises[], plan{sessions[]{prescriptions[]}}, logs[] }`. IDs estáveis com prefixo (`ex_`, `rx_`, `ss_`, `lg_`), nunca índice. Prescrição (`plan`) e execução (`logs`) são separadas; cada log guarda um **snapshot** da prescrição, então editar a prescrição não altera o histórico. Datas de log em `AAAA-MM-DD` local. Campos de alvo e de série são opcionais (repetições, carga, tempo, distância, assistência). Importação valida tipos, limites, IDs únicos e referências antes de aplicar; ao substituir, o estado anterior é copiado para `yoshimura:v1:backup-before-import`.

## Para privacidade real (decisão de Dani, não implementada)

Requer autenticação real e autorização validada no servidor/banco (políticas por usuário/atleta), isolamento de dados, recuperação de conta e gestão de acesso; credenciais administrativas nunca no frontend. Opções (ex.: backend gerenciado com RLS, ou app privado fora do Pages) trazem custo de manutenção, conta/serviço de terceiro e política de backup. Escolha pendente.

## Gerenciamento de programação (24/11/2026)

- **Primeira abertura:** estado vazio (`emptyState()`), nada gravado até a primeira alteração. O plano de integração embutido foi removido; a programação é criada pelo usuário. Dados salvos antes (inclusive o plano antigo já gravado) não são tocados; namespace e esquema continuam `yoshimura:v1:*` / v1.
- **Camadas:** Exercícios (`exercises`: nome, modalidade, tipos de registro), Programação (`plan.sessions`, uma por dia 1–5), Prescrição (`prescriptions[].target`, alvo começa vazio, nenhum número inventado), Execução (`logs`, com snapshot da prescrição). Tudo por ID permanente.
- **Regras:** excluir sessão não apaga registros (`sessionId` do log vira `null`); remover exercício da sessão não apaga exercício nem registros; exercício só é excluído sem registros e fora de sessões; nomes de exercício únicos (sem distinguir caixa/acento); editar exercício vale para todas as sessões.
- **Fora do escopo desta versão:** player de sessão, cronômetro de descanso, gráficos, biblioteca avançada, trilhas, mobilidade, multiatleta, contas, sincronização. Mais de um exercício por sessão em dias repetidos e arrastar para reordenar (hoje: Subir/Descer) ficam como melhoria.

## Desvios deliberados em relação ao Figma

- **Tamanho de texto:** os tamanhos do Figma foram restaurados (medidas conferidas em 390 px: cartão destaque em y=184, dias em y=470, progresso em y=537, nav em y=754, iguais ao Figma). Único desvio: 8 px sobe para 9 px. O tracking do Figma está em % do corpo e foi usado em `em`.
- **Pílula de status ("A DEFINIR"):** o texto `ink` do Figma sobre coral dá contraste ~3:1; usa `--y-on-coral` (`#1B1416`).
- **Numerais (01–05):** `plum` do Figma sobre superfície escura dá ~1,7:1; no tema escuro usam `amber` (`--y-numeral`).
- **Marca "+":** o disco do Figma inclui uma marca de registro; foi mantida.
- **Cor de texto:** o `coral` do Figma tem contraste 3,5:1 (claro) sobre o canvas; não é usado para texto. Erros usam `--y-danger` (derivado: `#9B2C20` claro, `#E58C7B` escuro). Rótulos sobre `plum` usam `white`.
- **Desktop:** o design é só mobile (390×844); em telas largas o app fica numa coluna central de 430 px.
- **Tab bar:** Hoje, Treinos, Trilhas, Mob. (como no Figma). Dados fica como utilitário no rodapé, fora do design.
- **Tema:** claro (Risograph) e escuro (Afterhours) com botão; sem escolha salva, segue o sistema.

## Cobertura de testes (16/11/2026)

`node --test docs/yoshimura/tests/*.test.mjs` (21 testes) e verificação em Chromium via servidor HTTP em subdiretório (55 checagens: navegação, formulários, persistência, export/import, isolamento de chaves, tema, fontes locais, nenhuma requisição externa, sem overflow em 360/390/430/1440 px, sem texto "null"). O portal (`docs/index.html`) ainda carrega Google Fonts por conta própria; o Yoshimura não.

## PWA e offline: como funciona e limites

- **Ao adicionar/renomear arquivo do app, atualize a lista `SHELL` em `sw.js`** (o teste `shell.test.mjs` falha se faltar). Mudou muito? Incremente `VERSION` em `sw.js`.
- Estratégia: rede primeiro, cache como reserva; com internet o app atualiza sozinho, sem internet abre do cache. Os dados do usuário ficam no `localStorage` e não passam pelo cache.
- O portal e o Toji usam manifesto/service worker via `Blob` (padrão que não funciona de forma confiável) e **não foram alterados**; o SW do Yoshimura não os controla (escopo restrito, verificado).
- Verificado (Chromium/Playwright, `localhost`): registro e ativação, abrir offline, navegar offline, persistência de dados offline, fontes offline, manifesto e ícones. **Não verificado:** instalação real em Android/iOS, comportamento do prompt de instalação (não dispara em headless) e atualização do SW entre versões.

## Paleta: edição manual de Dani vs. Figma (registrado em 17/11/2026)

`styles/tokens.css` tinha sido editado à mão (plum `#3C1925`, amber `#721322` nos dois temas). Originais do Figma: claro plum `#4A3440` e amber `#D8A86C`; escuro plum `#564752` e amber `#D8A86C`. No tema escuro o amber `#721322` ficava quase invisível (numerais, ondas, anel, pílula ativa), então o **escuro voltou aos valores do Figma**. O **claro mantém a edição de Dani**; nele o anel/amber do disco tem baixo contraste sobre o plum. Voltar ao Figma é trocar 2 valores na linha 6 de `tokens.css`.
