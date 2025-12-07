"use client"

import type { Widget } from "@/store/dashboard-store"
import { WidgetCard } from "./widget-card"
import { getNestedValue } from "@/lib/api-utils"

interface CardWidgetProps {
  widget: Widget
  isDragging?: boolean
}

export function CardWidget({ widget, isDragging }: CardWidgetProps) {
  if (!widget.data || widget.selectedFields.length === 0) {
    return (
      <WidgetCard widget={widget} isDragging={isDragging}>
        <p className="text-sm text-slate-400">No fields selected</p>
      </WidgetCard>
    )
  }

  return (
    <WidgetCard widget={widget} isDragging={isDragging}>
      <div className="space-y-2">
        {widget.selectedFields.map((field, idx) => {
          const value = getNestedValue(widget.data, field)
          const cleanField = field.replace(/\s*$$.*?$$\s*$/, "")
          return (
            <div key={idx}>
              <p className="text-xs text-slate-400">{cleanField}</p>
              <p className="font-semibold text-emerald-400">
                {typeof value === "object" ? JSON.stringify(value) : String(value)}
              </p>
            </div>
          )
        })}
      </div>
    </WidgetCard>
  )
}
