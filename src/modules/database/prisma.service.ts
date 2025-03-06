import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        console.log("data loaded");

        await this.$connect(); // Connect to the database
        console.log("database connected");

    }

    async onModuleDestroy() {
        await this.$disconnect(); // Disconnect from the database
    }
}