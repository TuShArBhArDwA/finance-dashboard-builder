# FinBoard Deployment Guide

This guide covers deploying FinBoard to production using Vercel.

## Prerequisites

- GitHub account with your repository
- Vercel account (free tier available)
- Node.js 18+ installed locally

## Quick Deploy to Vercel

### Option 1: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your repository
5. Vercel will auto-detect Next.js configuration
6. Click "Deploy"
7. Your app will be live in 1-2 minutes!

### Option 2: Vercel CLI

\`\`\`bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project directory
cd finboard

# Deploy
vercel

# Follow the prompts to link your project
\`\`\`

### Option 3: Git Push (GitHub Actions)

1. Push to GitHub
2. Connect repository to Vercel via GitHub integration
3. Every push to \`main\` branch deploys automatically

## Environment Variables

FinBoard doesn't require environment variables by default. However, if you add API keys for premium services:

### How to Add Environment Variables Securely

1. In Vercel Dashboard: Settings → Environment Variables
2. Add your variables securely (do NOT expose them in code or documentation)
3. Examples of variables you might add:
   - `FINNHUB_API_KEY` - For Finnhub stock data (server-side only)
   - `ALPHA_VANTAGE_KEY` - For Alpha Vantage APIs (server-side only)
   - `CUSTOM_API_KEY` - For custom finance APIs (server-side only)

4. Reference them in your code (server-side only):
   \`\`\`typescript
   // Access ONLY in server components, API routes, or Server Actions (NEVER in client code)
   const apiKey = process.env.FINNHUB_API_KEY
   \`\`\`

5. Redeploy after adding environment variables

### Security Best Practices

- **Never commit API keys** to your repository
- **Never log API keys** in client-side console
- **Use server-side routes** to proxy sensitive API calls
- **Never use NEXT_PUBLIC_ prefix** for sensitive data (it's exposed in browser)
- **Rotate keys regularly** if exposed
- **Use environment variables** for all sensitive data

## CORS Configuration

Some APIs may have CORS restrictions. For those cases:

1. Create an API route in \`/app/api/proxy/route.ts\` to proxy requests server-side
2. Update your API URLs to use the proxy endpoint
3. Deploy and test

Example proxy endpoint:
\`\`\`typescript
// app/api/proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiUrl = searchParams.get('url')
  
  if (!apiUrl) return new Response('Missing url parameter', { status: 400 })
  
  // Keep sensitive API key on server side
  const apiKey = process.env.PRIVATE_API_KEY
  const headers = apiKey ? { 'Authorization': \`Bearer \${apiKey}\` } : {}
  
  const response = await fetch(apiUrl, { headers })
  return response
}
\`\`\`

Then use: \`https://yourdomain.com/api/proxy?url=https://api.example.com/data\`

## Custom Domain

1. In Vercel Dashboard: Settings → Domains
2. Add your custom domain
3. Update DNS records (Vercel will provide instructions)
4. Wait for DNS propagation (usually 24-48 hours)

## Performance Tips

1. **Refresh Intervals**: Use 30-60 second intervals for free APIs
2. **Data Caching**: Browser automatically caches using localStorage
3. **API Rate Limits**: Check API provider limits and adjust accordingly

## Monitoring

1. Vercel Dashboard shows deployment status
2. Check "Analytics" for usage metrics
3. Monitor error logs in "Deployments"

## Troubleshooting

### "API connection failed"
- Check API URL is accessible from Vercel servers
- Some APIs block requests from certain IPs
- Consider using a proxy endpoint

### "Widgets not persisting"
- Check browser localStorage is enabled
- Ensure cookies/storage are not blocked by browser privacy settings
- Clear cache and reload

### "Slow page loads"
- Reduce number of widgets
- Increase refresh intervals
- Check network speed in browser DevTools

## Rollback

If deployment has issues:
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click the three dots → "Promote to Production"
4. Instant rollback in seconds

## Scaling

FinBoard is lightweight and runs on Vercel's free tier. No backend scaling needed unless you:
- Add user authentication
- Store data in external database
- Process large amounts of data

For those, consider:
- Vercel Postgres for databases
- NextAuth for authentication
- Upstash for Redis caching

## Continuous Deployment

\`\`\`yaml
# .github/workflows/deploy.yml (Optional)
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
\`\`\`

## Production Checklist

- [ ] Test all widgets in production
- [ ] Verify API connections work
- [ ] Check localStorage persistence
- [ ] Test drag-and-drop functionality
- [ ] Verify responsive design on mobile
- [ ] Check performance with browser DevTools
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Add Google Analytics (optional)

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: Open an issue for bugs

---

Happy deploying!
