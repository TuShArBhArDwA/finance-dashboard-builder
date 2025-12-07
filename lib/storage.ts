export interface StorageConfig {
  widgets: any[]
  version: number
  lastUpdated: string
}

const STORAGE_KEY = "finboard-config"
const STORAGE_VERSION = 1

export function saveConfig(widgets: any[]): void {
  if (typeof window === "undefined") return

  const config: StorageConfig = {
    widgets,
    version: STORAGE_VERSION,
    lastUpdated: new Date().toISOString(),
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error("Failed to save config:", error)
  }
}

export function loadConfig(): StorageConfig | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const config = JSON.parse(stored) as StorageConfig
    if (config.version !== STORAGE_VERSION) return null

    return config
  } catch (error) {
    console.error("Failed to load config:", error)
    return null
  }
}

export function exportConfigAsJson(widgets: any[]): string {
  return JSON.stringify(
    {
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      widgets,
    },
    null,
    2,
  )
}

export function importConfigFromJson(jsonString: string): any[] | null {
  try {
    const config = JSON.parse(jsonString)
    return Array.isArray(config.widgets) ? config.widgets : null
  } catch (error) {
    console.error("Failed to parse JSON:", error)
    return null
  }
}
