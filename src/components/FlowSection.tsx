import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FlowSectionProps {
  children: React.ReactNode;
  className?: string;
  id: string;
  disableRotation?: boolean;
  bg?: string;
  isFirst?: boolean;
  pin?: boolean;
}

const FlowSection = ({
  children,
  className = "",
  id,
  disableRotation = false,
  bg = "#FAF9F6",
  isFirst = false,
  pin = true,
}: FlowSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const shouldRotate = !isFirst && !disableRotation && !isMobile;

    const trigger = ScrollTrigger.create({
      id: `flow-${id}`,
      trigger: section,
      start: "top top",
      end: "bottom top",
      pin: pin,
      pinSpacing: false,
      scrub: true,
      onUpdate: (self) => {
        if (shouldRotate) {
          const rotation = 30 * (1 - self.progress);
          gsap.set(container, {
            rotation: rotation,
            transformOrigin: "bottom left",
          });
        }
      },
    });

    if (shouldRotate) {
      gsap.set(container, {
        rotation: 30,
        transformOrigin: "bottom left",
      });
    }

    return () => {
      trigger.kill();
    };
  }, [id, isFirst, disableRotation, pin]);

  return (
    <div
      ref={sectionRef}
      className={`flow-art-section relative w-full ${className}`}
      style={{ zIndex: isFirst ? 1 : "auto" }}
    >
      <div
        ref={containerRef}
        className="flow-art-container w-full h-screen overflow-hidden"
        style={{
          backgroundColor: bg,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FlowSection;
