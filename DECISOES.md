# DECISOES.md — Registro cronológico de decisões

Estado conferido contra o HEAD `2ba1f83` (branch `main`) em 03/11/2026. Fonte do histórico: [1-toji-dani-contexto-auditoria.md](1-toji-dani-contexto-auditoria.md) (seções citadas como §).

**Estados:** `aprovada` · `pendente de implementação` · `implementada` · `substituída` · `descartada` · `não confirmada` (sugestão sem aceite registrado).
**Origem:** *usuário* = decisão do dono do projeto; *Claude* / *GPT* = sugestão de assistente. Datas só quando constam na fonte.

---

## 1. Histórico até a V4

| ID | Data | Decisão | Motivo | Origem | Estado |
|---|---|---|---|---|---|
| D-01 | 04/09/2026 | Integrar skill, core e grip no bloco único da academia; harmonia entre grupos em vez de hierarquia; treinar seg–sáb; sem rodízio semanal de exercícios | Blocos separados não eram executados; foco em progressão clara | usuário (§B, V1) | implementada (base das versões seguintes) |
| D-02 | 04/09/2026 | Cortar face pull e remada unilateral; adicionar RDL e hiperextensão | Lacuna de cadeia posterior; exercícios redundantes | Claude | `não confirmada` — RDL e hiperextensão estão no site; face pull **permanece** no site; remada unilateral não aparece |
| D-03 | 24–25/09/2026 | Trocar supino declinado por chest press na quinta | Academia da época não tinha banco declinado; troca explicitamente temporária | usuário | substituída por D-05 |
| D-04 | 09/10/2026 | Mover pernas para quarta/sexta e redistribuir core | Suposto conflito de agenda | Claude | descartada (premissa caiu; nada aplicado) |
| D-05 | 10/10/2026 | **Aplicar a V4 ao site**: estrutura Push A / Legs A / Pull A / Push B / Legs B / Pull B; supino declinado de volta na quinta; T-bar com apoio na quarta; peck-deck reverso e rosca no cabo (braço atrás do corpo) no sábado; farmer walk; rosca inversa e extensão de punho; pescoço leve; core redistribuído fora dos dias de perna; flexora sentada na sexta | Ver §B/§C da fonte | usuário aprovou; escolhas detalhadas por Claude/GPT | **implementada** (exercícios-chave conferidos no HEAD; ver `docs/TOJI.md`) |
| D-06 | 10/10/2026 | Remover as isometrias pré-treino; manter dead hang leve (1×20–30 s) como aquecimento do Pull | Sem carga/ângulo definidos | Claude/GPT | implementada no site; **sem confirmação explícita do usuário** item a item |
| D-07 | 13/10/2026 | O PWA deve abrir direto no Toji, sem tela de seleção | Ajuste de interface | usuário | **não verificado** neste ciclo |
| D-08 | 15/10/2026 | Abandonar o cable crunch | Equipamento não permite boa execução | usuário | aprovada → ver D-12 |

## 2. Decisões posteriores à V4 (aprovadas, pendentes de implementação)

Data de aprovação não registrada na fonte; todas são posteriores a 15/10/2026. **Nenhuma está aplicada no HEAD** (conferido: o site não contém máquina abdominal, adução nem dips; ainda tem puxada aberta e cable crunch).

| ID | Dia | Decisão | Parâmetros | Estado |
|---|---|---|---|---|
| D-09 | Quarta | Substituir puxada aberta por **puxada neutra com pegador anatômico pequeno** | inicialmente 3 séries | pendente de implementação |
| D-10 | Segunda | Adicionar **crossover alto-baixo** | 2×12–15, RIR 1–2 | pendente de implementação |
| D-11 | Quinta | **Manter** crossover baixo-alto | 3 séries | aprovada (já no site) |
| D-12 | Segunda | Substituir **cable crunch** por **máquina abdominal** | inicialmente 3×12–15 | pendente de implementação |
| D-13 | Quinta | Adicionar **dips na máquina assistida**; **não** substituir o supino declinado | 2×8–12, RIR 1–2, descanso 2–3 min | pendente de implementação (ver L-2) |
| D-14 | Terça / Sexta | **Manter** flexora deitada (terça) e flexora sentada (sexta) | — | aprovada (já no site) |
| D-15 | Terça | **Manter** extensora sentada | — | aprovada (já no site) |
| D-16 | Sexta | **Manter** abdução; **adicionar adução** na máquina | adução 2×12–20 | adução pendente de implementação; abdução já no site |

## 3. Direção e arquitetura (aprovadas no briefing de 03/11/2026)

