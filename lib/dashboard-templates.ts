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
    description: "Track market prices and indicators (Note: Alpha Vantage demo key has rate limits)",
    icon: "BarChart3",
    widgets: [
      {
        name: "Major Cryptocurrencies",
        apiUrl: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana&vs_currencies=usd",
        refreshInterval: 120,
        displayMode: "table",
        selectedFields: ["bitcoin.usd", "ethereum.usd", "cardano.usd", "solana.usd"],
        useWebSocket: false,
      },
      {
        name: "Bitcoin Price",
        apiUrl: "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
        refreshInterval: 60,
        displayMode: "card",
        selectedFields: ["data.rates.USD", "data.rates.EUR", "data.rates.GBP"],
        useWebSocket: false,
      },
      {
        name: "Ethereum Price",
        apiUrl: "https://api.coinbase.com/v2/exchange-rates?currency=ETH",
        refreshInterval: 60,
        displayMode: "card",
        selectedFields: ["data.rates.USD", "data.rates.EUR"],
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
        name: "USD Exchange Rates",
        apiUrl: "https://api.exchangerate-api.com/v4/latest/USD",
        refreshInterval: 30,
        displayMode: "table",
        selectedFields: ["rates"],
        useWebSocket: false,
      },
    ],
  },
  {
    id: "economic-calendar",
    name: "Economic Calendar",
    description: "Key economic indicators and market data",
    icon: "Calendar",
    widgets: [
      {
        name: "USD Exchange Rates",
        apiUrl: "https://api.exchangerate-api.com/v4/latest/USD",
        refreshInterval: 3600,
        displayMode: "table",
        selectedFields: ["rates"],
        useWebSocket: false,
      },
      {
        name: "EUR Exchange Rates",
        apiUrl: "https://api.exchangerate-api.com/v4/latest/EUR",
        refreshInterval: 3600,
        displayMode: "table",
        selectedFields: ["rates"],
        useWebSocket: false,
      },
      {
        name: "GBP Exchange Rates",
        apiUrl: "https://api.exchangerate-api.com/v4/latest/GBP",
        refreshInterval: 3600,
        displayMode: "card",
        selectedFields: ["rates.USD", "rates.EUR", "rates.JPY"],
        useWebSocket: false,
      },
    ],
  },
  {
    id: "portfolio-tracker",
    name: "Portfolio Tracker",
    description: "Track cryptocurrency and market performance",
    icon: "Briefcase",
    widgets: [
      {
        name: "Crypto Portfolio",
        apiUrl: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana&vs_currencies=usd",
        refreshInterval: 300,
        displayMode: "table",
        selectedFields: ["bitcoin.usd", "ethereum.usd", "cardano.usd", "solana.usd"],
        useWebSocket: false,
      },
      {
        name: "Bitcoin Price History",
        apiUrl: "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
        refreshInterval: 300,
        displayMode: "card",
        selectedFields: ["data.rates.USD", "data.rates.EUR", "data.rates.GBP"],
        useWebSocket: false,
      },
      {
        name: "Multi Asset Prices",
        apiUrl: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,eur",
        refreshInterval: 300,
        displayMode: "card",
        selectedFields: ["bitcoin.usd", "ethereum.usd", "bitcoin.eur", "ethereum.eur"],
        useWebSocket: false,
      },
    ],
  },
]
