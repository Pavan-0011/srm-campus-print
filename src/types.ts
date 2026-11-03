export type OrderStatus = 'New' | 'In Progress' | 'Ready for Pickup' | 'Completed';

export interface PrintOrder {
  id: string;
  title: string;
  productType: string;
  fileName: string;
  fileSize?: string;
  pageCount: number;
  copies: number;
  printType: 'Black & White' | 'Color';
  sides: 'Single Side' | 'Both Sides';
  binding: 'None' | 'Spiral' | 'Hard Binding' | 'Corner Staple';
  paperSize: 'A4' | 'A3' | 'Letter';
  paperQuality: 'Standard (75 GSM)' | 'Premium (100 GSM)';
  cost: number;
  timestamp: string;
  estimatedTime: string;
  queuePosition?: number;
  status: OrderStatus;
  pickupToken?: string;
  paymentMethod?: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Pay at Counter' | 'Settled to Owner';
  specialInstructions?: string;
  progressStep?: number;
  studentName?: string;
  studentRegNo?: string;
  utrNumber?: string;
}

export interface UserProfile {
  name: string;
  initials: string;
  email: string;
  regNumber: string;
  role: 'Student' | 'Admin';
  department: string;
  semester: string;
  campusCashBalance: number;
  phone: string;
}

export interface MerchantBankDetails {
  accountHolderName: string;
  businessName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountType: 'Current' | 'Savings';
  merchantUpiId: string;
  merchantPhone: string;
  businessPan: string;
  gstin: string;
  autoSettleToBank: boolean;
  settlementFrequency: 'Instant' | 'Daily at 10 PM' | 'Weekly';
  totalEarnings: number;
  pendingSettlement: number;
  settledToBank: number;
}

export interface TransactionRecord {
  id: string;
  orderId: string;
  studentName: string;
  studentRegNo: string;
  studentEmail: string;
  amount: number;
  paymentMethod: string;
  utrNumber: string;
  timestamp: string;
  status: 'Credited to Owner Bank' | 'Pending Settle' | 'Pay at Counter';
  destinationBank: string;
  destinationAccount: string;
  destinationUpi: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'payment' | 'system';
  orderId?: string;
}

export interface QuickServiceItem {
  id: string;
  title: string;
  description: string;
  priceTag: string;
  iconName: string;
  preset: Partial<PrintOrder>;
}
