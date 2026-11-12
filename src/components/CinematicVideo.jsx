"use client";

export default function CinematicVideo() {
  return (
    <div className="cinematic-stage" aria-hidden="true">
      <video
        className="cinematic-background-video"
        src="/portfolio/video/pc.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
