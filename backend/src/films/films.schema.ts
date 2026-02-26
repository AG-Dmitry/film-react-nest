import * as mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema(
  {
    id: String,
    daytime: String,
    hall: Number,
    rows: Number,
    seats: Number,
    price: Number,
    taken: [String],
  },
  { _id: false },
);

export const FilmSchema = new mongoose.Schema(
  {
    id: String,
    rating: Number,
    director: String,
    tags: [String],
    title: String,
    about: String,
    description: String,
    image: String,
    cover: String,
    schedule: [ScheduleSchema],
  },
  { collection: 'films', versionKey: false },
);
