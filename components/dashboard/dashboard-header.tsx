"use client"

import { useDashboardStore } from "@/store/dashboard-store"
import { Button } from "@/components/ui/button"
import { ExportImportButtons } from "./export-import"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { BarChart3, Plus, Palette } from "lucide-react"
import { useState } from "react"
import { TemplateSelectorModal } from "@/components/templates/template-selector-modal"

interface DashboardHeaderProps {
  onAddWidget: () => void
}

export function DashboardHeader({ onAddWidget }: DashboardHeaderProps) {
  const widgets = useDashboardStore((state) => state.widgets)
  const [templateModalOpen, setTemplateModalOpen] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Finance Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {widgets.length > 0
                  ? `${widgets.length} active widget${widgets.length !== 1 ? "s" : ""} • Real-time data`
                  : "Connect to APIs and build your custom dashboard"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTemplateModalOpen(true)}
              className="h-9 w-9"
              title="Load dashboard template"
            >
              <Palette className="h-4 w-4" />
              <span className="sr-only">Load template</span>
            </Button>
            <ThemeToggle />
            {/* </CHANGE> */}
            <ExportImportButtons />
            <Button onClick={onAddWidget} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Widget
            </Button>
          </div>
        </div>
      </header>

      <TemplateSelectorModal open={templateModalOpen} onOpenChange={setTemplateModalOpen} />
      {/* </CHANGE> */}
    </>
  )
}
