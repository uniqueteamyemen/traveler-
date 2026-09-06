import { LiveTripLocation, RoadConditionNotice, LocationSourceType, RoadAlertReason } from '../types/travel';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

const LIVE_TRACKING_COL = 'liveTripTracking';

// Default initial live tracking points across major Yemeni highways
export const INITIAL_LIVE_LOCATIONS: Record<string, LiveTripLocation> = {
  'YEM-AD-MK-772': {
    tripCode: 'YEM-AD-MK-772',
    sourceType: 'driver_phone',
    sourceName: 'الكابتن عبدالملك الحبيشي (هاتف السيارة)',
    lat: 13.9667,
    lng: 44.1833,
    currentCityOrPassAr: 'محافظة إب — مشارف نقيل سمارة',
    nearestCheckpointAr: 'نقطة نقيل سمارة الشمالية',
    nextScheduledStopAr: 'استراحة يريم (صلاة وغداء)',
    lastUpdated: 'منذ دقيقة واحدة',
    isBroadcasting: true,
    signalStatus: 'good_4g',
    activeRoadNotice: {
      id: 'notice-1',
      tripCode: 'YEM-AD-MK-772',
      reason: 'fog_low_visibility',
      titleAr: 'ضباب كثيف ورذاذ مطري',
      messageAr: 'يوجد ضباب في قمة النقيل. السائق يقود بحذر وبسرعة منخفضة لضمان الأمان.',
      cityOrPassAr: 'نقيل سمارة',
      timestamp: 'قبل 10 دقائق',
      isDetourActive: false
    }
  },
  'YEM-SAN-789': {
    tripCode: 'YEM-SAN-789',
    sourceType: 'passenger_phone',
    sourceName: 'هاتف المسافر (أحمد القدسي)',
    lat: 14.5333,
    lng: 44.4000,
    currentCityOrPassAr: 'محافظة ذمار — خط ذمار - رداع',
    nearestCheckpointAr: 'نقطة مدخل ذمار الشرقية',
    nextScheduledStopAr: 'محطة بترول واستراحة رداع',
    lastUpdated: 'منذ 3 دقائق',
    isBroadcasting: true,
    signalStatus: 'good_4g'
  },
  'YEM-HAD-882': {
    tripCode: 'YEM-HAD-882',
    sourceType: 'driver_phone',
    sourceName: 'الكابتن صالح باوزير (حافلة النقل السريع)',
    lat: 15.3547,
    lng: 48.7891,
    currentCityOrPassAr: 'وادي حضرموت — مفرق الخشعة ونقيل العبر',
    nearestCheckpointAr: 'نقطة مدخل سيئون الغربية',
    nextScheduledStopAr: 'موقف الفرزة المركزية بسيئون',
    lastUpdated: 'منذ دقيقتين',
    isBroadcasting: true,
    signalStatus: 'weak_3g',
    activeRoadNotice: {
      id: 'notice-2',
      tripCode: 'YEM-HAD-882',
      reason: 'rain_floods',
      titleAr: 'جريان سيول خفيفة في مجرى الوادي',
      messageAr: 'تم التوقف لمدارسة منسوب السيل، الطريق سالك عبر الجسر المرتفع بأمان.',
      cityOrPassAr: 'وادي العين - حضرموت',
      timestamp: 'قبل 15 دقيقة',
      isDetourActive: true,
      detourRouteNameAr: 'تحويلة الجسر العلوي'
    }
  },
  'YEM-MARIB-550': {
    tripCode: 'YEM-MARIB-550',
    sourceType: 'checkpoint_sync',
    sourceName: 'تحديث المحطة المجدولة',
    lat: 15.4590,
    lng: 45.3253,
    currentCityOrPassAr: 'محافظة مأرب — مفرق الوديعة وحريب',
    nearestCheckpointAr: 'نقطة الفلج',
    nextScheduledStopAr: 'استراحة الراحة بمأرب',
    lastUpdated: 'منذ 5 دقائق',
    isBroadcasting: true,
    signalStatus: 'good_4g'
  }
};

