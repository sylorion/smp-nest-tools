// services/CacheService.ts 
import { Injectable, Inject } from '@nestjs/common'; 
import { Cache } from 'cache-manager';
import { MEMORY_CACHE, MEMORY_CACHE_MANAGER, REDIS_CACHE, REDIS_CACHE_MANAGER } from '../cache/cache.constants.js';
// Les tokens d’injection pour différencier le cache mémoire et le cache Redis

@Injectable()
export class CacheService {
  public isMemoryCacheFirst = true;
  public isMemoryCacheEnabled = true;
  public isRedisCacheEnabled = true;
  constructor(
    @Inject(MEMORY_CACHE_MANAGER)
    private readonly memoryCache: Cache, // TTL court

    @Inject(REDIS_CACHE_MANAGER)
    private readonly redisCache: Cache, // TTL long
  ) {}

  async get<T>(key: string): Promise<T | null> {
    // 1) On tente la mémoire
    const memoryVal: T | null = await this.memoryCache.get<T>(key);
    if (memoryVal !== null) {
      return memoryVal;
    }
    // 2) Sinon on tente Redis
    const redisVal: T | null = await this.redisCache.get<T>(key);
    if (redisVal !== null && redisVal !== null) {
      // On met à jour le cache mémoire pour la prochaine fois
      await this.memoryCache.set(key, redisVal);
      return redisVal;
    }
    return null;
  }

  async setDistinct<T>(key: string, value: T, ttlSecondsShort?: number, ttlSecondsLongTerms?: number) {
    // On écrit dans le cache mémoire
    await this.memoryCache.set(key, value, ttlSecondsShort ? ttlSecondsShort : undefined);
    // On écrit aussi dans Redis si besoin
    if (ttlSecondsLongTerms) {
      await this.redisCache.set(key, value, ttlSecondsLongTerms );
    } else {
      await this.redisCache.set(key, value);
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number) {
    this.setDistinct(key, value, ttlSeconds, ttlSeconds);
  }

  async del(key: string) {
    await this.memoryCache.del(key);
    await this.redisCache.del(key);
  }

  async reset() {
    await this.memoryCache.clear();
    await this.redisCache.clear();
  }
}
