"use client"

import type { Widget } from "@/store/dashboard-store"
import { WidgetCard } from "./widget-card"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { ChevronUp, ChevronDown } from "lucide-react"
import { getNestedValue } from "@/lib/api-utils"

interface TableWidgetProps {
  widget: Widget
  isDragging?: boolean
}

export function TableWidget({ widget, isDragging }: TableWidgetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "",
    direction: "asc",
  })

  const tableData = useMemo(() => {
    if (!widget.data || !Array.isArray(widget.data)) {
      return []
    }

    const filtered = widget.data.filter((item) => JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase()))

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = getNestedValue(a, sortConfig.key)
        const bVal = getNestedValue(b, sortConfig.key)
        const comparison = String(aVal).localeCompare(String(bVal))
        return sortConfig.direction === "asc" ? comparison : -comparison
      })
    }

    return filtered
  }, [widget.data, searchTerm, sortConfig])

  if (!widget.data || !Array.isArray(widget.data) || widget.selectedFields.length === 0) {
    return (
      <WidgetCard widget={widget} isDragging={isDragging}>
        <p className="text-sm text-slate-400">No table data available</p>
      </WidgetCard>
    )
  }

  return (
    <WidgetCard widget={widget} isDragging={isDragging}>
      <div className="space-y-3">
        <Input
          placeholder="Search table..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 bg-slate-800 border-slate-700 text-slate-100"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {widget.selectedFields.map((field) => {
                  const cleanField = field.replace(/\s*$$.*?$$\s*$/, "")
                  const isSorted = sortConfig.key === field
                  return (
                    <th
                      key={field}
                      className="cursor-pointer py-2 px-2 text-left text-xs font-medium text-slate-300 hover:text-slate-100"
                      onClick={() =>
                        setSortConfig({
                          key: field,
                          direction: isSorted && sortConfig.direction === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      <div className="flex items-center gap-1">
                        {cleanField}
                        {isSorted && (
                          <>
                            {sortConfig.direction === "asc" ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(0, 6).map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/50">
                  {widget.selectedFields.map((field) => (
                    <td key={field} className="py-2 px-2 text-slate-300">
                      {String(getNestedValue(row, field))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">
          Showing {Math.min(6, tableData.length)} of {tableData.length} items
        </p>
      </div>
    </WidgetCard>
  )
}
