import { useEffect, useRef, useState } from "react";
import { Application } from "@splinetool/runtime";
import { SPLINE_SCENE_URL } from "../../config";

/**
 * Hero 3D animation — powered by Spline.
 * Drop in your own scene URL in src/config.ts (spline.design → Export → Public URL).
 * If the scene can't load, the generated hero artwork + steam animation takes over.
 */
export default function SplineHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let app: Application | null = null;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled && status === "loading") setStatus("fallback");
    }, 7000);

    try {
      app = new Application(canvas);
      app
        .load(SPLINE_SCENE_URL)
        .then(() => {
          if (!cancelled) setStatus("ready");
        })
        .catch(() => {
          if (!cancelled) setStatus("fallback");
        });
    } catch {
      setStatus("fallback");
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
      try { app?.dispose(); } catch { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="spline-stage">
      {status !== "ready" && (
        <div className="spline-fallback">
          <img src="/images/hero.jpg" alt="Velvet Brew signature drinks" />
          <div className="steam" aria-hidden>
            <i style={{ left: "30%", animationDelay: "0s" }} />
            <i style={{ left: "50%", animationDelay: "1.2s" }} />
            <i style={{ left: "70%", animationDelay: "2.1s" }} />
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ opacity: status === "ready" ? 1 : 0, transition: "opacity .6s ease" }}
      />
      <div className="spline-caption">
        {status === "ready" ? "✦ Live Spline scene — drag to orbit" : "✦ Spline-ready 3D stage"}
      </div>
    </div>
  );
}
