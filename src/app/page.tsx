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
  const [isSearchMode, setIsSearchMode] = useState(false);

  const { getBlock, transfers, isLoading, progress } = useChainData()

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

  const handleSearch = () => {
    if (!isValidWalletAddress || !isValidTokenAddress || !selectedRange) return;
    setIsSearchMode(true);
    getBlock(selectedRange, walletAddress, tokenAddress);
  };

  const handleBackToForm = () => {
    setIsSearchMode(false);
  };

  const canSearch = isValidWalletAddress && isValidTokenAddress && selectedRange;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`pt-8 pb-6 px-6 transition-all duration-500 ${isSearchMode ? 'py-4' : ''}`}>
        <div className={`transition-all duration-500 ${isSearchMode ? 'max-w-full' : 'max-w-4xl mx-auto text-center'}`}>
          <div className={`flex items-center gap-3 mb-2 transition-all duration-500 ${isSearchMode ? 'justify-start' : 'justify-center'}`}>
            <Image
              src={logo}
              alt="TxGoat Logo"
              width={48}
              height={48}
              className={`transition-all duration-500 ${isSearchMode ? 'w-8 h-8' : 'w-12 h-12'}`}
            />
            <h1 className={`font-semibold text-text transition-all duration-500 ${isSearchMode ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>
              TxGoat
            </h1>
          </div>
          {!isSearchMode && (
            <p className="text-text-muted text-sm">
              Find when you traded a token
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-12">
        <div className={`flex transition-all duration-500 ${isSearchMode ? 'gap-6' : 'max-w-4xl mx-auto'}`}>
          {/* Form Section - becomes sidebar in search mode */}
          <div className={`transition-all duration-500 ease-in-out ${isSearchMode ? 'w-80 flex-shrink-0' : 'w-full'}`}>
            <div className="space-y-4">
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
                <h2 className={`font-medium text-text mb-6 transition-all duration-500 ${isSearchMode ? 'text-sm' : 'text-lg'}`}>
                  Time Range Selection
                </h2>
                <Timeline3DWrapper
                  config={config}
                  onSelectionChange={handleSelectionChange}
                />
              </div>

              {/* Selected Range Info */}
              {/* {selectedRange && (
                <div className="bg-cream-dark border border-border p-4">
                  <div className={`flex items-center ${isSearchMode ? 'flex-col gap-2' : 'justify-between'}`}>
                    <span className="text-sm text-text-muted">
                      Selected Range:
                    </span>
                    <div className={`text-sm font-mono ${isSearchMode ? 'text-center' : ''}`}>
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
              )} */}

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!canSearch || isLoading}
                className={`w-full py-3 px-6 font-medium transition-all duration-300 ${
                  canSearch && !isLoading
                    ? 'bg-text text-white hover:bg-text/90 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Searching...' : 'Search Transfers'}
              </button>

              {/* Back button in search mode */}
              {isSearchMode && (
                <button
                  onClick={handleBackToForm}
                  className="w-full py-2 px-4 text-sm text-text-muted hover:text-text border border-border bg-white transition-colors"
                >
                  ← Back to Full View
                </button>
              )}
            </div>
          </div>

          {/* Results Section - only visible in search mode */}
          <div className={`flex-1 transition-all duration-500 ${isSearchMode ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            {isSearchMode && (
              <div className="space-y-4">
                {/* Progress Bar */}
                {isLoading && (
                  <div className="flex items-center justify-center min-h-[200px]">
                    <div className="w-full max-w-md">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-muted">Scanning blocks...</p>
                        <p className="text-sm font-mono text-text">{progress}%</p>
                      </div>
                      <div className="h-4 bg-gray-200 border border-border overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-text-muted mt-2 text-center">
                        Found {transfers.length} transfer{transfers.length !== 1 ? 's' : ''} so far
                      </p>
                    </div>
                  </div>
                )}

                {/* Transfers List */}
                {transfers.length > 0 && (
                  <div className="bg-white border border-border p-6">
                    <h2 className="text-lg font-medium text-text mb-4">
                      Found {transfers.length} Transfer{transfers.length !== 1 ? 's' : ''}
                    </h2>
                    <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
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

                {/* No results state */}
                {!isLoading && transfers.length === 0 && (
                  <div className="bg-white border border-border p-6 text-center">
                    <p className="text-text-muted">No transfers found yet. Results will appear here as they&apos;re discovered.</p>
                  </div>
                )}
              </div>
            )}
          </div>
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
