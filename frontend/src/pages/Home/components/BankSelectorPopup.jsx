import { useState } from "react"
import { Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function BankSelectorPopup({ allBanks, onSelectBank, trigger }) {
  const [search, setSearch] = useState("")

  const filteredBanks = allBanks.filter(bank => 
    bank.name.toLowerCase().includes(search.toLowerCase()) || 
    bank.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn Ngân Hàng</DialogTitle>
        </DialogHeader>
        <div className="relative my-4 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm theo tên hoặc mã ngân hàng..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-3 p-1 min-h-[40vh]">
          {filteredBanks.map(bank => (
            <Button 
              key={bank.code} 
              variant="outline" 
              className="justify-start h-14 px-4"
              onClick={() => onSelectBank(bank)}
            >
              <div className="flex items-center gap-3">
                <div className="size-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {bank.code.substring(0,2)}
                </div>
                <div className="flex flex-col items-start truncate">
                  <span className="font-semibold truncate">{bank.code}</span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
