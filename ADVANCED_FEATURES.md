# FinBoard Advanced Features

This guide covers the three premium features added to FinBoard: Theme Switching, Real-time WebSockets, and Dashboard Templates.

## 1. Dynamic Theme Switching

### Overview
Toggle seamlessly between Light and Dark modes. Theme preference is persisted to localStorage and applied across all components.

### How to Use

1. **Toggle Theme**: Click the sun/moon icon in the top-right of the header
2. **Automatic Persistence**: Your theme preference is saved automatically
3. **All Components Adapt**: Colors adjust dynamically for optimal readability

### Theme Implementation

- **Theme Store**: Zustand store manages theme state (`store/theme-store.ts`)
- **Theme Provider**: Wraps app to apply theme class to `<html>` element (`components/theme/theme-provider.tsx`)
- **CSS Variables**: All colors defined as CSS custom properties in `app/globals.css`
- **Light Mode Colors**: Bright backgrounds, dark text (optimized for daytime viewing)
- **Dark Mode Colors**: Dark backgrounds, bright text (optimized for reduced eye strain)

### Color System

Both themes use the same accent color (emerald-500) for consistency:

\`\`\`
Light Mode:
- Background: oklch(0.98 0 0) → Nearly white
- Text: oklch(0.145 0 0) → Dark slate
- Accent: oklch(0.27 0.2 151.23) → Emerald

Dark Mode:
- Background: oklch(0.06 0 0) → Nearly black
- Text: oklch(0.98 0 0) → Nearly white
- Accent: oklch(0.27 0.2 151.23) → Emerald (same)
\`\`\`

### Customizing Themes

Edit `app/globals.css` to modify theme colors:

\`\`\`css
:root {
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... other colors */
}

.dark {
  --background: oklch(0.06 0 0);
  --foreground: oklch(0.98 0 0);
  /* ... other colors */
}
\`\`\`

---

## 2. Real-time Data with WebSockets

### Overview
Widgets can connect to WebSocket endpoints for real-time data updates instead of polling REST APIs. Perfect for live stock prices, forex rates, and market data.

### How to Use

1. **Create Widget**:
   - Click "Add Widget" in the dashboard
   - Enter widget name and API URL for initial data
   - Test the API connection

2. **Enable WebSocket**:
   - Check "Enable WebSocket for live updates"
   - Enter your WebSocket URL (starts with `wss://` or `ws://`)

3. **Live Updates**:
   - A "Live" badge appears on widgets using WebSocket
   - Data updates in real-time without periodic polling
   - Refresh interval acts as fallback for REST API

### WebSocket Implementation

**Files**:
- `lib/websocket-manager.ts` - WebSocket connection manager
- `components/dashboard/dashboard-grid.tsx` - Integration with widgets
- `components/dashboard/add-widget-modal.tsx` - UI for WebSocket config
- `store/dashboard-store.ts` - Store fields: `useWebSocket`, `wsUrl`

**How It Works**:

