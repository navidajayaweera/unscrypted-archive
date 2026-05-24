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
