import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    ttl: parseInt(process.env.REDIS_TTL_SEC || '86400', 10),
  },

  memory: {
    ttl: parseInt(process.env.MEMORY_TTL_SEC || '300', 10),
    max: 1000,
  },
}));
