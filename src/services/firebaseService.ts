import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  where 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut as fbSignOut, 
  signInAnonymously, 
  onAuthStateChanged, 
  type FirebaseUser,
  db, 
  auth, 
  googleProvider,
  OperationType,
  handleFirestoreError
} from '../lib/firebase';
import { 
  Trip, 
  InterCityTripListing, 
  AppNotification, 
  UserProfile, 
  UserRole,
  RoadPassAlert,
  TransportOffice,
  DriverVehicle
} from '../types/travel';
import { INITIAL_INTERCITY_TRIPS } from '../data/yemenData';
import { INITIAL_TRANSPORT_OFFICES } from '../data/transportOfficesData';

// Collection References
const USERS_COL = 'users';
const LISTINGS_COL = 'intercityListings';
const VEHICLES_COL = 'vehicles';
const TRIPS_COL = 'trips';
const NOTIFICATIONS_COL = 'notifications';
const ROAD_ALERTS_COL = 'roadAlerts';
const OFFICES_COL = 'transportOffices';

// Initial Road Passes Data
export const INITIAL_ROAD_PASSES: RoadPassAlert[] = [
  {
    id: 'pass-samarah-1',
    passNameAr: 'عقبة سمارة (إب - صنعاء)',
    passNameEn: 'Samarah Mountain Pass',
    route: 'إب ← ذمار ← صنعاء',
    status: 'fog_rain',
    statusLabelAr: 'ضباب كثيف ورذاذ مطري - قيادة بحذر',
    reportedAt: 'محدث قبل 15 دقيقة',
    descriptionAr: 'تكون ضباب كثيف في المنعطفات العلوية وتدني الرؤية الأفقية، مع حركة سير طبيعية للمركبات والشاحنات.',
    governorate: 'إب'
  },
  {
    id: 'pass-hayjat-alabd-2',
    passNameAr: 'طريق هيجة العبد (تعز - عدن)',
    passNameEn: 'Hayjat Al-Abd Pass',
    route: 'تعز ← التربة ← لحج ← عدن',
    status: 'cautious',
    statusLabelAr: 'سالكة بحذر مع أعمال صيانة جزئية',
    reportedAt: 'محدث قبل 40 دقيقة',
    descriptionAr: 'الطريق مفتوحة لسيارات الركاب والصوالين، مع بطء في حركة شاحنات البضائع الثقيلة.',
    governorate: 'تعز / لحج'
  },
  {
    id: 'pass-alabr-3',
    passNameAr: 'خط العبر الدولي (مأرب - حضرموت - الوديعة)',
    passNameEn: 'Al-Abr Highway',
    route: 'شبوة / مأرب ← العبر ← سيئون',
    status: 'open',
    statusLabelAr: 'مفتوح وسالك تماماً',
    reportedAt: 'محدث قبل ساعة',
    descriptionAr: 'الخط الصحراوي مفتوح واستقرار تام للأحوال الجوية، ودوريات التأمين متواجدة على طول المسار.',
    governorate: 'حضرموت / مأرب'
  },
  {
    id: 'pass-manakhah-4',
    passNameAr: 'عقبة مناخة (صنعاء - الحديدة)',
    passNameEn: 'Manakhah Pass',
    route: 'صنعاء ← مناخة ← باجل ← الحديدة',
    status: 'open',
    statusLabelAr: 'طريق سالك بحالة ممتازة',
    reportedAt: 'محدث قبل ساعتين',
    descriptionAr: 'المنحدرات الجبلية سالكة، الاستراحات الجبلية ومحطات الوقود تعمل بكفاءة.',
    governorate: 'صنعاء / الحديدة'
  }
];

// ==========================================
// 1. AUTH & USER PROFILE SERVICE
// ==========================================

