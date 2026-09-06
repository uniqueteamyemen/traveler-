import { TransportOffice } from '../types/travel';

export const INITIAL_TRANSPORT_OFFICES: TransportOffice[] = [
  {
    id: 'office-raha',
    nameAr: 'شركة راحة للنقل البري الدولي والمحلي',
    nameEn: 'Al-Raha International & Domestic Transport',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    taglineAr: 'رواد النقل البري في اليمن منذ 2005 — رفاهية وأمان وانضباط تام في المواعيد',
    taglineEn: 'Leaders in Yemeni transit with VIP coaches and 4x4 private fleet',
    aboutAr: 'تعد شركة راحة من أعرق وأكبر شركات النقل البري في الجمهورية اليمنية، تمتلك أسطولاً متطوراً من باصات مرسيدس بولمان VIP السياحية وسيارات الدفع الرباعي الحديثة، وتغطي رحلات يومية منتظمة بين جميع المحافظات اليمنية ومنفذ الوديعة.',
    primaryGovernorate: 'صنعاء القديمة وأمانة العاصمة',
    phone: '+967 733 900 111',
    whatsapp: '+967733900111',
    email: 'info@rahatransport-ye.com',
    rating: 4.9,
    reviewCount: 420,
    isVerified: true,
    licenseNumber: 'وزارة النقل — ترخيص رقم 104/ن/2024',
    establishedYear: 2005,
    officeCategory: 'large_company',
    subscriptionTier: 'enterprise_large',
    subscriptionStatus: 'active',
    subscriptionStartDate: '2026-01-01',
    subscriptionExpiresAt: '2027-01-01',
    monthlyFeeYER: 120000,
    isVisibleToPublic: true,
    adminNotes: 'شركة كبرى معتمدة بكامل التراخيص والضمانات البنكية للمركبة البديلة.',
    totalBookingsProcessed: 1420,
    features: [
      'أسطول باصات مرسيدس VIP مزودة بخدمة الواي فاي وشواحن هواتف',
      'سائقون محترفون يحملون رخص قيادة عمومي وفحوصات دورية',
      'ضمان سيارة بديلة فوري في كافة المسارات الجبلية والساحلية',
      'استراحات عائلية مخصصة ومحطات معتمدة طوال الطريق',
      'خدمة تتبع الرحلة الحية ومشاركة خط السير مع العائلة'
    ],
    fleetGallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    ],
    fleetVehicles: [
      {
        id: 'v-raha-1',
        model: 'باص مرسيدس بولمان VIP سياحي',
        type: 'large_bus',
        plateNumber: 'أمانة العاصمة 22-1044',
        totalSeats: 45,
        photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        year: 2024,
        amenities: ['تكييف مركزي متطور', 'مقاعد جلدية مريحة قابلة للإمالة', 'شاشات عرض فردية', 'شواحن هواتف USB', 'واي فاي']
      },
      {
        id: 'v-raha-2',
        model: 'تويوتا لاندكروزر V8 صالون VIP (مشاوير خاصة وعائلية)',
        type: 'suv_4x4',
        plateNumber: 'صنعاء 14-8890',
        totalSeats: 6,
        photoUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
        year: 2024,
        amenities: ['دفع رباعي للطرق الوعرة', 'تكييف أمامي وخلفي مستقل', 'ثلاجة مشروبات مدمجة', 'ستائر خصوصية عائلية']
      }
    ],
    branches: [
      {
        id: 'br-sanaa',
        governorate: 'صنعاء القديمة وأمانة العاصمة',
        city: 'صنعاء',
        address: 'شارع الستين الجنوبي — بجوار جسر المصباحي',
        phone: '+967 1 445566',
        whatsapp: '+967733900111',
        workingHours: '24 ساعة طوال أيام الأسبوع'
      },
      {
        id: 'br-aden',
        governorate: 'عدن',
        city: 'الشيخ عثمان',
        address: 'فرزة النقل الدولي — جولة السفينة',
        phone: '+967 2 389900',
        whatsapp: '+967733900112',
        workingHours: 'من 06:00 ص حتى 11:00 م'
      },
      {
        id: 'br-mukalla',
        governorate: 'حضرموت',
        city: 'المكلا',
        address: 'الشارع العام — بجوار فرزة المكلا المركزية',
        phone: '+967 5 312233',
        whatsapp: '+967733900113',
        workingHours: 'من 06:00 ص حتى 10:00 م'
      },
      {
        id: 'br-ibb',
        governorate: 'إب',
        city: 'إب',
        address: 'شارع العدين — أمام مستشفى الثورة',
        phone: '+967 4 405522',
        whatsapp: '+967733900114',
        workingHours: 'من 07:00 ص حتى 09:00 م'
      }
    ]
  },
  {
    id: 'office-rowaishan',
    nameAr: 'شركة الرويشان للنقل والمشاريع',
    nameEn: 'Al-Rowaishan Express Transport',
    logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    taglineAr: 'دقة المواعيد وسرعة التوصيل وراحة المسافر أولويتنا الدائمة',
    taglineEn: 'Fast & comfortable executive express coach routes across Yemen',
    aboutAr: 'شركة متخصصة في توفير رحلات النقل السريع بين العاصمة صنعاء وعدن وتعز وحضرموت، بأسطول من الباصات الحديثة وسيارات الصالون المجهزة بأنظمة التتبع ونظام السلامة الفائق.',
    primaryGovernorate: 'صنعاء القديمة وأمانة العاصمة',
    phone: '+967 777 450 670',
    whatsapp: '+967777450670',
    email: 'contact@rowaishan-ye.com',
    rating: 4.85,
    reviewCount: 310,
    isVerified: true,
    licenseNumber: 'وزارة النقل — ترخيص رقم 88/ن/2023',
    establishedYear: 2010,
    officeCategory: 'large_company',
    subscriptionTier: 'enterprise_large',
    subscriptionStatus: 'active',
    subscriptionStartDate: '2026-02-01',
    subscriptionExpiresAt: '2026-12-31',
    monthlyFeeYER: 120000,
    isVisibleToPublic: true,
    adminNotes: 'سجل تجاري وترخيص ساري المفعول.',
    totalBookingsProcessed: 980,
    features: [
      'رحلات يومية مباشرة ومكيفة بين المحافظات',
      'توفير مقاعد مخصصة للعائلات وكبار السن',
      'خدمة حجز المقاعد مسبقاً إلكترونياً مع اختيار رقم المقعد',
      'توفير وجبات خفيفة ومياه شرب نقية للمسافرين'
    ],
    fleetGallery: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    ],
    fleetVehicles: [
      {
        id: 'v-row-1',
        model: 'باص هيونداي يونيفرس VIP سياحي',
        type: 'large_bus',
        plateNumber: 'صنعاء 18-3321',
        totalSeats: 35,
        photoUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
        year: 2023,
        amenities: ['تكييف تبريد فائق', 'شاشات ترفيه', 'مقاعد واسعة مريحة']
      }
    ],
    branches: [
      {
        id: 'br-row-sanaa',
        governorate: 'صنعاء القديمة وأمانة العاصمة',
        city: 'صنعاء',
        address: 'شارع تعز — جولة 45',
        phone: '+967 1 611222',
        whatsapp: '+967777450670'
      },
      {
        id: 'br-row-aden',
        governorate: 'عدن',
        city: 'المنصورة',
        address: 'شارع التسعين — بجوار فندق القصر',
        phone: '+967 2 355667',
        whatsapp: '+967777450671'
      }
    ]
  },
  {
    id: 'office-buraq',
    nameAr: 'مكتب البراق لنقل العائلات والصالون VIP',
    nameEn: 'Al-Buraq VIP Family Fleet',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    taglineAr: 'المشاوير العائلية الخاصة بسيارات لاندكروزر وستاريا بأعلى درجات الخصوصية والأمان',
    taglineEn: 'Luxury private family 4x4 SUVs and Staria VIP charters across Yemen',
    aboutAr: 'مكتب البراق متخصص حصرياً في تأمين سيارات الدفع الرباعي الفاخرة (تويوتا برادو، لاندكروزر، هيونداي ستاريا VIP) للعائلات والوفود ورجال الأعمال، مع سائقين معتمدين يتمتعون بأعلى درجات الأدب والأمانة والخبرة في الطرق الجبلية والصحراوية.',
    primaryGovernorate: 'عدن',
    phone: '+967 771 889 900',
    whatsapp: '+967771889900',
    email: 'vip@alburaq-travel.com',
    rating: 4.96,
    reviewCount: 280,
    isVerified: true,
    licenseNumber: 'غرفة تجارة عدن — سجل تجاري رقم 4429',
    establishedYear: 2018,
    officeCategory: 'medium_office',
    subscriptionTier: 'growth_medium',
    subscriptionStatus: 'active',
    subscriptionStartDate: '2026-03-01',
    subscriptionExpiresAt: '2026-11-30',
    monthlyFeeYER: 60000,
    isVisibleToPublic: true,
    adminNotes: 'مكتب متوسط متميز في حجوزات الصالونات العائلية الخاصة.',
    totalBookingsProcessed: 640,
    features: [
      'خصوصية تامة للعائلات بنظام الحجز الكامل للسيارة',
      'سائقون خبراء بمعرفة دقيقة بكافة العقبات ونقاط الطرق والممرات الآمنة',
      'سيارات دفع رباعي حديثة مجهزة بأحدث وسائل الراحة وثلاجات حفظ المشروبات',
      'متابعة حية مدار الساعة عبر نظام الأمان العائلي لتطبيق المسافر'
    ],
    fleetGallery: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    ],
    fleetVehicles: [
      {
        id: 'v-bur-1',
        model: 'تويوتا لاندكروزر VXR صالون دفع رباعي',
        type: 'suv_4x4',
        plateNumber: 'عدن 11-9022',
        totalSeats: 6,
        photoUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
        year: 2024,
        amenities: ['مقاعد جلد فاخرة', 'تكييف مركزي', 'شاشات أطفال', 'نظام عزل صوتي متطور']
      },
      {
        id: 'v-bur-2',
        model: 'هيونداي ستاريا لاونج VIP كابتن 7 مقاعد',
        type: 'vip_limousine',
        plateNumber: 'عدن 12-4450',
        totalSeats: 7,
        photoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        year: 2024,
        amenities: ['مقاعد كابتن استرخاء كهربائية', 'إضاءة محيطية هادئة', 'مداخل شحن متعددة']
      }
    ],
    branches: [
      {
        id: 'br-bur-aden',
        governorate: 'عدن',
        city: 'خور مكسر',
        address: 'حي السفارات — أمام منتزه ريمي',
        phone: '+967 2 244550',
        whatsapp: '+967771889900'
      },
      {
        id: 'br-bur-sanaa',
        governorate: 'صنعاء القديمة وأمانة العاصمة',
        city: 'صنعاء',
        address: 'شارع حدة — أمام مركز الكميم',
        phone: '+967 1 411880',
        whatsapp: '+967771889901'
      }
    ]
  },
  {
    id: 'office-najm',
    nameAr: 'شركة النجم الذهبي للنقل الدولي والداخلي',
    nameEn: 'Golden Star International Transit',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    taglineAr: 'شبكة خطوط تربط شرق اليمن بغربه وجنوبه بشماله',
    taglineEn: 'Comprehensive intercity connections covering all Yemeni governorates',
    aboutAr: 'إحدى الشركات الرائدة في تسيير الرحلات المجدولة بين المحافظات والموانئ والمطارات والمنافذ البرية، مع التزام صارم ببروتوكولات السلامة والفحص الدوري لكل مركبة قبل الانطلاق.',
    primaryGovernorate: 'حضرموت',
    phone: '+967 711 223 344',
    whatsapp: '+967711223344',
    email: 'info@najm-transport.com',
    rating: 4.88,
    reviewCount: 390,
    isVerified: true,
    licenseNumber: 'ترخيص نقل دولي رقم 52/م/2023',
    establishedYear: 2012,
    officeCategory: 'large_company',
    subscriptionTier: 'enterprise_large',
    subscriptionStatus: 'active',
    subscriptionStartDate: '2026-01-15',
    subscriptionExpiresAt: '2026-10-15',
    monthlyFeeYER: 120000,
    isVisibleToPublic: true,
    adminNotes: 'تم سداد الاشتراك السنوي بالكامل.',
    totalBookingsProcessed: 870,
    features: [
      'تسيير رحلات يومية إلى سيئون وشبام والمكلا والمهرة ومأرب',
      'خدمة شحن الطرود والأمانات السريعة مع ضمان الوصول',
      'صالات انتظار مكيفة ومجهزة للمسافرين في كافة الفروع الرئيسية'
    ],
    fleetGallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    ],
    fleetVehicles: [
      {
        id: 'v-najm-1',
        model: 'باص مرسيدس ترافيكو VIP 45 مقعد',
        type: 'large_bus',
        plateNumber: 'حضرموت 11-7890',
        totalSeats: 45,
        photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        year: 2024,
        amenities: ['واي فاي', 'شواحن هواتف', 'مقاعد قابلة للتعديل']
      }
    ],
    branches: [
      {
        id: 'br-najm-mukalla',
        governorate: 'حضرموت',
        city: 'المكلا',
        address: 'جولة الدلة — الشارع العام',
        phone: '+967 5 321100',
        whatsapp: '+967711223344'
      },
      {
        id: 'br-najm-seiyun',
        governorate: 'حضرموت',
        city: 'سيئون',
        address: 'أمام قصر الكثيري — شارع المطار',
        phone: '+967 5 402233',
        whatsapp: '+967711223345'
      }
    ]
  },
  {
    id: 'office-saqr',
    nameAr: 'مكتب الصقر السريع لسيارات الدفع الرباعي 4x4',
    nameEn: 'Al-Saqr 4x4 Fast Fleet',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    taglineAr: 'خبراء المسارات الجبلية والصحراوية — أسرع وأأمن وصول بين مدن اليمن',
    taglineEn: 'Mountain and desert passes specialized 4x4 express service',
    aboutAr: 'مكتب متخصص في سيارات الصالون والدفع الرباعي السريعة، يخدم المسارات الوعرة والجبلية الصعبة بين عدن، تعز، إب، مأرب، شبوة، والمهرة، مع سائقين مدربين وأصحاب كفاءة عالية في التعامل مع مختلف ظروف الطرق.',
    primaryGovernorate: 'مأرب',
    phone: '+967 770 112 233',
    whatsapp: '+967770112233',
    email: 'saqr4x4@gmail.com',
    rating: 4.92,
    reviewCount: 230,
    isVerified: true,
    licenseNumber: 'سجل تجاري رقم 8901',
    establishedYear: 2019,
    officeCategory: 'medium_office',
    subscriptionTier: 'growth_medium',
    subscriptionStatus: 'active',
    subscriptionStartDate: '2026-03-15',
    subscriptionExpiresAt: '2026-12-15',
    monthlyFeeYER: 60000,
    isVisibleToPublic: true,
    adminNotes: 'مكتب متوسط متميز بخط مأرب / شبوة / عدن.',
    totalBookingsProcessed: 430,
    features: [
      'أسطول لاندكروزر برادو وجي إكس آر حديث',
      'رحلات يومية سريعة وخيارات الحجز بالنفر أو المشوار الكامل',
      'مرونة في مواعيد الانطلاق وتوصيل من الباب إلى الباب'
    ],
    fleetGallery: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
    ],
    fleetVehicles: [
      {
        id: 'v-saqr-1',
        model: 'تويوتا لاندكروزر GXR دفع رباعي',
        type: 'suv_4x4',
        plateNumber: 'مأرب 15-6601',
        totalSeats: 5,
        photoUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
        year: 2023,
        amenities: ['تكييف تبريد قوي', 'دفع رباعي مستمر', 'مساحة حقائب واسعة']
      }
    ],
    branches: [
      {
        id: 'br-saqr-marib',
        governorate: 'مأرب',
        city: 'مأرب',
        address: 'الشارع العام — بالقرب من جولة السد',
        phone: '+967 6 301122',
        whatsapp: '+967770112233'
      }
    ]
  },
  {
    id: 'office-taiz-express',
    nameAr: 'وكالة تعز والحوبان لنقل الركاب السريع',
    nameEn: 'Taiz & Al-Hawban Local Express Agency',
    logo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    taglineAr: 'مكتب فرزة محلي لتنسيق رحلات صوالين وباصات هايس بين تعز ولحج وعدن وإب',
    taglineEn: 'Local inter-district agency for Taiz, Lahj, and Aden van & SUV transit',
    aboutAr: 'وكالة نقل محلية متوسطة وصغيرة تخدم حركة الركاب اليومية والتجارية عبر طريق هيجة العبد والمنافذ البديلة، مع نخبة من كباتن الصوالين المحليين أصحاب الخبرة في المنعطفات الجبلية.',
    primaryGovernorate: 'تعز',
    phone: '+967 734 550 880',
    whatsapp: '+967734550880',
    email: 'taizexpress@transport.ye',
    rating: 4.82,
    reviewCount: 150,
    isVerified: true,
    licenseNumber: 'ترخيص فرزة تعز رقم 112/ت',
    establishedYear: 2021,
    officeCategory: 'small_local_agency',
    subscriptionTier: 'starter_small',
    subscriptionStatus: 'active',
    subscriptionStartDate: '2026-04-01',
    subscriptionExpiresAt: '2026-10-01',
    monthlyFeeYER: 25000,
    isVisibleToPublic: true,
    adminNotes: 'باقة المكاتب الصغيرة مفعلة ومنتظمة بالسداد.',
    totalBookingsProcessed: 280,
    features: [
      'انطلاق متكرر كل ساعتين',
      'أسعار مناسبة تنافسية',
      'تنسيق مباشر مع كباتن الصوالين المحليين'
    ],
    fleetGallery: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'
    ],
    fleetVehicles: [
      {
        id: 'v-taiz-1',
        model: 'تويوتا هايس سوبر جي إل ميكروباص 14 راكب',
        type: 'microbus',
        plateNumber: 'تعز 12-4099',
        totalSeats: 14,
        photoUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
        year: 2022,
        amenities: ['تكييف', 'ستائر شمسية', 'حمولة حقائب على السقف']
      }
    ],
    branches: [
      {
        id: 'br-taiz-center',
        governorate: 'تعز',
        city: 'الحوبان',
        address: 'جولة الحوبان — أمام البريد القديم',
        phone: '+967 4 212000',
        whatsapp: '+967734550880'
      }
    ]
  },
  {
    id: 'office-dhabab-agency',
    nameAr: 'مكتب الضباب لنقل الصوالين (نموذج محجوب)',
    nameEn: 'Al-Dhabab Local Transit (Suspended Demo)',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    taglineAr: 'مكتب محلي — محجوب إدارياً لعدم تجديد الاشتراك الشهري',
    taglineEn: 'Suspended by admin due to expired subscription plan',
    aboutAr: 'تم حجب هذا المكتب والأسطول التابع له تلقائياً من السوق العام لانتهاء فترة الاشتراك وعدم سداد الرسوم الشهرية، ويمكن للآدمن إعادة التفعيل في أي وقت.',
    primaryGovernorate: 'إب',
    phone: '+967 775 000 999',
    whatsapp: '+967775000999',
    email: 'dhabab@transport.ye',
    rating: 4.5,
    reviewCount: 45,
    isVerified: false,
    licenseNumber: 'منتهي الصلاحية',
    establishedYear: 2020,
    officeCategory: 'small_local_agency',
    subscriptionTier: 'starter_small',
    subscriptionStatus: 'inactive',
    subscriptionStartDate: '2026-01-01',
    subscriptionExpiresAt: '2026-08-15',
    monthlyFeeYER: 25000,
    isVisibleToPublic: false,
    adminBlockReason: 'محجوب إدارياً لانتهاء صلاحية الاشتراك الشهري وعدم التجديد. يرجى التواصل مع إدارة المسافر للسداد.',
    adminNotes: 'تم إيقاف الظهور في 2026-08-16 تلقائياً.',
    totalBookingsProcessed: 95,
    features: [
      'خدمة خط إب — تعز — عدن',
      'حجز صوالين دفع رباعي'
    ],
    fleetGallery: [],
    fleetVehicles: [
      {
        id: 'v-dhabab-1',
        model: 'تويوتا برادو 2020',
        type: 'suv_4x4',
        plateNumber: 'إب 11-3344',
        totalSeats: 6,
        photoUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
        year: 2020,
        amenities: ['تكييف']
      }
    ],
    branches: [
      {
        id: 'br-dhabab-1',
        governorate: 'إب',
        city: 'الضباب',
        address: 'شارع تعز القديم',
        phone: '+967 4 411000',
        whatsapp: '+967775000999'
      }
    ]
  }
];
