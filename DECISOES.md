# DECISOES.md — O que decidimos, por que e em que estado

Estado conferido contra o HEAD `f35f989` (`main`) em 03/11/2026. Fonte do histórico: [1-toji-dani-contexto-auditoria.md](1-toji-dani-contexto-auditoria.md) (seções citadas como §). Ponto de entrada do projeto: [CONTINUIDADE.md](CONTINUIDADE.md).

**Estados:** `aprovada` · `pendente de implementação` · `parcialmente implementada` · `implementada` · `substituída` · `descartada` · `não confirmada` (sugestão sem aceite registrado).
**Origem:** *usuário* = decisão do dono do projeto; *Claude* / *GPT* = sugestão de assistente. Datas só quando constam na fonte.
**Regra:** decisões não são apagadas nem reabertas por falta de contexto. Quando o estado ou um fato muda, corrige-se a linha e registra-se a correção em "Registro de correções".

---

## 1. Histórico até a V4

| ID | Data | Decisão | Motivo | Origem | Estado |
|---|---|---|---|---|---|
| D-01 | 04/09/2026 | Integrar skill, core e grip no bloco único da academia; harmonia entre grupos em vez de hierarquia; treinar seg–sáb; sem rodízio semanal de exercícios | Blocos separados não eram executados; foco em progressão clara | usuário (§B, V1) | implementada (base das versões seguintes) |
| D-02 | 04/09/2026 | Cortar face pull e remada unilateral; adicionar RDL e hiperextensão | Lacuna de cadeia posterior; exercícios redundantes | Claude | `não confirmada` — RDL e hiperextensão estão no site; face pull **permanece** no site; remada unilateral não aparece |
| D-03 | 24–25/09/2026 | Trocar supino declinado por chest press na quinta | Academia da época não tinha banco declinado; troca explicitamente temporária | usuário | substituída por D-05 |
| D-04 | 09/10/2026 | Mover pernas para quarta/sexta e redistribuir core | Suposto conflito de agenda | Claude | descartada (premissa caiu; nada aplicado) |
| D-05 | 10/10/2026 | **Aplicar a V4 ao site**: estrutura Push A / Legs A / Pull A / Push B / Legs B / Pull B; supino declinado de volta na quinta; T-bar com apoio na quarta; peck-deck reverso e rosca no cabo (braço atrás do corpo) no sábado; farmer walk; rosca inversa e extensão de punho; pescoço leve; core redistribuído fora dos dias de perna; flexora sentada na sexta | Ver §B/§C da fonte | usuário aprovou; escolhas detalhadas por Claude/GPT | **implementada** (base da ficha atual; ver `docs/TOJI.md`) |
| D-06 | 10/10/2026 | Remover as isometrias pré-treino; manter dead hang leve (1×20–30 s) como aquecimento do Pull | Sem carga/ângulo definidos | Claude/GPT | implementada no site; **sem confirmação explícita do usuário** item a item |
| D-07 | 13/10/2026 | O PWA deve abrir direto no Toji, sem tela de seleção | Ajuste de interface | usuário | **não verificado** (L-7) |
| D-08 | 15/10/2026 | Abandonar o cable crunch | Equipamento não permite boa execução | usuário | aprovada → executada em D-12 |

## 2. Decisões posteriores à V4

Data de aprovação não registrada na fonte; todas são posteriores a 15/10/2026 (L-6). **Todas implementadas** no PR #2: commit `0ca8442`, mergeado em `f35f989`, publicado no Pages. Conferidas no código em 03/11/2026, sem divergência. Validadas por Dani em dispositivo real (informado em 03/11/2026).

