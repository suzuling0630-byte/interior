/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Layers,
  Calendar,
  Search,
  Menu,
  ArrowRight,
  X,
  MapPin,
  Sparkles,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Mail,
  Phone,
  Box,
  Check,
  Globe,
  Map
} from 'lucide-react';

import { PROJECTS, SERVICES } from './data';
import { Project, Service, Inquiry } from './types';
import ProjectModal from './components/ProjectModal';
import DesignQuiz from './components/DesignQuiz';

export default function App() {
  // Navigation and Interactive search states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Gallery slider / selected project states
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form submission & custom client dashboard states
  const [activeTab, setActiveTab] = useState<number>(0); // Offerings services tabs
  const [serviceType, setServiceType] = useState('Interior Design');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('');

  // Local storage lists for user's interactive journey
  const [userInquiries, setUserInquiries] = useState<Inquiry[]>([]);
  const [swatchOrders, setSwatchOrders] = useState<any[]>([]);

  // Automatic hero slider cycle (runs every 6.5s unless hovered)
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % PROJECTS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Fetch local submissions on mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const inquiries = localStorage.getItem('user_inquiries');
        if (inquiries) setUserInquiries(JSON.parse(inquiries));

        const swatches = localStorage.getItem('swatch_orders');
        if (swatches) setSwatchOrders(JSON.parse(swatches));
      } catch (e) {
        console.error('Could not load local storage details', e);
      }
    };
    loadSavedData();

    // Set a listener to update swatches if they are ordered in the modal
    const handleStorageChange = () => {
      loadSavedData();
    };
    window.addEventListener('storage', handleStorageChange);
    // Periodically poll local storage in case the state was updated in the same window (modal side-effects)
    const interval = setInterval(loadSavedData, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleApplyProfile = (profileName: string, generatedMessage: string) => {
    setMessage(generatedMessage);
    setServiceType('Consultation');
    // Smoothly scroll to contact form
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Submit to Formspree
    fetch('https://formspree.io/f/xzdneaqz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        formType: 'Studio Consultation Inquiry',
        serviceType: serviceType,
        name,
        email,
        message
      })
    })
    .then((res) => {
      const newInquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        name,
        email,
        message,
        service: serviceType,
        timestamp: new Date().toLocaleDateString()
      };

      const updatedInquiries = [...userInquiries, newInquiry];
      setUserInquiries(updatedInquiries);
      localStorage.setItem('user_inquiries', JSON.stringify(updatedInquiries));

      // Calculate a professional custom estimated reply time
      const replyHours = 24;
      const now = new Date();
      now.setHours(now.getHours() + replyHours);
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      setEstimatedTime(`tomorrow, ${dayName} by ${timeStr}`);

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    })
    .catch((error) => {
      console.error('Formspree submission error:', error);
      // Fallback gracefully so client experience remains beautiful
      const newInquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        name,
        email,
        message,
        service: serviceType,
        timestamp: new Date().toLocaleDateString()
      };

      const updatedInquiries = [...userInquiries, newInquiry];
      setUserInquiries(updatedInquiries);
      localStorage.setItem('user_inquiries', JSON.stringify(updatedInquiries));

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    });
  };

  // Filter project results for minimal search
  const filteredProjects = PROJECTS.filter((proj) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      proj.title.toLowerCase().includes(query) ||
      proj.category.toLowerCase().includes(query) ||
      proj.keyMaterials?.some((m) => m.toLowerCase().includes(query)) ||
      proj.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-archive-bg min-h-screen font-sans selection:bg-archive-beige selection:text-archive-secondary text-archive-charcoal flex flex-col justify-between">
      
      {/* Search overlay portal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-archive-charcoal/30 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-6"
          >
            <motion.div
              initial={{ y: -30, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -30, scale: 0.98 }}
              className="bg-archive-bg border border-archive-surface w-full max-w-xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-archive-surface-highest/60 pb-3">
                <h3 className="font-serif text-lg font-light text-archive-charcoal">Search Archive Collections</h3>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-1 hover:bg-archive-surface rounded-full text-archive-outline hover:text-archive-charcoal transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a material, city, or style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-archive-surface-low border-0 border-b border-archive-surface-highest focus:border-archive-charcoal focus:ring-0 py-3 text-sm text-archive-charcoal focus:outline-none placeholder:text-archive-outline"
                  autoFocus
                />
              </div>

              {/* Real-time search suggestions chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-archive-outline py-1 pr-1.5">
                  Suggestions:
                </span>
                {['Marble', 'Walnut', 'Bouclé', 'London', 'Renovation', 'Sanctuary'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-[11px] font-sans bg-archive-surface-low hover:bg-archive-surface hover:text-archive-charcoal border border-archive-surface text-archive-secondary px-2.5 py-1 rounded"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Real-time results feed */}
              <div className="max-h-60 overflow-y-auto divide-y divide-archive-surface no-scrollbar">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        setSelectedProject(proj);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left py-3 hover:bg-archive-surface-low/60 px-2 flex items-center space-x-3 transition-colors rounded group"
                    >
                      <img src={proj.image} alt={proj.title} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-archive-charcoal group-hover:text-archive-secondary transition-colors truncate">
                          {proj.title}
                        </p>
                        <p className="text-[11px] text-archive-outline truncate">{proj.category} • {proj.location}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-archive-outline" />
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-archive-outline py-4 text-center">No projects match "{searchQuery}"</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out mobile drawer navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-start overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-archive-charcoal/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="relative z-10 w-80 h-full bg-archive-charcoal text-archive-inverse-on p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-16">
                  <span className="font-serif text-lg tracking-wider text-archive-beige select-none">ARCHIVE</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-full text-archive-beige transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6">
                  {[
                    { label: 'Curation Portfolio', target: 'portfolio-section' },
                    { label: 'Aesthetic Discovery', target: 'quiz-section' },
                    { label: 'Studio Offerings', target: 'services-section' },
                    { label: 'The Studio', target: 'studio-section' },
                    { label: 'Begin Consultation', target: 'contact-section' },
                    { label: 'Active Journey Portal', target: 'active-portal-section' }
                  ].map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.target}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-serif text-xl tracking-wide hover:text-archive-beige transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="space-y-4 text-xs font-light text-archive-outline">
                <p>ARCHIVE INTERIORS © 2026</p>
                <p>Based in Richmond & London, W1</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header Navigation */}
      <header className="fixed top-0 w-full z-40 bg-archive-bg/85 backdrop-blur-xl border-b border-archive-surface-highest/20 shadow-[0_20px_40px_rgba(212,200,184,0.03)] transition-all duration-300">
        <div className="flex justify-between items-center px-6 md:px-12 h-20 w-full max-w-7xl mx-auto">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menu"
            className="p-2 -ml-2 text-archive-charcoal hover:opacity-75 active:scale-95 transition-all"
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>

          <a href="#" className="font-serif text-2xl tracking-widest text-archive-charcoal select-none pl-4">
            ARCHIVE
          </a>

          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="p-2 -mr-2 text-archive-charcoal hover:opacity-75 active:scale-95 transition-all"
          >
            <Search className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-grow pt-20">
        
        {/* Dynamic cross-fading Hero Section */}
        <section className="relative h-[90vh] w-full overflow-hidden bg-archive-charcoal">
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={PROJECTS[heroIndex].image}
                  alt={PROJECTS[heroIndex].title}
                  className="w-full h-full object-cover select-none"
                />
                {/* Soft natural darkening gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-archive-charcoal/30 via-transparent to-archive-charcoal/60" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive slider navigation & slide information overlay */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end pb-16 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="max-w-2xl space-y-6">
              <motion.div
                key={`info-${heroIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-3"
              >
                <span className="inline-block font-label-caps text-[10px] tracking-[0.25em] text-archive-beige uppercase">
                  Featured Case Study • {PROJECTS[heroIndex].category}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-none">
                  {PROJECTS[heroIndex].title === 'Ethereal Dwelling' ? 'Design Your Dream Space' : PROJECTS[heroIndex].title}
                </h1>
                <p className="font-sans text-white/90 text-sm md:text-base font-light max-w-md leading-relaxed">
                  {PROJECTS[heroIndex].description}
                </p>
              </motion.div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setSelectedProject(PROJECTS[heroIndex])}
                  className="bg-white text-archive-charcoal px-10 py-4 font-label-caps text-xs uppercase tracking-widest hover:bg-archive-beige hover:text-archive-secondary transition-all active:scale-95"
                >
                  View Project Details
                </button>
                <a
                  href="#portfolio-section"
                  className="text-white hover:text-archive-beige font-label-caps text-xs uppercase tracking-widest py-4 px-2 transition-colors flex items-center space-x-2"
                >
                  <span>Explore Curation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Slider progress ticks indicators */}
            <div className="flex space-x-2 mt-12 justify-start md:justify-end">
              {PROJECTS.map((proj, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className="h-1 rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{
                    width: heroIndex === idx ? '48px' : '16px',
                    backgroundColor: heroIndex === idx ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)'
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured works portfolio section */}
        <section id="portfolio-section" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="space-y-16">
            <div className="space-y-4">
              <span className="font-label-caps text-[10px] text-archive-secondary uppercase tracking-[0.25em]">
                CURATION
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-archive-charcoal leading-tight">
                Featured Works
              </h2>
              <div className="w-16 h-[1px] bg-archive-charcoal/35 pt-1"></div>
            </div>

            {/* Portfolio Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROJECTS.filter(p => p.id !== 'ethereal-dwelling').map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-[4/5] bg-archive-surface mb-6 shadow-[0_20px_45px_rgba(212,200,184,0.06)] rounded-sm">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    {/* Floating trigger card */}
                    <div className="absolute inset-0 bg-archive-charcoal/5 group-hover:bg-archive-charcoal/15 transition-colors duration-300" />
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <h3 className="font-serif text-xl text-archive-charcoal group-hover:text-archive-secondary transition-colors">
                      {proj.title}
                    </h3>
                    <span className="font-label-caps text-[10px] text-archive-outline uppercase tracking-wider italic">
                      {proj.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic interactive design quiz section */}
        <section id="quiz-section" className="py-20 px-6 md:px-12 bg-archive-surface border-y border-archive-surface-highest/20">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="font-label-caps text-[10px] text-archive-secondary uppercase tracking-[0.25em]">
                Interactive Match
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-archive-charcoal">
                Curate Your Aesthetic
              </h2>
              <p className="text-xs text-archive-secondary font-sans font-light max-w-md mx-auto">
                Discover the exact physical palette and project pairing suited for your unique living preferences.
              </p>
            </div>

            <DesignQuiz
              onPairingSelect={(id) => {
                const match = PROJECTS.find((p) => p.id === id);
                if (match) setSelectedProject(match);
              }}
              onApplyProfileToInquiry={handleApplyProfile}
            />
          </div>
        </section>

        {/* Services offerings section */}
        <section id="services-section" className="py-24 px-6 md:px-12 bg-archive-surface-low border-b border-archive-surface">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <span className="font-label-caps text-[10px] text-archive-secondary uppercase tracking-[0.25em]">
                OFFERINGS
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-archive-charcoal">
                Our Services
              </h2>
            </div>

            {/* Interactive Tabbed service list */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Selector List */}
              <div className="lg:col-span-4 flex flex-col space-y-2">
                {SERVICES.map((serv, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left px-6 py-5 border rounded-sm transition-all flex items-center justify-between group ${
                      activeTab === idx
                        ? 'bg-archive-charcoal border-archive-charcoal text-white shadow-md'
                        : 'bg-archive-surface-lowest border-archive-surface hover:bg-archive-surface text-archive-charcoal'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-mono uppercase tracking-widest opacity-60">
                        0{idx + 1}
                      </p>
                      <h4 className="font-serif text-lg">{serv.title}</h4>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        activeTab === idx ? 'text-archive-beige' : 'text-archive-outline'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Right Details Panel */}
              <div className="lg:col-span-8 bg-archive-surface-lowest border border-archive-surface p-8 md:p-10 rounded-sm shadow-[0_20px_40px_rgba(212,200,184,0.04)] min-h-[320px] flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-archive-secondary">
                    {activeTab === 0 && <Compass className="w-8 h-8 stroke-[1.2]" />}
                    {activeTab === 1 && <Layers className="w-8 h-8 stroke-[1.2]" />}
                    {activeTab === 2 && <Calendar className="w-8 h-8 stroke-[1.2]" />}
                    <h3 className="font-serif text-2xl text-archive-charcoal">
                      {SERVICES[activeTab].title}
                    </h3>
                  </div>

                  <p className="font-sans text-sm text-archive-secondary leading-relaxed font-light">
                    {SERVICES[activeTab].description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {SERVICES[activeTab].details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start space-x-2.5">
                        <Check className="w-4 h-4 text-archive-secondary shrink-0 mt-0.5" />
                        <span className="text-xs text-archive-charcoal font-light">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-archive-surface-low mt-8 flex justify-between items-center flex-wrap gap-4">
                  <p className="text-xs text-archive-outline font-sans">
                    *Every offering is highly custom-tailored during the initial design alignment consultation.
                  </p>
                  <button
                    onClick={() => {
                      setServiceType(SERVICES[activeTab].title);
                      const contactSection = document.getElementById('contact-section');
                      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-label-caps uppercase tracking-widest text-archive-charcoal hover:text-archive-secondary transition-colors inline-flex items-center space-x-1"
                  >
                    <span>Request {SERVICES[activeTab].title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About / The Studio section */}
        <section id="studio-section" className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-8">
              <div className="w-16 h-[1px] bg-archive-charcoal"></div>
              <h2 className="font-serif text-3xl md:text-4xl text-archive-charcoal leading-tight">
                The Studio
              </h2>
              <div className="space-y-6">
                <p className="font-sans text-lg text-archive-secondary leading-relaxed font-light">
                  Based in the heart of London, Archive Interiors is a multi-disciplinary design studio specializing in high-end residential projects that celebrate the beauty of raw materials and spatial harmony.
                </p>
                <p className="font-sans text-sm text-archive-secondary leading-relaxed font-light">
                  We believe that luxury is found in the unspoken—the way light grazes a textured wall, the tactile response of solid oak, and the silent invitation of a perfectly proportioned room. Our approach is deeply personal, architectural, and timeless.
                </p>
              </div>

              {/* Accents metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-archive-surface">
                <div>
                  <p className="font-serif text-3xl text-archive-charcoal leading-none">12+</p>
                  <p className="text-[10px] uppercase font-label-caps tracking-widest text-archive-outline mt-2">
                    London Awards
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-archive-charcoal leading-none">80+</p>
                  <p className="text-[10px] uppercase font-label-caps tracking-widest text-archive-outline mt-2">
                    Residences Curated
                  </p>
                </div>
              </div>
            </div>

            {/* Right workspace photo with caption overlay */}
            <div className="lg:col-span-7 relative">
              <div className="relative w-full aspect-[4/3] shadow-[0_40px_80px_rgba(212,200,184,0.1)] rounded-sm overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDALpbKmoWmQhFjxzRyHTVk_lE_nLQXqsgUskvL15HlFWJhjHROvfu1EP626z3y-S7LvWN8RjB6WFkOlMgCo2jYuvvQefTDL_Duq_dCgQ23vCSYSx-Oynk7Oz-xB1IFrs7V_3V_XVdbHVmk_scpNjAcKUonfjNk_lE4f3de9NXgVWdNR4DdqxriYHcKOdJtRr9U4FccHZ5LhKGkfIj08iR5Ih9DZq_Si1LNM1N1zIpmUnnOTqq0k_cA"
                  alt="Archive studio desk samples"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-archive-bg/90 backdrop-blur px-3 py-1.5 rounded text-[10px] uppercase font-mono tracking-widest text-archive-secondary">
                  Ethereal Dwelling Studio Workspace
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Journey Portal panel (localStorage persistence dashboard) */}
        <section id="active-portal-section" className="py-20 px-6 md:px-12 bg-archive-inverse text-archive-inverse-on border-t border-white/5">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-widest text-archive-beige">
                <span>Personal Studio Access</span>
              </div>
              <h2 className="font-serif text-3xl text-white">
                Your Active Journeys
              </h2>
              <p className="text-xs text-archive-inverse-on/70 font-sans max-w-md font-light">
                Monitor the status of your bespoke design consultations, orders, and physical swatch requests.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Consultation Requests Panel */}
              <div className="bg-white/[0.03] border border-white/10 p-6 rounded space-y-6">
                <h3 className="font-serif text-lg text-archive-beige flex items-center justify-between">
                  <span>Consultations</span>
                  <span className="text-xs text-white/50 font-sans font-light">
                    ({userInquiries.length} Active)
                  </span>
                </h3>

                {userInquiries.length === 0 ? (
                  <div className="py-8 text-center text-xs text-white/45 font-sans font-light">
                    No ongoing design submissions. Initiate a request below to track alignment status here.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                    {userInquiries.map((inq, idx) => (
                      <div
                        key={inq.id}
                        className="bg-white/[0.02] border border-white/5 p-4 rounded space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-semibold text-white">{inq.service}</p>
                            <p className="text-[10px] text-white/50 font-mono mt-0.5">Submitted: {inq.timestamp}</p>
                          </div>
                          <span className="text-[9px] font-label-caps uppercase tracking-wider bg-archive-beige/20 text-archive-beige px-2.5 py-1 rounded-full font-semibold shrink-0">
                            Under Review
                          </span>
                        </div>
                        {inq.message && (
                          <p className="text-xs text-white/70 italic font-light line-clamp-2">
                            "{inq.message}"
                          </p>
                        )}
                        <div className="text-[10px] text-archive-beige font-light flex items-center pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                          <span>Design Director assigned to review details</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swatch Orders Panel */}
              <div className="bg-white/[0.03] border border-white/10 p-6 rounded space-y-6">
                <h3 className="font-serif text-lg text-archive-beige flex items-center justify-between">
                  <span>Tactile Material Swatches</span>
                  <span className="text-xs text-white/50 font-sans font-light">
                    ({swatchOrders.length} Requested)
                  </span>
                </h3>

                {swatchOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-white/45 font-sans font-light">
                    No swatch kits ordered. Open featured projects above to order physical marble or linen samples.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                    {swatchOrders.map((ord: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white/[0.02] border border-white/5 p-4 rounded space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-semibold text-white">{ord.project} Swatch Kit</p>
                            <p className="text-[10px] text-white/50 font-mono mt-0.5">Ordered: {ord.date}</p>
                          </div>
                          <span className="text-[9px] font-label-caps uppercase tracking-wider bg-white/15 text-white px-2.5 py-1 rounded-full shrink-0">
                            Preparing Dispatch
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {ord.materials.map((m: string, mIdx: number) => (
                            <span key={mIdx} className="text-[9px] bg-white/5 text-white/75 px-2 py-0.5 rounded">
                              {m}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed font-light">
                          Shipping to: <span className="text-white/80">{ord.address}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Start Your Journey: Consultation Form */}
        <section id="contact-section" className="bg-archive-charcoal text-white py-24 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Left Column Narrative */}
              <div className="lg:col-span-5 space-y-6">
                <span className="font-label-caps text-[10px] text-archive-beige uppercase tracking-[0.25em]">
                  CONTACT
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-white">
                  Start Your Journey
                </h2>
                <p className="font-sans text-sm text-white/75 font-light leading-relaxed max-w-md">
                  Whether you are planning a comprehensive structural overhaul or styling a single room, our team of directors is ready to frame your vision with architectural rigor.
                </p>

                <div className="pt-8 space-y-4">
                  <div className="flex items-center space-x-3 text-xs text-white/70">
                    <Phone className="w-4 h-4 text-archive-beige shrink-0" />
                    <span>+44 (0) 20 7946 0123</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-white/70">
                    <Mail className="w-4 h-4 text-archive-beige shrink-0" />
                    <span>concierge@archiveinteriors.co.uk</span>
                  </div>
                </div>
              </div>

              {/* Right Column Form */}
              <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 p-8 md:p-10 rounded-sm">
                
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center py-8"
                  >
                    <div className="inline-flex p-3 bg-archive-beige/25 rounded-full text-archive-beige">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl text-white">Journey Initiated</h3>
                      <p className="text-xs text-white/70 font-sans max-w-sm mx-auto leading-relaxed">
                        Thank you for sharing your project parameters. A design partner has been assigned to prepare your initial spatial portfolio.
                      </p>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded max-w-sm mx-auto">
                      <p className="text-[11px] uppercase font-mono tracking-wider text-archive-beige">
                        ESTIMATED BRIEFING FOLLOW-UP
                      </p>
                      <p className="text-sm font-semibold text-white mt-1.5">{estimatedTime}</p>
                    </div>

                    <button
                      onClick={() => setSuccess(false)}
                      className="text-xs text-white/50 hover:text-white font-sans underline pt-4"
                    >
                      Submit another parameters brief
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-8">
                    
                    {/* Service Type Selection row */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-mono text-white/50">
                        Desired Studio Service
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Interior Design', 'Renovation', 'Consultation'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setServiceType(type)}
                            className={`py-2 text-[10px] font-label-caps uppercase tracking-wider rounded-sm border transition-all ${
                              serviceType === type
                                ? 'bg-archive-beige border-archive-beige text-archive-charcoal font-semibold'
                                : 'border-white/10 text-white/80 hover:bg-white/5'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Form inputs */}
                    <div className="space-y-6">
                      <div className="relative border-b border-white/20 focus-within:border-white transition-colors py-1">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent border-none text-white text-sm font-light focus:outline-none focus:ring-0 placeholder:text-white/40"
                        />
                      </div>

                      <div className="relative border-b border-white/20 focus-within:border-white transition-colors py-1">
                        <input
                          type="email"
                          required
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-transparent border-none text-white text-sm font-light focus:outline-none focus:ring-0 placeholder:text-white/40"
                        />
                      </div>

                      <div className="relative border-b border-white/20 focus-within:border-white transition-colors py-1">
                        <textarea
                          placeholder="Tell us about your space parameters..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="w-full bg-transparent border-none text-white text-sm font-light focus:outline-none focus:ring-0 placeholder:text-white/40 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-white text-archive-charcoal py-4 font-label-caps text-xs uppercase tracking-widest hover:bg-archive-beige hover:text-archive-secondary active:scale-95 transition-all font-semibold"
                    >
                      Contact Us
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-archive-surface-low border-t border-archive-surface py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10">
          
          <div className="font-serif text-xl tracking-widest text-archive-charcoal">
            ARCHIVE INTERIORS
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs tracking-wider uppercase font-label-caps">
            {[
              { label: 'Curation Portfolio', target: 'portfolio-section' },
              { label: 'Aesthetic Discovery', target: 'quiz-section' },
              { label: 'Our Offerings', target: 'services-section' },
              { label: 'The Studio', target: 'studio-section' },
              { label: 'Start Consultation', target: 'contact-section' },
              { label: 'Active Journey Portal', target: 'active-portal-section' }
            ].map((link, idx) => (
              <a
                key={idx}
                href={`#${link.target}`}
                className="text-archive-secondary hover:text-archive-charcoal transition-colors font-semibold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex space-x-6 text-archive-secondary">
            <a href="#" className="hover:text-archive-charcoal transition-colors">
              <Globe className="w-5 h-5 stroke-[1.5]" />
            </a>
            <a href="#" className="hover:text-archive-charcoal transition-colors">
              <Map className="w-5 h-5 stroke-[1.5]" />
            </a>
            <a href="#" className="hover:text-archive-charcoal transition-colors">
              <Box className="w-5 h-5 stroke-[1.5]" />
            </a>
          </div>

          <p className="text-[11px] text-archive-outline font-sans">
            © {new Date().getFullYear()} ARCHIVE INTERIORS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Project modal drawer */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

    </div>
  );
}

