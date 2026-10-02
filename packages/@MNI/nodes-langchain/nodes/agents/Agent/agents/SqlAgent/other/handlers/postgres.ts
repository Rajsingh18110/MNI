import { DataSource } from '@MNI/typeorm';
import type { PostgresNodeCredentials } from 'MNI-nodes-base/dist/nodes/Postgres/v2/helpers/interfaces';
import { type IExecuteFunctions } from 'MNI-workflow';
import type { TlsOptions } from 'tls';

export async function getPostgresDataSource(this: IExecuteFunctions): Promise<DataSource> {
	const credentials = await this.getCredentials<PostgresNodeCredentials>('postgres');

	let ssl: TlsOptions | boolean = !['disable', undefined].includes(credentials.ssl);
	if (credentials.allowUnauthorizedCerts && ssl) {
		ssl = { rejectUnauthorized: false };
	}

	return new DataSource({
		type: 'postgres',
		host: credentials.host,
		port: credentials.port,
		username: credentials.user,
		password: credentials.password,
		database: credentials.database,
		ssl,
	});
}
