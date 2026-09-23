"use client";

import Image from "next/image";
import { ArrowIcon } from "@/components/ArrowIcon";
import StackingCards, { StackingCardItem } from "@/components/fancy/blocks/stacking-cards";
import { ScrollChoreography } from "@/components/ui/scroll-choreography";
import { ScrollSplitCard } from "@/components/ui/scroll-split-card";
import styles from "./EditorialInteractions.module.css";

type DecisionIconKind = "architecture" | "location" | "value";

function DecisionIcon({ kind }: { kind: DecisionIconKind }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/20 bg-current/5"
    >
      {kind === "architecture" && (
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 26h22M8 26V11l8-5 8 5v15M12 26v-6h8v6M12 13h2M18 13h2M12 17h2M18 17h2" />
        </svg>
      )}
      {kind === "location" && (
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m4 23 7-3 10 3 7-3v7l-7 3-10-3-7 3v-7Z" />
          <path d="M21 18s5-4.7 5-9a5 5 0 0 0-10 0c0 4.3 5 9 5 9Z" />
          <circle cx="21" cy="9" r="1.7" />
        </svg>
      )}
      {kind === "value" && (
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 26h22M7 26v-7h5v7M14 26V14h5v12M21 26V9h5v17M7 14l7-5 5 2 7-6" />
          <path d="M22 5h4v4" />
        </svg>
      )}
    </span>
  );
}

const advisoryCards = [
  {
    title: "Buy with clarity",
    text: "A focused shortlist shaped around how you want to live, where you need to be and what should hold value.",
    image: "/images/aria-residence.png",
    alt: "Contemporary apartment residence selected for a buyer",
    tone: "cream",
  },
  {
    title: "Sell with confidence",
    text: "Clear positioning, presentation and negotiation designed to bring the right buyer to the table.",
    image: "/images/story-interior.png",
    alt: "Warm premium interior prepared for property presentation",
    tone: "sand",
  },
  {
    title: "Invest with context",
    text: "Local demand, infrastructure and developer quality translated into a practical long-term property strategy.",
    image: "/images/material-detail.png",
    alt: "Premium architectural detail representing property value",
    tone: "sage",
  },
  {
    title: "Move with support",
    text: "One attentive team across visits, documentation, negotiation and closing, with every detail kept visible.",
    image: "/images/advisory-lifestyle.png",
    alt: "FourPoints advisor supporting clients through a property decision",
    tone: "dark",
  },
];

const decisionCards = [
  {
    title: "Architecture",
    description: "Light, proportion, material and the way a home works every day.",
    bgColor: "#faf7f0",
    textColor: "#1d1d19",
    image: "/images/decision-architecture.png",
    imageAlt: "Warm limestone and glass residential architecture",
    icon: <DecisionIcon kind="architecture" />,
  },
  {
    title: "Location",
    description: "The street, neighbourhood and connections that shape long-term liveability.",
    bgColor: "#b69a68",
    textColor: "#1d1d19",
    image: "/images/decision-location.png",
    imageAlt: "Architectural city model with a highlighted location",
    icon: <DecisionIcon kind="location" />,
  },
  {
    title: "Value",
    description: "A clear view of quality, pricing and future potential before you decide.",
    bgColor: "#20211d",
    textColor: "#fffdf8",
    image: "/images/decision-value.png",
    imageAlt: "Architectural materials arranged to represent lasting value",
    icon: <DecisionIcon kind="value" />,
  },
];

export function AdvisoryStack() {
  return (
    <section className={styles.stackSection} id="services">
      <div className={styles.stackHeading}>
        <h2>Property decisions,<br /><span>handled thoughtfully.</span></h2>
        <p>Four connected services, one clear standard: advice that makes every next step easier to understand.</p>
      </div>

      <StackingCards totalCards={advisoryCards.length} scaleMultiplier={0.018} className={styles.stackDeck}>
        {advisoryCards.map((card, index) => (
          <StackingCardItem
            index={index}
            topPosition={`${82 + index * 16}px`}
            className={styles.stackItem}
            key={card.title}
          >
            <article className={`${styles.stackCard} ${styles[card.tone]}`}>
              <div className={styles.stackCopy}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <a href="#contact">Start a conversation <ArrowIcon /></a>
              </div>
              <div className={styles.stackImage}>
                <Image src={card.image} alt={card.alt} fill sizes="(max-width: 767px) 100vw, 48vw" />
              </div>
            </article>
          </StackingCardItem>
        ))}
      </StackingCards>
    </section>
  );
}

export function ArchitectureChoreography() {
  return (
    <section className={styles.choreographySection}>
      <div className={styles.choreographyIntro}>
        <h2>Four details become<br /><span>one complete place.</span></h2>
        <p>Scroll as architecture, material, landscape and light resolve into the full experience of a home.</p>
      </div>

      <ScrollChoreography
        scrollHeight="240vh"
        images={{
          topLeft: "/images/material-detail.png",
          topRight: "/images/story-interior.png",
          bottomLeft: "/images/oakline-villa.png",
          bottomRight: "/images/aria-residence.png",
        }}
        imageAlts={{
          topLeft: "Natural stone and wood architectural detail",
          topRight: "Warm contemporary residence interior",
          bottomLeft: "Landscaped private villa",
          bottomRight: "Contemporary Pune apartment architecture",
        }}
      >
        <div className={styles.choreographyCaption}>
          <div>
            <h2>Beyond the brochure,<br />every property has a story.</h2>
            <p>We look for the details that make an address meaningful, from morning light to the way rooms bring people together.</p>
          </div>
        </div>
      </ScrollChoreography>
    </section>
  );
}

export function DecisionSplit() {
  return (
    <section className={styles.splitSection}>
      <div className={styles.splitHeading}>
        <h2>One property.<br /><span>Three essential questions.</span></h2>
        <p>Our advice brings the complete decision into view before you move forward.</p>
      </div>

      <div className={styles.splitDesktop}>
        <ScrollSplitCard
          imageSrc="/images/advisory-lifestyle.png"
          imageAlt="Clients reviewing a residence with a FourPoints property advisor"
          cards={decisionCards}
          scrollHeight="315vh"
          startLabel="Look beyond the first impression"
          endTitle="A clearer decision starts here."
        />
      </div>

      <div className={styles.splitMobile}>
        <div className={styles.splitMobileImage}>
          <Image
            src="/images/advisory-lifestyle.png"
            alt="Clients reviewing a residence with a FourPoints property advisor"
            fill
            sizes="100vw"
          />
        </div>
        <div className={styles.splitMobileCards}>
          {decisionCards.map((card, index) => (
            <article key={card.title} style={{ backgroundColor: card.bgColor, color: card.textColor }}>
              <div className={styles.splitMobileCardImage}>
                <Image src={card.image} alt={card.imageAlt} fill sizes="calc(100vw - 92px)" />
              </div>
              <div className={styles.splitMobileCardMeta}>
                {card.icon}
                <span>0{index + 1}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
