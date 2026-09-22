"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FormEvent, MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import VariableFontHoverByLetter from "./fancy/text/variable-font-hover-by-letter";
import { AdvisoryStack, ArchitectureChoreography, DecisionSplit } from "./EditorialInteractions";
import { areas, journal, properties, testimonials } from "./siteData";
import ProjectsCylinder from "./ProjectsCylinder";

const ThreeHouse = dynamic(() => import("./ThreeHouse"), { ssr: false, loading: () => <div className="three-loading">Composing the space…</div> });

function Logo({ light = false, full = false }: { light?: boolean; full?: boolean }) {
  return <a href="#top" className={`logo ${light ? "light" : ""} ${full ? "logo-full" : "logo-compact"}`} aria-label="FourPoints Realty home">
    {full
      ? <span className="logo-full-frame"><Image src="/images/fourpoints-logo.png" alt="" width={2172} height={724} sizes="(max-width: 767px) 88vw, 420px" unoptimized /></span>
      : <span className="logo-header-lockup" aria-hidden="true"><Image src="/images/fourpoints-header-logo.png" alt="" width={2098} height={650} sizes="(max-width: 767px) 170px, 190px" unoptimized /></span>}
  </a>;
}

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

function MagneticLink({ href, children, outline = false }: { href: string; children: React.ReactNode; outline?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    gsap.to(ref.current, { x: (event.clientX - rect.left - rect.width / 2) * 0.16, y: (event.clientY - rect.top - rect.height / 2) * 0.16, duration: 0.35 });
  };
  return <a ref={ref} href={href} onMouseMove={move} onMouseLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: "power3.out" })} className={`button ${outline ? "outline" : ""}`}>{children}<Arrow /></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = ["Projects", "Properties", "About", "Services", "Journal", "Contact"];
  return <>
    <header className="site-header">
      <Logo />
      <nav className="desktop-nav" aria-label="Main navigation">{links.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav>
      <a className="header-cta" href="#contact">Schedule a visit <Arrow /></a>
      <button className="menu-button" onClick={() => setOpen(true)} aria-label="Open navigation"><span /><span /></button>
    </header>
    <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}>
      <div className="mobile-menu-top"><Logo /><button onClick={() => setOpen(false)} aria-label="Close navigation">Close</button></div>
      <nav>{links.map((item, index) => <motion.a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.16 + index * 0.06 }}>{item}</motion.a>)}</nav>
      <p>Pune, Maharashtra · India</p>
    </motion.div>}</AnimatePresence>
  </>;
}

function Preloader() {
  return <div className="preloader"><div className="preloader-brand"><Logo full /></div><div className="load-line"><i /></div></div>;
}

