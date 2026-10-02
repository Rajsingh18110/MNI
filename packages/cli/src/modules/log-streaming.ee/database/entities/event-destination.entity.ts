import { JsonColumn, WithTimestamps } from '@MNI/db';
import { Entity, PrimaryColumn } from '@MNI/typeorm';
import { MessageEventBusDestinationOptions } from 'MNI-workflow';

@Entity({ name: 'event_destinations' })
export class EventDestinations extends WithTimestamps {
	@PrimaryColumn('uuid')
	id: string;

	@JsonColumn()
	destination: MessageEventBusDestinationOptions;
}
