# Yoshimura — visão técnica e funcional

Frente nova e independente (D-27, D-28). Código em `docs/yoshimura/`. Este documento não contém dados pessoais e deve continuar assim.

## Estado (16/11/2026)

| Item | Estado |
|---|---|
| Estrutura modular, domínio, persistência, export/import, dados demo | implementado e testado (ver `CONTINUIDADE.md`) |
| Telas funcionais: Hoje, Treinos (lista/sessão/registro), Dados | implementado, aparência **provisória** |
| Identidade visual do Figma | **não aplicada** — o arquivo Figma não pôde ser aberto na sessão (URL fora da allowlist; conector Figma não instalado). Nenhum frame, token ou fonte foi inventado |
| Biblioteca de exercícios, Progressões, Mobilidade, Evolução, Configurações | **não implementadas** (dependem do Figma e de decisões) |
| Autenticação, backend, sincronização, offline/PWA | **não existem**; nenhuma alegação de privacidade |
| Publicação | não publicado |

## Limites de privacidade

O repositório e o GitHub Pages são públicos. Tudo em `docs/yoshimura/` é legível por qualquer pessoa. O app usa somente dados **sintéticos** (rotulados "demonstração"). Os dados digitados ficam no `localStorage` do navegador, sob `yoshimura:v1:*`: sem login, criptografia, backup automático ou sincronização. Não inserir dados reais de saúde ou de treino.

## Árvore

```text
docs/yoshimura/
  index.html                  shell (links relativos; funciona em subdiretório)
  styles/tokens.css           tokens PROVISÓRIOS (substituir pelo Figma)
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
  scripts/components/dom.js   helper h(): só textContent, nunca innerHTML
  scripts/pages/              hoje.js, treinos.js, dados.js
  tests/domain.test.mjs       testes node:test (domínio, storage, import/export)
  assets/                     vazio (sem imagens de referência)
```

## Modelo de dados (esquema v1)

`{ schema, demo, exercises[], plan{sessions[]{prescriptions[]}}, logs[] }`. IDs estáveis com prefixo (`ex_`, `rx_`, `ss_`, `lg_`), nunca índice. Prescrição (`plan`) e execução (`logs`) são separadas; cada log guarda um **snapshot** da prescrição, então editar a prescrição não altera o histórico. Datas de log em `AAAA-MM-DD` local. Campos de alvo e de série são opcionais (repetições, carga, tempo, distância, assistência). Importação valida tipos, limites, IDs únicos e referências antes de aplicar; ao substituir, o estado anterior é copiado para `yoshimura:v1:backup-before-import`.

## Para privacidade real (decisão de Dani, não implementada)

Requer autenticação real e autorização validada no servidor/banco (políticas por usuário/atleta), isolamento de dados, recuperação de conta e gestão de acesso; credenciais administrativas nunca no frontend. Opções (ex.: backend gerenciado com RLS, ou app privado fora do Pages) trazem custo de manutenção, conta/serviço de terceiro e política de backup. Escolha pendente.
