"use client"

import type React from "react"

import { useDashboardStore } from "@/store/dashboard-store"
import { exportConfigAsJson, importConfigFromJson } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { useRef } from "react"

export function ExportImportButtons() {
  const widgets = useDashboardStore((state) => state.widgets)
  const importWidgets = useDashboardStore((state) => state.reorderWidgets)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const json = exportConfigAsJson(widgets)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `finboard-config-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string
        const imported = importConfigFromJson(json)
        if (imported) {
          importWidgets(imported)
          alert("Dashboard imported successfully!")
        } else {
          alert("Invalid configuration file format")
        }
      } catch (error) {
        alert("Failed to import configuration")
        console.error(error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={widgets.length === 0}
        className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="border-slate-600 text-slate-300 hover:bg-slate-800"
      >
        <Upload className="h-4 w-4 mr-2" />
        Import
      </Button>
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
    </div>
  )
}
