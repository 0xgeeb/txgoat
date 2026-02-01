'use client';

import { useState } from 'react';
import type { RecentTx } from '@/hooks/useRecentTxs';

interface RecentTxsProps {
  txs: RecentTx[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTxHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function TxItem({
  tx,
  onRemove,
  compact = false
}: {
  tx: RecentTx;
  onRemove: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`
        group relative bg-cream border-2 border-charcoal
        ${compact ? 'p-3' : 'p-4'}
      `}
    >
      {/* Delete button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-opacity
                   bg-charcoal text-cream hover:bg-danger text-xs font-bold"
        aria-label="Remove tx"
      >
        ×
      </button>

      {/* Direction badge + Amount */}
      <div className="flex items-center gap-2 mb-2">
        <span className={tx.direction === 'in' ? 'badge-in' : 'badge-out'}>
          {tx.direction === 'in' ? 'In' : 'Out'}
        </span>
        <span className={`font-display italic text-text ${compact ? 'text-base' : 'text-lg'}`}>
          {Number(tx.amount).toLocaleString()}
        </span>
      </div>

      {/* Tx Hash */}
      <div className={compact ? 'mb-2' : 'mb-3'}>
        <span className="label block mb-1">Tx</span>
        <a
          href={`https://etherscan.io/tx/${tx.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-mono text-text hover:underline ${compact ? 'text-[10px]' : 'text-xs'}`}
        >
          {formatTxHash(tx.txHash)}
        </a>
      </div>

      {/* From/To based on direction */}
      <div className={compact ? 'mb-2' : 'mb-3'}>
        <span className="label block mb-1">
          {tx.direction === 'in' ? 'From' : 'To'}
        </span>
        <a
          href={`https://etherscan.io/address/${tx.direction === 'in' ? tx.from : tx.to}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-mono text-text hover:underline ${compact ? 'text-xs' : 'text-sm'}`}
        >
          {formatAddress(tx.direction === 'in' ? tx.from : tx.to)}
        </a>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-charcoal/20">
        <span className="text-[10px] text-text-muted uppercase tracking-wider">
          {formatRelativeTime(tx.timestamp)}
        </span>
        <span className="text-[10px] text-text-muted font-mono">
          #{tx.blockNumber.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export function RecentTxsSidebar({
  txs,
  onRemove,
  onClear,
  isOpen,
  onToggle,
}: RecentTxsProps & { isOpen: boolean; onToggle: () => void }) {
  return (
    <>
      {/* Toggle Tab - fixed to right edge */}
      <button
        onClick={onToggle}
        className={`
          fixed top-1/2 -translate-y-1/2 z-40
          bg-charcoal text-cream border-2 border-charcoal border-r-0
          transition-all duration-300 hover:bg-cream hover:text-charcoal
          ${isOpen ? 'right-[320px]' : 'right-0'}
        `}
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <span className="px-2 py-4 text-[10px] uppercase tracking-[0.2em] font-mono flex items-center gap-2">
          <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            ◄
          </span>
          Recent
          {txs.length > 0 && (
            <span className="bg-cream text-charcoal px-1.5 py-0.5 text-[9px] font-bold" style={{ writingMode: 'horizontal-tb' }}>
              {txs.length}
            </span>
          )}
        </span>
      </button>

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 z-30
          bg-cream-dark border-l-2 border-charcoal
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="h-32 px-6 flex flex-col justify-center border-b-2 border-charcoal bg-cream">
          <div className="flex items-center justify-between">
            <h2 className="font-display italic text-2xl text-text">Recent Txs</h2>
            {txs.length > 0 && (
              <button
                onClick={onClear}
                className="text-[10px] uppercase tracking-wider text-text-muted hover:text-danger transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-text-muted mt-1">
            {txs.length} transaction{txs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-128px)] overflow-y-auto custom-scrollbar p-4">
          {txs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-12 h-12 border-2 border-charcoal/30 flex items-center justify-center mb-4">
                <span className="text-2xl text-charcoal/30">∅</span>
              </div>
              <p className="text-text-muted text-xs uppercase tracking-wider">
                No recent transactions
              </p>
              <p className="text-text-muted/60 text-[10px] mt-2">
                Your transactions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {txs.map((tx, index) => (
                <div
                  key={tx.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TxItem
                    tx={tx}
                    onRemove={() => onRemove(tx.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Decorative corner */}
        <div
          className="absolute top-0 left-0 w-6 h-6 bg-charcoal"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal/10 z-20 backdrop-blur-[2px]"
          onClick={onToggle}
        />
      )}
    </>
  );
}

export function RecentTxsInline({
  txs,
  onRemove,
  onClear,
}: RecentTxsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (txs.length === 0) {
    return null;
  }

  return (
    <div className="card-accent overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-cream hover:bg-cream-dark transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-display italic text-lg text-text">Recent Txs</span>
          <span className="bg-charcoal text-cream px-2 py-0.5 text-[10px] font-mono">
            {txs.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {txs.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-[10px] uppercase tracking-wider text-text-muted hover:text-danger transition-colors cursor-pointer"
            >
              Clear
            </span>
          )}
          <span
            className={`text-charcoal transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Expandable content */}
      <div
        className={`
          transition-all duration-300 ease-out overflow-hidden
          ${isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="border-t-2 border-charcoal" />
        <div className="p-3 max-h-56 overflow-y-auto custom-scrollbar space-y-2 bg-cream-dark/50">
          {txs.map((tx) => (
            <TxItem
              key={tx.id}
              tx={tx}
              onRemove={() => onRemove(tx.id)}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  );
}
