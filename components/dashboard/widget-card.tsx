"use client"

import type React from "react"
import { useState } from "react"

import { type Widget, useDashboardStore } from "@/store/dashboard-store"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, RefreshCw, Settings, Zap, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { AddWidgetModal } from "./add-widget-modal"

interface WidgetCardProps {
  widget: Widget
  children?: React.ReactNode
  isDragging?: boolean
  onEdit?: (widget: Widget) => void
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
}

export function WidgetCard({ widget, children, isDragging, onEdit, dragHandleProps }: WidgetCardProps) {
  const removeWidget = useDashboardStore((state) => state.removeWidget)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const { toast } = useToast()

  /**
   * Handles manual widget refresh
   * Shows toast notification on success/error
   */
  const handleRefresh = async () => {
    const store = useDashboardStore.getState()
    store.setWidgetLoading(widget.id, true)
    try {
      const response = await fetch(widget.apiUrl)
      if (!response.ok) throw new Error("API request failed")
      const data = await response.json()
      store.setWidgetData(widget.id, data, new Date().toLocaleTimeString())
      toast({
        title: "Widget refreshed",
        description: `${widget.name} data updated successfully`,
        variant: "success",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Refresh failed"
      store.setWidgetError(widget.id, errorMessage)
      toast({
        title: "Refresh failed",
        description: `Failed to refresh ${widget.name}: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  /**
   * Handles widget deletion with confirmation
   */
  const handleDelete = () => {
    removeWidget(widget.id)
    toast({
      title: "Widget deleted",
      description: `${widget.name} has been removed`,
      variant: "success",
    })
    setDeleteDialogOpen(false)
  }

  /**
   * Opens edit modal for widget configuration
   */
  const handleEdit = () => {
    if (onEdit) {
      onEdit(widget)
    } else {
      setEditModalOpen(true)
    }
  }

  return (
    <div
      className={`group relative rounded-lg border border-border bg-card p-4 transition-all ${
        isDragging ? "opacity-50 ring-2 ring-emerald-500" : "hover:border-muted-foreground/50"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div 
          className="flex items-center gap-2 flex-1" 
          {...dragHandleProps} 
          style={{ cursor: dragHandleProps ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <div>
            <h3 className="font-semibold text-foreground">{widget.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Refresh every {widget.refreshInterval}s</p>
              {widget.useWebSocket && (
                <div className="flex items-center gap-1 text-emerald-400">
                  <Zap className="h-3 w-3" />
                  <span className="text-xs font-medium">Live</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={(e) => {
              e.stopPropagation()
              handleRefresh()
            }} 
            disabled={widget.loading}
          >
            <RefreshCw className={`h-4 w-4 ${widget.loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit()
            }}
            title="Edit widget"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              setDeleteDialogOpen(true)
            }}
            title="Delete widget"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {widget.loading ? (
        <div className="space-y-3 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading data...</span>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 bg-muted" />
            <Skeleton className="h-4 w-1/2 bg-muted" />
          </div>
        </div>
      ) : widget.error ? (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400 mb-1">Error loading data</p>
              <p className="text-xs text-red-300/80">{widget.error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : (
        children
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
        Last updated: {widget.lastUpdated}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Widget?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{widget.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Modal */}
      {editModalOpen && (
        <AddWidgetModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          editingWidget={widget}
        />
      )}
    </div>
  )
}
