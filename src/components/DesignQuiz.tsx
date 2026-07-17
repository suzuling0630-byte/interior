import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Sparkles, Check, RefreshCw, ChevronRight } from 'lucide-react';

interface QuizOption {
  text: string;
  value: string;
  description: string;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Select your foundational raw material focus',
    subtitle: 'The primary physical element that should dominate the tactile experience of your space.',
    options: [
      { text: 'Roman Travertine & Honed Limestone', value: 'stone', description: 'Cool, monolithic, organic, and geological.' },
      { text: 'Smoked Walnut & Sawn Raw Oak', value: 'wood', description: 'Deep, grounding, aromatic, and architectural.' },
      { text: 'Textured Bouclé Wool & Coarse Belgian Linen', value: 'fabric', description: 'Soft, conversational, comforting, and warm.' },
      { text: 'Raw Hand-Brushed Brass & Matte Cast Iron', value: 'metal', description: 'Sculptural, structural, high-contrast, and precise.' }
    ]
  },
  {
    id: 2,
    title: 'Choose your desired lighting composition',
    subtitle: 'How light should interact with the textures, colors, and shadows of your rooms.',
    options: [
      { text: 'Expansive Daylight Grids', value: 'daylight', description: 'Floor-to-ceiling iron-framed windows framing outside landscapes.' },
      { text: 'Low-slung Warm Amber Glows', value: 'ambient', description: 'Concealed LED soffits and suspended warm glass bulbs.' },
      { text: 'Dramatic Chiaroscuro Shadows', value: 'contrast', description: 'Deep shadows, skylights, and high-contrast natural light rays.' },
      { text: 'Aesthetic Sculptural Accents', value: 'sculptural', description: 'Brushed brass floor lamps that act as physical artworks.' }
    ]
  },
  {
    id: 3,
    title: 'What architectural scale resonates most?',
    subtitle: 'The structural volumes and geometric organization of your living areas.',
    options: [
      { text: 'Soaring Double-Height Plaster Coffers', value: 'lofty', description: 'Airy, grand, monumental, and conversational.' },
      { text: 'Concealed, Monolithic Integrated Blocks', value: 'seamless', description: 'Handleless cabinets, sliding screens, and hidden appliances.' },
      { text: 'Low-Profile Floating Intimacy', value: 'intimate', description: 'Low furniture, suspended shelves, and cozy reading corners.' },
      { text: 'Symmetrical Oval Geometry', value: 'editorial', description: 'Curved wood dining pillars and long dining tables.' }
    ]
  },
  {
    id: 4,
    title: 'Identify your preferred exterior context',
    subtitle: 'The outside world framed by your windows and sliding glass portals.',
    options: [
      { text: 'Lush Curated Secret Gardens', value: 'garden', description: 'Green foliage, changing seasonal colors, and tranquility.' },
      { text: 'High-Density Historic London Brick', value: 'urban', description: 'Georgian streetscapes, tall windows, and cultural heritage.' },
      { text: 'Rolling Meadows or Coastal Horizons', value: 'horizon', description: 'Expansive vistas, endless sky, and natural ventilation.' },
      { text: 'A Quiet Internal Courtyard Sanctuary', value: 'courtyard', description: 'Inward-looking privacy, water features, and silent focus.' }
    ]
  }
];

interface ProfileResult {
  title: string;
  tagline: string;
  description: string;
  paletteColors: string[];
  paletteNames: string[];
  pairingId: string;
  pairingTitle: string;
}

