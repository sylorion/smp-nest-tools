// src/cache/redis-cache.module.ts

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { REDIS_CACHE_MANAGER } from './cache.constants.js';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: false,
      useFactory: (config: ConfigService) => {
        const redisConfig = config.get('cache.redis');
        return {
          store: redisStore as unknown,
          host: redisConfig.host,
          port: redisConfig.port,
          ttl: redisConfig.ttl,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [{
      provide: REDIS_CACHE_MANAGER,
      useExisting: CACHE_MANAGER,
    },],
  exports: [ REDIS_CACHE_MANAGER],
})
export class RedisCacheModule {}
