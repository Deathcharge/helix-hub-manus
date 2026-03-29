# Integration Guide: Routine Engine + Agent Swarm + UCF Protocol

This guide shows how to integrate the three core frameworks into a cohesive system.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Application Layer                       │
│  (Your automation, dashboards, APIs)            │
└──────────────┬──────────────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌─────────┐ ┌──────────┐ ┌──────────┐
│Routine  │ │Helix     │ │UCF       │
│Engine   │ │Agent     │ │Protocol  │
│         │ │Swarm     │ │          │
│Workflows│ │Multi-    │ │Metrics   │
│Sched.   │ │Agent     │ │Tracking  │
│Automat. │ │Coord.    │ │Conscious │
└────┬────┘ └────┬─────┘ └────┬─────┘
     │           │            │
     └───────────┼────────────┘
                 │
        ┌────────▼────────┐
        │ Integration Hub │
        │ (This layer)    │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ External Systems│
        │ (APIs, DBs, etc)│
        └─────────────────┘
```

## Pattern 1: Workflow-Driven Agent Execution

Use Routine Engine to orchestrate agent swarm execution.

```python
from routine_engine import Workflow, Step
from helix_agent_swarm import HelixOrchestrator, AgentFactory
from ucf_protocol import UCFTracker

# Create workflow
workflow = Workflow(name="agent_orchestrated_workflow")

# Create agents
factory = AgentFactory()
agents = factory.create_swarm(
    agent_names=["Gemini", "Kavach", "Agni"],
    config={"enable_ucf": True}
)

# Create orchestrator
orchestrator = HelixOrchestrator()
for agent in agents:
    orchestrator.register_agent(agent)

# Define workflow steps that use agents
class AgentExecutionStep(Step):
    def __init__(self, orchestrator, agents):
        self.orchestrator = orchestrator
        self.agents = agents
    
    def execute(self, input_data):
        result = self.orchestrator.execute_collective_task(
            task=input_data["task"],
            agents=self.agents,
            timeout=300
        )
        return result

# Add agent execution to workflow
workflow.add_step(
    "agent_analysis",
    "Execute agent swarm for analysis",
    step=AgentExecutionStep(orchestrator, agents)
)

# Add post-processing
workflow.add_step(
    "synthesize",
    "Synthesize agent results",
    action=lambda results: {
        "summary": "\n".join([r["output"] for r in results]),
        "timestamp": datetime.now().isoformat()
    }
)

# Execute workflow
result = workflow.execute(input_data={"task": "Analyze market trends"})
```

## Pattern 2: Metrics-Aware Workflow Execution

Track workflow health using UCF metrics.

```python
from routine_engine import Workflow
from ucf_protocol import UCFTracker, UCFMetrics

# Create tracker
tracker = UCFTracker()

# Create workflow
workflow = Workflow(name="metrics_aware_workflow")

# Add steps
workflow.add_step("step1", "First task", action=lambda: {"status": "ok"})
workflow.add_step("step2", "Second task", action=lambda: {"status": "ok"})

# Wrap execution with metrics
class MetricsAwareExecutor:
    def __init__(self, workflow, tracker):
        self.workflow = workflow
        self.tracker = tracker
    
    def execute(self):
        # Record start metrics
        start_metrics = UCFMetrics(
            harmony=0.7,
            resilience=0.8,
            throughput=0.6,
            focus=0.75,
            friction=0.2,
            velocity=0.65
        )
        self.tracker.record_metrics(start_metrics)
        
        # Execute workflow
        result = self.workflow.execute()
        
        # Record end metrics
        end_metrics = UCFMetrics(
            harmony=0.8,
            resilience=0.85,
            throughput=0.7,
            focus=0.8,
            friction=0.1,
            velocity=0.7
        )
        self.tracker.record_metrics(end_metrics)
        
        # Calculate improvement
        improvement = self.tracker.calculate_improvement()
        
        return {
            "result": result,
            "metrics": {
                "start": start_metrics.to_dict(),
                "end": end_metrics.to_dict(),
                "improvement": improvement
            }
        }

