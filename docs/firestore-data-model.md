# Modelo de Dados — Cloud Firestore

> **Status: todas as seções (1.1–1.7) implementadas** no frontend. Seção 1.1 (`profile/main`)
> e 1.2 (`checkins`) — `frontend/src/lib/profile.ts`, `frontend/src/features/check-ins/` —
> como parte do **módulo Acompanhamento** (item 2 da "Ordem Sugerida de Construção", seção 8
> de `fitliving.md`). Seções 1.3–1.5 (`workoutDays`/`exercises`/`loadHistory`) —
> `frontend/src/features/workouts/` — como parte do **módulo Treino** (item 3). Seções 1.6–1.7
> (Dieta) — `frontend/src/lib/profile.ts` (campos `heightCm`/`age`/`sex`/`activityLevel`/
> `dietDeficitLevel`) e `frontend/src/features/diet/` — como parte do **módulo Dieta e Metas**
> (item 4, último módulo funcional do plano). Em todos os casos, nomes de campos e fórmulas
> seguem o especificado abaixo — nenhum ajuste de nome foi necessário durante a implementação.
> Confirmando a decisão da seção 1.6: `dietGoals/main` **não foi persistido** — TDEE, meta
> calórica, IMC e macros são calculados em memória a cada render a partir de `profile/main`
> (`useMemo` sobre o resultado de `useProfileQuery`), então essa coleção não existe no
> Firestore nem tem regra de segurança própria (ver seção 3).

Backend: 100% Firebase. Autenticação via Firebase Authentication (email/senha, dono único,
sem cadastro público). Persistência via Cloud Firestore. Não há API REST própria — o
cliente (web e iOS) fala diretamente com o Firestore através do SDK, respeitando as regras
de segurança da seção 3.

Convenção geral: todo o dado do usuário fica particionado sob `users/{uid}/...`, onde `uid`
é o `request.auth.uid` do Firebase Authentication. Como o app é de uso único (um único
dono), `{uid}` sempre corresponde à mesma pessoa, mas o particionamento por `uid` ainda é o
padrão correto: é o que a regra de segurança usa para negar qualquer acesso não autenticado
ou de outra conta, e evita reescrever o modelo se um dia houver mais de um usuário.

---

## 1. Coleções e documentos

### 1.1 `users/{uid}/profile/main` — Perfil (documento único)

Documento único (não subcoleção) porque há exatamente um perfil por usuário e ele é sempre
lido/escrito por inteiro nas telas de Perfil e Metas. Usar um ID fixo (`main`) evita ter
que descobrir/armazenar um ID de documento em outro lugar.

| Campo | Tipo | Editável / Calculado | Descrição |
|---|---|---|---|
| `heightCm` | number | editável | Altura em centímetros. Base para IMC e TDEE. |
| `age` | number | editável | Idade em anos. Base para TDEE (Mifflin-St Jeor). |
| `sex` | string (`"male"` \| `"female"`) | editável | Necessário porque a fórmula de TDEE tem termo diferente por sexo biológico. |
| `activityLevel` | string (enum, ver §2.1) | editável | Nível de atividade usado no multiplicador de TDEE. |
| `currentWeightKg` | number | **derivado** | Espelho do peso do check-in mais recente (`checkins`, ordenado por `date` desc). Mantido em cache aqui para não precisar de uma query extra sempre que a UI de Perfil/Metas precisar do peso atual; recalculado (sobrescrito) toda vez que um novo check-in é salvo. |
| `initialWeightKg` | number | editável (default `105`) | Peso inicial de referência (seção 5.1 da spec). Fixado no primeiro uso, editável para permitir correção manual. |
| `goalNovemberComfortableKg` | number | editável (default `94`, meio da faixa 93–95) | Alvo confortável para novembro. |
| `goalCapKg` | number | editável (default `90`, meio da faixa 89–92) | Teto de novembro. |
| `goalOverweightExitKg` | number | editável (default `82`) | Marco de saída do sobrepeso. |
| `novemberWindowStart` | Timestamp | editável (default 1º nov do ano corrente) | Início da janela de férias de novembro, para destaque visual (seção 5.3). |
| `novemberWindowEnd` | Timestamp | editável (default 30 nov do ano corrente) | Fim da janela de férias de novembro. |
| `dietDeficitLevel` | string (`"moderate"`, default) | editável | Intensidade do déficit calórico (ver §2.2). Guardado para permitir ajuste futuro sem hardcode no cliente. |
| `updatedAt` | Timestamp | calculado (server timestamp) | Última escrita, para auditoria/depuração. |

