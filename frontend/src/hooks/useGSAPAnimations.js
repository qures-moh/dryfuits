/* ================================================================
   GOLDEN HARVEST — GSAP ANIMATION ENGINE
   Central animation hook using GSAP + ScrollTrigger
   Provides reusable animation utilities for all components
   ================================================================ */

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins once
gsap.registerPlugin(ScrollTrigger);

// ─── GLOBAL GSAP CONFIG ──────────────────────────────────
gsap.config({ nullTargetWarn: false });
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

/* ──────────────────────────────────────────────────────────
   1. HERO ENTRANCE TIMELINE
   Orchestrated multi-element reveal on page load
   ────────────────────────────────────────────────────────── */
export function useHeroAnimation() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const actionsRef = useRef(null);
  const proofRef = useRef(null);
  const imageCardRef = useRef(null);
  const floatingBadge1Ref = useRef(null);
  const floatingBadge2Ref = useRef(null);
  const chipsBarRef = useRef(null);
  const trustBarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        delay: 0.2,
      });

      // 1. Badge slides in from left with elastic bounce
      if (badgeRef.current) {
        tl.fromTo(badgeRef.current,
          { opacity: 0, x: -60, scale: 0.8 },
          { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }
        );
      }

      // 2. Title reveal — each line clips in
      if (titleRef.current) {
        tl.fromTo(titleRef.current,
          { opacity: 0, y: 50, clipPath: 'inset(100% 0% 0% 0%)' },
          { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power4.out' },
          '-=0.3'
        );
      }

      // 3. Description fades up
      if (descRef.current) {
        tl.fromTo(descRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        );
      }

      // 4. CTA Buttons spring in with stagger
      if (actionsRef.current) {
        tl.fromTo(actionsRef.current.children,
          { opacity: 0, y: 25, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2)' },
          '-=0.3'
        );
      }

      // 5. Social proof / rating slides up
      if (proofRef.current) {
        tl.fromTo(proofRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.2'
        );
      }

      // 6. Hero image — scale up with parallax-feel entrance
      if (imageCardRef.current) {
        tl.fromTo(imageCardRef.current,
          { opacity: 0, scale: 0.88, y: 40, rotateY: -5 },
          { opacity: 1, scale: 1, y: 0, rotateY: 0, duration: 1.1, ease: 'power3.out' },
          '-=0.9'
        );
      }

      // 7. Floating badges pop in with spring physics
      if (floatingBadge1Ref.current) {
        tl.fromTo(floatingBadge1Ref.current,
          { opacity: 0, scale: 0, rotate: -12 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', clearProps: 'transform' },
          '-=0.5'
        );
      }
      if (floatingBadge2Ref.current) {
        tl.fromTo(floatingBadge2Ref.current,
          { opacity: 0, scale: 0, rotate: 12 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', clearProps: 'transform' },
          '-=0.4'
        );
      }

      // 8. Category chips bar slides up
      if (chipsBarRef.current) {
        tl.fromTo(chipsBarRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        );
        // Stagger individual chips
        const chips = chipsBarRef.current.querySelectorAll('.category-chip');
        if (chips.length) {
          tl.fromTo(chips,
            { opacity: 0, y: 15, scale: 0.85 },
            { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(2)' },
            '-=0.3'
          );
        }
      }

      // 9. Trust bar cards stagger in
      if (trustBarRef.current) {
        const trustCards = trustBarRef.current.querySelectorAll('.trust-card');
        tl.fromTo(trustCards,
          { opacity: 0, y: 30, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' },
          '-=0.2'
        );
      }

      // 10. Hero image parallax on scroll
      // if (imageCardRef.current) {
      //   gsap.to(imageCardRef.current, {
      //     y: -50,
      //     ease: 'none',
      //     scrollTrigger: {
      //       trigger: sectionRef.current,
      //       start: 'top top',
      //       end: 'bottom top',
      //       scrub: 1.5,
      //     },
      //   });
      // }
      // 10. Hero image parallax on scroll
if (imageCardRef.current) {
  gsap.fromTo(
    imageCardRef.current,
    {
      y: 0,
    },
    {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    }
  );
}

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return {
    sectionRef,
    badgeRef,
    titleRef,
    descRef,
    actionsRef,
    proofRef,
    imageCardRef,
    floatingBadge1Ref,
    floatingBadge2Ref,
    chipsBarRef,
    trustBarRef,
  };
}


/* ──────────────────────────────────────────────────────────
   2. SCROLL-TRIGGERED SECTION REVEAL
   Generic hook for any section with header + grid children
   ────────────────────────────────────────────────────────── */
export function useScrollReveal(options = {}) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  const {
    start = 'top 82%',
    staggerSelector = null,
    staggerAmount = 0.1,
    fromVars = { opacity: 0, y: 45 },
    toVars = { opacity: 1, y: 0 },
    headerFrom = { opacity: 0, y: 35, clipPath: 'inset(100% 0% 0% 0%)' },
    headerTo = { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' },
    duration = 0.75,
  } = options;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.fromTo(headerRef.current, headerFrom, {
          ...headerTo,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start,
            toggleActions: 'play none none none',
          },
        });
      }

      // Content block / grid reveal
      if (contentRef.current) {
        if (staggerSelector) {
          const children = contentRef.current.querySelectorAll(staggerSelector);
          if (children.length) {
            gsap.fromTo(children, fromVars, {
              ...toVars,
              duration,
              stagger: staggerAmount,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: contentRef.current,
                start,
                toggleActions: 'play none none none',
              },
            });
          }
        } else {
          gsap.fromTo(contentRef.current, fromVars, {
            ...toVars,
            duration,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start,
              toggleActions: 'play none none none',
            },
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return { sectionRef, headerRef, contentRef };
}


/* ──────────────────────────────────────────────────────────
   3. PRODUCT GRID — BATCH SCROLL TRIGGER (Stagger on Enter)
   ────────────────────────────────────────────────────────── */
export function useProductGridAnimation() {
  const gridRef = useRef(null);
  const bannerRef = useRef(null);
  const headerRef = useRef(null);
  const pillsRef = useRef(null);
  const calloutRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40, clipPath: 'inset(100% 0% 0% 0%)' },
          {
            opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
          }
        );
      }

      // Bucket banner with split entrance
      if (bannerRef.current) {
        const textSide = bannerRef.current.querySelector('.bucket-banner-text');
        const imgSide = bannerRef.current.querySelector('.bucket-banner-img-wrap');

        if (textSide) {
          gsap.fromTo(textSide,
            { opacity: 0, x: -60 },
            {
              opacity: 1, x: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: bannerRef.current, start: 'top 82%' },
            }
          );
        }
        if (imgSide) {
          gsap.fromTo(imgSide,
            { opacity: 0, x: 60, scale: 0.92 },
            {
              opacity: 1, x: 0, scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: bannerRef.current, start: 'top 82%' },
            }
          );
        }
      }

      // Category pills stagger
      if (pillsRef.current) {
        const pills = pillsRef.current.querySelectorAll('.landing-cat-pill');
        gsap.fromTo(pills,
          { opacity: 0, y: 20, scale: 0.85 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: pillsRef.current, start: 'top 88%' },
          }
        );
      }

      // Product cards — batch stagger reveal
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.clean-product-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 50, scale: 0.9, rotateX: 8 },
          {
            opacity: 1, y: 0, scale: 1, rotateX: 0,
            duration: 0.65,
            stagger: { each: 0.08, from: 'start' },
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Bottom callout
      if (calloutRef.current) {
        gsap.fromTo(calloutRef.current,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: calloutRef.current, start: 'top 88%' },
          }
        );
      }

    }, gridRef.current?.closest('section') || document.body);

    return () => ctx.revert();
  }, []);

  return { gridRef, bannerRef, headerRef, pillsRef, calloutRef };
}


