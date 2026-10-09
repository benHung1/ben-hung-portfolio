export interface Visit {
  fullPath: string;
  left: number;
  top: number;
}
/** Only entries observed by this app instance count as a reliable return source. */
export class NavigationJournal {
  entries = new Map<number, Visit>();
  current = 0;
  constructor(position: number, fullPath: string) {
    this.arrive(position, fullPath);
  }
  save(fullPath: string, left: number, top: number) {
    this.entries.set(this.current, { fullPath, left, top });
  }
  arrive(position: number, fullPath: string) {
    this.current = position;
    const old = this.entries.get(position);
    this.entries.set(position, {
      fullPath,
      left: old?.left ?? 0,
      top: old?.top ?? 0,
    });
    if (this.entries.size > 80)
      this.entries.delete(this.entries.keys().next().value!);
  }
  previous(back: unknown) {
    const known = this.entries.get(this.current - 1);
    return known &&
      known.fullPath === back &&
      /^\/(?:$|[?#]|work(?:[/?#]|$))/.test(known.fullPath)
      ? known
      : undefined;
  }
}
