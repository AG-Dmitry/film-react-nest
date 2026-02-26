import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class Schedule {
  @Prop()
  id: string;

  @Prop()
  daytime: string;

  @Prop()
  hall: number;

  @Prop()
  rows: number;

  @Prop()
  seats: number;

  @Prop()
  price: number;

  @Prop([String])
  taken: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema({ collection: 'films', versionKey: false })
export class Film {
  @Prop()
  id: string;

  @Prop()
  rating: number;

  @Prop()
  director: string;

  @Prop([String])
  tags: string[];

  @Prop()
  title: string;

  @Prop()
  about: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  cover: string;

  @Prop([ScheduleSchema])
  schedule: Schedule[];
}

export type FilmDocument = HydratedDocument<Film>;

export const FilmSchema = SchemaFactory.createForClass(Film);
