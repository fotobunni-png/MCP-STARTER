import React, { useState, useMemo } from 'react';
import { MarketAsset } from '../types/market';
import { ArrowUpRight, ArrowDownRight, Star, ArrowUpDown, Search, ExternalLink } from 'lucide-react';

interface MarketTableProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  watchlistSymbols: Set<string>;
  onToggleWatchlist: (symbol: string) => void;
  flashingSymbols: Record<string, 'up' | 'down'>;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'volume';
type SortDirection = 'asc' | 'desc';

export const MarketTable: React.FC<MarketTableProps> = ({
  assets,
  onSelectAsset,
  watchlistSymbols,
  onToggleWatchlist,
  flashingSymbols,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('changePercent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const tabs = [
    { id: 'all', label: 'All Instruments' },
    { id: 'gainers', label: 'Top Gainers' },
    { id: 'losers', label: 'Top Losers' },
    { id: 'stocks', label: 'Equities' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Currencies' },
    { id: 'futures', label: 'Commodities' },
    { id: 'bonds', label: 'Bonds' },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Filter by tab
    if (activeTab === 'gainers') {
      result = result.filter((a) => a.changePercent > 0);
    } else if (activeTab === 'losers') {
      result = result.filter((a) => a.changePercent < 0);
    } else if (activeTab !== 'all') {
      result = result.filter((a) => a.category === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'symbol') {
        comparison = a.symbol.localeCompare(b.symbol);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'changePercent') {
        comparison = a.changePercent - b.changePercent;
      } else if (sortField === 'volume') {
        comparison = a.volume.localeCompare(b.volume);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [assets, activeTab, searchQuery, sortField, sortDirection]);

  // Micro sparkline renderer for row
  const renderRowSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    });

    const pathData = `M ${coords.join(' L ')}`;
    const strokeColor = isPositive ? '#089981' : '#F23645';

    return (
      <svg className="w-20 h-6 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Strong Buy':
        return <span className="text-[#089981] font-bold text-xs bg-[#E7F6F3] px-2 py-0.5 rounded">Strong Buy</span>;
      case 'Buy':
        return <span className="text-[#089981] font-semibold text-xs bg-[#E7F6F3]/60 px-2 py-0.5 rounded">Buy</span>;
      case 'Neutral':
        return <span className="text-[#6A7185] font-medium text-xs bg-[#F0F3FA] px-2 py-0.5 rounded">Neutral</span>;
      case 'Sell':
        return <span className="text-[#F23645] font-semibold text-xs bg-[#FDECEE]/60 px-2 py-0.5 rounded">Sell</span>;
      case 'Strong Sell':
        return <span className="text-[#F23645] font-bold text-xs bg-[#FDECEE] px-2 py-0.5 rounded">Strong Sell</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white border border-[#E0E3EB] rounded-2xl overflow-hidden shadow-xs my-6">
      
      {/* Table Toolbar Header */}
      <div className="p-4 sm:p-5 border-b border-[#E0E3EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#131722]">
              Market Screener & Real-Time Quotes
            </h2>
            <p className="text-xs text-[#6A7185]">
              Sorted tabular data with instant technical sentiment and live volume metrics
            </p>
          </div>

          {/* Table quick search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#6A7185] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter table symbols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F0F3FA] focus:bg-white rounded-lg border border-[#E0E3EB] focus:outline-none focus:ring-2 focus:ring-[#2962FF] text-[#131722]"
            />
          </div>
        </div>

        {/* Tab segmented buttons */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#131722] text-white shadow-xs'
                    : 'text-[#6A7185] hover:text-[#131722] hover:bg-[#F0F3FA]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Component */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FD] border-b border-[#E0E3EB] text-[11px] font-bold text-[#6A7185] uppercase tracking-wider">
              <th className="py-3 px-4 pl-6 text-left">
                <button
                  onClick={() => handleSort('symbol')}
                  className="flex items-center gap-1 hover:text-[#131722] focus:outline-none"
                >
                  <span>Symbol & Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">
                <button
                  onClick={() => handleSort('price')}
                  className="inline-flex items-center gap-1 hover:text-[#131722] focus:outline-none ml-auto"
                >
                  <span>Last Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">Chg ($)</th>
              <th className="py-3 px-4 text-right">
                <button
                  onClick={() => handleSort('changePercent')}
                  className="inline-flex items-center gap-1 hover:text-[#131722] focus:outline-none ml-auto"
                >
                  <span>% Chg</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 text-right hidden md:table-cell">24h High / Low</th>
              <th className="py-3 px-4 text-right hidden lg:table-cell">
                <button
                  onClick={() => handleSort('volume')}
                  className="inline-flex items-center gap-1 hover:text-[#131722] focus:outline-none ml-auto"
                >
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 text-center hidden sm:table-cell">Technical</th>
              <th className="py-3 px-4 text-center hidden xl:table-cell">1D Trend</th>
              <th className="py-3 px-4 pr-6 text-right">Terminal</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E0E3EB]">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#6A7185] text-sm">
                  No market instruments found matching "{searchQuery}".
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isPositive = asset.changePercent >= 0;
                const isWatchlisted = watchlistSymbols.has(asset.symbol);
                const flashState = flashingSymbols[asset.symbol];

                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => onSelectAsset(asset)}
                    className={`h-12 hover:bg-[#F8F9FD] cursor-pointer transition-colors duration-150 group ${
                      flashState === 'up'
                        ? 'bg-[#E7F6F3]'
                        : flashState === 'down'
                        ? 'bg-[#FDECEE]'
                        : ''
                    }`}
                  >
                    {/* Symbol & Name Column */}
                    <td className="py-3 px-4 pl-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(asset.symbol);
                          }}
                          className="text-[#C3C5D8] hover:text-[#2962FF] focus:outline-none"
                          title="Watchlist"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isWatchlisted ? 'fill-[#2962FF] text-[#2962FF]' : ''
                            }`}
                          />
                        </button>
                        
                        <div className="w-6 h-6 rounded-full bg-[#131722] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {asset.symbol.slice(0, 2)}
                        </div>

                        <div>
                          <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF] transition-colors">
                            {asset.symbol}
                          </div>
                          <div className="text-xs text-[#6A7185] truncate max-w-[130px] sm:max-w-[200px]">
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-sm text-[#131722] tabular-nums">
                      {asset.currency === 'USD' ? '$' : ''}
                      {asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: asset.price < 10 ? 3 : 2,
                        maximumFractionDigits: asset.price < 10 ? 3 : 2,
                      })}
                      {asset.currency === '%' ? '%' : ''}
                    </td>

                    {/* Delta $ Column */}
                    <td className="py-3 px-4 text-right font-mono text-xs tabular-nums">
                      <span className={isPositive ? 'text-[#089981]' : 'text-[#F23645]'}>
                        {isPositive ? '+' : ''}{asset.change.toFixed(2)}
                      </span>
                    </td>

                    {/* % Chg Badge Column */}
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold tabular-nums ${
                          isPositive
                            ? 'bg-[#E7F6F3] text-[#089981]'
                            : 'bg-[#FDECEE] text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* 24h High / Low */}
                    <td className="py-3 px-4 text-right font-mono text-xs text-[#6A7185] tabular-nums hidden md:table-cell">
                      <span>{asset.low24h.toLocaleString()}</span>
                      <span className="mx-1 text-[#C3C5D8]">-</span>
                      <span>{asset.high24h.toLocaleString()}</span>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-4 text-right font-mono text-xs text-[#131722] tabular-nums hidden lg:table-cell">
                      {asset.volume}
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3 px-4 text-center hidden sm:table-cell">
                      {getRatingBadge(asset.rating)}
                    </td>

                    {/* 1D Sparkline */}
                    <td className="py-3 px-4 text-center hidden xl:table-cell">
                      <div className="flex justify-center">
                        {renderRowSparkline(asset.sparkline, isPositive)}
                      </div>
                    </td>

                    {/* Terminal Launch Action */}
                    <td className="py-3 px-4 pr-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset);
                        }}
                        className="p-1.5 rounded-lg bg-[#F0F3FA] text-[#6A7185] hover:text-[#2962FF] hover:bg-[#2962FF]/10 transition-colors inline-flex items-center"
                        title="Open Interactive Chart"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3.5 bg-[#F8F9FD] border-t border-[#E0E3EB] flex items-center justify-between text-xs text-[#6A7185]">
        <span>Showing {filteredAssets.length} of {assets.length} instruments</span>
        <span className="font-mono">Streaming 1-second price delta quotes</span>
      </div>

    </div>
  );
};
