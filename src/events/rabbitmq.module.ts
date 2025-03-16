    // rabbitmq.module.ts
import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { rabbitMQConfig } from '../config/rabbitmq.config.js';
import { RabbitMQService } from './rabbitmq.publisher.js';

const rbmq = ClientsModule.register([
      {
        name: rabbitMQConfig.name,
        transport: Transport.RMQ,
        options: {
          urls: rabbitMQConfig.urls,
          queue: rabbitMQConfig.queue,
          queueOptions: rabbitMQConfig.queueOptions,
        },
      },
    ]);

@Module({
  imports: [
    rbmq,
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService, ClientsModule],
})
export class RabbitMQModule {}
