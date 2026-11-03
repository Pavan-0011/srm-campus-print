import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const OTP_SECRET = process.env.OTP_SECRET || 'srm-campus-print-otp-secret-key-2026';

declare global {
  var __otpStore: Map<string, { otp: string; expiresAt: number }> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map();
}

const otpStore = global.__otpStore;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { email, otp, token, expiresAt } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and 6-digit OTP are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // 1. First check stateless cryptographic token if provided
    if (token && expiresAt) {
      if (Date.now() > Number(expiresAt)) {
        return res.status(400).json({
          error: 'This OTP code has expired. Please request a new verification code.'
        });
      }

      const expectedToken = crypto
        .createHmac('sha256', OTP_SECRET)
        .update(`${cleanEmail}:${cleanOtp}:${expiresAt}`)
        .digest('hex');

      if (expectedToken === token) {
        return res.status(200).json({
          success: true,
          message: 'Email successfully verified!',
          email: cleanEmail
        });
      }
    }

    // 2. Fallback to in-memory store
    const record = otpStore.get(cleanEmail);

    if (!record && !token) {
      return res.status(400).json({
        error: 'No active OTP found for this email address. Please click Resend OTP.'
      });
    }

    if (record) {
      if (Date.now() > record.expiresAt) {
        otpStore.delete(cleanEmail);
        return res.status(400).json({
          error: 'This OTP code has expired. Please request a new verification code.'
        });
      }

      if (record.otp !== cleanOtp) {
        return res.status(400).json({
          error: 'Incorrect OTP entered. Please check your email inbox and try again.'
        });
      }

      otpStore.delete(cleanEmail);
      return res.status(200).json({
        success: true,
        message: 'Email successfully verified!',
        email: cleanEmail
      });
    }

    return res.status(400).json({
      error: 'Incorrect OTP entered. Please check your email inbox and try again.'
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: error.message || 'Verification failed.' });
  }
}
