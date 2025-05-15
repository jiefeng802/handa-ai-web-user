import { UUID } from "crypto";

const brainDataKey = "handa-knowledge";

export const getKnowledgeDataKey = (knowledgeId: UUID): string =>
  `${brainDataKey}-${knowledgeId}`;
