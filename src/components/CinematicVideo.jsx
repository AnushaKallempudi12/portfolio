"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVideo;
uniform vec2 uResolution;
uniform vec2 uVideoSize;

void main() {
  // Mirror the footage horizontally so the character faces the left-side copy.
  vec2 uv = vec2(1.0 - vUv.x, vUv.y);

  // Cover the viewport without cropping the original video frame.
  float screenAspect = uResolution.x / uResolution.y;
  float videoAspect = uVideoSize.x / uVideoSize.y;
  vec2 sampleUv = uv;
  if (screenAspect > videoAspect) {
    float visibleY = videoAspect / screenAspect;
    sampleUv.y = (uv.y - 0.5) * visibleY + 0.5;
  } else {
    float visibleX = screenAspect / videoAspect;
    sampleUv.x = (uv.x - 0.5) * visibleX + 0.5;
  }

  vec4 source = texture2D(uVideo, sampleUv);
  vec3 color = source.rgb;

  // Key the green screen using green-channel dominance; soften the matte
  // to retain hair edges and fine movement.
  float greenExcess = color.g - max(color.r, color.b);
  float greenScreen = smoothstep(0.10, 0.27, greenExcess);
  float alpha = 1.0 - greenScreen;

  // Reduce green spill on semi-transparent edge pixels.
  float spill = max(0.0, color.g - max(color.r, color.b));
  color.g = max(0.0, color.g - spill * 0.78);

  // Portfolio-matched navy background with restrained blue light.
  vec3 bg = mix(vec3(0.018, 0.027, 0.047), vec3(0.025, 0.075, 0.135), vUv.x);
  float glowA = exp(-(
    pow((vUv.x - 0.73) / 0.34, 2.0) +
    pow((vUv.y - 0.53) / 0.55, 2.0)
  ) * 2.0);
  float glowB = exp(-(
    pow((vUv.x - 0.34) / 0.52, 2.0) +
    pow((vUv.y - 0.08) / 0.28, 2.0)
  ) * 2.0);
  bg += vec3(0.035, 0.095, 0.17) * glowA;
  bg += vec3(0.012, 0.035, 0.065) * glowB;

  // Very subtle technical grid, avoiding a hard split-screen appearance.
  vec2 grid = abs(fract(vUv * vec2(15.0, 9.0)) - 0.5);
  float line = 1.0 - smoothstep(0.485, 0.5, min(grid.x, grid.y));
  bg += vec3(0.006, 0.012, 0.021) * line;

  vec3 finalColor = mix(bg, color, alpha);
  gl_FragColor = vec4(finalColor, 1.0);
}`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function CinematicVideo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const targetRef = useRef(0);
  const seekingRef = useRef(false);
  const readyRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });

    if (!gl) return;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const resolutionLoc = gl.getUniformLocation(program, "uResolution");
    const videoSizeLoc = gl.getUniformLocation(program, "uVideoSize");
    const textureLoc = gl.getUniformLocation(program, "uVideo");
    gl.uniform1i(textureLoc, 0);

    let disposed = false;
    let lastSeekAt = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(window.innerWidth * 0.58 * dpr));
      const height = Math.max(1, Math.round(window.innerHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(resolutionLoc, width, height);
    };

    const updateScrollTarget = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      targetRef.current = progress;
      document.documentElement.style.setProperty("--scroll-progress", String(progress));
    };

    const onReady = () => {
      if (readyRef.current || !Number.isFinite(video.duration) || video.duration <= 0) return;
      readyRef.current = true;
      video.pause();
      video.currentTime = 0;
      canvas.classList.add("is-ready");
      resize();
    };

    const onSeeking = () => { seekingRef.current = true; };
    const onSeeked = () => { seekingRef.current = false; };

    const render = (now) => {
      if (readyRef.current && video.readyState >= 2) {
        const endTime = Math.max(0, video.duration - 0.05);
        const desiredTime = targetRef.current * endTime;

        // Throttle seeks and wait for the previous decode to finish.
        if (
          !seekingRef.current &&
          now - lastSeekAt > 45 &&
          Math.abs(video.currentTime - desiredTime) > 0.045
        ) {
          try {
            video.currentTime = desiredTime;
            lastSeekAt = now;
          } catch {}
        }

        try {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
          gl.uniform2f(videoSizeLoc, video.videoWidth || 16, video.videoHeight || 9);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        } catch {
          // Ignore transient texture upload errors during video seeking.
        }
      }

      if (!disposed) frameRef.current = window.requestAnimationFrame(render);
    };

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("seeking", onSeeking);
    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    updateScrollTarget();
    resize();
    if (video.readyState >= 1) onReady();
    frameRef.current = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameRef.current);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("seeking", onSeeking);
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", resize);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <div className="cinematic-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="cinematic-keyed-canvas" />
      <video
        ref={videoRef}
        className="cinematic-source-video"
        src="/portfolio/video/pc.mp4"
        playsInline
        muted
        preload="auto"
        aria-hidden="true"
      />
      <div className="cine-vignette" />
      <div className="cine-grain" />
      <div className="cine-scan" />
      <div className="cine-progress"><span /></div>
    </div>
  );
}
