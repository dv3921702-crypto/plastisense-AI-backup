/**
 * PlastiSense AI - Environmental Intelligence Platform
 * Mumbai Coastal Pollution Dataset & Georeferenced Coordinates
 */

const PLASTISENSE_DATA = {
  // Realistic Mumbai Coastal and Creek Hotspots with coordinates, waste profiles, and risk metrics
  hotspots: [
    {
      id: "mum-001",
      name: "Mithi River Outfall & Mahim Causeway",
      ward: "G/North & H/East",
      coordinates: [19.0436, 72.8406],
      riskScore: 94,
      riskLevel: "CRITICAL",
      primaryWaste: "Plastic Bottles & Bags",
      estimatedWasteKg: 4200,
      imageCoverPercent: 78,
      status: "Cleanup Assigned",
      drainageProximityMeters: 45,
      coastalDistanceMeters: 120,
      tideSensitivity: "Extreme (High Tide Backflow)",
      lastAssessed: "2026-10-06 08:30",
      leakageProbability: "96% (Direct Outflow)",
      plasticFingerprint: {
        bottles: 38,
        bags: 32,
        packaging: 15,
        thermocol: 9,
        fishingNets: 4,
        microplastics: 2
      },
      explainability: [
        "Major confluence of industrial and residential stormwater drains carrying unsegregated PET and polybag debris.",
        "Heavy catchment runoff from Dharavi and Kurla during high precipitation periods.",
        "Backflow during Arabian Sea high tides creates bottleneck trapping waste near mangrove belts.",
        "Proximity to Mahim Nature Park poses severe ecological threat to bird and fish sanctuaries."
      ],
      assignedTeam: "Rapid Marine Taskforce (Ward G/North)",
      priorityRank: 1
    },
    {
      id: "mum-002",
      name: "Mahim Bay & Fishing Village Shore",
      ward: "G/North",
      coordinates: [19.0345, 72.8358],
      riskScore: 89,
      riskLevel: "CRITICAL",
      primaryWaste: "Mixed Plastic & Multi-layer Wrappers",
      estimatedWasteKg: 2850,
      imageCoverPercent: 64,
      status: "Verified",
      drainageProximityMeters: 110,
      coastalDistanceMeters: 20,
      tideSensitivity: "High",
      lastAssessed: "2026-10-06 14:15",
      leakageProbability: "91%",
      plasticFingerprint: {
        bottles: 29,
        bags: 34,
        packaging: 22,
        thermocol: 8,
        fishingNets: 5,
        microplastics: 2
      },
      explainability: [
        "High tidal deposition of marine debris originating from outer Mumbai harbour.",
        "Discharge from local fishing craft combined with municipal stormwater runoff.",
        "Severe accumulation around rocky breakers preventing natural tidal clearance."
      ],
      assignedTeam: "Coastal Guard Volunteers Unit 3",
      priorityRank: 2
    },
    {
      id: "mum-003",
      name: "Versova Beach Tidal Inlet",
      ward: "K/West",
      coordinates: [19.1319, 72.8126],
      riskScore: 82,
      riskLevel: "HIGH",
      primaryWaste: "Single-Use Plastic Packaging & Bottles",
      estimatedWasteKg: 1980,
      imageCoverPercent: 52,
      status: "In Progress",
      drainageProximityMeters: 180,
      coastalDistanceMeters: 10,
      tideSensitivity: "High",
      lastAssessed: "2026-10-07 09:00",
      leakageProbability: "84%",
      plasticFingerprint: {
        bottles: 35,
        bags: 26,
        packaging: 24,
        thermocol: 7,
        fishingNets: 6,
        microplastics: 2
      },
      explainability: [
        "Historical site of Afroz Shah citizen movement; recurring influx from Malad Creek during monsoon ebb tides.",
        "High weekend tourist density contributes to single-use food packaging waste.",
        "Sandy shoreline permits relatively straightforward mechanical and manual cleanup access."
      ],
      assignedTeam: "Versova Resident Volunteer Brigade",
      priorityRank: 3
    },
    {
      id: "mum-004",
      name: "Juhu Beach North Stormwater Outfall",
      ward: "K/West",
      coordinates: [19.0988, 72.8267],
      riskScore: 78,
      riskLevel: "HIGH",
      primaryWaste: "Food Packaging & Plastic Straws / Cups",
      estimatedWasteKg: 1640,
      imageCoverPercent: 44,
      status: "Verified",
      drainageProximityMeters: 75,
      coastalDistanceMeters: 30,
      tideSensitivity: "Medium-High",
      lastAssessed: "2026-10-06 18:20",
      leakageProbability: "76%",
      plasticFingerprint: {
        bottles: 24,
        bags: 21,
        packaging: 38,
        thermocol: 10,
        fishingNets: 2,
        microplastics: 5
      },
      explainability: [
        "Major recreation promenade; commercial street food kiosks generate significant multi-layer laminate packaging.",
        "Irla Nullah drainage outlet discharges buoyant plastics directly into breaker surf during nocturnal low tide.",
        "Beach raking equipment active daily, but micro-litter escapes into tidal zones."
      ],
      assignedTeam: "K/West Ward Sanitation Squad",
      priorityRank: 4
    },
    {
      id: "mum-005",
      name: "Dharavi Canal Stormwater Nullah",
      ward: "G/North",
      coordinates: [19.0402, 72.8529],
      riskScore: 92,
      riskLevel: "CRITICAL",
      primaryWaste: "Industrial & Post-Consumer Thermocol / Bags",
      estimatedWasteKg: 3600,
      imageCoverPercent: 82,
      status: "Under Review",
      drainageProximityMeters: 5,
      coastalDistanceMeters: 650,
      tideSensitivity: "Severe (Backing Up)",
      lastAssessed: "2026-10-07 11:45",
      leakageProbability: "98% (Conduit to Creek)",
      plasticFingerprint: {
        bottles: 22,
        bags: 39,
        packaging: 14,
        thermocol: 18,
        fishingNets: 1,
        microplastics: 6
      },
      explainability: [
        "Open high-density drainage bottleneck funnelling scrap from informal recycling clusters.",
        "High risk of total drain occlusion triggering localized urban flash flooding.",
        "Unintercepted trash flows straight into Mithi River and Arabian Sea within 45 minutes of heavy rain."
      ],
      assignedTeam: "BMC Drainage De-silting Unit",
      priorityRank: 5
    },
    {
      id: "mum-006",
      name: "Sassoon Docks & Colaba Basin",
      ward: "A Ward",
      coordinates: [18.9136, 72.8252],
      riskScore: 74,
      riskLevel: "HIGH",
      primaryWaste: "Monofilament Fishing Nets & Rigid Crates",
      estimatedWasteKg: 1420,
      imageCoverPercent: 41,
      status: "Cleanup Assigned",
      drainageProximityMeters: 220,
      coastalDistanceMeters: 0,
      tideSensitivity: "Medium",
      lastAssessed: "2026-10-05 16:00",
      leakageProbability: "71%",
      plasticFingerprint: {
        bottles: 18,
        bags: 14,
        packaging: 12,
        thermocol: 16,
        fishingNets: 36,
        microplastics: 4
      },
      explainability: [
        "Major commercial fishery harbour with discarded synthetic nylon netting and broken polystyrene fish cold-storage boxes.",
        "Ghost fishing gear entangles marine fauna in Mumbai harbour.",
        "Specialized nylon recycling facility in Panvel identified as destination."
      ],
      assignedTeam: "Mumbai Port Trust Marine Cleaners",
      priorityRank: 6
    },
    {
      id: "mum-007",
      name: "Dadar Chowpatty & Prabhadevi Rocks",
      ward: "G/North",
      coordinates: [19.0227, 72.8339],
      riskScore: 68,
      riskLevel: "MEDIUM",
      primaryWaste: "Plates, Cups & Household Polyethylene",
      estimatedWasteKg: 940,
      imageCoverPercent: 33,
      status: "Verified",
      drainageProximityMeters: 140,
      coastalDistanceMeters: 15,
      tideSensitivity: "Medium",
      lastAssessed: "2026-10-07 07:10",
      leakageProbability: "62%",
      plasticFingerprint: {
        bottles: 30,
        bags: 28,
        packaging: 25,
        thermocol: 11,
        fishingNets: 3,
        microplastics: 3
      },
      explainability: [
        "Moderate accumulation trapped in coastal tetrapod coastal defence structures.",
        "Heavy wave action breaks down brittle macroplastics into microplastic fragments.",
        "Accessible via public boardwalk for volunteer community drives."
      ],
      assignedTeam: "Beach Warriors Dadar Chapter",
      priorityRank: 7
    },
    {
      id: "mum-008",
      name: "Bandra Carter Road Rocky Promenade",
      ward: "H/West",
      coordinates: [19.0656, 72.8231],
      riskScore: 54,
      riskLevel: "MEDIUM",
      primaryWaste: "Beverage Bottles & Takeaway Containers",
      estimatedWasteKg: 620,
      imageCoverPercent: 25,
      status: "Reported",
      drainageProximityMeters: 310,
      coastalDistanceMeters: 25,
      tideSensitivity: "Low-Medium",
      lastAssessed: "2026-10-06 20:00",
      leakageProbability: "48%",
      plasticFingerprint: {
        bottles: 44,
        bags: 22,
        packaging: 24,
        thermocol: 6,
        fishingNets: 1,
        microplastics: 3
      },
      explainability: [
        "Intermittent littering along coastal promenade stairs.",
        "Mangrove fringe traps lightweight bags during high spring tides.",
        "Regular citizen surveillance keeps baseline volume moderate."
      ],
      assignedTeam: "Pending Assignment",
      priorityRank: 8
    },
    {
      id: "mum-009",
      name: "Marine Drive & Nariman Point Tetrapods",
      ward: "A Ward",
      coordinates: [18.9438, 72.8232],
      riskScore: 42,
      riskLevel: "LOW",
      primaryWaste: "Water Bottles & Polystyrene Cups",
      estimatedWasteKg: 380,
      imageCoverPercent: 18,
      status: "Cleaned",
      drainageProximityMeters: 450,
      coastalDistanceMeters: 5,
      tideSensitivity: "Low",
      lastAssessed: "2026-10-07 10:15",
      leakageProbability: "35%",
      plasticFingerprint: {
        bottles: 52,
        bags: 15,
        packaging: 21,
        thermocol: 8,
        fishingNets: 0,
        microplastics: 4
      },
      explainability: [
        "Heavy civic surveillance and 24x7 municipal cleanup preserves low baseline accumulation.",
        "Inter-tetrapod crevices occasionally trap floating PET bottles during southwest monsoon swells."
      ],
      assignedTeam: "Clean Heritage Marine Drive Wing",
      priorityRank: 9
    },
    {
      id: "mum-010",
      name: "Gorai Creek & Manori Mangrove Channel",
      ward: "R/Central",
      coordinates: [19.2384, 72.7845],
      riskScore: 71,
      riskLevel: "HIGH",
      primaryWaste: "Discarded Nets & Floating Containers",
      estimatedWasteKg: 1250,
      imageCoverPercent: 39,
      status: "Verified",
      drainageProximityMeters: 280,
      coastalDistanceMeters: 40,
      tideSensitivity: "High",
      lastAssessed: "2026-10-05 12:40",
      leakageProbability: "74%",
      plasticFingerprint: {
        bottles: 26,
        bags: 27,
        packaging: 18,
        thermocol: 14,
        fishingNets: 12,
        microplastics: 3
      },
      explainability: [
        "Sensitive mangrove nursery affected by plastic adhesion to pneumatic mangrove roots (pneumatophores).",
        "Tidal channel transports uncollected municipal waste from suburban Borivali/Gorai nullahs."
      ],
      assignedTeam: "Mangrove Cell Special Action Squad",
      priorityRank: 10
    },
    {
      id: "mum-011",
      name: "Thane Creek Flamingo Sanctuary Edge (Sewri-Trombay)",
      ward: "M/East",
      coordinates: [19.0135, 72.8942],
      riskScore: 63,
      riskLevel: "MEDIUM",
      primaryWaste: "Microplastics & Lightweight Plastic Films",
      estimatedWasteKg: 890,
      imageCoverPercent: 29,
      status: "Under Review",
      drainageProximityMeters: 390,
      coastalDistanceMeters: 60,
      tideSensitivity: "High (Mudflats)",
      lastAssessed: "2026-10-06 16:30",
      leakageProbability: "59%",
      plasticFingerprint: {
        bottles: 21,
        bags: 36,
        packaging: 20,
        thermocol: 10,
        fishingNets: 4,
        microplastics: 9
      },
      explainability: [
        "Intertidal mudflats frequented by migratory lesser and greater flamingos.",
        "Ingestion risk of degraded microplastics by benthic organisms and aquatic avifauna."
      ],
      assignedTeam: "Wetland Biodiversity Patrol",
      priorityRank: 11
    },
    {
      id: "mum-012",
      name: "Malad Creek & Marve Coastal Beach",
      ward: "P/North",
      coordinates: [19.1873, 72.8021],
      riskScore: 79,
      riskLevel: "HIGH",
      primaryWaste: "Polyethylene Bags & Rigid Containers",
      estimatedWasteKg: 1720,
      imageCoverPercent: 48,
      status: "Cleanup Assigned",
      drainageProximityMeters: 120,
      coastalDistanceMeters: 35,
      tideSensitivity: "High",
      lastAssessed: "2026-10-07 08:45",
      leakageProbability: "81%",
      plasticFingerprint: {
        bottles: 31,
        bags: 30,
        packaging: 22,
        thermocol: 11,
        fishingNets: 4,
        microplastics: 2
      },
      explainability: [
        "Major receiving water body for Western Suburban stormwater runoff.",
        "Tidal sluices require automated debris trash-racks to intercept plastic before opening into sea."
      ],
      assignedTeam: "P/North Rapid Marine Team",
      priorityRank: 12
    }
  ],

  // Mumbai Recycling & Material Recovery Facilities (MRF)
  recyclingCenters: [
    {
      id: "rc-01",
      name: "Bandra East Material Recovery Facility (BMC-UNDP)",
      address: "Near Western Express Highway, Kalanagar, Bandra (E), Mumbai - 400051",
      coordinates: [19.0601, 72.8492],
      contact: "+91 22 2651 8890",
      acceptedTypes: ["PET Bottles", "HDPE Containers", "LDPE Bags", "Cardboard"],
      capacityTonPerDay: 25,
      status: "Operational",
      turnaroundHours: 24,
      recyclingMethod: "Mechanical Shredding, Optical Sorting & Pelletizing"
    },
    {
      id: "rc-02",
      name: "Dharavi Polymer Segregation & Flaking Cluster",
      address: "Transit Camp Road, Dharavi 13th Compound, Mumbai - 400017",
      coordinates: [19.0431, 72.8558],
      contact: "+91 22 2407 1923",
      acceptedTypes: ["Rigid Plastics", "PET", "PP", "Industrial Scrap"],
      capacityTonPerDay: 40,
      status: "Operational",
      turnaroundHours: 12,
      recyclingMethod: "Manual Grade Sorting, Hot-Wash Crushing & Granulation"
    },
    {
      id: "rc-03",
      name: "Deonar Eco-Processing & Pyrolysis Testing Center",
      address: "Ghatkopar-Mankhurd Link Road, Deonar, Mumbai - 400043",
      coordinates: [19.0682, 72.9189],
      contact: "+91 22 2555 4100",
      acceptedTypes: ["Multi-layer Packaging", "Non-recyclable Films", "Thermocol"],
      capacityTonPerDay: 15,
      status: "Operational",
      turnaroundHours: 48,
      recyclingMethod: "Refuse-Derived Fuel (RDF) & Thermal Energy Recovery"
    },
    {
      id: "rc-04",
      name: "Malad West Citizen MRF & Composting Center",
      address: "Link Road, Opp Mithibai Extension, Malad (W), Mumbai - 400064",
      coordinates: [19.1824, 72.8362],
      contact: "+91 22 2888 7711",
      acceptedTypes: ["Clean PET", "Milk Pouches (LDPE)", "Beverage Cans"],
      capacityTonPerDay: 10,
      status: "Operational",
      turnaroundHours: 24,
      recyclingMethod: "Baling, Compacting & Forward Supply to Recyclers"
    },
    {
      id: "rc-05",
      name: "Colaba Coastal Waste Transfer Station",
      address: "Near Sassoon Docks Gate 2, Colaba, Mumbai - 400005",
      coordinates: [18.9152, 72.8271],
      contact: "+91 22 2218 3490",
      acceptedTypes: ["Marine Ghost Nets", "Nylon Ropes", "Rigid Plastic Crates"],
      capacityTonPerDay: 8,
      status: "Operational",
      turnaroundHours: 36,
      recyclingMethod: "Specialized Nylon Chemical Depolymerization Dispatch"
    }
  ],

  // Major Drainage Outfalls & Flow Vectors to Arabian Sea
  drainageNetworks: [
    {
      name: "Mithi River Main Stormwater Discharge",
      startCoord: [19.0625, 72.8711],
      midCoord: [19.0498, 72.8482],
      outfallCoord: [19.0436, 72.8406],
      catchmentSqKm: 108,
      annualDebrisTon: 1850,
      flowDirection: "SE to NW into Mahim Bay",
      barrierInstalled: true,
      barrierEfficiency: "64%"
    },
    {
      name: "Irla Nullah Stormwater Outfall",
      startCoord: [19.1095, 72.8480],
      midCoord: [19.1030, 72.8360],
      outfallCoord: [19.0988, 72.8267],
      catchmentSqKm: 28,
      annualDebrisTon: 620,
      flowDirection: "East to West into Juhu Sea",
      barrierInstalled: false,
      barrierEfficiency: "0%"
    },
    {
      name: "Love Grove Pumping Station Outfall",
      startCoord: [19.0080, 72.8285],
      midCoord: [19.0062, 72.8190],
      outfallCoord: [19.0055, 72.8142],
      catchmentSqKm: 42,
      annualDebrisTon: 910,
      flowDirection: "Worli to Arabian Sea",
      barrierInstalled: true,
      barrierEfficiency: "78%"
    },
    {
      name: "Gazdarbandh Drainage Outflow",
      startCoord: [19.0832, 72.8390],
      midCoord: [19.0780, 72.8310],
      outfallCoord: [19.0751, 72.8248],
      catchmentSqKm: 22,
      annualDebrisTon: 480,
      flowDirection: "Santacruz West to Arabian Sea",
      barrierInstalled: true,
      barrierEfficiency: "52%"
    }
  ],

  // 14 Waste Categories Specification
  wasteCategories: {
    "Plastic bottles": {
      polymer: "PET (Polyethylene Terephthalate)",
      recyclability: "High",
      canRecycle: true,
      recommendedMethod: "Optical sort, shredding, hot washing, bottle-to-bottle pelletizing",
      collectionMethod: "Dedicated blue recycling bins, reverse vending machines",
      reusePossibility: "Moderate (secondary non-food storage, DIY planters)",
      environmentalImpact: "Severe marine choke hazard, 450+ years degradation time",
      bestAction: "RECYCLE",
      baseRisk: "Medium"
    },
    "Plastic bags": {
      polymer: "LDPE / HDPE (Polyethylene)",
      recyclability: "Difficult",
      canRecycle: true,
      recommendedMethod: "Thermal washing, agglomeration, plastic-timber or road asphalt blending",
      collectionMethod: "Segregated dry waste door-to-door collection",
      reusePossibility: "High for household utility liners",
      environmentalImpact: "Blocks urban drainage nullahs causing flooding; lethal to marine turtles",
      bestAction: "COLLECT",
      baseRisk: "High"
    },
    "Food packaging": {
      polymer: "Multilayer Plastic / Metallized Films (MLP)",
      recyclability: "Very Difficult",
      canRecycle: false,
      recommendedMethod: "Co-processing in cement kilns, pyrolysis into fuel oil",
      collectionMethod: "Dry combustible waste stream",
      reusePossibility: "Extremely Low",
      environmentalImpact: "Fast fragmentation into toxic microplastics in saltwater",
      bestAction: "SPECIALIZED RECOVERY",
      baseRisk: "High"
    },
    "Fishing nets": {
      polymer: "Nylon 6 / Polyamide / Polypropylene",
      recyclability: "Specialized",
      canRecycle: true,
      recommendedMethod: "Chemical depolymerization into virgin-grade yarn (ECONYL process)",
      collectionMethod: "Harbour recovery drop-off at Sassoon Docks / Versova Koliwada",
      reusePossibility: "Fencing, agricultural crop netting",
      environmentalImpact: "Ghost fishing kills dolphins, fish, and disrupts coral reefs for decades",
      bestAction: "SPECIALIZED RECOVERY",
      baseRisk: "Critical"
    },
    "Plastic containers": {
      polymer: "HDPE / PP (Rigid Plastics)",
      recyclability: "High",
      canRecycle: true,
      recommendedMethod: "Flaking, decontaminating, extrusion into household utility buckets",
      collectionMethod: "Municipal MRF dry sorting stream",
      reusePossibility: "High (refill containers, storage)",
      environmentalImpact: "Leaches chemical additives into coastal sediment",
      bestAction: "RECYCLE",
      baseRisk: "Medium"
    },
    "Thermocol / EPS": {
      polymer: "Expanded Polystyrene (EPS)",
      recyclability: "Specialized handling required",
      canRecycle: false,
      recommendedMethod: "Solvent dissolution (limonene) or heavy densification compaction",
      collectionMethod: "Bulky white waste collection; strictly avoid burning",
      reusePossibility: "Insulation padding in shipping",
      environmentalImpact: "Crumbles into billions of buoyant micro-pellets ingested by coastal fish",
      bestAction: "SPECIALIZED RECOVERY",
      baseRisk: "Critical"
    },
    "Plastic cups": {
      polymer: "Polystyrene / Polypropylene (PS/PP)",
      recyclability: "Low",
      canRecycle: true,
      recommendedMethod: "Mechanical downcycling into industrial pallets",
      collectionMethod: "Event venue segregation bins",
      reusePossibility: "Low",
      environmentalImpact: "High urban litter frequency, buoyant in stormwater channels",
      bestAction: "RECYCLE",
      baseRisk: "Medium"
    },
    "Straws": {
      polymer: "Polypropylene (PP)",
      recyclability: "Very Low (Size limitation)",
      canRecycle: false,
      recommendedMethod: "Micro-aggregation or thermal energy recovery",
      collectionMethod: "Prohibited under Single-Use Plastic (SUP) ban guidelines",
      reusePossibility: "None (hygiene hazard)",
      environmentalImpact: "Small size lodges in respiratory tract of marine life",
      bestAction: "SAFE DISPOSAL",
      baseRisk: "High"
    },
    "Plastic wrappers": {
      polymer: "Biaxially Oriented PP (BOPP)",
      recyclability: "Difficult",
      canRecycle: false,
      recommendedMethod: "Co-processing with cement plants for Refuse Derived Fuel (RDF)",
      collectionMethod: "Municipal dry collection",
      reusePossibility: "None",
      environmentalImpact: "Persistent coastal surface debris; windblown across beaches",
      bestAction: "SPECIALIZED RECOVERY",
      baseRisk: "Medium"
    },
    "Industrial plastic waste": {
      polymer: "Engineering Plastics / Composite Blends",
      recyclability: "Specialized",
      canRecycle: true,
      recommendedMethod: "Authorized CPCB/MPCB closed-loop reprocessing facility",
      collectionMethod: "Direct manifest transfer from industrial units",
      reusePossibility: "Industrial feedstock",
      environmentalImpact: "High toxicity hazard, hazardous plasticizers",
      bestAction: "SPECIALIZED RECOVERY",
      baseRisk: "Critical"
    },
    "Microplastic indicators": {
      polymer: "Secondary Microplastics (<5mm fragments)",
      recyclability: "Non-recyclable",
      canRecycle: false,
      recommendedMethod: "Filtration geotextile capture; continuous sediment sampling",
      collectionMethod: "High-density beach sand sifting screens",
      reusePossibility: "None",
      environmentalImpact: "Enters human seafood food chain; endocrine disruption in fauna",
      bestAction: "SAFE DISPOSAL",
      baseRisk: "Critical"
    },
    "Mixed plastic waste": {
      polymer: "Unsegregated Polymers",
      recyclability: "Low without sorting",
      canRecycle: true,
      recommendedMethod: "Optical automated sorting followed by mechanical recycling or RDF",
      collectionMethod: "Sorting at Material Recovery Facility (MRF)",
      reusePossibility: "Low",
      environmentalImpact: "Accelerates dump yard degradation and coastal runoff",
      bestAction: "COLLECT",
      baseRisk: "High"
    },
    "Other waste": {
      polymer: "Organic / Composite / Non-polymer Waste",
      recyclability: "Varies",
      canRecycle: false,
      recommendedMethod: "Biomethanation or municipal composting",
      collectionMethod: "Green wet waste bin",
      reusePossibility: "Organic compost",
      environmentalImpact: "Organic decomposition oxygen depletion in tidal pools",
      bestAction: "SAFE DISPOSAL",
      baseRisk: "Low"
    },
    "Non-plastic waste": {
      polymer: "Metal, Glass, Fabric, Paper",
      recyclability: "High",
      canRecycle: true,
      recommendedMethod: "Separate glass/metal scrap dealer streams",
      collectionMethod: "Dry inorganic non-plastic recycling bin",
      reusePossibility: "High",
      environmentalImpact: "Low ocean persistence compared to synthetic polymers",
      bestAction: "RECYCLE",
      baseRisk: "Low"
    }
  },

  // Environmental Sensors & Tide Real-Time Context (Mumbai Weather & Arabian Sea conditions)
  environmentalConditions: {
    location: "Mumbai Coastal Zone (Arabian Sea)",
    tideState: "High Spring Tide (+4.32m)",
    tideTrend: "Ebbing in 1h 45m",
    rainfallRateMmHr: 18.5,
    rainfallForecast: "Heavy spells anticipated next 6 hours (Monsoon active)",
    windSpeedKmph: 26,
    windDirection: "WSW (Onshore into Mahim/Juhu)",
    waterTemperatureC: 28.4,
    drainageCapacityPercent: "82% Engaged",
    ambientRiskIndex: "High"
  },

  // Municipal Cleanup Tasks
  cleanupTasks: [
    {
      taskId: "TASK-2026-081",
      hotspotId: "mum-001",
      location: "Mithi River Outfall & Mahim Causeway",
      assignedTeam: "Rapid Marine Taskforce (Ward G/North)",
      priority: "CRITICAL",
      scheduledDate: "2026-10-08",
      status: "In Progress",
      crewSize: 24,
      equipment: "Trash Skimmer Boat, Boom Barrier, Heavy JCB, 2x Dump Trucks",
      notes: "High priority before upcoming spring high tide tonight. Silt screen damaged near bay inlet."
    },
    {
      taskId: "TASK-2026-082",
      hotspotId: "mum-005",
      location: "Dharavi Canal Stormwater Nullah",
      assignedTeam: "BMC Drainage De-silting Unit",
      priority: "CRITICAL",
      scheduledDate: "2026-10-08",
      status: "Pending",
      crewSize: 18,
      equipment: "Suction Jetting Truck, Manual Rake Gang, 5x Segregation Bins",
      notes: "Severe thermocol and polybag block at culvert 4. Risk of local residential backflow."
    },
    {
      taskId: "TASK-2026-083",
      hotspotId: "mum-003",
      location: "Versova Beach Tidal Inlet",
      assignedTeam: "Versova Resident Volunteer Brigade",
      priority: "HIGH",
      scheduledDate: "2026-10-09",
      status: "Scheduled",
      crewSize: 45,
      equipment: "Beach Rakes, Jute Collection Sacks, Tractor Trailer",
      notes: "Joint drive with college NSS volunteers and coastal fishermen community."
    },
    {
      taskId: "TASK-2026-084",
      hotspotId: "mum-006",
      location: "Sassoon Docks & Colaba Basin",
      assignedTeam: "Mumbai Port Trust Marine Cleaners",
      priority: "HIGH",
      scheduledDate: "2026-10-10",
      status: "Scheduled",
      crewSize: 12,
      equipment: "Crane Winch, Nylon Shears, Heavy Bag Bins",
      notes: "Retrieve submerged monofilament ghost net clusters off pier 3."
    },
    {
      taskId: "TASK-2026-085",
      hotspotId: "mum-009",
      location: "Marine Drive & Nariman Point Tetrapods",
      assignedTeam: "Clean Heritage Marine Drive Wing",
      priority: "LOW",
      scheduledDate: "2026-10-07",
      status: "Completed",
      crewSize: 10,
      equipment: "Long Reach Claw Grabbers, Manual Bags",
      notes: "Cleared 380kg of tourist PET bottles from tetrapod recesses. Area restored."
    }
  ],

  // Community Reports (Citizen science & crowdsourced alerts)
  communityReports: [
    {
      id: "REP-901",
      reportedBy: "Priya Deshmukh (Volunteer, Dadar)",
      locationName: "Dadar Chowpatty Storm Drain Edge",
      coordinates: [19.0232, 72.8345],
      date: "2026-10-07 14:20",
      wasteType: "Plastic Bags & Food Boxes",
      estimatedVolume: "50-100 kg",
      image: "assets/images/plastic-beach-before.jpg",
      status: "Verified",
      upvotes: 42,
      verifier: "Officer Rajesh Patel (Ward G/North)"
    },
    {
      id: "REP-902",
      reportedBy: "Karthik Raman (Citizen Scientist)",
      locationName: "Mahim Fisherman Colony Creek Mouth",
      coordinates: [19.0352, 72.8365],
      date: "2026-10-07 16:05",
      wasteType: "Broken Thermocol & Entangled Nets",
      estimatedVolume: "300+ kg",
      image: "assets/images/plastic-drain-clog.jpg",
      status: "Cleanup Assigned",
      upvotes: 88,
      verifier: "Dr. Ananya Sharma (Admin)"
    },
    {
      id: "REP-903",
      reportedBy: "Fatima Sayed (Student, Ruia College)",
      locationName: "Worli Seaface Gutter Outflow",
      coordinates: [19.0112, 72.8155],
      date: "2026-10-07 17:30",
      wasteType: "PET Water & Soda Bottles",
      estimatedVolume: "80 kg",
      image: "assets/images/plastic-beach-before.jpg",
      status: "Under Review",
      upvotes: 19,
      verifier: null
    }
  ],

  // System Notifications
  notifications: [
    {
      id: "NOTIF-101",
      type: "CRITICAL",
      title: "🚨 CRITICAL PLASTIC LEAKAGE ALERT",
      message: "Location: Mithi River Outfall & Mahim Causeway. Risk Score: 94/100. High plastic accumulation + drainage exposure + high tide backflow.",
      recommendedAction: "Immediate interception crew deployment within 24 hours.",
      timestamp: "10 mins ago",
      hotspotId: "mum-001",
      read: false
    },
    {
      id: "NOTIF-102",
      type: "WARNING",
      title: "⚠️ HEAVY MONSOON RUNOFF FORECAST",
      message: "Indian Meteorological Dept warning: 45mm/hr rain expected over G/North & K/West coastal nullahs at 22:00 tonight. High leakage probability to Arabian Sea.",
      recommendedAction: "Inspect boom barriers at Irla and Gazdarbandh drains.",
      timestamp: "1 hour ago",
      hotspotId: "mum-004",
      read: false
    },
    {
      id: "NOTIF-103",
      type: "SUCCESS",
      title: "✅ COMMUNITY CLEANUP VERIFIED",
      message: "Marine Drive Tetrapod restoration completed by Clean Heritage Wing. 380 kg plastic removed. Marine leakage prevented.",
      recommendedAction: "View updated Before vs After comparison in Analytics.",
      timestamp: "3 hours ago",
      hotspotId: "mum-009",
      read: true
    },
    {
      id: "NOTIF-104",
      type: "INFO",
      title: "🛰️ SATELLITE PLUME DETECTION",
      message: "Sentinel-2 imagery shows 14% increase in buoyant suspended debris plume off Mahim Bay following midnight low tide.",
      recommendedAction: "Review Satellite Intelligence module.",
      timestamp: "5 hours ago",
      hotspotId: "mum-002",
      read: true
    }
  ],

  // Security Audit Log
  auditLogs: [
    {
      timestamp: "2026-10-07 18:45:12",
      user: "Dr. Ananya Sharma (Admin)",
      action: "Dispatched Rapid Taskforce to Mithi River Outflow (TASK-2026-081)",
      ip: "103.21.124.89 (BMC Gov Network)",
      status: "Authorized"
    },
    {
      timestamp: "2026-10-07 17:35:04",
      user: "Officer Rajesh Patel (Municipal Officer)",
      action: "Verified Citizen Report REP-901 at Dadar Chowpatty",
      ip: "103.21.124.94 (Ward G/North Terminal)",
      status: "Authorized"
    },
    {
      timestamp: "2026-10-07 16:12:49",
      user: "Priya Deshmukh (Community User)",
      action: "Submitted New Geotagged Coastal Debris Report REP-902",
      ip: "157.34.82.112 (Mobile Broadband)",
      status: "Authorized"
    },
    {
      timestamp: "2026-10-07 15:02:18",
      user: "System AI Engine",
      action: "Auto-computed Daily Hotspot Priority Ranking (Mithi #1, Mahim #2, Versova #3)",
      ip: "127.0.0.1 (Internal Service)",
      status: "Completed"
    }
  ],

  // 6 Default Environmental Tech Avatars (3 Female, 3 Male) - Distinct SVG Artwork
  defaultAvatars: {
    female: [
      {
        id: "f_avatar_1",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#0c2f4d"/><path d="M50 20C36 20 30 30 30 45C30 52 32 58 36 62C26 68 18 78 18 92C28 98 40 100 50 100C60 100 72 98 82 92C82 78 74 68 64 62C68 58 70 52 70 45C70 30 64 20 50 20Z" fill="#14b8a6"/><circle cx="50" cy="45" r="16" fill="#fde68a"/><path d="M34 38C34 26 42 22 50 22C58 22 66 26 66 38C66 42 64 48 64 48C60 40 56 36 50 36C44 36 40 40 36 48C36 48 34 42 34 38Z" fill="#475569"/><circle cx="44" cy="45" r="2.5" fill="#0f172a"/><circle cx="56" cy="45" r="2.5" fill="#0f172a"/><path d="M46 53C48 55 52 55 54 53" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/><rect x="42" y="42" width="6" height="5" rx="1.5" stroke="#00f2fe" stroke-width="1.5"/><rect x="52" y="42" width="6" height="5" rx="1.5" stroke="#00f2fe" stroke-width="1.5"/><line x1="48" y1="44" x2="52" y2="44" stroke="#00f2fe" stroke-width="1.5"/></svg>`
      },
      {
        id: "f_avatar_2",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#132e35"/><path d="M50 18C35 18 28 28 28 42C28 50 31 56 35 60C24 66 16 77 16 92C26 98 38 100 50 100C62 100 74 98 84 92C84 77 76 66 65 60C69 56 72 50 72 42C72 28 65 18 50 18Z" fill="#059669"/><circle cx="50" cy="45" r="17" fill="#fcd34d"/><path d="M30 35C30 20 42 16 50 16C60 16 70 20 70 35C70 48 68 56 68 56C62 44 58 40 50 40C42 40 38 44 32 56C32 56 30 48 30 35Z" fill="#1e293b"/><circle cx="43" cy="46" r="2.5" fill="#0f172a"/><circle cx="57" cy="46" r="2.5" fill="#0f172a"/><path d="M46 54C48 56 52 56 54 54" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/><circle cx="37" cy="48" r="3" fill="#f43f5e" opacity="0.6"/><circle cx="63" cy="48" r="3" fill="#f43f5e" opacity="0.6"/></svg>`
      },
      {
        id: "f_avatar_3",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#1d1e3a"/><path d="M50 19C36 19 30 29 30 43C30 51 33 57 37 61C26 67 18 78 18 92C28 98 40 100 50 100C60 100 72 98 82 92C82 78 74 67 63 61C67 57 70 51 70 43C70 29 64 19 50 19Z" fill="#0284c7"/><circle cx="50" cy="45" r="16.5" fill="#fed7aa"/><path d="M32 30C32 20 40 16 50 16C60 16 68 20 68 30C68 38 65 52 65 52C58 38 56 36 50 36C44 36 42 38 35 52C35 52 32 38 32 30Z" fill="#7c2d12"/><circle cx="44" cy="44" r="2.5" fill="#0f172a"/><circle cx="56" cy="44" r="2.5" fill="#0f172a"/><path d="M45 52C47 55 53 55 55 52" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/><path d="M38 25L50 20L62 25" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/></svg>`
      }
    ],
    male: [
      {
        id: "m_avatar_1",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#0f2942"/><path d="M50 22C38 22 32 32 32 46C32 53 34 59 38 63C26 69 18 79 18 92C28 98 40 100 50 100C60 100 72 98 82 92C82 79 74 69 62 63C66 59 68 53 68 46C68 32 62 22 50 22Z" fill="#0284c7"/><circle cx="50" cy="45" r="16" fill="#fde68a"/><path d="M34 32C36 22 42 18 50 18C58 18 64 22 66 32C62 26 56 24 50 24C44 24 38 26 34 32Z" fill="#1e293b"/><circle cx="44" cy="44" r="2.5" fill="#0f172a"/><circle cx="56" cy="44" r="2.5" fill="#0f172a"/><path d="M46 53C48 55 52 55 54 53" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/><path d="M40 56C44 60 56 60 60 56" fill="#1e293b"/></svg>`
      },
      {
        id: "m_avatar_2",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#0a2c28"/><path d="M50 22C38 22 32 32 32 46C32 53 34 59 38 63C26 69 18 79 18 92C28 98 40 100 50 100C60 100 72 98 82 92C82 79 74 69 62 63C66 59 68 53 68 46C68 32 62 22 50 22Z" fill="#10b981"/><circle cx="50" cy="45" r="16" fill="#fcd34d"/><path d="M33 30C36 19 44 16 50 16C56 16 64 19 67 30C63 24 57 22 50 22C43 22 37 24 33 30Z" fill="#334155"/><rect x="40" y="41" width="8" height="6" rx="2" stroke="#38bdf8" stroke-width="1.8"/><rect x="52" y="41" width="8" height="6" rx="2" stroke="#38bdf8" stroke-width="1.8"/><line x1="48" y1="44" x2="52" y2="44" stroke="#38bdf8" stroke-width="1.8"/><circle cx="44" cy="44" r="2" fill="#0f172a"/><circle cx="56" cy="44" r="2" fill="#0f172a"/><path d="M46 54C48 56 52 56 54 54" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/></svg>`
      },
      {
        id: "m_avatar_3",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#241a3d"/><path d="M50 22C38 22 32 32 32 46C32 53 34 59 38 63C26 69 18 79 18 92C28 98 40 100 50 100C60 100 72 98 82 92C82 79 74 69 62 63C66 59 68 53 68 46C68 32 62 22 50 22Z" fill="#6366f1"/><circle cx="50" cy="45" r="16" fill="#fed7aa"/><path d="M35 28C38 18 45 15 50 15C55 15 62 18 65 28C61 24 56 22 50 22C44 22 39 24 35 28Z" fill="#451a03"/><circle cx="44" cy="44" r="2.5" fill="#0f172a"/><circle cx="56" cy="44" r="2.5" fill="#0f172a"/><path d="M46 53C48 55 52 55 54 53" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/><path d="M32 26L50 20L68 26" stroke="#10b981" stroke-width="3" stroke-linecap="round"/></svg>`
      }
    ],
    provided: {
      id: "provided_profile_avatar",
      label: "Optional profile image",
      svg: `<img class="avatar-option-photo" src="/assets/images/provided-profile-avatar.png" alt="" draggable="false">`
    }
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.PLASTISENSE_DATA = PLASTISENSE_DATA;
}
