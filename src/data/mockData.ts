import {
  PrintOrder,
  UserProfile,
  NotificationItem,
  QuickServiceItem,
  MerchantBankDetails,
  TransactionRecord
} from '../types';

export const initialUser: UserProfile = {
  name: 'B. Tharun',
  initials: 'TA',
  email: 'tharun_b@srmap.edu.in',
  regNumber: 'AP21110010482',
  role: 'Student',
  department: 'Computer Science & Engineering',
  semester: 'Semester VI - 2026',
  campusCashBalance: 420,
  phone: '+91 98765 43210'
};

export const initialAdminUser: UserProfile = {
  name: 'Pavan Kumar',
  initials: 'PK',
  email: 'admin.reprographics@srmap.edu.in',
  regNumber: 'SRM-OWNER-001',
  role: 'Admin',
  department: 'Campus Reprographics & Xerox Services (Business Owner)',
  semester: 'Authorized Operator Portal',
  campusCashBalance: 48520,
  phone: '+91 94400 12345'
};

export const initialMerchantBankDetails: MerchantBankDetails = {
  accountHolderName: 'Pavan Kumar',
  businessName: 'SRM Campus Reprographics & Print Hub',
  bankName: 'HDFC Bank Ltd.',
  accountNumber: '50200084920194',
  ifscCode: 'HDFC0001842',
  branch: 'SRM Amaravati Campus Branch, Neerukonda',
  accountType: 'Current',
  merchantUpiId: 'pavankumar.srmxerox@hdfcbank',
  merchantPhone: '+91 94400 12345',
  businessPan: 'BNVPK8920C',
  gstin: '37AAAAU0000A1Z5',
  autoSettleToBank: true,
  settlementFrequency: 'Instant',
  totalEarnings: 8450,
  pendingSettlement: 454,
  settledToBank: 7996
};

export const initialTransactions: TransactionRecord[] = [
  {
    id: 'TXN-80410',
    orderId: '#CP1080',
    studentName: 'B. Tharun',
    studentRegNo: 'AP21110010482',
    studentEmail: 'tharun_b@srmap.edu.in',
    amount: 24,
    paymentMethod: 'UPI (PhonePe)',
    utrNumber: 'UTR-330491829012',
    timestamp: 'Today, 2:55 PM',
    status: 'Credited to Owner Bank',
    destinationBank: 'HDFC Bank (A/C ...0194)',
    destinationAccount: '50200084920194',
    destinationUpi: 'pavankumar.srmxerox@hdfcbank'
  },
  {
    id: 'TXN-10291',
    orderId: '#0001',
    studentName: 'K. Sneha',
    studentRegNo: 'AP21110010190',
    studentEmail: 'sneha_k@srmap.edu.in',
    amount: 56,
    paymentMethod: 'Google Pay (UPI)',
    utrNumber: 'UTR-449102839102',
    timestamp: 'Today, 1:10 PM',
    status: 'Credited to Owner Bank',
    destinationBank: 'HDFC Bank (A/C ...0194)',
    destinationAccount: '50200084920194',
    destinationUpi: 'pavankumar.srmxerox@hdfcbank'
  },
  {
    id: 'TXN-95202',
    orderId: '#CP1095',
    studentName: 'M. Rahul',
    studentRegNo: 'AP21110010672',
    studentEmail: 'rahul_m@srmap.edu.in',
    amount: 45,
    paymentMethod: 'Paytm UPI',
    utrNumber: 'UTR-559102830193',
    timestamp: 'Today, 3:15 PM',
    status: 'Credited to Owner Bank',
    destinationBank: 'HDFC Bank (A/C ...0194)',
    destinationAccount: '50200084920194',
    destinationUpi: 'pavankumar.srmxerox@hdfcbank'
  },
  {
    id: 'TXN-42918',
    orderId: '#CP1042',
    studentName: 'B. Tharun',
    studentRegNo: 'AP21110010482',
    studentEmail: 'tharun_b@srmap.edu.in',
    amount: 120,
    paymentMethod: 'Campus Cash (RFID Debit)',
    utrNumber: 'RFID-9810293847',
    timestamp: 'Nov 19, 2026, 4:20 PM',
    status: 'Credited to Owner Bank',
    destinationBank: 'HDFC Bank (A/C ...0194)',
    destinationAccount: '50200084920194',
    destinationUpi: 'pavankumar.srmxerox@hdfcbank'
  },
  {
    id: 'TXN-19830',
    orderId: '#CP1019',
    studentName: 'V. Sai Priya',
    studentRegNo: 'AP21110010245',
    studentEmail: 'priya_v@srmap.edu.in',
    amount: 15,
    paymentMethod: 'UPI (CRED)',
    utrNumber: 'UTR-882910394819',
    timestamp: 'Nov 18, 2026, 11:00 AM',
    status: 'Credited to Owner Bank',
    destinationBank: 'HDFC Bank (A/C ...0194)',
    destinationAccount: '50200084920194',
    destinationUpi: 'pavankumar.srmxerox@hdfcbank'
  },
  {
    id: 'TXN-08119',
    orderId: '#CP1008',
    studentName: 'R. Arvind',
    studentRegNo: 'AP21110010912',
    studentEmail: 'arvind_r@srmap.edu.in',
    amount: 190,
    paymentMethod: 'HDFC NetBanking',
    utrNumber: 'NETB-109283019283',
    timestamp: 'Nov 17, 2026, 9:45 AM',
    status: 'Credited to Owner Bank',
    destinationBank: 'HDFC Bank (A/C ...0194)',
    destinationAccount: '50200084920194',
    destinationUpi: 'pavankumar.srmxerox@hdfcbank'
  }
];

