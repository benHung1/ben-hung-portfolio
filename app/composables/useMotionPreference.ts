/** Shared by the playground, weather and page scenes; safe for SSR per request. */
export function useMotionPreference() {
  const manualStatic = useState<boolean>(
    'portfolio-reduced-motion',
    () => false,
  );
  return { manualStatic };
}
