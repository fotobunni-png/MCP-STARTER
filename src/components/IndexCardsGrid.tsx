import React from 'react';
import { MarketAsset } from '../types/market';
import { ArrowUpRight, ArrowDownRight, Maximize2, Star } from 'lucide-react';

interface IndexCardsGridProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  watchlistSymbols: Set<string>;
  onToggleWatchlist: (symbol: string) => void;
  flashingSymbols: Record<string, 'up' | 'down'>;
}

export const IndexCardsGrid: React.FC<IndexCardsGridProps> = ({
  assets,
  onSelectAsset,
  watchlistSymbols,
  onToggleWatchlist,
  flashingSymbols,
}) => {
  // Render clean SVG sparkline
  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 160;
    const height = 46;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    });

    const pathData = `M ${coords.join(' L ')}`;
    const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;
    const strokeColor = isPositive ? '#089981' : '#F23645';
    const fillColor = isPositive ? 'rgba(8, 153, 129, 0.12)' : 'rgba(242, 54, 69, 0.12)';

    return (
      <svg className="w-full h-11 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${isPositive ? 'up' : 'down'}-${min}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaData} fill={`url(#grad-${isPositive ? 'up' : 'down'}-${min})`} />
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="w-full py-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#131722] tracking-tight">
              Major World Markets
            </h2>
            <p className="text-xs text-[#6A7185]">
              Real-time benchmark indices, cryptocurrencies, and store of value commodities
            </p>
          </div>
          <span className="text-xs text-[#6A7185] font-mono hidden sm:inline">
            Click any card to launch interactive terminal
          </span>
        </div>

        {/* Responsive Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {assets.map((asset) => {
            const isPositive = asset.changePercent >= 0;
            const isWatchlisted = watchlistSymbols.has(asset.symbol);
            const flashState = flashingSymbols[asset.symbol];

            // Range meter calculation
            const range = asset.high24h - asset.low24h || 1;
            const currentPosition = Math.min(Math.max(((asset.price - asset.low24h) / range) * 100, 5), 95);

            return (
              <div
                key={asset.symbol}
                onClick={() => onSelectAsset(asset)}
                className={`group relative bg-white hover:bg-[#F8F9FD] border border-[#E0E3EB] hover:border-[#2962FF] rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
                  flashState === 'up'
                    ? 'ring-2 ring-[#089981]/50 bg-[#E7F6F3]/50'
                    : flashState === 'down'
                    ? 'ring-2 ring-[#F23645]/50 bg-[#FDECEE]/50'
                    : ''
                }`}
              >
                {/* Top row: Badge, Name, Star */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    {/* Index circular badge pill */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                      style={{
                        backgroundColor: asset.badgeBgColor || '#131722',
                        color: asset.badgeTextColor || '#FFFFFF',
                      }}
                    >
                      {asset.badgeText || asset.symbol.slice(0, 3)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#131722] truncate">
                          {asset.symbol}
                        </span>
                      </div>
                      <span className="text-xs text-[#6A7185] truncate block">
                        {asset.name}
                      </span>
                    </div>
                  </div>

                  {/* Watchlist toggle icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(asset.symbol);
                    }}
                    className="p-1 rounded-md text-[#9598A1] hover:text-[#2962FF] hover:bg-[#F0F3FA] transition-colors"
                    title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isWatchlisted ? 'fill-[#2962FF] text-[#2962FF]' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Middle row: Price & Change */}
                <div className="my-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-lg font-bold text-[#131722] tabular-nums tracking-tight">
                      {asset.currency === 'USD' ? '$' : ''}
                      {asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: asset.price < 10 ? 3 : 2,
                        maximumFractionDigits: asset.price < 10 ? 3 : 2,
                      })}
                      {asset.currency === '%' ? '%' : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`inline-flex items-center text-xs font-semibold tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline shrink-0" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 inline shrink-0" />
                      )}
                      {isPositive ? '+' : ''}
                      {asset.change.toFixed(2)} ({isPositive ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                {/* Micro Sparkline */}
                <div className="my-1.5">
                  {renderSparkline(asset.sparkline, isPositive)}
                </div>

                {/* Day Range Bar */}
                <div className="pt-2 border-t border-[#E0E3EB]/60">
                  <div className="flex items-center justify-between text-[10px] text-[#6A7185] font-mono tabular-nums mb-1">
                    <span>L: {asset.low24h.toLocaleString()}</span>
                    <span>H: {asset.high24h.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1 bg-[#E0E3EB] rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${
                        isPositive ? 'bg-[#089981]' : 'bg-[#F23645]'
                      }`}
                      style={{ width: `${currentPosition}%` }}
                    />
                  </div>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-md shadow-xs text-[#2962FF]">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
