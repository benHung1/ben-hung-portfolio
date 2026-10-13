export type CaseArtTheme =
  | 'bus'
  | 'voice'
  | 'map'
  | 'layers'
  | 'components'
  | 'calendar'
  | 'jobs'
  | 'career'
  | 'graduation'
  | 'campus'
  | 'gift'
  | 'template'
  | 'ballot';

export const caseArtThemes: Record<string, CaseArtTheme> = {
  'evbus-operations': 'bus',
  'voice-service-console': 'voice',
  'map-editor-platform': 'map',
  'enterprise-framework': 'layers',
  'main-site-components': 'components',
  'events-management': 'calendar',
  'curated-jobs': 'jobs',
  freshman: 'career',
  'graduation-campaign': 'graduation',
  'campus-recruitment': 'campus',
  'transfer-2025': 'gift',
  'shared-foundations': 'template',
  'voting-system': 'ballot',
};
