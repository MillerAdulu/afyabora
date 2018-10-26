import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String },
  nationalId: { type: String },
  insuarance: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  weight: { type: Number },
  height: { type: Number },
});

export default mongoose.model('User', userSchema);
