import { createTRPCReact } from '@trpc/react';
import type { adminRouter } from '../routes/adminRouter';
import { appRouter } from '../trpc/routes';

export const trpc = createTRPCReact();
