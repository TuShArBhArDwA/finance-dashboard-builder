"use client"

import type { Widget } from "@/store/dashboard-store"
import { WidgetCard } from "./widget-card"
import { getNestedValue } from "@/lib/api-utils"

interface CardWidgetProps {
  widget: Widget
  isDragging?: boolean
  onEdit?: (widget: Widget) => void
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
}

export function CardWidget({ widget, isDragging, onEdit, dragHandleProps }: CardWidgetProps) {
  // Empty state: No data or no fields selected
  if (!widget.data) {
    return (
      <WidgetCard widget={widget} isDragging={isDragging} onEdit={onEdit}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">No data available</p>
          <p className="text-xs text-muted-foreground/70">Waiting for API response...</p>
        </div>
      </WidgetCard>
    )
  }

  if (widget.selectedFields.length === 0) {
    return (
      <WidgetCard widget={widget} isDragging={isDragging} onEdit={onEdit}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">No fields selected</p>
          <p className="text-xs text-muted-foreground/70">Edit widget to select fields</p>
        </div>
      </WidgetCard>
    )
  }

  return (
    <WidgetCard widget={widget} isDragging={isDragging} onEdit={onEdit} dragHandleProps={dragHandleProps}>
      <div className="space-y-2">
        {widget.selectedFields.map((field, idx) => {
          const value = getNestedValue(widget.data, field)
          const cleanField = field.replace(/\s*$$.*?$$\s*$/, "")
          return (
            <div key={idx}>
              <p className="text-xs text-muted-foreground">{cleanField}</p>
              <p className="font-semibold text-primary">
                {typeof value === "object" ? JSON.stringify(value) : String(value)}
              </p>
            </div>
          )
        })}
      </div>
    </WidgetCard>
  )
}
