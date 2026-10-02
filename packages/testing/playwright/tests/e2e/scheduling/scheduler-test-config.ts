export const durableScheduleTestConfig = {
	capability: {
		env: {
			MNI_SCHEDULER_ENABLED: 'true',
			MNI_USE_WORKFLOW_PUBLICATION_SERVICE: 'true',
			MNI_SCHEDULER_EXECUTOR_INTERVAL: '1',
		},
	},
} as const;

export const migratedPollTestConfig = {
	capability: {
		services: ['proxy'],
		env: {
			MNI_POLLER_DURABLE_CURSORS_ENABLED: 'true',
			MNI_SCHEDULER_ENABLED: 'true',
			MNI_USE_WORKFLOW_PUBLICATION_SERVICE: 'true',
			MNI_SCHEDULER_POLL_TRIGGERS_ENABLED: 'true',
			MNI_SCHEDULER_MATERIALIZATION_INTERVAL: '1',
			MNI_SCHEDULER_EXECUTOR_INTERVAL: '1',
		},
	},
} as const;
