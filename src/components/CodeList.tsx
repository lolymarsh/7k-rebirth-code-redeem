'use client';

import { CouponCode } from '@/types';

interface CodeListProps {
    codes: CouponCode[];
    selectedCodes: Set<string>;
    onToggleCode: (code: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    loading: boolean;
}

export default function CodeList({
    codes,
    selectedCodes,
    onToggleCode,
    onSelectAll,
    onDeselectAll,
    loading
}: CodeListProps) {
    if (loading) {
        return (
            <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="p-8">
                    <div className="flex flex-col items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary/60"></span>
                        <p className="mt-4 text-slate-400 font-medium tracking-wide">Syncing Coupons...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (codes.length === 0) {
        return (
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col items-center justify-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="mt-4 text-slate-400">No active coupons found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl overflow-hidden animate-slide-up">
            <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Active Coupons</h2>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest opacity-60">
                                {codes.length} items available
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="btn btn-xs sm:btn-sm btn-ghost bg-white/5 hover:bg-white/10 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-3"
                            onClick={onSelectAll}
                        >
                            Select All
                        </button>
                        <button
                            className="btn btn-xs sm:btn-sm btn-ghost bg-white/5 hover:bg-white/10 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-3"
                            onClick={onDeselectAll}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Simplified Grid UI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {codes.map((item, index) => {
                        const isSelected = selectedCodes.has(item.code);
                        return (
                            <div
                                key={item.code}
                                className={`relative group cursor-pointer transition-all duration-300 rounded-xl border p-4 flex items-center justify-between overflow-hidden animate-slide-up
                  ${isSelected
                                        ? 'bg-primary/10 border-primary/40'
                                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'}`}
                                onClick={() => onToggleCode(item.code)}
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isSelected ? 'bg-primary scale-125' : 'bg-slate-700'}`}></div>
                                    <div className="flex flex-col">
                                        <span className={`font-mono text-sm font-bold tracking-tight transition-colors ${isSelected ? 'text-primary' : 'text-slate-300'}`}>
                                            {item.code}
                                        </span>
                                        {item.isNew && (
                                            <span className="text-[8px] font-black uppercase text-primary tracking-tighter mt-0.5">Newly Found</span>
                                        )}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="bg-primary/20 p-1 rounded-full animate-fade-in">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Selection Engine Status: <span className="text-emerald-500">Optimal</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <span className="text-primary bg-primary/10 px-2 py-0.5 rounded mr-1">{selectedCodes.size}</span> Selected
                    </div>
                </div>
            </div>
        </div>
    );
}
