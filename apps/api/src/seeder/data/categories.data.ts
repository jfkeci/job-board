export interface CategorySeedData {
  slug: string;
  translations: Record<string, string>;
  children?: CategorySeedData[];
}

export const categoriesData: CategorySeedData[] = [
  {
    slug: 'technology',
    translations: {
      en: 'Technology',
      hr: 'Tehnologija',
      sl: 'Tehnologija',
      sr: 'Tehnologija',
    },
    children: [
      {
        slug: 'software-development',
        translations: {
          en: 'Software Development',
          hr: 'Razvoj softvera',
          sl: 'Razvoj programske opreme',
          sr: 'Razvoj softvera',
        },
      },
      {
        slug: 'data-science',
        translations: {
          en: 'Data Science',
          hr: 'Znanost o podacima',
          sl: 'Podatkovna znanost',
          sr: 'Nauka o podacima',
        },
      },
      {
        slug: 'devops',
        translations: {
          en: 'DevOps & Infrastructure',
          hr: 'DevOps i infrastruktura',
          sl: 'DevOps in infrastruktura',
          sr: 'DevOps i infrastruktura',
        },
      },
      {
        slug: 'cybersecurity',
        translations: {
          en: 'Cybersecurity',
          hr: 'Kibernetička sigurnost',
          sl: 'Kibernetska varnost',
          sr: 'Sajber bezbednost',
        },
      },
    ],
  },
  {
    slug: 'finance',
    translations: {
      en: 'Finance & Accounting',
      hr: 'Financije i računovodstvo',
      sl: 'Finance in računovodstvo',
      sr: 'Finansije i računovodstvo',
    },
    children: [
      {
        slug: 'accounting',
        translations: {
          en: 'Accounting',
          hr: 'Računovodstvo',
          sl: 'Računovodstvo',
          sr: 'Računovodstvo',
        },
      },
      {
        slug: 'banking',
        translations: {
          en: 'Banking',
          hr: 'Bankarstvo',
          sl: 'Bančništvo',
          sr: 'Bankarstvo',
        },
      },
      {
        slug: 'financial-analysis',
        translations: {
          en: 'Financial Analysis',
          hr: 'Financijska analiza',
          sl: 'Finančna analiza',
          sr: 'Finansijska analiza',
        },
      },
    ],
  },
  {
    slug: 'healthcare',
    translations: {
      en: 'Healthcare',
      hr: 'Zdravstvo',
      sl: 'Zdravstvo',
      sr: 'Zdravstvo',
    },
    children: [
      {
        slug: 'nursing',
        translations: {
          en: 'Nursing',
          hr: 'Sestrinstvo',
          sl: 'Zdravstvena nega',
          sr: 'Sestrinstvo',
        },
      },
      {
        slug: 'medical-practice',
        translations: {
          en: 'Medical Practice',
          hr: 'Medicinska praksa',
          sl: 'Medicinska praksa',
          sr: 'Medicinska praksa',
        },
      },
      {
        slug: 'pharmacy',
        translations: {
          en: 'Pharmacy',
          hr: 'Farmacija',
          sl: 'Farmacija',
          sr: 'Farmacija',
        },
      },
    ],
  },
  {
    slug: 'sales',
    translations: {
      en: 'Sales',
      hr: 'Prodaja',
      sl: 'Prodaja',
      sr: 'Prodaja',
    },
    children: [
      {
        slug: 'retail-sales',
        translations: {
          en: 'Retail Sales',
          hr: 'Maloprodaja',
          sl: 'Maloprodaja',
          sr: 'Maloprodaja',
        },
      },
      {
        slug: 'b2b-sales',
        translations: {
          en: 'B2B Sales',
          hr: 'B2B prodaja',
          sl: 'B2B prodaja',
          sr: 'B2B prodaja',
        },
      },
      {
        slug: 'account-management',
        translations: {
          en: 'Account Management',
          hr: 'Upravljanje klijentima',
          sl: 'Upravljanje strank',
          sr: 'Upravljanje klijentima',
        },
      },
    ],
  },
  {
    slug: 'marketing',
    translations: {
      en: 'Marketing',
      hr: 'Marketing',
      sl: 'Marketing',
      sr: 'Marketing',
    },
    children: [
      {
        slug: 'digital-marketing',
        translations: {
          en: 'Digital Marketing',
          hr: 'Digitalni marketing',
          sl: 'Digitalni marketing',
          sr: 'Digitalni marketing',
        },
      },
      {
        slug: 'content-marketing',
        translations: {
          en: 'Content Marketing',
          hr: 'Marketing sadržaja',
          sl: 'Vsebinski marketing',
          sr: 'Marketing sadržaja',
        },
      },
      {
        slug: 'brand-management',
        translations: {
          en: 'Brand Management',
          hr: 'Upravljanje brendom',
          sl: 'Upravljanje blagovne znamke',
          sr: 'Upravljanje brendom',
        },
      },
    ],
  },
  {
    slug: 'human-resources',
    translations: {
      en: 'Human Resources',
      hr: 'Ljudski resursi',
      sl: 'Človeški viri',
      sr: 'Ljudski resursi',
    },
    children: [
      {
        slug: 'recruitment',
        translations: {
          en: 'Recruitment',
          hr: 'Zapošljavanje',
          sl: 'Zaposlovanje',
          sr: 'Zapošljavanje',
        },
      },
      {
        slug: 'training-development',
        translations: {
          en: 'Training & Development',
          hr: 'Obuka i razvoj',
          sl: 'Usposabljanje in razvoj',
          sr: 'Obuka i razvoj',
        },
      },
    ],
  },
  {
    slug: 'legal',
    translations: {
      en: 'Legal',
      hr: 'Pravo',
      sl: 'Pravo',
      sr: 'Pravo',
    },
    children: [
      {
        slug: 'corporate-law',
        translations: {
          en: 'Corporate Law',
          hr: 'Korporativno pravo',
          sl: 'Korporativno pravo',
          sr: 'Korporativno pravo',
        },
      },
      {
        slug: 'compliance',
        translations: {
          en: 'Compliance',
          hr: 'Usklađenost',
          sl: 'Skladnost',
          sr: 'Usklađenost',
        },
      },
    ],
  },
  {
    slug: 'engineering',
    translations: {
      en: 'Engineering',
      hr: 'Inženjerstvo',
      sl: 'Inženirstvo',
      sr: 'Inženjerstvo',
    },
    children: [
      {
        slug: 'mechanical-engineering',
        translations: {
          en: 'Mechanical Engineering',
          hr: 'Strojarstvo',
          sl: 'Strojništvo',
          sr: 'Mašinstvo',
        },
      },
      {
        slug: 'electrical-engineering',
        translations: {
          en: 'Electrical Engineering',
          hr: 'Elektrotehnika',
          sl: 'Elektrotehnika',
          sr: 'Elektrotehnika',
        },
      },
      {
        slug: 'civil-engineering',
        translations: {
          en: 'Civil Engineering',
          hr: 'Građevinarstvo',
          sl: 'Gradbeništvo',
          sr: 'Građevinarstvo',
        },
      },
    ],
  },
  {
    slug: 'design',
    translations: {
      en: 'Design',
      hr: 'Dizajn',
      sl: 'Oblikovanje',
      sr: 'Dizajn',
    },
    children: [
      {
        slug: 'graphic-design',
        translations: {
          en: 'Graphic Design',
          hr: 'Grafički dizajn',
          sl: 'Grafično oblikovanje',
          sr: 'Grafički dizajn',
        },
      },
      {
        slug: 'ux-ui-design',
        translations: {
          en: 'UX/UI Design',
          hr: 'UX/UI dizajn',
          sl: 'UX/UI oblikovanje',
          sr: 'UX/UI dizajn',
        },
      },
      {
        slug: 'product-design',
        translations: {
          en: 'Product Design',
          hr: 'Dizajn proizvoda',
          sl: 'Oblikovanje izdelkov',
          sr: 'Dizajn proizvoda',
        },
      },
    ],
  },
  {
    slug: 'operations',
    translations: {
      en: 'Operations',
      hr: 'Operacije',
      sl: 'Operacije',
      sr: 'Operacije',
    },
    children: [
      {
        slug: 'logistics',
        translations: {
          en: 'Logistics',
          hr: 'Logistika',
          sl: 'Logistika',
          sr: 'Logistika',
        },
      },
      {
        slug: 'supply-chain',
        translations: {
          en: 'Supply Chain',
          hr: 'Opskrbni lanac',
          sl: 'Dobavna veriga',
          sr: 'Lanac snabdevanja',
        },
      },
      {
        slug: 'project-management',
        translations: {
          en: 'Project Management',
          hr: 'Upravljanje projektima',
          sl: 'Vodenje projektov',
          sr: 'Upravljanje projektima',
        },
      },
    ],
  },
  {
    slug: 'customer-service',
    translations: {
      en: 'Customer Service',
      hr: 'Korisnička podrška',
      sl: 'Podpora strankam',
      sr: 'Korisnička podrška',
    },
    children: [
      {
        slug: 'call-center',
        translations: {
          en: 'Call Center',
          hr: 'Pozivni centar',
          sl: 'Klicni center',
          sr: 'Pozivni centar',
        },
      },
      {
        slug: 'technical-support',
        translations: {
          en: 'Technical Support',
          hr: 'Tehnička podrška',
          sl: 'Tehnična podpora',
          sr: 'Tehnička podrška',
        },
      },
    ],
  },
  {
    slug: 'education',
    translations: {
      en: 'Education',
      hr: 'Obrazovanje',
      sl: 'Izobraževanje',
      sr: 'Obrazovanje',
    },
    children: [
      {
        slug: 'teaching',
        translations: {
          en: 'Teaching',
          hr: 'Nastava',
          sl: 'Poučevanje',
          sr: 'Nastava',
        },
      },
      {
        slug: 'training',
        translations: {
          en: 'Corporate Training',
          hr: 'Korporativna obuka',
          sl: 'Korporativno usposabljanje',
          sr: 'Korporativna obuka',
        },
      },
    ],
  },
];