\`\`\`typescript
// WebSocket manager handles connections
wsManager.connect({
  url: "wss://api.example.com/live",
  widgetId: widget.id,
  onData: (data) => {
    // Update widget data immediately
    store.setWidgetData(widget.id, data, timestamp)
  },
  onError: (error) => {
    // Handle connection errors
    store.setWidgetError(widget.id, error.message)
  }
})

// Automatic cleanup on widget removal
wsManager.disconnect(widgetId)
\`\`\`

### WebSocket Examples

**Forex Live Data**:
\`\`\`
wss://ws.example.com/forex
Provides: real-time currency pairs, bid/ask spreads
\`\`\`

**Crypto Price Feed**:
\`\`\`
wss://stream.binance.com:9443/ws/btcusdt@trade
Provides: Bitcoin trades, price updates
\`\`\`

**Stock Market**:
\`\`\`
wss://socket.polygon.io/stocks
Provides: Real-time stock quotes
\`\`\`

### Error Handling

- Failed WebSocket connections fall back to REST API polling
- Error messages display in widget error state
- Connections automatically reconnect after disconnect

### Performance Considerations

- WebSocket uses persistent connection (more efficient than polling)
- One connection per widget (lightweight)
- Auto-cleanup prevents memory leaks
- Initial fetch still occurs for immediate data display

---

## 3. Dashboard Templates

### Overview
Pre-built dashboard templates help you get started quickly. Load templates for specific use cases: Crypto Tracker, Stock Monitor, Forex Dashboard, Economic Calendar, Portfolio Tracker.

### Available Templates

| Template | Description | Widgets |
|----------|-------------|---------|
| **Crypto Tracker** | Real-time cryptocurrency prices | Bitcoin Price, Ethereum Price, Exchange Rates |
| **Stock Monitor** | Track stock prices and indicators | Market Overview |
| **Forex Dashboard** | Monitor currency exchange rates | Major Pairs (with WebSocket) |
| **Economic Calendar** | Key economic indicators | Economic Events |
| **Portfolio Tracker** | Investment portfolio monitoring | Holdings, Performance |

### How to Use

1. **Click Template Icon**: Palette icon in the header next to theme toggle
2. **Select Template**: Choose from available templates in the modal
3. **Load Dashboard**: Widgets load automatically, clearing existing widgets
4. **Customize**: Modify widgets or add more using "Add Widget"

### Template File Structure

\`\`\`typescript
// lib/dashboard-templates.ts
export interface DashboardTemplate {
  id: string              // Unique identifier
  name: string            // Display name
  description: string     // Template description
  icon: string           // Lucide icon name
  widgets: Widget[]       // Pre-configured widgets
}

export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: "crypto-tracker",
    name: "Crypto Tracker",
    description: "Real-time cryptocurrency prices",
    icon: "TrendingUp",
    widgets: [
      {
        name: "Bitcoin Price",
        apiUrl: "https://api.coinbase.com/...",
        refreshInterval: 60,
        displayMode: "card",
        selectedFields: ["data.rates.USD"],
      }
    ]
  }
]
\`\`\`

### Creating Custom Templates

To add your own template:

1. **Edit `lib/dashboard-templates.ts`**:
\`\`\`typescript
{
  id: "my-template",
  name: "My Custom Template",
  description: "My dashboard template",
  icon: "BarChart3",  // Lucide icon
  widgets: [
    // Add your widgets here
    {
      name: "Widget Name",
      apiUrl: "https://api.example.com/data",
      refreshInterval: 30,
      displayMode: "table",
      selectedFields: ["field1", "field2"],
      useWebSocket: false,
    }
  ]
}
\`\`\`

2. **Add to DASHBOARD_TEMPLATES array**
3. **Template auto-appears in the modal**

### Template Features

- **One-click setup**: Load entire dashboard configurations instantly
- **Customizable**: Modify template widgets after loading
- **Persistent**: Template selection is saved
- **Export/Import**: Exported dashboards can become templates
- **No backend required**: Templates stored in client code

### Best Practices

- **API URLs**: Use public APIs to ensure templates work for all users
- **Refresh Intervals**: Choose appropriate intervals (60s+ for production APIs)
- **Field Names**: Test fields before adding to template
- **Documentation**: Add comments explaining widget purposes
- **Error Handling**: Templates gracefully handle API changes

---

## Combining All Features

### Real-time Crypto Dashboard with Dark Mode

1. Click theme toggle → Switch to Dark Mode
2. Click template icon → Load "Crypto Tracker"
3. Edit Bitcoin widget → Enable WebSocket
4. Enter `wss://stream.cryptoapis.io/live`
5. Watch live Bitcoin prices update in real-time

### Custom Portfolio Template

1. Create custom template in `dashboard-templates.ts`
2. Add widgets for your portfolio
3. Enable WebSocket for real-time price feeds
4. Toggle between light/dark theme as needed
5. Export dashboard configuration for backup

---

## API Reference

### Theme Store

\`\`\`typescript
import { useThemeStore } from "@/store/theme-store"

const { theme, setTheme, toggleTheme } = useThemeStore()

// Usage
setTheme("light")      // Switch to light
toggleTheme()          // Toggle current theme
console.log(theme)     // "dark" | "light"
\`\`\`

### WebSocket Manager

\`\`\`typescript
import { wsManager } from "@/lib/websocket-manager"

// Connect
wsManager.connect({
  url: "wss://api.example.com",
  widgetId: "widget-123",
  onData: (data) => console.log(data),
  onError: (error) => console.error(error)
})

// Disconnect
wsManager.disconnect("widget-123")

// Disconnect all
wsManager.disconnectAll()
\`\`\`

### Dashboard Store (Template Support)

\`\`\`typescript
import { useDashboardStore } from "@/store/dashboard-store"

const { 
  currentTemplate, 
  setCurrentTemplate, 
  clearAllWidgets 
} = useDashboardStore()

// Set active template
setCurrentTemplate("crypto-tracker")

// Clear all widgets
clearAllWidgets()
\`\`\`

---

## Troubleshooting

### Theme Not Persisting
- Clear browser localStorage: `localStorage.clear()`
- Check `store/theme-store.ts` is properly initialized
- Verify `ThemeProvider` wraps app in layout

### WebSocket Connection Failed
- Check URL is valid (must be `wss://` for secure or `ws://` for local)
- Verify server supports WebSocket connections
- Check browser console for connection errors
- Fallback to REST API polling works automatically

### Template Not Loading
- Ensure template ID exists in `DASHBOARD_TEMPLATES`
- Check API URLs are accessible
- Verify selected fields match API response structure
- Test API connection before adding to template

### Performance Issues
- Reduce number of real-time widgets per dashboard
- Increase refresh intervals for REST APIs
- Monitor browser console for errors
- Use Chart view (not Table) for large datasets

---

## Security Notes

- WebSocket URLs are client-side only (no secrets exposed)
- Dashboard data stored in localStorage (device-local only)
- No authentication required for templates (use public APIs)
- Export/Import: Verify JSON before importing untrusted dashboards

---

## Future Enhancements

Potential improvements for FinBoard:

- Share template configurations via URL
- Community template marketplace
- Scheduled template updates
- Theme preview before switching
- Advanced WebSocket filtering/transformations
- Historical data caching strategy
\`\`\`

Now let me create an updated main page to display the new features:
