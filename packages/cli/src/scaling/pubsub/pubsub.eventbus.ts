import { TypedEmitter } from '@MNI/backend-common';
import { Service } from '@MNI/di';

import type { PubSubEventMap } from './pubsub.event-map';

@Service()
export class PubSubEventBus extends TypedEmitter<PubSubEventMap> {}
