"use client";

import Image from "next/image";
import SimpleMarquee from "@/components/fancy/blocks/simple-marquee";
import StackingCards, { StackingCardItem } from "@/components/fancy/blocks/stacking-cards";
import { ScrollChoreography } from "@/components/ui/scroll-choreography";
import { ScrollSplitCard } from "@/components/ui/scroll-split-card";
import styles from "./EditorialInteractions.module.css";

const marketSignals = [
  { place: "Baner", note: "Established west Pune living" },
  { place: "Kalyani Nagar", note: "Prime urban residences" },
  { place: "Koregaon Park", note: "Leafy, central and distinctive" },
  { place: "Kharadi", note: "Connected east Pune growth" },
  { place: "Wakad", note: "Family-led residential demand" },
  { place: "Viman Nagar", note: "Cosmopolitan convenience" },
];

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
  },
  {
    title: "Location",
    description: "The street, neighbourhood and connections that shape long-term liveability.",
    bgColor: "#b69a68",
    textColor: "#1d1d19",
  },
  {
    title: "Value",
    description: "A clear view of quality, pricing and future potential before you decide.",
    bgColor: "#20211d",
    textColor: "#fffdf8",
  },
];

export function MarketMarquee() {
  return (
    <section className={styles.marketSection} aria-label="Pune property market highlights">
      <div className={styles.marketHeader}>
        <strong>Pune, read closely.</strong>
        <p>Hover to slow. Drag to explore. Scroll to change the pace.</p>
      </div>
      <div className={styles.marqueeWindow}>
        <SimpleMarquee
          className={styles.marquee}
          direction="left"
          baseVelocity={4.2}
          repeat={4}
          slowdownOnHover
          slowDownFactor={0.08}
          draggable
          dragSensitivity={0.1}
          dragVelocityDecay={0.94}
          dragAwareDirection
          grabCursor
          useScrollVelocity
          scrollAwareDirection
        >
          <div className={styles.marqueeGroup}>
            {marketSignals.map((item) => (
              <article className={styles.marketSignal} key={item.place}>
                <strong>{item.place}</strong>
                <span>{item.note}</span>
              </article>
            ))}
          </div>
        </SimpleMarquee>
      </div>
    </section>
  );
}

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
                <a href="#contact">Start a conversation <span aria-hidden="true">↗</span></a>
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
          {decisionCards.map((card) => (
            <article key={card.title} style={{ backgroundColor: card.bgColor, color: card.textColor }}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
