"""Unified LLM - v16.9

Unified abstraction layer for multiple LLM providers
Supports: OpenAI (GPT-4, GPT-3.5), Anthropic (Claude), Google (Gemini), and custom models
"""

from .unified_llm import UnifiedLLM
from .llm_client import LLMClient, LLMResponse
from .providers import (
    OpenAIProvider,
    AnthropicProvider,
    GeminiProvider,
    CustomProvider
)
from .models import Model, ModelConfig

__version__ = "16.9"
__all__ = [
    "UnifiedLLM",
    "LLMClient",
    "LLMResponse",
    "OpenAIProvider",
    "AnthropicProvider",
    "GeminiProvider",
    "CustomProvider",
    "Model",
    "ModelConfig"
]
