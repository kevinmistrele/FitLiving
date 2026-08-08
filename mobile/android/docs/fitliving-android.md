# Especificação Funcional — Versão Android

> App de Treino, Dieta e Acompanhamento. Foco no **o quê**, não no **como** técnico.
> Mesmas funcionalidades e mesmos dados da versão web e iOS (mesma conta, dados sincronizados).

---

## 1. Visão Geral

App pessoal de uso único para Android, espelhando a versão web e compartilhando a mesma conta e os mesmos dados na nuvem. O que muda é a experiência: adaptada ao toque e aos recursos do Android.

**Objetivo do usuário:** emagrecer preservando/ganhando músculo (recomposição corporal), com meta intermediária de peso para novembro e acompanhamento contínuo.

### Princípios

- Acesso rápido pela tela inicial; registrar em poucos toques.
- Dados sincronizados com a versão web e iOS (mesma conta).
- Login simples só para proteger os dados (usuário único).
- Uso confortável com uma mão.
- Funcionar offline e sincronizar quando voltar a conexão.

---

## 2. Login e Acesso

- Login com método simples (conta Google ou email/senha), preferindo recursos nativos de autenticação do Android quando possível.
- Apenas o dono tem acesso; sem cadastro público.
- Manter sessão ativa após login.
- Botão de sair (logout).

---

## 3. Módulo: Treino

Mesmo conteúdo da web, com experiência adaptada ao Android.

### 3.1 Estrutura

- 5 dias (segunda a sexta): 3 de full body (seg/qua/sex) + 2 de cardio leve + core (ter/qui).
- Cada dia com lista de exercícios (nome, séries, faixa de repetições).

### 3.2 Registro de carga

- Anotar carga por semana, por exercício, com **teclado numérico** ao inserir peso.
- Histórico de cargas ao longo das semanas.
- Marcar exercício como concluído (toque no checkbox).
- Destacar aumento de carga vs. semana anterior.

### 3.3 Edição

- Adicionar, remover ou editar exercícios (gestos de toque, deslizar para remover).
- Ajustar séries e repetições.

> Lembrete no app: aquecer antes, deixar 1–2 reps na reserva; treino ao meio-dia em jejum, comer algo leve 1h antes e hidratar.

---

## 4. Módulo: Dieta e Metas

### 4.1 Metas (calculadas dos dados do usuário)

- Dados base editáveis: altura, peso atual, idade, nível de atividade.
- Exibir TDEE e meta calórica diária para emagrecer.
- Exibir IMC atual e faixa de peso saudável.
- Recalcular metas quando o peso mudar.

### 4.2 Macronutrientes

- Metas diárias de proteína, carboidrato e gordura (gramas e calorias).
- Destacar a proteína.

### 4.3 Exemplo de refeições

- Exemplo de dia completo que bate as metas.
- Cada refeição: nome, descrição, calorias e proteína aproximadas.
- Encaixar pré e pós-treino no horário do meio-dia.

> Regras fixas no app: priorizar proteína; cortar líquido calórico; metade do prato de vegetais; consistência > dieta radical; beber água.

---

## 5. Módulo: Acompanhamento

### 5.1 Registro semanal

- Registrar por semana: data (seletor de data nativo do Android), peso (kg, teclado numérico), cintura (cm) e observações.
- Calcular variação de peso vs. semana anterior (delta).
- Peso inicial de referência: 105 kg.

### 5.2 Visualização

- Gráfico da evolução do peso.
- Gráfico/destaque da evolução da cintura.
- Total perdido desde o início e ritmo médio por semana.

### 5.3 Metas visuais

- Metas: alvo confortável novembro (~93–95 kg), teto (~89–92 kg), saída do sobrepeso (82 kg).
- Destacar a janela das férias de novembro.
- Progresso em relação à meta (barra de progresso).

> Orientação no app: pesar-se 1x/semana, mesmo dia, de manhã em jejum. A cintura vale mais que a balança na recomposição.

---

## 6. Específico do Android

- Navegação por toque e gestos; componentes nativos de data e teclado numérico.
- **Notificações locais opcionais:** lembrete do treino (meio-dia, seg–sex) e da pesagem semanal.
- Acesso rápido pela tela inicial.
- Possibilidade de **widget de tela inicial** mostrando peso atual e progresso rumo à meta.
- Adaptar-se ao tema do sistema (modo claro/escuro) e a diferentes tamanhos de tela.
- Botão físico/gesto de voltar do Android tratado corretamente na navegação entre telas.

> **Sobre publicar no Android:** a distribuição no Android é mais simples que no iOS — não exige Mac, e a conta de desenvolvedor da Google Play tem taxa única (não anual). Para uso pessoal, também é possível instalar o app diretamente (sem loja) ou apenas usar a versão web instalada na tela inicial, que entrega quase tudo de um app nativo sem nenhum processo de publicação.

---

## 7. Dados que o App Guarda

- **Perfil:** altura, peso, idade, nível de atividade, metas.
- **Treino:** dias, exercícios (nome, séries, reps), histórico de cargas por semana.
- **Dieta:** metas calóricas e de macros, exemplo de refeições.
- **Acompanhamento:** registros semanais (data, peso, cintura, observações).
- Todos vinculados à conta e sincronizados na nuvem (mesmos dados da web e iOS).

---

## 8. Ordem Sugerida de Construção

1. Login e sincronização com a mesma base de dados da web.
2. Módulo Acompanhamento (mais usado no dia a dia).
3. Módulo Treino (registro de carga por semana).
4. Módulo Dieta e Metas.
5. Extras do Android: notificações, widget e suporte a tema claro/escuro.