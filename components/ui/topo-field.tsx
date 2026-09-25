"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type TopoFieldMode = "dark" | "light";

export type TopoFieldProps = {
  mode?: TopoFieldMode | "auto";
  speed?: number;
  length?: number;
  density?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_dpr;
  uniform float u_length;
  uniform float u_density;
  uniform float u_light_mode;

  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 pixel = gl_FragCoord.xy;
    vec2 st = pixel / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    float gridSize = 58.0 * u_dpr;
    vec2 gridCell = fract(pixel / gridSize);
    float thickness = 1.0 / gridSize;
    float grid = clamp(step(1.0 - thickness, gridCell.x) + step(1.0 - thickness, gridCell.y), 0.0, 1.0) * 0.045;

    vec2 drift = vec2(
      sin(st.y * 3.4 + u_time * 0.15),
      cos(st.x * 3.1 - u_time * 0.12)
    ) * 0.035;
    vec2 noisePosition = (st + drift) * (1.35 * u_length) + vec2(u_time * 0.026, u_time * 0.034);
    float noise = snoise(noisePosition) * 0.5 + 0.5;
    float triangleWave = abs(fract(noise * (9.0 * u_density)) - 0.5) * 2.0;
    float contour = smoothstep(0.045, 0.0, triangleWave) * 0.24;
    float vignette = smoothstep(0.95, 0.18, distance(st / vec2(u_resolution.x / u_resolution.y, 1.0), vec2(0.5)));
    float lines = (grid + contour) * (0.55 + vignette * 0.45);

    vec2 normalized = st / vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 glowAOrigin = vec2(0.18 + sin(u_time * 0.13) * 0.08, 0.22 + cos(u_time * 0.11) * 0.06);
    vec2 glowBOrigin = vec2(0.82 + cos(u_time * 0.09) * 0.07, 0.72 + sin(u_time * 0.12) * 0.08);
    float glowA = exp(-distance(normalized, glowAOrigin) * 4.8);
    float glowB = exp(-distance(normalized, glowBOrigin) * 5.4);
    float ambientGlow = (glowA * 0.028) + (glowB * 0.02);

    vec3 darkColor = vec3(0.002 + ambientGlow) + vec3(lines);
    vec3 lightColor = vec3(0.965) - vec3(lines * 0.72);
    gl_FragColor = vec4(mix(darkColor, lightColor, u_light_mode), 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function TopoField({
  mode = "dark",
  speed = 0.55,
  length = 1,
  density = 1,
  opacity = 1,
  hue = 0,
  saturation = 0,
  brightness = 1,
  className,
  style,
}: TopoFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [automaticMode, setAutomaticMode] = useState<TopoFieldMode>("dark");
  const resolvedMode = mode === "auto" ? automaticMode : mode;
  const safeSpeed = clamp(speed, 0, 3);
  const safeLength = clamp(length, 0.35, 2.5);
  const safeDensity = clamp(density, 0.25, 2.5);
  const safeOpacity = clamp(opacity, 0.05, 1);

  useEffect(() => {
    if (mode !== "auto") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setAutomaticMode(media.matches ? "dark" : "light");
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!canvas || !gl) return;
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const time = gl.getUniformLocation(program, "u_time");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const dprUniform = gl.getUniformLocation(program, "u_dpr");
    gl.uniform1f(gl.getUniformLocation(program, "u_length"), safeLength);
    gl.uniform1f(gl.getUniformLocation(program, "u_density"), safeDensity);
    gl.uniform1f(gl.getUniformLocation(program, "u_light_mode"), resolvedMode === "light" ? 1 : 0);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let running = false;
    const startedAt = performance.now();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(dprUniform, dpr);
    };
    const render = (now: number) => {
      gl.uniform1f(time, reducedMotion.matches ? 0 : ((now - startedAt) / 1000) * safeSpeed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (running) animationFrame = requestAnimationFrame(render);
    };
    const syncMotion = () => {
      cancelAnimationFrame(animationFrame);
      running = !reducedMotion.matches && !document.hidden;
      render(performance.now());
    };
    reducedMotion.addEventListener("change", syncMotion);
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas);
    if (!resizeObserver) window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", syncMotion);
    resize();
    syncMotion();
    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      reducedMotion.removeEventListener("change", syncMotion);
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", syncMotion);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [resolvedMode, safeDensity, safeLength, safeSpeed]);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      style={{
        opacity: safeOpacity,
        background: resolvedMode === "light" ? "#f5f5f7" : "#000",
        filter: `hue-rotate(${clamp(hue, -180, 180)}deg) saturate(${clamp(saturation, 0, 2)}) brightness(${clamp(brightness, 0.35, 1.65)})`,
        ...style,
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
