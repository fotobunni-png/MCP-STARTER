/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AssetCategory, MarketAsset } from './types/market';
import {
  ALL_MARKET_ASSETS,
  MAJOR_INDICES,
  HEATMAP_DATA,
  MARKET_NEWS,
} from './data/marketData';
import { Navbar } from './components/Navbar';
import { HeroMarketRibbon } from './components/HeroMarketRibbon';
import { IndexCardsGrid } from './components/IndexCardsGrid';
import { MarketHeatmap } from './components/MarketHeatmap';
import { MarketTable } from './components/MarketTable';
import { MarketNewsFeed } from './components/MarketNewsFeed';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { SearchDialog } from './components/SearchDialog';
import { InteractiveChartModal } from './components/InteractiveChartModal';
import { Footer } from './components/Footer';

export default function App() {
  const [assets, setAssets] = useState<MarketAsset[]>(ALL_MARKET_ASSETS);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('indices');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [watchlistSymbols, setWatchlistSymbols] = useState<Set<string>>(
    new Set(['SPX', 'NDX', 'NVDA', 'BTCUSD', 'AAPL', 'XAUUSD'])
  );
  const [activeModalAsset, setActiveModalAsset] = useState<MarketAsset | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [activeNavTab, setActiveNavTab] = useState<string>('Markets');
  const [flashingSymbols, setFlashingSymbols] = useState<Record<string, 'up' | 'down'>>({});

  // Real-time market tick simulator (generates subtle realistic live price ticks every 2.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 1 to 2 random assets to tick
      const randomIndex = Math.floor(Math.random() * assets.length);
      const target = assets[randomIndex];
      if (!target) return;

      const deltaPercent = (Math.random() * 0.4 - 0.19) / 100; // -0.19% to +0.21%
      const priceDelta = target.price * deltaPercent;
      const newPrice = Number((target.price + priceDelta).toFixed(target.price < 10 ? 4 : 2));
      const direction: 'up' | 'down' = priceDelta >= 0 ? 'up' : 'down';

      // Update assets
      setAssets((prev) =>
        prev.map((item, idx) => {
          if (idx !== randomIndex) return item;
          const newSparkline = [...item.sparkline.slice(1), newPrice];
          const newHigh = Math.max(item.high24h, newPrice);
          const newLow = Math.min(item.low24h, newPrice);
          const newChange = Number((item.change + priceDelta).toFixed(2));
          const newChangePct = Number((item.changePercent + deltaPercent * 100).toFixed(2));

          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePct,
            high24h: newHigh,
            low24h: newLow,
            sparkline: newSparkline,
          };
        })
      );

      // Flash pulse state
      setFlashingSymbols((prev) => ({ ...prev, [target.symbol]: direction }));
      setTimeout(() => {
        setFlashingSymbols((prev) => {
          const next = { ...prev };
          delete next[target.symbol];
          return next;
        });
      }, 700);
    }, 2400);

    return () => clearInterval(interval);
  }, [assets.length]);

  // Keep modal asset synchronized with live tick price
  useEffect(() => {
    if (activeModalAsset) {
      const live = assets.find((a) => a.symbol === activeModalAsset.symbol);
      if (live && live.price !== activeModalAsset.price) {
        setActiveModalAsset(live);
      }
    }
  }, [assets, activeModalAsset]);

  // Global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  };

  const handleSelectSymbol = (symbol: string) => {
    const found = assets.find((a) => a.symbol === symbol);
    if (found) {
      setActiveModalAsset(found);
    }
  };

  // Filtered cards for the top cards grid
  const displayedCards = useMemo(() => {
    if (selectedCategory === 'heatmap') {
      return MAJOR_INDICES;
    }
    if (selectedCategory === 'indices') {
      return MAJOR_INDICES;
    }
    const categoryMatches = assets.filter((a) => a.category === selectedCategory);
    if (categoryMatches.length >= 6) {
      return categoryMatches.slice(0, 6);
    }
    return [...categoryMatches, ...MAJOR_INDICES].slice(0, 6);
  }, [selectedCategory, assets]);

  // Filtered assets by region if selected
  const regionFilteredAssets = useMemo(() => {
    if (!selectedRegion) return assets;
    return assets.filter((a) => a.region === selectedRegion);
  }, [assets, selectedRegion]);

  // Market Breadth metrics
  const marketStats = useMemo(() => {
    const gainers = assets.filter((a) => a.changePercent > 0).length;
    const losers = assets.filter((a) => a.changePercent < 0).length;
    return {
      totalVolume: '$2.48T',
      gainersCount: gainers,
      losersCount: losers,
    };
  }, [assets]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-[#131722]">
      {/* Top Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen((prev) => !prev)}
        watchlistCount={watchlistSymbols.size}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
      />

      {/* Main Markets Viewport */}
      <main className="flex-1">
        {/* Market Title and Pill Category Strip */}
        <HeroMarketRibbon
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => setSelectedRegion(reg)}
          marketStats={marketStats}
        />

        {/* Major Overview Index Cards Grid */}
        <IndexCardsGrid
          assets={displayedCards}
          onSelectAsset={(asset) => setActiveModalAsset(asset)}
          watchlistSymbols={watchlistSymbols}
          onToggleWatchlist={handleToggleWatchlist}
          flashingSymbols={flashingSymbols}
        />

        {/* Content sections based on category */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* If Heatmap or Overview is selected, show TradingView S&P 500 Heatmap */}
          {(selectedCategory === 'heatmap' || selectedCategory === 'indices') && (
            <MarketHeatmap
              items={HEATMAP_DATA}
              onSelectSymbol={handleSelectSymbol}
            />
          )}

          {/* Market Screener & Quotes Data Table */}
          <MarketTable
            assets={regionFilteredAssets}
            onSelectAsset={(asset) => setActiveModalAsset(asset)}
            watchlistSymbols={watchlistSymbols}
            onToggleWatchlist={handleToggleWatchlist}
            flashingSymbols={flashingSymbols}
          />

          {/* Editorial News Feed */}
          <MarketNewsFeed
            news={MARKET_NEWS}
            onSelectSymbol={handleSelectSymbol}
          />

        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Full Interactive Chart Modal */}
      {activeModalAsset && (
        <InteractiveChartModal
          asset={activeModalAsset}
          onClose={() => setActiveModalAsset(null)}
          isWatchlisted={watchlistSymbols.has(activeModalAsset.symbol)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {/* Right-Rail Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlistSymbols}
        allAssets={assets}
        onSelectAsset={(asset) => {
          setActiveModalAsset(asset);
          setIsWatchlistOpen(false);
        }}
        onRemoveFromWatchlist={(sym) => handleToggleWatchlist(sym)}
        onAddToWatchlist={(sym) => {
          setWatchlistSymbols((prev) => new Set([...prev, sym]));
        }}
      />

      {/* Global Quick Search Dialog (Cmd+K) */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        onSelectAsset={(asset) => setActiveModalAsset(asset)}
      />
    </div>
  );
}
