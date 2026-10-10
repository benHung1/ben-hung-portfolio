export type TestimonialGroup = '1111' | 'foxconn';
export type TestimonialLocaleText = { zh: string; en: string };
export interface TestimonialRecord {
  id: string;
  displayName: string;
  role: TestimonialLocaleText | null;
  companyGroup: TestimonialGroup;
  relationship: TestimonialLocaleText;
  quoteZh: string;
  quoteEn: string;
  avatar: { kind: 'illustration'; src: string };
  source: {
    kind: 'adapted' | 'draft';
    url?: string;
    note: TestimonialLocaleText;
  };
  approvedForPublic: boolean;
  order: number;
}
export type TestimonialView = Omit<
  TestimonialRecord,
  'source' | 'approvedForPublic'
> & {
  review?: Pick<TestimonialRecord, 'source' | 'approvedForPublic'>;
};
