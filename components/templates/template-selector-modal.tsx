"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TemplateGallery } from "./template-gallery"

interface TemplateSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplateSelectorModal({ open, onOpenChange }: TemplateSelectorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto border-slate-700 bg-slate-900">
        <DialogHeader>
          <DialogTitle>Dashboard Templates</DialogTitle>
          <DialogDescription>Choose a pre-built template to get started quickly</DialogDescription>
        </DialogHeader>
        <TemplateGallery />
      </DialogContent>
    </Dialog>
  )
}