> Os três campos de meta (`goalNovemberComfortableKg`, `goalCapKg`, `goalOverweightExitKg`)
> e `initialWeightKg` são exatamente os "campos editáveis no perfil/metas" pedidos no
> contexto da tarefa — nenhum valor de referência fica hardcoded no app; os defaults acima
> só populam o documento na primeira criação.

**TDEE, meta calórica, IMC e macros não são armazenados** — são sempre recalculados no
cliente (ou em uma Cloud Function futura) a partir de `profile/main` + `currentWeightKg`,
porque a spec exige que recalculem automaticamente quando o peso muda (seção 4.1). Guardar
esses valores calculados criaria risco de ficarem desatualizados. Ver fórmulas na seção 2.

---

### 1.2 `users/{uid}/checkins/{checkinId}` — Acompanhamento (subcoleção)

Subcoleção com um documento por semana, porque:
- é uma série temporal que cresce indefinidamente (uma entrada por semana, por anos);
- a tela de evolução (seção 5.2) precisa **consultar ordenado por data** (`orderBy('date')`)
  para desenhar os gráficos de peso e cintura e calcular a variação (delta) em relação à
  semana anterior — uma subcoleção com campo `date` indexável suporta isso nativamente,
  um documento único não suportaria;
- cada registro é imutável na prática (uma edição pontual não deveria afetar os demais),
  o que combina bem com documentos independentes em vez de um array gigante dentro de um
  único documento (que teria limite de 1 MiB e pioraria a granularidade de escrita/leitura).

`checkinId`: usar o ID autogerado do Firestore (`addDoc`) — não usar a data como ID para
evitar colisão caso o usuário registre mais de um check-in na mesma semana (correção de
peso digitado errado, por exemplo) sem precisar de lógica de merge.

| Campo | Tipo | Editável / Calculado | Descrição |
|---|---|---|---|
| `date` | Timestamp | editável | Data do registro semanal. Indexado implicitamente (índice single-field automático do Firestore) para permitir `orderBy('date')`. |
| `weightKg` | number | editável | Peso da semana, em kg. |
| `waistCm` | number | editável | Medida de cintura, em cm — "vale mais que a balança" (seção 5.1/5.3 da spec), por isso é campo de primeira classe, não um detalhe dentro de observações. |
| `notes` | string | editável | Observações livres (energia, foto, roupa — conforme seção 5.1). |
| `deltaWeightKg` | number \| null | **derivado** | Diferença de peso vs. o check-in anterior por data. Calculado no momento da escrita (cliente ou Cloud Function) e também persistido, para não exigir buscar o documento anterior toda vez que a lista for renderizada. `null` no primeiro check-in (não há semana anterior) — ou, se o app quiser usar `initialWeightKg` do perfil como semana "zero", o delta do primeiro check-in é calculado contra `profile.initialWeightKg`. |
| `createdAt` | Timestamp | calculado (server timestamp) | Quando o documento foi criado — auditoria, desempate em caso de duas entradas na mesma `date`. |

Consultas típicas suportadas por este desenho:
- Lista completa ordenada: `checkins` `orderBy('date', 'asc')`.
- Último check-in (para `profile.currentWeightKg`): `orderBy('date', 'desc') limit(1)`.
- Total perdido desde o início = `initialWeightKg` (ou peso do 1º check-in) − peso do
  check-in mais recente. Ritmo médio por semana = total perdido / número de semanas entre a
  primeira e a última data. Ambos calculados no cliente a partir da lista, não armazenados.

---

### 1.3 `users/{uid}/workoutDays/{dayId}` — Treino: estrutura dos 5 dias (subcoleção fixa)

Subcoleção em vez de documento único porque, embora o número de dias seja fixo (5), a spec
pede edição por dia (adicionar/remover/editar exercícios — seção 3.3) e cada dia é uma
unidade natural de leitura na tela "treino do dia". Usar 5 documentos pequenos e
independentes é mais simples de editar do que um único documento com um array de 5 blocos
grandes (menos risco de sobrescrever o dia errado em updates concorrentes entre web/iOS).

`dayId`: chave fixa e previsível — `"mon"`, `"tue"`, `"wed"`, `"thu"`, `"fri"` — não
autogerada, porque a estrutura de dias é fixa pela spec (seg–sex) e o app sempre sabe qual
documento buscar a partir do dia da semana.

