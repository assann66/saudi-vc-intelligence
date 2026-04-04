export interface TemplateData {
  name: string;
  arabicName: string;
  category: string;
  layout: string;
  content: {
    title: string;
    subtitle: string;
    body: string;
    bullets: string[];
    footer: string;
  };
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: { heading: string; body: string };
  dimensions: string;
  isRTL: boolean;
}

export const templateSeeds: TemplateData[] = [
  {
    name: "AI Weekly Insight",
    arabicName: "نمط الذكاء الاصطناعي الأسبوعي",
    category: "ai-insight",
    layout: "standard",
    content: {
      title: "رؤية الذكاء الاصطناعي الأسبوعية",
      subtitle: "Weekly AI Intelligence Briefing",
      body: "تحليل أسبوعي لأحدث تطورات الذكاء الاصطناعي في المنطقة وتأثيرها على الاستثمار الجريء السعودي",
      bullets: [
        "أبرز صفقات الأسبوع في قطاع AI",
        "تحليل اتجاهات السوق",
        "فرص الاستثمار الناشئة",
        "توقعات الأسبوع القادم",
      ],
      footer: "Saudi VC Intelligence | تحليلات أسبوعية",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#2ECC71", accent: "#F39C12", background: "#0A1628", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
  {
    name: "Digital Transformation Guide",
    arabicName: "دليل التحول الرقمي",
    category: "transformation",
    layout: "split",
    content: {
      title: "دليل التحول الرقمي",
      subtitle: "Digital Transformation Roadmap",
      body: "خارطة طريق شاملة للتحول الرقمي في المملكة العربية السعودية مع أمثلة عملية ونتائج قابلة للقياس",
      bullets: [
        "مراحل التحول الرقمي الأربع",
        "أدوات وتقنيات أساسية",
        "دراسات حالة سعودية ناجحة",
        "مؤشرات الأداء الرئيسية",
      ],
      footer: "رؤية 2030 | التحول الرقمي",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#3498DB", accent: "#E74C3C", background: "#0D1B2A", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
  {
    name: "Integration Vision",
    arabicName: "رؤية التكامل",
    category: "vision",
    layout: "centered",
    content: {
      title: "رؤية التكامل التقني",
      subtitle: "Technology Integration Vision",
      body: "كيف تتكامل التقنيات الناشئة لتشكيل مستقبل الاقتصاد السعودي في إطار رؤية 2030",
      bullets: [
        "تكامل AI مع البنية التحتية",
        "الحوسبة السحابية والأمان",
        "البلوكتشين والتمويل اللامركزي",
        "إنترنت الأشياء الصناعي",
      ],
      footer: "رؤية 2030 | تكامل تقني",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#2ECC71", accent: "#9B59B6", background: "#0A0F1C", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
  {
    name: "Sector Analysis",
    arabicName: "تحليل القطاع",
    category: "sector",
    layout: "standard",
    content: {
      title: "تحليل القطاع الاستثماري",
      subtitle: "Investment Sector Deep Dive",
      body: "تحليل معمق لقطاع استثماري محدد يشمل حجم السوق والمنافسة والفرص والمخاطر",
      bullets: [
        "حجم السوق والنمو السنوي",
        "أبرز اللاعبين والحصص السوقية",
        "فجوات السوق وفرص الدخول",
        "توصيات الاستثمار",
      ],
      footer: "Saudi VC Intelligence | تحليل قطاعي",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#2ECC71", accent: "#F39C12", background: "#0A1628", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
  {
    name: "Company Spotlight",
    arabicName: "شركة تحت المجهر",
    category: "company",
    layout: "split",
    content: {
      title: "شركة تحت المجهر",
      subtitle: "Company Spotlight",
      body: "نظرة تفصيلية على شركة سعودية ناشئة: نموذج العمل، التمويل، الفريق، والإمكانيات المستقبلية",
      bullets: [
        "نموذج العمل والإيرادات",
        "تاريخ التمويل والمستثمرين",
        "الميزة التنافسية",
        "التوقعات والتوصية",
      ],
      footer: "Saudi VC Intelligence | تحليل شركات",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#06B6D4", accent: "#F39C12", background: "#0A1628", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
  {
    name: "Funding Round",
    arabicName: "جولة تمويلية",
    category: "funding",
    layout: "centered",
    content: {
      title: "جولة تمويلية جديدة",
      subtitle: "New Funding Round",
      body: "تغطية حصرية لأحدث جولة تمويلية في المنظومة السعودية: الأرقام والمستثمرين والأهداف",
      bullets: [
        "حجم الجولة والتقييم",
        "المستثمرون الرئيسيون",
        "خطط التوسع والنمو",
        "التأثير على القطاع",
      ],
      footer: "Saudi VC Intelligence | أخبار التمويل",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#2ECC71", accent: "#E74C3C", background: "#0D1117", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
  {
    name: "Market Comparison",
    arabicName: "مقارنة السوق",
    category: "comparison",
    layout: "split",
    content: {
      title: "مقارنة الأسواق",
      subtitle: "Market Comparison Analysis",
      body: "مقارنة تفصيلية بين قطاعات أو أسواق استثمارية مختلفة مع مؤشرات أداء واضحة",
      bullets: [
        "مقارنة حجم السوق",
        "معدلات النمو والعائد",
        "مستوى المخاطر",
        "التوصية الاستثمارية",
      ],
      footer: "Saudi VC Intelligence | مقارنات",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#8B5CF6", accent: "#F59E0B", background: "#0A1628", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
  {
    name: "Investment Thesis",
    arabicName: "أطروحة الاستثمار",
    category: "thesis",
    layout: "standard",
    content: {
      title: "أطروحة استثمارية",
      subtitle: "Investment Thesis",
      body: "أطروحة استثمارية متكاملة تشمل الفرصة السوقية والميزة التنافسية وآليات الخروج المتوقعة",
      bullets: [
        "الفرصة السوقية",
        "الميزة التنافسية المستدامة",
        "نموذج العوائد المتوقعة",
        "سيناريوهات الخروج",
      ],
      footer: "Saudi VC Intelligence | أطروحات استثمارية",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#10B981", accent: "#F39C12", background: "#0A1628", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
  {
    name: "Risk Assessment",
    arabicName: "تقييم المخاطر",
    category: "risk",
    layout: "standard",
    content: {
      title: "تقييم المخاطر الاستثمارية",
      subtitle: "Investment Risk Assessment",
      body: "تقييم شامل للمخاطر المرتبطة بالاستثمار في القطاعات والشركات السعودية الناشئة",
      bullets: [
        "مخاطر السوق والتنظيم",
        "مخاطر التنفيذ والفريق",
        "مخاطر التقنية والمنافسة",
        "استراتيجيات التخفيف",
      ],
      footer: "Saudi VC Intelligence | إدارة المخاطر",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#EF4444", accent: "#F59E0B", background: "#0A1628", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
  {
    name: "Vision 2030 Alignment",
    arabicName: "توافق رؤية 2030",
    category: "v2030",
    layout: "centered",
    content: {
      title: "التوافق مع رؤية 2030",
      subtitle: "Vision 2030 Alignment Score",
      body: "كيف تتوافق الشركات والقطاعات مع أهداف رؤية المملكة 2030 وبرامج التحول الوطني",
      bullets: [
        "درجة التوافق مع الرؤية",
        "البرامج الحكومية الداعمة",
        "الفرص من المشاريع الكبرى",
        "مسار النمو المتوقع",
      ],
      footer: "رؤية 2030 | تحليل التوافق",
    },
    colorScheme: { primary: "#1E3A5F", secondary: "#2ECC71", accent: "#F39C12", background: "#071320", text: "#FFFFFF" },
    fonts: { heading: "Cairo Bold", body: "Tajawal" },
    dimensions: "1080x1350",
    isRTL: true,
  },
];
