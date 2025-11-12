import { Chip } from "@heroui/react";
import type { Problem as PlanProblemType } from "../../types/plan.types";

const difficultyMap: { [key: string]: {text: string, color: any} } = {
    "easy": { text: "EASY", color: "success" },
    "medium": { text: "MEDIUM", color: "warning" },
    "hard": { text: "HARD", color: "danger" },
};

export default function PlanProblem({ problem, hideTags }: { problem: PlanProblemType, hideTags: boolean }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg hover:bg-default-100/50">
            <div className="w-full">
                <a href={problem.url} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{problem.name}</p>
                    </div>
                    {!hideTags && (
                        <div className="gap-2 mt-1">
                            {problem.tags.map(tag => (
                                <Chip className="mr-1" key={tag} variant="flat" color="default">{tag}</Chip> 
                            ))}
                        </div>
                    )}
                </a>
            </div>
            
            <div className="flex items-center gap-4">
                <Chip color={difficultyMap[problem.difficulty.toLowerCase()]?.color || "default"}>
                    {difficultyMap[problem.difficulty.toLowerCase()]?.text || problem.difficulty}
                </Chip>
            </div>
        </div>
    );
}

