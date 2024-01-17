import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ default: 0 })
    likes: number;

    @Column({ nullable: true })
    image: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}