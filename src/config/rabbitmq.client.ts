// src/config/rabbitmq.client.ts
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import * as fs from 'fs';
import { rabbitMQConfig } from './rabbitmq.config.js';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let rabbitMQOptions: any = {
  transport: Transport.RMQ,
  options: {
    urls: [rabbitMQConfig.url],
    queue: rabbitMQConfig.queue,
    queueOptions: {
      durable: true,
    },
  },
};

// Check if the environment is production or staging
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  rabbitMQOptions.options.socketOptions = {
    connectionOptions: {
      cert: fs.readFileSync(requiredEnv('CERT_PATH')),
      key: fs.readFileSync(requiredEnv('KEY_PATH')),
      ca: [fs.readFileSync(requiredEnv('CA_PATH'))],
      rejectUnauthorized: true,
    },
  };
}

export const rabbitMqClient = ClientProxyFactory.create(rabbitMQOptions);
