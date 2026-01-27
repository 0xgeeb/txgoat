'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Timeline3DWrapper, type TimeRange } from '@/components/timeline3d/Timeline3DWrapper';
import logo from '@/assets/txgoatlogo.png';
import { useChainData } from "../hooks/useChainData"

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null);

  const { getBlock, transfers, isLoading } = useChainData()

  // Default timeline config: 2014 to present (Ethereum launch era to now)
  const config = useMemo(() => ({
    minDate: new Date('2014-01-01'),
    maxDate: new Date(),
    minSelectionMs: 60 * 60 * 1000, // Minimum 1 hour selection
  }), []);

  const handleSelectionChange = (range: TimeRange | null) => {
    setSelectedRange(range);
  };

  const isValidWalletAddress = walletAddress.length === 42 && walletAddress.startsWith('0x');
  const isValidTokenAddress = tokenAddress.length === 42 && tokenAddress.startsWith('0x');

  const test = () => {
    console.log(selectedRange)
    getBlock(selectedRange, walletAddress, tokenAddress)
  }

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
            Find when you traded a token
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Address Input Section */}
          <div className="bg-white border border-border p-6 space-y-4">
            <div>
              <label
                htmlFor="wallet-address"
                className="block text-sm font-medium text-text mb-2"
              >
                Your Wallet Address
              </label>
              <input
                id="wallet-address"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="input w-full font-mono text-sm"
                spellCheck={false}
                autoComplete="off"
              />
              {walletAddress && !isValidWalletAddress && (
                <p className="mt-2 text-xs text-red-600">
                  Enter a valid address
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="token-address"
                className="block text-sm font-medium text-text mb-2"
              >
                Token Contract Address
              </label>
              <input
                id="token-address"
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="0x..."
                className="input w-full font-mono text-sm"
                spellCheck={false}
                autoComplete="off"
              />
              {tokenAddress && !isValidTokenAddress && (
                <p className="mt-2 text-xs text-red-600">
                  Enter a valid token contract address
                </p>
              )}
            </div>
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

          {/* Loading */}
          {isLoading && (
            <div className="bg-white border border-border p-4">
              <p className="text-sm text-text-muted">Searching...</p>
            </div>
          )}

          {/* Transfers List */}
          {transfers.length > 0 && (
            <div className="bg-white border border-border p-6">
              <h2 className="text-lg font-medium text-text mb-4">
                Found {transfers.length} Transfer{transfers.length !== 1 ? 's' : ''}
              </h2>
              <div className="space-y-3">
                {transfers.map((transfer, index) => (
                  <div
                    key={`${transfer.txHash}-${index}`}
                    className="border border-border p-4 bg-cream-dark"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${transfer.direction === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                        {transfer.direction === 'in' ? 'Received' : 'Sent'}
                      </span>
                      <span className="text-xs text-text-muted">
                        Block {transfer.blockNumber.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-mono mb-2">
                      <span className="text-text-muted">Amount: </span>
                      <span className="text-text">{Number(transfer.amount).toLocaleString()}</span>
                    </div>
                    <div className="text-xs font-mono text-text-muted truncate">
                      <span>{transfer.direction === 'in' ? 'From: ' : 'To: '}</span>
                      <span>{transfer.direction === 'in' ? transfer.from : transfer.to}</span>
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${transfer.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                    >
                      View on Etherscan
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-text-muted" onClick={() => test()}>
            TxGoat
          </p>
        </div>
      </footer>
    </div>
  );
}
