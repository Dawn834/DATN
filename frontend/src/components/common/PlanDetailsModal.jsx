import { X, Calendar, Wallet, Landmark, TrendingUp, Info } from "lucide-react"
import { formatCurrency } from "@/utils/formatters"

export function PlanDetailsModal({ isOpen, onClose, plan }) {
  if (!isOpen || !plan) return null

  // Ensure steps exist
  const steps = plan.planDetails?.steps || []

  // Helper to get action icon and styling
  const getActionStyle = (action) => {
    const act = (action || "").toLowerCase()
    if (act.includes("initial") || act.includes("hold")) {
      return {
        bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        label: "Số dư khả dụng",
        icon: Wallet,
      }
    }
    if (act.includes("open")) {
      return {
        bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
        label: "Mở sổ tiết kiệm mới",
        icon: Landmark,
      }
    }
    if (act.includes("mature") || act.includes("interest")) {
      return {
        bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        label: "Đáo hạn / Nhận lãi",
        icon: TrendingUp,
      }
    }
    if (act.includes("fee") || act.includes("wait") || act.includes("close") || act.includes("early")) {
      return {
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        label: "Tất toán sớm / Phí phát sinh",
        icon: Info,
      }
    }
    return {
      bg: "bg-slate-500/10 border-slate-500/30 text-slate-400",
      label: "Hành động khác",
      icon: Calendar,
    }
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center font-sans p-4" onClick={onClose}>
      {/* Dark overlay backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300" />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Chi tiết phương án tích lũy</h3>
            <p className="text-xs text-slate-400 mt-1">
              Phân tích và lộ trình phân bổ tài chính từng tháng
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/50 hover:bg-slate-850 border border-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Overview Box */}
        <div className="px-6 py-4 bg-slate-950/20 border-b border-slate-800/50 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
            <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Chiến lược</span>
            <span className="block text-sm font-bold text-white mt-1 truncate" title={plan.bankName}>
              {plan.bankName}
            </span>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
            <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Lãi suất hiệu dụng</span>
            <span className="block text-sm font-bold text-emerald-400 mt-1">
              {plan.rate}% <span className="text-[10px] font-normal text-slate-400">/năm</span>
            </span>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
            <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Lãi thu về</span>
            <span className="block text-sm font-bold text-blue-400 mt-1">
              {formatCurrency(plan.interestEarned)}
            </span>
          </div>
        </div>

        {/* Scrollable Content (Timeline) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-6">
            {steps.length > 0 ? (
              steps.map((step, idx) => {
                const style = getActionStyle(step.action)
                const Icon = style.icon

                return (
                  <div key={idx} className="relative group">
                    {/* Timeline Node Icon */}
                    <div className={`absolute -left-[37px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border ${style.bg} bg-slate-900 text-xs shadow-md`}>
                      <Icon size={12} />
                    </div>

                    {/* Step Card */}
                    <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/80 transition-all duration-200 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            Tháng {step.month ?? "N/A"}
                          </span>
                          <span className="text-xs font-semibold text-slate-300">
                            {style.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-white">
                          {formatCurrency(step.amount)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        {step.note || "Không có mô tả chi tiết."}
                      </p>

                      {/* Meta info columns */}
                      {(step.annual_rate_pct || step.term_months || step.fee) && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800/50 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-500">
                          {step.annual_rate_pct && (
                            <span>Lãi suất: <strong className="text-slate-400">{step.annual_rate_pct}%/năm</strong></span>
                          )}
                          {step.term_months && (
                            <span>Kỳ hạn: <strong className="text-slate-400">{step.term_months} tháng</strong></span>
                          )}
                          {step.fee && (
                            <span>Phí: <strong className="text-red-400/80">{formatCurrency(step.fee)}</strong></span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm font-normal">
                Không tìm thấy thông tin phân bổ chi tiết của phương án này.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/40">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  )
}
