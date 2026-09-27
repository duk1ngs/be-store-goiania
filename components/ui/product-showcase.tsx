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

    const playOnce = () => {
      if (attemptedRef.current) return;
      attemptedRef.current = true;
      void video.play().catch(() => setShowFallback(true));
    };

    if (!("IntersectionObserver" in window)) {
      playOnce();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        playOnce();
      },
      { rootMargin: "0px 0px -8%", threshold: 0.32 },
    );

    observer.observe(container);
    return () => observer.disconnect();
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