export const initialOrders: PrintOrder[] = [
  {
    id: '#CP1080',
    title: 'Biology III: Semester 2 Lab',
    productType: 'Letter Booklet',
    fileName: 'biology_homework.pdf',
    fileSize: '4.2 MB',
    pageCount: 12,
    copies: 1,
    printType: 'Black & White',
    sides: 'Both Sides',
    binding: 'None',
    paperSize: 'A4',
    paperQuality: 'Standard (75 GSM)',
    cost: 24,
    timestamp: 'Nov 20, 2026, 2:55 PM',
    estimatedTime: '~15 min',
    queuePosition: 2,
    status: 'In Progress',
    pickupToken: 'SRM-8041',
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    progressStep: 2,
    specialInstructions: 'Print double sided, keep margins clear for stapling.',
    studentName: 'B. Tharun',
    studentRegNo: 'AP21110010482',
    utrNumber: 'UTR-330491829012'
  },
  {
    id: '#0001',
    title: 'Chocolate Appreciation Club',
    productType: 'Double-Sided Notes',
    fileName: 'cac_flyer_final.pdf',
    fileSize: '8.7 MB',
    pageCount: 8,
    copies: 2,
    printType: 'Color',
    sides: 'Both Sides',
    binding: 'None',
    paperSize: 'A4',
    paperQuality: 'Premium (100 GSM)',
    cost: 56,
    timestamp: 'Nov 20, 2026, 1:10 PM',
    estimatedTime: 'Ready',
    status: 'Ready for Pickup',
    pickupToken: 'SRM-1029',
    paymentMethod: 'Google Pay',
    paymentStatus: 'Paid',
    progressStep: 5,
    specialInstructions: 'Bright glossy colors for campus poster distribution.',
    studentName: 'K. Sneha',
    studentRegNo: 'AP21110010190',
    utrNumber: 'UTR-449102839102'
  },
  {
    id: '#CP1095',
    title: 'Digital Signal Processing Midsem Papers',
    productType: 'Question Papers (Previous Years)',
    fileName: 'dsp_midsem_pyq.pdf',
    fileSize: '2.1 MB',
    pageCount: 15,
    copies: 1,
    printType: 'Black & White',
    sides: 'Both Sides',
    binding: 'Corner Staple',
    paperSize: 'A4',
    paperQuality: 'Standard (75 GSM)',
    cost: 45,
    timestamp: 'Nov 20, 2026, 3:15 PM',
    estimatedTime: 'Queue: 3 ahead',
    queuePosition: 3,
    status: 'New',
    pickupToken: 'SRM-9520',
    paymentMethod: 'Paytm UPI',
    paymentStatus: 'Paid',
    progressStep: 1,
    specialInstructions: 'Corner staple top left corner.',
    studentName: 'M. Rahul',
    studentRegNo: 'AP21110010672',
    utrNumber: 'UTR-559102830193'
  },
  {
    id: '#CP1042',
    title: 'DAA Final Project Report',
    productType: 'Spiral Report',
    fileName: 'DAA_Assignment.pdf',
    fileSize: '14.8 MB',
    pageCount: 42,
    copies: 1,
    printType: 'Black & White',
    sides: 'Single Side',
    binding: 'Spiral',
    paperSize: 'A4',
    paperQuality: 'Standard (75 GSM)',
    cost: 120,
    timestamp: 'Nov 19, 2026, 4:20 PM',
    estimatedTime: 'Ready',
    status: 'Completed',
    pickupToken: 'SRM-4291',
    paymentMethod: 'Campus Cash (Student ID)',
    paymentStatus: 'Paid',
    progressStep: 5,
    specialInstructions: 'Transparent PVC front cover, blue frosted back cover.',
    studentName: 'B. Tharun',
    studentRegNo: 'AP21110010482',
    utrNumber: 'RFID-9810293847'
  },
  {
    id: '#CP1019',
    title: 'Machine Learning Formula Sheet',
    productType: 'Single Page Color',
    fileName: 'ml_formula_sheet.pdf',
    fileSize: '1.2 MB',
    pageCount: 3,
    copies: 1,
    printType: 'Color',
    sides: 'Both Sides',
    binding: 'None',
    paperSize: 'A4',
    paperQuality: 'Premium (100 GSM)',
    cost: 15,
    timestamp: 'Nov 18, 2026, 11:00 AM',
    estimatedTime: 'Ready',
    status: 'Completed',
    pickupToken: 'SRM-1983',
    paymentMethod: 'UPI (CRED)',
    paymentStatus: 'Paid',
    progressStep: 5,
    studentName: 'V. Sai Priya',
    studentRegNo: 'AP21110010245',
    utrNumber: 'UTR-882910394819'
  },
  {
    id: '#CP1008',
    title: 'Autonomous Drone Seminar Slides',
    productType: 'Handout Presentation',
    fileName: 'drone_seminar_deck.pptx',
    fileSize: '19.4 MB',
    pageCount: 20,
    copies: 2,
    printType: 'Color',
    sides: 'Both Sides',
    binding: 'Spiral',
    paperSize: 'A4',
    paperQuality: 'Premium (100 GSM)',
    cost: 190,
    timestamp: 'Nov 17, 2026, 9:45 AM',
    estimatedTime: 'Ready',
    status: 'Completed',
    pickupToken: 'SRM-0811',
    paymentMethod: 'HDFC NetBanking',
    paymentStatus: 'Paid',
    progressStep: 5,
    studentName: 'R. Arvind',
    studentRegNo: 'AP21110010912',
    utrNumber: 'NETB-109283019283'
  }
];

