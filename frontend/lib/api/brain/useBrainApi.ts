import { useAxios } from "@/lib/hooks";

import {
  createBrain,
  deleteBrain,
  getBrain,
  getBrains,
  getDocsFromQuestion,
  getIntegrationBrains,
  getPublicBrains,
  updateBrain,
  updateBrainSecrets,
} from "./brain";
import {
  CreateBrainInput,
  UpdateBrainInput,
} from "./types";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useBrainApi = () => {
  const { axiosInstance } = useAxios();

  return {
    createBrain: async (brain: CreateBrainInput) =>
      createBrain(brain, axiosInstance),
    deleteBrain: async (id: string) => deleteBrain(id, axiosInstance),
    getBrains: async () => getBrains(axiosInstance),
    getBrain: async (id: string) => getBrain(id, axiosInstance),
    updateBrain: async (brainId: string, brain: UpdateBrainInput) =>
      updateBrain(brainId, brain, axiosInstance),
    getPublicBrains: async () => getPublicBrains(axiosInstance),
    getDocsFromQuestion: async (brainId: string, question: string) =>
      getDocsFromQuestion(brainId, question, axiosInstance),
    updateBrainSecrets: async (
      brainId: string,
      secrets: Record<string, string>
    ) => updateBrainSecrets(brainId, secrets, axiosInstance),
    getIntegrationBrains: async () => getIntegrationBrains(axiosInstance),
  };
};
