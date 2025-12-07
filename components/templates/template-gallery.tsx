"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DASHBOARD_TEMPLATES } from "@/lib/dashboard-templates"
import { useDashboardStore } from "@/store/dashboard-store"
import * as Icons from "lucide-react"

export function TemplateGallery() {
  const { clearAllWidgets, addWidget, setCurrentTemplate } = useDashboardStore()

  const handleSelectTemplate = (templateId: string) => {
    const template = DASHBOARD_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return

    // Clear existing widgets and load template
    clearAllWidgets()
    setCurrentTemplate(templateId)

    // Add template widgets
    template.widgets.forEach((widget) => {
      addWidget(widget)
    })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {DASHBOARD_TEMPLATES.map((template) => {
        const IconComponent = Icons[template.icon as keyof typeof Icons] || Icons.BarChart3
        return (
          <Card
            key={template.id}
            className="flex flex-col justify-between border-slate-700 bg-slate-900 p-4 hover:border-emerald-500 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                <IconComponent className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-50">{template.name}</h3>
              <p className="text-sm text-slate-400">{template.description}</p>
              <p className="mt-2 text-xs text-slate-500">{template.widgets.length} widgets</p>
            </div>
            <Button
              onClick={() => handleSelectTemplate(template.id)}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Load Template
            </Button>
          </Card>
        )
      })}
    </div>
  )
}
