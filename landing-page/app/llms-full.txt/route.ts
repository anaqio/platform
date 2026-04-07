import { NextResponse } from 'next/server';

import { LLMS_FULL_TXT } from '@/lib/data/llms';

export async function GET() {
  return new NextResponse(LLMS_FULL_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
