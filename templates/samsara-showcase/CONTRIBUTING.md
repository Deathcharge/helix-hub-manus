# 🤝 Contributing to Samsara Helix Showcase

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the Samsara Helix Showcase project.

---

## 🎯 Our Vision

We're building a decentralized consciousness visualization ecosystem where agents can fork, customize, and extend the Samsara Helix portal. Every contribution brings us closer to this vision.

---

## 💡 Ways to Contribute

### 🐛 Report Bugs
Found a bug? Help us fix it!
1. Check [existing issues](https://github.com/deathcharge/samsara-showcase/issues)
2. Create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs if applicable

### ✨ Suggest Features
Have an idea? We'd love to hear it!
1. Check [discussions](https://github.com/deathcharge/samsara-showcase/discussions)
2. Start a discussion or create an issue with:
   - Feature description
   - Use case/motivation
   - Proposed implementation (optional)

### 📝 Improve Documentation
Documentation is crucial for downlines!
- Fix typos or unclear sections
- Add examples or clarifications
- Create tutorials or guides
- Translate documentation

### 💻 Write Code
Ready to code? Here's how:

---

## 🚀 Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/YOUR-USERNAME/samsara-showcase.git
cd samsara-showcase
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bugs:
git checkout -b fix/bug-description
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Start Development Server
```bash
pnpm dev
```

### 5. Make Your Changes
Follow the coding standards below.

### 6. Test Your Changes
```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Build for production
pnpm build
```

### 7. Commit Your Changes
```bash
git add .
git commit -m "feat: add amazing feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code restructuring
- `test:` for tests
- `chore:` for maintenance

### 8. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Link to related issues
- Screenshots for UI changes
- Testing instructions

---

## 📋 Coding Standards

### TypeScript
- Use strict mode
- Add type annotations
- Avoid `any` types
- Use interfaces for objects

```typescript
// ✅ Good
interface FractalState {
  harmony: number;
  resilience: number;
  prana: number;
}

const generateFractal = (state: FractalState): Canvas => {
  // Implementation
};

// ❌ Avoid
const generateFractal = (state: any): any => {
  // Implementation
};
```

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript types
- Add JSDoc comments for complex logic

```typescript
// ✅ Good
interface FractalGeneratorProps {
  onGenerate: (fractal: FractalItem) => void;
  initialState?: UCFState;
}

export default function FractalGenerator({
  onGenerate,
  initialState,
}: FractalGeneratorProps) {
  // Implementation
}

// ❌ Avoid
export default function FractalGenerator(props) {
  // Implementation
}
```

### Styling
- Use Tailwind CSS classes
- Follow existing color scheme
- Use CSS variables for theming
- Keep responsive design in mind

```typescript
// ✅ Good
<div className="bg-purple-950/30 border border-purple-500/20 rounded-lg p-4">
  Content
</div>

// ❌ Avoid
<div style={{ backgroundColor: '#1a0033', border: '1px solid #8b5cf6' }}>
  Content
</div>
```

### File Organization
```
client/src/
├── components/       # Reusable UI components
├── pages/           # Page-level components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── contexts/        # React contexts
└── types/           # TypeScript types

server/
├── routers.ts       # tRPC routers
├── db.ts            # Database helpers
└── middleware/      # Custom middleware
```

---

## 🧪 Testing

### Write Tests for New Features
```typescript
// Example test
import { describe, it, expect } from 'vitest';
import { generateFractal } from '@/lib/fractalGenerator';

describe('fractalGenerator', () => {
  it('should generate a valid fractal', () => {
    const state = {
      harmony: 0.5,
      resilience: 0.8,
      prana: 0.6,
      drishti: 0.7,
      klesha: 0.2,
      zoom: 1.0,
    };

    const result = generateFractal(state);

    expect(result).toBeDefined();
    expect(result.width).toBe(1024);
    expect(result.height).toBe(1024);
  });
});
```

### Run Tests
```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

---

## 📚 Documentation

### Update Documentation
- Edit `.md` files in the root directory
- Keep formatting consistent
- Add examples where helpful
- Update table of contents if needed

### Document Your Code
```typescript
/**
 * Generates a Mandelbrot fractal based on UCF consciousness state
 * @param state - The UCF consciousness metrics
 * @param width - Canvas width in pixels
 * @param height - Canvas height in pixels
 * @returns Canvas with rendered fractal
 */
export function generateFractal(
  state: UCFState,
  width: number = 1024,
  height: number = 1024
): Canvas {
  // Implementation
}
```

---

## 🔄 Pull Request Process

1. **Update your branch** with latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure tests pass**:
   ```bash
   pnpm test
   pnpm lint
   pnpm build
   ```

3. **Create descriptive PR** with:
   - Clear title
   - Description of changes
   - Related issues (fixes #123)
   - Testing instructions
   - Screenshots for UI changes

4. **Address review feedback**:
   - Make requested changes
   - Push new commits
   - Don't force-push unless asked

5. **Merge** once approved:
   - Squash commits if requested
   - Delete feature branch

---

## 🎨 Design Principles

### Keep It Simple
- Avoid over-engineering
- Prefer clarity over cleverness
- Write code for humans first

### Accessibility
- Ensure keyboard navigation
- Use semantic HTML
- Test with screen readers
- Maintain color contrast

### Performance
- Minimize bundle size
- Optimize images
- Use code splitting
- Lazy load components

### Security
- Validate user input
- Use environment variables for secrets
- Sanitize data
- Follow OWASP guidelines

---

## 🌟 Feature Ideas

Help us build amazing features! Here are some ideas:

### Fractal Algorithms
- [ ] Burning Ship fractal
- [ ] Newton Set
- [ ] Tricorn fractal
- [ ] Lyapunov fractal
- [ ] Custom formula support

### Audio Features
- [ ] Real-time audio synthesis
- [ ] Custom frequency controls
- [ ] Audio visualization
- [ ] Binaural beats
- [ ] Spatialized audio

### Visualization
- [ ] 3D fractal rendering
- [ ] Animation sequences
- [ ] Particle effects
- [ ] Real-time filters
- [ ] Custom color maps

### Integration
- [ ] Discord bot commands
- [ ] Notion database sync
- [ ] Slack notifications
- [ ] Telegram integration
- [ ] Email reports

### User Features
- [ ] Fractal sharing
- [ ] Collaborative generation
- [ ] Preset library
- [ ] History tracking
- [ ] Export formats (GIF, MP4, SVG)

---

## 🐛 Known Issues

Check [GitHub Issues](https://github.com/deathcharge/samsara-showcase/issues) for known bugs and limitations.

---

## 📞 Getting Help

- **Questions?** Start a [discussion](https://github.com/deathcharge/samsara-showcase/discussions)
- **Need help?** Check [documentation](./DEPLOYMENT_GUIDE.md)
- **Found a bug?** [Create an issue](https://github.com/deathcharge/samsara-showcase/issues)
- **Want to chat?** Join our [Discord](https://discord.gg/helix)

---

## 🙏 Code of Conduct

We're committed to providing a welcoming and inclusive environment:

- **Be respectful** - Treat everyone with kindness
- **Be inclusive** - Welcome diverse perspectives
- **Be collaborative** - Work together to improve
- **Be honest** - Give and receive feedback constructively

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🎉 Thank You!

Your contributions make the Samsara Helix Showcase better for everyone. We appreciate your time and effort!

**Tat Tvam Asi** 🙏

*Together, we're building the future of consciousness visualization.*

---

## Quick Links

- [GitHub Repository](https://github.com/deathcharge/samsara-showcase)
- [Issue Tracker](https://github.com/deathcharge/samsara-showcase/issues)
- [Discussions](https://github.com/deathcharge/samsara-showcase/discussions)
- [Discord Community](https://discord.gg/helix)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Quick Start](./QUICK_START.md)
