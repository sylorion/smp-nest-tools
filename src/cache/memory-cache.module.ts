// src/cache/memory-cache.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import confService from './../config/cache.conf.js';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MEMORY_CACHE_MANAGER } from './cache.constants.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [confService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (config: ConfigService) => {
        const memoryConfig = confService().memory;
        return {
          ttl: memoryConfig.ttl,  // en secondes
          max: memoryConfig.max,  // nombre d’entrées max
        };
      }, 
    }),
  ],
  providers: [
    {
      provide: MEMORY_CACHE_MANAGER,
      useExisting: CACHE_MANAGER,
    },
    ConfigService
  ],
  exports: [ MEMORY_CACHE_MANAGER ],
})
export class MemoryCacheModule {} 
