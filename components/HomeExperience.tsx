"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Lottie } from "lottie-react";
import { FormEvent, MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import { architecturePanels, areas, journal, properties, services, testimonials } from "./siteData";

const ThreeHouse = dynamic(() => import("./ThreeHouse"), { ssr: false, loading: () => <div className="three-loading">Composing the space…</div> });

const arrowLottie = {
  v: "5.7.4", fr: 30, ip: 0, op: 60, w: 60, h: 60, nm: "arrow",
  layers: [{ ddd: 0, ind: 1, ty: 4, nm: "line", sr: 1, ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [30, 30, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } }, shapes: [{ ty: "gr", it: [{ ty: "sh", ks: { a: 0, k: { i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-12, -5], [0, 7], [12, -5]], c: false } } }, { ty: "st", c: { a: 0, k: [0.12, 0.12, 0.1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.5 }, lc: 2, lj: 2 }, { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }], nm: "arrow" }], ao: 0 }
  ], assets: []
};

function Logo({ light = false }: { light?: boolean }) {
  return <a href="#top" className={`logo ${light ? "light" : ""}`} aria-label="FourPoints Realty home">
    <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
      <path className="petal petal-a" d="M30 3C22 6 11 15 5 28c10-6 18-7 25-2-3-8-3-15 0-23Z" />
      <path className="petal petal-b" d="M61 30C58 22 49 11 36 5c6 10 7 18 2 25 8-3 15-3 23 0Z" />
      <path className="petal petal-c" d="M34 61c8-3 19-12 25-25-10 6-18 7-25 2 3 8 3 15 0 23Z" />
      <path className="petal petal-d" d="M3 34c3 8 12 19 25 25-6-10-7-18-2-25-8 3-15 3-23 0Z" />
      <rect x="27" y="27" width="4.5" height="4.5" rx=".7" /><rect x="33" y="27" width="4.5" height="4.5" rx=".7" />
      <rect x="27" y="33" width="4.5" height="4.5" rx=".7" /><rect x="33" y="33" width="4.5" height="4.5" rx=".7" />
    </svg>
    <span className="logo-copy"><span className="logo-word"><b>Four</b><strong>Points</strong></span><small>Realty</small></span>
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
      <Logo light />
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

function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(dot.current, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(dot.current, "y", { duration: 0.35, ease: "power3" });
    const move = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
    const over = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement;
      const mode = target.closest("[data-cursor]")?.getAttribute("data-cursor") || (target.closest("a,button") ? "LINK" : "");
      if (dot.current) { dot.current.dataset.mode = mode; dot.current.classList.toggle("expanded", Boolean(mode)); }
    };
    window.addEventListener("pointermove", move); document.addEventListener("mouseover", over);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("mouseover", over); };
  }, []);
  return <div ref={dot} className="cursor" />;
}

function Preloader() {
  return <div className="preloader"><div className="preloader-brand"><Logo /></div><div className="load-line"><i /></div></div>;
}

