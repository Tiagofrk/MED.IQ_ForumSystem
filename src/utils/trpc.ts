import { createTRPCReact } from '@trpc/react';
import type { adminRouter } from '../routes/adminRouter';

export const trpc = createTRPCReact<AppRouter>();
