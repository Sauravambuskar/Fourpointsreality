"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CylinderCarousel } from "@/components/motion/cylinder-carousel";
import styles from "./ProjectsCylinder.module.css";

const carouselItems = [
  {
    title: "Curated residences",
    location: "Across Pune's most considered addresses",
    description:
      "A focused selection of apartments and villas chosen for architecture, liveability, location and enduring value.",
    image: "/images/aria-residence.png",
    alt: "Contemporary residence selected by FourPoints Realty",
  },
  {
    title: "Market clarity",
    location: "Local knowledge, clearly explained",
    description:
      "Street-level insight into pricing, connectivity, future growth and the character of every Pune micro-market.",
    image: "/images/hero-residence.png",
    alt: "Modern Pune residence at sunset",
  },
  {
    title: "Private buyer advisory",
    location: "A search shaped around your life",
    description:
      "We listen first, build a relevant shortlist and guide every visit so the decision feels informed rather than rushed.",
    image: "/images/advisory-lifestyle.png",
    alt: "Property advisors reviewing plans with clients",
  },
  {
    title: "Investment strategy",
    location: "Decisions built for the long term",
    description:
      "Opportunity screening grounded in rental demand, infrastructure, developer quality and realistic capital growth.",
    image: "/images/material-detail.png",
    alt: "Detailed view of premium residential architecture",
  },
  {
    title: "Land and development",
    location: "Potential assessed from every angle",
    description:
      "Thoughtful guidance for landowners and developers, from site understanding and positioning to the right market fit.",
    image: "/images/oakline-villa.png",
    alt: "Private villa surrounded by landscaped greenery",
  },
  {
    title: "End-to-end support",
    location: "One team, from shortlist to handover",
    description:
      "Clear communication through negotiation, documentation and closing, with the details managed carefully throughout.",
    image: "/images/story-interior.png",
    alt: "Warm contemporary home interior",
  },
];

export default function ProjectsCylinder() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState(5);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.28 },
    );
    observer.observe(section);

    const media = window.matchMedia("(max-width: 767px)");
    const updateVisibleItems = () => setVisibleItems(media.matches ? 3 : 5);
    updateVisibleItems();
    media.addEventListener("change", updateVisibleItems);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateVisibleItems);
    };
  }, []);

  const activeItem = carouselItems[activeIndex];

  return (
    <section className={styles.section} ref={sectionRef} id="projects">
      <div className={styles.inner}>
        <div className={styles.headingRow}>
          <h2>
            A sharper view of
            <span>Pune real estate.</span>
          </h2>

          <div className={styles.activeCopy} aria-live="polite">
            <h3>{activeItem.title}</h3>
            <strong>{activeItem.location}</strong>
            <p>{activeItem.description}</p>
            <a href="#contact">Discuss your requirement <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className={styles.carouselFrame}>
          <CylinderCarousel
            itemSize={310}
            visibleItems={visibleItems}
            variant="convex"
            minScale={0.5}
            dragSpeed={1.15}
            arc={70}
            height={430}
            autoRotate={isVisible}
            autoRotateSpeed={0.16}
            onIndexChange={setActiveIndex}
            className={styles.carousel}
          >
            {carouselItems.map((item, index) => (
              <article
                className={`${styles.card} ${activeIndex === index ? styles.cardActive : ""}`}
                key={item.title}
                aria-label={item.title}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 767px) 45vw, 310px"
                  draggable={false}
                />
                <span className={styles.cardShade} />
                <h3>{item.title}</h3>
              </article>
            ))}
          </CylinderCarousel>
        </div>

        <p className={styles.interactionHint}>
          Scroll your mouse, drag, or use the arrow keys to explore. The carousel loops continuously.
        </p>
      </div>
    </section>
  );
}
