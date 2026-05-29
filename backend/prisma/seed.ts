import { prisma } from "./lib/prisma.js";

const WORK_TYPES = [
    { name: 'Кладка перегородок', defaultUnit: 'м³' },
    { name: 'Монтаж опалубки', defaultUnit: 'м²' },
    { name: 'Установка окон', defaultUnit: 'м³' },
    { name: 'Выравнивание поверхностей', defaultUnit: 'т' },
    { name: 'Установка дверей', defaultUnit: 'м²' },
    { name: 'Монтаж кровли', defaultUnit: 'м²' },
    { name: 'Установка радиаторов', defaultUnit: 'шт' },
    { name: 'Прокладка коммуникаций', defaultUnit: 'п.м.' },
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