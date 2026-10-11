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
  stateBoundaries?: {
    title: string;
    groups: { title: string; description: string }[];
    caption: string;
  };
  title: string;
  company: string;
  role: string;
  summary: string;
  background: string;
  challenge?: string;
  engineeringValue?: string;
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
        role: 'Web Components 架構設計、實作與跨網站整合',
        summary:
          '主導主站 AI 小精靈、履歷匯入與篩選清單的 Web Components 封裝及活動網站接入，親自設計並實作共用元件與跨站整合架構。',
        background:
          '1111 的活動網站面向不同主題與使用情境，需要接入主站既有服務。這項工作將共通功能整理為可跨網站使用的前端元件。',
        contributions: [
          '親自設計並實作主站功能的 Web Components 封裝與活動網站接入方式，處理跨專案整合問題。',
        ],
        collaboration:
          '協助組員釐清 props 傳遞、Web Components 的內容對應與接入方式，排查整合時的程式碼問題。',
        implementation: [
          {
            title: '分開共用功能與活動頁面邏輯',
            description:
              '把 AI 小精靈、履歷匯入、篩選清單等可重用的介面能力封裝在共用元件中，讓活動頁面負責自身流程與元件接入，避免每個活動專案各自維護一份主站功能。',
          },
          {
            title: '規劃一致的接入契約',
            description:
              '設計外部設定傳入、互動結果回傳與元件掛載流程，讓不同活動網站依同一組責任邊界使用既有功能。整合時釐清活動頁面提供什麼內容，以及元件完成互動後需要把什麼結果交回頁面。',
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
        challenge:
          '主站功能需要接入多個活動網站，各專案的元件架構、樣式與生命週期不完全一致。直接複製功能會增加重複維護及整合衝突的風險。',
        engineeringValue:
          '以降低活動專案對主站內部實作的耦合為目標，將共用功能集中維護，減少跨專案重複開發與同步修改的需求。',
      },
      en: {
        title: '1111 Main Site × Campaign Sites｜Shared Web Components',
        company: '1111 Job Bank',
        role: 'Web Components architecture, implementation & cross-site integration',
        summary:
          'Led Web Components packaging and campaign-site integration for the main site’s AI assistant, résumé import, and filter lists, personally designing and implementing the shared-component and cross-site architecture.',
        background:
          '1111 campaign sites serve different topics and audiences while drawing on existing main-site services. This work packaged shared functionality as frontend components for use across those sites.',
        contributions: [
          'Personally designed and implemented Web Components packaging and the campaign-site integration approach, resolving cross-project integration issues.',
        ],
        collaboration:
          'Helped teammates troubleshoot integration issues and clarify prop passing and content mapping when using shared Web Components.',
        implementation: [
          {
            title: 'Separate shared functionality from campaign-page logic',
            description:
              'Encapsulated reusable interfaces for AI assistance, résumé import, and filter lists in shared components. Campaign pages handle their own flows and component integration, avoiding a separate copy of main-site functionality in every project.',
          },
          {
            title: 'Define a consistent integration contract',
            description:
              'Designed configuration inputs, interaction-result outputs, and component mounting flows so campaign sites could use existing features through consistent responsibility boundaries. Integration work clarified what a campaign page provides and what results the component returns after an interaction.',
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
        challenge:
          'Main-site features needed to work across campaign sites with different component structures, styles, and lifecycles. Copying the functionality into each project would increase duplicated maintenance and integration risks.',
        engineeringValue:
          'Aim to reduce campaign projects’ coupling to main-site internals by maintaining shared functionality centrally and reducing the need for duplicate development and synchronized changes across projects.',
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
        challenge:
          '管理介面需要協調列表、表單、API 回應與操作狀態。頁面展示、共用 UI 與資料串接的責任需要清楚，才能承接不同管理流程。',
        implementation: [
          {
            title: '管理頁面與共用 UI 的邊界',
            description:
              '以 Vue 3 規劃管理功能與頁面元件的拆分，整合 Naive UI 及專案所需套件。依管理頁面的需求組合共用 UI，讓頁面流程與可重用的介面責任分開。',
          },
          {
            title: '以前端操作需求協調 API',
            description:
              '將畫面需要的資料與操作流程帶入前後端討論，協調 API 規格並完成前端資料串接；開發期間持續回報進度與流程，讓介面工作與後端協作保持銜接。',
          },
        ],
        engineeringValue:
          '以清楚的功能與元件邊界支撐管理介面開發，讓資料串接與頁面流程的調整有明確的責任範圍。',
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
        challenge:
          'Admin interfaces need to coordinate lists, forms, API responses, and interaction state. Presentation, shared UI, and data integration need clear responsibilities to support different management workflows.',
        implementation: [
          {
            title: 'Define boundaries between admin pages and shared UI',
            description:
              'Planned management-feature and page-component boundaries in Vue 3, integrating Naive UI and the required packages. Composed shared UI around each admin page’s needs, separating page workflows from reusable interface responsibilities.',
          },
          {
            title: 'Coordinate API work around frontend operations',
            description:
              'Brought interface data requirements and workflows into frontend/backend discussions, coordinated API specifications, and implemented frontend data integration. Regular progress and process updates kept interface work aligned with backend collaboration.',
          },
        ],
        engineeringValue:
          'Support admin development with clear feature and component boundaries, giving data integration and page-flow changes a defined scope of responsibility.',
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
        role: '前端架構、企業頁元件設計與團隊分工',
        summary:
          '負責嚴選職缺入口與企業內頁的前端架構，將企業介紹、職缺展示等重複區塊整理為共用元件，與團隊完成不同企業頁的開發。',
        background:
          '嚴選職缺由入口頁匯集企業與工作機會，再由企業內頁呈現公司介紹及職缺。開發範圍同時涵蓋入口與企業頁的組合方式。',
        contributions: [
          '負責入口與企業頁的元件規劃，依展示區塊安排組員分工，並參與實作與整合。',
        ],
        challenge:
          '企業頁需要容納不同品牌的內容，又有重複的展示需求。若每頁都各自實作，相同區塊的修改就容易分散到不同頁面。',
        implementation: [
          {
            title: '以展示責任拆分元件',
            description:
              '將企業介紹與職缺列表分開規劃，把可重複的展示區塊整理成可維護的元件。元件處理自身的展示責任，頁面則負責將不同區塊組合為完整的企業介紹。',
          },
          {
            title: '共用結構，保留企業內容差異',
            description:
              '依不同企業的內容需求組合頁面，讓可沿用的展示方式與各企業的內容差異分開處理。團隊以相同的元件邊界分工，整合時檢查入口與企業內頁之間的呈現是否一致。',
          },
        ],
        engineeringValue:
          '讓後續企業頁能沿用一致的開發方式；共通展示需求集中在元件層，企業內容的調整則維持在相應頁面範圍。',
      },
      en: {
        title: 'Curated Opportunities',
        company: '1111 Job Bank',
        coverAlt:
          'Company introduction and job cards on the Da Yung’s employer page',
        coverNote:
          'Employer-page example: Da Yung’s company introduction and job listings.',
        liveLabel: 'Visit Curated Opportunities',
        role: 'Frontend architecture, employer-page components & task allocation',
        summary:
          'Owned frontend architecture for the Curated Opportunities landing page and employer pages, turning recurring company and job sections into shared components and building employer pages with the team.',
        background:
          'The landing page brings together employers and job opportunities, while individual employer pages present company profiles and openings. My scope covered both the entry point and how employer pages were composed.',
        contributions: [
          'Planned components for the landing page and employer pages, allocated work by presentation section, and contributed to implementation and integration.',
        ],
        challenge:
          'Employer pages need to accommodate different brand content while sharing recurring presentation needs. Implementing each page separately would spread changes to the same sections across multiple pages.',
        implementation: [
          {
            title: 'Separate components by presentation responsibility',
            description:
              'Planned company introductions and job lists separately, organizing recurring sections into maintainable components. Each component handles its own presentation responsibility, while the page composes them into a complete employer profile.',
          },
          {
            title: 'Reuse structure while accommodating employer content',
            description:
              'Composed pages around each employer’s content needs, separating reusable presentation from company-specific content. The team divided work along the same component boundaries and checked consistency between the landing page and employer pages during integration.',
          },
        ],
        engineeringValue:
          'Give subsequent employer pages a consistent development approach: shared presentation belongs to components, while company-specific content changes stay within the relevant page.',
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
        role: '既有網站重構、前端架構與功能模組拆分',
        summary:
          '參與既有新鮮人專區的前端重構，負責架構與可重用功能模組的規劃，在保留原有使用流程的前提下，與團隊整理頁面及共用邏輯。',
        background:
          '新鮮人專區已提供初入職場者的求職資訊與服務。這項工作面對的是持續運作的網站，需要承接既有使用流程，再調整前端結構。',
        contributions: [
          '規劃重構後的頁面與功能模組邊界，安排組員分工，並共同完成既有介面的重構與整合。',
        ],
        challenge:
          '重構既有網站時，使用者熟悉的流程與程式內部結構要分開考量。調整頁面職責與共用邏輯時，仍需維持原本服務的操作脈絡。',
        implementation: [
          {
            title: '以既有使用流程界定重構範圍',
            description:
              '先以網站原有的求職資訊與服務流程為基準，整理頁面各自承擔的責任。將使用者的操作流程保留下來，把調整集中在頁面結構與功能組織方式。',
          },
          {
            title: '將可重用功能從頁面中拆出',
            description:
              '把可共用的功能模組與頁面組合邏輯分開，讓頁面專注組織內容與流程，共用模組承擔重複互動。團隊依這些責任邊界實作及整合，讓後續維護有較明確的修改範圍。',
          },
        ],
        engineeringValue:
          '以保留既有流程為前提，建立較清楚的頁面與功能邊界，作為後續維護及服務擴充的基礎。',
      },
      en: {
        title: 'Early Career Hub',
        company: '1111 Job Bank',
        coverNote:
          'The hub’s current 2026 graduation visual, used to identify the product.',
        role: 'Existing-site refactoring, frontend architecture & module boundaries',
        summary:
          'Refactored the existing Early Career Hub with the team, owning architecture and reusable module planning while preserving established user journeys and reorganizing pages and shared logic.',
        background:
          'The Early Career Hub already provided career information and services. This work concerned an operating website: its established user journeys needed to remain intact while the frontend structure evolved.',
        contributions: [
          'Planned page and feature-module boundaries for the refactor, allocated work, and collaborated on implementation and integration of the existing interfaces.',
        ],
        challenge:
          'Refactoring an existing site means treating familiar user journeys and internal code structure separately. Changes to page responsibilities and shared logic still need to preserve the way the service is used.',
        implementation: [
          {
            title: 'Use existing journeys to define the refactoring scope',
            description:
              'Used the site’s existing career-information and service journeys as the baseline for clarifying page responsibilities. Preserved the user-facing flow while focusing changes on page structure and feature organization.',
          },
          {
            title: 'Separate reusable features from page composition',
            description:
              'Separated shared feature modules from page-level composition. Pages organize content and flows; shared modules handle recurring interactions. These boundaries guided team implementation and integration and gave later maintenance a clearer scope.',
          },
        ],
        engineeringValue:
          'Establish clearer page and feature boundaries as a foundation for maintenance and service expansion, while retaining existing user journeys.',
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
        role: '參與流程介面、活動組件與前端整合',
        summary:
          '將畢業季的參與條件、履歷更新步驟與獎勵資訊組織為活動介面，負責前端結構與組件規劃，與團隊完成頁面開發。',
        background:
          '2025 畢業季活動延伸自新鮮人專區。公開頁面依序說明會員登入、手機／信箱雙認證與更新履歷，並提供報名入口及獎勵資訊。',
        contributions: [
          '規劃參與條件、操作步驟與獎勵說明的前端呈現，並與組員共同實作、整合活動頁面。',
        ],
        challenge:
          '參與活動需要先理解會員登入、雙認證、履歷更新與報名的關係。頁面必須說清楚先決條件與下一步，也要讓獎勵資訊容易查閱。',
        implementation: [
          {
            title: '讓條件與步驟有清楚的順序',
            description:
              '以會員登入、手機／信箱雙認證、更新履歷及報名的參與脈絡規劃頁面，將先決條件放在操作說明中，讓使用者在前往參與入口前能理解需要完成的事項。',
          },
          {
            title: '分開流程說明與獎勵資訊',
            description:
              '將參與步驟與獎勵內容視為不同的展示責任，避免把所有規則塞在同一段活動文案中。頁面整合時維持步驟、報名入口與獎勵說明之間清楚的對應。',
          },
        ],
      },
      en: {
        title: 'Graduation Campaign',
        company: '1111 Job Bank',
        coverNote: 'Homepage of the 2025 graduation campaign.',
        role: 'Participation interfaces, campaign components & frontend integration',
        summary:
          'Organized participation requirements, résumé-update steps, and rewards into the graduation campaign interface, planning frontend structure and components and developing the pages with the team.',
        background:
          'The 2025 graduation campaign extended the Early Career Hub. Its public page explained sign-in, phone and email verification, and résumé updates, alongside an entry point to join the campaign and reward details.',
        contributions: [
          'Planned frontend presentation of participation requirements, steps, and reward details, and collaborated on implementing and integrating the campaign pages.',
        ],
        challenge:
          'Participants need to understand how sign-in, verification, résumé updates, and registration fit together. The page must explain prerequisites and next steps while keeping reward information easy to consult.',
        implementation: [
          {
            title: 'Give prerequisites and steps a clear sequence',
            description:
              'Structured the page around sign-in, phone and email verification, résumé updates, and registration. Included prerequisites in the step descriptions so visitors could understand what to complete before following the participation entry point.',
          },
          {
            title: 'Separate participation guidance from reward details',
            description:
              'Treated steps and rewards as distinct presentation responsibilities instead of placing every rule in one block of campaign copy. During page integration, kept the relationship between steps, the registration entry point, and reward information clear.',
          },
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
        role: '前端架構、搜尋狀態管理設計與實作',
        summary:
          '主導 2025 校園徵才的搜尋模組與狀態管理設計，親自實作共用狀態及操作範例，區分 Pinia Store、元件局部狀態與 composable 的責任。',
        background:
          '面向校園求職族群的線上徵才網站，提供企業徵才與就業資訊。本案例為 2025 年專案，正式入口持續更新年度內容。',
        contributions: [
          '親自設計並撰寫狀態管理架構與實作範例，依狀態共享範圍安排模組責任，作為團隊功能分工與整合的依據。',
        ],
        challenge:
          '多個搜尋入口與產業分類並存，各區塊需要自己的互動狀態，也需要一致的搜尋條件與標籤操作。把 Tab、條件與操作邏輯全部放在單一頁面，會增加跨模組的耦合。',
        implementation: [
          {
            title: '先依共享範圍決定狀態歸屬',
            description:
              '透過 Pinia Store 統一管理需要跨元件共用的搜尋入口與條件；只影響單一模組的互動則留在元件內，避免把所有畫面狀態都集中到全域 Store。',
          },
          {
            title: '分開 Tab 選擇與搜尋條件',
            description:
              '將入口及分類的選擇狀態，與搜尋條件的管理責任分開規劃。搜尋模組讀取需要的共用狀態，讓切換入口與修改條件有明確的責任範圍，不必各自在頁面重複維護一份。',
          },
          {
            title: '用 composable 統一標籤操作',
            description:
              '把搜尋標籤的移除與清除等重複互動封裝為 composable，讓不同搜尋模組沿用一致的操作介面。Store 管理共用狀態，composable 整理重複行為，元件負責呈現與使用者操作。',
          },
          {
            title: '以實作範例落實架構',
            description:
              '親自撰寫狀態管理範例，將上述分工落實到活動專案的開發方式。組員擴充搜尋入口或操作時，可以沿用既有狀態邊界與共用行為，而不是把新邏輯持續堆進單一頁面。',
          },
        ],
        stateBoundaries: {
          title: '搜尋模組的狀態與行為分工',
          groups: [
            {
              title: 'Pinia Store｜共用狀態',
              description: '跨元件共享的搜尋入口、分類選擇與搜尋條件。',
            },
            {
              title: 'Component｜局部互動',
              description: '各搜尋模組的呈現，以及只影響該模組的互動狀態。',
            },
            {
              title: 'Composable｜重複行為',
              description: '搜尋標籤的移除、清除等共用操作。',
            },
          ],
          caption:
            '責任邊界示意：依共享範圍安排狀態，並將重複行為與畫面呈現分開。',
        },
        engineeringValue:
          '讓搜尋入口的擴充與維護落在清楚的模組邊界，降低跨元件修改的連帶影響，也讓團隊能依功能分工。',
      },
      en: {
        title: 'Campus Recruitment 2025',
        company: '1111 Job Bank',
        coverNote:
          'Current official visual for campus recruitment 2026; this case covers the 2025 project.',
        role: 'Frontend architecture, search state design & implementation',
        summary:
          'Led search-module and state-management design for campus recruitment 2025, implementing shared state and usage examples with distinct responsibilities for Pinia stores, local component state, and composables.',
        background:
          'An online destination for employer recruitment and job information aimed at students and graduates. This case covers the 2025 project; the public entry point continues to receive annual updates.',
        contributions: [
          'Personally designed and implemented the state architecture and examples, defining responsibilities by sharing scope to guide feature allocation and team integration.',
        ],
        challenge:
          'Multiple search entry points and industry categories need their own interactions as well as consistent search conditions and tag operations. Concentrating tabs, conditions, and interaction logic in one page would tightly couple the modules.',
        implementation: [
          {
            title: 'Assign state according to its sharing scope',
            description:
              'Used Pinia stores for search entry points and conditions shared across components. Interactions affecting only one module stay local to that component, rather than putting every piece of UI state into a global store.',
          },
          {
            title: 'Separate tab selection from search conditions',
            description:
              'Planned selection state for entry points and categories separately from search-condition management. Search modules read the shared state they need, giving entry switching and condition changes clear responsibilities without maintaining duplicate state on each page.',
          },
          {
            title: 'Use a composable for consistent tag operations',
            description:
              'Encapsulated recurring search-tag removal and clearing behavior in a composable so different search modules use a consistent interface. Stores hold shared state, composables organize reusable behavior, and components handle presentation and user interaction.',
          },
          {
            title: 'Make the architecture concrete through examples',
            description:
              'Wrote state-management implementation examples to put these boundaries into practice in campaign development. Team members extending entry points or interactions could follow the established state boundaries and shared behavior instead of accumulating logic in one page.',
          },
        ],
        stateBoundaries: {
          title: 'Search-module state and behavior boundaries',
          groups: [
            {
              title: 'Pinia store · Shared state',
              description:
                'Search entry points, category selection, and conditions shared across components.',
            },
            {
              title: 'Component · Local interaction',
              description:
                'Each search module’s presentation and interaction state that affects only that module.',
            },
            {
              title: 'Composable · Reusable behavior',
              description:
                'Shared operations such as removing and clearing search tags.',
            },
          ],
          caption:
            'Responsibility diagram: assign state by sharing scope, and separate reusable behavior from presentation.',
        },
        engineeringValue:
          'Keep search expansion and maintenance within clear module boundaries, limiting the knock-on effects of cross-component changes and supporting feature-based teamwork.',
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
        role: '獎勵活動資訊架構與前端介面開發',
        summary:
          '負責 2025 求職獎勵活動的前端架構與組件規劃，與團隊呈現獎勵內容、參與方式及活動介面。',
        background:
          '1111 的求職獎勵活動，面向想了解獎勵內容與參與方式的求職者。本人開發範圍為 2025 年活動網站。',
        contributions: [
          '規劃獎勵內容與參與說明的前端區塊，並與團隊完成活動介面的實作及整合。',
        ],
        implementation: [
          {
            title: '以獎勵與參與方式組織頁面',
            description:
              '這個活動的資訊重點是求職獎勵與參與方式。我將獎勵內容和參與說明作為頁面組件的規劃依據，讓使用者可以先了解活動提供什麼，再查閱如何參與。',
          },
        ],
      },
      en: {
        title: 'NT$10,000 Job-Search Campaign 2025',
        company: '1111 Job Bank',
        coverNote:
          'Current official visual for the 2026 rewards campaign; this case covers the 2025 project.',
        role: 'Rewards-campaign information architecture & frontend interfaces',
        summary:
          'Owned frontend architecture and component planning for the 2025 job-search rewards campaign, working with the team on reward information, participation guidance, and campaign interfaces.',
        background:
          'A 1111 campaign for job seekers exploring job-search rewards and how to participate. My development work covered the 2025 campaign site.',
        contributions: [
          'Planned frontend sections for rewards and participation guidance, and collaborated on implementing and integrating the campaign interfaces.',
        ],
        implementation: [
          {
            title: 'Organize the page around rewards and participation',
            description:
              'The information focus of this campaign is job-search rewards and how to take part. I used reward content and participation guidance as the basis for page-component planning, allowing visitors to understand the offer before consulting how to participate.',
          },
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
          '將活動網站共通的專案結構、初始化方式與組件規劃整理為可重用模板，保留各活動的客製化空間，建立團隊可沿用的工程基礎。',
        background:
          '活動網站有不同的介面與功能，但都需要專案起點。本案將專案結構、模板與模組基底整理成團隊可以沿用的開發基礎。',
        contributions: [
          '獨立設計並開發活動模板與架構基底，整理初始化方式、目錄規範及功能邊界，並在活動網站開發與重構中導入 Nuxt 3。',
        ],
        outcomes: ['活動模板已用於合作專案，作為後續功能開發的起點。'],
        relatedNote:
          '另可參考「1111 主站 × 活動網站｜Web Components 共用整合」，了解主站功能的跨網站接入。',
        challenge:
          '活動網站的視覺與流程不同，但開案時反覆需要專案結構、基本版型、共用互動與設定。若每次各自搭建，開案與交接方式就容易分散。',
        implementation: [
          {
            title: '把專案起點整理成團隊規範',
            description:
              '整理活動網站共通的前端結構、基本版型與設定，讓新專案能從一致的初始化方式開始。目錄與功能邊界用來交代程式碼各自承擔的責任，讓接手者有共同的理解基礎。',
          },
          {
            title: '區分模板基底與活動客製化',
            description:
              '將跨活動可沿用的結構與共用組件留在模板基底；不同活動的內容、視覺與流程保留在各自的功能範圍，讓共用基礎不必承擔每一個活動的特殊需求。',
          },
          {
            title: '區分專案共用與跨站功能接入',
            description:
              '模板處理活動專案自身如何組織與起建；主站 AI 小精靈、履歷匯入與篩選清單，則由另一套 Web Components 接入工作提供。兩者分別處理專案基礎與跨站功能重用。',
          },
        ],
        engineeringValue:
          '將單案實作經驗沉澱成可沿用的工程基礎，讓團隊在一致的結構上開發活動需求，兼顧共用規範與客製彈性。',
      },
      en: {
        title: 'Campaign Templates & Shared Components',
        company: '1111 Job Bank',
        role: 'Frontend architecture, templates & shared components',
        summary:
          'Organized common campaign structure, setup, and component planning into reusable templates, giving the team an engineering foundation while preserving room for campaign-specific work.',
        background:
          'Campaign sites need different interfaces and features, but each needs a starting point. This work organized project structure, templates, and module foundations into a base the team could reuse.',
        contributions: [
          'Independently designed and developed campaign templates and architectural foundations, defining setup, directory conventions, and feature boundaries, and introducing Nuxt 3 into campaign development and refactoring.',
        ],
        outcomes: [
          'The team used these templates in collaborative projects as the starting point for feature development.',
        ],
        relatedNote:
          'See “1111 Main Site × Campaign Sites｜Shared Web Components” for the integration of main-site features across campaign sites.',
        challenge:
          'Campaigns differ in design and flow, yet repeatedly need project structure, base layouts, common interactions, and configuration. Rebuilding these separately would fragment setup and handover practices.',
        implementation: [
          {
            title: 'Turn project setup into a shared development convention',
            description:
              'Organized common frontend structure, base layouts, and configuration so new campaigns could start consistently. Directory and feature boundaries explain code responsibilities and give people taking over the work a shared point of reference.',
          },
          {
            title:
              'Separate the template foundation from campaign customization',
            description:
              'Kept reusable structure and components in the template foundation while leaving campaign-specific content, design, and flows within their own feature scope. The shared base does not need to absorb every campaign’s special requirements.',
          },
          {
            title: 'Distinguish project reuse from cross-site integration',
            description:
              'Templates address how a campaign project is organized and initialized. Main-site AI assistance, résumé import, and filter lists are provided through the separate Web Components integration work. The two efforts address project foundations and cross-site feature reuse respectively.',
          },
        ],
        engineeringValue:
          'Turn experience from individual campaigns into a reusable engineering foundation, enabling teams to build on a consistent structure while retaining campaign-specific flexibility.',
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
