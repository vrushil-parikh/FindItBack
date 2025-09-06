import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const postSchema = new mongoose.Schema({
  postId: { type: Number }, // handled by plugin
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // auto timestamp
  type: { type: String, enum: ['lost', 'found'], required: true },
  status: { type: String, enum: ['open', 'closed', 'resolved'], default: 'open' },
});

// Auto-increment postId starting from 1
postSchema.plugin(AutoIncrement, { inc_field: 'postId' });

export default mongoose.model('Post', postSchema);