export const quickServices: QuickServiceItem[] = [
  {
    id: 'print-docs',
    title: 'Print Documents',
    description: 'PDF, DOCX assignments & lecture notes with fast turnaround.',
    priceTag: 'From ₹2 / pg',
    iconName: 'FileText',
    preset: {
      productType: 'Print Documents (PDF, DOCX)',
      printType: 'Black & White',
      sides: 'Both Sides',
      binding: 'None',
      paperSize: 'A4'
    }
  },
  {
    id: 'xerox-photocopy',
    title: 'Xerox (Photocopy)',
    description: 'High-speed bulk duplication of class notes & physical sheets.',
    priceTag: 'From ₹1.50 / pg',
    iconName: 'Copy',
    preset: {
      productType: 'Xerox (Photocopy)',
      printType: 'Black & White',
      sides: 'Both Sides',
      binding: 'Corner Staple'
    }
  },
  {
    id: 'bind-reports',
    title: 'Bind (Spiral / Stitch)',
    description: 'Professional transparent sheet spiral binding or hard-bound thesis.',
    priceTag: 'Spiral: ₹30 | Hard: ₹120',
    iconName: 'BookOpen',
    preset: {
      productType: 'Spiral / Hard Bound',
      printType: 'Black & White',
      sides: 'Single Side',
      binding: 'Spiral'
    }
  },
  {
    id: 'project-reports',
    title: 'Project Reports',
    description: 'Official SRM AP cover format, certificate page & IEEE template compliance.',
    priceTag: 'Complete Package ₹140',
    iconName: 'Award',
    preset: {
      productType: 'Project Report (SRM Format)',
      printType: 'Black & White',
      sides: 'Single Side',
      binding: 'Hard Binding',
      paperQuality: 'Premium (100 GSM)'
    }
  },
  {
    id: 'question-papers',
    title: 'Question Papers (PYQ)',
    description: 'Previous end-sem & mid-sem papers categorized by course code.',
    priceTag: 'Curated Sets ₹40',
    iconName: 'FileQuestion',
    preset: {
      productType: 'Question Papers (Previous Years)',
      title: 'Previous Years Question Paper Bundle',
      printType: 'Black & White',
      sides: 'Both Sides',
      binding: 'Corner Staple'
    }
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Ready for Pickup! 🎯',
    message: 'Order #0001 "Chocolate Appreciation Club" is packaged and ready at Xerox Counter #2.',
    time: '12 mins ago',
    read: false,
    type: 'order',
    orderId: '#0001'
  },
  {
    id: 'notif-2',
    title: 'Printing in Progress 🖨️',
    message: 'Order #CP1080 "Biology III: Semester 2 Lab" is currently on High-Speed Laser Printer #4.',
    time: '25 mins ago',
    read: false,
    type: 'order',
    orderId: '#CP1080'
  },
  {
    id: 'notif-3',
    title: 'Payment Credited to Your Bank 💳',
    message: '₹45 from student M. Rahul for order #CP1095 was credited to your HDFC Bank A/c ending ...0194.',
    time: '35 mins ago',
    read: true,
    type: 'payment',
    orderId: '#CP1095'
  },
  {
    id: 'notif-4',
    title: 'Campus Xerox Centre Update 📢',
    message: 'Extended operating hours till 10:00 PM during upcoming End-Semester Exam week.',
    time: 'Yesterday',
    read: true,
    type: 'system'
  }
];

export const indianBanks = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC', popular: true, color: '#004A8F' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBIN', popular: true, color: '#1B6FB5' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICIC', popular: true, color: '#B3262A' },
  { id: 'axis', name: 'Axis Bank', code: 'UTIB', popular: true, color: '#97144D' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', code: 'KKBK', popular: false, color: '#ED1C24' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PUNB', popular: false, color: '#A21D22' },
  { id: 'bob', name: 'Bank of Baroda', code: 'BARB', popular: false, color: '#F37023' },
  { id: 'canara', name: 'Canara Bank', code: 'CNRB', popular: false, color: '#0091DA' },
  { id: 'union', name: 'Union Bank of India', code: 'UBIN', popular: false, color: '#E31E24' },
  { id: 'indusind', name: 'IndusInd Bank', code: 'INDB', popular: false, color: '#881118' },
  { id: 'yes', name: 'Yes Bank', code: 'YESB', popular: false, color: '#005A9C' },
  { id: 'federal', name: 'Federal Bank', code: 'FDRL', popular: false, color: '#113355' },
];
