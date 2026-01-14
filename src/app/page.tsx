'use client';

import { useState, useEffect, useCallback } from 'react';
import CodeList from '@/components/CodeList';
import RedeemForm from '@/components/RedeemForm';
import ResultDisplay from '@/components/ResultDisplay';
import type { CouponCode, RedeemResult } from '@/types';

export default function Home() {
  const [codes, setCodes] = useState<CouponCode[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [pid, setPid] = useState('');
  const [isLoadingCodes, setIsLoadingCodes] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [results, setResults] = useState<RedeemResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchCodes = useCallback(async () => {
    setIsLoadingCodes(true);
    try {
      const response = await fetch('/api/codes');
      const data = await response.json();
      setCodes(data.codes || []);
      setLastUpdated(data.lastUpdated || '');
    } catch (error) {
      console.error('Error fetching codes:', error);
      setCodes([]);
    } finally {
      setIsLoadingCodes(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleToggleCode = (code: string) => {
    setSelectedCodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedCodes(new Set(codes.map(c => c.code)));
  };

  const handleDeselectAll = () => {
    setSelectedCodes(new Set());
  };

  const handleRedeem = async () => {
    if (!pid.trim() || selectedCodes.size === 0) return;

    setIsRedeeming(true);
    setResults([]);
    setCurrentIndex(0);

    const codesToRedeem = Array.from(selectedCodes);
    const newResults: RedeemResult[] = [];

    for (let i = 0; i < codesToRedeem.length; i++) {
      const code = codesToRedeem[i];
      setCurrentIndex(i + 1);

      try {
        const response = await fetch('/api/redeem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            couponCode: code,
            pid: pid.trim(),
          }),
        });

        const result: RedeemResult = await response.json();
        newResults.push(result);
        setResults([...newResults]);

        if (i < codesToRedeem.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error redeeming code ${code}:`, error);
        newResults.push({
          code,
          success: false,
          message: 'Network link failure',
        });
        setResults([...newResults]);
      }
    }

    setIsRedeeming(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-[100] border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black tracking-tighter">7K</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-100 tracking-tight leading-none uppercase">
                Re:Birth <span className="text-primary">Redeem</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Netmarble Auto Tool</p>
            </div>
          </div>

          <button
            className="group btn btn-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 text-[10px] uppercase font-bold tracking-widest rounded-lg px-4"
            onClick={fetchCodes}
            disabled={isLoadingCodes}
          >
            {isLoadingCodes ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transition-transform group-hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Database
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Code List */}
          <div className="lg:col-span-8">
            <CodeList
              codes={codes}
              selectedCodes={selectedCodes}
              onToggleCode={handleToggleCode}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              loading={isLoadingCodes}
            />
            {lastUpdated && (
              <p className="mt-6 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                Source Synchronized: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>

          {/* Right Column - Sidemenu */}
          <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-32">
            <RedeemForm
              pid={pid}
              onPidChange={setPid}
              onRedeem={handleRedeem}
              selectedCount={selectedCodes.size}
              isRedeeming={isRedeeming}
            />

            <ResultDisplay
              results={results}
              currentIndex={currentIndex}
              totalCount={selectedCodes.size}
              isRedeeming={isRedeeming}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Powered by Next.js & Node.js
            </p>
            <div className="flex gap-4">
              <a href="https://www.pockettactics.com/seven-knights-rebirth/codes" target="_blank" className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-primary transition-colors">Data Source</a>
              <span className="text-slate-800">/</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Unofficial Netmarble Tool</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
