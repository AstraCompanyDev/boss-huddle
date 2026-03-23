import { useEffect, useRef, useState } from "react";

export function useScrollFadeIn(threshold = 0.15, delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay]);

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
  };

  return { ref, style, isVisible };
}

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function FadeIn({ children, className = "", delay = 0, threshold = 0.15 }: FadeInProps) {
  const { ref, style } = useScrollFadeIn(threshold, delay);

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