| Campo | Tipo | Editável / Calculado | Descrição |
|---|---|---|---|
| `dayId` | string (`"mon"`\|`"tue"`\|`"wed"`\|`"thu"`\|`"fri"`) | fixo | Redundante com o ID do doc, mantido para facilitar queries de coleção (`where`) sem depender do nome do doc. |
| `weekday` | number (1–5, 1=segunda) | fixo | Ordenação estável na UI. |
| `type` | string (`"full_body"` \| `"cardio_core"`) | fixo (definido pela spec: seg/qua/sex = full body; ter/qui = cardio leve + core) | Determina UI/rótulo do dia. |
| `label` | string | editável | Nome de exibição do dia (ex.: "Full Body A"). |
| `updatedAt` | Timestamp | calculado | Última edição da lista de exercícios do dia. |

Exercícios do dia ficam em subcoleção (ver 1.4) em vez de array embutido, pelo mesmo motivo
do histórico de cargas: cada exercício acumula um histórico semanal próprio, então precisa
de identidade de documento estável para ser referenciado.

### 1.4 `users/{uid}/workoutDays/{dayId}/exercises/{exerciseId}` — Exercícios (subcoleção)

| Campo | Tipo | Editável / Calculado | Descrição |
|---|---|---|---|
| `name` | string | editável | Nome do exercício. |
| `sets` | number | editável | Número de séries. |
| `repsMin` | number | editável | Piso da faixa de repetições. |
| `repsMax` | number | editável | Teto da faixa de repetições. |
| `order` | number | editável | Posição de exibição dentro do dia (permite reordenar sem depender da ordem de criação). |
| `completedThisWeek` | boolean | editável (reset semanal, ver nota) | Checkbox "concluído no dia" (seção 3.2). |
| `lastCompletedAt` | Timestamp \| null | calculado | Quando foi marcado como concluído pela última vez; usado para decidir se `completedThisWeek` deve ser resetado (ex.: se `lastCompletedAt` é de uma semana anterior à atual, a UI trata como não concluído sem precisar de um job agendado). |
| `createdAt` | Timestamp | calculado | Auditoria. |

`exerciseId`: ID autogerado (`addDoc`) — a lista de exercícios de um dia é livremente
editável (adicionar/remover — seção 3.3), então não há chave natural estável.

### 1.5 `users/{uid}/workoutDays/{dayId}/exercises/{exerciseId}/loadHistory/{loadEntryId}` — Histórico de carga (subcoleção)

Subcoleção aninhada sob o exercício (3 níveis de profundidade) em vez de um array de cargas
dentro do próprio exercício, pelo mesmo raciocínio dos check-ins: é uma série temporal que
cresce toda semana indefinidamente, precisa ser consultada ordenada por data para desenhar
a progressão e para comparar "essa semana vs. semana anterior" (seção 3.2 — destacar quando
a carga aumentou), e documentos independentes evitam o limite de 1 MiB por documento e
conflitos de escrita concorrente entre dispositivos.

| Campo | Tipo | Editável / Calculado | Descrição |
|---|---|---|---|
| `weekOf` | Timestamp | editável | Data de referência da semana (normalizada, ex.: segunda-feira daquela semana), usada para `orderBy('weekOf')`. |
| `loadKg` | number | editável | Carga usada naquela semana. |
| `repsAchieved` | number \| null | editável (opcional) | Repetições efetivamente realizadas, se o usuário quiser registrar (complementa a faixa planejada do exercício). |
| `increasedVsPrevious` | boolean | **derivado** | `true` se `loadKg` desta entrada > `loadKg` da entrada anterior por `weekOf`. Calculado e persistido no momento da escrita para permitir destacar progresso na lista sem uma segunda leitura (seção 3.2). |
| `createdAt` | Timestamp | calculado | Auditoria. |

`loadEntryId`: ID autogerado — uma entrada por semana por exercício, mas nada impede correção
posterior (nova entrada substituindo/complementando), então autogerado é mais simples que
usar `weekOf` como ID (evita ter que formatar/normalizar datas como string de ID).

---

### 1.6 `users/{uid}/dietGoals/main` — Dieta: metas (documento único)

Documento único: as metas de dieta derivam inteiramente do perfil (peso, altura, idade,
atividade) e são recalculadas juntas — não há histórico de metas de dieta na spec, apenas
o estado atual (seção 4).

