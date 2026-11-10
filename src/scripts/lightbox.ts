/**
 * Bildvergrößerung mit Zoom für die Projektgalerie.
 * Zoomen: Mausrad, Doppelklick/Doppeltipp, zwei Finger oder +/−. Verschieben: ziehen.
 * Blättern: Pfeiltasten, Wischen (ungezoomt) oder die Pfeil-Buttons. Schließen: Esc, X oder Klick neben das Bild.
 */
type Bild = { src: string; alt: string };

export function createLightbox(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('[data-lb-stage]')!;
  const img = root.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const MAX = 5;
  let list: Bild[] = [];
  let index = 0;
  let s = 1; // Zoomfaktor
  let tx = 0; // Verschiebung in px
  let ty = 0;
  let lastFocus: HTMLElement | null = null;

  const apply = (anim = false) => {
    img.classList.toggle('is-anim', anim);
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    stage.classList.toggle('is-zoomed', s > 1.01);
  };
  // Verschiebung so begrenzen, dass das Bild nicht aus dem Rahmen gezogen wird
  const clamp = () => {
    const w = img.offsetWidth * s;
    const h = img.offsetHeight * s;
    const mx = Math.max(0, (w - stage.clientWidth) / 2);
    const my = Math.max(0, (h - stage.clientHeight) / 2);
    tx = Math.min(mx, Math.max(-mx, tx));
    ty = Math.min(my, Math.max(-my, ty));
  };
  // auf einen Punkt (Bildschirmkoordinaten) hin zoomen, der Punkt bleibt stehen
  const zoomAt = (next: number, cx: number, cy: number, anim = false) => {
    next = Math.min(MAX, Math.max(1, next));
    const r = stage.getBoundingClientRect();
    const px = cx - (r.left + r.width / 2);
    const py = cy - (r.top + r.height / 2);
    tx = px - ((px - tx) / s) * next;
    ty = py - ((py - ty) / s) * next;
    s = next;
    if (s === 1) tx = ty = 0;
    clamp();
    apply(anim);
  };
  const zoomCenter = (f: number) => {
    const r = stage.getBoundingClientRect();
    zoomAt(s * f, r.left + r.width / 2, r.top + r.height / 2, true);
  };
  const reset = () => {
    s = 1;
    tx = ty = 0;
    apply();
  };

  const show = (i: number) => {
    index = (i + list.length) % list.length;
    reset();
    img.src = list[index]!.src;
    img.alt = list[index]!.alt;
    const multi = list.length > 1;
    root.querySelectorAll<HTMLElement>('[data-lb-prev], [data-lb-next]').forEach((b) => (b.hidden = !multi));
  };

  const open = (bilder: Bild[], start = 0) => {
    list = bilder;
    lastFocus = document.activeElement as HTMLElement | null;
    root.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    window.dispatchEvent(new Event('quirling:lock'));
    show(start);
    root.querySelector<HTMLElement>('[data-lb-close]')?.focus();
  };
  const close = () => {
    root.hidden = true;
    img.removeAttribute('src');
    document.documentElement.style.overflow = '';
    window.dispatchEvent(new Event('quirling:unlock'));
    lastFocus?.focus({ preventScroll: true });
  };

  /* Buttons und Tastatur */
  root.querySelector('[data-lb-close]')!.addEventListener('click', close);
  root.querySelector('[data-lb-prev]')!.addEventListener('click', () => show(index - 1));
  root.querySelector('[data-lb-next]')!.addEventListener('click', () => show(index + 1));
  root.querySelector('[data-lb-in]')!.addEventListener('click', () => zoomCenter(1.6));
  root.querySelector('[data-lb-out]')!.addEventListener('click', () => zoomCenter(1 / 1.6));
  document.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === '+' || e.key === '=') zoomCenter(1.6);
    else if (e.key === '-') zoomCenter(1 / 1.6);
    else return;
    e.preventDefault();
  });

  /* Mausrad */
  stage.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoomAt(s * Math.exp(-e.deltaY * 0.0018), e.clientX, e.clientY);
    },
    { passive: false },
  );

  /* Doppelklick bzw. Doppeltipp */
  stage.addEventListener('dblclick', (e) => zoomAt(s > 1.01 ? 1 : 2.5, e.clientX, e.clientY, true));

  /* Ziehen, Wischen und Zwei-Finger-Zoom */
  const pts = new Map<number, { x: number; y: number }>();
  let start = { x: 0, y: 0, tx: 0, ty: 0, dist: 0, s: 1, moved: false };
  let downOnStage = false; // Klick neben das Bild (nicht auf das Bild)
  const dist = () => {
    const [a, b] = [...pts.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  };
  const mid = () => {
    const [a, b] = [...pts.values()];
    return a && b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : { x: 0, y: 0 };
  };
  stage.addEventListener('pointerdown', (e) => {
    if (pts.size === 0) downOnStage = e.target === stage;
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    start = { x: e.clientX, y: e.clientY, tx, ty, dist: dist(), s, moved: false };
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2 && start.dist) {
      const m = mid();
      zoomAt(start.s * (dist() / start.dist), m.x, m.y);
      start.moved = true;
      return;
    }
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) start.moved = true;
    if (s > 1.01) {
      tx = start.tx + dx;
      ty = start.ty + dy;
      clamp();
      apply();
    }
  });
  const end = (e: PointerEvent) => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    stage.classList.remove('is-dragging');
    if (pts.size === 1) {
      // vom Zwei-Finger-Zoom zurück zum Ziehen
      const [p] = [...pts.values()];
      start = { x: p!.x, y: p!.y, tx, ty, dist: 0, s, moved: true };
      return;
    }
    const dx = e.clientX - start.x;
    if (s <= 1.01 && Math.abs(dx) > 60 && list.length > 1) show(index + (dx < 0 ? 1 : -1));
    else if (!start.moved && downOnStage) close(); // Klick neben das Bild
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  window.addEventListener('resize', () => {
    if (!root.hidden) reset();
  });

  return { open, close, isOpen: () => !root.hidden };
}
