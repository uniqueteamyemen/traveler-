import { 
  InterCityTripListing, 
  PassengerRideRequest, 
  SocialCarouselPackage 
} from '../types/travel';
import { generateCarouselAdPackage, DEFAULT_WHATSAPP_BOT_NUMBER } from './aiSocialPosterService';

export interface AutoAdHistoryItem {
  id: string;
  timestamp: string;
  reason: 'volume_5_requests' | 'time_2_hours' | 'manual_admin';
  audience: 'passengers' | 'captains';
  title: string;
  totalSlides: number;
}

export interface AutoAdDispatcherState {
  isEnabled: boolean;
  lastTriggerTimestamp: number;
  unadvertisedVolumeCount: number;
  timeThresholdMs: number; // 2 hours = 7,200,000 ms
  volumeThreshold: number; // 5 requests / listings
  totalBatchesDispatched: number;
  lastDispatchedAt?: string;
  lastDispatchedReason?: 'volume_5_requests' | 'time_2_hours' | 'manual_admin';
  lastDispatchedAudience?: 'passengers' | 'captains';
  latestPackage?: SocialCarouselPackage | null;
  history: AutoAdHistoryItem[];
}

const STORAGE_KEY = 'traveler_auto_ad_dispatcher_v1';
export const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 7,200,000 ms
export const VOLUME_THRESHOLD = 5;

const INITIAL_STATE: AutoAdDispatcherState = {
  isEnabled: true,
  lastTriggerTimestamp: Date.now(),
  unadvertisedVolumeCount: 0,
  timeThresholdMs: TWO_HOURS_MS,
  volumeThreshold: VOLUME_THRESHOLD,
  totalBatchesDispatched: 0,
  history: []
};

export function loadAutoAdState(): AutoAdDispatcherState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_STATE,
        ...parsed,
        history: Array.isArray(parsed.history) ? parsed.history : []
      };
    }
  } catch (err) {
    console.error('Failed to load auto ad state:', err);
  }
  return INITIAL_STATE;
}

export function saveAutoAdState(state: AutoAdDispatcherState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save auto ad state:', err);
  }
}

/**
 * Evaluates whether an automated ad batch should be compiled and staged.
 * Triggers when either:
 * 1) 5 new requests/listings have accumulated (volume threshold)
 * 2) 2 hours have elapsed since the last ad batch (time threshold)
 */
export function evaluateAndTriggerAutoAd(
  listings: InterCityTripListing[],
  requests: PassengerRideRequest[],
  reasonOverride?: 'volume_5_requests' | 'time_2_hours' | 'manual_admin',
  whatsappPhone: string = DEFAULT_WHATSAPP_BOT_NUMBER
): { triggered: boolean; state: AutoAdDispatcherState; newPackage?: SocialCarouselPackage } {
  const state = loadAutoAdState();
  if (!state.isEnabled && reasonOverride !== 'manual_admin') {
    return { triggered: false, state };
  }

  const now = Date.now();
  const timeElapsed = now - state.lastTriggerTimestamp;
  const isTimeHit = timeElapsed >= state.timeThresholdMs;
  const isVolumeHit = state.unadvertisedVolumeCount >= state.volumeThreshold;

  if (!isTimeHit && !isVolumeHit && !reasonOverride) {
    return { triggered: false, state };
  }

  const actualReason = reasonOverride || (isVolumeHit ? 'volume_5_requests' : 'time_2_hours');

  // Decide audience dynamically:
  // If there are more open passenger requests waiting, target Captains to take them.
  // Otherwise, target Passengers with available seats.
  const activeReqsCount = requests.filter(r => r.status === 'new').length;
  const activeListingsCount = listings.filter(l => (l.availableSeats ?? 1) > 0).length;
  
  const audience: 'passengers' | 'captains' = 
    activeReqsCount >= 2 ? 'captains' : 'passengers';

  const newPackage = generateCarouselAdPackage({
    audience,
    listings,
    requests,
    whatsappPhone,
    tone: 'authentic_yemeni'
  });

  const historyItem: AutoAdHistoryItem = {
    id: `auto-${now}`,
    timestamp: new Date(now).toISOString(),
    reason: actualReason,
    audience,
    title: newPackage.campaignTitleAr,
    totalSlides: newPackage.totalSlides
  };

  const updatedState: AutoAdDispatcherState = {
    ...state,
    lastTriggerTimestamp: now,
    unadvertisedVolumeCount: 0,
    totalBatchesDispatched: state.totalBatchesDispatched + 1,
    lastDispatchedAt: new Date(now).toISOString(),
    lastDispatchedReason: actualReason,
    lastDispatchedAudience: audience,
    latestPackage: newPackage,
    history: [historyItem, ...(state.history || []).slice(0, 19)]
  };

  saveAutoAdState(updatedState);
  return { triggered: true, state: updatedState, newPackage };
}

/**
 * Increments unadvertised count upon new request or listing, and checks if threshold of 5 is hit.
 */
export function recordNewActivity(
  listings: InterCityTripListing[],
  requests: PassengerRideRequest[],
  whatsappPhone: string = DEFAULT_WHATSAPP_BOT_NUMBER
): { triggered: boolean; state: AutoAdDispatcherState; newPackage?: SocialCarouselPackage } {
  const state = loadAutoAdState();
  const updatedCount = state.unadvertisedVolumeCount + 1;
  const nextState = { ...state, unadvertisedVolumeCount: updatedCount };
  saveAutoAdState(nextState);

  // If 5 requests/listings reached or 2 hours elapsed, trigger
  if (updatedCount >= state.volumeThreshold || (Date.now() - state.lastTriggerTimestamp) >= state.timeThresholdMs) {
    return evaluateAndTriggerAutoAd(listings, requests, undefined, whatsappPhone);
  }

  return { triggered: false, state: nextState };
}
