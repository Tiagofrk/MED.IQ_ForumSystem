import { createTRPCReact } from '@trpc/react';
import type { AppRouter } from '../index';

export const trpc = createTRPCReact<AppRouter>();
