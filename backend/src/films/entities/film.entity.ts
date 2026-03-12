import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleEntity } from 'src/films/entities/schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'real' })
  rating: number;

  @Column({ type: 'varchar' })
  director: string;

  @Column('text', { array: true })
  tags: string[];

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  about: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'varchar' })
  cover: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film, {
    cascade: true,
  })
  schedule: ScheduleEntity[];
}
