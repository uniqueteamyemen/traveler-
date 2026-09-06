import { InterCityTripListing, TripConflictNotice } from '../types/travel';

/**
 * Normalizes license plate number by stripping Arabic words like 'نقل', 'خصوصي', spaces and dashes
 * Example: 'صنعاء 12345 نقل' -> '12345', '7788-AD' -> '7788AD'
 */
export function normalizePlateNumber(plate: string | undefined): string {
  if (!plate) return '';
  return plate
    .replace(/[ـ\s\-_/\\,.]/g, '')
    .replace(/نقل|خصوصي|أجرة|فاخر|يمن|صنعاء|عدن|تعز|حضرموت/gi, '')
    .trim()
    .toLowerCase();
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingListing?: InterCityTripListing;
  conflictNotice?: TripConflictNotice;
}

/**
 * Checks if a listing conflicts with an existing listing by matching license plate & departure date
 */
export function checkPlateCollision(
  targetListing: Partial<InterCityTripListing>,
  existingListings: InterCityTripListing[],
  currentListingId?: string
): ConflictCheckResult {
  if (!targetListing.vehiclePlateNumber || !targetListing.departureDate) {
    return { hasConflict: false };
  }

  const targetPlateNorm = normalizePlateNumber(targetListing.vehiclePlateNumber);
  if (targetPlateNorm.length < 2) {
    return { hasConflict: false };
  }

  const matched = existingListings.find(item => {
    if (currentListingId && item.id === currentListingId) return false;
    if (item.id === targetListing.id) return false;

    // Must match date
    if (item.departureDate !== targetListing.departureDate) return false;

    // Check normalized plate
    const itemPlateNorm = normalizePlateNumber(item.vehiclePlateNumber);
    if (!itemPlateNorm || itemPlateNorm.length < 2) return false;

    return itemPlateNorm === targetPlateNorm;
  });

  if (!matched) {
    return { hasConflict: false };
  }

  const isCrossType = 
    (targetListing.operatorType === 'individual' && matched.operatorType === 'company') ||
    (targetListing.operatorType === 'company' && matched.operatorType === 'individual') ||
    (targetListing.driverPhone !== matched.driverPhone);

  if (!isCrossType) {
    return { hasConflict: false };
  }

  const conflictNotice: TripConflictNotice = {
    isConflictDetected: true,
    conflictingListingId: matched.id,
    conflictingEntityName: matched.operatorType === 'company' ? (matched.companyName || 'مكتب نقل معتمد') : matched.driverName,
    conflictingEntityType: matched.operatorType || 'company',
    matchedPlateNumber: targetListing.vehiclePlateNumber,
    detectedAt: new Date().toISOString(),
    resolutionStatus: 'unresolved'
  };

  return {
    hasConflict: true,
    conflictingListing: matched,
    conflictNotice
  };
}
