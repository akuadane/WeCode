import mongoose, { Schema, Document } from "mongoose";

interface ISubProblem {
  slug: string;
  name: string;
  difficulty: string;
  url: string;
  tags: string[];
}

interface IProblemGroup {
  name: string;
  size: number;
  problems: ISubProblem[];
}

export interface IStudyPlan extends Document {
  slug: string;
  name: string;
  source: string;
  source_link: string;
  problems: IProblemGroup[];
}

const SubProblemSchema = new Schema<ISubProblem>({
  slug: String,
  name: String,
  difficulty: String,
  url: String,
  tags: [String],
});

const ProblemGroupSchema = new Schema<IProblemGroup>({
  name: String,
  size: Number,
  problems: [SubProblemSchema],
});

const StudyPlanSchema = new Schema<IStudyPlan>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  source: String,
  source_link: String,
  problems: [ProblemGroupSchema],
});

export const StudyPlan = mongoose.model<IStudyPlan>("StudyPlan", StudyPlanSchema);
