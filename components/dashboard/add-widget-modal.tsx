"use client"

import { useState, useMemo, useEffect } from "react"
import { useDashboardStore, type Widget } from "@/store/dashboard-store"
import { testApiConnection, flattenObject } from "@/lib/api-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Search, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddWidgetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingWidget?: Widget
}

export function AddWidgetModal({ open, onOpenChange, editingWidget }: AddWidgetModalProps) {
  const addWidget = useDashboardStore((state) => state.addWidget)
  const updateWidget = useDashboardStore((state) => state.updateWidget)
  const { toast } = useToast()

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

  // Initialize form with editing widget data
  useEffect(() => {
    if (editingWidget && open) {
      setName(editingWidget.name)
      setApiUrl(editingWidget.apiUrl)
      setRefreshInterval(editingWidget.refreshInterval.toString())
      setDisplayMode(editingWidget.displayMode)
      setUseWebSocket(editingWidget.useWebSocket || false)
      setWsUrl(editingWidget.wsUrl || "")
      setSelectedFields(editingWidget.selectedFields)
      // Auto-test the API if editing
      if (editingWidget.apiUrl) {
        const testApi = async () => {
          setTestLoading(true)
          setTestError("")
          const result = await testApiConnection(editingWidget.apiUrl)
          if (result.success) {
            setTestData(result.data)
            if (Array.isArray(result.data)) {
              setDisplayMode("table")
            }
          } else {
            setTestError(result.error || "Connection failed")
          }
          setTestLoading(false)
        }
        testApi()
      }
    } else if (!editingWidget && open) {
      // Reset form for new widget
      setName("")
      setApiUrl("")
      setRefreshInterval("30")
      setDisplayMode("card")
      setUseWebSocket(false)
      setWsUrl("")
      setTestData(null)
      setSelectedFields([])
      setSearchTerm("")
      setTestError("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingWidget, open])

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

  /**
   * Handles adding or updating a widget
   * Validates inputs and shows toast notifications
   */
  const handleAddWidget = () => {
    // Validation
    if (!name || !apiUrl) {
      setTestError("Widget name and API URL are required")
      toast({
        title: "Validation error",
        description: "Widget name and API URL are required",
        variant: "destructive",
      })
      return
    }

    if (!testData) {
      setTestError("Please test the API connection first")
      toast({
        title: "Validation error",
        description: "Please test the API connection first",
        variant: "destructive",
      })
      return
    }

    if (selectedFields.length === 0) {
      setTestError("Please select at least one field to display")
      toast({
        title: "Validation error",
        description: "Please select at least one field to display",
        variant: "destructive",
      })
      return
    }

    if (editingWidget) {
      // Update existing widget
      updateWidget(editingWidget.id, {
        name,
        apiUrl,
        refreshInterval: Number.parseInt(refreshInterval),
        displayMode,
        selectedFields,
        useWebSocket,
        wsUrl: useWebSocket ? wsUrl : undefined,
      })
      toast({
        title: "Widget updated",
        description: `${name} has been updated successfully`,
        variant: "success",
      })
    } else {
      // Add new widget
      addWidget({
        name,
        apiUrl,
        refreshInterval: Number.parseInt(refreshInterval),
        displayMode,
        selectedFields,
        useWebSocket,
        wsUrl: useWebSocket ? wsUrl : undefined,
      })
      toast({
        title: "Widget added",
        description: `${name} has been added to your dashboard`,
        variant: "success",
      })
    }

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
    setTestError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editingWidget ? "Edit Widget" : "Add New Widget"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {editingWidget
              ? "Update widget configuration and API settings"
              : "Connect to a finance API and create a custom widget"}
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
                <div className="mb-4 max-h-48 overflow-y-auto rounded bg-slate-800 p-3 space-y-2 border border-slate-700">
                  {availableFields.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-500">No fields found</p>
                      <p className="text-xs text-slate-600 mt-1">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    availableFields.map((field) => {
                      const isSelected = selectedFields.includes(field.key)
                      const isArray = field.type === "array"
                      return (
                        <div
                          key={field.key}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-emerald-500/20 border border-emerald-500/50"
                              : "hover:bg-slate-700 border border-transparent"
                          }`}
                          onClick={() => {
                            setSelectedFields((prev) =>
                              prev.includes(field.key) ? prev.filter((f) => f !== field.key) : [...prev, field.key],
                            )
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white truncate">{field.key}</p>
                              {isArray && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                  Array
                                </span>
                              )}
                              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                                {field.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 truncate">
                              {typeof field.preview === "object"
                                ? JSON.stringify(field.preview).slice(0, 60)
                                : String(field.preview).slice(0, 60)}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="ml-2 rounded bg-slate-700 border-slate-600 cursor-pointer"
                          />
                        </div>
                      )
                    })
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
              {editingWidget ? "Update Widget" : "Add Widget"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
