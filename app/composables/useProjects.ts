import { localizeProjects } from '~/data/projectCatalog';
export function useProjects() {
  const { locale } = usePortfolio();
  const projects = computed(() => localizeProjects(locale.value));
  const selectedProjects = computed(() =>
    projects.value.filter((project) => project.selected),
  );
  return { projects, selectedProjects };
}
