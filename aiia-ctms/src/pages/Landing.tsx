import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, ChevronDown, ExternalLink, FlaskConical, HeartPulse, Leaf, Microscope, Stethoscope, UsersRound } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';

const official = {
  aiia: 'https://aiia.gov.in/',
  archive: 'https://archive.aiia.gov.in/about/about-all-india-institute-of-ayurveda/history/',
  hospital: 'https://archive.aiia.gov.in/about/infrastructure/institute-hospital/',
  ayurvidya: 'https://ayurvidya.aiia.gov.in/panel/login',
  pharmacovigilance: 'https://suraksha.ayush.gov.in/about',
  research: 'https://www.aiia.gov.in/wp-content/uploads/2023/06/AIIA-SSR-Revised.pdf',
  ayurswasthya: 'https://ayush.gov.in/resources/pdf/schemes/Ayurswasthya.pdf',
  ministry: 'https://ayush.gov.in/',
  ctri: 'https://ctri.nic.in/',
};

const programs = [
  { category: 'Public health', title: 'Ayurswasthya Yojana', description: 'A Ministry of Ayush scheme supporting public-health initiatives and Centres of Excellence in Ayush.', image: 'https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?auto=format&fit=crop&w=1000&q=82', href: official.ayurswasthya },
  { category: 'Patient safety', title: 'Ayush Suraksha', description: 'Learn about the Pharmacovigilance Programme for ASU&H drugs, coordinated by the national network.', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1000&q=82', href: official.pharmacovigilance },
  { category: 'Learning', title: 'Ayurvidya portal', description: 'Access AIIA’s digital learning portal for Ayurveda education and continuing learning resources.', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=82', href: official.ayurvidya },
];

const focusAreas = [
  { icon: FlaskConical, label: 'Scientific inquiry', text: 'Research promotion and institutional facilities for rigorous, ethical work.' },
  { icon: Microscope, label: 'Clinical research', text: 'Evidence-building that brings research discipline to Ayurvedic care.' },
  { icon: UsersRound, label: 'Collaboration', text: 'AIIA’s official updates document partnerships across academic and research activity.' },
];

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={reduced ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function OfficialLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={className} target="_blank" rel="noreferrer">{children}<ArrowUpRight aria-hidden="true" size={16} /></a>;
}

export default function Landing() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 115]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main id="top" className="site-shell">
      <PublicNavbar />
      <section ref={heroRef} className="hero" aria-labelledby="hero-title">
        <motion.div className="hero-image" style={{ y: heroY }}>
          <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2200&q=88" srcSet="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80 900w, https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=84 1600w, https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2200&q=88 2200w" sizes="100vw" alt="Traditional Ayurvedic wellness treatment with herbs" fetchPriority="high" />
        </motion.div>
        <div className="hero-wash" />
        <div className="hero-grain" />
        <div className="hero-content container">
          <Reveal><p className="eyebrow light"><Leaf size={15} aria-hidden="true" /> A national institute for Ayurveda</p></Reveal>
          <Reveal delay={0.06}><h1 id="hero-title">Knowledge <br className="mobile-break" />shaped by <br className="mobile-break" /><em>nature.</em><br />Care advanced <br className="mobile-break" />by science.</h1></Reveal>
          <Reveal delay={0.12}><p className="hero-copy">All India Institute of Ayurveda brings together classical knowledge, clinical care, education and research to help Ayurveda serve the future of health.</p></Reveal>
          <Reveal delay={0.18} className="hero-actions"><OfficialLink href={official.aiia} className="button primary">Explore AIIA <ArrowRight aria-hidden="true" /></OfficialLink><a className="button ghost" href="#programs">Key schemes &amp; programs <ArrowDown aria-hidden="true" size={17} /></a></Reveal>
        </div>
        <a className="scroll-cue" href="#introduction"><span>Discover AIIA</span><ChevronDown aria-hidden="true" size={17} /></a>
      </section>

      <section id="introduction" className="intro section container">
        <Reveal className="intro-kicker"><p className="eyebrow"><span /> A modern Ayurveda institution</p></Reveal>
        <Reveal delay={0.08} className="intro-copy"><h2>Where a living tradition meets the discipline of an apex institution.</h2><p>AIIA is an autonomous institute under the Ministry of Ayush, dedicated to advancing Ayurveda through tertiary care, postgraduate and doctoral education, and research.</p><OfficialLink href={official.archive} className="text-link">About the institute</OfficialLink></Reveal>
        <Reveal delay={0.16} className="intro-image image-frame"><img loading="lazy" src="https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1100&q=84" alt="Fresh medicinal herbs and plants" /></Reveal>
      </section>

      <section id="programs" className="programs section">
        <div className="container">
          <Reveal><p className="eyebrow"><span /> National initiatives</p><div className="section-heading"><h2>Key schemes &amp;<br />programs</h2><p>Explore official programmes and platforms connected to Ayurveda, public health, learning and patient safety.</p></div></Reveal>
          <div className="program-grid">{programs.map((program, index) => <Reveal key={program.title} delay={index * 0.08} className="program-card"><img loading="lazy" src={program.image} alt="" /><div className="card-overlay" /><div className="program-content"><p>{program.category}</p><h3>{program.title}</h3><span>{program.description}</span><OfficialLink href={program.href} className="card-link">Read official details</OfficialLink></div></Reveal>)}</div>
        </div>
      </section>

      <section id="research" className="research section">
        <div className="container research-layout">
          <Reveal className="research-visual"><div className="image-frame large"><img loading="lazy" src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=84" alt="Healthcare professional reviewing research material" /></div><div className="research-note"><Microscope aria-hidden="true" /><span>Research is one of AIIA’s stated institutional focus areas.</span></div></Reveal>
          <div className="research-copy"><Reveal><p className="eyebrow light"><span /> Research at AIIA</p><h2>Evidence, ethics and inquiry at the centre.</h2><p>From foundational work to scientific validation, drug development, standardisation, quality control and safety evaluation, research is central to AIIA’s purpose.</p></Reveal><div className="focus-list">{focusAreas.map((area, index) => <Reveal key={area.label} delay={0.1 + index * 0.08} className="focus-item"><area.icon aria-hidden="true" /><div><h3>{area.label}</h3><p>{area.text}</p></div></Reveal>)}</div><Reveal delay={0.34}><OfficialLink href={official.research} className="button light-button">Read the institutional report <ExternalLink aria-hidden="true" /></OfficialLink></Reveal></div>
        </div>
      </section>

      <section id="education" className="education section container">
        <Reveal><p className="eyebrow"><span /> Learn with AIIA</p><div className="section-heading"><h2>Education that carries knowledge forward.</h2><p>Explore the institute’s official announcements, training and digital learning resources.</p></div></Reveal>
        <div className="education-grid"><Reveal delay={0.05} className="education-main"><img loading="lazy" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1300&q=84" alt="Students collaborating in a learning environment" /><div><BookOpen aria-hidden="true" /><p>Academic &amp; training</p><h3>Discover current courses, workshops and notices from AIIA.</h3><OfficialLink href={official.aiia} className="text-link">Visit announcements</OfficialLink></div></Reveal><div className="education-side"><Reveal delay={0.12} className="side-card"><Stethoscope aria-hidden="true" /><h3>Continuing learning</h3><p>Use the Ayurvidya portal to access AIIA’s digital learning environment.</p><OfficialLink href={official.ayurvidya} className="text-link">Open Ayurvidya</OfficialLink></Reveal><Reveal delay={0.2} className="side-card bronze"><Leaf aria-hidden="true" /><h3>Ayurveda in practice</h3><p>See how AIIA’s institutional vision brings education, care and research together.</p><OfficialLink href={official.archive} className="text-link">Institutional vision</OfficialLink></Reveal></div></div>
      </section>

      <section id="care" className="care section">
        <div className="container care-layout"><Reveal className="care-content"><p className="eyebrow light"><HeartPulse size={16} aria-hidden="true" /> Patient care</p><h2>Care rooted in the whole person.</h2><p>AIIA’s institute hospital is envisioned as a centre of excellence for tertiary Ayurvedic healthcare, education, research and patient care.</p><OfficialLink href={official.hospital} className="button outline-light">Explore institute hospital <ArrowRight aria-hidden="true" /></OfficialLink></Reveal><Reveal delay={0.1} className="care-image"><img loading="lazy" src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1300&q=84" alt="Doctor providing attentive patient care" /></Reveal></div>
      </section>

      <section className="resource-strip"><div className="container"><Reveal className="resource-inner"><div><p className="eyebrow"><span /> Useful official resources</p><h2>Go further with trusted information.</h2></div><div className="resource-links"><OfficialLink href={official.ministry}>Ministry of Ayush</OfficialLink><OfficialLink href={official.ctri}>Clinical Trials Registry – India</OfficialLink></div></Reveal></div></section>

      <footer className="site-footer"><div className="container footer-grid"><div><a href="#top" className="footer-brand">AIIA<span>.</span></a><p>All India Institute of Ayurveda<br />Gautampuri, Sarita Vihar, Mathura Road<br />New Delhi – 110076</p></div><div><p className="footer-label">Explore</p><a href="#programs">Initiatives</a><a href="#research">Research</a><a href="#education">Education</a><a href="#care">Patient care</a></div><div><p className="footer-label">Connect</p><OfficialLink href={official.aiia}>Official website</OfficialLink><Link to="/app">CTMS portal</Link><OfficialLink href={official.ministry}>Ministry of Ayush</OfficialLink></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} All India Institute of Ayurveda. All rights reserved.</span><span>Designed for clarity, care and access.</span></div></footer>
    </main>
  );
}