export default function HomeExperience() {
  const root = useRef<HTMLDivElement>(null);
  const horizontal = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
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
      gsap.from(".service-row", { y: 38, opacity: 0, stagger: 0.11, scrollTrigger: { trigger: ".services-list", start: "top 76%" } });
      gsap.utils.toArray<HTMLElement>(".stat strong").forEach((el) => {
        const end = Number(el.dataset.value || 0); const obj = { value: 0 };
        gsap.to(obj, { value: end, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 84%", once: true }, onUpdate: () => { el.textContent = Math.floor(obj.value) + (el.dataset.suffix || ""); } });
      });
      if (horizontal.current && track.current && window.innerWidth > 767) {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        gsap.to(track.current, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: horizontal.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
      }
      ScrollTrigger.create({ start: 60, onUpdate: (self) => document.querySelector(".site-header")?.classList.toggle("scrolled", self.scroll() > 60) });
    }, root);
    return () => { context.revert(); cancelAnimationFrame(raf); window.removeEventListener("scroll", syncHeader); lenis.destroy(); };
  }, []);

  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true); };

  return <div ref={root} id="top">
    <Preloader /><CustomCursor /><Header />
    <main>
      <section className="hero">
        <div className="hero-media"><Image src="/images/hero-residence.png" alt="Contemporary limestone residence overlooking Pune at sunset" fill priority sizes="100vw" /></div>
        <div className="hero-shade" />
        <div className="hero-content shell">
          <div className="eyebrow light"><span>FourPoints Realty</span><span>Pune · India</span></div>
          <h1><span className="line"><span className="hero-word">Spaces that</span></span><span className="line"><span className="hero-word italic">shape the way</span></span><span className="line"><span className="hero-word">you live.</span></span></h1>
          <div className="hero-intro"><p>Curated residences, thoughtful spaces and exceptional real estate across Pune.</p><div className="hero-actions"><MagneticLink href="#properties">Explore properties</MagneticLink><MagneticLink href="#contact" outline>Schedule a visit</MagneticLink></div></div>
        </div>
        <a className="scroll-cue" href="#approach" aria-label="Scroll to introduction"><Lottie src={arrowLottie} loop={false} autoplay /></a>
      </section>

      <section className="intro-section shell" id="approach">
        <div className="intro-grid">
          <div className="eyebrow reveal"><span>The FourPoints approach</span></div>
          <div><h2 className="display reveal">Real estate,<br /><span className="heading-accent">with a point of view.</span></h2><p className="lede reveal">FourPoints Realty brings together architecture, location and long-term value to create a more considered way of discovering property.</p></div>
        </div>
        <div className="intro-media image-reveal" data-cursor="VIEW"><Image src="/images/story-interior.png" alt="Warm, contemporary residence interior with garden court" fill sizes="(max-width: 768px) 100vw, 78vw" /><span>Architecture / Light / Life</span></div>
      </section>

      <section className="services-section" id="services">
        <div className="shell section-head reveal"><div className="eyebrow"><span>What we do</span><span>Thoughtful at every turn</span></div><h2 className="display">A clearer way<br />to move <span className="heading-accent">forward.</span></h2></div>
        <div className="services-list shell">{services.map((service) => <a href="#contact" className="service-row" key={service.no}>
          <span className="service-icon">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p><span className="round-arrow"><Arrow /></span>
          <span className="service-image"><Image src={service.no === "01" || service.no === "03" ? "/images/aria-residence.png" : "/images/oakline-villa.png"} alt="" fill sizes="240px" /></span>
        </a>)}</div>
      </section>

      <section className="properties-section shell" id="properties">
        <div className="property-heading reveal"><div><span className="kicker">Selected properties</span><h2 className="display">Architecture worth<br /><span className="heading-accent">coming home to.</span></h2></div><p>A small collection of residences chosen for how they feel, function and endure.</p></div>
        <div className="property-grid">{properties.map((property) => <article className="property-card" key={property.name} data-cursor="VIEW">
          <a href="#contact"><div className="property-image image-reveal"><Image src={property.image} alt={`${property.name}, ${property.area}`} fill sizes="(max-width: 768px) 100vw, 46vw" /></div>
          <div className="property-meta"><span>{property.kind}</span></div><h3>{property.name}</h3><div className="property-bottom"><p>{property.area}</p><p>{property.price}</p><Arrow /></div></a>
        </article>)}</div>
      </section>

      <section className="horizontal-story" ref={horizontal} id="projects">
        <div className="horizontal-track" ref={track}>
          <div className="horizontal-intro"><span className="kicker">A study in five parts</span><h2>Architecture<br /><span className="heading-accent">in motion.</span></h2><p>Scroll to explore the details that turn buildings into places of belonging.</p></div>
          {architecturePanels.map((panel) => <article className="architecture-panel" key={panel.word} data-cursor="DRAG"><Image src={panel.image} alt={`Architectural study of ${panel.word.toLowerCase()}`} fill sizes="85vw" style={{ objectPosition: panel.pos }} /><div className="panel-shade"/><h3>{panel.word}</h3></article>)}
        </div>
      </section>

      <section className="experience-section">
        <div className="experience-copy shell"><div className="eyebrow reveal"><span>Interactive residence</span><span>Move to explore</span></div><div className="experience-title"><h2 className="display reveal">Experience<br /><span className="heading-accent">the space.</span></h2><p className="reveal">Architecture is more than an elevation. Explore how volume, material and landscape work together.</p></div></div>
        <div className="three-wrap"><ThreeHouse /></div>
      </section>

      <section className="story-section">
        <div className="story-image image-reveal"><Image src="/images/story-interior.png" alt="Sunset inside a warm contemporary Pune residence" fill sizes="100vw" /></div><div className="story-shade" />
        <div className="story-copy shell"><span className="kicker">Beyond the brochure</span><h2>Every property<br /><span className="heading-accent">has a story.</span></h2><p>We look for the details that make an address meaningful: light at breakfast, a garden at dusk, and the way a room brings people together.</p></div>
      </section>

      <section className="about-section shell" id="about">
        <div className="about-grid"><div><span className="kicker reveal">About FourPoints</span><h2 className="display reveal">Local knowledge.<br /><span className="heading-accent">Thoughtful advice.</span></h2></div><div className="about-copy reveal"><p>Based in Pune, FourPoints Realty combines local market knowledge with a modern approach to property discovery, advisory and investment.</p><p>We listen closely, research deeply and recommend only what we would stand behind ourselves.</p></div></div>
        <div className="stats">{[[12,"+","Years of experience"],[250,"+","Properties"],[18,"","Pune micro-markets"],[96,"%","Client referrals"]].map(([value,suffix,label]) => <div className="stat" key={String(label)}><strong data-value={value} data-suffix={suffix}>{value}{suffix}</strong><span>{label}</span></div>)}</div>
      </section>

      <section className="pune-section">
        <div className="shell pune-head"><span className="kicker reveal">The city we know</span><h2 className="display reveal">Rooted in <span className="heading-accent">Pune.</span></h2><p className="reveal">Eight neighbourhoods. Each with its own rhythm, character and opportunity.</p></div>
        <div className="map shell reveal">
          <svg viewBox="0 0 1000 500" aria-hidden="true"><path d="M50 185 C180 60 280 120 385 210 S580 390 705 220 900 110 960 270"/><path d="M70 340 C220 410 320 260 460 300 S660 460 920 350"/><path d="M185 55 C260 190 455 55 555 170 S750 315 920 75"/></svg>
          {areas.map((area) => <button className="map-point" key={area.name} style={{ left: `${area.x}%`, top: `${area.y}%` }}><i /><span className="point-name">{area.name}</span><span className="point-card"><strong>{area.name}</strong><small>{area.note}</small><b>{area.type}</b><span className="point-price">{area.price}</span></span></button>)}
          <small className="map-note">Indicative demo data · not to scale</small>
        </div>
      </section>

      <section className="lifestyle-section shell">
        <div className="lifestyle-image image-reveal" data-cursor="VIEW"><Image src="/images/advisory-lifestyle.png" alt="A couple reviewing architectural plans with a FourPoints advisor" fill sizes="100vw" /></div>
        <div className="lifestyle-card reveal"><span className="kicker">Property, personally</span><h2>Advice that starts<br /><span className="heading-accent">with listening.</span></h2><p>No two searches are the same. We begin with how you want to live, then build the right shortlist around it.</p><MagneticLink href="#contact">Our approach</MagneticLink></div>
      </section>

      <section className="testimonials-section">
        <div className="shell testimonial-layout"><div><span className="kicker">Kind words</span></div><div className="quote-wrap">
          <AnimatePresence mode="wait"><motion.blockquote key={testimonial} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .55 }}><span>“</span>{testimonials[testimonial].quote}<footer>{testimonials[testimonial].name}<small>{testimonials[testimonial].city}</small></footer></motion.blockquote></AnimatePresence>
          <div className="testimonial-controls"><button onClick={() => setTestimonial((testimonial + 2) % 3)} aria-label="Previous testimonial">←</button><button onClick={() => setTestimonial((testimonial + 1) % 3)} aria-label="Next testimonial">→</button></div>
        </div></div>
      </section>

      <section className="journal-section shell" id="journal"><div className="journal-head reveal"><div><span className="kicker">From the journal</span><h2 className="display">Notes on<br /><span className="heading-accent">considered living.</span></h2></div><a href="#journal">View all stories <Arrow /></a></div>
        <div className="journal-grid">{journal.map((item) => <article className="journal-card" key={item.title}><a href="#journal"><div className="journal-image image-reveal" data-cursor="VIEW"><Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" /></div><div className="journal-meta"><span>{item.tag}</span><span>{item.read}</span></div><h3>{item.title}</h3><span className="read-more">Read story <Arrow /></span></a></article>)}</div>
      </section>

      <section className="contact-section" id="contact"><div className="shell contact-grid"><div><span className="kicker reveal">Private introductions</span><h2 className="display reveal">Your next address<br /><span className="heading-accent">starts here.</span></h2><p className="reveal">Tell us what you’re looking for and we’ll help you discover the right property.</p></div>
        <form onSubmit={submit} className="contact-form reveal">{submitted ? <motion.div className="form-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><span>✓</span><h3>Thank you.</h3><p>We’ll be in touch shortly.</p><button type="button" onClick={() => setSubmitted(false)}>Send another enquiry</button></motion.div> : <><label><span>Name</span><input required name="name" autoComplete="name" /></label><label><span>Email</span><input required type="email" name="email" autoComplete="email" /></label><label><span>Phone</span><input required type="tel" name="phone" autoComplete="tel" /></label><label><span>Property preference</span><select required name="preference" defaultValue=""><option value="" disabled>Select an option</option><option>Luxury apartment</option><option>Private villa</option><option>Investment property</option><option>Advisory</option></select></label><button className="submit-button" type="submit">Start a conversation <Arrow /></button></>}</form></div></section>

      <section className="final-cta"><div className="final-orbit" aria-hidden="true"><span /><span /><i /></div><div className="shell"><span className="kicker">FourPoints Realty · Pune</span><h2>Let’s find<br /><span className="heading-accent">your place.</span></h2><MagneticLink href="#contact" outline>Schedule a private consultation</MagneticLink></div></section>
    </main>
    <footer className="footer"><div className="shell"><div className="footer-top"><Logo light /><div className="footer-address"><p>Pune, Maharashtra, India</p><a href="mailto:hello@fourpointsrealty.example">hello@fourpointsrealty.example</a><a href="tel:+919000000000">+91 90000 00000</a></div><div className="footer-links"><a href="#projects">Projects</a><a href="#properties">Properties</a><a href="#about">About</a><a href="#services">Services</a><a href="#journal">Journal</a><a href="#contact">Contact</a></div><div className="footer-social"><a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">YouTube</a></div></div><div className="footer-bottom"><span>© 2026 FourPoints Realty</span><span>Thoughtful spaces. Considered living.</span><span>Demo website</span></div></div></footer>
  </div>;
}
