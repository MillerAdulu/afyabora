import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  diagnosis: { type: String, required: true },
  symptoms: { type: String, required: true },
  dosage: { type: String, required: true },
  center: { type: String, required: true },
  date: { type: Date, required: true },
  doctorNationalId: { type: String, required: true },
  confirmed: { type: Boolean, required: true },
});

export default mongoose.model('Diagnosis', diagnosisSchema);
