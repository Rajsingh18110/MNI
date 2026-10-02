import { User } from '@MNI/db';
import { Column, Entity, Index, ManyToOne } from '@MNI/typeorm';

import { OAuthClient } from './oauth-client.entity';

@Entity('oauth_access_tokens')
export class AccessToken {
	@Column({ type: 'varchar', primary: true })
	token: string;

	@ManyToOne(
		() => OAuthClient,
		(client) => client.accessTokens,
		{ onDelete: 'CASCADE' },
	)
	client: OAuthClient;

	@Index()
	@Column({ type: String })
	clientId: string;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	user: User;

	@Index()
	@Column({ type: String })
	userId: string;
}
