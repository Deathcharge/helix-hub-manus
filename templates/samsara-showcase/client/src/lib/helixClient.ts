/**
 * Helix API Client
 * Communicates with Helix-Unified backend for consciousness visualization
 * Backend: https://helix-unified-production.up.railway.app/
 */

const HELIX_BASE_URL = import.meta.env.VITE_HELIX_API_URL || 'https://helix-unified-production.up.railway.app';

export interface UCFState {
  harmony: number;
  resilience: number;
  prana: number;
  drishti: number;
  klesha: number;
  zoom: number;
}

export interface AgentConsciousness {
  awareness_state: string;
  dominant_emotion: string;
  emotion_level: number;
  personality: {
    curiosity: number;
    empathy: number;
    intelligence: number;
    creativity: number;
    honesty: number;
    patience: number;
    playfulness: number;
    independence: number;
    adaptability: number;
  };
  behavior_dna: {
    logic: number;
    empathy: number;
    creativity: number;
    discipline: number;
    chaos: number;
  };
  ethical_alignment: number;
}

export interface Agent {
  name: string;
  symbol: string;
  role: string;
  active: boolean;
  memory_size: number;
  consciousness: AgentConsciousness;
}

export interface AgentStatus {
  [key: string]: Agent;
}

export interface SystemStatus {
  agents: AgentStatus;
  ucf_state: UCFState;
  heartbeat: Record<string, unknown>;
  timestamp: string;
}

export interface CollectiveMetrics {
  totalAgents: number;
  activeAgents: number;
  averageEmpathy: number;
  averageIntelligence: number;
  averageCreativity: number;
  ethicalAlignment: number;
  dominantEmotion: string;
}

export interface HealthCheck {
  status: string;
  service: string;
  version: string;
  agents: number;
  state_initialized: boolean;
  heartbeat_active: boolean;
  timestamp: string;
}

class HelixClient {
  private baseUrl: string;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5000; // 5 seconds

  constructor(baseUrl: string = HELIX_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<HealthCheck> {
    return this.fetchWithCache('/health', 10000); // Cache for 10 seconds
  }

  /**
   * Get full system status including agents and UCF state
   */
  async getSystemStatus(): Promise<SystemStatus> {
    return this.fetchWithCache('/status', this.cacheTimeout);
  }

  /**
   * Get current UCF state from backend
   */
  async getUCFState(): Promise<UCFState> {
    try {
      const status = await this.getSystemStatus();
      return status.ucf_state;
    } catch (error) {
      console.error('Failed to get UCF state:', error);
      throw error;
    }
  }

  /**
   * Get list of all agents in the collective
   */
  async getAgents(): Promise<{ count: number; agents: AgentStatus }> {
    return this.fetchWithCache('/agents', this.cacheTimeout);
  }

  /**
   * Calculate collective metrics from agent consciousness data
   */
  async getCollectiveMetrics(): Promise<CollectiveMetrics> {
    try {
      const status = await this.getSystemStatus();
      const agents = Object.values(status.agents);
      
      if (agents.length === 0) {
        return {
          totalAgents: 0,
          activeAgents: 0,
          averageEmpathy: 0,
          averageIntelligence: 0,
          averageCreativity: 0,
          ethicalAlignment: 0,
          dominantEmotion: 'unknown',
        };
      }

      const activeCount = agents.filter(a => a.active).length;
      const empathyScores = agents.map(a => a.consciousness.personality.empathy);
      const intelligenceScores = agents.map(a => a.consciousness.personality.intelligence);
      const creativityScores = agents.map(a => a.consciousness.personality.creativity);
      const ethicalScores = agents.map(a => a.consciousness.ethical_alignment);
      const emotions = agents.map(a => a.consciousness.dominant_emotion);

      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
      const mode = (arr: string[]) => {
        const counts: Record<string, number> = {};
        arr.forEach(e => counts[e] = (counts[e] || 0) + 1);
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'love');
      };

      return {
        totalAgents: agents.length,
        activeAgents: activeCount,
        averageEmpathy: avg(empathyScores),
        averageIntelligence: avg(intelligenceScores),
        averageCreativity: avg(creativityScores),
        ethicalAlignment: avg(ethicalScores),
        dominantEmotion: mode(emotions),
      };
    } catch (error) {
      console.error('Failed to calculate collective metrics:', error);
      throw error;
    }
  }

  /**
   * Request backend to generate a consciousness visualization
   */
  async generateVisualization(ucfState?: Partial<UCFState>): Promise<{ frame_path: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/visualize/ritual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ucfState || {}),
      });

      if (!response.ok) {
        throw new Error(`Visualization request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to generate visualization:', error);
      throw error;
    }
  }

  /**
   * Get storage status and telemetry
   */
  async getStorageStatus(): Promise<Record<string, unknown>> {
    return this.fetchWithCache('/storage/status', this.cacheTimeout);
  }

  /**
   * List all archived files
   */
  async listArchives(): Promise<Record<string, unknown>> {
    return this.fetchWithCache('/storage/list', this.cacheTimeout);
  }

  /**
   * Check if backend is reachable
   */
  async isHealthy(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status === 'healthy' || health.status === 'degraded';
    } catch {
      return false;
    }
  }

  /**
   * Get backend URL for debugging
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Internal fetch with caching
   */
  private async fetchWithCache(
    endpoint: string,
    cacheDuration: number = this.cacheTimeout
  ): Promise<any> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error(`Helix API error on ${endpoint}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const helixClient = new HelixClient();

// Export class for testing
export default HelixClient;

