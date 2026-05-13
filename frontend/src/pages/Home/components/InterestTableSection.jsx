import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BankSelectorPopup } from "./BankSelectorPopup"

const DEMO_BANKS = [
  { code: "VCB", name: "Vietcombank" },
  { code: "TCB", name: "Techcombank" },
  { code: "BIDV", name: "BIDV" },
  { code: "CTG", name: "VietinBank" },
  { code: "MB", name: "MB Bank" },
  { code: "ACB", name: "ACB" },
  { code: "VPB", name: "VPBank" },
  { code: "VIB", name: "VIB" },
  { code: "TPB", name: "TPBank" },
  { code: "HDB", name: "HDBank" },
  { code: "SHB", name: "SHB" },
  { code: "STB", name: "Sacombank" },
  { code: "LPB", name: "LPBank" },
  { code: "MSB", name: "MSB" },
  { code: "SSB", name: "SeABank" },
  { code: "OCB", name: "OCB" },
  { code: "KLB", name: "Kienlongbank" },
  { code: "NAB", name: "Nam A Bank" },
  { code: "BVB", name: "BaoViet Bank" },
  { code: "ABB", name: "ABBank" }
]

export function InterestTableSection({ title, defaultBank }) {
  const [activeBank, setActiveBank] = useState(defaultBank || DEMO_BANKS[0])
  const [visibleBanks, setVisibleBanks] = useState(DEMO_BANKS.slice(0, 4))

  const handleSelectBank = (bank) => {
    setActiveBank(bank)
    // Nếu ngân hàng chọn chưa có trong list hiển thị, đưa nó lên đầu
    if (!visibleBanks.find(b => b.code === bank.code)) {
      setVisibleBanks([bank, ...visibleBanks.slice(0, 3)])
    }
  }

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle className="text-xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Bank Selector Options */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {visibleBanks.map(bank => (
            <Button
              key={bank.code}
              variant={activeBank.code === bank.code ? "default" : "outline"}
              onClick={() => handleSelectBank(bank)}
              className="rounded-full px-6"
            >
              {bank.name}
            </Button>
          ))}
          
          <BankSelectorPopup 
            allBanks={DEMO_BANKS} 
            onSelectBank={handleSelectBank}
            trigger={
              <Button variant="secondary" className="rounded-full px-5 text-muted-foreground hover:text-foreground">
                + {Math.max(0, DEMO_BANKS.length - visibleBanks.length)} NH
              </Button>
            }
          />
        </div>

        {/* Demo Content Area */}
        <div className="bg-background rounded-xl border-2 border-dashed border-border p-10 flex flex-col items-center justify-center min-h-[250px] text-center">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <span className="text-2xl font-bold text-primary">{activeBank.code}</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground">Dữ liệu lãi suất của {activeBank.name}</h3>
          <p className="text-muted-foreground max-w-lg leading-relaxed">
            (Demo: Bảng lãi suất của {activeBank.code} sẽ được tải ở đây. Khi tích hợp API, bảng này sẽ có các cột kỳ hạn 1 tháng, 3 tháng, 6 tháng, 12 tháng... và % tương ứng.)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
