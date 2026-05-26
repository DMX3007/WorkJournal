import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
        super({ adapter, log: ['warn', 'error'] });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected to MySQL');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}