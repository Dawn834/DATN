import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { chatbotService } from "@/services/chatbotService"
import "./ChatbotPopup.scss"

const QUICK_REPLIES = [
  "Kỳ hạn nào tốt nhất?",
  "Lãi suất cao nhất hôm nay?",
  "Rủi ro gửi dài hạn?",
]

export function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Xin chào! Tôi hỗ trợ tư vấn lãi suất, so sánh phương án tiết kiệm và giải thích kết quả. Bạn cần hỗ trợ gì?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isTyping, isOpen])

  const processResponse = async (text) => {
    setIsTyping(true)
    const history = [...messages, { role: "user", content: text }]
    
    // Create an empty AI message placeholder to accumulate stream chunks
    let aiMessage = { role: "ai", content: "" }
    setMessages((prev) => [...prev, aiMessage])

    try {
      let isFirstChunk = true
      await chatbotService.sendMessageStream(history, text, (chunk) => {
        if (isFirstChunk) {
          setIsTyping(false)
          isFirstChunk = false
        }
        aiMessage.content += chunk
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...aiMessage }
          return updated
        })
      })
    } catch (err) {
      console.warn("[ChatbotPopup] Streaming failed, falling back to static sendMessage:", err)
      // Remove the empty placeholder message before falling back
      setMessages((prev) => prev.slice(0, -1))
      setIsTyping(true)

      try {
        const response = await chatbotService.sendMessage(history, text)
        setMessages((prev) => [...prev, response])
      } catch (fallbackErr) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Xin lỗi, đã có lỗi kết nối xảy ra. Vui lòng thử lại!" },
        ])
      } finally {
        setIsTyping(false)
      }
    }
  }

  const handleSend = () => {
    if (!input.trim() || isTyping) return
    const userText = input
    setMessages((prev) => [...prev, { role: "user", content: userText }])
    setInput("")
    processResponse(userText)
  }

  const handleQuickReply = (text) => {
    if (isTyping) return
    setMessages((prev) => [...prev, { role: "user", content: text }])
    processResponse(text)
  }

  return (
    <>
      {/* FAB Button */}
      <button
        className={`chatbot-fab ${isOpen ? "chatbot-fab--hidden" : ""}`}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-popup__header">
            <div className="chatbot-popup__header-left">
              <div className="chatbot-popup__header-icon">AI</div>
              <div>
                <div className="chatbot-popup__header-title">Trợ lý tư vấn tiết kiệm</div>
                <div className="chatbot-popup__header-sub">Phân tích & tư vấn phương án</div>
              </div>
            </div>
            <button className="chatbot-popup__close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-popup__quick">
            {QUICK_REPLIES.map((text, i) => (
              <button key={i} className="chatbot-popup__chip" onClick={() => handleQuickReply(text)}>
                {text}
              </button>
            ))}
          </div>

          <div className="chatbot-popup__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-popup__msg chatbot-popup__msg--${msg.role}`}>
                {msg.role === "ai" && <span className="chatbot-popup__msg-avatar">AI</span>}
                <div className="chatbot-popup__msg-bubble">{msg.content}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-popup__msg chatbot-popup__msg--ai">
                <span className="chatbot-popup__msg-avatar">AI</span>
                <div className="chatbot-popup__msg-bubble chatbot-popup__msg-bubble--typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-popup__input">
            <input
              type="text"
              placeholder={isTyping ? "AI đang trả lời..." : "Nhập câu hỏi..."}
              value={input}
              disabled={isTyping}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="chatbot-popup__send" onClick={handleSend} disabled={isTyping}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  )
}