Na prática, este documento pode ser **inteiramente calculado no cliente a partir de
`profile/main`** (ver fórmulas seção 2) e nunca persistido — ele é listado aqui porque a
tarefa pede que o schema cubra "metas calóricas/macros calculadas" explicitamente, e porque
cachear o resultado evita recomputar em toda renderização e dá um lugar para guardar
ajustes manuais finos (ex.: usuário quer arredondar a meta de proteína). Se a implementação
optar por calcular tudo em memória sem persistir, este documento pode ser omitido — não há
perda de dado, pois tudo é derivado de `profile/main`.

| Campo | Tipo | Editável / Calculado | Descrição |
|---|---|---|---|
| `tdeeKcal` | number | calculado | Gasto energético total estimado (§2.1). |
| `targetCalKcal` | number | calculado | Meta calórica diária com déficit moderado (§2.2). |
| `bmi` | number | calculado | IMC atual (§2.3). |
| `healthyWeightMinKg` / `healthyWeightMaxKg` | number | calculado | Faixa de peso saudável para a altura cadastrada (§2.3). |
| `proteinG` / `proteinKcal` | number | calculado | Meta de proteína, em gramas e calorias (§2.4). |
| `carbsG` / `carbsKcal` | number | calculado | Meta de carboidrato. |
| `fatG` / `fatKcal` | number | calculado | Meta de gordura. |
| `calculatedFromWeightKg` | number | calculado | Peso usado no cálculo, para exibir "calculado com base em X kg" e detectar quando está desatualizado vs. `profile.currentWeightKg`. |
| `updatedAt` | Timestamp | calculado | Quando foi recalculado pela última vez. |

### 1.7 `users/{uid}/mealPlan/{mealId}` — Exemplo de refeições (subcoleção)

Subcoleção porque um "dia completo de refeições" (seção 4.3) é uma lista ordenável de
itens (café da manhã, pré-treino, pós-treino, almoço, jantar, ceia...) que o usuário edita
item a item; um array embutido em `dietGoals/main` também funcionaria dado o volume baixo
(tipicamente 4–6 refeições), mas a subcoleção é escolhida para manter consistência de
padrão com o resto do schema (edição individual sem reescrever o documento inteiro) e para
não competir por escrita com os campos calculados de `dietGoals/main`.

| Campo | Tipo | Editável / Calculado | Descrição |
|---|---|---|---|
| `name` | string | editável | Nome da refeição (ex.: "Almoço pós-treino"). |
| `description` | string | editável | Descrição do conteúdo. |
| `approxKcal` | number | editável | Calorias aproximadas. |
| `approxProteinG` | number | editável | Proteína aproximada, em gramas. |
| `order` | number | editável | Posição no dia. |
| `timing` | string (`"pre_workout"` \| `"post_workout"` \| `"other"`) | editável | Marca refeições de pré/pós-treino para encaixar no horário do meio-dia (seção 4.3). |

---

## 2. Fórmulas de cálculo

Todas calculadas no cliente (ou futuramente em uma Cloud Function `onWrite` de `checkins`/
`profile`), nunca hardcoded para um peso específico — sempre a partir dos campos editáveis
do perfil e do peso mais recente.

### 2.1 TDEE — Mifflin-St Jeor + multiplicador de atividade

Escolhida por ser a fórmula de BMR mais recomendada atualmente na literatura de nutrição
esportiva (mais precisa que Harris-Benedict para a população em geral), simples de
implementar e de explicar ao usuário.

```
BMR (homem)  = 10 * pesoKg + 6.25 * alturaCm - 5 * idade + 5
BMR (mulher) = 10 * pesoKg + 6.25 * alturaCm - 5 * idade - 161

TDEE = BMR * multiplicadorAtividade
```

`activityLevel` (enum em `profile.activityLevel`) e multiplicador padrão:

| Valor | Multiplicador | Descrição |
|---|---|---|
| `sedentary` | 1.2 | Pouco ou nenhum exercício |
| `light` | 1.375 | Exercício leve 1–3 dias/semana |
| `moderate` | 1.55 | Exercício moderado 3–5 dias/semana |
| `active` | 1.725 | Exercício intenso 6–7 dias/semana |
| `very_active` | 1.9 | Exercício muito intenso / trabalho físico |

Para o perfil descrito na spec (treino 5x/semana: 3 full body + 2 cardio leve), o default
razoável é `moderate` (1.55), mas o campo é editável.

### 2.2 Meta calórica diária — déficit moderado

```
targetCalKcal = TDEE - deficit
```

