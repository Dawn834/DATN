import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
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

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "ai", content: "Cảm ơn bạn! Tôi đang xử lý câu hỏi của bạn. Tính năng AI sẽ được tích hợp sau." },
    ])
    setInput("")
  }

  const handleQuickReply = (text) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "ai", content: "Cảm ơn bạn! Tôi đang xử lý câu hỏi của bạn. Tính năng AI sẽ được tích hợp sau." },
    ])
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
          </div>

          <div className="chatbot-popup__input">
            <input
              type="text"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="chatbot-popup__send" onClick={handleSend}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  )
}
