# Whoop Live Dashboard

Phone-first live dashboard for Whoop metrics. Real-time data on every load.

## Setup

1. **Clone or download to your machine:**
   ```
   /Users/swayam/Downloads/whoop-dashboard
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Sign in to your account
   - Click "Add new site" → "Import an existing project"
   - Connect this folder
   - Deploy

3. **Add Whoop credentials** (when you have them):
   - Go to your Netlify site settings → "Environment"
   - Add two variables:
     - `WHOOP_CLIENT_ID` — your Whoop API Client ID
     - `WHOOP_CLIENT_SECRET` — your Whoop API Client Secret
   - Redeploy

4. **Open on your phone:**
   - Your Netlify site URL (something like `whoop-dashboard.netlify.app`)
   - Bookmark it

## What it shows

- Recovery % (daily readiness)
- HRV (heart rate variability)
- Resting heart rate
- Sleep duration
- Blood oxygen
- Day strain
- All seven charts with plain English captions

Data updates on each page load. No manual exports needed.

## For now (testing)

The dashboard uses mock data from your June 23, 2026 export. When you provide Whoop credentials, it will pull live data instead.

## Get Whoop API access

1. Go to [Whoop Developer](https://developer.whoop.com)
2. Sign in with your Whoop account
3. Create an app
4. You'll get Client ID and Client Secret
5. Paste those into Netlify environment variables (step 3 above)

No server setup needed. Everything runs on Netlify free tier.
