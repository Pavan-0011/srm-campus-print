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
  paymentStatus?: 'Paid' | 'Pending Verification' | 'Pay at Counter';
  specialInstructions?: string;
  progressStep?: number;
  studentName?: string;
  studentEmail?: string;
  studentRegNo?: string;
  utrNumber?: string;
  paymentScreenshot?: string;
}

export interface UserProfile {
  name: string;
  initials: string;
  email: string;
  regNumber: string;
  role: 'Student';
  department: string;
  semester: string;
  campusCashBalance: number;
  phone: string;
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
