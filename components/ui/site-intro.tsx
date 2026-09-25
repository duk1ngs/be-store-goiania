"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import FluidFieldBackground from "@/components/ui/fluid-field";
import { siteAsset } from "@/lib/site-path";
import { isValidVisitorName, normalizeVisitorName, VISITOR_NAME_KEY } from "@/lib/whatsapp";

export const INTRO_COMPLETE_EVENT = "be-store:intro-complete";

type IntroPhase = "hidden" | "visible" | "leaving";

export function SiteIntro({ onComplete }: { onComplete: (name: string) => void }) {
  const [phase, setPhase] = useState<IntroPhase>("hidden");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const finishRef = useRef<(name: string) => void>(() => undefined);

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
    const finish = (visitorName: string) => {
      if (!mounted) return;
      unlockPage();
      setPhase("hidden");
      onComplete(visitorName);
    };
    const beginExit = (visitorName: string) => {
      if (finishing) return;
      finishing = true;
      try {
        sessionStorage.setItem(VISITOR_NAME_KEY, visitorName);
      } catch {
        // The current visit still continues when storage is unavailable.
      }
      onComplete(visitorName);
      setPhase("leaving");
      requestAnimationFrame(announceComplete);
      timers.push(window.setTimeout(() => finish(visitorName), reducedMotion.matches ? 160 : 720));
    };
    finishRef.current = beginExit;

    try {
      const storedName = normalizeVisitorName(sessionStorage.getItem(VISITOR_NAME_KEY) || "");
      if (isValidVisitorName(storedName)) {
        onComplete(storedName);
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

    return () => {
      mounted = false;
      timers.forEach(window.clearTimeout);
      finishRef.current = () => undefined;
      unlockPage();
    };
  }, [onComplete]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const visitorName = normalizeVisitorName(name);
    if (!isValidVisitorName(visitorName)) {
      setError("Digite seu nome para continuar.");
      return;
    }
    setError("");
    finishRef.current(visitorName);
  };

  if (phase === "hidden") return null;

  return (
    <div
      className={`site-intro${phase === "leaving" ? " is-leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Introdução da Be Store Goiânia"
    >
      <FluidFieldBackground className="intro-fluid-field" mode="dark" brightness={0.82} />
      <div className="site-intro-panel site-intro-panel-left" aria-hidden="true" />
      <div className="site-intro-panel site-intro-panel-right" aria-hidden="true" />
      <div className="site-intro-content">
        <div className="site-intro-logo" aria-hidden="true">
          <img src={siteAsset("/images/be-store-logo.svg")} alt="" width="150" height="150" />
        </div>
        <p className="site-intro-kicker">Tecnologia para o que vem a seguir.</p>
        <span className="site-intro-line" aria-hidden="true" />
        <form className="site-intro-form" onSubmit={submit} noValidate>
          <label htmlFor="visitor-name">Como podemos chamar você?</label>
          <div className="site-intro-field">
            <input
              id="visitor-name"
              name="visitor-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError("");
              }}
              autoComplete="given-name"
              inputMode="text"
              maxLength={40}
              placeholder="Seu nome"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "visitor-name-error" : undefined}
            />
            <button type="submit" aria-label="Entrar no site">
              Entrar <ArrowRight size={18} />
            </button>
          </div>
          <p className="site-intro-greeting" aria-live="polite">
            {normalizeVisitorName(name) ? `Olá, ${normalizeVisitorName(name)}.` : "Uma experiência preparada para você."}
          </p>
          {error && <p className="site-intro-error" id="visitor-name-error" role="alert">{error}</p>}
        </form>
      </div>
    </div>
  );
}
