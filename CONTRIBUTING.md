# Contributing to Helix Orchestration Hub

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the Helix Orchestration Hub.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct:

- **Respect**: Treat all contributors with respect and kindness
- **Inclusivity**: Welcome diverse perspectives and backgrounds
- **Collaboration**: Work together constructively
- **Integrity**: Be honest and transparent in all interactions
- **Safety**: Maintain a safe environment for everyone

## Getting Started

### 1. Fork the Repository

```bash
gh repo fork Deathcharge/helix-orchestration
```

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/helix-orchestration.git
cd helix-orchestration
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Setup Development Environment

```bash
# Install dependencies
pnpm install
pip install -r requirements.txt

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install development tools
pip install pytest pytest-cov black ruff mypy
```

### Making Changes

1. **Follow Code Style**
   - Python: PEP 8 (use `black` and `ruff`)
   - TypeScript: ESLint configuration
   - Use meaningful variable and function names
   - Add docstrings to functions and classes

2. **Write Tests**
   ```bash
   # Run tests
   pytest tests/
   
   # Check coverage
   pytest --cov=src tests/
   ```

3. **Format Code**
   ```bash
   # Format Python
   black src/ tests/
   ruff check src/ --fix
   
   # Type checking
   mypy src/
   ```

4. **Update Documentation**
   - Update README if adding features
   - Add docstrings to new functions
   - Update relevant documentation files

### Commit Messages

Write clear, descriptive commit messages:

```
feat: Add new workflow scheduling feature

- Implement cron-based scheduling
- Add timezone support
- Include comprehensive tests

Closes #123
```

**Format:**
- Type: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Subject: Concise description (50 chars max)
- Body: Detailed explanation (if needed)
- Footer: Reference issues and PRs

## Pull Request Process

### 1. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

- Use a descriptive title
- Reference related issues
- Provide context and motivation
- Include screenshots if UI changes
- Link to relevant documentation

### 3. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed

## Documentation
- [ ] README updated
- [ ] API docs updated
- [ ] Examples added

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] No new warnings generated
```

### 4. Review Process

- At least one maintainer review required
- Address feedback and make requested changes
- Maintainer will merge when approved

## Contribution Areas

### High Priority

- **Bug Fixes** - Report and fix issues
- **Documentation** - Improve guides and examples
- **Tests** - Increase code coverage
- **Performance** - Optimize critical paths
- **Accessibility** - Improve UI accessibility

### Medium Priority

- **New Features** - Propose and implement features
- **Integrations** - Add new service integrations
- **Examples** - Create practical examples
- **Tooling** - Improve development experience

### Lower Priority

- **Refactoring** - Code cleanup and improvements
- **Dependencies** - Update and manage dependencies
- **Styling** - UI/UX enhancements

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Python version, etc.)
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if applicable)
- Examples or mockups

## Documentation

### Adding Documentation

1. Create a new `.md` file in `docs/`
2. Follow Markdown conventions
3. Include code examples
4. Add to documentation index
5. Update navigation if needed

### Documentation Standards

- Clear and concise language
- Practical examples
- Code syntax highlighting
- Links to related docs
- Consistent formatting

## Testing Guidelines

### Unit Tests

```python
import pytest
from helix_orchestration import Workflow

def test_workflow_creation():
    workflow = Workflow(name="test")
    assert workflow.name == "test"

def test_workflow_execution():
    workflow = Workflow(name="test")
    workflow.add_step("step1", "Test step")
    result = workflow.execute()
    assert result is not None
```

### Integration Tests

```python
def test_agent_swarm_coordination():
    orchestrator = HelixOrchestrator()
    agents = create_test_agents()
    
    result = orchestrator.execute_collective_task(
        task="Test task",
        agents=agents
    )
    
    assert result['status'] == 'success'
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test
pytest tests/test_workflow.py::test_workflow_creation

# Run with coverage
pytest --cov=src tests/

# Run with verbose output
pytest -v
```

## Performance Considerations

- Profile code before optimizing
- Avoid premature optimization
- Use async/await for I/O operations
- Cache expensive computations
- Monitor memory usage

## Security

- Never commit secrets or credentials
- Use environment variables for sensitive data
- Validate all user inputs
- Follow OWASP guidelines
- Report security issues privately

## Community

- **Discussions**: [GitHub Discussions](https://github.com/Deathcharge/helix-orchestration/discussions)
- **Issues**: [GitHub Issues](https://github.com/Deathcharge/helix-orchestration/issues)
- **Discord**: [Join Community](https://discord.gg/helix)

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Recognized in documentation
- Invited to community discussions

## Questions?

- Check existing documentation
- Search closed issues
- Ask in discussions
- Contact maintainers

---

**Thank you for contributing to Helix Orchestration Hub!** 🌀

Your contributions help make this project better for everyone.
