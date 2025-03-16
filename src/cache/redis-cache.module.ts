// src/cache/redis-cache.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { REDIS_CACHE_MANAGER } from './cache.constants.js';
import confService from './../config/cache.conf.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [confService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (config: ConfigService) => {
        const redisConfig = config.get('cache.redis');
        return {
          store: redisStore as unknown,
          host: redisConfig.host,
          port: redisConfig.port,
          ttl: redisConfig.ttl,
        };
      }, 
    }),
  ],
  providers: [{
      provide: REDIS_CACHE_MANAGER,
      useExisting: CACHE_MANAGER,
    }, ConfigService ],
  exports: [ REDIS_CACHE_MANAGER],
})
export class RedisCacheModule {} 
