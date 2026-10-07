import React, { useState } from 'react';
import { NewsItem } from '../types/market';
import { Newspaper, ExternalLink, Flame, Clock } from 'lucide-react';

interface MarketNewsFeedProps {
  news: NewsItem[];
  onSelectSymbol: (symbol: string) => void;
}

export const MarketNewsFeed: React.FC<MarketNewsFeedProps> = ({ news, onSelectSymbol }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter((n) => n.category === filter);

  return (
    <div className="w-full bg-white border border-[#E0E3EB] rounded-2xl p-5 my-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E0E3EB]">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#2962FF]" />
            <h2 className="font-display text-lg font-bold text-[#131722]">
              Market News & Global Macro Briefing
            </h2>
          </div>
          <p className="text-xs text-[#6A7185] mt-0.5">
            Curated coverage from financial wires, central bank releases, and institutional analysis
          </p>
        </div>

        {/* Filter buttons */}
        <div className="inline-flex p-0.5 bg-[#F0F3FA] rounded-lg border border-[#E0E3EB] self-start sm:self-auto">
          {[
            { id: 'all', label: 'All News' },
            { id: 'stocks', label: 'Equities' },
            { id: 'crypto', label: 'Digital Assets' },
            { id: 'economy', label: 'Macro' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filter === cat.id
                  ? 'bg-white text-[#131722] shadow-xs'
                  : 'text-[#6A7185] hover:text-[#131722]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="divide-y divide-[#E0E3EB]">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            className="py-4 hover:bg-[#F8F9FD] -mx-5 px-5 transition-colors group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="flex-1">
                {/* Metadata Row: Source · Time · Read time */}
                <div className="flex items-center gap-2 text-xs text-[#6A7185] mb-1.5">
                  <span className="font-bold text-[#131722]">{item.source}</span>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#9598A1]" />
                    <span>{item.timeAgo}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <span>{item.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-sm sm:text-base text-[#131722] group-hover:text-[#2962FF] transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="mt-1 text-xs text-[#434656] line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Related Tickers Tag Bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[11px] text-[#6A7185]">Mentioned:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.relatedSymbols.map((sym) => (
                      <button
                        key={sym}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSymbol(sym);
                        }}
                        className="px-2 py-0.5 rounded bg-[#F0F3FA] hover:bg-[#2962FF] hover:text-white text-[11px] font-mono font-bold text-[#131722] transition-colors"
                      >
                        ${sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sentiment badge */}
              <div className="shrink-0 self-start">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    item.sentiment === 'Bullish'
                      ? 'bg-[#E7F6F3] text-[#089981]'
                      : item.sentiment === 'Bearish'
                      ? 'bg-[#FDECEE] text-[#F23645]'
                      : 'bg-[#F0F3FA] text-[#6A7185]'
                  }`}
                >
                  {item.sentiment}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
