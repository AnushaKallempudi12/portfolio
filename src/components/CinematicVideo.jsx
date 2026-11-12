"use client";

import { useEffect, useRef } from "react";

export default function CinematicVideo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!video || !canvas || !context) return;

    let ready = false;
    let lastTarget = -1;

    const renderFrame = () => {
      if (!ready || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;

      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);

      // Fit the complete source frame inside the viewport. No mirroring or cropping.
      const scale = Math.min(width / video.videoWidth, height / video.videoHeight);
      const drawWidth = video.videoWidth * scale;
      const drawHeight = video.videoHeight * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      context.drawImage(video, x, y, drawWidth, drawHeight);

      // Remove only the green-screen color so the original character composites
      // naturally over the portfolio background.
      const image = context.getImageData(0, 0, width, height);
      const pixels = image.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const chroma = green - Math.max(red, blue);
        const greenScreen = green > 70 && chroma > 24 && green > red * 1.16 && green > blue * 1.12;

        if (greenScreen) {
          const strength = Math.min(1, (chroma - 18) / 48);
          pixels[i + 3] = Math.round(pixels[i + 3] * (1 - strength));
          // Reduce green spill on partially transparent edge pixels.
          if (pixels[i + 3] > 0 && pixels[i + 3] < 255) {
            pixels[i + 1] = Math.min(green, Math.round((red + blue) / 2 + 18));
          }
        }
      }
      context.putImageData(image, 0, 0);
    };

    const syncToScroll = () => {
      if (!ready || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const target = progress * Math.max(0, video.duration - 0.04);

      if (Math.abs(target - lastTarget) > 0.015) {
        lastTarget = target;
        try {
          video.currentTime = target;
        } catch {
          // A seek can be briefly unavailable while the browser is decoding.
        }
      } else {
        renderFrame();
      }
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        syncToScroll();
      });
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      renderFrame();
      syncToScroll();
    };

    const onMetadata = () => {
      ready = true;
      video.pause();
      resizeCanvas();
      syncToScroll();
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("loadeddata", renderFrame);
    video.addEventListener("seeked", renderFrame);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });

    if (video.readyState >= 1) onMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("loadeddata", renderFrame);
      video.removeEventListener("seeked", renderFrame);
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
        src="/portfolio/video/character.mp4"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
