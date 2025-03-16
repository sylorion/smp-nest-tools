
// src/heartbeat/heartbeat.module.ts
import { Module } from '@nestjs/common';
import { HeartbeatService } from './heartbeat.service.js';
import { HeartbeatResolver } from './heartbeat.resolver.js'; 
import { RabbitMQModule } from '../events/rabbitmq.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { DateScalar } from './models/heartbeat.model.js';

@Module({
  imports: [RabbitMQModule, PrismaModule],
  providers: [HeartbeatResolver, HeartbeatService, DateScalar],
  exports: [HeartbeatService],
})
export class HeartbeatModule {}
