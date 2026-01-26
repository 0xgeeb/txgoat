'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Timeline3DWrapper, type TimeRange } from '@/components/timeline3d/Timeline3DWrapper';
import logo from '@/assets/txgoatlogo.png';

export default function Home() {
  const [address, setAddress] = useState('');
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null);

  // Default timeline config: 2014 to present (Ethereum launch era to now)
  const config = useMemo(() => ({
    minDate: new Date('2014-01-01'),
    maxDate: new Date(),
    minSelectionMs: 60 * 60 * 1000, // Minimum 1 hour selection
  }), []);

  const handleSelectionChange = (range: TimeRange | null) => {
    setSelectedRange(range);
  };

  const isValidAddress = address.length === 42 && address.startsWith('0x');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image
              src={logo}
              alt="TxGoat Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <h1 className="text-4xl md:text-5xl font-semibold text-text">
              TxGoat
            </h1>
          </div>
          <p className="text-text-muted text-sm">
            Select a time range to explore blockchain history
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Address Input Section */}
          <div className="bg-white border border-border p-6">
            <label
              htmlFor="eth-address"
              className="block text-sm font-medium text-text mb-3"
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
                className="input flex-1 font-mono text-sm"
                spellCheck={false}
                autoComplete="off"
              />
              <button
                className="btn text-sm px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isValidAddress}
              >
                Load
              </button>
            </div>
            {address && !isValidAddress && (
              <p className="mt-2 text-xs text-red-600">
                Enter a valid Ethereum address (0x followed by 40 hex characters)
              </p>
            )}
          </div>

          {/* Timeline Section */}
          <div className="bg-white border border-border p-6">
            <h2 className="text-lg font-medium text-text mb-6">
              Time Range Selection
            </h2>
            <Timeline3DWrapper
              config={config}
              onSelectionChange={handleSelectionChange}
            />
          </div>

          {/* Selected Range Info */}
          {selectedRange && (
            <div className="bg-cream-dark border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">
                  Selected Range:
                </span>
                <div className="text-sm font-mono">
                  <span className="text-text">
                    {selectedRange.start.toLocaleDateString()}
                  </span>
                  <span className="text-text-muted mx-2">to</span>
                  <span className="text-text">
                    {selectedRange.end.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-text-muted">
            TxGoat
          </p>
        </div>
      </footer>
    </div>
  );
}
