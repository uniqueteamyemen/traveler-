import { Trip } from '../types/travel';
import { INITIAL_TRIPS } from './initialData';

const STORAGE_KEY = 'traveler_app_trips_v1';
const ACTIVE_TRIP_KEY = 'traveler_app_active_trip_id_v1';
const LANG_KEY = 'traveler_app_lang_v1';
const THEME_KEY = 'traveler_app_theme_v1';

export const loadTrips = (): Trip[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out any legacy non-Yemeni demo trips
        const filtered = parsed.filter((t: Trip) => t.id !== 'trip-andalusia-1');
        
        // Ensure that default initial Yemeni trips are merged if missing
        const existingIds = new Set(filtered.map((t: Trip) => t.id));
        const missingInitial = INITIAL_TRIPS.filter(t => !existingIds.has(t.id));
        if (missingInitial.length > 0) {
          const merged = [...missingInitial, ...filtered];
          return merged;
        }
        return filtered.length > 0 ? filtered : INITIAL_TRIPS;
      }
    }
  } catch (e) {
    console.error('Failed to load trips from local storage:', e);
  }
  return INITIAL_TRIPS;
};

export const saveTrips = (trips: Trip[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error('Failed to save trips to local storage:', e);
  }
};

export const getSavedActiveTripId = (): string => {
  try {
    const saved = localStorage.getItem(ACTIVE_TRIP_KEY);
    if (!saved || saved === 'trip-andalusia-1') {
      return 'trip-yem-1';
    }
    return saved;
  } catch {
    return 'trip-yem-1';
  }
};

export const saveActiveTripId = (id: string): void => {
  try {
    localStorage.setItem(ACTIVE_TRIP_KEY, id);
  } catch (e) {
    console.error('Failed to save active trip id:', e);
  }
};

export const getSavedLanguage = (): 'ar' | 'en' => {
  try {
    return (localStorage.getItem(LANG_KEY) as 'ar' | 'en') || 'ar';
  } catch {
    return 'ar';
  }
};

export const saveLanguage = (lang: 'ar' | 'en'): void => {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    console.error('Failed to save language:', e);
  }
};

export const getSavedTheme = (): 'light' | 'dark' => {
  try {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
  } catch {
    return 'light';
  }
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
};
