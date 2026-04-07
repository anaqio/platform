'use server';

import { cookies } from 'next/headers';

/**
 * Verifies the access key for the brand guidelines.
 * If correct, sets a secure session cookie.
 */
export async function verifyBrandAccess(password: string) {
  const correctPassword = process.env.BRAND_ACCESS_PASSWORD;

  if (!correctPassword) {
    console.error('BRAND_ACCESS_PASSWORD environment variable is not set');
    return { success: false, message: 'Configuration error' };
  }

  if (password === correctPassword) {
    const cookieStore = await cookies();
    cookieStore.set('brand_authorized', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return { success: true };
  }

  return { success: false, message: 'Invalid access key' };
}
