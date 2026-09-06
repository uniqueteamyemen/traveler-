import { InterCityTripListing, PlannedStop, TripLifecycleStatus } from '../types/travel';

export const PLATFORM_SMS_GATEWAY_NUMBER = '+967733900111';
export const SMS_GATEWAY_NUMBER = '+967733900111';

export const YEMEN_CITIES_MAP: Record<string, string> = {
  'عدن': 'عدن',
  'صنعاء': 'صنعاء',
  'تعز': 'تعز',
  'المكلا': 'حضرموت',
  'إب': 'إب',
  'الحديدة': 'الحديدة',
  'مأرب': 'مأرب',
  'ذمار': 'ذمار',
  'سيئون': 'حضرموت',
  'شبوة': 'شبوة',
  'عتق': 'شبوة',
  'صعدة': 'صعدة',
  'الغيضة': 'المهرة',
  'سقطرى': 'سقطرى'
};

export interface ParsedSMSResult {
  success: boolean;
  action: 'open_trip' | 'depart_trip' | 'arrive_trip' | 'mark_full' | 'road_alert' | 'unknown';
  message: string;
  messageAr: string;
  createdListing?: Partial<InterCityTripListing>;
  targetTripCode?: string;
  roadAlertText?: string;
}

export function buildOpenTripSMSCommand(params: {
  fromGovernorate: string;
  toGovernorate: string;
  departureDate?: string;
  departureTime?: string;
  pricePerSeat: number;
  vehicleModel?: string;
  vehiclePlateNumber?: string;
}): string {
  const shortModel = (params.vehicleModel || 'صالون').split(' ')[0] || 'صالون';
  return `سفر ${params.fromGovernorate} ${params.toGovernorate} 4 ${shortModel} ${params.pricePerSeat} ${params.vehiclePlateNumber || 'خصوصي'}`;
}

export function buildDepartSMSCommand(tripCode: string): string {
  return `انطلاق ${tripCode}`;
}

export function buildArriveSMSCommand(tripCode: string): string {
  return `وصول ${tripCode}`;
}

export function buildMarkFullSMSCommand(tripCode: string): string {
  return `امتلاء ${tripCode}`;
}

export function buildRoadAlertSMSCommand(tripCode: string, alertText: string): string {
  return `طريق ${tripCode} ${alertText}`;
}

export function createSMSUri(phoneNumber: string, bodyText: string): string {
  return `sms:${phoneNumber}?body=${encodeURIComponent(bodyText)}`;
}

/**
 * Formats a trip creation command for SMS
 */
export function generateTripCreationSMS(params: {
  fromGov: string;
  toGov: string;
  seats: number;
  vehicleModel: string;
  priceYER: number;
  plateNumber: string;
  driverName?: string;
}): { text: string; smsUri: string } {
  const modelShort = params.vehicleModel.split(' ')[0] || 'سيارة';
  const text = `سفر ${params.fromGov} ${params.toGov} ${params.seats} ${modelShort} ${params.priceYER} ${params.plateNumber || 'خصوصي'}`;
  const encoded = encodeURIComponent(text);
  const smsUri = `sms:${PLATFORM_SMS_GATEWAY_NUMBER}?body=${encoded}`;
  return { text, smsUri };
}

/**
 * Formats status update SMS
 */
export function generateTripStatusSMS(action: 'depart' | 'arrive' | 'full', tripCode: string): { text: string; smsUri: string } {
  let keyword = 'انطلاق';
  if (action === 'arrive') keyword = 'وصول';
  if (action === 'full') keyword = 'امتلاء';

  const text = `${keyword} ${tripCode}`;
  const encoded = encodeURIComponent(text);
  const smsUri = `sms:${PLATFORM_SMS_GATEWAY_NUMBER}?body=${encoded}`;
  return { text, smsUri };
}

/**
 * Formats road alert SMS
 */
export function generateRoadAlertSMS(tripCode: string, alertDetail: string): { text: string; smsUri: string } {
  const text = `طريق ${tripCode} ${alertDetail}`;
  const encoded = encodeURIComponent(text);
  const smsUri = `sms:${PLATFORM_SMS_GATEWAY_NUMBER}?body=${encoded}`;
  return { text, smsUri };
}

/**
 * Parses raw SMS text received from driver phone into executable actions
 */
