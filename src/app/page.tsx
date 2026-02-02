'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Timeline3DWrapper, type TimeRange } from '@/components/timeline3d/Timeline3DWrapper';
import logo from '@/assets/txgoatlogo.png';
import { useChainData } from "../hooks/useChainData"
import { useRecentTxs } from '@/hooks/useRecentTxs';
import { RecentTxsSidebar, RecentTxsInline } from '@/components/RecentTxs';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isRecentSidebarOpen, setIsRecentSidebarOpen] = useState(false);

  const { getBlock, transfers, isLoading, progress, setMockTransfers } = useChainData()
  const { txs: recentTxs, addTxs, clearTxs } = useRecentTxs();

  // Default timeline config: 2014 to present (Ethereum launch era to now)
  const config = useMemo(() => ({
    minDate: new Date('2014-01-01'),
    maxDate: new Date(),
    minSelectionMs: 60 * 60 * 1000, // Minimum 1 hour selection
    maxSelectionMs: 60 * 24 * 60 * 60 * 1000, // Maximum 2 month selection
  }), []);

  const handleSelectionChange = (range: TimeRange | null) => {
    setSelectedRange(range);
  };

  const isValidWalletAddress = walletAddress.length === 42 && walletAddress.startsWith('0x');
  const isValidTokenAddress = tokenAddress.length === 42 && tokenAddress.startsWith('0x');

  const selectionMs = selectedRange
    ? selectedRange.end.getTime() - selectedRange.start.getTime()
    : 0;
  const isRangeTooLong = selectionMs > config.maxSelectionMs;

  const handleSearch = () => {
    if (!isValidWalletAddress || !isValidTokenAddress || !selectedRange || isRangeTooLong) return;
    setIsSearchMode(true);
    setIsRecentSidebarOpen(false);
    getBlock(selectedRange, walletAddress, tokenAddress, (completedTransfers) => {
      addTxs(completedTransfers);
    });
  };

  const handleBackToForm = () => {
    setIsSearchMode(false);
  };

  // TODO: Remove - mock data for testing UI
  const handleMockSearch = () => {
    setIsSearchMode(true);
    const mockTxs = [
      { txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', blockNumber: BigInt(19000000), from: '0xABC123...', to: '0xDEF456...', amount: '1500.50', direction: 'in' as const, symbol: 'USDC' },
      { txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', blockNumber: BigInt(19000100), from: '0xDEF456...', to: '0x789ABC...', amount: '250.00', direction: 'out' as const, symbol: 'USDC' },
      { txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234', blockNumber: BigInt(19000200), from: '0x111222...', to: '0xDEF456...', amount: '10000', direction: 'in' as const, symbol: 'USDC' },
      { txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234', blockNumber: BigInt(19000200), from: '0x111222...', to: '0xDEF456...', amount: '10000', direction: 'in' as const, symbol: 'USDC' },
      { txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234', blockNumber: BigInt(19000200), from: '0x111222...', to: '0xDEF456...', amount: '10000', direction: 'in' as const, symbol: 'USDC' },
      { txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234', blockNumber: BigInt(19000200), from: '0x111222...', to: '0xDEF456...', amount: '10000', direction: 'in' as const, symbol: 'USDC' },
      { txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234', blockNumber: BigInt(19000200), from: '0x111222...', to: '0xDEF456...', amount: '10000', direction: 'in' as const, symbol: 'USDC' },
      { txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234', blockNumber: BigInt(19000200), from: '0x111222...', to: '0xDEF456...', amount: '10000', direction: 'in' as const, symbol: 'USDC' },
    ];
    setMockTransfers(mockTxs);
    addTxs(mockTxs);
  };

  const canSearch = isValidWalletAddress && isValidTokenAddress && selectedRange && !isRangeTooLong;

  return (
    <div className={`min-h-screen flex flex-col relative noise-overlay ${isSearchMode ? 'h-screen overflow-hidden' : ''}`}>
      {/* Decorative corner element */}
      <div className={`fixed top-0 right-0 bg-charcoal pointer-events-none transition-all duration-500 ${isSearchMode ? 'w-12 h-12' : 'w-32 h-32'}`}
           style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />

      {/* Header */}
      <header className={`h-32 px-8 flex items-center transition-all duration-500 ${isSearchMode ? 'h-24' : ''}`}>
        <div className={`transition-all duration-500 w-full ${isSearchMode ? 'max-w-full' : 'max-w-5xl mx-auto text-center'}`}>
          <div className={`flex items-center gap-4 transition-all duration-500 ${isSearchMode ? 'justify-start' : 'justify-center'}`}>
            <Image
              src={logo}
              alt="TxGoat Logo"
              width={48}
              height={48}
              className={`transition-all duration-500 ${isSearchMode ? 'w-10 h-10' : 'w-12 h-12'}`}
            />
            <h1 className={`font-display italic text-text transition-all duration-500 tracking-tight ${isSearchMode ? 'text-3xl' : 'text-4xl md:text-5xl'}`}>
              TxGoat
            </h1>
          </div>
          {!isSearchMode && (
            <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] mt-2">
              {/* Ethereum Token Transfer Explorer */}
              EVM Blockchain Transaction Search
            </p>
          )}
        </div>
      </header>

      {/* Divider - aligns with bottom of corner triangle */}
      <div className="border-b-2 border-charcoal" />

      {/* Main Content */}
      <main className="flex-1 px-8 py-6">
        <div className={`flex transition-all duration-500 ${isSearchMode ? 'gap-8' : 'max-w-5xl mx-auto'}`}>
          {/* Form Section - becomes sidebar in search mode */}
          <div className={`transition-all duration-500 ease-in-out ${isSearchMode ? 'w-96 flex-shrink-0 min-w-0 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-3 pb-6' : 'w-full'}`}>
            <div className="space-y-4 min-w-0">
              {/* Address Input Section */}
              <div className="card-accent p-5 space-y-4 min-w-0 overflow-hidden">
                <div>
                  <label
                    htmlFor="wallet-address"
                    className="label block mb-2"
                  >
                    Wallet Address
                  </label>
                  <input
                    id="wallet-address"
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x..."
                    className="input w-full min-w-0"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  {walletAddress && !isValidWalletAddress && (
                    <p className="mt-1 text-xs text-danger font-medium uppercase tracking-wide">
                      Invalid address
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="token-address"
                    className="label block mb-2"
                  >
                    Token Address
                  </label>
                  <input
                    id="token-address"
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="0x..."
                    className="input w-full min-w-0"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  {tokenAddress && !isValidTokenAddress && (
                    <p className="mt-1 text-xs text-danger font-medium uppercase tracking-wide">
                      Invalid address
                    </p>
                  )}
                </div>
              </div>

              {/* Timeline Section */}
              <div className="card-accent p-5 min-w-0 overflow-hidden">
                <Timeline3DWrapper
                  config={config}
                  onSelectionChange={handleSelectionChange}
                />
                {isRangeTooLong && (
                  <p className="mt-3 text-xs text-danger font-medium uppercase tracking-wide">
                    Selection exceeds 2 months
                  </p>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!canSearch || isLoading}
                className="btn w-full py-3 text-xs"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-3 h-3 border-2 border-cream border-t-transparent animate-spin" />
                    Scanning
                  </span>
                ) : (
                  'Search Transactions'
                )}
              </button>

              {/* Back button in search mode */}
              {isSearchMode && (
                <button
                  onClick={handleBackToForm}
                  className="btn-secondary w-full"
                >
                  <span className="mr-2">&larr;</span> Back to Full View
                </button>
              )}

              {/* Recent Txs - inline in search mode */}
              {isSearchMode && recentTxs.length > 0 && (
                <RecentTxsInline
                  txs={recentTxs}
                  onClear={clearTxs}
                />
              )}
            </div>
          </div>

          {/* Results Section - only visible in search mode */}
          <div className={`flex-1 transition-all duration-500 ${isSearchMode ? 'opacity-100 max-h-[calc(100vh-140px)]' : 'opacity-0 w-0 overflow-hidden'}`}>
            {isSearchMode && (
              <div className="h-full flex flex-col animate-fade-in">
                {/* Progress Bar */}
                {isLoading && (
                  <div className="flex items-center justify-center min-h-[200px]">
                    <div className="w-full max-w-lg">
                      <div className="flex items-center justify-between mb-4">
                        <p className="label">Scanning Blockchain</p>
                        <p className="text-2xl font-display italic text-text">{progress}%</p>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-text-muted mt-4 uppercase tracking-wider">
                        {transfers.length} transction{transfers.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                  </div>
                )}

                {/* Transfers List */}
                {transfers.length > 0 && (
                  <div className="card p-6 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-charcoal flex-shrink-0">
                      <h2 className="font-display italic text-3xl text-text">
                        Transactions
                      </h2>
                      <div className="bg-charcoal text-cream px-4 py-2">
                        <span className="text-sm font-mono">{transfers.length}</span>
                      </div>
                    </div>
                    <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1 min-h-0">
                      {transfers.map((transfer, index) => (
                        <div
                          key={`${transfer.txHash}-${index}`}
                          className="transfer-card p-5 animate-slide-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <span className={transfer.direction === 'in' ? 'badge-in' : 'badge-out'}>
                              {transfer.direction === 'in' ? 'Received' : 'Sent'}
                            </span>
                            <div className="text-right">
                              <span className="text-xs text-text-muted font-mono block">
                                Block #{transfer.blockNumber.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-text-muted font-mono">
                                {transfer.txHash.slice(0, 10)}...{transfer.txHash.slice(-8)}
                              </span>
                            </div>
                          </div>
                          <div className="mb-4 p-4 bg-cream-dark border-2 border-charcoal">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl" title="Token Transfer">⇄</span>
                              <div>
                                <span className="text-3xl font-display italic text-text">
                                  {Number(transfer.amount).toLocaleString()}
                                </span>
                                <span className="ml-2 text-lg font-mono text-text">
                                  {transfer.symbol}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <span className="label block mb-1">
                              {transfer.direction === 'in' ? 'From' : 'To'}
                            </span>
                            <span className="text-xs font-mono text-text-muted break-all">
                              {transfer.direction === 'in' ? transfer.from : transfer.to}
                            </span>
                          </div>
                          <a
                            href={`https://etherscan.io/tx/${transfer.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider bg-charcoal text-cream hover:bg-cream hover:text-charcoal px-3 py-2 border-2 border-charcoal transition-colors"
                          >
                            View on Etherscan
                            <span>&rarr;</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results state */}
                {!isLoading && transfers.length === 0 && (
                  <div className="card p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 border-2 border-charcoal flex items-center justify-center">
                      <span className="text-3xl">?</span>
                    </div>
                    <p className="text-text-muted uppercase tracking-wider text-sm">
                      No transactions found for this time range
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Recent Txs Sidebar - only in main view (not search mode) */}
      {!isSearchMode && (
        <RecentTxsSidebar
          txs={recentTxs}
          onClear={clearTxs}
          isOpen={isRecentSidebarOpen}
          onToggle={() => setIsRecentSidebarOpen(!isRecentSidebarOpen)}
        />
      )}

      {/* Footer */}
      <footer className="py-3 px-8 border-t-2 border-charcoal mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-[10px] text-text-muted tracking-[0.1em]" onClick={handleMockSearch}>
            made by{' '}
            <a
              href="https://x.com/0xgeeb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:underline"
            >
              geeb
            </a>
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-charcoal" />
            <span className="w-1.5 h-1.5 bg-charcoal opacity-60" />
            <span className="w-1.5 h-1.5 bg-charcoal opacity-30" />
          </div>
        </div>
      </footer>
    </div>
  );
}
