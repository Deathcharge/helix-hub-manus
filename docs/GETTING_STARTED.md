# Getting Started with Helix Orchestration

Welcome to the Helix Orchestration Hub! This guide will help you get up and running in minutes.

## Prerequisites

- **Python 3.9+** - For backend and agent frameworks
- **Node.js 18+** - For frontend development
- **pnpm** - Package manager (or npm/yarn)
- **Git** - Version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Deathcharge/helix-orchestration.git
cd helix-orchestration
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
pnpm install

# Install Python dependencies (in a virtual environment)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Frontend
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000

# Backend
DATABASE_URL=sqlite:///./helix.db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
LOG_LEVEL=INFO
```

### 4. Start Development Servers

```bash
# Terminal 1: Frontend (React)
pnpm dev

# Terminal 2: Backend (Python/FastAPI)
python -m uvicorn server.main:app --reload --port 3000
```

Visit `http://localhost:5173` to access the dashboard.

## Your First Workflow

### Step 1: Create a Simple Workflow

Create `my_first_workflow.py`:

```python
from routine_engine import Workflow

# Create a workflow
workflow = Workflow(name="hello_world")

# Add steps
workflow.add_step("greet", "Say hello", action=lambda: "Hello, Helix!")
workflow.add_step("process", "Process greeting", action=lambda data: data.upper())
workflow.add_step("output", "Output result", action=lambda data: print(data))

# Execute
result = workflow.execute()
print(f"Result: {result}")
```

### Step 2: Run the Workflow

```bash
python my_first_workflow.py
```

Expected output:
```
HELLO, HELIX!
```

## Your First Agent Swarm

### Step 1: Create Agents

Create `my_first_swarm.py`:

```python
from helix_agent_swarm import HelixOrchestrator, AgentFactory

# Create orchestrator
orchestrator = HelixOrchestrator()

# Create agents
factory = AgentFactory()
agents = factory.create_swarm(
    agent_names=["Gemini", "Kavach"],
    config={"enable_ucf": True}
)

# Register agents
for agent in agents:
    orchestrator.register_agent(agent)

# Execute a task
result = orchestrator.execute_collective_task(
    task="Analyze this data and provide insights",
    agents=agents,
    timeout=30
)

print(f"Task complete: {result}")
```

### Step 2: Run the Swarm

```bash
python my_first_swarm.py
```

## Monitoring with UCF Metrics

### Track Consciousness State

Create `track_metrics.py`:

```python
from ucf_protocol import UCFTracker, UCFMetrics

# Create tracker
tracker = UCFTracker()

# Record metrics
metrics = UCFMetrics(
    harmony=0.75,
    resilience=0.80,
    throughput=0.65,
    focus=0.70,
    friction=0.15,
    velocity=0.60
)

tracker.record_metrics(metrics)

# Get performance score
score = tracker.calculate_performance_score()
print(f"Performance Score: {score:.1f}/10")

# Get state classification
state = tracker.classify_state()
print(f"System State: {state}")
```

## Using the Dashboard

### 1. Access the Dashboard

Open `http://localhost:5173` in your browser.

### 2. Create a Workflow

1. Click **"New Workflow"**
2. Name it (e.g., "My First Workflow")
3. Add steps by clicking **"Add Step"**
4. Configure each step with:
   - **Name**: Step identifier
   - **Description**: What the step does
   - **Action**: Python code or integration
5. Click **"Save"**

### 3. Execute a Workflow

1. Select a workflow from the list
2. Click **"Execute"**
3. Monitor execution in real-time
4. View results and metrics

### 4. Monitor Agents

1. Go to **"Agents"** tab
2. See all registered agents
3. View their status and metrics
4. Execute agent tasks

### 5. View Metrics

1. Go to **"Metrics"** tab
2. See real-time UCF consciousness metrics
3. View historical trends
4. Export data

## Common Tasks

### Schedule a Workflow

```python
from routine_engine import Scheduler

scheduler = Scheduler()
scheduler.schedule_workflow(
    workflow=workflow,
    schedule="0 9 * * *",  # Every day at 9 AM
    timezone="America/New_York"
)
```

### Add Error Handling

```python
from routine_engine import Workflow, ErrorHandler

workflow = Workflow(name="robust_workflow")
workflow.add_step("risky_step", "Do something risky")

# Add error handler
error_handler = ErrorHandler(
    on_error=lambda error: print(f"Error: {error}"),
    retry_count=3,
    retry_delay=5
)
workflow.set_error_handler(error_handler)
```

### Integrate with External APIs

```python
from routine_engine import Integration

# Add API integration
workflow.add_integration(
    name="slack",
    config={
        "webhook_url": "https://hooks.slack.com/...",
        "channel": "#automation"
    }
)

# Use in workflow
workflow.add_step(
    "notify",
    "Send Slack notification",
    action=lambda: workflow.integrations['slack'].send("Task complete!")
)
```

## Next Steps

1. **Explore Examples** - Check out `examples/` directory
2. **Read Full Documentation** - See `docs/` for detailed guides
3. **Join Community** - Connect with other users
4. **Build Something** - Create your first automation!

## Troubleshooting

### Port Already in Use

```bash
# Change frontend port
pnpm dev -- --port 5174

# Change backend port
python -m uvicorn server.main:app --port 3001
```

### Database Issues

```bash
# Reset database
rm helix.db
python -m alembic upgrade head
```

### Module Not Found

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
pnpm install --force
```

## Getting Help

- 📚 [Full Documentation](../docs/)
- 🐛 [Report Issues](https://github.com/Deathcharge/helix-orchestration/issues)
- 💬 [Discussions](https://github.com/Deathcharge/helix-orchestration/discussions)
- 🌐 [Community Discord](https://discord.gg/helix)

---

**Happy orchestrating!** 🚀
