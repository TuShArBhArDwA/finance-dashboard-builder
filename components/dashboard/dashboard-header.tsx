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
      <header className="border-b border-slate-800 bg-slate-950 dark:bg-slate-950 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Finance Dashboard</h1>
              <p className="text-sm text-slate-400">
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
              className="h-9 w-9 border-slate-700 hover:bg-slate-800 bg-transparent"
              title="Load dashboard template"
            >
              <Palette className="h-4 w-4 text-slate-400" />
              <span className="sr-only">Load template</span>
            </Button>
            <ThemeToggle />
            {/* </CHANGE> */}
            <ExportImportButtons />
            <Button onClick={onAddWidget} className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
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