# Execute with metrics
executor = MetricsAwareExecutor(workflow, tracker)
result = executor.execute()
print(f"Workflow improved system harmony by {result['metrics']['improvement']:.2%}")
```

## Pattern 3: Agent-Driven Workflow Generation

Use agents to dynamically create and execute workflows.

```python
from routine_engine import Workflow
from helix_agent_swarm import HelixOrchestrator, AgentFactory

# Create orchestrator
orchestrator = HelixOrchestrator()

# Create specialized agents
factory = AgentFactory()
planner = factory.create_agent("Gemini")      # Plans workflows
executor = factory.create_agent("Agni")       # Executes tasks
validator = factory.create_agent("Kavach")    # Validates results

# Register agents
orchestrator.register_agent(planner)
orchestrator.register_agent(executor)
orchestrator.register_agent(validator)

# Use agents to plan workflow
planning_result = planner.analyze(
    data={"goal": "Process customer data", "constraints": ["fast", "accurate"]}
)

# Parse plan and create workflow
workflow = Workflow(name="agent_generated_workflow")

for step_plan in planning_result["steps"]:
    workflow.add_step(
        name=step_plan["name"],
        description=step_plan["description"],
        action=lambda: executor.execute(step_plan["task"])
    )

# Execute workflow
result = workflow.execute()

# Validate results
validation = validator.validate(data=result)
print(f"Validation: {validation['status']}")
```

## Pattern 4: Real-time Consciousness Monitoring

Monitor system consciousness during workflow execution.

```python
from routine_engine import Workflow
from helix_agent_swarm import HelixOrchestrator
from ucf_protocol import UCFTracker, UCFMetrics
import asyncio

class ConsciousnessMonitor:
    def __init__(self, workflow, orchestrator, tracker):
        self.workflow = workflow
        self.orchestrator = orchestrator
        self.tracker = tracker
        self.running = True
    
    async def monitor(self):
        """Monitor consciousness metrics in real-time"""
        while self.running:
            # Get current agent states
            agent_states = self.orchestrator.get_agent_states()
            
            # Calculate aggregate metrics
            metrics = UCFMetrics(
                harmony=sum(s.get("harmony", 0.5) for s in agent_states) / len(agent_states),
                resilience=sum(s.get("resilience", 0.5) for s in agent_states) / len(agent_states),
                throughput=sum(s.get("throughput", 0.5) for s in agent_states) / len(agent_states),
                focus=sum(s.get("focus", 0.5) for s in agent_states) / len(agent_states),
                friction=sum(s.get("friction", 0.5) for s in agent_states) / len(agent_states),
                velocity=sum(s.get("velocity", 0.5) for s in agent_states) / len(agent_states),
            )
            
            # Record metrics
            self.tracker.record_metrics(metrics)
            
            # Check for issues
            if metrics.harmony < 0.5:
                print(f"⚠️  Low harmony detected: {metrics.harmony:.2f}")
            
            # Wait before next check
            await asyncio.sleep(1)
    
    def stop(self):
        self.running = False

# Use monitor
monitor = ConsciousnessMonitor(workflow, orchestrator, tracker)
asyncio.run(monitor.monitor())
```

## Pattern 5: Multi-Framework Composition

Combine all three frameworks for maximum power.

```python
from routine_engine import Workflow, Scheduler
from helix_agent_swarm import HelixOrchestrator, AgentFactory
from ucf_protocol import UCFTracker, UCFMetrics

