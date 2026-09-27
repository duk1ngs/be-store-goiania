"use client";

import { useEffect, useRef, useState } from "react";
import { siteAsset } from "@/lib/site-path";

const videoSrc = "/media/iphone-showcase.mp4";
const initialPoster = "/media/iphone-showcase-initial.webp";
const finalPoster = "/media/iphone-showcase-final.webp";

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const attemptedRef = useRef(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setShowFallback(true);
      return;
    }

    let isIntersecting = false;
    let introComplete = !document.documentElement.hasAttribute("data-intro-active");
    let observer: IntersectionObserver | undefined;
    let introObserver: MutationObserver | undefined;

    const playOnce = () => {
      if (attemptedRef.current) return;
      attemptedRef.current = true;
      observer?.disconnect();
      introObserver?.disconnect();
      void video.play().catch(() => setShowFallback(true));
    };

    const tryToPlay = () => {
      if (!isIntersecting || !introComplete) return;
      playOnce();
    };

    if (!("IntersectionObserver" in window)) {
      isIntersecting = true;
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = Boolean(entry?.isIntersecting);
          tryToPlay();
        },
        { rootMargin: "0px 0px -8%", threshold: 0.32 },
      );

      observer.observe(container);
    }

    if (!introComplete) {
      introObserver = new MutationObserver(() => {
        introComplete = !document.documentElement.hasAttribute("data-intro-active");
        tryToPlay();
      });
      introObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-intro-active"],
      });
    }

    tryToPlay();
    return () => {
      observer?.disconnect();
      introObserver?.disconnect();
    };
  }, []);

  return (
    <div className="product-showcase" ref={containerRef} aria-hidden="true">
      {showFallback ? (
        <img src={siteAsset(finalPoster)} alt="" width="1280" height="720" />
      ) : (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          poster={siteAsset(initialPoster)}
          onError={() => setShowFallback(true)}
        >
          <source src={siteAsset(videoSrc)} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
