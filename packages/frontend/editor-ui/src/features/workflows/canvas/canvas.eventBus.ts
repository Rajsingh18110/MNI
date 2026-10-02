import type { CanvasEventBusEvents } from './canvas.types';
import { createEventBus } from '@MNI/utils/event-bus';

export const canvasEventBus = createEventBus<CanvasEventBusEvents>();
