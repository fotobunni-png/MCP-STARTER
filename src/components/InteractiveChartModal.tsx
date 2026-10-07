import React, { useState, useMemo } from 'react';
import { MarketAsset, CandleData } from '../types/market';
import { generateCandles } from '../data/marketData';
import {
  X,
  TrendingUp,
  BarChart2,
  LineChart,
  Sliders,
  Star,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  Share2
} from 'lucide-react';

interface InteractiveChartModalProps {
  asset: MarketAsset;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
}

export const InteractiveChartModal: React.FC<InteractiveChartModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  // Generate realistic candles based on current price and timeframe
  const candles = useMemo(() => {
    return generateCandles(asset.price, 36, timeframe);
  }, [asset.symbol, asset.price, timeframe]);

  // Compute Moving Average (SMA 10)
  const smaPoints = useMemo(() => {
    const period = 7;
    return candles.map((c, idx) => {
      if (idx < period - 1) return null;
      const slice = candles.slice(idx - period + 1, idx + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / period;
      return avg;
    });
  }, [candles]);

  // SVG dimensions
  const width = 840;
  const height = 360;
  const padding = { top: 20, right: 65, bottom: 45, left: 15 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map((c) => c.volume));

  const getY = (val: number) => {
    return padding.top + chartH - ((val - minPrice) / priceRange) * chartH;
  };

  const getX = (idx: number) => {
    return padding.left + (idx / (candles.length - 1)) * chartW;
  };

  // Hovered or latest candle
  const activeCandle = hoveredIndex !== null && candles[hoveredIndex]
    ? candles[hoveredIndex]
    : candles[candles.length - 1];

  const handleOrder = (type: 'BUY' | 'SELL') => {
    setOrderNotification(`Simulated ${type} order for 10 shares of ${asset.symbol} filled at $${asset.price.toFixed(2)}`);
    setTimeout(() => {
      setOrderNotification(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Container Modal */}
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl border border-[#E0E3EB] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-[#E0E3EB] flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            {/* Symbol Badge */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs"
              style={{ backgroundColor: asset.badgeBgColor || '#131722' }}
            >
              {asset.badgeText || asset.symbol.slice(0, 3)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-xl text-[#131722] tracking-tight">
                  {asset.symbol}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0F3FA] text-[#6A7185] uppercase">
                  {asset.category}
                </span>
                <button
                  onClick={() => onToggleWatchlist(asset.symbol)}
                  className="p-1 rounded-md text-[#9598A1] hover:text-[#2962FF] transition-colors"
                  title="Watchlist"
                >
                  <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-[#2962FF] text-[#2962FF]' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-[#6A7185] truncate max-w-md">
                {asset.name} · {asset.region} Market · Currency: {asset.currency}
              </p>
            </div>
          </div>

          {/* Live Price and Change Pill */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-mono text-2xl font-extrabold text-[#131722] tabular-nums">
                {asset.currency === 'USD' ? '$' : ''}
                {asset.price.toLocaleString(undefined, {
                  minimumFractionDigits: asset.price < 10 ? 3 : 2,
                  maximumFractionDigits: asset.price < 10 ? 3 : 2,
                })}
              </div>
              <div className="flex items-center justify-end gap-1 text-xs font-mono font-bold">
                <span className={asset.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}>
                  {asset.changePercent >= 0 ? '+' : ''}{asset.change.toFixed(2)} ({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#6A7185] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors"
              title="Close terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Timeframe + Chart Type + Indicators */}
        <div className="px-5 py-2.5 bg-[#F8F9FD] border-b border-[#E0E3EB] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Timeframes */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E0E3EB]">
            {['1D', '5D', '1M', '3M', '1Y', 'ALL'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                  timeframe === tf
                    ? 'bg-[#131722] text-white shadow-xs'
                    : 'text-[#6A7185] hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicator toggles & Chart type */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E0E3EB]">
              <button
                onClick={() => setChartType('candle')}
                className={`p-1 rounded flex items-center gap-1 font-semibold ${
                  chartType === 'candle' ? 'bg-[#F0F3FA] text-[#2962FF]' : 'text-[#6A7185]'
                }`}
                title="Candlestick Chart"
              >
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">Candles</span>
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-1 rounded flex items-center gap-1 font-semibold ${
                  chartType === 'line' ? 'bg-[#F0F3FA] text-[#2962FF]' : 'text-[#6A7185]'
                }`}
                title="Line Chart"
              >
                <LineChart className="w-4 h-4" />
                <span className="hidden sm:inline">Line</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSMA(!showSMA)}
                className={`px-2 py-1 rounded-md border font-semibold transition-colors ${
                  showSMA
                    ? 'border-[#2962FF] bg-[#2962FF]/10 text-[#2962FF]'
                    : 'border-[#E0E3EB] bg-white text-[#6A7185]'
                }`}
              >
                SMA (7)
              </button>
              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`px-2 py-1 rounded-md border font-semibold transition-colors ${
                  showVolume
                    ? 'border-[#2962FF] bg-[#2962FF]/10 text-[#2962FF]'
                    : 'border-[#E0E3EB] bg-white text-[#6A7185]'
                }`}
              >
                Volume
              </button>
            </div>
          </div>

          {/* Live Simulated Order Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOrder('BUY')}
              className="px-3.5 py-1.5 rounded-lg bg-[#089981] hover:bg-[#07856e] text-white font-bold transition-all shadow-xs active:scale-95"
            >
              BUY ${(asset.price).toFixed(2)}
            </button>
            <button
              onClick={() => handleOrder('SELL')}
              className="px-3.5 py-1.5 rounded-lg bg-[#F23645] hover:bg-[#d82a39] text-white font-bold transition-all shadow-xs active:scale-95"
            >
              SELL ${(asset.price).toFixed(2)}
            </button>
          </div>
        </div>

        {/* Order Notification Banner */}
        {orderNotification && (
          <div className="px-5 py-2 bg-[#E7F6F3] border-b border-[#089981]/30 text-[#089981] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{orderNotification}</span>
          </div>
        )}

        {/* Chart Viewport & Crosshair HUD */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
          {/* OHLCV Crosshair Display Header */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono mb-2 bg-[#F0F3FA] px-3 py-1.5 rounded-lg border border-[#E0E3EB]">
            <span className="font-semibold text-[#131722]">{activeCandle?.time || 'Current'}</span>
            <span>O: <strong className="text-[#131722]">${activeCandle?.open}</strong></span>
            <span>H: <strong className="text-[#089981]">${activeCandle?.high}</strong></span>
            <span>L: <strong className="text-[#F23645]">${activeCandle?.low}</strong></span>
            <span>C: <strong className="text-[#131722]">${activeCandle?.close}</strong></span>
            <span>Vol: <strong className="text-[#6A7185]">{activeCandle?.volume.toLocaleString()}</strong></span>
          </div>

          {/* Interactive SVG Chart Canvas */}
          <div className="relative w-full overflow-hidden bg-white rounded-xl border border-[#E0E3EB]">
            <svg
              className="w-full h-[320px] sm:h-[360px] cursor-crosshair select-none"
              viewBox={`0 0 ${width} ${height}`}
              onMouseLeave={() => setHoveredIndex(null)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = ((e.clientX - rect.left) / rect.width) * width;
                const relX = mouseX - padding.left;
                const candleSpacing = chartW / (candles.length - 1);
                const idx = Math.round(relX / candleSpacing);
                if (idx >= 0 && idx < candles.length) {
                  setHoveredIndex(idx);
                }
              }}
            >
              {/* Horizontal Gridlines & Y-Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                const price = maxPrice - pct * priceRange;
                const y = padding.top + pct * chartH;
                return (
                  <g key={pct}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={width - padding.right}
                      y2={y}
                      stroke="#E0E3EB"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={width - padding.right + 8}
                      y={y + 4}
                      fill="#6A7185"
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                    >
                      ${price.toFixed(price < 10 ? 3 : 2)}
                    </text>
                  </g>
                );
              })}

              {/* Volume Bars */}
              {showVolume &&
                candles.map((c, i) => {
                  const x = getX(i);
                  const isUp = c.close >= c.open;
                  const volHeight = (c.volume / maxVolume) * 60;
                  const volY = height - padding.bottom - volHeight;
                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - 4}
                      y={volY}
                      width={8}
                      height={volHeight}
                      fill={isUp ? 'rgba(8, 153, 129, 0.22)' : 'rgba(242, 54, 69, 0.22)'}
                    />
                  );
                })}

              {/* Candlestick Mode */}
              {chartType === 'candle' &&
                candles.map((c, i) => {
                  const x = getX(i);
                  const isUp = c.close >= c.open;
                  const candleColor = isUp ? '#089981' : '#F23645';
                  const yHigh = getY(c.high);
                  const yLow = getY(c.low);
                  const yOpen = getY(c.open);
                  const yClose = getY(c.close);
                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);

                  return (
                    <g key={i}>
                      {/* Wick */}
                      <line
                        x1={x}
                        y1={yHigh}
                        x2={x}
                        y2={yLow}
                        stroke={candleColor}
                        strokeWidth="1.5"
                      />
                      {/* Body */}
                      <rect
                        x={x - 4}
                        y={bodyTop}
                        width={8}
                        height={bodyHeight}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })}

              {/* Line Mode */}
              {chartType === 'line' && (
                <path
                  d={`M ${candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' L ')}`}
                  fill="none"
                  stroke="#2962FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* SMA Line */}
              {showSMA && (
                <path
                  d={`M ${smaPoints
                    .map((val, i) => (val !== null ? `${getX(i)},${getY(val)}` : null))
                    .filter(Boolean)
                    .join(' L ')}`}
                  fill="none"
                  stroke="#FF9800"
                  strokeWidth="1.75"
                  strokeDasharray="4 2"
                />
              )}

              {/* Crosshair on Hover */}
              {hoveredIndex !== null && (
                <g>
                  {/* Vertical Crosshair Line */}
                  <line
                    x1={getX(hoveredIndex)}
                    y1={padding.top}
                    x2={getX(hoveredIndex)}
                    y2={height - padding.bottom}
                    stroke="#131722"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  {/* Horizontal Crosshair Line */}
                  <line
                    x1={padding.left}
                    y1={getY(candles[hoveredIndex].close)}
                    x2={width - padding.right}
                    y2={getY(candles[hoveredIndex].close)}
                    stroke="#131722"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  {/* Price marker on Y axis */}
                  <rect
                    x={width - padding.right}
                    y={getY(candles[hoveredIndex].close) - 9}
                    width={56}
                    height={18}
                    fill="#131722"
                    rx="3"
                  />
                  <text
                    x={width - padding.right + 4}
                    y={getY(candles[hoveredIndex].close) + 4}
                    fill="#FFFFFF"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                  >
                    ${candles[hoveredIndex].close.toFixed(2)}
                  </text>
                  {/* Time marker on X axis */}
                  <text
                    x={getX(hoveredIndex)}
                    y={height - padding.bottom + 16}
                    textAnchor="middle"
                    fill="#131722"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                  >
                    {candles[hoveredIndex].time}
                  </text>
                </g>
              )}

              {/* X-Axis Time Labels */}
              {candles.map((c, i) => {
                if (i % 6 === 0) {
                  return (
                    <text
                      key={`time-${i}`}
                      x={getX(i)}
                      y={height - padding.bottom + 16}
                      textAnchor="middle"
                      fill="#6A7185"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                    >
                      {c.time}
                    </text>
                  );
                }
                return null;
              })}
            </svg>
          </div>

          {/* Key Fundamentals & Statistics Grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-[#F8F9FD] p-2.5 rounded-xl border border-[#E0E3EB]">
              <span className="text-[11px] text-[#6A7185] block">24h High</span>
              <span className="font-mono text-sm font-bold text-[#131722] tabular-nums">
                ${asset.high24h.toLocaleString()}
              </span>
            </div>
            <div className="bg-[#F8F9FD] p-2.5 rounded-xl border border-[#E0E3EB]">
              <span className="text-[11px] text-[#6A7185] block">24h Low</span>
              <span className="font-mono text-sm font-bold text-[#131722] tabular-nums">
                ${asset.low24h.toLocaleString()}
              </span>
            </div>
            <div className="bg-[#F8F9FD] p-2.5 rounded-xl border border-[#E0E3EB]">
              <span className="text-[11px] text-[#6A7185] block">24h Volume</span>
              <span className="font-mono text-sm font-bold text-[#131722] tabular-nums">
                {asset.volume}
              </span>
            </div>
            <div className="bg-[#F8F9FD] p-2.5 rounded-xl border border-[#E0E3EB]">
              <span className="text-[11px] text-[#6A7185] block">Market Cap</span>
              <span className="font-mono text-sm font-bold text-[#131722] tabular-nums">
                {asset.marketCap || 'N/A'}
              </span>
            </div>
            <div className="bg-[#F8F9FD] p-2.5 rounded-xl border border-[#E0E3EB]">
              <span className="text-[11px] text-[#6A7185] block">Technical Rating</span>
              <span className="font-mono text-xs font-bold text-[#089981]">
                {asset.rating}
              </span>
            </div>
            <div className="bg-[#F8F9FD] p-2.5 rounded-xl border border-[#E0E3EB]">
              <span className="text-[11px] text-[#6A7185] block">Region / Exchange</span>
              <span className="font-mono text-xs font-bold text-[#131722]">
                {asset.region} / US
              </span>
            </div>
          </div>

          {/* Description & Intelligence note */}
          <div className="mt-4 p-3.5 bg-[#F0F3FA] rounded-xl text-xs text-[#434656] leading-relaxed">
            <span className="font-bold text-[#131722]">Profile: </span>
            {asset.description}
          </div>
        </div>

      </div>
    </div>
  );
};
