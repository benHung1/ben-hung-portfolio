import type { PreparationState } from '~/utils/pagePreparation';
export const usePagePreparation = () =>
  useState<PreparationState>('page-preparation', () => ({
    active: true,
    progress: 0,
    phase: 'preparing',
    pathname: '',
    run: 0,
  }));
