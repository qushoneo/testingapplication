import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const usersWithoutCompany = await prisma.user.findMany({
    where: {
      companyId: null,
    },
  });

  for (const user of usersWithoutCompany) {
    const generatedCompanyName = `${user.name}'s Company`;

    const company = await prisma.company.create({
      data: {
        name: generatedCompanyName,
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        companyId: company.id,
      },
    });
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
