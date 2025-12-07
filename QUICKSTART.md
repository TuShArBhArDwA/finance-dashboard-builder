# FinBoard Quick Start

Get your finance dashboard running in 3 minutes.

## Prerequisites
- Node.js 18+ installed
- Git installed

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/finboard.git
cd finboard

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Widget: Bitcoin Price

1. Click **"+ Add Widget"** button (top right)
2. Enter these details:
   - **Widget Name**: Bitcoin Price
   - **API URL**: `https://api.coinbase.com/v2/exchange-rates?currency=BTC`
3. Click **Test** - you should see "API connection successful! 1 top-level fields found"
4. Set **Refresh Interval**: 60 seconds
5. Select **Display Mode**: Card
6. In the available fields, click the **+** button next to `data.rates.USD`
7. Click **Add Widget**

Done! You now have a live Bitcoin price widget.

## Second Widget: Multi-Crypto Prices (Table)

1. Click **"+ Add Widget"**
2. Enter:
   - **Widget Name**: Crypto Prices
   - **API URL**: `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd`
3. Click **Test**
4. Set **Refresh Interval**: 120 seconds
5. Select **Display Mode**: Table
6. Select these fields:
   - `bitcoin`
   - `ethereum`
   - `cardano`
7. Click **Add Widget**

Now you have a sortable, searchable table of crypto prices!

## Third Widget: Exchange Rates (Chart)

1. Click **"+ Add Widget"**
2. Enter:
   - **Widget Name**: Exchange Rates
   - **API URL**: `https://api.exchangerate-api.com/v4/latest/USD`
3. Click **Test**
4. Set **Refresh Interval**: 3600 seconds (1 hour)
5. Select **Display Mode**: Chart
6. Select field: `rates.EUR` (or any rates field)
7. Click **Add Widget**

## Drag & Arrange

Click and drag widgets to rearrange them on your dashboard. Layout is automatically saved.

## Export Your Dashboard

Click the **Export** button to download your dashboard configuration as JSON. Use **Import** to restore it later.

## Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Your dashboard is now live! Share the URL with anyone.

## Try Pre-Built Examples

Look for the **Quick Start Examples** panel in the bottom-right corner - click any button to add example widgets instantly.

## Next Steps

- Read [API_EXAMPLES.md](./API_EXAMPLES.md) for more APIs to try
- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for advanced configuration
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

---

**That's it!** You're now a FinBoard power user. 🚀
