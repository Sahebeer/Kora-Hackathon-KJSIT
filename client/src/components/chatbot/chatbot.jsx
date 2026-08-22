import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageCircle, User, Bot, ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome to Kora Assistant! How can I help you?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState("aluminum");
  const lastUserMessageRef = useRef(null);
  const lastUserMessageIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].sender === "user") return i;
    }
    return null;
  }, [messages]);
  const location = useLocation();
  
  // Detect if we're on a dark page (Landing, Login, Signup, Docs) or light page (Dashboard, etc.)
  const isDarkPage = ['/', '/login', '/signup', '/docs'].includes(location.pathname);
  
  // Theme colors
  const theme = isDarkPage ? {
    bg: 'bg-[#28242A]',
    chatArea: 'bg-[#28242A]',
    botBubble: 'bg-[#342744] text-[#FCFAF6] border border-[#A996C7]/20',
    inputBg: 'bg-[#342744]',
    inputText: 'text-[#FCFAF6]',
    inputPlaceholder: 'placeholder-[#A996C7]/60',
    inputBorder: 'border-[#A996C7]/30',
    footerBg: 'bg-[#28242A]',
    typingDots: 'bg-[#A996C7]',
    typingBubble: 'bg-[#342744] text-[#A996C7] border border-[#A996C7]/20'
  } : {
    bg: 'bg-[#FCFAF6]',
    chatArea: 'bg-[#FCFAF6]',
    botBubble: 'bg-[#F5F0E8] text-[#342744] border border-[#DED6CC]',
    inputBg: 'bg-[#F5F0E8]',
    inputText: 'text-[#342744]',
    inputPlaceholder: 'placeholder-[#342744]/50',
    inputBorder: 'border-[#DED6CC]',
    footerBg: 'bg-[#FCFAF6]',
    typingDots: 'bg-[#68538C]',
    typingBubble: 'bg-[#F5F0E8] text-[#68538C] border border-[#DED6CC]'
  };

  useEffect(() => {
    if (lastUserMessageIndex === null) return;
    lastUserMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [lastUserMessageIndex]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const contextMessage = `[Metal: ${selectedMetal.toUpperCase()}] ${input}`;
      const res = await axios.post(`${apiUrl}/chat`, { message: contextMessage });
      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = { sender: "bot", text: "⚠️ Unable to reach server." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className={`flex flex-col w-full h-full ${theme.bg} ${isDarkPage ? 'text-[#FCFAF6]' : 'text-[#342744]'}`}>

        {/* Chat Area */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${theme.chatArea}`}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
              ref={i === lastUserMessageIndex ? lastUserMessageRef : null}
            >
              {/* Bot Avatar */}
              {msg.sender === "bot" && (
                <div className="shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #68538C 0%, #342744 100%)'
                    }}
                  >
                    <Bot className="w-4 h-4 text-[#FCFAF6]" />
                  </div>
                </div>
              )}

              {/* Chat Bubble */}
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] leading-relaxed text-sm sm:text-base ${
                  msg.sender === "user"
                    ? "text-[#FCFAF6] rounded-br-none shadow-md"
                    : `${theme.botBubble} rounded-bl-none shadow-sm`
                } animate-chat-fade`}
                style={msg.sender === "user" ? {
                  background: 'linear-gradient(135deg, #68538C 0%, #A996C7 100%)'
                } : {}}
              >
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code className={`${isDarkPage ? 'bg-[#342744] text-[#A996C7]' : 'bg-[#DED6CC]/40 text-[#342744]'} px-1 rounded`} {...props} />
                        ) : (
                          <code className={`${isDarkPage ? 'bg-[#342744] text-[#A996C7]' : 'bg-[#DED6CC]/40 text-[#342744]'} block p-2 rounded mb-2 overflow-x-auto`} {...props} />
                        ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>

              {/* User Avatar */}
              {msg.sender === "user" && (
                <div className="shrink-0 ml-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #68538C 0%, #342744 100%)'
                    }}
                  >
                    <User className="w-4 h-4 text-[#FCFAF6]" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start justify-start">
              <div className="shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #68538C 0%, #342744 100%)'
                  }}
                >
                  <Bot className="w-4 h-4 text-[#FCFAF6]" />
                </div>
              </div>
              <div className={`px-4 py-2 rounded-2xl ${theme.typingBubble} rounded-bl-none shadow-sm`}>
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 ${theme.typingDots} rounded-full animate-bounce`}></div>
                  <div className={`w-2 h-2 ${theme.typingDots} rounded-full animate-bounce delay-150`}></div>
                  <div className={`w-2 h-2 ${theme.typingDots} rounded-full animate-bounce delay-300`}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className={`p-3 ${theme.footerBg} border-t ${isDarkPage ? 'border-[#A996C7]/20' : 'border-[#DED6CC]'} shadow-lg`}>
          <div className="flex items-center gap-2.5 px-3">
            {/* Metal Selector */}
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className={`${theme.inputBg} ${theme.inputText} px-2 py-1.5 rounded-lg outline-none border ${theme.inputBorder} focus:border-[#68538C] focus:ring-1 focus:ring-[#A996C7]/30 transition-all text-xs shrink-0 w-[90px]`}
            >
              <option value="aluminum">Aluminum</option>
              <option value="copper">Copper</option>
            </select>
            
            {/* Search Input */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me about LCA..."
              className={`flex-[2_2_0%] ${theme.inputBg} ${theme.inputText} px-3 py-1.5 rounded-lg outline-none ${theme.inputPlaceholder} border ${theme.inputBorder} focus:border-[#68538C] focus:ring-1 focus:ring-[#A996C7]/30 transition-all text-sm min-w-0`}
            />
            
            {/* Send Button with Arrow */}
            <button
              onClick={sendMessage}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#FCFAF6] transition-all shadow-md hover:shadow-lg hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              style={{
                background: 'linear-gradient(135deg, #68538C 0%, #342744 100%)'
              }}
              disabled={!input.trim()}
              title="Send message"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  );
}

export default App;
