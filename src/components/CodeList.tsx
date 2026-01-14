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
                        <p className="mt-4 text-slate-400 font-medium tracking-wide">Scanning for codes...</p>
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
                        <p className="mt-4 text-slate-400">No active codes found</p>
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
                            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Available Codes</h2>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold opacity-60">Total Coupons: {codes.length}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="btn btn-sm btn-ghost bg-white/5 hover:bg-white/10 text-xs uppercase tracking-wider px-4"
                            onClick={onSelectAll}
                        >
                            Select All
                        </button>
                        <button
                            className="btn btn-sm btn-ghost bg-white/5 hover:bg-white/10 text-xs uppercase tracking-wider px-4"
                            onClick={onDeselectAll}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-slate-500 border-none">
                                <th className="bg-transparent w-12 pt-0">
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm border-white/20 checkbox-primary"
                                            checked={selectedCodes.size === codes.length && codes.length > 0}
                                            onChange={() => selectedCodes.size === codes.length ? onDeselectAll() : onSelectAll()}
                                        />
                                    </label>
                                </th>
                                <th className="bg-transparent pt-0 text-[10px] font-bold uppercase tracking-widest">Coupon Code</th>
                                <th className="bg-transparent pt-0 text-[10px] font-bold uppercase tracking-widest">Reward</th>
                                <th className="bg-transparent pt-0 text-[10px] font-bold uppercase tracking-widest">Expiry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {codes.map((item, index) => (
                                <tr
                                    key={item.code}
                                    className="group cursor-pointer transition-all duration-300"
                                    onClick={() => onToggleCode(item.code)}
                                >
                                    <td className="border-none bg-white/[0.02] group-hover:bg-white/[0.05] first:rounded-l-xl last:rounded-r-xl p-4 transition-all">
                                        <label onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm border-white/20 checkbox-primary"
                                                checked={selectedCodes.has(item.code)}
                                                onChange={() => onToggleCode(item.code)}
                                            />
                                        </label>
                                    </td>
                                    <td className="border-none bg-white/[0.02] group-hover:bg-white/[0.05] last:rounded-r-xl p-4 transition-all">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-bold text-slate-200 group-hover:text-primary transition-colors">
                                                {item.code}
                                            </span>
                                            {item.isNew && (
                                                <span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">New</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border-none bg-white/[0.02] group-hover:bg-white/[0.05] last:rounded-r-xl p-4 transition-all">
                                        <span className="text-slate-400 group-hover:text-slate-200 text-sm font-medium transition-colors">{item.reward}</span>
                                    </td>
                                    <td className="border-none bg-white/[0.02] group-hover:bg-white/[0.05] last:rounded-r-xl p-4 transition-all text-right">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wide bg-white/5 py-1 px-2 rounded-md">
                                            {item.expires === 'Unknown' ? 'No Expiry' : item.expires}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                    <span className="text-primary mr-1 bg-primary/10 px-2 py-0.5 rounded">{selectedCodes.size}</span> Selected
                </div>
            </div>
        </div>
    );
}
