import { WithTimestampsAndStringId } from '@MNI/db';
import type { CredentialResolverConfiguration } from '@MNI/decorators';
import { Column, Entity } from '@MNI/typeorm';

@Entity()
export class DynamicCredentialResolver extends WithTimestampsAndStringId {
	@Column({ type: 'varchar', length: 128 })
	name: string;

	@Column({ type: 'varchar', length: 128 })
	type: string;

	@Column({ type: 'text' })
	config: string;

	/** Decrypted config, not persisted to the database */
	decryptedConfig?: CredentialResolverConfiguration;
}
