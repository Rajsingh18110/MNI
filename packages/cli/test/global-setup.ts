import { testDb } from '@MNI/backend-test-utils';
import { GlobalConfig } from '@MNI/config';
import { Container } from '@MNI/di';
import { DataSource as Connection } from '@MNI/typeorm';
import nock from 'nock';

export async function setup() {
	nock.disableNetConnect();
	nock.enableNetConnect('127.0.0.1');
}

export async function teardown() {
	const { type: dbType } = Container.get(GlobalConfig).database;
	if (dbType !== 'postgresdb') return;

	const connection = new Connection(testDb.getBootstrapDBOptions());
	await connection.initialize();

	const query = 'SELECT datname as "Database" FROM pg_database';
	const results: Array<{ Database: string }> = await connection.query(query);
	const databases = results
		.filter(({ Database: dbName }) => dbName.startsWith(testDb.testDbPrefix))
		.map(({ Database: dbName }) => dbName);

	const promises = databases.map(
		async (dbName) => await connection.query(`DROP DATABASE ${dbName};`),
	);
	await Promise.all(promises);
	await connection.destroy();
}