const PROFILES: Record<string, ProfileResult> = {
  stone: {
    title: 'Monolithic Atelier',
    tagline: 'Sculptural. Monolithic. Architectural.',
    description: 'You are drawn to spaces defined by structural mass and singular materials. Large, seamless blocks of Calacatta marble or rough-hewn travertine form the gravity center of your space. Decoration is minimized; instead, the physical form of furniture serves as architectural elements.',
    paletteColors: ['#1C1C1A', '#665D50', '#E5E2DE', '#F0EDE9'],
    paletteNames: ['Fumed Oak', 'Matte Walnut', 'Calacatta Vein', 'Honed Travertine'],
    pairingId: 'culinary-atelier',
    pairingTitle: 'Culinary Atelier'
  },
  wood: {
    title: 'Classic Editorial',
    tagline: 'Symmetrical. Rich. Cultured.',
    description: 'Your aesthetic celebrates timber heritage, symmetry, and bespoke craftsmanship. You appreciate the slow elegance of curved oval dining tables, flemish oak panels, and high-backed dining chairs wrapped in woven wool. Your space feels curated, intellectual, and timeless.',
    paletteColors: ['#31302E', '#665D50', '#D1C5B5', '#FCF9F5'],
    paletteNames: ['Charcoal Ash', 'Warm Walnut', 'Muted Linen', 'Oatmeal Wool'],
    pairingId: 'elysian-hall',
    pairingTitle: 'Elysian Hall'
  },
  fabric: {
    title: 'Warm Minimalist',
    tagline: 'Ethereal. Conversational. Serene.',
    description: 'You prefer soft-curved, welcoming minimal spaces that prioritize human comfort. Curved bouclé lounge sofas, travertine coffee tables, and high coffered ceilings form your ultimate retreat. Natural daylight floods your space, making it soft, airy, and deeply peaceful.',
    paletteColors: ['#1C1C1A', '#858383', '#EDE1D0', '#FCF9F5'],
    paletteNames: ['Midnight Iron', 'Soft Plaster', 'Wool Bouclé', 'Warm Alabaster'],
    pairingId: 'ethereal-dwelling',
    pairingTitle: 'Ethereal Dwelling'
  },
  metal: {
    title: 'Tactile Sanctuary',
    tagline: 'Severe. Textured. Intimate.',
    description: 'You find solace in the contrast between industrial severity and soft natural warmth. Raw cast concrete, brushed brass accents, and low-profile white oak furniture form a cozy nest. High-contrast shadows and low amber glows create a cozy, dramatic atmosphere.',
    paletteColors: ['#1C1C1A', '#747878', '#EDE1D0', '#F6F3EF'],
    paletteNames: ['Raw Concrete', 'Oxidized Brass', 'Oak Panel', 'Textured Linen'],
    pairingId: 'sanctuary-suite',
    pairingTitle: 'Sanctuary Suite'
  }
};

interface DesignQuizProps {
  onPairingSelect: (id: string) => void;
  onApplyProfileToInquiry: (profileName: string, message: string) => void;
}

