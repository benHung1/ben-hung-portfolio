import type { Locale } from './messages';
export type Category = 'websites' | 'applications' | 'architecture';
export interface ProjectCopy {
  title: string;
  company: string;
  role: string;
  summary: string;
  background: string;
  audience?: string;
  contributions: string[];
  collaboration?: string;
  implementation?: { title: string; description: string }[];
  outcomes?: string[];
}
export interface ProjectRecord {
  slug: string;
  order: number;
  categories: Category[];
  selected?: boolean;
  period?: string;
  stack: string[];
  deployment: 'live' | 'unknown';
  requiresLogin: boolean;
  liveUrl?: string;
  cover?: {
    src: string;
    fit?: 'cover' | 'contain';
    position: string;
    background: string;
  };
  content: Record<Locale, ProjectCopy>;
}
export type Project = Omit<ProjectRecord, 'content'> & ProjectCopy;
export const categoryIds: Category[] = [
  'websites',
  'applications',
  'architecture',
];
const company = { zh: '1111 人力銀行', en: '1111 Job Bank' };
// One explicit editorial order for lists, selections, filters and adjacent cases.
export const projectRecords: ProjectRecord[] = [
  {
    slug: 'events-management',
    order: 10,
    categories: ['applications', 'architecture'],
    selected: true,
    stack: ['Vue 3', 'Naive UI', 'TypeScript'],
    deployment: 'live',
    requiresLogin: true,
    liveUrl: 'https://events-manage.1111.com.tw/',
    cover: {
      src: '/covers/events-management.jpg',
      position: '50% 50%',
      background: '#3155ad',
    },
    content: {
      zh: {
        title: '活動新後台',
        company: company.zh,
        role: '後台前端開發與重構',
        summary:
          '以 Vue 3 與 Naive UI 參與活動管理後台重構，讓管理流程落實在清楚的操作介面。',
        background:
          '1111 活動管理系統的正式後台，提供需要身分驗證的管理入口。我參與既有管理端的前端介面重構。',
        audience: '負責活動管理的內部人員與廠商。',
        contributions: [
          '使用 Vue 3 與 Naive UI 參與後台前端實作。',
          '針對既有活動管理介面進行重構，配合專案協作完成整合。',
        ],
      },
      en: {
        title: 'Event Management Console',
        company: company.en,
        role: 'Admin frontend development & refactoring',
        summary:
          'Contributed to a Vue 3 and Naive UI refactor of an event-management console, translating management workflows into clear interfaces.',
        background:
          'The production admin system for 1111 campaigns provides authenticated access for its users. My work focused on refactoring its existing frontend interfaces.',
        audience: 'Internal staff and business partners managing campaigns.',
        contributions: [
          'Implemented admin interfaces with Vue 3 and Naive UI.',
          'Contributed to the interface refactor and coordinated integration with the project team.',
        ],
      },
    },
  },
  {
    slug: 'curated-jobs',
    order: 20,
    categories: ['websites'],
    stack: ['Vue', 'TypeScript'],
    deployment: 'live',
    requiresLogin: false,
    liveUrl: 'https://insight.1111.com.tw/corp/50650906/',
    cover: {
      src: '/covers/curated-jobs.jpg',
      fit: 'contain',
      position: '50% 50%',
      background: '#21463b',
    },
    content: {
      zh: {
        title: '嚴選職缺',
        company: company.zh,
        role: '前端開發',
        summary:
          '參與嚴選職缺網站前端實作，呈現企業介紹與徵才資訊，連結求職者與工作機會。',
        background:
          '嚴選職缺以企業專頁呈現徵才資訊；此處以大苑子企業頁作為正式網站入口。',
        contributions: ['參與嚴選職缺專案的前端開發與團隊協作。'],
      },
      en: {
        title: 'Curated Opportunities',
        company: company.en,
        role: 'Frontend development',
        summary:
          'Contributed to a recruiting website that brings company profiles and job opportunities together for job seekers.',
        background:
          'Curated Opportunities presents employer information through dedicated company pages. The live link opens the Da Yung’s employer page.',
        contributions: [
          'Contributed to frontend implementation and collaboration within the project team.',
        ],
      },
    },
  },
  {
    slug: 'freshman',
    order: 30,
    categories: ['websites'],
    selected: true,
    stack: ['Vue', 'TypeScript'],
    deployment: 'live',
    requiresLogin: false,
    liveUrl: 'https://freshman.1111.com.tw/',
    cover: {
      src: '/covers/freshman.webp',
      fit: 'contain',
      position: '50% 50%',
      background: '#e5f9f8',
    },
    content: {
      zh: {
        title: '新鮮人專區',
        company: company.zh,
        role: '前端開發與重構',
        summary:
          '參與新鮮人專區的前端開發與重構，將求職服務呈現在使用者端網站。',
        background:
          '新鮮人專區是 1111 面向初入職場求職者的網站，也是我參與開發與重構的專案之一。',
        audience: '初入職場的求職者，透過專區探索求職資訊與服務。',
        contributions: ['參與新鮮人專區的前端開發與重構。'],
      },
      en: {
        title: 'Early Career Hub',
        company: company.en,
        role: 'Frontend development & refactoring',
        summary:
          'Helped develop and refactor an early-career website that makes job-search services accessible to new graduates.',
        background:
          '1111’s Early Career Hub supports people entering the workforce. I contributed to its frontend development and refactoring.',
        audience:
          'Early-career job seekers exploring opportunities and career resources.',
        contributions: [
          'Contributed to frontend development and refactoring of the Early Career Hub.',
        ],
      },
    },
  },
  {
    slug: 'graduation-campaign',
    order: 40,
    categories: ['websites'],
    stack: ['Vue', 'TypeScript'],
    deployment: 'live',
    requiresLogin: false,
    liveUrl: 'https://event.1111.com.tw/event25/freshmanGraduate/',
    cover: {
      src: '/covers/graduation-campaign.jpg',
      position: '50% 0%',
      background: '#a3e4dc',
    },
    content: {
      zh: {
        title: '新鮮人專區－畢業季活動',
        company: company.zh,
        role: '活動網站前端開發',
        summary: '參與畢業季活動網站前端實作，呈現新鮮人求職活動與參與資訊。',
        background:
          '延伸新鮮人專區的畢業季活動頁，提供活動說明、履歷更新參與流程與獎勵資訊。',
        contributions: ['參與畢業季活動專案的前端實作與協作。'],
      },
      en: {
        title: 'Graduation Campaign',
        company: company.en,
        role: 'Campaign frontend development',
        summary:
          'Contributed to the frontend of a graduation-season campaign for early-career job seekers.',
        background:
          'A campaign connected to the Early Career Hub, presenting participation details, résumé-update steps, and reward information.',
        contributions: [
          'Contributed to frontend implementation and project collaboration for the graduation campaign.',
        ],
      },
    },
  },
  {
    slug: 'campus-recruitment',
    order: 50,
    categories: ['websites'],
    stack: ['Vue', 'TypeScript'],
    deployment: 'live',
    requiresLogin: false,
    liveUrl: 'https://www.1111.com.tw/campusr/',
    cover: {
      src: '/covers/campus-recruitment.png',
      fit: 'contain',
      position: '50% 50%',
      background: '#e5f5fb',
    },
    content: {
      zh: {
        title: '2025 校園徵才',
        company: company.zh,
        role: '前端開發',
        summary:
          '參與校園徵才網站的前端開發，讓學生與畢業生探索校徵及就業資訊。',
        background:
          '面向校園求職族群的線上徵才網站。我參與 2025 校園徵才專案，正式網址持續提供校徵服務。',
        contributions: ['參與 2025 校園徵才專案的前端實作。'],
      },
      en: {
        title: 'Campus Recruitment 2025',
        company: company.en,
        role: 'Frontend development',
        summary:
          'Contributed to a campus recruiting website helping students and graduates explore career opportunities.',
        background:
          'An online recruiting destination for students and graduates. My involvement was in the 2025 project; the same URL continues to serve campus recruitment.',
        contributions: [
          'Contributed to frontend implementation for the 2025 campus recruitment project.',
        ],
      },
    },
  },
  {
    slug: 'transfer-2025',
    order: 70,
    categories: ['websites'],
    stack: ['Vue', 'TypeScript'],
    deployment: 'live',
    requiresLogin: false,
    liveUrl: 'https://event.1111.com.tw/event25/transfer_25y1w/',
    cover: {
      src: '/covers/transfer-2025.webp',
      fit: 'contain',
      position: '50% 0%',
      background: '#def5fa',
    },
    content: {
      zh: {
        title: '2025 送一萬活動',
        company: company.zh,
        role: '活動網站前端開發',
        summary: '參與求職獎勵活動網站的前端開發，呈現活動內容與參與資訊。',
        background:
          '1111 的求職獎勵活動網站。我參與 2025 年專案，正式入口可查看網站目前的活動內容。',
        contributions: ['參與 2025 送一萬活動的前端實作。'],
      },
      en: {
        title: 'NT$10,000 Job-Search Campaign 2025',
        company: company.en,
        role: 'Campaign frontend development',
        summary:
          'Contributed to the frontend of a job-search rewards campaign, presenting campaign and participation information.',
        background:
          'A job-search rewards website from 1111. I participated in the 2025 project; the live URL shows the site’s current campaign content.',
        contributions: [
          'Contributed to frontend implementation for the 2025 rewards campaign.',
        ],
      },
    },
  },
  {
    slug: 'shared-foundations',
    order: 80,
    categories: ['architecture'],
    selected: true,
    stack: ['Nuxt 3', 'Web Components', 'TypeScript'],
    deployment: 'unknown',
    requiresLogin: false,
    content: {
      zh: {
        title: '活動模板與共用元件',
        company: company.zh,
        role: '模板規劃與共用元件開發',
        summary:
          '建立活動專案模板、模組基底及跨專案 Web Components，讓重複需求有可重用的起點。',
        background:
          '一組跨活動專案的共用化實務：透過模板提供新專案起點，以共用元件服務多個獨立網站。',
        audience: '需要建立與維護不同活動網站的前端團隊。',
        contributions: [
          '獨立規劃並開發活動專案模板與模組基底。',
          '建立可供多個活動網站共用的 Web Components。',
          '在活動網站開發與重構工作中導入 Nuxt 3。',
        ],
        implementation: [
          {
            title: '活動專案模板',
            description:
              '將可重用的專案基底整理成模板，作為新活動專案的開發起點。',
          },
          {
            title: '跨專案共用元件',
            description:
              '使用 Web Components 建立共用元件，供多個獨立活動網站使用。',
          },
        ],
        outcomes: [
          '活動專案模板已應用於合作專案。',
          '多個獨立活動網站可共用同一套元件。',
        ],
      },
      en: {
        title: 'Campaign Templates & Shared Components',
        company: company.en,
        role: 'Template design & component development',
        summary:
          'Built campaign templates, module foundations, and shared Web Components to give recurring requirements a reusable starting point.',
        background:
          'A set of practices spanning multiple campaigns: templates provide a project foundation, while shared components support independent websites.',
        audience: 'Frontend teams building and maintaining campaign websites.',
        contributions: [
          'Independently planned and developed campaign templates and module foundations.',
          'Built Web Components for reuse across multiple campaign sites.',
          'Introduced Nuxt 3 into campaign development and refactoring work.',
        ],
        implementation: [
          {
            title: 'Campaign templates',
            description:
              'Organized reusable project foundations into templates for new campaign work.',
          },
          {
            title: 'Components across projects',
            description:
              'Used Web Components to share interface elements across independent websites.',
          },
        ],
        outcomes: [
          'Campaign templates were used in collaborative projects.',
          'Multiple independent campaign sites could reuse the same components.',
        ],
      },
    },
  },
  {
    slug: 'voting-system',
    order: 90,
    categories: ['applications', 'websites'],
    period: '2023',
    stack: [],
    deployment: 'unknown',
    requiresLogin: false,
    content: {
      zh: {
        title: '投票系統：前台與管理端',
        company: '三立電視',
        role: '前端工程師',
        summary: '與後端工程師合作，從零建立投票系統的使用者端與管理端介面。',
        background:
          '在三立電視任職期間，與一位後端工程師合作建立投票系統，參與從需求討論到系統設計與資料串接的流程。',
        audience: '投票使用者與系統管理人員，分別透過使用者端及管理端操作。',
        contributions: [
          '從零參與投票系統的前端建置。',
          '實作使用者端與管理端介面。',
          '與後端工程師協作，完成前後端資料串接。',
        ],
        collaboration:
          '我負責前端介面與資料串接，後端工程師負責伺服器端；雙方共同討論需求與系統流程。',
        outcomes: ['與後端工程師共同完成包含使用者端及管理端的投票系統。'],
      },
      en: {
        title: 'Voting System: Public & Admin Interfaces',
        company: 'Sanlih E-Television',
        role: 'Frontend Engineer',
        summary:
          'Partnered with a backend engineer to build the public and admin interfaces of a voting system from the ground up.',
        background:
          'At Sanlih E-Television, I worked with one backend engineer on a voting system, from requirements and system discussions through to API integration.',
        audience:
          'Voters and administrators, each using a dedicated interface.',
        contributions: [
          'Helped establish the system’s frontend from scratch.',
          'Implemented the public voting and admin interfaces.',
          'Collaborated with the backend engineer on API integration.',
        ],
        collaboration:
          'I handled frontend interfaces and API integration; my colleague handled the server side. We discussed requirements and workflows together.',
        outcomes: [
          'Together, we delivered a voting system with public and admin interfaces.',
        ],
      },
    },
  },
];
export function localizeProjects(locale: Locale): Project[] {
  return [...projectRecords]
    .sort((a, b) => a.order - b.order)
    .map(({ content, ...record }) => ({ ...record, ...content[locale] }));
}
