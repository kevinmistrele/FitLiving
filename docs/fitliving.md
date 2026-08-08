# Especificação Funcional — App de Treino, Dieta e Acompanhamento

> Documento do que o web app precisa ter — versão Web e versão iOS.
> Foco no **o quê**, não no **como** técnico.

---

## 1. Visão Geral

App pessoal de uso único (apenas o dono acessa, protegido por login simples) para acompanhar treino, dieta e evolução física ao longo do tempo. Os dados ficam salvos na nuvem e sincronizam entre dispositivos, permitindo registrar em um aparelho e consultar em outro.

**Objetivo do usuário:** emagrecer preservando/ganhando músculo (recomposição corporal), com meta intermediária de peso para novembro e acompanhamento contínuo depois disso.

### Princípios

- Acesso rápido: abrir e registrar em poucos toques (uso diário, muitas vezes logo após o treino).
- Dados persistentes na nuvem, sincronizados entre web e iPhone.
- Login simples só para proteger os dados pessoais (usuário único).
- Funcionar bem no celular (tela pequena, uso com uma mão).
- Instalável na tela inicial do iPhone e utilizável offline com sincronização posterior.

---

## 2. Login e Acesso

- Tela de login com um método simples (por exemplo, conta Google ou email/senha).
- Apenas o dono tem acesso; não há cadastro público de novos usuários.
- Após o login, manter a sessão ativa para não precisar logar toda vez.
- Botão de sair (logout).

---

## 3. Módulo: Treino

Registro do plano de treino e da progressão de carga semana a semana.

### 3.1 Estrutura do treino

- 5 dias de treino (segunda a sexta), sendo 3 dias de full body (seg/qua/sex) e 2 dias de cardio leve + core (ter/qui).
- Cada dia contém uma lista de exercícios.
- Cada exercício tem: nome, número de séries e faixa de repetições.

### 3.2 Registro de carga

- Para cada exercício, permitir anotar a carga (peso) usada em cada semana.
- Guardar o histórico de cargas ao longo das semanas para visualizar a progressão.
- Marcar um exercício como concluído no dia (checkbox).
- Destacar quando a carga aumentou em relação à semana anterior (sinal de progresso).

### 3.3 Edição

- Permitir adicionar, remover ou editar exercícios de cada dia.
- Permitir ajustar séries e repetições.

> **Lembrete de uso exibido no app:** aquecer antes, deixar 1–2 repetições na reserva, e como o treino é ao meio-dia em jejum, comer algo leve 1h antes e hidratar.

---

## 4. Módulo: Dieta e Metas

Exibição das metas calóricas e de macronutrientes, com um exemplo de distribuição de refeições.

### 4.1 Metas (calculadas a partir dos dados do usuário)

- Dados base editáveis: altura, peso atual, idade, nível de atividade.
- Calcular e exibir: gasto energético total estimado (TDEE) e meta calórica diária para emagrecer (déficit moderado).
- Exibir IMC atual e faixa de peso saudável de referência.
- Recalcular automaticamente as metas quando o peso for atualizado.

### 4.2 Macronutrientes

- Exibir metas diárias de proteína, carboidrato e gordura (em gramas e calorias).
- Destacar a meta de proteína, por ser prioridade para preservar/ganhar músculo.

### 4.3 Exemplo de refeições

- Mostrar um exemplo de dia completo de refeições que bate as metas.
- Cada refeição: nome, descrição, calorias aproximadas e proteína aproximada.
- Encaixar pré e pós-treino no horário do meio-dia.

> **Regras práticas fixas exibidas no app:** priorizar proteína em toda refeição; cortar líquido calórico (refrigerante, suco, álcool); metade do prato de vegetais; consistência ao longo de meses vale mais que dieta radical; beber bastante água.

---

## 5. Módulo: Acompanhamento

Registro semanal da evolução física — a parte central do app para o médio/longo prazo.

### 5.1 Registro semanal

- Para cada semana, registrar: data, peso (kg), medida de cintura (cm) e um campo de observações (energia, foto, roupa).
- Calcular automaticamente a variação de peso em relação à semana anterior (delta).
- Usar o peso inicial de referência (105 kg) como base da primeira semana.

### 5.2 Visualização da evolução

- Gráfico da evolução do peso ao longo das semanas.
- Gráfico ou destaque da evolução da cintura (indicador-chave para recomposição corporal).
- Mostrar total perdido desde o início e ritmo médio por semana.

### 5.3 Metas visuais

- Exibir as metas de referência: alvo confortável para novembro (~93–95 kg), teto (~89–92 kg), marco de saída do sobrepeso (82 kg).
- Destacar visualmente a janela das férias de novembro.
- Mostrar progresso em relação à meta (por exemplo, barra de progresso).

> **Orientação de uso exibida no app:** pesar-se 1x por semana, mesmo dia, de manhã em jejum. A medida da cintura vale mais que a balança durante a recomposição.

---

## 6. Diferenças entre as Versões

### 6.1 Versão Web

- Acessível por navegador em qualquer dispositivo, com URL própria.
- Instalável na tela inicial do iPhone (comportamento de app: tela cheia, ícone próprio).
- Layout responsivo — precisa funcionar bem tanto no celular quanto em telas maiores (notebook).
- Funcionar offline e sincronizar quando voltar a ter conexão.

### 6.2 Versão iOS

- Mesmas funcionalidades e mesmos dados da versão web (mesma conta, dados sincronizados).
- Experiência adaptada ao iPhone: navegação por toque, gestos, componentes nativos de data e teclado numérico ao inserir peso/carga.
- Notificações locais opcionais: lembrete do treino (meio-dia, seg–sex) e da pesagem semanal.
- Acesso rápido pela tela inicial; possibilidade de widget mostrando peso atual e progresso.

> **Sobre criar app iOS sem Mac:** vale confirmar. Publicar na App Store geralmente exige uma conta de desenvolvedor Apple e, na prática, um Mac para o build final e envio — embora existam serviços de build em nuvem que contornam parte disso. Para uso pessoal, a versão web instalada na tela inicial do iPhone entrega quase tudo que um app nativo entregaria, sem Mac e sem App Store. Confirme essa etapa antes de investir na versão nativa.

---

## 7. Dados que o App Guarda

- **Perfil:** altura, peso atual, idade, nível de atividade, metas.
- **Treino:** dias, exercícios (nome, séries, reps) e histórico de cargas por semana.
- **Dieta:** metas calóricas e de macros, exemplo de refeições.
- **Acompanhamento:** registros semanais (data, peso, cintura, observações).
- Todos vinculados à conta do usuário e sincronizados na nuvem.

---

## 8. Ordem Sugerida de Construção

1. Login e estrutura de dados na nuvem.
2. Módulo Acompanhamento (o mais usado no dia a dia: registrar peso/cintura e ver evolução).
3. Módulo Treino (registro de carga por semana).
4. Módulo Dieta e Metas (metas e exemplo de refeições).
5. Ajustes de PWA / instalação na tela inicial e refinamento mobile.
6. Extras da versão iOS (notificações, widget) se for seguir com app nativo.