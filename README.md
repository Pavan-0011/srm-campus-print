# Campus Print & Pickup Booking System (SRM AP)

A production-grade, dark-academic glassmorphism web application built for **SRM University AP** to streamline campus printing, photocopying, spiral binding, and express pickup.

## 🚀 Live Local Server
- **URL**: `http://localhost:5173/`
- **Location**: `/Users/bitrapavankumar/.gemini/antigravity/scratch/srm-campus-print`

## 🎨 Theme & Visual Tokens
- **Background**: Dark Charcoal / Forest Slate (`#0B1313` to `#111C1A`)
- **Card Containers**: Glassmorphic translucent (`#162321` with `rgba(255, 255, 255, 0.08)` border & backdrop blur)
- **Primary Accent**: Vibrant Mint / Emerald (`#22C55E`, `#16A34A`, `#4ADE80`)
- **Warning & Price Callouts**: Warm Yellow / Amber (`#FACC15`, `#EAB308`)
- **Status Pills**:
  - `In Progress`: Amber/Yellow pill (`#FACC15`)
  - `Ready for Pickup`: Cyan / Sky Blue pill (`#38BDF8`)
  - `Completed`: Mint Green pill (`#22C55E`)
  - `New`: Royal Blue pill (`#2563EB`)
- **Typography**: Inter & JetBrains Mono for monetary and order identifiers

## 🖥️ Screen Architecture
1. **Screen A: Sign In / Auth**
   - Campus landmark photography with dark aesthetic overlay
   - Floating dark glass card with SRM AP emblem
   - University email (`@srmap.edu.in`), password, Remember Me, and One-Click Student/Faculty demo login
2. **Screen B: Student Dashboard & Quick Services**
   - Welcome banner with live station status
   - 4 Metric KPI cards: Active Orders, Total Orders, Total Spent (₹168 in Yellow), Avg Completion Time (~15 min)
   - Quick Services Grid: Print Documents, Xerox, Bind, Project Reports, Question Papers
   - Live Counter Status for Central Library Ground Floor Xerox Hub
3. **Screen C: Place a Print Order (Step-by-Step Wizard)**
   - Stepper: `[1] Upload & Settings` ➔ `[2] Payment` ➔ `[3] Confirmation`
   - Drag & drop zone with file preview, remove icon, page count detection & quick demo files
   - Print Options: Copies counter (`-` / `+`), Print Type (B/W ₹2 vs Color ₹5), Sides (Single vs Both Sides), Finishing & Binding (Spiral ₹30, Hard ₹120, Corner Staple ₹5)
   - Sticky bottom summary bar with real-time price calculation and "Proceed to Payment"
4. **Screen D: My Orders Management & Analytics**
   - Search by Order ID, File Name, or Title
   - Filter pills: All Orders, In Progress, Ready for Pickup, Completed, New
   - Exact 9 columns: Order ID, Title, Product/Type, File with download icon, Cost, Last Activity, Est. Print Time, Status, Action (Track, Receipt, Reorder)
   - Bottom info card with printer illustration
5. **Complete Checkout & Payment Gateway Modal**
   - 4 Payment Tabs:
     1. UPI / QR with 5-minute live countdown timer, PhonePe, GPay, Paytm, CRED UPI, or custom VPA
     2. Credit & Debit Cards (RuPay, Visa, MasterCard)
     3. Net Banking (SBI, HDFC, ICICI, Axis + 12+ retail banks)
     4. Campus Cash (Student ID RFID wallet balance ₹420) or Pay at Counter (COD)
   - Interactive 2-second processing simulation with animated banking handshake
   - Success screen with confetti celebration, generated digital pickup QR token, invoice download, and auto-redirect
6. **Auxiliary Features**
   - Live Order Tracking timeline modal
   - Official Tax Invoice / Printable Receipt voucher
   - Campus Cash RFID Wallet manager with Top-up modal
   - Notifications & Station alerts center
   - Help & Support with campus counter locations, working hours, and FAQs
