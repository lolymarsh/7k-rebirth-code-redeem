import { NextRequest, NextResponse } from 'next/server';
import type { RedeemRequest, RedeemResult } from '@/types';

const NETMARBLE_API = 'https://coupon.netmarble.com/api/coupon/reward';

export async function POST(request: NextRequest) {
    try {
        const body: RedeemRequest = await request.json();

        const { couponCode, pid } = body;

        if (!couponCode || !pid) {
            return NextResponse.json(
                {
                    code: couponCode || '',
                    success: false,
                    message: 'Missing couponCode or pid'
                } as RedeemResult,
                { status: 400 }
            );
        }

        const apiUrl = `${NETMARBLE_API}?gameCode=tskgb&couponCode=${encodeURIComponent(couponCode)}&langCd=EN_US&pid=${encodeURIComponent(pid)}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        const data = await response.json();

        // Parse Netmarble response
        // Typical success: { "resultCode": "0", "resultMessage": "Success", ... }
        // Typical error: { "resultCode": "xxx", "resultMessage": "Error message", ... }
        const isSuccess = data.resultCode === '0' || data.resultCode === 0 || data.success === true;

        const result: RedeemResult = {
            code: couponCode,
            success: isSuccess,
            message: data.resultMessage || data.message || (isSuccess ? 'Redeemed successfully!' : 'Failed to redeem'),
            data: data
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error redeeming code:', error);
        return NextResponse.json(
            {
                code: '',
                success: false,
                message: 'Server error while redeeming code'
            } as RedeemResult,
            { status: 500 }
        );
    }
}
