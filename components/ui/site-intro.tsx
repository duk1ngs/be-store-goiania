"use client";

import { useEffect, useRef, useState } from "react";
import { siteAsset } from "@/lib/site-path";

const INTRO_KEY = "be-store-intro-seen-v2";
export const INTRO_COMPLETE_EVENT = "be-store:intro-complete";

type IntroPhase = "hidden" | "visible" | "leaving";

export function SiteIntro() {
  const [phase, setPhase] = useState<IntroPhase>("hidden");
  const skipRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const timers: number[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    let finishing = false;
    let mounted = true;

    const announceComplete = () => window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
    const unlockPage = () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      delete document.documentElement.dataset.introActive;
    };
    const finish = () => {
      if (!mounted) return;
      try {
        sessionStorage.setItem(INTRO_KEY, "true");
      } catch {
        // Storage can be unavailable in privacy modes; the intro still completes.
      }
      unlockPage();
      setPhase("hidden");
      requestAnimationFrame(announceComplete);
    };
    const beginExit = () => {
      if (finishing) return;
      finishing = true;
      setPhase("leaving");
      timers.push(window.setTimeout(finish, reducedMotion.matches ? 160 : 820));
    };
    skipRef.current = beginExit;

    try {
      if (sessionStorage.getItem(INTRO_KEY)) {
        requestAnimationFrame(announceComplete);
        return;
      }
    } catch {
      // Continue without persistence rather than leaving the page blocked.
    }

    document.documentElement.dataset.introActive = "true";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    setPhase("visible");
    timers.push(window.setTimeout(beginExit, reducedMotion.matches ? 680 : 2300));

    return () => {
      mounted = false;
      timers.forEach(window.clearTimeout);
      skipRef.current = () => undefined;
      unlockPage();
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`site-intro${phase === "leaving" ? " is-leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Introdução da Be Store Goiânia"
    >
      <div className="site-intro-panel site-intro-panel-left" aria-hidden="true" />
      <div className="site-intro-panel site-intro-panel-right" aria-hidden="true" />
      <div className="site-intro-content">
        <div className="site-intro-logo" aria-hidden="true">
          <img src={siteAsset("/images/be-store-logo.svg")} alt="" width="150" height="150" />
        </div>
        <p>Tecnologia para o que vem a seguir.</p>
        <span className="site-intro-line" aria-hidden="true" />
      </div>
      <button className="site-intro-skip" type="button" onClick={() => skipRef.current()}>
        Pular introdução
      </button>
    </div>
  );
}
