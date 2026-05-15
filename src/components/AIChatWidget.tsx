import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Bot, User, ExternalLink, Phone, MessageSquare, Headphones, Sparkles, Leaf } from "lucide-react";
import axios from "axios";

interface Message {
  role: "user" | "model";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  { text: "Daklink có những sản phẩm gì?" },
  { text: "Giá cả và cách đặt hàng?" },
  { text: "Chính sách giao hàng và thanh toán?" },
];

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Chào bạn! Tôi là Chuyên viên tư vấn Nông nghiệp Số của Daklink. Bạn đang tìm mua nông sản hay có thắc mắc gì về gian hàng không ạ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 350);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMenuOpen(false);
    setIsClosing(false);
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setHasUserSentMessage(true);

    try {
      const rs = await axios.post("/api/chat", {
        message: userMessage.content,
        conversationHistory: messages.slice(-5),
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", content: rs.data.reply },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Xin lỗi, đường truyền đang gặp chút vấn đề. Bạn vui lòng thử lại nhé!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (questionText: string) => {
    handleSend(questionText);
  };

  return (
    <div className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 ${isOpen ? 'z-[9999]' : 'z-50'}`}>
      {/* Contact Menu (Vertical Stack) */}
      <div className="absolute bottom-0 right-0 flex flex-col items-end gap-4 pb-20 pointer-events-none">
        {/* 1. AI Chat Option - NOW AT TOP */}
        <div 
          className={`flex items-center gap-3 transition-all duration-500 transform ${isMenuOpen && !isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-10 opacity-0 pointer-events-none"}`}
          style={{ transitionDelay: '200ms' }}
        >
          <span className="bg-white/90 backdrop-blur-sm text-foreground font-mono-accent text-[11px] px-3 py-1.5 rounded-lg shadow-sm border border-border whitespace-nowrap">Tư vấn viên AI</span>
          <button
            onClick={handleOpen}
            className="w-12 h-12 md:w-14 md:h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all"
          >
            <Bot className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* 2. Zalo Option - IN MIDDLE */}
        <div 
          className={`flex items-center gap-3 transition-all duration-500 transform ${isMenuOpen && !isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-10 opacity-0 pointer-events-none"}`}
          style={{ transitionDelay: '100ms' }}
        >
          <span className="bg-white/90 backdrop-blur-sm text-foreground font-mono-accent text-[11px] px-3 py-1.5 rounded-lg shadow-sm border border-border whitespace-nowrap">Nhắn Zalo</span>
          <a
            href="https://zalo.me/0123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 md:w-14 md:h-14 bg-[#0068FF] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#005AE0] hover:scale-110 active:scale-95 transition-all"
          >
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </div>

        {/* 3. Phone Option - AT BOTTOM */}
        <div 
          className={`flex items-center gap-3 transition-all duration-500 transform ${isMenuOpen && !isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-10 opacity-0 pointer-events-none"}`}
          style={{ transitionDelay: '0ms' }}
        >
          <span className="bg-white/90 backdrop-blur-sm text-foreground font-mono-accent text-[11px] px-3 py-1.5 rounded-lg shadow-sm border border-border whitespace-nowrap">Gọi Hotline</span>
          <a
            href="tel:0123456789"
            className="w-12 h-12 md:w-14 md:h-14 bg-white text-primary rounded-full shadow-lg flex items-center justify-center hover:bg-muted hover:scale-110 active:scale-95 transition-all border border-border"
          >
            <Phone className="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </div>
      </div>

      {/* Initial Support Tooltip */}
      {showTooltip && !isMenuOpen && !isOpen && (
        <div className="absolute bottom-16 right-0 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-500 pointer-events-none mb-4">
          <div className="bg-white text-primary border border-primary/20 shadow-xl px-5 py-2.5 rounded-xl relative whitespace-nowrap">
            <p className="text-[14px] font-bold flex items-center gap-2">
              Daklink đang online để hỗ trợ bạn! 😊
            </p>
            {/* Tooltip triangle */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-primary/10 rotate-45"></div>
          </div>
        </div>
      )}

      {/* Main Toggle Button - Hidden on mobile when chat is open */}
      <button
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            setIsMenuOpen(!isMenuOpen);
            setShowTooltip(false);
            sessionStorage.setItem("hasShownSupportTooltip", "true");
          }
        }}
        className={`transition-all duration-500 w-16 h-16 md:w-[72px] md:h-[72px] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.15)] flex items-center justify-center hover:scale-105 active:scale-95 z-50 ${
          isOpen ? "md:bg-white md:text-foreground md:border md:border-border hidden md:flex" : 
          isMenuOpen ? "bg-white text-foreground border border-border" : "bg-[#106E55] text-white"
        }`}
      >
        {isOpen || isMenuOpen ? (
          <X className="w-8 h-8 md:w-9 md:h-9 animate-in spin-in-90 duration-300" />
        ) : (
          <>
            <Headphones className="w-8 h-8 md:w-9 md:h-9 animate-in zoom-in-50 duration-300" />
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-secondary border-[3px] border-white"></span>
            </span>
          </>
        )}
      </button>

      {/* ========== CHAT WINDOW ========== */}
      {/* Mobile: Fullscreen overlay | Desktop: Corner widget */}
      <div
        className={`
          ${isOpen && !isClosing
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full md:translate-y-8 opacity-0 pointer-events-none"
          }
          transition-all duration-400
          fixed inset-0 w-full h-full
          md:absolute md:inset-auto md:bottom-0 md:right-0
          md:w-[400px] md:h-[520px] md:max-h-[calc(100vh-6rem)] md:rounded-2xl
          bg-background
          md:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]
          flex flex-col overflow-hidden
          md:border md:border-border
          z-[9999]
        `}
      >
        {/* ===== Header ===== */}
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold leading-tight">Daklink Assistant</h3>
              <p className="font-mono-accent text-primary-foreground/70 text-[9px] flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
                Luôn sẵn sàng
              </p>
            </div>
          </div>
          {/* Close button - BIG and VISIBLE */}
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-90"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* ===== Message Area ===== */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F8F7] scrollbar-hide">
          <div className="text-center py-2">
            <span className="font-mono-accent text-[10px] text-muted-foreground/50 bg-muted px-3 py-1 rounded-full">
              Hôm nay
            </span>
          </div>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-secondary text-white" : "bg-primary text-white"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] md:max-w-[75%] p-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-secondary text-white rounded-br-sm"
                    : "bg-white text-foreground rounded-bl-sm border border-border/50"
                }`}
              >
                {msg.content.split("\n").map((line, i) => (
                  <div key={i} className={line.trim() ? "mb-2 last:mb-0" : "h-2"}>
                    {
                      line.split(/(\*\*.*?\*\*|\[BUTTON:.*?\|.*?\])/).map((part, j) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith("[BUTTON:") && part.endsWith("]")) {
                          const match = part.match(/\[BUTTON:(.*?)\|(.*?)\]/);
                          if (match) {
                            const [, label, url] = match;
                            return (
                              <a
                                key={j}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all my-1 group shadow-sm"
                              >
                                {label}
                                <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                              </a>
                            );
                          }
                        }
                        return part;
                      })
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ===== Suggested Questions ===== */}
          {!hasUserSentMessage && !isLoading && (
            <div className="flex flex-col gap-2 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-mono-accent text-[10px] text-muted-foreground/60">Gợi ý cho bạn</span>
              </div>
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(q.text)}
                  className="group flex items-center w-full px-4 py-3 bg-white border border-border/60 rounded-xl text-[13px] font-medium text-foreground/80
                    hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-sm
                    active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
                >
                  <Leaf className="w-4 h-4 mr-2.5 shrink-0" style={{ color: '#15803d', fill: '#15803d' }} />
                  {q.text}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex items-end gap-2 animate-in fade-in duration-200">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 border border-border/50">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ===== Input Area ===== */}
        <div className="p-3 md:p-3 bg-background border-t border-border shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi của bạn..."
              className="w-full bg-muted/30 border border-border focus:border-primary/50 text-foreground text-base rounded-xl pl-4 pr-12 py-3 outline-none resize-none h-[46px] overflow-hidden"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="font-mono-accent text-[9px] text-muted-foreground/70">
              ĐƯỢC BẢO VỆ BỞI AI DAKLINK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatWidget;
