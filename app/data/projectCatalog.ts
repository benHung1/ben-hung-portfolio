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
  architectureOverview?: {
    layers: NonNullable<ProjectCopy['stateBoundaries']>;
    comparison: {
      title: string;
      intro: string;
      columns: [string, string, string];
      rows: { aspect: string; company: string; typical: string }[];
    };
    tradeoffs: {
      title: string;
      benefitsTitle: string;
      benefits: string[];
      costsTitle: string;
      costs: string[];
      judgment: string;
    };
  };
  decisionFlow?: {
    title: string;
    steps: { title: string; detail: string }[];
    caption: string;
  };

  integrationDiagram?: IntegrationDiagram;
  stateBoundaries?: {
    title: string;
    groups: { title: string; description: string }[];
    caption?: string;
  };
  contributionDetails?: NonNullable<ProjectCopy['stateBoundaries']>;
  title: string;
  company: string;
  role: string;
  summary: string;
  background: string;
  challenge?: string;
  engineeringValue?: string;
  audience?: string;
  highlights?: string[];
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
    slug: 'ai-resume-check',
    order: 5,
    categories: ['websites', 'architecture'],
    stack: ['Web Components'],
    deployment: 'live',
    requiresLogin: false,
    liveUrl: 'https://events.1111.com.tw/ai-resume-check/',
    relatedSlugs: ['main-site-components'],
    cover: {
      src: '/covers/ai-resume-check.png',
      fit: 'contain',
      position: '50% 50%',
      background: '#f4f5f5',
    },
    content: {
      zh: {
        title: 'AI 履歷健檢｜前端架構與流程整合',
        company: '1111 人力銀行',
        role: '前端架構、主要流程與共用彈窗整合',
        summary: '負責 AI 履歷健檢的前端架構與主要操作流程，並導入自己開發的 Popup Web Component，由專案傳入所需內容，重用共用彈窗模板。',
        background: '協助求職者依目標職缺或理想職類進行履歷健檢，取得履歷優化建議。',
        highlights: [
          '規劃前端架構與履歷健檢主要流程。',
          '整合履歷選取、求職目標設定與送出健檢。',
          '接入自己開發的 Popup Web Component，依專案傳入內容。',
        ],
        contributions: [
          '負責前端架構與主要操作流程，串起履歷選取、求職目標設定與送出健檢。',
          '整合求職目標的操作入口，支援搜尋職缺、貼上 1111 職缺網址，或選擇理想職類。',
          '導入自己開發的 Web Component 彈窗模板，由各專案傳入所需內容，整合不同業務情境的彈窗。',
        ],
        implementation: [
          {
            title: '彈窗模板共用，內容由專案提供',
            description: '將彈窗的共用結構與互動封裝為 Web Component，各專案負責提供內容與串接業務流程，讓同一套模板能跨專案重用，減少重複開發。',
          },
        ],
        liveLabel: '體驗 AI 履歷健檢',
        coverAlt: '1111 AI 履歷健檢網站的履歷選取與求職目標設定畫面',
        relatedNote: '更多跨網站元件封裝與接入經驗，見「1111 主站 × 活動網站｜Web Components 共用整合」。',
      },
      en: {
        title: 'AI Resume Check: Frontend Architecture & Workflow Integration',
        company: '1111 Job Bank',
        role: 'Frontend architecture, core workflows & shared dialog integration',
        summary: 'Owned the frontend architecture and core resume-check workflow, integrating a Popup Web Component I built so projects can supply their own content while reusing the shared dialog template.',
        background: 'Helps job seekers review their resumes against a target job or preferred job category and receive suggestions for improvement.',
        highlights: [
          'Planned frontend architecture and the core resume-check workflow.',
          'Connected resume selection, job-target setup and review submission.',
          'Integrated my reusable Popup Web Component with project-specific content.',
        ],
        contributions: [
          'Owned frontend architecture and the core workflow connecting resume selection, job-target setup and review submission.',
          'Integrated job-target inputs supporting job search, a pasted 1111 job URL or a preferred job category.',
          'Integrated a Web Component dialog template I built, with each project supplying content for its own business context.',
        ],
        implementation: [
          {
            title: 'Share the dialog template; supply content from each project',
            description: 'Encapsulated shared dialog structure and interactions in a Web Component. Each project supplies its content and connects its own workflow, allowing the template to be reused across projects with less duplicated implementation.',
          },
        ],
        liveLabel: 'Try AI Resume Check',
        coverAlt: '1111 AI Resume Check website showing resume selection and job-target setup',
        relatedNote: 'For more cross-site component packaging and integration work, see “1111 Main Site × Campaign Sites — Shared Web Components.”',
      },
    },
  },
  {
    slug: 'evbus-operations',
    order: -30,
    categories: ['applications'],
    period: '2026',
    stack: ['Vue 3', 'TypeScript', 'PrimeVue', 'SignalR'],
    deployment: 'unknown',
    requiresLogin: true,
    relatedSlugs: ['enterprise-framework'],
    content: {
      zh: {
        title: '電動巴士營運管理系統',
        company: '重高科技 · 鴻海駐點',
        role: '基礎模組調整、人車指派開發與 API 協作',
        summary:
          '維護路線、時刻表、駕駛員與車輛管理模組，並以既有仕業總表為基礎，開發人車指派介面，與後端協作調整資料欄位、API 串接與操作流程。',
        highlights: [
          '日常 Jira 工單與基礎模組維護。',
          '配合人車指派需求，擴充既有模組與 API 的人員、車輛資料。',
          '開發人車指派畫面與操作功能。',
        ],
        background:
          '專案已有完成串接的仕業總表。後續為支援人車指派，我在公司的 Vue 自有框架上調整相關基礎模組與 API，補上所需的人員、車輛資料，再銜接人車指派操作。',
        contributions: [
          '日常維護：依 Jira 工單調整路線、時刻表、駕駛員、車輛管理及跨場站支援等模組，處理表單、檢核、分頁與排序問題。',
          '人車指派：沿用既有仕業總表，配合人員與車輛資料調整基礎模組，開發人車指派畫面與操作功能，處理載入狀態、人車指派結果顯示與異常提示。',
          'API 協作：與後端討論人員、車輛相關欄位、請求參數及結果格式，配合人車指派需求調整 API 資料對應與前端流程。',
        ],
        relatedNote: '這些模組如何沿用公司的分層架構，見自有框架案例。',
      },
      en: {
        title: 'Electric Bus Operations Platform',
        company: '重高科技股份有限公司 · On assignment at Foxconn',
        role: 'Core module updates, driver–vehicle assignment & API collaboration',
        summary:
          'Maintained route, timetable, driver and vehicle management modules, and developed driver–vehicle assignment interfaces based on existing duty rosters. Worked with backend engineers on data fields, API integration and frontend workflows.',
        highlights: [
          'Day-to-day Jira tickets and core module maintenance.',
          'Extended existing modules and APIs with driver and vehicle data for driver–vehicle assignment.',
          'Developed driver–vehicle assignment interfaces and interactions.',
        ],
        background:
          "Duty roster integration was already in place. To support driver–vehicle assignment, I worked within the company's Vue-based framework to update related modules and APIs, add the required driver and vehicle data, and connect the driver–vehicle assignment workflow.",
        contributions: [
          'Daily maintenance: resolved Jira tickets across route, timetable, driver, vehicle and cross-depot support modules, covering forms, validation, pagination and sorting.',
          'Driver–vehicle assignment: built on existing duty rosters, updated core modules to support driver and vehicle data, and developed driver–vehicle assignment interfaces with loading states, result views and error feedback.',
          'API collaboration: discussed driver and vehicle fields, request parameters and result formats with backend engineers, then adjusted API data mapping and frontend workflows for driver–vehicle assignment requirements.',
        ],
        relatedNote:
          "See the framework case for how these modules use the company's layered architecture.",
      },
    },
  },
  {
    slug: 'voice-service-console',
    order: -20,
    categories: ['applications'],
    period: '2026',
    stack: [
      'Vue 3',
      'TypeScript',
      'REST API / SSE',
      'Three.js',
      'Tailwind CSS',
    ],
    deployment: 'unknown',
    requiresLogin: true,
    relatedSlugs: ['enterprise-framework'],
    content: {
      zh: {
        title: '智能客服語音管理平台',
        company: '重高科技 · 鴻海駐點',
        role: '專案初期前端開發、功能畫面與 API／SSE 串接',
        summary:
          '參與從 0 開始的客服平台開發，負責進線列表、通話內頁、Digital Twin 與案件管理，並共同開發即時數據及數據總覽，完成畫面、REST API 與 SSE 事件串接。',
        highlights: [
          '從專案初期參與畫面與功能開發。',
          '整合數據看板、Digital Twin 與案件管理。',
          '重點處理進線列表的 API 查詢與 SSE 通話狀態。',
        ],
        background:
          '平台供客服與主管查看營運數據、處理進線與追蹤案件。我在公司既有的 Vue 自有框架上開發業務畫面，與後端協作確認資料欄位、API 回應及事件格式。',
        contributions: [
          '即時數據：共同開發服務線看板，串接進線量、等候情況與話務員狀態 API，透過定期刷新更新畫面。',
          '數據總覽：共同開發服務線與日期篩選、績效、滿意度及服務品質圖表，將統計 API 資料轉為可閱讀的指標與趨勢。',
          'Digital Twin：建置 3D 客服場景、專區與話務員資訊面板，整合服務線及績效資料，依點選項目載入詳細資訊。',
          '案件管理：開發案件列表、詳情與狀態操作，串接查詢及更新 API，並將通話資料帶入案件建立表單。',
          '進線列表與通話內頁：實作查詢與詳情畫面，串接錄音、逐字稿、摘要、AI 建議及品質覆核，整合非即時資料與 SSE 通話中狀態。',
        ],
        contributionDetails: {
          title: '進線列表與內頁：非即時與通話中',
          groups: [
            {
              title: '非即時狀態｜API 查詢',
              description:
                '透過 API 查詢既有進線紀錄，支援搜尋、篩選、排序與分頁。進入內頁後檢視錄音、逐字稿、摘要與品質評估，依角色進行覆核或建立案件。',
            },
            {
              title: '通話中狀態｜SSE 更新',
              description:
                '列表接收接聽、掛斷事件後刷新；內頁依通話 ID 更新狀態、逐字稿與 AI 建議，將 API 載入的逐字稿與後續串流接續顯示，避免其他通話干擾目前畫面。',
            },
          ],
        },
        relatedNote: '頁面分層與生命週期的擴充方式，見公司自有框架案例。',
      },
      en: {
        title: 'Intelligent Voice Customer Service Platform',
        company: '重高科技股份有限公司 · On assignment at Foxconn',
        role: 'Frontend development from project inception, UI & API/SSE integration',
        summary:
          'Joined a new customer service platform from the start, building call lists and detail views, Digital Twin and case management. Co-developed live metrics and analytics dashboards with the team, connecting interfaces to REST APIs and SSE events.',
        highlights: [
          'Developed interfaces and features from project inception.',
          'Integrated dashboards, Digital Twin and case management.',
          'Focused on API-based call queries and live SSE call states.',
        ],
        background:
          "The platform helps agents and supervisors monitor operations, handle calls and track cases. I built business interfaces on the company's existing Vue-based framework and worked with backend engineers on data fields, API responses and event formats.",
        contributions: [
          'Live metrics: co-developed service-line dashboards, integrating call volume, queue and agent-status APIs with periodic refreshes.',
          'Analytics: co-developed service-line and date filters plus performance, satisfaction and service-quality charts, mapping statistics APIs to readable metrics and trends.',
          'Digital Twin: built a 3D customer service scene with zone and agent information panels, integrating service-line and performance data and loading details on selection.',
          'Case management: developed lists, details and status actions, connected query and update APIs, and carried call data into case creation forms.',
          'Call lists and detail views: built query and detail interfaces with recordings, transcripts, summaries, AI suggestions and quality reviews, combining existing records with live SSE call states.',
        ],
        contributionDetails: {
          title: 'Call lists and details: existing records vs. live calls',
          groups: [
            {
              title: 'Non-live state | API queries',
              description:
                'Query existing call records with search, filters, sorting and pagination. Detail views provide recordings, transcripts, summaries and quality assessments, with role-based review actions and case creation.',
            },
            {
              title: 'Live call state | SSE updates',
              description:
                'Answer and hangup events refresh the list. Detail views match events by call ID to update status, transcripts and AI suggestions, merging API-loaded transcripts with incoming entries while filtering out other calls.',
            },
          ],
        },
        relatedNote:
          'See the internal framework case for page layering and lifecycle extensions.',
      },
    },
  },
  {
    slug: 'map-editor-platform',
    order: -10,
    categories: ['applications'],
    period: '2026',
    stack: ['Vue 3', 'TypeScript', 'Konva', 'Vitest', 'GeoJSON / Shapefile'],
    deployment: 'unknown',
    requiresLogin: true,
    relatedSlugs: ['enterprise-framework'],
    content: {
      zh: {
        title: '圖資編輯平台與外部檢視 SDK',
        company: '重高科技 · 鴻海駐點',
        role: '圖資編輯器重構、畫布互動與 SDK／匯出整合',
        summary:
          '參與既有圖資系統重構，維護畫布編輯、屬性面板與復原／重做，加入局部更新；並開發外部唯讀檢視 SDK，整合 GeoJSON／Shapefile 匯出及錯誤提示。',
        highlights: [
          '重構圖資編輯器，保留既有資料與操作。',
          '調整畫布互動與屬性面板，加入局部更新。',
          '開發唯讀檢視 SDK，整合圖形格式匯出。',
        ],
        background:
          '系統用於繪製與編輯道路、路口及事故圖資。我在既有專案上重構編輯器，保留原有資料與編輯流程，並擴充外部網站檢視與檔案匯出功能。',
        contributions: [
          '編輯器重構：拆分資料、幾何計算、場景與渲染模組，搭配回歸測試確認舊資料及編輯行為的相容性。',
          '畫布與屬性操作：調整拖曳、控制點、圖層鎖定及屬性面板，處理復原／重做後的選取與畫面同步。',
          '局部更新：依物件、道路與路口的變更範圍更新畫布，重用未變動的圖形資料，減少不必要的重新計算。',
          '外部檢視 SDK：提供唯讀圖資載入、縮放與平移，處理新舊 JSON 格式、打包圖片路徑及檢視器資源清理。',
          '圖形匯出：整合 GeoJSON 與 Shapefile 下載介面，串接座標系統與匯出範圍設定，顯示格式警告並阻止無效資料下載。',
        ],
        implementation: [
          {
            title: '從原生頁面到 Vue 工作區',
            description:
              '原系統以 HTML、CSS 與 JavaScript 開發；初步移植 Vue 後，工作區的畫面、狀態與操作邏輯主要集中在 workspace.vue。後續重構將它收斂為版面與模組組裝入口。',
          },
          {
            title: '依功能拆開畫面與互動',
            description:
              '先盤點各功能使用的狀態、函式與樣式，再將標線、文字、事故物件等拆成獨立 feature，包含屬性面板、狀態、資料轉換與拖曳控制；共用邏輯則整理到 composables 與互動模組。',
          },
          {
            title: '分離資料、計算與繪圖核心',
            description:
              '將核心拆成資料模型、幾何、場景、Konva／SVG 渲染及匯出模組。透過 Command／Patch 統一資料修改與復原／重做，讓繪圖、匯出與外部唯讀 SDK 能沿用共用核心。',
          },
          {
            title: '保留舊行為，逐步遷移',
            description:
              '先抽離純函式與資料表，保留既有呼叫方式，再逐項調整模組責任。每次遷移搭配舊資料、操作與畫面回歸檢查，後續再加入局部更新與共用屬性元件。',
          },
        ],
        relatedNote:
          '圖資編輯器採專用核心；與電巴、智能客服所用業務框架的差異，見公司自有框架案例。',
      },
      en: {
        title: 'Map Editing Platform & External Viewer SDK',
        company: '重高科技股份有限公司 · On assignment at Foxconn',
        role: 'Map editor refactoring, canvas interactions & SDK/export integration',
        summary:
          'Contributed to refactoring an existing map editor, maintaining canvas interactions, property panels and undo/redo while adding incremental updates. Built an external read-only viewer SDK and integrated GeoJSON/Shapefile exports with error feedback.',
        highlights: [
          'Refactored the map editor while preserving existing data and workflows.',
          'Updated canvas interactions and property panels with incremental updates.',
          'Built a read-only viewer SDK and integrated GeoJSON and Shapefile exports.',
        ],
        background:
          'The system supports drawing and editing road, junction and accident diagrams. I refactored the existing editor while preserving its data and editing workflows, and extended it with external viewing and file exports.',
        contributions: [
          'Editor refactoring: separated data, geometry, scene and rendering modules, using regression tests to check compatibility with legacy data and editing behavior.',
          'Canvas and property controls: updated dragging, handles, layer locking and property panels, keeping selection and the canvas in sync after undo and redo.',
          'Incremental updates: limited canvas rebuilds to affected objects, roads and junctions, reusing unchanged graphic data to reduce unnecessary computation.',
          'External viewer SDK: provided read-only map loading, zoom and pan, handling legacy and new JSON formats, bundled image paths and viewer cleanup.',
          'GeoJSON and Shapefile exports: integrated GeoJSON and Shapefile download interfaces with coordinate-system and export-scope settings, format warnings and guards against invalid downloads.',
        ],
        implementation: [
          {
            title: 'From plain HTML, CSS and JavaScript to a Vue workspace',
            description:
              'The original system used HTML, CSS and JavaScript. After the initial Vue migration, most workspace UI, state and interaction logic was concentrated in workspace.vue. Further refactoring made it primarily a layout and module composition entry point.',
          },
          {
            title: 'Separate UI and interactions by feature',
            description:
              'Mapped the state, functions and styles used by each feature, then grouped markings, text and accident objects into feature modules with their own property panels, state, data conversion and drag controls. Shared behavior moved into composables and interaction modules.',
          },
          {
            title: 'Separate data, computation and rendering',
            description:
              'Split the core into data models, geometry, scenes, Konva/SVG rendering and exports. Commands and patches unified document changes with undo/redo, allowing rendering, exports and the external read-only SDK to reuse the same core.',
          },
          {
            title: 'Migrate gradually while preserving existing behavior',
            description:
              'First extracted pure functions and data tables while preserving existing call sites, then refined module responsibilities. Each migration used legacy-data, interaction and visual regression checks, followed by incremental updates and shared property controls.',
          },
        ],
        relatedNote:
          'The map editor uses a dedicated core. See the internal framework case for how it differs from the business framework used by the bus and voice platforms.',
      },
    },
  },
  {
    slug: 'enterprise-framework',
    order: -40,
    categories: ['architecture'],
    period: '2026',
    stack: ['Vue 3', 'TypeScript', 'OOP', 'Service / Controller / Entity / UI'],
    deployment: 'unknown',
    requiresLogin: false,
    relatedSlugs: [
      'evbus-operations',
      'voice-service-console',
      'map-editor-platform',
    ],
    content: {
      zh: {
        title: '公司自有框架｜物件導向分層與擴充',
        company: '重高科技 · 鴻海駐點',
        role: '既有框架應用、共用層擴充與維護',
        summary:
          '公司在 Vue 之上，以物件導向方式組織 Service、Controller、Entity 與 UI，讓前端資料結構與後端 Model 的領域邏輯對齊。我沿用這套分層開發業務模組，並擴充分頁取數、排序與頁面資源清理。',
        highlights: [
          '沿用公司既有的 class、介面與繼承規範，開發業務模組。',
          '以 Service／Controller／Entity／UI 四層分工，連接後端 Model 與前端操作。',
          '在共用規範與特殊業務需求之間，選擇合適的擴充位置。',
        ],
        background:
          '企業管理介面有大量重複的查詢、表單與表格。公司以 TypeScript class、介面與繼承建立共用基礎，讓前後端沿用相近的領域命名與資料契約，再由頁面控制器組合操作流程。Vue 仍負責畫面與響應式更新；自有框架則規範業務程式如何組織。',
        architectureOverview: {
          layers: {
            title: '四層各自負責什麼',
            groups: [
              {
                title: 'Service｜資料操作',
                description:
                  '封裝 API 呼叫、查詢條件與新增／更新流程，整理分頁、排序等參數，讓控制器透過一致的操作介面取得結果。',
              },
              {
                title: 'Controller｜流程與狀態',
                description:
                  '組裝頁面欄位與操作，接收 UI 事件、呼叫 Service，並管理頁面狀態與資源生命週期，將結果交回 UI 呈現。',
              },
              {
                title: 'Entity｜模型與轉換',
                description:
                  '對應後端 Model 的欄位與關聯，承接 API 資料，搭配轉換方法把表單值整理成送出資料，並提供部分欄位顯示資訊。',
              },
              {
                title: 'UI｜呈現與互動',
                description:
                  '由 Vue 與共用元件呈現表單、表格及對話框，接收使用者輸入與操作，交由 Controller 處理，並依頁面狀態更新畫面。',
              },
            ],
          },
          comparison: {
            title: '與一般 Vue／Nuxt 專案的差異',
            intro:
              'Vue 提供元件與響應式能力，Nuxt 在 Vue 之上整合路由、SSR 等應用能力；這套自有框架則在 Vue 之上增加公司的業務分層與頁面規範。',
            columns: ['比較面向', '公司自有框架', '一般 Vue／Nuxt 專案'],
            rows: [
              {
                aspect: '開發起點',
                company:
                  '繼承基底 Controller、Service 與 Entity，再設定欄位與操作。',
                typical:
                  '以元件、composables 與 API 模組組合功能，業務分層由團隊決定。',
              },
              {
                aspect: '資料對應',
                company:
                  '以 Entity 對應後端 Model，配合共用轉換處理表單與 API 資料。',
                typical:
                  '可用型別、一般物件與 mapper；是否採 Entity class 由專案決定。',
              },
              {
                aspect: '共用方式',
                company:
                  '基底類別、固定介面與欄位設定，統一相似管理頁的開發方式。',
                typical:
                  '常透過元件與函式組合重用邏輯，也能加入同樣的 OOP 分層。',
              },
              {
                aspect: '客製方式',
                company:
                  '優先沿用框架擴充點；特殊互動可能需要跨 Controller、轉接層與元件修改。',
                typical:
                  '可直接設計元件與狀態流程；跨頁一致性需要另訂團隊規範。',
              },
            ],
          },
          tradeoffs: {
            title: '優點、代價與我的判斷',
            benefitsTitle: '帶來的好處',
            benefits: [
              '相似管理頁可沿用欄位與操作規範，減少重複組裝。',
              '前後端領域命名與資料結構較一致，方便討論欄位和 API 契約。',
              '共用能力修正在基底，同一專案的多個業務模組可以沿用。',
            ],
            costsTitle: '需要承擔的代價',
            costs: [
              '除了 Vue，還要理解類別繼承、控制器與轉接流程，初期上手和除錯成本較高。',
              'Entity、表單與後端契約存在耦合，欄位變更可能牽動多層，仍需明確處理空值與格式。',
              '特殊互動需要額外擴充；各案維護不同版本時，共用修正也需要分別確認。',
            ],
            judgment:
              '我的判斷：它適合資料模型穩定、管理頁重複度高的產品。對即時工作台等特殊介面，我會保留業務狀態與互動的彈性，只把多個模組確實需要的能力放進共用層。',
          },
        },
        contributions: [
          '沿用既有分層，完成電巴營運與語音客服模組的業務接入。',
          '擴充共用 Service 的逐頁取數，讓需要完整集合的查詢能重用。',
          '接通表格事件、轉接層、Controller 與 API 的伺服器排序，採可選設定保留原有行為。',
          '接入頁面清理生命週期，讓即時通話 Controller 能在離頁時解除訂閱、清除計時器。',
        ],
        collaboration:
          '原有框架由公司團隊建立並共同維護；我負責業務應用、具體擴充與修正。電巴與語音客服在各自程式庫維護同源基礎。',
        relatedNote:
          '電巴與語音客服展示這套基礎的實際應用；圖資平台另採專用核心，可對照不同業務的架構需求。',
      },
      en: {
        title: 'Company Framework: OOP Layers & Extensions',
        company: '重高科技股份有限公司 · On assignment at Foxconn',
        role: 'Existing framework integration, shared-layer extensions & maintenance',
        summary:
          'The company organizes Service, Controller, Entity and UI layers on top of Vue using object-oriented design, aligning frontend data structures with backend domain models. I applied these conventions to business modules and extended paginated retrieval, sorting and page cleanup.',
        highlights: [
          'Developed business modules using the company’s existing conventions for classes, interfaces and inheritance.',
          'Four layers—Service, Controller, Entity and UI—connect backend models to user interactions.',
          'Selected extension points that balance shared conventions with business-specific needs.',
        ],
        background:
          'Management applications repeat many search, form and table patterns. The company uses TypeScript classes, interfaces and inheritance to establish a shared foundation, align domain terminology and data contracts, and compose workflows through page controllers. Vue handles rendering and reactivity; the internal framework defines how business code is organized.',
        architectureOverview: {
          layers: {
            title: 'What each of the four layers does',
            groups: [
              {
                title: 'Service · Data operations',
                description:
                  'Encapsulates API calls, queries and create/update workflows. Prepares pagination and sorting parameters so controllers can request data through consistent operation interfaces.',
              },
              {
                title: 'Controller · Workflow & state',
                description:
                  'Configures page fields and actions, handles UI events, and calls services. Manages page state and resource lifecycles, then passes results back to the UI.',
              },
              {
                title: 'Entity · Models & mapping',
                description:
                  'Represents backend fields and relationships, receives API data, and works with conversion methods to map form values into request data. Also supplies some field display metadata.',
              },
              {
                title: 'UI · Rendering & interaction',
                description:
                  'Vue and shared components render forms, tables and dialogs, pass user input and actions to controllers, and update the view from page state.',
              },
            ],
          },
          comparison: {
            title: 'How this differs from a typical Vue / Nuxt project',
            intro:
              'Vue provides components and reactivity; Nuxt integrates application features such as routing and SSR on top of Vue. This internal framework adds company-specific business layers and page conventions to Vue.',
            columns: [
              'Aspect',
              'Company framework',
              'Typical Vue / Nuxt project',
            ],
            rows: [
              {
                aspect: 'Starting point',
                company:
                  'Extend base controllers, services and entities, then configure fields and actions.',
                typical:
                  'Compose components, composables and API modules; the team defines the business layers.',
              },
              {
                aspect: 'Data mapping',
                company:
                  'Entities align with backend models, with shared conversion for forms and API data.',
                typical:
                  'Types, plain objects and mappers are possible; entity classes are a project choice.',
              },
              {
                aspect: 'Reuse',
                company:
                  'Base classes, fixed interfaces and field configuration standardize similar management pages.',
                typical:
                  'Components and functions commonly compose reusable logic; OOP layers can be added too.',
              },
              {
                aspect: 'Customization',
                company:
                  'Use framework extension points; unusual interactions may cross controllers, adapters and components.',
                typical:
                  'Design components and state flows directly; cross-page consistency needs team conventions.',
              },
            ],
          },
          tradeoffs: {
            title: 'Benefits, costs & my assessment',
            benefitsTitle: 'What it helps with',
            benefits: [
              'Similar management pages reuse field and action conventions, reducing repeated assembly.',
              'Aligned domain terminology and data structures make field and API-contract discussions easier.',
              'Shared fixes can serve several business modules within the same project.',
            ],
            costsTitle: 'What it costs',
            costs: [
              'Developers must learn inheritance, controllers and adapters alongside Vue, increasing onboarding and debugging effort.',
              'Coupling between entities, forms and backend contracts can spread field changes across layers; nulls and formats still need explicit handling.',
              'Special interactions need extensions, and diverging project versions require separate checks when applying shared fixes.',
            ],
            judgment:
              'My assessment: this approach fits stable data models and repetitive management screens. For specialized interfaces such as live workspaces, I keep business state and interactions flexible and promote only genuinely shared needs into the common layer.',
          },
        },
        contributions: [
          'Integrated bus operations and voice-service modules through the existing layers.',
          'Extended shared services with sequential pagination for queries that require complete collections.',
          'Connected table events, adapters, controllers and API sorting, making the behavior opt-in to preserve existing tables.',
          'Integrated page cleanup so live-call controllers can unsubscribe and clear timers when leaving a page.',
        ],
        collaboration:
          'The company team created and jointly maintains the original framework. My contribution is business integration, targeted extensions and fixes. Bus operations and voice services maintain related foundations in separate repositories.',
        relatedNote:
          'Bus operations and voice services show the framework in use. The mapping platform uses a dedicated core, offering a comparison of different architectural needs.',
      },
    },
  },
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
          '親自設計並實作 AI 小精靈、履歷匯入與篩選清單的 Web Components 封裝，將主站功能接入不同活動網站。',
        background:
          '1111 的活動網站面向不同主題與使用情境，需要接入主站既有服務。這項工作將共通功能整理為可跨網站使用的前端元件。',
        contributions: [
          '親自設計並實作主站功能的 Web Components 封裝，供不同活動網站共用；各活動頁負責接入與自身流程，減少重複實作。',
          '協助組員釐清 props 傳遞、元件內容對應與接入方式，排查跨專案整合問題。',
        ],
        implementation: [
          {
            title: '把 props 與元件內容的對應納入接入設計',
            description:
              '我的整合工作不只把元件放進頁面，也包含設計外部設定如何傳入、對應到元件內容，以及互動結果如何交回活動頁。協助組員排查時，會從 props 的來源及內容對應確認問題，區分宿主頁的接入工作與元件內的功能。',
          },
          {
            title: '共用功能集中，活動流程留在宿主頁',
            description:
              'AI 小精靈、履歷匯入與篩選清單由共用元件提供；各活動頁組織自己的內容與操作流程。這個選擇減少功能複製，但也要求元件的輸入與回傳責任清楚，不能讓活動頁依賴元件內部的畫面組織。',
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
        title: '1111 Main Site × Campaign Sites — Shared Web Components',
        company: '1111 Job Bank',
        role: 'Web Components architecture, implementation & cross-site integration',
        summary:
          'Personally designed and implemented Web Components for the AI assistant, résumé import, and filter lists, integrating main-site functionality into different campaign sites.',
        background:
          '1111 campaign sites serve different topics and audiences while drawing on existing main-site services. This work packaged shared functionality as frontend components for use across those sites.',
        contributions: [
          'Personally designed and implemented shared Web Components for main-site features, reducing duplicated implementation while each campaign page handles integration and its own flow.',
          'Helped teammates clarify prop passing, content mapping and component integration, and troubleshoot cross-project issues.',
        ],
        implementation: [
          {
            title: 'Make prop-to-content mapping part of integration',
            description:
              'My work covered how external configuration reaches component content and how interaction results return to the campaign page. When helping teammates troubleshoot, I traced prop sources and content mapping to distinguish host-page integration from the component’s own functionality.',
          },
          {
            title: 'Share the feature; keep the campaign flow in the host',
            description:
              'Shared components provide AI assistance, résumé import, and filtering, while campaign pages organize their own content and flows. This avoids separate copies of features, but requires clear inputs and outputs so host pages do not depend on a component’s internal presentation.',
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
        challenge:
          '重構既有管理介面時，我需要把畫面需求整理成可與後端討論的資料及操作需求，同時決定哪些介面由 Naive UI 提供、哪些流程由頁面承擔。',
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
          'Refactoring the existing console required translating interface needs into data and operation requirements for backend discussions, while deciding what Naive UI should provide and what each page must handle.',
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
          '負責嚴選職缺入口與企業內頁的前端架構及元件設計，依展示區塊分工，與團隊共同實作。',
        background:
          '嚴選職缺由入口頁匯集企業與工作機會，再由企業內頁呈現公司介紹及職缺。開發範圍同時涵蓋入口與企業頁的組合方式。',
        contributions: [
          '負責入口與企業頁的元件規劃，依展示區塊安排組員分工，並參與實作與整合。',
        ],
        implementation: [
          {
            title: '企業介紹與職缺列表的不同責任',
            description:
              '以本頁的大苑子企業頁畫面為例：公司介紹承載該企業的品牌內容，職缺列表則呈現工作機會。我的元件規劃把兩種展示責任分開；企業頁組合區塊，共用元件承擔可沿用的展示方式，企業專屬內容留在對應頁面。',
          },
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
        role: 'Frontend architecture, employer-page components & task allocation',
        summary:
          'Owned frontend architecture and component design for the Curated Opportunities landing page and employer pages, dividing work by presentation section and building with the team.',
        background:
          'The landing page brings together employers and job opportunities, while individual employer pages present company profiles and openings. My scope covered both the entry point and how employer pages were composed.',
        contributions: [
          'Planned components for the landing page and employer pages, allocated work by presentation section, and contributed to implementation and integration.',
        ],
        implementation: [
          {
            title:
              'Company introductions and job lists serve different purposes',
            description:
              'The Da Yung employer page shown here illustrates the distinction: its introduction carries company-specific brand content, while the job list presents available roles. My component planning separated these responsibilities. Employer pages compose the sections, shared components provide reusable presentation, and company-specific content stays with the relevant page.',
          },
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
        role: '既有網站重構、前端架構與功能模組拆分',
        summary:
          '參與既有新鮮人專區的前端重構，負責架構與可重用功能模組的規劃，在保留原有使用流程的前提下，與團隊整理頁面及共用邏輯。',
        background:
          '新鮮人專區已提供初入職場者的求職資訊與服務。這項工作面對的是持續運作的網站，需要承接既有使用流程，再調整前端結構。',
        contributions: [
          '規劃重構後的頁面與功能模組邊界，安排組員分工，並共同完成既有介面的重構與整合。',
        ],
        implementation: [
          {
            title: '與畢業季活動的區分',
            description:
              '重構重點在程式的組織方式，與另行製作畢業季活動的參與資訊頁不同。',
          },
        ],
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
        implementation: [
          {
            title: 'Distinct from the graduation campaign',
            description:
              'This work focused on code organization, distinct from building the separate graduation campaign’s participation pages.',
          },
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
        role: '參與流程介面、活動組件與前端整合',
        summary:
          '將畢業季的參與條件、履歷更新步驟與獎勵資訊組織為活動介面，負責前端結構與組件規劃，與團隊完成頁面開發。',
        background:
          '2025 畢業季活動延伸自新鮮人專區。公開頁面依序說明會員登入、手機／信箱雙認證與更新履歷，並提供報名入口及獎勵資訊。',
        contributions: [
          '規劃參與條件、操作步驟與獎勵說明的前端呈現，並與組員共同實作、整合活動頁面。',
        ],
        implementation: [
          {
            title: '先交代前置條件，再銜接報名入口',
            description:
              '頁面依「登入 → 手機與 Email 認證 → 更新履歷 → 報名」呈現參與脈絡；步驟說明承接前置條件與下一步，獎勵資訊另作區塊。我負責這些內容的前端結構、組件規劃與團隊整合，讓報名入口有清楚的上下文。',
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
        implementation: [
          {
            title: 'Explain prerequisites before the registration entry point',
            description:
              'The page presents participation as sign-in → phone and email verification → résumé update → registration. Step guidance explains prerequisites and what comes next, while rewards occupy a separate section. I owned the frontend structure, component planning, and team integration of this content so the registration entry point had a clear context.',
          },
        ],
      },
    },
  },
  {
    slug: 'campus-recruitment',
    order: 50,
    categories: ['websites'],
    stack: ['Vue', 'TypeScript', 'Pinia'],
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
          '規劃多個搜尋入口與產業分類的狀態架構，區分共用搜尋條件、標籤操作與各模組的局部互動，降低跨模組耦合。',
          '親自實作狀態管理與操作範例，作為團隊功能分工與整合的依據。',
        ],
        implementation: [
          {
            title: '搜尋狀態管理',
            description:
              '以 Pinia 管理跨元件搜尋條件，元件各自保留局部互動狀態。',
          },
          {
            title: '共用標籤操作',
            description:
              '將搜尋標籤的移除、清除整理為 composable，供各搜尋入口共用。',
          },
          {
            title: '團隊實作範例',
            description: '撰寫狀態管理與操作範例，供團隊沿用並整合搜尋模組。',
          },
        ],
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
          'Designed state architecture for multiple search entry points and industry categories, separating shared search conditions, tag operations and local interactions to reduce coupling between modules.',
          'Personally implemented state-management and interaction examples to guide feature allocation and team integration.',
        ],
        implementation: [
          {
            title: 'Search state management',
            description:
              'Used Pinia for shared search conditions and kept local interaction state within each component.',
          },
          {
            title: 'Shared tag operations',
            description:
              'Extracted tag removal and clearing into a composable shared across search entry points.',
          },
          {
            title: 'Team implementation examples',
            description:
              'Wrote state-management and interaction examples for the team to reuse when integrating search modules.',
          },
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
        role: '獎勵活動資訊架構與前端介面開發',
        summary:
          '與團隊製作 2025 求職獎勵活動網站，負責前端架構、組件規劃及功能分工。',
        background:
          '1111 的求職獎勵活動，面向想了解獎勵內容與參與方式的求職者。本人開發範圍為 2025 年活動網站。',
        contributions: [
          '依獎勵內容與參與說明規劃頁面及組件，安排組員分工，並共同完成介面實作與整合。',
        ],
      },
      en: {
        title: 'NT$10,000 Job-Search Campaign 2025',
        company: '1111 Job Bank',
        coverNote:
          'Current official visual for the 2026 rewards campaign; this case covers the 2025 project.',
        role: 'Rewards-campaign information architecture & frontend interfaces',
        summary:
          'Built the 2025 job-search rewards campaign with the team, owning frontend architecture, component planning, and feature allocation.',
        background:
          'A 1111 campaign for job seekers exploring job-search rewards and how to participate. My development work covered the 2025 campaign site.',
        contributions: [
          'Planned pages and components around rewards and participation guidance, allocated team responsibilities, and collaborated on interface implementation and integration.',
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
          '獨立設計 Nuxt 3 活動模板，將專案起建、套件配置與組件規劃整理為團隊可沿用的開發起點。',
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
            title: '起建：先把共通設定準備好',
            description:
              '建立活動專案並安裝、配置所需套件，整理團隊沿用的專案結構及基本版型。模板承接這些開案工作，活動需求再從這個起點往下開發。',
          },
          {
            title: '客製化：讓活動內容留在活動範圍',
            description:
              '以活動資訊與參與流程為例：模板提供可沿用的結構及組件基底，各活動自己的文字、視覺與步驟由該案實作。相比把所有特殊需求放進共用基底，這個分界保留了活動調整的空間。',
          },
          {
            title: '分工：以架構與組件規劃拆解工作',
            description:
              '我先完成架構及組件規劃，再依功能安排組員工作。模板回答「活動專案如何起建」；需要主站的 AI 小精靈、履歷匯入或篩選清單時，則是另一套 Web Components 的接入工作。',
          },
        ],
      },
      en: {
        title: 'Campaign Templates & Shared Components',
        company: '1111 Job Bank',
        role: 'Frontend architecture, templates & shared components',
        summary:
          'Independently designed Nuxt 3 campaign templates, turning project setup, package configuration, and component planning into a reusable starting point for the team.',
        background:
          'Campaign sites need different interfaces and features, but each needs a starting point. This work organized project structure, templates, and module foundations into a base the team could reuse.',
        contributions: [
          'Independently designed and developed campaign templates and architectural foundations, defining setup, directory conventions, and feature boundaries, and introducing Nuxt 3 into campaign development and refactoring.',
        ],
        outcomes: [
          'The team used these templates in collaborative projects as the starting point for feature development.',
        ],
        relatedNote:
          'See “1111 Main Site × Campaign Sites — Shared Web Components” for the integration of main-site features across campaign sites.',
        challenge:
          'Campaigns differ in design and flow, yet repeatedly need project structure, base layouts, common interactions, and configuration. Rebuilding these separately would fragment setup and handover practices.',
        implementation: [
          {
            title: 'Setup: prepare the common foundation',
            description:
              'Created campaign projects, installed and configured required packages, and organized shared project structure and base layouts. The template captures this setup work so campaign-specific development can start from that foundation.',
          },
          {
            title: 'Customization: keep campaign content within its own scope',
            description:
              'For campaign information and participation flows, the template supplies reusable structure and component foundations, while each project implements its own copy, design, and steps. Compared with placing every special requirement in the shared base, this boundary preserves room for campaign changes.',
          },
          {
            title: 'Teamwork: allocate features from the architecture',
            description:
              'I planned the architecture and components before allocating feature work to teammates. Templates answer how to start a campaign project. Integrating the main site’s AI assistant, résumé import, or filter lists belongs to the separate Web Components work.',
          },
        ],
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
        background: '系統分為使用者投票與管理端，兩種角色有各自的操作介面。',
        contributions: [
          '從零設計前端架構，實作使用者投票介面與管理端介面，並負責前端資料串接。',
        ],
        collaboration:
          '我與一位後端工程師共同討論需求、API 與操作流程；我負責兩端前端介面及資料串接，對方負責伺服器端。',
      },
      en: {
        title: 'Voting System: Public & Admin Interfaces',
        company: 'Sanlih E-Television',
        role: 'Frontend architecture & development',
        summary:
          'Partnered with a backend engineer to build the public and admin interfaces of a voting system from the ground up.',
        background:
          'The system has separate interfaces for public voting and administrative operations.',
        contributions: [
          'Designed the frontend architecture from scratch, implemented the public voting and admin interfaces, and handled frontend API integration.',
        ],
        collaboration:
          'One backend engineer and I discussed requirements, APIs, and workflows together. I handled both frontend interfaces and data integration; my colleague owned the server side.',
      },
    },
  },
];
export function localizeProjects(locale: Locale): Project[] {
  return [...projectRecords]
    .sort((a, b) => a.order - b.order)
    .map(({ content, ...record }) => ({ ...record, ...content[locale] }));
}
