import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Request, Response } from 'express';

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface PaymentRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes?: any;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body as PaymentRequest;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as PaymentVerification;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
}

// UPI payment specific methods
export function generateUPILink(amount: number, name: string, upiId: string, note: string = '') {
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  return upiUrl;
}

// Manual payment verification for UPI/wallet transfers
export function verifyManualPayment(transactionId: string, amount: number, paymentMethod: string) {
  // This would integrate with payment gateway APIs or manual verification
  // For now, return a pending status that requires admin approval
  return {
    status: 'pending_verification',
    transactionId,
    amount,
    paymentMethod,
    requiresManualReview: true
  };
}