Data da decisão original não informada; consta no briefing de consolidação de 03/11/2026. Nenhuma está implementada. Escolhas de implementação seguem em aberto e não devem ser fixadas por esta lista.

| ID | Decisão | Motivo / observação | Estado |
|---|---|---|---|
| D-17 | Desenvolvimento ativo **exclusivo do Toji**; Maki e Megumi preservados, sem apagar nem modificar | Mudança de direção do projeto | aprovada (em vigor) |
| D-18 | Toji com três frentes: **musculação, facial, mobilidade** | Facial e mobilidade ainda sem conteúdo consolidado (L-4) | aprovada |
| D-19 | Arquitetura modular simples compatível com GitHub Pages; HTML/CSS/JS nativos, sem frameworks, build ou dependências desnecessárias | Simplicidade e hospedagem atual | aprovada |
| D-20 | Armazenamento local, versionado, com identificadores estáveis | Achados da auditoria de 03/11/2026 | aprovada; implementação pendente |
| D-21 | Exportação e importação de backup obrigatórias; restauração valida antes de substituir e não pode corromper dados existentes | Hoje não há backup | aprovada; implementação pendente |
| D-22 | Cada exercício com ID permanente; histórico independente da posição; edição/reordenação não associam registros ao exercício errado; arquivar preserva histórico | IDs por índice nos protocolos antigos (auditoria) | aprovada; implementação pendente |
| D-23 | Avaliar e eliminar a exposição desnecessária de dados pessoais/saúde no repositório público; não adicionar novos | Repositório público (ver L-9) | aprovada; **nenhuma ação executada** |
| D-24 | Funcionamento offline é requisito desejado | Implementação atual tem problema conhecido (service worker via Blob recusado pelo navegador, segundo a auditoria; o código está em `docs/toji/index.html`, linhas ~1602–1624 no HEAD `2ba1f83`) | aprovada; implementação pendente |

---

## Lacunas e contradições abertas

- **L-1 — Relatório de 03/11/2026 ausente.** O relatório completo da auditoria técnica não está no repositório nem foi anexado a esta tarefa. Por isso **não foram preservadas as referências de arquivo e linha dele**; os achados aparecem apenas como o briefing os resumiu. Ação sugerida: o usuário adicionar o relatório em `auditoria/` (por exemplo `auditoria/auditoria-tecnica-2026-11-03.md`) e `CONTINUIDADE.md` passar a apontar para ele.
- **L-2 — Dips: restrição vs. decisão.** O site (`docs/toji/index.html`, linhas ~854 e ~1125) e o histórico (§A/§D) declaram "sem dips". D-13 aprova dips na **máquina assistida**. Não está registrado se a restrição foi revista ou se a máquina assistida é considerada exceção. Resolver com o usuário antes de implementar.
- **L-3 — Peck-deck reverso / crucifixo.** A V4 tem peck-deck reverso no **sábado** (`id: peck-deck-reverso`, linha ~1074), de modo que não deve ser adicionado de novo. Mas a discussão posterior (inclusive a pergunta de 15/10 sobre "fly", sem resposta registrada) pode se referir a um fly de peito na quinta, hoje inexistente. Reconciliar com o usuário e com a ficha efetiva.
- **L-4 — Facial e mobilidade.** O conteúdo foi discutido em conversas separadas que não estão no repositório. Nada foi inventado; só a descrição do escopo consta em `docs/TOJI.md`.
- **L-5 — Itens sem confirmação do usuário** (§H da fonte): remoção das isometrias (D-06), permanência do face pull (D-02), ausência da remada unilateral, front lever ainda citado em cards de Pull.
- **L-6 — Datas.** As decisões D-09 a D-16 não têm data de aprovação registrada; a ordem relativa entre elas e a de 15/10 é desconhecida.
- **L-7 — PWA abrindo direto no Toji (D-07):** não conferido.
- **L-8 — Rotina original (BLOC).** As duas descrições históricas divergem (PPL seg–sex segundo o usuário; Push/Pull/Legs/Upper/Full/Skill segundo o Claude em 04/09). Preservado como está na fonte.
- **L-9 — Privacidade.** Dados pessoais e de saúde aparecem em `1-`, `2-` e `3-*-contexto-auditoria.md`, em `files (1).zip` (cópia desses três) e em trechos de `docs/toji/index.html`. Esta etapa **não** alterou nada disso. Decisão sobre remoção/limpeza é do usuário (D-23).
- **L-10 — Stubs.** `auditoria/auditoria-{toji,maki,megumi}.md` contêm só um comentário `TODO`.
