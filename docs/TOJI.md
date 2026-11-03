# Toji — contexto atual

Documento de contexto do protocolo ativo. Estado remoto conferido no HEAD `077dad7` (03/11/2026). A atualização da ficha está aplicada no working tree; commit e publicação ainda pendentes. Decisões e seus estados: [../DECISOES.md](../DECISOES.md). Este documento **não** contém dados pessoais, medidas ou informações de saúde.

## 1. Objetivo

Sistema de treino de uso próprio, com estrutura fixa e previsível, progressão clara e foco em harmonia entre grupos musculares (sem hierarquia entre eles), tendo como referência estética o personagem Toji. Evoluiu de fichas pessoais para um único protocolo com três frentes.

## 2. As três frentes

| Frente | Escopo | Estado |
|---|---|---|
| **Musculação** | Treino, exercícios, séries, repetições, cargas, histórico, progressão e métricas | V4 substituída localmente pelo patch pós-V4; commit pendente (§5) |
| **Facial** | Rotinas de expressividade, olhar, relaxamento, grooming e acompanhamento | **Sem conteúdo consolidado**; não implementada |
| **Mobilidade** | Rotinas de mobilidade, exercícios, frequência e acompanhamento da evolução | **Sem conteúdo consolidado**; não implementada |

## 3. Histórico de evolução

- **BLOC → Toji.** O projeto nasceu como a ficha pessoal "BLOC" e evoluiu para o protocolo Toji.
- **04/09/2026 (V1).** Redesenho conceitual: skill, core e grip integrados ao bloco único; harmonia em vez de hierarquia; seg–sáb.
- **23/09–01/10/2026 (V2).** Site com séries×reps explícitas, checklist semanal, registro de cargas com histórico, gráfico de progressão e reordenação manual.
- **01/10/2026 (V3).** Rotina executada tomada como base da auditoria de 09–10/10.
- **10/10/2026 (V4).** Versão atual, aplicada ao site (D-05 em `DECISOES.md`).
- **Depois da V4.** Decisões aprovadas e ainda não aplicadas (§5).

Detalhes, comparação V3→V4 e a origem de cada escolha (usuário, Claude ou ChatGPT): [../1-toji-dani-contexto-auditoria.md](../1-toji-dani-contexto-auditoria.md), *fonte histórica que contém dados pessoais; não copiar esses dados*. A construção visual do site (v2) está em [../auditoria-protocolo-toji.md](../auditoria-protocolo-toji.md), também histórica.

## 4. Musculação — ficha consolidada no working tree

Seis dias, domingo de descanso. A base V4 permanece, com as decisões aprovadas pós-V4 aplicadas localmente:

| Dia | Treino | Exercícios |
|---|---|---|
| Seg | Push A | Supino reto 4×6–8 · Desenvolvimento 3×8–10 · Supino inclinado 3×8–12 · Elevação lateral no cabo 4×12–20 · Crossover alto→baixo 2×12–15 · Tríceps francês 4×10–15 · Máquina abdominal 3×12–15 · Pallof press 2×12/lado |
| Ter | Legs A | Agachamento 4×6–8 · RDL 3×8–10 · Extensora sentada 3×12–15 · Flexora deitada 3×10–15 · Panturrilha em pé 4×15–20 · Hanging leg raise 3×10–12 |
| Qua | Pull A | Barra fixa pronada 4×6–10 · T-bar apoiada 4×8–12 · Puxada neutra com pegador anatômico pequeno 3 séries · Scott 3×10–12 · Rosca inclinada 3×10–12 · Encolhimento 3×12–20 · Rosca de punho 3×15–20 · Pescoço 2×15–20 |
| Qui | Push B | Supino declinado 4×8–12 · Elevação lateral 4×12–20 · Crossover baixo→alto 3×12–15 · Dips nas paralelas em progressão assistida→livre 2×8–12 · Tríceps corda 4×10–15 · Face pull 3×12–20 · Dragon flag 3×4–8 · Prancha com sobrecarga 2×30–45 s |
| Sex | Legs B | Leg press 4×8–12 · Hip thrust 3×8–12 · Búlgaro 3×8–10/perna · Flexora sentada 3×10–15 · Abdutora 2×12–20 · Adutora 2×12–20 · Panturrilha sentado 4×15–20 · Hiperextensão 2×12–15 |
| Sáb | Pull B | Barra fixa neutra/supinada 3×6–10 · Remada curvada supinada 3×8–10 · Peck-deck reverso 3×12–20 · Rosca Bayesian 3×10–12 · Rosca martelo 3×10–12 · Rosca inversa 2×12–15 · Extensão de punho 2×15–20 · Farmer walk 3×30–40 m · Pescoço 2×15–20 |
| Dom | Descanso | — |

