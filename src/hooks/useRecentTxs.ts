'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RecentTx {
  id: string;
  txHash: string;
  blockNumber: number;
  from: string;
  to: string;
  amount: string;
  direction: 'in' | 'out';
  symbol: string;
  timestamp: number; // when it was added to recent
}

const STORAGE_KEY = 'txgoat_recent_txs';
const MAX_TXS = 20;

export function useRecentTxs() {
  const [txs, setTxs] = useState<RecentTx[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentTx[];
        setTxs(parsed);
      }
    } catch (e) {
      console.error('Failed to load recent txs:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever txs change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
      } catch (e) {
        console.error('Failed to save recent txs:', e);
      }
    }
  }, [txs, isLoaded]);

  const addTxs = useCallback((
    newTxs: Array<{
      txHash: string;
      blockNumber: bigint;
      from: string;
      to: string;
      amount: string;
      direction: 'in' | 'out';
      symbol: string;
    }>
  ) => {
    const timestamp = Date.now();

    setTxs(prev => {
      // Create new tx records
      const toAdd: RecentTx[] = newTxs.map(t => ({
        id: `${t.txHash}-${timestamp}`,
        txHash: t.txHash,
        blockNumber: Number(t.blockNumber),
        from: t.from,
        to: t.to,
        amount: t.amount,
        direction: t.direction,
        symbol: t.symbol,
        timestamp,
      }));

      // Filter out duplicates by txHash
      const existingHashes = new Set(prev.map(t => t.txHash));
      const uniqueNew = toAdd.filter(t => !existingHashes.has(t.txHash));

      // Add new ones at the front, limit total
      return [...uniqueNew, ...prev].slice(0, MAX_TXS);
    });
  }, []);

  const removeTx = useCallback((id: string) => {
    setTxs(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearTxs = useCallback(() => {
    setTxs([]);
  }, []);

  return {
    txs,
    addTxs,
    removeTx,
    clearTxs,
    isLoaded,
  };
}
