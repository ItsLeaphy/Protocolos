# CONTINUIDADE.md — Onde estamos e como continuar

Ponto de entrada para retomar o projeto. Leia [CLAUDE.md](CLAUDE.md) primeiro. Este documento responde **onde estamos e como continuar**; o *porquê* das decisões está em [DECISOES.md](DECISOES.md) e a *definição técnica do Toji* em [docs/TOJI.md](docs/TOJI.md).

## Última versão conferida

| Item | Valor |
|---|---|
| Branch / HEAD conferido | `main` · `f35f989` (merge do PR #2), em 03/11/2026 |
| Commit de implementação da ficha | `0ca8442` (PR #2) |
| Documentação anterior | `5228af3` (PR #1, mergeado em `077dad7`) |
| Publicação | Deploy do GitHub Pages para `f35f989` com estado `success` (consultado via API em 03/11/2026) |

O HEAD pode ter mudado. **Reconfira antes de agir** e atualize esta tabela ao final do seu trabalho.

## Estado em uma frase

O Toji é o único protocolo ativo. A ficha de musculação pós-V4 (D-09 a D-16) está **implementada, publicada e validada por Dani em dispositivo real**. A próxima frente técnica é o **backup (D-21)**; ainda não foi iniciada.

## Decidido · implementado · testado · validado · publicado

| Item | Decidido | Implementado | Testado / validado | Publicado |
|---|---|---|---|---|
| Ficha de musculação pós-V4 (D-09 a D-16) | sim | sim (código conferido em 03/11/2026, sem divergência) | Claude: Chromium headless antes do merge (ver abaixo). **Dani: validado em dispositivo real**, informado em 03/11/2026 | sim |
| Armazenamento versionado com IDs (D-20, D-22) | sim | **parcial** (§Pendências) | não | parcial |
| Backup: exportar/importar (D-21) | sim | **não** | — | — |
| Privacidade (D-23) | sim | **não** | — | — |
| Offline / service worker (D-24) | sim | **não funcional** (causa em `docs/TOJI.md` §8) | — | — |
| Facial e mobilidade (D-18) | sim (escopo) | **não** (sem conteúdo) | — | — |

**O que foi testado, exatamente:**
- *Claude, antes do merge:* Chromium headless com ordem e histórico antigos semeados no `localStorage`. Os seis dias carregam, os cinco IDs novos aparecem uma vez, os antigos saíram e não houve erro de JavaScript (os únicos erros eram do Google Fonts, bloqueado no sandbox).
- *Dani, em dispositivo real:* validação concluída e **não é mais pendência**. Não há registro do dispositivo, do roteiro nem do resultado detalhado, e nada disso deve ser presumido.
- *Nunca testado:* offline/PWA, instalação, comportamento com muito histórico, qualquer fluxo de backup (não existe).

## Pendências reais, em ordem recomendada

Ordem recomendada, **não autorização** para executar tudo; a tarefa concreta é definida por Dani.

1. **D-21 — Backup e restauração** (próxima frente de código). Exportar e importar com validação antes de substituir dados. Pré-requisito das correções abaixo, que mexem no armazenamento.
2. **D-20 / D-22 — Armazenamento e IDs.** Confirmado no código: a data do histórico usa UTC (`toISOString`), há no máximo um registro por exercício por dia, e a migração legada do Toji lê chaves `historico-<dia>-<índice>` no mesmo formato das do Maki, que partilha a origem do navegador. Detalhes em `docs/TOJI.md` §8.
3. **D-24 — Offline/PWA.** Corrigir e testar o service worker; conferir D-07 (abrir direto no Toji).
4. **D-18 — Facial e mobilidade.** Depende de Dani fornecer ou decidir o conteúdo. Não inventar.
5. **D-23 — Privacidade.** Decisão de Dani sobre o que limpar, incluindo o histórico Git. Nada foi feito.
6. **Documentos:** relatório de 03/11 ausente (L-1); stubs em `auditoria/` (L-10).

## Próxima tarefa

**D-21 (backup).** Não iniciada. Antes de codar: combinar o escopo com Dani e apresentar um plano curto. Não alterar armazenamento sem backup e validação.

## Riscos conhecidos

- O PR #2 mudou a quantidade de exercícios de segunda, quarta, quinta e sexta, então **a ordem personalizada nesses dias volta ao padrão** (por `getOrder`). Nada foi apagado. Comportamento deduzido do código; não confirmado no dispositivo.
- Os registros antigos de cable crunch e puxada aberta continuam no navegador, mas não aparecem na tela atual (decisão D-25).
- Dados pessoais e de saúde continuam expostos em arquivos públicos (L-9).

## Caminhos descartados ou já resolvidos (não reabrir)

- **Auditoria técnica de 03/11/2026:** feita. Não refazer; usar os achados para intervenções específicas.
- **Dips:** a restrição "sem dips" foi superada pela progressão assistida→livre (L-2, D-13). **Fly de peito:** não é pendência (L-3).
- **Migrar o histórico antigo para os exercícios novos:** descartado (D-25).
- **Mover as pernas para quarta e sexta e redistribuir o core:** descartado (D-04).

## Protocolo obrigatório de sessão

**Ao começar**
1. Consultar o HEAD atual da `main` no GitHub e comparar com a tabela acima.
2. Ler `CLAUDE.md`, este documento e, conforme a tarefa, `DECISOES.md` e `docs/TOJI.md`.
3. Conferir o **código** sempre que uma afirmação dependa da implementação. Documento descreve; o HEAD decide.
4. Separar *decidido*, *implementado*, *testado*, *validado* e *publicado*. Um não implica o outro.
5. Não ressuscitar tarefas concluídas nem inventar o que não está documentado (registre como lacuna).

**Ao terminar** (parte do desenvolvimento, não opcional)
6. Atualizar os documentos que mudaram: estado e próxima tarefa aqui, estados das decisões em `DECISOES.md`, definição em `docs/TOJI.md`.
7. Registrar o **último commit efetivamente conferido** na tabela acima, sem hashes contraditórios entre os documentos.
8. Preservar pendências, riscos e o próximo passo para a sessão seguinte.
9. Informar arquivos alterados, testes realizados, limitações e pendências.

## Onde consultar

| Assunto | Documento |
|---|---|
| Regras de trabalho, privacidade, o que exige autorização | [CLAUDE.md](CLAUDE.md) |
| Decisões, motivos, estados e lacunas | [DECISOES.md](DECISOES.md) |
| Ficha publicada, estrutura semanal, armazenamento, problemas técnicos | [docs/TOJI.md](docs/TOJI.md) |
| Histórico detalhado do Toji (V0–V4, origem de cada escolha) | [1-toji-dani-contexto-auditoria.md](1-toji-dani-contexto-auditoria.md) — *histórico; contém dados pessoais* |
| Histórico do Maki / do Megumi (congelados) | `2-maki-helena-…md` / `3-megumi-diego-…md` — *histórico; contêm dados pessoais* |
| Construção visual do site Toji (v2) | [auditoria-protocolo-toji.md](auditoria-protocolo-toji.md) — *histórico; pode divergir da V4* |
| Auditoria técnica de 03/11/2026 | ausente do repositório (L-1) |
| Código | `docs/index.html`, `docs/toji/`, `docs/maki/`, `docs/megumi/` |

Preservados sem alteração: `auditoria/` (stubs `TODO`) e `files (1).zip` (cópia dos três históricos).
