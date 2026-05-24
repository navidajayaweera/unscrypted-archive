import type { Knowledge, Survivor, Shelter, Tutorial, Stats } from "@/types";

export const DEMO_KNOWLEDGE: Knowledge[] = [
  {
    id: "demo-k1",
    title: "Emergency Wound Suturing Protocol",
    description:
      "Step-by-step field guide for closing lacerations without sterile surgical conditions. Covers irrigation, closure techniques, and infection watch.",
    filePath: "",
    tags: "medical,first-aid",
    uploadedAt: "2030-09-14T08:22:00Z",
  },
  {
    id: "demo-k2",
    title: "Hydroponic Crop Rotation Manual",
    description:
      "Blueprint for maintaining continuous food yield inside enclosed bunker grow-rooms using nutrient film technique and LED spectra.",
    filePath: "",
    tags: "agricultural,food",
    uploadedAt: "2030-11-03T14:05:00Z",
  },
  {
    id: "demo-k3",
    title: "Diesel Generator Overhaul Procedures",
    description:
      "Maintenance and repair handbook for 10–50 kW diesel gensets recovered from pre-CME infrastructure. Includes injector cleaning and governor calibration.",
    filePath: "",
    tags: "engineering,tech",
    uploadedAt: "2031-02-19T09:47:00Z",
  },
  {
    id: "demo-k4",
    title: "Rainwater Collection & Purification",
    description:
      "Multi-stage filtration system design using salvaged materials. Carbon block, UV-C exposure, and boil-confirmation protocol for potable water.",
    filePath: "",
    tags: "engineering,survival",
    uploadedAt: "2031-05-07T16:30:00Z",
  },
  {
    id: "demo-k5",
    title: "Radio Mesh Network Deployment Guide",
    description:
      "LoRa 915 MHz mesh topology for sector-to-sector communication. Node placement, antenna gain calculations, and encryption key rotation.",
    filePath: "",
    tags: "tech,engineering",
    uploadedAt: "2031-08-22T11:15:00Z",
  },
  {
    id: "demo-k6",
    title: "Improvised Antibiotic Production",
    description:
      "Extraction and preparation of penicillin from bread mould cultures using salvaged lab equipment. Includes dosage guidelines and contraindication list.",
    filePath: "",
    tags: "medical,survival",
    uploadedAt: "2031-09-05T09:10:00Z",
  },
  {
    id: "demo-k7",
    title: "Solar Panel Array Wiring Guide",
    description:
      "Series vs parallel configurations for 12 V and 24 V systems. Charge controller sizing, battery bank calculations, and inverter selection.",
    filePath: "",
    tags: "engineering,tech",
    uploadedAt: "2031-09-28T13:40:00Z",
  },
  {
    id: "demo-k8",
    title: "Seed Vault Preservation Handbook",
    description:
      "Long-term seed storage using airtight containers, silica gel desiccants, and cool dark vaults. Germination testing schedules and variety priority list.",
    filePath: "",
    tags: "agricultural,farming,survival",
    uploadedAt: "2031-10-14T07:55:00Z",
  },
  {
    id: "demo-k9",
    title: "Structural Integrity Assessment",
    description:
      "Visual inspection checklist for post-event buildings. Crack classification, load-bearing wall identification, and safe demolition of collapse-risk sections.",
    filePath: "",
    tags: "engineering,construction",
    uploadedAt: "2031-11-02T10:20:00Z",
  },
  {
    id: "demo-k10",
    title: "Underground Ventilation Design",
    description:
      "Passive and powered airflow systems for bunkers. Carbon dioxide build-up thresholds, fan sizing, and NBC filter maintenance intervals.",
    filePath: "",
    tags: "engineering,construction",
    uploadedAt: "2031-11-18T15:05:00Z",
  },
  {
    id: "demo-k11",
    title: "Radiation Exposure & Decontamination",
    description:
      "Dose thresholds, shelter-in-place protocols, and decontamination shower procedures. KI tablet dosage chart and fallout decay rate reference table.",
    filePath: "",
    tags: "medical,survival",
    uploadedAt: "2031-12-01T08:00:00Z",
  },
  {
    id: "demo-k12",
    title: "Composting in Enclosed Spaces",
    description:
      "Vermicomposting and bokashi methods adapted for sealed bunker grow-rooms. Odour control, harvest timing, and nutrient content benchmarks.",
    filePath: "",
    tags: "agricultural,farming",
    uploadedAt: "2031-12-20T12:30:00Z",
  },
  {
    id: "demo-k13",
    title: "Water Well Drilling Manual",
    description:
      "Hand-auger and percussion drilling techniques for reaching shallow aquifers. Casing installation, grout sealing, and bacteriological testing with field kits.",
    filePath: "",
    tags: "engineering,survival",
    uploadedAt: "2032-01-07T09:45:00Z",
  },
  {
    id: "demo-k14",
    title: "Perimeter Alarm Systems",
    description:
      "Tripwire, pressure-plate, and passive IR alarm designs using salvaged electronics. Zone mapping, watch rotation integration, and false-positive reduction.",
    filePath: "",
    tags: "defense,engineering",
    uploadedAt: "2032-01-22T14:00:00Z",
  },
  {
    id: "demo-k15",
    title: "Medicinal Plant Index — Southern Region",
    description:
      "Identification and preparation of locally available medicinal plants. Covers anti-infective, analgesic, and wound-healing species with dosage notes.",
    filePath: "",
    tags: "medical,survival,agricultural",
    uploadedAt: "2032-02-10T11:00:00Z",
  },
  {
    id: "demo-k16",
    title: "Blacksmithing Fundamentals",
    description:
      "Setting up a forge from salvaged components. Coal vs charcoal fuel, quenching techniques for tool steel, and priority tool fabrication list.",
    filePath: "",
    tags: "engineering,construction",
    uploadedAt: "2032-02-28T08:30:00Z",
  },
  {
    id: "demo-k17",
    title: "Food Ration Calculation Tables",
    description:
      "Daily caloric and macronutrient requirements by activity level. Ration allocation formulas for group sizes of 10–500, including children and injured.",
    filePath: "",
    tags: "agricultural,survival",
    uploadedAt: "2032-03-15T10:10:00Z",
  },
  {
    id: "demo-k18",
    title: "Archive Data Backup Protocol",
    description:
      "Procedures for maintaining redundant offline copies of Archive data. Verified storage media types, checksumming, and physical distribution across sectors.",
    filePath: "",
    tags: "tech,engineering",
    uploadedAt: "2032-03-30T16:45:00Z",
  },
  {
    id: "demo-k19",
    title: "Field Amputation Guidelines",
    description:
      "Last-resort limb removal protocol for crush injuries and advanced gangrene when evacuation is impossible. Anaesthetic alternatives, tourniquet placement, and post-op care.",
    filePath: "",
    tags: "medical,first-aid",
    uploadedAt: "2032-04-12T07:20:00Z",
  },
  {
    id: "demo-k20",
    title: "Sector Communication Codebook v3",
    description:
      "Standardised brevity codes, authentication challenges, and frequency allocation table for inter-sector radio operations. Supersedes v2 codebook.",
    filePath: "",
    tags: "tech,defense",
    uploadedAt: "2032-04-25T13:00:00Z",
  },
];

