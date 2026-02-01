'use client';

import type { RecentTx } from '@/hooks/useRecentTxs';

interface RecentTxsProps {
  txs: RecentTx[];
  onClear: () => void;
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

function formatTxHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function TxItem({
  tx,
  compact = false
}: {
  tx: RecentTx;
  compact?: boolean;
}) {
  return (
    <div
      className={`
        bg-cream border-2 border-charcoal
        ${compact ? 'p-3' : 'p-4'}
      `}
    >

      {/* Amount + Symbol - prominent */}
      <div className={`${compact ? 'p-2 mb-2' : 'p-3 mb-3'} bg-cream-dark border-2 border-charcoal`}>
        <div className="flex items-center gap-2">
          <span className={compact ? 'text-base' : 'text-lg'} title="Token Transfer">⇄</span>
          <span className={tx.direction === 'in' ? 'badge-in' : 'badge-out'}>
            {tx.direction === 'in' ? 'In' : 'Out'}
          </span>
          <span className={`font-display italic text-text ${compact ? 'text-lg' : 'text-xl'}`}>
            {Number(tx.amount).toLocaleString()}
          </span>
          <span className={`font-mono text-text ${compact ? 'text-xs' : 'text-sm'}`}>
            {tx.symbol}
          </span>
        </div>
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

      {/* Footer with block info and tx hash */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-text-muted uppercase tracking-wider">
          {formatRelativeTime(tx.timestamp)}
        </span>
        <div className="text-right">
          <span className="text-[10px] text-text-muted font-mono block">
            Block #{tx.blockNumber.toLocaleString()}
          </span>
          <span className="text-[10px] text-text-muted font-mono">
            {formatTxHash(tx.txHash)}
          </span>
        </div>
      </div>

      {/* View on Etherscan button */}
      <a
        href={`https://etherscan.io/tx/${tx.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 uppercase tracking-wider bg-charcoal text-cream hover:bg-cream hover:text-charcoal border-2 border-charcoal transition-colors w-full justify-center ${compact ? 'text-[10px] px-2 py-1.5' : 'text-xs px-3 py-2'}`}
      >
        View on Etherscan
        <span>&rarr;</span>
      </a>
    </div>
  );
}

export function RecentTxsSidebar({
  txs,
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
                  <TxItem tx={tx} />
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
  onClear,
}: RecentTxsProps) {
  if (txs.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-charcoal">
        <div className="flex items-center gap-3">
          <span className="font-display italic text-xl text-text">Recent Txs</span>
          <span className="bg-charcoal text-cream px-2 py-0.5 text-[10px] font-mono">
            {txs.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] uppercase tracking-wider text-text-muted hover:text-danger transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Tx list - no separate scroll, flows with sidebar */}
      <div className="space-y-3">
        {txs.map((tx) => (
          <TxItem
            key={tx.id}
            tx={tx}
            compact
          />
        ))}
      </div>
    </div>
  );
}
