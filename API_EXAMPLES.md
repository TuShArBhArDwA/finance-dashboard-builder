# Finance API Examples for FinBoard

This document provides tested API endpoints and configurations for common finance data sources.

## Free Cryptocurrency APIs

### Coinbase Exchange Rates

**Endpoint**: \`https://api.coinbase.com/v2/exchange-rates?currency=BTC\`

**No authentication required** - Free, no rate limits disclosed

**Response Structure**:
\`\`\`json
{
  "data": {
    "currency": "BTC",
    "rates": {
      "USD": "45000.00",
      "EUR": "42000.00",
      "GBP": "38000.00",
      "JPY": "5000000.00"
    }
  }
}
\`\`\`

**Widget Configuration**:
- **Name**: Bitcoin Price
- **Display Mode**: Card
- **Selected Fields**: 
  - \`data.rates.USD\`
  - \`data.rates.EUR\`
  - \`data.rates.GBP\`
- **Refresh Interval**: 60 seconds

---

### CoinGecko Cryptocurrency Prices

**Endpoint**: \`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd,eur\`

**No authentication required** - Free, 10-50 calls/minute

**Response Structure**:
\`\`\`json
{
  "bitcoin": {
    "usd": 45000,
    "eur": 42000
  },
  "ethereum": {
    "usd": 3000,
    "eur": 2800
  },
  "cardano": {
    "usd": 1.2,
    "eur": 1.1
  }
}
\`\`\`

**Widget Configuration**:
- **Name**: Multi Crypto Prices
- **Display Mode**: Card
- **Selected Fields**: 
  - \`bitcoin.usd\`
  - \`ethereum.usd\`
  - \`cardano.usd\`
- **Refresh Interval**: 120 seconds

**Query Parameters**:
- \`ids\`: comma-separated cryptocurrency IDs
- \`vs_currencies\`: comma-separated target currencies

---

## Stock Market APIs

### Finnhub Stock Quotes

**Endpoint**: \`https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_API_TOKEN\`

**Authentication required** - Free tier available with registration

**To get your API token**:
1. Sign up at https://finnhub.io
2. Copy your API token from your dashboard
3. Replace \`YOUR_API_TOKEN\` in the endpoint above
4. Store the token securely in Vercel Environment Variables, NOT in your code

**Response Structure**:
\`\`\`json
{
  "c": 150.25,          // Current price
  "h": 152.50,          // High
  "l": 149.75,          // Low
  "o": 150.00,          // Open
  "pc": 149.50,         // Previous close
  "t": 1234567890       // Timestamp
}
\`\`\`

**Widget Configuration**:
- **Name**: Apple Stock Price
- **Display Mode**: Card
- **Selected Fields**: 
  - \`c\` (current price)
  - \`h\` (high)
  - \`l\` (low)
- **Refresh Interval**: 300 seconds (5 minutes)

**Available Symbols**: AAPL, GOOGL, MSFT, AMZN, TSLA, etc.

**Security Note**: Use server-side API routes to proxy requests with your token to avoid exposing it in client code.

---

### Alpha Vantage Stock Data

**Endpoint**: \`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_API_KEY\`

**Authentication required** - Free tier: 5 requests/minute, 500 requests/day

**To get your API key**:
1. Sign up at https://www.alphavantage.co
2. Copy your API key from your account page
3. Replace \`YOUR_API_KEY\` in the endpoint above
4. Store securely in environment variables

---

## Currency Exchange APIs

### Exchange Rates API

**Endpoint**: \`https://api.exchangerate-api.com/v4/latest/USD\`

**No authentication required** - Free tier: 1,500 requests/month

**Response Structure**:
\`\`\`json
{
  "base": "USD",
  "date": "2024-01-15",
  "rates": {
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 149.50,
    "INR": 83.12,
    "AUD": 1.52,
    "CAD": 1.36
  }
}
\`\`\`

**Widget Configuration**:
- **Name**: USD Exchange Rates
- **Display Mode**: Card or Table
- **Selected Fields**: 
  - \`rates.EUR\`
  - \`rates.GBP\`
  - \`rates.JPY\`
  - \`rates.INR\`
- **Refresh Interval**: 3600 seconds (1 hour)

**Usage**: Change \`USD\` in URL to any currency code

---

### API Ninjas Exchange Rates

**Endpoint**: \`https://api.api-ninjas.com/v1/exchangerate?base=USD&to=INR\`

**Free tier**: 50,000 requests/month per header

**To use with API key**:
1. Sign up at https://api-ninjas.com
2. Get your API key from your dashboard
3. Add to request header: \`X-Api-Key: YOUR_API_KEY\`
4. Store in environment variables, NOT in client code

**Response Structure**:
\`\`\`json
{
  "base": "USD",
  "to": "INR",
  "rate": 83.12
}
\`\`\`

**Widget Configuration**:
- **Name**: USD to INR
- **Display Mode**: Card
- **Selected Fields**: 
  - \`rate\`
- **Refresh Interval**: 3600 seconds

---

## Weather/Environmental Data (Finance-adjacent)

### Open-Meteo Weather

**Endpoint**: \`https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,weather_code\`

**No authentication required** - Completely free, unlimited

**Widget Configuration**:
- **Name**: NYC Weather
- **Display Mode**: Card
- **Selected Fields**: 
  - \`current.temperature_2m\`
  - \`current.weather_code\`
- **Refresh Interval**: 600 seconds

---

## Implementing APIs with Authentication

### Method 1: Server-Side Proxy Route (RECOMMENDED)

\`\`\`typescript
// app/api/finance/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  
  // Your API key stays on the server
  const apiKey = process.env.FINNHUB_API_KEY
  
  const response = await fetch(
    \`https://finnhub.io/api/v1/quote?symbol=\${symbol}&token=\${apiKey}\`
  )
  
  return response
}
\`\`\`

Then call from client:
\`\`\`typescript
// In your widget component
const response = await fetch('/api/finance?symbol=AAPL')
const data = await response.json()
\`\`\`

### Method 2: Header-Based Authentication

\`\`\`typescript
const apiKey = process.env.YOUR_API_KEY

const response = await fetch(url, {
  headers: {
    'X-API-Key': apiKey,
    'Authorization': \`Bearer \${apiKey}\`
  }
})
\`\`\`

### Method 3: Storing Secrets in Vercel

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add your API key with a secure name: \`FINNHUB_API_KEY=your_actual_key\`
3. Never add these to your code or documentation
4. Reference only in server-side code using \`process.env.FINNHUB_API_KEY\`

---

## Tips for Using APIs

### Rate Limiting Best Practices

1. **Check API Documentation**: Every API has different rate limits
   - Free Tier: Usually 60-1,500 requests/month
   - Paid Tier: Typically 100,000+ requests/month

2. **Increase Refresh Intervals**:
   - Frequently updated data (crypto): 30-60 seconds
   - Slowly changing data (stocks): 300-900 seconds (5-15 min)
   - Daily data (exchange rates): 3600+ seconds (1+ hours)

3. **Monitor Usage**:
   - Check API provider dashboard for current usage
   - Set up alerts if approaching limits
   - Consider multiple APIs for redundancy

### CORS Issues

Some APIs don't support CORS from browsers. Solutions:

1. **Create a backend proxy** (recommended):
   \`\`\`typescript
   // app/api/proxy/route.ts
   export async function GET(request: Request) {
     const url = new URL(request.url)
     const targetUrl = url.searchParams.get('url')
     
     if (!targetUrl) return new Response('Missing url parameter', { status: 400 })
     
     const response = await fetch(targetUrl)
     return response
   }
   \`\`\`

2. **Check if API supports CORS**:
   - Most modern APIs support it
   - Check API documentation for CORS headers

---

## Testing an API

Before adding to FinBoard:

1. **Use curl or Postman**:
   \`\`\`bash
   curl "https://api.coinbase.com/v2/exchange-rates?currency=BTC"
   \`\`\`

2. **Check response**:
   - Is it valid JSON?
   - Does it have the fields you need?
   - Is the data structure nested or flat?

3. **Test in FinBoard**:
   - Use the "Test" button in Add Widget modal
   - Verify fields are correctly extracted
   - Select fields to display

---

## Recommended Combinations

### Crypto Tracker Dashboard
- Bitcoin price (Coinbase)
- Ethereum price (CoinGecko)
- Multi crypto prices (CoinGecko)
- Refresh: 60 seconds

### Global Markets Dashboard
- USD exchange rates (Exchange Rates API)
- Bitcoin price (Coinbase)
- Weather data (Open-Meteo)
- Refresh: 300-3600 seconds

### Personal Finance Dashboard
- Crypto holdings (CoinGecko)
- Stock quotes (Finnhub - requires key)
- Exchange rates (Exchange Rates API)
- Refresh: 300-600 seconds

---

## Additional Resources

- CoinGecko API Docs: https://docs.coingecko.com/reference/simple-price
- Finnhub Docs: https://finnhub.io/docs/api/
- Exchange Rates API: https://www.exchangerate-api.com/docs
- API Ninjas: https://api-ninjas.com/api/exchangerate
- Alpha Vantage: https://www.alphavantage.co/documentation/

---

Happy data gathering!
