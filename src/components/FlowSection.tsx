import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FlowSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Unique identifier for ScrollTrigger cleanup */
  id: string;
  /** Whether to apply the rotation stacking effect (disabled on mobile) */
  disableRotation?: boolean;
  /** Background color for the section panel — defaults to cream */
  bg?: string;
  /** Whether this is the first section (no rotation entrance) */
  isFirst?: boolean;
  /** Whether this section should be pinned (default: true) */
  pin?: boolean;
}

/**
 * FlowSection — Individual stacking panel.
 * Each section pins at the top and rotates from 30° → 0° as it enters,
 * creating a "card stacking" depth effect.
 * 
 * On mobile, rotation is disabled but pinning/stacking remains.
 */
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

    // Create the stacking ScrollTrigger
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
          // Rotate from 30° → 0° as section enters viewport
          const rotation = 30 * (1 - self.progress);
          gsap.set(container, {
            rotation: rotation,
            transformOrigin: "bottom left",
          });
        }
      },
    });

    // Set initial rotation for non-first sections
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
        className="flow-art-container w-full"
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
