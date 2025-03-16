// src/cache/memory-cache.module.ts

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MEMORY_CACHE_MANAGER } from './cache.constants.js';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: false,
      useFactory: (config: ConfigService) => {
        const memoryConfig = config.get('cache.memory');
        return {
          ttl: memoryConfig.ttl,  // en secondes
          max: memoryConfig.max,  // nombre d’entrées max
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: MEMORY_CACHE_MANAGER,
      useExisting: CACHE_MANAGER,
    },
  ],
  exports: [ MEMORY_CACHE_MANAGER ],
})
export class MemoryCacheModule {}

