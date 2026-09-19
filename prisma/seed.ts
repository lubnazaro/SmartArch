import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "BlueBirdf88!";

const ABOUT_EN = `Smart Arch is an architecture and interior design studio that brings together thoughtful design and smart technology to create spaces that look beautiful and work beautifully.

We provide a complete design experience, from space planning and interior design to detailed drawings, material selection, execution supervision, and smart home solutions.

Our approach is simple: every project should reflect the people who live in it. We focus on functionality, comfort, and carefully considered details while creating a clear connection between architecture, interiors, and technology.

With our integrated Smart Home solutions, everyday features such as lighting, climate control, curtains, security, and more can become part of one seamless system designed around each client's lifestyle.

At Smart Arch, we don't just design spaces. We create complete living experiences where design meets technology.`;

const ADMINS = [
  { email: "zarofiras@gmail.com", name: "Firas" },
  { email: "lubnazaro@gmail.com", name: "Lubna" },
] as const;

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {
      phone: "0595701747",
      whatsapp: "0595701747",
      email: "smartarchitectureps@gmail.com",
      instagramUrl: "https://www.instagram.com/smartarch.group/",
      instagramHandle: "@smartarch.group",
      address: "Bethlehem / Jerusalem",
      aboutEn: ABOUT_EN,
      heroHeadlineEn: "Design meets technology",
      heroSubEn:
        "Architecture and interior design with seamless smart home systems for spaces that look beautiful and work beautifully.",
    },
    create: {
      id: "main",
      phone: "0595701747",
      whatsapp: "0595701747",
      email: "smartarchitectureps@gmail.com",
      instagramUrl: "https://www.instagram.com/smartarch.group/",
      instagramHandle: "@smartarch.group",
      address: "Bethlehem / Jerusalem",
      aboutEn: ABOUT_EN,
      heroHeadlineEn: "Design meets technology",
      heroSubEn:
        "Architecture and interior design with seamless smart home systems for spaces that look beautiful and work beautifully.",
    },
  });

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  for (const admin of ADMINS) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {
        name: admin.name,
        passwordHash,
        mustChangePassword: true,
      },
      create: {
        email: admin.email,
        name: admin.name,
        passwordHash,
        mustChangePassword: true,
      },
    });
  }

  console.log("Seeded site settings and admin users:");
  for (const admin of ADMINS) {
    console.log(`  - ${admin.name} <${admin.email}> (must change password)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
