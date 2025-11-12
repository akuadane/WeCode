import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  created_at: Date;
  jams: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  jams: [{ type: Schema.Types.ObjectId, ref: "Jam" }],
});

export const User = mongoose.model<IUser>("User", UserSchema, "user-data");