export const DEMO_SURVIVORS: Survivor[] = [
  {
    id: "demo-s1",
    name: "Amara Perera",
    age: 34,
    sector: "Sector 03 — PULSE",
    registeredAt: "2031-01-10T07:00:00Z",
    skills: [
      { id: "sk1", name: "Trauma Surgery", category: "medical", survivorId: "demo-s1" },
      { id: "sk2", name: "Triage Protocol", category: "medical", survivorId: "demo-s1" },
      { id: "sk3", name: "Field Pharmacy", category: "medical", survivorId: "demo-s1" },
    ],
  },
  {
    id: "demo-s2",
    name: "Kavindu Rathnayake",
    age: 27,
    sector: "Sector 07 — FORGE",
    registeredAt: "2031-01-15T09:30:00Z",
    skills: [
      { id: "sk4", name: "Structural Welding", category: "engineering", survivorId: "demo-s2" },
      { id: "sk5", name: "Load Bearing Calc", category: "construction", survivorId: "demo-s2" },
    ],
  },
  {
    id: "demo-s3",
    name: "Dilani Mendis",
    age: 41,
    sector: "Sector 09 — HARVEST",
    registeredAt: "2031-02-04T14:00:00Z",
    skills: [
      { id: "sk6", name: "Hydroponic Systems", category: "farming", survivorId: "demo-s3" },
      { id: "sk7", name: "Seed Preservation", category: "farming", survivorId: "demo-s3" },
      { id: "sk8", name: "Soil Chemistry", category: "farming", survivorId: "demo-s3" },
    ],
  },
  {
    id: "demo-s4",
    name: "Ruveen Jayasinghe",
    age: 29,
    sector: "Sector 01 — NEXUS",
    registeredAt: "2031-02-18T11:15:00Z",
    skills: [
      { id: "sk9", name: "RF Communications", category: "tech", survivorId: "demo-s4" },
      { id: "sk10", name: "Solar Array Config", category: "engineering", survivorId: "demo-s4" },
    ],
  },
  {
    id: "demo-s5",
    name: "Shalini Fernando",
    age: 38,
    sector: "Sector 05 — ARCHIVE",
    registeredAt: "2031-03-01T08:45:00Z",
    skills: [
      { id: "sk11", name: "Data Recovery", category: "tech", survivorId: "demo-s5" },
      { id: "sk12", name: "Analog Indexing", category: "tech", survivorId: "demo-s5" },
    ],
  },
];

