export type ChatMode = "analyze" | "qna";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  healthData?: {
    weight?: number;
    height?: number;
    age?: number;
    gender?: string;
    bloodPressureSys?: number;
    bloodPressureDia?: number;
    bloodSugar?: number;
  };
  conversationId?: string;
}

export interface ChatResponse {
  message: string;
  intent: string;
  data?: any;
  conversationId: string;
  timestamp: Date;
}

export interface AnalyzeHealthRequest {
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  bloodSugar?: number;
}

export interface AnalyzeHealthResponse {
  message: string;
  data: any;
  summary: string;
  timestamp: Date;
}
