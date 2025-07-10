// rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMqClient } from '../config/rabbitmq.client.js';

@Module({
  imports: [],
  providers: [
    {
      provide: 'RABBITMQ_CLIENT',
      useValue: rabbitMqClient,
    },
  ],
  exports: ['RABBITMQ_CLIENT'],
})
export class RabbitMQModule {}
