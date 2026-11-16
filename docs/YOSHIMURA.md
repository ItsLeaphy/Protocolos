# Yoshimura — visão técnica e funcional

Frente nova e independente (D-27, D-28). Código em `docs/yoshimura/`. Este documento não contém dados pessoais e deve continuar assim.

## Estado (16/11/2026)

| Item | Estado |
|---|---|
| Estrutura modular, domínio, persistência, export/import, dados demo | implementado e testado (ver `CONTINUIDADE.md`) |
| Telas: Hoje, Treinos (lista, sessão com registro), Trilhas, Mob., Dados | implementadas; Hoje, Treinos e Sessão seguem os frames do Figma (copy provisória do próprio design como estado vazio). Trilhas usa a copy do Figma; **Mob. e Dados não têm frame** (placeholder / utilitário) |
| Tokens, tipografia, tema claro/escuro | aplicados a partir do arquivo `.fig` enviado por Dani (decodificado localmente; 21 variáveis nas coleções Risograph e Afterhours, 25 textos de fonte). Fontes hospedadas em `assets/fonts/` (OFL-1.1) |
| Ilustrações/texturas (risografia, vetores dos frames) | **não implementadas** — 1100 vetores do Figma não foram portados; nenhum asset foi inventado |
| Biblioteca de exercícios, conteúdo de Trilhas/Mobilidade, Evolução | **não implementadas** (dependem de conteúdo e decisões) |
| Autenticação, backend, sincronização, offline/PWA | **não existem**; nenhuma alegação de privacidade |
| Publicação | não publicado |

## Escopo definido por Dani (16/11/2026)

Protótipo **público**, para uso no celular. Esta etapa entrega só a base; código das telas e conteúdo vêm depois. O saneamento de dados sensíveis de Toji/Maki/Megumi é tratado em outro projeto e está fora do escopo do Yoshimura.

## Limites de privacidade

O repositório e o GitHub Pages são públicos. Tudo em `docs/yoshimura/` é legível por qualquer pessoa. O app usa somente dados **sintéticos** (rotulados "demonstração"). Os dados digitados ficam no `localStorage` do navegador, sob `yoshimura:v1:*`: sem login, criptografia, backup automático ou sincronização. Não inserir dados reais de saúde ou de treino.

## Árvore

```text
docs/yoshimura/
  index.html                  shell (links relativos; funciona em subdiretório)
  styles/fonts.css            @font-face locais
  styles/tokens.css           tokens do Figma (--yoshimura-riso-*, --yoshimura-dark-*) + semânticos --y-*
  styles/base.css             reset, tipografia, navegação, foco
  styles/components.css       cartões, botões, formulários, avisos
  scripts/main.js             roteador por hash e render
  scripts/app-state.js        estado em memória + assinatura; persiste via adapter
  scripts/domain/schema.js    constantes, limites, IDs, data local, fábricas
  scripts/domain/validators.js validação de estado/importação (sem exceções)
  scripts/domain/operations.js operações puras (editar prescrição, registrar log)
  scripts/data/demo-data.js   dados sintéticos
  scripts/services/storage.js adapter load/save/clear; namespace guardado
  scripts/services/export-import.js export JSON, parse validado, aplicação com cópia prévia
  scripts/services/theme.js   tema claro/escuro (chave yoshimura:v1:theme; padrão = sistema)
  scripts/components/dom.js   helper h(): só textContent, nunca innerHTML
  scripts/components/ui.js    cabeçalho de tela e dias da semana
  scripts/pages/              hoje.js, treinos.js, outras.js (Trilhas, Mob.), dados.js
  tests/domain.test.mjs       testes node:test (domínio, storage, import/export)
  assets/fonts/               Cormorant Garamond, Space Grotesk, Chakra Petch, Zen Maru Gothic (subset ヨシムラ) + LICENSES.md
```

## Modelo de dados (esquema v1)

`{ schema, demo, exercises[], plan{sessions[]{prescriptions[]}}, logs[] }`. IDs estáveis com prefixo (`ex_`, `rx_`, `ss_`, `lg_`), nunca índice. Prescrição (`plan`) e execução (`logs`) são separadas; cada log guarda um **snapshot** da prescrição, então editar a prescrição não altera o histórico. Datas de log em `AAAA-MM-DD` local. Campos de alvo e de série são opcionais (repetições, carga, tempo, distância, assistência). Importação valida tipos, limites, IDs únicos e referências antes de aplicar; ao substituir, o estado anterior é copiado para `yoshimura:v1:backup-before-import`.

## Para privacidade real (decisão de Dani, não implementada)

Requer autenticação real e autorização validada no servidor/banco (políticas por usuário/atleta), isolamento de dados, recuperação de conta e gestão de acesso; credenciais administrativas nunca no frontend. Opções (ex.: backend gerenciado com RLS, ou app privado fora do Pages) trazem custo de manutenção, conta/serviço de terceiro e política de backup. Escolha pendente.

## Desvios deliberados em relação ao Figma

- **Tamanho de texto:** rótulos de 8–10 px e textos de 9–12 px no Figma subiram para mínimo 11 px (rótulos) e 14 px (corpo), por legibilidade no celular.
- **Cor de texto:** o `coral` do Figma tem contraste 3,5:1 (claro) sobre o canvas; não é usado para texto. Erros usam `--y-danger` (derivado: `#9B2C20` claro, `#E58C7B` escuro). Rótulos sobre `plum` usam `white`.
- **Desktop:** o design é só mobile (390×844); em telas largas o app fica numa coluna central de 480 px.
- **Tab bar:** Hoje, Treinos, Trilhas, Mob. (como no Figma). Dados fica como utilitário no rodapé, fora do design.
- **Tema:** claro (Risograph) e escuro (Afterhours) com botão; sem escolha salva, segue o sistema.

## Cobertura de testes (16/11/2026)

`node --test docs/yoshimura/tests/domain.test.mjs` (8) e verificação em Chromium via servidor HTTP em subdiretório (55 checagens: navegação, formulários, persistência, export/import, isolamento de chaves, tema, fontes locais, nenhuma requisição externa, sem overflow em 360/390/430/1440 px, sem texto "null"). O portal (`docs/index.html`) ainda carrega Google Fonts por conta própria; o Yoshimura não.
