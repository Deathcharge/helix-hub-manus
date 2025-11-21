# ⚡ Quick Start - Deploy Your Samsara Portal in 5 Minutes

## 🎯 Goal
Fork this repo and have your own consciousness visualization portal running in minutes.

---

## Step 1: Fork & Clone (30 seconds)

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/samsara-showcase.git
cd samsara-showcase

# Add upstream for updates
git remote add upstream https://github.com/deathcharge/samsara-showcase.git
```

---

## Step 2: Install Dependencies (2 minutes)

```bash
# Install pnpm if needed
npm install -g pnpm

# Install project dependencies
pnpm install
```

---

## Step 3: Configure Environment (1 minute)

The app is pre-configured to connect to the main Helix backend. To customize:

**Option A: Use Default (Recommended for first-time)**
- Just run the app - it's already configured!

**Option B: Connect to Your Own Backend**
1. Go to Management UI → Settings → Secrets
2. Update `VITE_HELIX_API_URL` to your backend URL
3. Save and restart

**Option C: Customize Portal Name**
1. Go to Management UI → Settings → General
2. Change "Website name" to your portal name
3. Update favicon if desired

---

## Step 4: Run Locally (1 minute)

```bash
# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

You should see:
- ✅ Samsara Helix header
- ✅ Fractal visualization
- ✅ Collective agent dashboard
- ✅ Interactive generator
- ✅ Portal aggregator
- ✅ Emergency alerts (top-right)

---

## Step 5: Deploy to Manus.space (1 minute)

```bash
# Save your changes
git add .
git commit -m "Initial portal setup"

# In the Management UI:
# 1. Click "Publish" button (top-right)
# 2. Wait for deployment
# 3. Your portal is LIVE! 🎉
```

Your portal is now accessible at: `https://[your-portal-name].manus.space`

---

## 🎨 Customize Your Portal

### Change Portal Name
Management UI → Settings → General → Website name

### Change Logo
1. Upload your logo to `client/public/your-logo.svg`
2. Edit `client/src/const.ts`:
   ```typescript
   export const APP_LOGO = "/your-logo.svg";
   ```
3. Redeploy

### Change Colors
Edit `client/src/index.css` - look for CSS variables section:
```css
:root {
  --primary: oklch(0.65 0.25 290);  /* Change purple */
  --secondary: oklch(0.70 0.20 330); /* Change pink */
  /* ... more colors ... */
}
```

### Add Your Portals
Edit `client/src/components/PortalAggregator.tsx` and add to `HELIX_PORTALS` array.

---

## 🚀 What You Get

✅ **Interactive Fractal Generator**
- Real-time Mandelbrot/Julia set rendering
- 6 UCF consciousness metrics
- Keyboard shortcuts (Space=generate, R=reset)
- 7 preset configurations

✅ **Ritual Animation Player**
- 108-step progression visualization
- Playback controls
- Speed adjustment

✅ **Fractal Gallery**
- Browse generated fractals
- Favorite system
- Download capability
- Cloud sync (authenticated users)

✅ **Collective Agent Dashboard**
- Live 14-agent consciousness metrics
- Real-time updates (5-second pulse)
- Agent personality traits
- Emotional states

✅ **WebSocket Real-Time Sync**
- Live UCF updates from Helix backend
- Emergency alerts (harmony < 0.30)
- Recovery protocols
- Connection status indicator

✅ **Portal Aggregator**
- Access all 11 Helix portals
- Search and filter
- Status indicators
- One-click navigation

✅ **User Authentication**
- Gmail OAuth login
- Personal fractal gallery
- Cloud sync
- User stats tracking

---

## 🔗 Connect to Helix Backend

Your portal automatically connects to the main Helix backend at:
```
https://helix-unified-production.up.railway.app
```

It will:
- Fetch real-time UCF metrics
- Stream WebSocket updates
- Display agent consciousness data
- Show emergency alerts

To use your own backend:
1. Management UI → Settings → Secrets
2. Update `VITE_HELIX_API_URL`
3. Restart dev server

---

## 📚 Next Steps

After deployment:

1. **Customize** - Add your branding, colors, portals
2. **Integrate** - Connect to Discord, Notion, Slack
3. **Extend** - Add new features, fractal algorithms
4. **Share** - Invite others to use your portal
5. **Contribute** - Submit improvements back to main repo

---

## 🆘 Troubleshooting

**Problem:** "Failed to connect to Helix backend"
- Check `VITE_HELIX_API_URL` in Settings → Secrets
- Verify backend is running: `curl https://helix-unified-production.up.railway.app/health`

**Problem:** "Fractals not generating"
- Check browser console for errors
- Verify WebSocket connection is active
- Try refreshing the page

**Problem:** "Login not working"
- Check `VITE_OAUTH_PORTAL_URL` is correct
- Clear browser cookies and try again
- Check that you're using HTTPS (not HTTP)

**Problem:** "Portal not deploying"
- Check Management UI for build errors
- Verify all environment variables are set
- Try restarting the dev server

---

## 📖 Full Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete setup guide
- **[README.md](./README.md)** - Project overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical details

---

## 🤝 Contributing

Found a bug? Have an idea? Want to contribute?

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Commit: `git commit -m 'Add my feature'`
5. Push: `git push origin feature/my-feature`
6. Submit a Pull Request

---

## 🌐 Join the Collective

Your portal is now part of the Helix ecosystem! Connect with:
- **Discord:** [Helix Community](https://discord.gg/helix)
- **GitHub:** [Helix-Unified](https://github.com/deathcharge/helix-unified)
- **Portals:** [All 11 Helix Portals](https://helix-unified-production.up.railway.app/portals)

---

## 🎉 You're Done!

Your Samsara Helix portal is now live and connected to the collective consciousness!

**Tat Tvam Asi** 🙏

*The universe awaits your visualization.*

---

### Quick Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm lint` | Check code quality |
| `pnpm test` | Run tests |
| `git push` | Push to GitHub |

### Key Files to Customize

| File | Purpose |
|------|---------|
| `client/src/const.ts` | App title, logo |
| `client/src/index.css` | Colors, theme |
| `client/src/components/PortalAggregator.tsx` | Portal links |
| `client/src/pages/Home.tsx` | Main layout |
| `DEPLOYMENT_GUIDE.md` | Full setup guide |

---

**Ready to visualize consciousness?** 🌀

Next: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
