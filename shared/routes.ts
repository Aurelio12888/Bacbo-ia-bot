import { z } from 'zod';
import { insertGameResultSchema, gameResults, signals } from './schema';

export const api = {
  game: {
    list: {
      method: 'GET' as const,
      path: '/api/game/history',
      responses: {
        200: z.array(z.custom<typeof gameResults.$inferSelect>()),
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/game/result',
      input: insertGameResultSchema,
      responses: {
        201: z.custom<typeof gameResults.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    reset: {
      method: 'POST' as const,
      path: '/api/game/reset',
      responses: {
        204: z.void(),
      },
    },
  },
  signals: {
    latest: {
      method: 'GET' as const,
      path: '/api/signals/latest',
      responses: {
        200: z.custom<typeof signals.$inferSelect>().nullable(),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/signals/history',
      responses: {
        200: z.array(z.custom<typeof signals.$inferSelect>()),
      },
    },
  },
};
