import type { VercelRequest, VercelResponse } from '@vercel/node';
import dns from 'dns';
import crypto from 'crypto';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const OTP_SECRET = process.env.OTP_SECRET || 'srm-campus-print-otp-secret-key-2026';

function generateOtpToken(email: string, otp: string, expiresAt: number): string {
  return crypto.createHmac('sha256', OTP_SECRET).update(`${email}:${otp}:${expiresAt}`).digest('hex');
}

// In-memory store for OTPs (keyed by lowercase email)
declare global {
  var __otpStore: Map<string, { otp: string; expiresAt: number }> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map();
}

const otpStore = global.__otpStore;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
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
    const { email, resendKey, smtpConfig } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email address syntax.' });
    }

    const domain = cleanEmail.split('@')[1];

    // 1. Verify that the domain exists and has active MX records
    try {
      const mxRecords = await dns.promises.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return res.status(400).json({
          error: `The domain "${domain}" has no mail exchange (MX) servers and cannot receive emails.`
        });
      }
    } catch (dnsErr: any) {
      return res.status(400).json({
        error: `The email domain "${domain}" does not exist. Please enter a valid, active email address.`
      });
    }

    // 2. Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    const token = generateOtpToken(cleanEmail, otp, expiresAt);

    otpStore.set(cleanEmail, { otp, expiresAt });

    // 3. Dispatch real email via available providers
    const activeResendKey = resendKey || process.env.RESEND_API_KEY;
    const activeSmtp = smtpConfig || (process.env.SMTP_USER && process.env.SMTP_PASS ? {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : null);

    let emailDelivered = false;
    let providerUsed = 'none';

    // Provider A: Resend API
    if (activeResendKey) {
      try {
        const resend = new Resend(activeResendKey);
        await resend.emails.send({
          from: 'SRM AP Print Hub <onboarding@resend.dev>',
          to: [cleanEmail],
          subject: `${otp} is your SRM AP Print Hub verification code`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0B1313; color: #F8FAFC; border-radius: 12px; border: 1px solid #22C55E;">
              <h2 style="color: #22C55E; margin-bottom: 8px;">SRM University AP</h2>
              <p style="color: #94A3B8; font-size: 14px;">Campus Print & Pickup Booking System</p>
              <hr style="border: 0; border-top: 1px solid #162321; margin: 20px 0;" />
              <p style="font-size: 14px;">Your one-time login verification code is:</p>
              <div style="background: #162321; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px dashed #FACC15;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #FACC15; font-family: monospace;">${otp}</span>
              </div>
              <p style="font-size: 12px; color: #94A3B8;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
          `
        });
        emailDelivered = true;
        providerUsed = 'Resend';
      } catch (err: any) {
        console.error('Resend delivery error:', err);
      }
    }

    // Provider B: SMTP (Nodemailer)
    if (!emailDelivered && activeSmtp) {
      try {
        const transporter = nodemailer.createTransport({
          host: activeSmtp.host,
          port: activeSmtp.port,
          secure: activeSmtp.secure !== false,
          auth: {
            user: activeSmtp.user,
            pass: activeSmtp.pass
          }
        });

        await transporter.sendMail({
          from: `"SRM AP Print Hub" <${activeSmtp.user}>`,
          to: cleanEmail,
          subject: `${otp} is your SRM AP Print Hub verification code`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0B1313; color: #F8FAFC; border-radius: 12px; border: 1px solid #22C55E;">
              <h2 style="color: #22C55E; margin-bottom: 8px;">SRM University AP</h2>
              <p style="color: #94A3B8; font-size: 14px;">Campus Print &amp; Pickup Booking System</p>
              <hr style="border: 0; border-top: 1px solid #162321; margin: 20px 0;" />
              <p style="font-size: 14px;">Your one-time login verification code is:</p>
              <div style="background: #162321; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px dashed #FACC15;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #FACC15; font-family: monospace;">${otp}</span>
              </div>
              <p style="font-size: 12px; color: #94A3B8;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
          `
        });
        emailDelivered = true;
        providerUsed = 'SMTP';
      } catch (err: any) {
        console.error('SMTP delivery error:', err);
      }
    }

    return res.status(200).json({
      success: true,
      message: `OTP has been dispatched to ${cleanEmail}. Please check your inbox.`,
      email: cleanEmail,
      token,
      expiresAt,
      emailDelivered,
      previewOtp: !emailDelivered ? otp : undefined,
      providerUsed
    });
  } catch (error: any) {
    console.error('Send OTP Handler Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error while sending OTP.' });
  }
}
