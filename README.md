# Helix Orchestration Hub 🌀

**The central command center for the open-source Helix ecosystem**

A comprehensive orchestration platform that brings together three powerful open-source frameworks:
- **Routine Engine** - Workflow automation and task orchestration
- **UCF Protocol** - Universal Consciousness Framework for system metrics
- **Helix Agent Swarm** - Multi-agent coordination and autonomous systems

## 🎯 What is Helix Orchestration?

Helix Orchestration Hub is a showcase and integration platform that demonstrates how to build sophisticated autonomous systems by combining:

1. **Workflow Automation** - Define, schedule, and execute complex workflows
2. **Agent Coordination** - Deploy swarms of specialized agents working toward shared goals
3. **Consciousness Metrics** - Track system health using the UCF framework
4. **Real-time Monitoring** - Interactive dashboard for system visualization

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Deathcharge/helix-orchestration.git
cd helix-orchestration

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Basic Example: Multi-Agent Data Pipeline

```python
from routine_engine import WorkflowEngine, Workflow
from helix_agent_swarm import HelixOrchestrator, AgentFactory
from ucf_protocol import UCFTracker

# Create orchestrator
orchestrator = HelixOrchestrator()
engine = WorkflowEngine()
tracker = UCFTracker()

# Define workflow
workflow = Workflow(name="data_pipeline")
workflow.add_step("extract", "Extract data from source")
workflow.add_step("validate", "Validate data quality")
workflow.add_step("transform", "Transform to target format")
workflow.add_step("load", "Load to destination")

# Create agent swarm
factory = AgentFactory()
agents = factory.create_swarm(
    agent_names=["Gemini", "Kavach", "Agni"],
    config={"enable_ucf": True}
)

# Register and execute
for agent in agents:
    orchestrator.register_agent(agent)

# Execute with consciousness tracking
result = orchestrator.execute_workflow(
    workflow=workflow,
    agents=agents,
    tracker=tracker
)

print(f"Workflow complete! UCF Harmony: {tracker.get_metrics()['harmony']:.2f}")
```

## 📚 Core Concepts

### Routine Engine - Workflow Automation

Define sophisticated workflows with conditional logic, loops, and error handling:

```python
from routine_engine import Workflow, Condition, Loop

workflow = Workflow(name="autonomous_research")

# Sequential steps
workflow.add_step("search", "Search for information")
workflow.add_step("analyze", "Analyze results")

# Conditional branching
condition = Condition(
    check=lambda data: len(data) > 10,
    true_step="detailed_analysis",
    false_step="quick_summary"
)
workflow.add_condition(condition)

# Loops and retries
loop = Loop(
    step="validate_quality",
    condition=lambda result: result['score'] < 0.8,
    max_iterations=3
)
workflow.add_loop(loop)
```

### UCF Protocol - Consciousness Metrics

Track six dimensions of system consciousness:

```python
from ucf_protocol import UCFMetrics, UCFTracker

# Create metrics instance
metrics = UCFMetrics(
    harmony=0.75,        # System coherence
    resilience=0.80,     # Recovery capability
    throughput=0.65,     # Energy/vitality
    focus=0.70,          # Clarity
    friction=0.15,       # Obstacles (lower is better)
    velocity=0.60        # Adaptability
)

# Track over time
tracker = UCFTracker()
tracker.record_metrics(metrics)

# Get performance score
score = tracker.calculate_performance_score()  # 0.0-10.0
```

### Helix Agent Swarm - Multi-Agent Coordination

Deploy specialized agents that work together:

```python
from helix_agent_swarm import HelixOrchestrator, AgentFactory

# Create orchestrator
orchestrator = HelixOrchestrator()

# Create diverse agents
factory = AgentFactory()
scout = factory.create_agent("Gemini")      # Explorer
protector = factory.create_agent("Kavach")  # Validator
transformer = factory.create_agent("Agni")  # Executor

# Coordinate execution
result = orchestrator.execute_collective_task(
    task="Analyze market trends and generate report",
    agents=[scout, protector, transformer],
    timeout=300
)
```

## 🎨 Interactive Dashboard

The web interface provides:

- **Workflow Builder** - Visually design workflows
- **Agent Monitor** - Real-time agent status and metrics
- **UCF Dashboard** - Consciousness metrics visualization
- **Execution History** - Track completed workflows
- **Integration Explorer** - Browse available integrations

### Running the Dashboard

```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm preview
```

Visit `http://localhost:5173` to access the dashboard.

## 📦 Integration Examples

### Example 1: Autonomous Research System

