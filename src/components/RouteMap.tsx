import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { YEMEN_GOVERNORATES } from '../data/yemenData';
import { GovernorateInfo } from '../types/travel';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Utensils, 
  Award, 
  Sun,
  ChevronRight,
  Search
} from 'lucide-react';

export const RouteMap: React.FC = () => {
  const { activeTrip, lang } = useTravel();
  const [selectedGovernorate, setSelectedGovernorate] = useState<GovernorateInfo>(YEMEN_GOVERNORATES[0]);
  const [regionFilter, setRegionFilter] = useState<'all' | 'south' | 'north' | 'east' | 'west' | 'islands'>('all');
  const [govSearch, setGovSearch] = useState('');

  const filteredGovs = YEMEN_GOVERNORATES.filter(g => {
    if (regionFilter !== 'all' && g.region !== regionFilter) return false;
    if (govSearch.trim()) {
      const q = govSearch.toLowerCase();
      return g.nameAr.toLowerCase().includes(q) || g.nameEn.toLowerCase().includes(q) || g.capital.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <span>{lang === 'ar' ? 'دليل وخريطة محافظات اليمن الـ 22' : '22 Yemeni Governorates & Route Guide'}</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
            {lang === 'ar' ? 'استكشف المعالم التاريخية، الأكلات الشعبية، المنتجات الشهيرة وأفضل مواسم السفر' : 'Explore historic landmarks, traditional cuisines, and travel seasons'}
          </p>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', labelAr: 'الكل' },
            { id: 'south', labelAr: 'الجنوب' },
            { id: 'north', labelAr: 'الشمال والوسط' },
            { id: 'east', labelAr: 'الشرق والصحراء' },
            { id: 'west', labelAr: 'الساحل الغربي' },
            { id: 'islands', labelAr: 'الجزر' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRegionFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                regionFilter === tab.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              {tab.labelAr}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Governorate Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Map Stage + Governorate Cards Selector */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Visual Interactive Map Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 h-[280px] sm:h-[340px] shadow-sm flex flex-col justify-between p-5">
            <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="px-3 py-1.5 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800 text-white text-xs font-bold flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>{selectedGovernorate.nameAr}</span>
                <span className="text-[10px] text-stone-400">({selectedGovernorate.coordinates.lat.toFixed(2)}, {selectedGovernorate.coordinates.lng.toFixed(2)})</span>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-amber-600/90 text-white text-[11px] font-bold">
                {selectedGovernorate.region.toUpperCase()} REGION
              </div>
            </div>

            {/* Quick Nodes representation */}
            <div className="relative z-10 my-auto flex flex-wrap items-center justify-center gap-3">
              {filteredGovs.slice(0, 8).map(g => {
                const isSelected = selectedGovernorate.id === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGovernorate(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 ring-2 ring-white scale-105 shadow-md'
                        : 'bg-stone-950/80 text-stone-300 hover:bg-stone-800 border border-stone-700'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{g.nameAr.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-stone-400 bg-stone-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-800">
              <span>{lang === 'ar' ? 'اختر أي محافظة لاستعراض خصائصها السياحية والثقافية' : 'Select a governorate to inspect cultural profile'}</span>
              <span className="text-amber-400 font-bold">22 محافظة يمنية</span>
            </div>
          </div>

          {/* Search bar for Governorates */}
          <div className="relative">
            <Search className="w-4 h-4 absolute start-3 top-3 text-stone-400" />
            <input
              type="text"
              value={govSearch}
              onChange={(e) => setGovSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن أي محافظة أو مدينة يمنية...' : 'Search any governorate...'}
              className="w-full text-xs ps-9 pe-3 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100"
            />
          </div>

          {/* Governorates Mini Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredGovs.map(gov => {
              const isSelected = selectedGovernorate.id === gov.id;
              return (
                <button
                  key={gov.id}
                  onClick={() => setSelectedGovernorate(gov)}
                  className={`p-3 rounded-xl border text-start transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-xs'
                      : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/50'
                  }`}
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {gov.nameAr}
                    </h4>
                    <p className="text-[10px] text-stone-600 dark:text-stone-300 truncate">
                      {gov.capital}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0 rtl:rotate-180" />
                </button>
              );
            })}
          </div>

        </div>

        {/* Right 1 Column: Selected Governorate Deep Dive */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm space-y-4">
          
          <div className="relative h-36 rounded-xl overflow-hidden">
            <img
              src={selectedGovernorate.image}
              alt={selectedGovernorate.nameAr}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-3.5">
              <div>
                <h3 className="text-sm font-black text-white">
                  {selectedGovernorate.nameAr}
                </h3>
                <p className="text-[11px] text-amber-300 font-semibold">
                  {selectedGovernorate.capital}
                </p>
              </div>
            </div>
          </div>

          {/* Highlights & Landmarks */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'ar' ? 'أبرز المعالم والوجهات:' : 'Key Highlights:'}</span>
            </div>
            <ul className="space-y-1">
              {selectedGovernorate.highlights.map((h, i) => (
                <li key={i} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Traditional Cuisine */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-700">
            <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'ar' ? 'أشهر الأكلات والمخبوزات الشعبية:' : 'Traditional Food:'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedGovernorate.traditionalFood.map((food, i) => (
                <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                  {food}
                </span>
              ))}
            </div>
          </div>

          {/* Famous Local Products */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-700">
            <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ar' ? 'المنتجات والهدايا الشهيرة:' : 'Famous Products:'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedGovernorate.famousProducts.map((prod, i) => (
                <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  {prod}
                </span>
              ))}
            </div>
          </div>

          {/* Best Season */}
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">{lang === 'ar' ? 'أفضل موسم للزيارة: ' : 'Best Season: '}</span>
              <span>{selectedGovernorate.bestSeason}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
