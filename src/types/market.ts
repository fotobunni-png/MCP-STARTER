export type AssetCategory = 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds' | 'heatmap';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface MarketAsset {
  symbol: string;
  name: string;
  category: 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';
  region: 'US' | 'Europe' | 'Asia' | 'Global';
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  rating: TechnicalRating;
  currency: string;
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  sparkline: number[];
  sector?: string;
  description: string;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'stocks' | 'crypto' | 'economy' | 'forex';
  relatedSymbols: string[];
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  readTime: string;
  summary: string;
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number; // in billions
  changePercent: number;
  price: number;
}
