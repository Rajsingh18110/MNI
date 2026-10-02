import { User } from '@MNI/db';

import type { Telemetry } from '@/telemetry';

export const user = Object.assign(new User(), { id: 'user-1' });

export const createTelemetry = () => ({ track: vi.fn() }) as unknown as Telemetry;
