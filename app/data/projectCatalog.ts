import type { Locale } from './messages';
export type Category = 'websites' | 'applications' | 'architecture';
export interface IntegrationDiagram {
  title: string;
  sourceLabel: string;
  sourceNote: string;
  sharedLabel: string;
  components: string[];
  targetsLabel: string;
  targets: string[];
  caption: string;
}
export interface ProjectCopy {
  integrationDiagram?: IntegrationDiagram;
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
  liveLabel?: string;
  loginLabel?: string;
  coverAlt?: string;
  coverNote?: string;
  relatedNote?: string;
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
  relatedSlugs?: string[];
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
// One explicit editorial order for lists, selections, filters and adjacent cases.
export const projectRecords: ProjectRecord[] = [
  {
    slug: 'main-site-components',
    order: 1,
    categories: ['architecture', 'websites'],
    stack: ['Web Components'],
    deployment: 'live',
    requiresLogin: false,
    liveUrl: 'https://www.1111.com.tw/',
    relatedSlugs: ['shared-foundations'],
    cover: {
      src: '/covers/main-site-components.png',
      fit: 'contain',
      position: '50% 50%',
      background: '#eceff4',
    },
    content: {
      zh: {
        title: '1111 主站 × 活動網站｜Web Components 共用整合',
        company: '1111 人力銀行',
        role: 'Web Components 開發與跨網站整合',
        summary:
          '將 1111 主站的 AI 小精靈、履歷匯入與篩選清單等功能製作成 Web Components，並整合至不同活動網站，建立跨網站共用的功能元件。',
        background:
          '1111 的活動網站面向不同主題與使用情境，需要接入主站既有服務。這項工作將共通功能整理為可跨網站使用的前端元件。',
        contributions: [
          '負責共用元件的前端封裝、既有服務串接，以及各活動網站的接入整合。',
        ],
        collaboration:
          '協助組員釐清 props 傳遞、Web Components 的內容對應與接入方式，排查整合時的程式碼問題。',
        implementation: [
          {
            title: 'AI 小精靈',
            description:
              '將主站 AI 小精靈的前端功能封裝為 Web Component，供活動網站串接既有服務。',
          },
          {
            title: '履歷匯入',
            description:
              '提供共用的履歷匯入介面，整合至不同活動網站的使用流程。',
          },
          {
            title: '篩選清單',
            description:
              '將篩選清單製作為共用 Web Component，供需要該功能的活動網站接入。',
          },
        ],
        integrationDiagram: {
          title: '跨網站共用架構',
          sourceLabel: '主站功能',
          sourceNote: '1111 主站既有服務',
          sharedLabel: 'Web Components 共用層',
          components: ['AI 小精靈', '履歷匯入', '篩選清單'],
          targetsLabel: '多個活動網站',
          targets: ['活動網站 A', '活動網站 B', '活動網站 C'],
          caption: '共用架構示意；活動網站 A／B／C 為示意名稱。',
        },
        liveLabel: '前往 1111 主站',
        coverAlt: '1111 履歷匯入介面的檔案上傳視窗',
        coverNote:
          '履歷匯入介面，與篩選選單、AI 小精靈同為跨活動網站共用的 Web Components。',
        relatedNote:
          '專案初始化、架構基底與模板規劃，見「活動模板與共用元件」。',
      },
      en: {
        title: '1111 Main Site × Campaign Sites｜Shared Web Components',
        company: '1111 Job Bank',
        role: 'Web Components development & cross-site integration',
        summary:
          'Built Web Components for main-site features including the AI assistant, résumé import, and filter lists, then integrated them into different campaign sites as reusable frontend functionality.',
        background:
          '1111 campaign sites serve different topics and audiences while drawing on existing main-site services. This work packaged shared functionality as frontend components for use across those sites.',
        contributions: [
          'Owned frontend component packaging, connections to existing services, and integration into individual campaign sites.',
        ],
        collaboration:
          'Helped teammates troubleshoot integration issues and clarify prop passing and content mapping when using shared Web Components.',
        implementation: [
          {
            title: 'AI assistant',
            description:
              'Packaged the main site’s AI assistant frontend as a Web Component so campaign sites could connect to the existing service.',
          },
          {
            title: 'Résumé import',
            description:
              'Provided a shared résumé-import interface and integrated it into the workflows of different campaign sites.',
          },
          {
            title: 'Filter lists',
            description:
              'Built a shared filter-list Web Component for campaign sites that needed this functionality.',
          },
        ],
        integrationDiagram: {
          title: 'How the shared components connect',
          sourceLabel: 'Main-site features',
          sourceNote: 'Existing 1111 services',
          sharedLabel: 'Shared Web Components',
          components: ['AI assistant', 'Résumé import', 'Filter lists'],
          targetsLabel: 'Multiple campaign sites',
          targets: ['Campaign site A', 'Campaign site B', 'Campaign site C'],
          caption:
            'Shared architecture illustration; campaign sites A, B, and C are illustrative names.',
        },
        liveLabel: 'Visit 1111 main site',
        coverAlt: 'File upload dialog in the 1111 resume import interface',
        coverNote:
          'Resume import interface, one of the Web Components shared across campaign sites alongside filter menus and the AI assistant.',
        relatedNote:
          'For project setup, architectural foundations, and template planning, see “Campaign Templates & Shared Components.”',
      },
    },
  },
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
        company: '1111 人力銀行',
        coverNote: '活動管理後台登入頁，供內部人員與廠商使用。',
        role: '前端架構設計、後台開發與 API 協作',
        summary:
          '以 Vue 3 與 Naive UI 重構活動管理後台，負責前端架構、套件整合與介面開發，並與後端共同討論 API 規格。',
        background:
          '供 1111 內部人員與廠商使用的活動管理後台。我的工作集中在既有管理介面的前端重構。',
        contributions: [
          '設計前端架構，以 Vue 3 與 Naive UI 建立管理介面並整合所需套件。',
          '依畫面與資料串接需求，與後端工程師共同討論 API 規格並實作前端串接。',
        ],
        collaboration:
          '開發期間定期向主管彙報進度與開發流程；伺服器端由後端工程師負責。',
        outcomes: [
          '重構後的活動管理後台已上線，內部人員與廠商可透過正式入口登入。',
        ],
      },
      en: {
        title: 'Event Management Console',
        company: '1111 Job Bank',
        coverNote:
          'Event-management console sign-in page for internal staff and business partners.',
        role: 'Frontend architecture, admin development & API collaboration',
        summary:
          'Refactored the event-management console with Vue 3 and Naive UI, owning frontend architecture, package integration, and interfaces while discussing API specifications with backend engineers.',
        background:
          'An event-management console for 1111 staff and business partners. My work focused on refactoring its existing frontend interfaces.',
        contributions: [
          'Designed the frontend architecture, built admin interfaces with Vue 3 and Naive UI, and integrated the required packages.',
          'Discussed API specifications with backend engineers based on interface and data needs, then implemented the frontend integration.',
        ],
        collaboration:
          'I regularly reported progress and development processes to my supervisor. Backend engineers handled the server-side work.',
        outcomes: [
          'The refactored event-management console is live, with an official sign-in entry point for internal staff and business partners.',
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
    liveUrl: 'https://insight.1111.com.tw/',
    cover: {
      src: '/covers/curated-jobs-ui.jpg',
      fit: 'contain',
      position: '50% 50%',
      background: '#ffffff',
    },
    content: {
      zh: {
        title: '嚴選職缺',
        company: '1111 人力銀行',
        coverAlt: '嚴選職缺大苑子企業頁的公司簡介與職缺卡片',
        coverNote: '企業內頁範例：大苑子的公司簡介與職缺列表。',
        liveLabel: '前往嚴選職缺',
        role: '專案起建、前端架構與團隊分工',
        summary:
          '負責嚴選職缺入口與企業內頁的前端架構及組件設計，與團隊共同開發企業與職缺資訊介面。',
        background:
          '嚴選職缺以入口頁匯集企業與職缺資訊，再透過企業內頁呈現公司介紹與工作機會。',
        contributions: [
          '規劃入口頁、企業介紹與職缺列表的前端架構及組件。',
          '依功能分配組員工作，參與入口與企業內頁的實作及整合。',
        ],
      },
      en: {
        title: 'Curated Opportunities',
        company: '1111 Job Bank',
        coverAlt:
          'Company introduction and job cards on the Da Yung’s employer page',
        coverNote:
          'Employer-page example: Da Yung’s company introduction and job listings.',
        liveLabel: 'Visit Curated Opportunities',
        role: 'Project setup, frontend architecture & task allocation',
        summary:
          'Designed the frontend architecture and components for the Curated Opportunities landing page and employer pages, working with the team to build company and job information interfaces.',
        background:
          'The Curated Opportunities landing page brings together employers and job openings, with individual employer pages presenting company profiles and available roles.',
        contributions: [
          'Planned frontend architecture and components for the landing page, company profiles, and job listings.',
          'Allocated feature work and contributed to implementation and integration of both the landing page and employer pages.',
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
        company: '1111 人力銀行',
        coverNote: '新鮮人專區現行的 2026 畢業祭視覺，用於識別產品。',
        role: '專案起建、前端架構、重構與分工',
        summary:
          '與團隊開發及重構新鮮人求職服務網站，負責前端架構、組件設計與功能分工。',
        background:
          '1111 面向初入職場求職者的專區，提供求職資訊與服務。工作包含網站開發與既有介面重構。',
        contributions: [
          '規劃求職資訊與服務介面的前端架構及組件。',
          '安排功能分工，與組員共同完成前端實作、既有介面重構及整合。',
        ],
      },
      en: {
        title: 'Early Career Hub',
        company: '1111 Job Bank',
        coverNote:
          'The hub’s current 2026 graduation visual, used to identify the product.',
        role: 'Project setup, architecture, refactoring & task allocation',
        summary:
          'Worked with the team on development and refactoring of the early-career site, owning frontend architecture, component design, and feature allocation.',
        background:
          'A 1111 hub offering career information and services to people entering the workforce. The work covered site development and refactoring of existing interfaces.',
        contributions: [
          'Planned frontend architecture and components for career information and service interfaces.',
          'Allocated feature work and collaborated on frontend implementation, interface refactoring, and integration.',
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
        company: '1111 人力銀行',
        coverNote: '2025 畢業季活動首頁畫面。',
        role: '專案起建、活動架構與團隊分工',
        summary:
          '為畢業季活動規劃前端架構與組件，與團隊呈現履歷更新的參與步驟及獎勵資訊。',
        background:
          '2025 畢業季活動延伸自新鮮人專區。公開頁面依序說明會員登入、手機／信箱雙認證與更新履歷，並提供報名入口及獎勵資訊。',
        contributions: [
          '設計活動說明與參與流程頁面的前端架構及組件。',
          '依功能安排分工，與組員共同實作畢業季活動網站。',
        ],
      },
      en: {
        title: 'Graduation Campaign',
        company: '1111 Job Bank',
        coverNote: 'Homepage of the 2025 graduation campaign.',
        role: 'Project setup, campaign architecture & task allocation',
        summary:
          'Planned frontend architecture and components for the graduation campaign, working with the team to present résumé-update participation steps and rewards.',
        background:
          'The 2025 graduation campaign extended the Early Career Hub. Its public page explained sign-in, phone and email verification, and résumé updates, alongside an entry point to join the campaign and reward details.',
        contributions: [
          'Designed frontend architecture and components for the campaign information and participation pages.',
          'Assigned feature work and built the graduation campaign site with the team.',
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
        company: '1111 人力銀行',
        coverNote: '現行 2026 校園徵才官方視覺；本案例為 2025 專案。',
        role: '專案起建、前端架構與團隊分工',
        summary:
          '負責 2025 校園徵才網站的前端架構與組件規劃，與團隊共同開發面向學生及畢業生的徵才資訊介面。',
        background:
          '面向校園求職族群的線上徵才網站，提供企業徵才與就業資訊。本案例為 2025 年專案，正式入口持續更新年度內容。',
        contributions: [
          '規劃校徵資訊介面的前端架構與組件。',
          '依功能模組分配工作，並參與 2025 版本的前端實作與團隊整合。',
        ],
      },
      en: {
        title: 'Campus Recruitment 2025',
        company: '1111 Job Bank',
        coverNote:
          'Current official visual for campus recruitment 2026; this case covers the 2025 project.',
        role: 'Project setup, frontend architecture & task allocation',
        summary:
          'Planned frontend architecture and components for campus recruitment 2025, working with the team on recruitment interfaces for students and graduates.',
        background:
          'An online destination for employer recruitment and job information aimed at students and graduates. This case covers the 2025 project; the public entry point continues to receive annual updates.',
        contributions: [
          'Planned frontend architecture and components for the campus recruitment interfaces.',
          'Assigned feature modules and contributed to frontend implementation and team integration for the 2025 version.',
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
        company: '1111 人力銀行',
        coverNote: '現行 2026 送一萬活動官方視覺；本案例為 2025 專案。',
        role: '專案起建、活動架構與團隊分工',
        summary:
          '規劃 2025 送一萬活動的前端架構與組件，與團隊將求職獎勵活動說明及參與資訊製作為網站。',
        background:
          '1111 的求職獎勵活動，面向想了解獎勵內容與參與方式的求職者。本人開發範圍為 2025 年活動網站。',
        contributions: [
          '規劃獎勵活動內容與參與資訊的前端組件及頁面架構。',
          '安排組員分工，協作完成活動介面的實作與整合。',
        ],
      },
      en: {
        title: 'NT$10,000 Job-Search Campaign 2025',
        company: '1111 Job Bank',
        coverNote:
          'Current official visual for the 2026 rewards campaign; this case covers the 2025 project.',
        role: 'Project setup, campaign architecture & task allocation',
        summary:
          'Planned frontend architecture and components for the 2025 rewards campaign, working with the team to build a site presenting campaign and participation information.',
        background:
          'A 1111 campaign for job seekers exploring job-search rewards and how to participate. My development work covered the 2025 campaign site.',
        contributions: [
          'Planned frontend components and page architecture for reward and participation information.',
          'Allocated work and collaborated on implementation and integration of the campaign interfaces.',
        ],
      },
    },
  },
  {
    slug: 'shared-foundations',
    order: 80,
    categories: ['architecture'],
    selected: true,
    stack: ['Nuxt 3'],
    deployment: 'unknown',
    requiresLogin: false,
    content: {
      zh: {
        title: '活動模板與共用元件',
        company: '1111 人力銀行',
        role: '前端架構設計、模板與共用元件開發',
        summary:
          '建立活動專案的初始化模板、前端架構基底與組件規劃，讓團隊有可重用的專案起點。',
        background:
          '活動網站有不同的介面與功能，但都需要專案起點。本案將專案結構、模板與模組基底整理成團隊可以沿用的開發基礎。',
        contributions: [
          '獨立設計前端架構，開發活動專案模板與模組基底。',
          '在活動網站開發與重構中導入 Nuxt 3。',
        ],
        outcomes: ['活動模板已用於合作專案，作為後續功能開發的起點。'],
        relatedNote:
          '主站功能的 Web Components 封裝及跨網站接入，詳見下方案例。',
      },
      en: {
        title: 'Campaign Templates & Shared Components',
        company: '1111 Job Bank',
        role: 'Frontend architecture, templates & shared components',
        summary:
          'Built setup templates, frontend architectural foundations, and component plans to give the team a reusable starting point for campaign projects.',
        background:
          'Campaign sites need different interfaces and features, but each needs a starting point. This work organized project structure, templates, and module foundations into a base the team could reuse.',
        contributions: [
          'Independently designed frontend architecture and developed campaign templates and module foundations.',
          'Introduced Nuxt 3 into campaign development and refactoring.',
        ],
        outcomes: [
          'The team used these templates in collaborative projects as the starting point for feature development.',
        ],
        relatedNote:
          'See the related case for packaging main-site features as Web Components and integrating them across sites.',
      },
    },
    relatedSlugs: ['main-site-components'],
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
        role: '前端架構設計與開發',
        summary: '與後端工程師合作，從零建立投票系統的使用者端與管理端介面。',
        background:
          '在三立電視與一位後端工程師合作建立投票系統，供使用者投票與管理人員操作。雙方共同討論需求與流程，伺服器端由後端工程師負責。',
        contributions: [
          '從零設計投票系統的前端架構。',
          '實作使用者端與管理端介面。',
          '與後端工程師協作，完成前後端資料串接。',
        ],
      },
      en: {
        title: 'Voting System: Public & Admin Interfaces',
        company: 'Sanlih E-Television',
        role: 'Frontend architecture & development',
        summary:
          'Partnered with a backend engineer to build the public and admin interfaces of a voting system from the ground up.',
        background:
          'At Sanlih E-Television, I worked with one backend engineer on a system for voters and administrators. We discussed requirements and workflows together; my colleague handled the server side.',
        contributions: [
          'Designed the system’s frontend architecture from scratch.',
          'Implemented the public voting and admin interfaces.',
          'Collaborated with the backend engineer on API integration.',
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
