export interface CouponCode {
    code: string;
    reward: string;
    expires: string;
    isNew?: boolean;
}

export interface RedeemRequest {
    couponCode: string;
    pid: string;
}

export interface RedeemResult {
    code: string;
    success: boolean;
    message: string;
    data?: unknown;
}

export interface CodesResponse {
    codes: CouponCode[];
    lastUpdated: string;
}
