"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { AddWidgetModal } from "@/components/dashboard/add-widget-modal"
import { ExampleWidgetsPanel } from "@/components/dashboard/example-widgets"

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader onAddWidget={() => setModalOpen(true)} />
      <DashboardGrid onAddWidget={() => setModalOpen(true)} />
      <AddWidgetModal open={modalOpen} onOpenChange={setModalOpen} />
      <ExampleWidgetsPanel />
    </div>
  )
}