/* ──────────────────────────────────────────────────────────
   4. HEALTH BENEFITS SECTION — Card stagger + Counter anim
   ────────────────────────────────────────────────────────── */
export function useHealthBenefitsAnimation() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40, clipPath: 'inset(100% 0% 0% 0%)' },
          {
            opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
          }
        );
      }

      // Benefit cards stagger with rotation
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.benefit-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 50, scale: 0.88, rotateY: -10 },
          {
            opacity: 1, y: 0, scale: 1, rotateY: 0,
            duration: 0.7,
            stagger: { each: 0.12, from: 'start' },
            ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
          }
        );

        // Icon bounce after cards appear
        const icons = gridRef.current.querySelectorAll('.benefit-icon-wrapper');
        gsap.fromTo(icons,
          { scale: 0, rotate: -45 },
          {
            scale: 1, rotate: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: 'elastic.out(1, 0.4)',
            delay: 0.3,
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
          }
        );
      }

      // Origin story banner — parallax image + text slide
      if (bannerRef.current) {
        const content = bannerRef.current.querySelector('.origin-story-content');
        const img = bannerRef.current.querySelector('.origin-story-img-wrap');

        if (content) {
          gsap.fromTo(content,
            { opacity: 0, x: -50 },
            {
              opacity: 1, x: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: bannerRef.current, start: 'top 80%' },
            }
          );
        }

        if (img) {
          gsap.fromTo(img,
            { opacity: 0, x: 50, scale: 0.9 },
            {
              opacity: 1, x: 0, scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: bannerRef.current, start: 'top 80%' },
            }
          );

          // Subtle parallax on the image
          gsap.to(img, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: bannerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          });
        }

        // Animate counter stats
        const statStrongs = bannerRef.current.querySelectorAll('.origin-stat strong');
        statStrongs.forEach((el) => {
          const text = el.textContent.trim();
          const numMatch = text.match(/(\d+)/);
          if (numMatch) {
            const target = parseInt(numMatch[1], 10);
            const prefix = text.substring(0, text.indexOf(numMatch[0]));
            const suffix = text.substring(text.indexOf(numMatch[0]) + numMatch[0].length);
            const obj = { val: 0 };

            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: bannerRef.current, start: 'top 80%' },
              onUpdate: () => {
                el.textContent = prefix + Math.round(obj.val) + suffix;
              },
            });
          }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return { sectionRef, headerRef, gridRef, bannerRef };
}


