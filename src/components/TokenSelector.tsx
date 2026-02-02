'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { POPULAR_TOKENS, type Token } from '@/lib/tokens';

interface TokenSelectorProps {
  value: string;
  onChange: (address: string) => void;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

export function TokenSelector({ value, onChange }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customAddress, setCustomAddress] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find selected token from value
  const selectedToken = POPULAR_TOKENS.find(
    (t) => t.address.toLowerCase() === value.toLowerCase()
  );

  // Check if current value is a custom address (not in popular tokens)
  const isCustomValue = value && !selectedToken;

  // Update dropdown position when opening
  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedDropdown = dropdownRef.current?.contains(target);

      if (!clickedTrigger && !clickedDropdown) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Update position on scroll/resize when open
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // Focus input when entering custom mode
  useEffect(() => {
    if (isCustomMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustomMode]);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  const handleTokenSelect = (token: Token) => {
    onChange(token.address);
    setIsOpen(false);
    setIsCustomMode(false);
  };

  const handleCustomClick = () => {
    setIsCustomMode(true);
    setIsOpen(false);
    setCustomAddress(isCustomValue ? value : '');
  };

  const handleCustomAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomAddress(newValue);
    onChange(newValue);
  };

  const handleBackToTokens = () => {
    setIsCustomMode(false);
    setCustomAddress('');
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Custom mode: show input field
  if (isCustomMode) {
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="text"
          value={customAddress}
          onChange={handleCustomAddressChange}
          placeholder="0x..."
          className="input w-full min-w-0"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={handleBackToTokens}
          className="text-xs text-text-muted hover:text-text uppercase tracking-wider transition-colors"
        >
          &larr; Back to tokens
        </button>
      </div>
    );
  }

  const dropdown = isOpen && dropdownPosition && (
    <div
      ref={dropdownRef}
      className="fixed z-50 bg-cream border-2 border-charcoal animate-dropdown-in"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
      }}
    >
      {/* Token Options */}
      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {POPULAR_TOKENS.map((token) => {
          const isSelected = token.address.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={token.address}
              type="button"
              onClick={() => handleTokenSelect(token)}
              className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                isSelected
                  ? 'bg-charcoal text-cream'
                  : 'hover:bg-cream-dark'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-semibold text-sm ${isSelected ? 'text-cream' : 'text-text'}`}>
                  {token.symbol}
                </span>
                <span className={`text-xs ${isSelected ? 'text-cream opacity-70' : 'text-text-muted'}`}>
                  {token.name}
                </span>
              </div>
              <span className={`text-xs font-mono ${isSelected ? 'text-cream opacity-70' : 'text-text-muted'}`}>
                {truncateAddress(token.address)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t-2 border-charcoal" />

      {/* Custom Address Option */}
      <button
        type="button"
        onClick={handleCustomClick}
        className="w-full px-4 py-3 text-left hover:bg-cream-dark transition-colors flex items-center gap-2"
      >
        <span className="text-sm font-semibold">+</span>
        <span className="text-xs uppercase tracking-wider">Enter Custom Address</span>
      </button>
    </div>
  );

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="input w-full min-w-0 text-left flex items-center justify-between cursor-pointer"
      >
        <span className={selectedToken || isCustomValue ? 'text-text' : 'text-text-muted opacity-60'}>
          {selectedToken ? (
            <span className="flex items-center gap-2">
              <span className="font-semibold">{selectedToken.symbol}</span>
              <span className="text-text-muted text-xs">{selectedToken.name}</span>
            </span>
          ) : isCustomValue ? (
            <span className="flex items-center gap-2">
              <span className="font-semibold">Custom</span>
              <span className="text-text-muted text-xs">{truncateAddress(value)}</span>
            </span>
          ) : (
            'Select Token'
          )}
        </span>
        <span className="text-text-muted ml-2">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown rendered via portal to escape overflow:hidden */}
      {typeof document !== 'undefined' && createPortal(dropdown, document.body)}
    </div>
  );
}
