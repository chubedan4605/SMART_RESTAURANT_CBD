import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";

// --- Hàm trợ giúp: Tách chuỗi thành từng ký tự bọc trong thẻ span ---
const splitText = (text) => {
  return text.split("").map((char, index) => (
    <span
      key={index}
      className="split-char inline-block whitespace-pre"
      style={{ opacity: 0 }}
    >
      {char}
    </span>
  ));
};

const HeroTitle = () => {
  const { t } = useTranslation();
  const titleRef = useRef(null);
  const animationRan = useRef(false);

  useLayoutEffect(() => {
    if (animationRan.current) return;

    const ctx = gsap.context(() => {
      const chars = titleRef.current.querySelectorAll(".split-char");

      gsap.fromTo(
        chars,
        {
          opacity: 0,
          x: () => gsap.utils.random(-400, 400),
          y: () => gsap.utils.random(-250, 250),
          z: () => gsap.utils.random(-150, 150),
          rotation: () => gsap.utils.random(-360, 360),
          scale: () => gsap.utils.random(0.5, 2),
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          z: 0,
          rotation: 0,
          scale: 1,
          duration: 1.8,
          ease: "elastic.out(1, 0.5)",
          stagger: {
            amount: 0.7,
            from: "random",
          },
          delay: 0.3,
        },
      );
    }, titleRef);

    animationRan.current = true;
    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={titleRef}
      className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-cream mb-6 leading-[1.1] drop-shadow-2xl overflow-hidden p-2 text-center"
    >
      {/* Dòng 1 */}
      <div className="block">{splitText(t("hero.enjoy") + " ")}</div>

      {/* Dòng 2 */}
      <span className="text-gold italic font-serif">
        {splitText(t("hero.essence")).map((span, idx) =>
          React.cloneElement(span, {
            key: idx,
            className: `${span.props.className} font-serif`,
          }),
        )}
      </span>
      <br />

      {/* Dòng 3 */}
      <div className="block mt-2">{splitText(t("hero.cuisine"))}</div>
    </h1>
  );
};

export default HeroTitle;
