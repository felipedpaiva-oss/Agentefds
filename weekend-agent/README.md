# Agente de Passeios de Fim de Semana

Sistema simples para sugerir passeios de fim de semana para uma família em
Belo Horizonte, combinando uma **programação fixa** (parques e museus que
funcionam quase todo fim de semana) com uma **busca semanal** por eventos
pontuais (peças, feiras, shows, exposições temporárias, eventos ao ar livre).

## Como funciona

1. **`preferences.yaml`** — endereço/raio de busca, perfil da família e
   critérios de gosto (o que priorizar, o que evitar). Editar este arquivo
   é a forma de recalibrar as sugestões.
2. **`fixed-activities.yaml`** — tabela de atividades fixas (parques, museus)
   com endereço, horário de fim de semana e por que combinam com o perfil
   da família. Editar/adicionar linhas aqui conforme forem descobrindo
   novos lugares fixos.
3. **Routine semanal (toda quarta-feira)** — uma tarefa agendada do Claude
   Code que, toda quarta, lê estes dois arquivos e faz uma busca extensa
   na web por programação do fim de semana seguinte (shows, peças, feiras,
   exposições temporárias) em Belo Horizonte e cidades num raio de até
   150km. Ela filtra e organiza tudo considerando os critérios de
   `preferences.yaml` (sem cortar por orçamento — isso quem decide é a
   família), monta um roteiro detalhado e publica como um artifact.
4. **Notificação** — ao final, a Routine dispara uma notificação push
   curta avisando que o roteiro do fim de semana está pronto, com o link
   do artifact (que tem todos os detalhes: local, endereço, horário,
   preço e por que o programa foi escolhido).

## Atualizando o agente

- Mudou de casa ou quer ampliar/reduzir o raio? Edite `location` em
  `preferences.yaml`.
- As meninas cresceram e as preferências mudaram? Edite `preferences`.
- Descobriu um novo lugar com programação fixa de fim de semana? Adicione
  uma entrada em `fixed-activities.yaml`.
- Depois de editar, peça para atualizar também o prompt da Routine (ela
  guarda uma cópia destes dados para não depender de reclonar o repositório
  toda quarta-feira), ou o Claude Code que gerencia a Routine.

## Observação sobre a Routine

A Routine (`weekend-family-outings`) foi criada via `create_trigger`, com
disparo semanal às quartas-feiras. Ela roda em uma sessão nova a cada
disparo (não depende desta sessão continuar viva) e embute uma cópia do
conteúdo de `preferences.yaml` e `fixed-activities.yaml` no próprio prompt,
para funcionar de forma autocontida. Se estes arquivos forem alterados,
atualize a Routine também (`update_trigger`) para manter as duas fontes em
sincronia.
