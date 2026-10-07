import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#E0E3EB] mt-12 py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-8 border-b border-[#E0E3EB]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-[#131722] flex items-center justify-center p-0.5">
                <svg viewBox="0 0 36 28" fill="none" className="w-4 h-3.5">
                  <path d="M0 24V4C0 1.79086 1.79086 0 4 0H8C10.2091 0 12 1.79086 12 4V24C12 26.2091 10.2091 28 8 28H4C1.79086 28 0 26.2091 0 24Z" fill="#2962FF"/>
                  <path d="M12 16V4C12 1.79086 13.7909 0 16 0H20C22.2091 0 24 1.79086 24 4V16C24 18.2091 22.2091 20 20 20H16C13.7909 20 12 18.2091 12 16Z" fill="#FFFFFF"/>
                  <path d="M24 24V10C24 7.79086 25.7909 6 28 6H32C34.2091 6 36 7.79086 36 10V24C36 26.2091 34.2091 28 32 28H28C25.7909 28 24 26.2091 24 24Z" fill="#2962FF"/>
                </svg>
              </div>
              <span className="font-display font-bold text-sm text-[#131722]">
                TradingView
              </span>
            </div>
            <p className="text-xs text-[#6A7185] leading-relaxed">
              Look first / Then leap. World-class financial charting, market depth, and social investment intelligence.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#131722] mb-3">
              Markets
            </h4>
            <ul className="space-y-2 text-xs text-[#6A7185]">
              <li><a href="#stocks" className="hover:text-[#2962FF] transition-colors">Stocks Screener</a></li>
              <li><a href="#crypto" className="hover:text-[#2962FF] transition-colors">Crypto Coins</a></li>
              <li><a href="#forex" className="hover:text-[#2962FF] transition-colors">Forex Pairs</a></li>
              <li><a href="#indices" className="hover:text-[#2962FF] transition-colors">Global Indices</a></li>
              <li><a href="#futures" className="hover:text-[#2962FF] transition-colors">Futures & Energy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#131722] mb-3">
              Products
            </h4>
            <ul className="space-y-2 text-xs text-[#6A7185]">
              <li><span className="hover:text-[#2962FF] cursor-pointer">SuperCharts</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Pine Script™</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Stock Heatmap</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Economic Calendar</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Mobile Apps</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#131722] mb-3">
              Community
            </h4>
            <ul className="space-y-2 text-xs text-[#6A7185]">
              <li><span className="hover:text-[#2962FF] cursor-pointer">Trade Ideas</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Scripts & Indicators</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">House Rules</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Moderators</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Chatrooms</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#131722] mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-[#6A7185]">
              <li><span className="hover:text-[#2962FF] cursor-pointer">About Us</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Features & Pricing</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Careers</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Media Kit</span></li>
              <li><span className="hover:text-[#2962FF] cursor-pointer">Security Center</span></li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Risk Disclaimer */}
        <div className="pt-6 text-[11px] text-[#9598A1] leading-relaxed flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="max-w-4xl">
            Select market data provided by ICE Data Services, BATS, CME, and NYMEX. Quotes and simulated executions are intended for analytical review. Financial instruments carry substantial risks; past performance does not guarantee future results.
          </p>
          <div className="shrink-0 font-mono text-[11px] text-[#6A7185]">
            © {new Date().getFullYear()} TradingView, Inc. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
