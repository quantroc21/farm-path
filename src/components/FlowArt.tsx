import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FlowArtProps {
  children: React.ReactNode;
}

const FlowArt = ({ children }: FlowArtProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
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
