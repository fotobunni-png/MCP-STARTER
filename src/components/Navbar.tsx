import React from 'react';
import { Search, Globe, Bookmark, TrendingUp, Bell } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  activeNavTab,
  setActiveNavTab,
}) => {
  const navItems = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-white/95 backdrop-blur-md border-b border-[#E0E3EB]">
      <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand & Search Pill */}
        <div className="flex items-center gap-5 shrink-0">
          {/* TradingView Brand Mark */}
          <button 
            onClick={() => setActiveNavTab('Markets')} 
            className="flex items-center gap-2 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2962ff] rounded-md"
          >
            {/* TradingView iconic geometric logo icon */}
            <div className="w-8 h-8 rounded-lg bg-[#131722] flex items-center justify-center p-1 shadow-sm transition-transform group-hover:scale-105">
              <svg viewBox="0 0 36 28" fill="none" className="w-6 h-5">
                <path d="M0 24V4C0 1.79086 1.79086 0 4 0H8C10.2091 0 12 1.79086 12 4V24C12 26.2091 10.2091 28 8 28H4C1.79086 28 0 26.2091 0 24Z" fill="#2962FF"/>
                <path d="M12 16V4C12 1.79086 13.7909 0 16 0H20C22.2091 0 24 1.79086 24 4V16C24 18.2091 22.2091 20 20 20H16C13.7909 20 12 18.2091 12 16Z" fill="#FFFFFF"/>
                <path d="M24 24V10C24 7.79086 25.7909 6 28 6H32C34.2091 6 36 7.79086 36 10V24C36 26.2091 34.2091 28 32 28H28C25.7909 28 24 26.2091 24 24Z" fill="#2962FF"/>
              </svg>
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-[#131722]">
              TradingView
            </span>
          </button>

          {/* Search Pill Input */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2.5 h-[38px] px-3.5 bg-[#F0F3FA] hover:bg-[#E5E8EF] transition-all rounded-full border border-transparent hover:border-[#E0E3EB] focus:outline-none focus:ring-2 focus:ring-[#2962FF] text-[#6A7185] group w-44 md:w-56"
          >
            <Search className="w-4 h-4 text-[#6A7185] group-hover:text-[#131722] transition-colors" />
            <span className="text-[13px] font-normal text-[#6A7185] group-hover:text-[#131722] truncate">
              Search (Ctrl+K)
            </span>
            <kbd className="ml-auto hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 bg-white border border-[#E0E3EB] text-[#6A7185] rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeNavTab === item;
            return (
              <button
                key={item}
                onClick={() => setActiveNavTab(item)}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
                  isActive
                    ? 'text-[#2962FF] font-semibold'
                    : 'text-[#131722] hover:text-[#2962FF] hover:bg-[#F8F9FD]'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-[-17px] left-3.5 right-3.5 h-[2.5px] bg-[#2962FF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Live Market Badge, Watchlist & Get Started */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-full text-[#6A7185] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors"
            title="Search markets"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Live Market Pulse status indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E7F6F3] text-[#089981] text-xs font-medium border border-[#089981]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#089981]"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-wide uppercase">Markets Live</span>
          </div>

          {/* Language selector */}
          <button 
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#131722] hover:bg-[#F0F3FA] rounded-md transition-colors"
            title="Language: English"
          >
            <Globe className="w-3.5 h-3.5 text-[#6A7185]" />
            <span>EN</span>
          </button>

          {/* Watchlist Drawer Toggle */}
          <button
            onClick={onToggleWatchlist}
            className="relative p-2 rounded-full text-[#131722] hover:bg-[#F0F3FA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
            title="Toggle Watchlist"
          >
            <Bookmark className="w-4 h-4 text-[#131722]" />
            {watchlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#2962FF] text-white rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar / Simulated */}
          <div className="w-8 h-8 rounded-full bg-[#E0E3EB] flex items-center justify-center text-xs font-semibold text-[#131722] cursor-pointer hover:ring-2 hover:ring-[#2962FF] transition-all">
            FB
          </div>

          {/* Signature TradingView Gradient CTA Button */}
          <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#2962FF] to-[#7F22FE] hover:opacity-95 active:scale-[0.98] transition-all rounded-full shadow-sm whitespace-nowrap">
            Get started
          </button>
        </div>

      </div>
    </header>
  );
};
