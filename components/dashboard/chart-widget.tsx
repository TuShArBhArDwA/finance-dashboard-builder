"use client"

import { useMemo } from "react"
import type { Widget } from "@/store/dashboard-store"
import { WidgetCard } from "./widget-card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getNestedValue } from "@/lib/api-utils"

interface ChartWidgetProps {
  widget: Widget
  isDragging?: boolean
}

export function ChartWidget({ widget, isDragging }: ChartWidgetProps) {
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

  if (chartData.length === 0) {
    return (
      <WidgetCard widget={widget} isDragging={isDragging}>
        <p className="text-sm text-slate-400">No chart data available</p>
      </WidgetCard>
    )
  }

  return (
    <WidgetCard widget={widget} isDragging={isDragging}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
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