export const DEMO_SHELTERS: Shelter[] = [
  {
    id: "demo-sh1",
    name: "SquareHub Bunker Alpha",
    description:
      "Main command bunker, Faraday-shielded pre-CME. Houses Archive and Nexus command nodes. Reinforced concrete, rated for 500 occupants.",
    lat: 6.9271,
    lng: 79.8612,
    capacity: 500,
    status: "active",
    createdAt: "2030-08-01T00:00:00Z",
  },
  {
    id: "demo-sh2",
    name: "Kelani Valley Refuge",
    description:
      "Converted riverside warehouse. Flood-elevated floor plan, gravity water intake from Kelani river. Active filtration system.",
    lat: 7.0,
    lng: 80.0,
    capacity: 200,
    status: "active",
    createdAt: "2030-10-15T00:00:00Z",
  },
  {
    id: "demo-sh3",
    name: "Mount Lavinia Underground",
    description:
      "Former civil defense tunnel network. Limited power, no running water. Emergency overflow site only.",
    lat: 6.8389,
    lng: 79.8656,
    capacity: 80,
    status: "full",
    createdAt: "2030-11-20T00:00:00Z",
  },
  {
    id: "demo-sh4",
    name: "Gampaha Transit Post",
    description:
      "Decommissioned rail depot repurposed as a transit shelter. Route hub between northern sectors.",
    lat: 7.0873,
    lng: 80.0144,
    capacity: 150,
    status: "active",
    createdAt: "2031-01-05T00:00:00Z",
  },
  {
    id: "demo-sh5",
    name: "Negombo Coastal Bunker",
    description:
      "Coastal storm shelter, partially flooded lower level. Upper deck still functional. Abandoned main grid, running on salvaged solar.",
    lat: 7.2094,
    lng: 79.8363,
    capacity: 60,
    status: "abandoned",
    createdAt: "2031-03-12T00:00:00Z",
  },
];

