# Toji — definição e implementação

Referência técnica e funcional do protocolo ativo. Conferido contra o código no HEAD `f35f989` (`main`), 03/11/2026. Para *onde estamos*, veja [../CONTINUIDADE.md](../CONTINUIDADE.md); para *por que* cada coisa foi decidida, [../DECISOES.md](../DECISOES.md). Este documento **não** contém dados pessoais, medidas ou informações de saúde.

## 1. Objetivo

Sistema de treino de uso próprio, com estrutura fixa e previsível, progressão mensurável e harmonia entre grupos musculares (sem hierarquia entre eles), tendo como referência estética o personagem Toji: V-shape, costas e ombros, peitoral proporcional, braços e antebraços, grip, pescoço, pernas, core funcional, força relativa e calistenia. Evoluiu de fichas pessoais para um único protocolo com três frentes.

## 2. As três frentes

| Frente | Escopo | Estado |
|---|---|---|
| **Musculação** | Treino, exercícios, séries, repetições, cargas, histórico, progressão e métricas | **Implementada e publicada** (V4 + decisões pós-V4); validada por Dani em dispositivo real |
| **Facial** | Rotinas de expressividade, olhar, relaxamento, grooming e acompanhamento | **Sem conteúdo consolidado**; não implementada |
| **Mobilidade** | Rotinas de mobilidade, exercícios, frequência e acompanhamento da evolução | **Sem conteúdo consolidado**; não implementada |

## 3. Histórico de evolução

- **BLOC → Toji.** O projeto nasceu como a ficha pessoal "BLOC" e evoluiu para o protocolo Toji.
- **04/09/2026 (V1).** Redesenho conceitual: skill, core e grip integrados ao bloco único; harmonia em vez de hierarquia; seg–sáb.
- **23/09–01/10/2026 (V2).** Site com séries×reps explícitas, checklist semanal, registro de cargas com histórico, gráfico de progressão e reordenação manual.
- **01/10/2026 (V3).** Rotina executada tomada como base da auditoria de 09–10/10.
- **10/10/2026 (V4).** Reestruturação aplicada ao site (D-05).
- **03/11/2026 (pós-V4).** Decisões D-09 a D-16 e D-25 implementadas no PR #2 (`0ca8442`, mergeado em `f35f989`).

Detalhes, comparação V3→V4 e a origem de cada escolha: [../1-toji-dani-contexto-auditoria.md](../1-toji-dani-contexto-auditoria.md) (*histórico; contém dados pessoais, não copiar*). Construção visual do site (v2): [../auditoria-protocolo-toji.md](../auditoria-protocolo-toji.md) (*histórico*).

## 4. Musculação — ficha publicada

Divisão Push/Legs/Pull duas vezes por semana, seis dias, domingo de descanso. Séries × repetições / RIR, conforme `docs/toji/index.html`.

