import { X } from "lucide-react"
import { formatCurrency } from "@/utils/formatters"
import { PlanDetailsTree } from "@/components/common/PlanDetailsTree"

export function PlanDetailsModal({ isOpen, onClose, plan }) {
  if (!isOpen || !plan) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center font-sans p-4" onClick={onClose}>
      {/* Dark overlay backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300" />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Chi tiết phương án tích lũy</h3>
            <p className="text-xs text-slate-500 mt-1">
              Phân tích và lộ trình phân bổ tài chính từng tháng
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Overview Box */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-150 grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-white rounded-xl border border-slate-200/60">
            <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Chiến lược</span>
            <span className="block text-sm font-bold text-slate-900 mt-1 truncate" title={plan.bankName}>
              {plan.bankName}
            </span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/60">
            <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Lãi dự kiến thu về</span>
            <span className="block text-sm font-bold text-blue-600 mt-1">
              {formatCurrency(plan.interestEarned || plan.estimatedInterest || 0)}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/30">
          <PlanDetailsTree plan={plan} />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  )
}
