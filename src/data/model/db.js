import mongoose from 'mongoose';
import config from './config';

mongoose.connect(`mongodb://localhost/${config}`, { useNewUrlParser: true, poolSize: 10 });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`we're connected!`);
});

export default mongoose;
