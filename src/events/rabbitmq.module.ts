// src/events/rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { rabbitMqClient } from '../config/rabbitmq.client.js'; // Ton client personnalisé
import { rabbitMQConfig } from '../config/rabbitmq.config.js';

@Module({
  providers: [
    {
      provide: rabbitMQConfig.name, // Exemple : 'CARD_PAYMENT_RMQ_SERVICE'
      useValue: rabbitMqClient,
    },
  ],
  exports: [
    rabbitMQConfig.name,
  ],
})
export class RabbitMQModule {}
