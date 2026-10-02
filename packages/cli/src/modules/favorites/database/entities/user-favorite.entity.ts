import type { FavoriteResourceType } from '@MNI/api-types';
import { User } from '@MNI/db';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique } from '@MNI/typeorm';

@Entity('user_favorites')
@Unique(['userId', 'resourceId', 'resourceType'])
@Index(['userId'])
export class UserFavorite {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	user: User;

	@Column({ type: String })
	userId: string;

	@Column({ type: String })
	resourceId: string;

	@Column({ type: String })
	resourceType: FavoriteResourceType;
}
