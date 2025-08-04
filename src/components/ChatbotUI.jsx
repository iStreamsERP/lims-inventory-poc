import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Sparkles } from "lucide-react";
import { callSoapService } from "@/api/callSoapService";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const ChatbotUI = () => {
  const { userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [chartContext, setChartContext] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [chartData, setChartData] = useState(null);
  const [latestChartData, setLatestChartData] = useState(null); // Track latest AI data
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChartData = async (DashBoardID, ChartNo) => {
    try {
      const chartID = { DashBoardID, ChartNo };
      const res = await callSoapService(userData.clientURL, "BI_GetDashboard_Chart_Data", chartID);
      setChartData(res);
    } catch (error) {
      console.error("Chart data fetch failed:", error);
      setChartData({ error: "Unable to fetch chart data." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const contextStr = localStorage.getItem("chatbot_context");
      if (contextStr) {
        const context = JSON.parse(contextStr);
        setChartContext(context);

        setMessages([
          {
            id: Date.now(),
            text: `How can I help you about "${context.badgeTitle || context.chartTitle || context.UPCOMING_EVENT_HEADER}" data?`,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);

        if (context.source === "chart") {
          fetchChartData(context.DashBoardID, context.ChartNo);
        } else if (context.source === "badge" || context.source === "events") {
          setChartData(context.data);
          setIsLoading(false);
        }
      }
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    const loadingMsgId = Date.now() + 1;

    const loadingMessage = {
      id: loadingMsgId,
      text: "Generating...",
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, loadingMessage]);

    const formData = new FormData();
    const blob = new Blob([JSON.stringify(chartData)], { type: "application/json" });
    formData.append("File", blob, "chartData.json");
    formData.append("Question", inputMessage);

    try {
      const response = await axios.post("https://apps.istreams-erp.com:4493/api/SmartAsk/ask-from-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const aiResponse = response.data;

      setMessages((prev) => prev.map((msg) => (msg.id === loadingMsgId ? { ...msg, text: aiResponse } : msg)));

      setLatestChartData(aiResponse); // Save latest AI response for chart preview
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId ? { ...msg, text: "Error processing your question. " + (err.response?.data || err.message) } : msg,
        ),
      );
    }
  };

  const toggleChat = () => {
    if (isOpen) localStorage.removeItem("chatbot_context");
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => setIsMinimized(true);
  const restoreChat = () => setIsMinimized(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        id="open-chatbot-btn"
        className="hidden"
        onClick={() => {
          const contextStr = localStorage.getItem("chatbot_context");
          if (contextStr) {
            const context = JSON.parse(contextStr);
            setChartContext(context);
            setMessages([
              {
                id: Date.now(),
                text: `How can I help you about "${context.chartTitle}" data?`,
                sender: "bot",
                timestamp: new Date(),
              },
            ]);
            fetchChartData(context.DashBoardID, context.ChartNo);
          }
          setIsOpen(true);
        }}
      />

      {!isOpen && (
        <button
          onClick={toggleChat}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75 blur-md"></div>
          <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-50 blur-lg"></div>
          <Sparkles className="relative z-10 h-6 w-6" />
          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
            <span className="text-xs font-bold text-white">1</span>
          </div>
        </button>
      )}

      {isOpen && (
        <div
          className={`flex flex-col rounded-lg border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:bg-slate-900 ${isMinimized ? "h-12 w-72" : "h-96 w-80 sm:h-[500px] sm:w-96"}`}
        >
          <div className="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
              <h3 className="text-sm font-semibold">iStreams AI</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={isMinimized ? restoreChat : minimizeChat}
                className="rounded p-1 transition-colors hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={toggleChat}
                className="rounded p-1 transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 dark:bg-slate-900">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} `}
                  >
                    <div
                      className={`max-w-xs overflow-x-auto rounded-lg px-3 py-2 text-sm ${message.sender === "user" ? "rounded-br-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "rounded-bl-sm border border-gray-200 bg-white text-gray-800 shadow-sm"}`}
                    >
                      <p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>{" "}
                      </p>
                      <span className={`mt-1 block text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>

                      {/* Chart Preview Button */}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="rounded-b-lg border-t border-gray-200 bg-white p-4 dark:bg-slate-900">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotUI;
