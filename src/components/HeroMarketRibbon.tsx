import React from 'react';
import { AssetCategory } from '../types/market';
import { BarChart3, TrendingUp, Grid3X3, Flame, Clock, Sparkles } from 'lucide-react';

interface HeroMarketRibbonProps {
  selectedCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  marketStats: {
    totalVolume: string;
    gainersCount: number;
    losersCount: number;
  };
}

export const HeroMarketRibbon: React.FC<HeroMarketRibbonProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  marketStats,
}) => {
  const categories: { id: AssetCategory; label: string; icon?: React.ReactNode }[] = [
    { id: 'indices', label: 'Overview & Indices' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'futures', label: 'Futures & Commodities' },
    { id: 'bonds', label: 'Bonds' },
    { id: 'heatmap', label: 'Market Heatmap' },
  ];

  const regions = ['All Regions', 'US', 'Europe', 'Asia', 'Global'];

  return (
    <div className="w-full pt-6 pb-4 border-b border-[#E0E3EB] bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row with Title and Live Macro Ticker */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2962FF] uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-[#2962FF]"></span>
              <span>World Financial Markets</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#131722] tracking-tight">
              Markets overview
            </h1>
            <p className="mt-1 text-sm text-[#6A7185] max-w-2xl">
              Track real-time streaming quotes, global indices, high-beta crypto, currency pairs, and interactive sector depth.
            </p>
          </div>

          {/* Quick Macro Summary Card */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs bg-[#F0F3FA] px-3.5 py-2 rounded-xl border border-[#E0E3EB] shrink-0 self-start md:self-auto">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6A7185]" />
              <span className="text-[#6A7185]">Session:</span>
              <span className="font-semibold text-[#131722]">Regular Hours</span>
            </div>
            <span className="text-[#C3C5D8]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#6A7185]">Market breadth:</span>
              <span className="font-semibold text-[#089981] tabular-nums">+{marketStats.gainersCount} Up</span>
              <span className="text-[#6A7185]">/</span>
              <span className="font-semibold text-[#F23645] tabular-nums">-{marketStats.losersCount} Down</span>
            </div>
          </div>
        </div>

        {/* Category Pill Filter Strip */}
        <div className="flex items-center justify-between gap-4 pt-2 overflow-x-auto no-scrollbar">
          {/* Pill Container */}
          <div className="inline-flex items-center p-1 bg-[#F0F3FA] rounded-full border border-[#E0E3EB] shrink-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#2962FF] ${
                    isActive
                      ? 'bg-[#131722] text-white shadow-sm'
                      : 'text-[#131722] hover:text-[#2962FF] hover:bg-white/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Region selector filter buttons */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            {regions.map((reg) => {
              const isSelected = (reg === 'All Regions' && selectedRegion === '') || selectedRegion === reg;
              return (
                <button
                  key={reg}
                  onClick={() => onSelectRegion(reg === 'All Regions' ? '' : reg)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    isSelected
                      ? 'bg-[#E5E8EF] text-[#131722] font-semibold'
                      : 'text-[#6A7185] hover:text-[#131722] hover:bg-[#F0F3FA]'
                  }`}
                >
                  {reg}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