class LiveTrackingService {
  private localTrackingMap: Map<string, LiveTripLocation> = new Map();
  private geoWatchId: number | null = null;
  private subscribers: ((locations: Record<string, LiveTripLocation>) => void)[] = [];

  constructor() {
    Object.values(INITIAL_LIVE_LOCATIONS).forEach(loc => {
      this.localTrackingMap.set(loc.tripCode, loc);
    });
  }

  // Subscribe to live locations
  subscribe(callback: (locations: Record<string, LiveTripLocation>) => void) {
    this.subscribers.push(callback);
    callback(this.getAllLocations());

    // Try listening to Firestore
    try {
      const q = collection(db, LIVE_TRACKING_COL);
      const unsub = onSnapshot(q, (snapshot) => {
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as LiveTripLocation;
          if (data && data.tripCode) {
            this.localTrackingMap.set(data.tripCode, data);
          }
        });
        this.notifySubscribers();
      }, (err) => {
        console.warn('Firestore live tracking fallback:', err.message);
      });

      return () => {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
        unsub();
      };
    } catch {
      return () => {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
      };
    }
  }

  getAllLocations(): Record<string, LiveTripLocation> {
    const obj: Record<string, LiveTripLocation> = {};
    this.localTrackingMap.forEach((val, key) => {
      obj[key] = val;
    });
    return obj;
  }

  getLocationForCode(tripCode: string): LiveTripLocation | null {
    const cleanCode = tripCode.trim().toUpperCase();
    if (this.localTrackingMap.has(cleanCode)) {
      return this.localTrackingMap.get(cleanCode)!;
    }
    // Search loose match
    for (const [code, loc] of this.localTrackingMap.entries()) {
      if (code.includes(cleanCode) || cleanCode.includes(code)) {
        return loc;
      }
    }
    return null;
  }

  private notifySubscribers() {
    const data = this.getAllLocations();
    this.subscribers.forEach(cb => cb(data));
  }

  // Start broadcasting from phone GPS (Captain or Passenger)
  startPhoneBroadcasting(
    tripCode: string,
    sourceType: LocationSourceType,
    sourceName: string,
    customCityName?: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const cleanCode = tripCode.trim().toUpperCase();

      const updatePosition = (lat: number, lng: number, cityText?: string) => {
        const existing = this.getLocationForCode(cleanCode);
        const updated: LiveTripLocation = {
          tripCode: cleanCode,
          sourceType,
          sourceName,
          lat,
          lng,
          currentCityOrPassAr: cityText || customCityName || existing?.currentCityOrPassAr || 'موقع حي على الطريق العام',
          nearestCheckpointAr: existing?.nearestCheckpointAr || 'أقرب نقطة معتمدة',
          nextScheduledStopAr: existing?.nextScheduledStopAr || 'المحطة المجدولة القادمة',
          lastUpdated: 'محدث الآن عبر الهاتف مباشرة 🛰️',
          isBroadcasting: true,
          signalStatus: 'good_4g',
          activeRoadNotice: existing?.activeRoadNotice
        };

        this.localTrackingMap.set(cleanCode, updated);
        this.notifySubscribers();

        // Push to firestore
        try {
          setDoc(doc(db, LIVE_TRACKING_COL, cleanCode), updated, { merge: true }).catch(() => {});
        } catch {}
      };

      if ('geolocation' in navigator) {
        // High accuracy GPS
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            updatePosition(pos.coords.latitude, pos.coords.longitude);
            
            // Start continuous watch
            if (this.geoWatchId) navigator.geolocation.clearWatch(this.geoWatchId);
            this.geoWatchId = navigator.geolocation.watchPosition(
              (p) => updatePosition(p.coords.latitude, p.coords.longitude),
              (err) => console.warn('Geolocation watch error:', err),
              { enableHighAccuracy: true, maximumAge: 30000, timeout: 20000 }
            );

            resolve(true);
          },
          (err) => {
            console.warn('Geolocation permission issue, using fallback coordinates:', err.message);
            // Fallback: Use Yemen central coords or last known
            updatePosition(15.3694, 44.1910, customCityName || 'صنعاء — طريق المحافظات');
            resolve(true);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        // Geolocation not supported
        updatePosition(14.5333, 44.4000, customCityName || 'موقع الرحلة على الطريق');
        resolve(true);
      }
    });
  }

  // Stop broadcasting
  stopBroadcasting(tripCode: string) {
    const cleanCode = tripCode.trim().toUpperCase();
    if (this.geoWatchId) {
      navigator.geolocation.clearWatch(this.geoWatchId);
      this.geoWatchId = null;
    }

    const existing = this.getLocationForCode(cleanCode);
    if (existing) {
      const updated: LiveTripLocation = {
        ...existing,
        isBroadcasting: false,
        lastUpdated: 'تم إيقاف البث مؤقتاً'
      };
      this.localTrackingMap.set(cleanCode, updated);
      this.notifySubscribers();
      try {
        setDoc(doc(db, LIVE_TRACKING_COL, cleanCode), updated, { merge: true }).catch(() => {});
      } catch {}
    }
  }

  // Publish a Road Condition Notice (أمطار، سيول، صيانة، تحويلة، استراحة)
  publishRoadNotice(
    tripCode: string,
    reason: RoadAlertReason,
    customMessageAr?: string,
    detourRouteNameAr?: string
  ): RoadConditionNotice {
    const cleanCode = tripCode.trim().toUpperCase();
    const existing = this.getLocationForCode(cleanCode);

    const titleMap: Record<RoadAlertReason, string> = {
      rain_floods: '⚠️ تنبيه: تدفق سيول وأمطار غزيرة',
      maintenance_detour: '🚧 تنبيه: أعمال صيانة في الطريق مع تحويلة',
      fog_low_visibility: '🌫️ تنبيه: ضباب كثيف وانخفاض مستوى الرؤية',
      rock_slide: '⚠️ تنبيه: تساقط صخور في العقبة - القيادة بحذر',
      rest_break: '☕ استراحة وتوقف مؤقت للمسافرين',
      road_clear: '✅ الطريق سالك وطبيعي تماماً'
    };

    const defaultMsgMap: Record<RoadAlertReason, string> = {
      rain_floods: 'تم اتخاذ تحويلة آمنة بعيداً عن بطن الوادي لضمان سلامة الركاب والسيارة.',
      maintenance_detour: 'يوجد إصلاحات في جزء من الطريق وتم سلوك الطريق البديل المعتمد.',
      fog_low_visibility: 'ضباب يغطي المرتفعات، السائق ملتزم بالسرعة الآمنة ومصابيح الضباب.',
      rock_slide: 'الحركة بطيئة في النقيل لتجاوز العوائق بأمان.',
      rest_break: 'توقف للاستراحة والصلاة وتناول وجبة خفيفة لمدة 20-30 دقيقة.',
      road_clear: 'لا توجد أي معوقات أو إغلاقات، والرحلة تسير وفق الوقت المجدول.'
    };

    const notice: RoadConditionNotice = {
      id: `notice-${Date.now()}`,
      tripCode: cleanCode,
      reason,
      titleAr: titleMap[reason],
      messageAr: customMessageAr || defaultMsgMap[reason],
      cityOrPassAr: existing?.currentCityOrPassAr || 'على مسار الرحلة',
      timestamp: 'الآن',
      isDetourActive: reason === 'rain_floods' || reason === 'maintenance_detour',
      detourRouteNameAr: detourRouteNameAr || (reason === 'rain_floods' ? 'تحويلة الوادي الآمنة' : undefined)
    };

    if (existing) {
      const updated: LiveTripLocation = {
        ...existing,
        activeRoadNotice: notice,
        lastUpdated: 'محدث للتو بإشعار طريق جديد ⚠️'
      };
      this.localTrackingMap.set(cleanCode, updated);
      this.notifySubscribers();

      try {
        setDoc(doc(db, LIVE_TRACKING_COL, cleanCode), updated, { merge: true }).catch(() => {});
      } catch {}
    }

    return notice;
  }
}

export const liveTrackingService = new LiveTrackingService();
