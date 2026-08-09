"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Send, Sparkles, Check, ArrowUpRight, Activity, TrendingUp, Brain, BarChart2, Database, Layers, Shield, Zap, Gauge, Workflow, Globe, Box, ShoppingBag, Building2, Ticket, Calendar, Users } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface Hotspot {
  id: number;
  top: string;
  left: string;
  label: { en: string; fr: string };
  desc: { en: string; fr: string };
}

interface ProjectData {
  num: string;
  title: string;
  metadata: {
    author: string;
    work: { en: string; fr: string };
    date: string;
    location: string;
    movement: { en: string; fr: string };
  };
  overview: { en: string; fr: string };
  capabilities: {
    icon: string;
    title: { en: string; fr: string };
    desc: { en: string; fr: string };
  }[];
  techStack: string[];
  impact: {
    value: string;
    label: { en: string; fr: string };
  }[];
  story: { en: string; fr: string }[];
  chamber: string;
  image: string;
  hotspots: Hotspot[];
  repo?: string;
  deployment?: string;
}

interface ChamberShowcaseProps {
  activeChamber: number;
  language?: "en" | "fr";
}

// ── SUBCOMPONENTS: HIGH-FIDELITY INTERACTIVE PROJECT DASHBOARDS ──

// Project I: Nifty Pulse Stock Analysis Dashboard
function NiftyPulseDashboard({
  liveNifty,
  liveChange,
  orderHistory,
  orderLogs,
}: {
  liveNifty: number;
  liveChange: number;
  orderHistory: number[];
  orderLogs: string[];
}) {
  const minVal = Math.min(...orderHistory) - 50;
  const maxVal = Math.max(...orderHistory) + 50;
  const range = maxVal - minVal || 1;
  const points = orderHistory
    .map((p, idx) => {
      const x = (idx / (orderHistory.length - 1)) * 260 + 20;
      const y = 100 - ((p - minVal) / range) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full h-full p-4 md:p-6 bg-[#040406] text-white flex flex-col justify-between font-mono text-[9px] md:text-[10px] select-none">
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span className="text-[#d4af37] font-bold tracking-wider">NIFTY PULSE v1.2</span>
        </div>
        <span className="text-[#eae6df]/45 tracking-widest text-[8px]">MARKET ANALYSIS: NSE INDIA</span>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-12 gap-4 flex-grow">
        {/* Left Column: AI Signals & Indicators */}
        <div className="col-span-4 border-r border-[#d4af37]/10 pr-2 flex flex-col justify-between">
          <div>
            <div className="text-[#d4af37]/60 text-[8px] font-bold tracking-wider mb-1">AI STRATEGY</div>
            <div className="text-xs font-black text-[#10b981] tracking-tight flex items-center gap-1">
              <span>⚡ STRONG BUY</span>
            </div>
            <div className="text-[7px] text-[#eae6df]/45 tracking-wider mt-0.5 uppercase">CONFIDENCE: 94%</div>
          </div>

          <div className="my-2 border-t border-[#d4af37]/5 pt-2">
            <div className="text-[#d4af37]/60 text-[8px] font-bold tracking-wider mb-1">INDICATORS</div>
            <div className="space-y-1 text-[#eae6df]/60 text-[7.5px] tracking-wide">
              <div className="flex justify-between"><span>RSI (14):</span><span className="text-[#10b981] font-bold">34.2 (OVERSOLD)</span></div>
              <div className="flex justify-between"><span>SMA (20):</span><span>23,980.50</span></div>
              <div className="flex justify-between"><span>SMA (50):</span><span>24,110.20</span></div>
            </div>
          </div>

          <div className="border-t border-[#d4af37]/5 pt-2">
            <div className="text-[#d4af37]/60 text-[8px] font-bold tracking-wider mb-1">MODEL ENGINE</div>
            <div className="text-[7.5px] text-[#eae6df]/50 leading-tight uppercase font-bold">LLAMA-3.3-70B</div>
            <div className="text-[6.5px] text-[#eae6df]/35 leading-tight mt-0.5">SENTIMENT: BULLISH</div>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="col-span-8 flex flex-col justify-between pl-1">
          {/* Top Ticker */}
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[8px] text-[#eae6df]/45 tracking-widest font-bold">NIFTY 50 INDEX</span>
            <div className="text-right">
              <span className="text-sm font-bold tracking-tight text-[#eae6df]">
                ₹{liveNifty.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-[8px] font-bold ml-1.5 ${liveChange >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                {liveChange >= 0 ? "▲" : "▼"} {liveChange >= 0 ? "+" : ""}{liveChange.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* SVG Stock Chart */}
          <div className="relative flex-grow min-h-[80px] bg-black/40 border border-[#d4af37]/10 rounded flex items-center justify-center p-1 overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 pointer-events-none opacity-[0.03]">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="border-b border-r border-[#d4af37]" />
              ))}
            </div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
              {points && (
                <path
                  d={`M 20,110 L ${points} L 280,110 Z`}
                  fill="url(#goldGrad)"
                  stroke="none"
                />
              )}
              <polyline
                fill="none"
                stroke="#d4af37"
                strokeWidth="1.5"
                points={points}
                className="drop-shadow-[0_0_4px_rgba(212,175,55,0.4)]"
              />
              {orderHistory.length > 0 && (
                <circle
                  cx={280}
                  cy={100 - ((orderHistory[orderHistory.length - 1] - minVal) / range) * 80}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#d4af37"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>

          {/* Volume bars */}
          <div className="h-5 flex items-end gap-[2px] mt-2 border-t border-[#d4af37]/5 pt-1 px-1">
            {orderHistory.map((h, i) => {
              const hRatio = ((h - minVal) / range) * 14 + 2;
              return (
                <div
                  key={i}
                  className="flex-grow bg-[#d4af37]/20 rounded-t-[1px]"
                  style={{ height: `${hRatio}px` }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Ticking log feed */}
      <div className="border-t border-[#d4af37]/20 mt-3 pt-2 bg-black/60 px-2 py-1.5 rounded h-14 overflow-hidden flex flex-col justify-end text-[7px] text-[#eae6df]/50 leading-relaxed font-mono">
        {orderLogs.slice(-2).map((log, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <span className="text-[#d4af37] shrink-0">{`>`}</span>
            <span className="truncate">{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Project II: Shiveshwar Textiles E-commerce Console
function CommerceHubDashboard({
  liveRevenue,
  liveInquiries,
  orderHistory,
  orderLogs,
}: {
  liveRevenue: number;
  liveInquiries: number;
  orderHistory: number[];
  orderLogs: string[];
}) {
  const minVal = Math.min(...orderHistory) - 100;
  const maxVal = Math.max(...orderHistory) + 100;
  const range = maxVal - minVal || 1;
  const points = orderHistory
    .map((p, idx) => {
      const x = (idx / (orderHistory.length - 1)) * 260 + 20;
      const y = 100 - ((p - minVal) / range) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full h-full p-4 md:p-6 bg-[#040406] text-white flex flex-col justify-between font-mono text-[9px] md:text-[10px] select-none">
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span className="text-[#d4af37] font-bold tracking-wider">SHIVESHWAR COMMERCE v2.0</span>
        </div>
        <span className="text-[#eae6df]/45 tracking-widest text-[8px]">ENGINE: ACTIVE</span>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-12 gap-4 flex-grow">
        {/* Left Column: Metrics & Inquiries */}
        <div className="col-span-4 border-r border-[#d4af37]/10 pr-2 flex flex-col justify-between">
          <div>
            <div className="text-[#d4af37]/60 text-[8px] font-bold tracking-wider mb-1">CONVERSION</div>
            <div className="text-xl md:text-2xl font-black text-[#eae6df] tracking-tight">3.42%</div>
            <div className="text-[7.5px] text-[#10b981] tracking-widest mt-0.5 uppercase font-bold">OPTIMIZED EDGE FUNNEL</div>
          </div>

          <div className="my-2 border-t border-[#d4af37]/5 pt-2">
            <div className="text-[#d4af37]/60 text-[8px] font-bold tracking-wider mb-1">LIVE INQUIRIES</div>
            <div className="text-[10px] font-bold text-[#10b981] tracking-wider uppercase">{liveInquiries} ACTIVE</div>
            <div className="text-[7.5px] text-[#eae6df]/35 leading-tight mt-0.5">RESPONSE RATE: 99.8%</div>
          </div>

          <div className="border-t border-[#d4af37]/5 pt-2">
            <div className="text-[#d4af37]/60 text-[8px] font-bold tracking-wider mb-1.5">REVENUE METRICS</div>
            <div className="space-y-1 text-[#eae6df]/60 text-[8px] tracking-wide">
              <div className="flex justify-between"><span>AOV:</span><span className="text-[#10b981] font-bold">$1,240</span></div>
              <div className="flex justify-between"><span>BOUNCE RATE:</span><span className="text-[#10b981] font-bold">22.4%</span></div>
              <div className="flex justify-between"><span>INVENTORY:</span><span>98.7% SYNCED</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="col-span-8 flex flex-col justify-between pl-1">
          {/* Top Ticker */}
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[8px] text-[#eae6df]/45 tracking-widest font-bold">GROSS REVENUE (USD)</span>
            <div className="text-right">
              <span className="text-sm font-bold tracking-tight text-[#eae6df]">
                ${liveRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[#10b981] text-[8px] font-bold ml-1.5">▲ +4.12%</span>
            </div>
          </div>

          {/* SVG Revenue Chart */}
          <div className="relative flex-grow min-h-[80px] bg-black/40 border border-[#d4af37]/10 rounded flex items-center justify-center p-1 overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 pointer-events-none opacity-[0.03]">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="border-b border-r border-[#d4af37]" />
              ))}
            </div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
              {points && (
                <path
                  d={`M 20,110 L ${points} L 280,110 Z`}
                  fill="url(#goldGrad)"
                  stroke="none"
                />
              )}
              <polyline
                fill="none"
                stroke="#d4af37"
                strokeWidth="1.5"
                points={points}
                className="drop-shadow-[0_0_4px_rgba(212,175,55,0.4)]"
              />
              {orderHistory.length > 0 && (
                <circle
                  cx={280}
                  cy={100 - ((orderHistory[orderHistory.length - 1] - minVal) / range) * 80}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#d4af37"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>

          {/* Transaction volumes */}
          <div className="h-5 flex items-end gap-[2px] mt-2 border-t border-[#d4af37]/5 pt-1 px-1">
            {orderHistory.map((h, i) => {
              const hRatio = ((h - minVal) / range) * 14 + 2;
              return (
                <div
                  key={i}
                  className="flex-grow bg-[#d4af37]/20 rounded-t-[1px]"
                  style={{ height: `${hRatio}px` }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Ticking log feed */}
      <div className="border-t border-[#d4af37]/20 mt-3 pt-2 bg-black/60 px-2 py-1.5 rounded h-14 overflow-hidden flex flex-col justify-end text-[7px] text-[#eae6df]/50 leading-relaxed font-mono">
        {orderLogs.slice(-2).map((log, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <span className="text-[#d4af37] shrink-0">{`>`}</span>
            <span className="truncate">{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Project III: Manasvi Fashion ERP Dashboard
function ManasviERPDashboard({
  fabricIndex,
  selectFabric,
}: {
  fabricIndex: number;
  selectFabric: (idx: number) => void;
}) {
  const fabrics = [
    { name: "MANASVI LUXE GEORGETTE", code: "MLG-450", status: "STITCHING", line: "Line #1", efficiency: "98%" },
    { name: "SURAT CHANDERI SILK", code: "SCS-600", status: "WEAVING", line: "Line #3", efficiency: "96%" },
    { name: "PREMIUM VELVET HEAVY", code: "PVH-800", status: "EMBROIDERY", line: "Line #2", efficiency: "99%" },
    { name: "COTTON ANARKALI WEAVE", code: "CAW-320", status: "CUTTING", line: "Line #4", efficiency: "97%" }
  ];

  return (
    <div className="w-full h-full p-4 md:p-6 bg-[#040406] text-white flex flex-col justify-between font-mono text-[9px] md:text-[10px] select-none">
      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span className="text-[#d4af37] font-bold tracking-wider">MANASVI PRODUCTION CONSOLE</span>
        </div>
        <span className="text-[#eae6df]/45 tracking-widest text-[8px]">ERP ENGINE: ONLINE</span>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-grow items-center">
        {/* Production Telemetry */}
        <div className="col-span-6 flex flex-col justify-between h-full py-1">
          <div className="border border-[#d4af37]/10 rounded bg-[#09090c] p-2 flex flex-col justify-center">
            <div className="text-[#d4af37]/60 text-[7.5px] font-bold tracking-wider mb-0.5">LINE EFFICIENCY</div>
            <div className="text-sm font-bold text-[#10b981]">{fabrics[fabricIndex].efficiency}</div>
            <div className="text-[6.5px] text-[#eae6df]/35 uppercase">OPTIMIZED THROUGHPUT</div>
          </div>

          <div className="border border-[#d4af37]/10 rounded bg-[#09090c] p-2 flex flex-col justify-center mt-2">
            <div className="text-[#d4af37]/60 text-[7.5px] font-bold tracking-wider mb-0.5">ACTIVE WORKERS</div>
            <div className="text-sm font-bold text-[#eae6df]">142 ACTIVE</div>
            <div className="text-[6.5px] text-[#eae6df]/35 uppercase">CROSS-SHIFT TIMING</div>
          </div>
        </div>

        {/* Apparel Batches List */}
        <div className="col-span-6 space-y-1.5 border-l border-[#d4af37]/10 pl-3 h-full flex flex-col justify-center">
          {fabrics.map((f, idx) => (
            <button
              key={idx}
              onClick={() => selectFabric(idx)}
              className={`w-full p-1.5 border text-left transition-all duration-300 rounded cursor-pointer ${
                idx === fabricIndex
                  ? "border-[#d4af37] bg-[#d4af37]/5"
                  : "border-white/5 bg-transparent hover:border-[#eae6df]/30"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`font-bold text-[8.5px] tracking-wide ${idx === fabricIndex ? "text-[#d4af37]" : "text-[#eae6df]"}`}>
                  {f.name}
                </span>
                <span className="text-[7px] text-[#eae6df]/40">{f.code}</span>
              </div>
              <div className="flex justify-between text-[7px] text-[#eae6df]/50 mt-0.5">
                <span>{f.line}</span>
                <span className="text-[#10b981] font-bold">{f.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#d4af37]/20 pt-2 flex justify-between text-[7px] text-[#eae6df]/45 font-mono">
        <div>PRODUCTION FLOW: <span className="text-[#10b981] font-bold">AUTOMATED SYNC</span></div>
        <div>YARN INVENTORY: <span className="text-white font-bold">98% ALLOCATED</span></div>
      </div>
    </div>
  );
}

// Project IV: Surat Textile Exhibition Spatial Console
function SuratTextileExhibitionDashboard() {
  return (
    <div className="w-full h-full p-4 md:p-6 bg-[#040406] text-white flex flex-col justify-between font-mono text-[9px] md:text-[10px] select-none">
      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span className="text-[#d4af37] font-bold tracking-wider">SURAT TEXTILE EXPOSITION</span>
        </div>
        <span className="text-[#eae6df]/45 tracking-widest text-[8px]">SPATIAL WEB CONSOLE</span>
      </div>

      {/* SVG Layout or WebGL Pipeline */}
      <div className="relative flex-grow border border-[#d4af37]/10 rounded bg-black/40 p-4 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 300 100">
          <line x1="45" y1="50" x2="105" y2="25" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="45" y1="50" x2="105" y2="75" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="145" y1="25" x2="205" y2="50" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="145" y1="75" x2="205" y2="50" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="245" y1="50" x2="275" y2="50" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />

          {/* WebGL Canvas */}
          <g>
            <circle cx="25" cy="50" r="13" fill="#09090c" stroke="#d4af37" strokeWidth="1.2" />
            <circle cx="25" cy="50" r="4" fill="#d4af37" />
            <text x="25" y="74" textAnchor="middle" fill="#eae6df" fontSize="5.5" fontWeight="bold">WEBGL ENGINE</text>
          </g>

          {/* Exhibit Directory */}
          <g>
            <rect x="105" y="13" width="40" height="24" rx="2" fill="#09090c" stroke="#d4af37" strokeWidth="1" />
            <text x="125" y="27" textAnchor="middle" fill="#eae6df" fontSize="5.5" fontWeight="bold">HALL DIRECTORY</text>
          </g>

          {/* Inquiry Port */}
          <g>
            <rect x="105" y="63" width="40" height="24" rx="2" fill="#09090c" stroke="#d4af37" strokeWidth="1" />
            <text x="125" y="77" textAnchor="middle" fill="#eae6df" fontSize="5.5" fontWeight="bold">INQUIRY PORT</text>
          </g>

          {/* Edge Middleware */}
          <g>
            <circle cx="225" cy="50" r="16" fill="#09090c" stroke="#d4af37" strokeWidth="1.5" />
            <polygon points="225,40 233,55 217,55" fill="none" stroke="#d4af37" strokeWidth="1" />
            <text x="225" y="77" textAnchor="middle" fill="#eae6df" fontSize="5.5" fontWeight="bold">VERCEL EDGE</text>
          </g>

          {/* User Interface */}
          <g>
            <circle cx="285" cy="50" r="10" fill="#09090c" stroke="#ffffff" strokeWidth="1.2" />
            <text x="285" y="70" textAnchor="middle" fill="#eae6df" fontSize="5.5" fontWeight="bold">USER WEB3D</text>
          </g>
        </svg>
      </div>

      <div className="border-t border-[#d4af37]/20 pt-2 flex justify-between text-[7px] text-[#eae6df]/45 font-mono">
        <div>VIRTUAL VISITORS: <span className="text-white font-bold">14,204 REG.</span></div>
        <div>CDN RESPONSE: <span className="text-[#d4af37] font-bold">99.9% SHADER CACHE</span></div>
      </div>
    </div>
  );
}

// Project V: Todi Ethnic Order Pipeline Dashboard
function TodiEthnicDashboard({
  activeInquiries,
  monthlyProduction,
  pipelineRevenue,
  orderHistory,
  orderLogs,
}: {
  activeInquiries: number;
  monthlyProduction: number;
  pipelineRevenue: number[];
  orderHistory: number[];
  orderLogs: string[];
}) {
  const maxRev = Math.max(...pipelineRevenue, 2.5);

  return (
    <div className="w-full h-full p-4 md:p-6 bg-[#040406] text-white flex flex-col justify-between font-mono text-[9px] md:text-[10px] select-none">
      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span className="text-[#d4af37] font-bold tracking-wider">TODI ETHNIC v1.0</span>
        </div>
        <span className="text-[#eae6df]/45 tracking-widest text-[8px]">ORDER PIPELINE: ACTIVE</span>
      </div>

      {/* 3 Metric cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="border border-[#d4af37]/15 rounded bg-[#09090c] p-2 text-center">
          <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-wider uppercase">Active Inquiries</div>
          <div className="text-lg font-black text-[#eae6df] mt-0.5">{activeInquiries}</div>
          <div className="text-[6px] text-[#eae6df]/35 uppercase tracking-wider">Live Leads</div>
        </div>
        <div className="border border-[#d4af37]/15 rounded bg-[#09090c] p-2 text-center">
          <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-wider uppercase">Monthly Prod.</div>
          <div className="text-lg font-black text-[#eae6df] mt-0.5">{monthlyProduction.toLocaleString()}</div>
          <div className="text-[6px] text-[#eae6df]/35 uppercase tracking-wider">Units/Month</div>
        </div>
        <div className="border border-[#d4af37]/15 rounded bg-[#09090c] p-2 text-center">
          <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-wider uppercase">Pipeline Rev.</div>
          <div className="text-lg font-black text-[#10b981] mt-0.5">₹{pipelineRevenue[pipelineRevenue.length - 1].toFixed(1)}Cr</div>
          <div className="text-[6px] text-[#eae6df]/35 uppercase tracking-wider">Quarterly Run</div>
        </div>
      </div>

      {/* Order Pipeline Status Bar */}
      <div className="border border-[#d4af37]/10 rounded bg-black/40 p-3 mb-3">
        <div className="text-[7px] text-[#d4af37]/60 font-bold tracking-widest uppercase mb-2">Order Pipeline</div>
        <div className="grid grid-cols-5 gap-2 text-[7px] text-center">
          {[
            { label: "Inquiry", pct: 85 },
            { label: "Sample", pct: 65 },
            { label: "Order", pct: 72 },
            { label: "Production", pct: 55 },
            { label: "Dispatch", pct: 38 },
          ].map((stage) => (
            <div key={stage.label}>
              <div className="h-14 flex items-end justify-center mb-1">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${stage.pct}%`,
                    backgroundColor:
                      stage.pct > 70
                        ? "rgba(184, 138, 11, 0.7)"
                        : stage.pct > 50
                        ? "rgba(184, 138, 11, 0.4)"
                        : "rgba(139, 26, 43, 0.5)",
                  }}
                />
              </div>
              <div className="text-[#eae6df]/60 font-bold">{stage.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Pipeline SVG bars */}
      <div className="flex-grow min-h-[40px] bg-black/40 border border-[#d4af37]/10 rounded p-2 mb-3">
        <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-widest uppercase mb-1.5">Revenue Pipeline (₹ Cr)</div>
        <div className="flex items-end gap-[3px] h-full">
          {pipelineRevenue.map((val, i) => {
            const hPct = (val / (maxRev + 0.3)) * 100;
            return (
              <div key={i} className="flex-grow flex flex-col items-center gap-0.5">
                <span className="text-[5.5px] text-[#eae6df]/40">{val.toFixed(1)}</span>
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${hPct}%`,
                    minHeight: "2px",
                    backgroundColor: val > 2.6 ? "rgba(139, 26, 43, 0.6)" : "rgba(184, 138, 11, 0.5)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticking log feed */}
      <div className="border-t border-[#d4af37]/20 pt-2 bg-black/60 px-2 py-1.5 rounded h-14 overflow-hidden flex flex-col justify-end text-[7px] text-[#eae6df]/50 leading-relaxed font-mono">
        {orderLogs.slice(-2).map((log, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <span className="text-[#d4af37] shrink-0">{`>`}</span>
            <span className="truncate">{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Project VI: Trivoxa Group Corporate Portal & Subsidiary Dashboard
function TrivoxaGroupDashboard() {
  return (
    <div className="w-full h-full p-4 md:p-6 bg-[#040406] text-white flex flex-col justify-between font-mono text-[9px] md:text-[10px] select-none">
      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span className="text-[#d4af37] font-bold tracking-wider">TRIVOXA GROUP v2.4</span>
        </div>
        <span className="text-[#eae6df]/45 tracking-widest text-[8px]">ENTERPRISE GATEWAY: ONLINE</span>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="border border-[#d4af37]/15 rounded bg-[#09090c] p-2 text-center">
          <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-wider uppercase">Active Subsidiaries</div>
          <div className="text-lg font-black text-[#eae6df] mt-0.5">8</div>
          <div className="text-[6px] text-[#eae6df]/35 uppercase tracking-wider">Global Entities</div>
        </div>
        <div className="border border-[#d4af37]/15 rounded bg-[#09090c] p-2 text-center">
          <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-wider uppercase">Cross-Sync Rate</div>
          <div className="text-lg font-black text-[#10b981] mt-0.5">+180%</div>
          <div className="text-[6px] text-[#eae6df]/35 uppercase tracking-wider">Efficiency Gain</div>
        </div>
        <div className="border border-[#d4af37]/15 rounded bg-[#09090c] p-2 text-center">
          <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-wider uppercase">Uptime SLA</div>
          <div className="text-lg font-black text-[#eae6df] mt-0.5">99.99%</div>
          <div className="text-[6px] text-[#eae6df]/35 uppercase tracking-wider">Enterprise Reliability</div>
        </div>
      </div>

      {/* Corporate Division Breakdown */}
      <div className="border border-[#d4af37]/10 rounded bg-black/40 p-3 mb-3">
        <div className="text-[7px] text-[#d4af37]/60 font-bold tracking-widest uppercase mb-2">Subsidiary Operations Stream</div>
        <div className="grid grid-cols-4 gap-2 text-[7px] text-center">
          {[
            { label: "Manufacturing", status: "98.4%" },
            { label: "Global Trade", status: "100%" },
            { label: "Logistics Hub", status: "99.1%" },
            { label: "Tech Ventures", status: "100%" },
          ].map((div, i) => (
            <div key={i} className="border border-white/5 rounded p-2 bg-[#08080a]">
              <div className="text-[#eae6df]/80 font-bold truncate mb-1">{div.label}</div>
              <div className="text-[#d4af37] font-mono text-[9px] font-bold">{div.status}</div>
              <div className="text-[6px] text-[#10b981] uppercase mt-0.5">● OPERATIONAL</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticking log feed */}
      <div className="border-t border-[#d4af37]/20 pt-2 bg-black/60 px-2 py-1.5 rounded h-14 overflow-hidden flex flex-col justify-end text-[7px] text-[#eae6df]/50 leading-relaxed font-mono">
        <div className="flex gap-2 items-start">
          <span className="text-[#d4af37] shrink-0">{`>`}</span>
          <span className="truncate">TRIVOXA CORE: SUBSIDIARY GATEWAY SYNC COMPLETED</span>
        </div>
        <div className="flex gap-2 items-start">
          <span className="text-[#d4af37] shrink-0">{`>`}</span>
          <span className="truncate">LOGISTICS PIPELINE: 12 EXPORT NODES VERIFIED</span>
        </div>
      </div>
    </div>
  );
}

// Project VII: Nuvent Event Management Platform Dashboard
function NuventDashboard() {
  return (
    <div className="w-full h-full p-4 md:p-6 bg-[#040406] text-white flex flex-col justify-between font-mono text-[9px] md:text-[10px] select-none">
      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Ticket className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span className="text-[#d4af37] font-bold tracking-wider">NUVENT EVENT SUITE v3.1</span>
        </div>
        <span className="text-[#eae6df]/45 tracking-widest text-[8px]">LIVE EVENT MONITOR: ACTIVE</span>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="border border-[#d4af37]/15 rounded bg-[#09090c] p-2 text-center">
          <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-wider uppercase">Check-In Latency</div>
          <div className="text-lg font-black text-[#10b981] mt-0.5">&lt;18ms</div>
          <div className="text-[6px] text-[#eae6df]/35 uppercase tracking-wider">QR Scanner Rate</div>
        </div>
        <div className="border border-[#d4af37]/15 rounded bg-[#09090c] p-2 text-center">
          <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-wider uppercase">Tickets Issued</div>
          <div className="text-lg font-black text-[#eae6df] mt-0.5">48,290</div>
          <div className="text-[6px] text-[#eae6df]/35 uppercase tracking-wider">Live Event Volume</div>
        </div>
        <div className="border border-[#d4af37]/15 rounded bg-[#09090c] p-2 text-center">
          <div className="text-[6.5px] text-[#d4af37]/60 font-bold tracking-wider uppercase">Attendee Engagement</div>
          <div className="text-lg font-black text-[#d4af37] mt-0.5">+240%</div>
          <div className="text-[6px] text-[#eae6df]/35 uppercase tracking-wider">Session Activity</div>
        </div>
      </div>

      {/* Live Venue & Spatial Schedule */}
      <div className="border border-[#d4af37]/10 rounded bg-black/40 p-3 mb-3">
        <div className="text-[7px] text-[#d4af37]/60 font-bold tracking-widest uppercase mb-2">Live Venue & Session Monitor</div>
        <div className="space-y-1.5 text-[7.5px]">
          <div className="flex justify-between items-center bg-[#08080a] p-1.5 rounded border border-white/5">
            <span className="text-[#eae6df]/90 font-bold">Main Stage Keynote</span>
            <span className="text-[#10b981] font-mono font-bold">LIVE (2,450 Attendees)</span>
          </div>
          <div className="flex justify-between items-center bg-[#08080a] p-1.5 rounded border border-white/5">
            <span className="text-[#eae6df]/90 font-bold">AI Tech Workshop B</span>
            <span className="text-[#d4af37] font-mono font-bold">CAPACITY 98%</span>
          </div>
        </div>
      </div>

      {/* Ticking log feed */}
      <div className="border-t border-[#d4af37]/20 pt-2 bg-black/60 px-2 py-1.5 rounded h-14 overflow-hidden flex flex-col justify-end text-[7px] text-[#eae6df]/50 leading-relaxed font-mono">
        <div className="flex gap-2 items-start">
          <span className="text-[#d4af37] shrink-0">{`>`}</span>
          <span className="truncate">NUVENT CHECK-IN: GATE 04 QR PASS VALIDATED (0.012s)</span>
        </div>
        <div className="flex gap-2 items-start">
          <span className="text-[#d4af37] shrink-0">{`>`}</span>
          <span className="truncate">SPATIAL SCHEDULE: KEYNOTE SESSION 02 COMMENCING</span>
        </div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Brain":
      return <Brain className="w-5 h-5 text-[#d4af37]" />;
    case "TrendingUp":
      return <TrendingUp className="w-5 h-5 text-[#d4af37]" />;
    case "Shield":
      return <Shield className="w-5 h-5 text-[#d4af37]" />;
    case "Zap":
      return <Zap className="w-5 h-5 text-[#d4af37]" />;
    case "Layers":
      return <Layers className="w-5 h-5 text-[#d4af37]" />;
    case "Box":
      return <Box className="w-5 h-5 text-[#d4af37]" />;
    case "Activity":
      return <Activity className="w-5 h-5 text-[#d4af37]" />;
    case "Gauge":
      return <Gauge className="w-5 h-5 text-[#d4af37]" />;
    case "Workflow":
      return <Workflow className="w-5 h-5 text-[#d4af37]" />;
    case "Database":
      return <Database className="w-5 h-5 text-[#d4af37]" />;
    case "Globe":
      return <Globe className="w-5 h-5 text-[#d4af37]" />;
    case "Check":
      return <Check className="w-5 h-5 text-[#d4af37]" />;
    case "BarChart2":
      return <BarChart2 className="w-5 h-5 text-[#d4af37]" />;
    case "Send":
      return <Send className="w-5 h-5 text-[#d4af37]" />;
    case "ShoppingBag":
      return <ShoppingBag className="w-5 h-5 text-[#d4af37]" />;
    case "Building2":
      return <Building2 className="w-5 h-5 text-[#d4af37]" />;
    case "Ticket":
      return <Ticket className="w-5 h-5 text-[#d4af37]" />;
    case "Calendar":
      return <Calendar className="w-5 h-5 text-[#d4af37]" />;
    case "Users":
      return <Users className="w-5 h-5 text-[#d4af37]" />;
    default:
      return <Sparkles className="w-5 h-5 text-[#d4af37]" />;
  }
};

export default function ChamberShowcase({ activeChamber, language = "en" }: ChamberShowcaseProps) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Live simulation states for Shiveshwar Textiles dashboard
  const [liveRevenue, setLiveRevenue] = useState(142405.00);
  const [orderHistory, setOrderHistory] = useState<number[]>([142100, 142250, 142150, 142350, 142300, 142400, 142380, 142405]);
  const [liveInquiries, setLiveInquiries] = useState(12);
  const [fabricIndex, setFabricIndex] = useState(0);
  const [orderLogs, setOrderLogs] = useState<string[]>([
    "LOOM SYSTEM: DIGITAL JACQUARD ONLINE",
    "CATALOG: MUGASILK JACQUARD CACHE REFRESHED",
    "API GATEWAY: STOCK METADATA SYNCED WITH LOOM CLOUD",
  ]);

  // Todi Ethnic specific states
  const [activeInquiries, setActiveInquiries] = useState(24);
  const [monthlyProduction, setMonthlyProduction] = useState(5000);
  const [pipelineRevenue, setPipelineRevenue] = useState<number[]>([2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.7, 2.8]);

  // Live ticking simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveRevenue((prev) => {
        const change = (Math.random() - 0.45) * 8;
        const nextPrice = prev + change;

        setOrderHistory((hist) => {
          const nextHist = [...hist.slice(1), nextPrice];
          return nextHist;
        });

        return nextPrice;
      });

      setLiveInquiries((prev) => {
        if (Math.random() > 0.8) {
          const change = Math.random() > 0.5 ? 1 : -1;
          return Math.max(8, Math.min(20, prev + change));
        }
        return prev;
      });


      if (Math.random() > 0.7) {
        let logTemplates = [
          "INVENTORY SYNC COMPLETE: 98.7% COHERENCE LEVEL",
          "API ENDPOINT REQUESTED: /v1/fabrics/catalog",
        ];
        if (activeChamber === 0) {
          logTemplates = [
            "FETCHING HISTORICAL DATA FOR INFY.NS...",
            "AI SIGNAL: STRONG BUY ON RELIANCE.NS (CONFIDENCE: 94%)",
            "API ENDPOINT REQUESTED: /api/market/indices",
            "AI SIGNAL: STRONG SELL ON TATASTEEL.NS (RSI OVERBOUGHT)",
            "INQUIRY INBOUND: STOCK ANALYSIS REQUEST FOR TCS.NS",
            "CACHE SYNC COMPLETE: 99.8% SUPABASE DATA INTEGRITY",
          ];
        } else if (activeChamber === 1) {
          logTemplates = [
            "ORDER #1405 PLACED: 50 METERS MUGASILK SILK",
            "NEW INQUIRY RECEIVED: ORGANIC COTTON STOCK DETAILS",
            "INVENTORY SYNC COMPLETE: 98.7% COHERENCE LEVEL",
            "LOOM #1: WARP SPEED ADJUSTED TO 95 RPM",
            "API ENDPOINT REQUESTED: /v1/fabrics/catalog",
            "ORDER #1406 PLACED: 120 METERS FINE LINEN",
          ];
        } else if (activeChamber === 2) {
          logTemplates = [
            "ERP LOG: BATCH PVH-800 STARTED ON STITCHING LINE 2",
            "YARN INVENTORY SYNC: GRADE A SILK RESERVE AT 98%",
            "PRODUCTION RATE: 1,200 METERS/MIN ACROSS LINES",
            "ERP UPDATE: STITCHING LINE 1 EFFICIENCY AT 98%",
            "DELIVERY PIPELINE: CONCORD BOOTHS PREPARED",
          ];
        } else if (activeChamber === 3) {
          logTemplates = [
            "EXHIBITING HALLS: 4 ACTIVE VIRTUAL SECTIONS ONLINE",
            "WEBGL PIPELINE: YARN LOOP TEXTURES LOADED (5.2ms)",
            "CDN STATS: 99.9% SHADER CACHE HIT RATE",
            "VIRTUAL DIRECTORY: /exhibitors/surat-looms SYNCED",
            "VISITOR COUNT: 14,204 LIVE REGISTRATIONS TRANSMITTED",
          ];
        } else if (activeChamber === 4) {
          logTemplates = [
            "INQUIRY #482: BRIDAL LEHENGA SET - GOLDEN ZARI WORK",
            "SAMPLE APPROVED: KANCHIPURAM SILK WITH GOLD THREAD",
            "PRODUCTION BATCH #204: 50 UNITS GOTA PATTI WORK",
            "DISPATCH TRIGGERED: ORDER #118 TO DUBAI MARKET",
            "NEW INQUIRY: CUSTOM SHERWANI WITH GOLD EMBROIDERY",
          ];
        }
        const randomLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
        setOrderLogs((prev) => [...prev.slice(1), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
      }
    }, 2000);

    // Todi Ethnic live simulation
    const todiTimer = setInterval(() => {
      if (activeChamber === 4) {
        setActiveInquiries((prev) => {
          if (Math.random() > 0.75) {
            return Math.max(18, Math.min(32, prev + (Math.random() > 0.5 ? 1 : -1)));
          }
          return prev;
        });
        setPipelineRevenue((prev) => {
          const change = (Math.random() - 0.45) * 0.12;
          const next = [...prev.slice(1), parseFloat((prev[prev.length - 1] + change).toFixed(2))];
          return next;
        });
      }
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(todiTimer);
    };
  }, [activeChamber]);

  // Sync state values on chamber transition to fit project profiles
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeChamber === 0) {
        setLiveRevenue(24142.05);
        setOrderHistory([24050, 24080, 24075, 24110, 24095, 24120, 24135, 24142.05]);
        setOrderLogs([
          "NIFTY SYSTEM: CONNECTED TO NSE NODE",
          "AI ENGINE: ANALYSIS RUN FOR NIFTY 50",
          "CACHE GATEWAY: RETRIEVING CACHED SECTIONS FROM SUPABASE",
        ]);
      } else if (activeChamber === 1) {
        setLiveRevenue(142405.00);
        setOrderHistory([142100, 142250, 142150, 142350, 142300, 142400, 142380, 142405]);
        setOrderLogs([
          "LOOM SYSTEM: DIGITAL JACQUARD ONLINE",
          "CATALOG: MUGASILK JACQUARD CACHE REFRESHED",
          "API GATEWAY: STOCK METADATA SYNCED WITH LOOM CLOUD",
        ]);
      } else if (activeChamber === 2) {
        setLiveRevenue(98.4);
        setOrderHistory([97.8, 98.1, 98.0, 98.2, 98.5, 98.3, 98.2, 98.4]);
        setOrderLogs([
          "ERP GATEWAY: SYNC WITH APPAREL UNIT 3 SUCCESSFUL",
          "INVENTORY AUDIT: SECURING METRICS FOR STITCHING CYCLES",
          "DATABASE SCHEMA: CACHING VENDOR ADDRESSES",
        ]);
      } else if (activeChamber === 3) {
        setLiveRevenue(14204.0);
        setOrderHistory([14150, 14170, 14190, 14180, 14210, 14200, 14220, 14204]);
        setOrderLogs([
          "EXPO SYSTEM: MULTI-REGION BROADCAST SECURED",
          "WEBGL PIPELINE: COMPILED SHADERS FOR IMMERSIVE YARN DISPLAY",
          "EXHIBIT GATEWAY: VIRTUAL SPACE HOSTED ON VERCEL CDN",
        ]);
      } else if (activeChamber === 4) {
        setActiveInquiries(24);
        setMonthlyProduction(5000);
        setPipelineRevenue([2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.7, 2.8]);
        setOrderLogs([
          "TODI SYSTEM: GOLDEN THREAD EMBROIDERY ENGINE ONLINE",
          "INQUIRY PORT: 24 ACTIVE LEADS FROM 12 EXPORT MARKETS",
          "PRODUCTION CONSOLE: 5,000 UNITS/MONTH CAPACITY LOADED",
        ]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeChamber]);

  // Parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for inertial motion
  const springConfig = { damping: 45, stiffness: 90, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Calculate parallax offsets
  const frameX = useTransform(smoothMouseX, [-1, 1], ["-3%", "3%"]);
  const frameY = useTransform(smoothMouseY, [-1, 1], ["-3%", "3%"]);

  // Track window mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Track container-relative spotlight coordinates
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });
  };

  // Reset active hotspot on chamber change
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveHotspot(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [activeChamber]);

  const projects: ProjectData[] = [
    {
      num: "I",
      title: "NIFTY PULSE",
      metadata: {
        author: "PRINCE PATEL",
        work: { en: "NIFTY PULSE", fr: "NIFTY PULSE" },
        date: "2026",
        location: "NSE INDIA / DIGITAL CAPITAL",
        movement: { en: "AI-NATIVE INVESTMENT LOGIC", fr: "LOGIQUE D'INVESTISSEMENT IA" },
      },
      overview: {
        en: "An AI-native stock analysis platform designed for the Indian equities market, generating high-confidence trade signals under 50ms.",
        fr: "Plateforme d'analyse boursière propulsée par l'IA pour les actions indiennes, générant des signaux sous 50ms.",
      },
      capabilities: [
        {
          icon: "Brain",
          title: { en: "AI Prediction Engine", fr: "Moteur de Prédiction IA" },
          desc: {
            en: "Generates real-time BUY/SELL/HOLD signals using Llama 3.3 and news sentiment.",
            fr: "Génère des signaux en temps réel avec Llama 3.3 et l'analyse de sentiment.",
          },
        },
        {
          icon: "TrendingUp",
          title: { en: "Technical Indicator Suite", fr: "Indicateurs Techniques" },
          desc: {
            en: "Monitors indicators like RSI 14, SMA 20, and MACD divergence dynamically.",
            fr: "Surveille dynamiquement les indicateurs clés comme le RSI 14 et le SMA 20.",
          },
        },
        {
          icon: "Shield",
          title: { en: "Data Integrity Chain", fr: "Chaîne d'Intégrité" },
          desc: {
            en: "Chains historical market records and logs with Supabase backend encryption.",
            fr: "Sécurise l'historique et les journaux avec chiffrement Supabase.",
          },
        },
        {
          icon: "Zap",
          title: { en: "Edge Data Pipeline", fr: "Flux de Données Edge" },
          desc: {
            en: "Processes high-frequency market updates in under 50ms.",
            fr: "Traite les mises à jour du marché en moins de 50ms.",
          },
        },
      ],
      techStack: ["NEXT.JS", "FASTAPI", "SUPABASE", "PYTHON", "GROQ", "LLAMA 3.3", "POSTGRES"],
      impact: [
        { value: "< 50ms", label: { en: "Response Latency", fr: "Temps de Réponse" } },
        { value: "94%", label: { en: "Signal Accuracy", fr: "Précision des Signaux" } },
        { value: "24/7", label: { en: "Market Streaming", fr: "Streaming du Marché" } },
      ],
      story: [
        { en: "Built to eliminate emotional trading bias.", fr: "Conçu pour éliminer les biais émotionnels de trading." },
        { en: "Designed for high-frequency market intelligence.", fr: "Créé pour l'intelligence de marché à haute fréquence." },
        { en: "Engineered for zero-delay analytics pipelines.", fr: "Développé pour des pipelines d'analyse sans délai." },
      ],
      chamber: "CHAMBER I",
      image: "",
      hotspots: [
        {
          id: 1,
          top: "22%",
          left: "32%",
          label: { en: "AI Prediction Engine", fr: "Moteur de Prédiction IA" },
          desc: {
            en: "Generates real-time BUY/SELL/HOLD signals using Llama 3.3 and news sentiment.",
            fr: "Génère des signaux d'achat/vente en temps réel avec Llama 3.3 et l'analyse des actualités.",
          },
        },
        {
          id: 2,
          top: "50%",
          left: "62%",
          label: { en: "Technical Indicator Suite", fr: "Suite d'Indicateurs Techniques" },
          desc: {
            en: "Monitors indicators like RSI 14, SMA 20, and MACD divergence dynamically.",
            fr: "Surveille dynamiquement les indicateurs clés comme le RSI 14 et le SMA 20.",
          },
        },
        {
          id: 3,
          top: "75%",
          left: "48%",
          label: { en: "Data Integrity Chain", fr: "Chaîne d'Intégrité des Données" },
          desc: {
            en: "Chains historical market records and logs with Supabase backend encryption.",
            fr: "Sécurise l'historique et les journaux avec chiffrement Supabase en arrière-plan.",
          },
        },
      ],
      repo: "https://github.com/princepatel04477-web/Stock_Analysis_App.git",
      deployment: "https://root-six-gamma.vercel.app/",
    },
    {
      num: "II",
      title: "SHIVESHWAR TEXTILES",
      metadata: {
        author: "PRINCE PATEL",
        work: { en: "SHIVESHWAR TEXTILES", fr: "TEXTILES SHIVESHWAR" },
        date: "2025",
        location: "SURAT, INDIA / B2B COMMERCE",
        movement: { en: "HEAVYWEAVE HEADLESS PLATFORMS", fr: "PLATEFORMES HEADLESS HEAVYWEAVE" },
      },
      overview: {
        en: "A premium headless B2B commerce platform transforming heritage fabric manufacturing into a high-performance digital showcase.",
        fr: "Plateforme B2B haut de gamme transformant le commerce textile traditionnel en vitrine numérique haute performance.",
      },
      capabilities: [
        {
          icon: "Layers",
          title: { en: "Headless Architecture", fr: "Architecture Headless" },
          desc: {
            en: "Delivers sub-50ms page loads and user interactions via Next.js ISR.",
            fr: "Fournit des temps de chargement sous 50ms grâce à Next.js ISR.",
          },
        },
        {
          icon: "Box",
          title: { en: "3D Material Studio", fr: "Studio Matériel 3D" },
          desc: {
            en: "Features interactive WebGL showcases of premium fabric collections.",
            fr: "Présente des collections de tissus en WebGL 3D interactif.",
          },
        },
        {
          icon: "Activity",
          title: { en: "Live Supply Pipeline", fr: "Chaîne de Production" },
          desc: {
            en: "Tracks active weave schedules, order queues, and client inquiries.",
            fr: "Suit les plannings de tissage, files de commandes et demandes clients.",
          },
        },
        {
          icon: "Gauge",
          title: { en: "Loom Synchronization", fr: "Synchronisation Métier" },
          desc: {
            en: "Directly links digital commerce catalog with physical factory looms.",
            fr: "Relie directement le catalogue numérique aux métiers à tisser physiques.",
          },
        },
      ],
      techStack: ["NEXT.JS", "THREE.JS", "TAILWIND", "SUPABASE", "POSTGRES", "VERCEL"],
      impact: [
        { value: "50ms", label: { en: "Response Time", fr: "Temps de Réponse" } },
        { value: "3.42%", label: { en: "Conversion Rate", fr: "Taux de Conversion" } },
        { value: "10x", label: { en: "Ingestion Speed", fr: "Vitesse d'Ingestion" } },
      ],
      story: [
        { en: "Crafted to preserve heritage weaving traditions.", fr: "Conçu pour préserver les traditions de tissage historiques." },
        { en: "Designed for frictionless global B2B trade.", fr: "Créé pour un commerce B2B mondial fluide." },
        { en: "Engineered for modern headless retail speed.", fr: "Développé pour la rapidité du commerce moderne sans tête." },
      ],
      chamber: "CHAMBER II",
      image: "",
      hotspots: [
        {
          id: 1,
          top: "20%",
          left: "30%",
          label: { en: "Edge Commerce Funnel", fr: "Entonnoir E-commerce Edge" },
          desc: {
            en: "Speeds up page loads and user interactions under 50ms via Next.js ISR.",
            fr: "Accélère le chargement des pages sous 50ms grâce à la régénération statique.",
          },
        },
        {
          id: 2,
          top: "45%",
          left: "70%",
          label: { en: "Gross Revenue Ticker", fr: "Compteur de Revenu Brut" },
          desc: {
            en: "Ticking revenue tracker with automated edge caching for fast synchronization.",
            fr: "Suivi des revenus en temps réel avec mise en cache edge pour synchronisation rapide.",
          },
        },
        {
          id: 3,
          top: "75%",
          left: "45%",
          label: { en: "Live Order Stream", fr: "Flux de Commandes en Direct" },
          desc: {
            en: "Real-time activity log showing global transactions and client inquiries.",
            fr: "Journal d'activité en temps réel affichant les transactions mondiales.",
          },
        },
      ],
      repo: "https://github.com/princepatel04477-web/Shiveshwar_Textiles.git",
      deployment: "https://www.shiveshwartextiles.com/",
    },
    {
      num: "III",
      title: "MANASVI FASHION ERP",
      metadata: {
        author: "PRINCE PATEL",
        work: { en: "MANASVI FASHION ERP", fr: "MANASVI FASHION ERP" },
        date: "2026",
        location: "SURAT, INDIA / ENTERPRISE APP",
        movement: { en: "APPAREL MANUFACTURING SYSTEMS", fr: "SYSTÈMES DE FABRICATION DE VÊTEMENTS" },
      },
      overview: {
        en: "A production-grade enterprise resource planning platform engineered to optimize high-volume apparel manufacturing and vendor distribution.",
        fr: "Progiciel de gestion d'entreprise conçu pour optimiser la fabrication de vêtements et la distribution des fournisseurs.",
      },
      capabilities: [
        {
          icon: "Workflow",
          title: { en: "Loom Operations", fr: "Opérations Métiers" },
          desc: {
            en: "Monitors active weaving speeds and warp-weft tension in real-time.",
            fr: "Surveille en temps réel les vitesses de tissage et la tension des fils.",
          },
        },
        {
          icon: "Database",
          title: { en: "Inventory Controller", fr: "Contrôle d'Inventaire" },
          desc: {
            en: "Tracks raw yarns, dye categories, patterns, and apparel stock.",
            fr: "Suit les fils bruts, teintures, patrons et stocks de vêtements.",
          },
        },
        {
          icon: "Globe",
          title: { en: "Supplier Directory", fr: "Annuaire Fournisseurs" },
          desc: {
            en: "Consolidates global vendor credentials and raw materials logs.",
            fr: "Regroupe les informations fournisseurs et les stocks de matières premières.",
          },
        },
        {
          icon: "Check",
          title: { en: "Fulfillment Pipeline", fr: "Pipeline de Livraison" },
          desc: {
            en: "Secures checkout processes and delivery milestones via Next.js API.",
            fr: "Sécurise le processus de paiement et de livraison via Next.js API.",
          },
        },
      ],
      techStack: ["NEXT.JS", "REACT", "POSTGRES", "PRISMA", "NODE.JS", "SUPABASE", "FASTAPI"],
      impact: [
        { value: "98%", label: { en: "Loom Efficiency", fr: "Efficacité des Métiers" } },
        { value: "142+", label: { en: "Active Looms", fr: "Métiers Actifs" } },
        { value: "35%", label: { en: "Waste Reduction", fr: "Réduction des Déchets" } },
      ],
      story: [
        { en: "Built to optimize garment production lifecycles.", fr: "Bâti pour optimiser le cycle de vie de la production de vêtements." },
        { en: "Designed for micro-level supply chain control.", fr: "Conçu pour un contrôle de la chaîne logistique au niveau micro." },
        { en: "Engineered to eliminate fabric waste.", fr: "Développé pour éliminer les pertes de tissus." },
      ],
      chamber: "CHAMBER III",
      image: "",
      hotspots: [
        {
          id: 1,
          top: "25%",
          left: "25%",
          label: { en: "Inventory Control Hub", fr: "Moyeu de Contrôle d'Inventaire" },
          desc: {
            en: "Coordinates apparel stock, raw yarn categories, and production schedules.",
            fr: "Coordonne le stock de vêtements, les catégories de fil et les plannings de production.",
          },
        },
        {
          id: 2,
          top: "50%",
          left: "75%",
          label: { en: "Loom Operations Logger", fr: "Journal des Opérations Métier" },
          desc: {
            en: "Tracks active weaving speeds and warp-weft tension across manufacturing floors.",
            fr: "Suit la vitesse de tissage active et la tension de trame dans l'usine.",
          },
        },
        {
          id: 3,
          top: "72%",
          left: "40%",
          label: { en: "Order Fulfillment Pipeline", fr: "Pipeline de Commandes" },
          desc: {
            en: "Secures checkout logs and vendor coordinates through modular API gateways.",
            fr: "Sécurise les transactions et coordonnées fournisseurs via des passerelles API modulaires.",
          },
        },
      ],
      repo: "https://github.com/princepatel04477-web/manasvi_fashion.git",
      deployment: "https://www.manasvifashionsurat.com/",
    },
    {
      num: "IV",
      title: "SURAT TEXTILE EXHI.",
      metadata: {
        author: "PRINCE PATEL",
        work: { en: "SURAT TEXTILE EXHIBITION", fr: "EXPOSITION TEXTILE DE SURAT" },
        date: "2026",
        location: "SURAT, INDIA / SPATIAL DISPLAY",
        movement: { en: "DIGITAL HERITAGE EXPERIENCE", fr: "EXPÉRIENCE DU PATRIMOINE NUMÉRIQUE" },
      },
      overview: {
        en: "An immersive spatial showcase utilizing scroll-driven WebGL animations to present Surat's historic weavers and premier looms.",
        fr: "Vitrine spatiale immersive utilisant des animations WebGL pour présenter les tisseurs et métiers historiques de Surat.",
      },
      capabilities: [
        {
          icon: "Box",
          title: { en: "Spatial WebGL Shaders", fr: "Shaders WebGL Spatiaux" },
          desc: {
            en: "Renders realistic 3D thread loops and luxury fabric patterns in real-time.",
            fr: "Affiche des fils 3D réalistes et des textures de tissus en temps réel.",
          },
        },
        {
          icon: "Activity",
          title: { en: "Interactive Showroom", fr: "Showroom Interactif" },
          desc: {
            en: "Scroll-triggered showcase of weaver booths, layouts, and designs.",
            fr: "Présentation interactive des stands de tisserands déclenchée par défilement.",
          },
        },
        {
          icon: "Send",
          title: { en: "Inquiry Gateway", fr: "Messagerie Directe" },
          desc: {
            en: "Creates direct, secure communication channels between buyers and weavers.",
            fr: "Crée des canaux de communication directs entre acheteurs et tisserands.",
          },
        },
        {
          icon: "BarChart2",
          title: { en: "Visitor Analytics Hub", fr: "Analyses de Fréquentation" },
          desc: {
            en: "Tracks digital attendance, session duration, and interest clicks.",
            fr: "Suit la fréquentation virtuelle, les temps de session et les clics d'intérêt.",
          },
        },
      ],
      techStack: ["THREE.JS", "WEBGL", "GSAP", "NEXT.JS", "FRAMER MOTION", "POSTGRES"],
      impact: [
        { value: "60fps", label: { en: "Render Rate", fr: "Taux de Rendu" } },
        { value: "100K+", label: { en: "Virtual Visitors", fr: "Visiteurs Virtuels" } },
        { value: "94%", label: { en: "Buyer Engagement", fr: "Engagement Acheteurs" } },
      ],
      story: [
        { en: "Built to digitize legacy textile exhibitions.", fr: "Bâti pour numériser les expositions textiles patrimoniales." },
        { en: "Designed for immersive digital heritage storytelling.", fr: "Conçu pour un récit patrimonial numérique immersif." },
        { en: "Engineered to connect local weavers with global markets.", fr: "Développé pour connecter les tisserands locaux aux marchés mondiaux." },
      ],
      chamber: "CHAMBER IV",
      image: "",
      hotspots: [
        {
          id: 1,
          top: "30%",
          left: "55%",
          label: { en: "Scroll-Driven WebGL Shaders", fr: "Shaders WebGL Immersifs" },
          desc: {
            en: "Renders premium fabric textures and interactive 3D yarn loops in real-time.",
            fr: "Affiche des textures de tissus haut de gamme et des boucles de fil en temps réel.",
          },
        },
        {
          id: 2,
          top: "60%",
          left: "35%",
          label: { en: "Virtual Exhibitor Directory", fr: "Répertoire Virtuel des Exposants" },
          desc: {
            en: "Organizes halls, booths, and digital brochures for global buyers.",
            fr: "Organise les halls, stands et brochures numériques pour les acheteurs internationaux.",
          },
        },
        {
          id: 3,
          top: "78%",
          left: "70%",
          label: { en: "Visitor Analytics Hub", fr: "Centre d'Analyses des Visiteurs" },
          desc: {
            en: "Tracks virtual attendance, session times, and catalog inquiry clicks.",
            fr: "Suit la fréquentation virtuelle, les temps de session et les clics d'intérêt.",
          },
        },
      ],
      repo: "https://github.com/princepatel04477-web/STE.git",
      deployment: "https://www.stesurat.com/",
    },
    {
      num: "V",
      title: "TODI ETHNIC",
      metadata: {
        author: "PRINCE PATEL",
        work: { en: "TODI ETHNIC", fr: "TODI ETHNIC" },
        date: "2025",
        location: "SURAT, INDIA / RETAIL FASHION",
        movement: { en: "ETHNIC WEAR MANUFACTURING PIPELINE", fr: "CHAÎNE DE FABRICATION DE VÊTEMENTS ETHNIQUES" },
      },
      overview: {
        en: "A full-scale ethnic wear manufacturing and retail management platform orchestrating order pipelines across 850+ partners and 12 export markets.",
        fr: "Plateforme de gestion de la fabrication et de la vente au détail de vêtements ethniques orchestrant les pipelines de commandes dans plus de 850 partenaires et 12 marchés d'exportation.",
      },
      capabilities: [
        {
          icon: "ShoppingBag",
          title: { en: "Order Pipeline Engine", fr: "Moteur de Pipeline de Commandes" },
          desc: {
            en: "Orchestrates Inquiry to Sample to Order to Production to Dispatch from a single dashboard.",
            fr: "Orchestre la chaîne Devis-Échantillon-Commande-Production-Expédition depuis un tableau de bord unique.",
          },
        },
        {
          icon: "TrendingUp",
          title: { en: "Production Analytics", fr: "Analytique de Production" },
          desc: {
            en: "Real-time monitoring of 5,000+ monthly units across bridal and occasion wear lines.",
            fr: "Suivi en temps réel de plus de 5 000 unités mensuelles dans les lignes de vêtements de mariage et de cérémonie.",
          },
        },
        {
          icon: "Globe",
          title: { en: "Export Market Hub", fr: "Hub des Marchés d'Exportation" },
          desc: {
            en: "Connects with 12 international markets through automated logistics and customs pipelines.",
            fr: "Se connecte à 12 marchés internationaux via des pipelines logistiques et douaniers automatisés.",
          },
        },
        {
          icon: "Activity",
          title: { en: "Live Inquiry Console", fr: "Console de Demandes en Direct" },
          desc: {
            en: "Real-time inquiry tracking with automated response routing to 850+ retail partners.",
            fr: "Suivi des demandes en temps réel avec routage automatisé des réponses vers plus de 850 partenaires.",
          },
        },
      ],
      techStack: ["NEXT.JS", "REACT", "POSTGRES", "PRISMA", "NODE.JS", "SUPABASE", "REDIS", "TAILWIND"],
      impact: [
        { value: "850+", label: { en: "Retail Partners", fr: "Partenaires de Vente au Détail" } },
        { value: "12", label: { en: "Export Markets", fr: "Marchés d'Exportation" } },
        { value: "5,000+", label: { en: "Monthly Production", fr: "Production Mensuelle" } },
      ],
      story: [
        { en: "Built to streamline ethnic wear order pipelines across Surat's manufacturing ecosystem.", fr: "Conçu pour rationaliser les pipelines de commandes de vêtements ethniques dans l'écosystème de fabrication de Surat." },
        { en: "Designed for real-time visibility across 850+ retail partner touchpoints.", fr: "Conçu pour une visibilité en temps réel sur plus de 850 points de contact partenaires." },
        { en: "Engineered to connect Surat's traditional craftsmanship to 12 global markets.", fr: "Développé pour connecter l'artisanat traditionnel de Surat à 12 marchés mondiaux." },
      ],
      chamber: "CHAMBER V",
      image: "",
      hotspots: [
        {
          id: 1,
          top: "25%",
          left: "30%",
          label: { en: "Order Pipeline Engine", fr: "Moteur de Pipeline de Commandes" },
          desc: {
            en: "End-to-end order pipeline from inquiry to dispatch with real-time status tracking.",
            fr: "Pipeline de commandes de bout en bout, de la demande à l'expédition, avec suivi en temps réel.",
          },
        },
        {
          id: 2,
          top: "50%",
          left: "70%",
          label: { en: "Production Console", fr: "Console de Production" },
          desc: {
            en: "Monitors 5,000+ monthly units across bridal and occasion wear production lines.",
            fr: "Surveille plus de 5 000 unités mensuelles sur les lignes de production.",
          },
        },
        {
          id: 3,
          top: "75%",
          left: "45%",
          label: { en: "Global Export Hub", fr: "Hub d'Exportation Mondial" },
          desc: {
            en: "Automated logistics pipelines connecting to 12 international export markets.",
            fr: "Pipelines logistiques automatisés connectés à 12 marchés d'exportation internationaux.",
          },
        },
      ],
      repo: "https://github.com/princepatel04477-web/Todi_Ethnic.git",
      deployment: "https://www.todiethnic.com/",
    },
    {
      num: "VI",
      title: "TRIVOXA GROUP",
      metadata: {
        author: "PRINCE PATEL",
        work: { en: "TRIVOXA GROUP", fr: "TRIVOXA GROUP" },
        date: "2026",
        location: "GLOBAL / INDUSTRIAL HUB",
        movement: { en: "MULTI-SECTOR ENTERPRISE ECOSYSTEM", fr: "ÉCOSYSTÈME D'ENTREPRISE MULTISECTORIEL" },
      },
      overview: {
        en: "A multi-sector corporate portal and enterprise management ecosystem powering Trivoxa Group's diversified global business operations.",
        fr: "Portail d'entreprise multisectoriel alimentant les opérations mondiales diversifiées du groupe Trivoxa.",
      },
      capabilities: [
        {
          icon: "Building2",
          title: { en: "Executive Intelligence Dashboard", fr: "Tableau de Bord Exécutif" },
          desc: {
            en: "Aggregates real-time business telemetry and subsidiary operational performance metrics across all group divisions.",
            fr: "Agrège la télémétrie commerciale en temps réel et les métriques de performance filiales.",
          },
        },
        {
          icon: "Workflow",
          title: { en: "Enterprise Resource Gateway", fr: "Passerelle de Ressources D'entreprise" },
          desc: {
            en: "Standardizes supply chain logistics, multi-subsidiary compliance, and unified client management.",
            fr: "Standardise la logistique, la conformité multi-filiales et la gestion client.",
          },
        },
        {
          icon: "Globe",
          title: { en: "Global Expansion Engine", fr: "Moteur d'Expansion Mondiale" },
          desc: {
            en: "Orchestrates multi-currency financial reporting and international subsidiary compliance frameworks.",
            fr: "Orchestre le reporting financier multidevise et les cadres de conformité internationaux.",
          },
        },
      ],
      techStack: ["Next.js 16", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Docker"],
      impact: [
        { label: { en: "Telemetry Load", fr: "Télémétrie" }, value: "Sub-50ms" },
        { label: { en: "Cross-Sync Rate", fr: "Taux de Synchro" }, value: "+180%" },
        { label: { en: "Enterprise Uptime", fr: "Disponibilité" }, value: "99.99%" },
      ],
      story: [
        {
          en: "Designed a unified corporate portal to consolidate data streams from multiple business verticals under Trivoxa Group.",
          fr: "Conçu un portail d'entreprise unifié pour consolider les flux de données de plusieurs secteurs.",
        },
        {
          en: "Implemented secure API gateways and role-based access control for subsidiary managers and executive leadership.",
          fr: "Mis en œuvre des passerelles API sécurisées et un contrôle d'accès basé sur les rôles.",
        },
        {
          en: "Deployed serverless telemetry pipelines to monitor operational KPIs and global supply chain logistics in real time.",
          fr: "Déployé des pipelines de télémétrie serverless pour surveiller les KPI opérationnels et la logistique.",
        },
      ],
      hotspots: [
        {
          id: 1,
          top: "22%",
          left: "30%",
          label: { en: "Subsidiary Telemetry", fr: "Télémétrie Filiales" },
          desc: { en: "Real-time sync across 8 global business units.", fr: "Synchro en temps réel sur 8 unités d'affaires." },
        },
        {
          id: 2,
          top: "65%",
          left: "70%",
          label: { en: "Enterprise Gateway", fr: "Passerelle D'entreprise" },
          desc: { en: "Unified role-based management & security.", fr: "Gestion et sécurité unifiées basées sur les rôles." },
        },
      ],
      chamber: "VI",
      image: "/aether_os.png",
      repo: "https://github.com/princepatel04477-web/Trivoxa_Group.git",
      deployment: "https://www.trivoxagroup.com/",
    },
    {
      num: "VII",
      title: "NUVENT",
      chamber: "VII",
      image: "/solas_spatial.png",
      metadata: {
        author: "PRINCE PATEL",
        work: { en: "NUVENT", fr: "NUVENT" },
        date: "2026",
        location: "DIGITAL ENTERTAINMENT & EVENT HUB",
        movement: { en: "AGENTIC EVENT MANAGEMENT PLATFORM", fr: "PLATEFORME DE GESTION D'ÉVÉNEMENTS" },
      },
      overview: {
        en: "An all-in-one event management software platform engineering real-time ticketing, attendee analytics, and automated spatial venue scheduling.",
        fr: "Plateforme logicielle de gestion d'événements tout-en-un avec billetterie et analyse en temps réel.",
      },
      capabilities: [
        {
          icon: "Ticket",
          title: { en: "Real-time Ticketing Engine", fr: "Moteur de Billetterie Temps Réel" },
          desc: {
            en: "High-throughput QR check-in scanner and sub-second ticket issuance pipeline.",
            fr: "Scanner de contrôle d'accès QR haute performance et émission sous la seconde.",
          },
        },
        {
          icon: "Calendar",
          title: { en: "Automated Venue Scheduler", fr: "Planificateur de Lieu Automatisé" },
          desc: {
            en: "Dynamic spatial allocation tool for multi-track conferences, expos, and large-scale corporate events.",
            fr: "Allocation spatiale dynamique pour conférences multi-sessions et expos.",
          },
        },
        {
          icon: "Users",
          title: { en: "Live Attendee Telemetry", fr: "Télémétrie Participants En Direct" },
          desc: {
            en: "Generates real-time heatmaps, engagement analytics, and instant speaker feedback metrics.",
            fr: "Génère des cartes thermiques et des analyses d'engagement en temps réel.",
          },
        },
      ],
      techStack: ["Next.js 16", "WebSockets", "Redis", "PostgreSQL", "Tailwind CSS", "Stripe API"],
      impact: [
        { label: { en: "Check-In Latency", fr: "Latence Contrôle" }, value: "<18ms" },
        { label: { en: "Tickets Issued", fr: "Billets Émis" }, value: "50k+" },
        { label: { en: "Attendee Engagement", fr: "Engagement" }, value: "+240%" },
      ],
      story: [
        {
          en: "Engineered a high-performance event management engine capable of handling flash sales and peak ticket checkout demands.",
          fr: "Conçu un moteur de gestion d'événements capable de gérer les ventes flash.",
        },
        {
          en: "Built a real-time check-in scanner and attendee management suite with offline-first synchronization capabilities.",
          fr: "Créé une suite de contrôle d'accès avec synchronisation hors ligne.",
        },
        {
          en: "Integrated dynamic venue floorplan mapping and automated schedule management for event organizers and attendees.",
          fr: "Intégré la cartographie dynamique des lieux et la gestion automatique des plannings.",
        },
      ],
      hotspots: [
        {
          id: 1,
          top: "25%",
          left: "35%",
          label: { en: "Instant QR Scanner", fr: "Scanner QR Instantané" },
          desc: { en: "Sub-18ms QR pass verification and gate check-in.", fr: "Vérification de pass QR sous 18ms." },
        },
        {
          id: 2,
          top: "60%",
          left: "65%",
          label: { en: "Spatial Floorplan Mapping", fr: "Cartographie du Lieu" },
          desc: { en: "Dynamic seating and session capacity tracking.", fr: "Suivi dynamique de capacité des sessions." },
        },
      ],
      repo: "https://github.com/princepatel04477-web/Nuvent.git",
      deployment: "https://www.nuvent.app/",
    },
  ];
  const p = projects[activeChamber] || projects[0];

  return (
    <div className="relative w-full h-screen overflow-y-auto lg:overflow-hidden flex items-start lg:items-center justify-center pt-20 pb-16 lg:py-16 px-4 sm:px-8 lg:px-12 select-none overflow-x-hidden">
      {/* 1. Large backdrop ghostly chamber numbers to set atmospheric scale */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <span className="font-display font-black text-[20vw] text-white/[0.007] tracking-tighter leading-none select-none uppercase transition-all duration-1000 mix-blend-overlay">
          CHAMBER {p.num}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeChamber}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center z-10 pb-12 lg:pb-0"
        >
          {/* LEFT COLUMN: Metadata - Refined editorial typography */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 flex flex-col justify-center h-full border-l lg:border-l-0 lg:border-r border-[#eae6df]/5 lg:pr-6 pl-4 lg:pl-0 order-2 lg:order-none"
          >
            <span className="text-[8.5px] tracking-[0.4em] text-[#d4af37] font-semibold block mb-8 uppercase select-none">
              EXHIBIT {p.num}
            </span>

            <div className="space-y-5 text-[8.5px] tracking-[0.3em] font-medium text-[#eae6df]/45">
              <div className="border-b border-[#eae6df]/5 pb-3">
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">AUTHOR</span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.author}</span>
              </div>
              <div className="border-b border-[#eae6df]/5 pb-3">
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">WORK</span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.work.en}</span>
              </div>
              <div className="border-b border-[#eae6df]/5 pb-3">
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">DATE</span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.date}</span>
              </div>
              <div className="border-b border-[#eae6df]/5 pb-3">
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">LOCATION</span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.location}</span>
              </div>
              <div>
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">MOVEMENT</span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.movement.en}</span>
              </div>
            </div>

            {/* Project Navigation Index */}
            <div className="mt-10 pt-6 border-t border-[#eae6df]/5 space-y-4">
              <span className="text-[8px] tracking-[0.35em] font-semibold text-[#d4af37] block uppercase">
                EXHIBITION INDEX
              </span>
              <div className="space-y-2 text-[9px] tracking-widest uppercase font-medium">
                <div className="flex justify-between text-[#eae6df]/35">
                  <span className="opacity-60">PREV:</span>
                  <span className="text-[#eae6df]/60 font-sans tracking-wide">
                    {activeChamber === 0 && "Landing Chamber"}
                    {activeChamber === 1 && "Nifty Pulse"}
                    {activeChamber === 2 && "Shiveshwar Textiles"}
                    {activeChamber === 3 && "Manasvi Fashion ERP"}
                    {activeChamber === 4 && "Surat Textile Exhibition"}
                    {activeChamber === 5 && "Todi Ethnic"}
                    {activeChamber === 6 && "Trivoxa Group"}
                  </span>
                </div>
                <div className="flex justify-between text-[#d4af37]">
                  <span>CURRENT:</span>
                  <span className="font-bold tracking-wide font-sans text-white">
                    {activeChamber === 0 && "Nifty Pulse"}
                    {activeChamber === 1 && "Shiveshwar Textiles"}
                    {activeChamber === 2 && "Manasvi Fashion ERP"}
                    {activeChamber === 3 && "Surat Textile Exhibition"}
                    {activeChamber === 4 && "Todi Ethnic"}
                    {activeChamber === 5 && "Trivoxa Group"}
                    {activeChamber === 6 && "Nuvent"}
                  </span>
                </div>
                <div className="flex justify-between text-[#eae6df]/35">
                  <span className="opacity-60">NEXT:</span>
                  <span className="text-[#eae6df]/40 font-sans tracking-wide">
                    {activeChamber === 0 && "Shiveshwar Textiles"}
                    {activeChamber === 1 && "Manasvi Fashion ERP"}
                    {activeChamber === 2 && "Surat Textile Exhibition"}
                    {activeChamber === 3 && "Todi Ethnic"}
                    {activeChamber === 4 && "Trivoxa Group"}
                    {activeChamber === 5 && "Nuvent"}
                    {activeChamber === 6 && "End Of Exhibition"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* CENTER COLUMN: Masterpiece artwork presentation container */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center gap-6 w-full order-1 lg:order-none z-10">
            {activeChamber < 7 ? (
              // Exhibit Chamber (I to VII)
              <motion.div
                ref={containerRef}
                onMouseMove={handleContainerMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setActiveHotspot(null);
                }}
                style={{ x: frameX, y: frameY }}
                className="relative w-full aspect-[4/3] rounded-md border border-[#d4af37]/20 bg-[#080808]/90 p-4 md:p-6 shadow-[0_35px_95px_rgba(0,0,0,0.95)] backdrop-blur-sm group overflow-hidden transition-all duration-700 ease-out hover:border-[#d4af37]/35 hover:shadow-[0_45px_110px_rgba(0,0,0,0.98),0_0_40px_rgba(212,175,55,0.03)]"
              >
                {/* Matte mount board (passe-partout) with thin inner gold border */}
                <div className="relative w-full h-full rounded border border-black/80 bg-zinc-950/90 overflow-hidden flex items-center justify-center">
                  
                  {/* High-Fidelity Dashboards instead of static images */}
                  <div className="absolute inset-0 w-full h-full pointer-events-auto">
                    {activeChamber === 0 && (
                      <NiftyPulseDashboard
                        liveNifty={liveRevenue}
                        liveChange={(liveRevenue - 24142.05) / 240}
                        orderHistory={orderHistory}
                        orderLogs={orderLogs}
                      />
                    )}
                    {activeChamber === 1 && (
                      <CommerceHubDashboard
                        liveRevenue={liveRevenue}
                        liveInquiries={liveInquiries}
                        orderHistory={orderHistory}
                        orderLogs={orderLogs}
                      />
                    )}
                    {activeChamber === 2 && (
                      <ManasviERPDashboard
                        fabricIndex={fabricIndex}
                        selectFabric={setFabricIndex}
                      />
                    )}
                    {activeChamber === 3 && (
                      <SuratTextileExhibitionDashboard />
                    )}
                    {activeChamber === 4 && (
                      <TodiEthnicDashboard
                        activeInquiries={activeInquiries}
                        monthlyProduction={monthlyProduction}
                        pipelineRevenue={pipelineRevenue}
                        orderHistory={orderHistory}
                        orderLogs={orderLogs}
                      />
                    )}
                    {activeChamber === 5 && (
                      <TrivoxaGroupDashboard />
                    )}
                    {activeChamber === 6 && (
                      <NuventDashboard />
                    )}
                  </div>

                  {/* Inner hairline border directly enclosing image box */}
                  <div className="absolute inset-0 border border-[#d4af37]/10 pointer-events-none z-10" />

                  {/* Ambient inner shadow mask */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.75)_100%)] z-10 pointer-events-none" />

                  {/* Spotlight Cursor Light revealed on hover */}
                  <div
                    className="absolute inset-0 pointer-events-none z-15 mix-blend-screen transition-opacity duration-700 ease-out opacity-30 group-hover:opacity-100"
                    style={{
                      "--mouse-x": `${spotlightPos.x}%`,
                      "--mouse-y": `${spotlightPos.y}%`,
                      background: `radial-gradient(320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, ${isHovered ? 0.07 : 0.035}), transparent 80%)`,
                    } as React.CSSProperties}
                  />

                  {/* Fine diagonal sheen sweeping on hover */}
                  <div className="absolute inset-0 pointer-events-none z-15 bg-[linear-gradient(135deg,transparent_35%,rgba(255,255,255,0.015)_50%,transparent_65%)] -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-out" />

                  {/* Glowing Hotspots (Interactive nodes) - Quietly visible on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 z-20 pointer-events-none"
                  >
                    {p.hotspots.map((hs) => {
                      const isActive = activeHotspot === hs.id;
                      return (
                        <div
                          key={hs.id}
                          className="absolute z-20 pointer-events-auto"
                          style={{ top: hs.top, left: hs.left }}
                        >
                          {/* Pulse circle trigger */}
                          <button
                            onClick={() => setActiveHotspot(isActive ? null : hs.id)}
                            onMouseEnter={() => setActiveHotspot(hs.id)}
                            className="relative w-8 h-8 flex items-center justify-center group focus:outline-none cursor-pointer"
                          >
                            <span className="absolute w-full h-full rounded-full bg-[#d4af37]/15 animate-ping opacity-60" />
                            <span className="absolute w-4 h-4 rounded-full bg-black border border-[#d4af37]/60 group-hover:bg-[#d4af37] group-hover:scale-110 transition-all duration-300" />
                            <span className="absolute w-1.5 h-1.5 rounded-full bg-[#d4af37] group-hover:bg-black transition-colors duration-300" />
                          </button>

                          {/* Tooltip detail overlay */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 8 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute left-1/2 -translate-x-1/2 bottom-10 w-56 p-4 rounded bg-[#070709]/98 border border-[#d4af37]/35 shadow-2xl text-center pointer-events-none z-30"
                              >
                                <span className="text-[9px] tracking-[0.25em] text-[#d4af37] font-bold block mb-1.5 uppercase">
                                  {hs.label.en}
                                </span>
                                <p className="text-[10.5px] text-[#eae6df]/75 leading-relaxed font-sans font-light">
                                  {hs.desc.en}
                                </p>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#d4af37]/35" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              // Fallback
              <div />
            )}

            {/* PERSISTENT ACTION BUTTONS */}
            <div className="flex gap-4 w-full justify-center pointer-events-auto mt-2">
              <a
                href={p.deployment}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 border border-[#d4af37]/20 hover:border-[#d4af37] bg-black/40 text-[8.5px] font-bold text-[#eae6df] tracking-widest uppercase transition-all duration-300 rounded hover:bg-[#d4af37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] backdrop-blur-md relative overflow-hidden group/btn cursor-pointer"
              >
                <span>VIEW LIVE PROJECT</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d4af37] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 border border-[#d4af37]/20 hover:border-[#d4af37] bg-black/40 text-[8.5px] font-bold text-[#eae6df] tracking-widest uppercase transition-all duration-300 rounded hover:bg-[#d4af37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] backdrop-blur-md relative overflow-hidden group/btn cursor-pointer"
              >
                <span>GITHUB REPOSITORY</span>
                <GithubIcon className="w-3.5 h-3.5 text-[#d4af37] transition-transform duration-300 group-hover/btn:scale-110" />
              </a>
            </div>
          </div>
          {/* RIGHT COLUMN: Redesigned Exhibition Narrative Panel */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col justify-between lg:max-h-[75vh] lg:overflow-y-auto pr-2 pl-4 lg:pl-6 py-2 order-3 lg:order-none border-l border-[#eae6df]/5 custom-scrollbar scroll-smooth"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12 lg:space-y-16"
            >
              {/* 01. PROJECT OVERVIEW */}
              <motion.div variants={childVariants} className="space-y-4">
                <span className="text-[9px] tracking-[0.4em] font-bold text-[#d4af37] block uppercase">
                  01. PROJECT OVERVIEW
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-normal leading-[1.2] text-white tracking-tight break-words" style={{ fontFamily: "var(--font-editorial)" }}>
                  {p.title}
                </h3>
                <p className="text-[15px] lg:text-[16px] text-[#eae6df]/60 leading-[1.8] font-sans font-light tracking-wide max-w-[60ch]">
                  {p.overview.en}
                </p>
              </motion.div>

              {/* 02. CORE CAPABILITIES */}
              <motion.div variants={childVariants} className="space-y-6">
                <span className="text-[9px] tracking-[0.4em] font-bold text-[#d4af37] block uppercase">
                  02. CORE CAPABILITIES
                </span>
                <div className="grid grid-cols-1 gap-4">
                  {p.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-lg bg-zinc-950/60 border border-white/5 hover:border-[#d4af37]/20 transition-colors duration-300">
                      <div className="shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black/40">
                        {getIcon(cap.icon)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold tracking-wider text-white uppercase">{cap.title.en}</h4>
                        <p className="text-[12px] text-[#eae6df]/60 leading-relaxed font-light">{cap.desc.en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 03. TECHNOLOGY STACK */}
              <motion.div variants={childVariants} className="space-y-6">
                <span className="text-[9px] tracking-[0.4em] font-bold text-[#d4af37] block uppercase">
                  03. TECHNOLOGY STACK
                </span>
                <div className="flex flex-wrap gap-2">
                  {p.techStack.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-full border border-white/10 bg-zinc-950/40 text-[10px] tracking-widest text-[#eae6df]/80 font-mono font-medium uppercase hover:border-[#d4af37]/35 hover:text-white transition-all duration-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* 04. IMPACT / RESULTS */}
              <motion.div variants={childVariants} className="space-y-6">
                <span className="text-[9px] tracking-[0.4em] font-bold text-[#d4af37] block uppercase">
                  04. IMPACT / RESULTS
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {p.impact.map((imp, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-3 rounded-lg bg-zinc-950/40 border border-white/5 text-center">
                      <span className="text-xl font-black text-[#d4af37] tracking-tight">{imp.value}</span>
                      <span className="text-[8px] tracking-widest text-[#eae6df]/45 uppercase font-medium leading-tight">{imp.label.en}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 05. PROJECT STORY */}
              <motion.div variants={childVariants} className="space-y-6">
                <span className="text-[9px] tracking-[0.4em] font-bold text-[#d4af37] block uppercase">
                  05. PROJECT STORY
                </span>
                <div className="space-y-4">
                  {p.story.map((st, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-lg bg-[#0a0a0c]/80 border border-white/10 hover:border-[#d4af37]/30 transition-colors duration-300">
                      <span className="text-xs font-bold text-[#d4af37]/50 font-mono">0{idx + 1}</span>
                      <p className="text-[13px] text-[#eae6df]/75 font-light tracking-wide leading-relaxed">{st.en}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="pt-8 border-t border-[#eae6df]/5 flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-[#d4af37] animate-pulse" />
                <span className="text-[9px] tracking-[0.35em] font-bold text-[#eae6df]/85 uppercase">
                  {p.chamber}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

