import { Trip } from '../types/travel';

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-yem-1',
    title: 'Aden to Hadhramaut Grand Expedition & Shibam Heritage',
    titleAr: 'رحلة سحر اليمن الكبرى: من عروس البحر عدن إلى لؤلؤة حضرموت شبام وسحر دوعن',
    destination: 'المكلا، شبام حضرموت، وادي دوعن وحيد الجزيل',
    origin: 'عدن (كريتر / الشيخ عثمان) ➔ خط أبين وشبوة الساحلي',
    country: 'اليمن',
    originGovernorate: 'عدن',
    destinationGovernorate: 'حضرموت',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-05',
    endDate: '2026-09-12',
    budget: 420000,
    currency: 'YER',
    travelers: ['أبو بكر', 'عمر', 'سالم'],
    description: 'رحلة سياحية وثقافية رائدة عبر الخط الساحلي لبحر العرب من عدن مروراً بأبين وشبوة، وصولاً إلى المكلا وشبام حضرموت (مانهاتن الصحراء) ووادي دوعن الأسطوري.',
    coordinates: {
      lat: 14.5425,
      lng: 49.1242
    },
    isPlanApproved: true,
    trackingCode: 'YEM-AD-MK-992',
    assignedDriver: {
      name: 'الكابتن / أبو بكر القريشي (كابتن نقل بين المحافظات معتمد)',
      phone: '+967 771 234 567',
      whatsapp: '+967771234567',
      vehicleModel: 'تويوتا لاندكروزر برادو (Toyota Prado V6 4x4)',
      plateNumber: 'عدن 14-8921',
      isVerified: true,
      hasBackupCarCommitment: true
    },
    plannedStops: [
      {
        id: 'ps-1',
        nameAr: 'استراحة شقرة الساحلية (فطور شاي ملبن وخبز طاوة حار)',
        nameEn: 'Shuqra Coastal Rest Stop & Milk Tea',
        type: 'rest_food',
        estimatedTime: '08:15',
        durationMinutes: 35,
        locationName: 'محافظة أبين — شاطئ شقرة',
        isCompleted: true,
        notes: 'تم التوقف وتناول الفطور الساحلي والشاي الملبن الطازج'
      },
      {
        id: 'ps-2',
        nameAr: 'محطة أحور المركزية (صلاة، استراحة دورات مياه وتزود بالوقود)',
        nameEn: 'Ahwar Central Fuel & Prayer Stop',
        type: 'prayer',
        estimatedTime: '10:45',
        durationMinutes: 20,
        locationName: 'محافظة أبين — مدينة أحور',
        isCompleted: true,
        notes: 'فحص ضغط الإطارات وتعبئة وقود بنزين ممتاز'
      },
      {
        id: 'ps-3',
        nameAr: 'شاطئ بئر علي ومطل شوران (غداء سمك المخبازة الطازج واستراحة)',
        nameEn: 'Bir Ali Beach & Shorān Crater Seafood Lunch',
        type: 'rest_food',
        estimatedTime: '13:15',
        durationMinutes: 50,
        locationName: 'محافظة شبوة — بئر علي',
        isCompleted: false,
        notes: 'وجبة سمك الثمد الطازج المخبوز في التنور مع السلطات الحارة'
      },
      {
        id: 'ps-4',
        nameAr: 'نقطة بروم ومدخل مدينة المكلا الغربي (فحص أمني سريع)',
        nameEn: 'Mukalla Western Gateway Checkpoint',
        type: 'checkpoint',
        estimatedTime: '15:15',
        durationMinutes: 10,
        locationName: 'بروم ميفع — مدخل المكلا',
        isCompleted: false,
        notes: 'إبراز وثيقة السفر والأمان العائلي لتسهيل العبور'
      },
      {
        id: 'ps-5',
        nameAr: 'مطل خور المكلا وجسر القعيطي وقت الغروب',
        nameEn: 'Khor Mukalla Sunset Viewpoint',
        type: 'scenic',
        estimatedTime: '18:30',
        durationMinutes: 45,
        locationName: 'المكلا — كورنيش المحضار',
        isCompleted: false
      }
    ],
    days: [
      {
        id: 'day-y1',
        dayNumber: 1,
        date: '2026-09-05',
        title: 'Coastal Drive along the Arabian Sea & Arrival in Mukalla',
        titleAr: 'الانطلاق من عدن عبر خط بحر العرب الساحلي والوصول إلى خور المكلا',
        activities: [
          {
            id: 'act-y101',
            dayId: 'day-y1',
            time: '06:30',
            title: 'Early Morning Departure from Crater / Sheikh Othman, Aden',
            titleAr: 'التجمع والانطلاق من كريتر / الشيخ عثمان — عدن',
            description: 'فحص المركبة وتأكيد المقاعد مع الكابتن المعتمد والانطلاق عبر طريق ساحل أبين وبحر العرب.',
            location: 'Aden, Crater Gate',
            category: 'transport',
            cost: 45000,
            currency: 'YER',
            isCompleted: true
          },
          {
            id: 'act-y102',
            dayId: 'day-y1',
            time: '08:15',
            title: 'Authentic Breakfast & Milk Tea in Shuqra',
            titleAr: 'فطور شاي ملبن عدني وخبز طاوة في شاطئ شقرة',
            description: 'استراحة الفطور الشهيرة على ساحل أبين مع إطلالة بحرية خلابة.',
            location: 'Shuqra Coastal Rest, Abyan',
            category: 'food',
            cost: 4000,
            currency: 'YER',
            isCompleted: true
          },
          {
            id: 'act-y103',
            dayId: 'day-y1',
            time: '13:15',
            title: 'Fresh Seafood Lunch at Bir Ali Cove',
            titleAr: 'غداء سمك المخبازة الطازج في شاطئ بئر علي',
            description: 'تناول وجبة سمك المخبازة والتجول السريع حول بحيرة شوران البركانية الفيروزية.',
            location: 'Bir Ali Beach, Shabwah',
            category: 'food',
            cost: 12000,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y104',
            dayId: 'day-y1',
            time: '16:00',
            title: 'Hotel Check-in at Mukalla Waterfront',
            titleAr: 'تسجيل الوصول في فندق رمادا المكلا التراثي',
            description: 'استلام الغرف المطلة على بحر العرب وأخذ قسط من الراحة والاستجمام.',
            location: 'Mukalla Corniche, Hadhramaut',
            category: 'hotel',
            cost: 40000,
            currency: 'YER',
            isCompleted: false,
            bookingRef: 'RMD-MK-4421'
          },
          {
            id: 'act-y105',
            dayId: 'day-y1',
            time: '19:30',
            title: 'Evening Stroll around Khor Mukalla & Traditional Hadhrami Dinner',
            titleAr: 'أمسية في خور المكلا وعشاء المندي الحضرمي وشاي البخاري',
            description: 'التجول بين جسور الخور المضاءة وقوارب النزهة وتناول عشاء مندي أصيل.',
            location: 'Khor Mukalla Promenade',
            category: 'food',
            cost: 16000,
            currency: 'YER',
            isCompleted: false
          }
        ]
      },
      {
        id: 'day-y2',
        dayNumber: 2,
        date: '2026-09-06',
        title: 'Journey to the Magic of Wadi Doan & Haid Al-Jazeel Cliffs',
        titleAr: 'رحلة الصعود إلى وادي دوعن وقرى حيد الجزيل وقصر بقشان التراثي',
        activities: [
          {
            id: 'act-y201',
            dayId: 'day-y2',
            time: '08:00',
            title: 'Scenic Mountain Drive toward Wadi Doan',
            titleAr: 'الصعود باتجاه هضبة حضرموت ووادي دوعن',
            description: 'مشاهدة بساتين النخيل وأشجار السدر الدوعني والتوقف عند قصر بقشان الملون في خيلة بقشان.',
            location: 'Wadi Doan Valley',
            category: 'sightseeing',
            cost: 0,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y202',
            dayId: 'day-y2',
            time: '12:30',
            title: 'Haid Al-Jazeel Clifftop Panorama & Honey Farm Experience',
            titleAr: 'مطل حيد الجزيل الأسطوري وتجربة مناحل عسل السدر الدوعني',
            description: 'إطلالة خيالية على القرية الصخرية المتربعة فوق الجبل وزيارة خلايا النحل وتذوق العسل الملكي.',
            location: 'Haid Al-Jazeel Clifftop Resort',
            category: 'culture',
            cost: 18000,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y203',
            dayId: 'day-y2',
            time: '14:00',
            title: 'Traditional Mazbi Lunch on River Stones',
            titleAr: 'غداء المظبي الحضرمي على الحصى وأرز البشاور الأصيل',
            description: 'تجربة المظبي المطهو على أحجار الوادي الساخنة مع الشاي الحضرمي المنسم بالهيل.',
            location: 'Doan Valley Local Kitchen',
            category: 'food',
            cost: 20000,
            currency: 'YER',
            isCompleted: false
          }
        ]
      },
      {
        id: 'day-y3',
        dayNumber: 3,
        date: '2026-09-07',
        title: 'Shibam Hadhramaut - Manhattan of the Desert (UNESCO World Heritage)',
        titleAr: 'زيارة شبام حضرموت (أول ناطحات سحاب طينية في العالم ومتحف التراث)',
        activities: [
          {
            id: 'act-y301',
            dayId: 'day-y3',
            time: '09:00',
            title: 'Guided Heritage Tour inside Shibam Walled City',
            titleAr: 'جولة استكشافية داخل أزقة شبام المسورة وقصورها الطينية الشاهقة',
            description: 'استكشاف المباني الطينية الشاهقة التي يصل ارتفاعها إلى 8 طوابق واستمع لقصص البنائين الأوائل.',
            location: 'Shibam Hadhramaut (UNESCO Heritage Site)',
            category: 'sightseeing',
            cost: 5000,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y302',
            dayId: 'day-y3',
            time: '13:00',
            title: 'Lunch in Sayun & Visit to Al-Kathiri Sultan Palace',
            titleAr: 'غداء في سيئون وزيارة قصر الكثيري التاريخي (سلطنة سيئون)',
            description: 'زيارة أكبر مبنى طيني أبيض في الجزيرة العربية والتعرف على تاريخ وادي حضرموت وقوافل طريق اللبان.',
            location: 'Al-Kathiri Palace Museum, Sayun',
            category: 'culture',
            cost: 15000,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y303',
            dayId: 'day-y3',
            time: '17:00',
            title: 'Sunset Panorama of Shibam from the Sand Dunes',
            titleAr: 'مشهد الغروب الذهبي على ناطحات سحاب شبام من كثبان الرمال',
            description: 'التقاط أجمل الصور التذكارية لشبام وهي تتلألأ تحت أشعة الشمس الذهبية المغاربية.',
            location: 'Shibam Sand Dunes Viewpoint',
            category: 'relaxation',
            cost: 0,
            currency: 'YER',
            isCompleted: false
          }
        ]
      },
      {
        id: 'day-y4',
        dayNumber: 4,
        date: '2026-09-08',
        title: 'Tarim City of Minarets & Al-Mihdhar Mosque Tower',
        titleAr: 'مدينة تريم عاصمة الثقافة ومنارة المحضار الطينية الشامخة',
        activities: [
          {
            id: 'act-y401',
            dayId: 'day-y4',
            time: '09:30',
            title: 'Al-Mihdhar Minaret (Tallest Earth Minaret in the World)',
            titleAr: 'زيارة مئذنة جامع المحضار (أعلى مئذنة طينية في العالم 53 متراً)',
            description: 'تأمل الهندسة المعمارية الإسلامية والزخارف الطينية الفريدة وزيارة مكتبة الأحقاف للمخطوطات النادرة.',
            location: 'Al-Mihdhar Mosque, Tarim',
            category: 'culture',
            cost: 3000,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y402',
            dayId: 'day-y4',
            time: '16:00',
            title: 'Tarim Palaces & Qasr Ishshah Heritage Visit',
            titleAr: 'جولة في قصور تريم التاريخية وقصر عشّة التراثي',
            description: 'مشاهدة التأثيرات المعمارية الجاوية والحضرمية الممتزجة في هندسة قصور آل الكاف.',
            location: 'Qasr Ishshah Palace, Tarim',
            category: 'sightseeing',
            cost: 4000,
            currency: 'YER',
            isCompleted: false
          }
        ]
      },
      {
        id: 'day-y5',
        dayNumber: 5,
        date: '2026-09-09',
        title: 'Return to Mukalla & Husn Al-Ghuwayzi Fort Excursion',
        titleAr: 'العودة لساحل المكلا وزيارة حصن الغويزي التاريخي المشيد على الصخر',
        activities: [
          {
            id: 'act-y501',
            dayId: 'day-y5',
            time: '10:00',
            title: 'Husn Al-Ghuwayzi Rock Fortress Tour',
            titleAr: 'صعود حصن الغويزي العريق عند مدخل المكلا الشمالي',
            description: 'الحصن الدفاعي التاريخي المشيد فوق صخرة جبلية شامخة لحماية بوابة حضرموت الساحلية.',
            location: 'Al-Ghuwayzi Fortress, Mukalla',
            category: 'sightseeing',
            cost: 2000,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y502',
            dayId: 'day-y5',
            time: '17:00',
            title: 'Afternoon Boat Cruise in Khor Mukalla',
            titleAr: 'جولة بحرية بالقوارب الخشبية التراثية في خور المكلا',
            description: 'الإبحار في مياه الخور مع أنغام الدان الحضرمي وإطلالة القصور التراثية المضاءة.',
            location: 'Khor Mukalla Boat Marina',
            category: 'relaxation',
            cost: 8000,
            currency: 'YER',
            isCompleted: false
          }
        ]
      },
      {
        id: 'day-y6',
        dayNumber: 6,
        date: '2026-09-10',
        title: 'Traditional Souks, Yemeni Honey Shopping & Spices',
        titleAr: 'سوق المكلا القديم وتسوق العسل الدوعني، البهارات واللبان الحضرمي',
        activities: [
          {
            id: 'act-y601',
            dayId: 'day-y6',
            time: '10:30',
            title: 'Authentic Souk Shopping for Doani Honey, Frankincense & Yemeni Coffee',
            titleAr: 'شراء عسل السدر الملكي، اللبان الذكر والبن اليمني الفاخر',
            description: 'التسوق من تجار العسل الموثوقين وشراء الهدايا التذكارية للأهل والأصدقاء.',
            location: 'Old Mukalla Souk',
            category: 'shopping',
            cost: 65000,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y602',
            dayId: 'day-y6',
            time: '19:30',
            title: 'Farewell Dinner: Fresh Seafood Banquet with Driver & Team',
            titleAr: 'عشاء وداعي فاخر: وليمة بحرية تجمع الأصدقاء مع الكابتن أبو بكر',
            description: 'الاحتفال بنجاح الرحلة الاستكشافية وتوثيق الذكريات والقصص في مذكرات السفر.',
            location: 'Mukalla Fish Market Restaurant',
            category: 'food',
            cost: 28000,
            currency: 'YER',
            isCompleted: false
          }
        ]
      },
      {
        id: 'day-y7',
        dayNumber: 7,
        date: '2026-09-11',
        title: 'Safe Return Journey to Aden & Family Welcome',
        titleAr: 'رحلة العودة الآمنة إلى عدن واكتمال بداية القصة بنجاح',
        activities: [
          {
            id: 'act-y701',
            dayId: 'day-y7',
            time: '07:00',
            title: 'Morning Departure back to Aden via Coastal Highway',
            titleAr: 'الانطلاق صباحاً باتجاه عدن عبر خط الساحل الدولي',
            description: 'رحلة العودة المريحة مع التوقف عند استراحات الطريق المعتمدة ومشاركة موقع التتبع المباشر مع العائلة.',
            location: 'Mukalla ➔ Aden Highway',
            category: 'transport',
            cost: 45000,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-y702',
            dayId: 'day-y7',
            time: '16:00',
            title: 'Arrival in Aden & Trip Completion',
            titleAr: 'الوصول بسلامة الله إلى عدن واكتمال الرحلة بنجاح',
            description: 'الوصول إلى المنازل بسلام وتوثيق تقييم الكابتن والخدمة في تطبيق سَفَر.',
            location: 'Aden City Center',
            category: 'relaxation',
            cost: 0,
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
        provider: 'كابتن أبو بكر القريشي (سيارة برادو معتمدة - تطبيق سَفَر)',
        title: 'رحلة نقل كبار الشخصيات بين المحافظات: عدن ➔ المكلا ➔ وادي دوعن',
        referenceNumber: 'YEM-TRIP-9921',
        startDate: '2026-09-05',
        startTime: '06:30',
        endTime: '15:00',
        departureLocation: 'عدن — كريتر / الشيخ عثمان',
        arrivalLocation: 'المكلا — خور المكلا',
        cost: 90000,
        currency: 'YER',
        status: 'confirmed',
        driverName: 'الكابتن أبو بكر القريشي',
        driverPhone: '+967 771 234 567',
        vehiclePlate: 'عدن 14-8921',
        seatNumber: 'مقعد أمامي نافذة (A1) ومقاعد العائلة',
        trackingCode: 'YEM-AD-MK-992',
        isTripPlanApprovedByPassenger: true,
        notes: 'تمت الموافقة على خطة السير والمحطات المحددة مع وثيقة الالتزام بسيارة بديلة في حال الأعطال.'
      },
      {
        id: 'bk-y2',
        type: 'hotel',
        provider: 'فندق رمادا المكلا السياحي',
        title: 'إقامة 4 ليالٍ — جناح إطلالة بحرية على بحر العرب',
        referenceNumber: 'RMD-MK-4421',
        startDate: '2026-09-05',
        endDate: '2026-09-09',
        address: 'كورنيش المكلا، حضرموت',
        cost: 160000,
        currency: 'YER',
        status: 'confirmed',
        notes: 'شامل الفطور وخدمة الواي فاي وموقف السيارات وتأمين الأمتعة.'
      },
      {
        id: 'bk-y3',
        type: 'activity',
        provider: 'منتجع ومطل حيد الجزيل السياحي',
        title: 'تذوق العسل الملكي وجولة وادي دوعن وقصر بقشان',
        referenceNumber: 'DOAN-EXP-109',
        startDate: '2026-09-06',
        startTime: '12:30',
        departureLocation: 'حيد الجزيل، وادي دوعن',
        cost: 30000,
        currency: 'YER',
        status: 'confirmed',
        notes: 'تشمل زيارة المناحل والضيافة الحضرمية بالقهوة واللبان.'
      }
    ],
    expenses: [
      {
        id: 'exp-y1',
        title: 'حجز مقاعد سيارة النقل المعتمدة (عدن ➔ المكلا)',
        amount: 90000,
        currency: 'YER',
        category: 'transport',
        date: '2026-09-05',
        paidBy: 'أبو بكر',
        splitWith: ['أبو بكر', 'عمر', 'سالم'],
        notes: 'حصة الركاب في المشوار المعتمد'
      },
      {
        id: 'exp-y2',
        title: 'فطور شقرة وضيافة الشاي الملبن الساحلي',
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
        title: 'غداء سمك المخبازة في شاطئ بئر علي',
        amount: 18000,
        currency: 'YER',
        category: 'food',
        date: '2026-09-05',
        paidBy: 'عمر',
        splitWith: ['أبو بكر', 'عمر', 'سالم'],
        notes: 'وجبة سمك طازج مطل على البحر'
      },
      {
        id: 'exp-y4',
        title: 'شراء عسل سدر دوعني ملكي خالص (نصف كيلو)',
        amount: 45000,
        currency: 'YER',
        category: 'shopping',
        date: '2026-09-06',
        paidBy: 'أبو بكر',
        notes: 'هدية تذكارية من مناحل دوعن'
      },
      {
        id: 'exp-y5',
        title: 'غداء المظبي الحضرمي على الحصى في وادي دوعن',
        amount: 24000,
        currency: 'YER',
        category: 'food',
        date: '2026-09-06',
        paidBy: 'سالم',
        splitWith: ['أبو بكر', 'عمر', 'سالم']
      },
      {
        id: 'exp-y6',
        title: 'رسوم دخول متحف قصر الكثيري التاريخي بسيئون',
        amount: 6000,
        currency: 'YER',
        category: 'activities',
        date: '2026-09-07',
        paidBy: 'أبو بكر',
        splitWith: ['أبو بكر', 'عمر', 'سالم']
      }
    ],
    documents: [
      {
        id: 'doc-y1',
        title: 'البطاقة الشخصية الذكية (الهوية الوطنية اليمنية)',
        type: 'id_card',
        holderName: 'أبو بكر عبد الرحمن القريشي',
        documentNumber: '02-88192019',
        expiryDate: '2029-08-14',
        issuingAuthority: 'مصلحة الأحوال المدنية والسجل المدني — عدن',
        notes: 'أصل البطاقة جاهز للنقاط الأمنية'
      },
      {
        id: 'doc-y2',
        title: 'وثيقة خطة السير واعتماد السائق وتتبع الأمان العائلي',
        type: 'travel_permit',
        holderName: 'أبو بكر عبد الرحمن القريشي',
        documentNumber: 'YEM-PERM-8821',
        notes: 'يشمل رمز التتبع الحي للأمان العائلي وضمان السيارة البديلة من منصة سَفَر'
      },
      {
        id: 'doc-y3',
        title: 'رخصة القيادة المهنية للكابتن وفحص المركبة',
        type: 'insurance',
        holderName: 'الكابتن أبو بكر القريشي',
        documentNumber: 'DRV-YEM-7712',
        issuingAuthority: 'الإدارة العامة للمرور — رخصة عمومي معتمدة'
      }
    ],
    packingList: [
      { id: 'py-1', name: 'Original National ID / Passport', nameAr: 'أصل البطاقة الشخصية وجواز السفر اليمني', category: 'essentials', isPacked: true, quantity: 1 },
      { id: 'py-2', name: 'Cash in YER / SAR for road stops', nameAr: 'مبلغ نقدي كاش (ريال يمني وسعودي) للمحطات بدون تغطية شبكة', category: 'essentials', isPacked: true, quantity: 1 },
      { id: 'py-3', name: 'High-Capacity Power Bank 20,000mAh', nameAr: 'بنك طاقة عالي السعة 20,000 مللي أمبير لشحن الهواتف على الطريق', category: 'electronics', isPacked: true, quantity: 2 },
      { id: 'py-4', name: 'Offline Map & Downloaded Route', nameAr: 'تحميل مسار الرحلة للاستخدام بدون إنترنت', category: 'electronics', isPacked: true, quantity: 1 },
      { id: 'py-5', name: 'Road First-Aid Kit & Motion Sickness Pills', nameAr: 'حقيبة إسعافات أولية وأدوية دوار الحركة للمنعطفات الجبلية', category: 'medicine', isPacked: true, quantity: 1 },
      { id: 'py-6', name: 'Bottled Mineral Water & Dates Pack', nameAr: 'مياه شرب معبأة كرتون وعبوة تمر طاقة للمسير', category: 'road_safety', isPacked: true, quantity: 1 },
      { id: 'py-7', name: 'Light Cotton Clothes & Sun Hat', nameAr: 'ملابس قطنية مريحة وشال وقبعة شمسية لساحل حضرموت', category: 'clothing', isPacked: false, quantity: 4 }
    ],
    stories: [
      {
        id: 'st-y1',
        date: '2026-09-05',
        title: 'بداية القصة: إشراقة الفجر في شقرة وأمواج بحر العرب الفيروزية',
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
      },
      {
        id: 'st-y2',
        date: '2026-09-07',
        title: 'عظمة البناء الطيني: الوقوف أمام ناطحات سحاب شبام حضرموت',
        governorate: 'حضرموت — شبام',
        location: 'مدينة شبام التاريخية',
        mood: 'ecstatic',
        storyText: 'الوقوف أمام ناطحات السحاب الطينية في شبام حضرموت التي تعانق السماء منذ مئات السنين يبهر العقل. هندسة يمنية عبقرية صمدت أمام الزمن، وأزقة تنبض برائحة التاريخ واللبان وحفاوة أهل حضرموت الكرام.',
        photos: [
          'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 5,
        tags: ['شبام_حضرموت', 'مانهاتن_الصحراء', 'تراث_عالمي', 'اليمن_الجميل'],
        culturalTip: 'أفضل وقت لزيارة شبام هو العصر قبل الغروب لمشاهدة انعكاس الشمس الذهبية على واجهات المباني الطينية الشاهقة.'
      }
    ]
  },
  {
    id: 'trip-yem-2',
    title: 'Sana\'a to Ibb - The Green Highlands Discovery',
    titleAr: 'رحلة اللواء الأخضر والجبال الشاهقة: صنعاء القديمة، نقيل سمارة، وإب الخضراء وجبلة',
    destination: 'محافظة إب، جبلة التاريخية، ووادي بنا',
    origin: 'صنعاء (باب اليمن والستين الجنوبي)',
    country: 'اليمن',
    originGovernorate: 'صنعاء',
    destinationGovernorate: 'إب',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-15',
    endDate: '2026-09-18',
    budget: 180000,
    currency: 'YER',
    travelers: ['أحمد', 'محمد'],
    description: 'رحلة ساحرة عبر قمم الجبال والمدرجات الخضراء من صنعاء مروراً بذمار ونقيل يسلح وسمارة الأسطوري وصولاً إلى عاصمة السياحة الطبيعية إب ومملكة أروى بجبلة.',
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
        locationName: 'نقيل يسلح — محافظة صنعاء',
        isCompleted: false
      },
      {
        id: 'ps-i2',
        nameAr: 'استراحة ذمار المركزية للتزود بالوقود والإفطار',
        nameEn: 'Dhamar Fuel & Rest Stop',
        type: 'fuel',
        estimatedTime: '10:30',
        durationMinutes: 20,
        locationName: 'مدينة ذمار',
        isCompleted: false
      },
      {
        id: 'ps-i3',
        nameAr: 'مطل نقيل سمارة الشاهق (مناظر الضباب والشلالات المنسابة)',
        nameEn: 'Samarah Pass Cloud Viewpoint',
        type: 'scenic',
        estimatedTime: '11:45',
        durationMinutes: 25,
        locationName: 'نقيل سمارة الأخضر — محافظة إب',
        isCompleted: false
      }
    ],
    days: [
      {
        id: 'day-si1',
        dayNumber: 1,
        date: '2026-09-15',
        title: 'Scenic Mountain Drive & Arrival in Ibb City',
        titleAr: 'الانطلاق صباحاً عبر جبال اليمن والمدرجات الخضراء والوصول إلى إب',
        activities: [
          {
            id: 'act-si1',
            dayId: 'day-si1',
            time: '08:00',
            title: 'Departure from Sana\'a South Terminal',
            titleAr: 'الانطلاق من فرع شركة راحة — صنعاء الستين الجنوبي',
            description: 'الركوب في الباص الفاخر VIP المزود بخدمة الواي فاي وشاشات العرض والانطلاق جنوباً.',
            location: 'Sana\'a Terminal, 60th St',
            category: 'transport',
            cost: 15000,
            currency: 'YER',
            isCompleted: false
          },
          {
            id: 'act-si2',
            dayId: 'day-si1',
            time: '12:30',
            title: 'Hotel Check-in in Ibb Green City',
            titleAr: 'تسجيل الوصول في فندق برج إب السياحي',
            description: 'استلام الغرف ذات الإطلالة البانورامية على جبل ربي والمدرجات الزراعية.',
            location: 'Ibb City Center',
            category: 'hotel',
            cost: 25000,
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
    titleAr: 'مغامرة أرخبيل سقطرى الأسطورية: غابات دم الأخوين، محمية دكسم، ولاغون ديتوا الفيروزي',
    destination: 'جزيرة سقطرى (حديبو، محمية دكسم، قلنسية، شاطئ شوعب)',
    origin: 'عدن / المكلا (مطار الريان الدولي)',
    country: 'اليمن',
    originGovernorate: 'أرخبيل سقطرى',
    destinationGovernorate: 'أرخبيل سقطرى',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-10-10',
    endDate: '2026-10-17',
    budget: 1200,
    currency: 'USD',
    travelers: ['أبو بكر', 'فريق سَفَر الاستكشافي'],
    description: 'استكشاف الطبيعة العذراء الفريدة في كوكب الأرض: غابات شجرة دم الأخوين بهضبة دكسم، والشواطئ الفيروزية الرملية البيضاء وكهوف سقطرى الساحرة.',
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
  },
  {
    id: 'trip-yem-4',
    title: 'The Ancient Incense Route: Marib & Sabaean Kingdom',
    titleAr: 'طريق البخور ومهد الحضارات: مأرب، عرش بلقيس، سد مأرب العظيم، وشبوة التاريخية',
    destination: 'مأرب (عرش بلقيس، معبد أوام، سد مأرب التاريخي)',
    origin: 'صنعاء / شبوة ➔ خط العبر ومأرب',
    country: 'اليمن',
    originGovernorate: 'مأرب',
    destinationGovernorate: 'مأرب',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-11-01',
    endDate: '2026-11-04',
    budget: 150000,
    currency: 'YER',
    travelers: ['طارق', 'عبدالله'],
    description: 'رحلة أثرية وحضارية تأخذك إلى مملكة سبأ القديمة، عرش الملكة بلقيس، أعمدة معبد أوام الأسطورية، وسد مأرب العظيم.',
    coordinates: {
      lat: 15.4667,
      lng: 45.3333
    },
    isPlanApproved: true,
    trackingCode: 'YEM-MRB-2026-04',
    plannedStops: [],
    days: [],
    bookings: [],
    expenses: [],
    documents: [],
    packingList: [],
    stories: []
  }
];
