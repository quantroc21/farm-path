import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FlowArtProps {
  children: React.ReactNode;
}

/**
 * FlowArt — Main wrapper for GSAP stacking story-scroll.
 * Initializes ScrollTrigger and wraps all FlowSection children.
 * Handles cleanup on unmount.
 */
const FlowArt = ({ children }: FlowArtProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Refresh ScrollTrigger after all children mount and images load
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      // Kill all ScrollTriggers created by FlowSection children
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.id?.toString().startsWith("flow-")) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={wrapperRef} className="flow-art-wrapper relative">
      {children}
    </div>
  );
};

export default FlowArt;
