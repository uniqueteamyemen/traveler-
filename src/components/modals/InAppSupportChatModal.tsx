import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  HelpCircle, 
  ShieldCheck, 
  CheckCheck, 
  ChevronDown, 
  Search,
  Sparkles,
  Info,
  Car,
  UserCheck,
  PhoneCall
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { AppChatMessage } from '../../types/travel';

export const InAppSupportChatModal: React.FC = () => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    chatMessages, 
    sendChatMessage, 
    faqs, 
    userProfile, 
    currentUser 
  } = useTravel();

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'faq'>('chat');
  const [messageInput, setMessageInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppChatMessage['category']>('general_inquiry');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  if (!isChatOpen) return null;

  const isAdmin = userProfile?.role === 'admin' || 
    currentUser?.email?.toLowerCase() === 'baker@deterministicsolutionsdesign.com' ||
    currentUser?.email?.toLowerCase() === 'qpjiu.sea@gmail.com';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendChatMessage(messageInput.trim(), selectedCategory);
    setMessageInput('');
  };

  const handleQuickQuestion = (question: string, category: AppChatMessage['category']) => {
    sendChatMessage(question, category);
  };

  const filteredFaqs = faqs.filter(faq => {
    if (!faqSearchQuery.trim()) return true;
    const query = faqSearchQuery.toLowerCase();
    return (
      faq.questionAr.toLowerCase().includes(query) ||
      faq.answerAr.toLowerCase().includes(query) ||
      (faq.category && faq.category.toLowerCase().includes(query))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="in-app-support-chat-dialog"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-white"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  الدعم الفوري والمحادثة المباشرة
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white uppercase tracking-wider">
                  مجاناً 100%
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                تواصل مباشر مع الإدارة بدون تكاليف رصيد أو مكالمات
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(false)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1.5 shrink-0">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeSubTab === 'chat'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>المحادثة المباشرة</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveSubTab('faq')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeSubTab === 'faq'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>الأسئلة الشائعة المعتمدة</span>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
              {faqs.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Live In-App Chat */}
        {activeSubTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
            {/* Free Communication Banner */}
            <div className="px-4 py-2.5 bg-emerald-50/80 dark:bg-emerald-950/25 border-b border-emerald-100 dark:border-emerald-800/40 flex items-center justify-between gap-2 text-xs text-emerald-800 dark:text-emerald-300 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  تصل رسائلك مباشرة لإدارة التطبيق (الآدمن) للرد عليها ومتابعة رحلتك دون أي تكلفة اتصال.
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                <span>أرقام الاتصال والواتساب الرسمية ستضاف قريباً</span>
              </div>
            </div>

            {/* Quick Suggested Actions */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                استفسار سريع:
              </span>
              <button
                type="button"
                onClick={() => handleQuickQuestion('السلام عليكم، أود الترويج لرحلتي عبر إنستغرام وفيسبوك ومجموعات الواتساب لجلب ركاب إضافيين.', 'captain_question')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap transition"
              >
                📢 ترويج رحلتي بالسوشيال ميديا
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion('مرحباً، أود معرفة كيفية تفعيل كود التتبع العائلي الآمن لرحلتي القادمة.', 'safety_inquiry')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap transition"
              >
                🛡️ طلب تفعيل التتبع العائلي
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion('السلام عليكم، هل التسجيل مجاني للكباتن وملاك السيارات وما هي الوثائق المطلوبة؟', 'captain_question')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-700 dark:text-amber-300 whitespace-nowrap transition"
              >
                🚗 شروط تسجيل الكابتن
              </button>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto opacity-30 text-emerald-600" />
                  <p className="text-sm font-semibold">لا توجد رسائل سابقة. ابدأ المحادثة الآن!</p>
                  <p className="text-xs">رسالتك تصل مباشرة لإدارة المنصة وسنجيبك في أقرب وقت.</p>
                </div>
              ) : (
                chatMessages.slice().reverse().map((msg) => {
                  const isUserSender = msg.senderId === (currentUser?.uid || userProfile?.uid);
                  const isFromAdmin = msg.isFromAdmin;

                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${isFromAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {msg.senderName}
                        </span>
                        {isFromAdmin && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[9px] font-black">
                            إدارة المسافر
                          </span>
                        )}
                        {!isFromAdmin && msg.senderRole === 'captain' && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[9px] font-bold">
                            كابتن معتمد
                          </span>
                        )}
                      </div>

                      <div 
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isFromAdmin
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tr-none'
                            : 'bg-emerald-600 text-white rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        
                        <div className={`mt-2 flex items-center justify-end gap-1.5 text-[10px] ${
                          isFromAdmin ? 'text-slate-400' : 'text-emerald-100'
                        }`}>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <CheckCheck className="w-3 h-3 text-emerald-400" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Composer */}
            <form 
              onSubmit={handleSendMessage}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 shrink-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold shrink-0">تصنيف الرسالة:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('general_inquiry')}
                    className={`px-2 py-0.5 rounded-full border transition ${
                      selectedCategory === 'general_inquiry'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    استفسار عام
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('captain_question')}
                    className={`px-2 py-0.5 rounded-full border transition ${
                      selectedCategory === 'captain_question'
                        ? 'bg-emerald-600 text-white border-transparent font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    سؤال كابتن
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('trip_booking')}
                    className={`px-2 py-0.5 rounded-full border transition ${
                      selectedCategory === 'trip_booking'
                        ? 'bg-blue-600 text-white border-transparent font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    حجز رحلة
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('safety_inquiry')}
                    className={`px-2 py-0.5 rounded-full border transition ${
                      selectedCategory === 'safety_inquiry'
                        ? 'bg-purple-600 text-white border-transparent font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    أمان وتتبع
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="اكتب استفسارك هنا مباشرة للإدارة دون أي تكلفة..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition active:scale-95 shrink-0"
                >
                  <span>إرسال</span>
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Community FAQ */}
        {activeSubTab === 'faq' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
            {/* Search Bar */}
            <div className="relative mb-4 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="ابحث في إجابات الأسئلة الشائعة (التسجيل، الوثائق، الترويج، الأمان...)"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white"
              />
            </div>

            {/* FAQ Accordion List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Info className="w-8 h-8 mx-auto opacity-40 mb-2" />
                  <p className="text-sm">لم يتم العثور على نتائج مطابقة لبحثك.</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;

                  return (
                    <div
                      key={faq.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full p-4 text-right flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {faq.questionAr}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {faq.category && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-semibold">
                              {faq.category}
                            </span>
                          )}
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-700/50 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/40 dark:bg-slate-900/30">
                          <p>{faq.answerAr}</p>
                          
                          <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                            <span>هل أفادتك هذه الإجابة؟</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSubTab('chat');
                                setMessageInput(`استفسار بخصوص: ${faq.questionAr} - `);
                              }}
                              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                            >
                              <span>استفسر أكثر عبر المحادثة</span>
                              <MessageSquare className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="p-3 bg-slate-100/80 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>منصة المسافر (Traveler) اليمنية الموحدة — خدمة العملاء والمسافرين والكباتن</span>
          </div>

          <div className="text-[11px] text-slate-400">
            <span>التسجيل مجاني 100% لكافة الأطراف</span>
          </div>
        </div>
      </div>
    </div>
  );
};
