/**
 * Finance API Examples
 * Pre-configured examples for quick widget creation
 * Includes recommended APIs: Coinbase, Alpha Vantage, and Indian market data
 */
export const FINANCE_API_EXAMPLES = [
  {
    name: "Bitcoin Price (Coinbase)",
    url: "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
    description: "Real-time Bitcoin exchange rates - No API key required",
    displayMode: "card" as const,
    selectedFields: ["data.rates.USD"],
    refreshInterval: 60,
  },
  {
    name: "Ethereum Price (Coinbase)",
    url: "https://api.coinbase.com/v2/exchange-rates?currency=ETH",
    description: "Real-time Ethereum exchange rates - No API key required",
    displayMode: "card" as const,
    selectedFields: ["data.rates.USD"],
    refreshInterval: 60,
  },
  {
    name: "Multi Crypto Prices (CoinGecko)",
    url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd",
    description: "Multiple cryptocurrency prices - No API key required",
    displayMode: "card" as const,
    selectedFields: ["bitcoin.usd", "ethereum.usd", "cardano.usd"],
    refreshInterval: 120,
  },
  {
    name: "Alpha Vantage Stock (AAPL)",
    url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=demo",
    description: "Stock time series data - Replace 'demo' with your API key",
    displayMode: "chart" as const,
    selectedFields: ["Time Series (Daily)"],
    refreshInterval: 300,
    note: "Get free API key at https://www.alphavantage.co/support/#api-key",
  },
  {
    name: "52-Week High Stocks (Indian Market)",
    url: "https://latest-stock-price.p.rapidapi.com/any/52week_high",
    description: "Indian market 52-week high stocks - Requires RapidAPI key",
    displayMode: "table" as const,
    selectedFields: [],
    refreshInterval: 3600,
    note: "Requires RapidAPI subscription and X-RapidAPI-Key header",
  },
  {
    name: "USD Exchange Rates",
    url: "https://api.exchangerate-api.com/v4/latest/USD",
    description: "Exchange rates for multiple currencies - No API key required",
    displayMode: "table" as const,
    selectedFields: ["rates"],
    refreshInterval: 3600,
  },
]

export async function fetchFinanceData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    throw new Error(`Failed to fetch: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
