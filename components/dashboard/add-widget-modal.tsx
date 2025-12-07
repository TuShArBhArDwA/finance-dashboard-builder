"use client"

import { useState, useMemo } from "react"
import { useDashboardStore } from "@/store/dashboard-store"
import { testApiConnection, flattenObject } from "@/lib/api-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Search, X } from "lucide-react"

interface AddWidgetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddWidgetModal({ open, onOpenChange }: AddWidgetModalProps) {
  const addWidget = useDashboardStore((state) => state.addWidget)

  const [name, setName] = useState("")
  const [apiUrl, setApiUrl] = useState("")
  const [refreshInterval, setRefreshInterval] = useState("30")
  const [displayMode, setDisplayMode] = useState<"card" | "table" | "chart">("card")
  const [useWebSocket, setUseWebSocket] = useState(false)
  const [wsUrl, setWsUrl] = useState("")
  const [testData, setTestData] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testError, setTestError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [showArraysOnly, setShowArraysOnly] = useState(false)

  const availableFields = useMemo(() => {
    if (!testData) return []

    const flattened = flattenObject(testData)
    let fields = Object.entries(flattened).map(([key, value]) => ({
      key,
      type: Array.isArray(value) ? "array" : typeof value,
      preview: Array.isArray(value) ? value[0] : value,
    }))

    if (showArraysOnly) {
      fields = fields.filter((f) => f.type === "array")
    }

    if (searchTerm) {
      fields = fields.filter((f) => f.key.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    return fields
  }, [testData, searchTerm, showArraysOnly])

  const handleTestApi = async () => {
    if (!apiUrl) return
    setTestLoading(true)
    setTestError("")
    const result = await testApiConnection(apiUrl)
    if (result.success) {
      setTestData(result.data)
      // If data is array, set displayMode to table by default
      if (Array.isArray(result.data)) {
        setDisplayMode("table")
      }
    } else {
      setTestError(result.error || "Connection failed")
    }
    setTestLoading(false)
  }

  const handleAddWidget = () => {
    if (!name || !apiUrl || !testData || selectedFields.length === 0) {
      setTestError("Please fill all fields and select at least one field")
      return
    }

    addWidget({
      name,
      apiUrl,
      refreshInterval: Number.parseInt(refreshInterval),
      displayMode,
      selectedFields,
      useWebSocket,
      wsUrl: useWebSocket ? wsUrl : undefined,
    })

    // Reset form
    setName("")
    setApiUrl("")
    setRefreshInterval("30")
    setDisplayMode("card")
    setUseWebSocket(false)
    setWsUrl("")
    setTestData(null)
    setSelectedFields([])
    setSearchTerm("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription className="text-slate-400">
            Connect to a finance API and create a custom widget
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Widget Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Widget Name</label>
            <Input
              placeholder="e.g., Bitcoin Price Tracker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* API URL */}
          <div>
            <label className="block text-sm font-medium mb-2">API URL</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button
                onClick={handleTestApi}
                disabled={testLoading || !apiUrl}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {testLoading ? "Testing..." : "Test"}
              </Button>
            </div>
            {testError && (
              <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                {testError}
              </div>
            )}
            {testData && (
              <div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                API connection successful! {availableFields.length} top-level fields found.
              </div>
            )}
          </div>

          {testData && (
            <>
              {/* Refresh Interval */}
              <div>
                <label className="block text-sm font-medium mb-2">Refresh Interval (seconds)</label>
                <Input
                  type="number"
                  min="5"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              {/* WebSocket Configuration */}
              <div className="border-t border-slate-700 pt-4">
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <input
                    type="checkbox"
                    checked={useWebSocket}
                    onChange={(e) => setUseWebSocket(e.target.checked)}
                    className="rounded bg-slate-700 border-slate-600"
                  />
                  Enable WebSocket for live updates
                </label>
                {useWebSocket && (
                  <Input
                    placeholder="e.g., wss://api.example.com/live"
                    value={wsUrl}
                    onChange={(e) => setWsUrl(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                )}
              </div>

              {/* Display Mode */}
              <div>
                <label className="block text-sm font-medium mb-2">Display Mode</label>
                <div className="flex gap-2">
                  {(["card", "table", "chart"] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={displayMode === mode ? "default" : "outline"}
                      onClick={() => setDisplayMode(mode)}
                      className={
                        displayMode === mode
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "border-slate-600 text-slate-300"
                      }
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Field Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Fields to Display</label>

                {/* Search Fields */}
                <div className="mb-3 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Show Arrays Only */}
                <label className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={showArraysOnly}
                    onChange={(e) => setShowArraysOnly(e.target.checked)}
                    className="rounded bg-slate-700 border-slate-600"
                  />
                  Show arrays only (for table view)
                </label>

                {/* Available Fields */}
                <div className="mb-4 max-h-40 overflow-y-auto rounded bg-slate-800 p-3 space-y-2">
                  {availableFields.length === 0 ? (
                    <p className="text-sm text-slate-500">No fields found</p>
                  ) : (
                    availableFields.map((field) => (
                      <div
                        key={field.key}
                        className="flex items-center justify-between p-2 rounded hover:bg-slate-700 cursor-pointer"
                        onClick={() => {
                          setSelectedFields((prev) =>
                            prev.includes(field.key) ? prev.filter((f) => f !== field.key) : [...prev, field.key],
                          )
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium">{field.key}</p>
                          <p className="text-xs text-slate-500">
                            {field.type} | {JSON.stringify(field.preview).slice(0, 50)}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field.key)}
                          onChange={() => {}}
                          className="rounded bg-slate-700 border-slate-600"
                        />
                      </div>
                    ))
                  )}
                </div>

                {/* Selected Fields */}
                {selectedFields.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Selected Fields</p>
                    <div className="space-y-2">
                      {selectedFields.map((field) => (
                        <div
                          key={field}
                          className="flex items-center justify-between p-2 rounded bg-emerald-500/20 border border-emerald-500/50"
                        >
                          <span className="text-sm text-emerald-400">{field}</span>
                          <button
                            onClick={() => setSelectedFields((prev) => prev.filter((f) => f !== field))}
                            className="text-slate-500 hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button
              onClick={handleAddWidget}
              disabled={!testData || selectedFields.length === 0 || (useWebSocket && !wsUrl)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Add Widget
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
