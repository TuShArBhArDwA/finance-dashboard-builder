"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DASHBOARD_TEMPLATES } from "@/lib/dashboard-templates"
import { useDashboardStore } from "@/store/dashboard-store"
import { useToast } from "@/hooks/use-toast"
import * as Icons from "lucide-react"

export function TemplateGallery() {
  const { clearAllWidgets, addWidget, setCurrentTemplate } = useDashboardStore()
  const { toast } = useToast()

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

    toast({
      title: "Template loaded",
      description: `${template.name} template loaded with ${template.widgets.length} widgets`,
      variant: "success",
    })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {DASHBOARD_TEMPLATES.map((template) => {
        const IconComponent = Icons[template.icon as keyof typeof Icons] || Icons.BarChart3
        return (
          <Card
            key={template.id}
            className="flex flex-col justify-between border-border bg-card p-4 hover:border-primary hover:bg-muted/50 transition-all cursor-pointer"
          >
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <p className="mt-2 text-xs text-muted-foreground/70">{template.widgets.length} widgets</p>
            </div>
            <Button
              onClick={() => handleSelectTemplate(template.id)}
              className="mt-4 w-full"
            >
              Load Template
            </Button>
          </Card>
        )
      })}
    </div>
  )
}
