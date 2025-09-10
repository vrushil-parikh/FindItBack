import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const postSchema = new mongoose.Schema({
  postId: { type: Number }, 

  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['electronics', 'clothing', 'accessories', 'documents', 'keys', 'bags', 'books', 'pets', 'other']
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  images: [{ 
    type: String 
  }],
  createdAt: { type: Date, default: Date.now }, 
  type: { type: String, enum: ['lost', 'found'], required: true },
  status: { type: String, enum: ['open', 'closed', 'resolved'], default: 'open' },
});

// Auto-increment postId starting from 1
postSchema.plugin(AutoIncrement, { inc_field: 'postId' });

export default mongoose.model('Post', postSchema);