**Progressão dos dips:** começar na máquina assistida; reduzir a assistência gradualmente conforme a faixa de repetições seja cumprida com técnica estável; chegar aos dips livres nas paralelas. Descanso de 2–3 min. O supino declinado permanece.

**Skills no início do dia** (descansado, antes da carga): handstand (segunda e quinta, 6–8 min), pistol assistido (terça) e saltos verticais (sexta). Dead hang leve no aquecimento do Pull. Sábado inclui o ciclismo de deslocamento, fora da ficha de musculação.

**Histórico local:** exercícios substituídos recebem IDs novos. Registros antigos de cable crunch e puxada aberta permanecem no navegador, sem exclusão, mas deixam de aparecer no gráfico dos movimentos novos.

## 5. Decisões posteriores à V4 — aplicadas no working tree

| Dia | Mudança |
|---|---|
| Segunda | Crossover alto→baixo 2×12–15, RIR 1–2; máquina abdominal 3×12–15 no lugar do cable crunch |
| Quarta | Puxada neutra com pegador anatômico pequeno, 3 séries |
| Quinta | Dips 2×8–12, RIR 1–2, descanso 2–3 min; progressão da máquina assistida até livres, sem substituir o supino declinado |
| Sexta | Manter flexora sentada e abdutora; adicionar adutora 2×12–20 |
| Segunda/quinta | Manter os dois crossovers: alto→baixo na segunda e baixo→alto na quinta |

Commit e publicação no GitHub ainda pendentes.

## 6. Facial e mobilidade — contexto

Foram discutidas em conversas separadas, que **não estão neste repositório**. O que se tem registrado é apenas o escopo da §2. Não há rotinas, exercícios, frequências ou métricas definidos, e nenhuma proposta inicial deve ser tratada como decisão. Integrar essas frentes ao Toji é decisão aprovada (D-18); o conteúdo depende de consolidação.

## 7. Preferências e requisitos relevantes

**Treino**
- Estrutura fixa e previsível; sem rodízio semanal de exercícios.
- Exercícios principais estáveis por blocos de 8–12 semanas; troca dentro de um bloco só por falta de progresso, dor, falta de equipamento ou lacuna real. Exercício novo: cerca de 2 semanas de adaptação antes de julgar.
- Habilidades integradas ao mesmo dia, no início, com o corpo descansado.
- Core fora dos dias de perna.
- Dips fazem parte do Push B em progressão assistida até livres; sem roda abdominal; sessões de até 2h30; sem divisão complexa.

**Produto (aprovado)**
- Arquitetura simples: HTML/CSS/JS nativos, compatível com GitHub Pages, sem build.
- Armazenamento local versionado, IDs estáveis de exercício, exportação/importação com validação, histórico preservado ao arquivar.
- Funcionamento offline desejado.
- Variante do dia visível no próprio card; reordenação manual dos exercícios dentro do dia.
- Privacidade: nada de dados pessoais ou de saúde na documentação pública.

## 8. Problemas técnicos conhecidos

Origem: auditoria de 03/11/2026. O relatório **não está no repositório** (L-1); aqui só o resumo, sem refazer a auditoria.

- Colisão de chaves de armazenamento entre Toji e Maki e risco de migrar registros de outro protocolo.
- Datas gravadas em UTC com deslocamento de dia.
- Histórico limitado a um registro por exercício por data.
- Sem exportação, importação ou backup.
- IDs baseados em índice nos protocolos antigos.
- Service worker criado via Blob, recusado pelo navegador (código em `docs/toji/index.html`, ~linhas 1602–1624 no HEAD `2ba1f83`).
- Dados pessoais e de saúde em arquivos do repositório público.
- Documentação antiga contraditória com o código.

## 9. Pendências de conteúdo

- Conteúdo de **facial** e de **mobilidade** (fornecer as conversas ou consolidar com o usuário).
- Commitar, testar no navegador e publicar o patch de musculação; L-2 e L-3 estão resolvidas.
- Confirmar com o usuário: remoção das isometrias, face pull no Push B (L-5).