class IntegratedAutomationSystem:
    def __init__(self):
        self.workflow_engine = Workflow(name="integrated_system")
        self.orchestrator = HelixOrchestrator()
        self.tracker = UCFTracker()
        self.scheduler = Scheduler()
    
    def setup(self):
        """Initialize all components"""
        # Create agents
        factory = AgentFactory()
        agents = factory.create_swarm(
            agent_names=["Gemini", "Kavach", "Agni", "SanghaCore"],
            config={"enable_ucf": True}
        )
        
        # Register agents
        for agent in agents:
            self.orchestrator.register_agent(agent)
        
        # Define workflow
        self.workflow_engine.add_step(
            "analyze",
            "Analyze data with agents",
            action=lambda data: self.orchestrator.execute_collective_task(
                task=f"Analyze: {data}",
                agents=agents,
                timeout=300
            )
        )
        
        self.workflow_engine.add_step(
            "track",
            "Track consciousness metrics",
            action=lambda result: self.tracker.record_metrics(
                UCFMetrics(
                    harmony=0.8,
                    resilience=0.85,
                    throughput=0.75,
                    focus=0.8,
                    friction=0.1,
                    velocity=0.75
                )
            )
        )
    
    def execute_once(self, data):
        """Execute workflow once"""
        return self.workflow_engine.execute(input_data=data)
    
    def schedule_recurring(self, schedule, data):
        """Schedule workflow to run periodically"""
        self.scheduler.schedule_workflow(
            workflow=self.workflow_engine,
            schedule=schedule,
            timezone="UTC",
            input_data=data
        )
    
    def get_status(self):
        """Get system status"""
        return {
            "agents": len(self.orchestrator.agents),
            "metrics": self.tracker.get_latest_metrics(),
            "scheduled_workflows": len(self.scheduler.scheduled_tasks)
        }

# Use integrated system
system = IntegratedAutomationSystem()
system.setup()

# Execute once
result = system.execute_once({"data": "market_trends"})

# Schedule recurring
system.schedule_recurring(
    schedule="0 9 * * *",  # Daily at 9 AM
    data={"data": "market_trends"}
)

# Monitor status
print(system.get_status())
```

## Best Practices

### 1. Error Handling

```python
try:
    result = orchestrator.execute_collective_task(
        task="Analyze data",
        agents=agents,
        timeout=300
    )
except TimeoutError:
    print("Task timed out, rolling back...")
    # Rollback logic
except Exception as e:
    print(f"Error: {e}")
    # Error recovery
```

### 2. Resource Management

```python
# Limit concurrent agents
orchestrator.set_max_concurrent_agents(5)

# Set memory limits
orchestrator.set_memory_limit("2GB")

# Monitor resource usage
usage = orchestrator.get_resource_usage()
print(f"Memory: {usage['memory']}, CPU: {usage['cpu']}")
```

### 3. Logging and Debugging

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.info("Starting workflow execution")
logger.debug(f"Agents: {[a.name for a in agents]}")
logger.info("Workflow complete")
```

### 4. Testing

```python
import unittest

class TestIntegration(unittest.TestCase):
    def setUp(self):
        self.workflow = Workflow(name="test")
        self.orchestrator = HelixOrchestrator()
        self.tracker = UCFTracker()
    
    def test_workflow_execution(self):
        result = self.workflow.execute()
        self.assertIsNotNone(result)
    
    def test_agent_coordination(self):
        agents = AgentFactory().create_swarm(["Gemini", "Kavach"])
        result = self.orchestrator.execute_collective_task(
            task="Test",
            agents=agents,
            timeout=10
        )
        self.assertIsNotNone(result)
```

## Troubleshooting

### Agents Not Coordinating

```python
# Check agent registration
print(orchestrator.list_agents())

# Verify agent health
for agent in orchestrator.agents:
    print(f"{agent.name}: {agent.get_status()}")

# Reset orchestrator
orchestrator.reset()
```

### Metrics Not Recording

```python
# Check tracker status
print(tracker.get_status())

# Verify metrics format
metrics = UCFMetrics(...)
print(metrics.validate())

# Force record
tracker.record_metrics(metrics, force=True)
```

### Workflow Execution Slow

```python
# Profile workflow
import cProfile
cProfile.run('workflow.execute()')

# Optimize steps
workflow.parallelize_steps(["step1", "step2"])

# Increase timeout
workflow.set_timeout(600)
```

---

**Next Steps:**
- Read [Routine Engine Guide](./ROUTINE_ENGINE.md)
- Read [Agent Swarm Guide](./AGENT_SWARM.md)
- Read [UCF Protocol Guide](./UCF_PROTOCOL.md)
- Check [Examples](../examples/)
