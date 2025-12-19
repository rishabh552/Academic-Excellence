import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

// Simple in-memory rate limiter (per IP)
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per window
const rateLimitMap = new Map();

// Gmail SMTP Configuration
// Set these in Vercel Environment Variables:
// GMAIL_USER - Your Gmail address
// GMAIL_APP_PASSWORD - Your Gmail App Password (NOT your regular password)
// CONTACT_EMAIL - Email to receive contact form submissions (can be same as GMAIL_USER)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Rate limiting (per IP)
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    // Reset window
    entry = { count: 1, start: now };
    rateLimitMap.set(ip, entry);
  } else {
    entry.count++;
    if (entry.count > RATE_LIMIT_MAX) {
      res
        .status(429)
        .json({ error: `Rate limit exceeded. Please try again later.` });
      return;
    }
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { name, email, subject, message } = req.body;

  // Validation
  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required" });
  }

  // Create transporter with Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: `"Contact Form" <${process.env.GMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
    replyTo: email,
    subject: subject || "New Contact Form Submission",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name || "Not provided"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "Not provided"}</p>
        </div>
        <div style="background: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap; color: #555;">${message}</p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          This email was sent from the Academic Excellence contact form.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("SMTP Error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
