# FinBoard Project Structure

Complete guide to the codebase organization and architecture.

## Directory Layout

```
finboard-dashboard-builder/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page component
│   ├── globals.css              # Global styles & design tokens
│
├── components/                        # React UI & dashboard components
│   ├── dashboard/                     # Dashboard core components
│   │   ├── add-widget-modal.tsx       # Widget creation & configuration modal
│   │   ├── card-widget.tsx            # Card view widget renderer
│   │   ├── chart-widget.tsx           # Chart view widget renderer
│   │   ├── table-widget.tsx           # Table view widget renderer
│   │   ├── widget-card.tsx            # Base widget container structure
│   │   ├── dashboard-header.tsx       # Top header with app controls
│   │   ├── dashboard-grid.tsx         # Drag-and-drop grid container
│   │   ├── example-widgets.tsx        # Prebuilt quick-start templates
│   │   └── export-import.tsx          # Export / Import config JSON
│   │
│   ├── templates/                     # Dashboard Template system
│   │   ├── template-gallery.tsx       # Template listing UI
│   │   └── template-selector-modal.tsx# Template pick modal
│   │
│   ├── theme/                         # Light/Dark mode system
│   │   ├── theme-provider.tsx         # Theme context wrapper
│   │   └── theme-toggle.tsx           # Theme switch button
│   │
│   └── ui/                            # Reusable ShadCN UI components
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   └── theme-provider.tsx        # Theme setup 
│
├── hooks/                              # Custom React Hooks
│   └── use-toast.ts                    # Toast notification handler
│
├── lib/                                # Utility & core logic
│   ├── api-utils.ts                    # API testing & JSON parsing utilities
│   ├── dashboard-templates.ts          # Prebuilt dashboard layout templates
│   ├── finance-examples.ts             # Example finance API configurations
│   ├── storage.ts                      # LocalStorage persistence helpers
│   ├── utils.ts                        # Shared utility helpers (e.g. cn)
│   └── websocket-manager.ts            # WebSocket handler for live data
│
├── public/                             # Static public assets
│   ├── apple-icon.png
│   ├── icon-dark-32x32.png
│   ├── icon-light-32x32.png
│   ├── icon.svg
│   └── ...
│
├── .gitignore
├── PROJECT_STRUCTURE.md                # Full architecture documentation
├── README.md                           # Main project overview
├── components.json                     # shadcn component index
├── next-env.d.ts                       # TS definitions for Next.js
├── next.config.mjs                     # Next.js project config
├── package.json
├── package-lock.json
└── tsconfig.json                       # TypeScript configuration
```

## Data Flow

### Widget Creation Flow

```
User clicks "Add Widget"
    ↓
AddWidgetModal opens
    ↓
User enters API URL
    ↓
"Test API" clicked
    ↓
testApiConnection() called (lib/api-utils)
    ↓
JSON fields extracted & displayed
    ↓
User selects fields & display mode
    ↓
"Add Widget" clicked
    ↓
useDashboardStore.addWidget() called
    ↓
Widget added to state (localStorage synced)
    ↓
DashboardGrid re-renders
    ↓
Auto-refresh interval started
```

### Data Update Flow

```
Interval triggered (every N seconds)
    ↓
fetch() called to API URL
    ↓
Response parsed to JSON
    ↓
useDashboardStore.setWidgetData() called
    ↓
Widget state updated (lastUpdated timestamp)
    ↓
localStorage automatically synced (Zustand persist)
    ↓
Component re-renders with new data
```

## State Management

### Zustand Store Structure

```typescript
interface Widget {
  id: string                      // Unique identifier
  name: string                    // User-defined name
  apiUrl: string                  // API endpoint
  refreshInterval: number         // Seconds between updates
  displayMode: 'card'|'table'|'chart'
  selectedFields: string[]        // JSON path to display
  data: any                       // Latest fetched data
  lastUpdated: string            // Timestamp
  loading: boolean               // Fetching state
  error: string | null           // Error message
}

interface DashboardStore {
  widgets: Widget[]
  addWidget()
  updateWidget()
  removeWidget()
  reorderWidgets()
  setWidgetData()
  setWidgetLoading()
  setWidgetError()
}
```

## Styling Architecture

### Design Tokens (Tailwind CSS v4)

```css
/* Dark and light theme optimized for finance */
--background: oklch(0.06 0 0)          /* Very dark blue/black */
--foreground: oklch(0.98 0 0)          /* Almost white */
--card: oklch(0.12 0 0)                /* Slightly lighter dark */
--primary: oklch(0.27 0.2 151.23)      /* Emerald green */
--accent: oklch(0.27 0.2 151.23)       /* Same as primary */
--destructive: oklch(0.577 0.245 27)   /* Red for delete */
```

### Component Styling

- **Base components**: Use Tailwind utility classes
- **Responsive**: Mobile-first approach with `md:` and `lg:` prefixes
- **Variants**: shadcn/ui components with size/variant props
- **Dark mode**: Automatically applied (dark theme only)

## API Integration

### Supported API Types

1. **Simple JSON responses**
   ```json
   {
     "field1": "value",
     "field2": 123
   }
   ```

2. **Nested objects**
   ```json
   {
     "data": {
       "rates": {
         "USD": 100
       }
     }
   }
   ```

3. **Arrays of objects**
   ```json
   {
     "items": [
       { "name": "item1", "price": 100 },
       { "name": "item2", "price": 200 }
     ]
   }
   ```

### Field Selection Algorithm

1. Recursively traverse JSON object
2. Extract all key paths (dot notation)
3. Identify array and primitive types
4. Return flattened field list
5. User selects fields to display
6. Selected fields used in widget rendering

## Build & Optimization

### Code Splitting

- Next.js automatically splits routes
- Components lazy-loaded via dynamic imports
- Charts library (Recharts) loaded only when needed

### Bundle Size

Approximate production bundle:
- Main JS: ~150KB (minified, gzipped)
- CSS: ~20KB
- Dependencies: ~500KB (node_modules)

### Performance Metrics

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## Testing Strategy

### Unit Tests
- API utils (`extractFields`, `getNestedValue`)
- Storage helpers (`saveConfig`, `loadConfig`)

### Integration Tests
- Widget creation flow
- Drag-and-drop reordering
- Data persistence

### E2E Tests
- Full dashboard workflow
- API connection testing
- Export/import functionality

## Security Considerations

1. **API URLs**: User-provided, no validation of safety
   - Consider: URL whitelist or validation
   - Potential: SSRF attacks via proxy

2. **API Keys**: No sensitive storage
   - Recommendation: Use environment variables
   - Never commit `.env` files

3. **localStorage**: Browser storage
   - Limitation: XSS attacks could access data
   - Mitigation: CSP headers, input sanitization

4. **CORS**: Handled by browser/API provider
   - No CORS bypass methods recommended for production

## Dependencies

### Core
- **next**: 16.0.7 - React framework
- **react**: 19.2.0 - UI library
- **zustand**: 5.0.9 - State management

### UI
- **shadcn/ui**: Component library
- **tailwindcss**: 4.1.9 - Styling
- **lucide-react**: Icons

### Drag & Drop
- **@dnd-kit/core**: DnD framework
- **@dnd-kit/sortable**: Sortable lists
- **@dnd-kit/utilities**: Helper functions

### Charts
- **recharts**: 2.15.4 - React charts

### Utilities
- **date-fns**: Date formatting
- **zod**: Schema validation
- **clsx**: Classname utilities

---

For detailed component documentation, see source code comments.
