import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: Types.ObjectId;
  relatedModel?: string;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedEntityId: { type: Schema.Types.ObjectId },
    relatedModel: { type: String },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
