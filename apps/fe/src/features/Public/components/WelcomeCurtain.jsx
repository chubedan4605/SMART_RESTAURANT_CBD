import { UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";

export const WelcomeCurtain = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

    const removeTimer = setTimeout(() => {
      setIsRemoved(true);
    }, 2200);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (isRemoved) return null;

  return (
    <div className="fixed inset-0 z-50 flex w-screen h-screen pointer-events-none overflow-hidden font-sans">
      {/* Left Curtain */}
      <div
        className={`relative w-[50vw] shrink-0 h-full bg-ink grain flex items-center justify-end border-r border-gold/30 shadow-2xl transition-transform duration-[1400ms] ease-in-out ${
          isOpen ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-radial from-gold/5 via-transparent to-transparent" />
      </div>

      {/* Right Curtain */}
      <div
        className={`relative w-[50vw] shrink-0 h-full bg-ink grain flex items-center justify-start border-l border-gold/30 shadow-2xl transition-transform duration-[1400ms] ease-in-out ${
          isOpen ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-radial from-gold/5 via-transparent to-transparent" />
      </div>

      {/* Center Crest */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-600 ${
          isOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="w-24 h-24 md:w-36 md:h-36 bg-ink border-2 border-gold/60 text-gold rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(202,160,82,0.3)] z-50 gap-1">
          <UtensilsCrossed className="w-8 h-8 md:w-12 md:h-12 text-gold stroke-[1.5]" />
          <span className="font-serif text-[9px] md:text-xs uppercase tracking-luxe text-cream/90 font-medium">
            Le Bistro
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCurtain;
