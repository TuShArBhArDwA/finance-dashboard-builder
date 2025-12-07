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
  onEdit?: (widget: Widget) => void
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
}

export function TableWidget({ widget, isDragging, onEdit, dragHandleProps }: TableWidgetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "",
    direction: "asc",
  })

  /**
   * Process table data from API response
   * Handles both array data and nested array fields
   */
  const tableData = useMemo(() => {
    if (!widget.data) {
      return []
    }

    // If data is directly an array, use it
    if (Array.isArray(widget.data)) {
      const filtered = widget.data.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      )

      if (sortConfig.key) {
        filtered.sort((a, b) => {
          const aVal = getNestedValue(a, sortConfig.key)
          const bVal = getNestedValue(b, sortConfig.key)
          const comparison = String(aVal).localeCompare(String(bVal))
          return sortConfig.direction === "asc" ? comparison : -comparison
        })
      }

      return filtered
    }

    // If data is an object, try to find array fields
    if (typeof widget.data === "object") {
      // Look for the first selected field that contains an array
      for (const field of widget.selectedFields) {
        const fieldData = getNestedValue(widget.data, field)
        if (Array.isArray(fieldData)) {
          const filtered = fieldData.filter((item) =>
            JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
          )

          if (sortConfig.key) {
            filtered.sort((a, b) => {
              const aVal = getNestedValue(a, sortConfig.key)
              const bVal = getNestedValue(b, sortConfig.key)
              const comparison = String(aVal).localeCompare(String(bVal))
              return sortConfig.direction === "asc" ? comparison : -comparison
            })
          }

          return filtered
        }
      }

      // If no array found, try to convert object to array of key-value pairs
      const entries = Object.entries(widget.data)
      if (entries.length > 0) {
        return entries
          .filter(([key, value]) => {
            const searchable = `${key} ${JSON.stringify(value)}`.toLowerCase()
            return searchable.includes(searchTerm.toLowerCase())
          })
          .map(([key, value]) => ({ key, value }))
      }
    }

    return []
  }, [widget.data, widget.selectedFields, searchTerm, sortConfig])

  // Determine which fields to display in table
  const displayFields = useMemo(() => {
    if (widget.selectedFields.length > 0) {
      return widget.selectedFields
    }

    // If no fields selected but we have array data, use object keys from first item
    if (Array.isArray(tableData) && tableData.length > 0 && typeof tableData[0] === "object") {
      return Object.keys(tableData[0])
    }

    // Fallback for key-value pairs
    if (Array.isArray(tableData) && tableData.length > 0 && "key" in tableData[0]) {
      return ["key", "value"]
    }

    return []
  }, [widget.selectedFields, tableData])

  if (!widget.data || tableData.length === 0) {
    return (
      <WidgetCard widget={widget} isDragging={isDragging} onEdit={onEdit} dragHandleProps={dragHandleProps}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">No table data available</p>
          <p className="text-xs text-muted-foreground/70">
            {widget.selectedFields.length === 0
              ? "Please select array fields in widget settings"
              : "Data structure may not be suitable for table view"}
          </p>
        </div>
      </WidgetCard>
    )
  }

  return (
    <WidgetCard widget={widget} isDragging={isDragging} onEdit={onEdit} dragHandleProps={dragHandleProps}>
      <div className="space-y-3">
        <Input
          placeholder="Search table..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 bg-background border-border text-foreground"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {displayFields.map((field) => {
                  const cleanField = field.replace(/\s*$$.*?$$\s*$/, "")
                  const isSorted = sortConfig.key === field
                  return (
                    <th
                      key={field}
                      className="cursor-pointer py-2 px-2 text-left text-xs font-medium text-muted-foreground hover:text-foreground"
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
              {tableData.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/50">
                  {displayFields.map((field) => {
                    const value = getNestedValue(row, field)
                    return (
                      <td key={field} className="py-2 px-2 text-foreground">
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value).slice(0, 50)
                          : String(value ?? "")}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tableData.length > 10 && (
          <p className="text-xs text-muted-foreground">
            Showing 10 of {tableData.length} items
          </p>
        )}
      </div>
    </WidgetCard>
  )
}
