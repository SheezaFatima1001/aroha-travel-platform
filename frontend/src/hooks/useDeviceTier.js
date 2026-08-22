import { useEffect, useState } from 'react';

// Tiers: 'full' (WebGL hero), 'lite' (simplified WebGL), 'static' (image/CSS fallback)
export function useDeviceTier() {
  const [tier, setTier] = useState('static');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasWebGL = (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
          );
        } catch {
          return false;
        }
      })();

      if (reduceMotion || !hasWebGL) {
        if (!cancelled) {
          setTier('static');
          setReady(true);
        }
        return;
      }

      const mem = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;

      let resolved = 'lite';
      try {
        const mod = await import('detect-gpu');
        const gpu = await mod.getGPUTier();
        if (gpu.tier >= 2 && mem >= 4 && cores >= 4) resolved = 'full';
        else if (gpu.tier >= 1) resolved = 'lite';
        else resolved = 'static';
      } catch {
        // detect-gpu not installed/available - fall back to heuristic
        resolved = mem >= 6 && cores >= 6 ? 'full' : mem >= 3 ? 'lite' : 'static';
      }

      if (!cancelled) {
        setTier(resolved);
        setReady(true);
      }
    };

    resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  return { tier, ready };
}
