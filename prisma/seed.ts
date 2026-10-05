import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { podcastRegistry } from "../src/data/podcast-registry";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed Fireside Chat");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const personIds = new Map<string, string>();

  for (const person of podcastRegistry.people) {
    const row = await prisma.person.upsert({
      where: { slug: person.slug },
      create: person,
      update: person,
    });

    personIds.set(person.slug, row.id);
  }

  for (const podcast of podcastRegistry.podcasts) {
    const { people, verifiedAt, ...podcastData } = podcast;
    const data = {
      ...podcastData,
      verifiedAt: new Date(`${verifiedAt}T00:00:00Z`),
    };

    const row = await prisma.podcast.upsert({
      where: { slug: podcast.slug },
      create: data,
      update: data,
    });

    await prisma.podcastPerson.deleteMany({
      where: { podcastId: row.id },
    });

    await prisma.podcastPerson.createMany({
      data: people.map((relationship) => {
        const personId = personIds.get(relationship.personSlug);

        if (!personId) {
          throw new Error(
            `Missing seeded person ${relationship.personSlug} for ${podcast.slug}`,
          );
        }

        return {
          podcastId: row.id,
          personId,
          role: relationship.role,
        };
      }),
    });
  }

  console.log(
    `Seeded ${podcastRegistry.people.length} people and ${podcastRegistry.podcasts.length} verified podcasts.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
