import { Divider } from "@heroui/react";
import type { ProblemGroup } from "../../types/plan.types";
import PlanProblem from "../PlanProblem/PlanProblem";

export default function PlanSection({ section, index, hideTags, hideSection }: { section: ProblemGroup, index: number, hideTags: boolean, hideSection: boolean }) {
    return (
        <div className="mb-8 pl-2 pr-2 pt-2 mt-4 bg-default-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
                {hideSection ? `Section ${index + 1}` : section.name}
            </h2>
            <div className="flex flex-col gap-2">
                {section.problems.map((problem) => (
                    <div key={problem._id}>
                        <PlanProblem problem={problem} hideTags={hideTags} />
                        <Divider />
                    </div>
                ))}
            </div>
        </div>
    );
}

