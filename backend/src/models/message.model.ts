import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text?: string;
  image?: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
