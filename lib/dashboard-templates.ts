import type { Widget } from "@/store/dashboard-store"

export interface DashboardTemplate {
  id: string
  name: string
  description: string
  icon: string
  widgets: Omit<Widget, "id" | "data" | "lastUpdated" | "loading" | "error">[]
}

// Pre-built templates with example configurations
export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: "crypto-tracker",
    name: "Crypto Tracker",
    description: "Real-time cryptocurrency prices and market data",
    icon: "TrendingUp",
    widgets: [
      {
        name: "Bitcoin Price",
        apiUrl: "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
        refreshInterval: 60,
        displayMode: "card",
        selectedFields: ["data.rates.USD"],
        useWebSocket: false,
      },
      {
        name: "Ethereum Price",
        apiUrl: "https://api.coinbase.com/v2/exchange-rates?currency=ETH",
        refreshInterval: 60,
        displayMode: "card",
        selectedFields: ["data.rates.USD"],
        useWebSocket: false,
      },
      {
        name: "Exchange Rates",
        apiUrl: "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
        refreshInterval: 300,
        displayMode: "table",
        selectedFields: ["data.rates"],
        useWebSocket: false,
      },
    ],
  },
  {
    id: "stock-monitor",
    name: "Stock Monitor",
    description: "Track stock prices and market indicators",
    icon: "BarChart3",
    widgets: [
      {
        name: "Market Overview",
        apiUrl: "https://api.example.com/stocks/overview",
        refreshInterval: 120,
        displayMode: "table",
        selectedFields: [],
        useWebSocket: false,
      },
    ],
  },
  {
    id: "forex-dashboard",
    name: "Forex Dashboard",
    description: "Monitor currency exchange rates",
    icon: "DollarSign",
    widgets: [
      {
        name: "Major Pairs",
        apiUrl: "https://api.example.com/forex/pairs",
        refreshInterval: 30,
        displayMode: "table",
        selectedFields: [],
        useWebSocket: true,
        wsUrl: "wss://api.example.com/forex",
      },
    ],
  },
  {
    id: "economic-calendar",
    name: "Economic Calendar",
    description: "Key economic indicators and events",
    icon: "Calendar",
    widgets: [
      {
        name: "Economic Events",
        apiUrl: "https://api.example.com/economic/events",
        refreshInterval: 3600,
        displayMode: "table",
        selectedFields: [],
        useWebSocket: false,
      },
    ],
  },
  {
    id: "portfolio-tracker",
    name: "Portfolio Tracker",
    description: "Track your investment portfolio",
    icon: "Briefcase",
    widgets: [
      {
        name: "Holdings",
        apiUrl: "https://api.example.com/portfolio/holdings",
        refreshInterval: 300,
        displayMode: "table",
        selectedFields: [],
        useWebSocket: false,
      },
      {
        name: "Performance",
        apiUrl: "https://api.example.com/portfolio/performance",
        refreshInterval: 300,
        displayMode: "chart",
        selectedFields: [],
        useWebSocket: false,
      },
    ],
  },
]
