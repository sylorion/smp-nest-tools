    // rabbitmq.module.ts
import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { rabbitMQConfig } from '../config/rabbitmq.config.js'; 
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
  providers: [],
  exports: [ ClientsModule],
})
export class RabbitMQModule {}
