import { useEffect, useRef, useCallback } from "react";

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function FadingVideo({ src, className, style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);

  const FADE_MS = 500;

  // Custom JS-based fadeTo function using requestAnimationFrame
  const fadeTo = useCallback((targetOpacity: number, duration: number) => {
    const video = videoRef.current;
    if (!video) return;

    // Cancel previous animation frame if any
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const startOpacity = parseFloat(video.style.opacity) || 0;
    const opacityDiff = targetOpacity - startOpacity;
    const startTime = performance.now();

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + opacityDiff * progress;
      
      video.style.opacity = currentOpacity.toFixed(4);

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(step);
  }, []);

  // Handlers for video events
  const handleLoadedData = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.style.opacity = "0";
    video.play()
      .then(() => {
        fadeTo(1, FADE_MS);
      })
      .catch((err) => {
        console.warn("Autoplay failed or interrupted:", err);
      });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    const currentTime = video.currentTime;

    if (!isNaN(duration) && duration > 0) {
      const timeRemaining = duration - currentTime;
      // Fade out if timeRemaining is within the lead window
      if (!fadingOutRef.current && timeRemaining <= 0.55 && timeRemaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_MS);
      }
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = "0";

    // Loop manually after 100ms
    setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;

      v.currentTime = 0;
      v.play()
        .then(() => {
          fadingOutRef.current = false;
          fadeTo(1, FADE_MS);
        })
        .catch((err) => {
          console.warn("Manual loop playback failed:", err);
        });
    }, 100);
  };

  // Cleanup active animation frames on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{
        opacity: 0,
        ...style,
      }}
      autoPlay
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
}
