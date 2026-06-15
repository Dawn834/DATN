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

  useEffect(() => {
    const loadHistory = async () => {
      const token = localStorage.getItem("datn_token")
      if (token) {
        try {
          const history = await chatbotService.getMessages()
          if (history && history.length > 0) {
            setMessages(history)
          }
        } catch (e) {
          console.warn("Lỗi khi tải lịch sử chat:", e)
        }
      }
    }
    loadHistory()
  }, [])

  const processResponse = async (text) => {
    setIsTyping(true)
    const history = [...messages, { role: "user", content: text }]

    try {
      let isFirstChunk = true
      let accumulatedContent = ""

      await chatbotService.sendMessageStream(history, text, (chunk) => {
        accumulatedContent += chunk

        if (isFirstChunk) {
          setIsTyping(false)
          isFirstChunk = false
          // Append the new AI message containing the first chunk
          setMessages((prev) => [...prev, { role: "ai", content: accumulatedContent }])
        } else {
          // Update the content of the existing AI message
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: "ai", content: accumulatedContent }
            return updated
          })
        }
      })
    } catch (err) {
      console.warn("[ChatbotPopup] Streaming failed, falling back to static sendMessage:", err)
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
