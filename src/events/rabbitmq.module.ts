// src/events/rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.publisher';
import { rabbitMqClient } from '../config/rabbitmq.client'; // ← ton client RabbitMQ
import { rabbitMQConfig } from '../config/rabbitmq.config';

@Module({
  providers: [
    RabbitMQService,
    {
      provide: rabbitMQConfig.name,
      useValue: rabbitMqClient
    },
  ],
  exports: [
    RabbitMQService,
    rabbitMQConfig.name,
  ],
})
export class RabbitMQModule {}
