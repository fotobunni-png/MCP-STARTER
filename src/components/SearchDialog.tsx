import React, { useState, useEffect, useRef } from 'react';
import { MarketAsset } from '../types/market';
import { Search, X, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = assets.filter((asset) => {
    const matchesCat = selectedCategory === 'all' || asset.category === selectedCategory;
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || asset.symbol.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const categories = [
    { id: 'all', label: 'All Symbols' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'indices', label: 'Indices' },
    { id: 'forex', label: 'Forex' },
    { id: 'futures', label: 'Futures' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative p-4 border-b border-[#E0E3EB] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#6A7185] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search market symbols, companies, cryptocurrencies (e.g. AAPL, BTC, SPX)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
              } else if (e.key === 'Enter' && filtered[selectedIndex]) {
                e.preventDefault();
                onSelectAsset(filtered[selectedIndex]);
                onClose();
              }
            }}
            className="w-full text-sm sm:text-base text-[#131722] placeholder-[#9598A1] focus:outline-none bg-transparent"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#6A7185] hover:text-[#131722]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="text-[11px] font-mono px-2 py-0.5 bg-[#F0F3FA] text-[#6A7185] rounded border border-[#E0E3EB]">
              ESC
            </kbd>
          )}
        </div>

        {/* Category Pills Strip */}
        <div className="px-4 py-2.5 bg-[#F8F9FD] border-b border-[#E0E3EB] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#131722] text-white shadow-xs'
                  : 'text-[#6A7185] hover:text-[#131722] hover:bg-[#E0E3EB]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#E0E3EB]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#6A7185] text-sm">
              No symbols match "{query}" in this category.
            </div>
          ) : (
            filtered.map((asset, idx) => {
              const isSelected = idx === selectedIndex;
              const isPositive = asset.changePercent >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F0F3FA]' : 'hover:bg-[#F8F9FD]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                      style={{ backgroundColor: asset.badgeBgColor || '#131722' }}
                    >
                      {asset.badgeText || asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#131722]">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#E0E3EB] text-[#434656]">
                          {asset.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#6A7185] truncate max-w-xs">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-[#131722] tabular-nums">
                      ${asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: asset.price < 10 ? 3 : 2,
                        maximumFractionDigits: asset.price < 10 ? 3 : 2,
                      })}
                    </div>
                    <div
                      className={`font-mono text-xs font-semibold tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="p-3 bg-[#F8F9FD] border-t border-[#E0E3EB] flex items-center justify-between text-xs text-[#6A7185]">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E3EB] rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E3EB] rounded">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-[#E0E3EB] rounded">Enter</kbd> to view</span>
          </div>
          <span>{filtered.length} matches</span>
        </div>
      </div>
    </div>
  );
};
