"use client"

import { useDashboardStore } from "@/store/dashboard-store"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"

export function ExampleWidgetsPanel() {
  const addWidget = useDashboardStore((state) => state.addWidget)
  const [isVisible, setIsVisible] = useState(true)

  // Use examples from finance-examples library
  const examples = [
    {
      name: "Bitcoin Price (Coinbase)",
      apiUrl: "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
      displayMode: "card" as const,
      selectedFields: ["data.rates.USD"],
      refreshInterval: 60,
    },
    {
      name: "Ethereum Price (Coinbase)",
      apiUrl: "https://api.coinbase.com/v2/exchange-rates?currency=ETH",
      displayMode: "card" as const,
      selectedFields: ["data.rates.USD"],
      refreshInterval: 60,
    },
    {
      name: "Multi Crypto Prices",
      apiUrl: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd",
      displayMode: "card" as const,
      selectedFields: ["bitcoin.usd", "ethereum.usd", "cardano.usd"],
      refreshInterval: 120,
    },
    {
      name: "USD Exchange Rates",
      apiUrl: "https://api.exchangerate-api.com/v4/latest/USD",
      displayMode: "table" as const,
      selectedFields: ["rates"],
      refreshInterval: 3600,
    },
  ]

  const handleAddExample = (example: (typeof examples)[0]) => {
    addWidget({
      name: example.name,
      apiUrl: example.apiUrl,
      displayMode: example.displayMode,
      selectedFields: example.selectedFields,
      refreshInterval: example.refreshInterval,
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 max-w-xs shadow-lg z-40">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-white">Quick Start Examples</p>
        <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        {examples.map((example, idx) => (
          <Button
            key={idx}
            onClick={() => handleAddExample(example)}
            variant="outline"
            size="sm"
            className="w-full text-xs border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            + {example.name}
          </Button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-3">Free public APIs • No authentication needed</p>
    </div>
  )
}
