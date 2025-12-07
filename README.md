# FinBoard - Finance Dashboard Builder

A modern, customizable finance dashboard application built with Next.js, React, and Zustand. Connect to any financial API and create real-time widgets with drag-and-drop support.

## Table of Contents

- [Features](#-features)
  - [Core Functionality](#core-functionality)
  - [UI--experience](#ui--experience)
  - [Data Handling--performance](#data-handling--performance)
  - [Dashboard Management](#dashboard-management)
  - [Widget Types](#widget-types)
  - [Bonus Features Brownie Points](#bonus-features-brownie-points)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [How to Use](#how-to-use)
  - [Adding Your First Widget](#adding-your-first-widget)
  - [Quick Start Examples](#quick-start-examples)
  - [Free APIs to Try](#free-apis-to-try)
- [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [State Management](#state-management)
  - [Data Persistence](#data-persistence)
- [Tech Stack](#tech-stack)
- [Features Explained](#features-explained)
  - [Widget System](#widget-system)
  - [JSON Field Explorer](#json-field-explorer)
  - [Auto-Refresh](#auto-refresh)
  - [Drag & Drop](#drag--drop)
  - [Theme Toggle](#theme-toggle)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)


## Features

### Core Functionality
- Connect to any JSON-based financial API (Coinbase, Finnhub, AlphaVantage, CoinGecko, etc.)
- Customizable Widgets for Cards, Tables, and Charts
- Dynamic Data Mapping — explore API response and select specific fields to display
- Auto-refresh with configurable intervals
- Real-time data update support (socket-ready architecture)
- Add, remove, and rename widgets
- Drag-and-drop widget rearrangement (dnd-kit)
- Widget configuration panel with flexible customization options
- Advanced data formatting (currency, percentage, decimal formatting)

### UI & Experience
- Light / Dark Theme Toggle with persistence
- Clean, modern UI built using ShadCN and Tailwind CSS
- Loading, error, and empty state handling for all widgets
- Responsive design for all screen sizes
- Interactive JSON field explorer
- Editable widget titles and descriptions

### Data Handling & Performance
- Real-time updates and auto-refresh handling with graceful failovers
- Caching and throttling to reduce redundant API requests
- Smart JSON parser for nested field mapping
- Error boundary for API failures

### Dashboard Management
- Persistent dashboard configuration stored in browser `localStorage`
- Full state recovery on refresh
- Export/Import dashboard configuration (JSON backup and restore)
- Pre-built dashboard templates (Crypto Market, Stock Monitor, Global Markets)

### Widget Types
- **Card Widgets** — display key-value metrics
- **Table Widgets** — structured API data with search and pagination
- **Chart Widgets** — Plot numeric fields using line charts (multi-series support)

### Bonus Features (Brownie Points Implemented)
- Dynamic theme switching
- Real-time live data widgets (Socket-ready structure)
- Dashboard template starter layouts
- Flexible API endpoint switching interface

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/TuShArBhArDwA/finance-dashboard-builder
cd finance-dashboard-builder
```

2. Install dependencies
```bash
npm install
```
3. Run the development server
```bash
npm run dev
```

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

```
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
```

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
```json
{
  "Bitcoin": {
    "USD": 45000,
    "EUR": 42000
  }
}
```

**Table View**: Display array data in sortable, searchable table
```json
{
  "stocks": [
    {"symbol": "AAPL", "price": 150},
    {"symbol": "GOOGL", "price": 140}
  ]
}
```

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

```bash
npm run build
npm run start
```


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



---

**Happy Dashboard Building!**
