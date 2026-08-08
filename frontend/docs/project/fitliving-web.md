# Especificação Funcional — Versão Web

> App de Treino, Dieta e Acompanhamento. Foco no **o quê**, não no **como** técnico.

---

## 1. Visão Geral

Web app pessoal de uso único (apenas o dono acessa, protegido por login simples) para acompanhar treino, dieta e evolução física ao longo do tempo. Dados salvos na nuvem, sincronizados entre dispositivos.

**Objetivo do usuário:** emagrecer preservando/ganhando músculo (recomposição corporal), com meta intermediária de peso para novembro e acompanhamento contínuo depois disso.

### Princípios

- Acesso rápido: abrir e registrar em poucos toques.
- Dados persistentes na nuvem, sincronizados.
- Login simples só para proteger os dados (usuário único).
- Layout responsivo: funcionar bem no celular e em telas maiores (notebook).
- Instalável na tela inicial do iPhone (tela cheia, ícone próprio).
- Funcionar offline e sincronizar quando voltar a conexão.

---

## 2. Login e Acesso

- Tela de login com método simples (conta Google ou email/senha).
- Apenas o dono tem acesso; sem cadastro público.
- Manter sessão ativa após login.
- Botão de sair (logout).

---

## 3. Módulo: Treino

Registro do plano de treino e da progressão de carga semana a semana.

### 3.1 Estrutura

- 5 dias (segunda a sexta): 3 de full body (seg/qua/sex) + 2 de cardio leve + core (ter/qui).
- Cada dia contém uma lista de exercícios.
- Cada exercício: nome, número de séries e faixa de repetições.

### 3.2 Registro de carga

- Anotar a carga (peso) usada em cada semana, por exercício.
- Guardar histórico de cargas ao longo das semanas.
- Marcar exercício como concluído no dia (checkbox).
- Destacar quando a carga aumentou vs. semana anterior.

### 3.3 Edição

- Adicionar, remover ou editar exercícios de cada dia.
- Ajustar séries e repetições.

> Lembrete no app: aquecer antes, deixar 1–2 reps na reserva; treino é ao meio-dia em jejum, comer algo leve 1h antes e hidratar.

---

## 4. Módulo: Dieta e Metas

### 4.1 Metas (calculadas dos dados do usuário)

- Dados base editáveis: altura, peso atual, idade, nível de atividade.
- Calcular e exibir TDEE e meta calórica diária para emagrecer (déficit moderado).
- Exibir IMC atual e faixa de peso saudável.
- Recalcular metas quando o peso for atualizado.

### 4.2 Macronutrientes

- Metas diárias de proteína, carboidrato e gordura (gramas e calorias).
- Destacar a proteína (prioridade para preservar/ganhar músculo).

### 4.3 Exemplo de refeições

- Exemplo de dia completo que bate as metas.
- Cada refeição: nome, descrição, calorias e proteína aproximadas.
- Encaixar pré e pós-treino no horário do meio-dia.

> Regras fixas no app: priorizar proteína; cortar líquido calórico; metade do prato de vegetais; consistência > dieta radical; beber água.

---

## 5. Módulo: Acompanhamento

Parte central do app para o médio/longo prazo.

### 5.1 Registro semanal

- Registrar por semana: data, peso (kg), cintura (cm) e observações (energia, foto, roupa).
- Calcular a variação de peso vs. semana anterior (delta).
- Peso inicial de referência: 105 kg (base da primeira semana).

### 5.2 Visualização

- Gráfico da evolução do peso.
- Gráfico/destaque da evolução da cintura (indicador-chave da recomposição).
- Total perdido desde o início e ritmo médio por semana.

### 5.3 Metas visuais

- Metas de referência: alvo confortável novembro (~93–95 kg), teto (~89–92 kg), saída do sobrepeso (82 kg).
- Destacar a janela das férias de novembro.
- Progresso em relação à meta (barra de progresso).

> Orientação no app: pesar-se 1x/semana, mesmo dia, de manhã em jejum. A cintura vale mais que a balança na recomposição.

---

## 6. Específico da Web

- Acessível por navegador em qualquer dispositivo, com URL própria.
- Instalável na tela inicial do iPhone.
- Responsivo (celular e desktop).
- Offline com sincronização posterior.

---

## 7. Dados que o App Guarda

- **Perfil:** altura, peso, idade, nível de atividade, metas.
- **Treino:** dias, exercícios (nome, séries, reps), histórico de cargas por semana.
- **Dieta:** metas calóricas e de macros, exemplo de refeições.
- **Acompanhamento:** registros semanais (data, peso, cintura, observações).
- Todos vinculados à conta e sincronizados na nuvem.

---

## 8. Ordem Sugerida de Construção

1. Login e estrutura de dados na nuvem.
2. Módulo Acompanhamento (mais usado no dia a dia).
3. Módulo Treino (registro de carga por semana).
4. Módulo Dieta e Metas.
5. Ajustes de PWA / instalação na tela inicial e refinamento mobile.
