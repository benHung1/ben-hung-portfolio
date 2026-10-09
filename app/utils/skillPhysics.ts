// Small, lazily imported circle solver. No global listeners or animation loop.
export interface SkillBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  held: boolean;
  angle: number;
}
export class SkillWorld {
  bodies: SkillBody[] = [];
  constructor(
    public width: number,
    public height: number,
    public radius: number,
    count: number,
  ) {
    this.bodies = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: radius,
      held: false,
      angle: 0,
    }));
    this.reset();
  }
  clamp(b: SkillBody) {
    b.x = Math.max(b.r, Math.min(this.width - b.r, b.x));
    b.y = Math.max(b.r, Math.min(this.height - b.r, b.y));
  }
  reset() {
    const diameter = this.radius * 2;
    const cols = Math.max(1, Math.floor(this.width / (diameter + 10)));
    const rows = Math.max(1, Math.floor(this.height / (diameter + 10)));
    const cells = Array.from({ length: cols * rows }, (_, i) => i);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j]!, cells[i]!];
    }
    const cw = this.width / cols,
      ch = this.height / rows;
    const jitterX = Math.max(0, (cw - diameter - 8) / 2);
    const jitterY = Math.max(0, (ch - diameter - 8) / 2);
    this.bodies.forEach((b, i) => {
      const cell = cells[i % cells.length]!;
      b.x = ((cell % cols) + 0.5) * cw + (Math.random() * 2 - 1) * jitterX;
      b.y =
        (Math.floor(cell / cols) + 0.5) * ch +
        (Math.random() * 2 - 1) * jitterY;
      b.vx = (Math.random() * 2 - 1) * 85;
      b.vy = -75 + Math.random() * 150;
      b.angle = (Math.random() * 2 - 1) * 8;
      b.held = false;
      this.clamp(b);
    });
  }
  resize(width: number, height: number, radius: number) {
    const ratio = width / this.width;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.bodies.forEach((b) => {
      b.x *= ratio;
      b.r = radius;
      b.vx = 0;
      b.vy = 0;
      this.clamp(b);
    });
  }
  shuffle() {
    this.bodies.forEach((b, i) => {
      b.vx = (i % 2 ? 1 : -1) * (100 + Math.random() * 220);
      b.vy = -230 - Math.random() * 220;
    });
  }
  step(dt: number) {
    const substeps = 3;
    for (let step = 0; step < substeps; step++) {
      const d = Math.min(dt, 1 / 30) / substeps;
      for (const b of this.bodies) {
        if (b.held) continue;
        b.vy += 1050 * d;
        b.x += b.vx * d;
        b.y += b.vy * d;
        b.vx *= Math.pow(0.985, d * 60);
        b.angle +=
          (Math.max(-9, Math.min(9, b.vx * 0.045)) - b.angle) *
          Math.min(1, d * 5);
        if (b.x < b.r || b.x > this.width - b.r) b.vx *= -0.48;
        if (b.y > this.height - b.r) {
          b.vy = Math.abs(b.vy) > 45 ? -b.vy * 0.38 : 0;
          b.vx *= 0.94;
        }
        if (b.y < b.r && b.vy < 0) b.vy *= -0.4;
        this.clamp(b);
      }
      for (let iteration = 0; iteration < 3; iteration++)
        for (let i = 0; i < this.bodies.length; i++)
          for (let j = i + 1; j < this.bodies.length; j++) {
            const a = this.bodies[i]!,
              b = this.bodies[j]!;
            const dx = b.x - a.x,
              dy = b.y - a.y,
              dist = Math.hypot(dx, dy) || 0.01,
              min = a.r + b.r + 2;
            if (dist >= min) continue;
            const nx = dx / dist,
              ny = dy / dist,
              overlap = min - dist;
            const wa = a.held ? 0 : 1,
              wb = b.held ? 0 : 1,
              total = wa + wb;
            if (!total) continue;
            a.x -= (nx * overlap * wa) / total;
            a.y -= (ny * overlap * wa) / total;
            b.x += (nx * overlap * wb) / total;
            b.y += (ny * overlap * wb) / total;
            const velocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (velocity < 0) {
              const impulse = (-1.35 * velocity) / total;
              a.vx -= impulse * nx * wa;
              a.vy -= impulse * ny * wa;
              b.vx += impulse * nx * wb;
              b.vy += impulse * ny * wb;
            }
            this.clamp(a);
            this.clamp(b);
          }
    }
  }
}
