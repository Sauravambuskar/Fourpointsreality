"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollChoreographyProps {
  className?: string;
  images: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  imageAlts?: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  children?: ReactNode;
  scrollHeight?: string;
}

export function ScrollChoreography({
  className,
  images,
  imageAlts = {
    topLeft: "Architectural exterior",
    topRight: "Featured residence",
    bottomLeft: "Residential material detail",
    bottomRight: "Contemporary interior",
  },
  children,
  scrollHeight = "260vh",
}: ScrollChoreographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400, // Higher stiffness for a slightly faster snap
    damping: 50,   // Play with damping to add a little bounce/jerk
    mass: 1.2,     // Adds a bit more weight to the movement
    restDelta: 0.001,
  });

  // Default positions relative to center
  const xLeft = "-20vw";
  const xRight = "20vw";
  const yTop = "-14vh";
  const yBottom = "14vh";

  // Phase 1: 0 - 0.3 (Diagonal movement)
  // Phase 2: 0.35 - 0.65 (Stack alignment to center)
  // Phase 3: 0.7 - 0.9 (Top Right expands to full screen)

  // Top Left -> moves to Bottom Left, then to Center
  const tlX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const tlY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yTop, yBottom, yBottom, "0vh", "0vh"]);

  // Bottom Right -> moves to Top Right, then to Center
  const brX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xRight, xRight, xRight, "0vw", "0vw"]);
  const brY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yBottom, yTop, yTop, "0vh", "0vh"]);

  // Bottom Left -> stays, then moves to Center
  const blX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const blY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yBottom, yBottom, yBottom, "0vh", "0vh"]);

  // Top Right -> stays, then moves to Center, then expands
  const trX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xRight, xRight, xRight, "0vw", "0vw"]);
  const trY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yTop, yTop, yTop, "0vh", "0vh"]);

  // Top Right (Hero) scaling/expansion properties
  const heroWidth = useTransform(smoothProgress, [0.65, 0.7, 0.9, 1], ["36vw", "36vw", "100vw", "100vw"]);
  const heroHeight = useTransform(smoothProgress, [0.65, 0.7, 0.9, 1], ["24vh", "24vh", "100vh", "100vh"]);

  // Opacity fading for images underneath the hero as it expands
  const underImagesOpacity = useTransform(smoothProgress, [0.75, 0.85], [1, 0]);
  const captionOpacity = useTransform(smoothProgress, [0.84, 0.94], [0, 1]);
  const captionY = useTransform(smoothProgress, [0.84, 0.94], [42, 0]);

  const baseImageClasses =
    "absolute left-1/2 top-1/2 w-[36vw] h-[24vh] overflow-hidden -translate-x-1/2 -translate-y-1/2 bg-[#ded8cd] shadow-2xl will-change-transform";

  if (shouldReduceMotion) {
    return (
      <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
        <Image src={images.topRight} alt={imageAlts.topRight} fill sizes="100vw" className="object-cover" />
        {children ? <div className="absolute inset-0 z-10">{children}</div> : null}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} style={{ height: scrollHeight }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">

          {/* Top Left Image */}
          <motion.div
            style={{ x: tlX, y: tlY, opacity: underImagesOpacity }}
            className={cn(baseImageClasses, "z-10")}
          >
            <Image src={images.topLeft} alt={imageAlts.topLeft} fill sizes="36vw" className="object-cover" />
          </motion.div>

          {/* Bottom Right Image */}
          <motion.div
            style={{ x: brX, y: brY, opacity: underImagesOpacity }}
            className={cn(baseImageClasses, "z-20")}
          >
            <Image src={images.bottomRight} alt={imageAlts.bottomRight} fill sizes="36vw" className="object-cover" />
          </motion.div>

          {/* Bottom Left Image */}
          <motion.div
            style={{ x: blX, y: blY, opacity: underImagesOpacity }}
            className={cn(baseImageClasses, "z-30")}
          >
            <Image src={images.bottomLeft} alt={imageAlts.bottomLeft} fill sizes="36vw" className="object-cover" />
          </motion.div>

          {/* Top Right Image (Hero - expands at the end) */}
          <motion.div
            style={{
              x: trX,
              y: trY,
              width: heroWidth,
              height: heroHeight,
            }}
            className={cn(baseImageClasses, "z-40 origin-center bg-black/5")}
          >
            <Image src={images.topRight} alt={imageAlts.topRight} fill sizes="100vw" className="object-cover" />
          </motion.div>

          {children ? (
            <motion.div
              className="absolute inset-0 z-50"
              style={{ opacity: captionOpacity, y: captionY }}
            >
              {children}
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
