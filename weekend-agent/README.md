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
   com endereço, horário de fim de semana, link (campo `fonte`) e por que
   combinam com o perfil da família. Editar/adicionar linhas aqui conforme
   forem descobrindo novos lugares fixos.
3. **Routine semanal (toda quarta-feira)** — uma tarefa agendada do Claude
   Code que, toda quarta: (a) procura newsletters de agenda cultural
   recebidas no Gmail nos últimos dias; (b) faz uma busca extensa na web
   por programação do fim de semana seguinte (shows, peças, feiras,
   exposições temporárias) em Belo Horizonte e cidades num raio de até
   150km; (c) combina tudo com a tabela de atividades fixas. Ela filtra e
   organiza considerando os critérios de `preferences.yaml` (sem cortar
   por orçamento — isso quem decide é a família), monta um roteiro
   detalhado e publica como um artifact.
4. **Cada item do roteiro traz**: nome, categoria, local, endereço,
   dia/horário, preço, um **link para mais informações** (site oficial,
   página de ingressos, matéria ou post/perfil do Instagram quando não há
   outra fonte) e a **classificação etária/indicativa recomendada quando
   ela for divulgada** (comum em teatro/shows; não existe para
   parques/museus abertos ao público em geral, então fica de fora nesses
   casos em vez de ser inventada).
5. **Notificação** — ao final, a Routine dispara uma notificação push
   curta avisando que o roteiro do fim de semana está pronto, com o link
   do artifact.

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
disparo semanal às quartas-feiras (10h BRT / 13h UTC), e embute uma cópia
do conteúdo de `preferences.yaml` e `fixed-activities.yaml` no próprio
prompt, para funcionar de forma autocontida. Se estes arquivos forem
alterados, atualize a Routine também (`update_trigger`) para manter as
duas fontes em sincronia.

Ela roda retomando a sessão de Claude Code do usuário (`persistent_session_id`),
em vez de abrir uma sessão nova a cada disparo — essa organização não
permite conceder o conector do Gmail a uma sessão nova via `create_trigger`,
então esse é o jeito de a Routine conseguir ler as newsletters de agenda
cultural do usuário e de garantir que a notificação push chegue no celular
já conectado a essa sessão.
