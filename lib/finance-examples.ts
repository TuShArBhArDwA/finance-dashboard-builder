export const FINANCE_API_EXAMPLES = [
  {
    name: "Bitcoin Price (Coinbase)",
    url: "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
    description: "Real-time Bitcoin exchange rates",
  },
  {
    name: "Stock Data (finnhub - FREE TIER)",
    url: "https://finnhub.io/api/v1/quote?symbol=AAPL&token=demo",
    description: "Stock quote data (requires API key)",
  },
  {
    name: "Crypto Prices (CoinGecko - FREE)",
    url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd",
    description: "Multiple cryptocurrency prices",
  },
  {
    name: "Market Data (Indian API - FREE)",
    url: "https://api.api-ninjas.com/v1/exchrates?base=USD&to=INR",
    description: "Exchange rates for multiple currencies",
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
