import type {
    ChatMessageCreateRequest,
    ChatMessageListResponse,
    ChatMessageResponse,
    ChatSessionCreateRequest,
    ChatSessionResponse,
} from "@/types/type.ts";
import instance from "./instance";

const ChatService = {
    createSession: async (payload?: ChatSessionCreateRequest): Promise<ChatSessionResponse> => {
        const { data } = await instance.post<ChatSessionResponse>("/chat/sessions", payload);
        return data;
    },

    listSessionMessages: async (
        sessionId: string,
        params?: { limit?: number; cursor?: string | null },
    ): Promise<ChatMessageListResponse> => {
        const queryParams =
            params &&
            (params.limit !== undefined ||
                (params.cursor !== undefined && params.cursor !== null))
                ? {
                      params: {
                          ...(params.limit !== undefined ? { limit: params.limit } : {}),
                          ...(params.cursor !== undefined && params.cursor !== null
                              ? { cursor: params.cursor }
                              : {}),
                      },
                  }
                : undefined;

        const { data } = await instance.get<ChatMessageListResponse>(
            `/chat/sessions/${sessionId}/messages`,
            queryParams,
        );
        return data;
    },

    sendSessionMessage: async (
        sessionId: string,
        payload: ChatMessageCreateRequest,
    ): Promise<ChatMessageResponse> => {
        const { data } = await instance.post<ChatMessageResponse>(
            `/chat/sessions/${sessionId}/messages`,
            payload,
        );
        return data;
    },
};

export default ChatService;