export const authService = {
  onAuthChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async loginWithGoogle(): Promise<FirebaseUser> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await this.syncUserProfile(result.user);
      return result.user;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, USERS_COL);
      throw error;
    }
  },

  async loginGuest(role: UserRole = 'passenger'): Promise<FirebaseUser> {
    try {
      const result = await signInAnonymously(auth);
      await this.syncUserProfile(result.user, role, 'مسافر يمني (ضيف)');
      return result.user;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, USERS_COL);
      throw error;
    }
  },

  async logout(): Promise<void> {
    await fbSignOut(auth);
  },

  async syncUserProfile(
    user: FirebaseUser, 
    role: UserRole = 'passenger', 
    customName?: string
  ): Promise<UserProfile> {
    const userRef = doc(db, USERS_COL, user.uid);
    const isAdminEmail = Boolean(
      user.email && (
        user.email.toLowerCase() === 'baker@deterministicsolutionsdesign.com' ||
        user.email.toLowerCase() === 'qpjiu.sea@gmail.com'
      )
    );

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const existing = snap.data() as UserProfile;
        if (isAdminEmail && existing.role !== 'admin') {
          existing.role = 'admin';
          existing.roles = ['admin', 'traveler', 'captain'];
          await updateDoc(userRef, { role: 'admin', roles: existing.roles }).catch(console.warn);
        }
        return existing;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${USERS_COL}/${user.uid}`);
    }

    const assignedRole: UserRole = isAdminEmail ? 'admin' : role;

    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || customName || (user.isAnonymous ? 'مسافر ضيف' : 'مستخدم المسافر'),
      photoURL: user.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      phoneNumber: user.phoneNumber,
      role: assignedRole,
      roles: isAdminEmail ? ['admin', 'traveler', 'captain'] : [assignedRole],
      governorate: 'عدن',
      isDriverVerified: assignedRole === 'driver' || assignedRole === 'admin',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(userRef, newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${USERS_COL}/${user.uid}`);
    }
    return newProfile;
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const snap = await getDoc(doc(db, USERS_COL, uid));
      return snap.exists() ? (snap.data() as UserProfile) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${USERS_COL}/${uid}`);
      return null;
    }
  },

  async updateUserRole(uid: string, role: UserRole, driverData?: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, USERS_COL, uid);
    try {
      await updateDoc(userRef, {
        role,
        ...driverData
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${USERS_COL}/${uid}`);
    }
  },

  async completeUserProfile(uid: string, profileData: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, USERS_COL, uid);
    try {
      await updateDoc(userRef, {
        ...profileData,
        isProfileComplete: true,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${USERS_COL}/${uid}`);
      throw error;
    }
  },

  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, USERS_COL, uid);
    try {
      await updateDoc(userRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${USERS_COL}/${uid}`);
    }
  }
};

// ==========================================
// 1.5 DRIVER & VEHICLE OWNER GARAGE SERVICE
// ==========================================

export const vehiclesService = {
  subscribeToUserVehicles(ownerId: string, callback: (vehicles: DriverVehicle[]) => void) {
    const q = query(collection(db, VEHICLES_COL), where('ownerId', '==', ownerId));
    return onSnapshot(q, (snapshot) => {
      const data: DriverVehicle[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as DriverVehicle);
      });
      callback(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, VEHICLES_COL);
    });
  },

  async saveVehicle(vehicle: DriverVehicle): Promise<void> {
    try {
      await setDoc(doc(db, VEHICLES_COL, vehicle.id), vehicle, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${VEHICLES_COL}/${vehicle.id}`);
      throw error;
    }
  },

  async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, VEHICLES_COL, vehicleId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${VEHICLES_COL}/${vehicleId}`);
    }
  }
};

// ==========================================
// 2. INTERCITY TRIPS & LISTINGS SERVICE
// ==========================================

export const listingsService = {
  subscribeToListings(callback: (listings: InterCityTripListing[]) => void) {
    const q = collection(db, LISTINGS_COL);
    return onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_INTERCITY_TRIPS);
        await this.seedInitialListings().catch(() => {});
        return;
      }
      const data: InterCityTripListing[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as InterCityTripListing);
      });
      callback(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, LISTINGS_COL);
      callback(INITIAL_INTERCITY_TRIPS);
    });
  },

  async seedInitialListings() {
    try {
      for (const listing of INITIAL_INTERCITY_TRIPS) {
        await setDoc(doc(db, LISTINGS_COL, listing.id), listing, { merge: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, LISTINGS_COL);
    }
  },

  async addListing(listing: InterCityTripListing) {
    try {
      await setDoc(doc(db, LISTINGS_COL, listing.id), listing);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${LISTINGS_COL}/${listing.id}`);
      throw error;
    }
  },

  async bookSeat(listingId: string, seatCount: number = 1) {
    const ref = doc(db, LISTINGS_COL, listingId);
    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const current = snap.data() as InterCityTripListing;
        const newAvailable = Math.max(0, current.availableSeats - seatCount);
        await updateDoc(ref, {
          availableSeats: newAvailable,
          isFullyBooked: newAvailable === 0
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${LISTINGS_COL}/${listingId}`);
    }
  },

  async updateListing(listingId: string, updates: Partial<InterCityTripListing>) {
    const ref = doc(db, LISTINGS_COL, listingId);
    try {
      await updateDoc(ref, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${LISTINGS_COL}/${listingId}`);
    }
  },

  async deleteListing(listingId: string) {
    const ref = doc(db, LISTINGS_COL, listingId);
    try {
      await deleteDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${LISTINGS_COL}/${listingId}`);
    }
  }
};

