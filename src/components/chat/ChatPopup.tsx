import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Activity, MessageSquare } from "lucide-react";
import {
  useChatWithAIMutation,
  useAnalyzeHealthMutation,
} from "@/store/api/chatApi";
import { useGetUserProfileQuery } from "@/store/api/userApi";
import type { ChatMessage, ChatMode } from "@/types/chat.type";
import { showToast } from "@/utils/toast";

export const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: profileData } = useGetUserProfileQuery();
  const [chatWithAI, { isLoading: isChatLoading }] = useChatWithAIMutation();
  const [analyzeHealth, { isLoading: isAnalyzeLoading }] =
    useAnalyzeHealthMutation();

  const isLoading = isChatLoading || isAnalyzeLoading;

  // Get conversationId from localStorage (set during login)
  const getConversationId = () => {
    return localStorage.getItem("conversation_id") || undefined;
  };

  const conversationId = getConversationId();

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset when closing
  const handleClose = () => {
    setIsOpen(false);
    setMode(null);
    setMessages([]);
    setInputMessage("");
  };

  // Select mode
  const handleSelectMode = async (selectedMode: ChatMode) => {
    setMode(selectedMode);

    if (selectedMode === "analyze") {
      // Tự động phân tích ngay khi chọn mode
      const healthData = getHealthData();

      if (!healthData) {
        showToast.warning(
          "Không tìm thấy dữ liệu sức khỏe. Vui lòng cập nhật hồ sơ sức khỏe của bạn."
        );
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "⚠️ Không tìm thấy dữ liệu sức khỏe của bạn.\n\nVui lòng cập nhật thông tin sức khỏe (cân nặng, chiều cao, huyết áp, đường huyết) trong hồ sơ để tôi có thể phân tích.",
          timestamp: new Date(),
        };
        setMessages([errorMessage]);
        return;
      }

      // Hiện message đang phân tích
      const loadingMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "🔄 Đang phân tích các chỉ số sức khỏe của bạn...",
        timestamp: new Date(),
      };
      setMessages([loadingMessage]);

      try {
        const response = await analyzeHealth({
          ...healthData,
          conversationId,
        }).unwrap();

        const resultMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.message,
          timestamp: new Date(response.timestamp),
        };

        setMessages([resultMessage]);
      } catch (error: any) {
        showToast.error(error?.data?.message || "Có lỗi xảy ra khi phân tích");
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "❌ Xin lỗi, có lỗi xảy ra khi phân tích sức khỏe. Vui lòng thử lại sau.",
          timestamp: new Date(),
        };
        setMessages([errorMessage]);
      }
    } else {
      // Q&A mode - hiện welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Xin chào! Tôi là trợ lý sức khỏe AI. Tôi có thể trả lời các câu hỏi về sức khỏe của bạn. Bạn muốn biết điều gì?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  // Get health data from profile
  const getHealthData = () => {
    if (!profileData?.data) return undefined;

    const profile = profileData.data;
    const healthDoc = profile.HEALTH_DOCUMENT;

    if (!healthDoc) return undefined;

    // Calculate age from DOB
    const calculateAge = (dob: string): number => {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    return {
      weight: healthDoc.WEIGHT ? parseFloat(healthDoc.WEIGHT) : undefined,
      height: healthDoc.HEIGHT ? parseFloat(healthDoc.HEIGHT) : undefined,
      age: profile.DOB ? calculateAge(profile.DOB) : undefined,
      gender: profile.GENDER?.toLowerCase(),
      bloodPressureSys: healthDoc.BLOOD_PRESSURE_SYSTOLIC
        ? parseFloat(healthDoc.BLOOD_PRESSURE_SYSTOLIC)
        : undefined,
      bloodPressureDia: healthDoc.BLOOD_PRESSURE_DIASTOLIC
        ? parseFloat(healthDoc.BLOOD_PRESSURE_DIASTOLIC)
        : undefined,
      bloodSugar: healthDoc.BLOOD_SUGAR
        ? parseFloat(healthDoc.BLOOD_SUGAR)
        : undefined,
    };
  };

  // Send message - Chỉ cho Q&A mode
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || mode !== "qna") return;

    const userMessageText = inputMessage;
    setInputMessage("");

    try {
      // Chế độ hỏi đáp - hiện cả user message và AI response
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: userMessageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      const response = await chatWithAI({
        message: userMessageText,
        conversationId,
      }).unwrap();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(response.timestamp),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      showToast.error(error?.data?.message || "Có lỗi xảy ra khi gửi tin nhắn");
      console.error("Chat error:", error);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Icon Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50 animate-bounce-slow"
          aria-label="Mở chat"
        >
          <MessageCircle size={28} className="animate-pulse-slow" />
        </button>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 1s ease-in-out infinite;
        }
      `}</style>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={22} />
              <div>
                <h3 className="font-semibold text-sm">Trợ lý sức khỏe AI</h3>
                {mode && (
                  <p className="text-xs text-emerald-100">
                    {mode === "analyze" ? "Phân tích chỉ số" : "Hỏi đáp"}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="hover:bg-emerald-800 rounded-full p-1 transition-colors"
              aria-label="Đóng chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Selection */}
          {!mode && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Chọn chế độ chat
              </h4>

              <button
                onClick={() => handleSelectMode("analyze")}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-6 rounded-lg shadow-md transition-all duration-200 hover:scale-105 flex flex-col items-center gap-3"
              >
                <Activity size={32} />
                <div className="text-center">
                  <h5 className="font-semibold text-lg">Phân tích chỉ số</h5>
                  <p className="text-sm text-emerald-100 mt-1">
                    Phân tích BMI, huyết áp, đường huyết của bạn
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSelectMode("qna")}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white p-6 rounded-lg shadow-md transition-all duration-200 hover:scale-105 flex flex-col items-center gap-3"
              >
                <MessageSquare size={32} />
                <div className="text-center">
                  <h5 className="font-semibold text-lg">Hỏi đáp</h5>
                  <p className="text-sm text-teal-50 mt-1">
                    Hỏi bất kỳ câu hỏi sức khỏe nào
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Messages */}
          {mode && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-emerald-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.role === "user"
                            ? "text-emerald-100"
                            : "text-gray-400"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - Chỉ hiện ở Q&A mode */}
              {mode === "qna" && (
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                      aria-label="Gửi tin nhắn"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