/* ──────────────────────────────────────────────────────────
   5. TESTIMONIALS & FAQ SECTION
   ────────────────────────────────────────────────────────── */
export function useTestimonialsAnimation() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
          }
        );
      }

      // Testimonial cards — stagger with 3D flip in
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.testimonial-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 45, rotateX: 15, transformPerspective: 800 },
          {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.65,
            stagger: { each: 0.1, from: 'start' },
            ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
          }
        );

        // Stars twinkle after card reveal
        const stars = gridRef.current.querySelectorAll('.stars-row svg');
        gsap.fromTo(stars,
          { scale: 0, rotate: -90 },
          {
            scale: 1, rotate: 0,
            duration: 0.35,
            stagger: 0.03,
            ease: 'back.out(3)',
            delay: 0.4,
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
          }
        );
      }

      // FAQ section
      if (faqRef.current) {
        gsap.fromTo(faqRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: faqRef.current, start: 'top 85%' },
          }
        );

        const faqCards = faqRef.current.querySelectorAll('.faq-card');
        gsap.fromTo(faqCards,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: faqRef.current, start: 'top 82%' },
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return { sectionRef, headerRef, gridRef, faqRef };
}


/* ──────────────────────────────────────────────────────────
   6. CONTACT SECTION — Split left/right + form micro-anims
   ────────────────────────────────────────────────────────── */
export function useContactAnimation() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const infoCardRef = useRef(null);
  const formCardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
          }
        );
      }

      // Info card slides from left
      if (infoCardRef.current) {
        gsap.fromTo(infoCardRef.current,
          { opacity: 0, x: -80, rotateY: -8, transformPerspective: 1000 },
          {
            opacity: 1, x: 0, rotateY: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: infoCardRef.current, start: 'top 82%' },
          }
        );

        // Stagger contact channels
        const channels = infoCardRef.current.querySelectorAll('.contact-channel-item');
        gsap.fromTo(channels,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            duration: 0.45,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.3,
            scrollTrigger: { trigger: infoCardRef.current, start: 'top 82%' },
          }
        );

        // Perk boxes pop in
        const perks = infoCardRef.current.querySelectorAll('.perk-box');
        gsap.fromTo(perks,
          { opacity: 0, scale: 0.8, y: 15 },
          {
            opacity: 1, scale: 1, y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'back.out(2)',
            delay: 0.5,
            scrollTrigger: { trigger: infoCardRef.current, start: 'top 82%' },
          }
        );
      }

      // Form card slides from right
      if (formCardRef.current) {
        gsap.fromTo(formCardRef.current,
          { opacity: 0, x: 80, rotateY: 8, transformPerspective: 1000 },
          {
            opacity: 1, x: 0, rotateY: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: formCardRef.current, start: 'top 82%' },
          }
        );

        // Form fields stagger in
        const fields = formCardRef.current.querySelectorAll('.form-group');
        gsap.fromTo(fields,
          { opacity: 0, y: 20, x: 15 },
          {
            opacity: 1, y: 0, x: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out',
            delay: 0.4,
            scrollTrigger: { trigger: formCardRef.current, start: 'top 82%' },
          }
        );

        // Submit button spring entrance
        const submitBtn = formCardRef.current.querySelector('.landing-submit-btn');
        if (submitBtn) {
          gsap.fromTo(submitBtn,
            { opacity: 0, y: 20, scale: 0.85 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.5,
              ease: 'back.out(2)',
              delay: 0.7,
              scrollTrigger: { trigger: formCardRef.current, start: 'top 82%' },
            }
          );
        }
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return { sectionRef, headerRef, infoCardRef, formCardRef };
}


