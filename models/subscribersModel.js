import mongoose from 'mongoose';
const { Schema } = mongoose;

const subscribersSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /\S+@\S+\.\S+/,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['subscribed', 'unsubscribed'],
      default: 'subscribed',
    },
    unsubscribeToken: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Subscriber', subscribersSchema);