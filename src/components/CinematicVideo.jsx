"use client";

import { useEffect, useRef } from "react";

export default function CinematicVideo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true, alpha: true });
    if (!video || !canvas || !context) return;

    let ready = false;
    let seeking = false;
    let pendingTarget = null;
    
    // Keep chroma-key work small: the canvas is capped at 960px wide.
    // The browser scales this transparent result smoothly to the display area.
    const resizeCanvas = () => {
      const stageWidth = Math.max(1, window.innerWidth);
      const stageHeight = Math.max(1, window.innerHeight);
      const scale = Math.min(1, 1280 / stageWidth, 720 / stageHeight);
      canvas.width = Math.max(1, Math.round(stageWidth * scale));
      canvas.height = Math.max(1, Math.round(stageHeight * scale));
      renderFrame();
    };

    const renderFrame = () => {
      if (!ready || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);

      // Fill the screen, mirror the footage so the character faces left,
      // and anchor the mirrored frame so the character stays on the right.
      const scale = Math.max(width / video.videoWidth, height / video.videoHeight);
      const drawWidth = video.videoWidth * scale;
      const drawHeight = video.videoHeight * scale;
      const drawX = width - drawWidth * 0.45;
      const drawY = (height - drawHeight) / 2;
      context.save();
      context.translate(2 * drawX + drawWidth, 0);
      context.scale(-1, 1);
      context.drawImage(video, drawX, drawY, drawWidth, drawHeight);
      context.restore();

      const image = context.getImageData(0, 0, width, height);
      const pixels = image.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const chroma = green - Math.max(red, blue);
        if (green > 70 && chroma > 24 && green > red * 1.16 && green > blue * 1.12) {
          const alpha = Math.max(0, Math.min(1, 1 - (chroma - 18) / 48));
          pixels[i + 3] = Math.round(pixels[i + 3] * alpha);
          if (pixels[i + 3] > 0 && pixels[i + 3] < 255) {
            pixels[i + 1] = Math.min(green, Math.round((red + blue) / 2 + 18));
          }
        }
      }
      context.putImageData(image, 0, 0);
          };

    const applyPendingSeek = () => {
      if (!ready || seeking || pendingTarget === null) return;
      const target = pendingTarget;
      pendingTarget = null;
      if (Math.abs(target - video.currentTime) < 0.025) {
        renderFrame();
        return;
      }
      seeking = true;
      try {
        video.currentTime = target;
      } catch {
        seeking = false;
        pendingTarget = target;
      }
    };

    const syncToScroll = () => {
      if (!ready || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      pendingTarget = progress * Math.max(0, video.duration - 0.04);
      applyPendingSeek();
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        syncToScroll();
      });
    };

    const onSeeked = () => {
      seeking = false;
      renderFrame();
      // If the user scrolled during decoding, jump directly to the newest position.
      applyPendingSeek();
    };

    const onMetadata = () => {
      ready = true;
      video.pause();
      resizeCanvas();
      syncToScroll();
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("loadeddata", renderFrame);
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });
    if (video.readyState >= 1) onMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("loadeddata", renderFrame);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="cinematic-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="cinematic-background-canvas" />
      <video
        ref={videoRef}
        className="cinematic-source-video"
        src="/portfolio/video/Professional_character-1080p.mp4"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
