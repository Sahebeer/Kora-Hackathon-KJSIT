/**
 * Process Library Data
 * Complete catalog of all available processes for Steel and Aluminum
 */

import {
  Pickaxe, Construction, Hammer, Droplet, HardHat, Factory, Truck,
  Wrench, Layers, Wind, Magnet, Scale, Droplets, Settings,
  Zap, Flame, Beaker, Package, Boxes, Recycle, TrendingUp,
  Circle, Mountain, Drill, Waves, Users, Cpu, Fuel, Filter
} from 'lucide-react';

export const processLibrary = {
  steel: {
    extraction: [
      {
        id: 'openPitMining',
        name: 'Open Pit Mining',
        label: 'Open Pit Mining',
        icon: Mountain,
        description: 'Surface mining method for extracting iron ore',
        color: '#8B4513',
        hasSubprocesses: false
      },
      {
        id: 'stripMining',
        name: 'Strip Mining',
        label: 'Strip Mining',
        icon: Construction,
        description: 'Strip mining for shallow deposits',
        color: '#A0522D',
        hasSubprocesses: false
      },
      {
        id: 'drillingBlasting',
        name: 'Drilling & Blasting',
        label: 'Drilling & Blasting',
        icon: Drill,
        description: 'Rock fragmentation using explosives',
        color: '#CD853F',
        hasSubprocesses: false
      },
      {
        id: 'hydraulicMining',
        name: 'Hydraulic Mining',
        label: 'Hydraulic Mining',
        icon: Waves,
        description: 'Water jet mining technique',
        color: '#4682B4',
        hasSubprocesses: false
      },
      {
        id: 'manualExtraction',
        name: 'Manual Extraction',
        label: 'Manual Extraction',
        icon: Users,
        description: 'Labor-intensive extraction methods',
        color: '#696969',
        hasSubprocesses: false
      },
      {
        id: 'electricShovel',
        name: 'Electric Shovel / Excavator',
        label: 'Electric Shovel',
        icon: Cpu,
        description: 'Electric-powered excavation equipment',
        color: '#FFD700',
        hasSubprocesses: false
      },
      {
        id: 'dieselHaulTrucks',
        name: 'Diesel-powered Haul Trucks',
        label: 'Diesel Haul Trucks',
        icon: Truck,
        description: 'Transport of extracted ore',
        color: '#FF6347',
        hasSubprocesses: false
      },
      {
        id: 'inSituLeaching',
        name: 'In-situ Leaching (experimental)',
        label: 'In-situ Leaching',
        icon: Droplet,
        description: 'Experimental leaching technique',
        color: '#20B2AA',
        hasSubprocesses: false
      },
      {
        id: 'others',
        name: 'Others',
        label: 'Others',
        icon: Circle,
        description: 'Other extraction methods',
        color: '#808080',
        hasSubprocesses: false
      }
    ],
    processing: [
      {
        id: 'crushing',
        name: 'Crushing',
        label: 'Crushing',
        icon: Hammer,
        description: 'Initial size reduction of ore',
        color: '#8B7355',
        hasSubprocesses: false
      },
      {
        id: 'grinding',
        name: 'Grinding',
        label: 'Grinding',
        icon: Settings,
        description: 'Fine size reduction in mills',
        color: '#A0826D',
        hasSubprocesses: false
      },
      {
        id: 'washingScreening',
        name: 'Washing & Screening',
        label: 'Washing & Screening',
        icon: Droplets,
        description: 'Separation by size and washing',
        color: '#4682B4',
        hasSubprocesses: false
      },
      {
        id: 'magneticSeparation',
        name: 'Magnetic Separation',
        label: 'Magnetic Separation',
        icon: Magnet,
        description: 'Magnetic concentration of iron ore',
        color: '#DC143C',
        hasSubprocesses: false
      },
      {
        id: 'gravitySeparation',
        name: 'Gravity Separation',
        label: 'Gravity Separation',
        icon: Scale,
        description: 'Density-based separation',
        color: '#8FBC8F',
        hasSubprocesses: false
      },
      {
        id: 'flotationMethods',
        name: 'Flotation Methods',
        label: 'Flotation',
        icon: Wind,
        description: 'Surface chemistry-based separation',
        color: '#87CEEB',
        hasSubprocesses: false
      },
      {
        id: 'drySeparation',
        name: 'Dry Separation',
        label: 'Dry Separation',
        icon: Filter,
        description: 'Dry beneficiation methods',
        color: '#DEB887',
        hasSubprocesses: false
      },
      {
        id: 'others',
        name: 'Others',
        label: 'Others',
        icon: Circle,
        description: 'Other beneficiation methods',
        color: '#808080',
        hasSubprocesses: false
      }
    ],
    // Add more steel stages...
    ironmaking: [
      {
        id: 'blastFurnace',
        name: 'Blast Furnace',
        label: 'Blast Furnace',
        icon: Factory,
        description: 'Primary iron production from ore',
        color: '#FF4500',
        hasSubprocesses: false
      },
      {
        id: 'directReduction',
        name: 'Direct Reduction',
        label: 'Direct Reduction',
        icon: Flame,
        description: 'DRI production process',
        color: '#FF6347',
        hasSubprocesses: false
      }
    ],
    steelmaking: [
      {
        id: 'basicOxygenFurnace',
        name: 'Basic Oxygen Furnace (BOF)',
        label: 'Basic Oxygen Furnace',
        icon: Zap,
        description: 'Primary steelmaking from pig iron',
        color: '#FF8C00',
        hasSubprocesses: false
      },
      {
        id: 'electricArcFurnace',
        name: 'Electric Arc Furnace (EAF)',
        label: 'Electric Arc Furnace',
        icon: Zap,
        description: 'Steelmaking using electrical energy',
        color: '#4169E1',
        hasSubprocesses: false
      }
    ],
    manufacturing: [
      {
        id: 'casting',
        name: 'Casting',
        label: 'Casting',
        icon: Layers,
        description: 'Solidification of molten steel',
        color: '#B8860B',
        hasSubprocesses: false
      },
      {
        id: 'rolling',
        name: 'Rolling',
        label: 'Rolling',
        icon: Settings,
        description: 'Hot and cold rolling processes',
        color: '#CD853F',
        hasSubprocesses: false
      }
    ],
    recycling: [
      {
        id: 'scrapCollection',
        name: 'Scrap Collection',
        label: 'Scrap Collection',
        icon: Recycle,
        description: 'Collection of steel scrap',
        color: '#32CD32',
        hasSubprocesses: false
      },
      {
        id: 'sorting',
        name: 'Sorting',
        label: 'Sorting',
        icon: Settings,
        description: 'Separation and sorting of scrap',
        color: '#228B22',
        hasSubprocesses: false
      },
      {
        id: 'remelting',
        name: 'Remelting',
        label: 'Remelting',
        icon: Flame,
        description: 'Melting scrap for new steel',
        color: '#FF4500',
        hasSubprocesses: false
      }
    ],
    valorization: [
      {
        id: 'slagUtilization',
        name: 'Slag Utilization',
        label: 'Slag Utilization',
        icon: TrendingUp,
        description: 'Recovery and use of slag',
        color: '#808080',
        hasSubprocesses: false
      },
      {
        id: 'dustRecovery',
        name: 'Dust Recovery',
        label: 'Dust Recovery',
        icon: Wind,
        description: 'Recovery of dust and fines',
        color: '#A9A9A9',
        hasSubprocesses: false
      }
    ]
  },
  
  aluminum: {
    extraction: [
      {
        id: 'openPitMining',
        name: 'Open Pit Mining',
        label: 'Open Pit Mining',
        icon: Mountain,
        description: 'Surface mining of bauxite',
        color: '#8B4513',
        hasSubprocesses: false
      },
      {
        id: 'stripMining',
        name: 'Strip Mining',
        label: 'Strip Mining',
        icon: Construction,
        description: 'Strip mining for bauxite',
        color: '#A0522D',
        hasSubprocesses: false
      },
      {
        id: 'drillingBlasting',
        name: 'Drilling & Blasting',
        label: 'Drilling & Blasting',
        icon: Drill,
        description: 'Rock fragmentation using explosives',
        color: '#CD853F',
        hasSubprocesses: false
      },
      {
        id: 'hydraulicMining',
        name: 'Hydraulic Mining',
        label: 'Hydraulic Mining',
        icon: Waves,
        description: 'Water jet mining for bauxite',
        color: '#4682B4',
        hasSubprocesses: false
      },
      {
        id: 'manualExtraction',
        name: 'Manual Extraction',
        label: 'Manual Extraction',
        icon: Users,
        description: 'Labor-intensive extraction methods',
        color: '#696969',
        hasSubprocesses: false
      },
      {
        id: 'electricShovel',
        name: 'Electric Shovel / Excavator',
        label: 'Electric Shovel',
        icon: Cpu,
        description: 'Electric-powered excavation equipment',
        color: '#FFD700',
        hasSubprocesses: false
      },
      {
        id: 'dieselHaulTrucks',
        name: 'Diesel-powered Haul Trucks',
        label: 'Diesel Haul Trucks',
        icon: Truck,
        description: 'Transport of extracted bauxite',
        color: '#FF6347',
        hasSubprocesses: false
      },
      {
        id: 'inSituLeaching',
        name: 'In-situ Leaching (experimental)',
        label: 'In-situ Leaching',
        icon: Droplet,
        description: 'Experimental leaching technique',
        color: '#20B2AA',
        hasSubprocesses: false
      },
      {
        id: 'others',
        name: 'Others',
        label: 'Others',
        icon: Circle,
        description: 'Other extraction methods',
        color: '#808080',
        hasSubprocesses: false
      }
    ],
    processing: [
      {
        id: 'crushing',
        name: 'Crushing',
        label: 'Crushing',
        icon: Hammer,
        description: 'Bauxite crushing',
        color: '#8B4513',
        hasSubprocesses: false
      },
      {
        id: 'grinding',
        name: 'Grinding',
        label: 'Grinding',
        icon: Settings,
        description: 'Fine grinding of bauxite',
        color: '#A0826D',
        hasSubprocesses: false
      },
      {
        id: 'magneticSeparation',
        name: 'Magnetic Separation',
        label: 'Magnetic Separation',
        icon: Magnet,
        description: 'Removal of magnetic impurities',
        color: '#DC143C',
        hasSubprocesses: false
      },
      {
        id: 'washingScreening',
        name: 'Washing & Screening',
        label: 'Washing & Screening',
        icon: Droplets,
        description: 'Separation by size and washing',
        color: '#4682B4',
        hasSubprocesses: false
      },
      {
        id: 'gravitySeparation',
        name: 'Gravity Separation',
        label: 'Gravity Separation',
        icon: Scale,
        description: 'Density-based separation',
        color: '#8FBC8F',
        hasSubprocesses: false
      },
      {
        id: 'drySeparation',
        name: 'Dry Separation',
        label: 'Dry Separation',
        icon: Filter,
        description: 'Dry beneficiation methods',
        color: '#DEB887',
        hasSubprocesses: false
      },
      {
        id: 'flotationMethods',
        name: 'Flotation Methods',
        label: 'Flotation',
        icon: Wind,
        description: 'Surface chemistry-based separation',
        color: '#87CEEB',
        hasSubprocesses: false
      },
      {
        id: 'others',
        name: 'Others',
        label: 'Others',
        icon: Circle,
        description: 'Other beneficiation methods',
        color: '#808080',
        hasSubprocesses: false
      }
    ],
    alumina_refining: [
      {
        id: 'crushing',
        name: 'Crushing',
        label: 'Crushing',
        icon: Hammer,
        description: 'Crushing process',
        color: '#8B4513',
        hasSubprocesses: false
      },
      {
        id: 'clarification',
        name: 'Clarification',
        label: 'Clarification',
        icon: Droplets,
        description: 'Separating alumina liquor from red mud',
        color: '#4682B4',
        hasSubprocesses: false
      },
      {
        id: 'calcination',
        name: 'Calcination',
        label: 'Calcination',
        icon: Flame,
        description: 'Removal of water to produce alumina powder',
        color: '#FF4500',
        hasSubprocesses: false
      },
      {
        id: 'digestion',
        name: 'Digestion',
        label: 'Digestion',
        icon: Beaker,
        description: 'Caustic soda process',
        color: '#FF6347',
        hasSubprocesses: false
      },
      {
        id: 'precipitation',
        name: 'Precipitation',
        label: 'Precipitation',
        icon: Droplet,
        description: 'Alumina hydrate recovery',
        color: '#87CEEB',
        hasSubprocesses: false
      },
      {
        id: 'others',
        name: 'Others',
        label: 'Others',
        icon: Circle,
        description: 'Other refining methods',
        color: '#808080',
        hasSubprocesses: false
      }
    ],
    smelting: [
      {
        id: 'preBakingAnodes',
        name: 'Pre-baking anodes',
        label: 'Pre-baking anodes',
        icon: Flame,
        description: 'Heat treatment of anodes',
        color: '#FF4500',
        hasSubprocesses: false
      },
      {
        id: 'anodeEffectControl',
        name: 'Anode effect control',
        label: 'Anode effect control',
        icon: Settings,
        description: 'Stability maintenance',
        color: '#DAA520',
        hasSubprocesses: false
      },
      {
        id: 'offGasTreatment',
        name: 'Off-gas treatment',
        label: 'Off-gas treatment',
        icon: Wind,
        description: 'Scrubber systems',
        color: '#87CEEB',
        hasSubprocesses: false
      },
      {
        id: 'electrolysis',
        name: 'Electrolysis',
        label: 'Electrolysis',
        icon: Zap,
        description: 'Cell operation',
        color: '#4169E1',
        hasSubprocesses: false
      },
      {
        id: 'bathChemistry',
        name: 'Bath chemistry management',
        label: 'Bath chemistry',
        icon: Beaker,
        description: 'Fluoride & alumina concentration',
        color: '#20B2AA',
        hasSubprocesses: false
      },
      {
        id: 'others',
        name: 'Others',
        label: 'Others',
        icon: Circle,
        description: 'Other smelting processes',
        color: '#808080',
        hasSubprocesses: false
      }
    ],
    manufacturing: [
      {
        id: 'casting',
        name: 'Casting',
        label: 'Casting',
        icon: Layers,
        description: 'Ingots, billets - high-temperature energy',
        color: '#B8860B',
        hasSubprocesses: false
      },
      {
        id: 'extrusion',
        name: 'Extrusion',
        label: 'Extrusion',
        icon: Package,
        description: 'Tubes, profiles - efficient shaping',
        color: '#DAA520',
        hasSubprocesses: false
      },
      {
        id: 'surfaceTreatment',
        name: 'Surface Treatment',
        label: 'Surface Treatment',
        icon: Droplets,
        description: 'Anodizing, coating - chemical & energy use',
        color: '#4682B4',
        hasSubprocesses: false
      },
      {
        id: 'designRecycling',
        name: 'Design for Recycling',
        label: 'Design for Recycling',
        icon: Recycle,
        description: 'Optimized alloys, less contamination',
        color: '#32CD32',
        hasSubprocesses: false
      },
      {
        id: 'rolling',
        name: 'Rolling',
        label: 'Rolling',
        icon: Settings,
        description: 'Sheet metal - mechanical deformation',
        color: '#CD853F',
        hasSubprocesses: false
      },
      {
        id: 'forging',
        name: 'Forging',
        label: 'Forging',
        icon: Hammer,
        description: 'Metal strengthening, scrap generation',
        color: '#8B4513',
        hasSubprocesses: false
      },
      {
        id: 'joining',
        name: 'Joining Processes',
        label: 'Joining Processes',
        icon: Wrench,
        description: 'Welding, mechanical fastening',
        color: '#696969',
        hasSubprocesses: false
      },
      {
        id: 'others',
        name: 'Others',
        label: 'Others',
        icon: Circle,
        description: 'Other manufacturing processes',
        color: '#808080',
        hasSubprocesses: false
      }
    ],
    recycling: [
      {
        id: 'collection',
        name: 'Collection',
        label: 'Collection',
        icon: Recycle,
        description: 'Scrap gathering – manual or automated',
        color: '#32CD32',
        hasSubprocesses: false
      },
      {
        id: 'cleaning',
        name: 'Cleaning',
        label: 'Cleaning',
        icon: Droplets,
        description: 'Removal of coatings, oils',
        color: '#4682B4',
        hasSubprocesses: false
      },
      {
        id: 'reAlloying',
        name: 'Re-alloying',
        label: 'Re-alloying',
        icon: Beaker,
        description: 'Composition adjustment',
        color: '#20B2AA',
        hasSubprocesses: false
      },
      {
        id: 'sorting',
        name: 'Sorting',
        label: 'Sorting',
        icon: Settings,
        description: 'Scrap sorting and classification',
        color: '#DAA520',
        hasSubprocesses: false
      },
      {
        id: 'remelting',
        name: 'Remelting',
        label: 'Remelting',
        icon: Flame,
        description: 'Furnace heating – energy intensive',
        color: '#FF6347',
        hasSubprocesses: false
      },
      {
        id: 'castingNew',
        name: 'Casting into new products',
        label: 'Casting new products',
        icon: Layers,
        description: 'e.g., cans, construction materials',
        color: '#B8860B',
        hasSubprocesses: false
      },
      {
        id: 'others',
        name: 'Others',
        label: 'Others',
        icon: Circle,
        description: 'Other recycling processes',
        color: '#808080',
        hasSubprocesses: false
      }
    ],
    valorization: [
      {
        id: 'redMud',
        name: 'Red Mud',
        label: 'Red Mud',
        icon: TrendingUp,
        description: 'Iron, titanium, rare earths',
        color: '#8B0000',
        hasSubprocesses: false
      },
      {
        id: 'spl',
        name: 'Spent Pot Lining (SPL)',
        label: 'SPL',
        icon: HardHat,
        description: 'Hazardous cyanide, fluoride',
        color: '#DC143C',
        hasSubprocesses: false
      },
      {
        id: 'dross',
        name: 'Dross',
        label: 'Dross',
        icon: Boxes,
        description: 'Aluminium oxide-rich waste',
        color: '#A9A9A9',
        hasSubprocesses: false
      },
      {
        id: 'fluorideGases',
        name: 'Fluoride Gases',
        label: 'Fluoride Gases',
        icon: Wind,
        description: 'From electrolysis',
        color: '#87CEEB',
        hasSubprocesses: false
      },
      {
        id: 'slag',
        name: 'Slag',
        label: 'Slag',
        icon: Layers,
        description: 'Mineral-rich waste',
        color: '#808080',
        hasSubprocesses: false
      },
      {
        id: 'others',
        name: 'Others',
        label: 'Others',
        icon: Circle,
        description: 'Other waste types',
        color: '#696969',
        hasSubprocesses: false
      }
    ]
  },
  copper: {
    extraction: [
      {
        id: 'openPitMiningCu',
        name: 'Open Pit Mining (Chalcopyrite)',
        label: 'Open Pit Mine',
        icon: Mountain,
        description: 'Surface extraction of copper sulfide deposits with electric shovels',
        color: '#B87968',
        hasSubprocesses: false
      },
      {
        id: 'undergroundMiningCu',
        name: 'Underground Deep Mining',
        label: 'Underground Mine',
        icon: Construction,
        description: 'Sublevel stoping and block caving for high-grade copper veins',
        color: '#8B4513',
        hasSubprocesses: false
      },
      {
        id: 'inSituLeachingCu',
        name: 'In-Situ Leaching (ISL)',
        label: 'In-Situ Leaching',
        icon: Droplet,
        description: 'In-place chemical leaching for low-grade oxide deposits',
        color: '#20B2AA',
        hasSubprocesses: false
      },
      {
        id: 'drillingBlastingCu',
        name: 'Precision Drilling & Blasting',
        label: 'Drill & Blast',
        icon: Drill,
        description: 'Emulsion explosives fragmentation with smart seismic control',
        color: '#CD853F',
        hasSubprocesses: false
      },
      {
        id: 'electricHaulageCu',
        name: 'Electric Trolley Haul Fleet',
        label: 'Electric Haulage',
        icon: Truck,
        description: 'Zero-emission trolley-assist ore transportation to primary crusher',
        color: '#FF6347',
        hasSubprocesses: false
      }
    ],
    processing: [
      {
        id: 'crushingGrindingCu',
        name: 'SAG & Ball Mill Comminution',
        label: 'Milling & Grinding',
        icon: Wrench,
        description: 'Two-stage wet grinding to 75 µm optimal flotation liberation size',
        color: '#A0522D',
        hasSubprocesses: false
      },
      {
        id: 'frothFlotationCu',
        name: 'Froth Flotation (PAX / MIBC)',
        label: 'Froth Flotation',
        icon: Waves,
        description: 'Differential xanthate flotation yielding 28% Cu concentrate',
        color: '#4682B4',
        hasSubprocesses: false
      },
      {
        id: 'thickeningFiltrationCu',
        name: 'Pressure Filter Dewatering',
        label: 'Filter Dewatering',
        icon: Filter,
        description: 'Automated chamber filter press recovering 85% process water',
        color: '#2E8B57',
        hasSubprocesses: false
      },
      {
        id: 'pasteTailingsCu',
        name: 'Thickened Paste Tailings Stacking',
        label: 'Paste Tailings',
        icon: Layers,
        description: 'Dry-stack paste tailings eliminating dam failure risk',
        color: '#696969',
        hasSubprocesses: false
      }
    ],
    refining: [
      {
        id: 'flashSmeltingCu',
        name: 'Outokumpu Flash Smelting',
        label: 'Flash Smelting',
        icon: Flame,
        description: 'Autogenous oxygen-enriched flash reaction producing 65% Cu matte',
        color: '#D2691E',
        hasSubprocesses: false
      },
      {
        id: 'tslSecondarySmelterCu',
        name: 'Top Submerged Lance (TSL) Smelter',
        label: 'TSL Smelter',
        icon: Zap,
        description: 'High-efficiency submerged combustion furnace for primary/secondary feed',
        color: '#BA7967',
        hasSubprocesses: false
      },
      {
        id: 'electrorefiningCu',
        name: 'Electrorefining Tankhouse (99.99% Cu)',
        label: 'Electrorefining',
        icon: Cpu,
        description: 'Electrolytic refining with ISA technology producing LME Grade A Cathodes',
        color: '#B87968',
        hasSubprocesses: false
      },
      {
        id: 'sxewHydrometCu',
        name: 'Solvent Extraction & Electrowinning (SX-EW)',
        label: 'SX-EW Refining',
        icon: Droplets,
        description: 'Hydrometallurgical extraction for oxide ores and low-grade leach liquors',
        color: '#20B2AA',
        hasSubprocesses: false
      }
    ],
    manufacturing: [
      {
        id: 'continuousCastingRodCu',
        name: 'Southwire Continuous Casting (8mm Rod)',
        label: 'Continuous Casting',
        icon: Factory,
        description: 'Casting & in-line rolling for electrical wire and cable feedstock',
        color: '#B87968',
        hasSubprocesses: false
      },
      {
        id: 'wireDrawingExtrusionCu',
        name: 'Precision Wire Drawing & Extrusion',
        label: 'Wire Drawing',
        icon: Settings,
        description: 'Multi-die cold drawing with continuous induction annealing',
        color: '#A86B5C',
        hasSubprocesses: false
      },
      {
        id: 'ofhcAlloyMeltingCu',
        name: 'OFHC Copper & Bronze Alloying',
        label: 'Alloy Melting',
        icon: Boxes,
        description: 'Vacuum induction melting for oxygen-free high-conductivity alloys',
        color: '#CD853F',
        hasSubprocesses: false
      }
    ],
    use_phase: [
      {
        id: 'evMotorWindingsCu',
        name: 'EV Traction Motor Windings',
        label: 'EV Traction Motors',
        icon: Zap,
        description: 'High-efficiency hairpin windings delivering 98.5% motor efficiency',
        color: '#2E7D32',
        hasSubprocesses: false
      },
      {
        id: 'gridBusbarsCu',
        name: 'High-Voltage Grid & Transformer Busbars',
        label: 'Power Grid Busbars',
        icon: Cpu,
        description: '25-year ultra-low loss power distribution and renewable energy export',
        color: '#4682B4',
        hasSubprocesses: false
      }
    ],
    recycling: [
      {
        id: 'closedLoopScrapRecyclingCu',
        name: 'Sensor-Sorted Secondary Scrap Remelting',
        label: 'Scrap Remelting',
        icon: Recycle,
        description: 'Closed-loop 80% recycled content scrap re-smelting via TSL',
        color: '#2E7D32',
        hasSubprocesses: false
      },
      {
        id: 'opticalEddySortingCu',
        name: 'Optical & Eddy Current Scrap Sorting',
        label: 'Automated Sorting',
        icon: Magnet,
        description: 'High-speed automated grading separating Birch/Cliff copper scrap',
        color: '#20B2AA',
        hasSubprocesses: false
      }
    ],
    valorization: [
      {
        id: 'slagGreenConcreteCu',
        name: 'Copper Slag Granulation for Green Concrete',
        label: 'Slag Green Sand',
        icon: Layers,
        description: '100% substitution of river sand in concrete (₹3.2M byproduct revenue)',
        color: '#4A7C59',
        hasSubprocesses: false
      },
      {
        id: 'acidPlantConversionCu',
        name: 'SO2 Catalytic Acid Plant (H2SO4)',
        label: 'H2SO4 Acid Plant',
        icon: Beaker,
        description: 'Double absorption acid plant capturing 99.2% SO2 as commercial acid',
        color: '#68538C',
        hasSubprocesses: false
      },
      {
        id: 'preciousMetalsRecoveryCu',
        name: 'Anode Slimes Precious Metals Recovery',
        label: 'Au/Ag/Se Recovery',
        icon: Scale,
        description: 'Hydrometallurgical extraction of gold, silver, selenium, and tellurium',
        color: '#C9A96E',
        hasSubprocesses: false
      }
    ]
  }
};

export const getProcessesForStage = (metal, stage) => {
  const processes = processLibrary[metal]?.[stage] || [];
  // Add stage property to each process
  return processes.map(process => ({ ...process, stage }));
};

export const getProcessById = (metal, processId) => {
  const allStages = processLibrary[metal] || {};
  for (const stage in allStages) {
    const process = allStages[stage].find(p => p.id === processId);
    if (process) return { ...process, stage };
  }
  return null;
};

export const getAllProcesses = (metal) => {
  const allStages = processLibrary[metal] || {};
  const processes = [];
  
  for (const stage in allStages) {
    allStages[stage].forEach(process => {
      processes.push({ ...process, stage });
    });
  }
  
  return processes;
};
