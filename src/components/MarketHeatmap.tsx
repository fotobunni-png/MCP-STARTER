import React, { useState } from 'react';
import { HeatmapItem, MarketAsset } from '../types/market';
import { ArrowUpRight, ArrowDownRight, Layers, Info } from 'lucide-react';

interface MarketHeatmapProps {
  items: HeatmapItem[];
  onSelectSymbol: (symbol: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ items, onSelectSymbol }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('All');
  const [hoveredItem, setHoveredItem] = useState<HeatmapItem | null>(null);

  // Group items by sector
  const sectors = Array.from(new Set(items.map((i) => i.sector)));

  const filteredItems = selectedSectorFilter === 'All' 
    ? items 
    : items.filter((i) => i.sector === selectedSectorFilter);

  // Group filtered items by sector
  const itemsBySector: Record<string, HeatmapItem[]> = {};
  filteredItems.forEach((item) => {
    if (!itemsBySector[item.sector]) {
      itemsBySector[item.sector] = [];
    }
    itemsBySector[item.sector].push(item);
  });

  // Calculate sector average returns
  const sectorAverages = sectors.map((sec) => {
    const secItems = items.filter((i) => i.sector === sec);
    const avg = secItems.reduce((acc, curr) => acc + curr.changePercent, 0) / (secItems.length || 1);
    return { sector: sec, avg, count: secItems.length };
  });

  const getTileColor = (changePercent: number) => {
    if (changePercent >= 3.0) return 'bg-[#089981] text-white';
    if (changePercent >= 1.5) return 'bg-[#10b981] text-white';
    if (changePercent > 0) return 'bg-[#34d399] text-[#131722]';
    if (changePercent === 0) return 'bg-[#c3c5d8] text-[#131722]';
    if (changePercent > -1.5) return 'bg-[#f87171] text-white';
    if (changePercent > -3.0) return 'bg-[#ef4444] text-white';
    return 'bg-[#F23645] text-white';
  };

  return (
    <div className="w-full bg-white border border-[#E0E3EB] rounded-2xl p-5 my-6 shadow-xs">
      
      {/* Header with Title, Controls & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E0E3EB]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2962FF]" />
            <h2 className="font-display text-lg font-bold text-[#131722]">
              S&P 500 Stock Heatmap
            </h2>
          </div>
          <p className="text-xs text-[#6A7185] mt-0.5">
            Tile dimensions reflect market capitalization; color represents percentage return
          </p>
        </div>

        {/* Sector and Timeframe toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sector dropdown/filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#6A7185] hidden sm:inline">Sector:</span>
            <select
              value={selectedSectorFilter}
              onChange={(e) => setSelectedSectorFilter(e.target.value)}
              className="bg-[#F0F3FA] text-[#131722] text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E0E3EB] focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
            >
              <option value="All">All Sectors ({items.length})</option>
              {sectors.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Timeframe pill selector */}
          <div className="inline-flex p-0.5 bg-[#F0F3FA] rounded-lg border border-[#E0E3EB]">
            {(['1D', '1W', '1M'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTimeframe === tf
                    ? 'bg-white text-[#131722] shadow-xs'
                    : 'text-[#6A7185] hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Performance Ribbon */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar border-b border-[#E0E3EB]/70">
        <span className="text-[11px] font-bold text-[#6A7185] uppercase tracking-wider shrink-0">
          Sectors:
        </span>
        {sectorAverages.map(({ sector, avg }) => {
          const isPos = avg >= 0;
          return (
            <button
              key={sector}
              onClick={() => setSelectedSectorFilter(selectedSectorFilter === sector ? 'All' : sector)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedSectorFilter === sector
                  ? 'border-[#2962FF] bg-[#2962FF]/10 text-[#2962FF]'
                  : 'border-[#E0E3EB] bg-[#F8F9FD] text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              <span>{sector}</span>
              <span className={`font-mono text-[11px] font-bold tabular-nums ${isPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                {isPos ? '+' : ''}{avg.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Heatmap Treemap Visualization */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {Object.entries(itemsBySector).map(([sectorName, secItems]) => {
          // Sort items in sector by market cap descending
          const sorted = [...secItems].sort((a, b) => b.marketCap - a.marketCap);
          const totalSecCap = sorted.reduce((sum, item) => sum + item.marketCap, 0);

          return (
            <div
              key={sectorName}
              className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-xl p-3 flex flex-col"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E0E3EB]/80">
                <span className="font-bold text-xs text-[#131722] truncate">
                  {sectorName}
                </span>
                <span className="font-mono text-[11px] text-[#6A7185] tabular-nums">
                  ${(totalSecCap / 1000).toFixed(1)}T
                </span>
              </div>

              {/* Tiles in this sector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
                {sorted.map((item, idx) => {
                  const isTopItem = idx === 0 && sorted.length > 2;
                  const isPositive = item.changePercent >= 0;
                  const colorClass = getTileColor(item.changePercent);

                  return (
                    <div
                      key={item.symbol}
                      onClick={() => onSelectSymbol(item.symbol)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`${isTopItem ? 'col-span-2 row-span-2' : 'col-span-1'} ${colorClass} rounded-lg p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-150 hover:brightness-110 hover:scale-[1.02] shadow-xs select-none min-h-[76px]`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-sm tracking-tight drop-shadow-xs">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] opacity-90 truncate max-w-[80px]">
                          {item.name}
                        </span>
                      </div>

                      <div className="mt-2">
                        <div className="font-mono text-xs font-extrabold tabular-nums drop-shadow-xs">
                          {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </div>
                        <div className="text-[10px] opacity-80 font-mono tabular-nums">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Legend Bar */}
      <div className="mt-4 pt-3 border-t border-[#E0E3EB] flex flex-wrap items-center justify-between text-xs text-[#6A7185] gap-3">
        <div className="flex items-center gap-1.5">
          <span>Performance Scale:</span>
          <div className="flex items-center gap-1">
            <span className="w-4 h-3 rounded bg-[#F23645]"></span>
            <span className="text-[11px] font-mono">&lt;-3%</span>
            <span className="w-4 h-3 rounded bg-[#f87171]"></span>
            <span className="w-4 h-3 rounded bg-[#c3c5d8]"></span>
            <span className="w-4 h-3 rounded bg-[#34d399]"></span>
            <span className="w-4 h-3 rounded bg-[#089981]"></span>
            <span className="text-[11px] font-mono">&gt;+3%</span>
          </div>
        </div>

        {hoveredItem ? (
          <div className="flex items-center gap-2 font-mono text-xs text-[#131722] bg-[#F0F3FA] px-2.5 py-1 rounded-md">
            <span className="font-bold">{hoveredItem.symbol}</span>
            <span>·</span>
            <span>{hoveredItem.name}</span>
            <span>·</span>
            <span className="font-semibold">${hoveredItem.price.toFixed(2)}</span>
            <span>·</span>
            <span className={hoveredItem.changePercent >= 0 ? 'text-[#089981] font-bold' : 'text-[#F23645] font-bold'}>
              {hoveredItem.changePercent >= 0 ? '+' : ''}{hoveredItem.changePercent.toFixed(2)}%
            </span>
            <span>·</span>
            <span className="text-[#6A7185]">Mkt Cap: ${hoveredItem.marketCap}B</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-[#6A7185]">
            <Info className="w-3.5 h-3.5" />
            <span>Hover or tap any stock square to reveal depth and load chart</span>
          </div>
        )}
      </div>

    </div>
  );
};
