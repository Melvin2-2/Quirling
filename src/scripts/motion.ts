/**
 * Scroll-Animationen (GSAP + ScrollTrigger + Lenis).
 * Gesteuert über data-Attribute im Markup:
 *   (Einblend-Effekte für Bilder und Texte wurden bewusst entfernt: Inhalte stehen sofort.)
 *   data-parallax           Bild im Rahmen verschiebt sich langsamer als die Seite
 *   data-count="150"        Zahl zählt hoch
 *   data-spin               Raute dreht sich mit dem Scrollen
 *   data-line               Linie wächst mit dem Scrollen (Zeitstrahl)
 * Ohne JavaScript bzw. bei „Bewegung reduzieren“ ist alles sofort sichtbar.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T & Element>(sel)) as unknown as T[];

/* ---------- Smooth Scrolling ---------- */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -80 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
window.addEventListener('quirling:lock', () => lenis?.stop());
window.addEventListener('quirling:unlock', () => lenis?.start());

/* ---------- Video: nur abspielen, wenn sichtbar ---------- */
$$<HTMLVideoElement>('video[data-autoplay]').forEach((v) => {
  if (reduce) {
    v.removeAttribute('autoplay');
    v.pause();
    return;
  }
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
  io.observe(v);
});

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  /* Parallax */
  $$('[data-parallax]').forEach((el) => {
    const img = el.querySelector('img, video') ?? el;
    gsap.fromTo(
      img,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  /* Raute drehen */
  $$('[data-spin]').forEach((el) => {
    gsap.fromTo(
      el,
      { rotate: -12, yPercent: 10 },
      {
        rotate: 18,
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  /* Zeitstrahl-Linie */
  $$('[data-line]').forEach((el) => {
    gsap.fromTo(
      el,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top 70%', end: 'bottom 70%', scrub: true },
      },
    );
  });

});

/* Zähler – läuft auch bei reduzierter Bewegung (dann ohne Animation) */
$$('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count);
  if (Number.isNaN(target)) return;
  if (reduce) {
    el.textContent = String(target);
    return;
  }
  const obj = { v: 0 };
  el.textContent = '0';
  gsap.to(obj, {
    v: target,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString('de-DE')),
  });
});

/* Nach dem Laden aller Bilder Positionen neu berechnen */
window.addEventListener('load', () => ScrollTrigger.refresh());
