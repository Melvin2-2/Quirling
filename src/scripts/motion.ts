/**
 * Scroll-Animationen (GSAP + ScrollTrigger + Lenis).
 * Gesteuert über data-Attribute im Markup:
 *   data-reveal             Element blendet beim Hereinscrollen ein
 *   data-reveal-children    … oder seine direkten Kinder nacheinander
 *   data-split              Überschrift zeilenweise aus einer Maske schieben
 *   data-scrub-words        Wörter werden beim Scrollen nach und nach „eingefärbt“
 *   data-parallax           Bild im Rahmen verschiebt sich langsamer als die Seite
 *   data-clip               Bildrahmen öffnet sich beim Scrollen
 *   data-count="150"        Zahl zählt hoch
 *   data-spin               Raute dreht sich mit dem Scrollen
 *   data-line               Linie wächst mit dem Scrollen (Zeitstrahl)
 * Ohne JavaScript bzw. bei „Bewegung reduzieren“ ist alles sofort sichtbar.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

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
  /* Einblenden */
  $$('[data-reveal]').forEach((el) => {
    const targets = el.hasAttribute('data-reveal-children') ? Array.from(el.children) : [el];
    gsap.from(targets, {
      y: 48,
      autoAlpha: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* Überschriften zeilenweise */
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.15,
          ease: 'power4.out',
          stagger: 0.09,
          delay: el.closest('[data-home-hero]') ? 0.5 : 0,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      },
    });
  });

  /* Wörter einfärben beim Scrollen */
  $$('[data-scrub-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words' });
    gsap.fromTo(
      split.words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
      },
    );
  });

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

  /* Bildrahmen öffnen */
  $$('[data-clip]').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 40%', scrub: 0.6 },
    });
    tl.fromTo(el, { clipPath: 'inset(14% 10% 14% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0);
    if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);
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
