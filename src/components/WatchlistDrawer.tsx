import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { X, Trash2, Plus, Bell, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Check } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: Set<string>;
  allAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  allAssets,
  onSelectAsset,
  onRemoveFromWatchlist,
  onAddToWatchlist,
}) => {
  const [newSymbolInput, setNewSymbolInput] = useState('');
  const [alertCreatedToast, setAlertCreatedToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const watchedAssets = allAssets.filter((a) => watchlistSymbols.has(a.symbol));

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSymbolInput.trim().toUpperCase();
    if (clean) {
      const match = allAssets.find((a) => a.symbol === clean);
      if (match) {
        onAddToWatchlist(match.symbol);
        setNewSymbolInput('');
      } else {
        alert(`Symbol "${clean}" not found in current market coverage. Try NVDA, AAPL, BTCUSD, SPX, etc.`);
      }
    }
  };

  const handleCreateAlert = (symbol: string, price: number) => {
    setAlertCreatedToast(`Price alert set for ${symbol} at $${price.toFixed(2)}`);
    setTimeout(() => {
      setAlertCreatedToast(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E0E3EB] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2962FF]"></span>
            <h3 className="font-display font-bold text-base text-[#131722]">
              Watchlist & Details ({watchedAssets.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#6A7185] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Symbol Input */}
        <form onSubmit={handleAddSymbol} className="p-3 border-b border-[#E0E3EB] bg-[#F8F9FD]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add symbol (e.g. NVDA, BTCUSD)..."
              value={newSymbolInput}
              onChange={(e) => setNewSymbolInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E0E3EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2962FF] uppercase font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#131722] hover:bg-[#2962FF] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Alert Feedback Toast */}
        {alertCreatedToast && (
          <div className="p-2.5 bg-[#E7F6F3] text-[#089981] text-xs font-semibold flex items-center gap-2 border-b border-[#089981]/30">
            <Check className="w-4 h-4" />
            <span>{alertCreatedToast}</span>
          </div>
        )}

        {/* Watched Symbols List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E0E3EB]">
          {watchedAssets.length === 0 ? (
            <div className="p-8 text-center text-[#6A7185] text-xs">
              <p>Your watchlist is empty.</p>
              <p className="mt-1">Click the star icon next to any asset or search to pin here.</p>
            </div>
          ) : (
            watchedAssets.map((asset) => {
              const isPositive = asset.changePercent >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => onSelectAsset(asset)}
                  className="p-3 hover:bg-[#F8F9FD] cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                      style={{ backgroundColor: asset.badgeBgColor || '#131722' }}
                    >
                      {asset.badgeText || asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#131722] group-hover:text-[#2962FF] transition-colors">
                        {asset.symbol}
                      </div>
                      <div className="text-[11px] text-[#6A7185] truncate max-w-[120px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-[#131722] tabular-nums">
                        ${asset.price.toFixed(asset.price < 10 ? 3 : 2)}
                      </div>
                      <div
                        className={`font-mono text-[11px] font-semibold tabular-nums flex items-center justify-end ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    {/* Actions: Alert & Remove */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateAlert(asset.symbol, asset.price);
                        }}
                        className="p-1 rounded text-[#6A7185] hover:text-[#2962FF] hover:bg-white"
                        title="Set Price Alert"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWatchlist(asset.symbol);
                        }}
                        className="p-1 rounded text-[#6A7185] hover:text-[#F23645] hover:bg-white"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with quick stats */}
        <div className="p-3 bg-[#F8F9FD] border-t border-[#E0E3EB] text-xs text-[#6A7185] flex items-center justify-between font-mono">
          <span>Pinned items: {watchedAssets.length}</span>
          <span>Real-time Sync</span>
        </div>
      </div>
    </div>
  );
};
