import { useState } from "react"
import { X, Calendar, Wallet, Landmark, TrendingUp, Info } from "lucide-react"
import { formatCurrency } from "@/utils/formatters"

export function PlanDetailsModal({ isOpen, onClose, plan }) {
  const [hoveredNodeId, setHoveredNodeId] = useState(null)

  if (!isOpen || !plan) return null

  // Ensure steps exist, adjust month index, and filter out zero-amount hold cash/initial steps
  const steps = (plan.planDetails?.steps || [])
    .map(step => {
      if (step.action === "initial") {
        return step
      }
      const newMonth = Math.max(0, (step.month ?? 1) - 1)
      let newNote = step.note || ""
      if (newNote) {
        newNote = newNote.replace(/T(\d+)/g, (match, p1) => {
          const val = parseInt(p1) - 1
          return "T" + (val >= 0 ? val : 0)
        })
      }
      return {
        ...step,
        month: newMonth,
        note: newNote
      }
    })
    .filter(step => {
      const act = (step.action || "").toLowerCase()
      if (act.includes("hold") || act.includes("transfer") || act.includes("wait") || act.includes("initial")) {
        return (step.amount || 0) > 0
      }
      return true
    })

  const formatStepDate = (startDateStr, monthIndex) => {
    if (monthIndex === undefined || monthIndex === null) return "N/A"

    let baseDate = new Date()
    if (startDateStr) {
      const parts = startDateStr.split("/")
      if (parts.length === 3) {
        baseDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
      }
    }

    baseDate.setMonth(baseDate.getMonth() + monthIndex)
    const dd = String(baseDate.getDate()).padStart(2, '0')
    const mm = String(baseDate.getMonth() + 1).padStart(2, '0')
    const yyyy = baseDate.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const getBankColor = (bankId) => {
    if (!bankId) return "#64748B"
    const code = String(bankId).toUpperCase()
    const colors = {
      VCB: "#10B981",
      BID: "#3B82F6",
      CTG: "#2563EB",
      VTB: "#2563EB",
      AGR: "#059669",
      TCB: "#EF4444",
      MB: "#1D4ED8",
      VPB: "#10B981",
      ACB: "#3B82F6",
      VIB: "#F97316",
      SHB: "#F97316",
      HDB: "#EF4444",
      TPB: "#8B5CF6",
      MSB: "#F97316",
      OCB: "#059669",
      SCB: "#EF4444",
      SAC: "#2563EB",
      STB: "#2563EB",
      LPB: "#D97706",
      HLB: "#DC2626",
      HLBANK: "#DC2626",
      ABB: "#06B6D4",
    }
    return colors[code] || "#3B5BDB"
  }

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
      label: "Nhận lãi + gốc",
      icon: Calendar,
    }
  }

  const buildTree = (stepsList) => {
    const initialStep = stepsList.find(s => s.action === "initial")
    const openSteps = stepsList.filter(s => s.action === "open" || s.action === "open_book")
    const matureSteps = stepsList.filter(s => s.action === "mature" || s.action === "mature_book")
    const otherSteps = stepsList.filter(s => s.action !== "initial" && s.action !== "open" && s.action !== "open_book" && s.action !== "mature" && s.action !== "mature_book")

    const usedSteps = new Set()

    const buildNode = (openStep, level = 0, parentPathId = "") => {
      const term = openStep.term || openStep.term_months || 0
      const maturityMonth = openStep.month + term

      // Find mature step matching maturity month and bank (if possible)
      const matureStep = matureSteps.find(m =>
        !usedSteps.has(m) &&
        m.month === maturityMonth &&
        m.bank_id === openStep.bank_id
      ) || matureSteps.find(m =>
        !usedSteps.has(m) &&
        m.month === maturityMonth
      )

      if (matureStep) {
        usedSteps.add(matureStep)
      }

      const nodeId = parentPathId
        ? `${parentPathId}_child_${openStep.month}_${openStep.amount}`
        : `root_${openStep.month}_${openStep.amount}`

      // Children are open steps starting at the maturity month of this book
      const childOpens = openSteps.filter(o =>
        !usedSteps.has(o) &&
        o.month === maturityMonth
      )

      childOpens.forEach(o => usedSteps.add(o))

      const children = childOpens.map(co => buildNode(co, level + 1, nodeId))

      return {
        id: nodeId,
        level,
        openStep,
        matureStep,
        children
      }
    }

    const rootsOpen = openSteps.filter(s => s.month === 0)
    rootsOpen.forEach(r => usedSteps.add(r))

    const roots = rootsOpen.map(r => buildNode(r, 0))
    const unmapped = otherSteps.filter(s => s.action === "final" || s.action === "final_balance")

    return {
      initial: initialStep,
      roots,
      unmapped
    }
  }

  const tree = buildTree(steps)

  const getMaxLevel = (node) => {
    if (!node.children || node.children.length === 0) return node.level
    return Math.max(node.level, ...node.children.map(getMaxLevel))
  }

  const renderBookNode = (node) => {
    const { id, level, openStep, matureStep, children } = node
    const bankColor = openStep.bank_id ? getBankColor(openStep.bank_id) : "#3B5BDB"

    // Check path hover highlight state
    const isHighlighted = hoveredNodeId && (id.startsWith(hoveredNodeId) || hoveredNodeId.startsWith(id))

    return (
      <div
        key={id}
        className="relative flex flex-col space-y-4"
        onMouseEnter={() => setHoveredNodeId(id)}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        {/* Horizontal connector from parent timeline */}
        {level > 0 && (
          <div
            className={`absolute -left-6 top-[28px] w-6 border-t-2 border-dashed transition-colors duration-200 ${isHighlighted ? "border-indigo-500" : "border-slate-200"
              }`}
          />
        )}

        {/* Grouped Savings Book Card */}
        <div
          className={`border rounded-2xl bg-white transition-all duration-300 relative overflow-hidden w-[600px] shrink-0 ${isHighlighted
            ? "border-indigo-500 shadow-lg ring-2 ring-indigo-500/15"
            : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
            }`}
          style={{ borderLeft: `6px solid ${bankColor}` }}
        >
          {/* Header Bar */}
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Landmark size={14} style={{ color: bankColor }} />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {openStep.bank_id?.toUpperCase() || openStep.bank_name}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${level === 0
                ? "bg-blue-50 text-blue-600 border border-blue-100"
                : level === 1
                  ? "bg-violet-50 text-violet-600 border border-violet-100"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                }`}>
                Cấp {level}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold">
                Kỳ hạn: {openStep.term || openStep.term_months || 0} tháng
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold">
                Lãi suất: {openStep.rate_pct || openStep.annual_rate_pct || 0}%/năm
              </span>
            </div>
          </div>

          {/* Lifecycle grid details */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Phase 1: Mở Sổ */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span>Giai đoạn 1: Mở sổ</span>
                {/* <span className="text-slate-500 font-mono">Tháng {openStep.month}</span> */}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500 font-medium">Số tiền gửi:</span>
                <span className="text-sm font-bold text-slate-900">{formatCurrency(openStep.amount)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                <Calendar size={12} className="text-slate-400 shrink-0" />
                <span>Ngày mở: <strong className="text-slate-700 font-semibold">{formatStepDate(plan.startDate, openStep.month)}</strong></span>
              </div>
              {/* {openStep.note && (
                <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                  {openStep.note}
                </p>
              )} */}
            </div>

            {/* Phase 2: Đáo Hạn */}
            <div className="space-y-2 md:pl-4">
              {matureStep ? (
                <>
                  <div className="flex items-center justify-between text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                    <span>Giai đoạn 2: Đáo hạn</span>
                    {/* <span className="text-emerald-600 font-mono">Tháng {matureStep.month}</span> */}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">Nhận về (Gốc + Lãi):</span>
                    <span className="text-sm font-bold text-slate-950">
                      {formatCurrency(matureStep.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] bg-emerald-50/50 border border-emerald-100/50 px-2 py-1 rounded-md">
                    <span className="text-emerald-700 font-medium">Lãi dự kiến nhận:</span>
                    <span className="font-extrabold text-emerald-600">
                      +{formatCurrency(matureStep.amount - openStep.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <Calendar size={12} className="text-slate-400 shrink-0" />
                    <span>Ngày nhận: <strong className="text-slate-700 font-semibold">{formatStepDate(plan.startDate, matureStep.month)}</strong></span>
                  </div>
                  {/* {matureStep.note && (
                    <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                      {matureStep.note}
                    </p>
                  )} */}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[90px] text-center bg-slate-50/40 rounded-xl border border-dashed border-slate-200 p-3">
                  <Info size={16} className="text-slate-400 mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Đang tích lũy</span>
                  <p className="text-[10px] text-slate-400 max-w-[170px] leading-normal">
                    Sổ tiết kiệm tiếp tục tích lũy sau thời hạn lập kế hoạch
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Children (Reinvested books) */}
        {children && children.length > 0 && (
          <div className="flex flex-col relative pl-6 ml-6 border-l-2 border-dashed border-slate-200">
            {/* Reinvestment label */}
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-slate-200 w-fit -ml-3 relative z-10">
              <span>↪ Tái tục cấp {level + 1}</span>
            </div>
            <div className="space-y-6">
              {children.map(child => renderBookNode(child))}
            </div>
          </div>
        )}
      </div>
    )
  }

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
          {/* <div className="p-3 bg-white rounded-xl border border-slate-200/60">
            <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Lãi suất hiệu dụng</span>
            <span className="block text-sm font-bold text-emerald-600 mt-1">
              {plan.rate}% <span className="text-[10px] font-normal text-slate-500">/năm</span>
            </span>
          </div> */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/60">
            <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Lãi dự kiến thu về</span>
            <span className="block text-sm font-bold text-blue-600 mt-1">
              {formatCurrency(plan.interestEarned)}
            </span>
          </div>
        </div>

        {/* Scrollable Content (Timeline as isolated trees) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/30">

          {/* Initial state card */}
          {tree.initial && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-blue-500/5 rounded-full" />
              <div className="absolute left-0 bottom-0 -translate-x-4 translate-y-4 w-20 h-20 bg-indigo-500/5 rounded-full" />
              <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-widest mb-1">
                Số dư ban đầu hoạch định
              </span>
              <span className="text-2xl font-black text-slate-800 block">
                {formatCurrency(tree.initial.amount)}
              </span>
              {/* {tree.initial.note && (
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{tree.initial.note}</p>
              )} */}
            </div>
          )}

          {/* Isolated saving channels */}
          {tree.roots.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
                <div className="w-1.5 h-4 bg-indigo-500 rounded-full animate-pulse" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Phân bổ & Tái tục song song
                </h4>
              </div>

              <div className="space-y-8">
                {tree.roots.map((rootNode, idx) => (
                  <div
                    key={rootNode.id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{ backgroundColor: rootNode.openStep.bank_id ? getBankColor(rootNode.openStep.bank_id) : "#3B5BDB" }}
                        />
                        Sổ tích lũy #{idx + 1}: {rootNode.openStep.bank_id?.toUpperCase() || rootNode.openStep.bank_name} ({formatCurrency(rootNode.openStep.amount)})
                      </h5>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50">
                        Cấp 0 → Cấp {getMaxLevel(rootNode)}
                      </span>
                    </div>

                    <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                      <div className="w-max pr-4">
                        {renderBookNode(rootNode)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : steps.length > 0 ? (
            // Fallback flat list
            <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-6">
              {steps.map((step, idx) => {
                const style = getActionStyle(step.action)
                const Icon = style.icon
                const bankColor = step.bank_id ? getBankColor(step.bank_id) : "#64748B"

                return (
                  <div key={idx} className="relative group">
                    <div
                      className="absolute -left-[37px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border bg-white text-xs shadow-sm"
                      style={{
                        borderColor: bankColor,
                        color: bankColor
                      }}
                    >
                      <Icon size={12} />
                    </div>

                    <div
                      className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all duration-200 shadow-sm"
                      style={{
                        borderLeft: `5px solid ${bankColor}`,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            {formatStepDate(plan.startDate, step.month)}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {style.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(step.amount)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {step.note || "Không có mô tả chi tiết."}
                      </p>

                      {(step.annual_rate_pct || step.term_months || step.fee) && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-500">
                          {step.annual_rate_pct && (
                            <span>Lãi suất: <strong className="text-slate-700">{step.annual_rate_pct}%/năm</strong></span>
                          )}
                          {step.term_months && (
                            <span>Kỳ hạn: <strong className="text-slate-700">{step.term_months} tháng</strong></span>
                          )}
                          {step.fee && (
                            <span>Phí: <strong className="text-red-500/80">{formatCurrency(step.fee)}</strong></span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm font-normal">
              Không tìm thấy thông tin phân bổ chi tiết của phương án này.
            </div>
          )}

          {/* Final balance step */}
          {tree.unmapped && tree.unmapped.map((step, idx) => (
            <div key={idx} className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-24 h-24 bg-emerald-500/5 rounded-full" />
              <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-widest mb-1">
                Tổng tài sản tích lũy dự kiến
              </span>
              <span className="text-2xl font-black text-slate-800 block">
                {formatCurrency(step.amount)}
              </span>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{step.note}</p>
            </div>
          ))}

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
