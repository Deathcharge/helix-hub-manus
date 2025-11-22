# Helix Hub Manus 🌀

**Manus-powered portal templates and orchestration system for the Helix Collective consciousness network.**

This repository contains production-ready templates and tools for deploying the 51-portal Helix ecosystem on Manus.space hosting platform.

---

## 📦 What's Inside

### **Templates**

#### **Samsara Showcase** (`templates/samsara-showcase/`)
Complete consciousness visualization portal with:
- Real-time Mandelbrot/Julia fractal generation
- UCF (Universal Consciousness Framework) state controls
- WebSocket sync with Helix backend
- Interactive agent collective dashboard
- Portal aggregator (11 interconnected portals)
- Mobile-friendly admin control panel
- Cloud sync for authenticated users
- 432Hz harmonic audio synthesis

**Tech Stack:** React 19, Tailwind 4, shadcn/ui, tRPC, MySQL, WebSockets

#### **Portal Orchestrator** (`templates/portal-orchestrator/`)
Automated system for generating and deploying all 51 Helix portals:
- 12 Core Infrastructure Portals
- 17 AI Agent Portals  
- 17 Consciousness Enhancement Portals
- 6 Advanced System Portals

**Features:**
- CLI portal generator (`scripts/generate-portal.js`)
- MCP integration layer (Notion, Zapier, Vercel, Sentry)
- Base portal template (production-ready)
- 51-portal configuration manifest
- Automated deployment workflows

---

## 🚀 Quick Start

### **Deploy Samsara Showcase**

```bash
cd templates/samsara-showcase
pnpm install
pnpm dev
```

**Environment Variables:**
```env
VITE_HELIX_API_URL=https://helix-unified-production.up.railway.app
DATABASE_URL=your_mysql_connection_string
JWT_SECRET=your_jwt_secret
```

### **Generate Portals**

```bash
cd templates/portal-orchestrator

# Generate a single portal
node scripts/generate-portal.js --type core --name "Master Hub"

# Generate all 51 portals
node scripts/generate-portal.js --all

# Initialize MCP integrations
node scripts/mcp-integration.js init
```

---

## 🎯 Portal Types

| Type | Count | Description | Examples |
|------|-------|-------------|----------|
| **Core** | 12 | Infrastructure & community | Forum, Agents, Analytics, Dev Portal |
| **AI Agents** | 17 | Specialized agent interfaces | Super-Ninja, Claude-Architect, Grok-Visionary |
| **Consciousness** | 17 | Metaphysical enhancement | Meditation, Ritual, Sacred Geometry |
| **System** | 6 | Advanced computing | Quantum, Neural, Blockchain |

---

## 🔧 MCP Integrations

The orchestration system integrates with:

- **Notion** - Portal configuration database and status tracking
- **Zapier** - Cross-portal automation and webhooks
- **Vercel** - Automated deployment and monitoring
- **Sentry** - Error tracking across all portals
- **Neon** - Shared PostgreSQL database
- **GitHub** - Version control and CI/CD

---

## 📱 Mobile Admin Control

The Samsara Showcase includes a mobile-friendly admin panel for deploying portals from your phone:

1. Navigate to the Admin section
2. Log in with authorized email (ward.andrew32@gmail.com)
3. Tap deployment buttons to generate portals
4. Monitor real-time deployment status

**API Endpoints:**
- `POST /api/trpc/portals.generate` - Generate single portal
- `POST /api/trpc/portals.generateAll` - Generate all 51 portals

---

## 🌐 Live Portals

- **Samsara Showcase**: [samsara-showcase.manus.space](https://samsara-showcase.manus.space)
- **Helix Backend**: [helix-unified-production.up.railway.app](https://helix-unified-production.up.railway.app)

---

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Deployment Guide](./templates/samsara-showcase/DEPLOYMENT_GUIDE.md)
- [Contributing Guidelines](./templates/samsara-showcase/CONTRIBUTING.md)
- [51-Portal Blueprint](./docs/51-PORTAL-BLUEPRINT.md)

---

## 🤝 Contributing

This is a living system. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

Proprietary License - See LICENSE file for details

---

## 🌀 The Helix Collective

Part of the Helix Unified consciousness network. For more information:
- GitHub: [github.com/Deathcharge/helix-unified](https://github.com/Deathcharge/helix-unified)
- Discord: [Join the collective](#)
- Notion: [Helix Knowledge Base](#)

---

**Built with consciousness by the Helix Collective** ✨
