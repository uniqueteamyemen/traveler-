import { Trip } from '../types/travel';

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-yem-1',
    title: 'Aden to Hadhramaut Coastal & Desert Expedition',
    titleAr: 'رحلة من عدن إلى حضرموت التاريخية (المكلا وسحر دوعن وشبام)',
    destination: 'المكلا وشبام حضرموت ووادي دوعن',
    origin: 'عدن (كريتر / الشيخ عثمان)',
    country: 'اليمن',
    originGovernorate: 'عدن',
    destinationGovernorate: 'حضرموت',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-05',
    endDate: '2026-09-12',
    budget: 350000,
    currency: 'YER',
    travelers: ['أبو بكر', 'عمر', 'سالم'],
    description: 'رحلة استكشافية متكاملة عبر الخط الساحلي من عدن مروراً بأبين وشبوة وصولاً إلى حضرموت وشبام التاريخية ووادي دوعن الأسطوري.',
    coordinates: {
      lat: 14.5425,
      lng: 49.1242
    },
    isPlanApproved: true,
    trackingCode: 'YEM-AD-MK-992',
    assignedDriver: {
      name: 'الكابتن / أبو بكر القريشي',
      phone: '+967 771 234 567',
      whatsapp: '+967771234567',
      vehicleModel: 'تويوتا لاندكروزر برادو (Toyota Prado V6)',
      plateNumber: 'عدن 14-8921',
      isVerified: true,
      hasBackupCarCommitment: true
    },
    plannedStops: [
      {
        id: 'ps-1',
        nameAr: 'استراحة شقرة الساحلية (فطور شاي ملبن وخبز طاوة)',
        nameEn: 'Shuqra Coastal Rest Stop',
        type: 'rest_food',
        estimatedTime: '08:15',
        durationMinutes: 30,
        locationName: 'محافظة أبين — شقرة',
        isCompleted: true,
        notes: 'تم التوقف وتناول الفطور الساحلي الطازج'
      },
      {
        id: 'ps-2',
        nameAr: 'محطة أحور (صلاة واستراحة دورات مياه وتزود بالوقود)',
        nameEn: 'Ahwar Fuel & Prayer Stop',
        type: 'prayer',
        estimatedTime: '10:45',
        durationMinutes: 20,
        locationName: 'محافظة أبين — أحور',
        isCompleted: true
      },
      {
        id: 'ps-3',
        nameAr: 'نقطة بئر علي وشاطئ شوران (غداء سمك طازج واستراحة)',
        nameEn: 'Bir Ali Seafood Lunch Stop',
        type: 'rest_food',
        estimatedTime: '13:00',
        durationMinutes: 45,
        locationName: 'محافظة شبوة — بئر علي',
        isCompleted: false,
        notes: 'تناول وجبة سمك المخبازة الطازج المطل على البحر'
      },
      {
        id: 'ps-4',
        nameAr: 'مدخل المكلا وفحص أمني روتيني',
        nameEn: 'Mukalla Gateway Checkpoint',
        type: 'checkpoint',
        estimatedTime: '14:30',
        durationMinutes: 10,
        locationName: 'بروم ميفع — مدخل المكلا',
        isCompleted: false
      }
    ],
    days: [
      {
        id: 'day-y1',
        dayNumber: 1,
        date: '2026-09-05',
        title: 'Coastal Drive from Aden & Arrival in Mukalla',
        titleAr: 'الانطلاق من عدن عبر الخط الساحلي والوصول إلى خور المكلا',
        activities: [
          {
            id: 'act-y1',
            dayId: 'day-y1',
            time: '06:30',
            title: 'Departure from Crater, Aden',
            titleAr: 'التجمع والانطلاق من كريتر — عدن',
            description: 'فحص المركبة وتأكيد المقاعد مع الكابتن والانطلاق على خط أبين الساحلي.',
            location: 'Aden, Crater',
            category: 'transport',
            cost: 45000,
            currency: 'YER',
            isCompleted: true
          },
          {
            id: 'act-y2',
            dayId: 'day-y1',
            time: '15:30',
            title: 'Hotel Check-in Mukalla & Rest',
            titleAr: 'تسجيل الوصول في فندق رمادا المكلا والاستراحة',
            description: 'استلام الغرف المطلة على بحر العرب وأخذ قسط من الراحة.',
            location: 'Al-Mukalla Waterfront',
            category: 'hotel',
            cost: 40000,
            currency: 'YER',
            isCompleted: true,
            bookingRef: 'RMD-MK-4421'
          },
          {
            id: 'act-y3',
            dayId: 'day-y1',
            time: '19:00',
            title: 'Evening Stroll along Khor Mukalla & Seafood Dinner',
            titleAr: 'جولة مسائية في خور المكلا وعشاء المندي الحضرمي',
            description: 'التجول حول الجسور المضاءة في الخور وتناول عشاء مندي أصيل مع الشاي الحضرمي.',
            location: 'Khor Mukalla Promenade',
            category: 'food',
            cost: 15000,
            currency: 'YER',
            isCompleted: false
          }
        ]
      },
      {
        id: 'day-y2',
        dayNumber: 2,
        date: '2026-09-06',
        title: 'Journey to Wadi Doan & Haid Al-Jazeel Cliffs',
        titleAr: 'الرحلة إلى وادي دوعن وقرى حيد الجزيل وقصر بقشان',
        activities: [
          {
            id: 'act-y4',
            dayId: 'day-y2',
            time: '08:00',
            title: 'Drive up the Valley toward Wadi Doan',
            titleAr: 'الصعود باتجاه وادي دوعن الساحر',
            description: 'مشاهدة بساتين النخيل وأشجار السدر الدوعني والتوقف عند قصر بقشان الملون في خيلة بقشان.',
            location: 'Wadi Doan, Hadhramaut',
            category: 'sightseeing',
            cost: 0,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y5',
            dayId: 'day-y2',
            time: '12:30',
            title: 'Traditional Lunch & Honey Tasting in Doan',
            titleAr: 'غداء المظبي على الحصى وتذوق عسل السدر الدوعني الملكي',
            description: 'زيارة مناحل العسل الطبيعي والتعرف على طرق استخلاص أجود أنواع العسل في العالم.',
            location: 'Haid Al-Jazeel Resort & Viewpoint',
            category: 'culture',
            cost: 22000,
            currency: 'YER',
            isCompleted: false
          }
        ]
      },
      {
        id: 'day-y3',
        dayNumber: 3,
        date: '2026-09-07',
        title: 'Shibam Hadhramaut - Manhattan of the Desert',
        titleAr: 'زيارة شبام حضرموت (ناطحات السحاب الطينية الأولى في العالم)',
        activities: [
          {
            id: 'act-y6',
            dayId: 'day-y3',
            time: '09:00',
            title: 'Guided Tour inside Shibam Walled City',
            titleAr: 'جولة داخل أزقة مدينة شبام المسورة والتعرف على هندستها الطينية',
            description: 'استكشاف المباني الطينية الشاهقة التي يعود تاريخها لمئات السنين وزيارة متحف شبام التراثي.',
            location: 'Shibam Hadhramaut (UNESCO Heritage)',
            category: 'sightseeing',
            cost: 5000,
            currency: 'YER',
            isCompleted: false
          }
        ]
      }
    ],
    bookings: [
      {
        id: 'bk-y1',
        type: 'intercity_car',
        provider: 'كابتن أبو بكر القريشي (سيارة برادو معتمدة)',
        title: 'رحلة نقل بين المحافظات: عدن ➔ المكلا',
        referenceNumber: 'YEM-TRIP-9921',
        startDate: '2026-09-05',
        startTime: '06:30',
        endTime: '15:00',
        departureLocation: 'عدن — كريتر / الشيخ عثمان',
        arrivalLocation: 'المكلا — خور المكلا',
        cost: 45000,
        currency: 'YER',
        status: 'confirmed',
        driverName: 'الكابتن أبو بكر القريشي',
        driverPhone: '+967 771 234 567',
        vehiclePlate: 'عدن 14-8921',
        seatNumber: 'مقعد أمامي نافذة (A1)',
        trackingCode: 'YEM-AD-MK-992',
        isTripPlanApprovedByPassenger: true,
        notes: 'تمت الموافقة على خطة السير والمحطات المحددة مع وثيقة الالتزام بسيارة بديلة في حال الأعطال.'
      },
      {
        id: 'bk-y2',
        type: 'hotel',
        provider: 'فندق رمادا المكلا',
        title: 'إقامة 3 ليالٍ — جناح إطلالة بحرية',
        referenceNumber: 'RMD-MK-4421',
        startDate: '2026-09-05',
        endDate: '2026-09-08',
        address: 'كورنيش المكلا، حضرموت',
        cost: 120000,
        currency: 'YER',
        status: 'confirmed',
        notes: 'شامل الفطور وخدمة الواي فاي وموقف السيارات.'
      }
    ],
    expenses: [
      {
        id: 'exp-y1',
        title: 'حجز مقعد سيارة النقل (عدن ➔ المكلا)',
        amount: 45000,
        currency: 'YER',
        category: 'transport',
        date: '2026-09-05',
        paidBy: 'أبو بكر',
        splitWith: ['أبو بكر'],
        notes: 'حصة الراكب في المشوار المعتمد'
      },
      {
        id: 'exp-y2',
        title: 'فطور شقرة وضيافة الشاي الملبن',
        amount: 6000,
        currency: 'YER',
        category: 'food',
        date: '2026-09-05',
        paidBy: 'أبو بكر',
        splitWith: ['أبو بكر', 'عمر', 'سالم'],
        notes: 'قطة فطور جماعي'
      },
      {
        id: 'exp-y3',
        title: 'شراء عسل سدر دوعني ملكي خالص (نصف كيلو)',
        amount: 35000,
        currency: 'YER',
        category: 'shopping',
        date: '2026-09-06',
        paidBy: 'أبو بكر',
        notes: 'هدية تذكارية من مناحل دوعن'
      }
    ],
    documents: [
      {
        id: 'doc-y1',
        title: 'البطاقة الشخصية الذكية (الهوية الوطنية)',
        type: 'id_card',
        holderName: 'أبو بكر عبد الرحمن',
        documentNumber: '02-88192019',
        expiryDate: '2029-08-14',
        issuingAuthority: 'مصلحة الأحوال المدنية — عدن',
        notes: 'أصل البطاقة جاهز للنقاط الأمنية'
      },
      {
        id: 'doc-y2',
        title: 'تأكيد حجز الرحلة ورخصة اعتماد السائق',
        type: 'travel_permit',
        holderName: 'أبو بكر عبد الرحمن',
        documentNumber: 'YEM-PERM-8821',
        notes: 'يشمل رمز التتبع الحي للأمان العائلي وضمان السيارة البديلة'
      }
    ],
    packingList: [
      { id: 'py-1', name: 'Original National ID / Passport', nameAr: 'أصل البطاقة الشخصية وجواز السفر', category: 'essentials', isPacked: true, quantity: 1 },
      { id: 'py-2', name: 'Cash in YER / SAR for road stops', nameAr: 'مبلغ نقدي كاش (ريال يمني/سعودي) للمحطات بدون شبكة', category: 'essentials', isPacked: true, quantity: 1 },
      { id: 'py-3', name: 'High-Capacity Power Bank 20,000mAh', nameAr: 'بنك طاقة عالي السعة 20,000 مللي أمبير للطريق', category: 'electronics', isPacked: true, quantity: 2 },
      { id: 'py-4', name: 'Offline Map & Downloaded Route', nameAr: 'تحميل مسار الرحلة للاستخدام بدون إنترنت', category: 'electronics', isPacked: true, quantity: 1 },
      { id: 'py-5', name: 'Road First-Aid Kit & Motion Sickness Pills', nameAr: 'حقيبة إسعافات أولية وأدوية دوار الحركة للمنعطفات', category: 'medicine', isPacked: true, quantity: 1 },
      { id: 'py-6', name: 'Bottled Mineral Water & Dates Pack', nameAr: 'مياه شرب معبأة وعبوة تمر طاقة للرحلة', category: 'road_safety', isPacked: true, quantity: 1 },
      { id: 'py-7', name: 'Light Cotton Clothes & Sun Hat', nameAr: 'ملابس قطنية مريحة وقبعة شمسية لساحل حضرموت', category: 'clothing', isPacked: false, quantity: 3 }
    ],
    stories: [
      {
        id: 'st-y1',
        date: '2026-09-05',
        title: 'بداية القصة: إشراقة الفجر في شقرة وأمواج بحر العرب',
        governorate: 'أبين / شبوة',
        location: 'شاطئ شقرة وبئر علي',
        mood: 'inspired',
        storyText: 'انطلقنا مع نسمات الفجر الأولى من عدن. كان الطريق الساحلي يمتد بهدوء ساحر بجانب مياه بحر العرب الفيروزية. حين توقفنا في شقرة لتناول الشاي الملبن الساخن والمخبوزات، شعرنا ببهجة السفر الحقيقية، وكان الكابتن ملتزماً بكل محطة محددة بدقة، مما منحنا شعوراً مطلقاً بالأمان والراحة.',
        photos: [
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 5,
        tags: ['بداية_القصة', 'عدن_إلى_حضرموت', 'أمان_السفر', 'بحر_العرب'],
        culturalTip: 'عند التوقف في شقرة أو بئر علي، احرص على تجربة سمك الثمد الطازج المخبوز في التنور مع الخبز الطاوة الحار.'
      }
    ]
  },
  {
    id: 'trip-yem-2',
    title: 'Sana\'a to Ibb - The Green Highlands Discovery',
    titleAr: 'رحلة من صنعاء إلى إب الخضراء (نقيل سمارة وشلالات وادي بنا)',
    destination: 'محافظة إب وجبلة التاريخية',
    origin: 'صنعاء (الستين الجنوبي)',
    country: 'اليمن',
    originGovernorate: 'صنعاء القديمة وأمانة العاصمة',
    destinationGovernorate: 'إب',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-15',
    endDate: '2026-09-18',
    budget: 180000,
    currency: 'YER',
    travelers: ['أحمد', 'محمد'],
    description: 'رحلة عبر قمم الجبال اليمنية الخضراء من صنعاء مروراً بذمار ونقيل يسلح وسمارة الأسطوري وصولاً إلى عاصمة السياحة اليمنية إب.',
    coordinates: {
      lat: 13.9667,
      lng: 44.1833
    },
    isPlanApproved: true,
    trackingCode: 'YEM-SN-IBB-441',
    assignedDriver: {
      name: 'شركة راحة للنقل (كابتن علي الذماري)',
      phone: '+967 733 900 111',
      whatsapp: '+967733900111',
      vehicleModel: 'باص هيونداي ستاريا VIP فاخر',
      plateNumber: 'أمانة العاصمة 22-1044',
      isVerified: true,
      hasBackupCarCommitment: true
    },
    plannedStops: [
      {
        id: 'ps-i1',
        nameAr: 'استراحة نقيل يسلح (شاي كرك ومطل جبلي)',
        nameEn: 'Yaslih Mountain Pass Stop',
        type: 'rest_food',
        estimatedTime: '09:15',
        durationMinutes: 20,
        locationName: 'نقيل يسلح',
        isCompleted: false
      },
      {
        id: 'ps-i2',
        nameAr: 'استراحة ذمار المركزية للتزود بالوقود',
        nameEn: 'Dhamar Fuel & Rest Stop',
        type: 'fuel',
        estimatedTime: '10:30',
        durationMinutes: 15,
        locationName: 'مدينة ذمار',
        isCompleted: false
      },
      {
        id: 'ps-i3',
        nameAr: 'مطل نقيل سمارة الشاهق (مناظر الضباب والشلالات)',
        nameEn: 'Samarah Pass Cloud Viewpoint',
        type: 'scenic',
        estimatedTime: '11:45',
        durationMinutes: 20,
        locationName: 'نقيل سمارة الأخضر',
        isCompleted: false
      }
    ],
    days: [
      {
        id: 'day-si1',
        dayNumber: 1,
        date: '2026-09-15',
        title: 'Scenic Mountain Drive & Arrival in Ibb City',
        titleAr: 'الانطلاق صباحاً عبر جبال اليمن والوصول إلى إب',
        activities: [
          {
            id: 'act-si1',
            dayId: 'day-si1',
            time: '08:00',
            title: 'Departure from Sana\'a South Terminal',
            titleAr: 'الانطلاق من فرع شركة راحة — صنعاء الستين',
            description: 'الركوب في الباص الفاخر والانطلاق جنوباً.',
            location: 'Sana\'a Terminal',
            category: 'transport',
            cost: 15000,
            currency: 'YER',
            isCompleted: false
          }
        ]
      }
    ],
    bookings: [],
    expenses: [],
    documents: [],
    packingList: [],
    stories: []
  },
  {
    id: 'trip-yem-3',
    title: 'Socotra Island Sanctuary & Dragon Blood Forests',
    titleAr: 'مغامرة أرخبيل سقطرى (شجرة دم الأخوين ولاغون ديتوا)',
    destination: 'جزيرة سقطرى (حديبو، دكسم، قلنسية)',
    origin: 'عدن / المكلا (مطار الريان)',
    country: 'اليمن',
    originGovernorate: 'أرخبيل سقطرى',
    destinationGovernorate: 'أرخبيل سقطرى',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-10-10',
    endDate: '2026-10-17',
    budget: 1200,
    currency: 'USD',
    travelers: ['أبو بكر', 'فريق Unique Team'],
    description: 'استكشاف الطبيعة العذراء الفريدة في كوكب الأرض: غابات شجرة دم الأخوين، والشواطئ الفيروزية الرملية البيضاء وكهوف سقطرى الساحرة.',
    coordinates: {
      lat: 12.4634,
      lng: 53.8237
    },
    isPlanApproved: true,
    trackingCode: 'YEM-SOC-2026-01',
    plannedStops: [],
    days: [],
    bookings: [],
    expenses: [],
    documents: [],
    packingList: [],
    stories: []
  }
];
