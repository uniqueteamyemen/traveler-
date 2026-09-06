import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { YEMEN_GOVERNORATES } from '../data/yemenData';
import { 
  TransportOffice, 
  OfficeCategory, 
  OfficeSubscriptionTier, 
  OfficeSubscriptionStatus,
  InterCityTripListing
} from '../types/travel';
import { CompanyShowcaseModal } from './modals/CompanyShowcaseModal';
import { SocialMediaAutoPosterModal } from './modals/SocialMediaAutoPosterModal';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Building2, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  Crown, 
  Car, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Sparkles, 
  Eye, 
  Phone, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  BadgeCheck, 
  X, 
  TrendingUp, 
  Layers, 
  UserCheck, 
  RefreshCw 
} from 'lucide-react';

export const AdminControlPortal: React.FC = () => {
  const { 
    lang, 
    transportOffices, 
    addTransportOffice, 
    updateOfficeSubscription, 
    toggleOfficeVisibility, 
    deleteTransportOffice,
    intercityListings,
    deleteIntercityListing,
    toggleListingVerification,
    adminSetFamilyTracking,
    resolveTripConflict,
    addFleetVehicleToOffice,
    userProfile,
    updateUserRole,
    setActiveTab,
    chatMessages,
    adminReplyChatMessage,
    faqs,
    addFaqItem
  } = useTravel();

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'offices_subscriptions' | 'individual_drivers' | 'trip_conflicts' | 'pricing_tiers' | 'support_chat_faq'>('offices_subscriptions');

  // Support Chat & FAQ Admin State
  const [chatCategoryFilter, setChatCategoryFilter] = useState<'all' | 'captain_question' | 'trip_booking' | 'safety_inquiry' | 'general_inquiry'>('all');
  const [chatReplies, setChatReplies] = useState<Record<string, string>>({});
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('عام');
  const [newFaqAudience, setNewFaqAudience] = useState<'all' | 'captains' | 'travelers'>('all');
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);

  // Conflict Resolution Notes State
  const [conflictNotes, setConflictNotes] = useState<Record<string, string>>({});

  // Filters for Offices
  const [categoryFilter, setCategoryFilter] = useState<'all' | OfficeCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | OfficeSubscriptionStatus>('all');
  const [searchOfficeQuery, setSearchOfficeQuery] = useState('');

  // Filters for Listings
  const [searchListingQuery, setSearchListingQuery] = useState('');

  // Selected Office for Profile Modal
  const [selectedOffice, setSelectedOffice] = useState<TransportOffice | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Social Auto-Poster Modal
  const [socialOffice, setSocialOffice] = useState<TransportOffice | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  // Subscription Edit Modal
  const [editingOffice, setEditingOffice] = useState<TransportOffice | null>(null);
  const [editTier, setEditTier] = useState<OfficeSubscriptionTier>('enterprise_large');
  const [editStatus, setEditStatus] = useState<OfficeSubscriptionStatus>('active');
  const [editCategory, setEditCategory] = useState<OfficeCategory>('large_company');
  const [editExpiresAt, setEditExpiresAt] = useState<string>('2027-01-01');
  const [editMonthlyFee, setEditMonthlyFee] = useState<number>(120000);
  const [editBlockReason, setEditBlockReason] = useState<string>('');
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  // Add New Office Modal
  const [isAddOfficeModalOpen, setIsAddOfficeModalOpen] = useState(false);
  const [newOfficeNameAr, setNewOfficeNameAr] = useState('');
  const [newOfficeGov, setNewOfficeGov] = useState('صنعاء القديمة وأمانة العاصمة');
  const [newOfficePhone, setNewOfficePhone] = useState('');
  const [newOfficeWhatsapp, setNewOfficeWhatsapp] = useState('');
  const [newOfficeCategory, setNewOfficeCategory] = useState<OfficeCategory>('medium_office');
  const [newOfficeTier, setNewOfficeTier] = useState<OfficeSubscriptionTier>('growth_medium');
  const [newOfficeFee, setNewOfficeFee] = useState<number>(60000);
  const [newOfficeAbout, setNewOfficeAbout] = useState('');

  // Block confirmation dialog
  const [blockConfirmOffice, setBlockConfirmOffice] = useState<TransportOffice | null>(null);
  const [customBlockReason, setCustomBlockReason] = useState('محجوب إدارياً لانتهاء الاشتراك الشهري وعدم التجديد');

  // Stats Calculations
  const totalOffices = transportOffices.length;
  const activeOffices = transportOffices.filter(o => o.isVisibleToPublic !== false && o.subscriptionStatus === 'active');
  const suspendedOffices = transportOffices.filter(o => o.isVisibleToPublic === false || o.subscriptionStatus === 'suspended' || o.subscriptionStatus === 'inactive');
  const totalMonthlyRevYER = activeOffices.reduce((acc, o) => acc + (o.monthlyFeeYER || 0), 0);
  const totalFleetCount = transportOffices.reduce((acc, o) => acc + (o.fleetVehicles?.length || 0), 0);

  // Filtered offices list
  const filteredOffices = transportOffices.filter(o => {
    if (categoryFilter !== 'all' && o.officeCategory !== categoryFilter) return false;
    if (statusFilter !== 'all' && o.subscriptionStatus !== statusFilter) return false;
    if (searchOfficeQuery.trim()) {
      const q = searchOfficeQuery.toLowerCase();
      const match = 
        o.nameAr.toLowerCase().includes(q) ||
        o.primaryGovernorate.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.licenseNumber.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered listings
  const filteredListings = intercityListings.filter(l => {
    if (searchListingQuery.trim()) {
      const q = searchListingQuery.toLowerCase();
      const match = 
        l.fromGovernorate.toLowerCase().includes(q) ||
        l.toGovernorate.toLowerCase().includes(q) ||
        l.driverName.toLowerCase().includes(q) ||
        l.vehicleModel.toLowerCase().includes(q) ||
        l.familyTrackingCode.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenEditSubscription = (office: TransportOffice) => {
    setEditingOffice(office);
    setEditTier(office.subscriptionTier || 'enterprise_large');
    setEditStatus(office.subscriptionStatus || 'active');
    setEditCategory(office.officeCategory || 'large_company');
    setEditExpiresAt(office.subscriptionExpiresAt || '2026-12-31');
    setEditMonthlyFee(office.monthlyFeeYER || 60000);
    setEditBlockReason(office.adminBlockReason || '');
    setIsSubModalOpen(true);
  };

  const handleSaveSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffice) return;

    const isVisible = editStatus === 'active';
    updateOfficeSubscription(editingOffice.id, {
      subscriptionTier: editTier,
      subscriptionStatus: editStatus,
      officeCategory: editCategory,
      subscriptionExpiresAt: editExpiresAt,
      monthlyFeeYER: Number(editMonthlyFee),
      isVisibleToPublic: isVisible,
      adminBlockReason: isVisible ? undefined : (editBlockReason || 'محجوب بقرار إداري')
    });

    setIsSubModalOpen(false);
    setEditingOffice(null);
  };

  const handleToggleBlock = (office: TransportOffice) => {
    if (office.isVisibleToPublic !== false && office.subscriptionStatus === 'active') {
      // Prompt for block reason
      setBlockConfirmOffice(office);
      setCustomBlockReason('محجوب إدارياً لانتهاء فترة الاشتراك وعدم السداد');
    } else {
      // Unblock immediately
      toggleOfficeVisibility(office.id, true);
    }
  };

  const handleConfirmBlock = () => {
    if (!blockConfirmOffice) return;
    toggleOfficeVisibility(blockConfirmOffice.id, false, customBlockReason);
    setBlockConfirmOffice(null);
  };

  const handleCreateNewOffice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficeNameAr.trim() || !newOfficePhone.trim()) return;

    const newOffice: Omit<TransportOffice, 'id'> = {
      nameAr: newOfficeNameAr,
      nameEn: 'New Transport Office',
      logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
      taglineAr: 'خدمات نقل بري موثوقة ومجدولة بين المحافظات',
      aboutAr: newOfficeAbout || 'مكتب نقل محلي معتمد ومسجل في شبكة المسافر (Traveler) اليمن.',
      primaryGovernorate: newOfficeGov,
      phone: newOfficePhone,
      whatsapp: newOfficeWhatsapp || newOfficePhone,
      rating: 5.0,
      reviewCount: 1,
      isVerified: true,
      licenseNumber: 'ترخيص معتمد قيد المراجعة',
      establishedYear: new Date().getFullYear(),
      officeCategory: newOfficeCategory,
      subscriptionTier: newOfficeTier,
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date().toISOString().split('T')[0],
      subscriptionExpiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      monthlyFeeYER: Number(newOfficeFee),
      isVisibleToPublic: true,
      features: ['تسيير رحلات منتظمة', 'سيارات مكيفة', 'التزام بالأمان العائلي'],
      fleetGallery: [],
      fleetVehicles: [],
      branches: [
        {
          id: `br-${Date.now()}`,
          governorate: newOfficeGov,
          city: 'المركز الرئيسي',
          address: 'الشارع العام — بالقرب من الفرزة المركزية',
          phone: newOfficePhone,
          whatsapp: newOfficeWhatsapp || newOfficePhone
        }
      ]
    };

    addTransportOffice(newOffice);
    setIsAddOfficeModalOpen(false);
    setNewOfficeNameAr('');
    setNewOfficePhone('');
    setNewOfficeWhatsapp('');
    setNewOfficeAbout('');
  };

  const isAdmin = userProfile?.role === 'admin' || userProfile?.roles?.includes('admin');

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            منطقة مخصصة للإدارة المركزية فقط 🔒
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed max-w-md mx-auto">
            عذراً، ليس لديك صلاحية للوصول إلى لوحة الإدارة العامة والاشتراكات. تم تقييد هذه الصلاحيات إدارياً لحماية بيانات المسافرين والشركات.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('driver_portal')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
          >
            الانتقال لبوابة الكباتن وملاك السيارات 🚗
          </button>
          <button
            onClick={() => setActiveTab('intercity_hub')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs transition"
          >
            تصفح رحلات المسافرين
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Super Admin Command Header */}
      <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 rounded-3xl p-6 sm:p-7 text-white shadow-2xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 -mb-10 -ms-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-md">
                <Crown className="w-4 h-4" />
                <span>لوحة الإدارة والتحكم الشاملة (Super Admin)</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>صلاحيات واسعة مفعلة</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              إدارة المكاتب، حجب غير المشتركين، وإشراف الرحلات
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              تحكم بظهور المكاتب الكبرى والمتوسطة، أدر باقات الاشتراكات الشهرية، واحجب الشركات غير المشتركة من الظهور العام في السوق، مع ضمان سياسة التسجيل المجاني الدائم لكافة المسافرين وسائقي السيارات الفردية.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto shrink-0">
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-stone-400 block font-medium">إجمالي المكاتب</span>
              <span className="text-lg font-black text-white">{totalOffices}</span>
            </div>
            
            <div className="bg-emerald-950/40 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-300 block font-medium">مكاتب مفعلة</span>
              <span className="text-lg font-black text-emerald-400">{activeOffices.length}</span>
            </div>

            <div className="bg-red-950/40 backdrop-blur-md p-3 rounded-2xl border border-red-500/30 text-center">
              <span className="text-[10px] text-red-300 block font-medium">مكاتب محجوبة</span>
              <span className="text-lg font-black text-red-400">{suspendedOffices.length}</span>
            </div>

            <div className="bg-amber-950/40 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 text-center">
              <span className="text-[10px] text-amber-300 block font-medium">رسوم الاشتراكات</span>
              <span className="text-xs font-black text-amber-400 truncate block mt-1">
                {totalMonthlyRevYER.toLocaleString()} YER
              </span>
            </div>
          </div>
        </div>

        {/* Admin Navigation Sub-tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-5 mt-5 border-t border-white/10">
          <button
            onClick={() => setAdminTab('offices_subscriptions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              adminTab === 'offices_subscriptions'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>إدارة المكاتب والاشتراكات ({transportOffices.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('individual_drivers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              adminTab === 'individual_drivers'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>إشراف رحلات الكباتن ({intercityListings.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('trip_conflicts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative ${
              adminTab === 'trip_conflicts'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${intercityListings.some(l => l.conflictNotice?.isConflictDetected) ? 'text-red-400 animate-bounce' : ''}`} />
            <span>نظام مقارنة وتعارض اللوحات</span>
            {intercityListings.filter(l => l.conflictNotice?.isConflictDetected).length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                {intercityListings.filter(l => l.conflictNotice?.isConflictDetected).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('pricing_tiers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              adminTab === 'pricing_tiers'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>باقات الاشتراكات وسياسة المجانية</span>
          </button>

          <button
            onClick={() => setAdminTab('support_chat_faq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative ${
              adminTab === 'support_chat_faq'
                ? 'bg-emerald-500 text-stone-950 shadow-md font-black'
                : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>محادثات الدعم والأسئلة الشائعة</span>
            {chatMessages.filter(m => !m.readByAdmin && !m.isFromAdmin).length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-black animate-pulse">
                {chatMessages.filter(m => !m.readByAdmin && !m.isFromAdmin).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: TRANSPORT OFFICES & SUBSCRIPTION MANAGEMENT */}
      {/* ========================================================================= */}
      {adminTab === 'offices_subscriptions' && (
        <div className="space-y-5">
          
          {/* Controls Bar */}
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute start-3 top-3 text-stone-400" />
                <input
                  type="text"
                  value={searchOfficeQuery}
                  onChange={(e) => setSearchOfficeQuery(e.target.value)}
                  placeholder="ابحث باسم المكتب، المحافظة، رقم الهاتف، رقم الترخيص..."
                  className="w-full text-xs ps-9 pe-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="text-xs font-bold px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                >
                  <option value="all">كل الفئات (كبرى، متوسطة، صغيرة)</option>
                  <option value="large_company">👑 شركات كبرى (Enterprise)</option>
                  <option value="medium_office">🏢 مكاتب متوسطة (Medium)</option>
                  <option value="small_local_agency">🚐 وكالات وفرزات محلية (Small)</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="text-xs font-bold px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                >
                  <option value="all">كل الحالات</option>
                  <option value="active">✅ مفعل وظاهر للجمهور</option>
                  <option value="suspended">🔒 محجوب لعدم الاشتراك</option>
                  <option value="inactive">⏳ غير نشط / منتهي</option>
                </select>

                {/* Add Office Button */}
                <button
                  onClick={() => setIsAddOfficeModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة مكتب جديد</span>
                </button>
              </div>
            </div>

            {/* Free vs Paid Banner */}
            <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>سياسة النظام:</strong> المكاتب الكبرى والمتوسطة تتطلب اشتراكاً شهرياً معتمداً للظهور في السوق، بينما يبقى السائق الفردي والمسافر مجاناً 100%.
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 shrink-0">
                مطابق لقواعد المسافر 🇾🇪
              </span>
            </div>
          </div>

          {/* Offices List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOffices.map((office) => {
              const isBlocked = office.isVisibleToPublic === false || office.subscriptionStatus === 'suspended' || office.subscriptionStatus === 'inactive';
              
              const categoryBadge = office.officeCategory === 'large_company'
                ? { label: 'شركة كبرى VIP', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300' }
                : office.officeCategory === 'medium_office'
                ? { label: 'مكتب متوسط', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300' }
                : { label: 'وكالة محلية صغيرة', color: 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-200 border-stone-300' };

              return (
                <div
                  key={office.id}
                  className={`bg-white dark:bg-stone-800 rounded-3xl border transition shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden relative ${
                    isBlocked 
                      ? 'border-red-300 dark:border-red-900/80 bg-red-50/20 dark:bg-red-950/10' 
                      : 'border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {/* Status Strip Header */}
                  <div className={`px-4 py-2 flex items-center justify-between text-[11px] font-black border-b ${
                    isBlocked 
                      ? 'bg-red-500 text-white border-red-600' 
                      : 'bg-emerald-600 text-white border-emerald-700'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      {isBlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{isBlocked ? 'محجوب عن الجمهور (غير مشترك)' : 'مفعل وظاهر في سوق الرحلات'}</span>
                    </div>

                    <span className="opacity-90 font-mono text-[10px]">
                      {office.monthlyFeeYER ? `${office.monthlyFeeYER.toLocaleString()} YER/شهرياً` : 'مجاني/تجريبي'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <img
                          src={office.logo}
                          alt={office.nameAr}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 p-0.5 bg-white shadow-xs shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-black text-stone-900 dark:text-white truncate">
                            {office.nameAr}
                          </h3>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5">
                            <span>📍 {office.primaryGovernorate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryBadge.color}`}>
                          {categoryBadge.label}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          🚗 {office.fleetVehicles?.length || 0} مركبات مسجلة
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          🏢 {office.branches?.length || 0} فروع
                        </span>
                      </div>

                      {/* Expiry & Block Note */}
                      <div className="bg-stone-50 dark:bg-stone-900/80 p-2.5 rounded-xl border border-stone-200/70 dark:border-stone-700/60 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                          <span>صلاحية الاشتراك:</span>
                          <span className="font-bold text-stone-900 dark:text-stone-100 font-mono">
                            {office.subscriptionExpiresAt || 'غير محدد'}
                          </span>
                        </div>
                        {office.adminBlockReason && isBlocked && (
                          <div className="text-red-600 dark:text-red-400 text-[10px] font-bold pt-1 border-t border-stone-200 dark:border-stone-700">
                            ⚠️ سبب الحجب: {office.adminBlockReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-700 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Block / Unblock Button */}
                        <button
                          onClick={() => handleToggleBlock(office)}
                          className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
                            isBlocked
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span>إلغاء الحجب وتفعيل</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>حجب المكتب</span>
                            </>
                          )}
                        </button>

                        {/* Edit Subscription Tier */}
                        <button
                          onClick={() => handleOpenEditSubscription(office)}
                          className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                          <span>تعديل الباقة</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedOffice(office);
                            setIsCompanyModalOpen(true);
                          }}
                          className="text-[11px] text-stone-600 dark:text-stone-400 hover:text-amber-600 font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة البروفايل</span>
                        </button>

                        <button
                          onClick={() => {
                            setSocialOffice(office);
                            setIsSocialModalOpen(true);
                          }}
                          className="text-[11px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>مولد إعلانات المكتب</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف مكتب "${office.nameAr}" نهائياً من النظام؟`)) {
                              deleteTransportOffice(office.id);
                            }
                          }}
                          className="text-stone-400 hover:text-red-500 p-1"
                          title="حذف المكتب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {filteredOffices.length === 0 && (
            <div className="bg-white dark:bg-stone-800 rounded-3xl p-10 text-center border border-stone-200 dark:border-stone-700 space-y-3">
              <Building2 className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                لا توجد مكاتب تطابق الفلتر المختار
              </h3>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: INDIVIDUAL DRIVERS & OPEN TRIP LISTINGS SUPERVISION */}
      {/* ========================================================================= */}
      {adminTab === 'individual_drivers' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-600" />
                  <span>رحلات السائقين الأفراد وأصحاب السيارات (التسجيل مجاني)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  مراقبة رحلات الكباتن بين المحافظات وتوثيق السائقين وحذف الإعلانات المخالفة.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute start-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={searchListingQuery}
                  onChange={(e) => setSearchListingQuery(e.target.value)}
                  placeholder="ابحث بالسائق، المحافظة، كود التتبع..."
                  className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 bg-stone-50/50 dark:bg-stone-900/50">
                    <th className="py-2.5 px-3 font-bold text-start">الكابتن / المزود</th>
                    <th className="py-2.5 px-3 font-bold text-start">خط السير</th>
                    <th className="py-2.5 px-3 font-bold text-start">المركبة</th>
                    <th className="py-2.5 px-3 font-bold text-start">الموعد</th>
                    <th className="py-2.5 px-3 font-bold text-start">كود التتبع</th>
                    <th className="py-2.5 px-3 font-bold text-start">التوثيق</th>
                    <th className="py-2.5 px-3 font-bold text-end">إجراءات الإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900 dark:text-white">
                          {listing.driverName}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          {listing.driverPhone}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-stone-800 dark:text-stone-200">
                        {listing.fromGovernorate} ← {listing.toGovernorate}
                      </td>

                      <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                        {listing.vehicleModel}
                      </td>

                      <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                        <div>{listing.departureDate}</div>
                        <div className="text-[10px] text-amber-600 font-bold">{listing.departureTime}</div>
                      </td>

                      <td className="py-3 px-3">
                        {listing.allowsFamilyTracking && listing.familyTrackingCode ? (
                          <div className="flex flex-col gap-1 items-start">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              {listing.familyTrackingCode}
                            </span>
                            <button
                              onClick={() => adminSetFamilyTracking(listing.id, false)}
                              className="text-[9px] text-rose-500 hover:text-rose-700 font-semibold"
                              title="إلغاء تفعيل كود التتبع لهذه الرحلة"
                            >
                              إيقاف التتبع
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 items-start">
                            <span className="text-[10px] text-stone-400 dark:text-stone-500">
                              غير مفعّل
                            </span>
                            <button
                              onClick={() => {
                                const custom = window.prompt(
                                  'أدخل كود تتبع عائلي مخصص (أو اضغط حسناً لتوليد كود تلقائي):',
                                  `YEM-${listing.fromGovernorate?.substring(0, 2) || 'AD'}-${Math.floor(1000 + Math.random() * 9000)}`
                                );
                                if (custom !== null) {
                                  adminSetFamilyTracking(listing.id, true, custom.trim() || undefined);
                                }
                              }}
                              className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-100 transition inline-flex items-center gap-1"
                            >
                              <Lock className="w-2.5 h-2.5" />
                              <span>تفعيل من الآدمن ⚡</span>
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleListingVerification(listing.id, !listing.isVerifiedDriver)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition ${
                            listing.isVerifiedDriver
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400'
                              : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
                          }`}
                        >
                          {listing.isVerifiedDriver ? <BadgeCheck className="w-3 h-3 text-emerald-500" /> : <AlertTriangle className="w-3 h-3 text-stone-400" />}
                          <span>{listing.isVerifiedDriver ? 'كابتن معتمد' : 'غير موثق'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-3 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${listing.driverWhatsapp?.replace(/[^0-9]/g, '') || listing.driverPhone?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold"
                            title="تواصل واتساب"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => {
                              if (window.confirm(`حذف رحلة ${listing.fromGovernorate} إلى ${listing.toGovernorate} للكابتن ${listing.driverName}؟`)) {
                                deleteIntercityListing(listing.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold"
                            title="حذف الرحلة المخالفة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: TRIP CONFLICTS & LICENSE PLATE COLLISION RESOLUTION */}
      {/* ========================================================================= */}
      {adminTab === 'trip_conflicts' && (
        <div className="space-y-6">
          
          {/* Algorithm Banner */}
          <div className="bg-gradient-to-r from-red-950/80 via-stone-900 to-amber-950/80 border border-red-500/30 rounded-3xl p-5 text-white shadow-lg space-y-2.5">
            <div className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse text-red-400" />
              <h3 className="text-sm font-black">
                نظام المقارنة الذكي ورصد تعارض لوحات المركبات (Plate Collision Engine)
              </h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              إذا قام <strong>مكتب نقل</strong> و <strong>سائق فردي</strong> (أو طرفان مختلفان) بفتح رحلة لنفس المركبة في نفس التاريخ، يقوم محرك المطابقة بالتحقق من <strong>رقم لوحة السيارة</strong>، ويطلق فوراً إنذار تعارض للجهتين وللمسافرين المسجلين لمنع التضارب وضمان موثوقية الركاب.
            </p>
          </div>

          {/* Active Conflicts List */}
          {(() => {
            const conflictListings = intercityListings.filter(l => l.conflictNotice?.isConflictDetected);

            if (conflictListings.length === 0) {
              return (
                <div className="bg-white dark:bg-stone-800 rounded-3xl p-10 border border-stone-200 dark:border-stone-700 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-black text-stone-800 dark:text-white">
                    لا يوجد أي تعارض مسجل حالياً في لوحات المركبات 🟢
                  </h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    جميع رحلات الكباتن والمكاتب تسير بسلاسة بدون تكرار في أرقام اللوحات أو تضارب في المواعيد.
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300 px-1">
                  <span>تم رصد ({conflictListings.length}) رحلة بحالة تعارض وتكرار لوحة:</span>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {conflictListings.map(listing => {
                    const notice = listing.conflictNotice!;
                    const conflictingListing = intercityListings.find(l => l.id === notice.conflictingListingId);
                    const currentNote = conflictNotes[listing.id] || '';

                    return (
                      <div 
                        key={listing.id}
                        className="bg-white dark:bg-stone-800 rounded-3xl p-5 border-2 border-red-400 dark:border-red-900/60 shadow-lg space-y-4 relative overflow-hidden"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-700">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-black flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span>تعارض لوحة: {listing.vehiclePlateNumber}</span>
                            </span>
                            <span className="text-xs text-stone-500">
                              تاريخ المغادرة: <strong>{listing.departureDate}</strong>
                            </span>
                          </div>

                          <div>
                            {notice.resolutionStatus === 'unresolved' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                                ⏳ بانتظار البت الإداري
                              </span>
                            ) : notice.resolutionStatus === 'driver_confirmed' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                                ✅ تم اعتماد الكابتن الفردي
                              </span>
                            ) : notice.resolutionStatus === 'office_confirmed' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[11px] font-bold">
                                🏢 تم اعتماد حجز المكتب
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[11px] font-bold">
                                🤝 تم التنسيق والدمج
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Side by Side Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Side A: This Listing */}
                          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-black text-amber-700 dark:text-amber-400">
                                الطرف الأول ({listing.operatorType === 'company' ? 'مكتب نقل معتمد' : 'كابتن فردي'})
                              </span>
                              <span className="font-mono text-[11px] text-stone-500">{listing.familyTrackingCode}</span>
                            </div>
                            <div className="text-sm font-black text-stone-900 dark:text-white">
                              {listing.operatorType === 'company' ? listing.companyName : listing.driverName}
                            </div>
                            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                              <div>خط السير: <strong>{listing.fromGovernorate} ← {listing.toGovernorate}</strong></div>
                              <div>المركبة: {listing.vehicleModel} (لوحة: {listing.vehiclePlateNumber})</div>
                              <div>الوقت: {listing.departureTime} | المقاعد المتبقية: {listing.availableSeats} من {listing.totalSeats}</div>
                              <div>الهاتف: <span className="font-mono">{listing.driverPhone}</span></div>
                            </div>
                          </div>

                          {/* Side B: Conflicting Listing */}
                          <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-black text-red-700 dark:text-red-400">
                                الطرف المنازع ({notice.conflictingEntityType === 'company' ? 'مكتب نقل' : 'كابتن فردي'})
                              </span>
                              {conflictingListing && (
                                <span className="font-mono text-[11px] text-stone-500">{conflictingListing.familyTrackingCode}</span>
                              )}
                            </div>
                            <div className="text-sm font-black text-stone-900 dark:text-white">
                              {conflictingListing ? (conflictingListing.operatorType === 'company' ? conflictingListing.companyName : conflictingListing.driverName) : notice.conflictingEntityName}
                            </div>
                            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                              <div>خط السير: <strong>{conflictingListing?.fromGovernorate || listing.fromGovernorate} ← {conflictingListing?.toGovernorate || listing.toGovernorate}</strong></div>
                              <div>المركبة: {conflictingListing?.vehicleModel || listing.vehicleModel}</div>
                              <div>رقم اللوحة المطابقة: <strong className="text-red-600">{notice.matchedPlateNumber}</strong></div>
                              <div>الهاتف: <span className="font-mono">{conflictingListing?.driverPhone || 'مسجل بالنظام'}</span></div>
                            </div>
                          </div>

                        </div>

                        {/* Resolution Controls */}
                        <div className="pt-3 border-t border-stone-100 dark:border-stone-700 space-y-3">
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <input
                              type="text"
                              value={currentNote}
                              onChange={(e) => setConflictNotes(prev => ({ ...prev, [listing.id]: e.target.value }))}
                              placeholder="ملاحظات التسوية والتنسيق الإداري..."
                              className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                            />

                            <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
                              <button
                                onClick={() => resolveTripConflict(listing.id, 'driver_confirmed', currentNote)}
                                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
                              >
                                تأكيد الكابتن
                              </button>
                              <button
                                onClick={() => resolveTripConflict(listing.id, 'office_confirmed', currentNote)}
                                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
                              >
                                تأكيد المكتب
                              </button>
                              <button
                                onClick={() => resolveTripConflict(listing.id, 'synced_merged', currentNote)}
                                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
                              >
                                دمج الطرفين
                              </button>
                            </div>
                          </div>

                          {notice.resolutionNotes && (
                            <div className="text-[11px] text-stone-500 bg-stone-100 dark:bg-stone-900 p-2 rounded-xl">
                              📝 آخر تحديث للقرار: {notice.resolutionNotes}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: PRICING TIERS & FREE REGISTRATION POLICY MATRIX */}
      {/* ========================================================================= */}
      {adminTab === 'pricing_tiers' && (
        <div className="space-y-6">
          
          {/* Core Philosophy Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-5 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
            <h3 className="text-sm font-black flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>هيكل الاشتراكات والسياسة التجارية لمنصة المسافر (Traveler) اليمنية</span>
            </h3>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              حرصاً على نمو الشبكة وحرية انتقال المواطنين بين كافة المحافظات اليمنية، يعتمد التطبيق نموذجاً هجيناً واضحاً:
              <strong> التسجيل مجاني تماماً ودائم للمسافرين وسائقي السيارات الفردية والصوالين</strong>، بينما يتم فرض اشتراكات شهرية متدرجة على المكاتب والشركات الكبرى والمتوسطة التي تمتلك أساطيل وترغب بحجز صفحات رسمية وإعلانات مدعومة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Tier 1: Large Enterprise */}
            <div className="bg-white dark:bg-stone-800 rounded-3xl p-5 border-2 border-purple-500 shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute top-0 end-0 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl">
                الأكثر تميزاً
              </div>
              <div>
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider">باقة الشركات الكبرى</div>
                <h4 className="text-base font-black text-stone-900 dark:text-white">Enterprise VIP Fleet</h4>
                <div className="text-xl font-black text-stone-900 dark:text-white mt-2">
                  120,000 <span className="text-xs font-normal text-stone-500">ريال يمني / شهرياً</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>أسطول مركبات وباصات غير محدود</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>بروفايل شركة رسمي موثق مع روابط الفروع</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>توليد بوستات وتسويق ذكي بالذكاء الاصطناعي</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>دعم فني VIP وأولوية في الظهور بالبحث</span>
                </li>
              </ul>
            </div>

            {/* Tier 2: Medium Offices */}
            <div className="bg-white dark:bg-stone-800 rounded-3xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
              <div>
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider">باقة المكاتب المتوسطة</div>
                <h4 className="text-base font-black text-stone-900 dark:text-white">Growth Medium Fleet</h4>
                <div className="text-xl font-black text-stone-900 dark:text-white mt-2">
                  60,000 <span className="text-xs font-normal text-stone-500">ريال يمني / شهرياً</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>إدارة حتى 15 مركبة صالون ودفع رباعي</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>تغطية رحلات الراجع وتنسيق الحجوزات</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>بروفايل المكتب وفروع المحافظات</span>
                </li>
              </ul>
            </div>

            {/* Tier 3: Small Agencies */}
            <div className="bg-white dark:bg-stone-800 rounded-3xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
              <div>
                <div className="text-xs font-black text-amber-600 uppercase tracking-wider">باقة الوكالات والفرزات</div>
                <h4 className="text-base font-black text-stone-900 dark:text-white">Starter Local Agency</h4>
                <div className="text-xl font-black text-stone-900 dark:text-white mt-2">
                  25,000 <span className="text-xs font-normal text-stone-500">ريال يمني / شهرياً</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>إدارة حتى 5 سيارات أو ميكروباصات</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>ظهور بالبحث المحلي للمحافظة</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>كود تتبع وأمان للركاب</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Free Drivers Highlight Box */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 text-stone-950 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-black bg-stone-950 text-amber-300 px-3 py-1 rounded-full inline-block mb-1">
                🎁 سياسة الكباتن الأفراد
              </span>
              <h3 className="text-base sm:text-lg font-black">
                التسجيل مجاني 100% لكافة سائقي السيارات الفردية والمسافرين
              </h3>
              <p className="text-xs font-medium text-stone-900/90 leading-relaxed">
                كل صاحب سيارة خصوصي أو صالون أو برادو يستطيع نشر رحلاته واستقبال الركاب وتتبع الأمان بدون دفع أي اشتراك مالي للمنصة.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('driver_portal')}
              className="px-5 py-2.5 rounded-2xl bg-stone-950 hover:bg-stone-900 text-amber-300 text-xs font-black shadow-md transition"
            >
              فتح بوابة الكباتن
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: LIVE SUPPORT CHAT & FAQ MANAGEMENT */}
      {/* ========================================================================= */}
      {adminTab === 'support_chat_faq' && (
        <div className="space-y-6">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 rounded-3xl p-6 border border-emerald-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                  <span>مركز الدعم والمحادثات المباشرة</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-semibold text-emerald-200">
                  تواصل مجاني بدون تكلفة رصيد
                </span>
              </div>
              <h3 className="text-lg font-black">
                إدارة رسائل واستفسارات الكباتن والمسافرين وتحويلها لأسئلة شائعة
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                تصلك كافة استفسارات الكباتن والركاب لحظياً هنا، حيث يمكنك الرد المباشر على أي جهة، أو اعتماد السؤال المتكرر وإضافته لقسم الأسئلة الشائعة فوراً.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="px-4 py-2 rounded-2xl bg-white/10 text-center border border-white/10">
                <span className="text-[10px] text-emerald-300 block">إجمالي الرسائل</span>
                <span className="text-base font-black text-white">{chatMessages.length}</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-center border border-emerald-500/30">
                <span className="text-[10px] text-emerald-300 block">غير مقروء</span>
                <span className="text-base font-black text-emerald-400">
                  {chatMessages.filter(m => !m.readByAdmin && !m.isFromAdmin).length}
                </span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-blue-500/20 text-center border border-blue-500/30">
                <span className="text-[10px] text-blue-300 block">أسئلة شائعة</span>
                <span className="text-base font-black text-blue-400">{faqs.length}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Messages Stream & Replies (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Filter Bar */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl p-3 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-stone-500 shrink-0">فلترة الاستفسارات:</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <button
                    onClick={() => setChatCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      chatCategoryFilter === 'all'
                        ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold'
                        : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    الكل ({chatMessages.length})
                  </button>
                  <button
                    onClick={() => setChatCategoryFilter('captain_question')}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      chatCategoryFilter === 'captain_question'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    أسئلة الكباتن
                  </button>
                  <button
                    onClick={() => setChatCategoryFilter('trip_booking')}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      chatCategoryFilter === 'trip_booking'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    حجز رحلات
                  </button>
                  <button
                    onClick={() => setChatCategoryFilter('safety_inquiry')}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      chatCategoryFilter === 'safety_inquiry'
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    أمان وتتبع
                  </button>
                </div>
              </div>

              {/* Messages Cards */}
              <div className="space-y-3.5">
                {chatMessages
                  .filter(m => chatCategoryFilter === 'all' || m.category === chatCategoryFilter)
                  .map(msg => {
                    const isFromAdmin = msg.isFromAdmin;
                    const replyText = chatReplies[msg.id] || '';

                    return (
                      <div
                        key={msg.id}
                        className={`rounded-3xl p-5 border transition ${
                          isFromAdmin
                            ? 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800'
                            : !msg.readByAdmin
                            ? 'bg-white dark:bg-stone-800 border-emerald-400 dark:border-emerald-600 shadow-md ring-1 ring-emerald-400'
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-700">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isFromAdmin ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            <span className="font-black text-sm text-stone-900 dark:text-white">
                              {msg.senderName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-[10px] font-bold text-stone-600 dark:text-stone-300">
                              {msg.senderRole === 'admin' ? 'إدارة المسافر' : msg.senderRole === 'captain' ? 'كابتن / سائق' : 'مسافر / راكب'}
                            </span>
                            {msg.senderPhone && (
                              <span className="text-xs font-mono text-stone-500 dark:text-stone-400 dir-ltr">
                                📞 {msg.senderPhone}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-stone-400">
                              {new Date(msg.timestamp).toLocaleString('ar-YE', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                            {!isFromAdmin && !msg.readByAdmin && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                                جديد
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="py-3 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>

                        {!isFromAdmin && (
                          <div className="pt-3 border-t border-stone-100 dark:border-stone-700/60 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-stone-500">
                                الرد كآدمن على {msg.senderName}:
                              </span>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  setNewFaqQuestion(msg.text);
                                  setNewFaqCategory(
                                    msg.category === 'captain_question' ? 'شؤون الكباتن' :
                                    msg.category === 'trip_booking' ? 'الحجوزات والرحلات' :
                                    msg.category === 'safety_inquiry' ? 'الأمان والتتبع' : 'عام'
                                  );
                                  setNewFaqAudience(msg.senderRole === 'captain' ? 'captains' : 'travelers');
                                  setIsFaqFormOpen(true);
                                }}
                                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <span>💡 تحويل إلى سؤال شائع معتمد</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setChatReplies(prev => ({ ...prev, [msg.id]: e.target.value }))}
                                placeholder="اكتب رد الإدارة هنا وسيصل للطرف المعني مجاناً داخل التطبيق..."
                                className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!replyText.trim()) return;
                                  adminReplyChatMessage(msg.id, replyText);
                                  setChatReplies(prev => ({ ...prev, [msg.id]: '' }));
                                }}
                                disabled={!replyText.trim()}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition active:scale-95 shadow-sm shrink-0"
                              >
                                إرسال الرد
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Column: FAQ Management & Creator (1 Col) */}
            <div className="space-y-4">
              
              {/* Creator Card */}
              <div className="bg-white dark:bg-stone-800 rounded-3xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>إضافة سؤال شائع جديد</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsFaqFormOpen(!isFaqFormOpen)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    {isFaqFormOpen ? 'إغلاق النموذج' : '+ إضافة الآن'}
                  </button>
                </div>

                {isFaqFormOpen && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
                      addFaqItem({
                        questionAr: newFaqQuestion.trim(),
                        answerAr: newFaqAnswer.trim(),
                        category: newFaqCategory.trim() || 'عام',
                        targetAudience: newFaqAudience
                      });
                      setNewFaqQuestion('');
                      setNewFaqAnswer('');
                      setIsFaqFormOpen(false);
                    }}
                    className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-700"
                  >
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        صيغة السؤال الشائع:
                      </label>
                      <input
                        type="text"
                        value={newFaqQuestion}
                        onChange={(e) => setNewFaqQuestion(e.target.value)}
                        placeholder="مثال: هل التسجيل مجاني للكباتن؟"
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        الإجابة الرسمية المعتمدة من الإدارة:
                      </label>
                      <textarea
                        rows={3}
                        value={newFaqAnswer}
                        onChange={(e) => setNewFaqAnswer(e.target.value)}
                        placeholder="اكتب الإجابة الشافية والواضحة للجمهور..."
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                          التصنيف:
                        </label>
                        <input
                          type="text"
                          value={newFaqCategory}
                          onChange={(e) => setNewFaqCategory(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                          الجمهور المستهدف:
                        </label>
                        <select
                          value={newFaqAudience}
                          onChange={(e) => setNewFaqAudience(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
                        >
                          <option value="all">الجميع</option>
                          <option value="captains">الكباتن والملاك</option>
                          <option value="travelers">المسافرون</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                    >
                      حفظ واعتماد السؤال في التطبيق
                    </button>
                  </form>
                )}
              </div>

              {/* Current FAQs List */}
              <div className="bg-white dark:bg-stone-800 rounded-3xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700">
                  <h4 className="font-black text-sm text-stone-900 dark:text-white">
                    الأسئلة الشائعة الحالية ({faqs.length})
                  </h4>
                  <span className="text-[10px] text-stone-400">تظهر للعملاء في نافذة الدعم</span>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {faqs.map((faq, idx) => (
                    <div
                      key={faq.id}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-700/80 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                          {idx + 1}. {faq.questionAr}
                        </span>
                        {faq.category && (
                          <span className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-[9px] font-bold shrink-0">
                            {faq.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
                        {faq.answerAr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT SUBSCRIPTION TIER & VALIDITY */}
      {/* ========================================================================= */}
      {isSubModalOpen && editingOffice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 max-w-md w-full border border-stone-200 dark:border-stone-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-stone-900 dark:text-white">
                  تعديل باقة اشتراك: {editingOffice.nameAr}
                </h3>
              </div>
              <button
                onClick={() => setIsSubModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubscription} className="space-y-3.5">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  تصنيف المكتب:
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => {
                    const cat = e.target.value as OfficeCategory;
                    setEditCategory(cat);
                    if (cat === 'large_company') {
                      setEditTier('enterprise_large');
                      setEditMonthlyFee(120000);
                    } else if (cat === 'medium_office') {
                      setEditTier('growth_medium');
                      setEditMonthlyFee(60000);
                    } else {
                      setEditTier('starter_small');
                      setEditMonthlyFee(25000);
                    }
                  }}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                >
                  <option value="large_company">👑 شركة كبرى (Enterprise)</option>
                  <option value="medium_office">🏢 مكتب متوسط (Medium)</option>
                  <option value="small_local_agency">🚐 وكالة وفرزة محلية (Small)</option>
                </select>
              </div>

              {/* Tier */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  باقة الاشتراك المعتمدة:
                </label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value as OfficeSubscriptionTier)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                >
                  <option value="enterprise_large">Enterprise Large (120k YER)</option>
                  <option value="growth_medium">Growth Medium (60k YER)</option>
                  <option value="starter_small">Starter Small (25k YER)</option>
                  <option value="free_trial">فترة تجريبية مجانية (Free Trial)</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  حالة الاشتراك والظهور:
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as OfficeSubscriptionStatus)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                >
                  <option value="active">✅ مفعل وظاهر للجمهور في السوق</option>
                  <option value="suspended">🔒 محجوب لعدم الاشتراك</option>
                  <option value="inactive">⏳ غير نشط / منتهي</option>
                </select>
              </div>

              {/* Monthly Fee */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  الرسوم الشهرية (ريال يمني YER):
                </label>
                <input
                  type="number"
                  value={editMonthlyFee}
                  onChange={(e) => setEditMonthlyFee(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-mono"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  تاريخ انتهاء الاشتراك:
                </label>
                <input
                  type="date"
                  value={editExpiresAt}
                  onChange={(e) => setEditExpiresAt(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-mono"
                />
              </div>

              {editStatus !== 'active' && (
                <div>
                  <label className="block text-xs font-bold text-red-600 mb-1">
                    سبب الحجب الإداري (يظهر للمكتب):
                  </label>
                  <input
                    type="text"
                    value={editBlockReason}
                    onChange={(e) => setEditBlockReason(e.target.value)}
                    placeholder="مثال: منتهي الصلاحية بانتظار سداد رسوم التجديد"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-900 dark:text-red-200"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-sm"
                >
                  حفظ التعديلات
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD NEW TRANSPORT OFFICE */}
      {/* ========================================================================= */}
      {isAddOfficeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 max-w-lg w-full border border-stone-200 dark:border-stone-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-stone-900 dark:text-white">
                  إضافة مكتب نقل / شركة جديدة للنظام
                </h3>
              </div>
              <button
                onClick={() => setIsAddOfficeModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewOffice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  اسم المكتب أو الشركة (بالعربي):
                </label>
                <input
                  type="text"
                  required
                  value={newOfficeNameAr}
                  onChange={(e) => setNewOfficeNameAr(e.target.value)}
                  placeholder="مثال: شركة البركة للنقل البري الدولي والمحلي"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    المحافظة الرئيسية:
                  </label>
                  <select
                    value={newOfficeGov}
                    onChange={(e) => setNewOfficeGov(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  >
                    {YEMEN_GOVERNORATES.map(g => (
                      <option key={g.id} value={g.nameAr}>{g.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    تصنيف الباقة:
                  </label>
                  <select
                    value={newOfficeCategory}
                    onChange={(e) => {
                      const cat = e.target.value as OfficeCategory;
                      setNewOfficeCategory(cat);
                      if (cat === 'large_company') {
                        setNewOfficeTier('enterprise_large');
                        setNewOfficeFee(120000);
                      } else if (cat === 'medium_office') {
                        setNewOfficeTier('growth_medium');
                        setNewOfficeFee(60000);
                      } else {
                        setNewOfficeTier('starter_small');
                        setNewOfficeFee(25000);
                      }
                    }}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  >
                    <option value="large_company">👑 شركة كبرى (120,000 YER)</option>
                    <option value="medium_office">🏢 مكتب متوسط (60,000 YER)</option>
                    <option value="small_local_agency">🚐 وكالة محلية (25,000 YER)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    رقم الهاتف:
                  </label>
                  <input
                    type="text"
                    required
                    value={newOfficePhone}
                    onChange={(e) => setNewOfficePhone(e.target.value)}
                    placeholder="+967 770 000 111"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    واتساب الحجز:
                  </label>
                  <input
                    type="text"
                    value={newOfficeWhatsapp}
                    onChange={(e) => setNewOfficeWhatsapp(e.target.value)}
                    placeholder="+967770000111"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  نبذة عن خدمات المكتب:
                </label>
                <textarea
                  rows={2}
                  value={newOfficeAbout}
                  onChange={(e) => setNewOfficeAbout(e.target.value)}
                  placeholder="شركة نقل بري متخصصة في رحلات..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setIsAddOfficeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-sm"
                >
                  إضافة وتفعيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BLOCK CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {blockConfirmOffice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 max-w-md w-full border border-red-200 dark:border-red-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black">
                  حجب مكتب {blockConfirmOffice.nameAr}
                </h3>
                <p className="text-[11px] text-stone-500">
                  سيتم إخفاء هذا المكتب وأسطول سياراته عن جميع المسافرين في السوق.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                سبب الحجب الإداري (للتوثيق):
              </label>
              <textarea
                rows={2}
                value={customBlockReason}
                onChange={(e) => setCustomBlockReason(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setBlockConfirmOffice(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmBlock}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-sm"
              >
                تأكيد الحجب الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Showcase Modal */}
      {selectedOffice && (
        <CompanyShowcaseModal
          isOpen={isCompanyModalOpen}
          onClose={() => setIsCompanyModalOpen(false)}
          office={selectedOffice}
        />
      )}

      {/* Social Poster Modal */}
      {socialOffice && (
        <SocialMediaAutoPosterModal
          isOpen={isSocialModalOpen}
          onClose={() => setIsSocialModalOpen(false)}
          initialOffice={socialOffice}
          initialCampaignType="driver_recruitment"
        />
      )}

    </div>
  );
};
