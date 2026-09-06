import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  buildOpenTripSMSCommand, 
  buildDepartSMSCommand, 
  buildArriveSMSCommand, 
  buildMarkFullSMSCommand, 
  buildRoadAlertSMSCommand, 
  createSMSUri, 
  SMS_GATEWAY_NUMBER,
  YEMEN_CITIES_MAP 
} from '../services/smsTripService';
import { ParsedSMSResult } from '../types/travel';
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Radio, 
  ExternalLink,
  RefreshCw,
  Info,
  ShieldCheck
} from 'lucide-react';

export const DriverSMSPortal: React.FC = () => {
  const { 
    driverVehicles, 
    activeDriverVehicleId, 
    processDriverSMS, 
    intercityListings,
    lang 
  } = useTravel();

  const activeVehicle = driverVehicles.find(v => v.id === activeDriverVehicleId) || driverVehicles[0];

  // SMS Generator Form State
  const [fromGov, setFromGov] = useState('عدن');
  const [toGov, setToGov] = useState('صنعاء');
  const [date, setDate] = useState('2026-09-08');
  const [time, setTime] = useState('07:00');
  const [price, setPrice] = useState(40000);
  const [carType, setCarType] = useState('صالون');
  const [plate, setPlate] = useState(activeVehicle?.plateNumber || '12455');

  // Generated Commands
  const generatedOpenCmd = buildOpenTripSMSCommand({
    fromGovernorate: fromGov,
    toGovernorate: toGov,
    departureDate: date,
    departureTime: time,
    pricePerSeat: price,
    vehicleModel: carType,
    vehiclePlateNumber: plate
  });

  const sampleTripCode = intercityListings[0]?.familyTrackingCode || 'YEM-AD-SN-784';

  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Live Offline Interactive Terminal
  const [terminalInput, setTerminalInput] = useState(generatedOpenCmd);
  const [senderPhone, setSenderPhone] = useState('+967771234567');
  const [terminalOutput, setTerminalOutput] = useState<ParsedSMSResult | null>(null);
  const [terminalHistory, setTerminalHistory] = useState<Array<{ text: string; res: ParsedSMSResult; time: string }>>([]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleRunTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const result = processDriverSMS(terminalInput.trim(), senderPhone.trim());
    setTerminalOutput(result);
    setTerminalHistory(prev => [
      {
        text: terminalInput.trim(),
        res: result,
        time: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...prev
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Offline Gateway Architecture Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950 text-white p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-500 text-stone-950 font-black">
              <Smartphone className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black">
                بوابة المسافر (Traveler) لإدارة الرحلات عبر الرسائل النصية القصيرة (SMS Gateway)
              </h3>
              <p className="text-xs text-amber-300 font-mono">
                رقم البوابة المجانية في اليمن: <strong>{SMS_GATEWAY_NUMBER}</strong>
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>يعمل بدون إنترنت أو رصيد باقة بيانات</span>
          </span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
          إذا كنت في منطقة مقطوعة من النت أو لا يتوفر لديك رصيد باقة، يمكنك بضغطة زر واحدة إرسال رسالة نصية قصيرة تفتح الرحلة فوراً في النظام وتستقبل حجوزات الركاب وتعلن انطلاقك ووصولك!
        </p>
      </div>

      {/* 2-Column Grid: Builder & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Quick SMS Commands Builder */}
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
            <h4 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-500" />
              <span>مولّد رسائل SMS بنقرة زر</span>
            </h4>
            <span className="text-[11px] text-stone-500">جاهز للإرسال المباشر</span>
          </div>

          {/* Quick inputs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-stone-600 dark:text-stone-400 mb-1 font-bold">من محافظة:</label>
              <select 
                value={fromGov} 
                onChange={(e) => setFromGov(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-bold text-xs"
              >
                {Object.keys(YEMEN_CITIES_MAP).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 mb-1 font-bold">إلى محافظة:</label>
              <select 
                value={toGov} 
                onChange={(e) => setToGov(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-bold text-xs"
              >
                {Object.keys(YEMEN_CITIES_MAP).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 mb-1 font-bold">سعر المقعد (ريال):</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 mb-1 font-bold">رقم اللوحة:</label>
              <input 
                type="text" 
                value={plate} 
                onChange={(e) => setPlate(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-mono text-xs"
              />
            </div>
          </div>

          {/* Preset SMS Commands Cards */}
          <div className="space-y-3 pt-2">
            
            {/* Command 1: Open Trip */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                <span>1. أمر فتح رحلة جديدة (أوفلاين):</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 font-mono">سفر</span>
              </div>
              <div className="font-mono text-xs bg-white dark:bg-stone-900 p-2.5 rounded-xl border border-amber-300 dark:border-amber-800 text-stone-900 dark:text-stone-100 break-all">
                {generatedOpenCmd}
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleCopy(generatedOpenCmd, 'cmd-open')}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1"
                >
                  {copiedCmd === 'cmd-open' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ الأمر</span>
                </button>
                <a
                  href={createSMSUri(SMS_GATEWAY_NUMBER, generatedOpenCmd)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>فتح تطبيق SMS في هاتفي</span>
                </a>
              </div>
            </div>

            {/* Command 2: Mark Full */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
                <span>2. أمر اكتمال المقاعد:</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700">امتلاء</span>
              </div>
              <div className="font-mono bg-white dark:bg-stone-800 p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200">
                {buildMarkFullSMSCommand(sampleTripCode)}
              </div>
              <div className="flex items-center justify-end gap-2">
                <a
                  href={createSMSUri(SMS_GATEWAY_NUMBER, buildMarkFullSMSCommand(sampleTripCode))}
                  className="px-3 py-1 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-amber-500 hover:text-stone-950 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>إرسال SMS</span>
                </a>
              </div>
            </div>

            {/* Command 3: Depart */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
                <span>3. أمر انطلاق الرحلة (بدء التتبع):</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">انطلاق</span>
              </div>
              <div className="font-mono bg-white dark:bg-stone-800 p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200">
                {buildDepartSMSCommand(sampleTripCode)}
              </div>
              <div className="flex items-center justify-end gap-2">
                <a
                  href={createSMSUri(SMS_GATEWAY_NUMBER, buildDepartSMSCommand(sampleTripCode))}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>إرسال SMS</span>
                </a>
              </div>
            </div>

            {/* Command 4: Arrive */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
                <span>4. أمر وصول الرحلة وإغلاقها:</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">وصول</span>
              </div>
              <div className="font-mono bg-white dark:bg-stone-800 p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200">
                {buildArriveSMSCommand(sampleTripCode)}
              </div>
              <div className="flex items-center justify-end gap-2">
                <a
                  href={createSMSUri(SMS_GATEWAY_NUMBER, buildArriveSMSCommand(sampleTripCode))}
                  className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>إرسال SMS</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Column 2: Live Simulator & Terminal */}
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
            <h4 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>محاكي معالجة رسائل الكباتن (Live Offline Terminal)</span>
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
              Simulator Active
            </span>
          </div>

          <form onSubmit={handleRunTerminal} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                رقم هاتف الكابتن المرسل (للتوثيق الآلي):
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                نص الرسالة القصيرة الواردة (SMS Command):
              </label>
              <textarea
                rows={3}
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="اكتب أمر SMS مثل: سفر عدن صنعاء 2026-09-08 07:00 40000 صالون 12455"
                className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-mono text-stone-800 dark:text-stone-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>معالجة الرسالة وتحديث النظام فوراً</span>
            </button>
          </form>

          {/* Terminal Output */}
          {terminalOutput && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
              terminalOutput.success 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
            }`}>
              <div className="flex items-center gap-2 font-black">
                {terminalOutput.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                <span>{terminalOutput.success ? 'استجابة البوابة (SMS Response):' : 'خطأ في صياغة الرسالة:'}</span>
              </div>
              <p className="leading-relaxed font-bold">
                {terminalOutput.messageAr}
              </p>
            </div>
          )}

          {/* History */}
          {terminalHistory.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-700">
              <div className="text-[11px] font-bold text-stone-500">سجل الرسائل المعالجة مؤخراً:</div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs">
                {terminalHistory.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="font-mono text-[10px] text-stone-400">{item.time}</span>
                      <span className="font-mono mx-1.5 font-bold text-stone-800 dark:text-stone-200">{item.text}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      item.res.success ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.res.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
