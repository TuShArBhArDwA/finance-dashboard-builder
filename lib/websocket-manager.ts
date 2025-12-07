// WebSocket manager for real-time data updates
export interface WebSocketConfig {
  url: string
  widgetId: string
  onData: (data: any) => void
  onError?: (error: Error) => void
}

class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map()

  connect(config: WebSocketConfig) {
    if (this.connections.has(config.widgetId)) {
      this.disconnect(config.widgetId)
    }

    try {
      const ws = new WebSocket(config.url)

      ws.onopen = () => {
        console.log(`[v0] WebSocket connected for ${config.widgetId}`)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          config.onData(data)
        } catch (e) {
          config.onData(event.data)
        }
      }

      ws.onerror = (error) => {
        console.error(`[v0] WebSocket error for ${config.widgetId}:`, error)
        config.onError?.(new Error("WebSocket connection error"))
      }

      ws.onclose = () => {
        console.log(`[v0] WebSocket disconnected for ${config.widgetId}`)
        this.connections.delete(config.widgetId)
      }

      this.connections.set(config.widgetId, ws)
    } catch (error) {
      config.onError?.(error as Error)
    }
  }

  disconnect(widgetId: string) {
    const ws = this.connections.get(widgetId)
    if (ws) {
      ws.close()
      this.connections.delete(widgetId)
    }
  }

  disconnectAll() {
    this.connections.forEach((ws) => ws.close())
    this.connections.clear()
  }
}

export const wsManager = new WebSocketManager()