| Dia | Treino | Exercícios |
|---|---|---|
| Seg | Push A | Supino reto 4×6–8 / 2 · Desenvolvimento (halteres) 3×8–10 / 1–2 · Supino inclinado (halteres) 3×8–12 / 1–2 · Elevação lateral (cabo) 4×12–20 / 0–1 · **Crossover alto→baixo 2×12–15 / 1–2** · Tríceps francês unilateral 4×10–15 / 0–1 · **Abdominal na máquina 3×12–15 / 1–2** · Pallof press 2×12 por lado / 1–2 |
| Ter | Legs A | Agachamento livre 4×6–8 / 2 · RDL 3×8–10 / 1–2 · Extensora 3×12–15 / 0–1 · Flexora deitada 3×10–15 / 0–1 · Panturrilha em pé 4×15–20 / 1–2 · Hanging leg raise 3×10–12 / 1 |
| Qua | Pull A | Barra fixa pronada 4×6–10 / 2 · T-bar com apoio no peito 4×8–12 / 1–2 · **Puxada neutra (pegador anatômico pequeno) 3×10–12 / 1–2** · Rosca Scott 3×10–12 / 0–1 · Rosca inclinada supinada 3×10–12 / 0–1 · Encolhimento 3×12–20 / 1–2 · Rosca de punho 3×15–20 / 1–2 · Pescoço 2×15–20 (leve) |
| Qui | Push B | Supino declinado 4×8–12 / 1–2 · Elevação lateral (máquina ou halter) 4×12–20 / 0–1 · Crossover baixo→alto 3×12–15 / 0–1 · **Dips (assistido → livre) 2×8–12 / 1–2** · Tríceps corda 4×10–15 / 0–1 · Face pull 3×12–20 / 1–2 · Dragon flag (progressão) 3×4–8 · Prancha com sobrecarga 2×30–45 s / 1–2 |
| Sex | Legs B | Leg press 4×8–12 / 1–2 · Hip thrust 3×8–12 / 1–2 · Búlgaro 3×8–10 por perna / 1–2 · Flexora sentada 3×10–15 / 0–1 · Abdutora 2×12–20 / 0–1 · **Adutora 2×12–20 / 0–1** · Panturrilha sentado 4×15–20 / 1–2 · Hiperextensão 2×12–15 / 2 |
| Sáb | Pull B | Barra fixa neutra ou supinada 3×6–10 / 2 · Remada curvada supinada 3×8–10 / 1–2 · Peck-deck reverso 3×12–20 / 0–1 · Rosca no cabo, braço atrás do corpo (Bayesian) 3×10–12 / 0–1 · Rosca martelo 3×10–12 / 0–1 · Rosca inversa 2×12–15 / 1–2 · Extensão de punho 2×15–20 / 1–2 · Farmer walk 3×30–40 m · Pescoço 2×15–20 (leve) |
| Dom | Descanso | — |

Em **negrito**, o que o PR #2 acrescentou ou trocou em relação à V4. O restante é a V4.

**Habilidades no início do dia**, com o corpo descansado e antes da carga: handstand (segunda e quinta, 6–8 min em tentativas curtas), pistol assistido (terça), saltos verticais (sexta). O front lever aparece como skill de progressão nos cards dos dois Pull (L-5). Dead hang leve no aquecimento do Pull. O ciclismo de sábado é deslocamento e não faz parte da ficha.

**Dips.** Começar na máquina assistida e reduzir a assistência aos poucos, quando a faixa de repetições for cumprida com técnica estável, até os dips livres nas paralelas. Descanso de 2–3 min. Não substituem o supino declinado.

**Crossovers.** São dois movimentos com ângulos distintos (alto→baixo na segunda, baixo→alto na quinta), não duplicação.

**Volume semanal declarado no site:** ~133 séries dinâmicas (135 contando os 2 dips), sem pistol, saltos, farmer walk e pescoço.

## 5. Mudanças pós-V4 — todas implementadas

Estado e justificativa de cada uma em [../DECISOES.md](../DECISOES.md) §2.

| Decisão | Mudança | Estado |
|---|---|---|
| D-09 | Quarta: puxada neutra no lugar da puxada aberta | implementada |
| D-10 | Segunda: crossover alto→baixo | implementada |
| D-12 | Segunda: máquina abdominal no lugar do cable crunch | implementada |
| D-13 | Quinta: dips em progressão assistida→livre | implementada |
| D-16 | Sexta: adutora, mantendo a abdutora | implementada |
| D-11, D-14, D-15 | Manter crossover baixo→alto, flexoras (deitada/sentada) e extensora | já na V4, mantidas |

## 6. Facial e mobilidade — contexto

Foram discutidas em conversas separadas, que **não estão neste repositório**. O que existe é só o escopo da §2. Não há rotinas, exercícios, frequências ou métricas definidos, e nenhuma proposta inicial deve ser tratada como decisão. Integrá-las ao Toji é decisão aprovada (D-18); o conteúdo depende de Dani.

