import mongoose from './db';

const { Schema } = mongoose;

const wordSchema = new Schema({
  name: String,
  complete: Boolean,
  desc: String,
  created_at: Date,
  updated_at: Date,
});

export default mongoose.model('Word', wordSchema);
