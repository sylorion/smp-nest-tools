// src/config/rabbitmq.config.ts
// TODO: Better use this to configure RabbitMQ in the application.
const amqUser = process.env.RABBITMQ_USER || 'guest';
const amqPass = process.env.RABBITMQ_PASS || 'guest';
const amqHost = process.env.RABBITMQ_HOST || 'dev-rabbitmq.sh1.hidora.net';
const amqPort = process.env.RABBITMQ_PORT || '5672';
const amqVhost = process.env.RABBITMQ_VHOST || '/';

const isSecureEnv = ['production', 'prod', 'staging'].includes(process.env.NODE_ENV ?? '');
const amqUrl = isSecureEnv?`amqps://${amqUser}:${amqPass}@${amqHost}:${amqPort}`:`amqp://${amqUser}:${amqPass}@${amqHost}:${amqPort}`;


export const rabbitMQConfig = {
  name: process.env.RABBITMQ_MODULE_NAME || 'NO_RMQ_SERVICE_DEFINED',
  urls: [amqUrl],
  ports: [amqPort],
  url: amqUrl,
  port: amqPort,
  exchange: process.env.RABBITMQ_EXCHANGE || 'no_rbmq_exchange_defined',
  exchangeType: 'topic',
  queue: process.env.RABBITMQ_QUEUE || 'no_rbmq_queue_defined',
  durable: true,
  autoDelete: false,
  prefetchCount: 1,
  routingKey: process.env.RABBITMQ_ROUTING_KEY || 'rk.noroutingkey.*',
  timeout: process.env.RABBITMQ_TIMEOUT ? parseInt(process.env.RABBITMQ_TIMEOUT) : 5000,
  retryAttempts: process.env.RABBITMQ_RETRY_ATTEMPTS ? parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS) : 3,
  retryDelay: process.env.RABBITMQ_RETRY_DELAY ? parseInt(process.env.RABBITMQ_RETRY_DELAY) : 1000,
  connectionTimeout: process.env.RABBITMQ_QUEUE_CONNECTION_TIMEOUT|| 10000,
  queueOptions: { 
    durable: process.env.RABBITMQ_QUEUE_DURABLE ? process.env.RABBITMQ_QUEUE_DURABLE == 'true' : true,
    autoDelete: process.env.RABBITMQ_QUEUE_AUTODELETE ? process.env.RABBITMQ_QUEUE_AUTODELETE == 'true' : false,
    arguments: process.env.RABBITMQ_QUEUE_ARGUMENTS || {}
  },
};