`dietDeficitLevel` (`profile.dietDeficitLevel`) mapeia para um déficit fixo em kcal/dia,
não percentual, por ser mais previsível e fácil de comunicar ao usuário:

| Valor | Déficit | Perda semanal esperada (~) |
|---|---|---|
| `mild` | 250 kcal/dia | ~0,25 kg/semana |
| `moderate` (default) | 500 kcal/dia | ~0,45 kg/semana (1 lb/semana) — heurística padrão (déficit de ~3.500 kcal ≈ 0,45 kg de gordura) |
| `aggressive` | 750 kcal/dia | ~0,7 kg/semana |

`moderate` é o default pois casa com a linguagem da spec ("déficit moderado", seção 4.1) e
com o ritmo de perda implícito nas metas de novembro (105 kg → ~94 kg em alguns meses).
Aplicar um piso de segurança: `targetCalKcal` nunca deve ficar abaixo de `BMR * 1.0` (não
recomendar déficit tão agressivo a ponto de ficar abaixo do metabolismo basal) — se o
cálculo cair abaixo disso, arredondar para `BMR`.

### 2.3 IMC e faixa de peso saudável

```
IMC = pesoKg / (alturaM)^2        // alturaM = heightCm / 100

pesoSaudavelMinKg = 18.5 * (alturaM)^2
pesoSaudavelMaxKg = 24.9 * (alturaM)^2
```

Faixa de classificação padrão da OMS (referência universal, sem necessidade de
customização): abaixo de 18,5 = abaixo do peso; 18,5–24,9 = peso saudável; 25–29,9 =
sobrepeso; ≥30 = obesidade. Usado apenas para exibição (seção 4.1); não afeta outros
cálculos.

### 2.4 Distribuição de macronutrientes — priorizando proteína

Ordem de cálculo importa: proteína primeiro (prioridade explícita da spec, seção 4.2), depois
gordura como piso mínimo, e o restante das calorias em carboidrato.

```
proteinG   = 2.0 * pesoKg              // g de proteína por kg de peso corporal
proteinKcal = proteinG * 4

fatG       = 0.8 * pesoKg              // piso de gordura por kg de peso corporal
fatKcal    = fatG * 9

carbsKcal  = targetCalKcal - proteinKcal - fatKcal
carbsG     = max(carbsKcal, 0) / 4     // nunca negativo
```

Justificativa dos coeficientes (padrões comuns em literatura de recomposição corporal /
treino de força com déficit calórico):
- **Proteína — 2,0 g/kg**: dentro da faixa 1,6–2,2 g/kg tipicamente recomendada para
  preservar massa magra em déficit calórico com treino de resistência; 2,0 g/kg é um valor
  central seguro e fácil de comunicar.
- **Gordura — 0,8 g/kg (piso)**: suficiente para função hormonal sem consumir calorias
  demais do orçamento, deixando mais espaço para carboidrato (energia para treino) —
  consistente com a faixa geral de 0,6–1,0 g/kg usada em planos de déficit.
- **Carboidrato — resto**: preenche o restante do orçamento calórico; se o cálculo resultar
  em `carbsKcal` negativo (perfil de peso muito baixo ou déficit muito agressivo), tratar
  como 0 e sinalizar na UI que a meta calórica está baixa demais para os pisos de proteína/
  gordura escolhidos.

Todos os quatro cálculos (2.1–2.4) devem re-executar automaticamente sempre que
`profile.currentWeightKg` mudar (isto é, sempre que um novo check-in for salvo) ou que
qualquer campo base do perfil for editado — conforme exigido pela seção 4.1 da spec.

---

## 3. Regras de segurança (Firestore Security Rules)

Todas as coleções seguem o mesmo padrão de particionamento por `uid` já esboçado como
exemplo comentado em `frontend/firestore.rules` pelo agente que está construindo o login:
acesso liberado somente ao dono autenticado, negado por padrão a todo o resto.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;

      match /profile/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }

      match /checkins/{checkinId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }

      match /workoutDays/{dayId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;

        match /exercises/{exerciseId} {
          allow read, write: if request.auth != null && request.auth.uid == uid;

          match /loadHistory/{loadEntryId} {
            allow read, write: if request.auth != null && request.auth.uid == uid;
          }
        }
      }

      // dietGoals/main has no rule: it's never persisted (section 1.6) — TDEE/target
      // calories/BMI/macros are calculated in memory from profile/main on every render.

      match /mealPlan/{mealId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }

    // Padrão: negar tudo que não casar com uma regra acima.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Notas:
