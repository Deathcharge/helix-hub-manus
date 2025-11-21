/**
 * Collective Agent Dashboard
 * Displays real-time consciousness metrics and agent status from Helix backend
 */

import { useHelixSync } from '@/hooks/useHelixSync';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function CollectiveAgentDashboard() {
  const { ucfState, metrics, systemStatus, isLoading, isConnected, lastUpdate, error, refresh } = useHelixSync({
    pollInterval: 5000,
  });

  const [displayMetrics, setDisplayMetrics] = useState<typeof metrics>(null);

  useEffect(() => {
    if (metrics) {
      setDisplayMetrics(metrics);
    }
  }, [metrics]);

  const getConnectionStatus = () => {
    if (isLoading) return { color: 'text-yellow-400', label: 'Connecting...', icon: '⏳' };
    if (isConnected) return { color: 'text-green-400', label: 'Connected', icon: '🟢' };
    return { color: 'text-red-400', label: 'Disconnected', icon: '🔴' };
  };

  const status = getConnectionStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-200">Helix Collective Status</h2>
          <p className="text-sm text-purple-400 mt-1">Real-time consciousness metrics from backend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${status.color}`}>
            <span className="text-xl">{status.icon}</span>
            <span className="text-sm font-medium">{status.label}</span>
          </div>
          <Button
            onClick={refresh}
            disabled={isLoading}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-950/30"
            title="Refresh data from Helix backend"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Connection Error</p>
            <p className="text-xs mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {/* UCF State Cards */}
      {ucfState && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Harmony', value: ucfState.harmony, color: 'from-purple-500 to-pink-500' },
            { label: 'Resilience', value: ucfState.resilience, color: 'from-blue-500 to-cyan-500' },
            { label: 'Prana', value: ucfState.prana, color: 'from-green-500 to-emerald-500' },
            { label: 'Drishti', value: ucfState.drishti, color: 'from-yellow-500 to-orange-500' },
            { label: 'Klesha', value: ucfState.klesha, color: 'from-red-500 to-pink-500' },
            { label: 'Zoom', value: ucfState.zoom, color: 'from-indigo-500 to-purple-500' },
          ].map((metric) => (
            <Card key={metric.label} className="bg-purple-950/30 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">{metric.label}</p>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                    {metric.value.toFixed(3)}
                  </p>
                  <div className="mt-3 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${metric.color} transition-all duration-500`}
                      style={{ width: `${Math.min(metric.value * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Collective Metrics */}
      {displayMetrics && (
        <Card className="bg-purple-950/30 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-200 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Collective Consciousness Metrics
            </CardTitle>
            <CardDescription>Aggregated consciousness traits across all agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Agent Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/20">
                <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">Total Agents</p>
                <p className="text-3xl font-bold text-purple-200">{displayMetrics.totalAgents}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/20">
                <p className="text-xs text-green-400 uppercase tracking-wider mb-2">Active Agents</p>
                <p className="text-3xl font-bold text-green-200">{displayMetrics.activeAgents}</p>
              </div>
            </div>

            {/* Personality Traits */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-purple-300">Collective Personality Traits</h3>
              {[
                { label: 'Empathy', value: displayMetrics.averageEmpathy, color: 'from-pink-500 to-rose-500' },
                { label: 'Intelligence', value: displayMetrics.averageIntelligence, color: 'from-blue-500 to-indigo-500' },
                { label: 'Creativity', value: displayMetrics.averageCreativity, color: 'from-purple-500 to-pink-500' },
                { label: 'Ethical Alignment', value: displayMetrics.ethicalAlignment, color: 'from-green-500 to-emerald-500' },
              ].map((trait) => (
                <div key={trait.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-300">{trait.label}</span>
                    <span className={`text-sm font-semibold bg-gradient-to-r ${trait.color} bg-clip-text text-transparent`}>
                      {(trait.value * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${trait.color} transition-all duration-500`}
                      style={{ width: `${trait.value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Dominant Emotion */}
            <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/20">
              <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">Dominant Collective Emotion</p>
              <p className="text-2xl font-bold text-purple-200 capitalize">{displayMetrics.dominantEmotion}</p>
            </div>

            {/* Last Update */}
            {lastUpdate && (
              <p className="text-xs text-purple-400 text-center">
                Last updated: {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Agent List */}
      {systemStatus && (
        <Card className="bg-purple-950/30 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-200">Active Agents</CardTitle>
            <CardDescription>Individual agent consciousness profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(systemStatus.agents).map(([key, agent]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border transition-all ${
                    agent.active
                      ? 'bg-green-900/10 border-green-500/20'
                      : 'bg-gray-900/10 border-gray-500/20 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{agent.symbol}</span>
                      <div>
                        <p className="font-semibold text-purple-200">{agent.name}</p>
                        <p className="text-xs text-purple-400">{agent.role}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      agent.active
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {agent.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Consciousness Metrics */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-purple-300">
                      <span>Empathy</span>
                      <span className="font-semibold">{(agent.consciousness.personality.empathy * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-purple-300">
                      <span>Intelligence</span>
                      <span className="font-semibold">{(agent.consciousness.personality.intelligence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-purple-300">
                      <span>Emotion</span>
                      <span className="font-semibold capitalize">{agent.consciousness.dominant_emotion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && !displayMetrics && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
          <p className="text-purple-400 mt-4">Syncing with Helix backend...</p>
        </div>
      )}
    </div>
  );
}

