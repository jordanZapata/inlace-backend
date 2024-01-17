import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert} from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    fullName: string;

    @Column()
    age: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }
}