import { ShieldCheck, Leaf, Award, Globe2, BadgeCheck, Sprout, Building2, Stamp } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "VietGAP Certified" },
  { icon: Globe2, label: "GlobalGAP" },
  { icon: BadgeCheck, label: "ISO 22000:2018" },
  { icon: Award, label: "HACCP" },
  { icon: Leaf, label: "Organic Vietnam" },
  { icon: Sprout, label: "Rainforest Alliance" },
  { icon: Stamp, label: "Fair Trade" },
  { icon: Building2, label: "OCOP 4 Sao" },
];

const CertMarquee = () => {
  // Duplicate twice for seamless loop
  const loop = [...items, ...items];

  return (
    <section className="relative bg-[#0a2319] overflow-hidden border-y border-white/10">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#0a2319] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#0a2319] to-transparent z-10" />

      <div className="py-7 md:py-9">
        <p className="text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-[#BC6C25] mb-5">
          Chứng nhận & Đối tác
        </p>

        <div className="relative flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee gap-12 md:gap-20 pr-12 md:pr-20">
            {loop.map((it, i) => (
              <MarqueeItem key={`a-${i}`} {...it} />
            ))}
          </div>
          <div className="flex shrink-0 animate-marquee gap-12 md:gap-20 pr-12 md:pr-20" aria-hidden="true">
            {loop.map((it, i) => (
              <MarqueeItem key={`b-${i}`} {...it} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MarqueeItem = ({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) => (
  <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors whitespace-nowrap">
    <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#BC6C25]" strokeWidth={1.6} />
    <span className="text-sm md:text-base font-semibold tracking-wide uppercase">{label}</span>
  </div>
);

export default CertMarquee;
