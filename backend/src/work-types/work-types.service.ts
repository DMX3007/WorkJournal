import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkTypesService {

    constructor(private readonly prisma: PrismaService) { }

    async getWorkTypes() {
        return await this.prisma.workType.findMany();
    }
    async findAllActive() {
        return await this.prisma.workType.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, defaultUnit: true },
        });
    }
}