/* ──────────────────────────────────────────────────────────
   7. FOOTER REVEAL
   ────────────────────────────────────────────────────────── */
export function useFooterAnimation() {
  const footerRef = useRef(null);
  const stripRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Top strip items stagger
      if (stripRef.current) {
        const items = stripRef.current.querySelectorAll('.strip-item');
        gsap.fromTo(items,
          { opacity: 0, y: 25 },
          {
            opacity: 1, y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: stripRef.current, start: 'top 90%' },
          }
        );
      }

      // Footer columns stagger in
      if (gridRef.current) {
        const cols = gridRef.current.querySelectorAll('.footer-col');
        gsap.fromTo(cols,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 88%' },
          }
        );
      }

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return { footerRef, stripRef, gridRef };
}


/* ──────────────────────────────────────────────────────────
   8. MAGNETIC BUTTON EFFECT (Hover follows cursor)
   ────────────────────────────────────────────────────────── */
export function useMagneticEffect(ref, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref, strength]);
}


/* ──────────────────────────────────────────────────────────
   9. WHATSAPP BUTTON — Elastic entrance + magnetic hover
   ────────────────────────────────────────────────────────── */
export function useWhatsAppAnimation() {
  const btnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (btnRef.current) {
        // Delayed elastic entrance
        gsap.fromTo(btnRef.current,
          { opacity: 0, scale: 0, rotate: -90 },
          {
            opacity: 1, scale: 1, rotate: 0,
            duration: 0.8,
            delay: 1.8,
            ease: 'elastic.out(1, 0.4)',
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  useMagneticEffect(btnRef, 0.25);

  return { btnRef };
}


/* ──────────────────────────────────────────────────────────
   10. NAVBAR GSAP ENTRANCE
   ────────────────────────────────────────────────────────── */
export function useNavbarAnimation() {
  const navRef = useRef(null);
  const announcementRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Announcement bar slide down
      if (announcementRef.current) {
        gsap.fromTo(announcementRef.current,
          { y: -50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', clearProps: 'transform' }
        );
      }

      // Navbar slide down with spring
      if (navRef.current) {
        gsap.fromTo(navRef.current,
          { y: -80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: 'power4.out', clearProps: 'transform' }
        );

        // Desktop nav links stagger
        const navLinks = navRef.current.querySelectorAll('.nav-link');
        gsap.fromTo(navLinks,
          { opacity: 0, y: -10 },
          {
            opacity: 1, y: 0,
            duration: 0.35,
            stagger: 0.05,
            delay: 0.4,
            ease: 'power2.out',
          }
        );

        // Action buttons pop in
        const actions = navRef.current.querySelectorAll('.header-actions > *');
        gsap.fromTo(actions,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1, scale: 1,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.6,
            ease: 'back.out(2)',
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return { navRef, announcementRef };
}


/* ──────────────────────────────────────────────────────────
   11. SMOOTH SCROLL TO ELEMENT (GSAP-powered)
   ────────────────────────────────────────────────────────── */
export function gsapScrollTo(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    gsap.to(window, {
      scrollTo: { y: el, offsetY: 80 },
      duration: 1,
      ease: 'power3.inOut',
    });
  }
}