export const DEMO_TUTORIALS: Tutorial[] = [
  {
    id: "demo-t1",
    title: "Tourniquet Application in the Field",
    category: "first-aid",
    difficulty: "beginner",
    content:
      "## Overview\nA tourniquet stops life-threatening limb bleeding when direct pressure fails.\n\n## Materials\n- 2-inch wide cloth strip or commercial CAT tourniquet\n- Rigid rod or pen for windlass\n\n## Steps\n1. Apply 2–3 inches above the wound\n2. Secure tightly and tie a half-knot\n3. Place rod on knot and tie a full knot over it\n4. Twist rod until bleeding stops\n5. Secure rod. Note time applied.\n\n## Warning\n**Do not remove in field.** Mark patient with 'T' and application time on forehead.",
    createdAt: "2031-01-18T10:00:00Z",
  },
  {
    id: "demo-t2",
    title: "Starting Fire Without Ignition Devices",
    category: "survival",
    difficulty: "intermediate",
    content:
      "## Bow Drill Method\nThe most reliable friction fire method in humid climates.\n\n## Materials\n- Dry softwood spindle (30cm, 1cm diameter)\n- Fireboard of same wood, notched\n- Bow with paracord\n- Handhold of hardwood\n\n## Steps\n1. Cut a notch in fireboard adjacent to a small depression\n2. Place bark below notch to catch ember\n3. Loop spindle in bow string, place in depression\n4. Apply downward pressure with handhold, draw bow steadily\n5. When smoke thickens and ember forms, tap onto tinder bundle\n6. Cup tinder, blow gently into ember until flame ignites",
    createdAt: "2031-02-02T08:30:00Z",
  },
  {
    id: "demo-t3",
    title: "Constructing a Debris Shelter",
    category: "shelter",
    difficulty: "beginner",
    content:
      "## Purpose\nA debris hut retains body heat in near-freezing temperatures without fire.\n\n## Construction\n1. Find a long pole (2m+), prop one end on a fork or stump at hip height\n2. Lean branches along both sides at 45°\n3. Pile debris (leaves, pine needles) at least 1m thick over frame\n4. Insulate floor with 30cm of dry debris\n5. Stuff interior — space should be just enough to fit your body\n\n## Key Principle\nThe smaller the air space, the faster your body heats it.",
    createdAt: "2031-02-20T14:00:00Z",
  },
  {
    id: "demo-t4",
    title: "Identifying Edible Plants — Colombo Region",
    category:    "food",
    difficulty: "intermediate",
    content:
      "## Overview\nPost-CME foraging requires positive ID before consumption. When in doubt, discard.\n\n## Safe Identifications\n- **Mukunuwenna** (water spinach): narrow leaves, hollow stem, grows near water. Boil 5 min.\n- **Gotukola** (centella): fan-shaped leaves, low ground cover, distinctive smell. Safe raw.\n- **Kiri Anguna**: fleshy leaves with white latex — **AVOID**. Toxic.\n\n## Universal Edibility Test\n1. Separate plant parts\n2. Rub sample on wrist — wait 15 min\n3. Touch to lower lip — wait 3 min\n4. Touch to tongue tip — wait 15 min\n5. Chew small amount, spit — wait 8 hours\n6. If no reaction, consume small portion — wait 8 hours",
    createdAt: "2031-03-05T09:00:00Z",
  },
  {
    id: "demo-t5",
    title: "Perimeter Security with Tripwire Alerts",
    category: "defense",
    difficulty: "advanced",
    content:
      "## Purpose\nPassive perimeter detection using tension-wire alarm systems.\n\n## Materials\n- Monofilament or thin wire (50m+)\n- Metal cans with pebbles inside\n- Stakes\n\n## Deployment\n1. Map perimeter entry corridors — focus on gaps not natural barriers\n2. Run wire 15–20cm above ground between stakes\n3. Attach cans at 3m intervals — wire tension holds them upright\n4. Disturbance rattles cans and may break wire\n\n## Multi-layer Pattern\n- Inner ring: 10m from shelter — loud alert\n- Outer ring: 30m — early warning\n\n## Night Protocol\nAssign watch rotation. Two-alert rule before scramble.",
    createdAt: "2031-03-18T11:30:00Z",
  },
];

export const DEMO_STATS: Stats = {
  totalDocuments: DEMO_KNOWLEDGE.length,
  totalSurvivors: DEMO_SURVIVORS.length,
  totalSkills: DEMO_SURVIVORS.reduce((acc, s) => acc + s.skills.length, 0),
  totalShelters: DEMO_SHELTERS.length,
  totalTutorials: DEMO_TUTORIALS.length,
  recentDocuments: DEMO_KNOWLEDGE.slice(0, 5),
  recentSurvivors: DEMO_SURVIVORS.slice(0, 5),
};