// ==========================================
// 2.5 TRANSPORT OFFICES & SUBSCRIPTIONS SERVICE
// ==========================================

export const transportOfficesService = {
  subscribeToOffices(callback: (offices: TransportOffice[]) => void) {
    const q = collection(db, OFFICES_COL);
    return onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_TRANSPORT_OFFICES);
        await this.seedInitialOffices().catch(() => {});
        return;
      }
      const data: TransportOffice[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as TransportOffice);
      });
      callback(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, OFFICES_COL);
      callback(INITIAL_TRANSPORT_OFFICES);
    });
  },

  async seedInitialOffices() {
    try {
      for (const office of INITIAL_TRANSPORT_OFFICES) {
        await setDoc(doc(db, OFFICES_COL, office.id), office, { merge: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, OFFICES_COL);
    }
  },

  async saveOffice(office: TransportOffice) {
    try {
      await setDoc(doc(db, OFFICES_COL, office.id), office, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${OFFICES_COL}/${office.id}`);
      throw error;
    }
  },

  async updateSubscription(officeId: string, updates: Partial<TransportOffice>) {
    const ref = doc(db, OFFICES_COL, officeId);
    try {
      await updateDoc(ref, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${OFFICES_COL}/${officeId}`);
    }
  },

  async deleteOffice(officeId: string) {
    const ref = doc(db, OFFICES_COL, officeId);
    try {
      await deleteDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${OFFICES_COL}/${officeId}`);
    }
  }
};

// ==========================================
// 3. MULTI-DAY TRIPS SERVICE
// ==========================================

export const tripsService = {
  subscribeToTrips(callback: (trips: Trip[]) => void) {
    const q = collection(db, TRIPS_COL);
    return onSnapshot(q, (snapshot) => {
      const data: Trip[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Trip);
      });
      if (data.length > 0) {
        callback(data);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, TRIPS_COL);
    });
  },

  async saveTrip(trip: Trip) {
    try {
      await setDoc(doc(db, TRIPS_COL, trip.id), trip);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${TRIPS_COL}/${trip.id}`);
    }
  },

  async getTripByTrackingCode(trackingCode: string): Promise<Trip | null> {
    try {
      const q = query(collection(db, TRIPS_COL), where('trackingCode', '==', trackingCode), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as Trip;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, TRIPS_COL);
      return null;
    }
  }
};

// ==========================================
// 4. REAL-TIME NOTIFICATIONS SERVICE
// ==========================================

export const notificationsService = {
  subscribeToNotifications(callback: (notifs: AppNotification[]) => void) {
    const q = query(collection(db, NOTIFICATIONS_COL), orderBy('timestamp', 'desc'), limit(30));
    return onSnapshot(q, (snapshot) => {
      const data: AppNotification[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as AppNotification);
      });
      if (data.length > 0) {
        callback(data);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, NOTIFICATIONS_COL);
    });
  },

  async broadcastNotification(notif: AppNotification) {
    try {
      await setDoc(doc(db, NOTIFICATIONS_COL, notif.id), notif);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${NOTIFICATIONS_COL}/${notif.id}`);
    }
  },

  async deleteNotification(id: string) {
    try {
      await deleteDoc(doc(db, NOTIFICATIONS_COL, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${NOTIFICATIONS_COL}/${id}`);
    }
  }
};

// ==========================================
// 5. ROAD PASSES & HIGHWAY STATUS SERVICE
// ==========================================

export const roadPassesService = {
  subscribeToRoadAlerts(callback: (alerts: RoadPassAlert[]) => void) {
    const q = collection(db, ROAD_ALERTS_COL);
    return onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_ROAD_PASSES);
        for (const pass of INITIAL_ROAD_PASSES) {
          await setDoc(doc(db, ROAD_ALERTS_COL, pass.id), pass, { merge: true }).catch(() => {});
        }
        return;
      }
      const data: RoadPassAlert[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as RoadPassAlert);
      });
      callback(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, ROAD_ALERTS_COL);
      callback(INITIAL_ROAD_PASSES);
    });
  },

  async updateRoadStatus(alert: RoadPassAlert) {
    try {
      await setDoc(doc(db, ROAD_ALERTS_COL, alert.id), alert);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${ROAD_ALERTS_COL}/${alert.id}`);
    }
  }
};