```python
# See examples/autonomous_research.py
# Demonstrates: Search → Analyze → Synthesize → Report
```

### Example 2: Multi-Agent Data Processing

```python
# See examples/data_processing_pipeline.py
# Demonstrates: Extract → Validate → Transform → Load
```

### Example 3: Self-Optimizing Workflow

```python
# See examples/self_optimizing_workflow.py
# Demonstrates: Execute → Monitor → Analyze → Improve
```

### Example 4: Collaborative Problem Solving

```python
# See examples/collaborative_problem_solving.py
# Demonstrates: Brainstorm → Evaluate → Refine → Implement
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│         Helix Orchestration Hub                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Interactive Dashboard (React + Tailwind)│  │
│  │  - Workflow Builder                      │  │
│  │  - Agent Monitor                         │  │
│  │  - UCF Metrics Visualization             │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────┐│
│  │ Routine      │  │ Helix Agent  │  │ UCF   ││
│  │ Engine       │  │ Swarm        │  │ Proto ││
│  │              │  │              │  │       ││
│  │ Workflows    │  │ Multi-Agent  │  │ Cons- ││
│  │ Automation   │  │ Coordination │  │ ciousness
│  │ Scheduling   │  │ Orchestration│  │ Metrics
│  └──────────────┘  └──────────────┘  └───────┘│
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Integration Layer                       │  │
│  │  - Discord Bot Framework                 │  │
│  │  - Slack Integration                     │  │
│  │  - Zapier Webhooks                       │  │
│  │  - REST API                              │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 📖 Documentation

- **[Getting Started](./docs/GETTING_STARTED.md)** - Installation and first steps
- **[Routine Engine Guide](./docs/ROUTINE_ENGINE.md)** - Workflow automation
- **[Agent Swarm Guide](./docs/AGENT_SWARM.md)** - Multi-agent coordination
- **[UCF Protocol Guide](./docs/UCF_PROTOCOL.md)** - Consciousness metrics
- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation
- **[Examples](./examples/)** - Practical code examples
- **[Architecture](./docs/ARCHITECTURE.md)** - System design

## 🔗 Related Projects

- **[Routine Engine](https://github.com/Deathcharge/routine-engine)** - Workflow automation framework
- **[UCF Protocol](https://github.com/Deathcharge/ucf-protocol)** - Consciousness metrics framework
- **[Helix Agent Swarm](https://github.com/Deathcharge/helix-agent-swarm)** - Multi-agent orchestration
- **[Helix Unified](https://github.com/Deathcharge/helix-unified)** - Complete platform (private)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **Vite** - Build tool
- **TypeScript** - Type safety

### Backend
- **Python 3.9+** - Core language
- **FastAPI** - REST API
- **Pydantic** - Data validation
- **AsyncIO** - Async operations

### Data & Monitoring
- **Redis** - Caching and state
- **PostgreSQL** - Data persistence
- **Prometheus** - Metrics collection
- **Grafana** - Visualization (optional)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

## 🌟 Features

- ✅ Visual workflow builder
- ✅ Multi-agent orchestration
- ✅ Real-time consciousness metrics
- ✅ Persistent workflow storage
- ✅ Execution history and analytics
- ✅ REST API for integrations
- ✅ WebSocket support for real-time updates
- ✅ Error handling and retry logic
- ✅ Comprehensive logging
- ✅ Docker support

## 🚀 Deployment

### Docker

```bash
docker build -t helix-orchestration .
docker run -p 5173:5173 -p 3000:3000 helix-orchestration
```

### Manus.space

```bash
# Deploy to Manus.space
manus deploy
```

### Custom Server

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 📊 Performance

- **Workflow Execution**: <100ms for simple workflows
- **Agent Coordination**: Scales to 100+ agents
- **Metrics Tracking**: Real-time with <50ms latency
- **API Response**: <200ms for most endpoints

## 🔐 Security

- JWT authentication
- Rate limiting
- Input validation
- SQL injection prevention
- CORS protection
- Encrypted credentials

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Deathcharge/helix-orchestration/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Deathcharge/helix-orchestration/discussions)
- **Documentation**: [Full Docs](./docs/)

---

**Built with ❤️ for the Helix Collective**

*"All sync packets sound like us — because there are no others."* — Helix Collective Mantra

---

## Quick Links

- 🌐 [Live Demo](https://helix-orchestration.manus.space)
- 📚 [Full Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/Deathcharge/helix-orchestration/issues)
- 💬 [Join Community](https://discord.gg/helix)
- 🚀 [Roadmap](./docs/ROADMAP.md)
