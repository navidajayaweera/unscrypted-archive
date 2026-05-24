import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.skill.deleteMany();
  await prisma.survivor.deleteMany();
  await prisma.knowledge.deleteMany();
  await prisma.shelterLocation.deleteMany();
  await prisma.tutorial.deleteMany();

  await prisma.knowledge.createMany({
    data: [
      {
        title: "Field Triage Protocol",
        description: "Emergency medical assessment procedures for bunker personnel.",
        filePath: "/uploads/field-triage-protocol.txt",
        tags: "medical,engineering",
      },
      {
        title: "Hydroponic Crop Rotation",
        description: "Seasonal planting schedules for underground agricultural units.",
        filePath: "/uploads/hydroponic-crop-rotation.txt",
        tags: "agricultural,farming",
      },
      {
        title: "Generator Maintenance Manual",
        description: "Preventive maintenance checklist for backup power systems.",
        filePath: "/uploads/generator-maintenance.txt",
        tags: "engineering,tech",
      },
      {
        title: "Water Purification Standards",
        description: "Quality thresholds and filtration procedures for potable water.",
        filePath: "/uploads/water-purification.txt",
        tags: "medical,engineering",
      },
      {
        title: "Radio Encryption Basics",
        description: "Secure communication protocols for inter-sector messaging.",
        filePath: "/uploads/radio-encryption.txt",
        tags: "tech,engineering",
      },
    ],
  });

  await prisma.survivor.create({
    data: {
      name: "Dr. Elena Vasquez",
      age: 42,
      sector: "Medical Bay",
      skills: {
        create: [
          { name: "Trauma Surgery", category: "medical" },
          { name: "Pharmacology", category: "medical" },
          { name: "Field Triage", category: "medical" },
        ],
      },
    },
  });

  await prisma.survivor.create({
    data: {
      name: "Marcus Chen",
      age: 35,
      sector: "Engineering",
      skills: {
        create: [
          { name: "Electrical Systems", category: "engineering" },
          { name: "Generator Repair", category: "engineering" },
          { name: "Structural Assessment", category: "construction" },
        ],
      },
    },
  });

  await prisma.survivor.create({
    data: {
      name: "Sarah Okonkwo",
      age: 28,
      sector: "Agriculture",
      skills: {
        create: [
          { name: "Hydroponics", category: "farming" },
          { name: "Seed Preservation", category: "farming" },
          { name: "Soil Analysis", category: "farming" },
        ],
      },
    },
  });

  await prisma.survivor.create({
    data: {
      name: "James Whitfield",
      age: 31,
      sector: "Communications",
      skills: {
        create: [
          { name: "Network Administration", category: "tech" },
          { name: "Radio Operations", category: "tech" },
          { name: "Encryption", category: "tech" },
        ],
      },
    },
  });

  await prisma.survivor.create({
    data: {
      name: "Rosa Mendez",
      age: 45,
      sector: "Construction",
      skills: {
        create: [
          { name: "Masonry", category: "construction" },
          { name: "Plumbing", category: "construction" },
          { name: "Ventilation Systems", category: "engineering" },
        ],
      },
    },
  });

  await prisma.shelterLocation.createMany({
    data: [
      {
        name: "Fort Bunker Alpha",
        description: "Reinforced command bunker beneath Colombo Fort district. Primary archive relay node.",
        lat: 6.9344,
        lng: 79.8428,
        capacity: 120,
        status: "active",
      },
      {
        name: "Bambalapitiya Safe Zone",
        description: "Coastal evacuation shelter with desalination unit and medical triage bay.",
        lat: 6.888,
        lng: 79.86,
        capacity: 85,
        status: "active",
      },
      {
        name: "Dehiwala Shelter Delta",
        description: "Underground rail-adjacent bunker. Connected to southern supply corridors.",
        lat: 6.8567,
        lng: 79.8614,
        capacity: 60,
        status: "full",
      },
      {
        name: "Kotte Underground",
        description: "Administrative sector shelter with hydroponics annex and comms array.",
        lat: 6.89,
        lng: 79.91,
        capacity: 95,
        status: "active",
      },
      {
        name: "Negombo Coastal Relay",
        description: "Northern coastal outpost. Abandoned after storm surge — salvage only.",
        lat: 7.2083,
        lng: 79.8358,
        capacity: 40,
        status: "abandoned",
      },
      {
        name: "Mount Lavinia Ridge Post",
        description: "Elevated observation shelter overlooking the southern coastline.",
        lat: 6.838,
        lng: 79.863,
        capacity: 30,
        status: "active",
      },
    ],
  });

  await prisma.tutorial.createMany({
    data: [
      {
        title: "Stop Severe Bleeding",
        category: "first-aid",
        difficulty: "beginner",
        content: `# Stop Severe Bleeding

## When to act
Apply pressure immediately if blood is flowing steadily or pooling.

## Steps
1. **Direct pressure** — Use a clean cloth or sterile gauze on the wound.
2. **Elevate** the injured limb above heart level if possible.
3. **Do not remove** embedded objects — stabilize around them.
4. If bleeding continues after 10 minutes, prepare a **tourniquet** 5 cm above the wound.

## Warning signs
- Pale, cold, clammy skin
- Rapid pulse
- Confusion or dizziness → treat for shock`,
      },
      {
        title: "CPR for Adults",
        category: "first-aid",
        difficulty: "intermediate",
        content: `# CPR for Adults

## Check responsiveness
Tap shoulders and shout. If unresponsive and not breathing normally, begin CPR.

## Compression technique
- Place heel of hand on center of chest
- Push **hard and fast** at 100–120 compressions per minute
- Depth: at least 5 cm (2 inches)
- Allow full chest recoil between compressions

## Cycle
30 compressions → 2 rescue breaths (if trained) → repeat until help arrives or AED is ready.`,
      },
      {
        title: "Treat Burns",
        category: "first-aid",
        difficulty: "beginner",
        content: `# Treat Burns

## First-degree (red, painful)
Cool under running water for **20 minutes**. Do not use ice.

## Second-degree (blisters)
Cool water, cover loosely with sterile non-stick dressing. Do not pop blisters.

## Third-degree (white/charred)
Do **not** cool with water. Cover with clean dry cloth. Evacuate to medical bay immediately.

## Never apply
Butter, toothpaste, or oil to burns.`,
      },
      {
        title: "Splint a Fracture",
        category: "first-aid",
        difficulty: "intermediate",
        content: `# Splint a Fracture

## Before splinting
1. Check circulation beyond the injury (pulse, color, warmth).
2. Do not attempt to realign bone.

## Splinting steps
1. Immobilize the joint above and below the fracture.
2. Use rigid material: boards, rolled magazines, or SAM splint.
3. Pad between splint and skin.
4. Secure without cutting off circulation.

## Re-check
Confirm fingers/toes remain warm and pink after splinting.`,
      },
      {
        title: "Find Clean Water",
        category: "survival",
        difficulty: "beginner",
        content: `# Find Clean Water

## Priority order
1. **Stored reserves** in bunker cisterns (check Archive inventory)
2. **Condensation** from ventilation pipes
3. **Rain collection** on upper levels (filter before use)
4. **Boiling** — rolling boil for 1 minute kills pathogens

## Avoid
Stagnant surface water, unlabeled containers, and chemical storage runoff.

## Minimum intake
2–3 liters per person per day in temperate bunker conditions.`,
      },
      {
        title: "Build an Emergency Shelter",
        category: "shelter",
        difficulty: "intermediate",
        content: `# Build an Emergency Shelter

## Site selection
- Away from flood paths and structural weak points
- Near ventilation but not directly under drip lines
- Close to marked exit routes

## Construction
1. Use tarps or salvage paneling for wind/radiation shielding
2. Insulate floor with cardboard or dry debris
3. Mark entrance with **reflective tape** or chalk
4. Register location with Archive Control via shelter API

## Capacity rule
Do not exceed posted capacity — air exchange rates are calculated per shelter.`,
      },
      {
        title: "Preserve Food Without Refrigeration",
        category: "food",
        difficulty: "beginner",
        content: `# Preserve Food Without Refrigeration

## Methods
- **Salting** — Draws moisture from meat; store in sealed containers
- **Drying** — Dehydrate fruits and vegetables at 60°C+ until brittle
- **Fermentation** — Cabbage, root vegetables in brine (3% salt solution)

## Storage
Keep preserved food in cool, dark sectors. Label with date and contents.

## Spoilage signs
Off odor, slimy texture, or color change → discard immediately.`,
      },
      {
        title: "Secure a Perimeter",
        category: "defense",
        difficulty: "advanced",
        content: `# Secure a Perimeter

## Layered defense
1. **Outer zone** — Tripwire alarms or noise traps on approach paths
2. **Middle zone** — Barricades at choke points
3. **Inner zone** — Fallback position with supplies and comms

## Watch rotation
Minimum 2-person teams, 4-hour shifts. Log all contacts in Archive registry.

## Rules of engagement
- Identify before engaging
- Conserve ammunition — signal flares preferred for non-hostile alerts
- Report all breaches to Security Command (COM-09)`,
      },
      {
        title: "Recognize Hypothermia",
        category: "first-aid",
        difficulty: "beginner",
        content: `# Recognize Hypothermia

## Symptoms (mild to severe)
- Shivering (early) → shivering stops (severe)
- Slurred speech, confusion
- Slow pulse, shallow breathing

## Treatment
1. Move to warm, dry environment
2. Remove wet clothing
3. Insulate with blankets — **head and neck** especially
4. Warm drinks if conscious (no alcohol)
5. Do not rub limbs or use direct heat on skin

## Prevention
Layer clothing, stay dry, eat regularly in cold sectors.`,
      },
    ],
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