export default function DesignQuiz({ onPairingSelect, onApplyProfileToInquiry }: DesignQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleSelectOption = (value: string) => {
    const updatedAnswers = { ...answers, [QUESTIONS[currentStep].id]: value };
    setAnswers(updatedAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate result profile based on most dominant answer type
      // Fallback is determined by first question (foundational material)
      const materialFocus = updatedAnswers[1] || 'fabric';
      const calculatedProfile = PROFILES[materialFocus] || PROFILES.fabric;
      setResult(calculatedProfile);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setQuizStarted(true);
    setApplied(false);
  };

  const handleApplyResult = () => {
    if (!result) return;
    const recommendedMsg = `I took the Spatial Quiz and discovered I match the "${result.title}" profile. I am interested in designing a space similar to "${result.pairingTitle}" utilizing materials like ${result.paletteNames.join(', ')}.`;
    onApplyProfileToInquiry(result.title, recommendedMsg);
    setApplied(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-archive-surface-low border border-archive-surface rounded-lg p-6 md:p-10 shadow-[0_30px_60px_rgba(212,200,184,0.06)] relative overflow-hidden">
      
      {/* Background soft aesthetic mesh */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-archive-beige/25 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" />

      <AnimatePresence mode="wait">
        {!quizStarted ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-center space-y-6 py-8 relative z-10"
          >
            <div className="inline-flex items-center space-x-2 bg-archive-beige/40 px-3 py-1 rounded-full text-[10px] uppercase font-label-caps tracking-widest text-archive-secondary">
              <Sliders className="w-3 h-3" />
              <span>Aesthetic Curator</span>
            </div>
            <h3 className="font-serif text-3xl text-archive-charcoal leading-tight max-w-xl mx-auto">
              Discover Your Design Profile
            </h3>
            <p className="font-sans text-sm text-archive-secondary font-light max-w-lg mx-auto leading-relaxed">
              Answer 4 simple, highly curated sensory questions regarding raw materials, lighting, and layout to discover your ARCHIVE spatial pairing.
            </p>
            <button
              onClick={() => setQuizStarted(true)}
              className="bg-archive-charcoal text-white px-10 py-3.5 font-label-caps text-xs uppercase tracking-widest hover:opacity-95 transition-opacity active:scale-95"
            >
              Start Aesthetic Discovery
            </button>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8 relative z-10"
          >
            <div className="text-center space-y-2">
              <span className="font-label-caps text-[10px] text-archive-secondary uppercase tracking-[0.2em]">
                YOUR ARCHITECTURAL MATCH
              </span>
              <h3 className="font-serif text-3xl text-archive-charcoal">{result.title}</h3>
              <p className="text-xs italic text-archive-secondary font-sans">{result.tagline}</p>
            </div>

            <p className="font-sans text-sm text-archive-secondary leading-relaxed font-light text-center max-w-xl mx-auto">
              {result.description}
            </p>

            {/* Material Swatches board */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-label-caps tracking-widest text-archive-outline text-center">
                Your Bespoke Palette Swatches
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {result.paletteColors.map((color, idx) => (
                  <div
                    key={idx}
                    className="bg-archive-surface-lowest border border-archive-surface p-3 rounded flex flex-col items-center text-center space-y-2.5"
                  >
                    <div
                      className="w-full h-12 rounded shadow-inner"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-archive-charcoal leading-none">
                        {result.paletteNames[idx]}
                      </p>
                      <p className="text-[9px] font-mono text-archive-outline mt-1 uppercase">
                        {color}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Project Match */}
            <div className="bg-archive-surface-lowest border border-archive-surface p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[9px] font-mono uppercase text-archive-outline">
                  Recommended Inspiration Case Study
                </span>
                <p className="font-serif text-lg text-archive-charcoal">{result.pairingTitle}</p>
                <p className="text-xs text-archive-secondary font-light">
                  Explore how we applied these materials to a real-world London home.
                </p>
              </div>
              <button
                onClick={() => onPairingSelect(result.pairingId)}
                className="px-6 py-2.5 text-xs font-label-caps uppercase tracking-widest border border-archive-charcoal text-archive-charcoal hover:bg-archive-charcoal hover:text-white transition-all shrink-0"
              >
                Explore Project Details
              </button>
            </div>

            {/* CTA Controls */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4 border-t border-archive-surface">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-8 py-3 text-xs font-label-caps uppercase tracking-wider text-archive-secondary hover:text-archive-charcoal flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retake Discovery</span>
              </button>
              <button
                onClick={handleApplyResult}
                disabled={applied}
                className="w-full sm:w-auto bg-archive-charcoal text-white px-10 py-3.5 font-label-caps text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                {applied ? (
                  <>
                    <Check className="w-4.5 h-4.5 text-archive-beige mr-1" />
                    <span>Applied to contact form</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    <span>Apply Profile to Contact Form</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6 relative z-10"
          >
            {/* Step indicator */}
            <div className="flex items-center justify-between border-b border-archive-surface pb-3">
              <span className="text-[10px] uppercase font-mono text-archive-outline">
                Discovery Process
              </span>
              <span className="text-xs font-semibold text-archive-secondary">
                {currentStep + 1} / {QUESTIONS.length}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-xl text-archive-charcoal leading-snug">
                {QUESTIONS[currentStep].title}
              </h4>
              <p className="text-xs text-archive-secondary font-light font-sans">
                {QUESTIONS[currentStep].subtitle}
              </p>
            </div>

            {/* Grid Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {QUESTIONS[currentStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option.value)}
                  className="w-full text-left p-5 bg-archive-surface-lowest border border-archive-surface hover:border-archive-secondary/60 hover:shadow-md transition-all duration-300 group rounded flex flex-col justify-between min-h-24"
                >
                  <p className="text-xs font-semibold text-archive-charcoal group-hover:text-archive-secondary transition-colors">
                    {option.text}
                  </p>
                  <p className="text-[11px] text-archive-outline font-light mt-2 leading-relaxed">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Back button */}
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-xs text-archive-outline hover:text-archive-secondary font-sans flex items-center space-x-1 pt-2"
              >
                <span>← Previous Question</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
