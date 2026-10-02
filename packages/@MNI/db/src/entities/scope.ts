import type { Scope as ScopeType } from '@MNI/permissions';
import { Column, Entity, PrimaryColumn } from '@MNI/typeorm';

@Entity({
	name: 'scope',
})
export class Scope {
	@PrimaryColumn({
		type: String,
		name: 'slug',
	})
	slug: ScopeType;

	@Column({
		type: String,
		nullable: true,
		name: 'displayName',
	})
	displayName: string | null;

	@Column({
		type: String,
		nullable: true,
		name: 'description',
	})
	description: string | null;
}
