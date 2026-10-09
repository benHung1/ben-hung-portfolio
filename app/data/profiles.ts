export const profiles = [
  {
    id: '104',
    name: '104',
    url: 'https://pda.104.com.tw/profile/share/gyTNH4XJNFWGx4w9fowbA1Cx4DrBXr6R',
  },
  { id: 'cake', name: 'Cake', url: 'https://www.cake.me/ben-hung-5fd0c6' },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/ben-hung-01b8a121a',
  },
] as const;
export const profileCopy = {
  zh: { label: '履歷與個人檔案', list: '履歷平台', newTab: '在新分頁開啟' },
  en: {
    label: 'Resume & Profiles',
    list: 'Professional profiles',
    newTab: 'Opens in a new tab',
  },
} as const;
