# IMPROVEMENTS

Este documento lista melhorias concretas para o `ArchPull` com base no código atual. A prioridade considera impacto no produto, risco técnico e custo de implementação.

## Prioridade alta

### 1. Corrigir bloqueio de progresso por pré-requisitos
**Problema**
`RoadmapScreen.tsx` trata todo nó não concluído como `"unlocked"`, ignorando `prerequisites`.

**Impacto**
- O roadmap perde a lógica de progressão.
- O usuário pode pular etapas e quebrar a curva de aprendizado planejada.

**Arquivos**
- `src/components/RoadmapScreen.tsx`

**Melhoria**
- Introduzir o status `"locked"` em `NodeStatus`.
- Liberar um nó apenas quando todos os `prerequisites` estiverem em `completedNodes`.
- Desabilitar clique em nós bloqueados.
- Exibir badge visual de bloqueio.

**Critério de pronto**
- `design-patterns` e `solid` só ficam disponíveis após concluir `fundamentos`.
- `kafka` só fica disponível após `microsservicos` e `distribuidos`.

### 2. Persistir progresso de forma mais rica
**Problema**
Hoje o app salva apenas `string[]` com módulos concluídos em `localStorage`.

**Impacto**
- Não existe histórico por módulo.
- Não há como mostrar melhor pontuação, tentativas ou evolução do jogador.

**Arquivos**
- `src/App.tsx`
- `src/config.ts`

**Melhoria**
- Migrar o storage para um objeto versionado.
- Estrutura sugerida:

```ts
type NodeStats = {
  attempts: number;
  bestScore: number;
  lastScore: number;
};

type Progress = {
  version: 1;
  completedNodes: string[];
  stats: Record<string, NodeStats>;
};
```

- Fazer `loadProgress()` tolerar o formato antigo.

**Critério de pronto**
- O usuário mantém o progresso antigo.
- Cada partida atualiza `attempts`, `lastScore` e `bestScore` do módulo jogado.

### 3. Melhorar feedback pedagógico após resposta
**Problema**
Depois do swipe, o app só mostra acerto/erro por 400 ms e avança.

**Impacto**
- O jogo treina reconhecimento, mas ensina pouco.
- O usuário não entende o motivo do acerto ou erro.

**Arquivos**
- `src/components/SwipeCard.tsx`
- `src/data/pairs.ts`
- `src/data/roadmap.ts`

**Melhoria**
- Adicionar `explanation?: string` em `Pair`.
- Mostrar explicação curta no overlay antes de avançar.
- Começar pelos módulos `fundamentos`, `design-patterns` e `solid`.

**Critério de pronto**
- Toda resposta errada exibe uma justificativa legível.
- Pelo menos os módulos iniciais possuem explicações completas.

### 4. Corrigir o algoritmo de embaralhamento
**Problema**
O projeto usa `.sort(() => Math.random() - 0.5)` para embaralhar.

**Impacto**
- Distribuição enviesada.
- Repetição pouco confiável de cartas em sessões diferentes.

**Arquivos**
- `src/data/pairs.ts`
- `src/data/roadmap.ts`

**Melhoria**
- Substituir por Fisher-Yates.
- Centralizar a função utilitária em um helper reutilizável.

**Critério de pronto**
- Nenhum shuffle usa `sort(() => Math.random() - 0.5)`.

## Prioridade média

### 5. Permitir sair da partida sem concluir
**Problema**
Durante o jogo, o usuário não consegue voltar ao roadmap sem finalizar a rodada.

**Impacto**
- Fluxo rígido.
- Frustração ao entrar em um módulo por engano.

**Arquivos**
- `src/App.tsx`
- `src/components/SwipeCard.tsx`

**Melhoria**
- Adicionar ação de "Sair" no header da partida.
- Confirmar saída se houver progresso parcial.

**Critério de pronto**
- O usuário consegue abandonar a fase e voltar ao mapa sem corromper estado.

### 6. Exibir estatísticas relevantes na tela de resultado
**Problema**
A `ScoreScreen` mostra apenas pontuação e lista de erros.

