import type { TestimonialRecord } from '../app/types/testimonials';

// Ben confirmed all six names, titles and bilingual quotations for publication
// on 2026-10-11. Source notes describe the editorial origin, not a public label.
// Imported only by the build-time module, never by application components.
export const testimonialRecords: TestimonialRecord[] = [
  {
    id: 'yao',
    displayName: 'Yao',
    role: { zh: '工程部協理', en: 'Associate Director of Engineering' },
    companyGroup: '1111',
    relationship: { zh: '主管', en: 'Manager' },
    quoteZh:
      '阿班能快速理解複雜的業務需求，並轉化為可行的技術方案。在團隊協作中，他也能清楚傳達技術概念，讓需求討論與開發溝通更順暢。',
    quoteEn:
      'Ben quickly understands complex business requirements and turns them into practical technical solutions. He also communicates technical ideas clearly, making requirements discussions and development conversations smoother for the team.',
    avatar: { kind: 'illustration', src: '/avatars/yao.svg' },
    source: {
      kind: 'adapted',
      url: 'https://portfolio-6xd.pages.dev/',
      note: {
        zh: '依舊作品集正面內容節錄、潤飾；Ben 於 2026-10-11 確認姓名、職稱及中英文評語可公開。',
        en: 'Adapted from positive feedback in the previous portfolio. Ben confirmed the name, title and bilingual wording for publication on 2026-10-11.',
      },
    },
    approvedForPublic: true,
    order: 40,
  },
  {
    id: 'ryder',
    displayName: 'Ryder',
    role: { zh: '前端主任', en: 'Frontend Lead' },
    companyGroup: '1111',
    relationship: { zh: '同事', en: 'Colleague' },
    quoteZh:
      '阿班在 Code Review 時會提出具體、具建設性的建議，也能留意容易被忽略的細節。他重視功能完整性，同時兼顧程式碼的可維護性與擴充性。',
    quoteEn:
      'Ben offers specific, constructive suggestions in code reviews and notices details that are easy to overlook. He cares about complete functionality while keeping the code maintainable and extensible.',
    avatar: { kind: 'illustration', src: '/avatars/ryder.svg' },
    source: {
      kind: 'adapted',
      url: 'https://portfolio-6xd.pages.dev/',
      note: {
        zh: '依舊作品集正面內容節錄、潤飾；Ben 於 2026-10-11 確認姓名、職稱及中英文評語可公開。',
        en: 'Adapted from positive feedback in the previous portfolio. Ben confirmed the name, title and bilingual wording for publication on 2026-10-11.',
      },
    },
    approvedForPublic: true,
    order: 50,
  },
  {
    id: 'yichia',
    displayName: 'Yichia',
    role: null,
    companyGroup: '1111',
    relationship: { zh: '同事', en: 'Colleague' },
    quoteZh:
      '阿班在舊專案重構時，能兼顧既有功能穩定與程式結構改善。他建立的共用元件也讓新專案有可重用的基礎，減少重複開發的時間。',
    quoteEn:
      'When refactoring older projects, Ben balances keeping existing features stable with improving the code structure. The shared components he builds also give new projects a reusable foundation, reducing time spent on repeated development.',
    avatar: { kind: 'illustration', src: '/avatars/yichia.svg' },
    source: {
      kind: 'adapted',
      url: 'https://portfolio-6xd.pages.dev/',
      note: {
        zh: '舊站僅標示 member，不另指定職稱；Ben 於 2026-10-11 確認姓名、顯示身分及中英文評語可公開。',
        en: 'The previous site lists “member” only, so no additional job title is assigned. Ben confirmed the name, displayed relationship and bilingual wording for publication on 2026-10-11.',
      },
    },
    approvedForPublic: true,
    order: 60,
  },
  {
    id: 'ricky',
    displayName: 'Ricky',
    role: { zh: '部長／直屬主管', en: 'Department Head / Direct Manager' },
    companyGroup: 'foxconn',
    relationship: { zh: '駐點合作', en: 'On-site collaboration' },
    quoteZh:
      'Ben 能快速掌握公司自有框架，理解既有開發方式並投入專案。駐點期間，他主動分享 AI Agent 與 Skills 的使用經驗，也積極回報開發進度，讓團隊清楚掌握專案狀況，協助開發工作依預定時程推進。',
    quoteEn:
      'Ben quickly gets up to speed with the company’s in-house framework and existing development practices, enabling him to contribute to projects promptly. During his on-site assignment, he proactively shares his experience with AI agents and Skills and keeps the team informed of development progress, helping everyone maintain a clear view of project status and keep the work on schedule.',
    avatar: { kind: 'illustration', src: '/avatars/ricky.svg' },
    source: {
      kind: 'draft',
      note: {
        zh: '原文依 Ben 提供方向代擬，非逐字引述；Ben 於 2026-10-11 確認姓名、職稱及中英文評語可公開。',
        en: 'Originally drafted from Ben’s input rather than a verbatim quotation. Ben confirmed the name, title and bilingual wording for publication on 2026-10-11.',
      },
    },
    approvedForPublic: true,
    order: 10,
  },
  {
    id: 'agnes',
    displayName: 'Agnes',
    role: { zh: 'PM', en: 'PM' },
    companyGroup: 'foxconn',
    relationship: { zh: '駐點合作', en: 'On-site collaboration' },
    quoteZh:
      '與 Ben 合作時，需求溝通順暢，工單處理與回應也很迅速，讓專案需求能有效推進。',
    quoteEn:
      'Working with Ben, requirements are easy to discuss and tickets receive prompt attention and responses, helping project requirements move forward.',
    avatar: { kind: 'illustration', src: '/avatars/agnes.svg' },
    source: {
      kind: 'draft',
      note: {
        zh: '原文依 Ben 提供方向代擬，非逐字引述；Ben 於 2026-10-11 確認職稱及中英文評語可公開，並於 2026-10-13 更正姓名為 Agnes。',
        en: 'Originally drafted from Ben’s input rather than a verbatim quotation. Ben confirmed the title and bilingual wording for publication on 2026-10-11 and corrected the name to Agnes on 2026-10-13.',
      },
    },
    approvedForPublic: true,
    order: 20,
  },
  {
    id: 'maggie',
    displayName: 'Maggie',
    role: { zh: '後端工程師', en: 'Backend Engineer' },
    companyGroup: 'foxconn',
    relationship: { zh: '駐點合作', en: 'On-site collaboration' },
    quoteZh:
      '與 Ben 合作串接前後端時，能一起釐清 API 規格、資料格式與操作流程。遇到問題時，也能共同確認原因與處理方式，讓整合過程更順暢。',
    quoteEn:
      'When working with Ben on frontend–backend integration, we can clarify API specifications, data formats and user workflows together. When issues arise, we work through the causes and how to address them, making integration smoother.',
    avatar: { kind: 'illustration', src: '/avatars/maggie.svg' },
    source: {
      kind: 'draft',
      note: {
        zh: '原文依前後端合作方向代擬；Ben 於 2026-10-11 確認姓名、職稱及中英文評語可公開。',
        en: 'Originally drafted from the frontend–backend collaboration context. Ben confirmed the name, title and bilingual wording for publication on 2026-10-11.',
      },
    },
    approvedForPublic: true,
    order: 30,
  },
];
