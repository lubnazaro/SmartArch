import type { Locale } from "./constants";

export type Dictionary = {
  brand: string;
  tagline: string;
  nav: {
    home: string;
    smartHome: string;
    interior: string;
    about: string;
    contact: string;
    faq: string;
    projects: string;
  };
  home: {
    ctaSmart: string;
    ctaInterior: string;
    featured: string;
    featuredEmpty: string;
    explore: string;
    aboutTitle: string;
    aboutCta: string;
    contactTitle: string;
    contactCta: string;
  };
  projects: {
    titleSmart: string;
    titleInterior: string;
    subtitleSmart: string;
    subtitleInterior: string;
    empty: string;
    viewProject: string;
    back: string;
    gallery: string;
  };
  about: {
    title: string;
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    instagram: string;
    address: string;
    message: string;
  };
  faq: {
    title: string;
    subtitle: string;
    empty: string;
  };
  footer: {
    rights: string;
    designTech: string;
  };
  common: {
    loading: string;
    language: string;
  };
};

const en: Dictionary = {
  brand: "Smart Arch",
  tagline: "Design meets technology",
  nav: {
    home: "Home",
    smartHome: "Smart Home",
    interior: "Interior Design",
    about: "About",
    contact: "Contact",
    faq: "FAQ",
    projects: "Projects",
  },
  home: {
    ctaSmart: "Smart Home",
    ctaInterior: "Interior Design",
    featured: "Selected work",
    featuredEmpty: "Projects will appear here once published.",
    explore: "Explore project",
    aboutTitle: "About Smart Arch",
    aboutCta: "Our story",
    contactTitle: "Let's talk",
    contactCta: "Get in touch",
  },
  projects: {
    titleSmart: "Smart Home",
    titleInterior: "Interior Design",
    subtitleSmart:
      "Living spaces where lighting, climate, curtains, and security become one seamless system.",
    subtitleInterior:
      "Thoughtful interiors shaped around comfort, materials, and the people who live in them.",
    empty: "No projects published in this section yet.",
    viewProject: "View project",
    back: "Back to projects",
    gallery: "Gallery",
  },
  about: {
    title: "About Us",
  },
  contact: {
    title: "Contact",
    subtitle: "Bethlehem / Jerusalem — reach us anytime.",
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    instagram: "Instagram",
    address: "Address",
    message: "Send a WhatsApp message",
  },
  faq: {
    title: "Questions & Answers",
    subtitle: "Clear answers about how we work.",
    empty: "FAQ entries will appear here soon.",
  },
  footer: {
    rights: "All rights reserved.",
    designTech: "Design meets technology",
  },
  common: {
    loading: "Loading…",
    language: "Language",
  },
};

const ar: Dictionary = {
  brand: "سمارت آرتش",
  tagline: "التصميم يلتقي بالتكنولوجيا",
  nav: {
    home: "الرئيسية",
    smartHome: "المنزل الذكي",
    interior: "التصميم الداخلي",
    about: "من نحن",
    contact: "تواصل",
    faq: "أسئلة",
    projects: "المشاريع",
  },
  home: {
    ctaSmart: "المنزل الذكي",
    ctaInterior: "التصميم الداخلي",
    featured: "أعمال مختارة",
    featuredEmpty: "ستظهر المشاريع هنا بعد نشرها.",
    explore: "استكشف المشروع",
    aboutTitle: "عن سمارت آرتش",
    aboutCta: "قصتنا",
    contactTitle: "لنتحدث",
    contactCta: "تواصل معنا",
  },
  projects: {
    titleSmart: "المنزل الذكي",
    titleInterior: "التصميم الداخلي",
    subtitleSmart:
      "مساحات معيشة تصبح فيها الإضاءة والمناخ والستائر والأمان نظاماً واحداً سلساً.",
    subtitleInterior:
      "تصميمات داخلية مدروسة حول الراحة والمواد والأشخاص الذين يعيشون فيها.",
    empty: "لا توجد مشاريع منشورة في هذا القسم بعد.",
    viewProject: "عرض المشروع",
    back: "العودة إلى المشاريع",
    gallery: "المعرض",
  },
  about: {
    title: "من نحن",
  },
  contact: {
    title: "تواصل",
    subtitle: "بيت لحم / القدس — تواصل معنا في أي وقت.",
    phone: "هاتف",
    whatsapp: "واتساب",
    email: "بريد",
    instagram: "إنستغرام",
    address: "العنوان",
    message: "راسلنا عبر واتساب",
  },
  faq: {
    title: "أسئلة وأجوبة",
    subtitle: "إجابات واضحة عن طريقة عملنا.",
    empty: "ستظهر الأسئلة الشائعة هنا قريباً.",
  },
  footer: {
    rights: "جميع الحقوق محفوظة.",
    designTech: "التصميم يلتقي بالتكنولوجيا",
  },
  common: {
    loading: "جاري التحميل…",
    language: "اللغة",
  },
};

const he: Dictionary = {
  brand: "סמארט ארץ'",
  tagline: "עיצוב פוגש טכנולוגיה",
  nav: {
    home: "בית",
    smartHome: "בית חכם",
    interior: "עיצוב פנים",
    about: "עלינו",
    contact: "יצירת קשר",
    faq: "שאלות",
    projects: "פרויקטים",
  },
  home: {
    ctaSmart: "בית חכם",
    ctaInterior: "עיצוב פנים",
    featured: "עבודות נבחרות",
    featuredEmpty: "פרויקטים יופיעו כאן לאחר הפרסום.",
    explore: "לצפייה בפרויקט",
    aboutTitle: "על Smart Arch",
    aboutCta: "הסיפור שלנו",
    contactTitle: "בואו נדבר",
    contactCta: "צרו קשר",
  },
  projects: {
    titleSmart: "בית חכם",
    titleInterior: "עיצוב פנים",
    subtitleSmart:
      "חללי מגורים שבהם תאורה, אקלים, וילונות ואבטחה הופכים למערכת אחת חלקה.",
    subtitleInterior:
      "עיצובי פנים שנבנים סביב נוחות, חומרים והאנשים שחיים בהם.",
    empty: "עדיין אין פרויקטים מפורסמים בסעיף זה.",
    viewProject: "לצפייה בפרויקט",
    back: "חזרה לפרויקטים",
    gallery: "גלריה",
  },
  about: {
    title: "עלינו",
  },
  contact: {
    title: "יצירת קשר",
    subtitle: "בית לחם / ירושלים — אנחנו כאן.",
    phone: "טלפון",
    whatsapp: "וואטסאפ",
    email: "אימייל",
    instagram: "אינסטגרם",
    address: "כתובת",
    message: "שלחו הודעת וואטסאפ",
  },
  faq: {
    title: "שאלות ותשובות",
    subtitle: "תשובות ברורות על איך אנחנו עובדים.",
    empty: "שאלות נפוצות יופיעו כאן בקרוב.",
  },
  footer: {
    rights: "כל הזכויות שמורות.",
    designTech: "עיצוב פוגש טכנולוגיה",
  },
  common: {
    loading: "טוען…",
    language: "שפה",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, ar, he };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
