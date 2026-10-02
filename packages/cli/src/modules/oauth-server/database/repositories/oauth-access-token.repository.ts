import { BaseRepository, TransactionRunner, type OperationContext } from '@MNI/db';
import { Service } from '@MNI/di';
import { DataSource } from '@MNI/typeorm';

import { AccessToken } from '../entities/oauth-access-token.entity';

type NewAccessToken = {
	token: string;
	clientId: string;
	userId: string;
};

@Service()
export class AccessTokenRepository extends BaseRepository<AccessToken> {
	constructor(dataSource: DataSource, transactionRunner: TransactionRunner) {
		super(AccessToken, dataSource.manager, transactionRunner);
	}

	async insertToken(token: NewAccessToken, ctx: OperationContext): Promise<void> {
		await this.managerFor(ctx).insert(AccessToken, token);
	}
}