export default function HomeExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [testimonial, setTestimonial] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { document.querySelector(".preloader")?.remove(); return; }
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const header = document.querySelector(".site-header");
    const syncHeader = () => header?.classList.toggle("scrolled", window.scrollY > 60);
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    const context = gsap.context(() => {
      const load = gsap.timeline({ defaults: { ease: "power3.out" } });
      load.to(".load-line i", { scaleX: 1, duration: 0.9 }).to(".preloader-brand", { y: -12, opacity: 0, duration: 0.55 }, ">-.12").to(".preloader", { yPercent: -100, duration: 0.85, ease: "power4.inOut" }).from(".hero-media", { scale: 1.18, duration: 1.4 }, "-=.55").from(".hero-word", { yPercent: 115, rotate: 3, stagger: 0.08, duration: 1 }, "-=1").from(".hero-intro > *", { y: 22, opacity: 0, stagger: 0.08, duration: 0.7 }, "-=.7");
      gsap.to(".hero-media img", { yPercent: 10, scale: 1.06, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-content", { yPercent: 24, opacity: 0.25, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%" } }));
      gsap.utils.toArray<HTMLElement>(".image-reveal").forEach((el) => gsap.from(el, { clipPath: "inset(0 0 100% 0)", duration: 1.35, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 82%" } }));
      gsap.utils.toArray<HTMLElement>(".stat strong").forEach((el) => {
        const end = Number(el.dataset.value || 0); const obj = { value: 0 };
        gsap.to(obj, { value: end, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 84%", once: true }, onUpdate: () => { el.textContent = Math.floor(obj.value) + (el.dataset.suffix || ""); } });
      });
      ScrollTrigger.create({ start: 60, onUpdate: (self) => document.querySelector(".site-header")?.classList.toggle("scrolled", self.scroll() > 60) });
    }, root);
    return () => { context.revert(); cancelAnimationFrame(raf); window.removeEventListener("scroll", syncHeader); lenis.destroy(); };
  }, []);

  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true); };

  return <div ref={root} id="top">
    <Preloader /><Header />
    <main>
      <section className="hero">
        <div className="hero-media"><Image src="/images/hero-residence.png" alt="Contemporary limestone residence overlooking Pune at sunset" fill priority sizes="100vw" /></div>
        <div className="hero-shade" />
        <div className="hero-content shell">
          <h1>
            <span className="line"><VariableFontHoverByLetter label="Spaces that" className="hero-word" fromFontVariationSettings="'wght' 700" toFontVariationSettings="'wght' 800" /></span>
            <span className="line"><VariableFontHoverByLetter label="shape the way" className="hero-word" fromFontVariationSettings="'wght' 700" toFontVariationSettings="'wght' 800" staggerFrom="center" /></span>
            <span className="line"><VariableFontHoverByLetter label="you live." className="hero-word" fromFontVariationSettings="'wght' 700" toFontVariationSettings="'wght' 800" staggerFrom="last" /></span>
          </h1>
          <div className="hero-intro"><p>Curated residences, thoughtful spaces and exceptional real estate across Pune.</p><div className="hero-actions"><MagneticLink href="#properties">Explore properties</MagneticLink><MagneticLink href="#contact" outline>Schedule a visit</MagneticLink></div></div>
        </div>
      </section>

      <section className="intro-section shell" id="approach">
        <div className="intro-grid">
          <div><h2 className="display reveal">The FourPoints approach<br /><span className="heading-accent">to real estate.</span></h2><p className="lede reveal">We bring architecture, light, location and long-term value together to offer property guidance with a clear point of view.</p></div>
        </div>
        <div className="intro-media image-reveal" data-cursor="VIEW"><Image src="/images/story-interior.png" alt="Warm, contemporary residence interior with garden court" fill sizes="(max-width: 768px) 100vw, 78vw" /></div>
      </section>

      <AdvisoryStack />

      <section className="properties-section shell" id="properties">
        <div className="property-heading reveal"><div><h2 className="display">Selected properties<br /><span className="heading-accent">worth coming home to.</span></h2></div><p>A considered collection of residences chosen for how they feel, function and endure.</p></div>
        <div className="property-grid">{properties.map((property) => <article className="property-card" key={property.name} data-cursor="VIEW">
          <a href="#contact"><div className="property-image image-reveal"><Image src={property.image} alt={`${property.name}, ${property.area}`} fill sizes="(max-width: 768px) 100vw, 46vw" /></div>
          <div className="property-meta"><span>{property.kind}</span></div><h3>{property.name}</h3><div className="property-bottom"><p>{property.area}</p><p>{property.price}</p><Arrow /></div></a>
        </article>)}</div>
      </section>

      <ProjectsCylinder />

      <section className="experience-section">
        <div className="experience-copy shell"><div className="experience-title"><h2 className="display reveal">Move through and<br /><span className="heading-accent">experience the space.</span></h2><p className="reveal">Explore the residence to see how volume, material and landscape work together.</p></div></div>
        <div className="three-wrap"><ThreeHouse /></div>
      </section>

      <ArchitectureChoreography />

      <section className="about-section shell" id="about">
        <div className="about-grid"><div><h2 className="display reveal">FourPoints expertise.<br /><span className="heading-accent">Local knowledge and thoughtful advice.</span></h2></div><div className="about-copy reveal"><p>Based in Pune, FourPoints Realty combines local market knowledge with a modern approach to property discovery, advisory and investment.</p><p>We listen closely, research deeply and recommend only what we would stand behind ourselves.</p></div></div>
        <div className="stats">{[[12,"+","Years of experience"],[250,"+","Properties"],[18,"","Pune micro-markets"],[96,"%","Client referrals"]].map(([value,suffix,label]) => <div className="stat" key={String(label)}><strong data-value={value} data-suffix={suffix}>{value}{suffix}</strong><span>{label}</span></div>)}</div>
      </section>

      <section className="pune-section">
        <div className="shell pune-head"><h2 className="display reveal">The city we know.<br /><span className="heading-accent">Rooted in Pune.</span></h2><p className="reveal">Eight neighbourhoods, each with its own rhythm, character and opportunity.</p></div>
        <div className="map shell reveal">
          <svg viewBox="0 0 1000 500" aria-hidden="true"><path d="M50 185 C180 60 280 120 385 210 S580 390 705 220 900 110 960 270"/><path d="M70 340 C220 410 320 260 460 300 S660 460 920 350"/><path d="M185 55 C260 190 455 55 555 170 S750 315 920 75"/></svg>
          {areas.map((area) => <button className="map-point" key={area.name} style={{ left: `${area.x}%`, top: `${area.y}%` }}><i /><span className="point-name">{area.name}</span><span className="point-card"><strong>{area.name}</strong><small>{area.note}</small><b>{area.type}</b><span className="point-price">{area.price}</span></span></button>)}
          <small className="map-note">Indicative demo data · not to scale</small>
        </div>
      </section>

      <DecisionSplit />

      <section className="testimonials-section">
        <div className="shell testimonial-layout"><h2>What our<br />clients say.</h2><div className="quote-wrap">
          <AnimatePresence mode="wait"><motion.blockquote key={testimonial} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .55 }}><span>“</span>{testimonials[testimonial].quote}<footer>{testimonials[testimonial].name}<small>{testimonials[testimonial].city}</small></footer></motion.blockquote></AnimatePresence>
          <div className="testimonial-controls"><button onClick={() => setTestimonial((testimonial + 2) % 3)} aria-label="Previous testimonial">←</button><button onClick={() => setTestimonial((testimonial + 1) % 3)} aria-label="Next testimonial">→</button></div>
        </div></div>
      </section>

      <section className="journal-section shell" id="journal"><div className="journal-head reveal"><div><h2 className="display">From the journal:<br /><span className="heading-accent">notes on considered living.</span></h2></div><a href="#journal">View all stories <Arrow /></a></div>
        <div className="journal-grid">{journal.map((item) => <article className="journal-card" key={item.title}><a href="#journal"><div className="journal-image image-reveal" data-cursor="VIEW"><Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" /></div><div className="journal-meta"><span>{item.tag}</span><span>{item.read}</span></div><h3>{item.title}</h3><span className="read-more">Read story <Arrow /></span></a></article>)}</div>
      </section>

      <section className="contact-section" id="contact"><div className="shell contact-grid"><div><h2 className="display reveal">A private introduction<br /><span className="heading-accent">to your next address.</span></h2><p className="reveal">Tell us what you’re looking for and we’ll help you discover the right property.</p></div>
        <form onSubmit={submit} className="contact-form reveal">{submitted ? <motion.div className="form-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><span>✓</span><h3>Thank you.</h3><p>We’ll be in touch shortly.</p><button type="button" onClick={() => setSubmitted(false)}>Send another enquiry</button></motion.div> : <><label><span>Name</span><input required name="name" autoComplete="name" /></label><label><span>Email</span><input required type="email" name="email" autoComplete="email" /></label><label><span>Phone</span><input required type="tel" name="phone" autoComplete="tel" /></label><label><span>Property preference</span><select required name="preference" defaultValue=""><option value="" disabled>Select an option</option><option>Luxury apartment</option><option>Private villa</option><option>Investment property</option><option>Advisory</option></select></label><button className="submit-button" type="submit">Start a conversation <Arrow /></button></>}</form></div></section>

      <section className="final-cta"><div className="final-orbit" aria-hidden="true"><span /><span /><i /></div><div className="shell"><h2>Let’s find<br /><span className="heading-accent">your place.</span></h2><MagneticLink href="#contact" outline>Schedule a private consultation</MagneticLink></div></section>
    </main>
    <footer className="footer"><div className="shell"><div className="footer-top"><Logo full /><div className="footer-address"><p>Pune, Maharashtra, India</p><a href="mailto:hello@fourpointsrealty.example">hello@fourpointsrealty.example</a><a href="tel:+919000000000">+91 90000 00000</a></div><div className="footer-links"><a href="#projects">Projects</a><a href="#properties">Properties</a><a href="#about">About</a><a href="#services">Services</a><a href="#journal">Journal</a><a href="#contact">Contact</a></div><div className="footer-social"><a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">YouTube</a></div></div><div className="footer-bottom"><span>© 2026 FourPoints Realty</span><span>Thoughtful spaces. Considered living.</span><span>Demo website</span></div></div></footer>
  </div>;
}
