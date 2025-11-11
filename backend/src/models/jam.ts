import mongoose, { Schema, Document, Types } from "mongoose";

interface ISolvedBy {
  user_id: Types.ObjectId;
  solved_at: Date;
}

interface IProblem {
  slug: string;
  name: string;
  difficulty: string;
  url: string;
  tags: string[];
  solved_by: ISolvedBy[];
}

interface ISection {
  topic: string;
  problems: IProblem[];
}

export interface IJam extends Document {
  plan_id: Types.ObjectId;
  name: string;
  prob_goal_per_day: number;
  start_date: Date;
  end_date: Date;
  status: string;
  live_call?: boolean;
  live_call_url?: string;
  sections: ISection[];
}

const SolvedBySchema = new Schema<ISolvedBy>({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  solved_at: { type: Date, default: Date.now },
});

const ProblemSchema = new Schema<IProblem>({
  slug: String,
  name: String,
  difficulty: String,
  url: String,
  tags: [String],
  solved_by: [SolvedBySchema],
});

const SectionSchema = new Schema<ISection>({
  topic: String,
  problems: [ProblemSchema],
});

const JamSchema = new Schema<IJam>({
  plan_id: { type: Schema.Types.ObjectId, ref: "StudyPlan" },
  name: { type: String, required: true },
  prob_goal_per_day: { type: Number },
  start_date: { type: Date },
  end_date: { type: Date },
  status: { type: String },
  live_call: { type: Boolean, default: false },
  live_call_url: { type: String },
  sections: [SectionSchema],
});

export const Jam = mongoose.model<IJam>("Jam", JamSchema, "jams");
