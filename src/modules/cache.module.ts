// src/cache/cache.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import cacheConfig from './../config/cache.conf.js';
import { MemoryCacheModule } from '../cache/memory-cache.module.js';
import { RedisCacheModule } from '../cache/redis-cache.module.js';
import { CacheService } from './../services/CacheService.js';
import { MEMORY_CACHE, MEMORY_CACHE_MANAGER, REDIS_CACHE, REDIS_CACHE_MANAGER } from '../cache/cache.constants.js';

@Module({
  imports: [MemoryCacheModule, RedisCacheModule],
  providers: [CacheService],
  exports: [CacheService, cacheConfig],
})
export class SMPCacheModule {}

