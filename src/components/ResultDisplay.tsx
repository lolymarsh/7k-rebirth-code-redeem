'use client';

import { RedeemResult } from '@/types';

interface ResultDisplayProps {
    results: RedeemResult[];
    currentIndex: number;
    totalCount: number;
    isRedeeming: boolean;
}

export default function ResultDisplay({
    results,
    currentIndex,
    totalCount,
    isRedeeming
}: ResultDisplayProps) {
    if (results.length === 0 && !isRedeeming) {
        return null;
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return (
        <div className="glass-card rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-100 tracking-tight">API Results</h2>
                    </div>
                    {isRedeeming && (
                        <div className="badge badge-primary bg-primary/10 border-none text-[10px] uppercase font-black px-3 animate-pulse">Running</div>
                    )}
                </div>

                {isRedeeming && (
                    <div className="mb-8">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                            <span>Progress Status</span>
                            <span>{Math.round((currentIndex / totalCount) * 100)}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-500 rounded-full"
                                style={{ width: `${(currentIndex / totalCount) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 transition-all hover:bg-emerald-500/10">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mb-1">Success</div>
                                <div className="text-2xl font-black text-emerald-500">{successCount}</div>
                            </div>
                            <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 transition-all hover:bg-rose-500/10">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-rose-500/60 mb-1">Failed</div>
                                <div className="text-2xl font-black text-rose-500">{failCount}</div>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {[...results].reverse().map((result, index) => (
                                <div
                                    key={`${result.code}-${index}`}
                                    className={`p-4 rounded-xl flex items-start gap-4 transition-all animate-slide-up bg-white/[0.02] border ${result.success ? 'border-emerald-500/10' : 'border-rose-500/10'}`}
                                >
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${result.success ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-xs font-black text-slate-200 uppercase tracking-tighter">{result.code}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{result.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
