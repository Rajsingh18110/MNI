import { Service } from '@MNI/di';

@Service()
export class DbConnectionMetrics {
	acquireDurationObserver?: (seconds: number) => void;
}
