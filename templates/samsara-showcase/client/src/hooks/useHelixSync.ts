/**
 * useHelixSync Hook
 * Real-time synchronization with Helix backend consciousness state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { helixClient, type UCFState, type CollectiveMetrics, type SystemStatus } from '@/lib/helixClient';

export interface UseHelixSyncOptions {
  enabled?: boolean;
  pollInterval?: number; // milliseconds
  onError?: (error: Error) => void;
}

export function useHelixSync(options: UseHelixSyncOptions = {}) {
  const {
    enabled = true,
    pollInterval = 5000, // 5 seconds default
    onError,
  } = options;

  const [ucfState, setUCFState] = useState<UCFState | null>(null);
  const [metrics, setMetrics] = useState<CollectiveMetrics | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data from Helix backend
  const syncData = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch system status (includes UCF state and agents)
      const status = await helixClient.getSystemStatus();
      setSystemStatus(status);
      setUCFState(status.ucf_state);

      // Calculate collective metrics
      const collectiveMetrics = await helixClient.getCollectiveMetrics();
      setMetrics(collectiveMetrics);

      setIsConnected(true);
      setLastUpdate(new Date());
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsConnected(false);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, onError]);

  // Set up polling
  useEffect(() => {
    if (!enabled) return;

    // Initial sync
    syncData();

    // Set up interval for continuous polling
    pollIntervalRef.current = setInterval(syncData, pollInterval);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [enabled, pollInterval, syncData]);

  // Manual refresh
  const refresh = useCallback(async () => {
    await syncData();
  }, [syncData]);

  // Stop syncing
  const stop = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  return {
    ucfState,
    metrics,
    systemStatus,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refresh,
    stop,
  };
}