- A regra em `users/{uid}` já cobre logicamente as subcoleções por herança de contexto,
  mas cada subcoleção é declarada explicitamente porque regras do Firestore **não** são
  recursivas por padrão — uma regra em `users/{uid}` não se aplica automaticamente a
  `users/{uid}/checkins/{checkinId}` sem o bloco `match` aninhado (ou um `match
  /users/{uid}/{document=**}` equivalente). O bloco explícito acima é a forma mais legível
  de deixar isso claro coleção a coleção.
- Como o app é de dono único, não há necessidade de regras baseadas em papel/role — a
  checagem `request.auth.uid == uid` já é suficiente e é o mesmo padrão citado no
  contexto da tarefa.
- Validação de forma de dado (tipos, campos obrigatórios, ranges) pode ser adicionada depois
  com `request.resource.data.keys()` / `.hasAll()` / checagens de tipo, mas fica fora do
  escopo deste documento de design inicial — a app já deve validar no cliente antes de
  escrever.

---

## 4. Mapeamento spec → schema

| Seção de `docs/fitliving.md` | Cobertura no schema |
|---|---|
| 2. Login e Acesso | Fora do Firestore — Firebase Authentication. `uid` do usuário autenticado é a raiz de todo o particionamento (`users/{uid}/...`). |
| 3.1 Estrutura do treino (5 dias, full body/cardio) | `workoutDays/{dayId}` (§1.3) — `weekday`, `type` fixam a estrutura seg–sex; `exercises` subcoleção (§1.4) — `name`, `sets`, `repsMin`/`repsMax`. |
| 3.2 Registro de carga / histórico / concluído / destaque de progresso | `exercises/{exerciseId}.completedThisWeek` (checkbox); `loadHistory/{loadEntryId}` (§1.5) — histórico semanal de `loadKg`; `increasedVsPrevious` cobre o destaque de progresso. |
| 3.3 Edição (adicionar/remover/editar exercícios, séries/reps) | CRUD direto sobre documentos de `exercises/{exerciseId}` (§1.4) — `sets`, `repsMin`, `repsMax` editáveis; adicionar = novo doc, remover = delete do doc. |
| 4.1 Metas base editáveis (altura, peso, idade, atividade) + TDEE + IMC + recálculo | `profile/main` (§1.1) para os dados base; `dietGoals/main` (§1.6) + fórmulas §2.1/§2.3 para TDEE/IMC; recálculo automático disparado por mudança em `checkins` (peso) ou `profile` (demais campos). |
| 4.2 Macronutrientes (proteína/carbo/gordura, destaque proteína) | `dietGoals/main.proteinG/proteinKcal/carbsG/carbsKcal/fatG/fatKcal` (§1.6) + fórmula §2.4. |
| 4.3 Exemplo de refeições (nome, descrição, kcal, proteína, pré/pós-treino) | `mealPlan/{mealId}` (§1.7) — todos os campos mapeados 1:1, incluindo `timing` para pré/pós-treino. |
| 5.1 Registro semanal (data, peso, cintura, observações, delta, peso inicial 105 kg) | `checkins/{checkinId}` (§1.2) — `date`, `weightKg`, `waistCm`, `notes`, `deltaWeightKg`; `profile.initialWeightKg` (§1.1) guarda a referência de 105 kg. |
| 5.2 Visualização (gráfico peso/cintura, total perdido, ritmo médio) | Derivado em runtime a partir da lista ordenada de `checkins` (§1.2) — não persistido, calculado no cliente a partir de `date`/`weightKg`/`waistCm`. |
| 5.3 Metas visuais (alvo novembro, teto, saída do sobrepeso, janela de novembro, barra de progresso) | `profile.goalNovemberComfortableKg`, `profile.goalCapKg`, `profile.goalOverweightExitKg`, `profile.novemberWindowStart/End` (§1.1) — barra de progresso calculada em runtime comparando `checkins` mais recente com essas metas. |
| 7. Dados que o app guarda (Perfil / Treino / Dieta / Acompanhamento) | Cada bullet corresponde 1:1 a uma raiz de subcoleção/documento: Perfil → §1.1; Treino → §1.3–1.5; Dieta → §1.6–1.7; Acompanhamento → §1.2. |
| "Todos vinculados à conta do usuário e sincronizados na nuvem" | Particionamento `users/{uid}/...` (todas as seções) + regras de segurança (§3) garantindo que só o dono autenticado lê/escreve. |
