// index.ts

import { ValidationPipe } from '@nestjs/common';
import { Logger } from './logger/custom-logger.service.js';

export * from './core-auth.module.js';
export * from './logger/custom-logger.service.js';
export * from './events/rabbitmq.module.js';
export * from './config/rabbitmq.config.js';
export * from './services/JwtAuthGuard.js';
export * from './services/GRPCService.js';
export * from './interceptors/grpc.interceptor.js';
export * from './interceptors/rabbitmq.interceptor.js';
export * from './middlewares/express.middleware.js';
export * from './middlewares/apollo.middleware.js';
export * from './modules/cache.module.js';
export * from './cache/memory-cache.module.js';
export * from './cache/redis-cache.module.js';
export * from './services/CacheService.js';
export * from './cache/cache.constants.js';
import { NestFactory } from '@nestjs/core';
export { default as cacheConfig } from './config/cache.conf.js';

const mainModuleFunction = async (AppModule: any, grpcOptions: any | null, rabbitMQConfig: any | null): Promise<void> => {
  async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule,
   {
    rawBody: true,
   });


  // Global validation for all incoming requests
  app.useGlobalPipes(new ValidationPipe());
  // Connect gRPC microservice (e.g. for payment confirmations)
  if (grpcOptions)
  app.connectMicroservice(grpcOptions);
  
//   // Démarrage effectif
  await app.startAllMicroservices();

  const url = process.env.SMP_MU_DOMAIN_NAME ?? "localhost";
  const port = process.env.SMP_MU_SERVICE_API_PORT ?? 4000;

  logger.log(`Application ${process.env.SMP_MU_SERVICE_SHORTNAME} lancée sur http://${url}:${port}`);
  if (rabbitMQConfig)
  logger.log(`Microservices démarrés: gRPC (port 50050), RabbitMQ (queue "${rabbitMQConfig.queue}")`);
  else
  logger.log(`Microservices démarrés: gRPC (port 50050) NO RABBITMQ CONFIGURATION PROVIDED`);
  logger.log(`Module principal: AppModule`); 

  await app.listen(port);
}
bootstrap();
}

export { mainModuleFunction };