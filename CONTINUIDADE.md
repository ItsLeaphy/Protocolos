# CONTINUIDADE.md — Entrada para novas sessões

Leia [CLAUDE.md](CLAUDE.md) primeiro. Este documento só resume e aponta; os detalhes ficam nos documentos indicados.

**Conferido em:** 03/11/2026 · HEAD `2ba1f83` (`main`). Reconfira o HEAD antes de agir.

## Estado atual

- Desenvolvimento ativo **somente no Toji** (musculação, facial, mobilidade). Maki e Megumi congelados.
- A **V4** da musculação está no site desde 10/10/2026. Facial e mobilidade ainda não têm conteúdo nem implementação.
- Houve uma auditoria técnica em 03/11/2026. **Não refazer.** O relatório completo não está no repositório (ver lacuna L-1 em `DECISOES.md`).
- A etapa de documentação foi concluída sem alterar código, fichas, armazenamento nem históricos.

## Decisões aprovadas

- **Escopo e frentes:** só Toji; três frentes (D-17, D-18).
- **Arquitetura:** modular simples, HTML/CSS/JS nativos, GitHub Pages; armazenamento local versionado com IDs estáveis; backup (exportar/importar com validação) obrigatório; histórico independente da posição; privacidade; offline desejado (D-19 a D-24).
- **Ficha de musculação pós-V4:** oito decisões aprovadas (D-09 a D-16), listadas em `docs/TOJI.md` §5.

## O que está implementado

- Ficha de musculação V4 (Push A, Legs A, Pull A, Push B, Legs B, Pull B) em `docs/toji/index.html`.
- Registro de cargas com histórico no `localStorage`, reordenação manual, tema claro/escuro, tentativa de PWA (com falhas conhecidas).

## O que está pendente

1. **Ficha:** aplicar as decisões D-09, D-10, D-12, D-13, D-16 (as demais já refletem o site). Antes, resolver L-2 (dips) e L-3 (peck-deck/fly).
2. **Técnico** (achados da auditoria): chaves de armazenamento, datas em UTC, histórico de um registro por data, backup, IDs permanentes, service worker via Blob.
3. **Privacidade:** decidir o que fazer com os dados pessoais já expostos (D-23, L-9). Nada foi feito.
4. **Conteúdo:** facial e mobilidade (L-4).
5. **Documentos:** relatório de 03/11 em `auditoria/` (L-1); preencher ou remover os stubs `auditoria/*.md` (L-10).

## Próxima tarefa

**Não há próxima tarefa definida em decisão registrada.** O usuário escolhe. Ponto de partida natural (sugestão, não aprovada): com o relatório de 03/11 em mãos, ordenar as correções do item 2 e 3 acima, com backup antes de qualquer mudança de armazenamento.

## Onde consultar

| Assunto | Documento |
|---|---|
| Regras de trabalho, privacidade, o que exige autorização | [CLAUDE.md](CLAUDE.md) |
| Por que e quando algo foi decidido; estado de cada decisão; lacunas | [DECISOES.md](DECISOES.md) |
| Ficha atual, mudanças pós-V4, facial, mobilidade, preferências | [docs/TOJI.md](docs/TOJI.md) |
| Histórico detalhado do Toji (V0–V4, comparações, origem de cada escolha) | [1-toji-dani-contexto-auditoria.md](1-toji-dani-contexto-auditoria.md) — *histórico; contém dados pessoais* |
| Histórico do Maki / do Megumi (congelados) | `2-maki-helena-…md` / `3-megumi-diego-…md` — *histórico; contêm dados pessoais* |
| Construção visual do site Toji (v2, skate/old-school) | [auditoria-protocolo-toji.md](auditoria-protocolo-toji.md) — *histórico; pode divergir da V4* |
| Auditoria técnica de 03/11/2026 | ausente do repositório (L-1) |
| Código | `docs/index.html`, `docs/toji/`, `docs/maki/`, `docs/megumi/` |

Também preservados sem alteração: `auditoria/` (stubs `TODO`) e `files (1).zip` (cópia dos três históricos).
