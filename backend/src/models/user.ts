import mongoose, { Schema, Document, Types } from "mongoose";

export interface IJamReference {
  jam_id: Types.ObjectId;
  is_admin: boolean;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email?: string;
  created_at: Date;
  jams: IJamReference[];
}

const JamReferenceSchema = new Schema<IJamReference>({
  jam_id: { type: Schema.Types.ObjectId, ref: "Jam", required: true },
  is_admin: { type: Boolean, default: false },
}, { _id: false });

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String },
  created_at: { type: Date, default: Date.now },
  jams: [JamReferenceSchema],
});

export const User = mongoose.model<IUser>("User", UserSchema, "user-data");
