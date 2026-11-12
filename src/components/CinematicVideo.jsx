"use client";

import { useEffect, useRef } from "react";

export default function CinematicVideo() {
  const videoRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ready = false;
    let lastTarget = -1;

    const syncToScroll = () => {
      if (!ready || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const target = progress * Math.max(0, video.duration - 0.04);

      // Avoid repeatedly seeking to the same frame while the page is stationary.
      if (Math.abs(target - lastTarget) > 0.025) {
        lastTarget = target;
        try {
          video.currentTime = target;
        } catch {
          // The browser may briefly reject a seek while metadata is loading.
        }
      }
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        syncToScroll();
      });
    };

    const onMetadata = () => {
      ready = true;
      video.pause();
      syncToScroll();
    };

    video.addEventListener("loadedmetadata", onMetadata);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    if (video.readyState >= 1) onMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="cinematic-stage" aria-hidden="true">
      <video
        ref={videoRef}
        className="cinematic-background-video"
        src="/portfolio/video/pc.mp4"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
