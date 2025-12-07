# FinBoard - Finance Dashboard Builder

A modern, customizable finance dashboard application built with Next.js, React, and Zustand. Connect to any financial API and create real-time widgets with drag-and-drop support.

## Features

✨ **Core Features**
- 🔌 Connect to any JSON finance API (Coinbase, Alpha Vantage, Finnhub, etc.)
- 📊 Multiple display modes: Card, Table, and Chart views
- 🎯 Dynamic JSON field selection with smart explorer
- 🔄 Auto-refresh data at custom intervals
- 🎨 Drag-and-drop widget rearrangement
- 💾 Persistent dashboard configuration in browser storage
- 🌙 Modern dark theme UI
- ⚡ Real-time data updates

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd finboard
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Adding Your First Widget

1. Click the **"+ Add Widget"** button in the top-right corner
2. Fill in the widget name (e.g., "Bitcoin Price")
3. Enter the API URL (e.g., `https://api.coinbase.com/v2/exchange-rates?currency=BTC`)
4. Click **"Test"** to verify the API connection
5. Select the refresh interval (in seconds)
6. Choose your display mode: Card, Table, or Chart
7. Select fields from the available JSON fields
8. Click **"Add Widget"** to add it to your dashboard

### Quick Start Examples

The app includes quick-start buttons for popular free APIs:
- Bitcoin Price (Coinbase)
- Ethereum Price (Coinbase)
- Multi Crypto Prices (CoinGecko)

### Free APIs to Try

**Cryptocurrency Prices:**
- Coinbase: `https://api.coinbase.com/v2/exchange-rates?currency=BTC`
- CoinGecko: `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd`

**Stock Data:**
- Finnhub (demo token): `https://finnhub.io/api/v1/quote?symbol=AAPL&token=demo`

**Currency Exchange:**
- API Ninjas: `https://api.api-ninjas.com/v1/exchrates?base=USD&to=INR`

## Architecture

### Project Structure

\`\`\`
finboard/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── dashboard/
│   │   ├── dashboard-header.tsx
│   │   ├── dashboard-grid.tsx
│   │   ├── add-widget-modal.tsx
│   │   ├── widget-card.tsx
│   │   ├── card-widget.tsx
│   │   ├── table-widget.tsx
│   │   ├── chart-widget.tsx
│   │   └── example-widgets.tsx
│   └── ui/                 # shadcn/ui components
├── store/
│   └── dashboard-store.ts  # Zustand state management
├── lib/
│   ├── api-utils.ts       # API testing and JSON parsing
│   ├── storage.ts         # localStorage utilities
│   └── finance-examples.ts # Example finance APIs
└── package.json

\`\`\`

### State Management

The app uses **Zustand** for state management. The main store (`useDashboardStore`) handles:
- Widget creation and deletion
- Widget reordering
- Data fetching and caching
- Loading and error states

### Data Persistence

Dashboard configuration is automatically saved to browser `localStorage` under the key `finboard-dashboard`. This includes:
- Widget configurations
- API URLs and refresh intervals
- Selected fields
- Display modes

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: ShadCN UI + Tailwind CSS v4
- **State Management**: Zustand 5
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Tailwind CSS v4

## Features Explained

### Widget System

**Card View**: Display simple key-value pairs from JSON data
\`\`\`json
{
  "Bitcoin": {
    "USD": 45000,
    "EUR": 42000
  }
}
\`\`\`

**Table View**: Display array data in sortable, searchable table
\`\`\`json
{
  "stocks": [
    {"symbol": "AAPL", "price": 150},
    {"symbol": "GOOGL", "price": 140}
  ]
}
\`\`\`

**Chart View**: Visualize numeric data with line charts
- Multiple series support
- Real-time updates
- Responsive design

### JSON Field Explorer

When you test an API:
1. Available fields are extracted from the JSON response
2. Fields can be searched and filtered
3. Array fields are marked for table views
4. You select which fields to display
5. Selected fields are displayed in the widget

### Auto-Refresh

- Set custom refresh intervals (minimum 5 seconds)
- Data automatically updates at the specified interval
- Failed requests are gracefully handled with error messages
- Manual refresh button available on each widget

### Drag & Drop

- Reorder widgets by dragging them
- Smooth animations and feedback
- Layout adjusts responsively across devices

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Vercel will automatically deploy on push
4. Your dashboard is live!

\`\`\`bash
npm run build
npm run start
\`\`\`

## API Rate Limiting

When using free APIs:
- Respect API rate limits (usually 60-1000 requests/hour)
- Increase refresh intervals to reduce requests
- Monitor API provider documentation for limits

## Troubleshooting

**Widget shows "API connection failed":**
- Check the API URL is correct
- Verify the API is accessible
- Some APIs require API keys or CORS headers

**Data not updating:**
- Check browser console for errors
- Verify refresh interval is set
- Ensure network connection is active

**Stored widgets disappeared:**
- Check browser's localStorage is enabled
- Try clearing cache (may require re-adding widgets)
- Check browser's privacy settings

## Examples & Ideas

### Investment Tracking Dashboard
- Bitcoin and Ethereum prices (Coinbase)
- Stock quotes (Finnhub)
- Market indices (Alpha Vantage)

### Crypto Portfolio Monitor
- Multiple cryptocurrency prices
- 24h change tracking
- Market cap data

### Global Markets
- Currency exchange rates
- Gold prices
- Oil prices

## Future Enhancements

- Real-time WebSocket support for live updates
- Export/Import dashboard configurations (JSON files)
- Pre-built starter templates
- Theme switcher (Light/Dark)
- Custom API authentication (API keys)
- Data caching with stale-while-revalidate
- Widget customization (colors, sizes)
- Desktop app with Tauri

## Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check API provider documentation
4. Open an issue on GitHub

---

**Happy Dashboard Building! 🚀**
