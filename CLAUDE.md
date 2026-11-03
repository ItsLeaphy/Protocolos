# CLAUDE.md — Instruções permanentes de trabalho

Leia este arquivo e depois [CONTINUIDADE.md](CONTINUIDADE.md) **antes de qualquer tarefa**. Eles substituem o histórico de conversas anteriores.

## O que é o projeto

**Protocolos** é um conjunto de fichas de treino em HTML de arquivo único, pensadas para GitHub Pages (pasta `docs/`). Há três protocolos: **Toji** (`docs/toji/`), **Maki** (`docs/maki/`) e **Megumi** (`docs/megumi/`), escolhidos em `docs/index.html`. Os dados de uso (cargas, ordem, tema) ficam no `localStorage` do navegador de cada pessoa. O repositório é **público**.

## Protocolo ativo

- **Toji é o único em desenvolvimento ativo.** Reúne três frentes: musculação, facial e mobilidade (detalhes em [docs/TOJI.md](docs/TOJI.md)).
- **Maki e Megumi estão congelados**: preservados como estão, sem apagar nem modificar.

## Consulta ao GitHub

- Antes de modificar qualquer coisa, consulte o **HEAD atual** da `main` de `ItsLeaphy/Protocolos`. O estado do código vem do repositório, nunca da memória de sessões anteriores nem dos documentos de contexto.
- Se o HEAD divergir do que a documentação afirma, o HEAD vale; corrija a documentação e registre a divergência.
- Ao registrar estado, anote o hash do commit conferido.

## Regras permanentes

1. Sempre consultar o HEAD atual do GitHub antes de modificar o projeto.
2. Ler primeiro `CLAUDE.md` e `CONTINUIDADE.md`.
3. Consultar os documentos específicos conforme a tarefa (mapa em `CONTINUIDADE.md`).
4. Não repetir auditorias já realizadas sem motivo técnico concreto.
5. Não confundir decisões discutidas com funcionalidades implementadas.
6. Não alterar Maki e Megumi durante o ciclo ativo do Toji.
7. Não executar migrações destrutivas sem backup e validação.
8. Não adicionar dados pessoais desnecessários ao repositório público.
9. Testar alterações reais antes de afirmar que funcionam.
10. Atualizar a documentação quando o estado do projeto mudar.
11. Ao concluir cada etapa, informar arquivos modificados, testes realizados, limitações e pendências.

## Preservação de dados

- Hoje não há exportação nem backup: o histórico do usuário existe só no navegador dele. Qualquer mudança que toque armazenamento exige, antes, backup e validação.
- Não renomear nem remover chaves de armazenamento existentes sem migração testada e não destrutiva.
- O histórico nunca pode depender da posição do exercício na lista; use IDs permanentes. Reordenar, editar ou arquivar não pode associar registros ao exercício errado.
- Importação de backup deve validar os dados antes de substituir qualquer registro.

## Privacidade (repositório público)

- Não adicionar dados pessoais ou de saúde: idade, medidas corporais, histórico médico, lesões, local de treino, dados de terceiros.
- Os documentos históricos `1-`, `2-` e `3-*-contexto-auditoria.md` e partes do site publicado já contêm esse tipo de informação. **Leia-os para o histórico, mas não copie esses dados para novos documentos.**
- Reescrever o histórico Git ou remover esses arquivos é decisão do usuário e exige autorização explícita.

## Como usar e atualizar a documentação

| Mudou... | Atualize |
|---|---|
| O estado do projeto (o que está implementado/pendente, próxima tarefa) | `CONTINUIDADE.md` |
| Uma decisão foi tomada, implementada, substituída ou descartada | `DECISOES.md` (mude o **estado**; não apague a linha) |
| A ficha, a estrutura ou o contexto de uma frente do Toji | `docs/TOJI.md` |
| A entrada do projeto (descrição, links) | `README.md` |
| Instruções permanentes | este arquivo |

- Cada fato mora em **um** documento; os demais só apontam para ele.
- Documentos históricos (`1-`, `2-`, `3-*`, `auditoria-protocolo-toji.md`, `auditoria/`, `files (1).zip`) são **fonte histórica**, não estado atual. Não os edite; se estiverem desatualizados, a correção vai nos documentos vivos.
- Não invente datas, atribuições nem conteúdo. Se a informação não existe, registre como lacuna.

## O que Claude não deve fazer sem autorização explícita

- Alterar HTML, CSS ou JS de qualquer protocolo, ou a ficha de musculação.
- Mexer em Maki ou Megumi.
- Alterar armazenamento, chaves ou fazer migração de dados.
- Implementar facial ou mobilidade antes de o conteúdo estar consolidado.
- Corrigir o PWA/service worker, ou alterar o histórico Git.
- Apagar documentos históricos.
- Transformar uma proposta em decisão, ou inventar rotinas.
- Publicar (`push`) mudanças sem o usuário pedir.
