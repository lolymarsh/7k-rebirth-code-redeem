'use client';

interface RedeemFormProps {
    pid: string;
    onPidChange: (pid: string) => void;
    onRedeem: () => void;
    selectedCount: number;
    isRedeeming: boolean;
}

export default function RedeemForm({
    pid,
    onPidChange,
    onRedeem,
    selectedCount,
    isRedeeming
}: RedeemFormProps) {
    return (
        <div className="glass-card rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-tight">Account Detail</h2>
                </div>

                <div className="space-y-6">
                    <div className="form-control w-full">
                        <label className="label pt-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">User ID (UID)</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Ex. 123456789"
                                className="input w-full bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-600 focus:bg-white/10 focus:border-primary/50 transition-all rounded-xl pl-4"
                                value={pid}
                                onChange={(e) => onPidChange(e.target.value)}
                                disabled={isRedeeming}
                            />
                            <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <label className="label">
                            <span className="text-[10px] text-slate-500 font-medium leading-relaxed italic opacity-80">
                                Menu &rarr; Settings &rarr; Account &rarr; Copy UID
                            </span>
                        </label>
                    </div>

                    <div className="h-px bg-white/5 w-full"></div>

                    <button
                        className={`btn btn-primary btn-lg w-full rounded-xl border-none font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${isRedeeming ? 'loading' : ''}`}
                        onClick={onRedeem}
                        disabled={!pid.trim() || selectedCount === 0 || isRedeeming}
                    >
                        {isRedeeming ? (
                            <span className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-xs"></span>
                                Processing API...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Redeem {selectedCount} Code{selectedCount !== 1 ? 's' : ''}
                            </span>
                        )}
                    </button>

                    {!pid.trim() && (
                        <div className="bg-amber-400/5 border border-amber-400/10 rounded-xl p-4 flex gap-3 animate-slide-up">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-amber-500/80 text-xs font-medium">User ID is required for verification</span>
                        </div>
                    )}

                    {pid.trim() && selectedCount === 0 && (
                        <div className="bg-sky-400/5 border border-sky-400/10 rounded-xl p-4 flex gap-3 animate-slide-up">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current text-sky-500 shrink-0 w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="text-sky-500/80 text-xs font-medium">Select coupons to begin process</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
