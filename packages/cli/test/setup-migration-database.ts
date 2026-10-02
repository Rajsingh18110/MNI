/**
 * Vitest setup file for the Postgres migration tests. It gives each test file
 * its own empty database, so the files can run in parallel. Each file clears
 * and migrates its database, so files that share a database interfere.
 *
 * Do not import `@MNI/db` or `@MNI/backend-test-utils` here. Some test files
 * change the table prefix in `vi.hoisted`, before the migrations load.
 *
 * The container is removed after the run, so the databases are not dropped.
 */
import { GlobalConfig } from '@MNI/config';
import { Container } from '@MNI/di';
import { DataSource } from '@MNI/typeorm';
import { randomBytes } from 'node:crypto';

beforeAll(async () => {
	const { postgresdb } = Container.get(GlobalConfig).database;
	const name = `MNI_migration_${randomBytes(6).toString('hex')}`;
	const bootstrap = await new DataSource({
		type: 'postgres',
		host: postgresdb.host,
		port: postgresdb.port,
		username: postgresdb.user,
		password: postgresdb.password,
		database: postgresdb.database,
	}).initialize();
	try {
		await bootstrap.query(`CREATE DATABASE ${name}`);
	} finally {
		await bootstrap.destroy();
	}
	postgresdb.database = name;
});
