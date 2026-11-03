import {
  PrintOrder,
  UserProfile,
  NotificationItem,
  QuickServiceItem
} from '../types';

export const initialUser: UserProfile = {
  name: 'B. Tharun Abhay',
  initials: 'TA',
  email: 'tharun_b@srmap.edu.in',
  regNumber: 'AP21110010482',
  role: 'Student',
  department: 'Computer Science & Engineering',
  semester: 'Semester VI - 2026',
  campusCashBalance: 420,
  phone: '+91 83285 09303'
};

// Official PhonePe Merchant Scanner details given by the user
export const phonePeMerchant = {
  name: 'BUDATI THARUN ABHAY',
  vpa: '8328509303@ybl',
  qrImagePath: '/phonepe-qr.jpg',
  baseUpiUri: 'upi://pay?pa=8328509303@ybl&pn=BUDATI%20THARUN%20ABHAY&mc=0000&mode=02&purpose=00'
};

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
    paymentMethod: 'PhonePe UPI QR',
    paymentStatus: 'Paid',
    progressStep: 2,
    specialInstructions: 'Print double sided, keep margins clear for stapling.',
    studentName: 'B. Tharun Abhay',
    studentEmail: 'tharun_b@srmap.edu.in',
    studentRegNo: 'AP21110010482',
    utrNumber: '330491829012'
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
    paymentMethod: 'PhonePe UPI QR',
    paymentStatus: 'Paid',
    progressStep: 5,
    specialInstructions: 'Bright glossy colors for campus poster distribution.',
    studentName: 'B. Tharun Abhay',
    studentEmail: 'tharun_b@srmap.edu.in',
    studentRegNo: 'AP21110010482',
    utrNumber: '449102839102'
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
    paymentMethod: 'PhonePe UPI QR',
    paymentStatus: 'Paid',
    progressStep: 1,
    specialInstructions: 'Corner staple top left corner.',
    studentName: 'B. Tharun Abhay',
    studentEmail: 'tharun_b@srmap.edu.in',
    studentRegNo: 'AP21110010482',
    utrNumber: '559102830193'
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
    paymentMethod: 'PhonePe UPI QR',
    paymentStatus: 'Paid',
    progressStep: 5,
    specialInstructions: 'Transparent PVC front cover, blue frosted back cover.',
    studentName: 'B. Tharun Abhay',
    studentEmail: 'tharun_b@srmap.edu.in',
    studentRegNo: 'AP21110010482',
    utrNumber: '981029384712'
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
    paymentMethod: 'PhonePe UPI QR',
    paymentStatus: 'Paid',
    progressStep: 5,
    studentName: 'B. Tharun Abhay',
    studentEmail: 'tharun_b@srmap.edu.in',
    studentRegNo: 'AP21110010482',
    utrNumber: '882910394819'
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
    title: 'UPI Payment Verified 💳',
    message: 'PhonePe payment of ₹45 for order #CP1095 was verified (UTR: 559102830193).',
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
