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
          '1111 除了主站，也有面向不同主題與使用情境的活動網站。我的工作是將主站功能製作成可供活動網站接入的 Web Components，讓不同網站能共用既有服務，減少各自重複實作的需求。',
        contributions: [
          '將 AI 小精靈、履歷匯入、篩選清單等功能製作成 Web Components。',
          '處理共用元件與各活動網站的前端串接及整合。',
          '讓相同功能可以在不同活動網站中重用。',
        ],
        implementation: [
          {
            title: 'AI 小精靈',
            description:
              '將主站的 AI 小精靈功能以 Web Component 形式提供活動網站使用。我的貢獻是前端元件化與整合，不包含 AI 模型或推論服務的建置。',
          },
          {
            title: '履歷匯入',
            description:
              '將履歷匯入功能製作成共用 Web Component，供不同活動網站串接使用。工作範圍為前端元件與整合，不包含 OCR、檔案解析或伺服器端匯入流程。',
          },
          {
            title: '篩選清單',
            description:
              '將篩選清單功能製作成共用 Web Component，整合至需要該功能的活動網站。',
          },
        ],
        outcomes: [
          '完成上述功能的 Web Components 開發及活動網站整合，讓主站功能能延伸至不同活動情境，建立可跨網站重用的前端功能基礎。',
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
          'Alongside its main site, 1111 operates campaign websites for different topics and use cases. My work was to turn main-site functionality into Web Components that campaign sites could integrate, allowing them to share existing services and reducing the need for separate implementations.',
        contributions: [
          'Built Web Components for features including the AI assistant, résumé import, and filter lists.',
          'Handled frontend integration between the shared components and individual campaign sites.',
          'Enabled the same functionality to be reused across different campaign websites.',
        ],
        implementation: [
          {
            title: 'AI assistant',
            description:
              'Made the main site’s AI assistant available to campaign sites as a Web Component. My contribution was frontend component development and integration, not building AI models or inference services.',
          },
          {
            title: 'Résumé import',
            description:
              'Built a shared résumé-import Web Component for integration into different campaign sites. My work covered the frontend component and integration, not OCR, file parsing, or server-side import processing.',
          },
          {
            title: 'Filter lists',
            description:
              'Built a shared Web Component for filter-list functionality and integrated it into campaign sites that needed it.',
          },
        ],
        outcomes: [
          'Delivered Web Components for these features and integrated them into campaign sites, extending main-site functionality to different campaign contexts and establishing reusable frontend functionality across websites.',
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
          '以 Vue 3 與 Naive UI 參與活動管理後台重構，負責前端架構與套件整合，並與後端共同討論 API 規格。開發期間定期向主管彙報進度與流程，協助團隊掌握執行狀況。',
        background:
          '1111 活動管理系統的正式後台，供內部人員與廠商登入使用。這次工作以既有管理介面的重構為核心，將前端架構、管理畫面與資料串接一起推進。',
        audience: '負責活動管理的內部人員與廠商。',
        contributions: [
          '設計管理後台的前端架構，使用 Vue 3 與 Naive UI 實作重構後的介面。',
          '整合專案所需套件，並撰寫專案所需的 YAML 設定。',
          '與後端工程師討論 API 規格，配合畫面及資料串接需求開發。',
          '定期向主管彙報開發進度與流程，讓團隊掌握專案狀況。',
        ],
        collaboration:
          '我負責前端架構、介面開發與資料串接；API 規格由我與後端工程師共同討論，伺服器端由後端負責。進度溝通則讓主管能持續了解開發流程與執行狀況。',
        implementation: [
          {
            title: '前端架構',
            description:
              '以 Vue 3 與 Naive UI 為技術基礎，負責重構工作的前端架構設計與管理介面實作。',
          },
          {
            title: '套件整合',
            description:
              '使用與整合管理介面所需套件，讓套件配置與前端開發工作相互配合。',
          },
          {
            title: 'API 協作',
            description:
              '從前端畫面與資料串接需求出發，與後端共同討論 API 規格並推進實作。',
          },
          {
            title: '進度溝通',
            description:
              '定期向主管說明開發進度及流程，使架構、介面與串接工作的狀況保持透明。',
          },
        ],
        outcomes: [
          '參與完成已上線活動管理後台的前端重構；正式入口需登入。',
          '交付前端架構、套件整合與管理介面實作，並透過 API 討論及定期彙報銜接團隊工作。',
        ],
      },
      en: {
        title: 'Event Management Console',
        company: '1111 Job Bank',
        coverNote:
          'Event-management console sign-in page for internal staff and business partners.',
        role: 'Frontend architecture, admin development & API collaboration',
        summary:
          'Worked on a Vue 3 and Naive UI refactor of the event-management console, owning frontend architecture and package integration. I discussed API specifications with backend engineers and regularly reported development progress and processes to my supervisor.',
        background:
          '1111’s production event-management console serves authenticated internal staff and business partners. This work focused on refactoring existing admin interfaces while advancing the frontend architecture and API integration together.',
        audience: 'Internal staff and business partners managing campaigns.',
        contributions: [
          'Designed the frontend architecture and implemented refactored admin interfaces with Vue 3 and Naive UI.',
          'Integrated the packages needed by the project and wrote its YAML configuration.',
          'Discussed API specifications with backend engineers to support interface and data-integration needs.',
          'Regularly reported development progress and processes to my supervisor.',
        ],
        collaboration:
          'I handled frontend architecture, interface development, and API integration. API specifications were discussed with backend engineers, who owned the server side. Regular updates kept my supervisor informed of the development process and project status.',
        implementation: [
          {
            title: 'Frontend architecture',
            description:
              'Designed the frontend architecture and implemented admin interfaces using Vue 3 and Naive UI as the project’s established foundation.',
          },
          {
            title: 'Package integration',
            description:
              'Used and integrated the packages required for the management interface, aligning setup with frontend implementation.',
          },
          {
            title: 'API collaboration',
            description:
              'Brought interface and data-integration requirements into API discussions with backend engineers, then carried the agreed work into frontend implementation.',
          },
          {
            title: 'Progress communication',
            description:
              'Reported development progress and processes regularly, keeping architecture, interface, and integration work visible to my supervisor.',
          },
        ],
        outcomes: [
          'Contributed to the frontend refactor of the live event-management console, accessible through its authenticated entry point.',
          'Delivered frontend architecture, package integration, and admin interface work, supported by API discussions and regular progress updates.',
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
        company: '1111 人力銀行',
        coverNote: '大苑子企業頁的官方形象圖。',
        role: '專案起建、前端架構與團隊分工',
        summary:
          '為企業介紹與職缺資訊規劃前端架構與組件，負責專案起建、套件配置及功能分工，與團隊共同完成嚴選職缺網站。',
        background:
          '嚴選職缺以企業專頁呈現徵才資訊；此處以大苑子企業頁作為正式網站入口。',
        contributions: [
          '建立專案並安裝、配置開發所需套件。',
          '設計企業專頁的前端架構與組件，撰寫專案所需的 YAML 設定。',
          '依功能模組安排組員分工，並參與前端實作與整合。',
        ],
        audience: '透過企業專頁了解公司背景與工作機會的求職者。',
        implementation: [
          {
            title: '企業資訊的前端組織',
            description:
              '以企業介紹與職缺資訊的呈現為情境，規劃前端架構和組件，作為團隊實作企業專頁的基礎。',
          },
          {
            title: '功能分工與共同開發',
            description:
              '在專案初始化與套件配置後，依功能模組安排工作，與組員協作完成網站開發。',
          },
        ],
        collaboration:
          '我負責起建、架構、組件設計與分工，網站由我與團隊共同實作及整合。',
        outcomes: [
          '與團隊完成呈現企業介紹與徵才資訊的網站；此處以大苑子企業頁作為公開入口。',
        ],
      },
      en: {
        title: 'Curated Opportunities',
        company: '1111 Job Bank',
        coverNote: 'Official image from the Da Yung’s employer page.',
        role: 'Project setup, frontend architecture & task allocation',
        summary:
          'Established the project, packages, architecture, and components for employer profiles and job information. I allocated feature work and built the site with the team.',
        background:
          'Curated Opportunities presents employer information through dedicated company pages. The live link opens the Da Yung’s employer page.',
        contributions: [
          'Created the project and installed and configured the required packages.',
          'Designed the frontend architecture and components for employer pages and wrote the project’s YAML configuration.',
          'Allocated work by feature module and contributed to frontend implementation and integration.',
        ],
        audience:
          'Job seekers learning about employers and available roles through company pages.',
        implementation: [
          {
            title: 'Organizing employer information',
            description:
              'Planned the architecture and components around company introductions and job information, providing a foundation for the team’s employer-page implementation.',
          },
          {
            title: 'Dividing feature work',
            description:
              'After setting up the project and packages, assigned work by feature module and collaborated with team members on development.',
          },
        ],
        collaboration:
          'I owned project setup, architecture, component design, and task allocation. Implementation and integration were shared with the team.',
        outcomes: [
          'Delivered a site presenting employer profiles and recruitment information with the team. The public link opens the Da Yung’s employer page.',
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
        coverNote: '新鮮人專區目前使用的 2026 畢業祭官方視覺。',
        role: '專案起建、前端架構、重構與分工',
        summary:
          '負責新鮮人專區的專案起建、套件配置、前端架構與組件設計，並依功能分工，與團隊共同推進求職服務網站的開發與重構。',
        background:
          '新鮮人專區是 1111 面向初入職場求職者的網站，也是我參與開發與重構的專案之一。',
        audience: '初入職場的求職者，透過專區探索求職資訊與服務。',
        contributions: [
          '建立專案、安裝與配置套件，規劃前端架構及組件。',
          '參與求職服務內容的前端開發與既有介面重構。',
          '依功能安排組員工作，協作整合網站，並撰寫專案所需的 YAML 設定。',
        ],
        implementation: [
          {
            title: '求職服務的組件基礎',
            description:
              '圍繞新鮮人求職資訊與服務的呈現，設計前端組件與專案架構，作為共同開發的基礎。',
          },
          {
            title: '開發與重構並行',
            description:
              '工作包含新鮮人專區的前端實作與重構；透過功能分工與團隊整合，推進網站開發。',
          },
        ],
        collaboration:
          '我負責專案與架構基礎，依功能安排組員工作；前端實作、重構及整合由團隊共同完成。',
        outcomes: [
          '與團隊完成新鮮人專區的前端開發與重構工作，讓求職資訊與服務呈現在使用者端網站。',
        ],
      },
      en: {
        title: 'Early Career Hub',
        company: '1111 Job Bank',
        coverNote:
          'The Early Career Hub’s current official visual for the 2026 graduation campaign.',
        role: 'Project setup, architecture, refactoring & task allocation',
        summary:
          'Owned project setup, package configuration, frontend architecture, and component design for the Early Career Hub. I allocated feature work and collaborated on development and refactoring of its job-search interfaces.',
        background:
          '1111’s Early Career Hub supports people entering the workforce. I contributed to its frontend development and refactoring.',
        audience:
          'Early-career job seekers exploring opportunities and career resources.',
        contributions: [
          'Created the project, configured packages, and planned frontend architecture and components.',
          'Contributed to frontend development and refactoring of the job-search interfaces.',
          'Assigned feature work, coordinated integration with the team, and wrote the project’s YAML configuration.',
        ],
        implementation: [
          {
            title: 'A component foundation for career services',
            description:
              'Designed components and project architecture around the presentation of early-career information and services, providing a basis for shared implementation.',
          },
          {
            title: 'Development and refactoring',
            description:
              'Worked on both frontend implementation and refactoring, progressing the site through feature-level task allocation and team integration.',
          },
        ],
        collaboration:
          'I established the project and architectural foundation and assigned work by feature. The team shared implementation, refactoring, and integration.',
        outcomes: [
          'Worked with the team on frontend development and refactoring, bringing career information and services into the user-facing site.',
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
          '從專案起建、套件配置到組件設計，規劃畢業季活動的前端基礎；依功能安排組員分工，共同呈現活動資訊與參與流程。',
        background:
          '延伸新鮮人專區的畢業季活動頁，提供活動說明、履歷更新參與流程與獎勵資訊。',
        contributions: [
          '初始化活動專案，安裝及配置開發套件。',
          '設計前端架構與活動組件，撰寫專案所需的 YAML 設定。',
          '依功能模組安排組員工作，與團隊共同完成活動頁面。',
        ],
        audience: '了解畢業季活動、履歷更新參與方式與獎勵資訊的新鮮人。',
        implementation: [
          {
            title: '活動資訊與參與流程',
            description:
              '以活動說明、履歷更新參與方式及獎勵資訊為內容情境，規劃頁面的前端架構與組件。',
          },
          {
            title: '專案基礎到團隊交付',
            description:
              '先建立專案與套件配置，再按功能分工，共同將活動內容落實為使用者能瀏覽的頁面。',
          },
        ],
        collaboration: '我負責架構、組件與功能分工，並和組員協作實作活動網站。',
        outcomes: ['與團隊共同完成畢業季活動網站，呈現活動資訊與參與流程。'],
      },
      en: {
        title: 'Graduation Campaign',
        company: '1111 Job Bank',
        coverNote: 'Homepage of the 2025 graduation campaign.',
        role: 'Project setup, campaign architecture & task allocation',
        summary:
          'Established the campaign’s frontend foundation, from project and package setup to component design. I assigned feature work and collaborated on presenting campaign information and participation steps.',
        background:
          'A campaign connected to the Early Career Hub, presenting participation details, résumé-update steps, and reward information.',
        contributions: [
          'Initialized the campaign project and installed and configured its packages.',
          'Designed frontend architecture and campaign components and wrote the required YAML configuration.',
          'Assigned work by feature module and built the campaign pages with the team.',
        ],
        audience:
          'Early-career job seekers exploring the graduation campaign, résumé-update participation steps, and rewards.',
        implementation: [
          {
            title: 'Information and participation',
            description:
              'Planned the frontend architecture and components around campaign details, résumé-update participation steps, and reward information.',
          },
          {
            title: 'From setup to shared delivery',
            description:
              'Established the project and package configuration, then divided feature work to turn the campaign content into browsable pages together.',
          },
        ],
        collaboration:
          'I handled architecture, components, and feature allocation, working with team members on implementation.',
        outcomes: [
          'Delivered the graduation campaign website with the team, presenting campaign details and participation steps.',
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
          '為 2025 校園徵才建立專案與套件配置，規劃前端架構及組件，依功能分配工作，與團隊共同完成校徵與就業資訊網站。',
        background:
          '面向校園求職族群的線上徵才網站。我參與 2025 校園徵才專案，正式網址持續提供校徵服務。',
        contributions: [
          '負責專案初始化及套件安裝、配置。',
          '設計校徵網站的前端架構與組件，並撰寫 YAML 設定。',
          '依功能模組分配組員工作，參與前端開發與共同整合。',
        ],
        audience: '探索校園徵才與就業資訊的學生及畢業生。',
        implementation: [
          {
            title: '校徵資訊的呈現基礎',
            description:
              '以學生與畢業生探索校徵、就業資訊的情境為切入點，規劃前端架構與組件設計。',
          },
          {
            title: '分工後的共同實作',
            description:
              '建立專案基礎後，按功能安排組員工作，協作完成 2025 校園徵才的前端實作。',
          },
        ],
        collaboration:
          '我負責起建、架構與組件設計，也安排功能分工；網站由團隊共同完成。',
        outcomes: ['與團隊完成 2025 校園徵才網站的前端開發。'],
      },
      en: {
        title: 'Campus Recruitment 2025',
        company: '1111 Job Bank',
        coverNote:
          'Current official visual for campus recruitment 2026; this case covers the 2025 project.',
        role: 'Project setup, frontend architecture & task allocation',
        summary:
          'Set up the 2025 campus recruitment project and its packages, designed frontend architecture and components, and allocated feature work to deliver the site with the team.',
        background:
          'An online recruiting destination for students and graduates. My involvement was in the 2025 project; the same URL continues to serve campus recruitment.',
        contributions: [
          'Owned project initialization and package installation and configuration.',
          'Designed the frontend architecture and components and wrote the YAML configuration.',
          'Allocated feature modules and contributed to frontend development and integration.',
        ],
        audience:
          'Students and graduates exploring campus recruitment and employment information.',
        implementation: [
          {
            title: 'A foundation for campus information',
            description:
              'Planned architecture and components around students and graduates exploring campus recruitment and employment information.',
          },
          {
            title: 'Shared implementation',
            description:
              'After establishing the project foundation, assigned feature work and collaborated on the 2025 website’s frontend implementation.',
          },
        ],
        collaboration:
          'I owned setup, architecture, component design, and feature allocation. The website was built collaboratively.',
        outcomes: [
          'Completed frontend work on the 2025 campus recruitment website with the team.',
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
          '負責 2025 送一萬活動網站的起建、套件配置、前端架構與組件設計；依功能分工，與團隊共同完成活動及參與資訊的呈現。',
        background:
          '1111 的求職獎勵活動網站。我參與 2025 年專案，正式入口可查看網站目前的活動內容。',
        contributions: [
          '建立活動專案，安裝與配置所需套件。',
          '規劃活動網站的前端架構與組件，撰寫 YAML 設定。',
          '依功能安排組員分工，與團隊協作實作及整合活動頁面。',
        ],
        audience: '瀏覽求職獎勵活動內容與參與資訊的求職者。',
        implementation: [
          {
            title: '獎勵活動的內容呈現',
            description:
              '以活動內容與參與資訊為前端設計情境，將組件規劃與頁面開發銜接。',
          },
          {
            title: '架構與功能分工',
            description:
              '由我建立專案基礎、配置套件並設計架構，按功能分配工作後與組員共同完成網站。',
          },
        ],
        collaboration:
          '我負責專案基礎與功能分工，和組員共同實作活動內容及參與資訊介面。',
        outcomes: ['與團隊交付 2025 求職獎勵活動的前端網站。'],
      },
      en: {
        title: 'NT$10,000 Job-Search Campaign 2025',
        company: '1111 Job Bank',
        coverNote:
          'Current official visual for the 2026 rewards campaign; this case covers the 2025 project.',
        role: 'Project setup, campaign architecture & task allocation',
        summary:
          'Owned setup, package configuration, frontend architecture, and component design for the 2025 rewards campaign. I assigned feature work and collaborated on presenting campaign and participation information.',
        background:
          'A job-search rewards website from 1111. I participated in the 2025 project; the live URL shows the site’s current campaign content.',
        contributions: [
          'Created the campaign project and installed and configured the required packages.',
          'Planned frontend architecture and components and wrote the YAML configuration.',
          'Assigned feature work and collaborated on implementing and integrating the campaign pages.',
        ],
        audience:
          'Job seekers browsing the rewards campaign and participation information.',
        implementation: [
          {
            title: 'Presenting the campaign',
            description:
              'Used campaign and participation information as the context for frontend design, connecting component planning with page implementation.',
          },
          {
            title: 'Architecture and feature allocation',
            description:
              'Established the project foundation, configured packages, and designed the architecture before dividing feature work and building the site together.',
          },
        ],
        collaboration:
          'I handled the project foundation and feature allocation, working with team members on the campaign and participation interfaces.',
        outcomes: [
          'Delivered the frontend of the 2025 rewards campaign with the team.',
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
        company: '1111 人力銀行',
        role: '前端架構設計、模板與共用元件開發',
        summary:
          '建立活動專案的初始化模板、前端架構基底與組件規劃，讓團隊有可重用的專案起點。',
        background:
          '不同活動網站需要各自的功能與介面，也有共通的專案起建需求。本案例聚焦整理專案結構、模板與模組基底，作為團隊開發活動網站的共同基礎。',
        audience: '需要建立與維護不同活動網站的前端團隊。',
        contributions: [
          '獨立設計前端架構，規劃並開發活動專案模板與模組基底。',
          '撰寫專案所需的 YAML 設定。',
          '在活動網站開發與重構工作中導入 Nuxt 3。',
        ],
        implementation: [
          {
            title: '活動專案模板與模組基底',
            description:
              '將可重用的專案結構整理成模板，作為新活動專案的起點；在活動開發與重構中導入 Nuxt 3，讓起建與後續功能開發有共同基礎。',
          },
        ],
        outcomes: ['活動專案模板已應用於合作專案，提供可重用的專案起點。'],
        collaboration:
          '我負責設計與開發可重用的專案基礎；活動網站開發時，再依功能安排分工，與組員共同運用模板及共用元件。',
        relatedNote:
          '主站功能的 Web Components 化屬於同一組共用化工作；元件開發與跨網站整合詳見下方案例。',
      },
      en: {
        title: 'Campaign Templates & Shared Components',
        company: '1111 Job Bank',
        role: 'Frontend architecture, templates & shared components',
        summary:
          'Built setup templates, frontend architectural foundations, and component plans to give the team a reusable starting point for campaign projects.',
        background:
          'Different campaign sites need their own features and interfaces while sharing common project-setup needs. This case focuses on organizing project structure, templates, and module foundations for collaborative campaign development.',
        audience: 'Frontend teams building and maintaining campaign websites.',
        contributions: [
          'Independently designed the frontend architecture and developed campaign templates and module foundations.',
          'Wrote the YAML configuration required by the project.',
          'Introduced Nuxt 3 into campaign development and refactoring work.',
        ],
        implementation: [
          {
            title: 'Campaign templates and module foundations',
            description:
              'Organized reusable project structure into templates for new campaigns. Introduced Nuxt 3 in campaign development and refactoring, providing a shared foundation for setup and feature work.',
          },
        ],
        outcomes: [
          'Campaign templates were used in collaborative projects, providing a reusable starting point.',
        ],
        collaboration:
          'I designed and developed the reusable project foundation. For campaign delivery, I then assigned feature work and collaborated with team members using the templates and shared components.',
        relatedNote:
          'The main-site Web Components are part of the same reuse work. See the related case for component development and cross-site integration.',
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
          '在三立電視任職期間，與一位後端工程師合作建立投票系統，參與從需求討論到系統設計與資料串接的流程。',
        audience: '投票使用者與系統管理人員，分別透過使用者端及管理端操作。',
        contributions: [
          '從零設計投票系統的前端架構。',
          '實作使用者端與管理端介面。',
          '與後端工程師協作，完成前後端資料串接。',
        ],
        collaboration:
          '我負責前端架構、介面與資料串接，後端工程師負責伺服器端；雙方共同討論需求與系統流程。',
        outcomes: ['與後端工程師共同完成包含使用者端及管理端的投票系統。'],
      },
      en: {
        title: 'Voting System: Public & Admin Interfaces',
        company: 'Sanlih E-Television',
        role: 'Frontend architecture & development',
        summary:
          'Partnered with a backend engineer to build the public and admin interfaces of a voting system from the ground up.',
        background:
          'At Sanlih E-Television, I worked with one backend engineer on a voting system, from requirements and system discussions through to API integration.',
        audience:
          'Voters and administrators, each using a dedicated interface.',
        contributions: [
          'Designed the system’s frontend architecture from scratch.',
          'Implemented the public voting and admin interfaces.',
          'Collaborated with the backend engineer on API integration.',
        ],
        collaboration:
          'I handled frontend architecture, interfaces, and API integration; my colleague handled the server side. We discussed requirements and workflows together.',
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
