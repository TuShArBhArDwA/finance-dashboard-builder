"use client"

import { useMemo } from "react"
import type { Widget } from "@/store/dashboard-store"
import { WidgetCard } from "./widget-card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getNestedValue } from "@/lib/api-utils"

interface ChartWidgetProps {
  widget: Widget
  isDragging?: boolean
  onEdit?: (widget: Widget) => void
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
}

export function ChartWidget({ widget, isDragging, onEdit, dragHandleProps }: ChartWidgetProps) {
  const chartData = useMemo(() => {
    if (!widget.data || widget.selectedFields.length < 1) return []

    if (Array.isArray(widget.data)) {
      return widget.data.slice(0, 50).map((item, idx) => {
        const dataPoint: Record<string, any> = { name: idx }
        widget.selectedFields.forEach((field) => {
          const value = getNestedValue(item, field)
          dataPoint[field] = typeof value === "number" ? value : Number.parseFloat(value) || 0
        })
        return dataPoint
      })
    }

    return []
  }, [widget.data, widget.selectedFields])

  // Empty state: No chart data available
  if (chartData.length === 0) {
    return (
      <WidgetCard widget={widget} isDragging={isDragging} onEdit={onEdit} dragHandleProps={dragHandleProps}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">No chart data available</p>
          <p className="text-xs text-muted-foreground/70">
            {!widget.data
              ? "Waiting for API response..."
              : widget.selectedFields.length === 0
                ? "Please select numeric fields in widget settings"
                : "Data structure may not be suitable for chart view"}
          </p>
        </div>
      </WidgetCard>
    )
  }

  return (
    <WidgetCard widget={widget} isDragging={isDragging} onEdit={onEdit} dragHandleProps={dragHandleProps}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="stroke-muted-foreground" />
          <YAxis className="stroke-muted-foreground" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))"
            }} 
          />
          {widget.selectedFields.map((field, idx) => (
            <Line
              key={field}
              type="monotone"
              dataKey={field}
              stroke={["#10b981", "#f59e0b", "#ef4444"][idx % 3]}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </WidgetCard>
  )
}
