import { Project, Service } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'sanctuary-suite',
    title: 'Sanctuary Suite',
    category: 'Residential',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsIAuNLnptnrP0crFrFVlReFAR4FJQ4XLHVsb0Fhokejt8XIyueKmLfxNudKSLlodaMWgE0tzgaeMf4NjQVZfqQaw0uAju_maYmjRJoHImWljE91kIjgc0CpIJprYUSn1eb5V8o5FeGXBPt0RX6n5vT2Y9tUy2sOD25wopV_OqxCQq1s28M7viH2TQyR-br0GoG3C1CYeNZDp5cKyqr0dZcbb7jiw4qtjpt9uuODSUw9GxfnjnMTE',
    description: 'A serene sleeping chamber exploring the dialogue between tactile textures and concrete severity.',
    detailDescription: 'The Sanctuary Suite was designed as an escape from London\'s rapid pulse. Concrete walls are balanced with warm European white oak paneling and heavy-weave Belgian linen drapes. A suspended floating bedside table minimizes floor clutter, drawing the eyes toward the floor-to-ceiling windows overlooking a curated garden.',
    year: '2025',
    location: 'Hampstead, London',
    dimensions: '34 m²',
    keyMaterials: ['Textured Concrete', 'Sawn White Oak', 'Belgian Linen', 'Raw Brass'],
    curatedItems: [
      {
        name: 'The Rest Bedframe',
        description: 'Low-slung oak base with an integrated headboard shelf.',
        material: 'Solid White Oak'
      },
      {
        name: 'Sentry Pendant Lights',
        description: 'Blown glass fixtures with a hand-brushed finish.',
        material: 'Raw Brass & Opal Glass'
      },
      {
        name: 'Classic Wing Lounge',
        description: 'An organic reading armchair paired with an ottoman.',
        material: 'Bouclé Wool'
      }
    ]
  },
  {
    id: 'culinary-atelier',
    title: 'Culinary Atelier',
    category: 'Renovation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEOgWyweN_0eeyzy_H3w8UOFXng6ctk5BeYt_Y3fmTPxvvSXjt2uL2sCkETHKHhUcbxflLgPRNpTYqsdaePtwlgDm9gOnPEONtFFlkvJoA_Mc7yL0F3ZD3sai-xm-64h2P5ELiDqnr1zIZLtDnwU5tf7KCATw3T8phR7iAXtR1mKWY7om_Zpkz5nqF84Ore8HldCdBzJXDB5YJPbyMgkpL8Lghy9bgNuR_dzqJSabSXZDvgdRw7xA2',
    description: 'A monolithic marble kitchen block balanced by the warmth of natural walnut timber.',
    detailDescription: 'Culinary Atelier is a study in material contrast. The center of gravity is an exceptional Calacatta marble island, wrapped completely around its sides, topped with an elevated solid American walnut breakfast bar. Dark matte oak cabinetry runs the perimeter, housing integrated state-of-the-art appliances with a concealed sliding range hood.',
    year: '2024',
    location: 'Chelsea, London',
    dimensions: '42 m²',
    keyMaterials: ['Calacatta Marble', 'American Walnut', 'Fumed Oak', 'Satin Bronze'],
    curatedItems: [
      {
        name: 'Atelier Stool',
        description: 'High-backed barstools with tailored leather seats.',
        material: 'Walnut & Full-Grain Leather'
      },
      {
        name: 'Linear Cylindrical Pendant',
        description: 'A custom double-tier architectural brass fixture.',
        material: 'Satin Bronze & Acrylic'
      },
      {
        name: 'Minimal Faucet',
        description: 'Concealed control gooseneck kitchen faucet.',
        material: 'Satin Brass'
      }
    ]
  },
  {
    id: 'elysian-hall',
    title: 'Elysian Hall',
    category: 'Styling',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5OD_09EPwayDAncTCI9sGbuyfBpY8Yyxddkeh1Y0mevZDf3pHCQoSW6g0nlzIQguNNS_b71K90XDHeuoPMgFtKBQp4WOqDMnVJ_KrZ6DW0GixRtqPz-RCFaeqpTsWSfYdSMpSWZw5uJ3_rW3CC4Oo37NU7SEsbF0Pu-NB6JqNMTsguz5Lp4v2FkgMk7kxBSWgy3aM0vD3-4tDE9v6A5dkMNH5LC4DmDjHdgavL2MLVI_P_-oWf-Y1',
    description: 'A sculptural, oval walnut dining table framed by high-contrast matte steel architectural drapes.',
    detailDescription: 'At Elysian Hall, we designed a dining space that doubles as an art gallery. An extraordinary custom-carved oval walnut dining table forms the centerpiece, supported by heavy-set curved timber pedestals. It is paired with minimalist upholstered dining chairs in an oatmeal-toned woven wool.',
    year: '2024',
    location: 'Kensington, London',
    dimensions: '28 m²',
    keyMaterials: ['Flemish Oak', 'Scandinave Wool', 'Curved Solid Walnut', 'Mouthblown Glass'],
    curatedItems: [
      {
        name: 'Elysian Dining Table',
        description: 'Custom organic oval table with dual pillar bases.',
        material: 'Solid Walnut'
      },
      {
        name: 'Scribe Chandelier',
        description: 'A horizontal linear chandelier with mouthblown globes.',
        material: 'Brushed Brass & Glass'
      },
      {
        name: 'Verge Dining Chair',
        description: 'Curved comfortable highback chairs with tapered timber legs.',
        material: 'Upholstered Wool & Oak'
      }
    ]
  },
  {
    id: 'ethereal-dwelling',
    title: 'Ethereal Dwelling',
    category: 'Living Space',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3WqP_tBcMUEw0n-8XDjn-bQ05-Ji78Oma9nYeDwJQPF2znfthUf7X-C9flfWn2jLbT1UM1tRQXwcIhfaoTpQhDn37o9YNkXs78bxWibHb7n0CaTZ7X9HwHQY8g1e3ztmmQyDOozTh0JXM9pL1Scgwxsd26P1Mf_sDUzTWmyuLYxm6-mamz6Y6jaA-LPS-djx_67GidEAEpmbYEA_ooHI_JpKXxnwR7R-TqsTjJdypCy-GRKWluL9c',
    description: 'The ultimate expression of warm minimalism, framing London skies within soaring black iron grids.',
    detailDescription: 'The pinnacle of Archive Interiors\' signature style, Ethereal Dwelling showcases a magnificent double-height coffered plaster ceiling. Soft-curved bouclé sofas invite conversation over a solid travertine low table, while a monumental minimalist fireplace grounds the expansive room.',
    year: '2025',
    location: 'Richmond, London',
    dimensions: '58 m²',
    keyMaterials: ['Travertine Stone', 'Bouclé Boum Yarn', 'Hand-applied Plaster', 'Cast Iron'],
    curatedItems: [
      {
        name: 'The Archive Curve Sofa',
        description: 'Sinuous lounge sofa upholstered in luxury textured bouclé.',
        material: 'Wool Bouclé & Pine frame'
      },
      {
        name: 'Travertine Coffee Table',
        description: 'Low monolithic slab supported by two rounded pillars.',
        material: 'Honed Roman Travertine'
      },
      {
        name: 'Monolith Fireplace Surround',
        description: 'A flush floor-to-ceiling clean stone opening.',
        material: 'Portuguese Limestone'
      }
    ]
  }
];

export const SERVICES: Service[] = [
  {
    icon: 'Compass',
    title: 'Interior Design',
    description: 'Tailored environments that balance architectural rigor with human warmth and comfort.',
    details: [
      'Spatial layout and ergonomic planning',
      'Material concept and physical sample curation',
      '3D photo-realistic spatial visualizations',
      'Custom furniture & bespoke storage design'
    ]
  },
  {
    icon: 'Layers',
    title: 'Renovation',
    description: 'Comprehensive restoration services that respect the heritage of your property while modernizing functionality.',
    details: [
      'Structural design coordination and architectural approvals',
      'Heritage restoration of moldings, paneling, and stone',
      'Full kitchen and bathroom system overhaul',
      'Integrated ambient lighting & acoustic architectural elements'
    ]
  },
  {
    icon: 'Calendar',
    title: 'Consultation',
    description: 'Expert guidance on material selection, spatial flow, and artisanal curation for specific rooms.',
    details: [
      'One-on-one spatial evaluation workshops',
      'Art curation and accessory accessorizing advice',
      'Color palette mapping & paint schedule formulation',
      'High-end lighting fixture advisory sessions'
    ]
  }
];
