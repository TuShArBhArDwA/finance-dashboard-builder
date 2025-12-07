"use client"

import type React from "react"

import { type Widget, useDashboardStore } from "@/store/dashboard-store"
import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw, Settings, Zap } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface WidgetCardProps {
  widget: Widget
  children?: React.ReactNode
  isDragging?: boolean
}

export function WidgetCard({ widget, children, isDragging }: WidgetCardProps) {
  const removeWidget = useDashboardStore((state) => state.removeWidget)

  const handleRefresh = async () => {
    const store = useDashboardStore.getState()
    store.setWidgetLoading(widget.id, true)
    try {
      const response = await fetch(widget.apiUrl)
      if (!response.ok) throw new Error("API request failed")
      const data = await response.json()
      store.setWidgetData(widget.id, data, new Date().toLocaleTimeString())
    } catch (error) {
      store.setWidgetError(widget.id, error instanceof Error ? error.message : "Refresh failed")
    }
  }

  return (
    <div
      className={`group relative rounded-lg border border-slate-700 bg-slate-900 p-4 transition-all ${
        isDragging ? "opacity-50 ring-2 ring-emerald-500" : "hover:border-slate-600"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="font-semibold text-white">{widget.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500">Refresh every {widget.refreshInterval}s</p>
              {widget.useWebSocket && (
                <div className="flex items-center gap-1 text-emerald-400">
                  <Zap className="h-3 w-3" />
                  <span className="text-xs font-medium">Live</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleRefresh} disabled={widget.loading}>
            <RefreshCw className={`h-4 w-4 ${widget.loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300">
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
            onClick={() => removeWidget(widget.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {widget.loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 bg-slate-700" />
          <Skeleton className="h-4 w-1/2 bg-slate-700" />
        </div>
      ) : widget.error ? (
        <div className="rounded bg-red-500/10 p-2 text-sm text-red-400 font-medium">{widget.error}</div>
      ) : (
        children
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-500">
        Last updated: {widget.lastUpdated}
      </div>
    </div>
  )
}
