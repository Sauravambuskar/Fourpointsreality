"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface ScrollSplitCardItem {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  image?: string;
  imageAlt?: string;
  icon?: React.ReactNode;
}

interface ScrollSplitCardProps {
  className?: string;
  imageSrc: string;
  imageAlt?: string;
  cards: ScrollSplitCardItem[];
  containerRef?: React.RefObject<HTMLElement | null>;
  scrollHeight?: string;
  startLabel?: string;
  endTitle?: string;
}

export function ScrollSplitCard({
  className,
  imageSrc,
  imageAlt = "Featured property",
  cards,
  containerRef: externalContainerRef,
  scrollHeight = "360vh",
  startLabel = "One property. Three perspectives.",
  endTitle = "Every detail, considered.",
}: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: externalContainerRef,
    offset: ["start start", "end end"],
  });

  // Stage 1 to 2: Separation (0 to 0.4), then Stage 2 to 3: Overlap closer (0.4 to 0.8)
  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -48, -24]);
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 48, 24]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

  // Stage 2 to 3: Flip (0.4 to 0.8)
  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180]);
  // Due to 180deg Y flip, positive Z becomes visual counter-clockwise, negative Z becomes visual clockwise
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 6]);
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -6]);

  // Dynamic borders/radii so it looks like ONE flat image initially
  const borderRadiusLeft = useTransform(scrollYProgress, [0, 0.2], ["16px 0px 0px 16px", "16px 16px 16px 16px"]);
  const borderRadiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "16px 16px 16px 16px"]);
  const borderRadiusRight = useTransform(scrollYProgress, [0, 0.2], ["0px 16px 16px 0px", "16px 16px 16px 16px"]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.2]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.4]);
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`;

  // Cards move up in the last viewport
  const cardsY = useTransform(scrollYProgress, [0.8, 1], [0, -200]);

  // Text appearance at the end in the sticky viewport
  const textOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.8, 1], [40, 0]);

  // Indicator text appearance at the start
  const startTextOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const startTextY = useTransform(scrollYProgress, [0, 0.1], [0, 20]);

  if (shouldReduceMotion) {
    return (
      <div className={cn("w-full px-5 py-20", className)}>
        <div
          role="img"
          aria-label={imageAlt}
          className="mx-auto h-[55vh] min-h-[420px] max-w-5xl rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
        <div className="mx-auto mt-5 grid max-w-5xl gap-4 md:grid-cols-3">
          {cards.slice(0, 3).map((card, index) => (
            <article
              className="overflow-hidden rounded-2xl border border-black/10 p-5"
              key={card.title}
              style={{ backgroundColor: card.bgColor, color: card.textColor }}
            >
              {card.image && (
                <div className="relative mb-5 h-48 overflow-hidden rounded-xl border border-current/10">
                  <Image src={card.image} alt={card.imageAlt ?? ""} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" />
                </div>
              )}
              <div className="mb-5 flex items-center justify-between">
                {card.icon}
                <span className="text-xs font-bold tracking-[0.18em] opacity-55">0{index + 1}</span>
              </div>
              <h3 className="text-2xl font-extrabold">{card.title}</h3>
              <p className="mt-3 text-base font-semibold leading-relaxed opacity-80">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{ height: scrollHeight }}
    >
      <span className="sr-only">{imageAlt}</span>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden [perspective:1200px]">
        {/* Starting Text indicator */}
        <motion.div
          className="absolute top-[12%] left-0 right-0 text-center"
          style={{
            opacity: startTextOpacity,
            y: startTextY,
          }}
        >
          <p className="text-base font-bold tracking-[0.12em] text-white/70 uppercase">
            {startLabel}
          </p>
        </motion.div>

        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="relative flex h-[440px] w-full max-w-5xl px-4"
        >
          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={i}
              className="relative h-full flex-1"
              style={{
                x: i === 0 ? leftX : i === 2 ? rightX : 0,
                rotateY,
                rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                zIndex: i, // Ensures Left is under Middle, and Right is above Middle
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front Side: Original Image Split */}
              <motion.div
                className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                style={{
                  zIndex: 2, // Ensure front stays above initially
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <div
                  className="absolute inset-0 h-full w-[300%]"
                  style={{
                    left: `${-100 * i}%`,
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                  }}
                />
              </motion.div>

              {/* Back Side: New Content Card */}
              <motion.div
                className={cn(
                  "absolute inset-0 overflow-hidden flex flex-col p-5 [backface-visibility:hidden] will-change-transform",
                  "border border-white/5 bg-gradient-to-br from-white/10 to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-24px_48px_rgba(0,0,0,0.2)]"
                )}
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  transform: "rotateY(180deg)",
                  zIndex: 1, // Ensure back is behind before flip
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,.32) .6px, transparent .6px)",
                    backgroundSize: "5px 5px",
                  }}
                />

                {card.image && (
                  <div className="relative z-10 mb-5 h-40 shrink-0 overflow-hidden rounded-xl border border-current/10">
                    <Image
                      src={card.image}
                      alt={card.imageAlt ?? ""}
                      fill
                      sizes="(max-width: 767px) 100vw, 320px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                  </div>
                )}
                <div className="relative z-10 mb-4 flex items-center justify-between">
                  {card.icon}
                  <span className="text-xs font-bold tracking-[0.18em] opacity-55">0{i + 1}</span>
                </div>
                <h3 className="relative z-10 mb-3 text-2xl font-extrabold leading-tight">
                  {card.title}
                </h3>
                <p className="relative z-10 text-base font-semibold leading-relaxed opacity-80">{card.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ending Text fixed in the sticky viewport */}
        <motion.div
          className="absolute bottom-[20%] left-0 right-0 text-center"
          style={{
            opacity: textOpacity,
            y: textY,
          }}
        >
          <p className="text-3xl font-extrabold tracking-tight text-white">
            {endTitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
