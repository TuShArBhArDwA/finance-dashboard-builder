"use client"

import { useDashboardStore, type Widget } from "@/store/dashboard-store"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { CardWidget } from "./card-widget"
import { TableWidget } from "./table-widget"
import { ChartWidget } from "./chart-widget"
import { Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { wsManager } from "@/lib/websocket-manager"
import { AddWidgetModal } from "./add-widget-modal"

function SortableWidgetItem({
  widget,
  onEdit,
}: {
  widget: Widget
  onEdit?: (widget: Widget) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id: widget.id })
  const style = { transform: CSS.Transform.toString(transform) }
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const wsConnectedRef = useRef(false)

  /**
   * Auto-refresh effect with proper cleanup
   * Handles both REST API polling and WebSocket connections
   * Ensures intervals are cleared when widget is removed or updated
   */
  useEffect(() => {
    const store = useDashboardStore.getState()

    const fetchAndUpdate = async () => {
      store.setWidgetLoading(widget.id, true)
      try {
        const response = await fetch(widget.apiUrl)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        store.setWidgetData(widget.id, data, new Date().toLocaleTimeString())
      } catch (error) {
        store.setWidgetError(widget.id, error instanceof Error ? error.message : "Failed to fetch data")
      }
    }

    // Handle WebSocket connection - only if URL is valid
    if (widget.useWebSocket && widget.wsUrl && !wsConnectedRef.current) {
      // Validate WebSocket URL before attempting connection
      const isValidWsUrl = widget.wsUrl.startsWith("ws://") || widget.wsUrl.startsWith("wss://")
      
      if (isValidWsUrl) {
        wsConnectedRef.current = true
        wsManager.connect({
          url: widget.wsUrl,
          widgetId: widget.id,
          onData: (data) => {
            store.setWidgetData(widget.id, data, new Date().toLocaleTimeString())
          },
          onError: (error) => {
            // Only show error if it's not a connection attempt to invalid URL
            // Silently fail for example/demo URLs or invalid URLs
            const isInvalidUrl = widget.wsUrl?.includes("example.com") || 
                                 widget.wsUrl?.includes("demo") ||
                                 !widget.wsUrl?.startsWith("ws://") && !widget.wsUrl?.startsWith("wss://")
            
            if (!isInvalidUrl) {
              // Only set error if WebSocket actually failed after connection attempt
              // Don't show errors for invalid URLs - just disable WebSocket
              const errorMessage = error.message || "WebSocket connection failed"
              store.setWidgetError(widget.id, `WebSocket error: ${errorMessage}`)
            } else {
              // Silently disable WebSocket for invalid URLs
              store.updateWidget(widget.id, { useWebSocket: false, error: null })
            }
          },
        })
      } else {
        // Invalid WebSocket URL - disable WebSocket and use REST API only
        store.updateWidget(widget.id, { useWebSocket: false })
      }
    }

    // Initial fetch for all widgets
    fetchAndUpdate()

    // Set up interval for REST APIs (not WebSocket)
    if (!widget.useWebSocket && widget.refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        fetchAndUpdate()
      }, widget.refreshInterval * 1000)
    }

    // Cleanup function - ensures no memory leaks
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
      if (wsConnectedRef.current && widget.useWebSocket) {
        wsManager.disconnect(widget.id)
        wsConnectedRef.current = false
      }
    }
  }, [widget.id, widget.apiUrl, widget.refreshInterval, widget.useWebSocket, widget.wsUrl])

  return (
    <div ref={setNodeRef} style={style}>
      {widget.displayMode === "card" && (
        <CardWidget widget={widget} isDragging={isDragging} onEdit={onEdit} dragHandleProps={{ ...attributes, ...listeners }} />
      )}
      {widget.displayMode === "table" && (
        <TableWidget widget={widget} isDragging={isDragging} onEdit={onEdit} dragHandleProps={{ ...attributes, ...listeners }} />
      )}
      {widget.displayMode === "chart" && (
        <ChartWidget widget={widget} isDragging={isDragging} onEdit={onEdit} dragHandleProps={{ ...attributes, ...listeners }} />
      )}
    </div>
  )
}

interface DashboardGridProps {
  onAddWidget: () => void
}

export function DashboardGrid({ onAddWidget }: DashboardGridProps) {
  const widgets = useDashboardStore((state) => state.widgets)
  const reorderWidgets = useDashboardStore((state) => state.reorderWidgets)
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null)

  /**
   * Handles widget edit action
   */
  const handleEdit = (widget: Widget) => {
    setEditingWidget(widget)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = widgets.findIndex((w) => w.id === active.id)
    const newIndex = widgets.findIndex((w) => w.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderWidgets(arrayMove(widgets, oldIndex, newIndex))
    }
  }

  return (
    <div className="p-6">
      {widgets.length === 0 ? (
        <div className="h-96 flex items-center justify-center">
          <button
            onClick={onAddWidget}
            className="flex flex-col items-center justify-center w-80 h-80 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 group-hover:bg-slate-700 mb-4">
              <Plus className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="font-semibold text-foreground">Add Widget</p>
            <p className="text-sm text-muted-foreground mt-1">Connect to a finance API and create a custom widget</p>
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SortableContext items={widgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
              {widgets.map((widget) => (
                <SortableWidgetItem key={widget.id} widget={widget} onEdit={handleEdit} />
              ))}
            </SortableContext>

            {/* Add Widget Placeholder */}
            <button
              onClick={onAddWidget}
              className="rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/50 p-6 flex flex-col items-center justify-center min-h-64 transition-colors group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 group-hover:bg-slate-700 mb-3">
                <Plus className="h-6 w-6 text-emerald-500" />
              </div>
              <p className="font-semibold text-white">Add Widget</p>
              <p className="text-sm text-slate-400 mt-1">Connect to a finance API and create a custom widget</p>
            </button>
          </div>
        </DndContext>
      )}

      {/* Edit Widget Modal */}
      {editingWidget && (
        <AddWidgetModal
          open={!!editingWidget}
          onOpenChange={(open) => {
            if (!open) setEditingWidget(null)
          }}
          editingWidget={editingWidget}
        />
      )}
    </div>
  )
}