## 7. Preferências e requisitos

**Treino**
- Estrutura fixa e previsível; sem rodízio semanal de exercícios.
- Exercícios principais estáveis por blocos de 8–12 semanas; troca dentro do bloco só por falta de progresso, dor, falta de equipamento ou lacuna técnica real. Exercício novo: cerca de 2 semanas de adaptação antes de julgar.
- Habilidades integradas ao mesmo dia, no início. Core fora dos dias de perna.
- Sem roda abdominal; sessões de até 2h30; sem divisão complexa.

**Produto (aprovado)**
- HTML/CSS/JS nativos, compatível com GitHub Pages, sem build.
- Armazenamento local versionado, IDs estáveis, exportação/importação com validação, histórico preservado ao arquivar.
- Funcionamento offline desejado.
- Variante do dia visível no próprio card; reordenação manual dentro do dia.
- Privacidade: nada de dados pessoais ou de saúde na documentação pública.

## 8. Armazenamento e problemas técnicos

**Chaves do Toji em `localStorage`** (confirmadas no código):

| Chave | Conteúdo |
|---|---|
| `ordem2-<dia>` | Ordem personalizada dos exercícios do dia (lista de IDs). Descartada e substituída pela padrão se o tamanho não bater com a lista atual |
| `progresso-<ano>-S<semana>` | Checklist semanal de conclusão, por dia e por ID |
| `historico-<dia>-<id>` | Histórico de carga do exercício (lista de `{data, valor, tipo}`) |
| `toji-schema` | Versão do esquema (`2`); controla a migração única do legado |
| `toji-theme` | Tema claro/escuro |

**Problemas conhecidos.** Origem: auditoria de 03/11/2026, cujo relatório **não está no repositório** (L-1); aqui estão os achados resumidos e o que foi confirmado no código. Não refazer a auditoria.

| Problema | Situação |
|---|---|
| Datas gravadas em UTC com possível deslocamento de dia | **Confirmado**: `addHistoryEntry` usa `new Date().toISOString().slice(0, 10)` |
| Um registro por exercício por data | **Confirmado**: um novo registro no mesmo dia substitui o anterior |
| Colisão de chaves entre Toji e Maki | **Parcialmente confirmado**: o Maki usa `historico-<dia>-<índice>`, o mesmo formato que a migração legada do Toji lê (`migrateStorage`), e os dois partilham a origem do navegador. O alcance do problema está no relatório ausente |
| IDs por índice nos protocolos antigos | Maki (congelado) ainda usa índice; o Toji já usa ID |
| Sem exportação, importação ou backup | Confirmado (D-21) |
| Service worker via Blob | O código registra o service worker com `URL.createObjectURL` (linhas 1606 e 1627); a rejeição pelo navegador vem da auditoria, não foi reproduzida aqui |
| PWA abrir direto no Toji (D-07) | Não verificado |
| Dados pessoais e de saúde em arquivos públicos | Aberto (D-23, L-9) |

**Efeitos do PR #2 nos dados locais.** Os cinco exercícios novos têm IDs próprios: `crossover-alto-baixo`, `abdominal-maquina`, `puxada-neutra-anatomica`, `dips-assistido`, `adutora`. Os registros de `cable-crunch` e `puxada-aberta` permanecem no navegador, sem apagar nem migrar (D-25), mas não aparecem mais na tela de progressão. A ordem personalizada de segunda, quarta, quinta e sexta volta ao padrão (L-11).

## 9. Pendências deste protocolo

- **Backup (D-21):** próxima frente técnica.
- Isolamento das chaves, datas locais e mais de um registro por dia (D-20, D-22).
- Service worker e offline (D-24); conferir D-07.
- Conteúdo de **facial** e de **mobilidade** (D-18, L-4).
- Confirmar com Dani: remoção das isometrias, face pull no Push B e front lever (L-5).
- Privacidade do HTML publicado (D-23, L-9).
