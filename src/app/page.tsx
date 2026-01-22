'use client';

import { useState, useMemo } from 'react';
import { subDays } from 'date-fns';
import { Timeline } from '@/components/timeline';
import { GridBackground, GlowContainer } from '@/components/ui';
import { TimelineConfig, TimeRange } from '@/types/timeline';

export default function Home() {
  const [address, setAddress] = useState('');
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null);

  // Default timeline config: last 30 days
  const config: TimelineConfig = useMemo(() => ({
    minDate: subDays(new Date(), 30),
    maxDate: new Date(),
    minSelectionMs: 60 * 60 * 1000, // Minimum 1 hour selection
  }), []);

  const handleSelectionChange = (range: TimeRange | null) => {
    setSelectedRange(range);
  };

  const isValidAddress = address.length === 42 && address.startsWith('0x');

  return (
    <GridBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-6 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text-neon mb-2">
              Ethereum Transaction Viewer
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Select a time range to explore blockchain history
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Address Input Section */}
            <GlowContainer color="cyan" className="p-6">
              <label
                htmlFor="eth-address"
                className="block text-sm font-mono text-neon-cyan text-glow-cyan-sm mb-3"
              >
                Ethereum Address
              </label>
              <div className="flex gap-4">
                <input
                  id="eth-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="cyber-input flex-1 font-mono text-sm"
                  spellCheck={false}
                  autoComplete="off"
                />
                <button
                  className="cyber-button font-display text-sm px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isValidAddress}
                >
                  Load
                </button>
              </div>
              {address && !isValidAddress && (
                <p className="mt-2 text-xs text-neon-magenta/70 font-mono">
                  Enter a valid Ethereum address (0x followed by 40 hex characters)
                </p>
              )}
            </GlowContainer>

            {/* Timeline Section */}
            <GlowContainer color="purple" intensity="subtle" className="p-6">
              <h2 className="text-lg font-display text-neon-purple text-glow-purple-sm mb-6">
                Time Range Selection
              </h2>
              <Timeline
                config={config}
                onSelectionChange={handleSelectionChange}
              />
            </GlowContainer>

            {/* Selected Range Info */}
            {selectedRange && (
              <GlowContainer color="magenta" intensity="subtle" className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-400">
                    Selected Range:
                  </span>
                  <div className="text-sm font-mono">
                    <span className="text-neon-cyan">
                      {selectedRange.start.toLocaleDateString()}
                    </span>
                    <span className="text-neon-purple mx-2">to</span>
                    <span className="text-neon-magenta">
                      {selectedRange.end.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </GlowContainer>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-6 border-t border-cyber-border">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-mono text-gray-500">
              <span className="text-neon-cyan/50">ETH</span>
              <span className="mx-2 text-gray-600">|</span>
              <span className="text-gray-500">Transaction Timeline Viewer</span>
            </p>
          </div>
        </footer>
      </div>
    </GridBackground>
  );
}
