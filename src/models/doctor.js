import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  surname: { type: String },
  email: { type: String },
  nationalId: { type: String, unique: true },
});

export default mongoose.model('Doctor', doctorSchema);
