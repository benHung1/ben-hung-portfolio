import type { PreparationState } from '~/utils/pagePreparation';
export const usePagePreparation = () =>
  useState<PreparationState>('page-preparation', () => ({
    active: false,
    visible: false,
    phase: 'idle',
    pathname: '',
    run: 0,
  }));
