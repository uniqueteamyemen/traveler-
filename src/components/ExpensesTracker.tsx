import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Plus, 
  DollarSign, 
  Trash2, 
  PieChart, 
  Users, 
  Utensils, 
  Car, 
  Bed, 
  ShoppingBag, 
  Camera, 
  Receipt 
} from 'lucide-react';
import { Expense } from '../types/travel';

interface ExpensesTrackerProps {
  onOpenNewExpense: () => void;
}

export const ExpensesTracker: React.FC<ExpensesTrackerProps> = ({ onOpenNewExpense }) => {
  const { activeTrip, lang, deleteExpense } = useTravel();

  if (!activeTrip) return null;

  const expenses = activeTrip.expenses || [];
  const travelers = activeTrip.travelers || ['User'];

  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = activeTrip.budget - totalSpent;
  const percentageSpent = activeTrip.budget > 0 ? Math.min(100, Math.round((totalSpent / activeTrip.budget) * 100)) : 0;

  // Category totals
  const categoryTotals: Record<Expense['category'], number> = {
    food: 0,
    transport: 0,
    fuel: 0,
    road_tolls: 0,
    accommodation: 0,
    activities: 0,
    shopping: 0,
    other: 0
  };

  expenses.forEach(e => {
    if (categoryTotals[e.category] !== undefined) {
      categoryTotals[e.category] += e.amount;
    } else {
      categoryTotals.other += e.amount;
    }
  });

  // Calculate traveler balances (who paid what & split balances)
  const paidByTotals: Record<string, number> = {};
  travelers.forEach(t => { paidByTotals[t] = 0; });

  expenses.forEach(e => {
    if (paidByTotals[e.paidBy] !== undefined) {
      paidByTotals[e.paidBy] += e.amount;
    } else {
      paidByTotals[e.paidBy] = e.amount;
    }
  });

  const perPersonFairShare = travelers.length > 0 ? totalSpent / travelers.length : 0;

  const getCategoryIcon = (category: Expense['category']) => {
    switch (category) {
      case 'food': return <Utensils className="w-4 h-4 text-orange-500" />;
      case 'transport': return <Car className="w-4 h-4 text-blue-500" />;
      case 'fuel': return <Car className="w-4 h-4 text-amber-500" />;
      case 'road_tolls': return <Receipt className="w-4 h-4 text-rose-500" />;
      case 'accommodation': return <Bed className="w-4 h-4 text-indigo-500" />;
      case 'activities': return <Camera className="w-4 h-4 text-amber-500" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4 text-pink-500" />;
      default: return <Receipt className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'المصاريف، الميزانية وتقسيم الحساب' : 'Budget, Expenses & Bill Split'}
          </h2>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
            {lang === 'ar' ? 'تتبع المصاريف الفعلية وحساب مستحقات المسافرين بدقة' : 'Track expenditures, analyze spending categories, and settle balances'}
          </p>
        </div>

        <button
          onClick={onOpenNewExpense}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? '+ تسجيل مصروف' : '+ Log Expense'}</span>
        </button>
      </div>

      {/* Budget Summary & Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Budget Card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'حالة الميزانية' : 'Budget Status'}</span>
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {percentageSpent}% {lang === 'ar' ? 'مستهلك' : 'used'}
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-stone-900 dark:text-white">
                {totalSpent.toLocaleString()} {activeTrip.currency}
              </span>
              <span className="text-xs text-stone-700 dark:text-stone-300">
                {lang === 'ar' ? 'الميزانية:' : 'Budget:'} {activeTrip.budget.toLocaleString()} {activeTrip.currency}
              </span>
            </div>

            <div className="mt-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  percentageSpent > 90 ? 'bg-rose-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${percentageSpent}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700/50 flex items-center justify-between text-xs">
            <span className="text-stone-600 dark:text-stone-400">
              {lang === 'ar' ? 'المتبقي من الميزانية:' : 'Remaining Budget:'}
            </span>
            <span className={`font-bold ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {remainingBudget.toLocaleString()} {activeTrip.currency}
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ar' ? 'توزيع المصاريف حسب التصنيف' : 'Spending by Category'}</span>
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { cat: 'accommodation' as const, label: lang === 'ar' ? 'الإقامة والفنادق' : 'Hotels', amount: categoryTotals.accommodation, color: 'bg-indigo-500' },
              { cat: 'transport' as const, label: lang === 'ar' ? 'المواصلات والطيران' : 'Transport', amount: categoryTotals.transport, color: 'bg-blue-500' },
              { cat: 'food' as const, label: lang === 'ar' ? 'المطاعم والمأكولات' : 'Food & Dining', amount: categoryTotals.food, color: 'bg-orange-500' },
              { cat: 'activities' as const, label: lang === 'ar' ? 'الجولات والفعاليات' : 'Activities', amount: categoryTotals.activities, color: 'bg-amber-500' },
              { cat: 'shopping' as const, label: lang === 'ar' ? 'التسوق والهدايا' : 'Shopping', amount: categoryTotals.shopping, color: 'bg-pink-500' },
            ].map(item => (
              <div key={item.cat} className="flex items-center justify-between py-1 border-b border-stone-50 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">{item.label}</span>
                </div>
                <span className="font-bold text-stone-900 dark:text-white">
                  {item.amount.toLocaleString()} {activeTrip.currency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Group Bill Split Breakdown */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              <span>{lang === 'ar' ? 'تسوية حساب المسافرين' : 'Travelers Settlement'}</span>
            </h3>
            <span className="text-[11px] text-stone-700 dark:text-stone-300">
              {lang === 'ar' ? 'حصة الفرد:' : 'Fair share:'} {Math.round(perPersonFairShare)} {activeTrip.currency}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {travelers.map(person => {
              const paid = paidByTotals[person] || 0;
              const netBalance = Math.round(paid - perPersonFairShare);
              return (
                <div key={person} className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900 dark:text-white">{person}</div>
                    <div className="text-[11px] text-stone-700 dark:text-stone-300">
                      {lang === 'ar' ? 'دفع:' : 'Paid:'} {paid.toLocaleString()} {activeTrip.currency}
                    </div>
                  </div>
                  <div className="text-end">
                    {netBalance >= 0 ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        +{netBalance} {activeTrip.currency} {lang === 'ar' ? '(له)' : '(gets back)'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                        {netBalance} {activeTrip.currency} {lang === 'ar' ? '(عليه)' : '(owes)'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Transaction History Log */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 dark:text-white">
          {lang === 'ar' ? 'سجل المعاملات والمصاريف' : 'Expense Transaction History'}
        </h3>

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {expenses.map((expense) => (
            <div key={expense.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800">
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    {expense.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 mt-0.5">
                    <span>{expense.date}</span>
                    <span>•</span>
                    <span>{lang === 'ar' ? 'دفع بواسطة' : 'Paid by'} <strong className="text-stone-700 dark:text-stone-300">{expense.paidBy}</strong></span>
                    {expense.notes && (
                      <>
                        <span>•</span>
                        <span className="italic">{expense.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-stone-900 dark:text-white">
                  {expense.amount.toLocaleString()} {expense.currency}
                </span>
                <button
                  onClick={() => deleteExpense(activeTrip.id, expense.id)}
                  className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition"
                  title="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="text-center py-8 text-xs text-stone-500">
              {lang === 'ar' ? 'لا توجد مصاريف مسجلة حتى الآن' : 'No expenses recorded yet'}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
