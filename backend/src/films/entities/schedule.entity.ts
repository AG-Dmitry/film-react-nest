import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { FilmEntity } from 'src/films/entities/film.entity';

@Entity('schedules')
@Unique('UQ_schedule_film_hall_daytime', ['filmId', 'hall', 'daytime'])
export class ScheduleEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', name: 'film_id' })
  filmId: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'film_id', referencedColumnName: 'id' })
  film: FilmEntity;

  @Column({ type: 'timestamptz' })
  daytime: Date;

  @Column({ type: 'integer' })
  hall: number;

  @Column({ type: 'integer' })
  rows: number;

  @Column({ type: 'integer' })
  seats: number;

  @Column({ type: 'integer' })
  price: number;

  @Column('text', { array: true, default: '{}' })
  taken: string[];
}