export function parseIncomingSMS(smsBody: string, senderPhone: string = '+967770000000'): ParsedSMSResult {
  const clean = smsBody.trim().replace(/\s+/g, ' ');
  const parts = clean.split(' ');

  if (parts.length === 0) {
    return {
      success: false,
      action: 'unknown',
      message: 'Empty SMS content',
      messageAr: 'نص الرسالة فارغ'
    };
  }

  const command = parts[0].toLowerCase();

  // 1. OPEN NEW TRIP: سفر [المغادرة] [الوصول] [المقاعد] [الموديل] [السعر] [اللوحة]
  if (command === 'سفر' || command === 'safar' || command === 'trip') {
    if (parts.length < 3) {
      return {
        success: false,
        action: 'open_trip',
        message: 'Incomplete trip format. Correct: سفر [المغادرة] [الوصول] [المقاعد] [الموديل] [السعر] [اللوحة]',
        messageAr: 'صيغة الرسالة غير مكتملة. الصيغة الصحيحة: سفر [المغادرة] [الوصول] [المقاعد] [الموديل] [السعر] [اللوحة]'
      };
    }

    const fromGov = parts[1];
    const toGov = parts[2];
    const seats = parseInt(parts[3], 10) || 4;
    const vehicleModel = parts[4] || 'تويوتا صالون';
    const price = parseInt(parts[5], 10) || 35000;
    const plateNumber = parts[6] || 'خصوصي';

    const defaultStops: PlannedStop[] = [
      {
        id: `stop-sms-${Date.now()}-1`,
        nameAr: `استراحة الطريق (${fromGov})`,
        nameEn: 'Route Rest Stop',
        type: 'rest_food',
        estimatedTime: '10:00',
        durationMinutes: 30,
        locationName: `${fromGov} — نقطة وصل`
      }
    ];

    const todayStr = new Date().toISOString().split('T')[0];

    const createdListing: Partial<InterCityTripListing> = {
      id: `sms-trip-${Date.now()}`,
      driverName: 'كابتن الرحلة (عبر SMS)',
      driverPhone: senderPhone,
      driverWhatsapp: senderPhone,
      driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      driverRating: 5.0,
      totalTripsCompleted: 1,
      isVerifiedDriver: true,
      hasMechanicalPass: true,
      hasBackupCarCommitment: true,
      operatorType: 'individual',
      fromGovernorate: fromGov,
      fromCity: fromGov,
      toGovernorate: toGov,
      toCity: toGov,
      departureDate: todayStr,
      departureTime: 'خلال ساعة من الحجز',
      estimatedDurationHours: 6,
      tripNature: 'outbound',
      vehicleType: seats > 6 ? 'microbus' : 'suv_4x4',
      vehicleModel: vehicleModel.length > 2 ? vehicleModel : 'تويوتا لاندكروزر صالون',
      vehicleYear: 2024,
      vehiclePlateNumber: plateNumber,
      vehiclePhoto: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      airConditioned: true,
      luggageCapacityBags: 6,
      availableSeats: seats,
      totalSeats: seats,
      pricePerSeat: price,
      priceFullCar: price * seats * 0.9,
      currency: 'YER',
      allowsFamilyTracking: true,
      familyTrackingCode: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: 'تم فتح ونشر هذه الرحلة بنجاح عبر الرسائل النصية القصيرة (Offline SMS Gateway)',
      plannedStops: defaultStops,
      tripStatus: 'open',
      createdViaSMS: true
    };

    return {
      success: true,
      action: 'open_trip',
      message: `Trip opened successfully via SMS: ${fromGov} ➔ ${toGov} (${seats} seats)`,
      messageAr: `تم فتح الرحلة بنجاح عبر الرسالة النصية: ${fromGov} ← ${toGov} (${seats} مقاعد — ${price.toLocaleString()} ريال)`,
      createdListing
    };
  }

  // 2. DEPARTURE NOTICE: انطلاق [كود_الرحلة]
  if (command === 'انطلاق' || command === 'depart' || command === 'start') {
    const code = parts[1] || '';
    return {
      success: true,
      action: 'depart_trip',
      targetTripCode: code,
      message: `Trip ${code} marked as departed via SMS`,
      messageAr: `تم تحديث حالة الرحلة [${code}] إلى "انطلقت في الطريق" وتفعيل التتبع الحي للأهل.`
    };
  }

  // 3. ARRIVAL NOTICE: وصول [كود_الرحلة]
  if (command === 'وصول' || command === 'arrive' || command === 'done' || command === 'end') {
    const code = parts[1] || '';
    return {
      success: true,
      action: 'arrive_trip',
      targetTripCode: code,
      message: `Trip ${code} marked as arrived & completed via SMS`,
      messageAr: `تم استلام إشارة الوصول للرحلة [${code}] بنجاح وإغلاق وأرشفة الرحلة بسلام.`
    };
  }

  // 4. FULL NOTICE: امتلاء [كود_الرحلة]
  if (command === 'امتلاء' || command === 'full') {
    const code = parts[1] || '';
    return {
      success: true,
      action: 'mark_full',
      targetTripCode: code,
      message: `Trip ${code} marked as full via SMS`,
      messageAr: `تم تحديث حالة الرحلة [${code}] إلى "اكتملت المقاعد - جاهزة للتحرك".`
    };
  }

  // 5. ROAD ALERT: طريق [كود_الرحلة] [تفاصيل]
  if (command === 'طريق' || command === 'alert' || command === 'road') {
    const code = parts[1] || '';
    const alertDetail = parts.slice(2).join(' ') || 'تنبيه أمان عام في الطريق';
    return {
      success: true,
      action: 'road_alert',
      targetTripCode: code,
      roadAlertText: alertDetail,
      message: `Road alert broadcasted via SMS for trip ${code}`,
      messageAr: `تم بث تنبيه الطريق [${alertDetail}] لركاب وعائلات الرحلة [${code}].`
    };
  }

  return {
    success: false,
    action: 'unknown',
    message: 'Unknown SMS command. Available: سفر, انطلاق, وصول, امتلاء, طريق',
    messageAr: 'أمر غير معروف. الأوامر المتاحة: سفر، انطلاق، وصول، امتلاء، طريق'
  };
}