| ID | Dia | Decisão | Parâmetros publicados | Estado |
|---|---|---|---|---|
| D-09 | Quarta | Substituir puxada aberta por **puxada neutra com pegador anatômico pequeno** | 3×10–12, RIR 1–2 | **implementada** (PR #2) |
| D-10 | Segunda | Adicionar **crossover alto→baixo** | 2×12–15, RIR 1–2 | **implementada** (PR #2) |
| D-11 | Quinta | **Manter** crossover baixo→alto | 3×12–15, RIR 0–1 | implementada (já na V4; mantida) |
| D-12 | Segunda | Substituir **cable crunch** por **máquina abdominal** | 3×12–15, RIR 1–2 | **implementada** (PR #2) |
| D-13 | Quinta | Adicionar **dips**; **não** substituir o supino declinado | 2×8–12, RIR 1–2, descanso 2–3 min. **Escopo ao implementar:** começa na máquina assistida e reduz a assistência até dips livres nas paralelas | **implementada** (PR #2). A decisão registrada falava só em "máquina assistida"; a progressão até livres veio no pacote de atualização que Dani mandou aplicar (ver L-2) |
| D-14 | Terça / Sexta | **Manter** flexora deitada (terça) e flexora sentada (sexta) | 3×10–15, RIR 0–1 em ambas | implementada (já na V4; mantida) |
| D-15 | Terça | **Manter** extensora sentada | 3×12–15, RIR 0–1 | implementada (já na V4; mantida) |
| D-16 | Sexta | **Manter** abdutora; **adicionar adutora** na máquina | adutora 2×12–20, RIR 0–1 | **implementada** (PR #2); abdutora mantida |
| D-25 | 03/11/2026 | Exercícios substituídos ou novos recebem **IDs próprios**; o histórico antigo de cable crunch e puxada aberta **não** é migrado para os novos | Evitar associar registros ao movimento errado (D-22); nada é apagado | pacote do PR #2, aplicado por pedido de Dani | **implementada** (PR #2). Os registros antigos ficam no navegador, fora da tela de progressão atual |

## 3. Direção e arquitetura

Aprovadas no briefing de consolidação de 03/11/2026 (data da decisão original não informada). Escolhas de implementação seguem em aberto e não devem ser fixadas por esta lista.

| ID | Decisão | Motivo / observação | Estado |
|---|---|---|---|
| D-17 | Desenvolvimento ativo **exclusivo do Toji**; Maki e Megumi preservados, sem apagar nem modificar | Mudança de direção do projeto | aprovada, **em vigor**. Maki e Megumi inalterados desde `2ba1f83` (conferido) |
| D-18 | Toji com três frentes: **musculação, facial, mobilidade** | Facial e mobilidade sem conteúdo consolidado (L-4) | aprovada. Musculação **implementada**; facial e mobilidade **não iniciadas** |
| D-19 | Arquitetura modular simples compatível com GitHub Pages; HTML/CSS/JS nativos, sem frameworks, build ou dependências desnecessárias | Simplicidade e hospedagem atual | aprovada, **em vigor** (o código atual cumpre) |
| D-20 | Armazenamento local, versionado, com identificadores estáveis | Achados da auditoria de 03/11/2026 | **parcialmente implementada.** Existe: marcador `toji-schema`, chaves por ID (`ordem2-`, `historico-<dia>-<id>`) e migração única do legado. Falta: isolamento em relação ao Maki, datas locais, mais de um registro por dia (`docs/TOJI.md` §8) |
| D-21 | Exportação e importação de backup obrigatórias; restauração valida antes de substituir e não pode corromper dados existentes | Hoje não há backup | aprovada; **pendente de implementação. É a próxima frente técnica** |
| D-22 | Cada exercício com ID permanente; histórico independente da posição; edição/reordenação não associam registros ao exercício errado; arquivar preserva histórico | IDs por índice nos protocolos antigos (auditoria) | **parcialmente implementada.** O Toji usa IDs; o Maki (congelado) ainda usa índice; não existe arquivamento de exercícios |
| D-23 | Avaliar e eliminar a exposição desnecessária de dados pessoais/saúde no repositório público; não adicionar novos | Repositório público (L-9) | aprovada; **pendente de tratamento. Nenhuma ação executada** |
| D-24 | Funcionamento offline é requisito desejado | O service worker é registrado a partir de uma URL `blob:`, que o navegador recusa (segundo a auditoria; o código confirma o uso de `blob:`). Código em `docs/toji/index.html`, linhas 1606 e 1627 no HEAD `f35f989` | aprovada; **pendente: correção e teste do service worker** |
| D-26 | A documentação de continuidade é a memória persistente do projeto. Cada sessão termina atualizando os documentos e registrando o último commit conferido | Evitar dependência do histórico de conversas | usuário, 03/11/2026. **Implementada** no protocolo de sessão de `CONTINUIDADE.md` e em `CLAUDE.md` |

---

## Lacunas e contradições

- **L-1 — Relatório de 03/11/2026 ausente.** O relatório completo da auditoria técnica não está no repositório; os achados vêm resumidos. Por isso **não há referências de arquivo e linha dele**. Ação sugerida: adicioná-lo em `auditoria/` (por exemplo `auditoria/auditoria-tecnica-2026-11-03.md`) e apontar para ele em `CONTINUIDADE.md`. *Aberta.*
- **L-2 — Dips: resolvida em 03/11/2026.** A restrição "sem dips" foi superada por uma progressão: dips assistidos na máquina, reduzindo a assistência até dips livres. O supino declinado permanece. *Origem:* pacote de atualização que Dani mandou aplicar; o rodapé do site deixou de dizer "SEM DIPS". Não reabrir.
- **L-3 — Peck-deck reverso / fly: resolvida em 03/11/2026.** O peck-deck reverso fica no sábado. Os crossovers são alto→baixo (segunda) e baixo→alto (quinta). Fly de peito não é pendência. Não reabrir.
- **L-4 — Facial e mobilidade.** Discutidas em conversas separadas que não estão no repositório. Nada foi inventado. *Aberta.*
- **L-5 — Itens sem confirmação do usuário** (§H da fonte): remoção das isometrias (D-06), permanência do face pull (D-02), ausência da remada unilateral. O front lever continua como skill de progressão nos cards dos dois Pull. *Aberta.*
- **L-6 — Datas.** D-09 a D-16 não têm data de aprovação registrada. *Aberta, baixa prioridade.*
- **L-7 — PWA abrindo direto no Toji (D-07):** não conferido. *Aberta.*
- **L-8 — Rotina original (BLOC).** As duas descrições históricas divergem (PPL seg–sex segundo o usuário; Push/Pull/Legs/Upper/Full/Skill segundo o Claude em 04/09). Preservado como na fonte.
- **L-9 — Privacidade.** Dados pessoais e de saúde aparecem em `1-`, `2-` e `3-*-contexto-auditoria.md`, em `files (1).zip` e em trechos de `docs/toji/index.html` (rodapé do cabeçalho, linha ~853, e texto de restrições, linha ~1128). Nada foi alterado. A decisão sobre remoção ou limpeza do histórico Git é de Dani (D-23). *Aberta.*
- **L-10 — Stubs.** `auditoria/auditoria-{toji,maki,megumi}.md` contêm só um comentário `TODO`. *Aberta.*
- **L-11 — Ordem personalizada reiniciada pelo PR #2.** Nos dias com a lista alterada (segunda, quarta, quinta e sexta), `getOrder` volta à ordem padrão quando o tamanho da lista difere da ordem salva. Nada foi apagado. Deduzido do código; não confirmado em dispositivo. *Conhecida, sem ação prevista.*

---

## Registro de correções

| Data | Correção |
|---|---|
| 03/11/2026 | O commit `0ca8442` **gravou** uma sincronização documental, mas com o estado de antes do merge ("patch local", "commit pendente", "working tree", HEAD `077dad7`). Corrigido para o estado real: PR #2 mergeado em `f35f989`. Afirmação anterior de que nenhuma sincronização havia sido gravada estava incorreta. |
| 03/11/2026 | D-09, D-10, D-12, D-13 e D-16 passaram de `incluída no patch local; commit pendente` para `implementada`. D-11, D-14 e D-15 deixaram de dizer "aprovada (já no site)". |
| 03/11/2026 | A frase "Nenhuma está implementada" da seção 3 foi removida: era falsa para D-19 e parcialmente falsa para D-20 e D-22. |
| 03/11/2026 | D-24: referência de linhas do service worker atualizada de `~1602–1624` (HEAD `2ba1f83`) para `1606` e `1627` (HEAD `f35f989`). |
| 03/11/2026 | Validação da ficha em dispositivo real registrada como **concluída**, conforme Dani. Detalhes do dispositivo e do roteiro não foram informados. |
| 03/11/2026 | D-25 e D-26 incluídas; L-11 criada. |
