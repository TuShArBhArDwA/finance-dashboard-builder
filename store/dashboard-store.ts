import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Widget {
  id: string
  name: string
  apiUrl: string
  refreshInterval: number
  displayMode: "card" | "table" | "chart"
  selectedFields: string[]
  data: any
  lastUpdated: string
  loading: boolean
  error: string | null
  useWebSocket?: boolean
  wsUrl?: string
}

interface DashboardStore {
  widgets: Widget[]
  currentTemplate: string | null
  addWidget: (widget: Omit<Widget, "id" | "data" | "lastUpdated" | "loading" | "error">) => void
  updateWidget: (id: string, updates: Partial<Widget>) => void
  removeWidget: (id: string) => void
  reorderWidgets: (widgets: Widget[]) => void
  setWidgetData: (id: string, data: any, lastUpdated: string) => void
  setWidgetLoading: (id: string, loading: boolean) => void
  setWidgetError: (id: string, error: string | null) => void
  setCurrentTemplate: (templateId: string | null) => void
  clearAllWidgets: () => void
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      widgets: [],
      currentTemplate: null,
      addWidget: (widget) =>
        set((state) => {
          // Generate unique ID using timestamp + random to prevent duplicates
          const uniqueId = `widget-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
          return {
            widgets: [
              ...state.widgets,
              {
                ...widget,
                id: uniqueId,
                data: null,
                lastUpdated: new Date().toLocaleTimeString(),
                loading: false,
                error: null,
              },
            ],
          }
        }),
      updateWidget: (id, updates) =>
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })),
      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),
      reorderWidgets: (widgets) => set({ widgets }),
      setWidgetData: (id, data, lastUpdated) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, data, lastUpdated, loading: false, error: null } : w,
          ),
        })),
      setWidgetLoading: (id, loading) =>
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, loading } : w)),
        })),
      setWidgetError: (id, error) =>
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, error, loading: false } : w)),
        })),
      setCurrentTemplate: (templateId) => set({ currentTemplate: templateId }),
      clearAllWidgets: () => set({ widgets: [] }),
    }),
    {
      name: "finboard-dashboard",
    },
  ),
)