**Impacto**
- O retorno pós-partida é raso.
- Falta incentivo para repetição e melhora.

**Arquivos**
- `src/App.tsx`
- `src/components/SwipeCard.tsx`
- `src/components/ScoreScreen.tsx`

**Melhoria**
- Mostrar melhor pontuação do módulo.
- Mostrar tempo total da partida.
- Mostrar sequência máxima de acertos.

**Critério de pronto**
- A tela final diferencia claramente desempenho atual versus histórico.

### 7. Melhorar acessibilidade de controles e feedback
**Problema**
Há botões só com ícones e feedback visual dependente de cor.

**Impacto**
- Navegação pior para leitores de tela.
- Menor legibilidade para usuários com deficiência visual ou daltonismo.

**Arquivos**
- `src/components/StartScreen.tsx`
- `src/components/SwipeCard.tsx`
- `src/components/RoadmapScreen.tsx`
- `src/components/ScoreScreen.tsx`

**Melhoria**
- Adicionar `aria-label` em botões de ação.
- Adicionar `aria-live="polite"` ao feedback de acerto/erro.
- Exibir texto junto dos ícones de aprovação/rejeição.
- Melhorar foco visível em botões do roadmap e do jogo.

**Critério de pronto**
- Todo botão é compreensível sem depender do contexto visual.
- O resultado de cada ação é anunciado semanticamente.

### 8. Centralizar constantes de timing e gameplay
**Problema**
Tempos como `150` e `400` estão hardcoded em `SwipeCard.tsx`.

**Impacto**
- Ajustar ritmo do jogo exige caçar números mágicos.
- Fica difícil calibrar UX.

**Arquivos**
- `src/config.ts`
- `src/components/SwipeCard.tsx`
- `src/hooks/useSwipe.ts`

**Melhoria**
- Mover delays, threshold de swipe e critérios de progressão para `config`.
- Nomear claramente cada constante.

**Critério de pronto**
- O pacing do jogo é configurável sem editar vários arquivos.

## Prioridade baixa

### 9. Limpar código morto e exports sem uso
**Problema**
`allPairs` e `getShuffledPairs()` parecem não ser usados pelo fluxo atual.

**Impacto**
- Gera ruído.
- Cria falsa impressão de múltiplas fontes de dados ativas.

**Arquivos**
- `src/data/pairs.ts`

**Melhoria**
- Remover exports não utilizados ou reaproveitá-los de forma explícita.

**Critério de pronto**
- Não existem exports órfãos no módulo.

### 10. Melhorar a arquitetura de tipos das cartas
**Problema**
`isPair()` depende de cast e da ausência de `kind` em `Pair`.

**Impacto**
- Narrowing menos seguro.
- Modelo de dados fica mais frágil para futuras extensões.

**Arquivos**
- `src/data/pairs.ts`
- `src/data/roadmap.ts`

**Melhoria**
- Transformar `Card` em união discriminada explícita:

```ts
type PairCard = {
  kind: "pair";
  a: string;
  b: string;
  match: boolean;
  explanation?: string;
};

type InfoCard = {
  kind: "info";
  front: string;
  back: string;
};
```

**Critério de pronto**
- Nenhum type guard depende de cast manual para distinguir os tipos.

### 11. Atualizar README para refletir o produto real
**Problema**
O `README.md` ainda é o template padrão do Vite.

**Impacto**
- O repositório parece inacabado.
- Falta contexto para onboarding e deploy.

**Arquivos**
- `README.md`

**Melhoria**
- Descrever o jogo, stack, scripts, estrutura de dados e próximos passos.
- Incluir screenshots ou GIF curto.

**Critério de pronto**
- Um colaborador entende o projeto sem abrir o código.

## Sugestão de ordem de execução

1. Pré-requisitos do roadmap.
2. Persistência de progresso com compatibilidade retroativa.
3. Estatísticas na tela final.
4. Feedback com explicações por par.
5. Acessibilidade.
6. Shuffle correto e limpeza técnica.
7. README.
