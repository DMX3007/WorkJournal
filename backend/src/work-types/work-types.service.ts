import { Injectable } from '@nestjs/common';
import { prisma } from "../../prisma/lib/prisma";

@Injectable()
export class WorkTypesService {
    async getWorkTypes() {
        return await prisma.workType.findMany();
    }
}
