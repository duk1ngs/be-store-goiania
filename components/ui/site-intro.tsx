"use client";

import { useEffect, useRef, useState } from "react";
import { siteAsset } from "@/lib/site-path";

const INTRO_KEY = "be-store-intro-seen-v1";
export const INTRO_COMPLETE_EVENT = "be-store:intro-complete";

type IntroPhase = "hidden" | "visible" | "leaving";

export function SiteIntro() {
  const [phase, setPhase] = useState<IntroPhase>("hidden");
  const skipRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const timers: number[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previousOverflow = "";
    let finishing = false;

    const announceComplete = () => window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
    const finish = () => {
      document.body.style.overflow = previousOverflow;
      delete document.documentElement.dataset.introActive;
      setPhase("hidden");
      requestAnimationFrame(announceComplete);
    };
    const beginExit = () => {
      if (finishing) return;
      finishing = true;
      setPhase("leaving");
      timers.push(window.setTimeout(finish, 820));
    };
    skipRef.current = beginExit;

    try {
      if (sessionStorage.getItem(INTRO_KEY)) {
        announceComplete();
        return;
      }
      sessionStorage.setItem(INTRO_KEY, "true");
    } catch {
      announceComplete();
      return;
    }

    if (reducedMotion.matches) {
      announceComplete();
      return;
    }

    document.documentElement.dataset.introActive = "true";
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setPhase("visible");
    timers.push(window.setTimeout(beginExit, 2300));

    return () => {
      timers.forEach(window.clearTimeout);
      document.body.style.overflow = previousOverflow;
      delete document.documentElement.dataset.introActive;
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
          <img src={siteAsset("/images/be-store-logo.jpg")} alt="" width="150" height="150" />
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
