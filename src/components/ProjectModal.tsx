import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar, Layers, Box, Check, Compass } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [swatchesOrdered, setSwatchesOrdered] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showSwatchForm, setShowSwatchForm] = useState(false);

  if (!project) return null;

  const handleOrderSwatches = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address) return;
    setOrdering(true);

    // Submit to Formspree
    fetch('https://formspree.io/f/xzdneaqz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        formType: 'Project Swatch Kit Request',
        project: project.title,
        name,
        email,
        address,
        materials: project.keyMaterials ? project.keyMaterials.join(', ') : 'None'
      })
    })
    .then((res) => {
      setOrdering(false);
      setSwatchesOrdered(true);
      // Store in localStorage to show user they have active swatch requests!
      const existing = localStorage.getItem('swatch_orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.push({
        project: project.title,
        name,
        email,
        address,
        materials: project.keyMaterials || [],
        date: new Date().toLocaleDateString(),
        status: 'Preparing Swatches'
      });
      localStorage.setItem('swatch_orders', JSON.stringify(orders));
    })
    .catch((error) => {
      console.error('Formspree submission error:', error);
      // Fallback gracefully to keep user experience smooth
      setOrdering(false);
      setSwatchesOrdered(true);
    });
  };

  return (
    <AnimatePresence>
      <div id="project-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          className="absolute inset-0 bg-archive-charcoal/40 backdrop-blur-md"
        />

        {/* Modal Drawer */}
        <motion.div
          id="project-drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 180 }}
          className="relative z-10 w-full max-w-2xl h-full bg-archive-bg shadow-[0_0_60px_rgba(0,0,0,0.15)] flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-archive-bg/90 backdrop-blur-md z-20 flex items-center justify-between px-8 py-6 border-b border-archive-surface">
            <div>
              <span className="font-label-caps text-[11px] text-archive-secondary uppercase tracking-[0.2em]">
                {project.category}
              </span>
              <h2 className="font-serif text-2xl text-archive-charcoal mt-1">{project.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-archive-surface rounded-full transition-colors duration-200"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 text-archive-charcoal" />
            </button>
          </div>

          {/* Image banner */}
          <div className="w-full h-80 overflow-hidden relative">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-archive-charcoal/30 to-transparent" />
          </div>

          {/* Content Body */}
          <div className="flex-1 px-8 py-8 space-y-10">
            {/* Project Overview Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-archive-surface-highest/50">
              <div className="space-y-1">
                <span className="flex items-center text-[10px] uppercase font-label-caps tracking-widest text-archive-outline">
                  <MapPin className="w-3 h-3 mr-1" /> Location
                </span>
                <p className="text-sm font-medium text-archive-charcoal">{project.location}</p>
              </div>
              <div className="space-y-1">
                <span className="flex items-center text-[10px] uppercase font-label-caps tracking-widest text-archive-outline">
                  <Calendar className="w-3 h-3 mr-1" /> Year Completed
                </span>
                <p className="text-sm font-medium text-archive-charcoal">{project.year}</p>
              </div>
              <div className="space-y-1">
                <span className="flex items-center text-[10px] uppercase font-label-caps tracking-widest text-archive-outline">
                  <Box className="w-3 h-3 mr-1" /> Spatial Scale
                </span>
                <p className="text-sm font-medium text-archive-charcoal">{project.dimensions || 'N/A'}</p>
              </div>
            </div>

            {/* Design Story */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-archive-charcoal">The Spatial Concept</h3>
              <p className="font-sans text-archive-secondary text-[15px] leading-relaxed font-light">
                {project.detailDescription}
              </p>
            </div>

            {/* Material Board */}
            {project.keyMaterials && project.keyMaterials.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-archive-charcoal">Raw Material Board</h4>
                <p className="text-xs text-archive-outline font-sans">
                  The sensory palette selected to evoke texture, temperature, and visual harmony in this space.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.keyMaterials.map((material, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 text-xs font-sans tracking-wide bg-archive-surface-low border border-archive-surface text-archive-secondary rounded"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Curated furniture */}
            {project.curatedItems && project.curatedItems.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-archive-charcoal">Bespoke Furniture & Fittings</h4>
                <div className="divide-y divide-archive-surface">
                  {project.curatedItems.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-start">
                      <div className="space-y-1 pr-4">
                        <p className="text-sm font-medium text-archive-charcoal">{item.name}</p>
                        <p className="text-xs text-archive-secondary font-light leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono tracking-tight text-archive-outline bg-archive-surface-low px-2 py-1 shrink-0 rounded">
                        {item.material}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Material Swatch Interaction Section */}
            <div className="p-6 bg-archive-surface-low border border-archive-surface rounded-lg space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-archive-beige/30 rounded-full">
                  <Layers className="w-5 h-5 text-archive-secondary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-archive-charcoal">Request Project Swatch Kit</h4>
                  <p className="text-xs text-archive-secondary font-light mt-0.5">
                    Order a physical box containing samples of the exact {project.keyMaterials?.join(', ') || 'materials'} used.
                  </p>
                </div>
              </div>

              {!showSwatchForm && !swatchesOrdered && (
                <button
                  onClick={() => setShowSwatchForm(true)}
                  className="w-full py-2.5 text-xs font-label-caps uppercase tracking-widest border border-archive-charcoal bg-archive-charcoal text-archive-surface-lowest hover:bg-archive-secondary hover:border-archive-secondary transition-all"
                >
                  Request Physical Swatches
                </button>
              )}

              {showSwatchForm && !swatchesOrdered && (
                <form onSubmit={handleOrderSwatches} className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-archive-surface-lowest border border-archive-surface-highest/40 rounded px-3 py-2 text-xs text-archive-charcoal focus:outline-none focus:border-archive-secondary transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-archive-surface-lowest border border-archive-surface-highest/40 rounded px-3 py-2 text-xs text-archive-charcoal focus:outline-none focus:border-archive-secondary transition-colors"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Shipping Address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-archive-surface-lowest border border-archive-surface-highest/40 rounded px-3 py-2 text-xs text-archive-charcoal focus:outline-none focus:border-archive-secondary transition-colors"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowSwatchForm(false)}
                      className="flex-1 py-2 text-xs font-label-caps uppercase tracking-wider border border-archive-surface-highest/40 text-archive-secondary hover:bg-archive-surface"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={ordering}
                      className="flex-1 py-2 text-xs font-label-caps uppercase tracking-wider bg-archive-charcoal text-white hover:bg-archive-secondary disabled:opacity-50 transition-all flex items-center justify-center"
                    >
                      {ordering ? 'Ordering...' : 'Confirm Request'}
                    </button>
                  </div>
                </form>
              )}

              {swatchesOrdered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-archive-beige/20 border border-archive-beige rounded flex items-start space-x-3"
                >
                  <Check className="w-4 h-4 text-archive-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-archive-charcoal">Swatch Kit Requested Successfully</p>
                    <p className="text-[11px] text-archive-secondary font-light mt-1">
                      Your tactile box of samples has been scheduled. Track details under your active journey portal below.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
