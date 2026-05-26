import { prisma } from "./lib/prisma.js";

const WORK_TYPES = [
    { name: 'Работа 1', defaultUnit: 'м³' },
    { name: 'Работа 2', defaultUnit: 'м²' },
    { name: 'Работа 3', defaultUnit: 'м³' },
    { name: 'Работа 4', defaultUnit: 'т' },
    { name: 'Работа 5', defaultUnit: 'м²' },
    { name: 'Работа 6', defaultUnit: 'м²' },
    { name: 'Работа 7', defaultUnit: 'шт' },
    { name: 'Работа 8', defaultUnit: 'п.м.' },
] as const;

async function main() {
    console.log('Посев типов работ...');

    for (const wt of WORK_TYPES) {
        await prisma.workType.upsert({
            where: { name: wt.name },
            update: { defaultUnit: wt.defaultUnit, isActive: true },
            create: { name: wt.name, defaultUnit: wt.defaultUnit },
        });
    }

    const count = await prisma.workType.count();
    console.log(`Количество: ${count}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });