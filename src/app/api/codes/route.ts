import { NextResponse } from 'next/server';
import type { CodesResponse, CouponCode } from '@/types';

export async function GET() {
    try {
        const response = await fetch('https://www.pockettactics.com/seven-knights-rebirth/codes', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch codes page');
        }

        const html = await response.text();
        const codes = parseCodesFromHtml(html);

        const result: CodesResponse = {
            codes,
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching codes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch codes', codes: [], lastUpdated: '' },
            { status: 500 }
        );
    }
}

function parseCodesFromHtml(html: string): CouponCode[] {
    const codes: CouponCode[] = [];

    // Match list items with pattern: CODE - reward (expires DATE) (new!)
    // Pattern: <li>CODE - reward (expires DATE) (new!)</li>
    const listItemRegex = /<li[^>]*>([A-Z0-9]+)\s*[-–—]\s*(.+?)\s*\(expires\s+([^)]+)\)(\s*\(new!\))?<\/li>/gi;

    let match;
    while ((match = listItemRegex.exec(html)) !== null) {
        const code = match[1].trim();
        const reward = match[2].trim();
        const expires = match[3].trim();
        const isNew = !!match[4];

        codes.push({
            code,
            reward,
            expires,
            isNew
        });
    }

    // If no codes found with first pattern, try alternative pattern
    if (codes.length === 0) {
        // Try matching strong tags: <strong>CODE</strong> - reward
        const strongRegex = /<strong>([A-Z0-9]+)<\/strong>\s*[-–—]\s*(.+?)(?:\s*\(expires\s+([^)]+)\))?(?:\s*\(new!\))?/gi;

        while ((match = strongRegex.exec(html)) !== null) {
            const code = match[1].trim();
            const reward = match[2].replace(/<[^>]*>/g, '').trim();
            const expires = match[3]?.trim() || 'Unknown';

            codes.push({
                code,
                reward,
                expires,
                isNew: html.includes(`${code}`) && html.toLowerCase().includes('new')
            });
        }
    }

    // Fallback: Parse plain text patterns
    if (codes.length === 0) {
        const plainTextRegex = /([A-Z][A-Z0-9]{5,})\s*[-–—]\s*([^(\n]+)(?:\s*\(expires\s+([^)]+)\))?/gi;

        while ((match = plainTextRegex.exec(html)) !== null) {
            const code = match[1].trim();
            const reward = match[2].replace(/<[^>]*>/g, '').trim();
            const expires = match[3]?.trim() || 'Unknown';

            // Avoid duplicates
            if (!codes.find(c => c.code === code)) {
                codes.push({
                    code,
                    reward,
                    expires,
                    isNew: false
                });
            }
        }
    }

    return codes;
}
