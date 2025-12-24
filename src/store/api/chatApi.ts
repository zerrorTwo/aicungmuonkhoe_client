import { baseApi } from "./baseApi";
import type {
  ChatRequest,
  ChatResponse,
  AnalyzeHealthRequest,
  AnalyzeHealthResponse,
} from "@/types/chat.type";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Chat với AI
    chatWithAI: builder.mutation<ChatResponse, ChatRequest>({
      query: (request) => ({
        url: "/client/chatbot/chat",
        method: "POST",
        body: request,
      }),
    }),

    // Phân tích tổng quan sức khỏe
    analyzeHealth: builder.mutation<
      AnalyzeHealthResponse,
      AnalyzeHealthRequest
    >({
      query: (request) => ({
        url: "/client/chatbot/analyze",
        method: "POST",
        body: request,
      }),
    }),
  }),
});

export const { useChatWithAIMutation, useAnalyzeHealthMutation } = chatApi;
