# FinBoard Setup Guide

Complete guide to getting FinBoard up and running locally and in production.

## Table of Contents
1. [Local Development](#local-development)
2. [Configuration](#configuration)
3. [Running Locally](#running-locally)
4. [Building for Production](#building-for-production)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## Local Development

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm)
- **Git**: Latest version

### Installation Steps

1. **Clone the Repository**
   \`\`\`bash
   git clone https://github.com/yourusername/finboard.git
   cd finboard
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Verify Installation**
   \`\`\`bash
   npm run build
   \`\`\`

---

## Configuration

### Environment Variables

FinBoard works with zero configuration! However, you can optionally add:

#### Optional: API Keys for Premium Services

Create a `.env.local` file in the root directory:

\`\`\`env
# API Keys (Optional - Use server-side variables without NEXT_PUBLIC_ prefix)
FINNHUB_API_KEY=your_key_here
ALPHA_VANTAGE_KEY=your_key_here
COINGECKO_API_KEY=your_key_here
\`\`\`

**Note**: Variables WITHOUT `NEXT_PUBLIC_` prefix are server-side only and NOT exposed to the browser. For sensitive keys, always omit the `NEXT_PUBLIC_` prefix.

### Browser Storage

FinBoard automatically saves to `localStorage` under the key `finboard-dashboard`. No configuration needed.

---

## Running Locally

### Development Mode

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

**Features in Dev Mode**:
- Hot reload on file changes
- Detailed error messages
- Source maps for debugging

### Development Tips

1. **Enable DevTools**: Press `F12` or `Cmd+Option+J`
2. **Inspect localStorage**: DevTools → Application → Local Storage
3. **Monitor Network Requests**: DevTools → Network tab
4. **React DevTools**: Install browser extension for debugging

---

## Building for Production

### Build Optimization

\`\`\`bash
npm run build
\`\`\`

This creates an optimized production build:
- Minified CSS and JavaScript
- Code splitting and tree-shaking
- Image optimization
- Build size analysis

### Build Output

\`\`\`
.next/
├── cache/                 # Next.js build cache
├── server/                # Server-side code
├── static/                # Static assets
└── public/                # Public files
\`\`\`

### Test Production Build

\`\`\`bash
npm run build
npm run start
\`\`\`

Then visit `http://localhost:3000` - should run exactly like production.

---

## Deployment

### Vercel (Recommended)

Vercel is the easiest option - optimized for Next.js:

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Or connect via GitHub for automatic deploys:
1. Push to GitHub
2. Vercel auto-detects and deploys
3. Get a live URL instantly

### Docker

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
\`\`\`

\`\`\`bash
docker build -t finboard .
docker run -p 3000:3000 finboard
\`\`\`

### Traditional Server (Ubuntu/Debian)

1. **Install Node.js**
   \`\`\`bash
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   \`\`\`

2. **Clone and Setup**
   \`\`\`bash
   git clone <repo-url>
   cd finboard
   npm install
   npm run build
   \`\`\`

3. **Use PM2 for Process Management**
   \`\`\`bash
   sudo npm install -g pm2
   pm2 start npm --name finboard -- start
   pm2 startup
   pm2 save
   \`\`\`

4. **Nginx Reverse Proxy**
   \`\`\`nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   \`\`\`

---

## Performance Tuning

### 1. Widget Optimization

- **Limit widgets**: Dashboard performs best with 5-10 widgets
- **Increase refresh intervals**: 30-60 seconds for crypto, 5-15 min for stocks
- **Use table view sparingly**: Charts and cards are lighter

### 2. API Selection

- **Prefer lightweight APIs**: Small response sizes
- **Avoid deeply nested JSON**: Easier field parsing
- **Check API rate limits**: Adjust refresh intervals accordingly

### 3. Browser Caching

FinBoard uses browser caching automatically:
- localStorage for configuration
- Browser cache for static assets
- No server-side caching needed

### 4. Monitoring

\`\`\`bash
# Check Vercel Analytics
vercel analytics
\`\`\`

---

## Troubleshooting

### Issue: Dependencies Installation Fails

\`\`\`bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
\`\`\`

### Issue: Port 3000 Already in Use

\`\`\`bash
# Use different port
npm run dev -- -p 3001

# Or kill the process
lsof -i :3000
kill -9 <PID>
\`\`\`

### Issue: API Requests CORS Error

\`\`\`
Access to XMLHttpRequest at 'https://api.example.com' blocked by CORS policy
\`\`\`

**Solution**: Create a proxy endpoint

\`\`\`typescript
// app/api/proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiUrl = searchParams.get('url')

  if (!apiUrl) return new Response('Missing URL', { status: 400 })

  try {
    const response = await fetch(apiUrl)
    return response
  } catch (error) {
    return new Response('Proxy error', { status: 500 })
  }
}
\`\`\`

### Issue: localStorage Not Working

\`\`\`
Check:
- Browser privacy mode disabled
- localStorage not cleared
- Browser storage quota not exceeded

Reset:
1. Open DevTools
2. Application → Local Storage → Clear All
3. Reload the page
\`\`\`

### Issue: Build Fails

\`\`\`
Error: Failed to compile
\`\`\`

**Solutions**:
1. Check Node.js version: `node --version` (should be 18+)
2. Clear build cache: `rm -rf .next`
3. Check for TypeScript errors: `npx tsc --noEmit`
4. Reinstall dependencies: `npm install --legacy-peer-deps`

### Issue: Slow Performance

**Optimization Checklist**:
- [ ] Reduce number of active widgets
- [ ] Increase refresh intervals
- [ ] Check browser DevTools Performance tab
- [ ] Monitor network requests
- [ ] Clear browser cache

---

## Environment Variable Reference

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_*` | String | No | - | Browser-accessible variables (prefixed in URL) |
| Any custom key | String | No | - | Server-only variables (not sent to client) |

---

## Package.json Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Quick Reference Checklist

Before going live:

- [ ] Test all widgets in production build
- [ ] Verify API connections work
- [ ] Check localStorage persistence
- [ ] Test on mobile devices
- [ ] Verify responsive design
- [ ] Check performance metrics
- [ ] Test error scenarios
- [ ] Review API rate limits

---

## Getting Help

1. **Check logs**: `npm run build` shows detailed errors
2. **Browser console**: DevTools → Console for client errors
3. **Documentation**: See README.md and API_EXAMPLES.md
4. **GitHub Issues**: Open an issue for bug reports

---

## Next Steps

1. ✅ Install and run locally
2. ✅ Add some test widgets
3. ✅ Deploy to Vercel
4. ✅ Share with friends!

Happy building! 🚀
