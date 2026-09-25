"use client";

import { useEffect } from "react";

type RevealDirection = "up" | "left" | "right" | "fade" | "scale";

const revealStart: Record<RevealDirection, Keyframe> = {
  up: { opacity: 0, transform: "translate3d(0, 30px, 0)" },
  left: { opacity: 0, transform: "translate3d(-44px, 0, 0)" },
  right: { opacity: 0, transform: "translate3d(44px, 0, 0)" },
  fade: { opacity: 0 },
  scale: { opacity: 0, transform: "translate3d(0, 14px, 0) scale(.965)" },
};

function directionFor(element: HTMLElement, index: number): RevealDirection {
  const requested = element.dataset.reveal as RevealDirection | undefined;
  if (requested && requested in revealStart) return requested;
  return index % 3 === 1 ? "left" : index % 3 === 2 ? "right" : "up";
}

export function useScrollMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let revealObserver: IntersectionObserver | null = null;
    let frame = 0;
    let introCheckFrame = 0;
    let started = false;
    const runningAnimations: Animation[] = [];

    const clearPreparedState = (element: HTMLElement) => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
      delete element.dataset.motionPending;
    };

    const showEverything = () => {
      document.querySelectorAll<HTMLElement>("[data-motion-item], [data-reveal-item], [data-hero-visual]")
        .forEach((element) => {
          clearPreparedState(element);
          element.dataset.motionComplete = "true";
        });
    };

    const resetEverything = () => {
      document.querySelectorAll<HTMLElement>("[data-motion-item], [data-reveal-item], [data-hero-visual]")
        .forEach((element) => {
          clearPreparedState(element);
          delete element.dataset.motionComplete;
        });
    };

    const animateItems = (container: Element, selector: string, stagger = 125) => {
      container.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        if (element.dataset.motionComplete) return;
        element.dataset.motionComplete = "true";
        const direction = directionFor(element, index);
        const start = reducedMotion.matches ? { opacity: 0 } : revealStart[direction];
        if (!("animate" in element)) {
          clearPreparedState(element);
          return;
        }
        const animation = element.animate(
          [start, { opacity: 1, transform: reducedMotion.matches ? "none" : "translate3d(0, 0, 0) scale(1)" }],
          {
            duration: reducedMotion.matches ? 160 : 880,
            delay: reducedMotion.matches ? index * 24 : index * stagger,
            easing: reducedMotion.matches ? "linear" : "cubic-bezier(.22,.68,0,1)",
            fill: "backwards",
          },
        );
        runningAnimations.push(animation);
        animation.finished.then(() => clearPreparedState(element)).catch(() => clearPreparedState(element));
      });
    };

    const scrollElements = [...document.querySelectorAll<HTMLElement>("[data-scroll-motion]")];
    const updateScrollMotion = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || 1;
      if (reducedMotion.matches) {
        scrollElements.forEach((element) => element.style.setProperty("--scroll-shift", "0px"));
        return;
      }
      scrollElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -viewportHeight * 0.25 || rect.top > viewportHeight * 1.25) return;
        const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
        const range = Math.min(48, Math.max(0, Number(element.dataset.scrollMotion) || 20));
        const shift = (progress - 0.5) * range * 2;
        element.style.setProperty("--scroll-shift", `${shift.toFixed(2)}px`);
        element.style.setProperty("--scroll-progress", progress.toFixed(3));
      });
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateScrollMotion);
    };

    const startMotion = () => {
      if (started || reducedMotion.matches) return;
      started = true;

      const hero = document.querySelector("[data-hero-group]");
      if (hero) animateItems(hero, "[data-motion-item]", 130);
      const heroVisual = document.querySelector<HTMLElement>("[data-hero-visual]");
      if (heroVisual) {
        const animation = heroVisual.animate(
          [
            { opacity: 0, transform: "translate3d(32px, 18px, 0) scale(.975)" },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          { duration: 980, delay: 220, easing: "cubic-bezier(.22,.68,0,1)", fill: "backwards" },
        );
        runningAnimations.push(animation);
      }

      if (!("IntersectionObserver" in window)) {
        showEverything();
        return;
      }

      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || reducedMotion.matches) return;
            const stagger = Number((entry.target as HTMLElement).dataset.stagger || 125);
            animateItems(entry.target, "[data-reveal-item]", stagger);
            revealObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -8%" },
      );

      document.querySelectorAll("[data-reveal-group]").forEach((element) => revealObserver?.observe(element));
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate, { passive: true });
      updateScrollMotion();
    };

    const startReducedMotion = () => {
      if (started) return;
      started = true;
      if (!("IntersectionObserver" in window)) {
        showEverything();
        return;
      }
      const hero = document.querySelector("[data-hero-group]");
      if (hero) animateItems(hero, "[data-motion-item]", 24);
      const heroVisual = document.querySelector<HTMLElement>("[data-hero-visual]");
      if (heroVisual) animateItems(heroVisual.parentElement ?? heroVisual, "[data-hero-visual]", 0);
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateItems(entry.target, "[data-reveal-item]", 24);
          revealObserver?.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -4%" });
      document.querySelectorAll("[data-reveal-group]").forEach((element) => revealObserver?.observe(element));
      updateScrollMotion();
    };

    const startForPreference = () => reducedMotion.matches ? startReducedMotion() : startMotion();

    window.addEventListener("be-store:intro-complete", startForPreference, { once: true });
    introCheckFrame = requestAnimationFrame(() => {
      if (document.documentElement.dataset.introActive !== "true") startForPreference();
    });

    return () => {
      revealObserver?.disconnect();
      window.removeEventListener("be-store:intro-complete", startForPreference);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(introCheckFrame);
      runningAnimations.forEach((animation) => animation.cancel());
      resetEverything();
    };
  }, []);
}
