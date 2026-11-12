"use client";

import { useEffect, useRef } from "react";

export default function CinematicVideo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Keep full-resolution rendering while moving chroma-key work to the GPU.
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.error("WebGL is unavailable; cinematic video cannot be composited.");
      return;
    }

    const vertexSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform sampler2D u_video;
      varying vec2 v_texCoord;
      void main() {
        vec4 source = texture2D(u_video, v_texCoord);
        vec3 color = source.rgb;
        float chroma = color.g - max(color.r, color.b);
        float isGreen = step(70.0 / 255.0, color.g)
          * step(24.0 / 255.0, chroma)
          * step(color.r * 1.16, color.g)
          * step(color.b * 1.12, color.g);

        // Match the previous CPU key's thresholds and feathering.
        float keyedAlpha = clamp(1.0 - (chroma - 18.0 / 255.0) / (48.0 / 255.0), 0.0, 1.0);
        float alpha = mix(1.0, keyedAlpha, isGreen);

        // Preserve the source RGB exactly. Only alter transparency for the
        // green-screen pixels; do not tint, desaturate, or recolor the subject.
        gl_FragColor = vec4(color * alpha, alpha);
      }
    `;

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Cinematic shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Cinematic shader link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.uniform1i(gl.getUniformLocation(program, "u_video"), 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let ready = false;
    let pendingTarget = null;
    let lastUploadedTime = -1;

    const resizeCanvas = () => {
      const stageWidth = Math.max(1, window.innerWidth);
      const stageHeight = Math.max(1, window.innerHeight);
      const scale = Math.min(1, 1920 / stageWidth, 1080 / stageHeight);
      canvas.width = Math.max(1, Math.round(stageWidth * scale));
      canvas.height = Math.max(1, Math.round(stageHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      renderFrame();
    };

    const renderFrame = () => {
      if (!ready || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;

      const width = canvas.width;
      const height = canvas.height;
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Preserve the original orientation and full source frame, aligned right.
      const scale = Math.min(width / video.videoWidth, height / video.videoHeight);
      const drawWidth = video.videoWidth * scale;
      const drawHeight = video.videoHeight * scale;
      const drawX = width - drawWidth;
      const drawY = (height - drawHeight) / 2;

      const left = (drawX / width) * 2 - 1;
      const right = ((drawX + drawWidth) / width) * 2 - 1;
      const top = 1 - (drawY / height) * 2;
      const bottom = 1 - ((drawY + drawHeight) / height) * 2;

      const vertices = new Float32Array([
        left, bottom, 0, 0,
        right, bottom, 1, 0,
        left, top, 0, 1,
        left, top, 0, 1,
        right, bottom, 1, 0,
        right, top, 1, 1,
      ]);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      if (lastUploadedTime !== video.currentTime) {
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
          lastUploadedTime = video.currentTime;
        } catch (error) {
          console.warn("Unable to upload the current video frame:", error);
          return;
        }
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const applyPendingSeek = () => {
      if (!ready || pendingTarget === null) return;
      const target = pendingTarget;
      pendingTarget = null;
      if (Math.abs(target - video.currentTime) < 0.025) {
        renderFrame();
        return;
      }
      try {
        video.currentTime = target;
      } catch {
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
      lastUploadedTime = -1;
      renderFrame();
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
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
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
