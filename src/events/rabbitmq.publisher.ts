  // src/events/rabbitmq.publisher.ts
  import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
  import * as amqp from 'amqplib';
  import { rabbitMQConfig } from '../config/rabbitmq.config.js';
  import { Logger } from '../logger/custom-logger.service.js';

  @Injectable()
  export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    // private name: string;
    private connection: amqp.Connection;
    private channel: amqp.Channel;
    private readonly logger = new Logger(RabbitMQService.name);

    async onModuleInit() {
      try {
        this.connection = await amqp.connect(rabbitMQConfig.url);
        this.connection.status
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(rabbitMQConfig.exchange, rabbitMQConfig.exchangeType, { durable: rabbitMQConfig.durable });
        this.logger.log('RabbitMQ Publisher initialized.');
      } catch (error) {
        this.logger.error('Error connecting to RabbitMQ', error);
        throw error;
      }
    }

    async emit(routingKey: string, message: any, persistent: boolean = !rabbitMQConfig.queueOptions.autoDelete): Promise<void> {
      try {
        const msgBuffer = Buffer.from(JSON.stringify(message));
        this.channel.publish(rabbitMQConfig.exchange, routingKey, msgBuffer, { persistent: persistent });
        this.logger.log(`Event published to ${routingKey}: ${JSON.stringify(message)}`);
      } catch (error) {
        this.logger.error('Error publishing RabbitMQ event: ' + error.message);
        throw error;
      }
    }

    async onModuleDestroy() {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    }
  }
