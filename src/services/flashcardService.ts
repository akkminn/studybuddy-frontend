import instance from "./instance";
import type {
    FlashcardGenerateRequest,
    FlashcardGenerateResponse,
} from "@/types/type.ts";

const FlashcardService = {
    generate: async (payload: FlashcardGenerateRequest): Promise<FlashcardGenerateResponse> => {
        const { data } = await instance.post<FlashcardGenerateResponse>("/flashcards/generate", payload);
        return data;
    },
};

export default FlashcardService;
