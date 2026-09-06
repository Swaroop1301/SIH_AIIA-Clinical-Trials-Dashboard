import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Institute', href: 'https://aiia.gov.in/', external: true },
  { label: 'Initiatives', href: '#programs' },
  { label: 'Research', href: '#research' },
  { label: 'Education', href: '#education' },
  { label: 'Patient care', href: '#care' },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['programs', 'research', 'education', 'care'];
      const current = sections.find((id) => {
        const element = document.getElementById(id);
        return element && element.getBoundingClientRect().top < 180 && element.getBoundingClientRect().bottom > 180;
      });
      setActive(current ?? '');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLink = (item: typeof navItems[number], mobile = false) => {
    const className = `${mobile ? 'mobile-nav-link' : 'nav-link'} ${active === item.href.slice(1) ? 'is-active' : ''}`;
    if (item.external) {
      return <a key={item.label} className={className} href={item.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>{item.label}<ArrowUpRight aria-hidden="true" size={14} /></a>;
    }
    return <a key={item.label} className={className} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>;
  };

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#top" className="brand" aria-label="All India Institute of Ayurveda home">
          <span className="brand-mark"><span className="logo-fallback" aria-hidden="true">A</span><img src="https://aiia.gov.in/wp-content/uploads/2020/09/Logo.png" alt="AIIA emblem" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></span>
          <span className="brand-copy"><strong>All India Institute<br className="brand-break" /> of Ayurveda</strong><small>Ministry of Ayush · Govt. of India</small></span>
        </a>
        <div className="desktop-nav">{navItems.map((item) => navLink(item))}</div>
        <div className="nav-actions">
          <Link to="/login" className="portal-link">CTMS portal <ArrowUpRight aria-hidden="true" size={15} /></Link>
          <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </nav>
      <div className={`mobile-nav ${open ? 'is-open' : ''}`} aria-hidden={!open}>{navItems.map((item) => navLink(item, true))}<Link to="/login" className="mobile-portal" onClick={() => setOpen(false)}>Open CTMS portal <ArrowUpRight size={16} /></Link></div>
    </header>
  );
}
