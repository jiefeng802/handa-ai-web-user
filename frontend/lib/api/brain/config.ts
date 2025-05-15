
export const getBrainDataKey = (brainId: string): string =>
  `${BRAIN_DATA_KEY}-${brainId}`;

export const getBrainKnowledgeDataKey = (brainId: string): string =>
  `${BRAIN_DATA_KEY}-${brainId}-knowledge`;

