import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumb: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Article', articleSchema);
