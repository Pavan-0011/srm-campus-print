import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { AuthScreen } from './components/AuthScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { NewOrderWizard } from './components/NewOrderWizard';
import { MyOrdersScreen } from './components/MyOrdersScreen';
import { PaymentsScreen } from './components/PaymentsScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { PaymentModal } from './components/PaymentModal';
import { TrackingModal } from './components/TrackingModal';
import { ReceiptModal } from './components/ReceiptModal';
import { HelpSupportModal } from './components/HelpSupportModal';
import { ProfileModal } from './components/ProfileModal';
import { PrintOrder, UserProfile, NotificationItem } from './types';
import { initialOrders, mockNotifications } from './data/mockData';
import { Menu } from 'lucide-react';

export const App: React.FC = () => {
  // Authentication State: MUST be false initially so every user sees the Login page!
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<PrintOrder[]>(initialOrders);
  const [ordersFilter, setOrdersFilter] = useState<string>('all');

  // Wizard preset state
  const [wizardPreset, setWizardPreset] = useState<Partial<PrintOrder> | undefined>(undefined);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  // Modals State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<Partial<PrintOrder>>({});

  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<PrintOrder | null>(null);

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<PrintOrder | null>(null);

  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Handlers
  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleStartNewOrder = (preset?: Partial<PrintOrder>) => {
    setWizardPreset(preset);
    setActiveTab('new-order');
  };

  const handleProceedToPayment = (orderData: Partial<PrintOrder>) => {
    setPendingOrderData(orderData);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (newOrder: PrintOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'PhonePe Payment Verified! 🖨️',
      message: `₹${newOrder.cost} for order ${newOrder.id} (${newOrder.title}) was verified via UTR: ${newOrder.utrNumber}. Spooling to laser printer.`,
      time: 'Just now',
      read: false,
      type: 'payment',
      orderId: newOrder.id
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (newOrder.paymentMethod?.includes('Campus Cash') && user) {
      setUser({
        ...user,
        campusCashBalance: Math.max(0, user.campusCashBalance - newOrder.cost)
      });
    }

    setActiveTab('my-orders');
    setOrdersFilter('all');
  };

  const handleTrackOrder = (order: PrintOrder) => {
    setSelectedOrderForTracking(order);
    setTrackingModalOpen(true);
  };

  const handleDownloadReceipt = (order: PrintOrder) => {
    setSelectedOrderForReceipt(order);
    setReceiptModalOpen(true);
  };

  const handleReorder = (order: PrintOrder) => {
    setWizardPreset({
      title: `${order.title} (Reorder)`,
      productType: order.productType,
      fileName: order.fileName,
      fileSize: order.fileSize,
      pageCount: order.pageCount,
      copies: order.copies,
      printType: order.printType,
      sides: order.sides,
      binding: order.binding,
      paperSize: order.paperSize,
      paperQuality: order.paperQuality,
      specialInstructions: order.specialInstructions
    });
    setActiveTab('new-order');
  };

  const handleViewOrdersWithFilter = (filter: string = 'all') => {
    setOrdersFilter(filter);
    setActiveTab('my-orders');
  };

  const handleSelectOrderById = (orderId: string) => {
    const found = orders.find((o) => o.id === orderId);
    if (found) {
      handleTrackOrder(found);
    } else {
      setActiveTab('my-orders');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleAddCampusCash = (amount: number) => {
    if (!user) return;
    setUser({
      ...user,
      campusCashBalance: user.campusCashBalance + amount
    });
  };

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'New' || o.status === 'In Progress'
  ).length;

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // If not authenticated, render Login Screen
  if (!isAuthenticated || !user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0B1313] text-[#F8FAFC] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <Header
        user={user}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setActiveTab('notifications')}
        onOpenProfile={() => setProfileModalOpen(true)}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Mobile Subbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-[#162321]/90 border-b border-white/[0.08] sticky top-16 z-20 backdrop-blur-md">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white"
        >
          <Menu className="w-4 h-4 text-emerald-400" />
          <span>Menu</span>
        </button>
        <span className="text-xs font-semibold text-emerald-400 capitalize">
          {activeTab.replace('-', ' ')}
        </span>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'help') {
              setHelpModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          activeOrdersCount={activeOrdersCount}
          unreadNotificationsCount={unreadNotificationsCount}
          onLogout={handleLogout}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardScreen
              user={user}
              orders={orders}
              onStartNewOrder={handleStartNewOrder}
              onViewOrders={handleViewOrdersWithFilter}
              onTrackOrder={handleTrackOrder}
            />
          )}

          {activeTab === 'new-order' && (
            <NewOrderWizard
              initialPreset={wizardPreset}
              onProceedToPayment={handleProceedToPayment}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'my-orders' && (
            <MyOrdersScreen
              orders={orders}
              initialFilter={ordersFilter}
              onTrackOrder={handleTrackOrder}
              onDownloadReceipt={handleDownloadReceipt}
              onReorder={handleReorder}
              onStartNewOrder={() => handleStartNewOrder()}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsScreen
              user={user}
              orders={orders}
              onViewReceipt={handleDownloadReceipt}
              onAddCampusCash={handleAddCampusCash}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsScreen
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onClearNotifications={handleClearNotifications}
              onSelectOrderById={handleSelectOrderById}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <PaymentModal
        isOpen={paymentModalOpen}
        orderData={pendingOrderData}
        user={user}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onViewReceipt={handleDownloadReceipt}
      />

      <TrackingModal
        isOpen={trackingModalOpen}
        order={selectedOrderForTracking}
        onClose={() => setTrackingModalOpen(false)}
        onViewReceipt={handleDownloadReceipt}
      />

      <ReceiptModal
        isOpen={receiptModalOpen}
        order={selectedOrderForReceipt}
        user={user}
        onClose={() => setReceiptModalOpen(false)}
      />

      <HelpSupportModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        user={user}
        onClose={() => setProfileModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default App;
